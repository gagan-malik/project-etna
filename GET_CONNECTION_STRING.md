# 📋 Step-by-Step: Get Connection String from Vercel

Follow these exact steps:

---

## Step 1: Open Vercel Dashboard

1. Go to: **https://vercel.com**
2. Sign in to your account
3. You should see your projects

---

## Step 2: Find Your Project

1. Look for your project (the one where you added Neon)
2. **Click on the project name** to open it

---

## Step 3: Go to Storage Tab

1. In your project dashboard, look at the **top menu tabs**
2. You should see tabs like: **Overview**, **Deployments**, **Settings**, **Storage**
3. **Click on "Storage"** tab

---

## Step 4: Find Your Neon Database

1. In the Storage tab, you should see your Neon database listed
2. It might be named something like:
   - "Neon Database"
   - "Postgres"
   - Or a custom name you gave it
3. **Click on the database name** or the database card

---

## Step 5: Get Connection String

Once you're in the database details page, look for:

**Option A: Connection String Section**
- Look for a section called **"Connection String"** or **"Connection Details"**
- You'll see something like:
  ```
  postgresql://user:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
  ```
- There should be a **"Copy"** button next to it
- **Click "Copy"**

**Option B: Environment Variables**
- Sometimes it's in **"Environment Variables"** section
- Look for `DATABASE_URL`
- Click to reveal/copy it

**Option C: Connection Details**
- Look for **"Connection Details"** or **"Connect"** button
- Click it to see connection info
- Copy the connection string

---

## Step 6: What It Looks Like

The connection string will look like one of these:

```
postgresql://user:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

or

```
postgresql://default:password@ep-xxx-xxx.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require
```

**Important:** It should start with `postgresql://` and end with `?sslmode=require` or similar.

---

## Step 7: Copy It

1. **Select the entire connection string**
2. **Copy it** (Cmd+C on Mac, Ctrl+C on Windows)
3. **Save it somewhere** (text file, notes app, etc.) - you'll need it in a moment!

---

## 🆘 Can't Find It?

If you can't find the connection string:

1. **Check if database is still creating** - Wait a minute and refresh
2. **Look in Settings** - Sometimes it's in project Settings → Environment Variables
3. **Check Neon Dashboard** - Go directly to https://neon.tech and check your project there
4. **Try the "Connect" button** - Some UIs have a "Connect" or "Get Connection String" button

---

## Next: Add to .env.local

Once you have the connection string, I'll help you add it to `.env.local`!

**Let me know when you've copied it!** 📋

