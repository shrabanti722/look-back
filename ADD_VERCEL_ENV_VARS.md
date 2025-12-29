# How to Add Environment Variables in Vercel

## Step-by-Step Guide

### Step 1: Get Your Supabase Credentials

First, get your credentials from Supabase:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Settings** (gear icon in left sidebar) → **API**
4. **Copy these values:**
   - **Project URL**: Look for "Project URL" or "URL" field
     - Example: `https://pjbzhdzmrnvlbmqrzehk.supabase.co`
   - **Service Role Key**: Scroll to "Project API keys" section
     - Find the `service_role` key (it says "secret" next to it)
     - Click the eye icon 👁️ to reveal it
     - Click "Copy" to copy the key
     - ⚠️ **Important**: Use `service_role` key, NOT the `anon` key!

### Step 2: Add Environment Variables in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your project** (the survey project)
3. **Go to Settings** (top navigation bar)
4. **Click "Environment Variables"** (in the left sidebar under Settings)
5. **Add First Variable:**
   - Click **"Add New"** button
   - **Key**: `SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL
     - Example: `https://pjbzhdzmrnvlbmqrzehk.supabase.co`
   - **Environment**: Check ALL THREE boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

6. **Add Second Variable:**
   - Click **"Add New"** button again
   - **Key**: `SUPABASE_SERVICE_KEY`
   - **Value**: Paste your Service Role Key (the long token)
     - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)
   - **Environment**: Check ALL THREE boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

### Step 3: Redeploy Your Project

**Important**: Environment variables only take effect after redeployment!

1. **Go to "Deployments" tab** (top navigation)
2. **Find your latest deployment**
3. **Click the three dots "..."** menu on the right
4. **Click "Redeploy"**
5. **Confirm** the redeployment
6. **Wait 2-3 minutes** for deployment to complete

### Step 4: Verify It Works

1. **Visit your production URL** (e.g., `https://your-project.vercel.app`)
2. **Fill out and submit the survey**
3. **Check Supabase Storage**:
   - Go to Supabase Dashboard → **Storage** → `survey-data` bucket
   - You should see `survey-responses.csv` file
   - Click on it to verify your data is there

## Visual Guide

```
Vercel Dashboard
  └─ Your Project
      └─ Settings (top nav)
          └─ Environment Variables (left sidebar)
              └─ Add New
                  ├─ Key: SUPABASE_URL
                  ├─ Value: https://xxxxx.supabase.co
                  └─ ✅ Production ✅ Preview ✅ Development
              └─ Add New
                  ├─ Key: SUPABASE_SERVICE_KEY
                  ├─ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  └─ ✅ Production ✅ Preview ✅ Development
```

## Quick Checklist

- [ ] Got Supabase Project URL from Settings → API
- [ ] Got Service Role Key (not anon key) from Settings → API
- [ ] Added `SUPABASE_URL` in Vercel with all environments checked
- [ ] Added `SUPABASE_SERVICE_KEY` in Vercel with all environments checked
- [ ] Redeployed the project
- [ ] Tested survey submission
- [ ] Verified CSV appears in Supabase Storage

## Common Mistakes

❌ **Using anon key instead of service_role key**
- The anon key won't work for storage operations
- Must use the service_role key

❌ **Not checking all environment boxes**
- If you only check "Production", preview deployments won't work
- Always check: Production, Preview, AND Development

❌ **Not redeploying after adding variables**
- Environment variables only apply to NEW deployments
- Must redeploy for changes to take effect

❌ **Typo in variable name**
- Must be exactly: `SUPABASE_URL` (not `SUPABASE_URLS` or `SUPABASE_URL_`)
- Must be exactly: `SUPABASE_SERVICE_KEY` (not `SUPABASE_KEY`)

## Still Not Working?

1. **Check Vercel Logs**:
   - Go to Deployments → Click on a deployment → Functions tab
   - Click on `/api/save-to-csv-cloud`
   - Look for error messages

2. **Verify Variables Are Set**:
   - Go to Settings → Environment Variables
   - Make sure both variables are listed
   - Check that all environment boxes are checked

3. **Double-check Supabase**:
   - Make sure bucket `survey-data` exists
   - Make sure bucket is set to Public
   - Verify your service_role key is correct

## That's It! 🎉

Once you add the variables and redeploy, your survey should work in production!




