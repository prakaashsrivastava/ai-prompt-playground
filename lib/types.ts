export type Role = 'user' | 'assistant' | 'system'

export interface ChatMessage {
    role: Role
    content: string
}

export interface ModelOption {
    id: string
    name: string
    provider: 'groq' | 'openai'
    contextWindow: number
    description: string
}

export interface PlaygroundConfig {
    model: string
    temperature: number
    maxTokens: number
    systemPrompt: string
}

export interface TokenUsage {
    promptTokens: number
    completionTokens: number
    totalTokens: number
}

export interface ChatResponse {
    content: string
    usage?: TokenUsage
    responseTimeMs?: number
    error?: string
}
