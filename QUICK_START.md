# 🚀 Quick Start Guide - Get Running in 5 Minutes!

## Step 1: Get a Database (2 minutes)

### Option A: Vercel Postgres (Easiest!)
1. Go to https://vercel.com → Your Project → **Storage** tab
2. Click **"Create Database"** → Choose **"Postgres"**
3. Copy the **Connection String** (looks like: `postgresql://...`)

### Option B: Neon (Also Easy!)
1. Go to https://neon.tech → Sign up with GitHub
2. Click **"Create a project"**
3. Copy the **Connection String**

---

## Step 2: Set Up Environment Variables (1 minute)

1. Open `.env.local` in your project (create it if it doesn't exist)
2. Add these lines:

```env
DATABASE_URL="paste-your-connection-string-here"
NEXTAUTH_SECRET="run-this-command-below"
NEXTAUTH_URL="http://localhost:3000"
```

3. Generate a secret key:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as `NEXTAUTH_SECRET` value

---

## Step 3: Run Setup Script (1 minute)

```bash
./scripts/setup-database.sh
```

This script will:
- ✅ Check your environment variables
- ✅ Generate a secret key if needed
- ✅ Create all database tables

**OR** do it manually:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## Step 4: Start Your App! (1 minute)

```bash
npm run dev
```

Open http://localhost:3000/signup and create an account! 🎉

---

## 🆘 Need Help?

- **Detailed guide:** See `DATABASE_SETUP_SIMPLE.md`
- **Troubleshooting:** Check the error message in your terminal
- **Database issues:** Make sure your `DATABASE_URL` is correct

---

## ✅ Checklist

- [ ] Database created (Vercel or Neon)
- [ ] Connection string copied
- [ ] `.env.local` file created with `DATABASE_URL`
- [ ] `NEXTAUTH_SECRET` generated and added
- [ ] Migrations run successfully
- [ ] App starts without errors
- [ ] Can sign up a new user

**You're all set! 🎉**
