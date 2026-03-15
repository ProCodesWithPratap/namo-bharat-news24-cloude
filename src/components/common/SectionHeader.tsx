import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  ctaLabel?: string;
}

export default function SectionHeader({ title, href, ctaLabel = "और देखें →" }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-hindi text-lg font-extrabold text-gray-800 border-l-4 pl-3" style={{ borderColor: "#C8102E" }}>
        {title}
      </h2>
      {href && (
        <Link href={href} className="text-xs text-primary hover:underline font-hindi" style={{ color: "#C8102E" }}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
