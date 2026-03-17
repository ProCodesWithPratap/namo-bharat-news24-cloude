import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";

export const metadata: Metadata = {
  title: "करियर | नमो: भारत न्यूज़ 24",
  description: "नमो: भारत न्यूज़ 24 में करियर बनाएं। रिपोर्टिंग, संपादन, वीडियो और डिजिटल मीडिया में अवसर। हिंदी पत्रकारिता में रुचि रखने वालों का स्वागत है।",
  alternates: { canonical: "https://namo-bharat-news24-cloude.vercel.app/careers" },
};

export default function CareersPage() {
  return (
    <StaticPageLayout
      title="Careers"
      description="हम एक विकासशील डिजिटल न्यूज़रूम हैं। उपलब्ध भूमिकाओं के लिए अपडेट्स जल्द साझा किए जाएंगे।"
    >
      <p>
        अगर आप संपादन, रिपोर्टिंग, वीडियो, सोशल या प्रोडक्ट क्षेत्रों में काम करते हैं, तो अपने प्रोफ़ाइल और
        पोर्टफोलियो के साथ हमसे संपर्क कर सकते हैं।
      </p>
      <p className="mt-3">सामान्य पूछताछ के लिए कृपया Contact पेज का उपयोग करें।</p>
    </StaticPageLayout>
  );
}
