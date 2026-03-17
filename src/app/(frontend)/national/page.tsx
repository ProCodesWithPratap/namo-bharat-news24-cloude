import type { Metadata } from "next";
import NewsCard from "@/components/ui/NewsCard";
import PageHero from "@/components/common/PageHero";
import { getCategoryArticles } from "@/lib/api";

export const metadata: Metadata = { title: "National News", description: "राष्ट्रीय खबरें, नीति, संसद और देशभर के बड़े अपडेट्स।" };

export default async function NationalPage() {
  const national = await getCategoryArticles("national", 18).catch(() => ({ docs: [] }));
  const articles = national.docs;

  return (
    <>
      <PageHero title="राष्ट्रीय" description="देशभर की प्रमुख राष्ट्रीय खबरें, नीति निर्णय और बड़े घटनाक्रम।" />
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article: any) => <NewsCard key={article.id} article={article} variant="card" />)}
      </div>
      {articles.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center font-hindi text-gray-600">
            राष्ट्रीय श्रेणी में अभी कोई खबर प्रकाशित नहीं है।
          </div>
        </div>
      )}
    </>
  );
}
