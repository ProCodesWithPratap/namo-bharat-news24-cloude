import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "always", priority: 1.0 },
    { url: `${SITE_URL}/national`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/politics`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/sports`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/business`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/entertainment`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/technology`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.7 },
    { url: `${SITE_URL}/education`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.7 },
    { url: `${SITE_URL}/videos`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.7 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
  ];
}
