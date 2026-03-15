import type { Metadata } from "next";
import NewsCard from "@/components/ui/NewsCard";
import PageHero from "@/components/common/PageHero";
import { getCategoryArticles, getLatestArticles } from "@/lib/api";

export const metadata: Metadata = { title: "National News", description: "राष्ट्रीय खबरें, नीति, संसद और देशभर के बड़े अपडेट्स।" };

export default async function NationalPage() {
  const national = await getCategoryArticles("national", 18).catch(() => ({ docs: [] }));
  const fallback = national.docs.length ? { docs: [] } : await getLatestArticles(18).catch(() => ({ docs: [] }));
  const articles = national.docs.length ? national.docs : fallback.docs;

  return (
    <>
      <PageHero title="राष्ट्रीय" description="देशभर की प्रमुख राष्ट्रीय खबरें, नीति निर्णय और बड़े घटनाक्रम।" />
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article: any) => <NewsCard key={article.id} article={article} variant="card" />)}
      </div>
    </>
  );
}
