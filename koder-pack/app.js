/**
 * Resync AI — Koder iPhone pack (5 files: html, css, js, json, md)
 * Mirrors site routes: home, templates, community, about, pricing, resources, dashboard, builder, login
 */

let DATA = null;

let currentView = "home";
let builderNodes = [];
let consoleLogs = [];

const FALLBACK_DATA = {
  brand: { name: "Resync AI", tagline: "Self-healing workflow SaaS" },
  stats: [
    { label: "Self-healed runs", value: "2.4M+" },
    { label: "Community templates", value: "180+" },
    { label: "Teams worldwide", value: "12k+" },
    { label: "Avg. return visits / mo", value: "8.2" },
  ],
  missionPillars: [
    {
      title: "Reliability for everyone",
      body: "Automations should recover gracefully—not wake you at 3 a.m.",
    },
    {
      title: "Community templates",
      body: "Share and remix workflows in our community gallery.",
    },
    {
      title: "Return value",
      body: "Your workflow library and exports stay with you for every launch.",
    },
  ],
  templates: [
    {
      name: "E‑commerce checkout recovery",
      slug: "checkout-recovery",
      category: "Commerce",
      description: "Heal missing shipping fields and retry payment webhooks.",
      uses: 12400,
      nodes: ["Checkout API", "Schema patch", "Notify team"],
    },
    {
      name: "SaaS user onboarding",
      slug: "saas-onboarding",
      category: "Growth",
      description: "Validate signup payloads and fallback CRM sync.",
      uses: 8900,
      nodes: ["Auth signup", "Email valid?", "Patch profile"],
    },
    {
      name: "Incident auto-remediation",
      slug: "incident-remediation",
      category: "DevOps",
      description: "Alert webhooks, health checks, Slack notify.",
      uses: 15200,
      nodes: ["Pager alert", "Health probe", "Restart policy"],
    },
    {
      name: "Purpose-driven intake forms",
      slug: "nonprofit-intake",
      category: "Community",
      description: "Volunteer applications with self-healing sync.",
      uses: 4300,
      nodes: ["Form submit", "Normalize", "Fix fields"],
    },
  ],
  tiers: [
    {
      name: "Community",
      priceLabel: "$0",
      highlighted: false,
      features: ["Visual builder", "500 credits/mo", "Templates", "Offline drafts"],
    },
    {
      name: "Builder",
      priceLabel: "$39",
      highlighted: false,
      features: ["Full palette", "Idea-to-canvas", "Export", "8k credits"],
    },
    {
      name: "Pro",
      priceLabel: "$129",
      highlighted: true,
      features: ["50 modules", "Marketplace sell", "Priority heal", "40k credits"],
    },
    {
      name: "Enterprise",
      priceLabel: "Custom",
      highlighted: false,
      features: ["SSO", "SLA", "12% marketplace fee", "Volume credits"],
    },
  ],
  dashboardMetrics: [
    { label: "Executions (24h)", value: "1,284", delta: "+12%" },
    { label: "Self-heal rate", value: "94.2%", delta: "+3.1%" },
    { label: "Credits used", value: "3,420", delta: "68% of plan" },
    { label: "Saved workflows", value: "18", delta: "2 offline drafts" },
  ],
  telemetry: [
    { time: "2m ago", workflow: "checkout-recovery", status: "SELF_HEALED", duration: "842ms" },
    { time: "18m ago", workflow: "saas-onboarding", status: "SUCCESS", duration: "210ms" },
  ],
  resources: [
    { title: "Self-healing playbooks", desc: "Patch vs fallback endpoints." },
    { title: "Template authoring", desc: "Community revenue share." },
    { title: "Stripe + Supabase", desc: "Billing and RLS setup." },
    { title: "Nonprofit story", desc: "99% healed runs case study." },
  ],
  nav: [
    { id: "home", label: "Home" },
    { id: "templates", label: "Templates" },
    { id: "community", label: "Community" },
    { id: "about", label: "Mission" },
    { id: "pricing", label: "Pricing" },
    { id: "resources", label: "Resources" },
    { id: "dashboard", label: "Dashboard" },
    { id: "builder", label: "Builder" },
    { id: "login", label: "Sign in" },
  ],
};

function fmt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function navigate(id) {
  currentView = id;
  location.hash = id;
  document.getElementById("mobile-nav").classList.remove("open");
  render();
  updateNavActive();
}

function updateNavActive() {
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-nav") === currentView);
  });
}

function buildNav() {
  const items = DATA.nav.filter((n) => !["builder", "login"].includes(n.id));
  const desktop = document.getElementById("desktop-nav");
  const mobile = document.getElementById("mobile-nav");
  desktop.innerHTML = items
    .map(
      (n) =>
        `<a href="#${n.id}" data-nav="${n.id}">${n.label}</a>`
    )
    .join("");
  mobile.innerHTML = DATA.nav
    .map(
      (n) =>
        `<a href="#${n.id}" data-nav="${n.id}">${n.label}</a>`
    )
    .join("");
  desktop.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(a.getAttribute("data-nav"));
    });
  });
  mobile.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(a.getAttribute("data-nav"));
    });
  });
  document.querySelectorAll(".logo, .btn-primary[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = el.getAttribute("data-nav");
      if (id) {
        e.preventDefault();
        navigate(id);
      }
    });
  });
}

function viewHome() {
  const tplCards = DATA.templates
    .map(
      (t) => `
    <article class="card glass" role="button" tabindex="0" data-open-template="${t.slug}">
      <span class="cat">${t.category}</span>
      <h3>${t.name}</h3>
      <p>${t.description}</p>
      <p class="uses">${fmt(t.uses)} community runs</p>
    </article>`
    )
    .join("");

  const pillars = DATA.missionPillars
    .map(
      (p) => `
    <article class="card glass"><h3>${p.title}</h3><p>${p.body}</p></article>`
    )
    .join("");

  const stats = DATA.stats
    .map(
      (s) => `
    <div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`
    )
    .join("");

  return `
    <section class="view active hero">
      <p class="eyebrow">${DATA.brand.tagline}</p>
      <h1>Automations that <span class="text-gradient">recover</span>—so your community keeps trusting you</h1>
      <p class="lead">Resync AI repairs broken integrations, exports Next.js code, and grows with templates you reuse every launch.</p>
      <div class="actions">
        <button type="button" class="btn-primary" data-go="builder">Start building free</button>
        <button type="button" class="btn-ghost" data-go="templates">Browse templates</button>
      </div>
    </section>
    <section class="stats-bar">${stats}</section>
    <section style="margin-top:32px">
      <h2>Community-proven flows</h2>
      <p style="color:var(--muted)">Tap a template to open in the builder.</p>
      <div class="grid-4" style="margin-top:16px">${tplCards}</div>
    </section>
    <section style="margin-top:40px">
      <h2>Purpose-built to <span class="text-gradient">keep you coming back</span></h2>
      <div class="grid-2" style="margin-top:16px">${pillars}</div>
    </section>
    <section class="card glass" style="margin-top:40px">
      <h2>Join the Resync community</h2>
      <p style="color:var(--muted)">Template spotlights, revenue-share, and roadmap input.</p>
      <form class="waitlist-form" id="waitlist-home">
        <input type="email" required placeholder="you@company.com" name="email" />
        <button type="submit" class="btn-primary">Join community</button>
      </form>
      <p class="msg-ok" id="waitlist-msg" hidden>Welcome to the Resync community.</p>
    </section>`;
}

function viewTemplates() {
  return `
    <section class="view active">
      <h1>Template gallery</h1>
      <p style="color:var(--muted)">Clone, customize, return whenever you need the same pattern.</p>
      <div class="grid-2" style="margin-top:20px">
        ${DATA.templates
          .map(
            (t) => `
          <article class="card glass" data-open-template="${t.slug}">
            <span class="cat">${t.category}</span>
            <h3>${t.name}</h3>
            <p>${t.description}</p>
            <p class="uses">${fmt(t.uses)} runs</p>
          </article>`
          )
          .join("")}
      </div>
    </section>`;
}

function viewCommunity() {
  return `
    <section class="view active">
      <h1>A community that builds together</h1>
      <p style="color:var(--muted)">Publish templates, share playbooks, and help teams ship reliable automation with Resync AI.</p>
      <div class="grid-2" style="margin-top:24px">
        ${DATA.missionPillars.map((p) => `<article class="card glass"><h3>${p.title}</h3><p>${p.body}</p></article>`).join("")}
      </div>
      <div class="card glass" style="margin-top:24px">
        <h2>Community updates</h2>
        <form class="waitlist-form" id="waitlist-community">
          <input type="email" required placeholder="Email" />
          <button type="submit" class="btn-primary">Subscribe</button>
        </form>
      </div>
    </section>`;
}

function viewAbout() {
  return `
    <section class="view active">
      <h1>Our mission</h1>
      <p style="line-height:1.7;color:#d4d4d8">Software should fail gracefully. Resync AI helps purpose-driven teams ship automation that <strong>self-heals</strong>—so you return for the next launch, not because you lost trust.</p>
      <div class="actions">
        <button type="button" class="btn-ghost" data-go="community">Join community</button>
        <button type="button" class="btn-primary" data-go="builder">Open builder</button>
      </div>
    </section>`;
}

function viewPricing() {
  return `
    <section class="view active">
      <h1>Pricing that scales with your impact</h1>
      <p style="color:var(--muted)">Start free on Community. Upgrade when self-healing is mission-critical.</p>
      <div class="grid-2" style="margin-top:24px">
        ${DATA.tiers
          .map(
            (t) => `
          <article class="card glass ${t.highlighted ? "pricing-highlight" : ""}">
            ${t.highlighted ? '<span class="badge">Most popular</span>' : ""}
            <h3>${t.name}</h3>
            <p style="font-size:1.75rem;font-weight:700">${t.priceLabel}${t.priceLabel !== "Custom" ? "<span style=\"font-size:14px;color:var(--muted)\">/mo</span>" : ""}</p>
            <ul style="padding-left:18px;color:var(--muted);font-size:14px">
              ${t.features.map((f) => `<li>${f}</li>`).join("")}
            </ul>
            <button type="button" class="btn-primary" style="margin-top:12px;width:100%" data-go="login">Choose plan</button>
          </article>`
          )
          .join("")}
      </div>
    </section>`;
}

function rawGitHubUrl(path) {
  const g = DATA.github || {
    owner: "dan88-mac",
    repo: "https-github.com-DannybrookeAI-dna-digital-guide",
    branch: "main",
  };
  return `https://raw.githubusercontent.com/${g.owner}/${g.repo}/${g.branch}/${path}`;
}

function viewContracts() {
  const items = (DATA.contracts || [])
    .map(
      (c) => `
    <a class="card glass contract-link" href="${rawGitHubUrl(c.path)}" target="_blank" rel="noopener"
       style="display:block;text-decoration:none;color:inherit;margin-bottom:12px">
      <h3 style="margin:0;color:#a5b4fc">${c.title}</h3>
      <p style="margin:8px 0 0;font-size:13px;color:var(--muted)">Opens in Safari — PDF or document</p>
    </a>`
    )
    .join("");

  return `
    <section class="view active">
      <h1>Documentation</h1>
      <p style="color:var(--muted)">Deployment guides and technical resources for Resync AI.</p>
      <div style="margin-top:24px">${items || "<p>No contract links configured.</p>"}</div>
      <div class="card glass" style="margin-top:24px">
        <h3>Save everything to iPhone Files</h3>
        <p style="color:var(--muted);font-size:14px">GitHub app → this repo → <strong>Download ZIP</strong> → Share → <strong>Save to Files</strong> → folder “Resync AI”.</p>
      </div>
    </section>`;
}

function viewResources() {
  return `
    <section class="view active">
      <h1>Resources</h1>
      <div class="grid-2" style="margin-top:20px">
        ${DATA.resources.map((r) => `<article class="card glass"><h3>${r.title}</h3><p>${r.desc}</p></article>`).join("")}
      </div>
    </section>`;
}

function viewDashboard() {
  const metrics = DATA.dashboardMetrics
    .map(
      (m) => `
    <article class="card glass">
      <div style="font-size:11px;text-transform:uppercase;color:var(--muted)">${m.label}</div>
      <div style="font-size:1.5rem;font-weight:700;margin-top:8px">${m.value}</div>
      <div style="font-size:12px;color:#34d399;margin-top:4px">${m.delta}</div>
    </article>`
    )
    .join("");

  const rows = DATA.telemetry
    .map(
      (r) => `
    <tr><td>${r.time}</td><td style="color:#a5b4fc">${r.workflow}</td><td>${r.status}</td><td>${r.duration}</td></tr>`
    )
    .join("");

  return `
    <section class="view active">
      <h1>Welcome back</h1>
      <p style="color:var(--muted)">Workflows, heal rate, and credits for your next ship.</p>
      <div class="grid-2" style="margin-top:20px">${metrics}</div>
      <h2 style="margin-top:32px">Recent telemetry</h2>
      <div class="card glass" style="padding:0;overflow:hidden">
        <table><thead><tr><th>When</th><th>Workflow</th><th>Status</th><th>Duration</th></tr></thead>
        <tbody>${rows}</tbody></table>
      </div>
    </section>`;
}

function viewBuilder() {
  const nodesHtml =
    builderNodes.length === 0
      ? '<span class="node"><small>httpRequest</small>HTTP Request</span>'
      : builderNodes
          .map(
            (n, i) =>
              `<span class="node"><small>${n.type}</small>${n.label}</span>${i < builderNodes.length - 1 ? " → " : ""}`
          )
          .join("");

  const logs =
    consoleLogs.length === 0
      ? '<div class="console-line">Validate or add nodes to see logs…</div>'
      : consoleLogs.map((l) => `<div class="console-line">${l}</div>`).join("");

  return `
    <section class="view active">
      <h1>Workflow builder</h1>
      <p style="color:var(--muted);font-size:14px">Design self-healing flows — same UX as production Resync AI.</p>
      <div class="builder-layout" style="margin-top:16px">
        <div class="builder-canvas-wrap canvas glass" id="builder-canvas">${nodesHtml}</div>
        <div class="builder-console-wrap">
          <div class="console glass" id="console">${logs}</div>
          <div class="actions" style="margin-top:12px">
            <button type="button" class="btn-primary" id="btn-add-node">Add node</button>
            <button type="button" class="btn-ghost" id="btn-validate">Validate</button>
            <button type="button" class="btn-ghost" id="btn-export">Export code</button>
          </div>
        </div>
      </div>
    </section>`;
}

function viewLogin() {
  return `
    <section class="view active" style="max-width:400px;margin:0 auto;padding-top:24px">
      <h1>Welcome back to Resync</h1>
      <p style="color:var(--muted);font-size:14px">Sign in syncs workflows and credits (Supabase on live deploy).</p>
      <form id="login-form" style="display:flex;flex-direction:column;gap:12px;margin-top:24px">
        <input type="email" required placeholder="Email" />
        <input type="password" required placeholder="Password" />
        <button type="submit" class="btn-primary">Sign in</button>
        <button type="button" class="btn-ghost" id="guest-builder">Continue as guest → builder</button>
      </form>
      <p id="login-msg" style="color:var(--muted);font-size:14px;margin-top:12px"></p>
    </section>`;
}

function render() {
  const app = document.getElementById("app");
  const views = {
    home: viewHome,
    templates: viewTemplates,
    community: viewCommunity,
    about: viewAbout,
    pricing: viewPricing,
    resources: viewResources,
    contracts: viewContracts,
    dashboard: viewDashboard,
    builder: viewBuilder,
    login: viewLogin,
  };
  const fn = views[currentView] || viewHome;
  app.innerHTML = fn();
  bindViewEvents();
}

function bindViewEvents() {
  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.getAttribute("data-go")));
  });
  document.querySelectorAll("[data-open-template]").forEach((el) => {
    const open = () => {
      const slug = el.getAttribute("data-open-template");
      const t = DATA.templates.find((x) => x.slug === slug);
      if (t && t.nodes) {
        builderNodes = t.nodes.map((label, i) => ({
          type: i === 1 ? "selfHeal" : "httpRequest",
          label,
        }));
        consoleLogs.push(`Loaded template: ${slug}`);
      }
      navigate("builder");
    };
    el.addEventListener("click", open);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") open();
    });
  });

  ["waitlist-home", "waitlist-community"].forEach((id) => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("waitlist-msg");
      if (msg) {
        msg.hidden = false;
      } else {
        alert("Welcome to the Resync community.");
      }
      form.reset();
    });
  });

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("login-msg").textContent =
        "Live site uses Supabase auth. Opening builder in preview mode.";
      setTimeout(() => navigate("builder"), 800);
    });
  }
  const guest = document.getElementById("guest-builder");
  if (guest) guest.addEventListener("click", () => navigate("builder"));

  const add = document.getElementById("btn-add-node");
  if (add) {
    add.addEventListener("click", () => {
      builderNodes.push({ type: "selfHeal", label: "Self-heal step" });
      consoleLogs.push("Added node: selfHeal");
      render();
    });
  }
  const val = document.getElementById("btn-validate");
  if (val) {
    val.addEventListener("click", () => {
      const count = builderNodes.length || 1;
      consoleLogs.push(`Validation OK — ${count} node(s), order confirmed`);
      render();
    });
  }
  const exp = document.getElementById("btn-export");
  if (exp) {
    exp.addEventListener("click", () => {
      consoleLogs.push("Export: app/api/workflows/my-workflow/route.ts");
      consoleLogs.push("Export: hooks/useWorkflow.ts");
      consoleLogs.push("Export: components/WorkflowRunner.tsx");
      alert("Code bundle ready (preview). Full export on production resync-ai app.");
      render();
    });
  }
}

function initBg() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const gl = canvas.getContext("webgl");
  if (!gl) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener("resize", resize);

  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}");
  gl.compileShader(vs);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(
    fs,
    `precision mediump float;uniform vec2 r;uniform float t;void main(){
    vec2 u=gl_FragCoord.xy/r;u-=0.5;u.x*=r.x/r.y;float v=sin(u.x*6.+t)*0.08;
    float e=smoothstep(0.35,0.,abs(u.y)+abs(u.x)*0.6+v);
    gl_FragColor=vec4(vec3(0.02,0.02,0.05)+vec3(0.35,0.38,0.95)*e,1.);}`
  );
  gl.compileShader(fs);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, "r");
  const uT = gl.getUniformLocation(prog, "t");
  let start = performance.now();
  const loop = (now) => {
    if (document.hidden) {
      requestAnimationFrame(loop);
      return;
    }
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, (now - start) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

async function init() {
  try {
    const res = await fetch("data.json");
    DATA = res.ok ? await res.json() : FALLBACK_DATA;
  } catch (_) {
    DATA = FALLBACK_DATA;
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("menu-btn").addEventListener("click", () => {
    document.getElementById("mobile-nav").classList.toggle("open");
  });

  buildNav();
  currentView = (location.hash || "#home").replace("#", "") || "home";
  if (!DATA.nav.find((n) => n.id === currentView)) currentView = "home";
  render();
  updateNavActive();
  window.addEventListener("hashchange", () => {
    currentView = (location.hash || "#home").replace("#", "") || "home";
    render();
    updateNavActive();
  });
  initBg();
}

init();
