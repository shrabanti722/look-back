# Fix: Bucket Not Found Error

## The Problem
You're getting "bucket not found" error. This means the bucket doesn't exist in Supabase Storage yet.

## Quick Fix

### Step 1: Create the Bucket

1. Go to your Supabase project: https://supabase.com/dashboard/project/pjbzhdzmrnvlbmqrzehk
2. Click **"Storage"** in the left sidebar
3. Click **"New bucket"** button (top right)
4. Fill in:
   - **Name**: `survey-data` (exactly this name - must match the code)
   - **Public bucket**: ✅ **Check this box** (important!)
5. Click **"Create bucket"**

### Step 2: Verify Bucket Name

Make sure the bucket is named exactly: `survey-data`

**Not:**
- ❌ `survey-date`
- ❌ `Survey Data`
- ❌ `survey_data`

**Yes:**
- ✅ `survey-data` (lowercase, with hyphen)

### Step 3: Make Sure It's Public

1. Click on the `survey-data` bucket
2. Go to **"Settings"** tab
3. Make sure **"Public bucket"** is enabled
4. If not, enable it and save

### Step 4: Test Again

After creating the bucket:
1. Submit a test survey
2. Go to **Storage** → **survey-data**
3. You should see `survey-responses.csv` file appear

## Access Your CSV

Once the bucket is created and public, you can access:

**Public URL:**
```
https://pjbzhdzmrnvlbmqrzehk.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv
```

**Download Endpoint:**
```
https://your-site.com/api/download-csv-cloud
```

## Troubleshooting

### Still getting "bucket not found"?

1. **Check bucket name**: Must be exactly `survey-data` (lowercase, hyphen)
2. **Check it exists**: Go to Storage → See if `survey-data` is listed
3. **Check it's public**: Bucket settings → Public bucket enabled
4. **Wait a moment**: Sometimes takes a few seconds to propagate

### Bucket exists but still can't access?

1. Make sure bucket is **Public**
2. Check the bucket name matches exactly: `survey-data`
3. Try refreshing the Storage page

### Getting permission errors?

- Make sure you're using `service_role` key (not `anon` key)
- Check the key is correct in your environment variables

## Visual Checklist

✅ Bucket name: `survey-data`  
✅ Bucket is Public  
✅ Bucket exists in Storage  
✅ Using correct Project URL  
✅ Using `service_role` key (not `anon`)

## Quick Test

1. Create bucket: `survey-data` (public)
2. Submit a survey
3. Go to Storage → survey-data
4. You should see `survey-responses.csv`

If you see the file, it's working! 🎉
