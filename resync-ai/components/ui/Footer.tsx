import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-resync-border bg-resync-surface/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-lg font-semibold text-white">Resync AI</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
            Multimodal workflows that heal themselves.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>
              <Link href="/builder" className="hover:text-white">
                Builder
              </Link>
            </li>
            <li>
              <Link href="/studio" className="hover:text-white">
                Studio
              </Link>
            </li>
            <li>
              <Link href="/marketplace" className="hover:text-white">
                Marketplace
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-white">
                Templates
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Community</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>
              <Link href="/community" className="hover:text-white">
                Community
              </Link>
            </li>
            <li>
              <Link href="/vision" className="hover:text-white">
                Vision
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/acceptable-use" className="hover:text-white">
                Acceptable Use
              </Link>
            </li>
            <li>
              <Link href="/trademark" className="hover:text-white">
                Trademark
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-resync-border py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Resync AI. Multimodal workflows that heal themselves.
      </div>
    </footer>
  );
}
