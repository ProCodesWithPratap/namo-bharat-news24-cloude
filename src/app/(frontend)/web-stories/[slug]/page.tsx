import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWebStories } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Web Story: ${slug}`, description: "वेब स्टोरी विवरण" };
}

export default async function WebStoryDetail({ params }: Props) {
  const { slug } = await params;
  const stories = await getWebStories(50).catch(() => ({ docs: [] as any[] }));
  const story = stories.docs.find((item: any) => item.slug === slug);
  if (!story) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-hindi text-3xl font-extrabold mb-4">{story.titleHindi || story.title}</h1>
      <p className="font-hindi text-gray-600">यह वेब स्टोरी का डिटेल व्यू है।</p>
    </div>
  );
}
