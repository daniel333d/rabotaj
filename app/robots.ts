import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/employer/dashboard", "/employer/jobs", "/employer/company", "/auth", "/reset-password", "/update-password"]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
