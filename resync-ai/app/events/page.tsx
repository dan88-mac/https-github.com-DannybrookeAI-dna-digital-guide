import type { Metadata } from "next";
import { PageHero, Pill, type PillTone } from "@/components/content/ContentKit";
import { NewsletterForm } from "@/components/content/NewsletterForm";
import { EVENTS, type ResyncEvent } from "@/lib/content/events";

export const metadata: Metadata = {
  title: "Events & webinars — Resync AI",
  description: "Live workshops, webinars, and office hours — plus on-demand recordings.",
};

const TYPE_TONE: Record<ResyncEvent["type"], PillTone> = {
  Webinar: "cyan",
  Workshop: "indigo",
  "Office hours": "green",
  Conference: "amber",
};

function EventCard({ event }: { event: ResyncEvent }) {
  return (
    <article className="rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-6 transition hover:border-cyan-500/40">
      <div className="flex items-center justify-between">
        <Pill tone={TYPE_TONE[event.type]}>{event.type}</Pill>
        <span className="font-mono text-xs text-zinc-500">
          {event.status === "upcoming" ? `${event.date} · ${event.time}` : "On demand"}
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-white">{event.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{event.description}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-zinc-500">with {event.presenter}</span>
        <span className="text-sm font-semibold text-cyan-300">
          {event.status === "upcoming" ? "Register →" : "Watch →"}
        </span>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const upcoming = EVENTS.filter((e) => e.status === "upcoming");
  const onDemand = EVENTS.filter((e) => e.status === "on-demand");

  return (
    <>
      <PageHero
        eyebrow="Events & webinars"
        title="Learn live with the team"
        lede="Join a live build, drop into office hours, or catch up on-demand."
      />

      <div className="mx-auto max-w-5xl space-y-14 px-4 py-16">
        <section>
          <h2 className="font-display text-2xl font-bold text-white">Upcoming</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {upcoming.map((e) => (
              <EventCard key={e.title} event={e} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white">On demand</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {onDemand.map((e) => (
              <EventCard key={e.title} event={e} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-resync-surface/70 to-indigo-950/20 p-8 md:p-10">
          <h2 className="font-display text-2xl font-bold text-white">Never miss a session</h2>
          <p className="mt-2 max-w-lg text-zinc-400">
            Get event invites and recordings delivered to your inbox.
          </p>
          <div className="mt-6 max-w-lg">
            <NewsletterForm source="events" />
          </div>
        </section>
      </div>
    </>
  );
}
