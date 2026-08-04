"use client";

export default function GalleryPosterBackground({ poster, alt }: { poster: string; alt: string }) {
  return (
    <div className="gallery-poster-background" aria-hidden="true">
      <img src={poster} alt={alt} decoding="async" fetchPriority="high" />
      <style jsx>{`
        .gallery-poster-background {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: #070b0d;
          pointer-events: none;
        }
        .gallery-poster-background img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          opacity: .34;
          filter: none;
        }
      `}</style>
    </div>
  );
}
