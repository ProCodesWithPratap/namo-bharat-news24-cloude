import { MetadataRoute } from "next";
import { toAbsoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/advertise",
  "/careers",
  "/live",
  "/e-paper",
  "/national",
  "/states",
  "/politics",
  "/business",
  "/sports",
  "/entertainment",
  "/technology",
  "/education",
  "/lifestyle",
  "/videos",
  "/web-stories",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  return STATIC_ROUTES.map((route, index) => ({
    url: toAbsoluteUrl(route),
    lastModified: now,
    changeFrequency: index === 0 ? "always" : "hourly",
    priority: index === 0 ? 1 : 0.7,
  }));
}
