# Supabase Quick Setup - Step by Step

## Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign in"**
3. Sign up/Sign in with GitHub or email
4. Click **"New Project"**
5. Fill in:
   - **Name**: `Survey Responses` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
6. Click **"Create new project"**
7. Wait 2-3 minutes for project to be created

## Step 2: Create Storage Bucket

1. In your Supabase project dashboard, click **"Storage"** in the left sidebar
2. Click **"New bucket"** button
3. Fill in:
   - **Name**: `survey-data`
   - **Public bucket**: ✅ **Check this** (so you can access CSV via URL)
4. Click **"Create bucket"**

## Step 3: Get Your Credentials

### Finding Project URL:

**Method 1: From Dashboard**
- Look at the top of your Supabase dashboard
- You'll see your project name and a URL like: `https://abcdefghijklmnop.supabase.co`
- That's your Project URL!

**Method 2: From Settings**
1. Click **"Settings"** (gear icon) in left sidebar
2. Click **"API"** 
3. Look for **"Project URL"** or **"URL"** field
4. Copy it (looks like: `https://xxxxx.supabase.co`)

### Finding Service Role Key:

1. In **Settings** → **API**
2. Scroll down to **"Project API keys"** section
3. You'll see several keys:
   - `anon` `public` - Don't use this
   - `service_role` `secret` - ✅ **Use this one!**
4. Click the **eye icon** 👁️ next to `service_role` to reveal it
5. Click **"Copy"** to copy the key
6. ⚠️ **Keep this secret!** Don't share it publicly

## Step 4: Add to Environment Variables

### For Local Development (`.env.local`):

```bash
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1MjM0NTIzLCJleHAiOjE5NjA4MTA1MjN9.xxxxx
```

Replace:
- `abcdefghijklmnop` with your actual project ID
- The long `eyJ...` string with your actual service_role key

### For Production (Vercel/Netlify):

**Vercel:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - `SUPABASE_URL` = your project URL
   - `SUPABASE_SERVICE_KEY` = your service_role key
3. Click **"Save"**

**Netlify:**
1. Go to **Site settings** → **Environment variables**
2. Add the same variables
3. Save

## Step 5: Install Package

```bash
npm install @supabase/supabase-js
```

## Step 6: Update Code

In `app/page.tsx`, change the endpoint:

```typescript
// Change from:
const response = await fetch('/api/save-to-csv', {

// To:
const response = await fetch('/api/save-to-csv-cloud', {
```

## Step 7: Test It!

1. Restart your dev server: `npm run dev`
2. Submit a test survey
3. Check your Supabase Storage:
   - Go to **Storage** → **survey-data** bucket
   - You should see `survey-responses.csv` file
4. Download it or use the public URL

## Access Your CSV

### Option 1: Public URL (if bucket is public)
```
https://abcdefghijklmnop.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv
```

Replace `abcdefghijklmnop` with your project ID.

### Option 2: Download Endpoint
Visit: `https://your-site.com/api/download-csv-cloud`

### Option 3: Supabase Dashboard
- Go to **Storage** → **survey-data**
- Click on `survey-responses.csv`
- Click **"Download"**

## Troubleshooting

### "Bucket not found"
- Make sure you created the bucket named exactly `survey-data`
- Check it's in the correct project

### "Permission denied"
- Make sure you're using `service_role` key (not `anon` key)
- Check the bucket is set to **Public** if you want public access

### "Invalid API key"
- Double-check you copied the full key (it's very long)
- Make sure it's the `service_role` key, not `anon`

### Can't find Project URL
- It's in the browser URL when you're in Supabase
- Or in Settings → API → Project URL field
- Format: `https://xxxxx.supabase.co`

## Visual Guide

**Project URL location:**
```
Supabase Dashboard
├── Top bar: Shows project name and URL
└── Settings → API → "Project URL" field
```

**Service Role Key location:**
```
Settings → API → Project API keys section
└── service_role (secret) ← Click eye icon to reveal
```

## That's It! 🎉

Once set up, all survey responses will be saved to CSV in Supabase Storage, and you can access it anytime via the public URL or download endpoint!
