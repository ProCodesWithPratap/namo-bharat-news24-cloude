import type { Metadata } from "next";
import Link from "next/link";
import NewsCard from "@/components/ui/NewsCard";
import AdSlot from "@/components/ui/AdSlot";
import { getCategoryArticles } from "@/lib/api";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "कटिहार की खबरें आज | नमो: भारत न्यूज़ 24",
  description: "कटिहार, बिहार की सबसे ताजा खबरें — स्थानीय राजनीति, अपराध, शिक्षा, व्यापार और सामाजिक घटनाओं की अपडेट हिंदी में। नमो: भारत न्यूज़ 24 पर पढ़ें।",
  alternates: { canonical: `${SITE_URL}/katihar` },
};

export default async function KatiharPage() {
  const states = await getCategoryArticles("states", 16);
  const articles = states.docs || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "कटिहार की खबरें",
    about: {
      "@type": "Place",
      name: "Katihar",
      geo: { "@type": "GeoCoordinates", latitude: 25.5448, longitude: 87.5751 },
      containedInPlace: "Bihar",
      addressCountry: "IN",
    },
    url: `${SITE_URL}/katihar`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="font-hindi text-2xl md:text-3xl font-extrabold mb-4">📍 कटिहार की खबरें</h1>
        <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4 font-hindi text-sm text-gray-700 flex flex-wrap gap-6">
          <span><strong>जिला:</strong> कटिहार</span>
          <span><strong>मुख्यालय:</strong> कटिहार नगर</span>
          <span><strong>फोन:</strong> +91-91628 68368</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {articles[0] && <NewsCard article={articles[0]} variant="hero" />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {articles.slice(1).map((article, idx) => <NewsCard key={article.id} article={article} variant={idx % 3 === 0 ? "card" : "compact"} />)}
            </div>
          </div>

          <aside className="space-y-5">
            <AdSlot label="Advertisement" width={300} height={250} className="flex" />
            <div className="rounded-xl border border-gray-100 p-4 bg-white">
              <h3 className="font-hindi font-bold mb-2">📢 खबर भेजें</h3>
              <p className="font-hindi text-sm text-gray-600 mb-3">यदि आपके पास कटिहार से जुड़ी कोई महत्वपूर्ण खबर है, तो हमें WhatsApp पर भेजें।</p>
              <a href="https://wa.me/919162868368" target="_blank" rel="noopener noreferrer" className="font-hindi inline-flex px-4 py-2 rounded-lg bg-green-600 text-white font-bold">WhatsApp पर भेजें</a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
