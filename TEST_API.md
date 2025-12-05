# 🧪 Testing API Routes

This guide will help you test all the API routes we created.

---

## 📋 Prerequisites

Before testing, make sure you have:

1. ✅ **Database set up** - See `DATABASE_SETUP_SIMPLE.md`
2. ✅ **Migrations run** - `npx prisma migrate dev`
3. ✅ **Dev server running** - `npm run dev`
4. ✅ **Test user account** - Sign up at `/signup`

---

## 🚀 Quick Test (Automated)

Run the test script:

```bash
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

This will test basic connectivity and authentication.

---

## 🧪 Manual Testing Guide

### Step 1: Create a Test User

1. Go to: http://localhost:3000/signup
2. Create an account:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456
3. You'll be automatically logged in

---

### Step 2: Test with Browser DevTools

1. **Open Browser DevTools** (F12 or Cmd+Option+I)
2. **Go to Network tab**
3. **Keep the Console tab open** for errors

#### Test: Get Spaces

1. In the browser, go to: http://localhost:3000/chat
2. Open DevTools → Network tab
3. In Console, run:

```javascript
fetch('/api/spaces', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Expected:** Should return `{ spaces: [...] }` or `{ spaces: [] }` if no spaces exist.

#### Test: Create a Space

```javascript
fetch('/api/spaces', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Test Workspace'
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Expected:** Should return `{ space: { id: "...", name: "Test Workspace", ... } }`

#### Test: Create a Conversation

```javascript
fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: 'My First Conversation'
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Expected:** Should return `{ conversation: { id: "...", title: "My First Conversation", ... } }`

#### Test: Get Conversations

```javascript
fetch('/api/conversations', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Expected:** Should return `{ conversations: [...] }` with your conversation.

#### Test: Create a Message

```javascript
// First, get a conversation ID from the previous step
const conversationId = 'YOUR_CONVERSATION_ID_HERE';

fetch('/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    conversationId: conversationId,
    content: 'Hello, this is a test message!',
    role: 'user'
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Expected:** Should return `{ message: { id: "...", content: "Hello...", ... } }`

---

### Step 3: Test with curl (Terminal)

If you want to test from terminal, you'll need to:

1. **Get your session cookie** from browser DevTools:
   - Go to Application/Storage → Cookies
   - Find `next-auth.session-token`
   - Copy its value

2. **Use it in curl:**

```bash
# Get Spaces
curl -X GET http://localhost:3000/api/spaces \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN_HERE" \
  -H "Content-Type: application/json"

# Create Space
curl -X POST http://localhost:3000/api/spaces \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Workspace"}'

# Create Conversation
curl -X POST http://localhost:3000/api/conversations \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Conversation"}'
```

---

### Step 4: Test with Postman/Insomnia

1. **Import the collection** (see below)
2. **Set up authentication:**
   - Type: Cookie
   - Name: `next-auth.session-token`
   - Value: (get from browser DevTools)

#### Postman Collection

Create a new collection with these requests:

**Base URL:** `http://localhost:3000`

**Requests:**

1. **GET Spaces**
   - Method: GET
   - URL: `/api/spaces`
   - Auth: Cookie (next-auth.session-token)

2. **POST Create Space**
   - Method: POST
   - URL: `/api/spaces`
   - Body (JSON):
     ```json
     {
       "name": "Test Workspace"
     }
     ```

3. **GET Conversations**
   - Method: GET
   - URL: `/api/conversations`

4. **POST Create Conversation**
   - Method: POST
   - URL: `/api/conversations`
   - Body (JSON):
     ```json
     {
       "title": "Test Conversation"
     }
     ```

5. **POST Create Message**
   - Method: POST
   - URL: `/api/messages`
   - Body (JSON):
     ```json
     {
       "conversationId": "conv_123",
       "content": "Hello!",
       "role": "user"
     }
     ```

---

## ✅ Expected Results

### Successful Responses

- **200 OK** - GET requests return data
- **201 Created** - POST requests create resources
- **200 OK** - PATCH/DELETE requests succeed

### Error Responses

- **401 Unauthorized** - Not logged in (expected if not authenticated)
- **400 Bad Request** - Missing required fields
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Duplicate resource (e.g., space slug)

---

## 🐛 Troubleshooting

### "Unauthorized" errors
- **Solution:** Make sure you're logged in
- Check that session cookie is being sent
- Try logging out and back in

### "Conversation not found"
- **Solution:** Make sure you're using the correct conversation ID
- Verify the conversation belongs to your user

### "No space found"
- **Solution:** Create a space first, or the system will use your default space
- Check that migrations ran successfully

### Database errors
- **Solution:** Make sure database is running
- Check `DATABASE_URL` in `.env.local`
- Run `npx prisma generate` if needed

---

## 📊 Test Checklist

- [ ] Can create a user account
- [ ] Can log in
- [ ] Can GET `/api/spaces` (returns spaces array)
- [ ] Can POST `/api/spaces` (creates space)
- [ ] Can GET `/api/conversations` (returns conversations array)
- [ ] Can POST `/api/conversations` (creates conversation)
- [ ] Can GET `/api/conversations/[id]` (returns specific conversation)
- [ ] Can POST `/api/messages` (creates message)
- [ ] Can GET `/api/messages/[id]` (returns specific message)
- [ ] Can DELETE `/api/conversations/[id]` (deletes conversation)

---

## 🎯 Next Steps

Once all tests pass:

1. ✅ API routes are working
2. ✅ Authentication is working
3. ✅ Database is connected
4. 🚀 Ready for **Step 4: AI Integrations**!

---

## 💡 Tips

- **Use browser DevTools** - Easiest way to test authenticated routes
- **Check Network tab** - See request/response details
- **Check Console** - See any JavaScript errors
- **Use Prisma Studio** - `npx prisma studio` to view database directly

---

**Happy Testing! 🧪✨**

