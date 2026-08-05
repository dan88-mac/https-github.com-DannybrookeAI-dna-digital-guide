import { COMMUNITY_TEMPLATES } from "@/lib/community/content";
import { calculateModelRefinement } from "@/lib/engine/refinementCalculator";
import type { GraphEdge, GraphNode } from "@/lib/engine/ideaToCanvas";

export type PostType = "template" | "marketplace" | "design" | "discussion";
export type PostFilter = "all" | "templates" | "marketplace" | "trending" | "new";

export interface CommunityPost {
  id: string;
  type: PostType;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  templateSlug?: string;
  graph?: { nodes: GraphNode[]; edges: GraphEdge[] };
  refinementScore: number;
  refinementGrade: string;
  capabilitySummary: string;
  priceCents?: number;
  likes: string[];
  commentIds: string[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  nsfw: boolean;
  reportCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface Message {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface Report {
  id: string;
  targetType: "post" | "user" | "comment";
  targetId: string;
  reason: string;
  details?: string;
  reporterId: string;
  createdAt: string;
  status: "pending" | "reviewed";
}

export interface CommunitySettings {
  emailDigest: boolean;
  notifyReplies: boolean;
  notifyLikes: boolean;
  hideNsfw: boolean;
  hideAbuse: boolean;
  muteWords: string[];
  showActivity: boolean;
  blockedUserIds: string[];
}

export interface CommunityState {
  posts: CommunityPost[];
  comments: Comment[];
  messages: Message[];
  reports: Report[];
  settings: CommunitySettings;
  sessionId: string;
  displayName: string;
}

const STORAGE_KEY = "resync-community-v1";

const DEFAULT_SETTINGS: CommunitySettings = {
  emailDigest: false,
  notifyReplies: true,
  notifyLikes: true,
  hideNsfw: true,
  hideAbuse: true,
  muteWords: [],
  showActivity: true,
  blockedUserIds: [],
};

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("resync-session-id");
  if (!id) {
    id = generateId("session");
    localStorage.setItem("resync-session-id", id);
  }
  return id;
}

function getDisplayName(): string {
  if (typeof window === "undefined") return "Builder";
  return localStorage.getItem("resync-display-name") ?? "Anonymous Builder";
}

function summarizeCapabilities(graph: { nodes: GraphNode[]; edges: GraphEdge[] }): string {
  const types = [...new Set(graph.nodes.map((n) => n.type))];
  const labels = graph.nodes
    .map((n) => (typeof n.data?.label === "string" ? n.data.label : n.type))
    .slice(0, 4);
  return `${graph.nodes.length} nodes · ${types.length} module types · ${labels.join(" → ")}`;
}

function buildSeedPosts(): CommunityPost[] {
  const now = Date.now();
  const templatePosts: CommunityPost[] = COMMUNITY_TEMPLATES.map((tpl, i) => {
    const graph = tpl.graph as { nodes: GraphNode[]; edges: GraphEdge[] };
    const refinement = calculateModelRefinement(graph);
    return {
      id: `post-tpl-${tpl.id}`,
      type: "template" as const,
      title: tpl.name,
      description: tpl.description,
      authorId: `author-${i + 1}`,
      authorName: ["FlowCraft", "AutoPilot", "DevRel", "ImpactOps"][i] ?? "Community",
      templateSlug: tpl.slug,
      graph,
      refinementScore: refinement.score,
      refinementGrade: refinement.grade,
      capabilitySummary: summarizeCapabilities(graph),
      likes: Array.from({ length: 3 + (i % 5) }, (_, j) => `like-seed-${i}-${j}`),
      commentIds: [],
      createdAt: new Date(now - (i + 1) * 86400000 * 2).toISOString(),
      updatedAt: new Date(now - (i + 1) * 86400000).toISOString(),
      tags: [tpl.category.toLowerCase(), "template"],
      nsfw: false,
      reportCount: 0,
    };
  });

  const designShares: CommunityPost[] = [
    {
      id: "post-design-1",
      type: "design",
      title: "Multimodal intake with OCR fallback",
      description:
        "Vision node extracts form fields from uploaded images; self-heal patches missing values before CRM sync.",
      authorId: "author-design-1",
      authorName: "VisionLab",
      graph: {
        nodes: [
          { id: "d1", type: "vision_ocr", position: { x: 0, y: 0 }, data: { label: "OCR scan" } },
          { id: "d2", type: "transform", position: { x: 220, y: 0 }, data: { label: "Normalize" } },
          { id: "d3", type: "selfHeal", position: { x: 440, y: 0 }, data: { label: "Patch fields" } },
          { id: "d4", type: "integrate_crm", position: { x: 660, y: 0 }, data: { label: "CRM sync" } },
        ],
        edges: [
          { id: "de1", source: "d1", target: "d2" },
          { id: "de2", source: "d2", target: "d3" },
          { id: "de3", source: "d3", target: "d4" },
        ],
      },
      refinementScore: 78,
      refinementGrade: "C",
      capabilitySummary: "4 nodes · vision → transform → heal → CRM",
      likes: ["like-d1", "like-d2", "like-d3"],
      commentIds: [],
      createdAt: new Date(now - 3600000 * 5).toISOString(),
      updatedAt: new Date(now - 3600000 * 2).toISOString(),
      tags: ["design", "multimodal", "ocr"],
      nsfw: false,
      reportCount: 0,
    },
    {
      id: "post-market-1",
      type: "marketplace",
      title: "Enterprise incident response pack",
      description:
        "Production-ready alert routing, health probes, and auto-remediation policies. Battle-tested on high-traffic APIs.",
      authorId: "author-market-1",
      authorName: "SRE Collective",
      templateSlug: "incident-remediation",
      graph: COMMUNITY_TEMPLATES[2].graph as { nodes: GraphNode[]; edges: GraphEdge[] },
      refinementScore: 85,
      refinementGrade: "B",
      capabilitySummary: "3 nodes · alert → probe → restart policy",
      priceCents: 4900,
      likes: ["like-m1", "like-m2", "like-m3", "like-m4", "like-m5"],
      commentIds: [],
      createdAt: new Date(now - 86400000).toISOString(),
      updatedAt: new Date(now - 43200000).toISOString(),
      tags: ["marketplace", "devops", "premium"],
      nsfw: false,
      reportCount: 0,
    },
    {
      id: "post-discussion-1",
      type: "discussion",
      title: "Best practices for self-heal coverage",
      description:
        "What percentage of HTTP nodes should have error-path heal nodes? Sharing patterns from recent production deploys.",
      authorId: "author-disc-1",
      authorName: "Reliability Guild",
      refinementScore: 0,
      refinementGrade: "—",
      capabilitySummary: "Discussion thread",
      likes: ["like-disc-1", "like-disc-2"],
      commentIds: [],
      createdAt: new Date(now - 7200000).toISOString(),
      updatedAt: new Date(now - 7200000).toISOString(),
      tags: ["discussion", "self-heal"],
      nsfw: false,
      reportCount: 0,
    },
  ];

  return [...templatePosts, ...designShares];
}

function buildSeedMessages(): Message[] {
  return [
    {
      id: "msg-1",
      text: "Welcome to the Resync community — share designs, remix templates, and help each other ship reliable workflows.",
      authorId: "system",
      authorName: "Resync",
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ];
}

export function createInitialState(): CommunityState {
  return {
    posts: buildSeedPosts(),
    comments: [],
    messages: buildSeedMessages(),
    reports: [],
    settings: { ...DEFAULT_SETTINGS },
    sessionId: "seed",
    displayName: "Builder",
  };
}

export function loadCommunityState(): CommunityState {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialState();
      initial.sessionId = getSessionId();
      initial.displayName = getDisplayName();
      saveCommunityState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as CommunityState;
    parsed.sessionId = getSessionId();
    parsed.displayName = getDisplayName();
    if (!parsed.settings) parsed.settings = { ...DEFAULT_SETTINGS };
    if (!parsed.messages?.length) parsed.messages = buildSeedMessages();
    return parsed;
  } catch {
    const initial = createInitialState();
    initial.sessionId = getSessionId();
    return initial;
  }
}

export function saveCommunityState(state: CommunityState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function setDisplayName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("resync-display-name", name);
}

export function filterPosts(
  posts: CommunityPost[],
  filter: PostFilter,
  settings: CommunitySettings,
): CommunityPost[] {
  let filtered = posts.filter((p) => {
    if (settings.blockedUserIds.includes(p.authorId)) return false;
    if (settings.hideNsfw && p.nsfw) return false;
    if (settings.hideAbuse && p.reportCount >= 3) return false;
    if (settings.muteWords.length > 0) {
      const text = `${p.title} ${p.description}`.toLowerCase();
      if (settings.muteWords.some((w) => w && text.includes(w.toLowerCase()))) return false;
    }
    return true;
  });

  switch (filter) {
    case "templates":
      filtered = filtered.filter((p) => p.type === "template");
      break;
    case "marketplace":
      filtered = filtered.filter((p) => p.type === "marketplace" || p.priceCents != null);
      break;
    case "trending":
      filtered = [...filtered].sort((a, b) => b.likes.length - a.likes.length);
      break;
    case "new":
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    default:
      break;
  }

  if (filter !== "trending" && filter !== "new") {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return filtered;
}

export function getPostComments(comments: Comment[], postId: string): Comment[] {
  return comments
    .filter((c) => c.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addPost(
  state: CommunityState,
  input: {
    type: PostType;
    title: string;
    description: string;
    graph?: { nodes: GraphNode[]; edges: GraphEdge[] };
    templateSlug?: string;
    priceCents?: number;
    tags?: string[];
  },
): CommunityState {
  const graph = input.graph ?? { nodes: [], edges: [] };
  const refinement =
    graph.nodes.length > 0
      ? calculateModelRefinement(graph)
      : { score: 0, grade: "—", metrics: {} as never, recommendations: [] };

  const post: CommunityPost = {
    id: generateId("post"),
    type: input.type,
    title: input.title,
    description: input.description,
    authorId: state.sessionId,
    authorName: state.displayName,
    templateSlug: input.templateSlug,
    graph: graph.nodes.length > 0 ? graph : undefined,
    refinementScore: refinement.score,
    refinementGrade: refinement.grade,
    capabilitySummary:
      graph.nodes.length > 0 ? summarizeCapabilities(graph) : "Community post",
    priceCents: input.priceCents,
    likes: [],
    commentIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: input.tags ?? [],
    nsfw: false,
    reportCount: 0,
  };

  return {
    ...state,
    posts: [post, ...state.posts],
  };
}

export function toggleLike(state: CommunityState, postId: string): CommunityState {
  return {
    ...state,
    posts: state.posts.map((p) => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(state.sessionId);
      return {
        ...p,
        likes: liked
          ? p.likes.filter((id) => id !== state.sessionId)
          : [...p.likes, state.sessionId],
      };
    }),
  };
}

export function addComment(
  state: CommunityState,
  postId: string,
  text: string,
): CommunityState {
  const comment: Comment = {
    id: generateId("comment"),
    postId,
    authorId: state.sessionId,
    authorName: state.displayName,
    text,
    createdAt: new Date().toISOString(),
  };

  return {
    ...state,
    comments: [...state.comments, comment],
    posts: state.posts.map((p) =>
      p.id === postId ? { ...p, commentIds: [...p.commentIds, comment.id] } : p,
    ),
  };
}

export function addMessage(state: CommunityState, text: string): CommunityState {
  const message: Message = {
    id: generateId("msg"),
    text,
    authorId: state.sessionId,
    authorName: state.displayName,
    createdAt: new Date().toISOString(),
  };
  return { ...state, messages: [...state.messages, message] };
}

export function addReport(
  state: CommunityState,
  input: {
    targetType: Report["targetType"];
    targetId: string;
    reason: string;
    details?: string;
  },
): CommunityState {
  const report: Report = {
    id: generateId("report"),
    targetType: input.targetType,
    targetId: input.targetId,
    reason: input.reason,
    details: input.details,
    reporterId: state.sessionId,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  let posts = state.posts;
  if (input.targetType === "post") {
    posts = posts.map((p) =>
      p.id === input.targetId ? { ...p, reportCount: p.reportCount + 1 } : p,
    );
  }

  return { ...state, reports: [...state.reports, report], posts };
}

export function updateSettings(
  state: CommunityState,
  settings: Partial<CommunitySettings>,
): CommunityState {
  return {
    ...state,
    settings: { ...state.settings, ...settings },
  };
}

export function blockUser(state: CommunityState, userId: string): CommunityState {
  if (state.settings.blockedUserIds.includes(userId)) return state;
  return {
    ...state,
    settings: {
      ...state.settings,
      blockedUserIds: [...state.settings.blockedUserIds, userId],
    },
  };
}

export function unblockUser(state: CommunityState, userId: string): CommunityState {
  return {
    ...state,
    settings: {
      ...state.settings,
      blockedUserIds: state.settings.blockedUserIds.filter((id) => id !== userId),
    },
  };
}
