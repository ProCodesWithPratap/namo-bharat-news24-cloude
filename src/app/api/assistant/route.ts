import { getBreakingNews, getCategories, getFeaturedArticles, getLatestArticles } from "@/lib/api";
import { newsroomMeta, socialLinks } from "@/lib/site-config";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const runtime = "nodejs";

type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

type ArticleHint = {
  id: string;
  title: string;
  category: string;
  url: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  isBreaking: boolean;
  isFeatured: boolean;
};

type CategoryHint = {
  name: string;
  slug: string;
  url: string;
};

type AssistantIntent = "latest" | "national" | "trending" | "contact" | "today" | "general";

const MAX_MESSAGE_CHARS = 1200;
const MAX_HISTORY_ITEMS = 6;
const MAX_HISTORY_CHARS = 800;

function sanitizeText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.slice(0, maxLen);
}

function normalizeHistory(value: unknown): ChatHistoryItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const typed = item as { role?: string; content?: unknown };
      const role = typed.role === "assistant" ? "assistant" : "user";
      const content = sanitizeText(typed.content, MAX_HISTORY_CHARS);
      return content ? { role, content } : null;
    })
    .filter(Boolean)
    .slice(-MAX_HISTORY_ITEMS) as ChatHistoryItem[];
}

async function buildNewsContext() {
  const [latest, featured, breaking, categories] = await Promise.all([
    getLatestArticles(10),
    getFeaturedArticles(6),
    getBreakingNews(5),
    getCategories({ showInNav: true, limit: 24 }),
  ]);

  const mapArticle = (article: any): ArticleHint => ({
    id: article.id,
    title: article.headlineHindi || article.headline || "Untitled",
    category: article.category?.name || article.category?.nameEn || "General",
    slug: article.slug,
    url: `${SITE_URL}/article/${article.slug}`,
    excerpt: sanitizeText(article.excerpt || article.summary || "", 220),
    publishDate: article.publishDate || article.updatedAt || article.createdAt || "",
    isBreaking: !!article.breakingNews,
    isFeatured: !!article.featured,
  });

  const latestArticles = (latest.docs || []).slice(0, 8).map(mapArticle);
  const featuredArticles = (featured.docs || []).slice(0, 4).map(mapArticle);
  const breakingArticles = (breaking.docs || []).slice(0, 4).map(mapArticle);

  const categoryList = (categories.docs || []).slice(0, 16).map((cat: any) => ({
    name: cat.name || cat.title || cat.slug,
    slug: cat.slug,
    url: `${SITE_URL}/${cat.slug}`,
  })) as CategoryHint[];

  return {
    latestArticles,
    featuredArticles,
    breakingArticles,
    categoryList,
  };
}

function detectIntent(query: string): AssistantIntent {
  const q = query.toLowerCase().trim();

  if (/(latest|लेटेस्ट|ताज़ा|ताजा|अभी|today|आज|breaking|headlines)/i.test(q)) return "latest";
  if (/(national|राष्ट्र|देश|india|भारत|राजनीति)/i.test(q)) return "national";
  if (/(trending|trend|viral|लोकप्रिय|ट्रेंडिंग|most read)/i.test(q)) return "trending";
  if (/(contact|संपर्क|email|फोन|address|ऑफिस)/i.test(q)) return "contact";
  if (/(आज की खबर|आज क्या|today news|aaj ki khabar)/i.test(q)) return "today";

  return "general";
}

function pickArticlesByIntent(
  intent: AssistantIntent,
  context: Awaited<ReturnType<typeof buildNewsContext>>,
): ArticleHint[] {
  const combined = [...context.breakingArticles, ...context.featuredArticles, ...context.latestArticles];
  if (intent === "trending") return [...context.breakingArticles, ...context.featuredArticles].slice(0, 6);
  if (intent === "latest" || intent === "today") return context.latestArticles.slice(0, 6);
  if (intent === "national") {
    const national = combined.filter((article) => /national|देश|भारत|india|राष्ट्र/i.test(article.category));
    return national.slice(0, 6);
  }
  return combined.slice(0, 6);
}

function pickSuggestions(query: string, context: Awaited<ReturnType<typeof buildNewsContext>>): ArticleHint[] {
  const intent = detectIntent(query);
  const q = query.toLowerCase();
  const combined = [...pickArticlesByIntent(intent, context), ...context.latestArticles];

  const keywordMatched = combined.filter((article) => {
    const hay = `${article.title} ${article.category} ${article.excerpt}`.toLowerCase();
    return q.split(" ").some((token) => token.length > 2 && hay.includes(token));
  });

  const unique = new Map<string, ArticleHint>();
  [...keywordMatched, ...combined].forEach((item) => {
    if (!unique.has(item.id)) unique.set(item.id, item);
  });

  return [...unique.values()].slice(0, 4);
}

function pickCategoryLinks(intent: AssistantIntent, categories: CategoryHint[]) {
  if (intent === "national") {
    return categories.filter((cat) => /national|देश|भारत|india|राष्ट्र/i.test(`${cat.name} ${cat.slug}`)).slice(0, 3);
  }

  if (intent === "trending") {
    return categories.filter((cat) => /video|live|sports|मनोरंजन|tech|web-stories/i.test(`${cat.name} ${cat.slug}`)).slice(0, 3);
  }

  return categories.slice(0, 3);
}

function createSystemPrompt(context: Awaited<ReturnType<typeof buildNewsContext>>) {
  return `You are AI News Desk assistant for ${SITE_NAME}, a Hindi-first news website.

Rules:
- Be concise, accurate, and newsroom-style.
- Prefer answers from provided site context.
- When recommending stories, always reference real article titles from context and include direct clickable links.
- If user asks for latest/trending/national/today, prioritize those matching buckets from context.
- Avoid generic filler. If you cannot answer exactly, provide the best available article recommendations from context.
- If information is missing in the provided context, clearly say the site data available right now does not contain it.
- Never claim access to unpublished, internal, private, or future data.
- Do not fabricate facts.
- Hindi first, but support bilingual responses if user writes in English.
- When relevant, suggest categories or article links from the context.

Site facts:
- Contact email: ${newsroomMeta.contactEmail}
- Editorial email: ${newsroomMeta.editorialEmail}
- Phone: ${newsroomMeta.phone}
- Address: ${newsroomMeta.address}
- Contact page: ${SITE_URL}/contact
- Social links: ${JSON.stringify(socialLinks)}

Content context JSON:
${JSON.stringify(context)}`;
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function buildFallbackReply(
  query: string,
  suggestions: ArticleHint[],
  categories: CategoryHint[],
  reason: "no-context" | "ai-unavailable" = "ai-unavailable",
) {
  const intent = detectIntent(query);
  const categoryLinks = pickCategoryLinks(intent, categories);

  if (!suggestions.length) {
    const categoryText = categoryLinks
      .map((cat) => `• ${cat.name}: ${cat.url}`)
      .join("\n");

    return {
      reply:
        `अभी साइट पर बहुत कम ताज़ा प्रकाशित खबरें उपलब्ध हैं। तब तक आप इन सेक्शनों से सीधे पढ़ सकते हैं:\n${categoryText || `• राष्ट्रीय: ${SITE_URL}/national\n• लाइव: ${SITE_URL}/live\n• वीडियो: ${SITE_URL}/videos`}\n\nआप चाहें तो मुझसे पूछें: "आज की खबर क्या है" या "ट्रेंडिंग खबरें"।`,
      articles: [],
      source: reason === "no-context" ? "fallback-no-context" : "safe-fallback",
    };
  }

  const lines = suggestions.slice(0, 3).map((article, index) => `${index + 1}. ${article.title} — ${article.url}`);

  return {
    reply:
      reason === "no-context"
        ? `इस समय सीमित डेटा मिला है, लेकिन अभी प्रकाशित खबरों में ये उपयोगी हैं:\n${lines.join("\n")}`
        : `AI मोड अस्थायी रूप से धीमा है। अभी के लिए प्रकाशित खबरों में ये सीधे पढ़ें:\n${lines.join("\n")}`,
    articles: suggestions,
    source: "safe-fallback",
  };
}

function extractResponseText(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  if (Array.isArray(payload?.output)) {
    const parts: string[] = [];
    for (const item of payload.output) {
      if (!Array.isArray(item?.content)) continue;
      for (const content of item.content) {
        if (content?.type === "output_text" && typeof content?.text === "string") {
          parts.push(content.text);
        }
      }
    }
    const merged = parts.join(" ").trim();
    if (merged) return merged;
  }
  return "";
}

async function requestOpenAIReply({
  apiKey,
  model,
  systemPrompt,
  history,
  message,
}: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  history: ChatHistoryItem[];
  message: string;
}) {
  const input = [
    {
      role: "system",
      content: [{ type: "input_text", text: systemPrompt }],
    },
    ...history.map((item) => ({
      role: item.role,
      content: [{ type: "input_text", text: item.content }],
    })),
    {
      role: "user",
      content: [{ type: "input_text", text: message }],
    },
  ];

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
      temperature: 0.2,
      max_output_tokens: 450,
    }),
  });

  if (!response.ok) throw new Error("openai-unavailable");
  const payload = await response.json();
  const reply = extractResponseText(payload);
  if (!reply) throw new Error("empty-openai-reply");
  return reply;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = sanitizeText(body?.message, MAX_MESSAGE_CHARS);
    const history = normalizeHistory(body?.history);

    if (!message) {
      return jsonError("Please enter a valid message.", 400);
    }

    const context = await buildNewsContext();
    const suggestions = pickSuggestions(message, context);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(buildFallbackReply(message, suggestions, context.categoryList, "no-context"));
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const systemPrompt = createSystemPrompt(context);

    try {
      const reply = await requestOpenAIReply({ apiKey, model, systemPrompt, history, message });
      return Response.json({ reply, articles: suggestions, source: "openai" });
    } catch {
      return Response.json(buildFallbackReply(message, suggestions, context.categoryList));
    }
  } catch {
    return jsonError("Unable to process assistant request right now.", 500);
  }
}
