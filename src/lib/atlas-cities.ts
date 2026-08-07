export type AtlasCity = {
  slug: string;
  name: string;
  en: string;
  x: number;
  y: number;
  frames?: number;
  image?: string;
  orbitImages?: string[];
  poster?: string;
  zinePoster: string;
  note: string;
};

export const atlasCities: AtlasCity[] = [
  { slug: "diqing", name: "迪庆州", en: "DIQING", x: 14, y: 35, zinePoster: "/assets/atlas/posters/diqing-zine-v2.webp", note: "高处的光，还在整理" },
  { slug: "lijiang", name: "丽江", en: "LIJIANG", x: 24, y: 47, zinePoster: "/assets/atlas/posters/lijiang-zine-v2.webp", note: "一段尚未成册的停留" },
  { slug: "xishuangbanna", name: "西双版纳", en: "XISHUANGBANNA", x: 18, y: 74, frames: 9, image: "/xishuangbanna/lightbox/IMG_20260127_182934.jpg", orbitImages: ["/xishuangbanna/lightbox/IMG20260127194945.jpg", "/xishuangbanna/lightbox/IMG20260127200856.jpg", "/xishuangbanna/lightbox/IMG20260128141217.jpg"], poster: "/assets/atlas/posters/xishuangbanna-memory-v2.png", zinePoster: "/assets/atlas/posters/xishuangbanna-zine-v2.webp", note: "潮湿、绿色，以及夜里亮着的边缘" },
  { slug: "dali", name: "大理", en: "DALI", x: 31, y: 63, image: "/dali-cover.jpg", zinePoster: "/assets/atlas/posters/dali-zine-v2.webp", note: "风从画面外面经过" },
  { slug: "kunming", name: "昆明", en: "KUNMING", x: 36, y: 79, zinePoster: "/assets/atlas/posters/kunming-zine-v2.webp", note: "还没有决定从哪一张开始" },
  { slug: "chengdu", name: "成都", en: "CHENGDU", x: 43, y: 43, frames: 11, image: "/chengdu/thumbs/DSC_2442-已增强-降噪.jpg", orbitImages: ["/chengdu/lightbox/DSC_2482.jpg", "/chengdu/lightbox/DSC_2510-已增强-降噪.jpg", "/chengdu/lightbox/DSC_2536.jpg"], poster: "/assets/atlas/posters/chengdu-memory-v2.png", zinePoster: "/assets/atlas/posters/chengdu-zine-v2.webp", note: "方寸之间，光线绕过人群" },
  { slug: "chongqing", name: "重庆", en: "CHONGQING", x: 50, y: 58, zinePoster: "/assets/atlas/posters/chongqing-zine-v2.webp", note: "坡道、雾气和没剪完的夜" },
  { slug: "xian", name: "西安", en: "XI'AN", x: 57, y: 27, frames: 5, image: "/xian/lightbox/butter_1724897380024.jpg", orbitImages: ["/xian/lightbox/IMG_20260706_155244.jpg", "/xian/lightbox/IMG_20260706_155318.jpg", "/xian/lightbox/IMG_20260706_155336.jpg"], poster: "/assets/atlas/posters/xian-memory-v2.png", zinePoster: "/assets/atlas/posters/xian-zine-v2.webp", note: "灰砖、屋檐，以及过分干净的蓝天" },
  { slug: "beijing", name: "北京", en: "BEIJING", x: 76, y: 14, frames: 16, image: "/beijing/thumbs/IMG_20260503_141244.jpg", orbitImages: ["/beijing/lightbox/IMG_20260503_141934.jpg", "/beijing/lightbox/IMG_20260503_142002.jpg", "/beijing/lightbox/IMG_20260504_220605.jpg"], poster: "/assets/atlas/posters/beijing-memory-v2.png", zinePoster: "/assets/atlas/posters/beijing-zine-v2.webp", note: "城市很大，留下来的只是几个切面" },
  { slug: "rizhao", name: "日照", en: "RIZHAO", x: 79, y: 37, frames: 14, image: "/rizhao/lightbox/000000290021.jpg", orbitImages: ["/rizhao/lightbox/IMG_20250501_193352.jpg", "/rizhao/lightbox/IMG_20250503_180537.jpg", "/rizhao/lightbox/IMG_20250504_164155.jpg"], poster: "/assets/atlas/posters/rizhao-memory-v2.png", zinePoster: "/assets/atlas/posters/rizhao-zine-v2.webp", note: "海岸线从舷窗下面慢慢弯过去" },
  { slug: "suzhou", name: "苏州", en: "SUZHOU", x: 72, y: 58, frames: 21, image: "/suzhou/lightbox/IMG_20250404_182545.jpg", orbitImages: ["/suzhou/lightbox/IMG20250404093514.jpg", "/suzhou/lightbox/IMG20250404194917.jpg", "/suzhou/lightbox/IMG20250404210021.jpg"], poster: "/assets/atlas/posters/suzhou-memory-v2.png", zinePoster: "/assets/atlas/posters/suzhou-zine-v2.webp", note: "水巷之外，也有不那么整齐的生活" },
  { slug: "hongkong", name: "香港", en: "HONG KONG", x: 80, y: 78, frames: 25, image: "/hongkong/thumbs/IMG_20260111_112611.jpg", orbitImages: ["/hongkong/lightbox/IMG20260111112856.jpg", "/hongkong/lightbox/IMG20260111134641.jpg", "/hongkong/lightbox/IMG20260111142441.jpg"], poster: "/assets/atlas/posters/hongkong-memory-v3.png", zinePoster: "/assets/atlas/posters/hongkong-zine-v2.webp", note: "潮湿的光，把夜晚泡成另一种颜色" },
  { slug: "weihai", name: "威海", en: "WEIHAI", x: 91, y: 31, frames: 24, image: "/weihai/lightbox/DSC_1701.JPG", orbitImages: ["/weihai/lightbox/IMG20241002065810.jpg", "/weihai/lightbox/IMG20241002084619.jpg", "/weihai/lightbox/IMG20241002084827.jpg"], poster: "/assets/atlas/posters/weihai-memory-v2.png", zinePoster: "/assets/atlas/posters/weihai-zine-v2.webp", note: "一次靠岸，和海上没有说完的话" },
  { slug: "dalian", name: "大连", en: "DALIAN", x: 89, y: 9, image: "/dalian.jpg", zinePoster: "/assets/atlas/posters/dalian-zine-v2.webp", note: "风很亮，海把城市推得更远" },
];

export const atlasLinks = [
  ["diqing", "lijiang"], ["diqing", "xian"], ["lijiang", "dali"], ["lijiang", "chengdu"],
  ["xishuangbanna", "dali"], ["xishuangbanna", "kunming"], ["dali", "chengdu"], ["chengdu", "chongqing"],
  ["chengdu", "xian"], ["xian", "beijing"], ["xian", "rizhao"], ["beijing", "dalian"],
  ["beijing", "weihai"], ["rizhao", "weihai"], ["rizhao", "suzhou"], ["suzhou", "hongkong"],
] as const;

export const atlasDevelopedCount = atlasCities.filter((city) => city.frames).length;
