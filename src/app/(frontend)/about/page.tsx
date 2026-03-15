import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";
import { newsroomMeta } from "@/lib/site-config";

export const metadata: Metadata = { title: "About Us", description: "Namo Bharat News 24 के बारे में जानकारी।" };

export default function AboutPage() {
  return (
    <StaticPageLayout title="हमारे बारे में" description="Namo Bharat News 24 का मिशन और संपादकीय मूल्यों की जानकारी।">
      <p>{newsroomMeta.about}</p>
      <h2 className="font-bold text-lg mt-6 mb-2">हमारा मिशन</h2>
      <p>तेज, तथ्यात्मक और जनहित से जुड़ी पत्रकारिता को हिंदी पाठकों तक सरल भाषा में पहुंचाना हमारा मुख्य उद्देश्य है।</p>
      <h2 className="font-bold text-lg mt-6 mb-2">Editorial Standards</h2>
      <p>हर खबर को प्रकाशित करने से पहले मल्टी-सोर्स वेरिफिकेशन, संदर्भ जांच और कॉपी डेस्क रिव्यू किया जाता है।</p>
    </StaticPageLayout>
  );
}
