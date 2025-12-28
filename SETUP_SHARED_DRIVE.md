# Setup Shared Drive or Folder for Service Account

Service accounts don't have their own storage quota. You need to either:
1. Use a **Shared Drive (Team Drive)**, or
2. Create files in a **folder shared with the service account**

## Option 1: Use a Shared Folder (Easiest) ⭐

### Step 1: Create a Folder in Your Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Click **"New"** → **"Folder"**
3. Name it: `2025 Look Back Survey Responses`
4. Click **"Create"**

### Step 2: Share the Folder with Service Account

1. Right-click on the folder → **"Share"**
2. In the "Add people and groups" field, enter your service account email:
   ```
   survey-docs-creator@look-back-482609.iam.gserviceaccount.com
   ```
3. Give it **"Editor"** access
4. **Uncheck** "Notify people" (service accounts don't have email)
5. Click **"Share"**

### Step 3: Get the Folder ID

1. Open the folder in Google Drive
2. Look at the URL - it will be something like:
   ```
   https://drive.google.com/drive/folders/1ABC123xyz789...
   ```
3. Copy the part after `/folders/` - that's your Folder ID
   - Example: `1ABC123xyz789...`

### Step 4: Add Folder ID to Environment

Add to your `.env.local` file:

```bash
GOOGLE_DRIVE_FOLDER_ID=1ABC123xyz789...
```

Replace `1ABC123xyz789...` with your actual folder ID.

### Step 5: Restart Server

```bash
npm run dev
```

## Option 2: Use a Shared Drive (Team Drive)

### Step 1: Create a Shared Drive

1. Go to [Google Drive](https://drive.google.com)
2. Click **"Shared drives"** in the left sidebar
3. Click **"New"** (or **"Create shared drive"**)
4. Name it: `2025 Look Back Survey Responses`
5. Click **"Create"**

### Step 2: Add Service Account to Shared Drive

1. Click on the shared drive
2. Click **"Manage members"** (or the people icon)
3. Click **"Add members"**
4. Enter your service account email:
   ```
   survey-docs-creator@look-back-482609.iam.gserviceaccount.com
   ```
5. Set role to **"Content manager"** or **"Manager"**
6. **Uncheck** "Notify people"
7. Click **"Send"**

### Step 3: Get the Shared Drive ID

1. Open the shared drive
2. Look at the URL - it will be something like:
   ```
   https://drive.google.com/drive/folders/0ABC123xyz789...
   ```
3. Copy the part after `/folders/` - that's your Shared Drive ID
   - Example: `0ABC123xyz789...`

### Step 4: Add Shared Drive ID to Environment

Add to your `.env.local` file:

```bash
GOOGLE_DRIVE_FOLDER_ID=0ABC123xyz789...
```

Replace `0ABC123xyz789...` with your actual shared drive ID.

### Step 5: Restart Server

```bash
npm run dev
```

## Option 3: Use OAuth Delegation (Advanced)

If you need to create files in users' personal drives, you'll need OAuth delegation. This is more complex and requires:
- Domain-wide delegation
- Admin setup
- More configuration

**Recommendation:** Use Option 1 (Shared Folder) - it's the simplest and works immediately.

## Quick Setup Summary

1. ✅ Create a folder in Google Drive
2. ✅ Share it with: `survey-docs-creator@look-back-482609.iam.gserviceaccount.com`
3. ✅ Give it "Editor" access
4. ✅ Copy the folder ID from the URL
5. ✅ Add to `.env.local`: `GOOGLE_DRIVE_FOLDER_ID=your-folder-id`
6. ✅ Restart server

## Verify It Works

After setup, test by submitting a survey. The file should appear in your shared folder!

## Troubleshooting

### "Permission denied" error
- Make sure the folder is shared with the service account email
- Verify the service account has "Editor" access
- Check that the folder ID is correct

### Files not appearing
- Check the folder ID in `.env.local`
- Verify the folder is shared correctly
- Check server logs for errors

### Still getting quota errors
- Make sure you're using a shared folder or shared drive
- Don't try to create files in the service account's personal drive
