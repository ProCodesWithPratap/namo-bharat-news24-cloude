import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";
import { newsroomMeta, socialLinks } from "@/lib/site-config";

export const metadata: Metadata = { title: "विज्ञापन दें", description: "नमो: भारत न्यूज़ 24 पर विज्ञापन दें।" };

export default function AdvertisePage() {
  return (
    <StaticPageLayout title="विज्ञापन दें" description="ब्रांड कैंपेन, स्पॉन्सर्ड कंटेंट और डिस्प्ले विज्ञापन के लिए संपर्क करें।">
      <p>हम डिस्प्ले बैनर, वीडियो प्री-रोल, और ब्रांडेड कंटेंट पैकेज उपलब्ध कराते हैं।</p>
      <p className="mt-3"><strong>Advertising Contact:</strong> {newsroomMeta.contactEmail || "—"}</p>
      <p><strong>फोन:</strong> <a href={`tel:${newsroomMeta.phone.replace(/\s+/g, "")}`}>{newsroomMeta.phone}</a></p>
      <p><strong>WhatsApp Channel:</strong> <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">{socialLinks.whatsapp}</a></p>
      <p><strong>पता:</strong> {newsroomMeta.address}</p>
    </StaticPageLayout>
  );
}
