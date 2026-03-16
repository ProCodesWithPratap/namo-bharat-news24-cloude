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
};

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
    url: `${SITE_URL}/article/${article.slug}`,
  });

  const latestArticles = (latest.docs || []).slice(0, 8).map(mapArticle);
  const featuredArticles = (featured.docs || []).slice(0, 4).map(mapArticle);
  const breakingArticles = (breaking.docs || []).slice(0, 4).map(mapArticle);

  const categoryList = (categories.docs || []).slice(0, 16).map((cat: any) => ({
    name: cat.name || cat.title || cat.slug,
    slug: cat.slug,
    url: `${SITE_URL}/${cat.slug}`,
  }));

  return {
    latestArticles,
    featuredArticles,
    breakingArticles,
    categoryList,
  };
}

function pickSuggestions(query: string, context: Awaited<ReturnType<typeof buildNewsContext>>): ArticleHint[] {
  const q = query.toLowerCase();
  const combined = [...context.breakingArticles, ...context.featuredArticles, ...context.latestArticles];

  const keywordMatched = combined.filter((article) => {
    const hay = `${article.title} ${article.category}`.toLowerCase();
    return q.split(" ").some((token) => token.length > 2 && hay.includes(token));
  });

  const unique = new Map<string, ArticleHint>();
  [...keywordMatched, ...combined].forEach((item) => {
    if (!unique.has(item.id)) unique.set(item.id, item);
  });

  return [...unique.values()].slice(0, 4);
}

function createSystemPrompt(context: Awaited<ReturnType<typeof buildNewsContext>>) {
  return `You are AI News Desk assistant for ${SITE_NAME}, a Hindi-first news website.

Rules:
- Be concise, accurate, and newsroom-style.
- Prefer answers from provided site context.
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

function buildFallbackReply(suggestions: ArticleHint[]) {
  if (!suggestions.length) {
    return {
      reply:
        "इस समय साइट पर दिखाने के लिए पर्याप्त ताज़ा आर्टिकल नहीं मिले। कृपया थोड़ी देर बाद दोबारा कोशिश करें या किसी कैटेगरी पेज पर जाएँ।",
      articles: [],
      source: "safe-fallback",
    };
  }

  const topArticle = suggestions[0];
  return {
    reply: `मैं अभी AI मोड में जवाब नहीं दे पा रहा हूँ, लेकिन ${topArticle.category} से यह खबर मददगार हो सकती है: ${topArticle.title}`,
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
      return Response.json(buildFallbackReply(suggestions));
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const systemPrompt = createSystemPrompt(context);

    try {
      const reply = await requestOpenAIReply({ apiKey, model, systemPrompt, history, message });
      return Response.json({ reply, articles: suggestions, source: "openai" });
    } catch {
      return Response.json(buildFallbackReply(suggestions));
    }
  } catch {
    return jsonError("Unable to process assistant request right now.", 500);
  }
}
