# 🤖 AI Integrations Setup Guide

Your AI service layer is ready! Here's how to configure and use it.

---

## ✅ What's Been Created

- ✅ **OpenAI Provider** - GPT-4, GPT-3.5 support
- ✅ **Google Gemini Provider** - Gemini Pro support
- ✅ **DeepSeek Provider** - DeepSeek Chat and Coder
- ✅ **Llama Provider** - Llama 3 via Together AI
- ✅ **Unified AI Service** - Single interface for all providers
- ✅ **Streaming Support** - Real-time token streaming
- ✅ **Message Streaming API** - Updated to use real AI

---

## 🔑 API Keys Setup

Add these to your `.env.local` file:

### OpenAI (Recommended for testing)
```env
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

**Get it from:** https://platform.openai.com/api-keys

### Google Gemini
```env
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key-here"
```

**Get it from:** https://makersuite.google.com/app/apikey

### DeepSeek
```env
DEEPSEEK_API_KEY="your-deepseek-api-key-here"
DEEPSEEK_API_URL="https://api.deepseek.com"
```

**Get it from:** https://platform.deepseek.com/api_keys

### Llama (Together AI)
```env
TOGETHER_API_KEY="your-together-api-key-here"
```

**Get it from:** https://api.together.xyz/

**OR use Replicate:**
```env
REPLICATE_API_TOKEN="your-replicate-token-here"
```

---

## 🚀 Quick Start

### Step 1: Add at least one API key

For testing, OpenAI is easiest:
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env.local`:
   ```env
   OPENAI_API_KEY="sk-..."
   ```

### Step 2: Restart dev server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 3: Test AI integration

The message streaming API will now use real AI models!

---

## 🧪 Testing AI Integration

### Option 1: Test via API

```javascript
// In browser console (while logged in)
const conv = await fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ title: 'AI Test Chat' })
}).then(r => r.json());

const convId = conv.conversation?.id;

// Stream AI response
const response = await fetch('/api/messages/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    conversationId: convId,
    content: 'Hello! Tell me a joke.',
    model: 'gpt-4-turbo',
    provider: 'openai'
  })
});

// Read stream
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.content) {
        console.log(data.content);
      }
      if (data.done) {
        console.log('✅ Stream complete!');
      }
    }
  }
}
```

### Option 2: Get Available Models

```javascript
// Check which models are available
const models = await fetch('/api/ai/models', { credentials: 'include' })
  .then(r => r.json());
console.log('Available models:', models);
```

---

## 📋 Available Models

### OpenAI (if OPENAI_API_KEY is set)
- `gpt-4-turbo` - GPT-4 Turbo
- `gpt-4` - GPT-4
- `gpt-3.5-turbo` - GPT-3.5 Turbo

### Google Gemini (if GOOGLE_GENERATIVE_AI_API_KEY is set)
- `gemini-pro` - Gemini Pro

### DeepSeek (if DEEPSEEK_API_KEY is set)
- `deepseek-chat` - DeepSeek Chat
- `deepseek-coder` - DeepSeek Coder

### Llama (if TOGETHER_API_KEY or REPLICATE_API_TOKEN is set)
- `llama-3-70b` - Llama 3 70B
- `llama-3-8b` - Llama 3 8B

---

## 🔧 How It Works

1. **User sends message** → `/api/messages/stream`
2. **API creates user message** in database
3. **API calls AI service** with conversation context
4. **AI streams response** token by token
5. **API saves assistant message** when complete

---

## 🎯 Next Steps

Once you have API keys set up:

1. **Test streaming** - Send a message and watch it stream
2. **Try different models** - Test GPT-4, Gemini, etc.
3. **Connect frontend** - Update chat page to use streaming API
4. **Add model selector** - Let users choose which AI to use

---

## 🐛 Troubleshooting

### "No available AI provider"
- **Fix:** Add at least one API key to `.env.local`
- **Check:** Restart dev server after adding keys

### "OpenAI client not initialized"
- **Fix:** Make sure `OPENAI_API_KEY` is set correctly
- **Check:** No extra spaces or quotes in `.env.local`

### "Failed to generate response"
- **Check:** API key is valid
- **Check:** You have credits/quota
- **Check:** Terminal for detailed error messages

---

## 💡 Pro Tips

1. **Start with OpenAI** - Easiest to set up and test
2. **Use streaming** - Better user experience
3. **Save API keys securely** - Never commit to git
4. **Monitor usage** - Track token usage in metadata

---

**Ready to test?** Add an API key and restart your server! 🚀

