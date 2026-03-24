/**
 * Data fetching utilities for the news portal.
 * All functions call Payload's REST API and are safe to use in
 * Next.js server components, route handlers, and ISR.
 */

import configPromise from "@payload-config";
import { getPayload } from "payload";

function getBaseUrl(): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim();
  if (serverUrl?.startsWith("http")) {
    return serverUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }

  if (typeof window === "undefined") {
    return `http://localhost:${process.env.PORT || 3000}`;
  }

  return window.location.origin;
}

type QueryParams = Record<string, string | number | boolean | undefined>;

type PayloadCollection =
  | "ads"
  | "articles"
  | "authors"
  | "categories"
  | "live-blogs"
  | "tags"
  | "videos"
  | "web-stories";

const hasConfiguredDatabase = Boolean(process.env.DATABASE_URI?.trim());

function buildQuery(params: QueryParams): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return qs ? `?${qs}` : "";
}

function parseValue(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  return value;
}

function setNestedValue(target: Record<string, any>, path: string[], operator: string, value: unknown) {
  let cursor = target;

  path.forEach((part, index) => {
    if (index === path.length - 1) {
      cursor[part] = {
        ...(cursor[part] || {}),
        [operator]: value,
      };
      return;
    }

    cursor[part] = cursor[part] || {};
    cursor = cursor[part];
  });
}

function buildPublicArticleWhere(extra?: Record<string, any>) {
  const now = new Date().toISOString();
  const clauses: Record<string, any>[] = [
    {
      or: [
        { status: { equals: "published" } },
        { _status: { equals: "published" } },
      ],
    },
    {
      or: [
        { publishDate: { exists: false } },
        { publishDate: { less_than_equal: now } },
      ],
    },
  ];

  if (extra && Object.keys(extra).length > 0) {
    clauses.push(extra);
  }

  return { and: clauses };
}

async function fetchPayloadServer<T>(path: string): Promise<T> {
  const [pathname, rawQuery = ""] = path.split("?");
  const collection = pathname.replace(/^\//, "") as PayloadCollection;
  const searchParams = new URLSearchParams(rawQuery);
  const payload = await getPayload({ config: configPromise });
  const where: Record<string, any> = {};

  const limit = Number(searchParams.get("limit") || 10);
  const page = Number(searchParams.get("page") || 1);
  const depth = Number(searchParams.get("depth") || 0);
  const sort = searchParams.get("sort") || undefined;

  for (const [key, rawValue] of searchParams.entries()) {
    if (["limit", "page", "sort", "depth"].includes(key)) continue;
    if (key === "or") {
      try { where.or = JSON.parse(rawValue); } catch { where.or = []; }
      continue;
    }
    const match = key.match(/^(.*)\[([^\]]+)\]$/);
    if (!match) continue;
    const [, fieldPath, operator] = match;
    const orMatch = fieldPath.match(/^or\[(\d+)\]\[(.+)\]$/);
    if (orMatch) {
      const [, index, nestedFieldPath] = orMatch;
      where.or = Array.isArray(where.or) ? where.or : [];
      where.or[Number(index)] = where.or[Number(index)] || {};
      setNestedValue(where.or[Number(index)], nestedFieldPath.split("."), operator, parseValue(rawValue));
      continue;
    }

    setNestedValue(where, fieldPath.split("."), operator, parseValue(rawValue));
  }

  console.log(`[api] payload.find collection=${collection} where=${JSON.stringify(where)} limit=${limit}`);
  const result = await payload.find({
    collection,
    where: Object.keys(where).length > 0 ? where : undefined,
    limit,
    page,
    depth,
    sort,
    overrideAccess: true,
  });
  console.log(`[api] payload.find DONE collection=${collection} docs=${(result as any)?.docs?.length}`);
  return result as unknown as T;
}

async function fetchPayload<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  if (typeof window === "undefined") {
    if (!hasConfiguredDatabase && process.env.NODE_ENV !== "production") {
      return { docs: [], totalDocs: 0, totalPages: 0 } as T;
    }

    try {
      const result = await fetchPayloadServer<T>(path);
      const r = result as any;
      console.log(`[api] SERVER OK ${path} → docs:${r?.docs?.length ?? '?'} total:${r?.totalDocs ?? '?'}`);
      return result;
    } catch (e) {
      console.error(`[api] SERVER ERROR ${path}`, String(e));
      return { docs: [], totalDocs: 0, totalPages: 0 } as T;
    }
  }

  const endpoint = `${getBaseUrl()}/api${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.error(`[api] Request failed: ${endpoint} (${res.status})`);
      return { docs: [], totalDocs: 0, totalPages: 0 } as T;
    }
    return res.json();
  } catch (e) {
    clearTimeout(timeout);
    console.error(`[api] Request error: ${endpoint}`, e);
    return { docs: [], totalDocs: 0, totalPages: 0 } as T;
  }
}

// ── Articles ──────────────────────────────────────────────────────────────

type PaginatedArticles = {
  docs: any[];
  totalDocs: number;
  totalPages: number;
};

export async function getArticles(options: {
  limit?: number;
  page?: number;
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  breakingNews?: boolean;
  language?: string;
  sort?: string;
} = {}): Promise<PaginatedArticles> {
  const {
    limit = 10,
    page = 1,
    category,
    tag,
    featured,
    breakingNews,
    language,
    sort = "-publishDate",
  } = options;

  if (typeof window !== "undefined") {
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const extraWhere: Record<string, any> = {};

    if (category) extraWhere["category.slug"] = { equals: category };
    if (tag) extraWhere["tags.slug"] = { equals: tag };
    if (featured) extraWhere.featured = { equals: true };
    if (breakingNews) extraWhere.breakingNews = { equals: true };
    if (language) extraWhere.language = { equals: language };

    const result = await payload.find({
      collection: "articles",
      where: buildPublicArticleWhere(extraWhere),
      limit,
      page,
      depth: 2,
      sort,
    });

    return result as unknown as PaginatedArticles;
  } catch (e) {
    console.error("[getArticles] error:", e);
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }
}

export async function getArticleBySlug(slug: string) {
  if (typeof window !== "undefined") return null;

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "articles",
      where: buildPublicArticleWhere({
        slug: { equals: slug },
      }),
      limit: 1,
      depth: 3,
    });

    return result.docs[0] || null;
  } catch (e) {
    console.error("[getArticleBySlug] error:", e);
    return null;
  }
}

export async function getBreakingNews(limit = 5) {
  return getArticles({ breakingNews: true, limit, sort: "-publishDate" });
}

export async function getFeaturedArticles(limit = 6): Promise<PaginatedArticles> {
  if (typeof window !== "undefined") {
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "articles",
      where: buildPublicArticleWhere({ featured: { equals: true } }),
      limit,
      page: 1,
      depth: 2,
      sort: "-publishDate",
    });

    return result as unknown as PaginatedArticles;
  } catch (e) {
    console.error("[getFeaturedArticles] error:", e);
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }
}

export async function getLatestArticles(limit = 20): Promise<PaginatedArticles> {
  if (typeof window !== "undefined") {
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "articles",
      where: buildPublicArticleWhere(),
      limit,
      page: 1,
      depth: 2,
      sort: "-publishDate",
    });

    return result as unknown as PaginatedArticles;
  } catch (e) {
    console.error("[getLatestArticles] error:", e);
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }
}

export async function getCategoryArticles(
  categorySlug: string,
  limit = 12,
  page = 1
): Promise<PaginatedArticles> {
  if (typeof window !== "undefined") {
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "articles",
      where: buildPublicArticleWhere({ "category.slug": { equals: categorySlug } }),
      limit,
      page,
      depth: 2,
      sort: "-publishDate",
    });

    return result as unknown as PaginatedArticles;
  } catch (e) {
    console.error("[getCategoryArticles] error:", e);
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }
}

export async function getRelatedArticles(articleId: string, categorySlug: string, limit = 4): Promise<PaginatedArticles> {
  if (typeof window !== "undefined") {
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "articles",
      where: buildPublicArticleWhere({
        "category.slug": { equals: categorySlug },
        id: { not_equals: articleId },
      }),
      limit,
      page: 1,
      depth: 2,
      sort: "-publishDate",
    });

    return result as unknown as PaginatedArticles;
  } catch (e) {
    console.error("[getRelatedArticles] error:", e);
    return { docs: [], totalDocs: 0, totalPages: 0 };
  }
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
  if (typeof window !== "undefined") {
    return { docs: [], totalDocs: 0 };
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "articles",
      where: buildPublicArticleWhere({
        or: [
          { headline: { like: query } },
          { headlineHindi: { like: query } },
          { excerpt: { like: query } },
        ],
      }),
      limit,
      page,
      sort: "-publishDate",
      depth: 2,
    });

    return result as unknown as { docs: any[]; totalDocs: number };
  } catch (e) {
    console.error("[searchArticles] error:", e);
    return { docs: [], totalDocs: 0 };
  }
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
  if (!media) return "";
  if (typeof media === "string") return media;
  if (size && media.sizes?.[size]?.url) return media.sizes[size].url;
  return media.url || "";
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
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";
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
