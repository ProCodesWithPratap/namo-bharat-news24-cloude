import { MetadataRoute } from "next";
import { SITE_URL, toAbsoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/"],
      },
    ],
    sitemap: toAbsoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
