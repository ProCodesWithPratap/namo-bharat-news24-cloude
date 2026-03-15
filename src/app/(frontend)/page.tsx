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

export const dynamic = "force-dynamic";

export const revalidate = 0;

export const metadata: Metadata = {
  title: `नमो: भारत न्यूज़ 24 - ताजा हिंदी खबरें, ब्रेकिंग न्यूज़`,
  description: SITE_DESCRIPTION,
};

export default async function Home() {
  let featured = { docs: [] as any[] };
  let latest = { docs: [] as any[] };
  let videos = { docs: [] as any[] };
  let webStories = { docs: [] as any[] };

  try {
    [featured, latest, videos, webStories] = await Promise.all([
      getFeaturedArticles(8),
      getLatestArticles(24),
      getVideos(8),
      getWebStories(8),
    ]);
  } catch {
    featured = { docs: [] };
    latest = { docs: [] };
    videos = { docs: [] };
    webStories = { docs: [] };
  }

  // Fetch per-category feeds in parallel
  const categoryFeeds: Record<string, any[]> = {};
  try {
    await Promise.all(
      NAV_CATEGORIES.slice(0, 8).map(async (cat) => {
        const result = await getCategoryArticles(cat.slug, 4);
        categoryFeeds[cat.slug] = result.docs;
      })
    );
  } catch {
    NAV_CATEGORIES.slice(0, 8).forEach((cat) => {
      categoryFeeds[cat.slug] = [];
    });
  }

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
