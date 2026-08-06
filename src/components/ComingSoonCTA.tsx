"use client";

import { withGlassShine } from "@/lib/hoverStyles";

/**
 * The "Back to homepage" CTA on the Playground "Coming Soon" stub —
 * pulled into its own client component (same reason as CaseStudyCover.tsx)
 * since the hover handlers below need a Client Component, and the page
 * itself otherwise doesn't need to be one. Same glass-pill CTA recipe as
 * Hero.tsx's "Let's Talk" button, reused here rather than reinvented.
 */
export default function ComingSoonCTA() {
  return (
    <a
      href="/"
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        marginTop: "10px",
        fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
        color: "var(--cta-text)",
        background: "var(--cta-bg)",
        border: "1px solid var(--cta-border)",
        borderRadius: "99px", padding: "10px 22px", textDecoration: "none",
        boxShadow: "0 1px 3px var(--cta-shadow), inset 0 1px 0 var(--cta-shine-rest)",
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)",
        transition: "background 220ms var(--ease-out), color 220ms var(--ease-out), box-shadow 220ms var(--ease-out), border-color 220ms var(--ease-out)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.background = "var(--cta-bg-hover)";
        el.style.color = "var(--cta-text-hover)";
        el.style.borderColor = "transparent";
        el.style.boxShadow = withGlassShine("0 6px 16px var(--cta-shadow-hover)");
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.background = "var(--cta-bg)";
        el.style.color = "var(--cta-text)";
        el.style.borderColor = "var(--cta-border)";
        el.style.boxShadow = "0 1px 3px var(--cta-shadow), inset 0 1px 0 var(--cta-shine-rest)";
      }}
    >
      Back to homepage
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M1 11L11 1M11 1H4.5M11 1V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
