import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getArticles, getImageUrl } from "@/lib/api";
import NewsCard from "@/components/ui/NewsCard";
import { SITE_NAME } from "@/lib/utils";

export const revalidate = 60;

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getAuthorBySlug(params.slug);
  if (!author) return { title: "Not Found" };
  return {
    title: `${author.name} | ${SITE_NAME}`,
    description: author.bio || `${author.name} द्वारा लिखी खबरें`,
  };
}

export default async function AuthorPage({ params }: Props) {
  const author = await getAuthorBySlug(params.slug);
  if (!author) notFound();

  const articles = await getArticles({ limit: 12 }).catch(() => ({ docs: [] }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Author card */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-10 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
        {author.image && (
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 shrink-0">
            <Image src={getImageUrl(author.image, "thumbnail")} alt={author.name} fill className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="font-hindi text-2xl font-extrabold text-gray-900">{author.name}</h1>
          {author.nameHindi && <p className="font-hindi text-gray-500">{author.nameHindi}</p>}
          {author.designation && (
            <p className="text-sm text-gray-500 mt-1">{author.designation}</p>
          )}
          {author.bio && (
            <p className="font-hindi text-gray-600 text-sm mt-3 leading-relaxed max-w-xl">{author.bio}</p>
          )}
          {/* Social links */}
          <div className="flex gap-3 mt-3">
            {author.socialLinks?.twitter && (
              <a href={`https://twitter.com/${author.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">𝕏 Twitter</a>
            )}
            {author.socialLinks?.instagram && (
              <a href={`https://instagram.com/${author.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-400 hover:underline">Instagram</a>
            )}
          </div>
        </div>
      </div>

      <h2 className="font-hindi text-lg font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>
        {author.name} की खबरें
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {articles.docs.map((a: any) => (
          <NewsCard key={a.id} article={a} variant="card" />
        ))}
      </div>
    </div>
  );
}
