# Email Setup (Optional - For Email Storage)

If you want to receive survey responses via email, here are simple options:

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
