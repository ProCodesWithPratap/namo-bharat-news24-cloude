import configPromise from "@payload-config";
import { getPayload } from "payload";

import {
  CONTACT_ADDRESS,
  CONTACT_PHONE,
  footerQuickLinks,
  PUBLIC_SOCIAL_LINKS,
  topUtilityLinks,
} from "@/lib/site-config";
import { NAV_CATEGORIES, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/utils";

type SiteSettingsDoc = {
  siteName?: string;
  tagline?: string;
  contactEmail?: string;
  editorialEmail?: string;
  phone?: string;
  address?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
    x?: string;
  };
};

type CategoryDoc = {
  id?: string;
  name?: string;
  nameHindi?: string;
  slug?: string;
  navOrder?: number;
  showInNav?: boolean;
};

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

async function getPayloadSafe() {
  if (!process.env.DATABASE_URI?.trim()) return null;

  try {
    return await getPayload({ config: configPromise });
  } catch {
    return null;
  }
}

export async function getSiteSettingsData() {
  const payload = await getPayloadSafe();
  let doc: SiteSettingsDoc | null = null;

  if (payload) {
    try {
      doc = (await payload.findGlobal({ slug: "site-settings", depth: 0 })) as SiteSettingsDoc;
    } catch {
      doc = null;
    }
  }

  const socialLinks = {
    facebook: cleanUrl(doc?.social?.facebook || PUBLIC_SOCIAL_LINKS.facebook),
    instagram: cleanUrl(doc?.social?.instagram || PUBLIC_SOCIAL_LINKS.instagram),
    youtube: cleanUrl(doc?.social?.youtube || PUBLIC_SOCIAL_LINKS.youtube),
    whatsapp: cleanUrl(doc?.social?.whatsapp || PUBLIC_SOCIAL_LINKS.whatsapp),
    x: cleanUrl(doc?.social?.x),
  };

  const newsroomMeta = {
    contactEmail: doc?.contactEmail?.trim() || process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
    editorialEmail: doc?.editorialEmail?.trim() || process.env.NEXT_PUBLIC_EDITORIAL_EMAIL?.trim() || "",
    phone: doc?.phone?.trim() || CONTACT_PHONE,
    address: doc?.address?.trim() || CONTACT_ADDRESS,
    about: `${doc?.siteName?.trim() || SITE_NAME} — ${doc?.tagline?.trim() || SITE_DESCRIPTION}`,
    joinMessage: "हमसे जुड़ें और सच्ची पत्रकारिता का हिस्सा बनें",
    valueStatement: doc?.tagline?.trim() || "सच्ची खबर • निष्पक्ष विचार • जनता की आवाज़",
    copyright: `© ${new Date().getFullYear()} ${doc?.siteName?.trim() || SITE_NAME}. All rights reserved.`,
    siteUrl: SITE_URL,
    siteName: doc?.siteName?.trim() || SITE_NAME,
    tagline: doc?.tagline?.trim() || "तथ्य स्पष्ट, विचार निष्पक्ष।",
  };

  const footerSocialItems = [
    { key: "x", label: "X", href: socialLinks.x },
    { key: "facebook", label: "Facebook", href: socialLinks.facebook },
    { key: "instagram", label: "Instagram", href: socialLinks.instagram },
    { key: "youtube", label: "YouTube", href: socialLinks.youtube },
    { key: "whatsapp", label: "WhatsApp", href: socialLinks.whatsapp },
  ].filter((item) => Boolean(item.href));

  return {
    newsroomMeta,
    socialLinks,
    footerSocialItems,
    topUtilityLinks,
    footerQuickLinks,
  };
}

export async function getNavigationCategoriesData() {
  const payload = await getPayloadSafe();

  if (payload) {
    try {
      const result = await payload.find({
        collection: "categories",
        where: { showInNav: { equals: true } },
        sort: "navOrder",
        limit: 50,
        depth: 0,
      });

      const docs = (result.docs || []) as CategoryDoc[];
      const mapped = docs
        .filter((item) => typeof item.slug === "string" && item.slug.trim())
        .map((item) => ({
          name: item.nameHindi?.trim() || item.name?.trim() || item.slug?.trim() || "",
          nameEn: item.name?.trim() || item.nameHindi?.trim() || item.slug?.trim() || "",
          slug: item.slug!.trim(),
        }));

      if (mapped.length) return mapped;
    } catch {
      // fall through to static defaults
    }
  }

  return NAV_CATEGORIES;
}
