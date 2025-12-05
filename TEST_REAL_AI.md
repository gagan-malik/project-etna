# 🧪 Test Real AI - Quick Guide

Your OpenAI API key has been added! Here's how to test it:

---

## ✅ API Key Added

Your `OPENAI_API_KEY` has been added to `.env.local` and the server is restarting.

---

## 🚀 Test It Now!

### Step 1: Wait for Server
- Server is restarting...
- Wait for it to say "Ready" in terminal
- Usually takes 5-10 seconds

### Step 2: Go to Chat Page
1. **Open:** http://localhost:3000/chat
2. **Make sure you're logged in**

### Step 3: Select a Model
1. **Click the model selector** (Sparkles icon in the input area)
2. **You should see:**
   - GPT-4 Turbo ✅
   - GPT-4 ✅
   - GPT-3.5 Turbo ✅
3. **Select one** (GPT-3.5 Turbo is fastest/cheapest for testing)

### Step 4: Send a Message
1. **Type:** "Hello! Tell me a short joke."
2. **Click Send** (or press Enter)
3. **Watch it stream!** ✨

---

## ✅ What You Should See

1. **Your message appears** immediately
2. **AI starts responding** - tokens stream in real-time
3. **Response completes** - full answer appears
4. **Message is saved** to database

---

## 🎯 Test Different Prompts

Try these:

- "Explain quantum computing in simple terms"
- "Write a haiku about coding"
- "What's the capital of France?"
- "Help me write a React component"

---

## 🐛 Troubleshooting

### "No model selected"
- **Fix:** Click the model selector and choose a model
- Models should appear if API key is working

### "Failed to generate response"
- **Check:** Terminal for error messages
- **Check:** API key is correct in `.env.local`
- **Check:** You have OpenAI credits

### "No available AI provider"
- **Check:** Server was restarted after adding key
- **Fix:** Restart server: `npm run dev`

---

## 💡 Pro Tips

1. **GPT-3.5 Turbo** - Fast and cheap, great for testing
2. **GPT-4 Turbo** - More capable, slower and more expensive
3. **Watch the terminal** - See API calls in real-time
4. **Check usage** - https://platform.openai.com/usage

---

## 🎉 Success!

If you see real AI responses streaming in, **it's working!** 🚀

**Next:** Try different models, test various prompts, and enjoy your AI chat app!

---

**Ready to test?** Go to http://localhost:3000/chat and send a message! 💬

