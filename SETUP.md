# AI Prompt Playground — Setup Guide

## 1. Get Your API Keys

### Groq (Free)

1. Go to https://console.groq.com
2. Sign up for a free account
3. Navigate to "API Keys" in the left sidebar
4. Click "Create API Key"
5. Copy the key — you only see it once

### OpenAI (Paid, optional)

1. Go to https://platform.openai.com
2. Sign up and add a payment method (start with $5 credit)
3. Navigate to API Keys: https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key — you only see it once

## 2. Configure Environment Variables

Open `.env.local` in the project root and replace the placeholder values:
GROQ_API_KEY=gsk_your_actual_groq_key_here
OPENAI_API_KEY=sk-your_actual_openai_key_here
NEXT_PUBLIC_APP_NAME=AI Prompt Playground

Save the file. Never commit this file to Git.

## 3. Run the Project

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 4. First Test

1. Leave the System Prompt empty
2. Select "LLaMA 3.3 70B" (Groq — free)
3. Set Temperature to 0.7
4. Set Max Tokens to 512
5. Type in the prompt: "Explain what temperature does in language models in 3 bullet points"
6. Press Ctrl+Enter or click "Send Prompt"
7. Watch the response stream in real time

## 5. Troubleshooting

**"API key not configured" error**: Check that `.env.local` exists and has the correct key name (GROQ_API_KEY or OPENAI_API_KEY)

**No response / timeout**: Groq is generally faster. Try a Groq model first.

**OpenAI models not working**: OpenAI requires a paid account with credits. Check your usage at https://platform.openai.com/usage

**Streaming not working**: Make sure you're not running behind a proxy that buffers responses.
