# Supabase Setup Guide - Complete Step-by-Step Instructions

This guide will walk you through setting up Supabase Storage to save your survey responses as CSV files in the cloud.

## Prerequisites

- A Supabase account (we'll create one in Step 1)
- Your Next.js project already set up
- Node.js and npm installed

---

## Step 1: Create Supabase Account & Project

### 1.1 Sign Up / Sign In

1. Open your browser and go to **[supabase.com](https://supabase.com)**
2. Click the **"Start your project"** button (or **"Sign in"** if you already have an account)
3. Choose your sign-in method:
   - **GitHub** (recommended - one-click sign in)
   - **Email** (you'll need to verify your email)
4. Complete the sign-up process

### 1.2 Create a New Project

1. Once logged in, you'll see your dashboard
2. Click the **"New Project"** button (usually in the top right or center of the page)
3. Fill in the project details:
   - **Name**: Enter `Survey Responses` (or any name you prefer)
   - **Database Password**: 
     - Create a **strong password** (at least 12 characters)
     - ⚠️ **IMPORTANT**: Save this password! You'll need it to access your database directly
     - Example: `MySecureP@ssw0rd123!`
   - **Region**: 
     - Select the region closest to you or your users
     - Common options: `US East`, `US West`, `EU West`, `Asia Pacific`
4. Click **"Create new project"**
5. ⏳ **Wait 2-3 minutes** for Supabase to set up your project
   - You'll see a loading screen with progress
   - Don't close the browser tab during this time

### ✅ Verification Step 1:
- You should see your project dashboard
- The project status should show as "Active" or "Ready"

---

## Step 2: Create Storage Bucket

A "bucket" is like a folder in the cloud where we'll store your CSV files.

### 2.1 Navigate to Storage

1. In your Supabase project dashboard, look at the **left sidebar**
2. Find and click on **"Storage"** (it has a folder icon)
3. You should see an empty storage area or a message about creating your first bucket

### 2.2 Create the Bucket

1. Click the **"New bucket"** button (usually a green or blue button)
2. A form will appear. Fill it in:
   - **Name**: Type exactly: `survey-data`
     - ⚠️ **Important**: The name must match exactly (lowercase, with hyphen)
   - **Public bucket**: 
     - ✅ **Check this box** (enable it)
     - This allows you to access the CSV file via a public URL
     - If you want it private, leave it unchecked (you'll need to use the API to download)
3. Click **"Create bucket"**

### ✅ Verification Step 2:
- You should see a new bucket named `survey-data` in your Storage list
- The bucket should show as "Public" if you checked that option

---

## Step 3: Get Your Credentials

You need two pieces of information to connect your app to Supabase:
1. **Project URL** - Your Supabase project's address
2. **Service Role Key** - A secret key that gives your app full access

### 3.1 Find Your Project URL

**Method 1: From the Dashboard (Easiest)**
1. Look at the **top of your Supabase dashboard**
2. You'll see your project name
3. Next to it, you'll see a URL that looks like:
   ```
   https://abcdefghijklmnop.supabase.co
   ```
4. That's your Project URL! Copy it.

**Method 2: From Settings (Alternative)**
1. Click **"Settings"** (gear icon ⚙️) in the left sidebar
2. Click **"API"** in the settings menu
3. Look for the **"Project URL"** or **"URL"** field
4. You'll see a URL like: `https://xxxxx.supabase.co`
5. Click the copy icon next to it, or manually copy it

### 3.2 Find Your Service Role Key

1. Make sure you're in **Settings** → **API** (from Step 3.1)
2. Scroll down to the **"Project API keys"** section
3. You'll see a table with different keys:
   - `anon` `public` - ❌ **Don't use this one** (limited permissions)
   - `service_role` `secret` - ✅ **Use this one!** (full permissions)
4. Find the row with `service_role` and `secret`
5. Click the **eye icon** 👁️ next to it to reveal the key
6. Click the **copy icon** 📋 to copy the entire key
   - ⚠️ **Important**: The key is very long (starts with `eyJ...`)
   - Make sure you copied the entire key, not just part of it

### ⚠️ Security Note:
- The **Service Role Key** has full access to your Supabase project
- **Never** commit it to Git or share it publicly
- Only use it in environment variables (never in your code)

### ✅ Verification Step 3:
- You have two values copied:
  - Project URL: `https://xxxxx.supabase.co`
  - Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)

---

## Step 4: Install Supabase Package

Your project needs the Supabase JavaScript library to communicate with Supabase.

### 4.1 Open Terminal

1. Open your terminal/command prompt
2. Navigate to your project directory:
   ```bash
   cd /Users/shrabantimazumdar/Documents/Sadhguru/look-back-survey
   ```

### 4.2 Install the Package

Run this command:

```bash
npm install @supabase/supabase-js
```

### ✅ Verification Step 4:
- The command should complete without errors
- You should see `@supabase/supabase-js` in your `package.json` dependencies

---

## Step 5: Set Up Environment Variables

Environment variables keep your secrets safe and separate from your code.

### 5.1 For Local Development

1. In your project root directory, create a file named `.env.local`
   - If it already exists, open it
   - ⚠️ **Important**: This file should be in `.gitignore` (don't commit it to Git)

2. Add these two lines (replace with your actual values):

```bash
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1MjM0NTIzLCJleHAiOjE5NjA4MTA1MjN9.xxxxx
```

**Replace:**
- `https://abcdefghijklmnop.supabase.co` with your actual Project URL from Step 3.1
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with your actual Service Role Key from Step 3.2

**Example:**
```bash
SUPABASE_URL=https://xyzabc123456789.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMzQ1Njc4OSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDUyMzQ1MjMsImV4cCI6MTk2MDgxMDUyM30.abc123def456ghi789
```

3. Save the file

### 5.2 For Production (Vercel)

If you're deploying to Vercel:

1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"** or **"Add"**
5. Add the first variable:
   - **Key**: `SUPABASE_URL`
   - **Value**: Your Project URL (from Step 3.1)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**
6. Add the second variable:
   - **Key**: `SUPABASE_SERVICE_KEY`
   - **Value**: Your Service Role Key (from Step 3.2)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**
7. **Important**: After adding variables, you need to redeploy:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on your latest deployment
   - Click **"Redeploy"**

### 5.3 For Production (Netlify)

If you're deploying to Netlify:

1. Go to [netlify.com](https://netlify.com) and sign in
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"**
5. Add:
   - **Key**: `SUPABASE_URL`
   - **Value**: Your Project URL
   - Click **"Save"**
6. Add another:
   - **Key**: `SUPABASE_SERVICE_KEY`
   - **Value**: Your Service Role Key
   - Click **"Save"**
7. Redeploy your site

### ✅ Verification Step 5:
- `.env.local` file exists with both variables
- No spaces around the `=` sign
- Values are wrapped in quotes if they contain special characters (usually not needed)

---

## Step 6: Verify Code is Ready

Your code should already be set up to use Supabase. Let's verify:

1. Open `app/page.tsx`
2. Check that line 49 uses `/api/save-to-csv-cloud`:
   ```typescript
   const response = await fetch('/api/save-to-csv-cloud', {
   ```
3. If it says `/api/save-to-csv` instead, change it to `/api/save-to-csv-cloud`

### ✅ Verification Step 6:
- The code is calling the correct endpoint (`/api/save-to-csv-cloud`)

---

## Step 7: Test Your Setup

### 7.1 Start Your Development Server

1. In your terminal, make sure you're in the project directory
2. If your server is running, stop it (Ctrl+C)
3. Start it again to load the new environment variables:
   ```bash
   npm run dev
   ```
4. Wait for it to start (you'll see "Ready" message)

### 7.2 Submit a Test Survey

1. Open your app in the browser (usually `http://localhost:3000`)
2. Fill out the survey form with test data:
   - Name: `Test User`
   - Email: `test@example.com`
   - Fill in other required fields
3. Click **"Submit"** or the submit button
4. You should see a success message

### 7.3 Verify the CSV was Created

1. Go back to your Supabase dashboard
2. Click **"Storage"** in the left sidebar
3. Click on the **`survey-data`** bucket
4. You should see a file named **`survey-responses.csv`**
5. Click on it to see details or download it

### ✅ Verification Step 7:
- Survey submitted successfully
- CSV file appears in Supabase Storage
- No error messages in the browser console or terminal

---

## Step 8: Access Your CSV File

Once your survey responses are saved, you can access the CSV file in several ways:

### Option 1: Public URL (If Bucket is Public)

If you made your bucket public in Step 2, you can access the CSV directly via URL:

```
https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv
```

**To get your Project ID:**
- It's the part between `https://` and `.supabase.co` in your Project URL
- Example: If your URL is `https://xyzabc123.supabase.co`, your Project ID is `xyzabc123`

**Example full URL:**
```
https://xyzabc123.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv
```

You can:
- Open this URL in your browser to view/download the CSV
- Share this URL with others (if bucket is public)
- Use it in Excel, Google Sheets, or other tools

### Option 2: Download via API Endpoint

Your app has a built-in download endpoint:

**Local development:**
```
http://localhost:3000/api/download-csv-cloud
```

**Production:**
```
https://your-domain.com/api/download-csv-cloud
```

This endpoint:
- Works even if the bucket is private
- Automatically downloads the CSV file
- Includes a timestamp in the filename

### Option 3: Supabase Dashboard

1. Go to your Supabase dashboard
2. Click **"Storage"** in the left sidebar
3. Click on the **`survey-data`** bucket
4. Find **`survey-responses.csv`** in the file list
5. Click on the file name
6. Click the **"Download"** button

### Option 4: View in Supabase Storage

1. In the Storage → `survey-data` bucket
2. Click on **`survey-responses.csv`**
3. You can see file details:
   - File size
   - Last modified date
   - Public URL (if bucket is public)
   - Download option

---

## Troubleshooting Guide

### Problem: "Bucket not found" Error

**Symptoms:**
- Error message: "Bucket 'survey-data' not found"
- Survey submission fails

**Solutions:**
1. ✅ Check bucket name is exactly `survey-data` (lowercase, with hyphen)
2. ✅ Verify you're in the correct Supabase project
3. ✅ Go to Storage and confirm the bucket exists
4. ✅ If it doesn't exist, create it again (Step 2)

---

### Problem: "Permission denied" or "Access denied"

**Symptoms:**
- Error: "new row violates row-level security policy"
- Error: "permission denied"
- Upload fails silently

**Solutions:**
1. ✅ **Most Common Fix**: Make sure you're using the `service_role` key, NOT the `anon` key
   - Go to Settings → API
   - Find `service_role` (secret) key
   - Copy that one, not the `anon` key
2. ✅ Check your `.env.local` file has `SUPABASE_SERVICE_KEY` (not `SUPABASE_ANON_KEY`)
3. ✅ Restart your dev server after changing environment variables
4. ✅ If bucket is private, that's okay - the service_role key can still access it

---

### Problem: "Invalid API key" Error

**Symptoms:**
- Error: "Invalid API key"
- Error: "JWT expired" or "JWT malformed"

**Solutions:**
1. ✅ Double-check you copied the **entire** key (it's very long, starts with `eyJ`)
2. ✅ Make sure there are **no extra spaces** before or after the key in `.env.local`
3. ✅ Verify it's the `service_role` key, not `anon`
4. ✅ Check the key format in `.env.local`:
   ```bash
   # ✅ Correct:
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # ❌ Wrong (has quotes):
   SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   
   # ❌ Wrong (has spaces):
   SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. ✅ If on Vercel, make sure you added the variable and redeployed

---

### Problem: Can't Find Project URL

**Symptoms:**
- Don't know where to find the Project URL
- URL format looks wrong

**Solutions:**
1. ✅ **Easiest**: Look at the browser address bar when you're in Supabase
   - It will show: `https://app.supabase.com/project/xxxxx`
   - Your Project URL is: `https://xxxxx.supabase.co`
2. ✅ Go to Settings → API → Look for "Project URL" field
3. ✅ Format should be: `https://[random-letters-numbers].supabase.co`
4. ✅ It's NOT the same as `app.supabase.com` - that's the dashboard URL

---

### Problem: CSV File Not Appearing in Storage

**Symptoms:**
- Survey submits successfully
- But no CSV file in the bucket

**Solutions:**
1. ✅ Wait a few seconds and refresh the Storage page
2. ✅ Check the browser console for errors (F12 → Console tab)
3. ✅ Check your terminal/server logs for errors
4. ✅ Verify environment variables are loaded:
   - Restart your dev server
   - Check `.env.local` file exists and has correct values
5. ✅ Try submitting another test survey
6. ✅ Check if file was created with a different name

---

### Problem: "Failed to upload CSV to Supabase" Error

**Symptoms:**
- Error message about upload failure
- Survey submission fails

**Solutions:**
1. ✅ Check your internet connection
2. ✅ Verify Supabase project is active (not paused)
3. ✅ Check bucket permissions (should work with service_role key)
4. ✅ Look at the detailed error message in the browser console
5. ✅ Try creating the bucket again if it was deleted

---

### Problem: Environment Variables Not Loading

**Symptoms:**
- Variables set correctly but app can't find them
- Error: "Supabase credentials are missing"

**Solutions:**
1. ✅ **Restart your dev server** after adding/changing `.env.local`
2. ✅ Make sure file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
3. ✅ File should be in the **root** of your project (same level as `package.json`)
4. ✅ Check for typos in variable names:
   - `SUPABASE_URL` (not `SUPABASE_URLS` or `SUPABASE_URI`)
   - `SUPABASE_SERVICE_KEY` (not `SUPABASE_KEY` or `SUPABASE_SECRET`)
5. ✅ On Vercel: Make sure variables are added and you redeployed

---

### Problem: Getting CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Requests fail with CORS-related messages

**Solutions:**
1. ✅ This usually doesn't happen with Supabase Storage
2. ✅ If it does, check you're using the correct Project URL
3. ✅ Make sure you're not mixing up different Supabase projects

---

## Quick Reference: Where to Find Things

### Project URL Location:
```
Supabase Dashboard
├── Top bar: Shows project name and URL
└── Settings → API → "Project URL" field
```

### Service Role Key Location:
```
Settings → API → Project API keys section
└── service_role (secret) ← Click eye icon 👁️ to reveal
```

### Storage Bucket Location:
```
Left Sidebar → Storage → survey-data bucket
```

### Environment Variables File:
```
Project Root Directory → .env.local
```

---

## Common Mistakes to Avoid

❌ **Using the `anon` key instead of `service_role` key**
- The `anon` key has limited permissions and won't work for file uploads

❌ **Typos in bucket name**
- Must be exactly `survey-data` (lowercase, hyphen, not underscore)

❌ **Forgetting to restart dev server**
- Environment variables only load when the server starts

❌ **Adding quotes around values in `.env.local`**
- Usually not needed and can cause issues

❌ **Committing `.env.local` to Git**
- This exposes your secrets! Make sure it's in `.gitignore`

❌ **Using wrong Project URL**
- Should be `https://xxxxx.supabase.co`, not `https://app.supabase.com`

---

## Next Steps After Setup

✅ **Test the full flow:**
1. Submit multiple test surveys
2. Verify CSV file updates with each submission
3. Download the CSV and verify data is correct

✅ **Set up production:**
1. Add environment variables to Vercel/Netlify
2. Redeploy your application
3. Test on production URL

✅ **Optional: Set up automatic backups:**
- Supabase automatically backs up your data
- You can also export the CSV periodically

---

## That's It! 🎉

Congratulations! Your Supabase setup is complete. 

**What happens now:**
- Every survey submission automatically saves to `survey-responses.csv` in Supabase Storage
- The CSV file is updated in real-time (new rows appended)
- You can access it anytime via the dashboard, public URL, or download endpoint
- Your data is safely stored in the cloud with automatic backups

**Need Help?**
- Check the troubleshooting section above
- Review Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Check your browser console and server logs for detailed error messages
