"use client";

import Link from "next/link";
import { useState } from "react";

type EPaperViewerProps = {
  epaperUrl: string;
  whatsappHref?: string;
};

export default function EPaperViewer({ epaperUrl, whatsappHref }: EPaperViewerProps) {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  if (!epaperUrl) {
    return (
      <section className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="text-5xl" aria-hidden="true">
            📰
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-hindi">आज का ई-पेपर जल्द उपलब्ध होगा</h2>
          <p className="text-gray-600 font-hindi">
            हमारा संपादकीय संस्करण तैयार होते ही यहाँ अपडेट हो जाएगा। तब तक ताजा खबरों के लिए हमारे चैनल से जुड़ें।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappHref || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 font-hindi"
              style={{ backgroundColor: "#25D366" }}
            >
              WhatsApp चैनल जॉइन करें
            </a>
            <Link
              href="/national"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 font-hindi"
            >
              ताजा खबरें पढ़ें →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (iframeError) {
    return (
      <section className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
        <div className="mx-auto max-w-xl space-y-3">
          <p className="text-4xl" aria-hidden="true">
            ⚠️
          </p>
          <h2 className="text-xl font-bold text-red-900 font-hindi">PDF यहाँ लोड नहीं हो सका</h2>
          <p className="text-red-700 font-hindi">कृपया नीचे दिए गए बटन से फ़ाइल डाउनलोड करें या नई विंडो में खोलें।</p>
          <a
            href={epaperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 font-hindi"
            style={{ backgroundColor: "#C8102E" }}
          >
            PDF डाउनलोड करें
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm">
        {!iframeLoaded ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: "#C8102E", borderTopColor: "transparent" }} />
            <p className="text-sm font-medium text-gray-700 font-hindi">ई-पेपर लोड हो रहा है…</p>
          </div>
        ) : null}
        <iframe
          src={`${epaperUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          className="w-full border-0"
          style={{ height: "80vh", minHeight: "600px" }}
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeError(true)}
          allow="fullscreen"
          title="ई-पेपर"
        />
      </div>
      <p className="block rounded-md bg-yellow-100 px-3 py-2 text-sm text-yellow-900 font-hindi sm:hidden">
        📱 मोबाइल पर PDF सही न दिखे तो &apos;नई विंडो में खोलें&apos; बटन इस्तेमाल करें।
      </p>
    </section>
  );
}
