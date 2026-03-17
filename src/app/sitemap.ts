import { MetadataRoute } from "next";
import { getLatestArticles } from "@/lib/api";
import { toAbsoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/advertise",
  "/careers",
  "/live",
  "/e-paper",
  "/national",
  "/states",
  "/politics",
  "/business",
  "/sports",
  "/entertainment",
  "/technology",
  "/education",
  "/lifestyle",
  "/videos",
  "/web-stories",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route, index) => ({
    url: toAbsoluteUrl(route),
    lastModified: now,
    changeFrequency: index === 0 ? "always" : "hourly",
    priority: index === 0 ? 1 : 0.7,
  }));

  try {
    const articles = await getLatestArticles(200);
    const dynamicEntries: MetadataRoute.Sitemap = (articles.docs || [])
      .filter((article) => article?.slug)
      .map((article) => ({
        url: toAbsoluteUrl(`/article/${article.slug}`),
        lastModified: article.updatedAt || article.publishDate || now,
        changeFrequency: "hourly",
        priority: article.featured ? 0.9 : 0.8,
      }));

    return [...staticEntries, ...dynamicEntries];
  } catch {
    return staticEntries;
  }
}
