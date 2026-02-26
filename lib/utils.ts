export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function estimateCost(
  provider: "groq" | "openai",
  modelId: string,
  promptTokens: number,
  completionTokens: number,
): string {
  // Approximate costs per 1M tokens (as of early 2025)
  const pricing: Record<string, { input: number; output: number }> = {
    "gpt-4o": { input: 5.0, output: 15.0 },
    "gpt-4o-mini": { input: 0.15, output: 0.6 },
    "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
  };

  if (provider === "groq") return "Free tier";

  const p = pricing[modelId];
  if (!p) return "N/A";

  const cost =
    (promptTokens / 1_000_000) * p.input +
    (completionTokens / 1_000_000) * p.output;
  return `~$${cost.toFixed(6)}`;
}
