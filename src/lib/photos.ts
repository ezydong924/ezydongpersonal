export interface Photo {
  src: string;
  alt: string;
  series: string;
  width: number;
  height: number;
}

export const photos: Photo[] = [
  {
    src: "/photos/nature/sample-1.jpg",
    alt: "示例自然照片",
    series: "自然",
    width: 800,
    height: 600,
  },
  {
    src: "/photos/urban/sample-2.jpg",
    alt: "示例城市照片",
    series: "城市",
    width: 600,
    height: 800,
  },
  {
    src: "/photos/portrait/sample-3.jpg",
    alt: "示例人像照片",
    series: "人像",
    width: 800,
    height: 800,
  },
];

export function getSeries(): string[] {
  return [...new Set(photos.map((p) => p.series))];
}

export function getPhotosBySeries(series: string): Photo[] {
  return photos.filter((p) => p.series === series);
}
