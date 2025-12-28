# Deployment Guide - How to See Files When Deployed

## The Problem
When you deploy to Vercel/Netlify/etc., the filesystem is **read-only** or **ephemeral**. Files saved locally won't persist or be accessible.

## Solution: Use Email for Production ✅

The app now automatically uses **email** in production and **JSON files** in development.

### Setup for Production:

#### Step 1: Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 3,000 emails/month)
3. Go to **API Keys** section
4. Click **"Create API Key"**
5. Copy the key (starts with `re_`)

#### Step 2: Add Environment Variables

In your deployment platform (Vercel/Netlify):

**Vercel:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=Survey <your-email@yourdomain.com>
   SURVEY_RECIPIENT_EMAIL=your-email@example.com
   ```

**Netlify:**
1. Go to **Site settings** → **Environment variables**
2. Add the same variables

**Other platforms:** Add environment variables in their settings

#### Step 3: Deploy

That's it! The app will automatically:
- Use **email** in production
- Use **JSON files** in development (local)

---

## Alternative: Use a Database (For Better Data Management)

If you want to store and query responses, use a database:

### Option 1: Supabase (Recommended - Free) 🗄️

**Setup (5 minutes):**

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run:
   ```sql
   CREATE TABLE survey_responses (
     id BIGSERIAL PRIMARY KEY,
     name TEXT,
     email TEXT,
     role TEXT,
     product TEXT,
     proud_of JSONB,
     meaningful_impact TEXT,
     struggles TEXT,
     work_harder TEXT,
     learned TEXT,
     growth_unsupported TEXT,
     feedback_comfort TEXT,
     feedback_comfort_reason TEXT,
     feedback_stops JSONB,
     feedback_stops_other TEXT,
     feedback_received TEXT,
     feedback_received_reason TEXT,
     feedback_easier TEXT,
     leadership_different TEXT,
     leadership_value TEXT,
     great_year TEXT,
     anything_else TEXT,
     submitted_at TIMESTAMP DEFAULT NOW()
   );
   ```
4. Get your **Project URL** and **anon key** from Settings → API
5. Add to environment variables:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJxxxxx
   ```
6. Install: `npm install @supabase/supabase-js`
7. Create API route to save to Supabase

**Pros:**
- ✅ Free tier
- ✅ Easy to query/export
- ✅ Can build admin dashboard
- ✅ Real database

---

### Option 2: MongoDB Atlas (Free) 🍃

Similar setup, uses MongoDB instead.

---

## Current Setup Summary

### Development (Local):
- ✅ Saves to `survey-responses/` folder
- ✅ View files directly
- ✅ No setup needed

### Production (Deployed):
- ✅ Sends email via Resend
- ✅ You receive email with each response
- ✅ Just need Resend API key

---

## Quick Setup Checklist

For production deployment:

- [ ] Sign up for Resend
- [ ] Get API key
- [ ] Add `RESEND_API_KEY` to environment variables
- [ ] Add `RESEND_FROM_EMAIL` (your email)
- [ ] Add `SURVEY_RECIPIENT_EMAIL` (where to send responses)
- [ ] Deploy!

---

## Viewing Responses in Production

### With Email:
- Check your email inbox
- Each response = one email
- Easy to forward/share

### With Database (if you set it up):
- Query via Supabase dashboard
- Export to CSV/Excel
- Build admin panel

---

## Recommendation

**Start with Email** - it's the simplest and works immediately!

Then if you need to analyze data later, add Supabase.
