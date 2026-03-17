import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";

export const metadata: Metadata = { title: "E-paper", description: "डिजिटल ई-पेपर संस्करण देखें।" };

export default function EPaperPage() {
  return (
    <>
      <PageHero title="ई-पेपर" description="हमारा डिजिटल ई-पेपर संस्करण जल्द उपलब्ध होगा। अभी के लिए आप Latest और National सेक्शन देख सकते हैं।" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center font-hindi text-gray-600">ई-पेपर संस्करण की तैयारी जारी है। प्रकाशित होते ही यह पेज स्वतः अपडेट होगा।</div>
      </div>
    </>
  );
}
