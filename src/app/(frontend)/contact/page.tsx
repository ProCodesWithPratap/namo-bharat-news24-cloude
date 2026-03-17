import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";
import { newsroomMeta, socialLinks } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "संपर्क | नमो: भारत न्यूज़ 24",
  description: "नमो: भारत न्यूज़ 24 से संपर्क करें। विज्ञापन, खबर भेजने या किसी भी जानकारी के लिए हमें कॉल, WhatsApp या ईमेल करें। फोन: +91-91628 68368।",
  alternates: { canonical: "https://namo-bharat-news24-cloude.vercel.app/contact" },
};

export default function ContactPage() {
  return (
    <StaticPageLayout title="संपर्क करें" description="हमसे जुड़ें और सच्ची पत्रकारिता का हिस्सा बनें">
      <div className="space-y-3">
        <p className="font-hindi">{newsroomMeta.valueStatement}</p>
        <p><strong>न्यूज़ डेस्क:</strong> {newsroomMeta.contactEmail || "—"}</p>
        <p><strong>एडिटोरियल:</strong> {newsroomMeta.editorialEmail || "—"}</p>
        <p><strong>फोन:</strong> {newsroomMeta.phone ? <a href={`tel:${newsroomMeta.phone.replace(/\s+/g, "")}`}>{newsroomMeta.phone}</a> : "—"}</p>
        <p><strong>WhatsApp Channel:</strong> <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">{socialLinks.whatsapp}</a></p>
        <p><strong>पता:</strong> {newsroomMeta.address}</p>
        <p><strong>Facebook:</strong> <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">{socialLinks.facebook}</a></p>
        <p><strong>Instagram:</strong> <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">{socialLinks.instagram}</a></p>
        <p><strong>YouTube:</strong> <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">{socialLinks.youtube}</a></p>
      </div>
    </StaticPageLayout>
  );
}
