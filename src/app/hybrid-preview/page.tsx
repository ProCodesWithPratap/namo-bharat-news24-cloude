import type { Metadata } from "next";
import HybridPreviewClient from "@/components/hybrid/HybridPreviewClient";
import {
  getFeaturedArticles,
  getLatestArticles,
  getCategoryArticles,
  getVideos,
  getWebStories,
} from "@/lib/api";
import { getNavigationCategoriesData, getSiteSettingsData } from "@/lib/site-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Hybrid UI Preview | Namo Bharat News 24",
  description: "Preview of a redesigned hybrid homepage for Namo Bharat News 24.",
};

function validArticles(docs: any[]): any[] {
  return (docs || []).filter((item) => {
    const slug = item?.slug || item?.id;
    return typeof slug === "string" && slug.trim() !== "" && slug !== "undefined";
  });
}

export default async function HybridPreviewPage() {
  let featuredDocs: any[] = [];
  let latestDocs: any[] = [];
  let videoDocs: any[] = [];
  let webStoryDocs: any[] = [];

  try {
    const [featured, latest, videos, webStories] = await Promise.all([
      getFeaturedArticles(8),
      getLatestArticles(24),
      getVideos(8),
      getWebStories(8),
    ]);

    latestDocs = validArticles(latest.docs);
    featuredDocs = validArticles(featured.docs).length > 0
      ? validArticles(featured.docs)
      : latestDocs.slice(0, 8);

    videoDocs = videos.docs || [];
    webStoryDocs = webStories.docs || [];
  } catch {}

  const [navigationCategories, siteData] = await Promise.all([
    getNavigationCategoriesData(),
    getSiteSettingsData(),
  ]);

  const categoryFeeds: Record<string, any[]> = {};
  await Promise.all(
    navigationCategories.slice(0, 4).map(async (cat) => {
      const result = await getCategoryArticles(cat.slug, 4).catch(() => ({ docs: [] }));
      categoryFeeds[cat.slug] = validArticles(result.docs);
    })
  );

  return (
    <HybridPreviewClient
      featuredArticles={featuredDocs}
      latestArticles={latestDocs}
      trendingArticles={latestDocs.slice(0, 10)}
      videos={videoDocs}
      webStories={webStoryDocs}
      navigationCategories={navigationCategories}
      categoryFeeds={categoryFeeds}
      socialLinks={siteData.socialLinks}
    />
  );
}
