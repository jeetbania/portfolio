import type { Metadata } from "next";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";
import PlaygroundCanvas from "@/components/PlaygroundCanvas";

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
        maxWidth: "1240px", margin: "0 auto",
        padding: "clamp(110px, 15vh, 160px) clamp(16px, 3vw, 40px) clamp(60px, 9vh, 100px)",
      }}>
        <div style={{
          borderRadius: "clamp(20px,3vw,32px)",
          overflow: "hidden",
          border: "1px solid var(--surface-card-border)",
          boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.06), 0 24px 48px rgba(var(--shadow-tint-rgb),0.08), var(--glass-bevel)",
        }}>
          <PlaygroundCanvas />
        </div>
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
