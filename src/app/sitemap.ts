import { MetadataRoute } from "next";
import { getLatestArticles, getCategories } from "@/lib/api";
import { SITE_URL } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([
    getLatestArticles(500).catch(() => ({ docs: [] })),
    getCategories({ showInNav: false, limit: 50 }).catch(() => ({ docs: [] })),
  ]);

  const articleUrls: MetadataRoute.Sitemap = articles.docs.map((a: any) => ({
    url: `${SITE_URL}/article/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: "daily" as const,
    priority: a.featured ? 0.9 : 0.7,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.docs.map((c: any) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "always", priority: 1.0 },
    { url: `${SITE_URL}/videos`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/web-stories`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.7 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    ...categoryUrls,
    ...articleUrls,
  ];
}
