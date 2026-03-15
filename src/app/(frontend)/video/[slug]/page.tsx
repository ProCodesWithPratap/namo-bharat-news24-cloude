import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/utils";

export const revalidate = 60;
interface Props { params: { slug: string } }

// Since we don't have a direct getVideoBySlug, quick fetch
async function getVideoBySlug(slug: string) {
  const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  const res = await fetch(`${API}/api/videos?where[slug][equals]=${slug}&limit=1&depth=2`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.docs?.[0] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = await getVideoBySlug(params.slug);
  if (!v) return { title: "Not Found" };
  return { title: `${v.titleHindi || v.title} | ${SITE_NAME}` };
}

function getYouTubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default async function VideoPage({ params }: Props) {
  const video = await getVideoBySlug(params.slug);
  if (!video) notFound();

  const ytId = getYouTubeId(video.embedUrl || "");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-hindi text-xl md:text-2xl font-extrabold mb-4 text-gray-900">
        {video.titleHindi || video.title}
      </h1>

      {ytId ? (
        <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : video.hostedFile?.url ? (
        <video controls className="w-full rounded-lg mb-6" poster={video.thumbnail?.url}>
          <source src={video.hostedFile.url} />
        </video>
      ) : null}

      {video.description && (
        <p className="font-hindi text-gray-600 leading-relaxed">{video.description}</p>
      )}
    </div>
  );
}
