import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/ui/AdSlot";
import { getVideos } from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function getYouTubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
  return match?.[1] || null;
}

function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

async function getVideoBySlug(slug: string) {
  const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") || "http://localhost:3000";
  try {
    const res = await fetch(
      `${base}/api/videos?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=2`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return { title: "Not Found" };

  const title = `${video.titleHindi || video.title} | ${SITE_NAME}`;
  const description = video.description || video.transcript?.slice(0, 160) || "";
  const ogImage = getYouTubeThumbnail(video.embedUrl || "") || video.thumbnail?.url || undefined;

  return {
    title,
    description,
    openGraph: {
      type: "video.other",
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    alternates: { canonical: `${SITE_URL}/video/${slug}` },
  };
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;

  const [video, relatedData] = await Promise.all([getVideoBySlug(slug), getVideos(5)]);
  if (!video) notFound();

  const related = (relatedData.docs || []).filter((item: any) => item.slug !== video.slug);
  const ytId = getYouTubeId(video.embedUrl || "");
  const videoUrl = `${SITE_URL}/video/${video.slug}`;
  const thumbnailUrl = getYouTubeThumbnail(video.embedUrl || "") || video.thumbnail?.url || undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.titleHindi || video.title,
    description: video.description || "",
    thumbnailUrl: thumbnailUrl ? [thumbnailUrl] : undefined,
    uploadDate: video.publishDate || video.createdAt,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    embedUrl: ytId ? `https://www.youtube.com/embed/${ytId}` : video.embedUrl || undefined,
    duration: video.duration || undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            <nav className="mb-3 text-xs text-gray-500 font-hindi">
              <Link href="/" className="hover:text-primary">होम</Link> › <Link href="/videos" className="hover:text-primary">वीडियो</Link> › <span>{video.titleHindi || video.title}</span>
            </nav>

            {video.category?.slug && (
              <Link href={`/${video.category.slug}`} className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 mb-3">
                {video.category?.nameHindi || video.category?.name}
              </Link>
            )}

            <h1 className="font-hindi text-xl md:text-2xl font-extrabold text-gray-900 mb-4">{video.titleHindi || video.title}</h1>

            {ytId ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0&modestbranding=1`}
                  title={video.titleHindi || video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            ) : video.hostedFile?.url ? (
              <video controls className="w-full rounded-xl mb-4" poster={video.thumbnail?.url} preload="metadata">
                <source src={video.hostedFile.url} />
              </video>
            ) : (
              <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-xl bg-gray-100 font-hindi text-gray-500">
                वीडियो उपलब्ध नहीं है
              </div>
            )}

            <p className="mb-4 text-xs text-gray-400 font-hindi">
              {video.publishDate ? new Date(video.publishDate).toLocaleDateString("hi-IN") : ""}
              {video.duration ? ` • अवधि: ${video.duration}` : ""}
            </p>

            {video.description && <p className="font-hindi text-gray-700 leading-relaxed text-base">{video.description}</p>}

            <div className="mt-6 flex items-center gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent((video.titleHindi || video.title) + " " + videoUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "#25D366" }}
                aria-label="Share on WhatsApp"
              >
                W
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "#1877F2" }}
                aria-label="Share on Facebook"
              >
                f
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(video.titleHindi || video.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "#000" }}
                aria-label="Share on X"
              >
                X
              </a>
            </div>

            {video.transcript && (
              <details className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
                <summary className="cursor-pointer font-hindi font-bold">📝 वीडियो ट्रांसक्रिप्ट</summary>
                <p className="mt-3 whitespace-pre-line font-hindi text-sm text-gray-700">{video.transcript}</p>
              </details>
            )}

            <AdSlot label="Advertisement" width={728} height={90} className="hidden md:flex mt-8" />
          </main>

          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <AdSlot label="Advertisement" width={300} height={250} className="flex" />

            <div className="rounded-xl p-5 text-white" style={{ backgroundColor: "#FF0000" }}>
              <h3 className="font-hindi text-lg font-extrabold">📺 YouTube पर Subscribe करें</h3>
              <p className="mt-1 font-hindi text-sm text-red-100">रोज़ की वीडियो खबरें सबसे पहले</p>
              <a
                href="https://youtube.com/@namobharatnews24live"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 font-hindi font-bold text-[#FF0000]"
              >
                Subscribe करें →
              </a>
            </div>

            {related.length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <h3 className="mb-4 border-l-4 pl-3 font-hindi text-sm font-extrabold" style={{ borderColor: "#C8102E" }}>
                  और वीडियो
                </h3>
                <div className="space-y-3">
                  {related.map((item: any) => {
                    const thumb = getYouTubeThumbnail(item.embedUrl || "") || item.thumbnail?.url;
                    return (
                      <Link key={item.id} href={`/video/${item.slug}`} className="flex gap-3">
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                          {thumb && <Image src={thumb} alt={item.titleHindi || item.title} fill className="object-cover" />}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="rounded-full bg-black/60 p-1.5 text-white text-[10px]">▶</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-hindi text-xs font-semibold line-clamp-2 text-gray-800 hover:text-primary">{item.titleHindi || item.title}</p>
                          {item.duration && <p className="mt-1 text-[11px] text-gray-500">{item.duration}</p>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link href="/videos" className="mt-4 block text-center font-hindi text-sm font-bold" style={{ color: "#C8102E" }}>
                  सभी वीडियो देखें →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
