# नमो: भारत न्यूज़ 24 — Setup Guide

## Stack
- **Frontend**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3 (embedded)
- **Database**: MongoDB Atlas
- **Hosting**: Vercel
- **Media**: Vercel Blob Storage
- **CDN/WAF**: Cloudflare (optional but recommended)

---

## 🚀 Complete Deployment Steps

### STEP 1 — MongoDB Atlas (Database)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up (free)
3. Create a **free M0 cluster** → choose region **Mumbai (ap-south-1)**
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string — looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add `/news-portal` before the `?` so it becomes:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/news-portal?retryWrites=true&w=majority
   ```
8. Under **Network Access** → click **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)

---

### STEP 2 — GitHub

1. Go to [https://github.com/new](https://github.com/new)
2. Create repo named: `namo-bharat-news-24`
3. Keep it **Private** (recommended)
4. **Don't** add README or .gitignore (already in the code)
5. Run these commands from your downloaded project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Namo Bharat News 24"
   git branch -M main
   git remote add origin https://github.com/ProCodesWithPratap/namo-bharat-news-24.git
   git push -u origin main
   ```

---

### STEP 3 — Vercel Deployment

1. Go to [https://vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New Project"** → Import `namo-bharat-news-24`
3. Framework: **Next.js** (auto-detected)
4. Root Directory: leave as `/`
5. Click **"Environment Variables"** and add ALL of these:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URI` | `mongodb+srv://...` (from Step 1) |
   | `PAYLOAD_SECRET` | Any 32-char random string — use: `openssl rand -base64 32` OR just type 32 random chars |
   | `NEXT_PUBLIC_SERVER_URL` | `https://your-domain.com` (your final domain) |
   | `BLOB_READ_WRITE_TOKEN` | Get from next step below |

6. **Vercel Blob Storage** (for media uploads):
   - In Vercel Dashboard → **Storage** tab → **Create Database** → **Blob**
   - Copy the `BLOB_READ_WRITE_TOKEN` value
   - Add it as env variable

7. Click **Deploy** — build takes ~3-5 minutes

---

### STEP 4 — Domain Setup

1. In Vercel: Go to your project → **Settings** → **Domains**
2. Add your domain (e.g. `namobharatnews24.com`)
3. Vercel will give you **2 DNS records** (A record + CNAME)
4. Go to your domain registrar → DNS settings → Add those records
5. Wait 5-30 minutes for DNS propagation

**Optional — Cloudflare (Strongly Recommended):**
1. Add site to Cloudflare (free)
2. Point your domain's nameservers to Cloudflare
3. In Cloudflare: SSL → Full (Strict)
4. Enable: Auto Minify, Brotli, HTTP/2
5. Create WAF rule: Rate limit `/api/users/login` to 5 req/min

---

### STEP 5 — Run Seed Script (Creates Admin + Categories)

After deployment, run this **once** from your computer:

```bash
# First install dependencies locally
npm install

# Then run seed
NEXT_PUBLIC_SERVER_URL=https://your-domain.com \
ADMIN_EMAIL=namobharatlive24@gmail.com \
ADMIN_PASSWORD=YourStrongPassword123! \
node scripts/seed.mjs
```

This creates:
- ✅ Admin account (namobharatlive24@gmail.com)
- ✅ All 12 categories (राष्ट्रीय, खेल, राजनीति, etc.)
- ✅ 10 sample tags
- ✅ 8 state locations  
- ✅ Welcome article

---

### STEP 6 — First Login & Change Password

1. Go to `https://your-domain.com/admin`
2. Login with: `namobharatlive24@gmail.com` + password you set in Step 5
3. **Immediately go to**: Account → Change Password → set a strong password
4. Start publishing!

---

## 📰 How to Publish Your First Article

1. Admin panel → **Articles** → **Create New**
2. Fill in:
   - **Headline** (English)
   - **Headline Hindi** (हिंदी शीर्षक)
   - **Category** (select from dropdown)
   - **Body** (rich text editor)
   - **Hero Image** (upload)
   - **Status** → change to **Published**
   - **Publish Date** → set to now
3. Click **Save**
4. Visit your website — article appears instantly!

---

## 👥 Adding Editorial Team Members

1. Admin → **Users** → **Create New**
2. Set their role:
   - **Reporter** — can create drafts
   - **Sub-Editor** — can edit and approve
   - **Section Editor** — can publish
   - **SEO Editor** — manages metadata
   - **Super Admin** — full access (only you)

---

## 🔥 Breaking News

1. Create/edit article
2. Check **"Breaking News"** checkbox
3. Set status to **Published**
4. The red ticker at the top of the website will automatically show it!

---

## 📺 Adding Videos

1. Admin → **Videos** → **Create New**
2. Paste YouTube URL in **"Embed URL"** field
3. Add title in Hindi, thumbnail, category
4. Publish → appears on `/videos` page and homepage video rail

---

## 📊 Google Analytics

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property for your domain
3. Copy Measurement ID (starts with `G-`)
4. In Vercel → Environment Variables → Add:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
5. Redeploy

---

## 🛡️ Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your domain
3. Verify via DNS (Cloudflare makes this easy)
4. Submit sitemap: `https://your-domain.com/sitemap.xml`

---

## Admin Panel URL

```
https://your-domain.com/admin
```

## CMS Collections Summary

| Collection | Purpose |
|-----------|---------|
| Articles | All news articles with full workflow |
| Categories | राष्ट्रीय, खेल, etc. |
| Authors | Journalist profiles |
| Media | Image/video library |
| Tags | Topic tags |
| Videos | Video news |
| Live Blogs | Live coverage |
| Web Stories | Visual stories |
| Ads | Ad management |
| Users | Editorial team |
| Locations | State/city tagging |

---

## Support

GitHub: [https://github.com/ProCodesWithPratap/namo-bharat-news-24](https://github.com/ProCodesWithPratap/namo-bharat-news-24)
