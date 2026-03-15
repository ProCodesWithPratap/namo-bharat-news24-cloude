"use client";
import Link from "next/link";

interface TickerProps {
  items: Array<{ headline: string; shortHeadline?: string; slug: string }>;
}

export default function BreakingTicker({ items }: TickerProps) {
  if (!items?.length) return null;

  const text = items
    .map((i) => i.shortHeadline || i.headline)
    .join("  ●  ");

  return (
    <div className="bg-[#C8102E] text-white flex items-stretch overflow-hidden">
      {/* Label */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#A50D26] shrink-0 z-10">
        <span className="breaking-dot"></span>
        <span className="text-xs font-extrabold tracking-widest uppercase font-ui">
          BREAKING
        </span>
      </div>

      {/* Scrolling text */}
      <div className="ticker-wrap flex-1 py-2">
        <div className="ticker-content font-hindi text-sm font-medium">
          {items.map((item, i) => (
            <span key={i}>
              <Link
                href={`/article/${item.slug}`}
                className="hover:underline mx-4"
              >
                {item.shortHeadline || item.headline}
              </Link>
              {i < items.length - 1 && (
                <span className="text-red-300 mx-2">●</span>
              )}
            </span>
          ))}
          {/* Repeat for seamless loop */}
          {items.map((item, i) => (
            <span key={`r${i}`}>
              <Link
                href={`/article/${item.slug}`}
                className="hover:underline mx-4"
              >
                {item.shortHeadline || item.headline}
              </Link>
              {i < items.length - 1 && (
                <span className="text-red-300 mx-2">●</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
