import type { MetadataRoute } from "next";
import { isSiteLockEnabled } from "@/lib/site-lock";

export default function robots(): MetadataRoute.Robots {
  // Preview lock → don't index the staging URL
  if (isSiteLockEnabled()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/acces", "/frontpage-v2"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/llms.txt"],
        disallow: ["/admin", "/api/", "/acces", "/frontpage-v2"],
      },
    ],
    sitemap: "https://moodilier.ro/sitemap.xml",
    host: "https://moodilier.ro",
  };
}
