"use client";

import React from "react";
import { MODELS, getModelById } from "../../lib/models";
import { cn } from "../../lib/utils";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const currentModel = getModelById(selectedModel);

  const groqModels = MODELS.filter((m) => m.provider === "groq");
  const openAiModels = MODELS.filter((m) => m.provider === "openai");

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-200">Model</label>
        {currentModel && (
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium tracking-wide",
              currentModel.provider === "groq"
                ? "bg-green-500/20 text-green-400"
                : "bg-blue-500/20 text-blue-400",
            )}
          >
            {currentModel.provider === "groq" ? "Groq" : "OpenAI"}
          </span>
        )}
      </div>

      {currentModel && (
        <p className="text-xs text-gray-400">{currentModel.description}</p>
      )}

      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full bg-[#1e1e2e] text-white border border-[#3d3d5c] rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
      >
        <optgroup label="⚡ Groq Models">
          {groqModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} — {model.description}
            </option>
          ))}
        </optgroup>
        <optgroup label="🤖 OpenAI Models">
          {openAiModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} — {model.description}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
