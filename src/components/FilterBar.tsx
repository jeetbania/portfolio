"use client";

import { useRef, useLayoutEffect } from "react";
import { animate } from "motion";
import { useIsMobile } from "@/lib/useIsMobile";
import MobileFloatingMenu from "./MobileFloatingMenu";

export type SortDir = "newest" | "oldest";

/**
 * Shared nested-tab filter bar — category tabs with a sliding frosted-glass
 * highlight (the "Board / List / Timeline" look), a glass search input, and
 * a glass sort toggle. Originally built for the blog listing page; the Work
 * page reuses this verbatim rather than keeping its own near-identical copy,
 * so both pages stay visually and behaviorally in sync automatically.
 */
export default function FilterBar({
  filters,
  active,
  onActiveChange,
  query,
  onQueryChange,
  searchPlaceholder = "Search",
  sort,
  onSortToggle,
}: {
  filters: string[];
  active: string;
  onActiveChange: (f: string) => void;
  query: string;
  onQueryChange: (q: string) => void;
  searchPlaceholder?: string;
  sort: SortDir;
  onSortToggle: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const highlightRef = useRef<HTMLDivElement>(null);
  const initDone = useRef(false);

  useLayoutEffect(() => {
    const btn = btnRefs.current[active];
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
  }, [active]);

  const isMobile = useIsMobile();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "36px",
      }}
    >
      {/* Desktop: sliding-highlight tab row. Mobile: a horizontal row of
          this many pills either wraps awkwardly or forces a scroll gesture
          just to see what's there — replaced with the bottom floating
          pill menu instead (see MobileFloatingMenu). */}
      {isMobile ? (
        <MobileFloatingMenu
          triggerLabel={active}
          items={filters.map(f => ({ key: f, label: f, active: f === active, onSelect: () => onActiveChange(f) }))}
        />
      ) : (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
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
            background: "var(--surface-glass-strong)",
            border: "1px solid var(--col-border)",
            boxShadow: "0 1px 3px rgba(var(--shadow-tint-rgb),0.12), 0 4px 10px rgba(var(--shadow-tint-rgb),0.07), var(--glass-bevel)",
            zIndex: 0,
            willChange: "transform, width, height",
          }}
        />
        {filters.map(f => {
          const isActive = active === f;
          return (
            <button
              key={f}
              ref={el => { btnRefs.current[f] = el; }}
              onClick={() => onActiveChange(f)}
              style={{
                position: "relative",
                zIndex: 1,
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                background: "transparent",
                fontFamily: "var(--font-sans)",
                fontSize: "13.5px",
                fontWeight: 500,
                color: isActive ? "var(--col-fg)" : "var(--col-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 220ms var(--ease-out)",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Search — glass pill. Deliberately no focus ring: browsers apply
            :focus-visible to text inputs even on a plain mouse click (a
            real spec quirk, not something CSS alone can override per
            input), so a ring here would show on click too — which is
            exactly what looked bad. Knowingly trading the WCAG 2.4.7
            credit on this one input for that. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 14px",
            borderRadius: "99px",
            background: "var(--surface-glass)",
            border: "1px solid var(--surface-glass-border)",
            boxShadow: "var(--glass-bevel)",
            backdropFilter: "blur(18px) saturate(180%)",
            WebkitBackdropFilter: "blur(18px) saturate(180%)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, opacity: 0.55 }}>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "var(--font-sans)",
              fontSize: "13.5px",
              color: "var(--col-fg)",
              width: "128px",
            }}
          />
        </div>

        {/* Sort toggle — glass pill */}
        <button
          onClick={onSortToggle}
          aria-label={`Sort: ${sort === "newest" ? "newest first" : "oldest first"}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 14px",
            borderRadius: "99px",
            border: "1px solid var(--surface-glass-border)",
            background: "var(--surface-glass)",
            boxShadow: "var(--glass-bevel)",
            backdropFilter: "blur(18px) saturate(180%)",
            WebkitBackdropFilter: "blur(18px) saturate(180%)",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--col-fg)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ opacity: 0.6, transform: sort === "oldest" ? "scaleY(-1)" : undefined }}>
            <path d="M3 4.5 6 1.5 9 4.5M6 1.5V10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {sort === "newest" ? "Newest" : "Oldest"}
        </button>
      </div>
    </div>
  );
}
