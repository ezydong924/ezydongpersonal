import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "香港",
  description: "杜可风把香港拍成了一种颜色。不是植物的绿，是霓虹灯管穿过潮湿的那种。暧昧、懒散，像泡在福尔马林里的梦。很长一段时间里，我沉浸于福尔马林的梦。",
  openGraph: {
    title: "香港",
    description: "杜可风把香港拍成了一种颜色。不是植物的绿，是霓虹灯管穿过潮湿的那种。暧昧、懒散，像泡在福尔马林里的梦。很长一段时间里，我沉浸于福尔马林的梦。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
