"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";
import AtlasCelestialField from "@/components/atlas-celestial-field";
import { atlasCities, atlasDevelopedCount, atlasLinks } from "@/lib/atlas-cities";

type AtlasMode = "constellation" | "index";

export default function MemoryAtlasPrototype() {
  const [mode, setMode] = useState<AtlasMode>("constellation");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);

  const bySlug = useMemo(
    () => new Map(atlasCities.map((city) => [city.slug, city])),
    [],
  );
  const active = activeSlug ? bySlug.get(activeSlug) ?? atlasCities[0] : atlasCities[0];
  const activeIndex = atlasCities.findIndex((city) => city.slug === active.slug);
  const activeConnections = atlasLinks.filter(
    ([from, to]) => from === active.slug || to === active.slug,
  ).length;
  return (
    <div className={`atlas-shell min-h-screen overflow-hidden bg-[#030712] text-[#f2f0e9] ${focusedSlug ? "is-focused" : ""} ${mode === "index" ? "is-index" : ""}`}>
      <div className="atlas-grain pointer-events-none fixed inset-0 z-0" />
      <div className="atlas-wash pointer-events-none fixed inset-0 z-0" />

      <header className="atlas-header relative z-30 flex items-start justify-between px-5 pb-4 pt-6 sm:px-8 sm:pt-8 lg:px-10">
        <a
          href="/gallery"
          className="atlas-back-link inline-flex items-center gap-3 text-white/40 transition-colors hover:text-white/80"
        >
          <ArrowLeftIcon />
          <span>
            <b>GALLERY</b>
            <small>返回影像目录</small>
          </span>
        </a>
        <div className="atlas-system-head">
          <div>
            <span>FIELD STATUS</span>
            <strong><i /> LIVE / DRIFTING</strong>
          </div>
          <div>
            <span>COORDINATES</span>
            <strong>{String(atlasCities.length).padStart(2, "0")} / {String(atlasDevelopedCount).padStart(2, "0")} DEVELOPED</strong>
          </div>
        </div>
      </header>

      <main className="atlas-main relative z-10 px-5 pb-6 sm:px-8 lg:px-10">
        <div className="atlas-intro mb-5 grid gap-5 border-b border-white/[0.08] pb-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="atlas-intro-copy">
            <p className="atlas-eyebrow">
              <span>01</span>
              EZYDONG / PHOTOGRAPHIC ARCHIVE
            </p>
            <h1 className="max-w-4xl font-serif text-[clamp(2.15rem,4vw,4.6rem)] font-light leading-[1.05] tracking-[-0.035em] text-white/95">
              星垂平野阔，
              <br className="hidden sm:block" />
              月涌大江流。
            </h1>
            <p className="atlas-quote-credit">杜甫 · 《旅夜书怀》</p>
          </div>

          <div className="atlas-intro-meta">
            <p>
              摄影档案持续整理中。
            </p>
            <div>
              <span><b>{String(atlasCities.length).padStart(2, "0")}</b> MEMORY BODIES</span>
              <span><b>{String(atlasDevelopedCount).padStart(2, "0")}</b> DEVELOPED</span>
            </div>
          </div>
        </div>

        <div className="atlas-toolbar mb-3 flex items-center justify-between">
          <div className="atlas-mode-switch">
            {([
              ["constellation", "01", "星图", "ORBITAL FIELD"],
              ["index", "02", "索引", "ARCHIVE INDEX"],
            ] as const).map(([value, number, label, caption]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMode(value);
                  if (value === "index") setFocusedSlug(null);
                }}
                className={`atlas-mode-button ${mode === value ? "is-active" : ""}`}
              >
                <i>{number}</i>
                <span>
                  <b>{label}</b>
                  <small>{caption}</small>
                </span>
              </button>
            ))}
          </div>

          <a
            href="/gallery/photos"
            className="atlas-source-link group"
          >
            <span>LEGACY VIEW</span>
            <b>原地图</b>
            <i />
          </a>
        </div>

        <div className="atlas-frame grid overflow-hidden rounded-[1.75rem] border border-cyan-100/[0.11] bg-[#07101b]/80 shadow-[0_35px_120px_rgba(0,5,18,0.62)] lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="atlas-field relative min-h-[520px] overflow-hidden sm:min-h-[620px]">
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
              activeSlug={hoveredSlug ?? activeSlug ?? ""}
              focusedSlug={focusedSlug}
              mode={mode}
              onHover={setHoveredSlug}
              onSelect={(slug) => {
                setHoveredSlug(null);
                setActiveSlug(slug);
                setFocusedSlug(slug);
              }}
            />
            <div className="atlas-depth pointer-events-none absolute inset-0 z-[1]" />
            {mode === "constellation" && !focusedSlug && (
              <div className="atlas-control-hint pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
                <span className="hidden sm:inline">DRAG TO ORBIT</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">SCROLL TO DOLLY</span>
                <span className="sm:hidden">DRAG · PINCH</span>
              </div>
            )}

            {focusedSlug && mode === "constellation" && (
              <button
                type="button"
                onClick={() => setFocusedSlug(null)}
                className="atlas-return-overview absolute right-4 top-4 z-30 rounded-full border border-cyan-100/15 bg-[#06111f]/75 px-4 py-2 text-[9px] tracking-[0.18em] text-cyan-50/70 backdrop-blur-md transition hover:border-cyan-100/35 hover:text-white"
              >
                ← 返回全景
              </button>
            )}

            {mode === "index" && (
              <div className="atlas-index-grid">
                <div className="atlas-index-header">
                  <div>
                    <span>ARCHIVE SIGNAL ARRAY</span>
                    <b>记忆体观测阵列</b>
                  </div>
                  <i />
                  <div>
                    <span>DEVELOPED / TOTAL</span>
                    <b>08 / 14</b>
                  </div>
                </div>
                {atlasCities.map((city, index) => {
                  const isActive = city.slug === active.slug;
                  const isOpen = Boolean(city.frames);
                  return (
                    <button
                      key={city.slug}
                      type="button"
                      aria-label={`查看${city.name}`}
                      onClick={() => setActiveSlug(city.slug)}
                      className={`atlas-index-record ${isActive ? "is-active" : ""} ${isOpen ? "is-developed" : ""}`}
                    >
                      <i>{String(index + 1).padStart(2, "0")}</i>
                      <span>
                        <b>{city.name}</b>
                        <small>{city.en}</small>
                      </span>
                      <em>{isOpen ? "DEVELOPED" : "IN DARKROOM"}</em>
                      <strong>{city.frames ? String(city.frames).padStart(2, "0") : "—"}<small>F</small></strong>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="atlas-field-legend pointer-events-none absolute bottom-5 left-5 flex items-center gap-5 text-[8px] tracking-[0.18em] text-white/25 sm:left-7">
              <span className="flex items-center gap-2">
                <i className="block h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_8px_white]" />
                已成册
              </span>
              <span className="flex items-center gap-2">
                <i className="block h-1.5 w-1.5 rounded-full border border-white/45" />
                待整理
              </span>
            </div>
          </section>

          {activeSlug && <aside className="atlas-memory-panel">
            <article key={active.slug} className="atlas-observer">
              <header className="atlas-observer-head">
                <span>OBSERVATION / {String(activeIndex + 1).padStart(2, "0")}</span>
                <i />
                <b>{focusedSlug === active.slug ? "FOCUS LOCKED" : "PASSIVE SIGNAL"}</b>
              </header>

              <div className="atlas-memory-visual">
                <div className="atlas-visual-corner is-top-left" />
                <div className="atlas-visual-corner is-bottom-right" />
                  {active.image ? (
                    <>
                      <Image
                        src={active.image}
                        alt={`${active.name}代表照片`}
                        fill
                        unoptimized
                        priority
                        sizes="(max-width: 1024px) 100vw, 360px"
                        className="object-cover saturate-[0.72] contrast-[1.04] transition duration-700 hover:scale-[1.025] hover:saturate-100"
                      />
                      <div className="atlas-image-grade" />
                    </>
                  ) : (
                    <div className="atlas-empty absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] tracking-[0.3em] text-white/24">CONTACT SHEET PENDING</span>
                    </div>
                  )}
                  <span className="atlas-frame-count">
                    {active.frames ? `${active.frames} FRAMES` : "UNCUT"}
                  </span>
                  <span className="atlas-contact-index">
                    {String(activeIndex + 1).padStart(2, "0")} / {atlasCities.length}
                  </span>
              </div>

              <div className="atlas-memory-copy">
                <div className="atlas-place-heading">
                  <div>
                    <p>{active.en}</p>
                    <h2>{active.name}</h2>
                  </div>
                  <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                </div>
                <p className="atlas-memory-note">{active.note}</p>

                <div className="atlas-readings">
                  <div>
                    <span>ARCHIVE</span>
                    <strong>{active.frames ? "DEVELOPED" : "PENDING"}</strong>
                  </div>
                  <div>
                    <span>ROUTES</span>
                    <strong>{String(activeConnections).padStart(2, "0")}</strong>
                  </div>
                  <div>
                    <span>SIGNAL</span>
                    <strong>{focusedSlug === active.slug ? "LOCK" : "OPEN"}</strong>
                  </div>
                </div>

                <a href={`/gallery/photos/${active.slug}`} className="atlas-enter-memory">
                  <span>
                    <small>OPEN CONTACT SHEET</small>
                    进入这段记忆
                  </span>
                  <i>↗</i>
                </a>
              </div>
            </article>
          </aside>}
        </div>
      </main>

      <style jsx global>{`
        .atlas-shell {
          --atlas-green: 155, 193, 182;
          position: relative;
          height: 100svh;
          min-height: 620px;
          isolation: isolate;
        }
        .atlas-header {
          position: fixed;
          inset: 0 0 auto;
          z-index: 60;
          pointer-events: none;
        }
        .atlas-header a,
        .atlas-header div {
          pointer-events: auto;
        }
        .atlas-back-link > span {
          display: grid;
          gap: 2px;
          padding-left: 2px;
          text-align: left;
        }
        .atlas-back-link b {
          color: rgba(232, 255, 250, 0.58);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.24em;
        }
        .atlas-back-link small {
          color: rgba(207, 234, 232, 0.28);
          font-size: 7px;
          letter-spacing: 0.13em;
        }
        .atlas-system-head {
          display: flex;
          align-items: flex-start;
          gap: 34px;
          text-align: left;
        }
        .atlas-system-head > div {
          display: grid;
          gap: 5px;
          min-width: 118px;
          border-left: 1px solid rgba(144, 238, 225, 0.12);
          padding-left: 10px;
        }
        .atlas-system-head span {
          color: rgba(189, 226, 225, 0.25);
          font-size: 6px;
          letter-spacing: 0.25em;
        }
        .atlas-system-head strong {
          color: rgba(225, 248, 245, 0.55);
          font-size: 7px;
          font-weight: 400;
          letter-spacing: 0.16em;
          white-space: nowrap;
        }
        .atlas-system-head strong i {
          display: inline-block;
          width: 4px;
          height: 4px;
          margin-right: 6px;
          border-radius: 50%;
          background: #8dffe9;
          box-shadow: 0 0 10px rgba(124, 255, 229, 0.78);
          animation: atlas-status-pulse 2.8s ease-in-out infinite;
        }
        .atlas-main {
          position: fixed;
          inset: 0;
          z-index: 10;
          padding: 0 !important;
        }
        .atlas-intro {
          position: fixed;
          left: clamp(24px, 3.2vw, 52px);
          top: clamp(92px, 12vh, 132px);
          z-index: 35;
          display: block;
          width: min(580px, calc(100vw - 96px));
          border: 0;
          padding: 0;
          pointer-events: none;
          transition: opacity 650ms ease, transform 900ms cubic-bezier(.22,1,.36,1);
        }
        .atlas-intro h1 {
          max-width: 560px;
          margin-top: 19px;
          font-size: clamp(2.15rem, 3.55vw, 3.95rem);
          line-height: 1.04;
          text-shadow: 0 3px 28px rgba(0, 4, 14, 0.92);
        }
        .atlas-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(169, 220, 215, 0.42);
          font-size: 7px;
          letter-spacing: 0.28em;
        }
        .atlas-eyebrow span {
          display: inline-grid;
          width: 26px;
          height: 18px;
          place-items: center;
          border: 1px solid rgba(146, 231, 220, 0.18);
          color: rgba(213, 250, 244, 0.58);
          letter-spacing: 0;
        }
        .atlas-intro-meta {
          display: grid;
          width: 310px;
          margin-top: 23px;
          gap: 14px;
          border-left: 1px solid rgba(158, 226, 218, 0.16);
          padding-left: 14px;
        }
        .atlas-intro-meta > p {
          max-width: 275px;
          color: rgba(232, 248, 246, 0.38);
          font-size: 11px;
          font-weight: 300;
          line-height: 1.85;
        }
        .atlas-intro-meta > div {
          display: flex;
          gap: 18px;
        }
        .atlas-intro-meta span {
          display: flex;
          align-items: baseline;
          gap: 6px;
          color: rgba(193, 223, 221, 0.25);
          font-size: 6px;
          letter-spacing: 0.17em;
        }
        .atlas-intro-meta b {
          color: rgba(195, 246, 237, 0.65);
          font-family: var(--font-serif);
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.06em;
        }
        .atlas-toolbar {
          position: fixed;
          left: clamp(24px, 3.2vw, 52px);
          bottom: clamp(24px, 3.2vw, 48px);
          z-index: 55;
          width: min(430px, calc(100vw - 48px));
          margin: 0;
        }
        .atlas-mode-switch {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          width: 270px;
          border-top: 1px solid rgba(170, 234, 227, 0.12);
          border-bottom: 1px solid rgba(170, 234, 227, 0.08);
          background: rgba(2, 10, 18, 0.34);
          backdrop-filter: blur(10px);
        }
        .atlas-mode-button {
          position: relative;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 12px 10px;
          color: rgba(208, 234, 232, 0.28);
          text-align: left;
          transition: color 240ms ease, background 240ms ease;
        }
        .atlas-mode-button + .atlas-mode-button {
          border-left: 1px solid rgba(170, 234, 227, 0.08);
        }
        .atlas-mode-button::after {
          content: "";
          position: absolute;
          right: 10px;
          bottom: -1px;
          left: 10px;
          height: 1px;
          background: #9affea;
          box-shadow: 0 0 10px rgba(111, 255, 226, 0.6);
          opacity: 0;
          transform: scaleX(0.4);
          transition: opacity 240ms ease, transform 240ms ease;
        }
        .atlas-mode-button:hover,
        .atlas-mode-button.is-active {
          color: rgba(238, 255, 251, 0.78);
          background: linear-gradient(180deg, rgba(102, 231, 211, 0.06), transparent);
        }
        .atlas-mode-button.is-active::after {
          opacity: 1;
          transform: scaleX(1);
        }
        .atlas-mode-button > i {
          color: rgba(161, 223, 218, 0.32);
          font-size: 6px;
          font-style: normal;
          letter-spacing: 0.08em;
        }
        .atlas-mode-button > span {
          display: grid;
          gap: 2px;
        }
        .atlas-mode-button b {
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.16em;
        }
        .atlas-mode-button small {
          color: rgba(183, 215, 214, 0.2);
          font-size: 5px;
          letter-spacing: 0.18em;
        }
        .atlas-source-link {
          display: grid;
          min-width: 92px;
          gap: 2px;
          padding: 5px 15px 6px 0;
          color: rgba(218, 239, 237, 0.33);
          text-align: right;
          transition: color 220ms ease;
        }
        .atlas-source-link span {
          font-size: 5px;
          letter-spacing: 0.2em;
        }
        .atlas-source-link b {
          font-size: 8px;
          font-weight: 400;
          letter-spacing: 0.16em;
        }
        .atlas-source-link i {
          position: absolute;
          right: 0;
          bottom: 5px;
          width: 1px;
          height: 25px;
          background: rgba(166, 237, 227, 0.14);
          transition: background 220ms ease, box-shadow 220ms ease;
        }
        .atlas-source-link:hover {
          color: rgba(236, 255, 251, 0.72);
        }
        .atlas-source-link:hover i {
          background: rgba(153, 255, 236, 0.6);
          box-shadow: 0 0 10px rgba(118, 255, 229, 0.4);
        }
        .atlas-shell.is-focused .atlas-intro {
          opacity: 0;
          transform: translate3d(-18px, -8px, 0) scale(0.98);
        }
        .atlas-shell.is-focused .atlas-toolbar,
        .atlas-shell.is-focused .atlas-field-legend,
        .atlas-shell.is-focused .atlas-control-hint {
          opacity: 0;
          pointer-events: none;
        }
        @media (min-width: 641px) {
          .atlas-shell.is-focused .atlas-memory-panel {
            right: clamp(42px, 6.4vw, 112px);
            bottom: clamp(48px, 11vh, 132px);
            width: min(300px, 23vw);
            height: auto;
            min-height: 0;
            filter: none;
          }
          .atlas-shell.is-focused .atlas-observer {
            display: block;
            border: 0;
            border-left: 1px solid rgba(210, 220, 211, 0.22);
            background: linear-gradient(90deg, rgba(2, 8, 15, 0.42), transparent 92%);
            backdrop-filter: none;
          }
          .atlas-shell.is-focused .atlas-observer-head,
          .atlas-shell.is-focused .atlas-memory-visual,
          .atlas-shell.is-focused .atlas-readings,
          .atlas-shell.is-focused .atlas-place-heading > span {
            display: none;
          }
          .atlas-shell.is-focused .atlas-memory-copy {
            gap: 15px;
            margin-top: 0;
            padding: 4px 0 4px 25px;
          }
          .atlas-shell.is-focused .atlas-memory-note {
            min-height: 0;
            max-width: 24em;
            color: rgba(226, 232, 224, 0.5);
            font-size: 11px;
            line-height: 1.9;
          }
          .atlas-shell.is-focused .atlas-place-heading h2 {
            font-size: clamp(34px, 3.35vw, 50px);
            letter-spacing: 0.12em;
          }
          .atlas-shell.is-focused .atlas-place-heading p {
            color: rgba(204, 210, 198, 0.45);
          }
          .atlas-shell.is-focused .atlas-enter-memory {
            width: min(210px, 100%);
            margin-top: 4px;
            padding-top: 10px;
            border-top: 1px solid rgba(214, 220, 210, 0.14);
          }
          .atlas-shell.is-focused .atlas-enter-memory > i {
            border: 0;
            font-size: 14px;
          }
        }
        .atlas-return-overview {
          position: fixed;
          right: clamp(24px, 3vw, 46px) !important;
          top: 82px !important;
          z-index: 65 !important;
        }
        .atlas-grain {
          opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
          mix-blend-mode: soft-light;
        }
        .atlas-wash {
          background:
            radial-gradient(circle at 18% 38%, rgba(25, 132, 153, 0.16), transparent 31%),
            radial-gradient(circle at 76% 13%, rgba(71, 73, 154, 0.12), transparent 28%),
            linear-gradient(145deg, #030711 0%, #06101b 52%, #02050b 100%);
        }
        .atlas-frame {
          position: fixed;
          inset: 0;
          z-index: 1;
          display: block;
          border: 0;
          border-radius: 0;
          background: #020710;
          isolation: isolate;
        }
        .atlas-frame::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 30;
          border-radius: 0;
          pointer-events: none;
          box-shadow:
            inset 0 1px 0 rgba(205, 255, 247, 0.09),
            inset 0 -70px 100px rgba(0, 3, 10, 0.2);
        }
        .atlas-field {
          position: fixed;
          inset: 0;
          min-height: 100svh !important;
          background: #06101b;
          perspective: 900px;
        }
        .atlas-canvas-shell > div {
          overflow: clip !important;
        }
        .atlas-canvas-shell canvas {
          cursor: grab;
          touch-action: none;
        }
        .atlas-canvas-shell canvas:active {
          cursor: grabbing;
        }
        .atlas-field::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(4, 10, 22, 0.02), transparent 55%, rgba(2, 6, 15, 0.36)),
            radial-gradient(circle at 48% 48%, transparent 34%, rgba(0, 4, 13, 0.5) 108%);
        }
        .atlas-memory-panel {
          position: fixed;
          right: clamp(22px, 3vw, 46px);
          bottom: clamp(22px, 3vw, 46px);
          z-index: 50;
          width: min(286px, 27vw);
          height: min(430px, calc(100svh - 160px));
          min-height: 370px;
          overflow: visible;
          border: 0;
          background: transparent;
          filter: drop-shadow(0 24px 48px rgba(0, 2, 12, 0.38));
        }
        .atlas-observer {
          position: relative;
          display: grid;
          grid-template-rows: minmax(205px, 1fr) auto;
          height: 100%;
          border: 0;
          background: linear-gradient(180deg, rgba(2, 8, 15, 0.08), rgba(2, 8, 15, 0.38));
          backdrop-filter: blur(10px);
        }
        .atlas-observer::before,
        .atlas-observer::after {
          content: "";
          position: absolute;
          z-index: 3;
          pointer-events: none;
        }
        .atlas-observer::before {
          top: -1px;
          right: 22px;
          width: 46px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(137, 255, 234, 0.76));
          box-shadow: 0 0 12px rgba(99, 255, 225, 0.36);
        }
        .atlas-observer::after {
          right: -5px;
          bottom: 62px;
          width: 1px;
          height: 56px;
          background: rgba(140, 244, 229, 0.22);
        }
        .atlas-observer-head {
          display: none;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid rgba(151, 222, 215, 0.08);
          padding: 0 12px;
          color: rgba(184, 221, 220, 0.26);
          font-size: 5px;
          letter-spacing: 0.2em;
        }
        .atlas-observer-head > i {
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, rgba(166, 232, 224, 0.13), transparent);
        }
        .atlas-observer-head > b {
          color: rgba(175, 243, 233, 0.43);
          font-size: 5px;
          font-weight: 400;
          white-space: nowrap;
        }
        .atlas-memory-visual {
          position: relative;
          margin: 0;
          min-height: 210px;
          overflow: hidden;
          border: 1px solid rgba(211, 220, 211, 0.12);
          background: #091015;
          clip-path: none;
        }
        .atlas-image-grade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2, 9, 16, 0.05), transparent 52%, rgba(1, 6, 12, 0.68)),
            linear-gradient(112deg, rgba(32, 104, 105, 0.13), transparent 48%);
          pointer-events: none;
        }
        .atlas-visual-corner {
          display: none;
          position: absolute;
          z-index: 4;
          width: 15px;
          height: 15px;
          pointer-events: none;
        }
        .atlas-visual-corner.is-top-left {
          top: 7px;
          left: 7px;
          border-top: 1px solid rgba(207, 255, 247, 0.5);
          border-left: 1px solid rgba(207, 255, 247, 0.5);
        }
        .atlas-visual-corner.is-bottom-right {
          right: 7px;
          bottom: 7px;
          border-right: 1px solid rgba(207, 255, 247, 0.34);
          border-bottom: 1px solid rgba(207, 255, 247, 0.34);
        }
        .atlas-frame-count,
        .atlas-contact-index {
          position: absolute;
          z-index: 4;
          color: rgba(232, 255, 250, 0.67);
          font-size: 6px;
          letter-spacing: 0.18em;
          text-shadow: 0 2px 10px rgba(0, 4, 12, 0.9);
        }
        .atlas-frame-count {
          top: 12px;
          left: 15px;
          border-left: 1px solid rgba(164, 255, 237, 0.46);
          padding: 2px 0 2px 8px;
        }
        .atlas-contact-index {
          right: 14px;
          bottom: 12px;
        }
        .atlas-memory-copy {
          display: grid;
          gap: 12px;
          margin-top: 14px;
          border-left: 1px solid rgba(211, 220, 211, 0.16);
          padding: 1px 0 1px 16px;
        }
        .atlas-place-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
        }
        .atlas-place-heading > div {
          display: grid;
          gap: 3px;
        }
        .atlas-place-heading p {
          color: rgba(161, 217, 211, 0.4);
          font-size: 6px;
          letter-spacing: 0.28em;
        }
        .atlas-place-heading h2 {
          color: rgba(245, 255, 252, 0.9);
          font-family: var(--font-serif);
          font-size: 34px;
          font-weight: 300;
          letter-spacing: 0.08em;
          line-height: 1;
        }
        .atlas-place-heading > span {
          color: rgba(174, 216, 214, 0.12);
          font-family: var(--font-serif);
          font-size: 31px;
          line-height: 0.9;
        }
        .atlas-memory-note {
          min-height: 31px;
          color: rgba(220, 239, 236, 0.36);
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.03em;
          line-height: 1.7;
        }
        .atlas-readings {
          display: none;
          grid-template-columns: 1.35fr 0.8fr 0.8fr;
          border-top: 1px solid rgba(153, 222, 214, 0.09);
          border-bottom: 1px solid rgba(153, 222, 214, 0.06);
        }
        .atlas-readings > div {
          display: grid;
          gap: 3px;
          padding: 8px 0 7px;
        }
        .atlas-readings > div + div {
          border-left: 1px solid rgba(153, 222, 214, 0.07);
          padding-left: 10px;
        }
        .atlas-readings span {
          color: rgba(174, 211, 209, 0.2);
          font-size: 5px;
          letter-spacing: 0.17em;
        }
        .atlas-readings strong {
          color: rgba(213, 244, 239, 0.55);
          font-size: 7px;
          font-weight: 400;
          letter-spacing: 0.12em;
        }
        .atlas-enter-memory {
          display: flex;
          align-items: end;
          justify-content: space-between;
          color: rgba(225, 247, 243, 0.56);
          transition: color 220ms ease;
        }
        .atlas-enter-memory > span {
          display: grid;
          gap: 2px;
          font-size: 9px;
          letter-spacing: 0.14em;
        }
        .atlas-enter-memory small {
          color: rgba(172, 210, 207, 0.19);
          font-size: 5px;
          letter-spacing: 0.2em;
        }
        .atlas-enter-memory > i {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border: 1px solid rgba(159, 230, 221, 0.12);
          color: rgba(191, 248, 239, 0.42);
          font-size: 10px;
          font-style: normal;
          transition: border-color 220ms ease, color 220ms ease, transform 220ms ease;
        }
        .atlas-enter-memory:hover {
          color: rgba(244, 255, 252, 0.9);
        }
        .atlas-enter-memory:hover > i {
          border-color: rgba(151, 255, 236, 0.46);
          color: rgba(224, 255, 249, 0.9);
          transform: translate(2px, -2px);
        }
        .atlas-photo-portal {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          width: 164px;
          gap: 8px;
          border-top: 1px solid rgba(239, 231, 211, 0.62);
          padding-top: 7px;
          color: rgba(246, 243, 233, 0.96);
          font-family: ui-sans-serif, system-ui, sans-serif;
          line-height: 1;
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.92);
          transition: color 180ms ease, transform 180ms ease;
        }
        .atlas-photo-portal span {
          grid-column: 1 / -1;
          color: rgba(242, 237, 222, 0.58);
          font-size: 5px;
          letter-spacing: 0.18em;
          white-space: nowrap;
        }
        .atlas-photo-portal b {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }
        .atlas-photo-portal i {
          grid-column: 3;
          grid-row: 2;
          font-size: 13px;
          font-style: normal;
        }
        .atlas-photo-portal:hover {
          color: white;
          transform: translateX(3px);
        }
        .atlas-depth {
          background:
            radial-gradient(ellipse at 42% 54%, rgba(90, 225, 208, 0.08), transparent 36%),
            linear-gradient(118deg, transparent 18%, rgba(138, 209, 219, 0.035) 50%, transparent 76%);
          mix-blend-mode: screen;
        }
        .atlas-orbit {
          z-index: 2;
          border: 1px solid rgba(150, 229, 224, 0.08);
          transform: rotateX(62deg) rotateZ(-12deg);
          box-shadow:
            inset 0 0 80px rgba(var(--atlas-green), 0.02),
            0 0 50px rgba(52, 167, 181, 0.025);
        }
        .atlas-orbit-small {
          transform: rotateX(69deg) rotateZ(19deg);
          border-color: rgba(153, 182, 255, 0.055);
        }
        .atlas-index-grid {
          position: fixed;
          top: 154px;
          right: min(368px, 30vw);
          bottom: 102px;
          left: max(500px, 34vw);
          z-index: 22;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-rows: 78px;
          align-content: center;
          gap: 1px;
          background: transparent;
          pointer-events: auto;
        }
        .atlas-index-header {
          display: grid;
          grid-column: 1 / -1;
          grid-template-columns: auto 1fr auto;
          align-items: end;
          gap: 14px;
          min-height: 42px;
          border-bottom: 1px solid rgba(154, 231, 220, 0.13);
          padding: 0 2px 10px;
        }
        .atlas-index-header > div {
          display: grid;
          gap: 4px;
        }
        .atlas-index-header > div:last-child {
          text-align: right;
        }
        .atlas-index-header span {
          color: rgba(173, 218, 214, 0.28);
          font-size: 5px;
          letter-spacing: 0.23em;
        }
        .atlas-index-header b {
          color: rgba(225, 249, 245, 0.63);
          font-family: var(--font-serif);
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.12em;
        }
        .atlas-index-header > i {
          height: 1px;
          margin-bottom: 4px;
          background: linear-gradient(90deg, rgba(141, 255, 235, 0.25), rgba(141, 255, 235, 0.03));
        }
        .atlas-index-record {
          position: relative;
          display: grid;
          grid-template-columns: 18px minmax(0, 1fr) auto;
          grid-template-rows: 1fr auto;
          gap: 1px 8px;
          overflow: hidden;
          border: 0;
          background:
            linear-gradient(125deg, rgba(7, 24, 35, 0.64), rgba(2, 10, 19, 0.75)),
            rgba(2, 10, 18, 0.72);
          padding: 12px 11px;
          color: rgba(220, 244, 240, 0.57);
          text-align: left;
          box-shadow: inset 0 0 0 1px rgba(146, 218, 210, 0.055);
          backdrop-filter: blur(12px);
          transition: background 220ms ease, color 220ms ease, transform 220ms ease;
        }
        .atlas-index-record::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139, 255, 234, 0.65), transparent);
          opacity: 0;
          transform: scaleX(0.3);
          transition: opacity 220ms ease, transform 220ms ease;
        }
        .atlas-index-record:hover,
        .atlas-index-record.is-active {
          z-index: 2;
          background:
            linear-gradient(125deg, rgba(10, 39, 49, 0.86), rgba(3, 15, 26, 0.9)),
            rgba(3, 15, 24, 0.88);
          color: rgba(239, 255, 251, 0.84);
          transform: translateY(-1px);
        }
        .atlas-index-record:hover::after,
        .atlas-index-record.is-active::after {
          opacity: 1;
          transform: scaleX(1);
        }
        .atlas-index-record > i {
          grid-row: 1 / span 2;
          align-self: center;
          color: rgba(165, 218, 213, 0.28);
          font-size: 7px;
          font-style: normal;
        }
        .atlas-index-record > span {
          display: grid;
          align-self: center;
          gap: 2px;
          min-width: 0;
        }
        .atlas-index-record > span b {
          overflow: hidden;
          font-family: var(--font-serif);
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .atlas-index-record > span small {
          overflow: hidden;
          color: rgba(170, 208, 206, 0.38);
          font-size: 6px;
          letter-spacing: 0.14em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .atlas-index-record > em {
          grid-column: 2;
          align-self: end;
          color: rgba(159, 203, 199, 0.31);
          font-size: 5px;
          font-style: normal;
          letter-spacing: 0.15em;
        }
        .atlas-index-record.is-developed > em {
          color: rgba(142, 235, 220, 0.48);
        }
        .atlas-index-record > strong {
          grid-row: 1 / span 2;
          grid-column: 3;
          align-self: center;
          color: rgba(176, 221, 217, 0.38);
          font-family: var(--font-serif);
          font-size: 15px;
          font-weight: 400;
        }
        .atlas-index-record > strong small {
          margin-left: 2px;
          color: rgba(167, 207, 204, 0.18);
          font-family: sans-serif;
          font-size: 5px;
        }
        .atlas-city-star {
          background-image: radial-gradient(
            circle at 34% 28%,
            rgba(255,255,255,.98) 0%,
            rgba(189,255,242,.94) 28%,
            rgba(65,151,166,.86) 66%,
            rgba(9,24,41,.92) 100%
          );
          box-shadow:
            inset -2px -2px 4px rgba(1, 9, 20, 0.75),
            inset 1px 1px 2px rgba(255,255,255,.7);
        }
        .atlas-star-core {
          background: radial-gradient(circle, rgba(255,255,255,.96), rgba(164,248,235,.54) 42%, transparent 72%);
          filter: blur(.2px);
        }
        .atlas-city-label {
          background: linear-gradient(90deg, rgba(4, 12, 23, 0.54), rgba(4, 12, 23, 0));
          text-shadow: 0 1px 9px rgba(0, 5, 15, 0.95);
          backdrop-filter: blur(2px);
        }
        .atlas-3d-label {
          position: relative;
          display: grid;
          grid-template-columns: 17px auto;
          min-width: 92px;
          gap: 1px 7px;
          border: 0;
          border-left: 1px solid rgba(174, 255, 241, 0.15);
          background: linear-gradient(90deg, rgba(3, 14, 24, 0.62), rgba(3, 14, 24, 0.08));
          padding: 5px 9px 5px 7px;
          color: rgba(237, 255, 251, 0.72);
          text-align: left;
          text-shadow: 0 2px 10px rgba(0, 4, 14, 0.95);
          backdrop-filter: blur(3px);
          transition: border-color 220ms ease, background 220ms ease, color 220ms ease, transform 220ms ease;
        }
        .atlas-3d-label::before {
          content: "";
          position: absolute;
          top: -1px;
          left: -3px;
          width: 5px;
          height: 1px;
          background: rgba(167, 255, 239, 0.45);
        }
        .atlas-3d-label:hover,
        .atlas-3d-label.is-active {
          border-color: rgba(174, 255, 241, 0.54);
          background: linear-gradient(90deg, rgba(7, 29, 40, 0.82), rgba(4, 18, 29, 0.12));
          color: rgba(255, 255, 255, 0.96);
          transform: translate3d(2px, -1px, 0);
        }
        .atlas-3d-label > i {
          grid-row: 1 / span 2;
          align-self: center;
          color: rgba(159, 215, 211, 0.28);
          font-size: 6px;
          font-style: normal;
          letter-spacing: 0.06em;
        }
        .atlas-3d-label span {
          font-family: var(--font-serif);
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }
        .atlas-3d-label small {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 5px;
          font-weight: 400;
          letter-spacing: 0.17em;
          color: rgba(181, 223, 226, 0.3);
          white-space: nowrap;
        }
        .atlas-3d-label small b {
          color: rgba(177, 241, 231, 0.35);
          font-size: 5px;
          font-weight: 400;
          letter-spacing: 0.08em;
        }
        .atlas-focus-readout {
          display: grid;
          min-width: 128px;
          gap: 5px;
          border-top: 1px solid rgba(150, 255, 236, 0.18);
          border-left: 1px solid rgba(150, 255, 236, 0.46);
          padding: 8px 0 6px 11px;
          background: linear-gradient(90deg, rgba(3, 14, 24, 0.36), transparent);
          color: rgba(230, 255, 250, 0.86);
          text-shadow: 0 2px 12px rgba(0, 5, 18, 0.95);
        }
        .atlas-focus-readout span,
        .atlas-focus-readout small {
          font-size: 6px;
          letter-spacing: 0.22em;
          color: rgba(173, 230, 229, 0.45);
          white-space: nowrap;
        }
        .atlas-focus-readout strong {
          font-family: var(--font-serif);
          font-size: 20px;
          font-weight: 400;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }
        .atlas-control-hint {
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(175, 244, 237, 0.09);
          border-radius: 999px;
          background: rgba(2, 10, 20, 0.42);
          padding: 7px 12px;
          color: rgba(195, 234, 232, 0.36);
          font-size: 7px;
          letter-spacing: 0.2em;
          white-space: nowrap;
          backdrop-filter: blur(8px);
        }
        .atlas-pulse {
          animation: atlas-pulse 3.8s ease-out infinite;
        }
        .atlas-empty {
          background:
            linear-gradient(135deg, transparent 48%, rgba(255,255,255,.035) 49%, rgba(255,255,255,.035) 51%, transparent 52%),
            repeating-linear-gradient(90deg, rgba(255,255,255,.02) 0, rgba(255,255,255,.02) 1px, transparent 1px, transparent 24px);
        }
        /* The atlas begins as a field, not a selected record. */
        .atlas-system-head { display: none; }
        .atlas-intro {
          top: clamp(108px, 15vh, 178px);
          width: min(470px, calc(100vw - 72px));
        }
        .atlas-intro h1 {
          max-width: 450px;
          margin-top: 14px;
          font-size: clamp(2.1rem, 3.15vw, 3.35rem);
          letter-spacing: -0.045em;
          line-height: 1.12;
        }
        .atlas-quote-credit {
          margin-top: 13px;
          color: rgba(212, 229, 220, 0.34);
          font-family: var(--font-serif);
          font-size: 10px;
          letter-spacing: 0.12em;
        }
        .atlas-intro-meta {
          width: 238px;
          margin-top: 18px;
          border-left-color: rgba(190, 224, 218, 0.1);
        }
        .atlas-intro-meta > p {
          color: rgba(228, 241, 237, 0.34);
          font-size: 10px;
          line-height: 1.8;
        }
        .atlas-intro-meta > div { display: none; }
        .atlas-toolbar {
          left: clamp(28px, 3.2vw, 52px);
          right: auto;
          bottom: 34px;
          width: auto;
        }
        .atlas-mode-switch {
          display: flex;
          width: auto;
          border: 0;
          background: none;
          backdrop-filter: none;
        }
        .atlas-mode-button {
          min-width: 0;
          border: 0;
          border-bottom: 1px solid rgba(199, 231, 225, 0.14);
          background: transparent;
          padding: 4px 18px 7px 0;
        }
        .atlas-mode-button + .atlas-mode-button { border-left: 0; padding-left: 18px; }
        .atlas-mode-button::after { display: none; }
        .atlas-mode-button > i { display: none; }
        .atlas-mode-button b { font-size: 10px; font-weight: 400; }
        .atlas-mode-button small { margin-top: 3px; font-size: 5px; }
        .atlas-mode-button.is-active { color: rgba(245, 249, 241, 0.88); border-bottom-color: rgba(222, 239, 231, 0.72); }
        .atlas-source-link { display: none; }
        .atlas-control-hint {
          left: auto;
          right: clamp(28px, 3.2vw, 52px);
          bottom: 35px;
          transform: none;
          border: 0;
          background: transparent;
          padding: 0;
          backdrop-filter: none;
        }
        .atlas-field-legend { display: none; }
        .atlas-depth { opacity: 0.28; }
        .atlas-3d-label {
          min-width: 0;
          gap: 0;
          border: 0;
          background: transparent;
          padding: 0;
          backdrop-filter: none;
        }
        .atlas-3d-label::before,
        .atlas-3d-label > i,
        .atlas-3d-label small { display: none; }
        .atlas-3d-label span {
          color: rgba(229, 239, 232, 0.57);
          font-family: var(--font-serif);
          font-size: 13px;
          letter-spacing: 0.12em;
        }
        .atlas-3d-label:hover,
        .atlas-3d-label.is-active {
          border: 0;
          background: transparent;
          color: white;
          transform: translate3d(2px, -2px, 0);
        }
        .atlas-3d-label:hover span,
        .atlas-3d-label.is-active span { color: rgba(255, 255, 250, 0.96); }
        .atlas-node-preview {
          width: 176px;
          transform: translate(-50%, -100%);
          animation: atlas-preview-in 240ms cubic-bezier(.2,.8,.2,1) both;
        }
        .atlas-node-preview.is-below {
          transform: translate(-50%, 0);
          animation-name: atlas-preview-in-below;
        }
        .atlas-node-preview-image {
          display: block;
          width: 176px;
          height: 104px;
          background-position: 50% 58%;
          background-size: cover;
          box-shadow: 0 16px 36px rgba(0, 2, 8, 0.32);
          filter: saturate(0.92) contrast(1.06) brightness(1.04);
          opacity: 0.94;
        }
        @keyframes atlas-pulse {
          0% { transform: scale(1); opacity: .75; }
          75%, 100% { transform: scale(3.5); opacity: 0; }
        }
        @keyframes atlas-status-pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes atlas-preview-in {
          from { opacity: 0; transform: translate(-50%, calc(-100% + 8px)) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -100%) scale(1); }
        }
        @keyframes atlas-preview-in-below {
          from { opacity: 0; transform: translate(-50%, -8px) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .atlas-pulse { animation: none; }
        }
        @media (max-width: 640px) {
          .atlas-shell {
            min-height: 0;
          }
          .atlas-header {
            padding-top: 20px;
          }
          .atlas-back-link small,
          .atlas-system-head > div:first-child {
            display: none;
          }
          .atlas-system-head {
            gap: 0;
          }
          .atlas-system-head > div {
            min-width: 0;
            border-left: 0;
            padding-left: 0;
            text-align: right;
          }
          .atlas-system-head span {
            font-size: 5px;
          }
          .atlas-system-head strong {
            font-size: 6px;
          }
          .atlas-intro {
            left: 20px;
            top: 78px;
            width: calc(100vw - 40px);
          }
          .atlas-intro h1 {
            max-width: 350px;
            margin-top: 14px;
            font-size: clamp(1.9rem, 9.7vw, 2.55rem);
            line-height: 1.02;
          }
          .atlas-eyebrow {
            font-size: 5px;
            letter-spacing: 0.18em;
          }
          .atlas-intro-meta {
            display: none;
          }
          .atlas-toolbar {
            left: 20px;
            top: 224px;
            bottom: auto;
            width: calc(100vw - 40px);
            transition: opacity 400ms ease;
          }
          .atlas-mode-switch {
            width: 234px;
          }
          .atlas-mode-button {
            padding: 7px 9px 8px;
          }
          .atlas-source-link {
            min-width: 76px;
          }
          .atlas-shell.is-index .atlas-intro {
            opacity: 0;
            pointer-events: none;
          }
          .atlas-shell.is-index .atlas-toolbar {
            top: 96px;
          }
          .atlas-index-grid {
            top: 154px;
            right: 14px;
            bottom: 170px;
            left: 14px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: 52px;
            align-content: start;
          }
          .atlas-index-header {
            min-height: 36px;
            padding-bottom: 8px;
          }
          .atlas-index-header b {
            font-size: 10px;
          }
          .atlas-index-header > i {
            display: none;
          }
          .atlas-index-header {
            grid-template-columns: 1fr auto;
          }
          .atlas-index-record {
            grid-template-columns: 14px minmax(0, 1fr) auto;
            gap: 0 5px;
            padding: 7px;
          }
          .atlas-index-record > span b {
            font-size: 11px;
          }
          .atlas-index-record > em {
            display: none;
          }
          .atlas-index-record > strong {
            font-size: 12px;
          }
          .atlas-shell.is-focused .atlas-intro {
            opacity: 0;
          }
          .atlas-shell.is-focused .atlas-toolbar {
            opacity: 0;
            pointer-events: none;
          }
          .atlas-return-overview {
            right: 20px !important;
            top: 72px !important;
          }
          .atlas-memory-panel {
            inset: auto 14px 14px;
            width: auto;
            height: 142px;
            min-height: 0;
            filter: drop-shadow(0 18px 30px rgba(0, 2, 12, 0.46));
          }
          .atlas-shell.is-focused .atlas-memory-panel {
            inset: auto 18px 22px 18px;
            height: auto;
            filter: none;
          }
          .atlas-shell.is-focused .atlas-observer {
            display: block;
            border: 0;
            border-left: 1px solid rgba(214, 220, 210, 0.2);
            background: linear-gradient(90deg, rgba(2, 8, 15, 0.5), transparent);
            clip-path: none;
            backdrop-filter: none;
          }
          .atlas-shell.is-focused .atlas-memory-visual {
            display: none;
          }
          .atlas-shell.is-focused .atlas-memory-copy {
            gap: 7px;
            margin-top: 0;
            padding: 2px 0 2px 15px;
          }
          .atlas-shell.is-focused .atlas-place-heading h2 {
            font-size: 31px;
          }
          .atlas-shell.is-focused .atlas-enter-memory {
            width: min(190px, 100%);
            padding-top: 7px;
            border-top: 1px solid rgba(214, 220, 210, 0.13);
          }
          .atlas-observer {
            grid-template-columns: 110px minmax(0, 1fr);
            grid-template-rows: 1fr;
            clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          }
          .atlas-observer-head {
            display: none;
          }
          .atlas-memory-visual {
            min-height: 0;
            margin: 9px 0 9px 9px;
            clip-path: none;
          }
          .atlas-contact-index {
            right: 8px;
            bottom: 8px;
            font-size: 5px;
          }
          .atlas-frame-count {
            top: 9px;
            left: 9px;
            font-size: 5px;
          }
          .atlas-memory-copy {
            min-width: 0;
            gap: 8px;
            padding: 14px 12px 11px;
          }
          .atlas-place-heading h2 {
            font-size: 25px;
          }
          .atlas-place-heading > span,
          .atlas-memory-note,
          .atlas-readings,
          .atlas-enter-memory small {
            display: none;
          }
          .atlas-enter-memory {
            margin-top: auto;
          }
          .atlas-enter-memory > span {
            font-size: 8px;
          }
          .atlas-enter-memory > i {
            width: 24px;
            height: 24px;
          }
          .atlas-control-hint {
            bottom: 174px !important;
          }
          .atlas-field-legend {
            bottom: 172px;
          }
          .atlas-3d-label {
            grid-template-columns: 12px auto;
            min-width: 65px;
            gap: 1px 4px;
            padding: 3px 5px;
          }
          .atlas-3d-label > i { font-size: 5px; }
          .atlas-3d-label span { font-size: 9px; }
          .atlas-3d-label small { display: none; }
          .atlas-focus-readout { display: none; }
        }
      `}</style>
    </div>
  );
}
