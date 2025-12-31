# Email Service Alternatives to Resend

If Resend emails are not going through, here are reliable alternatives:

## Option 1: SendGrid (Recommended - Easiest Setup) ⭐

**Best for:** Quick setup, reliable delivery, free tier

### Setup:
1. Sign up at [sendgrid.com](https://sendgrid.com) (free tier: 100 emails/day)
2. Go to Settings → API Keys
3. Create API Key (give it "Mail Send" permissions)
4. Copy the API key

### Environment Variables:
```bash
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your-verified-email@example.com
SURVEY_RECIPIENT_EMAIL=recipient@example.com
```

### Usage:
The code is already created at `/api/send-email-sendgrid`. Just update your code to use this endpoint instead of Resend.

---

## Option 2: AWS SES (Most Cost-Effective) 💰

**Best for:** High volume, low cost ($0.10 per 1,000 emails)

### Setup:
1. Create AWS account
2. Go to AWS SES (Simple Email Service)
3. Verify your email address (or domain)
4. Create IAM user with SES permissions
5. Get Access Key ID and Secret Access Key

### Install:
```bash
npm install @aws-sdk/client-ses
```

### Environment Variables:
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
SURVEY_RECIPIENT_EMAIL=recipient@example.com
SES_FROM_EMAIL=your-verified-email@example.com
```

---

## Option 3: Mailgun (Good for Transactional) 📧

**Best for:** Transactional emails, good deliverability

### Setup:
1. Sign up at [mailgun.com](https://www.mailgun.com)
2. Verify your domain (or use sandbox for testing)
3. Get API key from Settings → API Keys

### Install:
```bash
npm install mailgun.js
```

### Environment Variables:
```bash
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your-domain.com
SURVEY_RECIPIENT_EMAIL=recipient@example.com
```

---

## Option 4: Postmark (Best Deliverability) 🚀

**Best for:** Highest deliverability, simple API

### Setup:
1. Sign up at [postmarkapp.com](https://postmarkapp.com)
2. Create Server API Token
3. Verify sender signature

### Install:
```bash
npm install postmark
```

### Environment Variables:
```bash
POSTMARK_API_TOKEN=your_postmark_token
POSTMARK_FROM_EMAIL=your-verified-email@example.com
SURVEY_RECIPIENT_EMAIL=recipient@example.com
```

---

## Option 5: Brevo (Free Tier Available) 🆓

**Best for:** Free tier (300 emails/day), good for testing

### Setup:
1. Sign up at [brevo.com](https://www.brevo.com) (formerly Sendinblue)
2. Go to SMTP & API → API Keys
3. Create API key

### Install:
```bash
npm install @getbrevo/brevo
```

### Environment Variables:
```bash
BREVO_API_KEY=your_brevo_api_key
BREVO_FROM_EMAIL=your-verified-email@example.com
SURVEY_RECIPIENT_EMAIL=recipient@example.com
```

---

## Quick Comparison

| Service | Free Tier | Cost (after free) | Setup Difficulty | Deliverability |
|---------|-----------|-------------------|-------------------|----------------|
| **SendGrid** | 100/day | $19.95/mo (50k) | ⭐ Easy | ⭐⭐⭐⭐⭐ |
| **AWS SES** | None | $0.10/1k emails | ⭐⭐ Medium | ⭐⭐⭐⭐ |
| **Mailgun** | 5k/mo (3mo) | $35/mo (50k) | ⭐⭐ Medium | ⭐⭐⭐⭐⭐ |
| **Postmark** | None | $15/mo (10k) | ⭐ Easy | ⭐⭐⭐⭐⭐ |
| **Brevo** | 300/day | $25/mo (20k) | ⭐ Easy | ⭐⭐⭐⭐ |

---

## Recommendation

**For quick setup:** Use **SendGrid** (code already provided)
**For cost savings:** Use **AWS SES** (if you have AWS account)
**For best deliverability:** Use **Postmark**

---

## Troubleshooting Resend Issues

Before switching, check:
1. ✅ API key is correct
2. ✅ Email is verified in Resend dashboard
3. ✅ Domain is verified (if using custom domain)
4. ✅ Check Resend dashboard for bounce/spam reports
5. ✅ Check spam folder
6. ✅ Verify recipient email is correct

If emails are being sent but not received, it's likely a deliverability issue, not a service issue.

