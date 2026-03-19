import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";
import { getSiteSettingsData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "संपर्क | नमो: भारत न्यूज़ 24",
  description: "नमो: भारत न्यूज़ 24 से संपर्क करें। विज्ञापन, खबर भेजने या किसी भी जानकारी के लिए हमें कॉल, WhatsApp या ईमेल करें। फोन: +91-91628 68368।",
  alternates: { canonical: "https://namo-bharat-news24-cloude.vercel.app/contact" },
};

export default async function ContactPage() {
  const { newsroomMeta, socialLinks } = await getSiteSettingsData();

  return (
    <StaticPageLayout title="संपर्क करें" description={newsroomMeta.joinMessage}>
      <div className="space-y-3">
        <p className="font-hindi">{newsroomMeta.valueStatement}</p>
        <p><strong>न्यूज़ डेस्क:</strong> {newsroomMeta.contactEmail || "—"}</p>
        <p><strong>एडिटोरियल:</strong> {newsroomMeta.editorialEmail || "—"}</p>
        <p><strong>फोन:</strong> {newsroomMeta.phone ? <a href={`tel:${newsroomMeta.phone.replace(/\s+/g, "")}`}>{newsroomMeta.phone}</a> : "—"}</p>
        <p><strong>WhatsApp Channel:</strong> {socialLinks.whatsapp ? <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">{socialLinks.whatsapp}</a> : "—"}</p>
        <p><strong>पता:</strong> {newsroomMeta.address}</p>
        <p><strong>Facebook:</strong> {socialLinks.facebook ? <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">{socialLinks.facebook}</a> : "—"}</p>
        <p><strong>Instagram:</strong> {socialLinks.instagram ? <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">{socialLinks.instagram}</a> : "—"}</p>
        <p><strong>YouTube:</strong> {socialLinks.youtube ? <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">{socialLinks.youtube}</a> : "—"}</p>
      </div>
    </StaticPageLayout>
  );
}
