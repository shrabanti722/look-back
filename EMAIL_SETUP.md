# Email Setup Guide

This guide covers two email features:
1. **Email Notifications** (Recommended) - Get notified when someone submits (just name & email)
2. **Full Email Storage** (Optional) - Receive complete survey responses via email

---

## Email Notifications (Quick Setup) ⭐

**What it does:** Sends you a simple email notification with just the submitter's name and email whenever someone completes the survey.

**Setup (2 minutes):**

1. **Sign up for Resend**: Go to [resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. **Get your API key**:
   - After signing up, go to **API Keys** in the dashboard
   - Click **"Create API Key"**
   - Copy the key (starts with `re_`)
3. **Add to `.env.local`**:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   SURVEY_RECIPIENT_EMAIL=your-email@example.com
   RESEND_FROM_EMAIL=Survey <onboarding@resend.dev>
   ```
   - `RESEND_API_KEY`: Your Resend API key
   - `SURVEY_RECIPIENT_EMAIL`: Your email address (where notifications will be sent)
   - `RESEND_FROM_EMAIL`: Optional - defaults to `onboarding@resend.dev` (for testing). For production, use your verified domain.

4. **Restart your dev server**:
   ```bash
   npm run dev
   ```

**That's it!** Now whenever someone submits the survey:
- The response is saved to CSV (Supabase/S3)
- You'll receive an email notification with:
  - Submitter's name
  - Submitter's email
  - Timestamp

**Note:** The `resend` package is already installed in your project, so no need to run `npm install`.

**For Production (Vercel):**
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add the same three variables:
   - `RESEND_API_KEY`
   - `SURVEY_RECIPIENT_EMAIL`
   - `RESEND_FROM_EMAIL` (optional)
3. Redeploy your application

**Email Format:**
```
New Survey Submission

Name: John Doe
Email: john@example.com

Submitted on: 1/15/2025, 2:30:45 PM
```

---

## Full Email Storage (Optional)

If you want to receive complete survey responses via email instead of (or in addition to) CSV storage:

## Option 1: Resend (Easiest - Recommended) ⭐

### Setup (2 minutes):

1. **Sign up**: Go to [resend.com](https://resend.com) (free tier available)
2. **Get API key**: Copy your API key
3. **Add to `.env.local`**:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   SURVEY_RECIPIENT_EMAIL=your-email@example.com
   ```
4. **Install package**:
   ```bash
   npm install resend
   ```
5. **Uncomment the Resend code** in `app/api/save-via-email/route.ts`

### Update the code:

In `app/api/save-via-email/route.ts`, uncomment the Resend section:

```typescript
const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'Survey <survey@yourdomain.com>', // or use your verified domain
  to: recipientEmail,
  subject: subject,
  text: emailContent,
})
```

---

## Option 2: Nodemailer (Gmail/SMTP)

### Setup:

1. **Install package**:
   ```bash
   npm install nodemailer
   ```

2. **Add to `.env.local`**:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password  # Gmail app password, not regular password
   SURVEY_RECIPIENT_EMAIL=your-email@example.com
   ```

3. **Update code** in `app/api/save-via-email/route.ts`:
   ```typescript
   const nodemailer = require('nodemailer')
   
   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: parseInt(process.env.SMTP_PORT || '587'),
     secure: false,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   })
   
   await transporter.sendMail({
     from: process.env.SMTP_USER,
     to: recipientEmail,
     subject: subject,
     text: emailContent,
   })
   ```

---

## Option 3: SendGrid

Similar to Resend, just different API. See SendGrid docs.

---

## Current Setup

Right now, the app saves to **JSON files** (simplest, no setup needed!).

To switch to email, change the endpoint in `app/page.tsx`:
- From: `/api/save-to-json`
- To: `/api/save-via-email`
