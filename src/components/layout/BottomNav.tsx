"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "होम",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10.5V20h14v-9.5" />
      </svg>
    ),
  },
  {
    label: "राष्ट्रीय",
    href: "/national",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    label: "खेल",
    href: "/sports",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 8c2 1 6 1 8 0M8 16c2-1 6-1 8 0M7 12h10" />
      </svg>
    ),
  },
  {
    label: "मनोरंजन",
    href: "/entertainment",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="m10 10 5 2-5 2z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const MORE_ITEMS = [
  { label: "राज्य", href: "/states" },
  { label: "राजनीति", href: "/politics" },
  { label: "व्यापार", href: "/business" },
  { label: "तकनीक", href: "/technology" },
  { label: "शिक्षा", href: "/education" },
  { label: "जीवन-शैली", href: "/lifestyle" },
  { label: "वीडियो", href: "/videos" },
  { label: "लाइव", href: "/live" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href));

  return (
    <>
      {moreOpen && <div className="fixed inset-0 z-[80] bg-black/40 md:hidden" onClick={() => setMoreOpen(false)} />}
      {moreOpen && (
        <div className="fixed bottom-14 left-0 right-0 z-[90] bg-white border-t rounded-t-2xl shadow-2xl md:hidden animate-slideDown">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-hindi font-bold text-gray-900">और सेक्शन</p>
            <button className="font-hindi text-lg" onClick={() => setMoreOpen(false)}>✕</button>
          </div>
          <div className="grid grid-cols-4 gap-2 p-4">
            {MORE_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)} className="font-hindi text-xs text-center rounded-lg border border-gray-100 py-3 text-gray-700">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-[85] bg-white border-t md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="h-14 flex justify-around">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center flex-1 gap-0.5" style={{ color: active ? "#C8102E" : "#9CA3AF" }}>
                {item.icon}
                <span className="font-hindi text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
          <button onClick={() => setMoreOpen((v) => !v)} className="flex flex-col items-center justify-center flex-1 gap-0.5 text-[#9CA3AF]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" /></svg>
            <span className="font-hindi text-[10px] font-semibold">और</span>
          </button>
        </div>
      </div>
    </>
  );
}
