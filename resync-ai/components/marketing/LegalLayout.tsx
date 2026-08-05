import Link from "next/link";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="glass rounded-2xl p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Legal</p>
        <h1 className="mt-2 text-4xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated {updated}</p>
        <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-zinc-300">
          {children}
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-zinc-500">
        Questions?{" "}
        <Link href="/community" className="text-indigo-400 hover:text-indigo-300">
          Visit the community
        </Link>
      </p>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-zinc-400">{children}</div>
    </section>
  );
}
