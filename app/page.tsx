"use client";

import usePlayground from "../hooks/usePlayground";
import ConfigPanel from "../components/playground/ConfigPanel";
import PromptInput from "../components/playground/PromptInput";
import StatsBar from "../components/playground/StatsBar";
import ResponsePanel from "../components/playground/ResponsePanel";
import { MODELS, getModelById } from "../lib/models";
import { cn } from "../lib/utils";
import { Columns } from "lucide-react";

export default function Home() {
  const {
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
    handleSubmit,
    handleStop,
    clearHistory,

    compareMode,
    setCompareMode,
    compareModel,
    setCompareModel,
    compareResponse,
    compareIsStreaming,
    compareError,
  } = usePlayground();

  const currentModel = getModelById(selectedModel);

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex flex-row items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#161622]">
        <div className="font-bold text-lg tracking-wide">
          🧪 AI Prompt Playground
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setCompareMode(!compareMode)}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors",
              compareMode
                ? "bg-purple-500 text-white border-purple-500"
                : "bg-transparent text-gray-400 border-gray-700 hover:text-white hover:border-gray-500",
              isLoading ? "opacity-50 cursor-not-allowed" : "",
            )}
          >
            <Columns className="w-3.5 h-3.5" />
            Compare Models
          </button>
          {currentModel && !compareMode && (
            <div
              className={cn(
                "text-xs px-2.5 py-1 rounded-full font-semibold border",
                currentModel.provider === "groq"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20",
              )}
            >
              {currentModel.name}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Left Panel (Config) */}
        <div className="w-96 border-r border-gray-800 overflow-y-auto p-4 flex-shrink-0 bg-[#0f0f1a]">
          <ConfigPanel
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            temperature={temperature}
            onTemperatureChange={setTemperature}
            maxTokens={maxTokens}
            onMaxTokensChange={setMaxTokens}
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
            promptHistory={promptHistory}
            onPromptSelect={setPrompt}
            onClearHistory={clearHistory}
            disabled={isLoading}
          />
        </div>

        {/* Right Panel (Playground) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4 gap-4 bg-gray-950">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleSubmit}
            onStop={handleStop}
            isLoading={isLoading}
          />

          <StatsBar
            tokenUsage={tokenUsage}
            responseTimeMs={responseTimeMs}
            selectedModel={selectedModel}
          />

          <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
            {/* Main Response */}
            <div className="flex-1 flex flex-col min-w-0">
              {compareMode && (
                <div className="text-sm font-semibold text-gray-400 mb-2 truncate px-1">
                  {currentModel?.name || "Model A"}
                </div>
              )}
              <ResponsePanel
                title={compareMode ? "Model A" : undefined}
                response={response}
                isStreaming={isStreaming}
                isLoading={isLoading}
                error={error}
              />
            </div>

            {/* Compare Response */}
            {compareMode && (
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-400 whitespace-nowrap">
                    vs
                  </span>
                  <select
                    value={compareModel}
                    onChange={(e) => setCompareModel(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-[#1e1e2e] text-white border border-[#3d3d5c] rounded-md py-1 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <ResponsePanel
                  title="Model B"
                  response={compareResponse}
                  isStreaming={compareIsStreaming}
                  isLoading={isLoading && !compareResponse && !compareError}
                  error={compareError}
                />
              </div>
            )}
          </div>

          <div className="text-xs text-gray-600 py-1 text-center font-medium mt-auto flex-shrink-0">
            Powered by Groq & OpenAI • Built with Next.js
          </div>
        </div>
      </div>
    </div>
  );
}
