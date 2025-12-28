# How to Get GOOGLE_SERVICE_ACCOUNT_KEY

This guide will walk you through getting your Google Service Account Key step by step.

## Step-by-Step Instructions

### Step 1: Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### Step 2: Create or Select a Project

1. Click on the project dropdown at the top (next to "Google Cloud")
2. Click **"New Project"** (or select an existing project)
3. Enter a project name (e.g., "Look Back Survey")
4. Click **"Create"**
5. Wait for the project to be created, then select it

### Step 3: Enable Required APIs

1. Go to **"APIs & Services"** > **"Library"** (or visit [API Library](https://console.cloud.google.com/apis/library))
2. Search for **"Google Docs API"**
   - Click on it
   - Click **"Enable"**
3. Search for **"Google Drive API"**
   - Click on it
   - Click **"Enable"**

### Step 4: Create a Service Account

1. Go to **"IAM & Admin"** > **"Service Accounts"** (or visit [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts))
2. Click **"+ CREATE SERVICE ACCOUNT"** at the top
3. Fill in the details:
   - **Service account name**: `survey-docs-creator` (or any name you prefer)
   - **Service account ID**: Will auto-fill (you can change it)
   - **Description**: `Service account for creating survey documents` (optional)
4. Click **"CREATE AND CONTINUE"**

### Step 5: Grant Permissions (Optional but Recommended)

1. In the **"Grant this service account access to project"** section:
   - **Role**: Select **"Editor"** (or for more specific control, use **"Document Editor"** and **"Drive File Editor"**)
2. Click **"CONTINUE"**
3. Click **"DONE"** (you can skip the optional steps)

### Step 6: Create and Download the Key

1. You should now see your service account in the list. Click on it
2. Go to the **"KEYS"** tab
3. Click **"ADD KEY"** > **"Create new key"**
4. Select **"JSON"** as the key type
5. Click **"CREATE"**
6. A JSON file will automatically download to your computer

**⚠️ Important**: Keep this file secure! It contains sensitive credentials.

### Step 7: Format the Key for Environment Variable

You have two options:

#### Option A: Use the JSON file directly (Easier for local development)

1. Rename the downloaded file to `service-account-key.json`
2. Place it in the `look-back-survey` folder (project root)
3. The code will automatically use it (if you modify the code as shown below)

#### Option B: Convert to Environment Variable (For production)

1. Open the downloaded JSON file
2. Copy the entire contents
3. Convert it to a single line (see methods below)

## Setting Up the Environment Variable

### Method 1: Using jq (Recommended - if you have it installed)

```bash
# In your terminal, navigate to where you downloaded the JSON file
cat service-account-key.json | jq -c
```

This will output the JSON as a single line. Copy it and use it in your `.env.local` file.

### Method 2: Manual Conversion

1. Open the JSON file in a text editor
2. Remove all line breaks and extra spaces
3. Make sure it's all on one line
4. Escape any quotes if needed (though JSON strings should already be properly escaped)

### Method 3: Using Online Tool

1. Go to a JSON minifier like [jsonformatter.org](https://jsonformatter.org/json-minify)
2. Paste your JSON content
3. Click "Minify"
4. Copy the result

### Create `.env.local` File

1. In your project root (`look-back-survey` folder), create a file named `.env.local`
2. Add the following:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

**Important Notes:**
- Replace the content between quotes with your actual JSON (as a single line)
- Make sure to use single quotes `'` on the outside
- The JSON should be properly escaped

### Example `.env.local` file:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"my-survey-project","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"survey-docs-creator@my-survey-project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/survey-docs-creator%40my-survey-project.iam.gserviceaccount.com"}'
```

## Alternative: Using JSON File Directly (Easier)

If you prefer not to use environment variables, you can modify the code to read from a file:

1. Place your downloaded JSON file as `service-account-key.json` in the project root
2. Update `app/api/create-doc/route.ts`:

```typescript
import fs from 'fs'
import path from 'path'

function getAuth() {
  // Try environment variable first, then fall back to file
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  
  let key
  if (credentials) {
    key = JSON.parse(credentials)
  } else {
    // Read from file
    const keyPath = path.join(process.cwd(), 'service-account-key.json')
    key = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
  }
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: key.client_email,
      private_key: key.private_key,
    },
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive.file',
    ],
  })

  return auth
}
```

## Verify Your Setup

1. Make sure `.env.local` is in your `.gitignore` (it should be already)
2. Restart your development server after adding the environment variable:
   ```bash
   npm run dev
   ```
3. Try submitting a test survey to verify it works

## Troubleshooting

### Error: "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set"
- Make sure `.env.local` exists in the project root
- Check that the variable name is exactly `GOOGLE_SERVICE_ACCOUNT_KEY`
- Restart your dev server after creating/modifying `.env.local`

### Error: "Failed to parse JSON"
- Make sure the JSON is on a single line
- Check that all quotes are properly escaped
- Verify the JSON is valid (you can test it at [jsonlint.com](https://jsonlint.com))

### Error: "Permission denied" or "API not enabled"
- Verify both Google Docs API and Google Drive API are enabled
- Check that the service account has the correct permissions

### Documents not being created
- Verify the service account email has access
- Check that the APIs are enabled
- Look at the server logs for detailed error messages

## Security Best Practices

1. **Never commit** your service account key to git
2. The `.gitignore` file already excludes `.env.local` and `service-account-key.json`
3. For production, use environment variables in your hosting platform (Vercel, Netlify, etc.)
4. Rotate keys periodically if compromised
5. Limit the service account permissions to only what's needed

## Quick Reference

- **Google Cloud Console**: https://console.cloud.google.com/
- **Service Accounts**: https://console.cloud.google.com/iam-admin/serviceaccounts
- **API Library**: https://console.cloud.google.com/apis/library
- **Project ID**: Found in the project dropdown or project settings
