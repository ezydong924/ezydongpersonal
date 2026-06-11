"use client";

import React, { useMemo } from "react";

const layersData = [
  { className: "layer-6", speed: "120s", size: "222px", zIndex: 1, image: "6" },
  { className: "layer-5", speed: "95s", size: "311px", zIndex: 1, image: "5" },
  { className: "layer-4", speed: "75s", size: "468px", zIndex: 1, image: "4" },
  { className: "bike-1", speed: "10s", size: "75px", zIndex: 2, image: "bike", animation: "parallax_bike", bottom: "100px", noRepeat: true },
  { className: "bike-2", speed: "15s", size: "75px", zIndex: 2, image: "bike", animation: "parallax_bike", bottom: "100px", noRepeat: true },
  { className: "layer-3", speed: "55s", size: "158px", zIndex: 3, image: "3" },
  { className: "layer-2", speed: "30s", size: "145px", zIndex: 4, image: "2" },
  { className: "layer-1", speed: "20s", size: "136px", zIndex: 5, image: "1" },
];

const IMG_BASE = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/24650";

const MountainVistaParallax = ({ title = "", subtitle = "" }: { title?: string; subtitle?: string }) => {
  const dynamicStyles = useMemo(() => {
    return layersData
      .map((layer) => {
        const url = `${IMG_BASE}/${layer.image}.png`;
        return `
          .${layer.className} {
            background-image: url(${url});
            animation-duration: ${layer.speed};
            background-size: auto ${layer.size};
            z-index: ${layer.zIndex};
            ${layer.animation ? `animation-name: ${layer.animation};` : ""}
            ${layer.bottom ? `bottom: ${layer.bottom};` : ""}
            ${layer.noRepeat ? "background-repeat: no-repeat;" : ""}
          }
        `;
      })
      .join("\n");
  }, []);

  return (
    <section className="hero-container" aria-label="Animated parallax landscape">
      <style>{`
        .hero-container {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #0d1b2a;
          z-index: 0;
        }
        .parallax-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-position: bottom center;
          background-repeat: repeat-x;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes parallax_move {
          from { background-position: 0 bottom; }
          to { background-position: -2000px bottom; }
        }
        @keyframes parallax_bike {
          0% { background-position: 0 bottom, -2000px bottom; }
          100% { background-position: -2000px bottom, -4000px bottom; }
        }
        .layer-6, .layer-5, .layer-4, .layer-3, .layer-2, .layer-1 {
          animation-name: parallax_move;
        }
        .hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }
        .hero-title {
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.5rem);
          color: rgba(255,255,255,0.6);
          margin-top: 0.5rem;
        }
      `}</style>
      {dynamicStyles && <style>{dynamicStyles}</style>}
      {layersData.map((layer) => (
        <div key={layer.className} className={`parallax-layer ${layer.className}`} />
      ))}
      {(title || subtitle) && (
        <div className="hero-content">
          {title && <h1 className="hero-title">{title}</h1>}
          {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        </div>
      )}
    </section>
  );
};

export default React.memo(MountainVistaParallax);
