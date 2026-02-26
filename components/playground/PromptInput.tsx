'use client';

import { Loader2 } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  disabled
}: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="w-full flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your prompt here... (Ctrl+Enter to send)"
        rows={5}
        disabled={isLoading || disabled}
        className="w-full bg-[#1e1e2e] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <div className="flex justify-between items-center text-xs text-gray-500 px-1">
        <div>
          {wordCount} {wordCount === 1 ? 'word' : 'words'} &bull; {charCount} {charCount === 1 ? 'char' : 'chars'}
        </div>
        <div>
          Ctrl + Enter to send
        </div>
      </div>

      <div className="flex justify-between items-center mt-1">
        <button
          type="button"
          onClick={() => onChange('')}
          disabled={isLoading || disabled}
          className="text-xs font-medium px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!value.trim() || disabled}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Prompt &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
