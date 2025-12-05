# 🚀 Vercel + Neon Setup Guide

You've added Neon to your Vercel project! Now let's connect it locally.

---

## Step 1: Get Connection String from Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com
   - Open your project

2. **Find the Database:**
   - Click **"Storage"** tab
   - You should see your Neon database listed
   - Click on it

3. **Get Connection String:**
   - Look for **"Connection String"** or **"DATABASE_URL"**
   - Click **"Copy"** to copy it
   - It looks like: `postgresql://user:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`

---

## Step 2: Add to .env.local

Add these to your `.env.local` file:

```env
DATABASE_URL="paste-your-connection-string-here"
NEXTAUTH_SECRET="generate-with-command-below"
NEXTAUTH_URL="http://localhost:3000"
```

### Generate NEXTAUTH_SECRET:

Run this command in terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it as the `NEXTAUTH_SECRET` value.

---

## Step 3: Run Migrations

Once `.env.local` is set up:

```bash
npx prisma migrate dev
```

This will:
- Create all database tables
- Set up the schema
- Enable pgvector extension

---

## Step 4: Test It!

1. **Restart dev server** (if running):
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Try signup:**
   - Go to: http://localhost:3000/signup
   - Fill in the form
   - Click "Sign up"
   - Should work! ✅

3. **Test API routes:**
   - Go to: http://localhost:3000/test-api
   - Click test buttons
   - Should see 200 responses! ✅

---

## 🆘 Troubleshooting

### "Can't connect to database"
- Check that DATABASE_URL is correct
- Make sure you copied the ENTIRE connection string
- Verify the database is running in Vercel dashboard

### "Migration failed"
- Make sure DATABASE_URL is correct
- Try: `npx prisma generate` first
- Then: `npx prisma migrate dev`

### "NEXTAUTH_SECRET is missing"
- Make sure you added it to `.env.local`
- Restart dev server after adding

---

## ✅ Checklist

- [ ] Got connection string from Vercel
- [ ] Added DATABASE_URL to .env.local
- [ ] Generated and added NEXTAUTH_SECRET
- [ ] Added NEXTAUTH_URL
- [ ] Ran migrations successfully
- [ ] Restarted dev server
- [ ] Can sign up successfully
- [ ] API routes return 200

---

**Ready to continue?** Let me know when you've added the connection string to `.env.local` and I'll help you run the migrations! 🚀

