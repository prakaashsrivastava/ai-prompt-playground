import Groq from "groq-sdk";
import OpenAI from "openai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      systemPrompt,
      model = "llama-3.3-70b-versatile",
      temperature = 0.7,
      maxTokens = 1024,
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isOpenAI = model.startsWith("gpt-");

    if (isOpenAI && !process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!isOpenAI && !process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (
      systemPrompt &&
      typeof systemPrompt === "string" &&
      systemPrompt.trim() !== ""
    ) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const openAiMessages = messages as OpenAI.Chat.ChatCompletionMessageParam[];
    const groqMessages = messages as Groq.Chat.ChatCompletionMessageParam[];

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const startStreaming = async () => {
      try {
        if (isOpenAI) {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const responseStream = await openai.chat.completions.create({
            model,
            messages: openAiMessages,
            temperature,
            max_tokens: maxTokens,
            stream: true,
            stream_options: { include_usage: true },
          });

          let usage: OpenAI.Completions.CompletionUsage | undefined = undefined;

          for await (const chunk of responseStream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
              );
            }
            if (chunk.usage) {
              usage = chunk.usage;
            }
          }

          const clientUsage = usage
            ? {
                promptTokens: usage.prompt_tokens,
                completionTokens: usage.completion_tokens,
                totalTokens: usage.total_tokens,
              }
            : undefined;

          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, usage: clientUsage })}\n\n`,
            ),
          );
        } else {
          const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
          // @ts-expect-error - Usage streaming is supported by Groq but might not be fully typed in the SDK yet
          const responseStream = await groq.chat.completions.create({
            model,
            messages: groqMessages,
            temperature,
            max_tokens: maxTokens,
            stream: true,
            stream_options: { include_usage: true },
          });

          let usage: OpenAI.Completions.CompletionUsage | undefined = undefined;

          for await (const chunk of responseStream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
              );
            }
            // Groq attaches x_groq to the final chunk
            const xGroq = (chunk as unknown as Record<string, unknown>)
              .x_groq as
              | { usage?: OpenAI.Completions.CompletionUsage }
              | undefined;
            if (xGroq?.usage) {
              usage = xGroq.usage;
            }
          }

          const clientUsage = usage
            ? {
                promptTokens: usage.prompt_tokens,
                completionTokens: usage.completion_tokens,
                totalTokens: usage.total_tokens,
              }
            : undefined;

          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, usage: clientUsage })}\n\n`,
            ),
          );
        }
      } catch (streamError: unknown) {
        console.error("Streaming error:", streamError);
        const errorMessage =
          streamError instanceof Error
            ? streamError.message
            : "Stream processing failed";
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ error: errorMessage })}\n\n`,
          ),
        );
      } finally {
        await writer.close();
      }
    };

    // Start streaming asynchronously
    startStreaming();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("API route error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
