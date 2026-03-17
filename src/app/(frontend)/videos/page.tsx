import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/ui/AdSlot";
import { getVideos } from "@/lib/api";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "वीडियो न्यूज़ | नमो: भारत न्यूज़ 24",
  description:
    "नमो: भारत न्यूज़ 24 के ताजा वीडियो — बिहार, राष्ट्रीय और अंतर्राष्ट्रीय खबरें वीडियो फॉर्मेट में देखें। YouTube पर Subscribe करें।",
  alternates: { canonical: `${SITE_URL}/videos` },
};

function getYouTubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
  return match?.[1] || null;
}

function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export default async function VideosPage() {
  const videos = await getVideos(20).catch(() => ({ docs: [] }));
  const featured = videos.docs?.[0];
  const rest = videos.docs?.slice(1) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "वीडियो न्यूज़",
    url: `${SITE_URL}/videos`,
    description: metadata.description,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-hindi text-2xl font-extrabold text-gray-900 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>
            📺 वीडियो न्यूज़
          </h1>
          <a
            href="https://youtube.com/@namobharatnews24live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF0000] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
            </svg>
            YouTube Subscribe
          </a>
        </div>

        <AdSlot label="Advertisement" width={970} height={90} className="mb-8 hidden md:flex" />

        {featured && (
          <section className="mb-10">
            <h2 className="font-hindi text-xl font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>
              🎬 फीचर्ड वीडियो
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 rounded-xl border border-gray-100 bg-white overflow-hidden">
              <Link href={`/video/${featured.slug}`} className="group relative lg:col-span-3 aspect-video bg-gray-200">
                {(getYouTubeThumbnail(featured.embedUrl || "") || featured.thumbnail?.url) && (
                  <Image
                    src={getYouTubeThumbnail(featured.embedUrl || "") || featured.thumbnail?.url}
                    alt={featured.titleHindi || featured.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
                {featured.duration && (
                  <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs text-white">{featured.duration}</span>
                )}
              </Link>
              <div className="lg:col-span-2 p-5">
                <p className="mb-2 text-[10px] uppercase tracking-wide font-bold text-red-600">
                  {featured.category?.nameHindi || featured.category?.name || "Video"}
                </p>
                <Link href={`/video/${featured.slug}`}>
                  <h3 className="font-hindi text-lg font-extrabold text-gray-900 hover:text-primary transition-colors">
                    {featured.titleHindi || featured.title}
                  </h3>
                </Link>
                {featured.description && (
                  <p className="mt-3 text-sm text-gray-600 font-hindi line-clamp-3">{featured.description}</p>
                )}
                <Link href={`/video/${featured.slug}`} className="mt-4 inline-flex rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-bold text-white">
                  ▶ अभी देखें
                </Link>
              </div>
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section>
            <h2 className="font-hindi text-xl font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>
              और वीडियो
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rest.map((video: any) => {
                const thumb = getYouTubeThumbnail(video.embedUrl || "") || video.thumbnail?.url;
                return (
                  <Link key={video.id} href={`/video/${video.slug}`} className="group overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="relative aspect-video bg-gray-200">
                      {thumb && <Image src={thumb} alt={video.titleHindi || video.title} fill className="object-cover" />}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 transition-colors group-hover:bg-red-600">
                          <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4 ml-0.5">
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        </div>
                      </div>
                      {video.duration && <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">{video.duration}</span>}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold uppercase text-red-600 mb-1">{video.category?.nameHindi || video.category?.name || "Video"}</p>
                      <h3 className="font-hindi text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary">{video.titleHindi || video.title}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {videos.docs.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center">
            <div className="text-5xl mb-4">📺</div>
            <p className="font-hindi text-gray-500 mb-5">अभी कोई वीडियो प्रकाशित नहीं है।</p>
            <a
              href="https://youtube.com/@namobharatnews24live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-[#FF0000] px-4 py-2 text-sm font-bold text-white"
            >
              YouTube पर देखें
            </a>
          </div>
        )}
      </div>
    </>
  );
}
