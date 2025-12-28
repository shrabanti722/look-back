# Deploy to Vercel - Step by Step Guide

## Prerequisites

- ✅ Your code is ready
- ✅ Supabase Storage is set up (for CSV storage)
- ✅ Environment variables are configured locally

## Step 1: Prepare Your Code

### 1.1 Make sure everything is committed

```bash
git add .
git commit -m "feat: add survey form with CSV cloud storage"
```

### 1.2 Push to GitHub (if not already)

```bash
git push origin main
# or
git push origin your-branch-name
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** (use GitHub to connect easily)
3. **Click "Add New Project"**
4. **Import your repository**:
   - Select `miracle-app` repository
   - Or search for it if it's not listed
5. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `look-back-survey` (if your survey is in a subfolder)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
6. **Click "Deploy"**

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd look-back-survey
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? (No for first time)
   - Project name: `look-back-survey` (or your choice)
   - Directory: `./` (current directory)
   - Override settings? (No)

## Step 3: Add Environment Variables

**This is critical!** Your app needs these in production.

### In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables:

```bash
SUPABASE_URL=https://pjbzhdzmrnvlbmqrzehk.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

3. **Important**: Make sure to select **"Production"**, **"Preview"**, and **"Development"** for each variable
4. Click **"Save"**

### Environment Variables You Need:

**Required:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your service_role key (not anon key!)

**Optional (if using email):**
- `RESEND_API_KEY` - If you want email notifications
- `RESEND_FROM_EMAIL` - Email to send from
- `SURVEY_RECIPIENT_EMAIL` - Where to send responses

## Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic deployment

## Step 5: Verify Deployment

1. **Check your site**: Visit the URL Vercel gives you (like `your-project.vercel.app`)
2. **Test the survey**: Submit a test response
3. **Check Supabase**: Verify CSV appears in Storage
4. **Test download**: Visit `https://your-site.vercel.app/api/download-csv-cloud`

## Step 6: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS setup instructions

## Troubleshooting

### Build Fails

**Check:**
- All dependencies are in `package.json`
- No TypeScript errors: `npm run build` works locally
- Check build logs in Vercel dashboard

### "Environment variable not set"

- Make sure you added variables in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### CSV Not Saving

- Verify Supabase credentials are correct
- Check bucket `survey-data` exists and is public
- Check Vercel function logs for errors

### Check Logs

1. Go to **Deployments** → Click on a deployment
2. Click **"Functions"** tab
3. Click on a function to see logs
4. Look for errors

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_KEY`
- [ ] Redeployed after adding env vars
- [ ] Tested survey submission
- [ ] Verified CSV in Supabase Storage
- [ ] Tested download endpoint

## Post-Deployment

### Access Your CSV

**Public URL:**
```
https://pjbzhdzmrnvlbmqrzehk.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv
```

**Download Endpoint:**
```
https://your-site.vercel.app/api/download-csv-cloud
```

**Admin Page:**
```
https://your-site.vercel.app/admin
```

## That's It! 🎉

Your survey is now live! Share the URL and start collecting responses.
