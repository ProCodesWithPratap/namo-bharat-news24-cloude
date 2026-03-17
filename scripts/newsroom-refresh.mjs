/**
 * Newsroom Refresh Script (safe cleanup + verified content)
 *
 * Usage:
 * NEXT_PUBLIC_SERVER_URL=http://localhost:3000 \
 * ADMIN_EMAIL=... ADMIN_PASSWORD=... \
 * node scripts/newsroom-refresh.mjs
 */

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD. Provide both as environment variables.");
  process.exit(1);
}

const DELETE_PATTERNS = [
  /\btest\b/i,
  /\bdemo\b/i,
  /\bsample\b/i,
  /\bdummy\b/i,
  /\blorem\b/i,
  /\bplaceholder\b/i,
  /\bbroken\b/i,
  /\btemp\b/i,
  /\btodo\b/i,
  /\buntitled\b/i,
  /नमूना|डेमो|परीक्षण|टेस्ट|डमी/,
];

const ARCHIVE_HINTS = [/welcome to/i, /coming soon/i, /placeholder/i, /under construction/i, /स्वागत/];

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

function buildBodyFromParagraphs(paragraphs) {
  return {
    root: {
      type: "root",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        children: [{ type: "text", text, version: 1 }],
        version: 1,
      })),
      direction: null,
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

function classifyArticle(article) {
  const text = [article.headline, article.headlineHindi, article.slug, article.excerpt].filter(Boolean).join(" ");

  const deleteBucket = DELETE_PATTERNS.some((pattern) => pattern.test(text));
  if (deleteBucket) return "delete";

  const archiveBucket = ARCHIVE_HINTS.some((pattern) => pattern.test(text));
  if (archiveBucket) return "archive";

  return "keep";
}

async function getAllArticles(token) {
  let page = 1;
  let hasNextPage = true;
  const docs = [];

  while (hasNextPage) {
    const result = await request(`/articles?limit=100&page=${page}&depth=0`, { token });
    if (!result.ok) {
      throw new Error(`Failed to fetch articles page ${page}`);
    }

    docs.push(...(result.data?.docs || []));
    hasNextPage = Boolean(result.data?.hasNextPage);
    page += 1;
  }

  return docs;
}

async function ensureCategory(token, slug) {
  const result = await request(`/categories?where[slug][equals]=${slug}&limit=1`, { token });
  if (!result.ok) throw new Error(`Failed to fetch category: ${slug}`);
  return result.data?.docs?.[0] || null;
}

async function ensureArticle(token, categoryId) {
  const slug = "15th-finance-commission-grants-five-states-march-2026";
  const existing = await request(`/articles?where[slug][equals]=${slug}&limit=1`, { token });
  if (!existing.ok) throw new Error("Failed to check existing article");
  if (existing.data?.docs?.length) return { created: false, doc: existing.data.docs[0] };

  const payload = {
    headline: "Centre releases over Rs 1,789 crore to five states under 15th Finance Commission grants",
    headlineHindi: "केंद्र ने पांच राज्यों को 15वें वित्त आयोग के तहत 1,789 करोड़ रुपये से अधिक जारी किए",
    shortHeadline: "पांच राज्यों को 1,789 करोड़ रुपये से अधिक अनुदान",
    slug,
    deck: "पंचायती राज मंत्रालय के अनुसार राशि छत्तीसगढ़, गुजरात, मध्य प्रदेश, तेलंगाना और महाराष्ट्र के ग्रामीण स्थानीय निकायों के लिए जारी हुई।",
    excerpt:
      "पीआईबी के अनुसार, केंद्र ने वित्त वर्ष 2025-26 के दौरान पांच राज्यों के ग्रामीण स्थानीय निकायों को 15वें वित्त आयोग की मद में 1,789 करोड़ रुपये से अधिक जारी किए।",
    body: buildBodyFromParagraphs([
      "केंद्र सरकार ने पंचायती राज मंत्रालय के जरिए बताया है कि वित्त वर्ष 2025-26 में छत्तीसगढ़, गुजरात, मध्य प्रदेश, तेलंगाना और महाराष्ट्र के ग्रामीण स्थानीय निकायों के लिए 15वें वित्त आयोग के तहत 1,789 करोड़ रुपये से अधिक की राशि जारी की गई है।",
      "पीआईबी विज्ञप्ति के अनुसार यह आवंटन अलग-अलग किस्तों और अलग-अलग वित्तीय वर्षों से जुड़े रुके हुए हिस्सों को शामिल करता है। सरकार का कहना है कि इन अनुदानों का उद्देश्य ग्रामीण स्थानीय शासन की क्षमता को मजबूत करना है।",
      "रिलीज के मुताबिक छत्तीसगढ़, गुजरात, मध्य प्रदेश, तेलंगाना और महाराष्ट्र को राज्यवार किस्तें जारी हुई हैं। केंद्र ने यह भी दोहराया है कि अबद्ध और बंधित अनुदानों का उपयोग संविधान की ग्यारहवीं अनुसूची के दायरे वाली स्थानीय जरूरतों, स्वच्छता और पेयजल जैसी बुनियादी सेवाओं पर किया जाना है।",
      "स्रोत: प्रेस सूचना ब्यूरो (रिलीज आईडी 2241189), प्रविष्टि तिथि 17 मार्च 2026, पीआईबी दिल्ली।",
    ]),
    category: categoryId,
    status: "published",
    publishDate: "2026-03-17T14:48:00.000Z",
    featured: true,
    language: "hi",
    sourceCredits: "Press Information Bureau (PIB)",
    editorialNotes:
      "Source log: https://pib.gov.in/PressReleaseIframePage.aspx?PRID=2241189 (official PIB release). Image policy: no hero media attached to avoid copyright risk.",
    seo: {
      metaTitle: "15वें वित्त आयोग के तहत पांच राज्यों को 1,789 करोड़ रुपये से अधिक",
      metaDescription:
        "पीआईबी के अनुसार केंद्र ने छत्तीसगढ़, गुजरात, मध्य प्रदेश, तेलंगाना और महाराष्ट्र के ग्रामीण स्थानीय निकायों को 15वें वित्त आयोग के तहत 1,789 करोड़ रुपये से अधिक जारी किए।",
    },
  };

  const created = await request("/articles", { method: "POST", body: payload, token });
  if (!created.ok) {
    throw new Error(`Failed to create article: ${JSON.stringify(created.data)}`);
  }

  return { created: true, doc: created.data?.doc || created.data };
}

async function run() {
  console.log("\n🧹 Safe newsroom refresh\n");

  const login = await request("/users/login", {
    method: "POST",
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });

  const token = login.data?.token;
  if (!login.ok || !token) {
    console.error("❌ Login failed. Verify ADMIN_EMAIL and ADMIN_PASSWORD.");
    process.exit(1);
  }

  const articles = await getAllArticles(token);
  const buckets = { delete: [], archive: [], keep: [] };

  for (const article of articles) {
    buckets[classifyArticle(article)].push(article);
  }

  console.log("A) Cleanup audit");
  console.log("- delete:", buckets.delete.map((a) => `${a.id}:${a.slug}`).join(", ") || "none");
  console.log("- archive/unpublish:", buckets.archive.map((a) => `${a.id}:${a.slug}`).join(", ") || "none");
  console.log("- keep:", buckets.keep.map((a) => `${a.id}:${a.slug}`).join(", ") || "none");

  for (const article of buckets.delete) {
    await request(`/articles/${article.id}`, { method: "DELETE", token });
  }

  for (const article of buckets.archive) {
    await request(`/articles/${article.id}`, {
      method: "PATCH",
      token,
      body: {
        status: "unpublished",
        editorialNotes: `${article.editorialNotes || ""}\nAuto-cleanup: moved to unpublished during safe newsroom refresh.`,
      },
    });
  }

  const national = await ensureCategory(token, "national");
  if (!national) {
    console.log("⚠️ National category not found; skipped article creation.");
    return;
  }

  const publishResult = await ensureArticle(token, national.id);
  console.log(
    publishResult.created
      ? `✅ Published article: ${publishResult.doc?.slug}`
      : `ℹ️ Article already exists: ${publishResult.doc?.slug}`,
  );
}

run().catch((error) => {
  console.error("❌ Newsroom refresh failed", error);
  process.exit(1);
});
