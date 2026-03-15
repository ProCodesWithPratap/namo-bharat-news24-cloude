import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";
import { newsroomMeta } from "@/lib/site-config";

export const metadata: Metadata = { title: "Contact Us", description: "Namo Bharat News 24 से संपर्क करें।" };

export default function ContactPage() {
  return (
    <StaticPageLayout title="संपर्क करें" description="न्यूज़ टिप, विज्ञापन, या संपादकीय सहयोग के लिए हमसे संपर्क करें।">
      <div className="space-y-3">
        <p><strong>News Desk:</strong> {newsroomMeta.contactEmail}</p>
        <p><strong>Editorial:</strong> {newsroomMeta.editorialEmail}</p>
        <p><strong>Phone:</strong> {newsroomMeta.phone}</p>
        <p><strong>Address:</strong> {newsroomMeta.address}</p>
      </div>
    </StaticPageLayout>
  );
}
