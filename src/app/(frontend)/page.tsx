import type { Metadata } from "next";
import HomePage from "@/components/homepage/HomePage";
import {
  getFeaturedArticles,
  getLatestArticles,
  getCategoryArticles,
  getVideos,
  getWebStories,
} from "@/lib/api";
import { NAV_CATEGORIES, SITE_NAME, SITE_DESCRIPTION } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `नमो: भारत न्यूज़ 24 - ताजा हिंदी खबरें, ब्रेकिंग न्यूज़`,
  description: SITE_DESCRIPTION,
};

export default async function Home() {
  const [featured, latest, videos, webStories] = await Promise.all([
    getFeaturedArticles(8),
    getLatestArticles(24),
    getVideos(8),
    getWebStories(8),
  ]);

  // Fetch per-category feeds in parallel
  const categoryFeeds: Record<string, any[]> = {};
  await Promise.all(
    NAV_CATEGORIES.slice(0, 8).map(async (cat) => {
      const result = await getCategoryArticles(cat.slug, 4).catch(() => ({ docs: [] }));
      categoryFeeds[cat.slug] = result.docs;
    })
  );

  return (
    <HomePage
      featuredArticles={featured.docs}
      latestArticles={latest.docs}
      categoryFeeds={categoryFeeds}
      videos={videos.docs}
      webStories={webStories.docs}
      trendingArticles={latest.docs.slice(0, 10)}
    />
  );
}
