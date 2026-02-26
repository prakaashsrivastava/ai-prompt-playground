# AI Agent Guidelines & Rules

This document outlines the strict rules and conventions that must be followed by any AI agent or developer contributing to the **AI Prompt Playground** project.

## 1. Package Management

- **Rule**: STRICTLY use `pnpm` for all package management tasks (`install`, `add`, `remove`, `run`, `build`, etc.).
- **Rule**: NEVER use `npm` or `yarn`.

## 2. Project Architecture & Frameworks

- **Framework**: Next.js 14
- **Router**: App Router ONLY. Do NOT use the Pages Router.
- **Directory Structure**:
  - Application code lives in the root `app/` directory.
  - Do NOT use a `src/` directory.
- **Language**: TypeScript ONLY. All new code must be strictly typed.
- **Styling**: Tailwind CSS.

## 3. Component Hierarchy

- All generic, reusable, and stateless UI components (e.g., specific styled buttons, inputs, sliders, badges) must go in `components/ui/`.
- All feature-specific components related to the main application interface must go in `components/playground/`.
- Components should be functional and utilize React Hooks (`useState`, `useEffect`, etc.).
- Avoid monolithic components; break complex UIs down into smaller, manageable chunks.

## 4. State Management & Hooks

- Custom business logic and complex state management should be extracted into custom hooks located in the `hooks/` directory (e.g., `hooks/usePlayground.ts`).
- Avoid prop drilling by utilizing React Context where necessary, or keep state lifted to the closest common ancestor.

## 5. Styling & CSS Utilities

- Use the `cn` utility function exported from `lib/utils.ts` for conditionally merging Tailwind classes.
- Example: `className={cn("base-class", isActive && "active-class")}`
- Do NOT use standard CSS or SCSS modules unless absolutely necessary; rely entirely on Tailwind utility classes.
- Use `lucide-react` for all iconography.

## 6. Type Definitions & Constants

- All core Typescript interfaces and types MUST be defined in and imported from `lib/types.ts`.
- All environment-agnostic constant data (e.g., list of supported AI models) MUST be defined in `lib/models.ts`.

## 7. Version Control Integration

- Do NOT automatically run `git init` or initialize git repositories unless explicitly instructed by the user.

## 8. Development Flow

- When asked to create a new component, always check if a generic version belongs in `components/ui/` or if it is domain-specific to `components/playground/`.
- Prioritize visual excellence; ensure the application utilizes modern design principles, including responsive layouts, proper spacing, smooth transitions, and dark/light mode considerations if applicable.
