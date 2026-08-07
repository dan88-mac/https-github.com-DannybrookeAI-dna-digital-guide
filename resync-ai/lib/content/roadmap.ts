export type RoadmapStage = "Now" | "Next" | "Later";

export interface RoadmapItem {
  title: string;
  description: string;
  stage: RoadmapStage;
  tag: string;
  votes: number;
}

export const ROADMAP: RoadmapItem[] = [
  {
    title: "Realtime collaboration cursors",
    description: "See teammates' cursors and selections on the builder canvas in real time.",
    stage: "Now",
    tag: "Builder",
    votes: 312,
  },
  {
    title: "Workflow version diffing",
    description: "Visual diff between workflow versions with one-click rollback.",
    stage: "Now",
    tag: "Builder",
    votes: 268,
  },
  {
    title: "Self-heal policy templates",
    description: "Prebuilt healing policies for common failure classes.",
    stage: "Now",
    tag: "Runtime",
    votes: 201,
  },
  {
    title: "Marketplace subscriptions",
    description: "Let creators offer recurring access to premium workflow bundles.",
    stage: "Next",
    tag: "Marketplace",
    votes: 187,
  },
  {
    title: "On-prem runtime sidecar",
    description: "Run the execution engine inside your own VPC for data residency.",
    stage: "Next",
    tag: "Enterprise",
    votes: 154,
  },
  {
    title: "Python & TypeScript SDKs",
    description: "First-class SDKs for triggering and managing workflows from code.",
    stage: "Next",
    tag: "Developers",
    votes: 143,
  },
  {
    title: "SOC 2 audit export",
    description: "Generate compliance-ready reports from the audit log.",
    stage: "Later",
    tag: "Trust",
    votes: 98,
  },
  {
    title: "Multi-region active-active",
    description: "Run workflows across regions with automatic failover.",
    stage: "Later",
    tag: "Infrastructure",
    votes: 76,
  },
  {
    title: "Workflow A/B testing",
    description: "Split traffic across workflow versions and compare outcomes.",
    stage: "Later",
    tag: "Analytics",
    votes: 64,
  },
];

export const ROADMAP_STAGES: RoadmapStage[] = ["Now", "Next", "Later"];
