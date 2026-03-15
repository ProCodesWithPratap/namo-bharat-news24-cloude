import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTagBySlug, getArticles } from "@/lib/api";
import NewsCard from "@/components/ui/NewsCard";
import { SITE_NAME } from "@/lib/utils";

export const revalidate = 60;

interface Props { params: { tag: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await getTagBySlug(params.tag);
  if (!tag) return { title: "Not Found" };
  return {
    title: `${tag.nameHindi || tag.name} | ${SITE_NAME}`,
    description: tag.description || `${tag.nameHindi || tag.name} से जुड़ी ताजा खबरें`,
    robots: { index: true },
  };
}

export default async function TagPage({ params }: Props) {
  const tag = await getTagBySlug(params.tag);
  if (!tag) notFound();

  const articles = await getArticles({ tag: params.tag, limit: 16 }).catch(() => ({ docs: [] }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="border-l-4 pl-4 mb-8" style={{ borderColor: "#C8102E" }}>
        <h1 className="font-hindi text-2xl font-extrabold text-gray-900">
          #{tag.nameHindi || tag.name}
        </h1>
        {tag.description && <p className="text-sm text-gray-500 mt-1 font-hindi">{tag.description}</p>}
      </div>

      {articles.docs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {articles.docs.map((a: any) => (
            <NewsCard key={a.id} article={a} variant="card" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 font-hindi">
          <div className="text-5xl mb-4">📰</div>
          <p>इस टैग पर कोई खबर नहीं मिली</p>
        </div>
      )}
    </div>
  );
}
