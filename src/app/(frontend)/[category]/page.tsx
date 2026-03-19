import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCategoryBySlug, getCategoryArticles } from "@/lib/api";
import NewsCard from "@/components/ui/NewsCard";
import AdSlot from "@/components/ui/AdSlot";
import { NAV_CATEGORIES, PUBLIC_CATEGORY_ROUTE_SLUGS, normalizeCategorySlug, SITE_NAME, SITE_URL } from "@/lib/utils";
import { getNavigationCategoriesData } from "@/lib/site-data";
export const dynamic = "force-dynamic";

export const revalidate = 60;

type Props = { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> }

export async function generateStaticParams() {
  return PUBLIC_CATEGORY_ROUTE_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const slug = normalizeCategorySlug(category);
  const cat = await getCategoryBySlug(slug);
  const navCategories = await getNavigationCategoriesData();
  const navFallback = navCategories.find((item) => item.slug === slug) || NAV_CATEGORIES.find((item) => item.slug === slug);
  if (!cat && !navFallback) return { title: "Not Found" };
  return {
    title: `${cat?.seo?.metaTitle || cat?.nameHindi || cat?.name || navFallback?.name} | ${SITE_NAME}`,
    description: cat?.seo?.metaDescription || cat?.description || `${cat?.nameHindi || cat?.name || navFallback?.name} की ताजा खबरें`,
    alternates: { canonical: `${SITE_URL}/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const slug = normalizeCategorySlug(category);
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  if (category !== slug) {
    redirect(`/${slug}${currentPage > 1 ? `?page=${currentPage}` : ""}`);
  }

  const [cat, articles] = await Promise.all([
    getCategoryBySlug(slug),
    getCategoryArticles(slug, 20, currentPage),
  ]);

  const navCategories = await getNavigationCategoriesData();
  const navFallback = navCategories.find((item) => item.slug === slug) || NAV_CATEGORIES.find((item) => item.slug === slug);

  if (!cat && !navFallback) notFound();

  const { docs, totalDocs, totalPages } = articles;
  const heroArticle = docs[0];
  const gridArticles = docs.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="border-l-4 pl-4 mb-8" style={{ borderColor: "#C8102E" }}>
        <h1 className="font-hindi text-2xl md:text-3xl font-extrabold text-gray-900">
          {cat?.nameHindi || cat?.name || navFallback?.name}
        </h1>
        {cat?.description && <p className="font-hindi text-gray-500 text-sm mt-1">{cat.description}</p>}
        <p className="text-xs text-gray-400 mt-1">{totalDocs} खबरें</p>
      </div>

      <AdSlot label="Advertisement" width={970} height={90} className="mb-8 hidden md:flex" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {heroArticle && <div className="mb-6"><NewsCard article={heroArticle} variant="hero" priority /></div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gridArticles.map((a: any) => <NewsCard key={a.id} article={a} variant="card" />)}
          </div>
          {docs.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center font-hindi text-gray-600">
              इस श्रेणी में अभी खबरें प्रकाशित नहीं हुई हैं।
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {currentPage > 1 && (
                <a href={`/${slug}?page=${currentPage - 1}`} className="px-4 py-2 border border-gray-200 rounded text-sm hover:border-primary hover:text-primary transition-colors font-hindi">← पिछला</a>
              )}
              <span className="text-sm text-gray-500 font-hindi px-3">{currentPage} / {totalPages}</span>
              {currentPage < totalPages && (
                <a href={`/${slug}?page=${currentPage + 1}`} className="px-4 py-2 border border-gray-200 rounded text-sm hover:border-primary hover:text-primary transition-colors font-hindi">अगला →</a>
              )}
            </div>
          )}
        </div>
        <aside className="space-y-6">
          <AdSlot label="Advertisement" width={300} height={250} className="flex" />
          {docs.length > 6 && (
            <div className="bg-white border border-gray-100 rounded-lg p-4">
              <h3 className="font-hindi text-sm font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>हाल की खबरें</h3>
              <div>{docs.slice(0, 8).map((a: any) => <NewsCard key={a.id} article={a} variant="mini" />)}</div>
            </div>
          )}
          <AdSlot label="Advertisement" width={300} height={600} className="flex" />
        </aside>
      </div>
    </div>
  );
}
