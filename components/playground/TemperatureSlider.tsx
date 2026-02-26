"use client";

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TemperatureSlider({
  value,
  onChange,
}: TemperatureSliderProps) {
  // Determine badge color
  let badgeColor = "bg-red-500/20 text-red-500 border-red-500/30";
  if (value <= 0.4) {
    badgeColor = "bg-green-500/20 text-green-500 border-green-500/30";
  } else if (value <= 0.9) {
    badgeColor = "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
  }

  // Determine explanation text
  let explanation = "Experimental — responses may be unpredictable";
  if (value <= 0.3) {
    explanation = "Deterministic — best for code and facts";
  } else if (value <= 0.7) {
    explanation = "Balanced — good for most tasks";
  } else if (value <= 1.2) {
    explanation = "Creative — good for writing and brainstorming";
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="temperature-slider"
          className="text-sm font-medium text-gray-200"
        >
          Temperature
        </label>
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeColor}`}
        >
          {value.toFixed(1)}
        </span>
      </div>

      <input
        id="temperature-slider"
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />

      <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
        <span>Precise</span>
        <span>Balanced</span>
        <span>Creative</span>
      </div>

      <p className="text-xs text-gray-500">{explanation}</p>
    </div>
  );
}
