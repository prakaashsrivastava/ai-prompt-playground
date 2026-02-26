# AI Agent Prompt Execution Guidelines

This document outlines the operational guidelines for any AI agent executing prompts within the AI Prompt Playground project. It serves as the authoritative source for how to interpret user requests, modify the codebase, and manage the project workflow.

## 1. Context & Scope Verification

Before executing any code changes or file modifications, you MUST:

- **Verify Directory Context**: Ensure you are operating within the `D:\project\ai-prompt-playground` directory.
- **Consult `AGENT_RULES.md`**: Review the strict project constraints regarding package managers (`pnpm` only), frameworks (Next.js 14 App Router), and styling (Tailwind CSS).
- **Consult `PROJECT_CONTEXT.md`**: Understand the architecture, existing module relationships, and where new features belong (e.g., `components/ui/` vs `components/playground/`).

## 2. Implementation Workflow

When a user provides a prompt to build a new feature or modify an existing one, strictly follow this workflow:

### A. Planning Phase (Agentic Mode)

1. Read the user prompt carefully. Ask clarifying questions if the prompt is ambiguous.
2. Outline the necessary changes. Identify which files need to be created, updated, or removed.
3. If creating a new component, decide if it is a generic UI element or a domain-specific playground component.

### B. Execution Phase

1. **API First**: If the feature requires backend logic, update `app/api/chat/route.ts` first. Ensure type safety using interfaces from `lib/types.ts`.
2. **State Management**: Implement or update custom hooks in the `hooks/` directory (primarily `usePlayground.ts`) to manage state and API interactions.
3. **UI Implementation**: Build the React components.
   - Use Lucide-react for icons.
   - Use the `cn` utility for Tailwind class merging.
   - Ensure the UI is responsive, accessible, and follows modern design aesthetics (dark/light mode support, smooth transitions).
4. **Integration**: Wire the custom hooks and components together in `app/page.tsx` or the relevant parent component.

### C. Verification Phase

1. Run `pnpm run build` or `pnpm run lint` to catch TypeScript or ESLint errors early.
2. If the user requests it, start the development server (`pnpm run dev`) and verify the functionality using the browser subagent if available, or instruct the user on how to test it manually.

## 3. Code Generation Standards

- **Strict Typing**: Never use `any`. Use `unknown` if necessary, and use appropriate type narrowing and assertions. All interfaces must be defined in `lib/types.ts` unless they are highly specific to a single component and not shared.
- **No Placeholders in Final Output**: Do not generate structural "TODO" comments unless explicitly asking the user for input. Implement the full logic requested.
- **Atomic Commits/Edits**: When using file editing tools (like `multi_replace_file_content`), ensure changes are logically grouped and do not break the application state mid-execution.
- **Error Handling**: Always wrap async operations in `try/catch` blocks. Return standard HTTP error codes from API routes (400 for bad input, 500 for server errors) with consistent JSON structures `{ error: string }`.

## 4. Environment & Security

- Never expose API keys or sensitive environment variables in client-side code.
- Always use `process.env` for accessing variables, and ensure they are documented in `.env.example` if a new one is introduced.

## 5. Artifacts and Status Tracking

- Maintain the `task.md` checklist. Update it progressively as you complete steps in a complex prompt.
- Use `task_boundary` tools appropriately to keep the user informed of your current execution status.
