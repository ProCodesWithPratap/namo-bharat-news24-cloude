import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";

export const metadata: Metadata = { title: "Web Stories", description: "Namo Bharat News 24 web stories." };

export default function WebStoriesPage() {
  return (
    <>
      <PageHero title="वेब स्टोरी" description="शॉर्ट विजुअल फॉर्मेट में प्रमुख खबरें और अपडेट्स।" />
      <div className="max-w-5xl mx-auto px-4 py-8 text-gray-600 font-hindi">वेब स्टोरी मॉड्यूल तैयार है। कंटेंट आते ही यहां ऑटो-पब्लिश होगा।</div>
    </>
  );
}
