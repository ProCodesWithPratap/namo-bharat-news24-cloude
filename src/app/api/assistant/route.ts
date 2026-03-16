import OpenAI from "openai";
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

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return jsonError("AI assistant is not configured right now.", 503);
    }

    const body = await req.json().catch(() => ({}));
    const message = sanitizeText(body?.message, MAX_MESSAGE_CHARS);
    const history = normalizeHistory(body?.history);

    if (!message) {
      return jsonError("Please enter a valid message.", 400);
    }

    const context = await buildNewsContext();
    const suggestions = pickSuggestions(message, context);

    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const systemPrompt = createSystemPrompt(context);

    const stream = await client.responses.stream({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        ...history.map((item) => ({
          role: item.role,
          content: [{ type: "input_text" as const, text: item.content }],
        })),
        {
          role: "user",
          content: [{ type: "input_text", text: message }],
        },
      ],
      temperature: 0.2,
      max_output_tokens: 450,
    });

    const encoder = new TextEncoder();

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "response.output_text.delta") {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "delta", delta: event.delta })}\n\n`),
              );
            }
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "meta", articles: suggestions, source: "site-context" })}\n\n`,
            ),
          );
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                message: "Assistant response interrupted. Please try again.",
              })}\n\n`,
            ),
          );
          controller.close();
        } finally {
          stream.controller.abort();
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch {
    return jsonError("Unable to process assistant request right now.", 500);
  }
}
