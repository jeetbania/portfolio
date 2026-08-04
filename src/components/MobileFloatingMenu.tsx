"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate } from "motion";

const PANEL_OPEN_SPRING  = { type: "spring" as const, duration: 0.46, bounce: 0.38 };
const PANEL_CLOSE_SPRING = { type: "spring" as const, duration: 0.28, bounce: 0.1  };

export interface FloatingMenuItem {
  key: string;
  label: string;
  active?: boolean;
  onSelect: () => void;
}

/**
 * Mobile-only tab/TOC replacement — a pill anchored to the bottom-left of
 * the viewport that expands upward into a small glass menu on tap.
 * Explicitly not "the most usable" pattern (a plain horizontal scroller
 * would be more discoverable) — this is a deliberate visual choice for
 * mobile: the horizontal scrolling tab strip it replaces didn't work well
 * on phone (needed a scroll gesture just to see what's there), and this
 * reads as a more distinct, tactile mobile-native moment.
 *
 * The trigger pill's width is JS-measured and re-applied on every
 * `triggerLabel` change (same "measure, then set an explicit pixel value"
 * technique FilterBar.tsx uses for its sliding tab highlight) so the
 * `.t-resize` CSS class (transitions.dev — see globals.css) can actually
 * tween the width change instead of snapping: CSS can't animate between
 * two "auto" widths, only between two known pixel values.
 */
export default function MobileFloatingMenu({
  triggerLabel,
  items,
  leading,
}: {
  triggerLabel: string;
  items: FloatingMenuItem[];
  /** Optional row pinned above a divider at the top of the menu — e.g. "Back". */
  leading?: { label: string; onSelect: () => void };
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pillWidth, setPillWidth] = useState<number>();

  useLayoutEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    /* Can't just read el.scrollWidth here — the button is a flex
       container still holding its PREVIOUS (possibly smaller) explicit
       width from the last render. Flexbox shrinks the label span to fit
       whatever width is already applied before overflow is ever
       computed, so scrollWidth on a flex box reports the current
       (possibly too-small) size, not the natural one — it never sees
       real overflow to report. Free the width constraint first so the
       label lays out at its natural size, measure THAT, then hand the
       result to React; the resulting re-render (still pre-paint, since
       this is a layout effect) overwrites this temporary style before
       the browser ever paints it. */
    el.style.width = "max-content";
    setPillWidth(el.scrollWidth);
  }, [triggerLabel]);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  /* Spring-driven open/close instead of a fixed CSS cubic-bezier — a real
     overshoot on open reads as more premium/tactile. Separate curves for
     open vs close (snappier, near-zero bounce on close) matching the
     folder-card convention elsewhere (Folder.tsx's OPEN_SPRING/CLOSE_SPRING). */
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      animate(el, { scale: 1, y: 0, opacity: 1 }, reduced ? { duration: 0 } : PANEL_OPEN_SPRING);
    } else {
      animate(el, { scale: 0.92, y: 10, opacity: 0 }, reduced ? { duration: 0 } : PANEL_CLOSE_SPRING);
    }
  }, [open]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 45,
          background: "rgba(0,0,0,0.32)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 220ms var(--ease-out)",
        }}
      />

      <div
        ref={wrapRef}
        style={{
          position: "fixed",
          left: "calc(18px + env(safe-area-inset-left, 0px))",
          bottom: "calc(18px + env(safe-area-inset-bottom, 0px))",
          zIndex: 50,
        }}
      >
        {/* Trigger pill — width is JS-measured (see pillWidth above) and
            tweened by .t-resize whenever the label's natural size changes,
            instead of just snapping to the new width. */}
        <button
          ref={btnRef}
          className="t-resize"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            width: pillWidth ? `${pillWidth}px` : "auto",
            /* border-box, not the content-box default — the width above
               is JS-measured via scrollWidth (content + padding, no
               border), so without border-box the 2px border reads as
               "extra" on top of that measurement and starves the text by
               the same 2px, clipping the last character. */
            boxSizing: "border-box",
            padding: "13px 22px",
            borderRadius: "99px",
            border: "1px solid var(--surface-glass-border)",
            background: "var(--surface-nav)",
            boxShadow: "0 10px 26px rgba(var(--shadow-tint-rgb),0.2), var(--glass-bevel)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600,
            color: "var(--col-fg)",
            whiteSpace: "nowrap", overflow: "hidden",
          }}
        >
          {/* flexShrink:0 on both children — any sub-pixel rounding slop
              between the max-content measurement and the applied fixed
              width should get absorbed by the button's own overflow:hidden
              at the outer edge, not by this text quietly ellipsis-ing off
              its last character (which is what a shrinkable flex-basis
              span did here). */}
          <span style={{ flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {triggerLabel}
          </span>
          <svg
            width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
            style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 220ms var(--ease-out)" }}
          >
            <path d="M2.5 4.5 6 8 9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Positioning wrapper — position:absolute (not a normal flex-flow
            sibling of the pill) so it never reserves layout space in the
            closed state. A statically-flowed panel kept its full box at
            scale(0.92)/opacity:0 (CSS transforms don't collapse layout),
            and this wrapRef's default pointer-events:auto let that
            invisible box swallow taps to whatever page content sat
            underneath it at a given scroll position. Always
            pointer-events:none itself; the real panel below toggles its
            own pointer-events with `open`. */}
        <div
          aria-hidden={!open}
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 0,
            width: "fit-content",
            minWidth: pillWidth ? `${pillWidth}px` : undefined,
            maxWidth: "min(320px, calc(100vw - 40px))",
            pointerEvents: "none",
          }}
        >
          <div
            ref={panelRef}
            role="menu"
            style={{
              borderRadius: "20px",
              background: "var(--surface-nav)",
              border: "1px solid var(--surface-glass-border)",
              boxShadow: "0 20px 44px rgba(var(--shadow-tint-rgb),0.2), var(--glass-bevel)",
              backdropFilter: "blur(22px) saturate(180%)",
              WebkitBackdropFilter: "blur(22px) saturate(180%)",
              overflow: "hidden",
              transformOrigin: "bottom left",
              opacity: 0,
              transform: "scale(0.92) translateY(10px)",
              pointerEvents: open ? "auto" : "none",
            }}
          >
            <div style={{ maxHeight: "min(52vh, 380px)", overflowY: "auto", padding: "6px" }}>
              {leading && (
                <>
                  <button
                    onClick={() => { leading.onSelect(); setOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px", width: "100%",
                      padding: "12px 14px", borderRadius: "13px", border: "none",
                      background: "transparent", textAlign: "left", cursor: "pointer",
                      fontFamily: "var(--font-sans)", fontSize: "14.5px", fontWeight: 500,
                      color: "var(--col-fg)", whiteSpace: "nowrap",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M11.5 7H2.5M2.5 7L6 3.5M2.5 7L6 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {leading.label}
                  </button>
                  <div style={{ height: 1, background: "var(--col-hairline)", margin: "4px 10px" }} />
                </>
              )}
              {items.map(item => (
                <button
                  key={item.key}
                  role="menuitemradio"
                  aria-checked={!!item.active}
                  onClick={() => { item.onSelect(); setOpen(false); }}
                  style={{
                    display: "block", width: "100%",
                    padding: "12px 14px", borderRadius: "13px", border: "none",
                    background: item.active ? "var(--toc-active-bg)" : "transparent",
                    textAlign: "left", cursor: "pointer", whiteSpace: "nowrap",
                    fontFamily: "var(--font-sans)", fontSize: "14.5px",
                    fontWeight: item.active ? 600 : 400,
                    color: item.active ? "var(--col-fg)" : "var(--col-muted)",
                    transition: "background 120ms var(--ease-out), color 120ms var(--ease-out)",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
