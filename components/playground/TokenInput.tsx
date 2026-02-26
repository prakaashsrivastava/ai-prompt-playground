"use client";

interface TokenInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TokenInput({ value, onChange }: TokenInputProps) {
  const presets = [256, 512, 1024, 2048];

  return (
    <div className="w-full flex flex-col gap-2">
      <label
        htmlFor="max-tokens-input"
        className="text-sm font-medium text-gray-200"
      >
        Max Tokens
      </label>

      <input
        id="max-tokens-input"
        type="number"
        min="1"
        max="8192"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 1)}
        className="w-full py-2 px-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
      />

      <div className="flex flex-row gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md border transition-colors ${
              value === preset
                ? "bg-purple-500/20 text-purple-400 border-purple-500/50"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-gray-300"
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Controls the maximum length of the response
      </p>
    </div>
  );
}
