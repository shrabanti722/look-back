# Quick Deploy to Vercel - 5 Minutes

## Step 1: Push to GitHub

```bash
cd look-back-survey
git add .
git commit -m "Ready for deployment"
git push
```

## Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign in with GitHub**

2. Click **"Add New Project"**

3. **Import your repository**:
   - Find `miracle-app` (or your repo name)
   - Click **"Import"**

4. **Configure Project**:
   - **Root Directory**: Click **"Edit"** → Set to `look-back-survey`
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables** (BEFORE clicking Deploy):
   - Click **"Environment Variables"**
   - Add:
     ```
     SUPABASE_URL = https://pjbzhdzmrnvlbmqrzehk.supabase.co
     SUPABASE_SERVICE_KEY = your_service_role_key_here
     ```
   - Make sure to check: ✅ Production, ✅ Preview, ✅ Development

6. Click **"Deploy"**

## Step 3: Wait & Test

1. Wait 2-3 minutes for deployment
2. Visit your site URL (Vercel will show it)
3. Test the survey
4. Check Supabase Storage for CSV

## Important Notes

### Root Directory
Since your survey is in `look-back-survey/` subfolder:
- In Vercel project settings, set **Root Directory** to `look-back-survey`
- This tells Vercel where your Next.js app is

### Environment Variables
Must be added in Vercel dashboard:
- Go to **Settings** → **Environment Variables**
- Add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- **Redeploy** after adding them

## Your Live URLs

After deployment:
- **Survey**: `https://your-project.vercel.app`
- **Admin/Download**: `https://your-project.vercel.app/admin`
- **CSV Direct**: `https://pjbzhdzmrnvlbmqrzehk.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv`

## Done! 🎉

That's it! Your survey is now live.
