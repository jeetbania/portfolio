import type { Metadata } from "next";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";
import PlaygroundCanvas from "@/components/PlaygroundCanvas";

export const metadata: Metadata = {
  title: "Playground — Jeet Bania",
  description: "A pannable, zoomable corner of the site — drag the cards around, pin a few down.",
};

/**
 * Per feedback: the whole page (bar the fixed nav and the Footer) is now
 * part of the pannable canvas, not a heading sitting above a boxed-in
 * widget — see PlaygroundCanvas.tsx, which owns the heading, the world,
 * and every card. This file is deliberately thin: metadata (needs a
 * Server Component) + the canvas + the same RoundedCap/Footer close every
 * other page uses.
 */
export default function PlaygroundPage() {
  return (
    <main style={{ background: "var(--col-bg)" }}>
      <PlaygroundCanvas />
      <RoundedCap />
      <Footer />
    </main>
  );
}
