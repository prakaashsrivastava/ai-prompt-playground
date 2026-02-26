# Project Context: AI Prompt Playground

## Overview
The **AI Prompt Playground** is a Next.js 14 web application designed to allow users to interact with, compare, and fine-tune various Large Language Models (LLMs) from different providers (primarily Groq and OpenAI). It serves as a testing bench for prompts, allowing users to adjust system prompts, temperatures, and models, while monitoring token usage and estimated costs.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: `lucide-react`
- **AI Integration SDKs**: `ai` (Vercel AI SDK), `groq-sdk`, `openai`
- **Package Manager**: `pnpm`

## Directory Structure

```text
/
├── app/                        # Next.js App Router root
│   ├── api/chat/route.ts       # Backend API route handling LLM generation and streaming streaming
│   ├── globals.css             # Global Tailwind imports
│   ├── layout.tsx              # Root application layout
│   └── page.tsx                # Main playground interface
├── components/                 # React Components
│   ├── playground/             # Feature-specific components for the playground
│   │   ├── ConfigPanel.tsx     # Wrapper for configuration controls
│   │   ├── ModelSelector.tsx   # Dropdown/selector for LLMs
│   │   ├── PromptInput.tsx     # Main user input text area
│   │   ├── ResponsePanel.tsx   # Display area for LLM outputs
│   │   ├── StatsBar.tsx        # Footer/Header bar displaying token usage and cost
│   │   ├── SystemPromptInput.tsx # Input for system-level instructions
│   │   ├── TemperatureSlider.tsx # Slider to adjust model randomness
│   │   └── TokenInput.tsx      # Input to define max tokens
│   └── ui/                     # Reusable, generic UI components
│       ├── Badge.tsx           
│       ├── Slider.tsx          
│       └── Spinner.tsx         
├── hooks/                      
│   └── usePlayground.ts        # Primary hook managing the playground state (messages, config, loading)
├── lib/                        # Utilities, constants, and types
│   ├── models.ts               # List of supported LLMs (MODELS array) and defaults
│   ├── types.ts                # Core TypeScript interfaces (ChatMessage, ModelOption, etc.)
│   └── utils.ts                # Helper functions (`cn`, `formatMs`, `estimateCost`)
├── .env.local                  # Environment variables (GROQ_API_KEY, OPENAI_API_KEY)
└── package.json                
```

## Core Modules & Data Structures

### 1. Types (`lib/types.ts`)
The application is strictly typed. Key interfaces include:
- `ChatMessage`: Represents a message in the conversation thread (`role`, `content`).
- `ModelOption`: Defines an LLM (`id`, `name`, `provider`, `contextWindow`, `description`).
- `PlaygroundConfig`: Holds the current user settings (`model`, `temperature`, `maxTokens`, `systemPrompt`).
- `TokenUsage` & `ChatResponse`: Define the structure of the API response metadata.

### 2. Available Models (`lib/models.ts`)
The app currently supports the following models, logically separated by provider:
**Groq (Fast open-source inferences):**
- LLaMA 3.3 70B (`llama-3.3-70b-versatile`)
- LLaMA 3.1 8B Instant (`llama-3.1-8b-instant`)
- Mixtral 8x7B (`mixtral-8x7b-32768`)
- Gemma 2 9B (`gemma2-9b-it`)

**OpenAI:**
- GPT-3.5 Turbo (`gpt-3.5-turbo`)
- GPT-4o Mini (`gpt-4o-mini`)
- GPT-4o (`gpt-4o`)

### 3. API Architecture (`app/api/chat/route.ts`)
- **Purpose**: To act as a secure proxy between the client and the respective AI providers (Groq/OpenAI).
- **Functionality**: It will receive the `PlaygroundConfig` and the array of `ChatMessage` from the client, route the request to the correct provider utilizing the respective SDKs, and return the generated text along with latency and token usage statistics.

### 4. Client State (`hooks/usePlayground.ts`)
- **Purpose**: Centralizes the state management for the entire application.
- **Responsibilities**: 
  - Manage the array of `ChatMessage` history.
  - Manage the `PlaygroundConfig` (current model, temp, tokens).
  - Handle the asynchronous submission of prompts to `/api/chat`.
  - Track loading states (e.g., `isGenerating`).
  - Compute total token usage and costs utilizing helpers from `lib/utils.ts`.

## How to Proceed with Implementation
When tasked to implement features:
1. **API**: Start by implementing the logic in `app/api/chat/route.ts` to ensure backend compatibility.
2. **State**: Implement the core application logic and state inside `hooks/usePlayground.ts`.
3. **UI Building**: Fleshed out the individual components in `components/playground/` utilizing the reusable pieces from `components/ui/`.
4. **Integration**: Wire the custom hook into `app/page.tsx` and pass the necessary props down to the playground components.
