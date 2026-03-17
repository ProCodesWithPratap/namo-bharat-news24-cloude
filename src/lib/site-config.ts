import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const CONTACT_PHONE = "+91-91628 68368";
export const CONTACT_ADDRESS = "9th Floor, 9ES9, Mani Casadona, Action Area-1, New Town, East Tower, West Bengal";

export const PUBLIC_SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/1T4v14zFhK/",
  instagram: "https://www.instagram.com/namobharatnews24",
  youtube: "https://youtube.com/@namobharatnews24live",
  whatsapp: "https://whatsapp.com/channel/0029VbCBrGu6hENlyE9rvW3N",
} as const;

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
  facebook: cleanUrl(PUBLIC_SOCIAL_LINKS.facebook),
  instagram: cleanUrl(PUBLIC_SOCIAL_LINKS.instagram),
  youtube: cleanUrl(PUBLIC_SOCIAL_LINKS.youtube),
  whatsapp: cleanUrl(PUBLIC_SOCIAL_LINKS.whatsapp),
  x: "",
};

export const topUtilityLinks = [
  { href: "/e-paper", label: "ई-पेपर", hindi: true },
  { href: "/videos", label: "वीडियो", hindi: true },
  { href: "/live", label: "लाइव", hindi: true },
  { href: "/about", label: "हमारे बारे में", hindi: true },
];

export const footerQuickLinks = [
  { href: "/about", label: "हमारे बारे में" },
  { href: "/contact", label: "संपर्क" },
  { href: "/bihar", label: "बिहार खबरें" },
  { href: "/katihar", label: "कटिहार खबरें" },
  { href: "/privacy", label: "प्राइवेसी पॉलिसी" },
  { href: "/terms", label: "नियम व शर्तें" },
  { href: "/disclaimer", label: "डिस्क्लेमर" },
  { href: "/advertise", label: "विज्ञापन दें" },
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
  phone: CONTACT_PHONE,
  address: CONTACT_ADDRESS,
  about: "भारत और दुनिया की हर महत्वपूर्ण खबर अब पहुँचेगी आपके पास तेज़, सटीक और निष्पक्ष रूप में।",
  joinMessage: "हमसे जुड़ें और सच्ची पत्रकारिता का हिस्सा बनें",
  valueStatement: "सच्ची खबर • निष्पक्ष विचार • जनता की आवाज़",
  copyright: `© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`,
  siteUrl: SITE_URL,
};
