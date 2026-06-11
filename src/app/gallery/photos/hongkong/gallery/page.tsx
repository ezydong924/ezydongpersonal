import ScatterGallery from "@/components/scatter-gallery";

const PHOTOS = [
  "IMG20260111112856.jpg", "IMG20260111134641.jpg", "IMG20260111142441.jpg",
  "IMG20260111143105.jpg", "IMG20260111143207.jpg", "IMG20260111143548.jpg",
  "IMG20260111155723.jpg", "IMG20260111160053.jpg", "IMG20260111161631.jpg",
  "IMG20260111175259.jpg", "IMG20260111175546.jpg", "IMG20260111183104.jpg",
  "IMG20260111200452.jpg", "IMG20260111200722.jpg", "IMG20260112183013.jpg",
  "IMG20260112195807.jpg", "IMG_20260111_112611.jpg", "IMG_20260111_124118.jpg",
  "IMG_20260111_125345.jpg", "IMG_20260111_125515.jpg", "IMG_20260111_125745.jpg",
  "IMG_20260111_133307.jpg", "IMG_20260111_133835.jpg", "IMG_20260111_155326.jpg",
  "IMG_20260111_212036.jpg", "retouch_2026011112472188.jpg", "retouch_2026011112513202.jpg",
  "retouch_2026011120174843.jpg", "retouch_2026011120200149.jpg", "retouch_2026011120504515.jpg",
];

export default function HongKongGallery() {
  return (
    <ScatterGallery
      photos={PHOTOS}
      cityName="香港"
      backHref="/gallery/photos/hongkong"
      thumbBase="/hongkong/thumbs"
      lightboxBase="/hongkong/lightbox"
      layoutSeed={20260528}
    />
  );
}
