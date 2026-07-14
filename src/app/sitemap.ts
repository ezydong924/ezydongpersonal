import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { cities } from "@/lib/cities";

export const dynamic = "force-static";

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
  }));

  const cityRoutes = cities.map((city) => ({
    url: `${SITE_URL}/gallery/photos/${city.slug}`,
  }));

  const cityGalleryRoutes = cities
    .filter((c) => c.hasGallery)
    .map((city) => ({
      url: `${SITE_URL}/gallery/photos/${city.slug}/gallery`,
    }));

  const videoRoutes = cities
    .filter((c) => c.hasVideo)
    .map((city) => ({
      url: `${SITE_URL}/gallery/videos/${city.slug}`,
    }));

  return [...staticRoutes, ...cityRoutes, ...cityGalleryRoutes, ...videoRoutes];
}
