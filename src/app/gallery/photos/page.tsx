"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/back-button";
import AtlasCelestialField from "@/components/atlas-celestial-field";
import { atlasCities, atlasLinks } from "@/lib/atlas-cities";

export default function PhotosAtlasPage() {
  const router = useRouter();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hovered = atlasCities.find((city) => city.slug === hoveredSlug) ?? null;

  return (
    <main className="photos-atlas-shell">
      <div className="photos-atlas-noise" aria-hidden="true" />
      <div className="photos-atlas-wash" aria-hidden="true" />

      <header className="photos-atlas-header">
        <BackButton href="/gallery" label="返回" />
        <Link href="/gallery/photos/atlas" className="photos-atlas-index-link">
          <span>ARCHIVE / FIELD NOTES</span>
          <b>查看索引</b>
        </Link>
      </header>

      <section className="photos-atlas-copy">
        <p className="photos-atlas-kicker">EZYDONG / PHOTOGRAPHIC ARCHIVE</p>
        <h1>影笺</h1>
        <p>星垂平野阔，月涌大江流。</p>
        <span>拖动星场，靠近一座城市</span>
      </section>

      <section className="photos-atlas-field" aria-label="城市星空索引">
        <AtlasCelestialField
          points={atlasCities.map((city) => ({
            slug: city.slug,
            name: city.name,
            en: city.en,
            x: city.x,
            y: city.y,
            open: Boolean(city.frames),
            frames: city.frames,
            orbitImages: city.orbitImages,
            poster: city.poster,
            zinePoster: city.zinePoster,
          }))}
          links={atlasLinks}
          activeSlug={hoveredSlug ?? ""}
          focusedSlug={null}
          mode="constellation"
          onHover={setHoveredSlug}
          onSelect={(slug) => router.push(`/gallery/photos/${slug}`)}
        />
        <div className="photos-atlas-depth" aria-hidden="true" />
      </section>

      <div className="photos-atlas-status">
        <span><i /> {atlasCities.length} CITIES / FIELD LIVE</span>
        <span>点击城市进入对应的记忆页</span>
      </div>

      {hovered && (
        <div className="photos-atlas-hover" aria-live="polite">
          <small>{hovered.en}</small>
          <strong>{hovered.name}</strong>
          <span>{hovered.frames ? `${hovered.frames} frames / 已整理` : "zine / 记忆正在整理"}</span>
        </div>
      )}

      <style jsx global>{`
        .photos-atlas-shell {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          isolation: isolate;
          background: #03101c;
          color: #edf9f4;
        }
        .photos-atlas-noise,
        .photos-atlas-wash {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }
        .photos-atlas-noise {
          z-index: 0;
          opacity: .22;
          background-image: radial-gradient(rgba(255,255,255,.12) .55px, transparent .55px);
          background-size: 5px 5px;
          mix-blend-mode: soft-light;
        }
        .photos-atlas-wash {
          z-index: 1;
          background:
            radial-gradient(circle at 50% 48%, rgba(79, 158, 165, .12), transparent 38%),
            radial-gradient(circle at 14% 82%, rgba(54, 95, 174, .16), transparent 34%),
            linear-gradient(180deg, rgba(1, 7, 15, .24), rgba(1, 6, 13, .7));
        }
        .photos-atlas-header {
          position: fixed;
          inset: 0 0 auto;
          z-index: 20;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 28px clamp(22px, 4vw, 54px);
          pointer-events: none;
        }
        .photos-atlas-header > * { pointer-events: auto; }
        .photos-atlas-index-link {
          display: grid;
          gap: 5px;
          color: rgba(227, 250, 244, .48);
          text-align: right;
          transition: color .2s ease;
        }
        .photos-atlas-index-link:hover { color: rgba(255,255,255,.9); }
        .photos-atlas-index-link span { font-size: 8px; letter-spacing: .22em; }
        .photos-atlas-index-link b { font-size: 11px; font-weight: 400; letter-spacing: .16em; }
        .photos-atlas-copy {
          position: fixed;
          left: clamp(22px, 5vw, 68px);
          bottom: clamp(70px, 10vh, 112px);
          z-index: 12;
          max-width: 360px;
          pointer-events: none;
          text-shadow: 0 4px 28px rgba(0, 0, 0, .6);
        }
        .photos-atlas-kicker { margin: 0 0 15px; color: rgba(183, 232, 225, .45); font-size: 8px; letter-spacing: .24em; }
        .photos-atlas-copy h1 { margin: 0; font-family: var(--font-serif), serif; font-size: clamp(42px, 7vw, 88px); font-weight: 300; letter-spacing: .12em; line-height: .95; }
        .photos-atlas-copy p:not(.photos-atlas-kicker) { margin: 16px 0 0; color: rgba(239, 255, 249, .72); font-family: var(--font-serif), serif; font-size: clamp(17px, 2vw, 24px); letter-spacing: .1em; }
        .photos-atlas-copy span { display: block; margin-top: 18px; color: rgba(201, 226, 226, .35); font-size: 10px; letter-spacing: .16em; }
        .photos-atlas-field { position: fixed; inset: 0; z-index: 3; background: #06101b; perspective: 900px; }
        .photos-atlas-field::after { content: ""; position: absolute; inset: 0; z-index: 4; pointer-events: none; background: linear-gradient(180deg, rgba(4, 10, 22, .02), transparent 58%, rgba(2, 6, 15, .48)), radial-gradient(circle at 50% 48%, transparent 28%, rgba(0, 4, 13, .56) 112%); }
        .atlas-canvas-shell > div { overflow: clip !important; }
        .atlas-canvas-shell canvas { cursor: grab; touch-action: none; }
        .atlas-canvas-shell canvas:active { cursor: grabbing; }
        .photos-atlas-depth { position: absolute; inset: 0; z-index: 5; pointer-events: none; background: radial-gradient(ellipse at 44% 52%, rgba(90, 225, 208, .08), transparent 36%), linear-gradient(118deg, transparent 18%, rgba(138, 209, 219, .035) 50%, transparent 76%); mix-blend-mode: screen; }
        .atlas-3d-label { position: relative; display: grid; grid-template-columns: 17px auto; min-width: 92px; gap: 1px 7px; border: 0; border-left: 1px solid rgba(174,255,241,.15); background: linear-gradient(90deg, rgba(3,14,24,.62), rgba(3,14,24,.08)); padding: 5px 9px 5px 7px; color: rgba(237,255,251,.72); text-align: left; text-shadow: 0 2px 10px rgba(0,4,14,.95); backdrop-filter: blur(3px); transition: border-color .2s ease, background .2s ease, color .2s ease, transform .2s ease; }
        .atlas-3d-label::before { content: ""; position: absolute; top: -1px; left: -3px; width: 5px; height: 1px; background: rgba(167,255,239,.45); }
        .atlas-3d-label:hover, .atlas-3d-label.is-active { border-color: rgba(174,255,241,.54); background: linear-gradient(90deg, rgba(7,29,40,.82), rgba(4,18,29,.12)); color: rgba(255,255,255,.96); transform: translate3d(2px,-1px,0); }
        .atlas-3d-label > i { grid-row: 1 / span 2; align-self: center; color: rgba(159,215,211,.28); font-size: 6px; font-style: normal; letter-spacing: .06em; }
        .atlas-3d-label span { font-family: var(--font-serif), serif; font-size: 12px; font-weight: 400; letter-spacing: .1em; white-space: nowrap; }
        .atlas-3d-label small { display: flex; justify-content: space-between; gap: 10px; font-size: 5px; font-weight: 400; letter-spacing: .17em; color: rgba(181,223,226,.3); white-space: nowrap; }
        .atlas-3d-label small b { color: rgba(177,241,231,.35); font-size: 5px; font-weight: 400; letter-spacing: .08em; }
        .atlas-node-preview { width: 176px; transform: translate(-50%, -100%); animation: atlas-preview-in .24s cubic-bezier(.2,.8,.2,1) both; }
        .atlas-node-preview.is-below { transform: translate(-50%, 0); }
        .atlas-node-preview-image { display: block; width: 176px; height: 104px; background-position: 50% 58%; background-size: cover; box-shadow: 0 16px 36px rgba(0,2,8,.32); filter: saturate(.92) contrast(1.06) brightness(1.04); opacity: .94; }
        @keyframes atlas-preview-in { from { opacity: 0; transform: translate(-50%, -92%) scale(.96); } to { opacity: 1; transform: translate(-50%, -100%) scale(1); } }
        .photos-atlas-status { position: fixed; right: clamp(22px, 4vw, 54px); bottom: 28px; z-index: 12; display: grid; gap: 8px; color: rgba(199, 226, 226, .3); font-size: 8px; letter-spacing: .18em; text-align: right; pointer-events: none; }
        .photos-atlas-status i { display: inline-block; width: 5px; height: 5px; margin-right: 6px; border-radius: 50%; background: #8dffe9; box-shadow: 0 0 10px rgba(124,255,229,.78); }
        .photos-atlas-hover { position: fixed; right: clamp(22px, 4vw, 54px); bottom: clamp(74px, 12vh, 130px); z-index: 12; display: grid; gap: 5px; min-width: 170px; padding: 11px 0 11px 14px; border-left: 1px solid rgba(150,255,236,.32); background: linear-gradient(90deg, rgba(3,14,24,.34), transparent); pointer-events: none; }
        .photos-atlas-hover small { color: rgba(179,231,226,.44); font-size: 7px; letter-spacing: .22em; }
        .photos-atlas-hover strong { font-family: var(--font-serif), serif; color: rgba(246,255,252,.9); font-size: 22px; font-weight: 300; letter-spacing: .12em; }
        .photos-atlas-hover span { color: rgba(205,230,229,.38); font-size: 8px; letter-spacing: .12em; }
        @media (max-width: 700px) {
          .photos-atlas-copy { bottom: 86px; }
          .photos-atlas-copy h1 { font-size: 54px; }
          .photos-atlas-copy p:not(.photos-atlas-kicker) { font-size: 17px; }
          .photos-atlas-status { bottom: 20px; font-size: 7px; }
          .photos-atlas-hover { right: 20px; bottom: 78px; }
          .atlas-3d-label { background: rgba(3,14,24,.5); }
          .atlas-3d-label > i, .atlas-3d-label small { display: none; }
          .atlas-3d-label { display: block; min-width: auto; padding: 4px 7px; }
          .atlas-3d-label span { font-size: 10px; }
        }
      `}</style>
    </main>
  );
}
