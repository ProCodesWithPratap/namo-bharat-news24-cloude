import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_NAME = "नमो: भारत न्यूज़ 24";
export const SITE_NAME_EN = "Namo Bharat News 24";
export const SITE_TAGLINE = "सच्ची खबर, हर पल";
export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const SITE_DESCRIPTION =
  "नमो: भारत न्यूज़ 24 — भारत की ताजा खबरें, ब्रेकिंग न्यूज़, राजनीति, खेल, मनोरंजन, व्यापार और बहुत कुछ।";

export const NAV_CATEGORIES = [
  { name: "राष्ट्रीय", nameEn: "National", slug: "national" },
  { name: "राज्य", nameEn: "States", slug: "states" },
  { name: "राजनीति", nameEn: "Politics", slug: "politics" },
  { name: "व्यापार", nameEn: "Business", slug: "business" },
  { name: "खेल", nameEn: "Sports", slug: "sports" },
  { name: "मनोरंजन", nameEn: "Entertainment", slug: "entertainment" },
  { name: "तकनीक", nameEn: "Technology", slug: "technology" },
  { name: "शिक्षा", nameEn: "Education", slug: "education" },
  { name: "जीवन-शैली", nameEn: "Lifestyle", slug: "lifestyle" },
];

export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  state: "states",
  tech: "technology",
  "tech-news": "technology",
  "education-news": "education",
  "life-style": "lifestyle",
};

export function normalizeCategorySlug(slug: string): string {
  return CATEGORY_SLUG_ALIASES[slug] || slug;
}

export const STATES = [
  "उत्तर प्रदेश", "बिहार", "झारखंड", "मध्य प्रदेश", "राजस्थान",
  "महाराष्ट्र", "दिल्ली", "हरियाणा", "पंजाब", "गुजरात",
];

export function toAbsoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
