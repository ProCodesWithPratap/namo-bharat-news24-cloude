/**
 * Seed Script — नमो: भारत न्यूज़ 24
 * Usage: NEXT_PUBLIC_SERVER_URL=http://localhost:3000 ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/seed.mjs
 */

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD. Provide both as environment variables.");
  process.exit(1);
}

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function createIfMissing(path, body, token, label) {
  const result = await request(path, { method: "POST", body, token });

  if (result.ok) {
    console.log(`   ✅ ${label}`);
    return result.data;
  }

  if (result.status === 409 || result.status === 400) {
    console.log(`   ⚠️  ${label} already exists — skipping`);
    return null;
  }

  console.error(`   ❌ Failed to create ${label}`, result.data?.errors || result.data);
  return null;
}

async function seed() {
  console.log("\n🌱 Seeding नमो: भारत न्यूज़ 24...\n");

  console.log("1️⃣  Creating first admin user if needed...");
  const userResult = await createIfMissing(
    "/users",
    {
      name: "Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "super-admin",
      isActive: true,
    },
    undefined,
    `Admin user (${ADMIN_EMAIL})`,
  );

  if (!userResult) {
    console.log("   ℹ️  Admin not created during this run (existing user or validation). Continuing to login...");
  }

  console.log("2️⃣  Logging in...");
  const loginResult = await request("/users/login", {
    method: "POST",
    body: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  });

  const token = loginResult.data?.token;
  if (!loginResult.ok || !token) {
    console.error("   ❌ Login failed. Verify ADMIN_EMAIL and ADMIN_PASSWORD.");
    process.exit(1);
  }
  console.log("   ✅ Logged in successfully");

  console.log("3️⃣  Creating categories...");
  const categories = [
    { name: "National", nameHindi: "राष्ट्रीय", slug: "national", navOrder: 1, showInNav: true },
    { name: "States", nameHindi: "राज्य", slug: "states", navOrder: 2, showInNav: true },
    { name: "Politics", nameHindi: "राजनीति", slug: "politics", navOrder: 3, showInNav: true },
    { name: "Business", nameHindi: "व्यापार", slug: "business", navOrder: 4, showInNav: true },
    { name: "Sports", nameHindi: "खेल", slug: "sports", navOrder: 5, showInNav: true },
    { name: "Entertainment", nameHindi: "मनोरंजन", slug: "entertainment", navOrder: 6, showInNav: true },
    { name: "Technology", nameHindi: "तकनीक", slug: "technology", navOrder: 7, showInNav: true },
    { name: "Education", nameHindi: "शिक्षा", slug: "education", navOrder: 8, showInNav: true },
    { name: "Lifestyle", nameHindi: "जीवन-शैली", slug: "lifestyle", navOrder: 9, showInNav: true },
    { name: "Jobs", nameHindi: "नौकरी", slug: "jobs", navOrder: 10, showInNav: true },
    { name: "Religion", nameHindi: "धर्म", slug: "religion", navOrder: 11, showInNav: false },
    { name: "International", nameHindi: "अंतरराष्ट्रीय", slug: "international", navOrder: 12, showInNav: false },
  ];

  for (const cat of categories) {
    await createIfMissing("/categories", cat, token, `Category: ${cat.nameHindi}`);
  }

  console.log("4️⃣  Creating sample tags...");
  const tags = [
    { name: "Modi", nameHindi: "मोदी", slug: "modi" },
    { name: "BJP", nameHindi: "बीजेपी", slug: "bjp" },
    { name: "Congress", nameHindi: "कांग्रेस", slug: "congress" },
    { name: "Cricket", nameHindi: "क्रिकेट", slug: "cricket" },
    { name: "IPL", nameHindi: "आईपीएल", slug: "ipl" },
    { name: "Economy", nameHindi: "अर्थव्यवस्था", slug: "economy" },
    { name: "Delhi", nameHindi: "दिल्ली", slug: "delhi" },
    { name: "Uttar Pradesh", nameHindi: "उत्तर प्रदेश", slug: "uttar-pradesh" },
    { name: "Bihar", nameHindi: "बिहार", slug: "bihar" },
    { name: "Jharkhand", nameHindi: "झारखंड", slug: "jharkhand" },
  ];

  for (const tag of tags) {
    await createIfMissing("/tags", tag, token, `Tag: ${tag.nameHindi}`);
  }

  console.log("5️⃣  Creating sample locations...");
  const locations = [
    { name: "India", nameHindi: "भारत", slug: "india", type: "country" },
    { name: "Delhi", nameHindi: "दिल्ली", slug: "delhi-loc", type: "state" },
    { name: "Uttar Pradesh", nameHindi: "उत्तर प्रदेश", slug: "up", type: "state" },
    { name: "Bihar", nameHindi: "बिहार", slug: "bihar-loc", type: "state" },
    { name: "Jharkhand", nameHindi: "झारखंड", slug: "jharkhand-loc", type: "state" },
    { name: "Maharashtra", nameHindi: "महाराष्ट्र", slug: "maharashtra", type: "state" },
    { name: "Rajasthan", nameHindi: "राजस्थान", slug: "rajasthan", type: "state" },
    { name: "Madhya Pradesh", nameHindi: "मध्य प्रदेश", slug: "mp", type: "state" },
    { name: "Bokaro", nameHindi: "बोकारो", slug: "bokaro", type: "city", state: "Jharkhand" },
  ];

  for (const loc of locations) {
    await createIfMissing("/locations", loc, token, `Location: ${loc.nameHindi}`);
  }

  console.log("6️⃣  Creating welcome article if needed...");
  const catRes = await request("/categories?where[slug][equals]=national&limit=1", { token });
  const nationalId = catRes.data?.docs?.[0]?.id;

  if (nationalId) {
    await createIfMissing(
      "/articles",
      {
        headline: "Welcome to Namo Bharat News 24",
        headlineHindi: "नमो: भारत न्यूज़ 24 में आपका स्वागत है!",
        slug: "welcome-namo-bharat-news-24",
        deck: "भारत की सबसे तेज़, सबसे सच्ची हिंदी न्यूज़ पोर्टल",
        excerpt: "नमो: भारत न्यूज़ 24 आपको भारत और दुनिया की ताजा खबरें, ब्रेकिंग न्यूज़ और गहन विश्लेषण देता है।",
        body: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "नमो: भारत न्यूज़ 24 में आपका हार्दिक स्वागत है। हम आपको भारत और दुनिया की सबसे तेज़ और सबसे सच्ची खबरें देने के लिए प्रतिबद्ध हैं।",
                    version: 1,
                  },
                ],
                version: 1,
              },
            ],
            direction: null,
            format: "",
            indent: 0,
            version: 1,
          },
        },
        category: nationalId,
        status: "published",
        publishDate: new Date().toISOString(),
        featured: true,
        language: "hi",
      },
      token,
      "Welcome article",
    );
  } else {
    console.log("   ⚠️  National category not found, skipping welcome article");
  }

  console.log(`\n✅ Seed complete. Admin: ${BASE}/admin\n`);
}

seed().catch((error) => {
  console.error("❌ Seed failed", error);
  process.exit(1);
});
