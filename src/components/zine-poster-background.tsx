"use client";

import { useEffect } from "react";

export default function ZinePosterBackground({ poster, alt }: { poster: string; alt: string }) {
  useEffect(() => {
    document.body.classList.add("zine-poster-page");
    return () => document.body.classList.remove("zine-poster-page");
  }, []);

  return (
    <div className="zine-poster-background" aria-hidden="true">
      <img className="zine-poster-background-image" src={poster} alt={alt} />
      <style jsx>{`
        .zine-poster-background {
          position: fixed;
          inset: 0;
          z-index: -10;
          overflow: hidden;
          background: #071014;
          isolation: isolate;
        }
        .zine-poster-background-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .zine-poster-background-image {
          object-position: center;
          filter: none;
          opacity: 1;
          mix-blend-mode: normal;
        }
      `}</style>
      <style jsx global>{`
        /* The poster remains untouched; article copy switches to ink tones for contrast. */
        :global(body.zine-poster-page .relative.z-10) {
          color: #0b0d0d;
          text-shadow: 0 1px 0 rgba(255, 255, 255, .3);
        }
        :global(body.zine-poster-page .relative.z-10 h1) {
          margin-bottom: 1.8rem;
          color: #090b0b !important;
          font-family: "STKaiti", "KaiTi", "Noto Serif SC", "STSong", serif !important;
          font-size: clamp(3.4rem, 8vw, 6.8rem) !important;
          font-weight: 500 !important;
          letter-spacing: .18em !important;
          line-height: .9 !important;
          text-shadow: 0 2px 0 rgba(255, 255, 255, .34);
          transform: translateX(.08em);
        }
        :global(body.zine-poster-page .relative.z-10 p) {
          color: #111414 !important;
        }
        :global(body.zine-poster-page .relative.z-10 a) {
          color: #0b0d0d !important;
          border-color: rgba(11, 13, 13, .35) !important;
          background: rgba(255, 255, 255, .3) !important;
        }
        :global(body.zine-poster-page .relative.z-10 span) {
          color: #171b1b !important;
        }
        :global(body.zine-poster-page .relative.z-10 .w-full.max-w-2xl) {
          transform: translateX(-2vw);
        }
        :global(body.zine-poster-page .relative.z-10 .space-y-6 p) {
          max-width: 660px;
          color: #111414 !important;
          font-size: clamp(1rem, 1.45vw, 1.06rem) !important;
          letter-spacing: .012em;
          line-height: 1.9 !important;
        }
        :global(body.zine-poster-page .relative.z-10 .space-y-6 p + p) {
          margin-top: 1.7rem !important;
        }
        @media (max-width: 700px) {
          :global(body.zine-poster-page .relative.z-10 .w-full.max-w-2xl) {
            transform: none;
          }
          :global(body.zine-poster-page .relative.z-10 .space-y-6 p) {
            font-size: 1rem !important;
            line-height: 1.82 !important;
          }
        }
      `}</style>
    </div>
  );
}
