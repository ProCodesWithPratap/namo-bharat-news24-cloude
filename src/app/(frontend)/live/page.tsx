import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/common/PageHero";
import { getActiveLiveBlogs } from "@/lib/api";

export const metadata: Metadata = { title: "Live TV / Live Updates", description: "लाइव अपडेट्स और सक्रिय लाइव ब्लॉग देखें।" };

export default async function LivePage() {
  const liveBlogs = await getActiveLiveBlogs(10).catch(() => ({ docs: [] }));
  return (
    <>
      <PageHero title="Live TV / Live Updates" description="ब्रेकिंग इवेंट्स, चुनाव, खेल और बड़े घटनाक्रम पर रियल-टाइम अपडेट्स।" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-black text-white rounded-xl aspect-video flex items-center justify-center font-hindi mb-8">Live Stream Placeholder</div>
        <h2 className="font-hindi text-xl font-bold mb-4">सक्रिय लाइव ब्लॉग</h2>
        <div className="space-y-3">
          {liveBlogs.docs.length ? liveBlogs.docs.map((blog: any) => (
            <Link key={blog.id} href={`/live/${blog.slug}`} className="block border border-gray-200 rounded-lg p-4 hover:border-[#C8102E]">
              <p className="font-hindi font-semibold">{blog.titleHindi || blog.title}</p>
            </Link>
          )) : <p className="text-gray-500 font-hindi">अभी कोई सक्रिय लाइव ब्लॉग उपलब्ध नहीं है।</p>}
        </div>
      </div>
    </>
  );
}
