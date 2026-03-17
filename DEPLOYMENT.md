# नमो: भारत न्यूज़ 24 — Deployment Guide

## 1) साइट खाली क्यों दिखती है?
जब `NEXT_PUBLIC_SERVER_URL` Vercel पर सेट नहीं होता, तो API URL गलत बनता है और server components में relative fetch (`/api/...`) fail हो जाता है। इसका असर:
- article list खाली आती है
- slug missing होने से URL `/article/undefined` बनता है

**Fix:** Vercel में `NEXT_PUBLIC_SERVER_URL` को exact production URL (https सहित) पर सेट करें।

---

## 2) Vercel Environment Variables (11 required)

| Variable | Required | कहाँ से मिलेगा | Example |
|---|---|---|---|
| `DATABASE_URI` | ✅ | Railway MongoDB | `mongodb+srv://...` |
| `PAYLOAD_SECRET` | ✅ | खुद generate करें (`openssl rand -base64 32`) | random secret |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | Vercel domain | `https://namo-bharat-news24-cloude.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | ✅ | Vercel Storage → Blob | `vercel_blob_rw_...` |
| `ANTHROPIC_API_KEY` | recommended | Anthropic Console | `sk-ant-...` |
| `OPENAI_API_KEY` | fallback | OpenAI Dashboard | `sk-...` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | optional | GA4 property | `G-XXXXXXX` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | ✅ | Editorial/ops email | `contact@...` |
| `NEXT_PUBLIC_EDITORIAL_EMAIL` | ✅ | Editorial email | `editorial@...` |
| `ADMIN_EMAIL` | seed only | आपके द्वारा तय | `admin@...` |
| `ADMIN_PASSWORD` | seed only | आपके द्वारा तय | strong password |

> Optional: `OPENAI_MODEL=gpt-4o-mini`

---

## 3) Railway MongoDB URI कैसे लें
1. Railway dashboard खोलें
2. MongoDB service चुनें
3. **Connect / Variables** में जाएँ
4. connection string copy करें
5. इसे Vercel में `DATABASE_URI` में paste करें

---

## 4) Vercel Blob Storage setup
1. Vercel Project → **Storage**
2. **Create Blob Store**
3. Blob token generate करें
4. token को `BLOB_READ_WRITE_TOKEN` में set करें

---

## 5) Env var बदलने के बाद redeploy कैसे करें
1. Vercel → Project → **Settings → Environment Variables**
2. values update करें
3. **Deployments** टैब में जाएँ
4. latest deployment पर **Redeploy** क्लिक करें
5. build logs में env load और successful build confirm करें

---

## 6) Seed script चलाना
```bash
npm run seed
```
- इससे initial admin user और sample records insert हो सकते हैं (project config अनुसार)
- `ADMIN_EMAIL` और `ADMIN_PASSWORD` पहले set हों

---

## 7) पहला article `/admin` से publish करना
1. `/admin` खोलें
2. admin credentials से login करें
3. **Articles** collection खोलें
4. Hindi headline, slug, category, hero image भरें
5. status = `published`
6. publish date सेट करें
7. **Save & Publish** करें
8. साइट पर article URL verify करें (`/article/<slug>`)

---

## 8) Google Analytics 4 setup
1. analytics.google.com में GA4 property बनाएं
2. Data Stream से Measurement ID लें (`G-...`)
3. Vercel env में `NEXT_PUBLIC_GA_MEASUREMENT_ID` set करें
4. redeploy करें
5. GA4 Realtime report में traffic verify करें

---

## 9) Sitemap को Google Search Console में submit करना
1. Search Console में domain verify करें
2. **Sitemaps** सेक्शन खोलें
3. `https://your-domain.com/sitemap.xml` submit करें
4. status “Success” आने तक monitor करें

---

## 10) AI Chatbot configuration (Anthropic vs OpenAI)
- अगर `ANTHROPIC_API_KEY` set है, chatbot पहले Anthropic Claude call करेगा
- Anthropic fail होने पर OpenAI fallback चलेगा (यदि `OPENAI_API_KEY` उपलब्ध हो)
- OpenAI model default: `gpt-4o-mini`

---

## 11) Final Deployment Checklist
- [ ] `NEXT_PUBLIC_SERVER_URL` exact production URL के साथ set है
- [ ] Railway `DATABASE_URI` verified है
- [ ] `PAYLOAD_SECRET` strong है
- [ ] Blob token configured है
- [ ] कम से कम एक article published है
- [ ] `/sitemap.xml` खुल रहा है
- [ ] `/feed.xml` खुल रहा है
- [ ] `/rss.xml` से `/feed.xml` redirect काम कर रहा है
- [ ] chatbot response दे रहा है
- [ ] GA4 realtime tracking दिख रही है
