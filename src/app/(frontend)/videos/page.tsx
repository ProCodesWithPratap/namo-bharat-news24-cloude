import type { Metadata } from "next";
import { getVideos } from "@/lib/api";
import { SITE_NAME } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `वीडियो | ${SITE_NAME}`,
  description: "लाइव हिंदुस्तान के ताजा वीडियो न्यूज़",
};

function getYouTubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default async function VideosPage() {
  const videos = await getVideos(20).catch(() => ({ docs: [] }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-l-4 pl-4 mb-8" style={{ borderColor: "#C8102E" }}>
        <h1 className="font-hindi text-2xl font-extrabold text-gray-900">📺 वीडियो</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {videos.docs.map((v: any) => {
          const ytId = getYouTubeId(v.embedUrl || "");
          const thumb = ytId
            ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
            : v.thumbnail?.url;

          return (
            <Link key={v.id} href={`/video/${v.slug}`} className="group block news-card rounded-lg overflow-hidden bg-white border border-gray-100">
              <div className="relative aspect-video bg-gray-200 overflow-hidden">
                {thumb && (
                  <Image src={thumb} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-primary transition-colors" style={{ "--tw-bg-opacity": "1" } as any}>
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
                {v.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-ui">
                    {v.duration}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h2 className="font-hindi text-sm font-semibold text-gray-800 group-hover:text-primary line-clamp-2 transition-colors">
                  {v.titleHindi || v.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>

      {videos.docs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📺</div>
          <p className="font-hindi">कोई वीडियो नहीं मिला</p>
        </div>
      )}
    </div>
  );
}
