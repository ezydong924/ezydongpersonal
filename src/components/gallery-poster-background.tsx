"use client";

interface GalleryPosterBackgroundProps {
  poster: string;
  mobilePoster?: string;
  alt: string;
}

export default function GalleryPosterBackground({ poster, mobilePoster, alt }: GalleryPosterBackgroundProps) {
  return (
    <div className="gallery-poster-background" aria-hidden="true">
      <picture>
        {mobilePoster && <source media="(max-width: 700px)" srcSet={mobilePoster} />}
        <img src={poster} alt={alt} decoding="async" fetchPriority="low" />
      </picture>
      <style jsx>{`
        .gallery-poster-background {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          min-height: 100svh;
          z-index: 0;
          overflow: hidden;
          background: #e9e0d2;
          pointer-events: none;
        }
        .gallery-poster-background::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(14, 15, 13, .1), rgba(14, 15, 13, .18));
        }
        .gallery-poster-background picture {
          position: absolute;
          inset: 0;
        }
        .gallery-poster-background img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: .68;
          filter: none;
        }
      `}</style>
    </div>
  );
}
