import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const paths = [
    "",
    "/about",
    "/experiences",
    "/contact",
    "/services/concierge",
    "/services/mice",
    "/services/medical-tourism",
    "/services/sports",
  ];
  const now = new Date();
  return paths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
