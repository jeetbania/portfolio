"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";
import { MountFrame, InnerCard, derivePalette } from "./CanvasCardChrome";

/**
 * Two small interactive widgets for the Playground canvas, built on the
 * same MountFrame/InnerCard chrome as StickyNote (see
 * CanvasCardChrome.tsx) — "same sort of box UI," per feedback — instead
 * of their own separate flat-white style. Content sizes to fit naturally
 * rather than a fixed box, since a to-do list and a coffee counter
 * aren't the same shape as a short note.
 *
 * Only the actual interactive CONTROLS (a checkbox, the cup, the add-task
 * input) stop pointerdown propagation, not the whole card body — an
 * earlier pass stopped propagation on the card's outer wrapper, which
 * silently made the entire card undraggable (any drag starting anywhere
 * on it, not just on a button, got eaten before CanvasCard's own drag
 * handler ever saw it). Same fix applies to CanvasCalendarCard.tsx.
 */

const WIDGET_ICON_COLOR = "#fff";

/* ══════════════════════════════════════════════════════════════════
   To-do list — clicking a task checks it off AND draws a hand-scribbled
   strike-through across it, like crossing something off on paper. Can
   also add new tasks via the "+" row at the bottom.
   ══════════════════════════════════════════════════════════════════ */

type Task = { text: string; emoji: string; checked: boolean };

const INITIAL_TASKS: Task[] = [
  { text: "Reply to that one email", emoji: "📧", checked: false },
  { text: "Ship the redesign", emoji: "🚀", checked: false },
  { text: "Touch grass", emoji: "🌱", checked: false },
];

export function TodoWidgetCard({ seed = "#2A5FA5" }: { seed?: string }) {
  const { theme } = useTheme();
  const palette = derivePalette(seed, theme === "dark");
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = (i: number) => setTasks(t => t.map((task, idx) => (idx === i ? { ...task, checked: !task.checked } : task)));

  const startAdding = () => {
    setAdding(true);
    // Focus after the input actually mounts.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const commitAdd = () => {
    const text = draft.trim();
    if (text) setTasks(t => [...t, { text, emoji: "✏️", checked: false }]);
    setDraft("");
    setAdding(false);
  };

  return (
    <MountFrame>
      <InnerCard palette={palette} style={{ padding: "20px 16px 14px" }}>
        <span style={{ fontFamily: "var(--font-hand)", color: palette.ink, fontSize: "28px", lineHeight: "28px", display: "block", marginBottom: "8px" }}>
          today, probably
        </span>
        {tasks.map((task, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            onPointerDown={e => e.stopPropagation()}
            style={{
              display: "flex", alignItems: "center", gap: "9px",
              width: "100%", padding: "8px 0",
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              borderTop: i > 0 ? `1px solid ${palette.borderBottom}` : "none",
            }}
          >
            <span style={{
              flexShrink: 0, width: "18px", height: "18px", borderRadius: "6px",
              border: task.checked ? "none" : `1.5px solid ${palette.ink}`,
              background: task.checked ? palette.ink : "transparent",
              display: "grid", placeItems: "center",
              transition: "background 180ms var(--ease-out), border-color 180ms var(--ease-out)",
            }}>
              {task.checked && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6.2 5 8.7 9.5 3.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: "13.5px", color: palette.text }}>
              {task.text} {task.emoji}
              <ScribbleStrike active={task.checked} color={palette.ink} />
            </span>
          </button>
        ))}

        {adding ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onPointerDown={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === "Enter") commitAdd();
              if (e.key === "Escape") { setDraft(""); setAdding(false); }
            }}
            onBlur={commitAdd}
            placeholder="New task…"
            style={{
              width: "100%", padding: "8px 0", marginTop: "2px",
              background: "none", border: "none", outline: "none",
              borderTop: `1px solid ${palette.borderBottom}`,
              fontFamily: "var(--font-sans)", fontSize: "13.5px", color: palette.text,
            }}
          />
        ) : (
          <button
            onClick={startAdding}
            onPointerDown={e => e.stopPropagation()}
            style={{
              display: "flex", alignItems: "center", gap: "9px",
              width: "100%", padding: "8px 0", marginTop: tasks.length > 0 ? 0 : undefined,
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              borderTop: `1px solid ${palette.borderBottom}`,
              opacity: 0.75,
            }}
          >
            <span style={{
              flexShrink: 0, width: "18px", height: "18px", borderRadius: "6px",
              border: `1.5px dashed ${palette.ink}`,
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-sans)", fontSize: "12px", color: palette.ink, lineHeight: 1,
            }}>
              +
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "13.5px", color: palette.text }}>
              Add a task
            </span>
          </button>
        )}
      </InnerCard>
    </MountFrame>
  );
}

/**
 * The hand-drawn strike-through — one wavy SVG path, its length measured
 * at runtime (`getTotalLength`) so the draw-on animation (stroke-dashoffset
 * eased down to 0) actually traces the real path instead of an estimate.
 * Textured via an SVG filter (feTurbulence + feDisplacementMap, the same
 * technique the pin.svg asset uses for its own noise) instead of a plain
 * smooth stroke, so it reads as a pencil scribble rather than a vector
 * line — a unique filter id per instance (useId) since multiple todo
 * cards can be on the canvas at once and SVG filter ids are global.
 */
function ScribbleStrike({ active, color }: { active: boolean; color: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(240);
  const filterId = `pencil-texture-${useId()}`;

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 36"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: "-9px -10px", width: "calc(100% + 20px)", height: "calc(100% + 18px)", pointerEvents: "none", overflow: "visible" }}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-60%" width="140%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045 0.9" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path
        ref={pathRef}
        d="M4 20 C 34 6, 62 32, 96 16 S 150 4, 180 18 S 210 24, 216 16"
        fill="none"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity={0.82}
        filter={`url(#${filterId})`}
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
  const { theme } = useTheme();
  const palette = derivePalette(seed, theme === "dark");
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
        <span style={{ fontFamily: "var(--font-hand)", color: palette.ink, fontSize: "28px", lineHeight: "28px", display: "block", marginBottom: "10px" }}>
          coffee count
        </span>
        <button
          onClick={addCup}
          onPointerDown={e => e.stopPropagation()}
          aria-label="Add a cup"
          style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: palette.ink,
            border: "none", cursor: "pointer",
            display: "grid", placeItems: "center",
            fontSize: "22px", lineHeight: 1,
            color: WIDGET_ICON_COLOR,
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
      </InnerCard>
    </MountFrame>
  );
}
