/**
 * celebrateCopy — a small, self-contained particle burst used to celebrate
 * copying the email address. Pure Canvas 2D + vanilla JS, no dependencies.
 *
 * Usage:
 *   import { celebrateCopy } from "@/lib/celebrateCopy";
 *   celebrateCopy(buttonElement);
 *
 * Design intent: understated and physical, not "party confetti." Particles
 * pop outward with real velocity, get pulled down by gravity, slowed by air
 * resistance, drift slightly on the way, and fade out on a gentle curve —
 * closer to Stripe/Linear/Raycast-style micro-celebrations than a birthday
 * cracker. Respects prefers-reduced-motion (falls back to a button pulse).
 */

/* ── Tunables ─────────────────────────────────────────────────────── */
const PARTICLE_COUNT   = 210;      // total particles per burst (180–250 range)
const DURATION_MS      = 2800;     // overall animation ceiling
const GRAVITY          = 1400;     // px/s² — downward acceleration
const DRAG             = 0.985;    // per-frame-normalized velocity damping (closer to 1 = less drag)
const MAX_DT           = 1 / 30;   // clamp huge frame gaps (tab switches, etc.)
const COLORS           = ["#FFD166", "#FF6B6B", "#4ECDC4", "#6C63FF", "#FFFFFF"];

type ParticleType = "paper" | "circle" | "star" | "sparkle" | "envelope";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  rotation: number;
  angularVelocity: number;
  color: string;
  baseOpacity: number;
  life: number;        // ms elapsed since spawn
  maxLife: number;      // ms — total lifetime for this particle
  type: ParticleType;
  driftPhase: number;
  driftAmplitude: number;
  dead: boolean;
}

/* ── Small math helpers ──────────────────────────────────────────── */
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Fade curve — fully visible until 60% of life, then eases out. Gives the
 *  "energetic, then graceful" feel rather than a linear/abrupt vanish. */
function fadeCurve(lifeRatio: number): number {
  if (lifeRatio < 0.6) return 1;
  const f = (lifeRatio - 0.6) / 0.4;
  return 1 - f * f;
}

/* ── Particle factory ────────────────────────────────────────────── */
function spawnParticle(originX: number, originY: number, kind: "normal" | "hero" | "glitter"): Particle {
  // Burst mostly upward and outward — a wide cone centered on "up".
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
  const speed =
    kind === "hero"    ? rand(90, 180)  :
    kind === "glitter" ? rand(160, 320) :
                          rand(140, 340);

  const type: ParticleType =
    kind === "glitter" ? "sparkle" :
    kind === "hero"     ? pick<ParticleType>(["star", "circle", "paper"]) :
                           pick<ParticleType>(["paper", "circle", "star", "sparkle", "envelope"]);

  const size =
    kind === "hero"     ? rand(10, 15) :
    kind === "glitter"  ? rand(2, 4)   :
    type === "envelope" ? rand(7, 10)  :
                           rand(4, 8);

  return {
    x: originX,
    y: originY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size,
    rotation: rand(0, Math.PI * 2),
    angularVelocity: rand(-4, 4),
    color: pick(COLORS),
    baseOpacity: kind === "glitter" ? rand(0.7, 1) : rand(0.85, 1),
    life: 0,
    maxLife:
      kind === "hero"    ? rand(2200, 2800) :
      kind === "glitter" ? rand(350, 700) :
                            rand(1100, 2000),
    type,
    driftPhase: rand(0, Math.PI * 2),
    driftAmplitude: rand(6, 22),
    dead: false,
  };
}

function createParticles(originX: number, originY: number): Particle[] {
  const particles: Particle[] = [];
  const heroCount    = Math.round(PARTICLE_COUNT * 0.06);
  const glitterCount = Math.round(PARTICLE_COUNT * 0.16);
  const normalCount  = PARTICLE_COUNT - heroCount - glitterCount;

  for (let i = 0; i < normalCount;  i++) particles.push(spawnParticle(originX, originY, "normal"));
  for (let i = 0; i < heroCount;    i++) particles.push(spawnParticle(originX, originY, "hero"));
  for (let i = 0; i < glitterCount; i++) particles.push(spawnParticle(originX, originY, "glitter"));
  return particles;
}

/* ── Shape drawing — each particle type gets its own tiny renderer ─── */
function drawPaper(ctx: CanvasRenderingContext2D, p: Particle) {
  const w = p.size, h = p.size * 0.62;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(-w / 2, -h / 2, w, h, 1.5);
  else ctx.rect(-w / 2, -h / 2, w, h);
  ctx.fill();
}

function drawCircle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.beginPath();
  ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawStar(ctx: CanvasRenderingContext2D, p: Particle) {
  const spikes = 5;
  const outer = p.size / 2;
  const inner = outer * 0.45;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    const px = Math.cos(a) * r, py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawSparkle(ctx: CanvasRenderingContext2D, p: Particle) {
  // A small 4-point twinkle — thin diamond cross, with a very soft glow.
  const s = p.size;
  ctx.save();
  ctx.shadowColor = p.color;
  ctx.shadowBlur = s * 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -s); ctx.lineTo(s * 0.28, -s * 0.28);
  ctx.lineTo(s, 0);  ctx.lineTo(s * 0.28, s * 0.28);
  ctx.lineTo(0, s);  ctx.lineTo(-s * 0.28, s * 0.28);
  ctx.lineTo(-s, 0); ctx.lineTo(-s * 0.28, -s * 0.28);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawEnvelope(ctx: CanvasRenderingContext2D, p: Particle) {
  const w = p.size, h = p.size * 0.7;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(-w / 2, -h / 2, w, h, 1);
  else ctx.rect(-w / 2, -h / 2, w, h);
  ctx.fill();
  // Flap — a subtle darker triangle so it reads as an envelope at a glance
  ctx.save();
  ctx.globalAlpha *= 0.55;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(0, h * 0.06);
  ctx.lineTo(w / 2, -h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const DRAW: Record<ParticleType, (ctx: CanvasRenderingContext2D, p: Particle) => void> = {
  paper: drawPaper, circle: drawCircle, star: drawStar, sparkle: drawSparkle, envelope: drawEnvelope,
};

/* ── Physics step ────────────────────────────────────────────────── */
function stepParticle(p: Particle, dt: number) {
  p.life += dt * 1000;
  if (p.life >= p.maxLife) { p.dead = true; return; }

  p.vy += GRAVITY * dt;
  const damp = Math.pow(DRAG, dt * 60);
  p.vx *= damp;
  p.vy *= damp;

  p.driftPhase += dt * 2.4;
  const drift = Math.sin(p.driftPhase) * p.driftAmplitude;

  p.x += (p.vx + drift) * dt;
  p.y += p.vy * dt;
  p.rotation += p.angularVelocity * dt;
}

/* ── Reduced-motion fallback — a brief, tasteful scale pulse ────────── */
function pulseButton(button: HTMLElement) {
  const prev = button.style.transition;
  button.style.transition = "transform 220ms cubic-bezier(0.34,1.56,0.64,1)";
  button.style.transform = "scale(1.06)";
  window.setTimeout(() => {
    button.style.transform = "scale(1)";
    window.setTimeout(() => { button.style.transition = prev; }, 220);
  }, 140);
}

/* ── Public entry point ──────────────────────────────────────────── */
export function celebrateCopy(button: HTMLElement) {
  if (!button) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) { pulseButton(button); return; }

  const rect = button.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const particles = createParticles(originX, originY);
  let lastTime: number | null = null;
  let startTime: number | null = null;
  let rafId: number;

  function frame(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    if (lastTime === null) lastTime = timestamp;
    // Physics uses a clamped delta (stability on frame drops); the overall
    // duration ceiling uses the real wall-clock timestamp so cleanup always
    // fires on schedule regardless of frame-rate variance.
    const dt = Math.min((timestamp - lastTime) / 1000, MAX_DT);
    lastTime = timestamp;
    const elapsed = timestamp - startTime;

    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    let anyAlive = false;
    for (const p of particles) {
      if (p.dead) continue;
      stepParticle(p, dt);
      if (p.dead) continue;
      anyAlive = true;

      const lifeRatio = p.life / p.maxLife;
      const opacity = p.baseOpacity * fadeCurve(lifeRatio);
      if (opacity <= 0) continue;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.globalAlpha = opacity;
      ctx!.fillStyle = p.color;
      DRAW[p.type](ctx!, p);
      ctx!.restore();
    }

    if (anyAlive && elapsed < DURATION_MS) {
      rafId = requestAnimationFrame(frame);
    } else {
      cleanup();
    }
  }

  function cleanup() {
    window.removeEventListener("resize", resize);
    if (rafId) cancelAnimationFrame(rafId);
    canvas.remove();
  }

  rafId = requestAnimationFrame(frame);
}
