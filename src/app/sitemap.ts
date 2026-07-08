import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { cities } from "@/lib/cities";

export const dynamic = "force-static";

const LAST_MODIFIED = new Date("2026-07-08T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/explore",
    "/about",
    "/gallery",
    "/gallery/photos",
    "/gallery/videos",
    "/thoughts",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LAST_MODIFIED,
  }));

  const cityRoutes = cities.map((city) => ({
    url: `${SITE_URL}/gallery/photos/${city.slug}`,
    lastModified: LAST_MODIFIED,
  }));

  const cityGalleryRoutes = cities
    .filter((c) => c.hasGallery)
    .map((city) => ({
      url: `${SITE_URL}/gallery/photos/${city.slug}/gallery`,
      lastModified: LAST_MODIFIED,
    }));

  const videoRoutes = cities
    .filter((c) => c.hasVideo)
    .map((city) => ({
      url: `${SITE_URL}/gallery/videos/${city.slug}`,
      lastModified: LAST_MODIFIED,
    }));

  return [...staticRoutes, ...cityRoutes, ...cityGalleryRoutes, ...videoRoutes];
}
