/**
 * Data fetching utilities for the news portal.
 * All functions call Payload's REST API and are safe to use in
 * Next.js server components, route handlers, and ISR.
 */

const API = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") || "";

type QueryParams = Record<string, string | number | boolean | undefined>;

function buildQuery(params: QueryParams): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return qs ? `?${qs}` : "";
}

async function fetchPayload<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const endpoint = API ? `${API}/api${path}` : `/api${path}`;

  try {
    const res = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
      ...options,
    });
    if (!res.ok) return { docs: [], totalDocs: 0, totalPages: 0 } as T;
    return res.json();
  } catch (e) {
    return { docs: [], totalDocs: 0, totalPages: 0 } as T;
  }
}

// ── Articles ──────────────────────────────────────────────────────────────

export async function getArticles(opts?: {
  limit?: number;
  page?: number;
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  breakingNews?: boolean;
  language?: string;
  sort?: string;
}) {
  const {
    limit = 10,
    page = 1,
    category,
    tag,
    featured,
    breakingNews,
    language,
    sort = "-publishDate",
  } = opts || {};

  const where: Record<string, unknown> = {
    "status[equals]": "published",
  };
  if (category) where["category.slug[equals]"] = category;
  if (tag) where["tags.slug[equals]"] = tag;
  if (featured) where["featured[equals]"] = "true";
  if (breakingNews) where["breakingNews[equals]"] = "true";
  if (language) where["language[equals]"] = language;

  const q = buildQuery({ limit, page, sort, depth: 2, ...where });
  return fetchPayload<{ docs: any[]; totalDocs: number; totalPages: number }>(
    `/articles${q}`
  );
}

export async function getArticleBySlug(slug: string) {
  const q = buildQuery({ "slug[equals]": slug, depth: 3, limit: 1 });
  const data = await fetchPayload<{ docs: any[] }>(`/articles${q}`, {
    next: { revalidate: 30 },
  });
  return data.docs[0] || null;
}

export async function getBreakingNews(limit = 5) {
  return getArticles({ breakingNews: true, limit, sort: "-publishDate" });
}

export async function getFeaturedArticles(limit = 6) {
  return getArticles({ featured: true, limit, sort: "-publishDate" });
}

export async function getLatestArticles(limit = 20) {
  return getArticles({ limit, sort: "-publishDate" });
}

export async function getCategoryArticles(categorySlug: string, limit = 12, page = 1) {
  return getArticles({ category: categorySlug, limit, page, sort: "-publishDate" });
}

export async function getRelatedArticles(articleId: string, categorySlug: string, limit = 4) {
  const q = buildQuery({
    "status[equals]": "published",
    "category.slug[equals]": categorySlug,
    "id[not_equals]": articleId,
    sort: "-publishDate",
    limit,
    depth: 2,
  });
  return fetchPayload<{ docs: any[] }>(`/articles${q}`);
}

// ── Categories ────────────────────────────────────────────────────────────

export async function getCategories(opts?: { showInNav?: boolean; limit?: number }) {
  const { showInNav = true, limit = 50 } = opts || {};
  const q = buildQuery({
    ...(showInNav ? { "showInNav[equals]": "true" } : {}),
    sort: "navOrder",
    limit,
    depth: 1,
  });
  return fetchPayload<{ docs: any[] }>(`/categories${q}`);
}

export async function getCategoryBySlug(slug: string) {
  const q = buildQuery({ "slug[equals]": slug, limit: 1, depth: 1 });
  const data = await fetchPayload<{ docs: any[] }>(`/categories${q}`);
  return data.docs[0] || null;
}

// ── Videos ───────────────────────────────────────────────────────────────

export async function getVideos(limit = 8) {
  const q = buildQuery({ "status[equals]": "published", sort: "-publishDate", limit, depth: 2 });
  return fetchPayload<{ docs: any[] }>(`/videos${q}`);
}

// ── Live Blogs ────────────────────────────────────────────────────────────

export async function getLiveBlogBySlug(slug: string) {
  const q = buildQuery({ "slug[equals]": slug, limit: 1, depth: 2 });
  const data = await fetchPayload<{ docs: any[] }>(`/live-blogs${q}`);
  return data.docs[0] || null;
}

export async function getActiveLiveBlogs(limit = 3) {
  const q = buildQuery({ "status[equals]": "active", limit, depth: 1 });
  return fetchPayload<{ docs: any[] }>(`/live-blogs${q}`);
}

// ── Web Stories ───────────────────────────────────────────────────────────

export async function getWebStories(limit = 8) {
  const q = buildQuery({ "status[equals]": "published", sort: "-publishDate", limit, depth: 2 });
  return fetchPayload<{ docs: any[] }>(`/web-stories${q}`);
}

// ── Tags ──────────────────────────────────────────────────────────────────

export async function getTagBySlug(slug: string) {
  const q = buildQuery({ "slug[equals]": slug, limit: 1 });
  const data = await fetchPayload<{ docs: any[] }>(`/tags${q}`);
  return data.docs[0] || null;
}

// ── Search ────────────────────────────────────────────────────────────────

export async function searchArticles(query: string, limit = 10, page = 1) {
  const q = buildQuery({
    "status[equals]": "published",
    or: JSON.stringify([
      { headline: { like: query } },
      { headlineHindi: { like: query } },
      { excerpt: { like: query } },
    ]),
    limit,
    page,
    sort: "-publishDate",
    depth: 2,
  });
  return fetchPayload<{ docs: any[]; totalDocs: number }>(`/articles${q}`);
}

// ── Authors ───────────────────────────────────────────────────────────────

export async function getAuthorBySlug(slug: string) {
  const q = buildQuery({ "slug[equals]": slug, limit: 1, depth: 2 });
  const data = await fetchPayload<{ docs: any[] }>(`/authors${q}`);
  return data.docs[0] || null;
}

// ── Ads ───────────────────────────────────────────────────────────────────

export async function getAdsByPlacement(placement: string) {
  const q = buildQuery({
    "placement[equals]": placement,
    "isActive[equals]": "true",
    limit: 3,
  });
  return fetchPayload<{ docs: any[] }>(`/ads${q}`, { next: { revalidate: 300 } });
}

// ── Helpers ───────────────────────────────────────────────────────────────

export function getImageUrl(media: any, size?: string): string {
  if (!media) return "/placeholder.jpg";
  if (typeof media === "string") return media;
  if (size && media.sizes?.[size]?.url) return media.sizes[size].url;
  return media.url || "/placeholder.jpg";
}

export function getExcerpt(article: any, maxLen = 160): string {
  if (article.excerpt) return article.excerpt.slice(0, maxLen);
  return "";
}

export function formatDate(dateStr: string, lang: "hi" | "en" = "en"): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (lang === "hi") {
    return d.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "अभी";
  if (minutes < 60) return `${minutes} मिनट पहले`;
  if (hours < 24) return `${hours} घंटे पहले`;
  if (days < 7) return `${days} दिन पहले`;
  return formatDate(dateStr, "hi");
}
