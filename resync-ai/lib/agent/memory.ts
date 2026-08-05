import { promises as fs } from "fs";
import path from "path";

/** Supabase-ready row shape for future persistence. */
export interface AgentMemoryRow {
  id: string;
  session_id: string | null;
  interaction_at: string;
  page: string | null;
  intent: string | null;
  module_id: string | null;
  summary: string;
}

export interface AgentInteraction {
  at: string;
  sessionId?: string;
  page?: string;
  intent?: string;
  message: string;
  replyPreview: string;
  moduleId?: string;
}

export interface LearnedTip {
  id: string;
  context: string;
  tip: string;
  count: number;
  lastUsed: string;
}

export interface SessionSummary {
  sessionId: string;
  startedAt: string;
  lastAt: string;
  turnCount: number;
  topIntent?: string;
  pages: string[];
}

export interface AgentMemorySnapshot {
  interactions: AgentInteraction[];
  moduleUsageCounts: Record<string, number>;
  popularFlows: string[];
  learnedTips: LearnedTip[];
  sessionSummaries: SessionSummary[];
  updatedAt: string;
}

const MAX_INTERACTIONS = 200;
const MAX_TIPS = 50;
const MAX_SESSIONS = 100;

const MEMORY_DIR = path.join(process.cwd(), "data");
const MEMORY_FILE = path.join(MEMORY_DIR, "agent-memory.json");

const EMPTY_MEMORY: AgentMemorySnapshot = {
  interactions: [],
  moduleUsageCounts: {},
  popularFlows: [],
  learnedTips: [],
  sessionSummaries: [],
  updatedAt: new Date().toISOString(),
};

let memoryCache: AgentMemorySnapshot | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureMemoryFile(): Promise<AgentMemorySnapshot> {
  if (memoryCache) return memoryCache;

  try {
    const raw = await fs.readFile(MEMORY_FILE, "utf-8");
    memoryCache = { ...EMPTY_MEMORY, ...JSON.parse(raw) };
    return memoryCache!;
  } catch {
    memoryCache = { ...EMPTY_MEMORY };
    return memoryCache;
  }
}

async function persistMemory(snapshot: AgentMemorySnapshot): Promise<boolean> {
  snapshot.updatedAt = new Date().toISOString();
  memoryCache = snapshot;

  writeQueue = writeQueue.then(async () => {
    try {
      await fs.mkdir(MEMORY_DIR, { recursive: true });
      await fs.writeFile(MEMORY_FILE, JSON.stringify(snapshot, null, 2), "utf-8");
    } catch {
      /* filesystem may be read-only in serverless — client persists blob */
    }
  });
  await writeQueue;
  return true;
}

export async function getMemorySnapshot(): Promise<AgentMemorySnapshot> {
  return ensureMemoryFile();
}

export interface RecordInteractionInput {
  sessionId?: string;
  page?: string;
  intent?: string;
  message: string;
  reply: string;
  moduleId?: string;
}

export async function recordInteraction(
  input: RecordInteractionInput,
): Promise<AgentMemorySnapshot> {
  const mem = await ensureMemoryFile();

  const entry: AgentInteraction = {
    at: new Date().toISOString(),
    sessionId: input.sessionId,
    page: input.page,
    intent: input.intent,
    message: input.message.slice(0, 500),
    replyPreview: input.reply.slice(0, 200),
    moduleId: input.moduleId,
  };

  mem.interactions = [entry, ...mem.interactions].slice(0, MAX_INTERACTIONS);

  if (input.moduleId) {
    mem.moduleUsageCounts[input.moduleId] = (mem.moduleUsageCounts[input.moduleId] ?? 0) + 1;
  }

  if (input.intent && !mem.popularFlows.includes(input.intent)) {
    mem.popularFlows = [input.intent, ...mem.popularFlows].slice(0, 20);
  }

  if (input.sessionId) {
    const existing = mem.sessionSummaries.find((s) => s.sessionId === input.sessionId);
    if (existing) {
      existing.lastAt = entry.at;
      existing.turnCount += 1;
      if (input.page && !existing.pages.includes(input.page)) {
        existing.pages.push(input.page);
      }
      if (input.intent) existing.topIntent = input.intent;
    } else {
      mem.sessionSummaries = [
        {
          sessionId: input.sessionId,
          startedAt: entry.at,
          lastAt: entry.at,
          turnCount: 1,
          topIntent: input.intent,
          pages: input.page ? [input.page] : [],
        },
        ...mem.sessionSummaries,
      ].slice(0, MAX_SESSIONS);
    }
  }

  await persistMemory(mem);
  return mem;
}

export async function bumpModuleUsage(moduleId: string): Promise<void> {
  const mem = await ensureMemoryFile();
  mem.moduleUsageCounts[moduleId] = (mem.moduleUsageCounts[moduleId] ?? 0) + 1;
  await persistMemory(mem);
}

export async function addLearnedTip(context: string, tip: string): Promise<void> {
  const mem = await ensureMemoryFile();
  const existing = mem.learnedTips.find(
    (t) => t.context === context && t.tip === tip,
  );
  if (existing) {
    existing.count += 1;
    existing.lastUsed = new Date().toISOString();
  } else {
    mem.learnedTips = [
      {
        id: `tip-${Date.now()}`,
        context,
        tip,
        count: 1,
        lastUsed: new Date().toISOString(),
      },
      ...mem.learnedTips,
    ].slice(0, MAX_TIPS);
  }
  await persistMemory(mem);
}

export interface MemorySuggestion {
  moduleId?: string;
  tip?: string;
  reason: string;
}

/** Suggest modules or tips based on accumulated memory and current context. */
export async function suggestFromMemory(
  page?: string,
  query?: string,
): Promise<MemorySuggestion[]> {
  const mem = await ensureMemoryFile();
  const suggestions: MemorySuggestion[] = [];

  const sortedModules = Object.entries(mem.moduleUsageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  for (const [moduleId, count] of sortedModules) {
    if (count >= 2) {
      suggestions.push({
        moduleId,
        reason: `You've explored ${moduleId} ${count} times — still a solid pick.`,
      });
    }
  }

  const contextTips = mem.learnedTips
    .filter((t) => !page || t.context === page || t.context === "global")
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  for (const t of contextTips) {
    suggestions.push({ tip: t.tip, reason: `Based on your past sessions on ${t.context}.` });
  }

  if (query) {
    const q = query.toLowerCase();
    const related = mem.interactions.find(
      (i) =>
        i.message.toLowerCase().includes(q) ||
        i.intent?.toLowerCase().includes(q),
    );
    if (related?.moduleId) {
      suggestions.push({
        moduleId: related.moduleId,
        reason: "You asked about something similar before.",
      });
    }
  }

  return suggestions.slice(0, 4);
}

/** Serialize memory for client localStorage fallback. */
export function memoryToClientBlob(snapshot: AgentMemorySnapshot): string {
  return JSON.stringify(snapshot);
}

export function memoryFromClientBlob(blob: string): AgentMemorySnapshot | null {
  try {
    return { ...EMPTY_MEMORY, ...JSON.parse(blob) };
  } catch {
    return null;
  }
}
