"use client";

import { useEffect, useRef, useState } from "react";
import { MountFrame, InnerCard, derivePalette } from "./CanvasCardChrome";

/**
 * Two small interactive widgets for the Playground canvas, now built on
 * the same MountFrame/InnerCard chrome as StickyNote (see
 * CanvasCardChrome.tsx) — "same sort of box UI," per feedback — instead
 * of their own separate flat-white style. Content sizes to fit naturally
 * (no fixed height) rather than the paper.design reference's fixed
 * 268x264 — that's the "more responsive, fits better" part: a todo list
 * and a coffee counter aren't the same shape as a short note.
 *
 * Every clickable element inside stops pointerdown propagation so
 * tapping a checkbox or the coffee cup registers as a click rather than
 * starting the card's own drag — same reasoning as CanvasCard's
 * stopPropagation against the canvas pan underneath it, one level down.
 */

/* ══════════════════════════════════════════════════════════════════
   To-do list — clicking a task checks it off AND draws a hand-scribbled
   strike-through across it, like crossing something off on paper.
   ══════════════════════════════════════════════════════════════════ */

const TASKS = [
  { text: "Reply to that one email", emoji: "📧" },
  { text: "Ship the redesign", emoji: "🚀" },
  { text: "Touch grass", emoji: "🌱" },
];

export function TodoWidgetCard({ seed = "#2A5FA5" }: { seed?: string }) {
  const palette = derivePalette(seed);
  const [checked, setChecked] = useState<boolean[]>(() => TASKS.map(() => false));

  const toggle = (i: number) => setChecked(c => c.map((v, idx) => (idx === i ? !v : v)));

  return (
    <MountFrame>
      <InnerCard palette={palette} style={{ padding: "20px 16px 14px" }} >
        <div onPointerDown={e => e.stopPropagation()}>
          <span style={{ fontFamily: "var(--font-hand)", color: palette.ink, fontSize: "28px", lineHeight: "28px", display: "block", marginBottom: "8px" }}>
            today, probably
          </span>
          {TASKS.map((task, i) => (
            <button
              key={task.text}
              onClick={() => toggle(i)}
              style={{
                display: "flex", alignItems: "center", gap: "9px",
                width: "100%", padding: "8px 0",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                borderTop: i > 0 ? `1px solid ${palette.borderBottom}` : "none",
              }}
            >
              <span style={{
                flexShrink: 0, width: "18px", height: "18px", borderRadius: "6px",
                border: checked[i] ? "none" : `1.5px solid ${palette.ink}`,
                background: checked[i] ? palette.ink : "transparent",
                display: "grid", placeItems: "center",
                transition: "background 180ms var(--ease-out), border-color 180ms var(--ease-out)",
              }}>
                {checked[i] && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2 5 8.7 9.5 3.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: "13.5px", color: "var(--canvas-ink-strong)" }}>
                {task.text} {task.emoji}
                <ScribbleStrike active={checked[i]} color={palette.ink} />
              </span>
            </button>
          ))}
        </div>
      </InnerCard>
    </MountFrame>
  );
}

/** The hand-drawn strike-through — one wavy SVG path, its length measured
 * at runtime (`getTotalLength`) so the draw-on animation (stroke-dashoffset
 * eased down to 0) actually traces the real path instead of an estimate. */
function ScribbleStrike({ active, color }: { active: boolean; color: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(240);

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 36"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: "-9px -10px", width: "calc(100% + 20px)", height: "calc(100% + 18px)", pointerEvents: "none" }}
    >
      <path
        ref={pathRef}
        d="M4 20 C 34 6, 62 32, 96 16 S 150 4, 180 18 S 210 24, 216 16"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        style={{
          strokeDasharray: len,
          strokeDashoffset: active ? 0 : len,
          transition: "stroke-dashoffset 520ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Coffee counter — click the cup, count goes up, cup gives a little
   spring-bounce. Same "coffee count" idea as the homepage fan card, just
   an actually-clickable version here instead of a static stat.
   ══════════════════════════════════════════════════════════════════ */

export function CoffeeCounterCard({ seed = "#B8631F" }: { seed?: string }) {
  const palette = derivePalette(seed);
  const [count, setCount] = useState(12);
  const [bump, setBump] = useState(false);
  const bumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addCup = () => {
    setCount(c => c + 1);
    setBump(true);
    if (bumpTimer.current) clearTimeout(bumpTimer.current);
    bumpTimer.current = setTimeout(() => setBump(false), 280);
  };

  useEffect(() => () => { if (bumpTimer.current) clearTimeout(bumpTimer.current); }, []);

  return (
    <MountFrame>
      <InnerCard palette={palette} style={{ padding: "20px 16px 18px", textAlign: "center" }}>
        <div onPointerDown={e => e.stopPropagation()}>
          <span style={{ fontFamily: "var(--font-hand)", color: palette.ink, fontSize: "28px", lineHeight: "28px", display: "block", marginBottom: "10px" }}>
            coffee count
          </span>
          <button
            onClick={addCup}
            aria-label="Add a cup"
            style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: palette.ink,
              border: "none", cursor: "pointer",
              display: "grid", placeItems: "center",
              fontSize: "22px", lineHeight: 1,
              boxShadow: `0 4px 10px color-mix(in srgb, ${palette.ink} 45%, transparent)`,
              transform: bump ? "scale(1.14) rotate(-6deg)" : "scale(1) rotate(0deg)",
              transition: "transform 240ms cubic-bezier(0.34,1.6,0.64,1)",
            }}
          >
            ☕
          </button>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "24px", fontWeight: 700, color: "var(--canvas-ink-strong)", margin: "10px 0 0", lineHeight: 1 }}>
            {count}
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: palette.text, margin: "3px 0 0" }}>
            cups, allegedly
          </p>
        </div>
      </InnerCard>
    </MountFrame>
  );
}
