/** Single source of truth for all cities.
 *  Add a city here and it appears on the map and in the sitemap.
 */
export interface City {
  name: string;
  en: string;
  lat: number;
  lng: number;
  slug: string;
  /** Small visual correction for a city anchor rendered by the map provider. */
  markerOffset?: { x: number; y: number };
  /** Has a /gallery/photos/[slug]/gallery photo gallery page */
  hasGallery?: boolean;
  /** Has a /gallery/videos/[slug] video page */
  hasVideo?: boolean;
}

export const cities: City[] = [
  { name: "大连", en: "Dalian", lat: 38.914, lng: 121.615, slug: "dalian", hasVideo: true },
  { name: "成都", en: "Chengdu", lat: 30.573, lng: 104.067, slug: "chengdu", hasGallery: true, hasVideo: true },
  { name: "大理", en: "Dali", lat: 25.606, lng: 100.268, slug: "dali", hasVideo: true },
  { name: "昆明", en: "Kunming", lat: 25.041, lng: 102.712, slug: "kunming", markerOffset: { x: 4, y: 8 } },
  { name: "香港", en: "Hong Kong", lat: 22.319, lng: 114.169, slug: "hongkong", hasGallery: true },
  { name: "威海", en: "Weihai", lat: 37.513, lng: 122.121, slug: "weihai", hasGallery: true },
  { name: "苏州", en: "Suzhou", lat: 31.299, lng: 120.585, slug: "suzhou", hasGallery: true },
  { name: "北京", en: "Beijing", lat: 39.904, lng: 116.407, slug: "beijing", hasGallery: true },
  { name: "日照", en: "Rizhao", lat: 35.416, lng: 119.527, slug: "rizhao", hasGallery: true },
  { name: "重庆", en: "Chongqing", lat: 29.563, lng: 106.552, slug: "chongqing" },
  { name: "丽江", en: "Lijiang", lat: 26.872, lng: 100.230, slug: "lijiang" },
  { name: "西双版纳", en: "Xishuangbanna", lat: 22.007, lng: 100.797, slug: "xishuangbanna", hasGallery: true },
  { name: "西安", en: "Xi'an", lat: 34.342, lng: 108.940, slug: "xian", hasGallery: true },
  { name: "迪庆州", en: "Diqing", lat: 27.830, lng: 99.706, slug: "diqing" },
];
