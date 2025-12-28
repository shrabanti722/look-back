# Quick Fix: Storage Quota Error

## The Problem
Service accounts don't have their own storage. You need to use a **shared folder** or **shared drive**.

## The Solution (2 Minutes)

### Step 1: Create & Share Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder: `2025 Look Back Survey Responses`
3. Right-click → **Share**
4. Add email: `survey-docs-creator@look-back-482609.iam.gserviceaccount.com`
5. Set permission: **Editor**
6. **Uncheck** "Notify people"
7. Click **Share**

### Step 2: Get Folder ID

1. Open the folder
2. Copy the ID from URL:
   ```
   https://drive.google.com/drive/folders/1ABC123xyz...
                                          ^^^^^^^^^^^^
                                          This part!
   ```

### Step 3: Add to .env.local

```bash
GOOGLE_DRIVE_FOLDER_ID=1ABC123xyz...
```

### Step 4: Restart Server

```bash
npm run dev
```

## Done! ✅

That's it! Files will now be created in your shared folder instead of the service account's Drive.

## Verify It Works

Submit a test survey - the file should appear in your shared folder!

## Still Having Issues?

- Make sure the folder is actually shared with the service account email
- Verify the folder ID is correct (no extra spaces)
- Check that `.env.local` has the folder ID
- Restart the dev server after adding the folder ID
