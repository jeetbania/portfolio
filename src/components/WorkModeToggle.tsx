"use client";

import { useRef, useLayoutEffect } from "react";
import { animate } from "motion";

export type WorkMode = "work" | "interactions";

const MODES: { key: WorkMode; label: string }[] = [
  { key: "work", label: "Work" },
  { key: "interactions", label: "Interactions" },
];

/**
 * Top-of-page "Work / Interactions" switch — same sliding frosted-glass
 * highlight mechanic as FilterBar's category tabs (measure the active
 * button, spring the highlight to its rect), just trimmed down to two
 * fixed options and no search/sort alongside it, since this switches the
 * page's entire content area rather than filtering within one view. Kept
 * as its own small component instead of somehow bending FilterBar to fit,
 * since FilterBar's shape (filters[] + search + sort) doesn't map onto
 * "swap the whole page body" cleanly.
 */
export default function WorkModeToggle({ mode, onModeChange }: { mode: WorkMode; onModeChange: (m: WorkMode) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<WorkMode, HTMLButtonElement | null>>({ work: null, interactions: null });
  const highlightRef = useRef<HTMLDivElement>(null);
  const initDone = useRef(false);

  useLayoutEffect(() => {
    const btn = btnRefs.current[mode];
    const container = containerRef.current;
    const highlight = highlightRef.current;
    if (!btn || !container || !highlight) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const x = btnRect.left - containerRect.left;
    const y = btnRect.top - containerRect.top;
    const { width, height } = btnRect;

    if (!initDone.current) {
      initDone.current = true;
      animate(highlight, { x, y, width, height }, { duration: 0 });
      return;
    }
    animate(highlight, { x, y, width, height }, { type: "spring", duration: 0.5, bounce: 0.22 });
  }, [mode]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-flex",
        gap: "2px",
        padding: "4px",
        borderRadius: "14px",
        background: "var(--surface-glass)",
        border: "1px solid var(--surface-glass-border)",
        boxShadow: "var(--glass-bevel)",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
      }}
    >
      <div
        ref={highlightRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: "10px",
          background: "var(--col-fg)",
          zIndex: 0,
          willChange: "transform, width, height",
        }}
      />
      {MODES.map(m => {
        const isActive = mode === m.key;
        return (
          <button
            key={m.key}
            ref={el => { btnRefs.current[m.key] = el; }}
            onClick={() => onModeChange(m.key)}
            aria-pressed={isActive}
            style={{
              position: "relative",
              zIndex: 1,
              padding: "8px 18px",
              borderRadius: "10px",
              border: "none",
              background: "transparent",
              fontFamily: "var(--font-sans)",
              fontSize: "13.5px",
              fontWeight: 500,
              color: isActive ? "var(--col-bg)" : "var(--col-muted)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color 220ms var(--ease-out)",
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
