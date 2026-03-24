import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function normalizeSiteUrl(value?: string): string {
  const trimmed = value?.trim();
  if (!trimmed) return "";

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function resolveSiteUrl(): string {
  const explicitUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicitUrl) return explicitUrl;

  const serverUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SERVER_URL);
  if (serverUrl) return serverUrl;

  const vercelProductionUrl = normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercelProductionUrl) return vercelProductionUrl;

  const vercelPreviewUrl = normalizeSiteUrl(process.env.VERCEL_URL);
  if (vercelPreviewUrl) return vercelPreviewUrl;

  return "http://localhost:3000";
}

export const SITE_NAME = "नमो: भारत न्यूज़ 24";
export const SITE_NAME_EN = "Namo Bharat News 24";
export const SITE_TAGLINE = "तथ्य स्पष्ट, विचार निष्पक्ष।";
export const SITE_URL = resolveSiteUrl();
export const SITE_DESCRIPTION =
  "भारत और दुनिया की हर महत्वपूर्ण खबर अब पहुँचेगी आपके पास तेज़, सटीक और निष्पक्ष रूप में।";

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

export const PUBLIC_CATEGORY_ROUTE_SLUGS = NAV_CATEGORIES.map((item) => item.slug);

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
