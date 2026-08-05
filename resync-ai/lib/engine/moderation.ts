const EXACT_BLOCKLIST = [
  "nigger",
  "nigga",
  "chink",
  "gook",
  "kike",
  "spic",
  "wetback",
  "faggot",
  "fag",
  "retard",
  "tranny",
];

const EXpletive_BLOCKLIST = [
  "fuck",
  "fucking",
  "fucker",
  "shit",
  "shitty",
  "bitch",
  "asshole",
  "bastard",
  "damn",
  "cunt",
  "dick",
  "pussy",
  "cock",
  "whore",
  "slut",
];

const HARASSMENT_PATTERNS = [
  /\bkill\s+(your)?self\b/i,
  /\bgo\s+die\b/i,
  /\bi\s+will\s+(hurt|kill|attack)\s+you\b/i,
  /\byou\s+should\s+die\b/i,
  /\bworthless\s+(piece|human)\b/i,
  /\bstupid\s+(idiot|moron|bitch)\b/i,
];

const DISCRIMINATION_PATTERNS = [
  /\b(all|every)\s+\w+\s+(are|should)\s+(die|leave|ban)\b/i,
  /\b(racial|religious)\s+purification\b/i,
  /\b(white|black)\s+supremac/i,
  /\bethnic\s+cleansing\b/i,
  /\bdeport\s+all\s+\w+/i,
];

export interface ModerationResult {
  allowed: boolean;
  reasons: string[];
}

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[0@$]/g, (c) => (c === "0" ? "o" : c === "@" ? "a" : "s"))
    .replace(/[^a-z\s]/g, " ");
}

function findExactMatches(text: string, list: string[], category: string): string[] {
  const normalized = normalizeForMatch(text);
  const words = normalized.split(/\s+/);
  const reasons: string[] = [];
  for (const blocked of list) {
    if (words.includes(blocked) || normalized.includes(` ${blocked} `) || normalized.startsWith(`${blocked} `) || normalized.endsWith(` ${blocked}`)) {
      reasons.push(`${category}: blocked term detected`);
    }
  }
  return reasons;
}

function findPatternMatches(text: string, patterns: RegExp[], category: string): string[] {
  const reasons: string[] = [];
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      reasons.push(`${category}: harmful pattern detected`);
    }
  }
  return reasons;
}

export function moderateText(text: string): ModerationResult {
  if (!text || text.trim().length === 0) {
    return { allowed: true, reasons: [] };
  }

  const reasons: string[] = [
    ...findExactMatches(text, EXACT_BLOCKLIST, "racism"),
    ...findExactMatches(text, EXpletive_BLOCKLIST, "expletive"),
    ...findPatternMatches(text, HARASSMENT_PATTERNS, "harassment"),
    ...findPatternMatches(text, DISCRIMINATION_PATTERNS, "discrimination"),
  ];

  return {
    allowed: reasons.length === 0,
    reasons: [...new Set(reasons)],
  };
}

function buildRedactionPattern(): RegExp {
  const allTerms = [...EXACT_BLOCKLIST, ...EXpletive_BLOCKLIST];
  const escaped = allTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
}

const REDACTION_PATTERN = buildRedactionPattern();

export function sanitizeForDisplay(text: string): string {
  if (!text) return text;
  let result = text.replace(REDACTION_PATTERN, (match) => "*".repeat(match.length));

  for (const pattern of [...HARASSMENT_PATTERNS, ...DISCRIMINATION_PATTERNS]) {
    result = result.replace(pattern, "[redacted]");
  }

  return result;
}
