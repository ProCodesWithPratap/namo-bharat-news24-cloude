import { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/utils";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#C8102E",
    icons: [
      {
        src: `${SITE_URL}/favicon.svg`,
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
