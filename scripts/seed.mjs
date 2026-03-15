/**
 * Seed Script — नमो: भारत न्यूज़ 24
 * Run ONCE after deployment to create admin user + default categories.
 * Usage: node scripts/seed.mjs
 *
 * Requires env vars: NEXT_PUBLIC_SERVER_URL, ADMIN_EMAIL, ADMIN_PASSWORD
 */

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "namobharatlive24@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe@2024!";

async function post(path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/api${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`❌ POST ${path}`, data);
    return null;
  }
  return data;
}

async function seed() {
  console.log("\n🌱 Seeding नमो: भारत न्यूज़ 24...\n");

  // ── Step 1: Create first admin user ──────────────────────────────────────
  console.log("1️⃣  Creating admin user...");
  const userResult = await post("/users", {
    name: "Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "super-admin",
    isActive: true,
  });
  if (userResult?.doc) {
    console.log(`   ✅ Admin created: ${ADMIN_EMAIL}`);
  } else {
    console.log(`   ⚠️  Admin may already exist — continuing...`);
  }

  // ── Step 2: Login to get token ─────────────────────────────────────────
  console.log("2️⃣  Logging in...");
  const loginResult = await post("/users/login", {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const token = loginResult?.token;
  if (!token) {
    console.error("   ❌ Login failed. Check ADMIN_EMAIL and ADMIN_PASSWORD env vars.");
    process.exit(1);
  }
  console.log("   ✅ Logged in successfully");

  // ── Step 3: Create categories ──────────────────────────────────────────
  console.log("3️⃣  Creating categories...");

  const categories = [
    { name: "National",      nameHindi: "राष्ट्रीय",    slug: "national",      navOrder: 1, showInNav: true },
    { name: "States",        nameHindi: "राज्य",        slug: "states",        navOrder: 2, showInNav: true },
    { name: "Politics",      nameHindi: "राजनीति",      slug: "politics",      navOrder: 3, showInNav: true },
    { name: "Business",      nameHindi: "व्यापार",      slug: "business",      navOrder: 4, showInNav: true },
    { name: "Sports",        nameHindi: "खेल",           slug: "sports",        navOrder: 5, showInNav: true },
    { name: "Entertainment", nameHindi: "मनोरंजन",     slug: "entertainment", navOrder: 6, showInNav: true },
    { name: "Technology",    nameHindi: "तकनीक",       slug: "technology",    navOrder: 7, showInNav: true },
    { name: "Education",     nameHindi: "शिक्षा",       slug: "education",     navOrder: 8, showInNav: true },
    { name: "Lifestyle",     nameHindi: "जीवन-शैली",   slug: "lifestyle",     navOrder: 9, showInNav: true },
    { name: "Jobs",          nameHindi: "नौकरी",        slug: "jobs",          navOrder: 10, showInNav: true },
    { name: "Religion",      nameHindi: "धर्म",         slug: "religion",      navOrder: 11, showInNav: false },
    { name: "International", nameHindi: "अंतरराष्ट्रीय", slug: "international", navOrder: 12, showInNav: false },
  ];

  for (const cat of categories) {
    const r = await post("/categories", cat, token);
    if (r?.doc) console.log(`   ✅ Category: ${cat.nameHindi}`);
    else console.log(`   ⚠️  ${cat.nameHindi} may already exist`);
  }

  // ── Step 4: Create sample tags ─────────────────────────────────────────
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
    const r = await post("/tags", tag, token);
    if (r?.doc) console.log(`   ✅ Tag: ${tag.nameHindi}`);
  }

  // ── Step 5: Create sample locations ───────────────────────────────────
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
    await post("/locations", loc, token);
  }
  console.log("   ✅ Locations created");

  // ── Step 6: Create a sample welcome article ────────────────────────────
  console.log("6️⃣  Creating welcome article...");

  // First get national category id
  const catRes = await fetch(`${BASE}/api/categories?where[slug][equals]=national&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const catData = await catRes.json();
  const nationalId = catData.docs?.[0]?.id;

  if (nationalId) {
    await post(
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
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "हमारी टीम 24 घंटे, 7 दिन आपको ताजा खबरें देने के लिए काम करती है। राजनीति, खेल, मनोरंजन, व्यापार, तकनीक — हर विषय पर गहन कवरेज।",
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
      token
    );
    console.log("   ✅ Welcome article created");
  }

  console.log(`
╔══════════════════════════════════════════════════════════╗
║         🎉 Seed Complete! नमो: भारत न्यूज़ 24            ║
╠══════════════════════════════════════════════════════════╣
║  Admin URL:   ${BASE}/admin                
║  Admin Email: ${ADMIN_EMAIL}          
║  ⚠️  CHANGE YOUR PASSWORD IMMEDIATELY AFTER LOGIN!       ║
╚══════════════════════════════════════════════════════════╝
`);
}

seed().catch(console.error);
