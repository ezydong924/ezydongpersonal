"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BackButton from "@/components/back-button";
import "leaflet/dist/leaflet.css";

let L: any = null;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

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
  { name: "西安", en: "Xi'an", lat: 34.34, lng: 108.94, slug: "xian" },
  { name: "迪庆州", en: "Diqing", lat: 27.82, lng: 99.70, slug: "diqing" },
];


export default function PhotosMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced hover to avoid flickering between close markers
  const handleMarkerOver = (slug: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActive(slug), 150);
  };
  const handleMarkerOut = (slug: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setActive((prev) => (prev === slug ? null : prev));
  };

  // Auto-dismiss bottom info after 3s
  useEffect(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (active) {
      dismissTimer.current = setTimeout(() => setActive(null), 3000);
    }
    return () => { if (dismissTimer.current) clearTimeout(dismissTimer.current); };
  }, [active]);

  useEffect(() => {
    let cancelled = false;
    const loadLeaflet = () => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [33, 105],
        zoom: 4.5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
      });

      const key = "db316d7883d50adf407d700495555ab8";
      // Tianditu base + transparent labels
      L.tileLayer(
        "https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" + key,
        { subdomains: ["0","1","2","3","4","5","6","7"] },
      ).addTo(map);
      L.tileLayer(
        "https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" + key,
        { subdomains: ["0","1","2","3","4","5","6","7"] },
      ).addTo(map);

      map.setMinZoom(4.5);
      map.setMaxZoom(6);
      map.setMaxBounds(L.latLngBounds([5, 60], [55, 150]));

      cities.forEach((city: (typeof cities)[0]) => {
        const iconHtml =
          '<div style="position:relative;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center">' +
          '<div style="position:absolute;width:26px;height:26px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);animation:marker-pulse 3s ease-out infinite"></div>' +
          '<div style="position:absolute;width:26px;height:26px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);animation:marker-pulse 3s ease-out 1.5s infinite"></div>' +
          '<div style="width:10px;height:10px;background:#fff;border-radius:50%;box-shadow:0 0 16px rgba(255,255,255,0.8),0 0 6px rgba(255,220,180,0.6),0 0 30px rgba(255,255,255,0.3)"></div>' +
          '</div>';
        const icon = L.divIcon({
          className: "",
          html: iconHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);
        marker.on("click", () => {
          window.location.href = "/gallery/photos/" + city.slug;
        });
        marker.on("mouseover", () => handleMarkerOver(city.slug));
        marker.on("mouseout", () => handleMarkerOut(city.slug));
      });

      map.on("mousedown touchstart dragstart zoomstart", () => setHintVisible(false));

      // Dark filter only on tile layers, not markers
      const style = document.createElement("style");
      style.textContent = `
        .leaflet-tile-pane { filter: invert(85%) hue-rotate(180deg) brightness(0.85) contrast(1.1); }
        @keyframes marker-pulse { 0% { transform: scale(0.5); opacity: 0.4; } 50% { opacity: 0.15; } 100% { transform: scale(2.8); opacity: 0; } }
      `;
      document.head.appendChild(style);

      setLoaded(true);
      setTimeout(() => { try { map.invalidateSize(); } catch (_) {} }, 100);
      setTimeout(() => { try { map.invalidateSize(); } catch (_) {} }, 500);
    };

    loadLeaflet();
    return () => { cancelled = true; };
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
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-center"
                >
                  <p className="text-white/90 text-5xl md:text-6xl font-thin tracking-[0.12em] leading-tight"
                    style={{ fontFamily: '"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif' }}>
                    {cities.find((c) => c.slug === active)?.name}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <span className="h-px w-8 bg-white/15" />
                    <p className="text-white/65 text-sm tracking-[0.3em] uppercase font-normal">
                      {cities.find((c) => c.slug === active)?.en}
                    </p>
                    <span className="h-px w-8 bg-white/15" />
                  </div>
                </motion.div>
              </Link>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
