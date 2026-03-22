import type { Metadata } from "next";
import HomePage from "@/components/homepage/HomePage";
import {
  getFeaturedArticles,
  getLatestArticles,
  getCategoryArticles,
  getVideos,
  getWebStories,
} from "@/lib/api";
import { SITE_DESCRIPTION } from "@/lib/utils";
import { getNavigationCategoriesData, getSiteSettingsData } from "@/lib/site-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;


function validArticles(docs: any[]): any[] {
  return (docs || []).filter((a) => {
    const candidateSlug = a?.slug || a?.id;

    return (
      a &&
      typeof candidateSlug === "string" &&
      candidateSlug.trim() !== "" &&
      candidateSlug !== "undefined"
    );
  });
}

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
    latestDocs = validArticles(latest.docs);
    featuredDocs = validArticles(featured.docs).length > 0
      ? validArticles(featured.docs)
      : latestDocs.slice(0, 8);
    videoDocs = videos.docs;
    webStoryDocs = webStories.docs;
  } catch {}

  const featuredArticles = featuredDocs;
  const latestArticles = latestDocs;

  const [navigationCategories, siteData] = await Promise.all([getNavigationCategoriesData(), getSiteSettingsData()]);

  const categoryFeeds: Record<string, any[]> = {};
  await Promise.all(
    navigationCategories.slice(0, 8).map(async (cat) => {
      const result = await getCategoryArticles(cat.slug, 4).catch(() => ({ docs: [] }));
      categoryFeeds[cat.slug] = validArticles(result.docs);
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
      navigationCategories={navigationCategories}
      socialLinks={siteData.socialLinks}
    />
  );
}
