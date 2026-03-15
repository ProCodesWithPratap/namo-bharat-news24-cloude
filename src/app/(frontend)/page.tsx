import type { Metadata } from "next";
import HomePage from "@/components/homepage/HomePage";
import {
  getFeaturedArticles,
  getLatestArticles,
  getCategoryArticles,
  getVideos,
  getWebStories,
} from "@/lib/api";
import { mockArticles, getMockCategoryFeed } from "@/lib/mock-data";
import { NAV_CATEGORIES, SITE_DESCRIPTION } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "नमो: भारत न्यूज़ 24 - ताजा हिंदी खबरें, ब्रेकिंग न्यूज़",
  description: SITE_DESCRIPTION,
};

export default async function Home() {
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
    featuredDocs = featured.docs;
    latestDocs = latest.docs;
    videoDocs = videos.docs;
    webStoryDocs = webStories.docs;
  } catch {
    // Handled with fallback data below.
  }

  const hasApiData = featuredDocs.length > 0 || latestDocs.length > 0;
  const featuredArticles = featuredDocs.length ? featuredDocs : mockArticles.slice(0, 8);
  const latestArticles = latestDocs.length ? latestDocs : mockArticles;

  const categoryFeeds: Record<string, any[]> = {};
  await Promise.all(
    NAV_CATEGORIES.slice(0, 8).map(async (cat) => {
      if (hasApiData) {
        const result = await getCategoryArticles(cat.slug, 4).catch(() => ({ docs: [] }));
        categoryFeeds[cat.slug] = result.docs.length ? result.docs : getMockCategoryFeed(cat.slug);
        return;
      }
      categoryFeeds[cat.slug] = getMockCategoryFeed(cat.slug);
    })
  );

  return (
    <HomePage
      featuredArticles={featuredArticles}
      latestArticles={latestArticles}
      categoryFeeds={categoryFeeds}
      videos={videoDocs}
      webStories={webStoryDocs}
      trendingArticles={latestArticles.slice(0, 10)}
    />
  );
}
