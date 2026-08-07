import type { Metadata } from "next";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";
import PlaygroundShell from "@/components/PlaygroundShell";

export const metadata: Metadata = {
  title: "Playground — Jeet Bania",
  description: "A pannable, zoomable corner of the site — drag the cards around, pin a few down.",
};

/**
 * Back to a contained canvas per feedback — the full-page version made
 * the footer hard to reach (the canvas ate every wheel event for
 * panning, and there was no page beyond it to grab a normal scroll
 * from). A framed card sitting in normal page flow, like every other
 * page's content, means the page itself still scrolls normally below it.
 */
export default function PlaygroundPage() {
  return (
    <main style={{ background: "var(--col-bg)" }}>
      <div style={{
        maxWidth: "min(1900px, 97vw)", margin: "0 auto",
        padding: "clamp(100px, 13vh, 150px) clamp(10px, 2vw, 28px) clamp(50px, 8vh, 90px)",
      }}>
        <div style={{
          borderRadius: "clamp(20px,3vw,32px)",
          overflow: "hidden",
          border: "1px solid var(--surface-card-border)",
          boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.06), 0 24px 48px rgba(var(--shadow-tint-rgb),0.08), var(--glass-bevel)",
        }}>
          <PlaygroundShell />
        </div>
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
