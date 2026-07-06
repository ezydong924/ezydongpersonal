import ScatterGallery from "@/components/scatter-gallery";

const photos = [
  "IMG20241002065810.jpg",
  "IMG20241002084619.jpg",
  "IMG20241002084827.jpg",
  "IMG20241002170444.jpg",
  "IMG20241003112218.jpg",
  "IMG20241003172218.jpg",
  "IMG20241004141706.jpg",
  "IMG20241004172410.jpg",
  "IMG_20241002_055802.jpg",
  "IMG_20241002_181059.jpg",
  "IMG_20241003_155732.jpg",
  "IMG_20241003_174703.jpg",
  "IMG_20241003_180052.jpg",
  "IMG_20241003_180550.jpg",
  "IMG_20241003_180819.jpg",
  "IMG_20241003_182339.jpg",
  "IMG_20241004_155743.jpg",
  "IMG_20241004_160406.jpg",
  "IMG_20241004_160441.jpg",
  "IMG_20241004_160532.jpg",
  "IMG_20241004_221103.jpg",
  "IMG_20241014_182423.jpg",
  "IMG_20241023_173252.jpg",
  ".gitkeep",
  "DSC_1701.JPG",
];

export default function WeihaiGallery() {
  return (
    <ScatterGallery
      photos={photos}
      cityName="威海"
      backHref="/gallery/photos/weihai"
      thumbBase="/weihai/lightbox"
      lightboxBase="/weihai/lightbox"
      layoutSeed={20241014}
    />
  );
}
