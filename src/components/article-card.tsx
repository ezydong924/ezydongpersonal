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
