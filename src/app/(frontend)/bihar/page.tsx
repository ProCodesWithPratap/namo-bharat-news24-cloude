import type { Metadata } from "next";
import Link from "next/link";
import NewsCard from "@/components/ui/NewsCard";
import AdSlot from "@/components/ui/AdSlot";
import { getCategoryArticles } from "@/lib/api";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "बिहार की ताजा खबरें आज | नमो: भारत न्यूज़ 24",
  description: "बिहार की सबसे ताजा और सटीक खबरें — पटना, गया, मुजफ्फरपुर, भागलपुर, कटिहार समेत सभी जिलों की अपडेट। राजनीति, अपराध, विकास और समाज की खबरें हिंदी में।",
  alternates: { canonical: `${SITE_URL}/bihar` },
  openGraph: { type: "website", title: "बिहार की ताजा खबरें आज | नमो: भारत न्यूज़ 24", description: "बिहार की सबसे ताजा और सटीक खबरें — पटना, गया, मुजफ्फरपुर, भागलपुर, कटिहार समेत सभी जिलों की अपडेट। राजनीति, अपराध, विकास और समाज की खबरें हिंदी में।" },
};

const DISTRICTS = ["पटना", "गया", "मुजफ्फरपुर", "भागलपुर", "कटिहार", "दरभंगा", "पूर्णिया", "आरा", "बेगूसराय", "मुंगेर", "सासाराम", "हाजीपुर", "बिहारशरीफ", "सीवान", "छपरा"];

export default async function BiharPage() {
  const [states, national] = await Promise.all([getCategoryArticles("states", 18), getCategoryArticles("national", 6)]);
  const articles = [...(states.docs || []), ...(national.docs || [])].slice(0, 20);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "बिहार की ताजा खबरें",
    about: { "@type": "Place", name: "Bihar", addressCountry: "IN" },
    url: `${SITE_URL}/bihar`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="font-hindi text-2xl md:text-3xl font-extrabold border-l-4 pl-3 mb-4" style={{ borderColor: "#C8102E" }}>🗺️ बिहार की ताजा खबरें</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {DISTRICTS.map((district) => <span key={district} className="font-hindi text-xs px-3 py-1 rounded-full bg-red-50 border border-red-100">{district}</span>)}
        </div>

        <AdSlot label="Advertisement" width={970} height={90} className="hidden md:flex mb-6" />

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
              <h3 className="font-hindi font-bold mb-3">त्वरित लिंक</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/national", label: "राष्ट्रीय" },
                  { href: "/politics", label: "राजनीति" },
                  { href: "/katihar", label: "कटिहार" },
                  { href: "/states", label: "राज्य" },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="font-hindi text-sm rounded-lg bg-red-50 text-[#C8102E] px-3 py-2 text-center">{l.label}</Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
