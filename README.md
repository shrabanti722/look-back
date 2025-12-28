# 2025 Look Back Survey

A beautiful, interactive survey application that collects employee feedback and automatically creates individual Google Docs for each respondent.

## Features

- 🎨 Modern, animated UI with gradient backgrounds
- 📝 Multi-step form with progress tracking
- ✨ Smooth transitions and animations using Framer Motion
- 📄 Automatic Google Docs creation for each submission
- 🔒 Secure API integration with Google Services
- 📧 Email notifications when documents are created

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Google APIs** - Google Docs and Drive integration

## Prerequisites

- Node.js 18+ and npm/yarn
- Google Cloud Project with APIs enabled
- Google Service Account credentials

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Google Cloud Setup

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

#### Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud project:

- **Google Docs API**
- **Google Drive API**

You can enable them via:
- [Google Cloud Console](https://console.cloud.google.com/apis/library)
- Or using gcloud CLI: `gcloud services enable docs.googleapis.com drive.googleapis.com`

#### Step 3: Create a Service Account

1. Go to **IAM & Admin** > **Service Accounts** in Google Cloud Console
2. Click **Create Service Account**
3. Give it a name (e.g., "survey-docs-creator")
4. Grant it the following roles:
   - **Editor** (or more specific: **Document Editor** and **Drive File Editor**)
5. Click **Done**

#### Step 4: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Download the JSON file

#### Step 5: Share Google Drive Folder (Optional but Recommended)

For better organization, you can create a shared folder in Google Drive:

1. Create a folder in Google Drive (e.g., "2025 Look Back Surveys")
2. Share it with the service account email (found in the JSON key file, `client_email` field)
3. Give it **Editor** access

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

**Important Notes:**
- The entire JSON content should be in a single line as a string
- Make sure to escape any quotes properly
- Alternatively, you can read from a file (see alternative setup below)

### Alternative: Using a JSON File (For Local Development)

If you prefer to use a file instead of an environment variable:

1. Place your service account JSON file in the project root as `service-account-key.json`
2. Add it to `.gitignore` (already included)
3. Modify `app/api/create-doc/route.ts` to read from the file:

```typescript
import fs from 'fs'
import path from 'path'

function getAuth() {
  const keyPath = path.join(process.cwd(), 'service-account-key.json')
  const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
  
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

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add the `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable in Vercel dashboard
4. Deploy!

### Other Platforms

For other platforms (Netlify, Railway, etc.), make sure to:
- Set the `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable
- Ensure Node.js 18+ is available
- Configure the build command: `npm run build`

## How It Works

1. User fills out the multi-step survey form
2. On submission, the form data is sent to `/api/create-doc`
3. The API route:
   - Authenticates with Google using the service account
   - Creates a new Google Doc with formatted content
   - Shares the document with the user's email address
   - Returns the document URL
4. User receives an email notification with access to their document

## Survey Sections

1. **Basic Info** - Name, email, role, product
2. **Looking Back** - Achievements and impact
3. **Friction & Struggles** - Challenges faced
4. **Growth & Development** - Learning and growth areas
5. **Working with Peers** - Feedback comfort and practices
6. **Leadership Support** - Feedback for leadership
7. **Looking Ahead** - Vision for the future
8. **Final** - Review and submit

## Customization

### Styling

- Colors: Edit `tailwind.config.ts` to change the color scheme
- Animations: Modify Framer Motion animations in components
- Layout: Adjust the form layout in `components/SurveyForm.tsx`

### Questions

- Edit questions in `components/SurveyForm.tsx`
- Update the `SurveyData` type in `app/page.tsx` if adding new fields
- Modify the document formatting in `app/api/create-doc/route.ts`

## Troubleshooting

### "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set"

- Make sure `.env.local` exists and contains the key
- Restart your development server after adding environment variables
- For production, ensure the environment variable is set in your hosting platform

### "Failed to create document" or Permission Errors

- Verify the service account has the correct permissions
- Check that Google Docs API and Drive API are enabled
- Ensure the service account email is correct

### Documents Not Being Shared

- Verify the user's email address is correct
- Check that the service account has permission to share documents
- Ensure Drive API is enabled

## Security Notes

- Never commit your service account key to version control
- Use environment variables for sensitive data
- The `.gitignore` file already excludes credential files
- Consider using Google Cloud Secret Manager for production

## License

This project is for internal use.

## Support

For issues or questions, please contact the development team.
