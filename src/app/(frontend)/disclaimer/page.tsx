import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";

export const metadata: Metadata = { title: "Disclaimer", description: "कंटेंट उपयोग से संबंधित अस्वीकरण।" };

export default function DisclaimerPage() {
  return (
    <StaticPageLayout title="Disclaimer" description="कंटेंट, राय और बाहरी लिंक से जुड़ी अस्वीकरण जानकारी।">
      <p>खबरों में दी गई जानकारी विश्वसनीय स्रोतों पर आधारित है, लेकिन पूर्ण सटीकता की गारंटी नहीं दी जा सकती।</p>
      <p className="mt-3">निवेश, स्वास्थ्य या कानूनी मामलों में प्रकाशित सामग्री को अंतिम सलाह न माना जाए।</p>
    </StaticPageLayout>
  );
}
