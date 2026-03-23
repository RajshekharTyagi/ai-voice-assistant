# Groq API Setup Guide

## Why Groq?
- **Fast**: Much faster than OpenAI (responses in milliseconds)
- **Free**: Generous free tier with high rate limits
- **Reliable**: No quota issues like OpenAI

## Setup Steps:

### 1. Get Your Groq API Key
1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the generated key (starts with `gsk_`)

### 2. Update Your .env File
1. Open `voice-ai-avatar/.env`
2. Replace `your_complete_groq_api_key_here` with your actual API key
3. Save the file

Example:
```
VITE_GROQ_API_KEY=gsk_your_actual_key_here_it_will_be_much_longer
```

### 3. Test the Setup
1. Run `npm run dev`
2. Use the Debug Panel in the bottom-right corner
3. Click "Test AI Service"
4. Ask "What is Python?" and you should get a detailed response!

## Benefits of This Setup:
- ✅ No quota limits (generous free tier)
- ✅ Super fast responses (Groq is optimized for speed)
- ✅ Uses Llama 3.1 70B model (very capable)
- ✅ Same API format as OpenAI (easy to switch)

## Troubleshooting:
- If you get "Invalid API Key" error, double-check the key in .env
- Make sure the key starts with `gsk_`
- Restart your dev server after updating .env