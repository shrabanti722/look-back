# Quick Start Guide

Get your survey up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd look-back-survey
npm install
```

## Step 2: Set Up Google Cloud

### Quick Setup (5 minutes)

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
   - Create a new project (or use existing)
   - Note the project ID

2. **Enable APIs**
   - Search for "Google Docs API" → Enable
   - Search for "Google Drive API" → Enable

3. **Create Service Account**
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **Create Service Account**
   - Name: `survey-docs-creator`
   - Grant role: **Editor**
   - Click **Done**

4. **Create Key**
   - Click on the service account
   - Go to **Keys** tab
   - **Add Key** → **Create new key** → **JSON**
   - Download the JSON file

## Step 3: Configure Environment

Create `.env.local` in the project root:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='<paste entire JSON content here as a single line>'
```

**Tip:** To convert the JSON to a single line, you can use:
```bash
cat service-account-key.json | jq -c
```

Or manually copy the entire JSON and put it in quotes.

## Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test It!

1. Fill out the survey form
2. Submit it
3. Check your email for the Google Doc link
4. Verify the document was created with your responses

## Troubleshooting

### "Environment variable not set"
- Make sure `.env.local` exists
- Restart the dev server after adding the variable
- Check that the JSON is properly escaped

### "Permission denied" or "API not enabled"
- Verify both Google Docs API and Drive API are enabled
- Check that the service account has Editor role

### "Failed to share document"
- Verify the email address is correct
- Ensure Drive API is enabled
- Check service account permissions

## Need Help?

See the full [README.md](./README.md) for detailed instructions.
