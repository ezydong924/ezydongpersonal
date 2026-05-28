"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BackButton from "@/components/back-button";

const cities = [
  { name: "大连", en: "Dalian", lat: 38.92, lng: 121.63, slug: "dalian" },
  { name: "成都", en: "Chengdu", lat: 30.57, lng: 104.07, slug: "chengdu" },
  { name: "大理", en: "Dali", lat: 25.61, lng: 100.27, slug: "dali" },
  { name: "昆明", en: "Kunming", lat: 25.04, lng: 102.68, slug: "kunming" },
  { name: "香港", en: "Hong Kong", lat: 22.32, lng: 114.17, slug: "hongkong" },
  { name: "威海", en: "Weihai", lat: 37.51, lng: 122.12, slug: "weihai" },
  { name: "苏州", en: "Suzhou", lat: 31.30, lng: 120.63, slug: "suzhou" },
  { name: "北京", en: "Beijing", lat: 39.90, lng: 116.41, slug: "beijing" },
  { name: "日照", en: "Rizhao", lat: 35.42, lng: 119.53, slug: "rizhao" },
  { name: "重庆", en: "Chongqing", lat: 29.56, lng: 106.55, slug: "chongqing" },
  { name: "丽江", en: "Lijiang", lat: 26.86, lng: 100.23, slug: "lijiang" },
  { name: "西双版纳", en: "Xishuangbanna", lat: 22.01, lng: 100.80, slug: "xishuangbanna" },
  { name: "迪庆州", en: "Diqing", lat: 27.82, lng: 99.70, slug: "diqing" },
];


export default function PhotosMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss bottom info after 3s
  useEffect(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (active) {
      dismissTimer.current = setTimeout(() => setActive(null), 2000);
    }
    return () => { if (dismissTimer.current) clearTimeout(dismissTimer.current); };
  }, [active]);

  useEffect(() => {
    let cancelled = false;
    const loadLeaflet = () => {
      if (cancelled || !mapRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      const map = L.map(mapRef.current, {
        center: [35, 105],
        zoom: 4,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 6,
      }).addTo(map);

      map.setMinZoom(3.5);
      map.setMaxZoom(5);
      map.setMaxBounds(L.latLngBounds([5, 60], [55, 150]));

      cities.forEach((city: (typeof cities)[0]) => {
        const iconHtml =
          '<div style="display:flex;align-items:center;gap:6px;cursor:pointer">' +
          '<div style="position:relative;width:10px;height:10px;flex-shrink:0">' +
          '<div style="width:10px;height:10px;background:white;border-radius:50%;box-shadow:0 0 14px rgba(255,255,255,0.6);border:2px solid rgba(255,255,255,0.5);position:relative;z-index:1"></div>' +
          '</div>' +
          '<span style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:300;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,0.8)">' + city.name + '</span>' +
          '</div>';
        const icon = L.divIcon({
          className: "",
          html: iconHtml,
          iconSize: [80, 16],
          iconAnchor: [5, 8],
        });
        const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);
        marker.on("click", () => {
          window.location.href = "/gallery/photos/" + city.slug;
        });
        marker.on("mouseover", () => setActive(city.slug));
        marker.on("mouseout", () => setActive(null));
      });

      map.on("mousedown touchstart dragstart zoomstart", () => setHintVisible(false));

      setLoaded(true);
      setTimeout(() => { try { map.invalidateSize(); } catch (_) {} }, 100);
      setTimeout(() => { try { map.invalidateSize(); } catch (_) {} }, 500);
    };

    const timer = setTimeout(loadLeaflet, 50);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="fixed top-8 left-8 z-[1000]">
        <BackButton href="/gallery" label="返回" />
      </div>

      <div className="absolute inset-0">
        <div ref={mapRef} className="w-full h-full"
          style={{
            filter: loaded ? "none" : "blur(6px)",
            transition: "filter 0.6s ease",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />
      </div>

      <div className="relative z-[800] min-h-screen flex flex-col items-center pointer-events-none">
        <div
          className="mt-20 text-center pointer-events-auto"
          style={{
            opacity: hintVisible ? 1 : 0,
            transition: "opacity 1.5s ease-out",
          }}
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-white/90">影笺</h1>
          <p className="text-white/30 text-sm mt-2 tracking-widest">选择一个城市</p>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-auto">
          <AnimatePresence mode="wait">
            {active && cities.find((c) => c.slug === active) && (
              <Link
                key={active}
                href={"/gallery/photos/" + active}
              >
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative px-10 py-5 rounded-2xl bg-white/[0.04] backdrop-blur-3xl border border-white/[0.06] text-center overflow-hidden group"
                  style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.5), inset 0 0.5px 0 rgba(255,255,255,0.06)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-white/85 text-2xl font-light tracking-[0.04em] leading-none" style={{ fontFamily: "var(--font-serif)" }}>
                      {cities.find((c) => c.slug === active)?.name}
                    </p>
                    <p className="text-white/25 text-[11px] tracking-[0.25em] uppercase mt-2 leading-none">
                      {cities.find((c) => c.slug === active)?.en}
                    </p>
                  </motion.div>
                </motion.div>
              </Link>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
