import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";
import { newsroomMeta } from "@/lib/site-config";

export const metadata: Metadata = { title: "Advertise With Us", description: "Namo Bharat News 24 पर विज्ञापन दें।" };

export default function AdvertisePage() {
  return (
    <StaticPageLayout title="Advertise With Us" description="ब्रांड कैंपेन, स्पॉन्सर्ड कंटेंट और डिस्प्ले विज्ञापन के लिए संपर्क करें।">
      <p>हम डिस्प्ले बैनर, वीडियो प्री-रोल, और ब्रांडेड कंटेंट पैकेज उपलब्ध कराते हैं।</p>
      <p className="mt-3"><strong>Advertising Contact:</strong> {newsroomMeta.contactEmail || "फिलहाल उपलब्ध नहीं"}</p>
      <p><strong>Phone:</strong> {newsroomMeta.phone || "फिलहाल उपलब्ध नहीं"}</p>
    </StaticPageLayout>
  );
}
