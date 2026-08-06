import type { Metadata } from "next";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";
import ComingSoonCTA from "@/components/ComingSoonCTA";

export const metadata: Metadata = {
  title: "Playground — Jeet Bania",
  description: "A dedicated Playground page is on its way.",
};

/**
 * Standing in for a real Playground page. The homepage still has its own
 * "Playground" section (fan cards + Quick Ask, id="playground" in
 * Playground.tsx) — that's staying put and unrelated to this route. What
 * changed is the nav: "Playground" used to scroll-jump to that homepage
 * section (and get scroll-spy highlighted while it was in view); now it
 * link out here instead, since a real, separate Playground page is coming
 * later. See Header.tsx's SECTIONS entry for the href change and the
 * scroll-spy id filter that stopped observing it.
 */
export default function PlaygroundPage() {
  return (
    <main style={{ background: "var(--col-bg)" }}>
      <div style={{
        minHeight: "70svh",
        maxWidth: "620px",
        margin: "0 auto",
        padding: "clamp(140px, 20vh, 200px) clamp(24px, 5vw, 40px) clamp(80px, 12vh, 120px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "18px",
      }}>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600,
          letterSpacing: "0.04em", textTransform: "uppercase",
          color: "var(--col-muted)",
        }}>
          Playground
        </span>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(40px, 6.5vw, 64px)",
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          color: "var(--col-fg)",
        }}>
          Coming soon.
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(17px, 2vw, 20px)",
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: "-0.02em",
          color: "var(--col-muted)",
          maxWidth: "440px",
        }}>
          A proper home for the fan cards, Quick Ask, and whatever else lands in the Playground is on its way. For now, come say hi on the homepage.
        </p>
        <ComingSoonCTA />
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
