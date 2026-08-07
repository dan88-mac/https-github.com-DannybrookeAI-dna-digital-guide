export interface ResyncEvent {
  title: string;
  type: "Webinar" | "Workshop" | "Office hours" | "Conference";
  date: string;
  time: string;
  presenter: string;
  description: string;
  status: "upcoming" | "on-demand";
}

export const EVENTS: ResyncEvent[] = [
  {
    title: "Building your first self-healing workflow",
    type: "Webinar",
    date: "2026-08-20",
    time: "10:00 PT",
    presenter: "Daniel Brooke",
    description: "A live build from blank canvas to a resilient production workflow in 45 minutes.",
    status: "upcoming",
  },
  {
    title: "Multimodal intake deep-dive",
    type: "Workshop",
    date: "2026-08-27",
    time: "09:00 PT",
    presenter: "Mike R.",
    description: "Hands-on session building an OCR → summarize → store pipeline with a human gate.",
    status: "upcoming",
  },
  {
    title: "Builder office hours",
    type: "Office hours",
    date: "2026-09-03",
    time: "12:00 PT",
    presenter: "Community team",
    description: "Bring your workflow. We'll review it live and suggest refinements.",
    status: "upcoming",
  },
  {
    title: "Inside refinement score v2",
    type: "Webinar",
    date: "2026-07-15",
    time: "—",
    presenter: "Kina A.",
    description: "How the marketplace scores quality and how to improve your listings.",
    status: "on-demand",
  },
  {
    title: "Self-heal patterns for DevOps",
    type: "Workshop",
    date: "2026-06-24",
    time: "—",
    presenter: "Platform team",
    description: "Incident auto-remediation, health probes, and safe rollbacks.",
    status: "on-demand",
  },
];
