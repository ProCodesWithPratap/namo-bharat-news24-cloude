import type { Metadata } from "next";
import StaticPageLayout from "@/components/common/StaticPageLayout";

export const metadata: Metadata = { title: "Privacy Policy", description: "उपयोगकर्ता डेटा और गोपनीयता नीति।" };

export default function PrivacyPage() {
  return (
    <StaticPageLayout title="Privacy Policy" description="हम आपकी गोपनीयता का सम्मान करते हैं।">
      <p>हम केवल आवश्यक जानकारी (जैसे नाम, ईमेल, डिवाइस डेटा) सेवा सुधार, सुरक्षा और कम्युनिकेशन के लिए उपयोग करते हैं।</p>
      <p className="mt-3">हम आपकी निजी जानकारी को बिना अनुमति तीसरे पक्ष को नहीं बेचते। Analytics और ads के लिए सीमित कुकी उपयोग हो सकता है।</p>
    </StaticPageLayout>
  );
}
