import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";
import { getSiteSettingsData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "हमारे बारे में | नमो: भारत न्यूज़ 24",
  description: "नमो: भारत न्यूज़ 24 — भारत की तेज़, सटीक और निष्पक्ष हिंदी खबरें। हमारे मिशन, संपादकीय मानकों और न्यूज़रूम टीम के बारे में जानें।",
  alternates: { canonical: "https://namo-bharat-news24-cloude.vercel.app/about" },
};

export default async function AboutPage() {
  const { newsroomMeta } = await getSiteSettingsData();

  return (
    <StaticPageLayout title="हमारे बारे में" description={newsroomMeta.tagline}>
      <p>{newsroomMeta.about}</p>
      <p className="mt-3">{newsroomMeta.joinMessage}</p>
      <h2 className="font-bold text-lg mt-6 mb-2">हमारा मिशन</h2>
      <p>तेज, तथ्यात्मक और जनहित से जुड़ी पत्रकारिता को हिंदी पाठकों तक सरल भाषा में पहुंचाना हमारा मुख्य उद्देश्य है।</p>
      <h2 className="font-bold text-lg mt-6 mb-2">संपादकीय मानक</h2>
      <p>हर खबर को प्रकाशित करने से पहले मल्टी-सोर्स वेरिफिकेशन, संदर्भ जांच और कॉपी डेस्क रिव्यू किया जाता है।</p>
      <p className="mt-3 font-hindi">{newsroomMeta.valueStatement}</p>
    </StaticPageLayout>
  );
}
