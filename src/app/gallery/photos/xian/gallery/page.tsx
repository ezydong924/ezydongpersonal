"use client";

import BackButton from "@/components/back-button";
import VerticalImageStack from "@/components/vertical-image-stack";
import { ShaderAnimation } from "@/components/shader-animation-bg";

const photos = [
  "IMG_20260706_155244.jpg",
  "IMG_20260706_155318.jpg",
  "IMG_20260706_155336.jpg",
  "IMG_20260706_155351.jpg",
  "butter_1724897380024.jpg",
];

const images = photos.map((p, i) => ({
  id: i,
  src: `/xian/lightbox/${p}`,
  alt: `西安影笺 ${i + 1}`,
}));

export default function XianGallery() {
  return (
    <div className="relative min-h-screen">
      <ShaderAnimation />
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos/xian" label="返回" />
      </div>
      <VerticalImageStack
        images={images}
        lightboxBasePath="/xian/lightbox"
        lightboxPhotos={photos}
      />
    </div>
  );
}
