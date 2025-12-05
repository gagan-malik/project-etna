# ✅ Testing Checklist

Follow these steps to test your API routes:

## Step 1: Database Setup (Required First!)

⚠️ **IMPORTANT:** Your `DATABASE_URL` is not set in `.env.local`

Before testing API routes, you need to:

1. **Set up your database:**
   - See `DATABASE_SETUP_SIMPLE.md` for detailed instructions
   - Or use `STEP_BY_STEP.md` for super simple guide
   - Quick option: Use `./scripts/setup-database.sh`

2. **Add DATABASE_URL to .env.local:**
   ```env
   DATABASE_URL="your-postgres-connection-string-here"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

---

## Step 2: Start Testing

Once database is set up:

### Option A: Visual Test Page (Recommended)

1. **Open your browser:**
   - Go to: http://localhost:3000/test-api

2. **Create an account first:**
   - Go to: http://localhost:3000/signup
   - Fill in: Name, Email, Password
   - Click "Sign up"
   - You'll be automatically logged in

3. **Go back to test page:**
   - http://localhost:3000/test-api
   - Click the test buttons
   - See results in real-time!

### Option B: Browser Console

1. **Log in to your app:**
   - Go to: http://localhost:3000/login
   - Sign in with your account

2. **Open DevTools:**
   - Press F12 (or Cmd+Option+I on Mac)
   - Go to Console tab

3. **Test endpoints:**
   ```javascript
   // Get Spaces
   fetch('/api/spaces', { credentials: 'include' })
     .then(r => r.json())
     .then(console.log)

   // Create Space
   fetch('/api/spaces', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include',
     body: JSON.stringify({ name: 'Test Workspace' })
   })
     .then(r => r.json())
     .then(console.log)
   ```

---

## Step 3: Test Each Endpoint

### ✅ Test Checklist:

- [ ] **GET /api/spaces** - Should return `{ spaces: [] }` or list of spaces
- [ ] **POST /api/spaces** - Should create a space and return it
- [ ] **GET /api/conversations** - Should return `{ conversations: [] }` or list
- [ ] **POST /api/conversations** - Should create a conversation
- [ ] **GET /api/conversations/[id]** - Should return specific conversation
- [ ] **POST /api/messages** - Should create a message
- [ ] **GET /api/messages/[id]** - Should return specific message

---

## Expected Results

### ✅ Success (200/201):
```json
{
  "spaces": [...],
  "conversation": { ... },
  "message": { ... }
}
```

### ❌ Error (401):
```json
{
  "error": "Unauthorized"
}
```
**Fix:** Make sure you're logged in!

### ❌ Error (500):
```json
{
  "error": "Failed to..."
}
```
**Fix:** Check database connection and migrations

---

## Common Issues

### "Unauthorized" errors
- **Solution:** Log in first at `/login` or `/signup`

### "Database connection" errors
- **Solution:** Check `DATABASE_URL` in `.env.local`
- Make sure database is running
- Run `npx prisma generate` and `npx prisma migrate dev`

### "Conversation not found"
- **Solution:** Create a conversation first, then use its ID

---

## Quick Commands

```bash
# Check if server is running
curl http://localhost:3000

# View database (if Prisma Studio is installed)
npx prisma studio

# Regenerate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

---

## 🎯 Ready to Test?

1. ✅ Database is set up
2. ✅ DATABASE_URL is in .env.local
3. ✅ Migrations are run
4. ✅ Dev server is running
5. ✅ You have a user account
6. 🚀 Go to http://localhost:3000/test-api

**Happy Testing! 🧪**

