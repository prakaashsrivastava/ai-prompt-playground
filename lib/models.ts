import { ModelOption } from './types'

export const MODELS: ModelOption[] = [
    {
        id: 'llama-3.3-70b-versatile',
        name: 'LLaMA 3.3 70B',
        provider: 'groq',
        contextWindow: 128000,
        description: 'Groq — Fast and powerful open-source model'
    },
    {
        id: 'llama-3.1-8b-instant',
        name: 'LLaMA 3.1 8B Instant',
        provider: 'groq',
        contextWindow: 128000,
        description: 'Groq — Ultra-fast lightweight model'
    },
    {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        provider: 'groq',
        contextWindow: 32768,
        description: 'Groq — Mixture of experts model'
    },
    {
        id: 'gemma2-9b-it',
        name: 'Gemma 2 9B',
        provider: 'groq',
        contextWindow: 8192,
        description: 'Groq — Google Gemma 2 model'
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        contextWindow: 16385,
        description: 'OpenAI — Fast and cost-efficient'
    },
    {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai',
        contextWindow: 128000,
        description: 'OpenAI — Affordable GPT-4 quality'
    },
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        contextWindow: 128000,
        description: 'OpenAI — Most capable model'
    }
]

export const DEFAULT_MODEL = MODELS[0]

export const getModelById = (id: string): ModelOption | undefined => {
    return MODELS.find(m => m.id === id)
}
