import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/common/PageHero";
import { getWebStories, getImageUrl } from "@/lib/api";

export const metadata: Metadata = { title: "Web Stories", description: "Namo Bharat News 24 web stories." };

export default async function WebStoriesPage() {
  const stories = await getWebStories(24).catch(() => ({ docs: [] as any[] }));

  return (
    <>
      <PageHero title="वेब स्टोरी" description="शॉर्ट विजुअल फॉर्मेट में प्रमुख खबरें और अपडेट्स।" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {stories.docs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {stories.docs.map((story: any) => {
              const image = getImageUrl(story.coverImage, "thumbnail");
              return (
                <Link key={story.id} href={`/web-stories/${story.slug}`} className="group rounded-xl overflow-hidden border border-gray-100 bg-white">
                  <div className="relative h-52 bg-gray-100">
                    {image ? <Image src={image} alt={story.titleHindi || story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" /> : null}
                  </div>
                  <div className="p-3 font-hindi text-sm font-semibold line-clamp-2">{story.titleHindi || story.title}</div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-600 font-hindi rounded-lg border border-dashed border-gray-300 p-8 text-center">अभी कोई वेब स्टोरी प्रकाशित नहीं है।</div>
        )}
      </div>
    </>
  );
}
