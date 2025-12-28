# CSV Storage Setup Guide

Store survey responses as CSV files that you can easily download and view.

## Option 1: Local CSV File (Development) ✅ Simplest

**Works for:** Local development, small scale

### How it works:
- Saves CSV to `survey-responses/survey-responses.csv`
- Each response = one row
- Easy to open in Excel/Google Sheets

### Setup:
Already works! Just use `/api/save-to-csv` endpoint.

### Access:
- Local: Open `survey-responses/survey-responses.csv`
- Download: Visit `/api/download-csv` in browser

---

## Option 2: Supabase Storage (Recommended for Production) ⭐

**Works for:** Production, free, easy setup

### Setup (5 minutes):

1. **Sign up**: Go to [supabase.com](https://supabase.com) (free tier)
2. **Create project**: Click "New Project"
3. **Create storage bucket**:
   - Go to **Storage** in left sidebar
   - Click **"New bucket"**
   - Name: `survey-data`
   - Make it **Public** (or private with signed URLs)
   - Click **"Create bucket"**

4. **Get credentials**:
   
   **Project URL:**
   
   **If you see:** `https://supabase.com/dashboard/project/pjbzhdxxxxx`
   
   **Your Project URL is:** `https://pjbzhdxxxxx.supabase.co`
   
   (Just take the project ID from the dashboard URL and add `.supabase.co` to it)
   
   **Or find it in Settings:**
   - Go to **Settings** → **API**
   - Look for **"Project URL"** or **"URL"** field
   - It will show: `https://pjbzhdxxxxx.supabase.co`
   
   **Example:**
   - Dashboard URL: `https://supabase.com/dashboard/project/abcdefghijklmnop`
   - Project URL: `https://abcdefghijklmnop.supabase.co`
   **Service Role Key:**
   - Go to **Settings** → **API**
   - Scroll down to **"Project API keys"** section
   - Find **"service_role"** key (NOT the "anon" or "public" key)
   - Click the eye icon to reveal it, then copy
   - ⚠️ **Important**: This is a secret key - keep it safe!

5. **Add environment variables**:
   ```bash
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_KEY=eyJxxxxx  # service_role key
   ```

6. **Install package**:
   ```bash
   npm install @supabase/supabase-js
   ```

7. **Update code**: Use `/api/save-to-csv-cloud` endpoint

### Access CSV:
- **Public URL**: `https://xxxxx.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv`
- **Download endpoint**: `/api/download-csv-cloud`

---

## Option 3: AWS S3 (Advanced)

**Works for:** Production, scalable

### Setup:

1. Create AWS account
2. Create S3 bucket
3. Get access keys
4. Add environment variables:
   ```bash
   AWS_ACCESS_KEY_ID=xxxxx
   AWS_SECRET_ACCESS_KEY=xxxxx
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   ```
5. Install: `npm install aws-sdk`
6. Use `/api/save-to-csv-cloud` endpoint

---

## Quick Setup for Production

### Recommended: Supabase Storage

1. Sign up at supabase.com
2. Create bucket: `survey-data` (public)
3. Get service_role key
4. Add to environment variables
5. Change endpoint to `/api/save-to-csv-cloud`
6. Deploy!

### Access Your CSV:

**Option A: Direct URL** (if bucket is public)
```
https://your-project.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv
```

**Option B: Download Endpoint**
Visit: `https://your-site.com/api/download-csv-cloud`

---

## Switching Between Options

### For Development (Local):
```typescript
// In app/page.tsx
const response = await fetch('/api/save-to-csv', {
```

### For Production (Cloud):
```typescript
// In app/page.tsx
const response = await fetch('/api/save-to-csv-cloud', {
```

---

## Viewing CSV

### Option 1: Download and Open
- Visit download endpoint
- Open in Excel/Google Sheets/Numbers

### Option 2: Direct Link (Supabase)
- If bucket is public, use the direct URL
- Can bookmark it for easy access

### Option 3: Import to Google Sheets
- Create new Google Sheet
- File → Import → From URL
- Paste the CSV URL

---

## Summary

**Simplest**: Local CSV file (works for dev)
**Best for Production**: Supabase Storage (free, easy, accessible)

Choose based on your needs!
