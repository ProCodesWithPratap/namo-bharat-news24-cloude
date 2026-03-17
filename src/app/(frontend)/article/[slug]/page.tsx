import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles, getImageUrl, formatDate, timeAgo } from "@/lib/api";
import NewsCard from "@/components/ui/NewsCard";
import AdSlot from "@/components/ui/AdSlot";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 30;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
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
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: article.seo?.canonicalUrl || `${SITE_URL}/article/${slug}` },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== "published") notFound();

  const catSlug = article.category?.slug || "national";
  const related = await getRelatedArticles(article.id, catSlug, 4).catch(() => ({ docs: [] }));
  const imgUrl = getImageUrl(article.heroMedia, "hero");
  const authorList: any[] = Array.isArray(article.author) ? article.author : [];
  const tagList: any[] = Array.isArray(article.tags) ? article.tags : [];
  const articleUrl = `${SITE_URL}/article/${slug}`;
  const showUpdated = article.updatedAt && article.updatedAt !== article.publishDate;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": article.seo?.schemaType || "NewsArticle",
    headline: article.headlineHindi || article.headline,
    image: imgUrl,
    datePublished: article.publishDate,
    dateModified: article.updatedAt,
    author: authorList.map((a) => ({ "@type": "Person", name: a.name })),
    publisher: { "@type": "Organization", name: SITE_NAME },
    description: article.excerpt || "",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "होम", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: article.category?.nameHindi || article.category?.name || "राष्ट्रीय",
        item: `${SITE_URL}/${catSlug}`,
      },
      { "@type": "ListItem", position: 3, name: article.headlineHindi || article.headline, item: articleUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
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
            </div>

            <h1 className="font-hindi text-2xl md:text-3xl font-extrabold leading-tight text-gray-900 mb-3">
              {article.headlineHindi || article.headline}
            </h1>

            {article.deck && (
              <p className="font-hindi text-lg text-gray-600 leading-relaxed mb-4 border-l-4 pl-4 italic" style={{ borderColor: "#C8102E" }}>
                {article.deck}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 py-3 border-y border-gray-100 mb-5 font-hindi">
              {authorList.map((a) => (
                <span key={a.id} className="text-sm font-semibold text-gray-700">{a.name}</span>
              ))}
              <div className="text-xs text-gray-500 ml-auto flex items-center gap-3">
                <span>प्रकाशित: {formatDate(article.publishDate, "hi")}</span>
                {showUpdated && <span>अपडेट: {timeAgo(article.updatedAt)}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 my-4">
              <span className="text-xs text-gray-500 mr-1 font-hindi">शेयर करें:</span>
              {[
                { label: "WhatsApp", color: "#25D366", href: `https://wa.me/?text=${encodeURIComponent(article.headlineHindi || article.headline)}%20${encodeURIComponent(articleUrl)}`, icon: "W" },
                { label: "Telegram", color: "#229ED9", href: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.headlineHindi || article.headline)}`, icon: "T" },
                { label: "Twitter", color: "#1DA1F2", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.headlineHindi || article.headline)}&url=${encodeURIComponent(articleUrl)}`, icon: "𝕏" },
                { label: "Facebook", color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, icon: "f" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity" style={{ backgroundColor: s.color }} aria-label={s.label}>{s.icon}</a>
              ))}
            </div>

            {article.heroMedia && (
              <figure className="mb-6">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image src={imgUrl} alt={article.heroMedia.alt || article.headline} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
                </div>
                {article.heroCaption && <figcaption className="text-xs text-gray-500 mt-2 font-hindi">{article.heroCaption}</figcaption>}
              </figure>
            )}

            <AdSlot label="Advertisement" width={728} height={90} className="mb-6 hidden md:flex" />

            <div className="article-body">
              {article.body && typeof article.body === "string" ? <div dangerouslySetInnerHTML={{ __html: article.body }} /> : <RichTextRenderer content={article.body} />}
            </div>

            <div className="mt-8 rounded-xl bg-gray-900 text-white p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between font-hindi">
              <p className="text-sm md:text-base font-semibold">यह खबर उपयोगी लगी? अपने दोस्तों तक तुरंत पहुंचाएं।</p>
              <div className="flex gap-2">
                <a href={`https://wa.me/?text=${encodeURIComponent(article.headlineHindi || article.headline)}%20${encodeURIComponent(articleUrl)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">WhatsApp पर शेयर</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">Facebook पर शेयर</a>
              </div>
            </div>

            {tagList.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-500 mr-2 font-hindi">टैग:</span>
                {tagList.map((t) => (
                  <Link key={t.id} href={`/tag/${t.slug}`} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-primary transition-colors font-hindi mr-2">#{t.nameHindi || t.name}</Link>
                ))}
              </div>
            )}

            {related.docs.length > 0 && (
              <section className="mt-10">
                <h2 className="font-hindi text-lg font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>संबंधित खबरें</h2>
                <div className="grid grid-cols-2 gap-4">{related.docs.map((a) => <NewsCard key={a.id} article={a} variant="compact" />)}</div>
              </section>
            )}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <div className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 p-4 text-white shadow-lg">
              <h3 className="font-hindi text-lg font-extrabold">WhatsApp चैनल जॉइन करें</h3>
              <p className="font-hindi text-sm text-green-50 mt-1">ब्रेकिंग न्यूज़ और बड़ी अपडेट सबसे पहले सीधे WhatsApp पर पाएं।</p>
              <a href="https://whatsapp.com/channel/0029VbCBrGu6hENlyE9rvW3N" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex px-4 py-2 rounded-lg bg-white text-green-700 font-hindi font-bold hover:bg-green-50 transition-colors">चैनल से जुड़ें</a>
            </div>
            <AdSlot label="Advertisement" width={300} height={250} className="flex" />
            {related.docs.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                <h3 className="font-hindi text-sm font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>{article.category?.nameHindi || "और खबरें"}</h3>
                <div>{related.docs.map((a) => <NewsCard key={a.id} article={a} variant="mini" />)}</div>
              </div>
            )}
            <AdSlot label="Advertisement" width={300} height={600} className="flex" />
          </aside>
        </div>
      </div>
    </>
  );
}

function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null;
  if (typeof content === "string") return <div dangerouslySetInnerHTML={{ __html: content }} />;

  const renderChildren = (children: any[] = []) =>
    children.map((child: any, index: number) => {
      if (child?.type === "link") {
        const href = child.fields?.url || "#";
        return (
          <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
            {renderChildren(child.children || [])}
          </a>
        );
      }

      const text = child?.text || "";
      if (!text) return null;

      let node: any = text;
      if (child.format & 1) node = <strong key={`b-${index}`}>{node}</strong>;
      if (child.format & 2) node = <em key={`i-${index}`}>{node}</em>;
      return <span key={index}>{node}</span>;
    });

  try {
    const root = content?.root;
    if (!root?.children) return null;

    return (
      <div>
        {root.children.map((node: any, i: number) => {
          if (node.type === "paragraph") return <p key={i}>{renderChildren(node.children)}</p>;
          if (node.type === "heading") {
            const Tag = node.tag || "h2";
            return <Tag key={i}>{renderChildren(node.children)}</Tag>;
          }
          if (node.type === "quote") return <blockquote key={i}>{renderChildren(node.children)}</blockquote>;
          if (node.type === "ul") return <ul key={i} className="list-disc pl-6">{node.children?.map((li: any, liIdx: number) => <li key={liIdx}>{renderChildren(li.children)}</li>)}</ul>;
          if (node.type === "ol") return <ol key={i} className="list-decimal pl-6">{node.children?.map((li: any, liIdx: number) => <li key={liIdx}>{renderChildren(li.children)}</li>)}</ol>;
          return null;
        })}
      </div>
    );
  } catch {
    return null;
  }
}
