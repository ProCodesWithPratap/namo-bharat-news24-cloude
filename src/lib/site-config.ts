import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const socialLinks = {
  facebook: "https://facebook.com/namobharatnews24",
  instagram: "https://instagram.com/namobharatnews24",
  youtube: "https://youtube.com/@namobharatnews24",
  whatsapp: "https://whatsapp.com/channel/0029VaPlaceholder",
  x: "https://x.com/namobharatnews24",
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
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/advertise", label: "Advertise With Us" },
];

export const footerSocialItems = [
  { key: "x", label: "X", href: socialLinks.x },
  { key: "facebook", label: "Facebook", href: socialLinks.facebook },
  { key: "instagram", label: "Instagram", href: socialLinks.instagram },
  { key: "youtube", label: "YouTube", href: socialLinks.youtube },
  { key: "whatsapp", label: "WhatsApp", href: socialLinks.whatsapp },
];

export const newsroomMeta = {
  contactEmail: "desk@namobharatnews24.com",
  editorialEmail: "editor@namobharatnews24.com",
  phone: "+91-90000-00024",
  address: "न्यूज़रूम, सेक्टर-62, नोएडा, उत्तर प्रदेश, भारत",
  about: `${SITE_NAME} एक हिंदी डिजिटल न्यूज़ प्लेटफॉर्म है, जो राष्ट्रीय, राज्य, खेल, मनोरंजन और लाइव अपडेट्स को तेज़ और भरोसेमंद रूप में पाठकों तक पहुंचाता है।`,
  copyright: `© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`,
  siteUrl: SITE_URL,
};
