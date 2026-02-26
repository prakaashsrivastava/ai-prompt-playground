'use client';

import usePlayground from '../hooks/usePlayground';
import ConfigPanel from '../components/playground/ConfigPanel';
import PromptInput from '../components/playground/PromptInput';
import StatsBar from '../components/playground/StatsBar';
import ResponsePanel from '../components/playground/ResponsePanel';
import { getModelById } from '../lib/models';
import { cn } from '../lib/utils';

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
    handleSubmit,
    handleStop,
  } = usePlayground();

  const currentModel = getModelById(selectedModel);

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex flex-row items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#161622]">
        <div className="font-bold text-lg tracking-wide">
          🧪 AI Prompt Playground
        </div>
        {currentModel && (
          <div
            className={cn(
              "text-xs px-2.5 py-1 rounded-full font-semibold border",
              currentModel.provider === "groq"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            )}
          >
            {currentModel.name}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-row flex-1 overflow-hidden">

        {/* Left Panel (Config) */}
        <div className="w-80 border-r border-gray-800 overflow-y-auto p-4 flex-shrink-0 bg-[#0f0f1a]">
          <ConfigPanel
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            temperature={temperature}
            onTemperatureChange={setTemperature}
            maxTokens={maxTokens}
            onMaxTokensChange={setMaxTokens}
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
          />
        </div>

        {/* Right Panel (Playground) */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4 bg-gray-950">
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

          <div className="flex-1 overflow-hidden min-h-0">
            <ResponsePanel
              response={response}
              isStreaming={isStreaming}
              isLoading={isLoading}
              error={error}
            />
          </div>

          <div className="text-xs text-gray-600 py-1 text-center font-medium mt-auto flex-shrink-0">
            Powered by Groq & OpenAI • Built with Next.js
          </div>
        </div>
      </div>
    </div>
  );
}
