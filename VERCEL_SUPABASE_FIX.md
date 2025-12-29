# Fix: Supabase Not Working on Vercel

## Common Issues & Solutions

### Issue 1: Environment Variables Not Set

**Symptoms:**
- Error: "No cloud storage configured"
- Error: "Missing environment variables: SUPABASE_URL, SUPABASE_SERVICE_KEY"

**Solution:**
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these variables:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```
3. **Important**: Check all three boxes:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
4. Click **"Save"**
5. **Redeploy** your project:
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**

### Issue 2: Wrong Environment Variable Names

**Check:**
- Variable name must be exactly: `SUPABASE_URL` (not `SUPABASE_URLS` or `SUPABASE_URL_`)
- Variable name must be exactly: `SUPABASE_SERVICE_KEY` (not `SUPABASE_KEY` or `SUPABASE_ANON_KEY`)

### Issue 3: Using Anon Key Instead of Service Key

**Problem:**
- Using `anon` key (public key) instead of `service_role` key
- Service role key is needed for storage operations

**Solution:**
1. Go to Supabase Dashboard → **Settings** → **API**
2. Find **"Project API keys"** section
3. Look for `service_role` key (it says "secret" next to it)
4. Click the eye icon 👁️ to reveal it
5. Copy the **service_role** key (not the anon key)
6. Use this in Vercel as `SUPABASE_SERVICE_KEY`

### Issue 4: Supabase Bucket Not Created

**Symptoms:**
- Error: "Bucket not found" or "Storage bucket does not exist"

**Solution:**
1. Go to Supabase Dashboard → **Storage**
2. Check if bucket named `survey-data` exists
3. If not, create it:
   - Click **"New bucket"**
   - Name: `survey-data`
   - ✅ Check **"Public bucket"**
   - Click **"Create bucket"**

### Issue 5: Bucket Not Public

**Symptoms:**
- Upload succeeds but can't access CSV via URL

**Solution:**
1. Go to Supabase Dashboard → **Storage** → `survey-data` bucket
2. Click **"Policies"** tab
3. Make sure bucket is set to **Public**
4. Or add a policy that allows public read access

## How to Check Vercel Logs

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** tab
3. Click on a deployment
4. Click **"Functions"** tab
5. Click on `/api/save-to-csv-cloud`
6. Check the logs for error messages

## Quick Checklist

- [ ] Environment variables added in Vercel:
  - [ ] `SUPABASE_URL` (with correct value)
  - [ ] `SUPABASE_SERVICE_KEY` (service_role key, not anon key)
- [ ] Variables checked for: Production, Preview, Development
- [ ] Project redeployed after adding variables
- [ ] Supabase bucket `survey-data` exists
- [ ] Bucket is set to Public
- [ ] Service role key is used (not anon key)

## Test Locally First

Before deploying, test locally:

1. Create `.env.local` file:
   ```bash
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```

2. Run locally:
   ```bash
   npm run dev
   ```

3. Submit a test response
4. Check if it saves to Supabase Storage

If it works locally but not on Vercel, it's definitely an environment variable issue.

## Still Not Working?

1. **Check Vercel Function Logs** (see above)
2. **Verify Supabase credentials**:
   - Go to Supabase → Settings → API
   - Copy Project URL and Service Role Key
   - Double-check they match what's in Vercel
3. **Test Supabase connection**:
   - Try accessing: `https://your-project-id.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv`
   - If you get 404, bucket doesn't exist or isn't public
4. **Redeploy** after any changes

