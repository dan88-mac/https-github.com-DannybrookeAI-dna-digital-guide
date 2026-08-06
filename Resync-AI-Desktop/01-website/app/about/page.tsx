import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Our mission</h1>
      <p className="mt-6 text-lg leading-relaxed text-zinc-300">
        Software should fail gracefully. Teams should not burn out fixing the same integration
        twice. Communities deserve products that keep working after launch day.
      </p>
      <p className="mt-4 leading-relaxed text-zinc-400">
        Resync AI exists so builders, operators, and purpose-driven organizations can ship
        automation that <strong className="text-white">self-heals</strong>, document what
        happened, and export code they own. We measure success by how often you come back—not
        because something broke, but because Resync is the fastest path to the next reliable
        workflow.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/community" className="text-indigo-400 hover:text-indigo-300">
          Join the community →
        </Link>
        <Link href="/builder" className="text-indigo-400 hover:text-indigo-300">
          Open the builder →
        </Link>
      </div>
    </div>
  );
}
