import type { Metadata } from "next";
import { searchArticles } from "@/lib/api";
import NewsCard from "@/components/ui/NewsCard";
import { SITE_NAME } from "@/lib/utils";

export const revalidate = 0;

interface Props { searchParams: { q?: string; page?: string } }

export function generateMetadata({ searchParams }: Props): Metadata {
  return {
    title: searchParams.q ? `"${searchParams.q}" - Search | ${SITE_NAME}` : `Search | ${SITE_NAME}`,
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || "";
  const page = Number(searchParams.page) || 1;

  const results = query
    ? await searchArticles(query, 12, page).catch(() => ({ docs: [], totalDocs: 0 }))
    : { docs: [], totalDocs: 0 };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search form */}
      <form method="get" action="/search" className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="खबर खोजें..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-primary font-hindi"
          />
          <button
            type="submit"
            className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity font-hindi"
            style={{ backgroundColor: "#C8102E" }}
          >
            खोजें
          </button>
        </div>
      </form>

      {query ? (
        <>
          <h1 className="font-hindi text-xl font-bold mb-2 text-gray-800">
            "{query}" के लिए परिणाम
          </h1>
          <p className="text-sm text-gray-500 mb-6 font-hindi">
            {results.totalDocs} खबरें मिलीं
          </p>

          {results.docs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.docs.map((a: any) => (
                <NewsCard key={a.id} article={a} variant="card" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-hindi text-lg">कोई खबर नहीं मिली</p>
              <p className="text-sm mt-2">दूसरे शब्दों में खोजें</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-hindi text-xl">कुछ खोजें</p>
          <p className="text-sm mt-2 font-hindi">राष्ट्रीय, खेल, राजनीति...</p>
        </div>
      )}
    </div>
  );
}
