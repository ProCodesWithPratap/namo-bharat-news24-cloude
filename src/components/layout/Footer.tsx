import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/utils";
import { footerQuickLinks, footerSocialItems, newsroomMeta } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111] text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="block mb-4">
            <span className="font-hindi text-xl font-extrabold" style={{ color: "#FF6B00" }}>नमो:</span>
            <span className="font-hindi text-xl font-extrabold text-white ml-1">भारत न्यूज़</span>
            <span className="font-ui text-xl font-extrabold ml-1" style={{ color: "#C8102E" }}>24</span>
          </Link>
          <p className="text-sm font-hindi text-gray-500 leading-relaxed">{newsroomMeta.about}</p>
          {newsroomMeta.address ? <p className="text-xs mt-3">{newsroomMeta.address}</p> : null}
          {newsroomMeta.contactEmail ? <p className="text-xs">Email: {newsroomMeta.contactEmail}</p> : null}
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4 font-hindi">मुख्य श्रेणियां</h4>
          <ul className="space-y-2">
            {NAV_CATEGORIES.slice(0, 8).map((cat) => (
              <li key={cat.slug}><Link href={`/${cat.slug}`} className="text-sm font-hindi hover:text-white transition-colors">{cat.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Trust & Company</h4>
          <ul className="space-y-2 text-sm">
            {footerQuickLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Follow Us</h4>
          <ul className="space-y-2 text-sm">
            {footerSocialItems.map((item) => (
              <li key={item.key}><a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{item.label}</a></li>
            ))}
          </ul>
          <div className="mt-5 text-sm space-y-1">
            {newsroomMeta.editorialEmail ? <p>Editorial: {newsroomMeta.editorialEmail}</p> : null}
            {newsroomMeta.phone ? <p>Phone: {newsroomMeta.phone}</p> : null}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p className="font-hindi">© {year} नमो: भारत न्यूज़ 24. सर्वाधिकार सुरक्षित।</p>
          <p>{newsroomMeta.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
