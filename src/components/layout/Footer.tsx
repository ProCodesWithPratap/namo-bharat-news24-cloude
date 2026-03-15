import Link from "next/link";
import { NAV_CATEGORIES, SITE_NAME, STATES } from "@/lib/utils";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111] text-gray-400 mt-12">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 lg:col-span-1">
          <Link href="/" className="block mb-4">
            <span className="font-hindi text-xl font-extrabold" style={{ color: "#FF6B00" }}>नमो:</span>
            <span className="font-hindi text-xl font-extrabold text-white ml-1">भारत न्यूज़</span>
            <span className="font-ui text-xl font-extrabold ml-1" style={{ color: "#C8102E" }}>24</span>
          </Link>
          <p className="text-sm font-hindi text-gray-500 leading-relaxed">
            सच्ची खबर, हर पल — भारत की ताजा ब्रेकिंग न्यूज़।
          </p>
          <div className="flex gap-3 mt-4">
            {[
              { href: "https://twitter.com", label: "𝕏 Twitter" },
              { href: "https://facebook.com", label: "Facebook" },
              { href: "https://instagram.com", label: "Instagram" },
              { href: "https://youtube.com", label: "YouTube" },
            ].map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors text-xs"
              >
                {s.label.split(" ")[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 font-hindi">श्रेणियां</h4>
          <ul className="space-y-2">
            {NAV_CATEGORIES.slice(0, 8).map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${cat.slug}`}
                  className="text-sm font-hindi hover:text-white transition-colors hover:text-[#C8102E]"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* State news */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 font-hindi">राज्य समाचार</h4>
          <ul className="space-y-2">
            {STATES.slice(0, 8).map((state) => (
              <li key={state}>
                <Link
                  href={`/states/${state.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-hindi hover:text-white transition-colors"
                >
                  {state}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* More */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">More</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/videos", label: "वीडियो", hindi: true },
              { href: "/web-stories", label: "वेब स्टोरी", hindi: true },
              { href: "/live", label: "लाइव ब्लॉग", hindi: true },
              { href: "/e-paper", label: "ई-पेपर", hindi: true },
              { href: "/rss", label: "RSS Feed", hindi: false },
              { href: "/sitemap.xml", label: "Sitemap", hindi: false },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`hover:text-white transition-colors ${l.hindi ? "font-hindi" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
              { href: "/advertise", label: "Advertise" },
              { href: "/careers", label: "Careers" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Use" },
              { href: "/disclaimer", label: "Disclaimer" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p className="font-hindi">
            © {year} नमो: भारत न्यूज़ 24. सर्वाधिकार सुरक्षित।
          </p>
          <p>
            © {year} Namo Bharat News 24. All rights reserved. |{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              Powered by Vercel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
