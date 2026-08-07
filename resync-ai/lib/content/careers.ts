export interface JobOpening {
  title: string;
  team: string;
  location: string;
  type: string;
  description: string;
}

export interface CompanyValue {
  title: string;
  description: string;
}

export const COMPANY_VALUES: CompanyValue[] = [
  {
    title: "Resilience by default",
    description: "We build systems that expect failure and recover from it — and we work the same way.",
  },
  {
    title: "Ship, then refine",
    description: "Small, reversible releases beat big-bang launches. Every change earns its place with evidence.",
  },
  {
    title: "Transparent by design",
    description: "Telemetry, audit logs, and open roadmaps — inside the product and inside the team.",
  },
  {
    title: "Builders welcome",
    description: "The best ideas come from people who use what they build. Everyone ships.",
  },
];

export const JOB_OPENINGS: JobOpening[] = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Product",
    location: "Remote (US / EU)",
    type: "Full-time",
    description: "Own end-to-end features across the Next.js app, from the builder canvas to the runtime.",
  },
  {
    title: "Runtime Engineer",
    team: "Platform",
    location: "Remote (US / EU)",
    type: "Full-time",
    description: "Push the self-heal engine forward — tool calling, circuit breakers, and execution telemetry.",
  },
  {
    title: "Design Engineer",
    team: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Bridge design and code for an immersive, accessible workflow studio.",
  },
  {
    title: "Developer Advocate",
    team: "Growth",
    location: "Remote",
    type: "Full-time",
    description: "Create tutorials, sample workflows, and community programs that help builders succeed.",
  },
  {
    title: "Solutions Engineer",
    team: "Go-to-market",
    location: "Remote (US)",
    type: "Full-time",
    description: "Partner with enterprise teams to design self-healing workflows for their stack.",
  },
];
