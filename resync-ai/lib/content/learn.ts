export interface Lesson {
  title: string;
  minutes: number;
  summary: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  blurb: string;
  outcomes: string[];
  lessons: Lesson[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: "first-flow",
    title: "Your first workflow",
    level: "Beginner",
    blurb: "Go from an empty canvas to a running, exported workflow.",
    outcomes: [
      "Understand nodes, edges, and execution order",
      "Run a workflow against live data",
      "Export production Next.js code",
    ],
    lessons: [
      { title: "Tour of the builder", minutes: 6, summary: "Palette, canvas, inspector, and console." },
      { title: "Wire your first three nodes", minutes: 8, summary: "Trigger → HTTP request → response." },
      { title: "Test with live data", minutes: 7, summary: "Run the flow and read the console output." },
      { title: "Export and ship", minutes: 5, summary: "Generate routes, hooks, and a runner UI." },
    ],
  },
  {
    slug: "resilient-workflows",
    title: "Resilient workflows",
    level: "Intermediate",
    blurb: "Add self-healing, conditions, and human approvals.",
    outcomes: [
      "Add a self-heal node with patch and fallback",
      "Branch with conditions and switches",
      "Insert a human-in-the-loop approval gate",
    ],
    lessons: [
      { title: "Anatomy of self-heal", minutes: 9, summary: "Patch, fallback, and safe abort tools." },
      { title: "Branching with conditions", minutes: 7, summary: "If/else, switch, and merge patterns." },
      { title: "Human approvals", minutes: 6, summary: "Pause a flow for a reviewer, then resume." },
      { title: "Circuit breakers", minutes: 8, summary: "Stop cascading failures automatically." },
    ],
  },
  {
    slug: "multimodal-mastery",
    title: "Multimodal mastery",
    level: "Advanced",
    blurb: "Combine vision, text, and speech into one pipeline.",
    outcomes: [
      "Build an OCR → summarize → store pipeline",
      "Add vision analysis and speech-to-text",
      "Tune models and cost with efficiency in mind",
    ],
    lessons: [
      { title: "Vision intake", minutes: 10, summary: "OCR and image analysis nodes in depth." },
      { title: "Speech workflows", minutes: 8, summary: "Transcribe and classify audio inputs." },
      { title: "Efficient LLM steps", minutes: 9, summary: "Model choice, temperature, and token budgets." },
      { title: "Publishing to the marketplace", minutes: 7, summary: "Score, price, and list your workflow." },
    ],
  },
];

export function totalMinutes(path: LearningPath): number {
  return path.lessons.reduce((sum, l) => sum + l.minutes, 0);
}
