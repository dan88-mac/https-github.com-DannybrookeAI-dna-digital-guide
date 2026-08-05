import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-resync-border bg-resync-surface/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-white">Resync AI</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            Self-healing workflows for teams who ship with purpose. Build once, recover
            automatically, and return whenever the next challenge hits.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li><Link href="/builder" className="hover:text-white">Workflow builder</Link></li>
            <li><Link href="/templates" className="hover:text-white">Template gallery</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Community</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li><Link href="/community" className="hover:text-white">Join the community</Link></li>
            <li><Link href="/about" className="hover:text-white">Our mission</Link></li>
            <li><Link href="/resources" className="hover:text-white">Guides & stories</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-resync-border py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Resync AI. Built for builders who come back.
      </div>
    </footer>
  );
}
