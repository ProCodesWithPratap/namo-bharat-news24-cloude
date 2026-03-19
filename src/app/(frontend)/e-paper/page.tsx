import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/utils";
import { getSiteSettingsData } from "@/lib/site-data";
import EPaperViewer from "./EPaperViewer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ई-पेपर | नमो: भारत न्यूज़ 24",
  description:
    "नमो: भारत न्यूज़ 24 का डिजिटल ई-पेपर संस्करण — आज का अखबार ऑनलाइन पढ़ें। बिहार और पूर्वी भारत की ताजा खबरें प्रिंट फॉर्मेट में।",
  alternates: {
    canonical: `${SITE_URL}/e-paper`,
  },
};

export default async function EPaperPage() {
  const { socialLinks } = await getSiteSettingsData();
  const epaperUrl = process.env.NEXT_PUBLIC_EPAPER_URL || "";
  const todayLabel = new Date().toLocaleDateString("hi-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="space-y-6">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h1 className="border-l-4 pl-3 text-3xl font-bold text-gray-900 font-hindi" style={{ borderColor: "#C8102E" }}>
              📰 ई-पेपर
            </h1>
            <p className="text-sm text-gray-600 font-hindi">{todayLabel}</p>
          </div>

          {epaperUrl ? (
            <div className="flex flex-wrap gap-3">
              <a
                href={epaperUrl}
                download
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 font-hindi"
                style={{ backgroundColor: "#C8102E" }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                PDF डाउनलोड करें
              </a>
              <a
                href={epaperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 font-hindi"
              >
                नई विंडो में खोलें ↗
              </a>
            </div>
          ) : null}
        </header>

        <EPaperViewer epaperUrl={epaperUrl} whatsappHref={socialLinks.whatsapp} />

        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-2xl font-bold text-gray-900 font-hindi">📦 पुराने अंक</h2>
          <p className="mt-2 text-gray-700 font-hindi">
            पुराने ई-पेपर अंक और विशेष संस्करण जल्द ही यहाँ जोड़े जाएंगे। अपडेट के लिए हमारे WhatsApp चैनल से जुड़ें या टीम से संपर्क करें।
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 font-hindi"
              style={{ backgroundColor: "#25D366" }}
            >
              WhatsApp चैनल जॉइन करें
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 font-hindi"
            >
              संपर्क करें
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
