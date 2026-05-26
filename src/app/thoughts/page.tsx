import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/article-card";
import BackButton from "@/components/back-button";

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
