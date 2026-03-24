"use client";
interface AdSlotProps {
  label?: string;
  width?: number;
  height?: number;
  className?: string;
  adHtml?: string;
}

const showAdPlaceholder = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === "true";

export default function AdSlot({
  label = "Advertisement",
  width = 728,
  height = 90,
  className = "",
  adHtml,
}: AdSlotProps) {
  if (adHtml) {
    return (
      <div
        className={`overflow-hidden ${className}`}
        dangerouslySetInnerHTML={{ __html: adHtml }}
      />
    );
  }

  if (!showAdPlaceholder) {
    return null;
  }

  return (
    <div
      className={`ad-slot ${className}`}
      style={{ width: "100%", maxWidth: width, height, margin: "0 auto" }}
    >
      <span className="text-[10px] tracking-widest">{label}</span>
    </div>
  );
}
