import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles, getImageUrl, formatDate, timeAgo } from "@/lib/api";
import NewsCard from "@/components/ui/NewsCard";
import AdSlot from "@/components/ui/AdSlot";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const revalidate = 30;

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Not Found" };

  const title = article.seo?.metaTitle || article.headlineHindi || article.headline;
  const description = article.seo?.metaDescription || article.excerpt || "";
  const ogImage = getImageUrl(article.seo?.ogImage || article.heroMedia, "og");

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: article.publishDate,
      modifiedTime: article.updatedAt,
      authors: article.author?.map((a: any) => `${SITE_URL}/author/${a.slug}`),
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: article.seo?.canonicalUrl || `${SITE_URL}/article/${params.slug}` },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  if (!article || article.status !== "published") notFound();

  const catSlug = article.category?.slug || "";
  const related = await getRelatedArticles(article.id, catSlug, 4).catch(() => ({ docs: [] }));

  const imgUrl = getImageUrl(article.heroMedia, "hero");
  const authorList: any[] = Array.isArray(article.author) ? article.author : [];
  const tagList: any[] = Array.isArray(article.tags) ? article.tags : [];

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": article.seo?.schemaType || "NewsArticle",
    headline: article.headlineHindi || article.headline,
    image: imgUrl,
    datePublished: article.publishDate,
    dateModified: article.updatedAt,
    author: authorList.map((a) => ({ "@type": "Person", name: a.name, url: `${SITE_URL}/author/${a.slug}` })),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    description: article.excerpt || "",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/article/${params.slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Article main ── */}
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-hindi">
              <Link href="/" className="hover:text-primary">होम</Link>
              <span>›</span>
              {article.category && (
                <>
                  <Link href={`/${catSlug}`} className="hover:text-primary">
                    {article.category.nameHindi || article.category.name}
                  </Link>
                  <span>›</span>
                </>
              )}
              <span className="text-gray-400 line-clamp-1">{article.headlineHindi || article.headline}</span>
            </nav>

            {/* Category + flags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {article.category && (
                <Link href={`/${catSlug}`} className="cat-badge">
                  {article.category.nameHindi || article.category.name}
                </Link>
              )}
              {article.breakingNews && (
                <span className="live-badge text-[10px]">
                  <span className="breaking-dot"></span> Breaking News
                </span>
              )}
              {article.liveBlog && (
                <span className="live-badge text-[10px] bg-blue-600">📡 Live Blog</span>
              )}
              {article.sponsored && (
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded border border-amber-200">
                  Sponsored
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="font-hindi text-2xl md:text-3xl font-extrabold leading-tight text-gray-900 mb-3">
              {article.headlineHindi || article.headline}
            </h1>

            {/* Deck */}
            {article.deck && (
              <p className="font-hindi text-lg text-gray-600 leading-relaxed mb-4 border-l-4 pl-4 italic" style={{ borderColor: "#C8102E" }}>
                {article.deck}
              </p>
            )}

            {/* Byline */}
            <div className="flex flex-wrap items-center gap-3 py-3 border-y border-gray-100 mb-5">
              {authorList.map((a) => (
                <Link key={a.id} href={`/author/${a.slug}`} className="flex items-center gap-2">
                  {a.image && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      <Image src={getImageUrl(a.image, "thumbnail")} alt={a.name} fill className="object-cover" />
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-700 hover:text-primary">{a.name}</span>
                </Link>
              ))}
              <div className="text-xs text-gray-400 ml-auto flex flex-col items-end">
                <span>{formatDate(article.publishDate, "hi")}</span>
                <span className="text-gray-300">{timeAgo(article.publishDate)}</span>
              </div>
            </div>

            {/* Social share */}
            <ShareBar title={article.headlineHindi || article.headline} slug={params.slug} />

            {/* Hero image */}
            {article.heroMedia && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-gray-100">
                <Image src={imgUrl} alt={article.heroMedia.alt || article.headline} fill className="object-cover" priority />
                {article.heroCaption && (
                  <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-3 py-2 font-hindi">
                    {article.heroCaption}
                    {article.heroMedia.credit && ` | ${article.heroMedia.credit}`}
                  </p>
                )}
              </div>
            )}

            {/* Top article ad */}
            <AdSlot label="Advertisement" width={728} height={90} className="mb-6 hidden md:flex" />

            {/* Body */}
            <div className="article-body">
              {/* Payload richtext rendered as HTML — in real app use a RichText renderer */}
              {article.body && typeof article.body === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: article.body }} />
              ) : (
                <RichTextRenderer content={article.body} />
              )}
            </div>

            {/* Mid article ad */}
            <AdSlot label="Advertisement" width={728} height={90} className="my-6 hidden md:flex" />

            {/* Tags */}
            {tagList.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-500 mr-2 font-hindi">टैग:</span>
                <div className="inline-flex flex-wrap gap-2">
                  {tagList.map((t) => (
                    <Link
                      key={t.id}
                      href={`/tag/${t.slug}`}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-primary transition-colors font-hindi"
                    >
                      #{t.nameHindi || t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share again */}
            <div className="mt-6">
              <ShareBar title={article.headlineHindi || article.headline} slug={params.slug} />
            </div>

            {/* Source */}
            {article.sourceCredits && (
              <p className="text-xs text-gray-400 mt-4 font-hindi">स्रोत: {article.sourceCredits}</p>
            )}

            {/* Related stories */}
            {related.docs.length > 0 && (
              <section className="mt-10">
                <h2 className="font-hindi text-lg font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>
                  संबंधित खबरें
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {related.docs.map((a) => (
                    <NewsCard key={a.id} article={a} variant="compact" />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            <AdSlot label="Advertisement" width={300} height={250} className="flex" />

            {/* More from category */}
            {related.docs.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                <h3 className="font-hindi text-sm font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>
                  {article.category?.nameHindi || "और खबरें"}
                </h3>
                <div className="space-y-0">
                  {related.docs.map((a) => (
                    <NewsCard key={a.id} article={a} variant="mini" />
                  ))}
                </div>
              </div>
            )}

            <AdSlot label="Advertisement" width={300} height={600} className="flex" />
          </aside>
        </div>
      </div>
    </>
  );
}

// Simple rich text renderer for Payload's Lexical output
function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null;
  if (typeof content === "string") return <div dangerouslySetInnerHTML={{ __html: content }} />;
  // For Lexical JSON — simplified paragraph render
  try {
    const root = content?.root;
    if (!root?.children) return null;
    return (
      <div>
        {root.children.map((node: any, i: number) => {
          if (node.type === "paragraph") {
            return (
              <p key={i}>
                {node.children?.map((child: any, j: number) => {
                  if (child.type === "text") {
                    let el: React.ReactNode = child.text;
                    if (child.format & 1) el = <strong key={j}>{el}</strong>;
                    if (child.format & 2) el = <em key={j}>{el}</em>;
                    return el;
                  }
                  if (child.type === "link") {
                    return (
                      <a key={j} href={child.fields?.url || "#"}>
                        {child.children?.map((c: any) => c.text).join("")}
                      </a>
                    );
                  }
                  return null;
                })}
              </p>
            );
          }
          if (node.type === "heading") {
            const Tag = node.tag || "h2";
            return (
              <Tag key={i}>
                {node.children?.map((c: any) => c.text).join("")}
              </Tag>
            );
          }
          if (node.type === "quote") {
            return (
              <blockquote key={i}>
                {node.children?.map((c: any) => c.text).join("")}
              </blockquote>
            );
          }
          return null;
        })}
      </div>
    );
  } catch {
    return null;
  }
}

function ShareBar({ title, slug }: { title: string; slug: string }) {
  const url = `${SITE_URL}/article/${slug}`;
  const encoded = encodeURIComponent(url);
  const titleEnc = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-2 my-4">
      <span className="text-xs text-gray-500 font-ui mr-1">Share:</span>
      {[
        {
          label: "WhatsApp",
          color: "#25D366",
          href: `https://wa.me/?text=${titleEnc}%20${encoded}`,
          icon: "W",
        },
        {
          label: "Twitter",
          color: "#1DA1F2",
          href: `https://twitter.com/intent/tweet?text=${titleEnc}&url=${encoded}`,
          icon: "𝕏",
        },
        {
          label: "Facebook",
          color: "#1877F2",
          href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
          icon: "f",
        },
        {
          label: "Telegram",
          color: "#0088cc",
          href: `https://t.me/share/url?url=${encoded}&text=${titleEnc}`,
          icon: "✈",
        },
      ].map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          title={s.label}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity"
          style={{ backgroundColor: s.color }}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}
