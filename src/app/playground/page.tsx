import type { Metadata } from "next";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";
import { InfiniteCanvas } from "@/components/InfiniteCanvas";
import { CanvasCard } from "@/components/CanvasCard";
import { StickyNote, PhotoNote } from "@/components/CanvasNoteCards";

export const metadata: Metadata = {
  title: "Playground — Jeet Bania",
  description: "A pannable, zoomable corner of the site — drag the cards around.",
};

/**
 * The real Playground page — replaces the earlier "Coming soon" stub.
 * Built after studying two references: a Framer "about" page with a
 * draggable board of sticky notes + captioned photos (that's where the
 * note/photo card SHAPE comes from), and an earlier portfolio's
 * drag-with-tilt physics on individual cards (that's where CanvasCard's
 * feel comes from) — see InfiniteCanvas.tsx / CanvasCard.tsx for the
 * actual reimplementation, which goes further than either reference by
 * adding true independent pan + zoom instead of a fixed scrollable board.
 *
 * The homepage still has its OWN, unrelated "Playground" section (fan
 * cards + Quick Ask, id="playground" in Playground.tsx) — nav's
 * "Playground" link points here now instead, per the earlier decoupling
 * (see Header.tsx). Content here is deliberately different from that
 * section (a looser, more exploratory moodboard) rather than repeating
 * the same current-project/currently-reading facts.
 *
 * World is 2600x1500 — big enough that dragging to its edges genuinely
 * reveals empty dotted canvas (the "almost infinite" feeling), while the
 * card cluster itself starts centered and mostly on-screen at 1x zoom so
 * a visitor isn't greeted by a blank viewport.
 */

const WORLD_WIDTH = 2600;
const WORLD_HEIGHT = 1500;
const CLUSTER_CENTER = { x: 1150, y: 620 };

export default function PlaygroundPage() {
  return (
    <main style={{ background: "var(--col-bg)" }}>
      <div style={{
        maxWidth: "1020px",
        margin: "0 auto",
        padding: "clamp(110px, 15vh, 160px) clamp(24px, 5vw, 72px) clamp(28px, 5vh, 48px)",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--col-muted)", marginBottom: "14px",
        }}>
          Playground
        </p>
        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: "clamp(38px, 6vw, 64px)",
          fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "18px",
          maxWidth: "680px", marginLeft: "auto", marginRight: "auto",
        }}>
          A corner of the site with no real point.
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 500,
          letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--col-muted)",
          maxWidth: "560px", marginLeft: "auto", marginRight: "auto",
        }}>
          Drag the canvas around, zoom in and out, move the cards wherever you want. Nothing here is precious.
        </p>
      </div>

      <div style={{
        maxWidth: "1240px", margin: "0 auto",
        padding: "0 clamp(16px, 3vw, 40px) clamp(60px, 9vh, 100px)",
      }}>
        <div style={{
          borderRadius: "clamp(20px,3vw,32px)",
          overflow: "hidden",
          border: "1px solid var(--surface-card-border)",
          boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.06), 0 24px 48px rgba(var(--shadow-tint-rgb),0.08), var(--glass-bevel)",
        }}>
          <InfiniteCanvas worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} initialCenter={CLUSTER_CENTER}>
            <CanvasCard x={950} y={380} rotate={-4} width={200} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} zIndex={4}>
              <StickyNote tint="#F5D4B8" text="Good design disappears. Bad design apologizes." />
            </CanvasCard>

            <CanvasCard x={1190} y={470} rotate={3} width={210} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} zIndex={5}>
              <StickyNote tint="#B8CEF5" text="Still sketch everything on paper before Figma touches it." />
            </CanvasCard>

            <CanvasCard x={1090} y={630} rotate={-2} width={190} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} zIndex={3}>
              <StickyNote tint="#D4C9F5" text="Ask me about the dino in the footer. I'm weirdly proud of it." />
            </CanvasCard>

            <CanvasCard x={650} y={420} rotate={-6} width={230} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} zIndex={2}>
              <PhotoNote src="/tech-1.jpg" alt="Circuit board close-up" caption="Where the interesting problems live." />
            </CanvasCard>

            <CanvasCard x={1460} y={360} rotate={5} width={220} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} zIndex={2}>
              <PhotoNote src="/event-1.jpg" alt="Live event crowd" caption="Conferences, occasionally." />
            </CanvasCard>

            <CanvasCard x={1510} y={660} rotate={-3} width={230} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} zIndex={2}>
              <PhotoNote src="/kitchen-1.jpg" alt="Participants cooking together" caption="Community over competition." />
            </CanvasCard>

            <CanvasCard x={760} y={710} rotate={4} width={240} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} zIndex={2}>
              <PhotoNote src="/tech-2.jpg" alt="Team collaborating around a table" caption="Best ideas happen around a table." />
            </CanvasCard>

            <CanvasCard x={960} y={870} rotate={-5} width={210} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} zIndex={1}>
              <PhotoNote src="/screen-1.jpg" alt="Analytics dashboard on screen" caption="Numbers, but make them fun." />
            </CanvasCard>
          </InfiniteCanvas>
        </div>
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
