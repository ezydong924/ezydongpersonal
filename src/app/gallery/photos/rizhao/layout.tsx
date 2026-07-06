import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日照",
  description: "日照这个名字，就很容易把它想象成一座被阳光铺满的海边城市。可真正接近它的时候，最先看到的不是沙滩与海浪，是飞机舷窗外一段弯下去的海岸线。蓝色贴着陆地，公路沿着山和海绕出去，城市…",
  openGraph: {
    title: "日照",
    description: "日照这个名字，就很容易把它想象成一座被阳光铺满的海边城市。可真正接近它的时候，最先看到的不是沙滩与海浪，是飞机舷窗外一段弯下去的海岸线。蓝色贴着陆地，公路沿着山和海绕出去，城市…",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
