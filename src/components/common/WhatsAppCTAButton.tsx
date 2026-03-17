"use client";

import type React from "react";
import { trackWhatsAppCTA } from "@/lib/analytics";

export default function WhatsAppCTAButton({ href, label, location, className, style }: { href: string; label: string; location: string; className?: string; style?: React.CSSProperties }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={() => trackWhatsAppCTA(location)}
    >
      {label}
    </a>
  );
}
