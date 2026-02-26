"use client";

import ModelSelector from "./ModelSelector";
import TemperatureSlider from "./TemperatureSlider";
import TokenInput from "./TokenInput";
import SystemPromptInput from "./SystemPromptInput";
import PromptHistory from "./PromptHistory";

interface ConfigPanelProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  temperature: number;
  onTemperatureChange: (value: number) => void;
  maxTokens: number;
  onMaxTokensChange: (value: number) => void;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  promptHistory: string[];
  onPromptSelect: (p: string) => void;
  onClearHistory: () => void;
  disabled?: boolean;
}

export default function ConfigPanel({
  selectedModel,
  onModelChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  systemPrompt,
  onSystemPromptChange,
  promptHistory,
  onPromptSelect,
  onClearHistory,
  disabled = false,
}: ConfigPanelProps) {
  return (
    <div className="h-full overflow-y-auto space-y-0">
      <div className="py-4 px-2 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Configuration
        </h2>
      </div>

      <div className="py-4">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          disabled={disabled}
        />
      </div>

      <hr className="border-t border-gray-700" />

      <div className="py-4">
        <TemperatureSlider
          value={temperature}
          onChange={onTemperatureChange}
          disabled={disabled}
        />
      </div>

      <hr className="border-t border-gray-700" />

      <div className="py-4">
        <TokenInput
          value={maxTokens}
          onChange={onMaxTokensChange}
          disabled={disabled}
        />
      </div>

      <hr className="border-t border-gray-700" />

      <div className="py-4">
        <SystemPromptInput
          value={systemPrompt}
          onChange={onSystemPromptChange}
          disabled={disabled}
        />
      </div>

      <hr className="border-t border-gray-700" />

      <div className="py-4">
        <PromptHistory
          history={promptHistory}
          onSelect={onPromptSelect}
          onClear={onClearHistory}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
