import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";
import { newsroomMeta } from "@/lib/site-config";

export const metadata: Metadata = { title: "हमारे बारे में", description: "नमो: भारत न्यूज़ 24 के बारे में जानकारी।" };

export default function AboutPage() {
  return (
    <StaticPageLayout title="हमारे बारे में" description="तथ्य स्पष्ट, विचार निष्पक्ष।">
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
