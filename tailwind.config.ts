import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f1a",
        foreground: "var(--foreground)",
        surface: "#1e1e2e",
        border: "#3d3d5c",
        accent: "#7c3aed",
      },
    },
  },
  plugins: [],
};
export default config;
