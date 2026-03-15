import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLiveBlogBySlug, getImageUrl, timeAgo } from "@/lib/api";
import { SITE_NAME } from "@/lib/utils";

export const revalidate = 30;
interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getLiveBlogBySlug(params.slug);
  if (!blog) return { title: "Not Found" };
  return {
    title: `LIVE: ${blog.titleHindi || blog.title} | ${SITE_NAME}`,
    description: `Live updates on ${blog.titleHindi || blog.title}`,
  };
}

export default async function LiveBlogPage({ params }: Props) {
  const blog = await getLiveBlogBySlug(params.slug);
  if (!blog) notFound();

  const entries: any[] = [...(blog.entries || [])].sort(
    (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          {blog.status === "active" && (
            <span className="live-badge">
              <span className="breaking-dot"></span> LIVE
            </span>
          )}
          <span className="text-xs text-gray-400">
            {entries.length} updates
          </span>
        </div>
        <h1 className="font-hindi text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
          {blog.titleHindi || blog.title}
        </h1>
      </div>

      {/* Intro */}
      {blog.intro && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <h2 className="font-hindi text-sm font-bold text-gray-700 mb-2">संदर्भ / Context</h2>
          {/* render richtext */}
          <div className="font-hindi text-sm text-gray-600">
            {typeof blog.intro === "string" ? blog.intro : ""}
          </div>
        </div>
      )}

      {/* Entries */}
      <div className="space-y-0">
        {entries.map((entry: any, i: number) => (
          <div key={i} className="flex gap-4 border-b border-gray-100 pb-6 pt-6 first:pt-0">
            {/* Time column */}
            <div className="shrink-0 text-right w-20">
              <div className="font-ui font-bold text-sm" style={{ color: entry.type === "breaking" ? "#C8102E" : "#374151" }}>
                {new Date(entry.timestamp).toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {new Date(entry.timestamp).toLocaleDateString("hi-IN", { day: "numeric", month: "short" })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {entry.type === "breaking" && (
                <span className="live-badge text-[10px] mb-2 inline-flex">
                  <span className="breaking-dot"></span> Breaking
                </span>
              )}
              {entry.type === "statement" && (
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded mb-2 inline-block">
                  Official Statement
                </span>
              )}

              <div className="font-hindi text-base text-gray-800 leading-relaxed">
                {typeof entry.content === "string"
                  ? entry.content
                  : entry.content?.root?.children?.map((n: any) =>
                      n.children?.map((c: any) => c.text).join("")
                    ).join(" ")}
              </div>

              {entry.media && (
                <div className="relative aspect-video mt-3 rounded overflow-hidden max-w-md">
                  <Image
                    src={getImageUrl(entry.media, "card")}
                    alt="Update image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {entry.author && (
                <p className="text-xs text-gray-400 mt-2">
                  — {entry.author.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-400 font-hindi">
          <div className="text-4xl mb-3">📡</div>
          <p>अपडेट जल्द आएंगे...</p>
        </div>
      )}
    </div>
  );
}
