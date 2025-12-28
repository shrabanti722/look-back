# Testing Cloud Storage Setup

## Quick Checklist

Before testing, make sure:

- [ ] Supabase bucket `survey-data` is created
- [ ] Bucket is set to **Public**
- [ ] Environment variables are set in `.env.local`:
  ```bash
  SUPABASE_URL=https://pjbzhdzmrnvlbmqrzehk.supabase.co
  SUPABASE_SERVICE_KEY=your_service_role_key_here
  ```
- [ ] `@supabase/supabase-js` is installed: `npm install @supabase/supabase-js`
- [ ] Code is using `/api/save-to-csv-cloud` endpoint ✅ (already updated)

## Test Steps

1. **Restart your dev server** (to load new env variables):
   ```bash
   npm run dev
   ```

2. **Submit a test survey**

3. **Check Supabase Storage**:
   - Go to: https://supabase.com/dashboard/project/pjbzhdzmrnvlbmqrzehk/storage/buckets
   - Click on `survey-data` bucket
   - You should see `survey-responses.csv` file

4. **Access the CSV**:
   - **Public URL**: https://pjbzhdzmrnvlbmqrzehk.supabase.co/storage/v1/object/public/survey-data/survey-responses.csv
   - **Download endpoint**: http://localhost:3000/api/download-csv-cloud

## Troubleshooting

### "Bucket not found"
- Make sure bucket `survey-data` exists
- Check it's spelled exactly: `survey-data` (lowercase, hyphen)

### "Permission denied"
- Make sure you're using `service_role` key (not `anon` key)
- Check bucket is **Public**

### "No cloud storage configured"
- Check `.env.local` has both `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Restart dev server after adding env variables

### Check Console Logs
The code now logs errors - check your terminal where `npm run dev` is running for detailed error messages.

## Success Indicators

✅ Survey submits without errors  
✅ File appears in Supabase Storage → survey-data  
✅ Can access CSV via public URL  
✅ Can download via `/api/download-csv-cloud`

## Current Setup

- **Endpoint**: `/api/save-to-csv-cloud` ✅
- **Storage**: Supabase Storage
- **Bucket**: `survey-data`
- **File**: `survey-responses.csv`

You're all set to test! 🚀
