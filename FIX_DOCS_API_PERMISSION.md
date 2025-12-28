# Fix: Google Docs API Permission Error

## Problem
- ✅ Google Drive API: Working
- ❌ Google Docs API: "The caller does not have permission"
- ✅ API is enabled in Google Cloud Console

## Solution: Grant Service Account Proper IAM Role

The issue is that your service account needs the **"Editor"** role (or specific document permissions) at the **project IAM level**.

### Step-by-Step Fix:

#### Option 1: Grant Editor Role (Recommended - Easiest)

1. **Go to IAM & Admin → IAM:**
   - Direct link: https://console.cloud.google.com/iam-admin/iam?project=look-back-482609

2. **Find your service account:**
   - Look for: `survey-docs-creator@look-back-482609.iam.gserviceaccount.com`
   - If you don't see it, click **"+ GRANT ACCESS"**

3. **Add/Edit the role:**
   - If the service account exists: Click the **pencil icon** (✏️) next to it
   - If it doesn't exist: Click **"+ GRANT ACCESS"** and enter:
     - **Principal**: `survey-docs-creator@look-back-482609.iam.gserviceaccount.com`
   - **Role**: Select **"Editor"** from the dropdown
   - Click **"SAVE"**

4. **Wait 1-2 minutes** for permissions to propagate

5. **Test again:**
   ```bash
   npm run test-permissions
   ```

#### Option 2: Use More Specific Roles (If Editor Doesn't Work)

If Editor role doesn't work, try these specific roles:

1. Go to IAM: https://console.cloud.google.com/iam-admin/iam?project=look-back-482609
2. Edit your service account
3. Add these roles:
   - **"Document Editor"** (for Google Docs API)
   - **"Drive File Editor"** (for Google Drive API)
   - **"Service Account User"** (if needed)

### Verify the Fix:

1. **Check IAM permissions:**
   - Go to: https://console.cloud.google.com/iam-admin/iam?project=look-back-482609
   - Find your service account
   - It should show **"Editor"** (or the specific roles) in the Roles column

2. **Run the test:**
   ```bash
   npm run test-permissions
   ```
   - Both APIs should now show ✅ SUCCESS

3. **Restart your dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Try submitting the survey again**

## Why This Happens

Even though the API is enabled, the service account needs **IAM permissions** to actually use it. Think of it like:
- **Enabling the API** = Turning on the service
- **IAM Role** = Giving your service account permission to use that service

Both are required!

## Still Not Working?

### Check These:

1. **Make sure you're in the correct project:**
   - Project ID should be: `look-back-482609`
   - Check the project dropdown at the top of Google Cloud Console

2. **Verify the service account email is correct:**
   - Should be: `survey-docs-creator@look-back-482609.iam.gserviceaccount.com`
   - Check your `service-account-key.json` file to confirm

3. **Wait longer:**
   - Sometimes permissions take 2-5 minutes to propagate
   - Try again after waiting

4. **Check for typos:**
   - Make sure the service account email is spelled correctly in IAM

5. **Try removing and re-adding:**
   - Remove the service account from IAM
   - Wait 30 seconds
   - Add it back with Editor role

## Quick Links

- **IAM Page**: https://console.cloud.google.com/iam-admin/iam?project=look-back-482609
- **Service Accounts**: https://console.cloud.google.com/iam-admin/serviceaccounts?project=look-back-482609
- **Enabled APIs**: https://console.cloud.google.com/apis/dashboard?project=look-back-482609
