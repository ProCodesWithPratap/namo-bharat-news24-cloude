import { SITE_NAME, SITE_URL } from "@/lib/utils";

const cleanUrl = (value?: string): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed === "#") return "";

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
};

export const socialLinks = {
  facebook: cleanUrl(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK),
  instagram: cleanUrl(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
  youtube: cleanUrl(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE),
  whatsapp: cleanUrl(process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP),
  x: cleanUrl(process.env.NEXT_PUBLIC_SOCIAL_X),
};

export const topUtilityLinks = [
  { href: "/e-paper", label: "ई-पेपर", hindi: true },
  { href: "/videos", label: "वीडियो", hindi: true },
  { href: "/live", label: "लाइव", hindi: true },
  { href: "/about", label: "About", hindi: false },
];

export const footerQuickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/advertise", label: "Advertise With Us" },
];

export const footerSocialItems = [
  { key: "x", label: "X", href: socialLinks.x },
  { key: "facebook", label: "Facebook", href: socialLinks.facebook },
  { key: "instagram", label: "Instagram", href: socialLinks.instagram },
  { key: "youtube", label: "YouTube", href: socialLinks.youtube },
  { key: "whatsapp", label: "WhatsApp", href: socialLinks.whatsapp },
].filter((item) => Boolean(item.href));

export const newsroomMeta = {
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  editorialEmail: process.env.NEXT_PUBLIC_EDITORIAL_EMAIL?.trim() || "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim() || "",
  about: `${SITE_NAME} एक हिंदी डिजिटल न्यूज़ प्लेटफॉर्म है, जो राष्ट्रीय, राज्य, खेल, मनोरंजन और लाइव अपडेट्स को तेज़ और भरोसेमंद रूप में पाठकों तक पहुंचाता है।`,
  copyright: `© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`,
  siteUrl: SITE_URL,
};
