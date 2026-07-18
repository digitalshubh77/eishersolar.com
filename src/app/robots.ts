import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://eishersolar.com/sitemap.xml",
    host: "https://eishersolar.com",
  };
}
