export interface DocLink {
  title: string;
  description: string;
  href: string;
  minutes: number;
}

export interface DocCategory {
  category: string;
  icon: string;
  blurb: string;
  links: DocLink[];
}

export const DOC_CATEGORIES: DocCategory[] = [
  {
    category: "Getting started",
    icon: "rocket",
    blurb: "Go from zero to a running workflow.",
    links: [
      { title: "Quickstart", description: "Build and run your first workflow in five minutes.", href: "/learn", minutes: 5 },
      { title: "Core concepts", description: "Nodes, graphs, execution order, and self-heal.", href: "/glossary", minutes: 8 },
      { title: "Studio vs Builder", description: "When to generate from a prompt and when to draw the canvas.", href: "/studio", minutes: 4 },
    ],
  },
  {
    category: "Building workflows",
    icon: "nodes",
    blurb: "Everything about the canvas and nodes.",
    links: [
      { title: "Node reference", description: "Every node type, its params, inputs, and outputs.", href: "/nodes", minutes: 12 },
      { title: "Conditions & branching", description: "If/else, switch, and merge patterns.", href: "/nodes", minutes: 6 },
      { title: "Self-heal nodes", description: "Add resilience with patch and fallback tools.", href: "/nodes", minutes: 7 },
    ],
  },
  {
    category: "Integrations",
    icon: "plug",
    blurb: "Connect the tools your team already uses.",
    links: [
      { title: "Integrations directory", description: "Slack, Notion, HubSpot, Shopify, and more.", href: "/integrations", minutes: 3 },
      { title: "HTTP request node", description: "Call any REST API with typed inputs.", href: "/nodes", minutes: 5 },
      { title: "Outbound webhooks", description: "Sign and dispatch events to your systems.", href: "/api-reference", minutes: 6 },
    ],
  },
  {
    category: "Developers",
    icon: "code",
    blurb: "APIs, SDKs, and code export.",
    links: [
      { title: "API reference", description: "REST endpoints for runtime, workflows, telemetry.", href: "/api-reference", minutes: 10 },
      { title: "Code export", description: "Generate production Next.js from any graph.", href: "/builder", minutes: 6 },
      { title: "Changelog", description: "Track releases and breaking changes.", href: "/changelog", minutes: 2 },
    ],
  },
];
