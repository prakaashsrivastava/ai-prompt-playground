'use client'

import { useState, useRef } from 'react'
import { TokenUsage } from '../lib/types'

export default function usePlayground() {
    const [prompt, setPrompt] = useState<string>('')
    const [systemPrompt, setSystemPrompt] = useState<string>('')
    const [selectedModel, setSelectedModel] = useState<string>('llama-3.3-70b-versatile')
    const [temperature, setTemperature] = useState<number>(0.7)
    const [maxTokens, setMaxTokens] = useState<number>(1024)

    const [response, setResponse] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null)
    const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null)
    const [isStreaming, setIsStreaming] = useState<boolean>(false)

    const abortControllerRef = useRef<AbortController | null>(null)

    const handleSubmit = async () => {
        if (!prompt.trim() || isLoading) return

        setResponse('')
        setError(null)
        setTokenUsage(null)
        setResponseTimeMs(null)
        setIsLoading(true)
        setIsStreaming(true)

        const startTime = Date.now()

        abortControllerRef.current = new AbortController()

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: abortControllerRef.current.signal,
                body: JSON.stringify({
                    prompt,
                    systemPrompt,
                    model: selectedModel,
                    temperature,
                    maxTokens,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                setError(errorData.error || `HTTP error ${res.status}`)
                setIsLoading(false)
                setIsStreaming(false)
                return
            }

            if (!res.body) {
                throw new Error('ReadableStream not supported in this browser.')
            }

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let done = false

            while (!done) {
                const { value, done: readerDone } = await reader.read()
                done = readerDone

                if (value) {
                    const chunkString = decoder.decode(value, { stream: true })
                    const lines = chunkString.split('\n')

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataString = line.slice(6)

                            try {
                                const parsed = JSON.parse(dataString)

                                if (parsed.content) {
                                    setResponse((prev) => prev + parsed.content)
                                }

                                if (parsed.error) {
                                    setError(parsed.error)
                                    done = true
                                    break
                                }

                                if (parsed.done) {
                                    if (parsed.usage) {
                                        setTokenUsage(parsed.usage)
                                    }
                                    setResponseTimeMs(Date.now() - startTime)
                                    done = true
                                }
                            } catch (e) {
                                console.warn('Failed to parse SSE line:', line, e)
                            }
                        }
                    }
                }
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setError(null) // User intentionally cancelled
            } else {
                console.error('Fetch error:', err)
                setError(err.message || 'An unexpected error occurred')
            }
        } finally {
            setIsLoading(false)
            setIsStreaming(false)
        }
    }

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            setIsLoading(false)
            setIsStreaming(false)
        }
    }

    const handleClear = () => {
        setResponse('')
        setError(null)
        setTokenUsage(null)
        setResponseTimeMs(null)
    }

    return {
        prompt, setPrompt,
        systemPrompt, setSystemPrompt,
        selectedModel, setSelectedModel,
        temperature, setTemperature,
        maxTokens, setMaxTokens,
        response,
        isLoading,
        error,
        tokenUsage,
        responseTimeMs,
        isStreaming,
        handleSubmit,
        handleStop,
        handleClear
    }
}
