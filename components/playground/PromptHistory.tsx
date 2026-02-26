"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, History, Trash2 } from "lucide-react";

interface PromptHistoryProps {
  history: string[];
  onSelect: (prompt: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export default function PromptHistory({
  history,
  onSelect,
  onClear,
  disabled,
}: PromptHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        className="flex items-center justify-between cursor-pointer py-1 select-none"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-200">
            Recent Prompts
          </span>
          <span className="text-xs text-gray-500 text-center flex items-center justify-center bg-gray-800 rounded-full w-5 h-5">
            {history.length}
          </span>
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
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden flex flex-col gap-2">
          <div className="max-h-60 overflow-y-auto pr-1 space-y-1.5 mt-1 custom-scrollbar">
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => !disabled && onSelect(item)}
                className={`text-xs p-2.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-md transition-colors cursor-pointer break-words ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {item.length > 80 ? item.substring(0, 80) + "..." : item}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClear}
              disabled={disabled}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3 h-3" />
              Clear history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
