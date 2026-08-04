"use client";

import { useTheme } from "@/lib/theme";
import { withGlassShine, QUICK_EASE } from "@/lib/hoverStyles";
import { useState } from "react";

/**
 * A second, always-reachable theme toggle fixed to the bottom-right of
 * the viewport — doesn't depend on the nav header being scrolled into
 * its visible state, so the theme is always one click away.
 */
export default function FloatingThemeToggle() {
  const { theme, toggle } = useTheme();
  const [hovered, setHovered] = useState(false);
  const isDark = theme === "dark";

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    /* Not the shared <Tooltip> here on purpose: this button is
       position:fixed, and the shared .t-tt-wrap is position:relative —
       an empty inline-level wrap sitting directly in <body> still picks
       up a phantom line-height "strut" from the body's font metrics
       (this is what caused ~25px of scrollable space below the footer
       on every page). Putting position:fixed on the WRAP itself instead
       removes it from flow entirely, so it can't contribute any height,
       while the button inside just needs to fill it. */
    <span className="t-tt-wrap" style={{ position: "fixed", right: "20px", bottom: "20px", zIndex: 90 }}>
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      className="t-tt-trigger"
      style={{
        width: 44, height: 44,
        borderRadius: "50%",
        display: "grid", placeItems: "center",
        border: `1px solid ${hovered ? "var(--col-fg)" : "var(--surface-glass-border)"}`,
        background: hovered ? "var(--cta-bg-hover)" : "var(--surface-nav)",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        color: hovered ? "var(--cta-text-hover)" : "var(--col-fg)",
        cursor: "pointer",
        boxShadow: hovered
          ? withGlassShine("0 8px 20px rgba(var(--shadow-tint-rgb),0.22)")
          : "0 2px 6px rgba(var(--shadow-tint-rgb),0.14)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: `background 220ms var(--ease-out), color 220ms var(--ease-out), border-color 220ms var(--ease-out), box-shadow 220ms var(--ease-out), transform 220ms ${QUICK_EASE}`,
      }}
    >
      {isDark ? (
        <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.7l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M14 9.3A6.3 6.3 0 1 1 6.7 2 5 5 0 0 0 14 9.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
    </button>
    <span className="t-tt" role="tooltip">{label}</span>
    </span>
  );
}
