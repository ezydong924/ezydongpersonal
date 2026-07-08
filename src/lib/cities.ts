/** Single source of truth for all cities.
 *  Add a city here and it appears on the map and in the sitemap.
 */
export interface City {
  name: string;
  en: string;
  lat: number;
  lng: number;
  slug: string;
  /** Has a /gallery/photos/[slug]/gallery photo gallery page */
  hasGallery?: boolean;
  /** Has a /gallery/videos/[slug] video page */
  hasVideo?: boolean;
}

export const cities: City[] = [
  { name: "大连", en: "Dalian", lat: 38.92, lng: 121.63, slug: "dalian", hasVideo: true },
  { name: "成都", en: "Chengdu", lat: 30.57, lng: 104.07, slug: "chengdu", hasGallery: true, hasVideo: true },
  { name: "大理", en: "Dali", lat: 25.61, lng: 100.27, slug: "dali", hasVideo: true },
  { name: "昆明", en: "Kunming", lat: 25.04, lng: 102.68, slug: "kunming" },
  { name: "香港", en: "Hong Kong", lat: 22.32, lng: 114.17, slug: "hongkong", hasGallery: true },
  { name: "威海", en: "Weihai", lat: 37.51, lng: 122.12, slug: "weihai", hasGallery: true },
  { name: "苏州", en: "Suzhou", lat: 31.30, lng: 120.63, slug: "suzhou", hasGallery: true },
  { name: "北京", en: "Beijing", lat: 39.90, lng: 116.41, slug: "beijing", hasGallery: true },
  { name: "日照", en: "Rizhao", lat: 35.42, lng: 119.53, slug: "rizhao", hasGallery: true },
  { name: "重庆", en: "Chongqing", lat: 29.56, lng: 106.55, slug: "chongqing" },
  { name: "丽江", en: "Lijiang", lat: 26.86, lng: 100.23, slug: "lijiang" },
  { name: "西双版纳", en: "Xishuangbanna", lat: 22.01, lng: 100.80, slug: "xishuangbanna", hasGallery: true },
  { name: "西安", en: "Xi'an", lat: 34.34, lng: 108.94, slug: "xian", hasGallery: true },
  { name: "迪庆州", en: "Diqing", lat: 27.82, lng: 99.70, slug: "diqing" },
];
