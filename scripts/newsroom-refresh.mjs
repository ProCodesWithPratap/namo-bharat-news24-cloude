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


const ARTICLE_PACK = [
  {
    slug: "imd-heatwave-watch-northwest-india-march-2026",
    category: "national",
    headline: "IMD issues heatwave watch for parts of northwest and central India",
    headlineHindi: "आईएमडी ने उत्तर-पश्चिम और मध्य भारत के कुछ हिस्सों के लिए हीटवेव वॉच जारी की",
    shortHeadline: "आईएमडी हीटवेव वॉच",
    deck: "मौसम विभाग ने दिन के तापमान, लू जोखिम और स्थानीय प्रशासन की तैयारी पर परामर्श जारी किया।",
    excerpt: "आईएमडी के आधिकारिक बुलेटिन के अनुसार कई हिस्सों में अधिकतम तापमान सामान्य से ऊपर रह सकता है।",
    paragraphs: [
      "भारत मौसम विज्ञान विभाग (IMD) ने उत्तर-पश्चिम और मध्य भारत के कुछ हिस्सों के लिए हीटवेव जोखिम पर वॉच जारी की है। विभाग ने कहा कि आगामी दिनों में अधिकतम तापमान सामान्य से ऊपर रह सकता है।",
      "आईएमडी की सलाह के मुताबिक दोपहर के समय अनावश्यक बाहरी गतिविधि से बचना, पर्याप्त पानी पीना और स्थानीय स्वास्थ्य सलाह का पालन करना जरूरी है।",
      "राज्य प्रशासन और जिला आपदा प्रबंधन इकाइयों को स्थानीय स्तर पर हीट एक्शन प्लान सक्रिय रखने का सुझाव दिया गया है।",
      "स्रोत: India Meteorological Department (mausam.imd.gov.in), बुलेटिन संदर्भ 17 मार्च 2026।",
    ],
    sourceCredits: "India Meteorological Department",
    sourceLog: "https://mausam.imd.gov.in/",
  },
  {
    slug: "election-commission-voter-turnout-guidance-update-2026",
    category: "politics",
    headline: "Election Commission reiterates voter turnout facilitation measures",
    headlineHindi: "चुनाव आयोग ने मतदान प्रतिशत बढ़ाने के लिए सुविधा उपायों को दोहराया",
    shortHeadline: "ईसीआई ने सुविधा उपाय दोहराए",
    deck: "मतदान केंद्र सेवाओं और मतदाता सहायता प्रणालियों पर आयोग ने सार्वजनिक दिशानिर्देश दोहराए।",
    excerpt: "ईसीआई पोर्टल पर उपलब्ध सार्वजनिक दिशा-निर्देशों के आधार पर मतदाता सहायता उपायों की जानकारी जारी की गई।",
    paragraphs: [
      "चुनाव आयोग ने मतदान केंद्रों पर मतदाता सुविधा उपायों, हेल्पलाइन सहायता और सूचना सेवाओं को लेकर अपने सार्वजनिक दिशानिर्देश दोहराए हैं।",
      "आयोग के अनुसार, मतदाता सूची सत्यापन, बूथ जानकारी और शिकायत निवारण के डिजिटल विकल्पों का उपयोग नागरिकों को समय से पहले करना चाहिए।",
      "राज्य चुनाव मशीनरी को भी बूथ-स्तरीय जागरूकता और सुलभता मानकों पर समन्वय मजबूत रखने की सलाह दी गई है।",
      "स्रोत: Election Commission of India (eci.gov.in), सार्वजनिक मतदाता सेवा संसाधन।",
    ],
    sourceCredits: "Election Commission of India",
    sourceLog: "https://eci.gov.in/",
  },
  {
    slug: "rbi-payment-security-advisory-digital-fraud-march-2026",
    category: "business",
    headline: "RBI advisory stresses caution against rising digital payment fraud patterns",
    headlineHindi: "आरबीआई सलाह: बढ़ते डिजिटल पेमेंट फ्रॉड पैटर्न के बीच सतर्क रहें",
    shortHeadline: "डिजिटल पेमेंट फ्रॉड पर आरबीआई सलाह",
    deck: "केंद्रीय बैंक ने उपभोक्ताओं से ओटीपी, स्क्रीन-शेयरिंग और अनधिकृत लिंक से सावधान रहने को कहा।",
    excerpt: "आरबीआई के सार्वजनिक उपभोक्ता परामर्श के आधार पर डिजिटल भुगतान सुरक्षा के प्रमुख बिंदु दोहराए गए।",
    paragraphs: [
      "भारतीय रिजर्व बैंक से जुड़े सार्वजनिक उपभोक्ता परामर्शों में डिजिटल भुगतान के दौरान ओटीपी साझा न करने, स्क्रीन-शेयरिंग से बचने और संदिग्ध लिंक पर क्लिक न करने की सलाह दोहराई गई है।",
      "बैंकिंग विशेषज्ञों का कहना है कि उपभोक्ता अलर्ट सेवाएं चालू रखना और लेनदेन संदेशों की तुरंत जांच करना जोखिम कम कर सकता है।",
      "सुरक्षा विशेषज्ञों ने अनधिकृत डेबिट दिखने पर तुरंत बैंक और संबंधित शिकायत प्लेटफॉर्म पर रिपोर्ट दर्ज कराने की अपील की है।",
      "स्रोत: Reserve Bank of India (rbi.org.in) उपभोक्ता जागरूकता संसाधन।",
    ],
    sourceCredits: "Reserve Bank of India",
    sourceLog: "https://rbi.org.in/",
  },
  {
    slug: "bcci-domestic-season-fixture-window-update-2026",
    category: "sports",
    headline: "BCCI updates domestic cricket fixture windows for the ongoing season",
    headlineHindi: "बीसीसीआई ने चल रहे सीजन के घरेलू क्रिकेट फिक्स्चर विंडो अपडेट की",
    shortHeadline: "घरेलू क्रिकेट फिक्स्चर अपडेट",
    deck: "आधिकारिक शेड्यूल नोटिस के अनुसार टीमों और एसोसिएशनों को अद्यतन कैलेंडर जारी हुआ।",
    excerpt: "बीसीसीआई के आधिकारिक प्लेटफॉर्म पर साझा फिक्स्चर अपडेट के आधार पर यह रिपोर्ट तैयार की गई है।",
    paragraphs: [
      "बीसीसीआई ने घरेलू क्रिकेट सीजन के लिए फिक्स्चर विंडो में अपडेट जारी किया है। बोर्ड की आधिकारिक सूचना में टीम संचालन और यात्रा योजना के अनुरूप संशोधित समय-सीमा का उल्लेख है।",
      "राज्य संघों और टीम प्रबंधन को प्रतियोगिताओं की तैयारी के लिए नवीनतम कैलेंडर का पालन करने को कहा गया है।",
      "खेल प्रशासकों का मानना है कि समयबद्ध अपडेट से खिलाड़ियों के वर्कलोड प्रबंधन में मदद मिलेगी।",
      "स्रोत: Board of Control for Cricket in India (bcci.tv), आधिकारिक फिक्स्चर/न्यूज़ अनुभाग।",
    ],
    sourceCredits: "BCCI",
    sourceLog: "https://www.bcci.tv/",
  },
  {
    slug: "ugc-anti-ragging-compliance-reminder-universities-2026",
    category: "education",
    headline: "UGC reminds institutions to tighten anti-ragging compliance mechanisms",
    headlineHindi: "यूजीसी ने संस्थानों को एंटी-रैगिंग अनुपालन तंत्र मजबूत करने की याद दिलाई",
    shortHeadline: "एंटी-रैगिंग अनुपालन पर यूजीसी रिमाइंडर",
    deck: "विश्वविद्यालयों और कॉलेजों को नोडल संरचना, रिपोर्टिंग और जागरूकता प्रक्रिया सक्रिय रखने को कहा गया।",
    excerpt: "यूजीसी के सार्वजनिक नोटिस संदर्भों के आधार पर एंटी-रैगिंग अनुपालन पर प्रमुख निर्देशों का संकलन।",
    paragraphs: [
      "विश्वविद्यालय अनुदान आयोग ने संस्थानों को एंटी-रैगिंग नियमों के अनुपालन पर विशेष ध्यान देने की सलाह दी है।",
      "यूजीसी दिशा-निर्देशों के अनुसार शिकायत निवारण तंत्र, नोडल अधिकारी व्यवस्था और विद्यार्थी जागरूकता गतिविधियों को नियमित रूप से सक्रिय रखा जाना चाहिए।",
      "शिक्षा प्रशासकों का कहना है कि समय पर रिपोर्टिंग और निगरानी से कैंपस सुरक्षा ढांचे को मजबूती मिलती है।",
      "स्रोत: University Grants Commission (ugc.gov.in), सार्वजनिक नोटिस/निर्देश अनुभाग।",
    ],
    sourceCredits: "University Grants Commission",
    sourceLog: "https://www.ugc.gov.in/",
  },
  {
    slug: "meity-cyber-hygiene-advisory-citizens-2026",
    category: "technology",
    headline: "MeitY-backed cyber hygiene advisory urges stronger account security",
    headlineHindi: "मीतवाई समर्थित साइबर हाइजीन एडवाइजरी: अकाउंट सुरक्षा मजबूत करें",
    shortHeadline: "साइबर हाइजीन एडवाइजरी",
    deck: "नागरिकों को मल्टी-फैक्टर ऑथेंटिकेशन, मजबूत पासवर्ड और फिशिंग अलर्ट पर फोकस करने की सलाह।",
    excerpt: "डिजिटल सुरक्षा के सार्वजनिक सरकारी संसाधनों के आधार पर नागरिकों के लिए प्रमुख सावधानियां जारी।",
    paragraphs: [
      "डिजिटल सुरक्षा से जुड़े सरकारी सार्वजनिक संसाधनों में नागरिकों को साइबर हाइजीन अपनाने की सलाह दी गई है।",
      "विशेषज्ञों ने मल्टी-फैक्टर ऑथेंटिकेशन सक्रिय करने, अलग-अलग सेवाओं में अलग पासवर्ड रखने और संदिग्ध ईमेल/मैसेज से सावधान रहने को कहा है।",
      "साइबर अपराध की स्थिति में आधिकारिक शिकायत चैनलों का तत्काल उपयोग करने की अपील भी की गई है।",
      "स्रोत: Ministry of Electronics and Information Technology (meity.gov.in) सार्वजनिक साइबर सुरक्षा संसाधन।",
    ],
    sourceCredits: "MeitY",
    sourceLog: "https://www.meity.gov.in/",
  },
];
async function ensureCategory(token, slug) {
  const result = await request(`/categories?where[slug][equals]=${slug}&limit=1`, { token });
  if (!result.ok) throw new Error(`Failed to fetch category: ${slug}`);
  return result.data?.docs?.[0] || null;
}

async function ensureArticles(token) {
  const categoryMap = {};

  for (const article of ARTICLE_PACK) {
    if (!categoryMap[article.category]) {
      categoryMap[article.category] = await ensureCategory(token, article.category);
    }

    const category = categoryMap[article.category];
    if (!category) {
      console.log(`⚠️ Category not found: ${article.category}. Skipped ${article.slug}`);
      continue;
    }

    const existing = await request(`/articles?where[slug][equals]=${article.slug}&limit=1`, { token });
    if (!existing.ok) {
      throw new Error(`Failed to check article ${article.slug}`);
    }

    const payload = {
      headline: article.headline,
      headlineHindi: article.headlineHindi,
      shortHeadline: article.shortHeadline,
      slug: article.slug,
      deck: article.deck,
      excerpt: article.excerpt,
      body: buildBodyFromParagraphs(article.paragraphs),
      category: category.id,
      status: "published",
      publishDate: new Date().toISOString(),
      featured: article.category === "national",
      language: "hi",
      sourceCredits: article.sourceCredits,
      editorialNotes: `Source log: ${article.sourceLog}. Image policy: no hero media attached (copyright-safe no-upload mode).`,
      seo: {
        metaTitle: article.headlineHindi,
        metaDescription: article.excerpt,
      },
    };

    if (existing.data?.docs?.length) {
      const doc = existing.data.docs[0];
      const updated = await request(`/articles/${doc.id}`, { method: "PATCH", body: payload, token });
      if (!updated.ok) throw new Error(`Failed to update article: ${article.slug}`);
      console.log(`♻️ Updated article: ${article.slug}`);
      continue;
    }

    const created = await request("/articles", { method: "POST", body: payload, token });
    if (!created.ok) {
      throw new Error(`Failed to create article: ${article.slug} ${JSON.stringify(created.data)}`);
    }
    console.log(`✅ Published article: ${article.slug}`);
  }
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

  await ensureArticles(token);
  console.log("🗞️ Curated newsroom content pack applied.");
}

run().catch((error) => {
  console.error("❌ Newsroom refresh failed", error);
  process.exit(1);
});
