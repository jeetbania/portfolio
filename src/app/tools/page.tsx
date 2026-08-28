import type { Metadata } from "next";
import { tools } from "@/data/tools";
import ToolsGrid from "@/components/ToolsGrid";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";

export const metadata: Metadata = {
  title: "Tools",
  description: "Small tools and plugins I've built on the side.",
};

export default function ToolsPage() {
  return (
    <main style={{ background: "var(--col-bg)" }}>
      <div style={{
        maxWidth: "1160px",
        margin: "0 auto",
        padding: "clamp(56px, 8vh, 88px) clamp(24px, 5vw, 72px) clamp(24px, 5vw, 64px)",
      }}>
        {/* ── Hero, same treatment as /blog's ── */}
        <div style={{ marginBottom: "clamp(48px, 7vh, 72px)", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--col-muted)", marginBottom: "14px",
          }}>
            Tools
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(38px, 6vw, 64px)",
            fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "18px",
            maxWidth: "680px", marginLeft: "auto", marginRight: "auto",
          }}>
            Things I've built on the side.
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 500,
            letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--col-muted)",
            maxWidth: "560px", marginLeft: "auto", marginRight: "auto",
          }}>
            A few small web tools and Figma plugins, built for myself first, and how each one came together.
          </p>
        </div>

        {/* 2-column, not the blog grid's 3, these cards carry a heavier
            screenshot-style thumbnail than a blog card's flat gradient,
            so they read better with more room per card. No filter bar,
            there are only a handful of these so far. */}
        <ToolsGrid tools={tools} />
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
