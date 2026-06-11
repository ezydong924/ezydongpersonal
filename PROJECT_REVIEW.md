# 影岑 Shadow — 项目审阅文档

> 生成日期：2026-06-11
> 此为自动生成的项目全景文档，供其他 agent 审阅使用。不影响项目运行。

---

## 1. 项目身份

| 项目 | 描述 |
|------|------|
| **名称** | 影岑 Shadow (`photo-site`) |
| **定位** | 个人摄影作品 + 旅行随笔网站 |
| **作者** | EZYDong |
| **域名** | 部署于 Cloudflare Pages + Vercel |
| **语言** | 中文为主，UI 部分中英混合 |
| **调性** | Apple 极简主义，暗色美学，画廊式呈现 |

---

## 2. 技术栈

| 层级 | 选型 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 16.2.6 |
| 语言 | TypeScript | ^5 |
| 样式 | Tailwind CSS | ^4 |
| 动画 | Framer Motion | ^11 |
| 3D/Shader | Three.js + React Three Fiber + Drei | ^0.170 / ^9.6 / ^10.7 |
| 背景特效 | @paper-design/shaders-react | ^0.0.76 |
| 地图 | Leaflet + react-leaflet (动态加载) | ^1.9.4 |
| 图标 | Lucide React | ^1.16 |
| 工具 | clsx + tailwind-merge, class-variance-authority | — |
| 音乐 | 自建 musicStore (全局状态) | — |
| 部署 | Cloudflare Pages (静态导出) + Vercel (GitHub 联动) | — |
| 构建 | `npm run build` (Next.js static export) | — |

---

## 3. URL 路由结构

```
/                                          → 首页 (Shader 背景 + 标题 "影岑 Shadow" + Explore 入口)
/explore                                   → 导航页 (摄影 / 想法 / 关于 三卡片)
/gallery                                   → 画廊入口 (影笺 / 溯影 二选一)
/gallery/photos                            → 摄影地图页 (Leaflet + 天地图，14 城市标记)
/gallery/photos/[city]                     → 城市散文页 (文学随笔 + AudioPlayer + 进入影笺按钮)
/gallery/photos/[city]/gallery             → 照片画廊 (Canvas 交互布局，拖拽/缩放/Lightbox)
/gallery/videos                            → 视频入口
/gallery/videos/[city]                     → 视频详情页
/thoughts                                  → 文章列表
/about                                     → 关于页
```

---

## 4. 目录结构（完整文件树）

```
ezydongpersonal-new/
├── package.json                    # 依赖和脚本
├── tsconfig.json                   # TS 配置 (paths: @/* → ./src/*)
├── next.config.ts                  # Next.js 配置 (基本为空)
├── postcss.config.mjs              # PostCSS
├── eslint.config.mjs               # ESLint
├── .gitignore                      # 忽略 node_modules, .next, out
├── README.md                       # 默认 Next.js README (未更新)
├── next-env.d.ts                   # Next.js 类型声明
│
├── public/                         # === 静态资源 ===
│   ├── *.svg                       # Next.js 默认 SVG 图标
│   ├── *.jpg                       # 城市首图（dalian, dali, chengdu 等）
│   ├── *.mp4                       # 视频文件
│   ├── leaflet.js / leaflet.css    # Leaflet 库 (本地副本)
│   ├── [city]/thumbs/              # 缩略图 (300×300, quality 75)
│   ├── [city]/lightbox/            # 大图 (1920×1920, quality 85)
│   └── music/[city]/               # 音乐 mp3 + 封面图
│
├── content/                        # === MDX 内容 ===
│   └── thoughts/
│       └── hello-world.mdx         # 示例文章
│
├── docs/                           # === 设计文档 ===
│   └── specs/
│       ├── 2026-05-25-photography-site-design.md
│       └── 2026-05-25-implementation-plan.md
│
├── out/                            # === Cloudflare Pages 构建输出 (gitignored) ===
│   └── (与 public/ 镜像结构)
│
└── src/                            # === 源代码 ===
    ├── app/
    │   ├── layout.tsx              # 根布局 (Inter + Playfair Display 字体)
    │   ├── globals.css             # 全局样式 (极光动画, glass 效果, 暗色主题)
    │   ├── page.tsx                # 首页 (Shader 背景 + 大标题)
    │   ├── explore/page.tsx        # 导航页 (三卡片: 摄影/想法/关于)
    │   ├── about/page.tsx          # 关于页
    │   ├── thoughts/page.tsx       # 文章列表
    │   └── gallery/
    │       ├── page.tsx            # 画廊入口 (影笺/溯影)
    │       ├── photos/
    │       │   ├── page.tsx        # 摄影地图页 (Leaflet 中国地图)
    │       │   ├── [city]/
    │       │   │   ├── page.tsx    # 城市散文页
    │       │   │   └── gallery/
    │       │   │       └── page.tsx  # 照片画廊
    │       │   └── ...             # 14 城市 (beijing, chengdu, chongqing, dalian, dali, diqing, hongkong, kunming, lijiang, rizhao, suzhou, weihai, xian, xishuangbanna)
    │       └── videos/
    │           ├── page.tsx
    │           └── [city]/page.tsx
    ├── components/
    │   ├── back-button.tsx         # 全局返回按钮
    │   ├── animated-text.tsx       # 逐字动画文本
    │   ├── entrance-text.tsx       # 逐字入场文本
    │   ├── flow-art.tsx            # /explore 导航页主体 (三卡片布局)
    │   ├── shader-background.tsx   # Shader 背景 (Paper Design)
    │   ├── aurora-background.tsx   # CSS 极光背景 (legacy)
    │   ├── three-shader-bg.tsx     # Three.js Shader 背景
    │   ├── gallery-bg.tsx          # 画廊背景
    │   ├── mosaic-bg.tsx           # 马赛克背景
    │   ├── grain-bg.tsx            # 噪点纹理背景
    │   ├── smoke-bg.tsx            # 烟雾背景
    │   ├── mesh-bg.tsx             # 网格背景
    │   ├── mountain-parallax-bg.tsx # 山脉视差背景
    │   ├── shader-animation-bg.tsx # Shader 动画背景
    │   ├── svg-text.tsx            # SVG 文本
    │   ├── cta-section.tsx         # CTA 区块
    │   ├── photo-grid.tsx          # 照片网格 (legacy)
    │   ├── lightbox.tsx            # 照片灯箱 (legacy)
    │   ├── nav-card.tsx            # 导航卡片 (legacy)
    │   ├── icons.tsx               # 图标
    │   ├── infinite-gallery.tsx    # 无限画廊
    │   ├── interactive-bento-gallery.tsx  # Bento 布局画廊
    │   ├── masonry-grid.tsx        # 瀑布流网格
    │   ├── horizontal-film-gallery.tsx    # 横向胶片画廊
    │   ├── vertical-image-stack.tsx       # 竖向图片堆叠
    │   └── ui/
    │       ├── button.tsx          # 通用按钮
    │       ├── floating.tsx        # 悬浮元素
    │       ├── wrap-shader.tsx     # Shader 包裹器
    │       ├── gradient-background.tsx     # 渐变背景
    │       ├── animated-gradient-bg.tsx    # 动画渐变背景
    │       ├── animated-container.tsx      # 动画容器
    │       ├── blue-meshy-background.tsx   # 蓝色网格背景
    │       ├── stars-background.tsx        # 星空背景
    │       ├── audio-player.tsx            # 音频播放器 UI
    │       ├── video-player.tsx            # 视频播放器 UI
    │       ├── scroll-expansion-hero.tsx   # 滚动展开 Hero
    │       ├── unicorn-studio-bg.tsx       # Unicorn Studio 背景
    │       └── background-paper-shaders.tsx # Paper Shaders 背景
    ├── hooks/
    │   └── use-mouse-position-ref.ts      # 鼠标位置追踪 Hook
    └── lib/
        ├── utils.ts               # cn() 类名合并工具
        ├── photos.ts              # 照片数据结构 (legacy, 示例数据)
        └── music-store.ts         # 全局音乐状态管理
```

---

## 5. 核心架构模式

### 5.1 双重页面结构（城市散文 + 城市画廊）

每个城市有两层页面：

**第一层：散文页** `/gallery/photos/[city]/page.tsx`
- 文学性城市随笔（中文散文体）
- 城市专属背景色 (`GradientBackground`)
- 底部 AudioPlayer 播放城市专属音乐
- "翻开影笺" 按钮链接到画廊

**第二层：画廊页** `/gallery/photos/[city]/gallery/page.tsx`
- Canvas 驱动的交互式照片布局
- 照片散落分布，支持拖拽平移、滚轮缩放
- 点击照片进入 Lightbox
- 左上角返回按钮回到散文页

### 5.2 照片画廊引擎（以 Hong Kong 为参考实现）

`/gallery/photos/hongkong/gallery/page.tsx` 是画廊系统的参考实现：

- **布局算法**: 用种子随机数生成照片位置（角度 + 半径），然后通过 N-body 碰撞检测迭代 140 轮优化布局，避免重叠
- **渲染**: 纯 DOM + requestAnimationFrame 驱动，每帧计算 `translate3d + scale + rotate`
- **交互**: 鼠标/触摸拖拽 + 滚轮缩放（以鼠标位置为中心缩放）
- **性能**: 拖拽时惯性滑动 (friction 0.92)，松手后缓动到边界 (ease 0.12)
- **Lightbox**: 全屏遮罩 + 大图居中 + ESC/点击退出
- **音乐控制**: 复用 `musicStore`，画廊页通过 `acquire()/release()` 控制跨页面音乐播放

### 5.3 音乐播放系统

`musicStore` (`src/lib/music-store.ts`) 是全局单例状态管理器：

- **跨页面持久化**: 用户从散文页进入画廊页，音乐不中断
- **兼容性**: 支持桌面 Chrome/Firefox 自动播放、WeChat (WeixinJSBridge)、Safari (用户手势唤醒)、Android X5 内核
- **淡入效果**: `requestAnimationFrame` 驱动的 3 秒淡入
- **自动切歌**: 播放列表循环
- **生命周期**: `acquire()/release()` 机制 — 画廊页释放后 1 秒自动暂停
- **UI 组件**: `AudioPlayer` 提供播放/暂停/上下曲/进度条/Mute

### 5.4 背景系统

项目有大量背景组件，按使用场景分层：

| 背景组件 | 使用页面 | 技术 |
|---------|---------|------|
| `shader-background.tsx` | 首页 `/` + 导航 `/explore` | @paper-design/shaders |
| `unicorn-studio-bg.tsx` | `/gallery` 画廊入口 | Unicorn Studio WebGL |
| `gradient-background.tsx` | 城市散文页 | CSS 渐变 (动态颜色) |
| `aurora-background.tsx` | Legacy 备用 | CSS 极光动画 |
| `stars-background.tsx` | 视频/特殊页 | CSS 星空 |
| `grain-bg.tsx` | 叠加层 | SVG 噪点纹理 |
| `mountain-parallax-bg.tsx` | 特殊页 | 多层山脉视差 |

所有背景组件都遵循：`fullscreen fixed + 低 z-index + 不可交互 (pointer-events-none)`

### 5.5 导航模式

- 所有子页面左上角有 `BackButton`，链接到父级页面
- 首页没有返回按钮，纯入口
- 导航路径: `/` → `/explore` → `/gallery` → `/gallery/photos` → `/gallery/photos/[city]` → `/gallery/photos/[city]/gallery`

---

## 6. 城市数据

当前已创建 14 个城市页面：

| 城市 | 英文 | 坐标 | 状态 |
|------|------|------|------|
| 香港 | Hong Kong | 22.32, 114.17 | ✅ 完整（散文 + 画廊 30 张 + 音乐） |
| 北京 | Beijing | 39.90, 116.41 | ✅ 散文 + 画廊 |
| 成都 | Chengdu | 30.57, 104.07 | ✅ 散文 + 画廊 + 视频 |
| 重庆 | Chongqing | 29.56, 106.55 | ✅ 散文 |
| 大连 | Dalian | 38.92, 121.63 | ✅ 散文 + 视频 |
| 大理 | Dali | 25.61, 100.27 | ✅ 散文 + 视频 |
| 迪庆州 | Diqing | 27.82, 99.70 | ✅ 散文 |
| 昆明 | Kunming | 25.04, 102.68 | ✅ 散文 |
| 丽江 | Lijiang | 26.86, 100.23 | ✅ 散文 |
| 日照 | Rizhao | 35.42, 119.53 | ✅ 散文 + 画廊 |
| 苏州 | Suzhou | 31.30, 120.63 | ✅ 散文 + 画廊 |
| 威海 | Weihai | 37.51, 122.12 | ✅ 散文 |
| 西安 | Xi'an | 34.34, 108.94 | ✅ 散文 |
| 西双版纳 | Xishuangbanna | 22.01, 100.80 | ✅ 散文 + 画廊 |

各城市完成度不同：部分有完整画廊和音乐，部分仅有散文页。画廊系统以 **香港** 为最完整实现。

---

## 7. 数据与状态管理

### 7.1 全局状态

- **musicStore** (`src/lib/music-store.ts`): 唯一的全局状态。模块级单例，无 React context。通过 `subscribe()` 模式通知 UI 更新。

### 7.2 照片数据

- 照片文件名硬编码在各画廊页的 `PHOTOS` 数组中
- 无数据库，无 CMS
- 缩略图和大图分别在 `/public/[city]/thumbs/` 和 `/public/[city]/lightbox/`
- 图片压缩用 Python Pillow（内存中的约定）

### 7.3 文章内容

- MDX 格式存放在 `/content/thoughts/`
- 当前仅有示例 `hello-world.mdx`

---

## 8. 部署流程

### 部署命令

用户在 Windows PowerShell 中运行：

```
D:\A.网页开发\ezydongpersonal-new\ .\deploy.ps1
```

### deploy.ps1 流程

1. 备份 `next.config.ts`
2. 注入 `output: "export"` 配置
3. 执行 `npm run build` (Next.js 静态导出到 `/out`)
4. 通过 `npx wrangler pages deploy out --branch main --commit-dirty=true` 部署到 Cloudflare Pages
5. `git commit && git push` → 触发 Vercel 自动部署
6. 恢复原始 `next.config.ts`

### 重要说明

- **不要在 sandbox 中尝试部署**：sandbox 的 git 索引持续损坏，Vercel CLI 和 GitHub 认证不可用
- 部署始终在用户本地 Windows 机器上执行
- Cloudflare Pages 和 Vercel 双重部署，Cloudflare 用于静态托管，Vercel 用于 SSR 能力

---

## 9. 样式约定

### 设计原则

- **暗色主题**: `background: #0a0a0a` 为基底
- **毛玻璃**: `.glass-card` / `.glass-effect` 类使用 `backdrop-filter: blur()` + 半透明边框
- **字体**: Inter (UI) + Playfair Display (标题/装饰) + PingFang SC (中文)
- **颜色**: 白色系为主，透明度分 5 级 (0.05 / 0.15 / 0.35 / 0.55 / 0.70 / 0.90)
- **圆角**: `rounded-3xl` (1.5rem) 或 `rounded-[2rem]` 为主
- **间距**: 大留白，`p-10 md:p-14` 起步
- **动画**: Framer Motion，duration 0.5-0.8s，ease-out 为主

### 关键 CSS 类

- `.glass-effect`: 通用毛玻璃
- `.glass-card`: 增强毛玻璃卡片（带顶部高光线和阴影）
- `.page-enter`: 页面淡入动画
- `.scroll-hint`: 滚动提示脉冲动画
- `reduced-motion` 适配已处理

---

## 10. 潜在问题与注意事项

### 已知问题

1. **layout.tsx 中 Inter 字体被同时设为变量和 className**：`${inter.className}` 覆盖了 Tailwind 的默认字体栈，Playfair 仅作为 CSS 变量可用
2. **`photos.ts` 是 legacy 代码**：包含示例数据（`/photos/nature/sample-1.jpg`），实际照片系统走各城市 `/public/[city]/thumbs/` + 硬编码文件名
3. **README.md 未更新**：仍为 `create-next-app` 默认模板
4. **Leaflet 本地副本**：`leaflet.js` 和 `leaflet.css` 放在 `/public/` 根目录，与其他资源平级
5. **苏州画廊仅有 .gitkeep**：`/gallery/photos/suzhou/gallery/` 有 `.gitkeep` 但缺少真正的画廊实现

### 扩展新城市 checklist

1. 在 `/public/[city]/thumbs/` 和 `/public/[city]/lightbox/` 放入图片
2. 创建 `/src/app/gallery/photos/[city]/page.tsx` (散文页)
3. (可选) 创建 `/src/app/gallery/photos/[city]/gallery/page.tsx` (画廊页)
4. 在 `/src/app/gallery/photos/page.tsx` 的 `cities` 数组中添加城市坐标
5. 如有音乐，放入 `/public/music/[city]/`
6. 如有视频，创建 `/src/app/gallery/videos/[city]/page.tsx`

---

## 11. 关键文件速查

| 需要修改什么 | 去哪个文件 |
|-------------|-----------|
| 全局布局/字体 | `src/app/layout.tsx` |
| 全局样式/CSS 动画 | `src/app/globals.css` |
| 首页 | `src/app/page.tsx` |
| 导航页结构 | `src/components/flow-art.tsx` |
| 城市地图/标记 | `src/app/gallery/photos/page.tsx` |
| 城市散文 | `src/app/gallery/photos/[city]/page.tsx` |
| 城市画廊 (参考) | `src/app/gallery/photos/hongkong/gallery/page.tsx` |
| 音乐系统 | `src/lib/music-store.ts` |
| 音频播放器 UI | `src/components/ui/audio-player.tsx` |
| 背景系统 | `src/components/shader-background.tsx` 等 |
| 部署脚本 | `deploy.ps1` (项目根目录) |
| 设计文档 | `docs/specs/` |
