export type NetworkNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  label?: string;
};

export type NetworkEdge = {
  from: number;
  to: number;
  packet: number;
  speed: number;
};

export type NodeNetworkConfig = {
  nodeCount: number;
  width: number;
  height: number;
  seed?: number;
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function createNodeNetwork({ nodeCount, width, height, seed = 42 }: NodeNetworkConfig) {
  const rand = seededRandom(seed);
  const nodes: NetworkNode[] = [];
  const edges: NetworkEdge[] = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: rand() * width,
      y: rand() * height,
      vx: (rand() - 0.5) * 0.4,
      vy: (rand() - 0.5) * 0.4,
      radius: 3 + rand() * 5,
      hue: 170 + rand() * 40,
      label: i % 4 === 0 ? ["ingest", "route", "heal", "emit"][i % 4] : undefined,
    });
  }

  for (let i = 0; i < nodes.length; i++) {
    const connections = 1 + Math.floor(rand() * 2);
    for (let c = 0; c < connections; c++) {
      const j = Math.floor(rand() * nodes.length);
      if (i !== j) {
        edges.push({
          from: i,
          to: j,
          packet: rand(),
          speed: 0.15 + rand() * 0.25,
        });
      }
    }
  }

  return { nodes, edges };
}

export function tickNetwork(
  nodes: NetworkNode[],
  width: number,
  height: number,
  paused: boolean
) {
  if (paused) return;
  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
    n.x = Math.max(0, Math.min(width, n.x));
    n.y = Math.max(0, Math.min(height, n.y));
  }
}

export function drawNodeNetwork(
  ctx: CanvasRenderingContext2D,
  nodes: NetworkNode[],
  edges: NetworkEdge[],
  time: number,
  opts: {
    paused?: boolean;
    glow?: boolean;
    showLabels?: boolean;
    accent?: "cyan" | "indigo" | "teal";
  } = {}
) {
  const { paused = false, glow = true, showLabels = false } = opts;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.clearRect(0, 0, w, h);

  // subtle grid
  ctx.strokeStyle = "rgba(34, 211, 238, 0.04)";
  ctx.lineWidth = 1;
  const grid = 40;
  for (let x = 0; x < w; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  if (!paused) {
    for (const e of edges) {
      e.packet += e.speed * 0.008;
      if (e.packet > 1) e.packet = 0;
    }
  }

  for (const e of edges) {
    const a = nodes[e.from];
    const b = nodes[e.to];
    if (!a || !b) continue;

    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, "rgba(34, 211, 238, 0.15)");
    grad.addColorStop(1, "rgba(99, 102, 241, 0.25)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    const px = a.x + (b.x - a.x) * e.packet;
    const py = a.y + (b.y - a.y) * e.packet;
    ctx.fillStyle = "rgba(34, 211, 238, 0.9)";
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const n of nodes) {
    if (glow) {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 4);
      g.addColorStop(0, `hsla(${n.hue}, 80%, 60%, 0.35)`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = `hsla(${n.hue}, 75%, 65%, 0.95)`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (showLabels && n.label) {
      ctx.font = "10px var(--font-dm-sans), sans-serif";
      ctx.fillStyle = "rgba(165, 243, 252, 0.7)";
      ctx.fillText(n.label, n.x + n.radius + 4, n.y + 3);
    }
  }

  // scan line
  if (!paused) {
    const scanY = ((time * 0.03) % 1) * h;
    const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
    scanGrad.addColorStop(0, "transparent");
    scanGrad.addColorStop(0.5, "rgba(34, 211, 238, 0.06)");
    scanGrad.addColorStop(1, "transparent");
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 30, w, 60);
  }
}
