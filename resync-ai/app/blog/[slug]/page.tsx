import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pill } from "@/components/content/ContentKit";
import { NewsletterForm } from "@/components/content/NewsletterForm";
import { BLOG_POSTS, getPost } from "@/lib/content/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Post not found — Resync AI" };
  return { title: `${post.title} — Resync AI`, description: post.excerpt };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/blog" className="text-sm text-cyan-400 hover:text-cyan-300">
        ← All posts
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <Pill key={t} tone="cyan">
            {t}
          </Pill>
        ))}
      </div>

      <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white">{post.title}</h1>

      <div className="mt-5 flex items-center gap-3 text-sm text-zinc-500">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 text-xs font-bold text-white">
          {post.author.slice(0, 1)}
        </span>
        <span className="text-zinc-300">{post.author}</span>
        <span className="text-zinc-600">{post.role}</span>
        <span>·</span>
        <time>{post.date}</time>
        <span>·</span>
        <span>{post.readingMinutes} min read</span>
      </div>

      <div className="mt-10 space-y-6">
        {post.body.map((block, i) => {
          if (block.type === "h2") {
            return (
              <h2 key={i} className="font-display text-2xl font-bold text-white">
                {block.text}
              </h2>
            );
          }
          if (block.type === "quote") {
            return (
              <blockquote
                key={i}
                className="border-l-2 border-cyan-500/50 pl-5 font-display text-xl italic text-zinc-200"
              >
                {block.text}
              </blockquote>
            );
          }
          return (
            <p key={i} className="text-base leading-relaxed text-zinc-300">
              {block.text}
            </p>
          );
        })}
      </div>

      <div className="mt-14 rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-6">
        <p className="font-display text-lg font-semibold text-white">Get the next one in your inbox</p>
        <p className="mt-1 text-sm text-zinc-400">Occasional deep-dives and release notes. No spam.</p>
        <div className="mt-4">
          <NewsletterForm source={`blog-${post.slug}`} />
        </div>
      </div>
    </article>
  );
}
