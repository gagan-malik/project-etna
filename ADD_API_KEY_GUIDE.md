# 🔑 Add API Key & Test Real AI - Step by Step

Follow these simple steps to get real AI responses working!

---

## Step 1: Get OpenAI API Key (2 minutes)

### Option A: If you already have an OpenAI account
1. Go to: https://platform.openai.com/api-keys
2. Sign in
3. Click **"Create new secret key"**
4. Name it: "Project Etna" (or anything)
5. Click **"Create secret key"**
6. **Copy the key immediately!** (You won't see it again)
   - It looks like: `sk-proj-...` or `sk-...`

### Option B: If you need to create an account
1. Go to: https://platform.openai.com/signup
2. Sign up (email or Google)
3. Add payment method (required for API access)
4. Go to: https://platform.openai.com/api-keys
5. Create a new key
6. Copy it!

**Note:** OpenAI requires a payment method, but they give you $5 free credit to start!

---

## Step 2: Add to .env.local (1 minute)

1. **Open `.env.local`** in your project
2. **Find or add this line:**
   ```env
   OPENAI_API_KEY="paste-your-key-here"
   ```
3. **Paste your API key** (keep the quotes!)
4. **Save the file**

**Example:**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-proj-abc123xyz..."
```

---

## Step 3: Restart Dev Server (1 minute)

1. **Stop the current server:**
   - In terminal, press `Ctrl+C` (or `Cmd+C` on Mac)

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Wait for it to say "Ready"** ✅

---

## Step 4: Test It! (1 minute)

1. **Go to:** http://localhost:3000/chat
2. **Make sure you're logged in**
3. **Select a model:**
   - Click the model selector (Sparkles icon)
   - Choose "GPT-4 Turbo" or "GPT-3.5 Turbo"
4. **Send a message:**
   - Type: "Hello! Tell me a joke."
   - Click Send
5. **Watch it stream!** ✨

---

## ✅ Success!

If you see:
- ✅ Message appears immediately
- ✅ AI response streams in real-time
- ✅ Response makes sense (not an error)

**It's working!** 🎉

---

## 🐛 Troubleshooting

### "No available AI provider"
- **Check:** Is `OPENAI_API_KEY` in `.env.local`?
- **Check:** Did you restart the server?
- **Fix:** Restart server after adding key

### "Failed to generate response"
- **Check:** Is your API key correct?
- **Check:** Do you have credits/quota?
- **Check:** Terminal for error messages

### "401 Unauthorized"
- **Check:** Are you logged in?
- **Fix:** Go to `/login` and sign in

---

## 💡 Pro Tips

1. **Start with GPT-3.5 Turbo** - Cheaper and faster for testing
2. **Check your usage** - https://platform.openai.com/usage
3. **Set usage limits** - https://platform.openai.com/account/limits

---

**Ready?** Get that API key and let's test it! 🚀

