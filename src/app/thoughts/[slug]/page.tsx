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
          prose-a:text-blue-400 prose-a:no-underline
          prose-strong:text-white/80
          prose-img:rounded-xl
          prose-blockquote:border-l-blue-500 prose-blockquote:text-white/50
          prose-code:text-white/70 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        ">
          {post.content}
        </div>
      </article>
    </div>
  );
}
