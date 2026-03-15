import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryArticles, getCategories } from "@/lib/api";
import NewsCard from "@/components/ui/NewsCard";
import AdSlot from "@/components/ui/AdSlot";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const revalidate = 60;

interface Props { params: { category: string }; searchParams: { page?: string } }

export async function generateStaticParams() {
  const cats = await getCategories({ showInNav: true, limit: 50 });
  return cats.docs.map((c: any) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.category);
  if (!cat) return { title: "Not Found" };
  const title = `${cat.seo?.metaTitle || cat.nameHindi || cat.name} | ${SITE_NAME}`;
  const description = cat.seo?.metaDescription || cat.description || `${cat.nameHindi || cat.name} की ताजा खबरें`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${params.category}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [cat, articles] = await Promise.all([
    getCategoryBySlug(params.category),
    getCategoryArticles(params.category, 20, Number(searchParams.page) || 1),
  ]);

  if (!cat) notFound();

  const { docs, totalDocs, totalPages } = articles;
  const currentPage = Number(searchParams.page) || 1;
  const heroArticle = docs[0];
  const gridArticles = docs.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Category header */}
      <div
        className="border-l-4 pl-4 mb-8"
        style={{ borderColor: "#C8102E" }}
      >
        <h1 className="font-hindi text-2xl md:text-3xl font-extrabold text-gray-900">
          {cat.nameHindi || cat.name}
        </h1>
        {cat.description && (
          <p className="font-hindi text-gray-500 text-sm mt-1">{cat.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{totalDocs} खबरें</p>
      </div>

      {/* Ad */}
      <AdSlot label="Advertisement" width={970} height={90} className="mb-8 hidden md:flex" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Hero */}
          {heroArticle && (
            <div className="mb-6">
              <NewsCard article={heroArticle} variant="hero" priority />
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gridArticles.map((a: any) => (
              <NewsCard key={a.id} article={a} variant="card" />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {currentPage > 1 && (
                <a
                  href={`/${params.category}?page=${currentPage - 1}`}
                  className="px-4 py-2 border border-gray-200 rounded text-sm hover:border-primary hover:text-primary transition-colors font-hindi"
                >
                  ← पिछला
                </a>
              )}
              <span className="text-sm text-gray-500 font-hindi px-3">
                {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages && (
                <a
                  href={`/${params.category}?page=${currentPage + 1}`}
                  className="px-4 py-2 border border-gray-200 rounded text-sm hover:border-primary hover:text-primary transition-colors font-hindi"
                >
                  अगला →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <AdSlot label="Advertisement" width={300} height={250} className="flex" />

          {docs.length > 6 && (
            <div className="bg-white border border-gray-100 rounded-lg p-4">
              <h3 className="font-hindi text-sm font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>
                हाल की खबरें
              </h3>
              <div>
                {docs.slice(0, 8).map((a: any) => (
                  <NewsCard key={a.id} article={a} variant="mini" />
                ))}
              </div>
            </div>
          )}

          <AdSlot label="Advertisement" width={300} height={600} className="flex" />
        </aside>
      </div>
    </div>
  );
}
