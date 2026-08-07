/**
 * Resync Toolbox — a registry of 100+ genuinely working, client-side tools.
 *
 * Every `run` is a pure (or Web Crypto async) function with no backend
 * dependency, so each tool produces real output in the browser. The logic here
 * is intentionally free of JSX/enums so it can also be executed and tested with
 * `node --experimental-strip-types`.
 */

export type ToolCategory =
  | "Text"
  | "Encoding"
  | "Data"
  | "Numbers"
  | "Color"
  | "Time"
  | "Crypto"
  | "Generators";

export type ToolKind = "transform" | "generate";

export interface ToolOption {
  key: string;
  label: string;
  type: "number" | "text" | "checkbox";
  default: number | string | boolean;
  min?: number;
  max?: number;
}

export type ToolOpts = Record<string, string | number | boolean>;

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  kind: ToolKind;
  sample?: string;
  options?: ToolOption[];
  run: (input: string, opts: ToolOpts) => string | Promise<string>;
}

// ── helpers ───────────────────────────────────────────────────────────────

function splitLines(s: string): string[] {
  return s.replace(/\r\n/g, "\n").split("\n");
}

function words(s: string): string[] {
  return s.trim().split(/\s+/).filter(Boolean);
}

function num(v: string | number | boolean, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function str(v: string | number | boolean, fallback: string): string {
  return v === undefined || v === null ? fallback : String(v);
}

function bool(v: string | number | boolean): boolean {
  return v === true || v === "true";
}

function toTitle(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function wordParts(s: string): string[] {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toCamel(s: string): string {
  return wordParts(s)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
}

function toSnake(s: string): string {
  return wordParts(s).map((w) => w.toLowerCase()).join("_");
}

function toKebab(s: string): string {
  return wordParts(s).map((w) => w.toLowerCase()).join("-");
}

function toConstant(s: string): string {
  return wordParts(s).map((w) => w.toUpperCase()).join("_");
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function unescapeHtml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function b64encode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function b64decode(s: string): string {
  const bin = atob(s.trim());
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function hexEncode(s: string): string {
  return [...new TextEncoder().encode(s)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hexDecode(s: string): string {
  const clean = s.replace(/\s+/g, "");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  return new TextDecoder().decode(bytes);
}

const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
  i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
  q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
  y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
};
const MORSE_REV: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
);

function romanFromInt(n: number): string {
  if (n <= 0 || n >= 4000) return "out of range (1-3999)";
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, sym] of map) {
    while (n >= v) {
      out += sym;
      n -= v;
    }
  }
  return out;
}

function intFromRoman(s: string): number {
  const vals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const up = s.toUpperCase().trim();
  let total = 0;
  for (let i = 0; i < up.length; i++) {
    const cur = vals[up[i]];
    const next = vals[up[i + 1]];
    if (!cur) return NaN;
    if (next && cur < next) total -= cur;
    else total += cur;
  }
  return total;
}

function numberToWords(n: number): string {
  if (!Number.isFinite(n)) return "not a number";
  if (n === 0) return "zero";
  const neg = n < 0;
  n = Math.abs(Math.trunc(n));
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
    "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const scales = ["", "thousand", "million", "billion", "trillion"];
  function under1000(x: number): string {
    let s = "";
    if (x >= 100) {
      s += ones[Math.floor(x / 100)] + " hundred";
      x %= 100;
      if (x) s += " ";
    }
    if (x >= 20) {
      s += tens[Math.floor(x / 10)];
      if (x % 10) s += "-" + ones[x % 10];
    } else if (x > 0) {
      s += ones[x];
    }
    return s;
  }
  const groups: number[] = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  let out = "";
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    out += under1000(groups[i]);
    if (scales[i]) out += " " + scales[i];
    if (i > 0) out += " ";
  }
  return (neg ? "negative " : "") + out.trim();
}

function hexToRgb(hex: string): string {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return "invalid hex color";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function parseRgb(s: string): [number, number, number] | null {
  const m = s.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return null;
  const r = Number(m[1]), g = Number(m[2]), b = Number(m[3]);
  if ([r, g, b].some((v) => v < 0 || v > 255)) return null;
  return [r, g, b];
}

function rgbToHex(s: string): string {
  const rgb = parseRgb(s);
  if (!rgb) return "invalid rgb (use: 255, 128, 0)";
  return "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
}

function hexToHsl(hex: string): string {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return "invalid hex color";
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }
  return `hsl(${hue}, ${Math.round(sat * 100)}%, ${Math.round(l * 100)}%)`;
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.4152 * a[2];
}

function hexToRgbTuple(hex: string): [number, number, number] | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function crc32(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  crc = (crc ^ 0xffffffff) >>> 0;
  return "0x" + crc.toString(16).padStart(8, "0");
}

async function sha(algo: string, input: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function bytesHuman(n: number): string {
  if (!Number.isFinite(n)) return "not a number";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let i = 0;
  let v = Math.abs(n);
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${(n < 0 ? -v : v).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function msToDuration(ms: number): string {
  if (!Number.isFinite(ms)) return "not a number";
  const parts: string[] = [];
  const units: [string, number][] = [["d", 86400000], ["h", 3600000], ["m", 60000], ["s", 1000], ["ms", 1]];
  let rem = Math.abs(ms);
  for (const [label, size] of units) {
    if (rem >= size || (label === "ms" && parts.length === 0)) {
      const v = Math.floor(rem / size);
      rem -= v * size;
      if (v > 0) parts.push(`${v}${label}`);
    }
  }
  return parts.join(" ") || "0ms";
}

function describeCron(expr: string): string {
  const known: Record<string, string> = {
    "* * * * *": "Every minute",
    "0 * * * *": "Every hour, on the hour",
    "0 0 * * *": "Every day at midnight",
    "0 9 * * *": "Every day at 09:00",
    "0 0 * * 0": "Every Sunday at midnight",
    "0 0 1 * *": "On the 1st of every month at midnight",
    "*/5 * * * *": "Every 5 minutes",
    "*/15 * * * *": "Every 15 minutes",
    "0 */2 * * *": "Every 2 hours",
    "0 0 * * 1-5": "Every weekday at midnight",
  };
  const norm = expr.trim().replace(/\s+/g, " ");
  if (known[norm]) return known[norm];
  const f = norm.split(" ");
  if (f.length !== 5) return "Expected 5 fields: minute hour day-of-month month day-of-week";
  return `At minute ${f[0]}, hour ${f[1]}, day-of-month ${f[2]}, month ${f[3]}, day-of-week ${f[4]}.`;
}

function csvToJson(csv: string): string {
  const rows = splitLines(csv.trim()).filter((l) => l.length > 0);
  if (rows.length === 0) return "[]";
  const parseRow = (row: string): string[] => {
    const out: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (inQ) {
        if (c === '"' && row[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (c === '"') inQ = false;
        else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === ",") {
        out.push(cur);
        cur = "";
      } else cur += c;
    }
    out.push(cur);
    return out;
  };
  const headers = parseRow(rows[0]);
  const data = rows.slice(1).map((r) => {
    const cells = parseRow(r);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h.trim()] = (cells[i] ?? "").trim()));
    return obj;
  });
  return JSON.stringify(data, null, 2);
}

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";
  const headers = Array.from(
    arr.reduce((set: Set<string>, row: Record<string, unknown>) => {
      Object.keys(row ?? {}).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );
  const esc = (v: unknown): string => {
    const s = v === undefined || v === null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [headers.join(",")];
  for (const row of arr) lines.push(headers.map((h) => esc((row ?? {})[h])).join(","));
  return lines.join("\n");
}

function flatten(obj: unknown, prefix: string, out: Record<string, unknown>): void {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else {
    out[prefix] = obj;
  }
}

function toYaml(obj: unknown, indent: number): string {
  const pad = "  ".repeat(indent);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj
      .map((v) =>
        v && typeof v === "object"
          ? `${pad}-\n${toYaml(v, indent + 1)}`
          : `${pad}- ${String(v)}`
      )
      .join("\n");
  }
  if (obj && typeof obj === "object") {
    return Object.entries(obj)
      .map(([k, v]) =>
        v && typeof v === "object"
          ? `${pad}${k}:\n${toYaml(v, indent + 1)}`
          : `${pad}${k}: ${String(v)}`
      )
      .join("\n");
  }
  return `${pad}${String(obj)}`;
}

function jsonPaths(obj: unknown, prefix: string, out: string[]): void {
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      const p = Array.isArray(obj) ? `${prefix}[${k}]` : prefix ? `${prefix}.${k}` : k;
      out.push(p);
      jsonPaths(v, p, out);
    }
  }
}

function randHex(len: number): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const LOREM =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(
    " "
  );

// ── registry ────────────────────────────────────────────────────────────────

export const TOOLS: Tool[] = [
  // Text
  { id: "uppercase", name: "Uppercase", category: "Text", description: "Convert text to UPPERCASE.", kind: "transform", sample: "Hello world", run: (i) => i.toUpperCase() },
  { id: "lowercase", name: "Lowercase", category: "Text", description: "Convert text to lowercase.", kind: "transform", sample: "Hello WORLD", run: (i) => i.toLowerCase() },
  { id: "title-case", name: "Title Case", category: "Text", description: "Capitalize the first letter of each word.", kind: "transform", sample: "the quick brown fox", run: (i) => toTitle(i) },
  { id: "sentence-case", name: "Sentence case", category: "Text", description: "Capitalize the first letter of each sentence.", kind: "transform", sample: "hello. how are you? fine.", run: (i) => i.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()) },
  { id: "camel-case", name: "camelCase", category: "Text", description: "Convert to camelCase.", kind: "transform", sample: "hello world foo", run: (i) => toCamel(i) },
  { id: "snake-case", name: "snake_case", category: "Text", description: "Convert to snake_case.", kind: "transform", sample: "Hello World Foo", run: (i) => toSnake(i) },
  { id: "kebab-case", name: "kebab-case", category: "Text", description: "Convert to kebab-case.", kind: "transform", sample: "Hello World Foo", run: (i) => toKebab(i) },
  { id: "constant-case", name: "CONSTANT_CASE", category: "Text", description: "Convert to CONSTANT_CASE.", kind: "transform", sample: "Hello World Foo", run: (i) => toConstant(i) },
  { id: "reverse-text", name: "Reverse text", category: "Text", description: "Reverse the characters of the text.", kind: "transform", sample: "abcdef", run: (i) => [...i].reverse().join("") },
  { id: "reverse-words", name: "Reverse words", category: "Text", description: "Reverse the order of words.", kind: "transform", sample: "one two three", run: (i) => words(i).reverse().join(" ") },
  { id: "remove-spaces", name: "Collapse spaces", category: "Text", description: "Collapse runs of whitespace into a single space.", kind: "transform", sample: "a    b   c", run: (i) => i.replace(/\s+/g, " ").trim() },
  { id: "trim-lines", name: "Trim lines", category: "Text", description: "Trim leading/trailing whitespace on each line.", kind: "transform", sample: "  a  \n  b  ", run: (i) => splitLines(i).map((l) => l.trim()).join("\n") },
  { id: "remove-blank-lines", name: "Remove blank lines", category: "Text", description: "Delete empty lines.", kind: "transform", sample: "a\n\n\nb", run: (i) => splitLines(i).filter((l) => l.trim()).join("\n") },
  { id: "sort-lines-asc", name: "Sort lines A→Z", category: "Text", description: "Sort lines alphabetically.", kind: "transform", sample: "banana\napple\ncherry", run: (i) => splitLines(i).sort((a, b) => a.localeCompare(b)).join("\n") },
  { id: "sort-lines-desc", name: "Sort lines Z→A", category: "Text", description: "Sort lines reverse-alphabetically.", kind: "transform", sample: "apple\nbanana\ncherry", run: (i) => splitLines(i).sort((a, b) => b.localeCompare(a)).join("\n") },
  { id: "sort-lines-num", name: "Sort lines numeric", category: "Text", description: "Sort lines by numeric value.", kind: "transform", sample: "10\n2\n33\n4", run: (i) => splitLines(i).sort((a, b) => parseFloat(a) - parseFloat(b)).join("\n") },
  { id: "dedupe-lines", name: "Unique lines", category: "Text", description: "Remove duplicate lines.", kind: "transform", sample: "a\nb\na\nc\nb", run: (i) => [...new Set(splitLines(i))].join("\n") },
  { id: "shuffle-lines", name: "Shuffle lines", category: "Text", description: "Randomly reorder lines.", kind: "transform", sample: "1\n2\n3\n4\n5", run: (i) => { const a = splitLines(i); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a.join("\n"); } },
  { id: "count-chars", name: "Character count", category: "Text", description: "Count characters (incl. spaces).", kind: "transform", sample: "hello", run: (i) => String([...i].length) },
  { id: "count-words", name: "Word count", category: "Text", description: "Count words.", kind: "transform", sample: "the quick brown fox", run: (i) => String(words(i).length) },
  { id: "count-lines", name: "Line count", category: "Text", description: "Count lines.", kind: "transform", sample: "a\nb\nc", run: (i) => String(splitLines(i).length) },
  { id: "text-stats", name: "Text statistics", category: "Text", description: "Characters, words, lines, and sentences.", kind: "transform", sample: "Hello world. How are you?", run: (i) => `characters: ${[...i].length}\nwords: ${words(i).length}\nlines: ${splitLines(i).length}\nsentences: ${(i.match(/[.!?]+/g) || []).length}` },
  { id: "slugify", name: "Slugify", category: "Text", description: "Make a URL-safe slug.", kind: "transform", sample: "Héllo, World! 2024", run: (i) => slugify(i) },
  { id: "strip-html", name: "Strip HTML", category: "Text", description: "Remove HTML tags.", kind: "transform", sample: "<p>Hi <b>there</b></p>", run: (i) => i.replace(/<[^>]*>/g, "") },
  { id: "escape-html", name: "Escape HTML", category: "Text", description: "Escape HTML special characters.", kind: "transform", sample: '<a href="x">&\'', run: (i) => escapeHtml(i) },
  { id: "unescape-html", name: "Unescape HTML", category: "Text", description: "Decode HTML entities.", kind: "transform", sample: "&lt;a&gt;&amp;&#39;", run: (i) => unescapeHtml(i) },
  { id: "remove-accents", name: "Remove accents", category: "Text", description: "Strip diacritics from characters.", kind: "transform", sample: "Crème brûlée", run: (i) => i.normalize("NFD").replace(/[\u0300-\u036f]/g, "") },
  { id: "rot13", name: "ROT13", category: "Text", description: "Apply the ROT13 cipher.", kind: "transform", sample: "Hello", run: (i) => i.replace(/[a-z]/gi, (c) => { const base = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base); }) },
  { id: "line-numbers", name: "Add line numbers", category: "Text", description: "Prefix each line with its number.", kind: "transform", sample: "alpha\nbeta\ngamma", run: (i) => splitLines(i).map((l, n) => `${n + 1}. ${l}`).join("\n") },
  { id: "wrap-text", name: "Wrap text", category: "Text", description: "Hard-wrap text at a column width.", kind: "transform", sample: "The quick brown fox jumps over the lazy dog again and again", options: [{ key: "width", label: "Width", type: "number", default: 20, min: 5, max: 200 }], run: (i, o) => { const w = num(o.width, 20); return words(i).reduce((acc: string[], word) => { const last = acc[acc.length - 1]; if (last && (last + " " + word).length <= w) acc[acc.length - 1] = last + " " + word; else acc.push(word); return acc; }, []).join("\n"); } },
  { id: "repeat-text", name: "Repeat text", category: "Text", description: "Repeat the input N times.", kind: "transform", sample: "ab", options: [{ key: "count", label: "Count", type: "number", default: 3, min: 1, max: 1000 }], run: (i, o) => Array(Math.max(1, num(o.count, 3))).fill(i).join("") },
  { id: "extract-emails", name: "Extract emails", category: "Text", description: "Find all email addresses.", kind: "transform", sample: "a@x.com and b@y.io", run: (i) => (i.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g) || []).join("\n") },
  { id: "extract-urls", name: "Extract URLs", category: "Text", description: "Find all http(s) URLs.", kind: "transform", sample: "see https://a.com and http://b.io/x", run: (i) => (i.match(/https?:\/\/[^\s]+/g) || []).join("\n") },
  { id: "extract-numbers", name: "Extract numbers", category: "Text", description: "Find all numbers.", kind: "transform", sample: "order 12 costs 3.50 usd", run: (i) => (i.match(/-?\d+(\.\d+)?/g) || []).join("\n") },
  { id: "find-replace", name: "Find & replace", category: "Text", description: "Replace all occurrences of a string.", kind: "transform", sample: "foo bar foo", options: [{ key: "find", label: "Find", type: "text", default: "foo" }, { key: "replace", label: "Replace", type: "text", default: "baz" }], run: (i, o) => { const f = str(o.find, ""); return f ? i.split(f).join(str(o.replace, "")) : i; } },
  { id: "text-to-binary", name: "Text → binary", category: "Text", description: "Convert text to binary (8-bit).", kind: "transform", sample: "Hi", run: (i) => [...new TextEncoder().encode(i)].map((b) => b.toString(2).padStart(8, "0")).join(" ") },
  { id: "binary-to-text", name: "Binary → text", category: "Text", description: "Convert space-separated binary to text.", kind: "transform", sample: "01001000 01101001", run: (i) => { const bytes = i.trim().split(/\s+/).map((b) => parseInt(b, 2)); return new TextDecoder().decode(Uint8Array.from(bytes)); } },
  { id: "text-to-morse", name: "Text → Morse", category: "Text", description: "Encode text as Morse code.", kind: "transform", sample: "sos", run: (i) => i.toLowerCase().split("").map((c) => (c === " " ? "/" : MORSE[c] ?? "")).filter(Boolean).join(" ") },
  { id: "morse-to-text", name: "Morse → text", category: "Text", description: "Decode Morse code (space-separated).", kind: "transform", sample: "... --- ...", run: (i) => i.trim().split(" ").map((m) => (m === "/" ? " " : MORSE_REV[m] ?? "")).join("") },

  // Encoding
  { id: "base64-encode", name: "Base64 encode", category: "Encoding", description: "Encode text to Base64 (UTF-8 safe).", kind: "transform", sample: "Hello, 世界", run: (i) => b64encode(i) },
  { id: "base64-decode", name: "Base64 decode", category: "Encoding", description: "Decode Base64 to text.", kind: "transform", sample: "SGVsbG8sIOS4lueVjA==", run: (i) => b64decode(i) },
  { id: "base64url-encode", name: "Base64URL encode", category: "Encoding", description: "URL-safe Base64 encoding.", kind: "transform", sample: "subjects?_d=1", run: (i) => b64encode(i).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") },
  { id: "url-encode", name: "URL encode", category: "Encoding", description: "Percent-encode a component.", kind: "transform", sample: "a b&c=d", run: (i) => encodeURIComponent(i) },
  { id: "url-decode", name: "URL decode", category: "Encoding", description: "Decode a percent-encoded component.", kind: "transform", sample: "a%20b%26c%3Dd", run: (i) => decodeURIComponent(i) },
  { id: "html-entities", name: "HTML entity encode", category: "Encoding", description: "Encode non-ASCII to numeric HTML entities.", kind: "transform", sample: "café ☕", run: (i) => [...i].map((c) => (c.charCodeAt(0) > 127 ? `&#${c.charCodeAt(0)};` : c)).join("") },
  { id: "hex-encode", name: "Hex encode", category: "Encoding", description: "Encode text as hex (UTF-8).", kind: "transform", sample: "Hi!", run: (i) => hexEncode(i) },
  { id: "hex-decode", name: "Hex decode", category: "Encoding", description: "Decode hex to text.", kind: "transform", sample: "486921", run: (i) => hexDecode(i) },
  { id: "unicode-escape", name: "Unicode escape", category: "Encoding", description: "Escape to \\uXXXX sequences.", kind: "transform", sample: "A☕", run: (i) => [...i].map((c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")).join("") },
  { id: "unicode-unescape", name: "Unicode unescape", category: "Encoding", description: "Decode \\uXXXX sequences.", kind: "transform", sample: "\\u0041\\u2615", run: (i) => i.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))) },
  { id: "json-string-escape", name: "JSON string escape", category: "Encoding", description: "Escape text as a JSON string literal.", kind: "transform", sample: 'line1\n"quoted"', run: (i) => JSON.stringify(i) },
  { id: "json-string-unescape", name: "JSON string unescape", category: "Encoding", description: "Parse a JSON string literal to raw text.", kind: "transform", sample: '"line1\\n\\"quoted\\""', run: (i) => { const v = JSON.parse(i); if (typeof v !== "string") throw new Error("not a JSON string"); return v; } },

  // Data
  { id: "json-pretty", name: "JSON pretty print", category: "Data", description: "Format JSON with 2-space indentation.", kind: "transform", sample: '{"a":1,"b":[2,3]}', run: (i) => JSON.stringify(JSON.parse(i), null, 2) },
  { id: "json-minify", name: "JSON minify", category: "Data", description: "Compact JSON to a single line.", kind: "transform", sample: '{\n  "a": 1\n}', run: (i) => JSON.stringify(JSON.parse(i)) },
  { id: "json-validate", name: "JSON validate", category: "Data", description: "Check whether JSON is valid.", kind: "transform", sample: '{"ok": true}', run: (i) => { JSON.parse(i); return "Valid JSON ✓"; } },
  { id: "json-sort-keys", name: "JSON sort keys", category: "Data", description: "Recursively sort object keys.", kind: "transform", sample: '{"b":1,"a":2}', run: (i) => { const sort = (v: unknown): unknown => Array.isArray(v) ? v.map(sort) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sort((v as Record<string, unknown>)[k])])) : v; return JSON.stringify(sort(JSON.parse(i)), null, 2); } },
  { id: "json-to-query", name: "JSON → query string", category: "Data", description: "Turn a flat object into a query string.", kind: "transform", sample: '{"q":"hi","page":2}', run: (i) => new URLSearchParams(Object.entries(JSON.parse(i)).map(([k, v]) => [k, String(v)])).toString() },
  { id: "query-to-json", name: "Query string → JSON", category: "Data", description: "Parse a query string into JSON.", kind: "transform", sample: "q=hi&page=2", run: (i) => JSON.stringify(Object.fromEntries(new URLSearchParams(i.replace(/^\?/, ""))), null, 2) },
  { id: "csv-to-json", name: "CSV → JSON", category: "Data", description: "Convert CSV (with header row) to JSON.", kind: "transform", sample: "name,age\nAva,31\nMax,27", run: (i) => csvToJson(i) },
  { id: "json-to-csv", name: "JSON → CSV", category: "Data", description: "Convert an array of objects to CSV.", kind: "transform", sample: '[{"name":"Ava","age":31},{"name":"Max","age":27}]', run: (i) => jsonToCsv(i) },
  { id: "flatten-json", name: "Flatten JSON", category: "Data", description: "Flatten nested JSON to dotted keys.", kind: "transform", sample: '{"a":{"b":1},"c":[2,3]}', run: (i) => { const out: Record<string, unknown> = {}; flatten(JSON.parse(i), "", out); return JSON.stringify(out, null, 2); } },
  { id: "jwt-decode", name: "JWT decode", category: "Data", description: "Decode a JWT header & payload (no verify).", kind: "transform", sample: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiQXZhIn0.sig", run: (i) => { const p = i.trim().split("."); if (p.length < 2) throw new Error("not a JWT"); const dec = (s: string) => b64decode(s.replace(/-/g, "+").replace(/_/g, "/")); return `header:\n${JSON.stringify(JSON.parse(dec(p[0])), null, 2)}\n\npayload:\n${JSON.stringify(JSON.parse(dec(p[1])), null, 2)}`; } },
  { id: "json-to-yaml", name: "JSON → YAML", category: "Data", description: "Convert JSON to simple YAML.", kind: "transform", sample: '{"name":"Ava","tags":["a","b"]}', run: (i) => toYaml(JSON.parse(i), 0) },
  { id: "json-paths", name: "JSON paths", category: "Data", description: "List every key path in the JSON.", kind: "transform", sample: '{"a":{"b":1},"c":[10]}', run: (i) => { const out: string[] = []; jsonPaths(JSON.parse(i), "", out); return out.join("\n"); } },
  { id: "csv-to-markdown", name: "CSV → Markdown table", category: "Data", description: "Render CSV as a Markdown table.", kind: "transform", sample: "name,age\nAva,31\nMax,27", run: (i) => { const rows = splitLines(i.trim()).map((r) => r.split(",")); if (!rows.length) return ""; const head = `| ${rows[0].join(" | ")} |`; const sep = `| ${rows[0].map(() => "---").join(" | ")} |`; const body = rows.slice(1).map((r) => `| ${r.join(" | ")} |`); return [head, sep, ...body].join("\n"); } },
  { id: "lines-to-json", name: "Lines → JSON array", category: "Data", description: "Turn each line into a JSON string array item.", kind: "transform", sample: "apple\nbanana\ncherry", run: (i) => JSON.stringify(splitLines(i).filter((l) => l.length), null, 2) },

  // Numbers
  { id: "dec-to-bin", name: "Decimal → binary", category: "Numbers", description: "Convert a decimal integer to binary.", kind: "transform", sample: "42", run: (i) => { const n = parseInt(i.trim(), 10); return Number.isFinite(n) ? n.toString(2) : "not an integer"; } },
  { id: "bin-to-dec", name: "Binary → decimal", category: "Numbers", description: "Convert binary to decimal.", kind: "transform", sample: "101010", run: (i) => { const n = parseInt(i.trim(), 2); return Number.isFinite(n) ? String(n) : "invalid binary"; } },
  { id: "dec-to-hex", name: "Decimal → hex", category: "Numbers", description: "Convert a decimal integer to hex.", kind: "transform", sample: "255", run: (i) => { const n = parseInt(i.trim(), 10); return Number.isFinite(n) ? "0x" + n.toString(16) : "not an integer"; } },
  { id: "hex-to-dec", name: "Hex → decimal", category: "Numbers", description: "Convert hex to decimal.", kind: "transform", sample: "ff", run: (i) => { const n = parseInt(i.trim().replace(/^0x/i, ""), 16); return Number.isFinite(n) ? String(n) : "invalid hex"; } },
  { id: "dec-to-oct", name: "Decimal → octal", category: "Numbers", description: "Convert a decimal integer to octal.", kind: "transform", sample: "64", run: (i) => { const n = parseInt(i.trim(), 10); return Number.isFinite(n) ? "0o" + n.toString(8) : "not an integer"; } },
  { id: "oct-to-dec", name: "Octal → decimal", category: "Numbers", description: "Convert octal to decimal.", kind: "transform", sample: "100", run: (i) => { const n = parseInt(i.trim().replace(/^0o/i, ""), 8); return Number.isFinite(n) ? String(n) : "invalid octal"; } },
  { id: "int-to-roman", name: "Integer → Roman", category: "Numbers", description: "Convert 1–3999 to Roman numerals.", kind: "transform", sample: "2024", run: (i) => romanFromInt(parseInt(i.trim(), 10)) },
  { id: "roman-to-int", name: "Roman → integer", category: "Numbers", description: "Convert Roman numerals to an integer.", kind: "transform", sample: "MMXXIV", run: (i) => { const n = intFromRoman(i); return Number.isFinite(n) ? String(n) : "invalid roman numeral"; } },
  { id: "number-to-words", name: "Number → words", category: "Numbers", description: "Spell out an integer in English.", kind: "transform", sample: "1234567", run: (i) => numberToWords(parseFloat(i.trim())) },
  { id: "sum-numbers", name: "Sum numbers", category: "Numbers", description: "Sum all numbers found in the input.", kind: "transform", sample: "10\n20\n5.5", run: (i) => String((i.match(/-?\d+(\.\d+)?/g) || []).reduce((a, b) => a + parseFloat(b), 0)) },
  { id: "avg-numbers", name: "Average numbers", category: "Numbers", description: "Average all numbers found in the input.", kind: "transform", sample: "10\n20\n30", run: (i) => { const ns = (i.match(/-?\d+(\.\d+)?/g) || []).map(parseFloat); return ns.length ? String(ns.reduce((a, b) => a + b, 0) / ns.length) : "no numbers"; } },
  { id: "minmax-numbers", name: "Min / max", category: "Numbers", description: "Find the min and max of the numbers.", kind: "transform", sample: "4\n9\n1\n7", run: (i) => { const ns = (i.match(/-?\d+(\.\d+)?/g) || []).map(parseFloat); return ns.length ? `min: ${Math.min(...ns)}\nmax: ${Math.max(...ns)}` : "no numbers"; } },
  { id: "bytes-humanize", name: "Bytes → human", category: "Numbers", description: "Format a byte count (e.g. 1536 → 1.50 KB).", kind: "transform", sample: "1048576", run: (i) => bytesHuman(parseFloat(i.trim())) },
  { id: "c-to-f", name: "Celsius → Fahrenheit", category: "Numbers", description: "Convert °C to °F.", kind: "transform", sample: "100", run: (i) => { const c = parseFloat(i.trim()); return Number.isFinite(c) ? `${(c * 9) / 5 + 32}°F` : "not a number"; } },
  { id: "f-to-c", name: "Fahrenheit → Celsius", category: "Numbers", description: "Convert °F to °C.", kind: "transform", sample: "212", run: (i) => { const f = parseFloat(i.trim()); return Number.isFinite(f) ? `${((f - 32) * 5) / 9}°C` : "not a number"; } },
  { id: "round-format", name: "Round number", category: "Numbers", description: "Round to N decimal places.", kind: "transform", sample: "3.14159", options: [{ key: "decimals", label: "Decimals", type: "number", default: 2, min: 0, max: 12 }], run: (i, o) => { const n = parseFloat(i.trim()); return Number.isFinite(n) ? n.toFixed(num(o.decimals, 2)) : "not a number"; } },

  // Color
  { id: "hex-to-rgb", name: "HEX → RGB", category: "Color", description: "Convert a hex color to rgb().", kind: "transform", sample: "#22d3ee", run: (i) => hexToRgb(i) },
  { id: "rgb-to-hex", name: "RGB → HEX", category: "Color", description: "Convert rgb values to hex.", kind: "transform", sample: "34, 211, 238", run: (i) => rgbToHex(i) },
  { id: "hex-to-hsl", name: "HEX → HSL", category: "Color", description: "Convert a hex color to hsl().", kind: "transform", sample: "#6366f1", run: (i) => hexToHsl(i) },
  { id: "contrast-ratio", name: "Contrast ratio", category: "Color", description: "WCAG contrast ratio between two hex colors.", kind: "transform", sample: "#ffffff #050508", run: (i) => { const parts = i.trim().split(/\s+/); const a = hexToRgbTuple(parts[0] || ""); const b = hexToRgbTuple(parts[1] || ""); if (!a || !b) return "provide two hex colors, e.g. #fff #000"; const l1 = relLuminance(a) + 0.05; const l2 = relLuminance(b) + 0.05; const ratio = Math.max(l1, l2) / Math.min(l1, l2); return `${ratio.toFixed(2)}:1 (${ratio >= 4.5 ? "AA pass" : ratio >= 3 ? "AA large only" : "fail"})`; } },
  { id: "hex-to-cssvar", name: "HEX → CSS variable", category: "Color", description: "Wrap a hex color as a CSS custom property.", kind: "transform", sample: "#22d3ee", run: (i) => `--color: ${i.trim()};` },

  // Time
  { id: "unix-to-date", name: "Unix → date", category: "Time", description: "Convert a Unix timestamp (s or ms) to ISO.", kind: "transform", sample: "1735689600", run: (i) => { let n = parseInt(i.trim(), 10); if (!Number.isFinite(n)) return "not a number"; if (i.trim().length <= 10) n *= 1000; return new Date(n).toISOString(); } },
  { id: "date-to-unix", name: "Date → Unix", category: "Time", description: "Convert a date string to a Unix timestamp.", kind: "transform", sample: "2025-01-01T00:00:00Z", run: (i) => { const t = Date.parse(i.trim()); return Number.isFinite(t) ? String(Math.floor(t / 1000)) : "invalid date"; } },
  { id: "ms-to-duration", name: "ms → duration", category: "Time", description: "Humanize a millisecond duration.", kind: "transform", sample: "90061000", run: (i) => msToDuration(parseFloat(i.trim())) },
  { id: "cron-describe", name: "Cron describe", category: "Time", description: "Explain a 5-field cron expression.", kind: "transform", sample: "*/15 * * * *", run: (i) => describeCron(i) },

  // Crypto
  { id: "sha256", name: "SHA-256", category: "Crypto", description: "SHA-256 hash (hex).", kind: "transform", sample: "hello", run: (i) => sha("SHA-256", i) },
  { id: "sha1", name: "SHA-1", category: "Crypto", description: "SHA-1 hash (hex).", kind: "transform", sample: "hello", run: (i) => sha("SHA-1", i) },
  { id: "sha384", name: "SHA-384", category: "Crypto", description: "SHA-384 hash (hex).", kind: "transform", sample: "hello", run: (i) => sha("SHA-384", i) },
  { id: "sha512", name: "SHA-512", category: "Crypto", description: "SHA-512 hash (hex).", kind: "transform", sample: "hello", run: (i) => sha("SHA-512", i) },
  { id: "crc32", name: "CRC32", category: "Crypto", description: "CRC32 checksum (hex).", kind: "transform", sample: "hello", run: (i) => crc32(i) },

  // Generators
  { id: "uuid-v4", name: "UUID v4", category: "Generators", description: "Generate a random UUID.", kind: "generate", run: () => crypto.randomUUID() },
  { id: "random-hex", name: "Random bytes (hex)", category: "Generators", description: "Generate random bytes as hex.", kind: "generate", options: [{ key: "bytes", label: "Bytes", type: "number", default: 16, min: 1, max: 128 }], run: (_i, o) => randHex(num(o.bytes, 16)) },
  { id: "password", name: "Password generator", category: "Generators", description: "Generate a strong random password.", kind: "generate", options: [{ key: "length", label: "Length", type: "number", default: 20, min: 6, max: 128 }, { key: "symbols", label: "Symbols", type: "checkbox", default: true }], run: (_i, o) => { const len = num(o.length, 20); const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; const syms = "!@#$%^&*()-_=+[]{}"; const chars = base + (bool(o.symbols) ? syms : ""); const bytes = new Uint8Array(len); crypto.getRandomValues(bytes); return [...bytes].map((b) => chars[b % chars.length]).join(""); } },
  { id: "token", name: "API token", category: "Generators", description: "Generate a URL-safe API-style token.", kind: "generate", run: () => "rk_" + randHex(24) },
  { id: "lorem", name: "Lorem ipsum", category: "Generators", description: "Generate placeholder paragraphs.", kind: "generate", options: [{ key: "paragraphs", label: "Paragraphs", type: "number", default: 2, min: 1, max: 10 }], run: (_i, o) => { const count = num(o.paragraphs, 2); const para = () => { const len = 30 + Math.floor(Math.random() * 30); const w: string[] = []; for (let k = 0; k < len; k++) w.push(LOREM[Math.floor(Math.random() * LOREM.length)]); const s = w.join(" "); return s[0].toUpperCase() + s.slice(1) + "."; }; return Array.from({ length: count }, para).join("\n\n"); } },
  { id: "random-number", name: "Random number", category: "Generators", description: "Generate a random integer in a range.", kind: "generate", options: [{ key: "min", label: "Min", type: "number", default: 1 }, { key: "max", label: "Max", type: "number", default: 100 }], run: (_i, o) => { const min = num(o.min, 1); const max = num(o.max, 100); const lo = Math.min(min, max); const hi = Math.max(min, max); return String(lo + Math.floor(Math.random() * (hi - lo + 1))); } },
  { id: "random-color", name: "Random color", category: "Generators", description: "Generate a random hex color.", kind: "generate", run: () => "#" + randHex(3) },
  { id: "now-unix", name: "Current Unix time", category: "Generators", description: "Current Unix timestamp (seconds).", kind: "generate", run: () => String(Math.floor(Date.now() / 1000)) },
  { id: "now-iso", name: "Current ISO time", category: "Generators", description: "Current time in ISO 8601.", kind: "generate", run: () => new Date().toISOString() },
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  "Text",
  "Encoding",
  "Data",
  "Numbers",
  "Color",
  "Time",
  "Crypto",
  "Generators",
];

export function toolsByCategory(): Record<ToolCategory, Tool[]> {
  const acc = {} as Record<ToolCategory, Tool[]>;
  for (const t of TOOLS) {
    (acc[t.category] ||= []).push(t);
  }
  return acc;
}

export const TOOL_COUNT = TOOLS.length;
