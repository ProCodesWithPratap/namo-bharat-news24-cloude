import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";

export const metadata: Metadata = {
  title: "उपयोग की शर्तें | नमो: भारत न्यूज़ 24",
  description: "नमो: भारत न्यूज़ 24 के उपयोग की शर्तें — इस वेबसाइट पर प्रकाशित सामग्री के अधिकार, पुनर्प्रकाशन नीति और उपयोगकर्ता जिम्मेदारियों की जानकारी।",
};

export default function TermsPage() {
  return (
    <StaticPageLayout title="Terms & Conditions" description="इस वेबसाइट का उपयोग करते समय लागू नियम और शर्तें।">
      <p>इस पोर्टल पर प्रकाशित सामग्री केवल सूचना के उद्देश्य से है। बिना लिखित अनुमति सामग्री का पुनर्प्रकाशन प्रतिबंधित है।</p>
      <p className="mt-3">यूजर कमेंट या थर्ड-पार्टी लिंक की जिम्मेदारी संबंधित स्रोतों की होगी।</p>
    </StaticPageLayout>
  );
}
