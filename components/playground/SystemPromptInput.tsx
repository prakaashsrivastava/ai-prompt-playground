'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SystemPromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SystemPromptInput({ value, onChange }: SystemPromptInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    {
      label: '🧑‍💻 Code Expert',
      prompt: 'You are an expert software engineer. Provide clean, efficient, and well-commented code with explanations.'
    },
    {
      label: '✍️ Creative Writer',
      prompt: 'You are a creative writing assistant. Be imaginative, use vivid language, and help craft engaging stories.'
    },
    {
      label: '📊 Data Analyst',
      prompt: 'You are a data analysis expert. Provide structured insights, use bullet points, and be precise with numbers.'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        className="flex items-center justify-between cursor-pointer py-1 select-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-200">System Prompt</span>
          <span className="text-xs text-gray-500">(optional)</span>
        </div>
        <div className="text-gray-400">
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
      >
        <div className="overflow-hidden flex flex-col gap-3">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            placeholder="You are a helpful assistant. Define the AI's personality, role, and constraints here..."
            className="w-full bg-gray-800 text-sm text-white border border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y mt-1"
          />

          <div className="flex flex-wrap gap-2 pb-1">
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onChange(preset.prompt)}
                className="text-xs font-medium py-1.5 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-full transition-colors whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
