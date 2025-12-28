# Troubleshooting: "The caller does not have permission" Error

This error means your service account doesn't have the necessary permissions. Follow these steps to fix it:

## Step 1: Enable Required APIs

The most common cause is that the APIs aren't enabled. You need to enable:

1. **Google Docs API**
2. **Google Drive API**

### How to Enable APIs:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the correct project: **look-back-482609**
3. Go to **"APIs & Services"** > **"Library"**
   - Or visit directly: https://console.cloud.google.com/apis/library?project=look-back-482609

4. **Enable Google Docs API:**
   - Search for "Google Docs API"
   - Click on it
   - Click the **"ENABLE"** button
   - Wait for it to enable (usually takes a few seconds)

5. **Enable Google Drive API:**
   - Search for "Google Drive API"
   - Click on it
   - Click the **"ENABLE"** button
   - Wait for it to enable

## Step 2: Verify Service Account Permissions

1. Go to **"IAM & Admin"** > **"Service Accounts"**
   - Direct link: https://console.cloud.google.com/iam-admin/serviceaccounts?project=look-back-482609

2. Find your service account: **survey-docs-creator@look-back-482609.iam.gserviceaccount.com**

3. Click on it to open details

4. Check the **"Permissions"** tab - it should show roles like:
   - **Editor** (recommended), OR
   - **Document Editor** + **Drive File Editor**

5. If it doesn't have proper permissions:
   - Go to **"IAM & Admin"** > **"IAM"**
   - Find your service account email
   - Click the pencil icon to edit
   - Add role: **"Editor"** (or more specific roles)
   - Save

## Step 3: Grant Project-Level Permissions

1. Go to **"IAM & Admin"** > **"IAM"**
   - Direct link: https://console.cloud.google.com/iam-admin/iam?project=look-back-482609

2. Find your service account email: `survey-docs-creator@look-back-482609.iam.gserviceaccount.com`

3. If it's not listed, click **"+ GRANT ACCESS"**:
   - Add the service account email
   - Grant role: **"Editor"**
   - Click **"SAVE"**

4. If it's already listed but has wrong permissions:
   - Click the pencil icon
   - Change role to **"Editor"**
   - Click **"SAVE"**

## Step 4: Wait and Retry

After making changes:
1. Wait 1-2 minutes for permissions to propagate
2. Restart your development server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
3. Try submitting the survey again

## Step 5: Verify APIs Are Enabled (Double Check)

Run this quick check:

1. Go to **"APIs & Services"** > **"Enabled APIs"**
   - Direct link: https://console.cloud.google.com/apis/dashboard?project=look-back-482609

2. You should see both:
   - ✅ Google Docs API
   - ✅ Google Drive API

3. If either is missing, go back to Step 1

## Alternative: Use More Specific Roles (If Editor Doesn't Work)

If you prefer more granular permissions:

1. Go to **"IAM & Admin"** > **"IAM"**
2. Edit your service account
3. Add these roles instead of "Editor":
   - **"Document Editor"** (for Google Docs API)
   - **"Drive File Editor"** (for Google Drive API)
   - **"Service Account User"** (if needed)

## Quick Checklist

- [ ] Google Docs API is enabled
- [ ] Google Drive API is enabled
- [ ] Service account has "Editor" role (or specific roles)
- [ ] Waited 1-2 minutes after making changes
- [ ] Restarted the development server
- [ ] Tried submitting the survey again

## Still Not Working?

### Check the Full Error Message

Look at your terminal/console for the full error. It might give more details like:
- Which API is failing
- What specific permission is missing

### Verify Service Account Key

Make sure your `service-account-key.json` file:
- Is in the project root
- Has valid JSON format
- Belongs to the correct project (look-back-482609)

### Test API Access Directly

You can test if the service account can authenticate:

```bash
# In your project directory
node -e "
const { google } = require('googleapis');
const fs = require('fs');
const key = JSON.parse(fs.readFileSync('service-account-key.json', 'utf8'));
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: key.client_email,
    private_key: key.private_key,
  },
  scopes: [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive.file',
  ],
});
auth.getClient().then(client => {
  console.log('✅ Authentication successful!');
  console.log('Service account:', key.client_email);
}).catch(err => {
  console.error('❌ Authentication failed:', err.message);
});
"
```

## Common Issues

### Issue: "API not enabled"
**Solution:** Enable the APIs in Step 1

### Issue: "Permission denied"
**Solution:** Grant Editor role in Step 3

### Issue: "Service account not found"
**Solution:** Make sure you're using the correct project and service account

### Issue: Works in one project but not another
**Solution:** Each Google Cloud project needs APIs enabled separately

## Need More Help?

If you're still stuck:
1. Check the browser console for detailed error messages
2. Check the terminal where `npm run dev` is running
3. Look for specific error codes in the error message
4. Make sure you're using the correct Google Cloud project
