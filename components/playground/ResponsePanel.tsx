"use client";

import { useState } from "react";
import { Copy, Terminal, AlertCircle, Check } from "lucide-react";

interface ResponsePanelProps {
  response: string;
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
}

export default function ResponsePanel({
  response,
  isStreaming,
  isLoading,
  error,
}: ResponsePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!response) return;

    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between py-1">
        <span className="font-bold text-gray-200">Response</span>
        <button
          onClick={handleCopy}
          disabled={!response || isStreaming}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 min-h-[300px] w-full bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-y-auto relative">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500 gap-3">
            <AlertCircle className="w-10 h-10" />
            <p className="text-sm font-medium text-center">{error}</p>
          </div>
        ) : !response && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
            <Terminal className="w-10 h-10 opacity-50" />
            <p className="text-sm font-medium">
              Your response will appear here...
            </p>
          </div>
        ) : !response && isLoading ? (
          <div className="flex flex-col gap-4 animate-pulse pt-2">
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          </div>
        ) : (
          <div className="h-full">
            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-200">
              {response}
              {isStreaming && (
                <span className="inline-block w-2.5 h-4 ml-0.5 align-middle bg-purple-500 animate-pulse" />
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
