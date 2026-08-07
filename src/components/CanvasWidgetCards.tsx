"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Two small interactive widgets for the Playground canvas — the "these
 * beautiful UIs are so fun, add some of these" part of the request. Both
 * are self-contained client components with their own state (unlike
 * StickyNote/PhotoNote, which are pure presentational). Every clickable
 * element inside stops pointerdown propagation so tapping a checkbox or
 * the coffee cup registers as a click rather than starting the card's
 * own drag — same reasoning as CanvasCard's stopPropagation against the
 * canvas pan underneath it, one level down.
 */

const WIDGET_CARD_STYLE: React.CSSProperties = {
  borderRadius: "18px",
  padding: "18px 18px 20px",
  background: "var(--surface-opaque)",
  border: "1px solid var(--surface-card-border)",
  boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 10px 20px rgba(0,0,0,0.08), 0 26px 44px rgba(0,0,0,0.08)",
};

/* ══════════════════════════════════════════════════════════════════
   To-do list — clicking a task checks it off AND draws a hand-scribbled
   strike-through across it, like crossing something off on paper.
   ══════════════════════════════════════════════════════════════════ */

const TASKS = [
  { text: "Reply to that one email", emoji: "📧" },
  { text: "Ship the redesign", emoji: "🚀" },
  { text: "Touch grass", emoji: "🌱" },
];

export function TodoWidgetCard() {
  const [checked, setChecked] = useState<boolean[]>(() => TASKS.map(() => false));

  const toggle = (i: number) => setChecked(c => c.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div style={WIDGET_CARD_STYLE} onPointerDown={e => e.stopPropagation()}>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600,
        letterSpacing: "0.06em", textTransform: "uppercase",
        color: "var(--col-muted)", margin: "0 0 12px",
      }}>
        Today, probably
      </p>
      <div>
        {TASKS.map((task, i) => (
          <button
            key={task.text}
            onClick={() => toggle(i)}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              width: "100%", padding: "9px 0",
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              borderTop: i > 0 ? "1px solid var(--col-hairline)" : "none",
            }}
          >
            <span style={{
              flexShrink: 0, width: "19px", height: "19px", borderRadius: "6px",
              border: checked[i] ? "none" : "1.5px solid var(--col-muted)",
              background: checked[i] ? "var(--folder-yap)" : "transparent",
              display: "grid", placeItems: "center",
              transition: "background 180ms var(--ease-out), border-color 180ms var(--ease-out)",
            }}>
              {checked[i] && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6.2 5 8.7 9.5 3.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: "14.5px", color: "var(--col-fg)" }}>
              {task.text} {task.emoji}
              <ScribbleStrike active={checked[i]} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** The hand-drawn strike-through — one wavy SVG path, its length measured
 * at runtime (`getTotalLength`) so the draw-on animation (stroke-dashoffset
 * eased down to 0) actually traces the real path instead of an estimate. */
function ScribbleStrike({ active }: { active: boolean }) {
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
        stroke="var(--folder-yap)"
        strokeWidth="6.5"
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

export function CoffeeCounterCard() {
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
    <div style={{ ...WIDGET_CARD_STYLE, textAlign: "center" }} onPointerDown={e => e.stopPropagation()}>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600,
        letterSpacing: "0.06em", textTransform: "uppercase",
        color: "var(--col-muted)", margin: "0 0 12px",
      }}>
        Coffee count
      </p>
      <button
        onClick={addCup}
        aria-label="Add a cup"
        style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "linear-gradient(180deg, #6FA8F5 0%, #2563C7 100%)",
          border: "none", cursor: "pointer",
          display: "grid", placeItems: "center",
          fontSize: "24px", lineHeight: 1,
          boxShadow: "0 4px 10px rgba(37,99,199,0.35)",
          transform: bump ? "scale(1.14) rotate(-6deg)" : "scale(1) rotate(0deg)",
          transition: "transform 240ms cubic-bezier(0.34,1.6,0.64,1)",
        }}
      >
        ☕
      </button>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: "26px", fontWeight: 700,
        color: "var(--col-fg)", margin: "12px 0 0", lineHeight: 1,
      }}>
        {count}
      </p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", color: "var(--col-muted)", margin: "4px 0 0" }}>
        cups, allegedly
      </p>
    </div>
  );
}
