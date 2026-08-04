import type { Metadata } from "next";
import { projects } from "@/data/projects";
import WorkFilterGrid from "@/components/WorkFilterGrid";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";

export const metadata: Metadata = {
  title: "Work — Jeet Bania",
  description: "Product, UX, and motion design work.",
};

export default function WorkPage() {
  return (
    <main style={{ background: "var(--col-bg)" }}>
      <div style={{
        maxWidth: "1020px",
        margin: "0 auto",
        padding: "clamp(110px, 15vh, 160px) clamp(24px, 5vw, 72px) clamp(24px, 5vw, 64px)",
      }}>
        {/* ── Hero — center-aligned to match the About page treatment.
            maxWidth'd h1/p need margin:auto too, not just text-align,
            since text-align only centers the text INSIDE the box — the
            box itself still needs centering within the full-width
            container. ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: "clamp(48px, 7vh, 72px)", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--col-muted)", marginBottom: "14px",
          }}>
            Work
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(38px, 6vw, 64px)",
            fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "18px",
            maxWidth: "680px", marginLeft: "auto", marginRight: "auto",
          }}>
            A closer look at what I&rsquo;ve built.
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 500,
            letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--col-muted)",
            maxWidth: "560px", marginLeft: "auto", marginRight: "auto",
          }}>
            Product design, motion, and everything in between — six projects, six different problems, one obsession with getting the details right.
          </p>
        </div>

        {/* ── Fluid filter bar + project grid ─────────────────────── */}
        <WorkFilterGrid projects={projects} />
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
