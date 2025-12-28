# How to Find Your Supabase Project URL

## Quick Method

If you see this in your browser:
```
https://supabase.com/dashboard/project/pjbzhdxxxxx
```

Your **Project URL** is:
```
https://pjbzhdxxxxx.supabase.co
```

**Just replace:**
- `supabase.com/dashboard/project/` → `supabase.co`
- Keep the project ID part (like `pjbzhdxxxxx`)

---

## Step-by-Step

### Step 1: Get Project ID from Dashboard URL

1. Look at your browser address bar when you're in Supabase
2. You'll see something like:
   ```
   https://supabase.com/dashboard/project/pjbzhdxxxxx
   ```
3. The part after `/project/` is your **Project ID**
   - In the example above: `pjbzhdxxxxx` is the Project ID

### Step 2: Construct Project URL

Your Project URL format is:
```
https://[PROJECT_ID].supabase.co
```

So if your Project ID is `pjbzhdxxxxx`, your Project URL is:
```
https://pjbzhdxxxxx.supabase.co
```

---

## Alternative: Find in Settings

1. Go to **Settings** (gear icon) → **API**
2. Look for a field labeled:
   - **"Project URL"**, OR
   - **"URL"**, OR
   - **"API URL"**
3. It should show: `https://xxxxx.supabase.co`

---

## What You Need for Environment Variables

Once you have your Project URL, add to `.env.local`:

```bash
SUPABASE_URL=https://pjbzhdxxxxx.supabase.co
```

Replace `pjbzhdxxxxx` with your actual project ID.

---

## Example

**Dashboard URL:**
```
https://supabase.com/dashboard/project/abcdefghijklmnop12345
```

**Project ID:**
```
abcdefghijklmnop12345
```

**Project URL (what you need):**
```
https://abcdefghijklmnop12345.supabase.co
```

---

## Still Can't Find It?

1. Go to **Settings** → **API**
2. Look for any field that shows a URL ending in `.supabase.co`
3. That's your Project URL!

Or check the **"Project Settings"** or **"General"** section - sometimes it's shown there.
