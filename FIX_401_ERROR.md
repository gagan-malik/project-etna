# 🔧 Fix 401 Unauthorized Error

The 401 error means you're not logged in. Here's how to fix it:

---

## ✅ Solution: Sign Up Through the Browser

The test API page needs a session cookie, which you only get by signing up through the browser UI.

### Step 1: Sign Up

1. **Open a new browser tab**
2. **Go to:** http://localhost:3000/signup
3. **Fill in the form:**
   - Name: Your name
   - Email: test@example.com (or any email)
   - Password: test123456 (or any password, 8+ chars)
   - Confirm Password: Same as password
4. **Click "Sign up"**

### Step 2: Check if You're Logged In

After signing up:
- ✅ You should be redirected to `/chat`
- ✅ You should see the chat interface
- ✅ No error messages

### Step 3: Test API Routes

1. **Go to:** http://localhost:3000/test-api
2. **Click test buttons**
3. **Should see 200 responses!** ✅

---

## 🐛 Still Getting 401?

### Check 1: Are you logged in?

1. **Open browser DevTools** (F12)
2. **Go to Application/Storage tab**
3. **Click "Cookies"** → `http://localhost:3000`
4. **Look for:** `next-auth.session-token` or `authjs.session-token`
5. **If you see it:** You're logged in ✅
6. **If you don't see it:** You need to sign up/login

### Check 2: Try logging in

1. **Go to:** http://localhost:3000/login
2. **Use the email/password you signed up with**
3. **Click "Login"**
4. **Then test API routes again**

### Check 3: Clear cookies and try again

1. **Open DevTools** (F12)
2. **Application tab** → **Cookies** → `http://localhost:3000`
3. **Delete all cookies**
4. **Sign up again**
5. **Test API routes**

---

## 🔍 Debug: Check Session

Open browser console (F12 → Console) and run:

```javascript
// Check if you have a session
fetch('/api/auth/session', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)
```

**Expected if logged in:**
```json
{
  "user": {
    "id": "...",
    "email": "...",
    "name": "..."
  }
}
```

**Expected if NOT logged in:**
```json
{}
```

---

## ✅ Quick Test

1. **Sign up at:** http://localhost:3000/signup
2. **Wait for redirect to /chat**
3. **Go to:** http://localhost:3000/test-api
4. **Click "GET /api/spaces"**
5. **Should see 200 OK!** ✅

---

**Try signing up through the browser now!** 🚀

