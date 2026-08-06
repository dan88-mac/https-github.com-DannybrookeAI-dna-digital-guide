/**
 * Resync AI — offline iPhone / Koder SPA
 * Screens: home, builder, multimodal, studio, community, marketplace,
 * pricing, vision, privacy, terms + floating a-sync agent
 */

let DATA = null;
let currentView = "home";
let builderNodes = [];
let consoleLogs = [];
let communityPosts = [];
let multimodalFilter = "all";
let multimodalQuery = "";
let agentOpen = false;

const FALLBACK_DATA = {
  brand: { name: "Resync AI", tagline: "Self-healing multimodal workflows" },
  stats: [
    { label: "Self-healed runs", value: "2.4M+" },
    { label: "Module catalog", value: "260+" },
    { label: "Teams worldwide", value: "12k+" },
    { label: "Marketplace fee", value: "20%" },
  ],
  steps: [
    { num: "01", title: "Sketch on the canvas", body: "Drop nodes and wire multimodal paths." },
    { num: "02", title: "Test with live data", body: "Watch self-heal kick in before deploy." },
    { num: "03", title: "Export and ship", body: "Publish templates and monitor the graph." },
  ],
  reviews: [
    { quote: "Self-healing canvas replaced brittle chains.", who: "Ops lead" },
    { quote: "Idea-to-canvas shipped intake in an afternoon.", who: "Product eng" },
  ],
  templates: [
    {
      name: "Checkout recovery",
      slug: "checkout-recovery",
      category: "Commerce",
      description: "Heal shipping fields and retry webhooks.",
      uses: 12400,
      nodes: ["Checkout", "Schema patch", "Notify"],
    },
    {
      name: "Vision moderation",
      slug: "vision-moderation",
      category: "Vision",
      description: "Classify uploads and route unsafe content.",
      uses: 6100,
      nodes: ["Vision classify", "Condition", "Human review"],
    },
  ],
  modules: [
    { id: "trigger_webhook", label: "Webhook Trigger", category: "trigger", description: "Start on HTTP webhook" },
    { id: "vision_classify", label: "Vision Classify", category: "vision", description: "Classify images" },
    { id: "voice", label: "Speech to Text", category: "voice", description: "Transcribe audio" },
    { id: "text", label: "LLM Text", category: "text", description: "Generate or transform text" },
    { id: "http", label: "HTTP Request", category: "http", description: "Call an API" },
    { id: "self_heal", label: "Self Heal", category: "selfHeal", description: "Patch and retry failures" },
    { id: "notify_slack", label: "Slack Notify", category: "notify", description: "Post to Slack" },
    { id: "condition", label: "Condition", category: "condition", description: "Branch on rules" },
  ],
  tiers: [
    { name: "Community", priceLabel: "$0", highlighted: false, features: ["Builder", "500 credits", "Templates"] },
    { name: "Builder", priceLabel: "$39", highlighted: false, features: ["Full palette", "Idea-to-canvas", "8k credits"] },
    { name: "Pro", priceLabel: "$129", highlighted: true, features: ["50 modules", "Marketplace sell", "40k credits"] },
    { name: "Enterprise", priceLabel: "Custom", highlighted: false, features: ["SSO", "SLA", "12% fees"] },
  ],
  marketplace: [
    { title: "Checkout heal pack", priceLabel: "Free", price: 0, seller: "Resync Labs", desc: "Commerce recovery.", category: "Commerce" },
    { title: "Vision intake kit", priceLabel: "$29", price: 29, seller: "Studio North", desc: "Image routing.", category: "Vision" },
  ],
  marketplaceFees: { buyer: "10%", seller: "10%", total: "20%", enterprise: "12%" },
  communitySeed: [
    { author: "builder_nova", body: "Shared a vision→notify template.", likes: 24, time: "2h ago" },
    { author: "ops_mira", body: "Self-heal rate jumped after Schema patch pairing.", likes: 41, time: "5h ago" },
  ],
  bannedWords: ["spam", "scam", "hate", "phishing"],
  vision: "Resync AI exists so multimodal automations recover gracefully.",
  privacySummary: "This offline pack stores drafts only locally. Do not paste secrets into the agent.",
  termsSummary: "Marketplace fees are typically 10% buyer + 10% seller. This zip is a preview SPA.",
  nav: [
    { id: "home", label: "Home" },
    { id: "builder", label: "Builder" },
    { id: "multimodal", label: "Multimodal" },
    { id: "studio", label: "Studio" },
    { id: "community", label: "Community" },
    { id: "marketplace", label: "Marketplace" },
    { id: "pricing", label: "Pricing" },
    { id: "vision", label: "Vision" },
    { id: "privacy", label: "Privacy" },
    { id: "terms", label: "Terms" },
  ],
};

function fmt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function navigate(id) {
  currentView = id;
  location.hash = id;
  document.getElementById("mobile-nav").classList.remove("open");
  render();
  updateNavActive();
  window.scrollTo(0, 0);
}

function updateNavActive() {
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-nav") === currentView);
  });
}

function buildNav() {
  const primary = ["home", "multimodal", "studio", "community", "marketplace", "pricing", "vision"];
  const items = DATA.nav.filter((n) => primary.includes(n.id));
  const desktop = document.getElementById("desktop-nav");
  const mobile = document.getElementById("mobile-nav");
  desktop.innerHTML = items
    .map((n) => `<a href="#${n.id}" data-nav="${n.id}">${n.label}</a>`)
    .join("");
  mobile.innerHTML = DATA.nav
    .map((n) => `<a href="#${n.id}" data-nav="${n.id}">${n.label}</a>`)
    .join("");

  function bind(root) {
    root.querySelectorAll("a[data-nav]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        navigate(a.getAttribute("data-nav"));
      });
    });
  }
  bind(desktop);
  bind(mobile);
  document.querySelectorAll(".logo, .btn-primary[data-nav], footer [data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = el.getAttribute("data-nav");
      if (id) {
        e.preventDefault();
        navigate(id);
      }
    });
  });
}

function log(msg) {
  const t = new Date().toLocaleTimeString();
  consoleLogs.unshift({ t, msg });
  if (consoleLogs.length > 40) consoleLogs.pop();
}

function viewHome() {
  const stats = DATA.stats
    .map(
      (s) =>
        `<div><div class="stat-value">${escapeHtml(s.value)}</div><div class="stat-label">${escapeHtml(s.label)}</div></div>`
    )
    .join("");
  const steps = (DATA.steps || [])
    .map(
      (s) =>
        `<article class="card glass"><span class="eyebrow">${escapeHtml(s.num)}</span><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.body)}</p></article>`
    )
    .join("");
  const reviews = (DATA.reviews || [])
    .map(
      (r) =>
        `<article class="card glass"><p>“${escapeHtml(r.quote)}”</p><p class="uses">— ${escapeHtml(r.who)}</p></article>`
    )
    .join("");

  return `
  <section class="view active hero">
    <p class="eyebrow">Multimodal · self-healing · community</p>
    <h1 class="hero-brand text-gradient">Resync AI</h1>
    <h2>Workflows that recover before you wake up</h2>
    <p class="lead">${escapeHtml(DATA.brand.tagline)}. Sketch idea → canvas, wire up to 50 modules, ship with heal loops built in.</p>
    <div class="actions">
      <button type="button" class="btn-primary" data-go="builder">Open builder</button>
      <button type="button" class="btn-ghost" data-go="studio">Try studio</button>
    </div>
    <div class="hero-canvas" aria-hidden="true">
      <span class="node"><small>Trigger</small>Webhook</span>
      <span class="node"><small>Vision</small>Classify</span>
      <span class="node"><small>Heal</small>Self-heal</span>
    </div>
  </section>
  <section class="section">
    <div class="stats-bar">${stats}</div>
  </section>
  <section class="section">
    <p class="eyebrow">How it works</p>
    <h2>Three steps from idea to production</h2>
    <div class="grid-3">${steps}</div>
  </section>
  <section class="section">
    <p class="eyebrow">Builders</p>
    <h2>What teams say</h2>
    <div class="grid-2">${reviews}</div>
    <div class="actions">
      <button type="button" class="btn-primary" data-go="pricing">See pricing</button>
      <button type="button" class="btn-ghost" data-go="marketplace">Browse marketplace</button>
    </div>
  </section>`;
}

function viewBuilder() {
  const nodesHtml =
    builderNodes.length === 0
      ? `<p style="color:var(--muted)">Add modules from the palette or Multimodal catalog.</p>`
      : builderNodes
          .map(
            (n, i) =>
              `<span class="node" data-rm="${i}"><small>${escapeHtml(n.category)}</small>${escapeHtml(n.label)}</span>`
          )
          .join("");
  const palette = (DATA.modules || [])
    .slice(0, 12)
    .map(
      (m) =>
        `<button type="button" class="chip" data-add="${escapeHtml(m.id)}">${escapeHtml(m.label)}</button>`
    )
    .join("");
  const logs = consoleLogs
    .map((l) => `<div class="console-line">[${escapeHtml(l.t)}] ${escapeHtml(l.msg)}</div>`)
    .join("") || `<div class="console-line">Ready.</div>`;

  return `
  <section class="view active">
    <p class="eyebrow">Canvas</p>
    <h2 style="font-family:var(--font-display)">Builder</h2>
    <p style="color:var(--muted)">Add modules, validate the graph, export a text summary. Offline preview — no Node runtime.</p>
    <div class="chip-row">${palette}</div>
    <div class="actions" style="margin-top:0;margin-bottom:16px">
      <button type="button" class="btn-ghost" id="btn-validate">Validate</button>
      <button type="button" class="btn-ghost" id="btn-export">Export</button>
      <button type="button" class="btn-ghost" id="btn-clear">Clear</button>
      <button type="button" class="btn-primary" data-go="multimodal">Browse catalog</button>
    </div>
    <div class="builder-layout">
      <div class="builder-canvas-wrap canvas glass">${nodesHtml}</div>
      <div class="builder-console-wrap console glass">${logs}</div>
    </div>
  </section>`;
}

function filteredModules() {
  const q = multimodalQuery.trim().toLowerCase();
  return (DATA.modules || []).filter((m) => {
    if (multimodalFilter !== "all" && m.category !== multimodalFilter) return false;
    if (!q) return true;
    return (
      m.label.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      (m.description || "").toLowerCase().includes(q)
    );
  });
}

function viewMultimodal() {
  const cats = ["all", ...Array.from(new Set((DATA.modules || []).map((m) => m.category))).sort()];
  const chips = cats
    .map(
      (c) =>
        `<button type="button" class="chip ${multimodalFilter === c ? "active" : ""}" data-filter="${escapeHtml(c)}">${escapeHtml(c)}</button>`
    )
    .join("");
  const cards = filteredModules()
    .map(
      (m) => `
    <article class="card glass clickable" data-add="${escapeHtml(m.id)}">
      <span class="cat">${escapeHtml(m.category)}</span>
      <h3>${escapeHtml(m.label)}</h3>
      <p>${escapeHtml(m.description || "")}</p>
      <p class="uses">Tap to add to builder</p>
    </article>`
    )
    .join("");

  return `
  <section class="view active">
    <p class="eyebrow">Catalog</p>
    <h2 style="font-family:var(--font-display)">Multimodal modules</h2>
    <p style="color:var(--muted)">Search and filter a subset of the 260+ module catalog. Add to the builder canvas.</p>
    <div class="toolbar">
      <input type="search" id="mm-search" placeholder="Search modules…" value="${escapeHtml(multimodalQuery)}" />
    </div>
    <div class="chip-row">${chips}</div>
    <div class="grid-2">${cards || "<p style='color:var(--muted)'>No modules match.</p>"}</div>
  </section>`;
}

function ideaToGraph(idea) {
  const text = idea.toLowerCase();
  const nodes = [{ id: "trigger_webhook", label: "Webhook Trigger", category: "trigger" }];
  if (/image|vision|photo|ocr/.test(text)) {
    nodes.push({ id: "vision_classify", label: "Vision Classify", category: "vision" });
  }
  if (/voice|audio|speech|call/.test(text)) {
    nodes.push({ id: "voice", label: "Speech to Text", category: "voice" });
  }
  if (/llm|gpt|text|summar|chat|rag/.test(text)) {
    nodes.push({ id: "text", label: "LLM Text", category: "text" });
  }
  if (/http|api|webhook|crm|stripe/.test(text)) {
    nodes.push({ id: "http", label: "HTTP Request", category: "http" });
  }
  nodes.push({ id: "self_heal", label: "Self Heal", category: "selfHeal" });
  if (/slack|notify|email|alert/.test(text)) {
    nodes.push({ id: "notify_slack", label: "Slack Notify", category: "notify" });
  }
  if (nodes.length < 3) {
    nodes.push({ id: "condition", label: "Condition", category: "condition" });
    nodes.push({ id: "http", label: "HTTP Request", category: "http" });
  }
  return nodes;
}

function viewStudio() {
  return `
  <section class="view active">
    <p class="eyebrow">Idea → graph</p>
    <h2 style="font-family:var(--font-display)">Studio</h2>
    <p style="color:var(--muted)">Describe a workflow. We sketch a simple module graph you can send to the builder.</p>
    <textarea id="studio-idea" placeholder="e.g. Moderate product images, summarize issues, notify Slack, self-heal API failures"></textarea>
    <div class="actions">
      <button type="button" class="btn-primary" id="btn-studio-run">Generate graph</button>
      <button type="button" class="btn-ghost" id="btn-studio-to-builder">Send to builder</button>
    </div>
    <div id="studio-out" class="studio-graph"></div>
  </section>`;
}

function viewCommunity() {
  const posts = communityPosts
    .map(
      (p) => `
    <article class="feed-item">
      <div class="meta">@${escapeHtml(p.author)} · ${escapeHtml(p.time || "just now")} · ${p.likes || 0} likes</div>
      <p style="margin:8px 0 0">${escapeHtml(p.body)}</p>
    </article>`
    )
    .join("");

  return `
  <section class="view active">
    <p class="eyebrow">Feed</p>
    <h2 style="font-family:var(--font-display)">Community</h2>
    <p style="color:var(--muted)">Share builds and questions. Basic word filter moderates the compose box (offline demo).</p>
    <div class="card glass" style="margin-bottom:20px">
      <input type="text" id="c-author" placeholder="Display name" style="margin-bottom:10px" />
      <textarea id="c-body" placeholder="What are you building?"></textarea>
      <div class="actions">
        <button type="button" class="btn-primary" id="btn-compose">Post</button>
      </div>
      <p id="c-msg" class="msg-warn" style="display:none;margin-top:8px"></p>
    </div>
    <div>${posts}</div>
  </section>`;
}

function viewMarketplace() {
  const fees = DATA.marketplaceFees || { buyer: "10%", seller: "10%", total: "20%" };
  const cards = (DATA.marketplace || [])
    .map(
      (m) => `
    <article class="card glass">
      <span class="cat">${escapeHtml(m.category || "Pack")}</span>
      <h3>${escapeHtml(m.title)}</h3>
      <div class="price-tag">${escapeHtml(m.priceLabel)}</div>
      <p>${escapeHtml(m.desc)}</p>
      <p class="uses">by ${escapeHtml(m.seller)} · ${m.price === 0 ? "Free" : "Paid"}</p>
    </article>`
    )
    .join("");

  return `
  <section class="view active">
    <p class="eyebrow">Templates & packs</p>
    <h2 style="font-family:var(--font-display)">Marketplace</h2>
    <p style="color:var(--muted)">Platform fee ${escapeHtml(fees.total)} (${escapeHtml(fees.buyer)} buyer + ${escapeHtml(fees.seller)} seller). Enterprise can negotiate lower.</p>
    <div class="grid-2" style="margin-top:20px">${cards}</div>
  </section>`;
}

function viewPricing() {
  const tiers = DATA.tiers
    .map(
      (t) => `
    <article class="card glass ${t.highlighted ? "pricing-highlight" : ""}">
      ${t.highlighted ? '<span class="badge">Most popular</span>' : ""}
      <h3>${escapeHtml(t.name)}</h3>
      <div class="price-tag">${escapeHtml(t.priceLabel)}</div>
      <ul style="color:var(--muted);font-size:14px;padding-left:18px;line-height:1.6">
        ${(t.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("")}
      </ul>
    </article>`
    )
    .join("");

  return `
  <section class="view active">
    <p class="eyebrow">Plans</p>
    <h2 style="font-family:var(--font-display)">Pricing</h2>
    <p style="color:var(--muted)">Community $0 · Builder $39 · Pro $129 · Enterprise custom.</p>
    <div class="grid-2" style="margin-top:20px">${tiers}</div>
  </section>`;
}

function viewLegal(kind) {
  const titles = { vision: "Vision", privacy: "Privacy", terms: "Terms" };
  const bodies = {
    vision: DATA.vision,
    privacy: DATA.privacySummary,
    terms: DATA.termsSummary,
  };
  return `
  <section class="view active legal">
    <p class="eyebrow">Resync AI</p>
    <h2 style="font-family:var(--font-display)">${titles[kind]}</h2>
    <p>${escapeHtml(bodies[kind] || "")}</p>
    <div class="actions">
      <button type="button" class="btn-ghost" data-go="home">Back home</button>
    </div>
  </section>`;
}

function findModule(id) {
  return (DATA.modules || []).find((m) => m.id === id);
}

function addModuleById(id) {
  const m = findModule(id);
  if (!m) return;
  if (builderNodes.length >= 50) {
    log("Limit: 50 modules on canvas (Pro scale preview).");
    return;
  }
  builderNodes.push({ id: m.id, label: m.label, category: m.category });
  log(`Added ${m.label}`);
}

function validateGraph() {
  if (builderNodes.length === 0) {
    log("Empty canvas — add at least one module.");
    return;
  }
  const hasTrigger = builderNodes.some((n) => /trigger|webhook/i.test(n.category + n.id));
  const hasHeal = builderNodes.some((n) => /heal/i.test(n.category + n.id + n.label));
  let score = 40 + Math.min(40, builderNodes.length * 4);
  if (hasTrigger) score += 10;
  if (hasHeal) score += 10;
  log(`Validated ${builderNodes.length} nodes. Overview score ~${Math.min(100, score)}.`);
  if (!hasHeal) log("Tip: add a Self Heal module for recovery.");
}

function exportGraph() {
  const lines = builderNodes.map((n, i) => `${i + 1}. [${n.category}] ${n.label} (${n.id})`);
  const text = ["Resync AI workflow export", "---", ...lines, "---", `Nodes: ${builderNodes.length}`].join(
    "\n"
  );
  log("Export ready (copied to console below).");
  consoleLogs.unshift({ t: new Date().toLocaleTimeString(), msg: text.replace(/\n/g, " · ") });
  try {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
  } catch (_) {
    /* ignore */
  }
}

function moderate(text) {
  const banned = DATA.bannedWords || [];
  const lower = text.toLowerCase();
  return banned.find((w) => lower.includes(w));
}

function agentReply(input) {
  const q = input.toLowerCase();
  if (/price|pricing|cost|\$|plan/.test(q)) {
    return { text: "Plans: Community $0, Builder $39, Pro $129, Enterprise custom. Open Pricing?", action: "pricing" };
  }
  if (/market|buy|sell|fee/.test(q)) {
    return {
      text: "Marketplace packs are free or paid. Platform fee is 20% (10% buyer + 10% seller). Want Marketplace?",
      action: "marketplace",
    };
  }
  if (/builder|canvas|module|workflow/.test(q)) {
    return { text: "I can recommend modules and navigate — I don’t build full workflows. Open Builder or Multimodal?", action: "builder" };
  }
  if (/vision|image|photo/.test(q)) {
    return { text: "Try Vision Classify from Multimodal, then Self Heal + Notify. Opening Multimodal.", action: "multimodal" };
  }
  if (/community|post|feed/.test(q)) {
    return { text: "Community is a live feed with a simple word filter. Opening Community.", action: "community" };
  }
  if (/studio|idea/.test(q)) {
    return { text: "Studio turns a short idea into a simple graph. Opening Studio.", action: "studio" };
  }
  if (/privacy|terms|legal/.test(q)) {
    return { text: "Privacy and Terms summaries are in the footer links. Opening Privacy.", action: "privacy" };
  }
  if (/hello|hi|help|what can/.test(q)) {
    return {
      text: "I’m a-sync agent: I advise single modules, recommend screens, and navigate. I don’t assemble full workflows. Try “pricing”, “vision module”, or “open studio”.",
      action: null,
    };
  }
  return {
    text: "Try asking about pricing, marketplace fees, vision modules, or say “open builder”. I navigate and advise — you build on the canvas.",
    action: null,
  };
}

function renderAgentMessages(seed) {
  const box = document.getElementById("agent-messages");
  if (!box) return;
  if (seed) {
    box.innerHTML = `<div class="agent-bubble bot">${escapeHtml(seed)}</div>`;
  }
}

function pushAgentBubble(role, text) {
  const box = document.getElementById("agent-messages");
  if (!box) return;
  const div = document.createElement("div");
  div.className = `agent-bubble ${role}`;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function setAgentOpen(open) {
  agentOpen = open;
  const panel = document.getElementById("agent-panel");
  if (!panel) return;
  panel.hidden = !open;
  if (open && !panel.dataset.seeded) {
    renderAgentMessages("Ask me to navigate (pricing, studio, multimodal) or recommend a module. I don’t build full workflows.");
    panel.dataset.seeded = "1";
  }
}

function render() {
  const app = document.getElementById("app");
  let html = "";
  switch (currentView) {
    case "builder":
      html = viewBuilder();
      break;
    case "multimodal":
      html = viewMultimodal();
      break;
    case "studio":
      html = viewStudio();
      break;
    case "community":
      html = viewCommunity();
      break;
    case "marketplace":
      html = viewMarketplace();
      break;
    case "pricing":
      html = viewPricing();
      break;
    case "vision":
      html = viewLegal("vision");
      break;
    case "privacy":
      html = viewLegal("privacy");
      break;
    case "terms":
      html = viewLegal("terms");
      break;
    default:
      html = viewHome();
      currentView = "home";
  }
  app.innerHTML = html;
  bindViewEvents();
  updateNavActive();
}

function bindViewEvents() {
  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.getAttribute("data-go")));
  });

  document.querySelectorAll("[data-add]").forEach((el) => {
    el.addEventListener("click", () => {
      addModuleById(el.getAttribute("data-add"));
      if (currentView === "builder") render();
      else {
        log("Module queued — open Builder to see canvas.");
        navigate("builder");
      }
    });
  });

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      multimodalFilter = btn.getAttribute("data-filter");
      render();
    });
  });

  const search = document.getElementById("mm-search");
  if (search) {
    search.addEventListener("input", () => {
      multimodalQuery = search.value;
      // debounce-ish: re-render on change is fine for small catalog
      const pos = search.selectionStart;
      render();
      const again = document.getElementById("mm-search");
      if (again) {
        again.focus();
        again.setSelectionRange(pos, pos);
      }
    });
  }

  const v = document.getElementById("btn-validate");
  if (v) v.addEventListener("click", () => { validateGraph(); render(); });
  const e = document.getElementById("btn-export");
  if (e) e.addEventListener("click", () => { exportGraph(); render(); });
  const c = document.getElementById("btn-clear");
  if (c)
    c.addEventListener("click", () => {
      builderNodes = [];
      log("Canvas cleared.");
      render();
    });

  let studioNodes = null;
  const run = document.getElementById("btn-studio-run");
  if (run) {
    run.addEventListener("click", () => {
      const idea = document.getElementById("studio-idea").value.trim() || "webhook API notify self-heal";
      studioNodes = ideaToGraph(idea);
      const out = document.getElementById("studio-out");
      out.innerHTML = studioNodes
        .map(
          (n, i) =>
            `${i ? '<span class="studio-arrow">→</span>' : ""}<span class="node"><small>${escapeHtml(n.category)}</small>${escapeHtml(n.label)}</span>`
        )
        .join("");
      window.__studioNodes = studioNodes;
    });
  }
  const toB = document.getElementById("btn-studio-to-builder");
  if (toB) {
    toB.addEventListener("click", () => {
      const nodes = window.__studioNodes || ideaToGraph("webhook text self-heal notify");
      builderNodes = nodes.slice(0, 50);
      log(`Imported ${builderNodes.length} nodes from Studio.`);
      navigate("builder");
    });
  }

  const compose = document.getElementById("btn-compose");
  if (compose) {
    compose.addEventListener("click", () => {
      const author = (document.getElementById("c-author").value || "guest").trim().slice(0, 32);
      const body = (document.getElementById("c-body").value || "").trim();
      const msg = document.getElementById("c-msg");
      if (!body) {
        msg.style.display = "block";
        msg.textContent = "Write something first.";
        return;
      }
      const hit = moderate(body);
      if (hit) {
        msg.style.display = "block";
        msg.textContent = `Post blocked by moderation filter (“${hit}”).`;
        return;
      }
      communityPosts.unshift({ author, body, likes: 0, time: "just now" });
      render();
    });
  }
}

function initBg() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  let w, h, dots;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    dots = Array.from({ length: 36 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(34,211,238,0.35)";
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  resize();
  window.addEventListener("resize", resize);
  frame();
}

async function loadData() {
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    DATA = await res.json();
  } catch (_) {
    DATA = FALLBACK_DATA;
  }
}

async function boot() {
  await loadData();
  communityPosts = [...(DATA.communitySeed || [])];
  document.getElementById("year").textContent = String(new Date().getFullYear());
  buildNav();
  document.getElementById("menu-btn").addEventListener("click", () => {
    document.getElementById("mobile-nav").classList.toggle("open");
  });

  document.getElementById("agent-fab").addEventListener("click", () => setAgentOpen(!agentOpen));
  document.getElementById("agent-close").addEventListener("click", () => setAgentOpen(false));
  document.getElementById("agent-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("agent-input");
    const text = input.value.trim();
    if (!text) return;
    pushAgentBubble("user", text);
    input.value = "";
    const reply = agentReply(text);
    pushAgentBubble("bot", reply.text);
    if (reply.action) {
      setTimeout(() => {
        navigate(reply.action);
      }, 400);
    }
  });

  window.addEventListener("hashchange", () => {
    const id = (location.hash || "#home").replace(/^#/, "") || "home";
    if (id !== currentView) {
      currentView = id;
      render();
    }
  });

  const start = (location.hash || "#home").replace(/^#/, "") || "home";
  currentView = start;
  render();
  initBg();
}

boot();
