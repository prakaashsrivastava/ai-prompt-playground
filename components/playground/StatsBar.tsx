'use client';

import { getModelById } from '../../lib/models';
import { formatMs, estimateCost } from '../../lib/utils';

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

interface StatsBarProps {
  tokenUsage: TokenUsage | null;
  responseTimeMs: number | null;
  selectedModel: string;
}

export default function StatsBar({
  tokenUsage,
  responseTimeMs,
  selectedModel
}: StatsBarProps) {
  if (!tokenUsage) return null;

  const model = getModelById(selectedModel);
  const costStr = model && (model.provider === 'openai' || model.provider === 'groq')
    ? estimateCost(
      model.provider as 'openai' | 'groq',
      selectedModel,
      tokenUsage.promptTokens,
      tokenUsage.completionTokens
    )
    : 'N/A';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg py-2 px-4 flex flex-wrap gap-4 items-center">
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Prompt Tokens</span>
        <span className="text-sm font-semibold text-white">{tokenUsage.promptTokens}</span>
      </div>

      <div className="w-px h-8 bg-gray-600"></div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Completion Tokens</span>
        <span className="text-sm font-semibold text-white">{tokenUsage.completionTokens}</span>
      </div>

      <div className="w-px h-8 bg-gray-600"></div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Total Tokens</span>
        <span className="text-sm font-semibold text-white">{tokenUsage.totalTokens}</span>
      </div>

      <div className="w-px h-8 bg-gray-600"></div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Response Time</span>
        <span className="text-sm font-semibold text-white">
          {responseTimeMs !== null ? formatMs(responseTimeMs) : '—'}
        </span>
      </div>

      <div className="w-px h-8 bg-gray-600"></div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Est. Cost</span>
        <span className="text-sm font-semibold text-white">{costStr}</span>
      </div>
    </div>
  );
}
