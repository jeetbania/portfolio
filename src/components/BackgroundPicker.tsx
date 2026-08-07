"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * A small row of pastel swatches (off a reference) that recolor the
 * canvas's own backdrop — nothing else on the page, just this card's
 * background. `null` means "use the theme default" (var(--col-bg)),
 * which is also the initial state — a visitor has to actively pick a
 * tint rather than land on an already-changed page.
 *
 * On mobile this collapses to a single round trigger (the currently
 * active color, or a neutral swatch-stack icon when none is picked) that
 * expands the row upward on tap — the desktop row doesn't fit next to the
 * zoom controls on a narrow screen otherwise (per feedback, it was
 * overlapping them). Same expand/collapse convention as
 * MobileFloatingMenu.tsx: a spring open, snappier spring close, tap
 * outside to dismiss.
 */

export const BACKGROUND_SWATCHES = [
  "#F9D6E4", // pink
  "#FBDBB8", // orange
  "#FBF0AE", // yellow
  "#D3F2C7", // green
  "#C8E6F7", // blue
  "#DCD0F5", // purple
];

const PANEL_OPEN_SPRING = { type: "spring" as const, duration: 0.4, bounce: 0.34 };
const PANEL_CLOSE_SPRING = { type: "spring" as const, duration: 0.24, bounce: 0.1 };

export function BackgroundPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (color: string | null) => void;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  useEffect(() => {
    if (!isMobile) return;
    const el = panelRef.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      animate(el, { scale: 1, y: 0, opacity: 1 }, reduced ? { duration: 0 } : PANEL_OPEN_SPRING);
    } else {
      animate(el, { scale: 0.9, y: 8, opacity: 0 }, reduced ? { duration: 0 } : PANEL_CLOSE_SPRING);
    }
  }, [open, isMobile]);

  const swatches = (
    <>
      {BACKGROUND_SWATCHES.map(color => (
        <button
          key={color}
          type="button"
          className={`bg-picker-swatch ${value === color ? "bg-picker-swatch-active" : ""}`}
          style={{ background: color }}
          onClick={() => { onChange(value === color ? null : color); setOpen(false); }}
          aria-label={`Set canvas background to ${color}`}
          aria-pressed={value === color}
        />
      ))}
      {/* Reset — no swatch itself reads as "back to default" the way a
          dedicated icon does, so a color once picked had no obvious way
          back per feedback. Dims/disables once already at the default so
          it doesn't look clickable when there's nothing to reset. */}
      <button
        type="button"
        className="bg-picker-reset"
        onClick={() => { onChange(null); setOpen(false); }}
        disabled={!value}
        aria-label="Reset canvas background to default"
        title="Reset background"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1M13.5 1.5V4.6H10.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );

  if (!isMobile) {
    return (
      <div className="bg-picker" onPointerDown={e => e.stopPropagation()}>
        {swatches}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="bg-picker-mobile" onPointerDown={e => e.stopPropagation()}>
      <button
        type="button"
        className="bg-picker-trigger"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Choose a canvas background color"
        style={value ? { background: value } : undefined}
      >
        {!value && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.4 2.4" />
          </svg>
        )}
      </button>

      <div className="bg-picker-panel-wrap" aria-hidden={!open}>
        <div ref={panelRef} className="bg-picker-panel" style={{ pointerEvents: open ? "auto" : "none" }}>
          {swatches}
        </div>
      </div>
    </div>
  );
}
