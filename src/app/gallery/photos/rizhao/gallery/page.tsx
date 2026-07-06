"use client";

import BackButton from "@/components/back-button";
import HorizontalFilmGallery from "@/components/horizontal-film-gallery";

const photos = [
  { file: "000000290021.jpg", title: "" },
  { file: "IMG_20250501_193352.jpg", title: "" },
  { file: "IMG_20250503_180537.jpg", title: "" },
  { file: "IMG_20250504_164155.jpg", title: "" },
  { file: "IMG_20250504_214254.jpg", title: "" },
  { file: "IMG_20250505_220003.jpg", title: "" },
  { file: "IMG_20250506_164440.jpg", title: "" },
  { file: "IMG_20250508_105948.jpg", title: "" },
  { file: "IMG_20250526_165648.jpg", title: "" },
  { file: "IMG_20250528_213808.jpg", title: "" },
  { file: "retouch_2025050421592699.jpg", title: "" },
  { file: "retouch_2025050422004340.jpg", title: "" },
  { file: "retouch_2025050422012584.jpg", title: "" },
  { file: "retouch_2025050422042384.jpg", title: "" },
];

export default function RizhaoGallery() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c]">
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos/rizhao" label="返回" />
      </div>
      <HorizontalFilmGallery photos={photos} basePath="/rizhao/lightbox" />
    </div>
  );
}
