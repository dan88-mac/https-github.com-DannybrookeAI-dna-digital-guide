import { TIERS, MARKETPLACE_FEES } from "@/lib/billing/tiers";
import { MODULE_CATALOG, getModule, type ModuleCategory } from "@/lib/engine/moduleCatalog";
import { moderateText } from "@/lib/engine/moderation";
import { AGENT_DISCLAIMER, AGENT_RULES } from "@/lib/agent/rules";
import {
  recordInteraction,
  suggestFromMemory,
  bumpModuleUsage,
  type AgentMemorySnapshot,
} from "@/lib/agent/memory";

export type AgentPage =
  | "pricing"
  | "community"
  | "builder"
  | "studio"
  | "multimodal"
  | "vision"
  | "privacy"
  | "terms"
  | "about"
  | "templates"
  | "dashboard"
  | "overview-score"
  | "marketplace";

export type AgentAction =
  | { type: "navigate"; path: string; label?: string }
  | { type: "add_module"; moduleId: string; label?: string }
  | { type: "open_panel"; panel: string };

export interface AgentChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AsyncAgentInput {
  message: string;
  page?: string;
  history?: AgentChatMessage[];
  sessionId?: string;
}

export interface AsyncAgentResult {
  reply: string;
  actions: AgentAction[];
  intent?: string;
  memoryUpdates?: Partial<AgentMemorySnapshot>;
  memoryBlob?: string;
}

const PAGE_ROUTES: Record<AgentPage, string> = {
  pricing: "/pricing",
  community: "/community",
  builder: "/builder",
  studio: "/studio",
  multimodal: "/builder",
  vision: "/vision",
  privacy: "/privacy",
  terms: "/terms",
  about: "/about",
  templates: "/templates",
  dashboard: "/dashboard",
  "overview-score": "/builder?panel=refinement",
  marketplace: "/community?filter=marketplace",
};

type ToolName =
  | "navigate_to"
  | "summarize_pricing"
  | "explain_community"
  | "list_modules"
  | "recommend_module"
  | "add_starter_module"
  | "explain_page"
  | "quality_tips"
  | "get_overview_score_info";

interface ToolCall {
  name: ToolName;
  args: Record<string, string | undefined>;
}

interface IntentMatch {
  intent: string;
  tool?: ToolCall;
  confidence: number;
}

const NEED_KEYWORDS: Array<{ pattern: RegExp; moduleId: string; category?: ModuleCategory }> = [
  { pattern: /\b(image|photo|picture|ocr|vision|see|visual)\b/i, moduleId: "vision", category: "vision" },
  { pattern: /\b(transcrib|audio|voice|speech|whisper|listen)\b/i, moduleId: "voice", category: "voice" },
  { pattern: /\b(speak|tts|synthesize|read aloud)\b/i, moduleId: "voice_synthesize", category: "voice" },
  { pattern: /\b(summariz|tl;dr|condense)\b/i, moduleId: "text_summarize", category: "text" },
  { pattern: /\b(generate|write|llm|gpt|chat)\b/i, moduleId: "text", category: "text" },
  { pattern: /\b(translate|language)\b/i, moduleId: "text_translate", category: "text" },
  { pattern: /\b(http|api|rest|fetch|webhook|endpoint)\b/i, moduleId: "httpRequest", category: "http" },
  { pattern: /\b(transform|map|reshape|json)\b/i, moduleId: "transform", category: "transform" },
  { pattern: /\b(if|else|branch|condition|switch)\b/i, moduleId: "condition", category: "condition" },
  { pattern: /\b(heal|retry|self.?heal|recover)\b/i, moduleId: "selfHeal", category: "selfHeal" },
  { pattern: /\b(approve|human|review|manual)\b/i, moduleId: "humanApprove", category: "human" },
  { pattern: /\b(delay|wait|pause|sleep)\b/i, moduleId: "delay", category: "delay" },
  { pattern: /\b(checkout|payment|stripe|commerce|order)\b/i, moduleId: "commerce_checkout", category: "commerce" },
  { pattern: /\b(deploy|devops|monitor|alert|scale)\b/i, moduleId: "devops_deploy", category: "devops" },
  { pattern: /\b(database|query|sql|store|persist)\b/i, moduleId: "data_query", category: "data" },
  { pattern: /\b(security|encrypt|audit|scan)\b/i, moduleId: "security_scan", category: "security" },
  { pattern: /\b(slack|email|crm|integrat)\b/i, moduleId: "integrate", category: "integrate" },
  { pattern: /\b(schedule|cron|timer)\b/i, moduleId: "trigger_schedule", category: "trigger" },
  { pattern: /\b(trigger|start|manual)\b/i, moduleId: "trigger", category: "trigger" },
];

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function matchIntent(message: string, page?: string): IntentMatch {
  const m = normalize(message);

  if (/\b(navigate|go to|take me|open|show me)\b/.test(m)) {
    const pageMatch = extractPageFromMessage(m);
    if (pageMatch) {
      return {
        intent: "navigate",
        tool: { name: "navigate_to", args: { page: pageMatch } },
        confidence: 0.9,
      };
    }
  }

  if (/\b(pric|tier|plan|cost|subscription|credit|fee|marketplace fee|how much)\b/.test(m)) {
    return { intent: "pricing", tool: { name: "summarize_pricing", args: {} }, confidence: 0.92 };
  }

  if (/\b(community|forum|post|share template|waitlist|discussion)\b/.test(m)) {
    return { intent: "community", tool: { name: "explain_community", args: {} }, confidence: 0.88 };
  }

  if (/\b(overview score|refinement score|quality score|score feature|pro\+)\b/.test(m)) {
    return {
      intent: "overview_score",
      tool: { name: "get_overview_score_info", args: {} },
      confidence: 0.9,
    };
  }

  if (/\b(qc|quality|tip|best practice|improve|refine)\b/.test(m)) {
    return {
      intent: "quality_tips",
      tool: { name: "quality_tips", args: { context: page } },
      confidence: 0.85,
    };
  }

  if (/\b(list|show|browse|catalog|palette|modules?)\b/.test(m) && !/\brecommend\b/.test(m)) {
    const category = extractCategory(m);
    const query = extractModuleQuery(m);
    return {
      intent: "list_modules",
      tool: { name: "list_modules", args: { query, category } },
      confidence: 0.8,
    };
  }

  if (/\b(recommend|suggest|which module|what module|best module|need a module)\b/.test(m)) {
    return {
      intent: "recommend_module",
      tool: { name: "recommend_module", args: { need: message } },
      confidence: 0.9,
    };
  }

  if (/\b(add|drop|place|put|starter|example)\b.*\b(module|node)\b/.test(m)) {
    return {
      intent: "add_starter_module",
      tool: { name: "add_starter_module", args: { need: message } },
      confidence: 0.88,
    };
  }

  if (/\b(buy workflow|purchase template|marketplace listing)\b/.test(m)) {
    return {
      intent: "marketplace",
      tool: { name: "navigate_to", args: { page: "marketplace" } },
      confidence: 0.85,
    };
  }

  if (/\b(what is|explain|how does|structure|overview|help)\b/.test(m)) {
    const pageHint = extractPageFromMessage(m) ?? page;
    return {
      intent: "explain_page",
      tool: { name: "explain_page", args: { page: pageHint } },
      confidence: 0.75,
    };
  }

  if (/\b(multimodal|vision|voice|text)\b/.test(m) && /\b(how|what|explain)\b/.test(m)) {
    return {
      intent: "multimodal",
      tool: { name: "explain_page", args: { page: "multimodal" } },
      confidence: 0.8,
    };
  }

  if (/\b(help|hi|hello|hey)\b/.test(m) && m.length < 40) {
    return { intent: "greeting", confidence: 0.7 };
  }

  return {
    intent: "general",
    tool: { name: "explain_page", args: { page: page ?? "builder" } },
    confidence: 0.5,
  };
}

function extractPageFromMessage(m: string): AgentPage | undefined {
  const pages: AgentPage[] = [
    "pricing",
    "community",
    "builder",
    "studio",
    "multimodal",
    "vision",
    "privacy",
    "terms",
    "about",
    "templates",
    "dashboard",
    "overview-score",
    "marketplace",
  ];
  for (const p of pages) {
    const key = p.replace("-", " ");
    if (m.includes(p) || m.includes(key)) return p;
  }
  if (m.includes("refinement") || m.includes("score")) return "overview-score";
  if (m.includes("workflow") && m.includes("build")) return "builder";
  return undefined;
}

function extractCategory(m: string): string | undefined {
  const cats: ModuleCategory[] = [
    "trigger", "vision", "voice", "text", "http", "transform", "condition",
    "selfHeal", "webhook", "human", "delay", "commerce", "devops", "data",
    "security", "integrate",
  ];
  return cats.find((c) => m.includes(c.toLowerCase()));
}

function extractModuleQuery(m: string): string | undefined {
  const cleaned = m
    .replace(/\b(list|show|browse|modules?|catalog|palette|all|the)\b/gi, "")
    .trim();
  return cleaned.length > 2 ? cleaned : undefined;
}

function toolNavigateTo(page: string): { reply: string; actions: AgentAction[] } {
  const key = page as AgentPage;
  const path = PAGE_ROUTES[key] ?? `/`;
  const label = page.replace("-", " ");
  return {
    reply: `Opening **${label}** for you. Use the builder for hands-on module work — I can recommend individual nodes anytime.`,
    actions: [{ type: "navigate", path, label }],
  };
}

function toolSummarizePricing(): { reply: string; actions: AgentAction[] } {
  const tierLines = TIERS.map(
    (t) => `• **${t.name}** (${t.priceLabel}/mo) — ${t.creditsPerMonth.toLocaleString()} credits`,
  ).join("\n");

  const fees = MARKETPLACE_FEES;
  const reply = [
    "**Resync AI pricing** (from official tiers):",
    tierLines,
    "",
    `**Marketplace fees:** ${fees.standardBuyerPercent}% buyer + ${fees.standardSellerPercent}% seller = **${fees.standardTotalPercent}%** total. Enterprise: **${fees.enterpriseTotalPercent}%** total.`,
    "",
    "Community (free) includes a 3-node canvas limit. Builder unlocks the full palette and idea-to-canvas.",
  ].join("\n");

  return { reply, actions: [{ type: "navigate", path: "/pricing", label: "pricing" }] };
}

function toolExplainCommunity(): { reply: string; actions: AgentAction[] } {
  const reply = [
    "**Community** is where builders share templates, designs, and marketplace listings.",
    "",
    "• **Templates** — clone free starter graphs into the builder",
    "• **Marketplace** — buy/sell paid workflows (Pro+ sellers)",
    "• **Discussions** — feedback, tips, and refinement scores on posts",
    "• **Compose** — publish your own template or listing",
    "",
    "I can navigate you there or recommend a single module to get started locally.",
  ].join("\n");

  return { reply, actions: [{ type: "navigate", path: "/community", label: "community" }] };
}

function toolListModules(query?: string, category?: string): { reply: string; actions: AgentAction[] } {
  let mods = [...MODULE_CATALOG];

  if (category) {
    mods = mods.filter((m) => m.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    mods = mods.filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    );
  }

  const shown = mods.slice(0, 8);
  if (shown.length === 0) {
    return {
      reply: `No modules matched "${query ?? category ?? ""}". Try categories like vision, text, http, or commerce.`,
      actions: [],
    };
  }

  const lines = shown.map((m) => `• **${m.label}** (\`${m.id}\`) — ${m.description}`);
  const more = mods.length > 8 ? `\n\n_+${mods.length - 8} more in the palette._` : "";

  return {
    reply: `**Module matches** (${mods.length} total):\n${lines.join("\n")}${more}`,
    actions: [],
  };
}

function pickModuleForNeed(need: string): { moduleId: string; reason: string } {
  for (const rule of NEED_KEYWORDS) {
    if (rule.pattern.test(need)) {
      const mod = getModule(rule.moduleId);
      return {
        moduleId: rule.moduleId,
        reason: mod
          ? `${mod.label} fits because: ${mod.description}`
          : `Matches your described need in the ${rule.category} category.`,
      };
    }
  }

  if (/\boutput|notify|send\b/i.test(need)) {
    return { moduleId: "webhookOut", reason: "Webhook Out delivers results to external systems." };
  }

  return {
    moduleId: "text",
    reason: "Text Generate is a versatile starting point for most automation ideas.",
  };
}

function toolRecommendModule(need: string): { reply: string; actions: AgentAction[]; moduleId: string } {
  const { moduleId, reason } = pickModuleForNeed(need);
  const mod = getModule(moduleId);

  const reply = [
    `**Recommended module:** ${mod?.icon ?? "•"} **${mod?.label ?? moduleId}**`,
    "",
    reason,
    "",
    "_One module at a time — wire it in the builder, then ask me about the next step._",
  ].join("\n");

  return { reply, actions: [], moduleId };
}

function toolAddStarterModule(need: string): { reply: string; actions: AgentAction[]; moduleId: string } {
  const { moduleId, reason } = pickModuleForNeed(need);
  const mod = getModule(moduleId);

  const reply = [
    `Adding **${mod?.label ?? moduleId}** as a starter example on your canvas.`,
    "",
    reason,
    "",
    "_This is one node only — connect it to a trigger and output when you're ready._",
  ].join("\n");

  return {
    reply,
    actions: [{ type: "add_module", moduleId, label: mod?.label }],
    moduleId,
  };
}

function toolExplainPage(page?: string): { reply: string; actions: AgentAction[] } {
  const p = page ?? "builder";

  const explanations: Record<string, string> = {
    builder:
      "**Builder** — describe an idea, generate a graph, refine density, inspect nodes, score resilience, and export Next.js code. I advise on individual modules; the idea bar builds fuller graphs.",
    studio:
      "**Studio** — team workspace for designs, previews, and publishing flows to community or marketplace.",
    community:
      "**Community** — templates, marketplace listings, discussions, and refinement scores on shared work.",
    pricing:
      "**Pricing** — Community (free), Builder ($39), Pro ($129), Enterprise (custom). Ask me to summarize tiers and marketplace fees.",
    multimodal:
      "**Multimodal** workflows combine vision, voice, and text modules. Start with Vision Analyze, Voice Transcribe, or Text Generate — one module at a time.",
    vision:
      "**Vision** — image analysis, OCR, object detection, and classification modules in the palette.",
    dashboard:
      "**Dashboard** — telemetry, execution logs, and org metrics for production workflows.",
    templates:
      "**Templates** — curated starter graphs you can open in the builder.",
    marketplace:
      "**Marketplace** — buy and sell paid workflows via Community. Standard fee is 20% total (10% buyer + 10% seller).",
    "overview-score":
      "**Overview / Refinement score** — a Pro+ quality metric in the builder's Refinement tab. Scores node diversity, connectivity, heal coverage, and production readiness.",
  };

  const text =
    explanations[p] ??
  `**Resync AI** is a multimodal workflow platform: builder canvas, studio, community marketplace, and self-healing runtime. ${AGENT_DISCLAIMER}`;

  const path = PAGE_ROUTES[p as AgentPage];
  return {
    reply: text,
    actions: path ? [{ type: "navigate", path, label: p }] : [],
  };
}

function toolQualityTips(context?: string): { reply: string; actions: AgentAction[] } {
  const base = [
    "**Quality tips** for stronger workflows:",
    "",
    "1. **Always start with a trigger** — manual, webhook, or schedule.",
    "2. **Label nodes** — unnamed nodes hurt your refinement score.",
    "3. **Add Self Heal** on HTTP or integration nodes that call flaky APIs.",
    "4. **End with an output** — webhook out, email, or store step.",
    "5. **Validate** before export — catch dangling edges early.",
  ];

  const contextTips: Record<string, string> = {
    builder: "Open the **Refinement** tab to see your live score and recommendations.",
    community: "Posts with refinement scores ≥80 tend to get more clones — test in builder first.",
    studio: "Preview designs before publishing — score them in builder's Refinement panel.",
  };

  if (context && contextTips[context]) {
    base.push("", contextTips[context]);
  }

  return { reply: base.join("\n"), actions: [] };
}

function toolOverviewScoreInfo(): { reply: string; actions: AgentAction[] } {
  const reply = [
    "**Overview / Refinement score** (Pro+ feature context):",
    "",
    "• Lives in the builder **Refinement** tab",
    "• Grades A–D from 0–100 based on graph health",
    "• Measures: node diversity, connectivity, heal coverage, purpose fit, production readiness",
    "• Community posts display refinement badges when shared",
    "",
    "Open the builder and switch to Refinement to see your live score.",
  ].join("\n");

  return {
    reply,
    actions: [{ type: "navigate", path: "/builder?panel=refinement", label: "overview-score" }],
  };
}

function executeTool(tool: ToolCall): {
  reply: string;
  actions: AgentAction[];
  moduleId?: string;
} {
  switch (tool.name) {
    case "navigate_to":
      return toolNavigateTo(tool.args.page ?? "builder");
    case "summarize_pricing":
      return toolSummarizePricing();
    case "explain_community":
      return toolExplainCommunity();
    case "list_modules":
      return toolListModules(tool.args.query, tool.args.category);
    case "recommend_module": {
      const r = toolRecommendModule(tool.args.need ?? "");
      return { reply: r.reply, actions: r.actions, moduleId: r.moduleId };
    }
    case "add_starter_module": {
      const r = toolAddStarterModule(tool.args.need ?? "");
      return { reply: r.reply, actions: r.actions, moduleId: r.moduleId };
    }
    case "explain_page":
      return toolExplainPage(tool.args.page);
    case "quality_tips":
      return toolQualityTips(tool.args.context);
    case "get_overview_score_info":
      return toolOverviewScoreInfo();
    default:
      return {
        reply: `${AGENT_DISCLAIMER} Try asking about pricing, a module recommendation, or navigation.`,
        actions: [],
      };
  }
}

function greetingReply(page?: string): string {
  const ctx = page ? ` You're on **${page}**.` : "";
  return [
    `Hi — I'm the **a-sync agent**.${ctx}`,
    "",
    "I help with:",
    "• **Module picks** — one at a time, with reasoning",
    "• **Navigation** — pricing, community, builder, studio",
    "• **Quality tips** — refinement and production readiness",
    "",
    AGENT_DISCLAIMER,
  ].join("\n");
}

async function maybeEnrichWithOpenAI(
  message: string,
  baseReply: string,
  page?: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return baseReply;

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: [
            `You are ${AGENT_RULES.name}. ${AGENT_RULES.tone}`,
            "Rewrite the draft reply to be slightly warmer but keep all facts exact.",
            "Never invent prices. Never suggest building full workflows. Max 6 sentences.",
            "Do not mention founder names.",
          ].join(" "),
        },
        {
          role: "user",
          content: `Page: ${page ?? "unknown"}\nUser: ${message}\n\nDraft reply:\n${baseReply}`,
        },
      ],
    });

    const enriched = completion.choices[0]?.message?.content?.trim();
    return enriched || baseReply;
  } catch {
    return baseReply;
  }
}

export async function runAsyncAgent(input: AsyncAgentInput): Promise<AsyncAgentResult> {
  const { message, page, sessionId } = input;
  const trimmed = message.trim();

  if (!trimmed) {
    return {
      reply: "Send a message and I'll help with modules, navigation, or quality tips.",
      actions: [],
    };
  }

  const moderation = moderateText(trimmed);
  if (!moderation.allowed) {
    return {
      reply: AGENT_RULES.escalation,
      actions: [],
      intent: "moderation_blocked",
    };
  }

  const match = matchIntent(trimmed, page);
  let reply: string;
  let actions: AgentAction[] = [];
  let moduleId: string | undefined;

  if (match.intent === "greeting") {
    reply = greetingReply(page);
  } else if (match.tool) {
    const result = executeTool(match.tool);
    reply = result.reply;
    actions = result.actions;
    moduleId = result.moduleId;
  } else {
    reply = greetingReply(page);
  }

  const memorySuggestions = await suggestFromMemory(page, trimmed);
  if (memorySuggestions.length > 0 && match.confidence < 0.85) {
    const hint = memorySuggestions[0];
    if (hint.moduleId && !moduleId) {
      reply += `\n\n_From memory: **${hint.moduleId}** might still fit — ${hint.reason}_`;
    } else if (hint.tip) {
      reply += `\n\n_Tip: ${hint.tip}_`;
    }
  }

  reply = await maybeEnrichWithOpenAI(trimmed, reply, page);

  if (moduleId && match.intent === "add_starter_module") {
    await bumpModuleUsage(moduleId);
  }

  const memorySnapshot = await recordInteraction({
    sessionId,
    page,
    intent: match.intent,
    message: trimmed,
    reply,
    moduleId,
  });

  return {
    reply,
    actions,
    intent: match.intent,
    memoryUpdates: memorySnapshot,
    memoryBlob: JSON.stringify(memorySnapshot),
  };
}

export { PAGE_ROUTES };
