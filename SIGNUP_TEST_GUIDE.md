# 🧪 Signup & Authentication Test Guide

Follow these steps to create an account and test authenticated API routes.

---

## Step 1: Check Database Setup

Before signing up, you need a database. Let's check:

### Quick Check:
```bash
# Check if DATABASE_URL is set
grep "DATABASE_URL" .env.local
```

**If you see `DATABASE_URL=""` or nothing:**
- You need to set up a database first
- See `DATABASE_SETUP_SIMPLE.md` for instructions
- Or use `./scripts/setup-database.sh`

**If you see a connection string:**
- ✅ Database is configured!
- Continue to Step 2

---

## Step 2: Create Your Account

1. **Go to Signup Page:**
   - Open: http://localhost:3000/signup
   - Or click "Sign up" link from login page

2. **Fill in the Form:**
   - **Name:** Your name (e.g., "John Doe")
   - **Email:** Your email (e.g., "john@example.com")
   - **Password:** At least 8 characters (e.g., "password123")
   - **Confirm Password:** Same as password

3. **Click "Sign up"**

4. **What Should Happen:**
   - ✅ Account is created
   - ✅ You're automatically logged in
   - ✅ You're redirected to `/chat` page

---

## Step 3: Test API Routes (Authenticated)

Now that you're logged in:

1. **Go to Test Page:**
   - Open: http://localhost:3000/test-api

2. **Test Each Endpoint:**
   - Click "GET /api/spaces" - Should return `{ spaces: [] }` or your spaces
   - Click "POST /api/spaces" - Should create a space
   - Click "GET /api/conversations" - Should return your conversations
   - Click "POST /api/conversations" - Should create a conversation

3. **Expected Results:**
   - ✅ **200 OK** - Success!
   - ✅ **201 Created** - Resource created!
   - ❌ **401 Unauthorized** - Not logged in (try logging in again)
   - ❌ **500 Error** - Database issue (check DATABASE_URL)

---

## Step 4: Test Full Flow

### Create a Space:
1. Click "POST /api/spaces"
2. Change the space name if you want
3. Click the button
4. **Expected:** `{ space: { id: "...", name: "...", ... } }`

### Create a Conversation:
1. Click "POST /api/conversations"
2. Change the title if you want
3. Click the button
4. **Expected:** `{ conversation: { id: "...", title: "...", ... } }`
5. **Copy the conversation ID** from the result!

### Create a Message:
1. Paste the conversation ID in the "Conversation ID" field
2. Type a message in "Message Content"
3. Click "POST /api/messages"
4. **Expected:** `{ message: { id: "...", content: "...", ... } }`

### Get Your Conversation:
1. Paste the conversation ID
2. Click "GET /api/conversations/[id]"
3. **Expected:** Full conversation with all messages!

---

## 🐛 Troubleshooting

### "Failed to create account"
- **Check:** Is DATABASE_URL set in `.env.local`?
- **Check:** Is the database running?
- **Fix:** Set up database (see `DATABASE_SETUP_SIMPLE.md`)

### "401 Unauthorized" after signup
- **Check:** Are you still logged in?
- **Fix:** Try logging out and back in
- **Fix:** Check browser cookies (DevTools → Application → Cookies)

### "500 Internal Server Error"
- **Check:** Database connection
- **Check:** Run migrations: `npx prisma migrate dev`
- **Check:** Terminal for error messages

---

## ✅ Success Checklist

- [ ] Can create an account
- [ ] Automatically logged in after signup
- [ ] Can GET /api/spaces (returns 200)
- [ ] Can POST /api/spaces (creates space)
- [ ] Can GET /api/conversations (returns 200)
- [ ] Can POST /api/conversations (creates conversation)
- [ ] Can POST /api/messages (creates message)

---

## 🎯 Next Steps

Once all tests pass:
1. ✅ Authentication is working
2. ✅ API routes are working
3. ✅ Database is connected
4. 🚀 Ready for **Step 4: AI Integrations**!

---

**Happy Testing! 🧪✨**

