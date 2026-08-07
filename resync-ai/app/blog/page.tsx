import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Pill } from "@/components/content/ContentKit";
import { BLOG_POSTS } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog — Resync AI",
  description: "Engineering deep-dives, product updates, and field notes from the Resync AI team.",
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Field notes & deep-dives"
        lede="How we think about resilience, multimodal workflows, and building software that heals."
      />

      <div className="mx-auto max-w-5xl px-4 py-16">
        <Link
          href={`/blog/${featured.slug}`}
          className="group block overflow-hidden rounded-3xl border border-resync-border/60 bg-gradient-to-br from-resync-surface/70 to-indigo-950/20 p-8 transition hover:border-cyan-500/40 md:p-10"
        >
          <div className="flex flex-wrap gap-2">
            {featured.tags.map((t) => (
              <Pill key={t} tone="cyan">
                {t}
              </Pill>
            ))}
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold text-white group-hover:text-cyan-100">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-400">{featured.excerpt}</p>
          <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
            <span className="text-zinc-300">{featured.author}</span>
            <span>·</span>
            <time>{featured.date}</time>
            <span>·</span>
            <span>{featured.readingMinutes} min read</span>
          </div>
        </Link>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-6 transition hover:border-cyan-500/40 hover:bg-resync-surface/70"
            >
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-white group-hover:text-cyan-100">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
              <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-zinc-300">{post.author}</span>
                <span>·</span>
                <time>{post.date}</time>
                <span>·</span>
                <span>{post.readingMinutes} min</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
