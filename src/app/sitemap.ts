import { MetadataRoute } from "next";
import { getLatestArticles, getWebStories } from "@/lib/api";
import { toAbsoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATIC_ROUTES: Array<{ route: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { route: "", changeFrequency: "always", priority: 1 },
  { route: "/about", changeFrequency: "monthly", priority: 0.4 },
  { route: "/contact", changeFrequency: "monthly", priority: 0.4 },
  { route: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { route: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { route: "/disclaimer", changeFrequency: "yearly", priority: 0.2 },
  { route: "/advertise", changeFrequency: "monthly", priority: 0.3 },
  { route: "/careers", changeFrequency: "weekly", priority: 0.5 },
  { route: "/bihar", changeFrequency: "hourly", priority: 0.75 },
  { route: "/katihar", changeFrequency: "hourly", priority: 0.75 },
  { route: "/live", changeFrequency: "hourly", priority: 0.85 },
  { route: "/e-paper", changeFrequency: "daily", priority: 0.65 },
  { route: "/national", changeFrequency: "hourly", priority: 0.75 },
  { route: "/states", changeFrequency: "hourly", priority: 0.75 },
  { route: "/politics", changeFrequency: "hourly", priority: 0.75 },
  { route: "/business", changeFrequency: "hourly", priority: 0.75 },
  { route: "/sports", changeFrequency: "hourly", priority: 0.75 },
  { route: "/entertainment", changeFrequency: "hourly", priority: 0.75 },
  { route: "/technology", changeFrequency: "hourly", priority: 0.75 },
  { route: "/education", changeFrequency: "hourly", priority: 0.75 },
  { route: "/lifestyle", changeFrequency: "hourly", priority: 0.75 },
  { route: "/videos", changeFrequency: "hourly", priority: 0.7 },
  { route: "/web-stories", changeFrequency: "daily", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((item) => ({
    url: toAbsoluteUrl(item.route),
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  try {
    const [articles, webStories] = await Promise.all([getLatestArticles(200), getWebStories(50)]);

    const articleEntries: MetadataRoute.Sitemap = (articles.docs || [])
      .filter(
        (article: any) =>
          typeof article?.slug === "string" && article.slug.trim() !== "" && article.slug !== "undefined"
      )
      .map((article: any) => ({
        url: toAbsoluteUrl(`/article/${article.slug}`),
        lastModified: article.updatedAt || article.publishDate || now,
        changeFrequency: "hourly",
        priority: article.featured ? 0.9 : 0.75,
      }));

    const webStoryEntries: MetadataRoute.Sitemap = (webStories.docs || [])
      .filter(
        (story: any) =>
          typeof story?.slug === "string" && story.slug.trim() !== "" && story.slug !== "undefined"
      )
      .map((story: any) => ({
        url: toAbsoluteUrl(`/web-stories/${story.slug}`),
        lastModified: story.updatedAt || story.publishDate || now,
        changeFrequency: "daily",
        priority: 0.7,
      }));

    return [...staticEntries, ...articleEntries, ...webStoryEntries];
  } catch {
    return staticEntries;
  }
}
