# 实施计划：个人摄影作品 & 想法网站

## 文件结构

```
D:\A.网页开发\个人网页前端设置/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── public/
│   └── photos/                    # 摄影作品 (用户自行添加)
│       ├── nature/
│       ├── urban/
│       └── portrait/
├── content/
│   └── thoughts/                  # MDX 文章 (用户自行添加)
│       └── hello-world.mdx
├── src/
│   ├── app/
│   │   ├── layout.tsx             # 根布局 (极光背景 + 全局样式)
│   │   ├── globals.css            # 全局样式 (极光动画、暗色主题)
│   │   ├── page.tsx               # 首页
│   │   ├── gallery/
│   │   │   └── page.tsx           # 摄影作品集
│   │   ├── thoughts/
│   │   │   ├── page.tsx           # 文章列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # 文章详情
│   │   └── about/
│   │       └── page.tsx           # 关于我
│   ├── components/
│   │   ├── aurora-background.tsx   # 极光背景
│   │   ├── nav-card.tsx           # 导航卡片
│   │   ├── photo-grid.tsx         # 照片网格
│   │   ├── lightbox.tsx           # 照片灯箱
│   │   ├── back-button.tsx        # 返回按钮
│   │   └── article-card.tsx       # 文章卡片
│   └── lib/
│       ├── photos.ts              # 照片数据获取
│       └── posts.ts               # MDX 文章解析
```

---

## 任务列表

### 任务 1：初始化 Next.js 项目

在 `D:\A.网页开发\个人网页前端设置/` 下执行：

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

安装额外依赖：

```bash
npm install next-mdx-remote lucide-react
npm install -D @types/node
```

初始化 shadcn/ui：

```bash
npx shadcn@latest init
# 选择: Default style, Neutral base color, CSS variables: yes
```

**验证**: `npm run dev` 启动后访问 localhost:3000 看到 Next.js 默认页面。

---

### 任务 2：配置全局样式与极光动画

**文件**: `src/app/globals.css`

完整替换为：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 6%;
    --card-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --muted: 0 0% 8%;
    --muted-foreground: 0 0% 63.9%;
    --radius: 0.75rem;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
  }
}

/* 极光背景动画 */
@keyframes aurora-1 {
  0%, 100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
  25% { transform: translate(30%, -20%) rotate(5deg) scale(1.05); }
  50% { transform: translate(-10%, -30%) rotate(-3deg) scale(0.95); }
  75% { transform: translate(-20%, 10%) rotate(2deg) scale(1.02); }
}

@keyframes aurora-2 {
  0%, 100% { transform: translate(0%, 0%) rotate(0deg) scale(1.1); }
  33% { transform: translate(-25%, -15%) rotate(-4deg) scale(0.9); }
  66% { transform: translate(20%, 25%) rotate(3deg) scale(1.05); }
}

@keyframes aurora-3 {
  0%, 100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
  50% { transform: translate(15%, -25%) rotate(-2deg) scale(1.08); }
}

.aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.3;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.aurora-blob-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent);
  animation: aurora-1 20s infinite;
  top: -20%;
  left: -10%;
}

.aurora-blob-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.35), transparent);
  animation: aurora-2 25s infinite;
  top: 30%;
  right: -15%;
}

.aurora-blob-3 {
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.3), transparent);
  animation: aurora-3 22s infinite;
  bottom: -25%;
  left: 20%;
}

/* 页面过渡 */
.page-enter {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**验证**: 页面背景为黑色，文字白色。

---

### 任务 3：创建极光背景组件

**文件**: `src/components/aurora-background.tsx`

```tsx
export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      {/* 叠加微妙的噪点纹理，增加质感 */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
```

**验证**: 组件渲染三个模糊渐变圆形，缓慢移动。

---

### 任务 4：创建根布局

**文件**: `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";
import AuroraBackground from "@/components/aurora-background";

export const metadata: Metadata = {
  title: "我的摄影画廊",
  description: "摄影作品与想法",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen">
        <AuroraBackground />
        <main className="relative z-10 page-enter">{children}</main>
      </body>
    </html>
  );
}
```

**验证**: `npm run dev` 看到极光背景。

---

### 任务 5：创建导航卡片组件

**文件**: `src/components/nav-card.tsx`

```tsx
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function NavCard({ title, description, href, icon: Icon }: NavCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-[1.02] hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.15)]"
    >
      <Icon className="w-10 h-10 mb-4 text-white/50 transition-all duration-500 group-hover:text-white/90 group-hover:scale-110" />
      <h2 className="text-xl font-medium tracking-wide text-white/80 group-hover:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-white/40 group-hover:text-white/60 transition-colors duration-500">
        {description}
      </p>
    </Link>
  );
}
```

**验证**: 组件渲染为带图标、标题、描述的可点击卡片。

---

### 任务 6：创建首页

**文件**: `src/app/page.tsx`

```tsx
import NavCard from "@/components/nav-card";
import { Camera, Pencil, User } from "lucide-react";

const cards = [
  {
    title: "摄影",
    description: "用镜头捕捉光影",
    href: "/gallery",
    icon: Camera,
  },
  {
    title: "想法",
    description: "文字与思考",
    href: "/thoughts",
    icon: Pencil,
  },
  {
    title: "关于",
    description: "我是谁",
    href: "/about",
    icon: User,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {/* 标题区 */}
      <div className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-light tracking-wider text-white/90">
          我的画廊
        </h1>
        <p className="mt-4 text-lg text-white/40 font-light tracking-wide">
          光影之间，记录所见与所想
        </p>
      </div>

      {/* 导航卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {cards.map((card) => (
          <NavCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
```

**验证**: 首页显示极光背景 + 居中标题 + 三个导航卡片，点击可跳转（目前 404，后续任务实现）。

---

### 任务 7：创建照片数据工具

**文件**: `src/lib/photos.ts`

```ts
export interface Photo {
  src: string;
  alt: string;
  series: string;
  width: number;
  height: number;
}

// 用户在此数组中添加照片信息
// 实际照片文件放入 public/photos/ 对应目录
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
```

**验证**: 导入后调用 `getSeries()` 返回 `["自然", "城市", "人像"]`。

---

### 任务 8：创建照片网格组件

**文件**: `src/components/photo-grid.tsx`

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/photos";
import Lightbox from "@/components/lightbox";

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/30 text-lg">
        暂无照片，请将照片放入 public/photos/ 目录
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden"
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
```

**验证**: 照片瀑布流排列，hover 放大，点击打开灯箱。

---

### 任务 9：创建灯箱组件

**文件**: `src/components/lightbox.tsx`

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/lib/photos";

interface LightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  const photo = photos[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* 上一张 */}
      <button
        onClick={goPrev}
        className="absolute left-4 p-2 text-white/60 hover:text-white transition-colors z-10"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* 照片 */}
      <div className="relative max-w-[90vw] max-h-[85vh]">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
          sizes="90vw"
          priority
        />
        <p className="text-center text-white/50 text-sm mt-4">
          {photo.alt} — {photo.series} · {index + 1} / {photos.length}
        </p>
      </div>

      {/* 下一张 */}
      <button
        onClick={goNext}
        className="absolute right-4 p-2 text-white/60 hover:text-white transition-colors z-10"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}
```

**验证**: 点击照片打开全屏灯箱，键盘 ←→ 切换，Esc 关闭。

---

### 任务 10：创建摄影作品集页面

**文件**: `src/app/gallery/page.tsx`

```tsx
import { photos, getSeries } from "@/lib/photos";
import PhotoGrid from "@/components/photo-grid";
import BackButton from "@/components/back-button";

export default function GalleryPage() {
  const series = getSeries();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <BackButton href="/" label="首页" />

      <h1 className="text-4xl font-light tracking-wide text-white/90 mt-8 mb-4">
        摄影
      </h1>
      <p className="text-white/40 mb-16 text-lg font-light">
        用镜头捕捉光影
      </p>

      {series.length === 0 ? (
        <PhotoGrid photos={photos} />
      ) : (
        series.map((s) => (
          <section key={s} className="mb-20">
            <h2 className="text-2xl font-light text-white/70 mb-8 tracking-wide">
              {s}
            </h2>
            <PhotoGrid photos={photos.filter((p) => p.series === s)} />
          </section>
        ))
      )}
    </div>
  );
}
```

**验证**: `/gallery` 按系列分组展示照片，有返回首页按钮。

---

### 任务 11：创建返回按钮组件

**文件**: `src/components/back-button.tsx`

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label: string;
}

export default function BackButton({ href, label }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  );
}
```

**验证**: 返回箭头链接，hover 变亮。

---

### 任务 12：创建 MDX 文章解析工具

**文件**: `src/lib/posts.ts`

```ts
import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";

const postsDir = path.join(process.cwd(), "content", "thoughts");

export interface PostMeta {
  title: string;
  date: string;
  summary: string;
  slug: string;
}

export async function getAllPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const { frontmatter } = await compileMDX<{
        title: string;
        date: string;
        summary: string;
      }>({
        source: raw,
        options: { parseFrontmatter: true },
      });
      return {
        ...frontmatter,
        slug: file.replace(".mdx", ""),
      };
    })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPost(slug: string): Promise<{
  content: React.ReactElement;
  frontmatter: { title: string; date: string; summary: string };
} | null> {
  const filePath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, frontmatter } = await compileMDX<{
    title: string;
    date: string;
    summary: string;
  }>({
    source: raw,
    options: { parseFrontmatter: true },
  });

  return { content, frontmatter };
}
```

**验证**: 有 `.mdx` 文件时 `getAllPosts()` 返回排序后的文章列表。

---

### 任务 13：创建文章卡片组件

**文件**: `src/components/article-card.tsx`

```tsx
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function ArticleCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/thoughts/${post.slug}`}
      className="block group py-6 border-b border-white/[0.06] transition-all"
    >
      <time className="text-sm text-white/30 font-light">
        {new Date(post.date).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <h2 className="text-xl font-medium text-white/80 mt-2 group-hover:text-white transition-colors">
        {post.title}
      </h2>
      <p className="text-white/40 mt-2 text-sm leading-relaxed line-clamp-2">
        {post.summary}
      </p>
    </Link>
  );
}
```

**验证**: 文章卡片显示日期、标题、摘要，hover 标题变亮。

---

### 任务 14：创建文章列表页面

**文件**: `src/app/thoughts/page.tsx`

```tsx
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/article-card";
import BackButton from "@/components/back-button";

export const dynamic = "force-static";

export default async function ThoughtsPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <BackButton href="/" label="首页" />

      <h1 className="text-4xl font-light tracking-wide text-white/90 mt-8 mb-4">
        想法
      </h1>
      <p className="text-white/40 mb-16 text-lg font-light">
        文字与思考
      </p>

      {posts.length === 0 ? (
        <p className="text-white/30 text-center py-20 text-lg">
          还没有文章，在 content/thoughts/ 下创建 .mdx 文件开始写作
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**验证**: `/thoughts` 显示文章列表或空状态提示。

---

### 任务 15：创建文章详情页面

**文件**: `src/app/thoughts/[slug]/page.tsx`

```tsx
import { getPost, getAllPosts } from "@/lib/posts";
import BackButton from "@/components/back-button";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <BackButton href="/thoughts" label="所有文章" />

      <article className="mt-8">
        <header className="mb-12">
          <time className="text-sm text-white/30 font-light">
            {new Date(post.frontmatter.date).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="text-3xl sm:text-4xl font-light text-white/90 mt-3 tracking-wide">
            {post.frontmatter.title}
          </h1>
        </header>

        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white/80 prose-headings:font-light
          prose-p:text-white/60 prose-p:leading-relaxed
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
          prose-strong:text-white/80
          prose-img:rounded-xl prose-img:shadow-2xl
          prose-blockquote:border-l-blue-500 prose-blockquote:text-white/50
          prose-code:text-white/70 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        ">
          {post.content}
        </div>
      </article>
    </div>
  );
}
```

**验证**: `/thoughts/hello-world` 渲染 MDX 文章内容。

---

### 任务 16：创建关于我页面

**文件**: `src/app/about/page.tsx`

```tsx
import BackButton from "@/components/back-button";
import { Camera, MapPin, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <BackButton href="/" label="首页" />

      <div className="mt-12">
        {/* 头像占位 */}
        <div className="w-24 h-24 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-8">
          <Camera className="w-10 h-10 text-white/30" />
        </div>

        <h1 className="text-4xl font-light tracking-wide text-white/90">
          关于我
        </h1>

        <div className="mt-10 space-y-6 text-white/60 leading-relaxed text-lg font-light">
          <p>
            我是一名摄影爱好者，热衷于用镜头捕捉生活中的光影瞬间。
            这个网站是我的个人画廊，用来存放我的摄影作品和零散的想法。
          </p>
          <p>
            我相信每一张照片背后都有一个故事，每一次按下快门都是一次与世界的对话。
          </p>
        </div>

        {/* 联系信息 */}
        <div className="mt-16 space-y-4">
          <div className="flex items-center gap-3 text-white/40">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">中国</span>
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <Mail className="w-4 h-4" />
            <span className="text-sm">your-email@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**验证**: `/about` 显示个人介绍和联系信息。

---

### 任务 17：创建示例文章

**文件**: `content/thoughts/hello-world.mdx`

```mdx
---
title: 你好，世界
date: 2026-05-25
summary: 这是我的第一篇想法，记录了这个网站的开始。
---

## 开始

这个网站今天诞生了。

一直想要一个属于自己的空间，一个可以安静展示照片、记录想法的地方。不需要花哨的功能，只需要光影和文字能好好待着。

## 为什么是极简

我喜欢 Apple 的设计哲学——删掉一切不必要的，留白本身就是一种表达。

少即是多。

## 关于摄影

摄影对我来说不只是按下快门。它是在混乱中找到秩序，在平凡中发现不平凡。

> 你拍的不是你看到的，而是你感受到的。

希望在这里，每一张照片都能找到它的观众。
```

**验证**: `/thoughts/hello-world` 能正常渲染这篇示例文章。

---

### 任务 18：创建示例照片占位

在 `public/photos/` 下建立目录结构并添加占位说明：

```bash
mkdir -p public/photos/nature public/photos/urban public/photos/portrait
```

创建 `public/photos/README.md`：

```markdown
# 摄影作品

在此目录下按系列存放照片：

- `nature/` — 自然风光
- `urban/` — 城市建筑
- `portrait/` — 人像

然后将照片信息添加到 `src/lib/photos.ts` 的 `photos` 数组中。
```

**验证**: 目录结构存在。

---

### 任务 19：最终验证与启动

```bash
cd D:\A.网页开发\个人网页前端设置
npm run build
```

确认构建无错误。检查：
- 首页：极光背景 + 三个导航卡片
- 点击"摄影"进入 `/gallery`
- 点击"想法"进入 `/thoughts`
- 点击"关于"进入 `/about`
- `/thoughts/hello-world` 渲染 MDX

```bash
npm run dev
```

本地预览所有页面。

---

### 任务 20：部署到 Vercel（用户可选）

使用 deploy-to-vercel skill 或手动：

1. 在 GitHub 创建仓库，推送代码
2. 在 vercel.com 导入仓库
3. Vercel 自动检测 Next.js 项目并部署
4. 获得 `.vercel.app` 域名

---

## 用户后续自行操作

搭建完成后，更新内容只需：

1. **传照片**：放入 `public/photos/` 对应子目录，在 `src/lib/photos.ts` 添加记录
2. **写文章**：在 `content/thoughts/` 下新建 `.mdx` 文件，格式参考 `hello-world.mdx`
3. **修改个人信息**：编辑 `src/app/about/page.tsx`
4. **修改网站标题**：编辑 `src/app/layout.tsx` 中的 `metadata`
