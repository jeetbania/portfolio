import type { Metadata } from "next";
import DinoGame from "@/components/DinoGame";
import RoundedCap from "@/components/RoundedCap";

export const metadata: Metadata = {
  title: "404 — Jeet Bania",
  description: "This page doesn't exist. Play a round of Jeet Run while you're here.",
};

/**
 * Next.js's special file for both unmatched routes and any explicit
 * notFound() call — renders inside the root layout automatically
 * (Header/DotGrid/ThemeProvider all still apply), so this file only
 * needs its own main content.
 *
 * Centerpiece is DinoGame (pulled out of Footer.tsx into its own file
 * for exactly this reuse) rather than a new illustration — it's a
 * proven, already-loved easter egg, self-contained/theme-independent by
 * design, so dropping it here carried zero new visual risk. Deliberately
 * skips the full <Footer> (its "Work with me" contact CTA doesn't fit
 * someone who just hit a dead link) in favor of one direct "Take me
 * home" link, so escaping the page never depends on finding the game.
 */
export default function NotFound() {
  return (
    <main style={{ background: "var(--col-bg)", minHeight: "100svh" }}>
      <div style={{
        maxWidth: "1020px",
        margin: "0 auto",
        padding: "clamp(110px, 15vh, 160px) clamp(20px, 5vw, 60px) clamp(64px, 9vh, 100px)",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(36px, 6vh, 56px)" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--col-muted)", marginBottom: "14px",
          }}>
            404
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(34px, 5.5vw, 56px)",
            fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "14px",
            maxWidth: "640px", marginLeft: "auto", marginRight: "auto",
          }}>
            You&rsquo;ve wandered off the map.
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 500,
            color: "var(--col-muted)", maxWidth: "440px", marginLeft: "auto", marginRight: "auto",
          }}>
            Even the dino hasn&rsquo;t run this far. Give it a shot while you&rsquo;re here.
          </p>
        </div>

        <DinoGame />

        {/* Plain CSS :hover (.notfound-home-link in globals.css) rather than
            the inline onMouseEnter/onMouseLeave pattern Hero.tsx's matching
            CTA uses — that pattern needs a Client Component, and this page
            stays a Server Component so the `metadata` export above works. */}
        <a href="/" className="notfound-home-link" style={{
          marginTop: "clamp(32px, 5vh, 48px)",
          display: "inline-flex", alignItems: "center", gap: "8px",
          fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
          color: "var(--cta-text)",
          background: "var(--cta-bg)",
          border: "1px solid var(--cta-border)",
          borderRadius: "99px", padding: "10px 22px", textDecoration: "none",
          boxShadow: "0 1px 3px var(--cta-shadow), inset 0 1px 0 var(--cta-shine-rest)",
          backdropFilter: "blur(12px) saturate(160%)",
          WebkitBackdropFilter: "blur(12px) saturate(160%)",
        }}>
          Take me home
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 11L11 1M11 1H4.5M11 1V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <RoundedCap />
    </main>
  );
}
