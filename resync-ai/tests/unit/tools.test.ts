import { describe, expect, it } from "vitest";
import { TOOLS, TOOL_COUNT, type Tool, type ToolOpts } from "@/lib/tools/logic";

function defaults(tool: Tool): ToolOpts {
  const o: ToolOpts = {};
  for (const opt of tool.options ?? []) o[opt.key] = opt.default;
  return o;
}

const byId = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
const run = (id: string, input: string, opts: ToolOpts = {}) => byId[id].run(input, opts);

describe("toolbox registry", () => {
  it("ships 100+ tools with unique ids", () => {
    expect(TOOL_COUNT).toBeGreaterThanOrEqual(100);
    expect(new Set(TOOLS.map((t) => t.id)).size).toBe(TOOLS.length);
  });

  it("every tool runs on its sample without throwing and returns a string", async () => {
    for (const t of TOOLS) {
      const out = await t.run(t.sample ?? "", defaults(t));
      expect(typeof out, `${t.id} should return a string`).toBe("string");
    }
  });
});

describe("toolbox correctness", () => {
  it("text transforms", () => {
    expect(run("camel-case", "Hello World Foo")).toBe("helloWorldFoo");
    expect(run("snake-case", "Hello World Foo")).toBe("hello_world_foo");
    expect(run("slugify", "Héllo, World! 2024")).toBe("hello-world-2024");
    expect(run("rot13", run("rot13", "Hello, World"))).toBe("Hello, World");
    expect(run("dedupe-lines", "a\nb\na\nc\nb")).toBe("a\nb\nc");
  });

  it("encoding round-trips", () => {
    expect(run("base64-decode", run("base64-encode", "Hello, 世界"))).toBe("Hello, 世界");
    expect(run("hex-encode", "Hi!")).toBe("486921");
    expect(run("hex-decode", "486921")).toBe("Hi!");
    expect(run("url-encode", "a b&c")).toBe("a%20b%26c");
  });

  it("data conversions", () => {
    expect(run("json-minify", '{\n  "a": 1\n}')).toBe('{"a":1}');
    expect(run("json-to-csv", '[{"name":"Ava","age":31},{"name":"Max","age":27}]')).toBe(
      "name,age\nAva,31\nMax,27"
    );
    expect(run("csv-to-json", "name,age\nAva,31")).toContain('"name": "Ava"');
  });

  it("number conversions", () => {
    expect(run("dec-to-bin", "42")).toBe("101010");
    expect(run("int-to-roman", "2024")).toBe("MMXXIV");
    expect(run("roman-to-int", "MMXXIV")).toBe("2024");
    expect(run("number-to-words", "1234")).toBe("one thousand two hundred thirty-four");
    expect(run("bytes-humanize", "1048576")).toBe("1.00 MB");
    expect(run("c-to-f", "100")).toBe("212°F");
  });

  it("color conversions", () => {
    expect(run("hex-to-rgb", "#22d3ee")).toBe("rgb(34, 211, 238)");
    expect(run("rgb-to-hex", "34, 211, 238")).toBe("#22d3ee");
  });

  it("crypto hashes", async () => {
    expect(await run("sha256", "abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
    expect(run("crc32", "hello")).toBe("0x3610a686");
  });

  it("generators produce valid output", () => {
    expect(run("uuid-v4", "")).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
    expect(run("password", "", { length: 24, symbols: true })).toHaveLength(24);
  });
});
