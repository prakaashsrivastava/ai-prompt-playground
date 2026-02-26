"use client";

import { useState, useRef, useEffect } from "react";
import { TokenUsage } from "../lib/types";

export default function usePlayground() {
  const [prompt, setPrompt] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>(
    "llama-3.3-70b-versatile",
  );
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(1024);

  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  // Compare mode state
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareModel, setCompareModel] = useState<string>("gpt-3.5-turbo");
  const [compareResponse, setCompareResponse] = useState<string>("");
  const [compareIsStreaming, setCompareIsStreaming] = useState<boolean>(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("prompt_history");
    if (saved) {
      try {
        setPromptHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse prompt history", e);
      }
    }
  }, []);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim() || isLoading) return;

    setResponse("");
    setError(null);
    setTokenUsage(null);
    setResponseTimeMs(null);
    setIsLoading(true);
    setIsStreaming(true);

    if (compareMode) {
      setCompareResponse("");
      setCompareError(null);
      setCompareIsStreaming(true);
    }

    const startTime = Date.now();

    setPromptHistory((prev) => {
      const newHistory = [prompt, ...prev.filter((p) => p !== prompt)].slice(
        0,
        10,
      );
      localStorage.setItem("prompt_history", JSON.stringify(newHistory));
      return newHistory;
    });

    abortControllerRef.current = new AbortController();

    const fetchStream = async (
      modelToUse: string,
      onChunk: (content: string) => void,
      onError: (err: string) => void,
      onDone: (usage?: TokenUsage) => void,
    ) => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current?.signal,
          body: JSON.stringify({
            prompt,
            systemPrompt,
            model: modelToUse,
            temperature,
            maxTokens,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          onError(errorData.error || `HTTP error ${res.status}`);
          return;
        }

        if (!res.body) {
          throw new Error("ReadableStream not supported in this browser.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let buffer = "";

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split("\n\n");
            buffer = parts.pop() || "";

            for (const part of parts) {
              const lines = part.split("\n");
              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const dataString = line.slice(6);

                  try {
                    const parsed = JSON.parse(dataString);

                    if (parsed.content) {
                      onChunk(parsed.content);
                    }

                    if (parsed.error) {
                      onError(parsed.error);
                      done = true;
                      break;
                    }

                    if (parsed.done) {
                      onDone(parsed.usage);
                      done = true;
                    }
                  } catch (e) {
                    console.warn("Failed to parse SSE line:", line, e);
                  }
                }
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          // User intentionally cancelled
        } else {
          console.error(`Fetch error for model ${modelToUse}:`, err);
          onError(err.message || "An unexpected error occurred");
        }
      }
    };

    try {
      if (compareMode) {
        await Promise.all([
          fetchStream(
            selectedModel,
            (content) => setResponse((prev) => prev + content),
            (err) => {
              setError(err);
              setIsStreaming(false);
            },
            (usage) => {
              if (usage) setTokenUsage(usage);
              setIsStreaming(false);
            },
          ),
          fetchStream(
            compareModel,
            (content) => setCompareResponse((prev) => prev + content),
            (err) => {
              setCompareError(err);
              setCompareIsStreaming(false);
            },
            () => {
              setCompareIsStreaming(false);
            },
          ),
        ]);
        setResponseTimeMs(Date.now() - startTime);
      } else {
        await fetchStream(
          selectedModel,
          (content) => setResponse((prev) => prev + content),
          (err) => setError(err),
          (usage) => {
            if (usage) setTokenUsage(usage);
            setResponseTimeMs(Date.now() - startTime);
          },
        );
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      if (compareMode) {
        setCompareIsStreaming(false);
      }
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setIsStreaming(false);
      setCompareIsStreaming(false);
    }
  };

  const handleClear = () => {
    setResponse("");
    setError(null);
    setTokenUsage(null);
    setResponseTimeMs(null);
    setCompareResponse("");
    setCompareError(null);
  };

  const clearHistory = () => {
    setPromptHistory([]);
    localStorage.removeItem("prompt_history");
  };

  return {
    prompt,
    setPrompt,
    systemPrompt,
    setSystemPrompt,
    selectedModel,
    setSelectedModel,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    response,
    isLoading,
    error,
    tokenUsage,
    responseTimeMs,
    isStreaming,
    promptHistory,
    // Compare mode specific generic states
    compareMode,
    setCompareMode,
    compareModel,
    setCompareModel,
    compareResponse,
    compareIsStreaming,
    compareError,

    handleSubmit,
    handleStop,
    handleClear,
    clearHistory,
  };
}
