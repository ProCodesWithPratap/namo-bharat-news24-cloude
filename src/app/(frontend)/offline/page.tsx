import type { Metadata } from "next";
import OfflineActions from "@/components/common/OfflineActions";

export const metadata: Metadata = {
  title: "ऑफलाइन | नमो: भारत न्यूज़ 24",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">📡</div>
        <h1 className="font-hindi text-3xl font-extrabold text-gray-900">आप ऑफलाइन हैं</h1>
        <p className="font-hindi mt-3 text-gray-600">इंटरनेट कनेक्शन बहाल होते ही ताज़ा खबरें फिर से उपलब्ध होंगी। तब तक पुरानी खबरें पढ़ते रहें।</p>
        <OfflineActions />
      </div>
    </div>
  );
}
