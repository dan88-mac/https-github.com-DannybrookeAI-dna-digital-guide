#!/usr/bin/env node
/** Quick verification: unique module count >= 200 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const file = join(dirname(fileURLToPath(import.meta.url)), "../lib/engine/moduleCatalog.ts");
const src = readFileSync(file, "utf8");
const ids = [...src.matchAll(/^\s+id:\s+"([^"]+)"/gm)].map((m) => m[1]);
const unique = new Set(ids);

console.log(`Total module entries: ${ids.length}`);
console.log(`Unique IDs: ${unique.size}`);

if (unique.size !== ids.length) {
  const seen = new Set();
  const dupes = ids.filter((id) => (seen.has(id) ? true : (seen.add(id), false)));
  console.error("Duplicates:", [...new Set(dupes)]);
  process.exit(1);
}

if (unique.size < 200) {
  console.error(`FAIL: need >= 200 modules, got ${unique.size}`);
  process.exit(1);
}

console.log("PASS: module count >= 200");
const cats = [...src.matchAll(/category:\s+"([^"]+)"/g)].map((m) => m[1]);
console.log(`Categories (${new Set(cats).size}):`, [...new Set(cats)].sort().join(", "));
