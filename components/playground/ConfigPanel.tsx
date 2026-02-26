'use client';

import ModelSelector from './ModelSelector';
import TemperatureSlider from './TemperatureSlider';
import TokenInput from './TokenInput';
import SystemPromptInput from './SystemPromptInput';

interface ConfigPanelProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  temperature: number;
  onTemperatureChange: (value: number) => void;
  maxTokens: number;
  onMaxTokensChange: (value: number) => void;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
}

export default function ConfigPanel({
  selectedModel,
  onModelChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  systemPrompt,
  onSystemPromptChange
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
        />
      </div>

      <hr className="border-t border-gray-700" />

      <div className="py-4">
        <TemperatureSlider
          value={temperature}
          onChange={onTemperatureChange}
        />
      </div>

      <hr className="border-t border-gray-700" />

      <div className="py-4">
        <TokenInput
          value={maxTokens}
          onChange={onMaxTokensChange}
        />
      </div>

      <hr className="border-t border-gray-700" />

      <div className="py-4">
        <SystemPromptInput
          value={systemPrompt}
          onChange={onSystemPromptChange}
        />
      </div>
    </div>
  );
}
