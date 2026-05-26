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
