"use client";

import { useState } from "react";
import { InfiniteCanvas } from "./InfiniteCanvas";
import { CanvasCard } from "./CanvasCard";
import { StickyNote, PhotoNote } from "./CanvasNoteCards";
import { TodoWidgetCard, CoffeeCounterCard } from "./CanvasWidgetCards";
import { PinTray } from "./PinTray";

/**
 * Everything on /playground lives here, INCLUDING the hero heading — per
 * feedback, the whole page (bar the fixed nav and the Footer below) is
 * meant to be part of the pannable/zoomable world, not a static heading
 * sitting above a boxed-in canvas widget. That's why this is one client
 * component now instead of page.tsx rendering a heading + a separate
 * <InfiniteCanvas>: the heading is just another absolutely-positioned
 * element inside the SAME world, it just doesn't have drag physics (see
 * the plain <div> below, not a <CanvasCard>).
 *
 * Pin state (which cards are locked down, and in what color) lives here
 * as real React state — unlike drag physics, pinning is a deliberate,
 * infrequent action, so a normal re-render per pin is totally fine, and
 * this is the natural lift-state-up point since both <PinTray> (drops a
 * pin) and every <CanvasCard> (needs to know if IT is the pinned one)
 * are siblings/descendants here.
 */

const WORLD_WIDTH = 3200;
const WORLD_HEIGHT = 2000;
const INITIAL_CENTER = { x: 1320, y: 355 };

const PIN_COLORS = ["#E8734A", "#3E7BFA", "#8B5CF6"];

export default function PlaygroundCanvas() {
  const [pinned, setPinned] = useState<Record<string, string>>({});

  const dropPin = (cardId: string, color: string) => {
    setPinned(p => ({ ...p, [cardId]: color }));
  };

  const card = (id: string) => ({
    id,
    pinned: Boolean(pinned[id]),
    pinColor: pinned[id],
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
  });

  return (
    <InfiniteCanvas
      worldWidth={WORLD_WIDTH}
      worldHeight={WORLD_HEIGHT}
      initialCenter={INITIAL_CENTER}
      height="88svh"
      overlay={<PinTray colors={PIN_COLORS} onDropOnCard={dropPin} />}
    >
      {/* Heading — plain, not a CanvasCard: pans/zooms with the world but
          never drags or tilts on its own. */}
      <div style={{ position: "absolute", left: 700, top: 60, width: 760, textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--col-muted)", marginBottom: "14px",
        }}>
          Playground
        </p>
        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: "clamp(34px, 4.4vw, 58px)",
          fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "16px",
        }}>
          A corner of the site with no real point.
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 500,
          letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--col-muted)",
          maxWidth: "540px", marginLeft: "auto", marginRight: "auto",
        }}>
          Drag the canvas, zoom in and out, move the cards wherever you want. Grab a pin if you want one to stay put.
        </p>
      </div>

      <CanvasCard {...card("sticky-1")} x={950} y={400} rotate={-4} width={200} zIndex={4}>
        <StickyNote tint="#F5D4B8" index="01" text="Good design disappears. Bad design apologizes." />
      </CanvasCard>

      <CanvasCard {...card("sticky-2")} x={1190} y={490} rotate={3} width={210} zIndex={5}>
        <StickyNote tint="#B8CEF5" index="02" text="Still sketch everything on paper before Figma touches it." />
      </CanvasCard>

      <CanvasCard {...card("sticky-3")} x={1090} y={650} rotate={-2} width={190} zIndex={3}>
        <StickyNote tint="#D4C9F5" index="03" text="Ask me about the dino in the footer. I'm weirdly proud of it." />
      </CanvasCard>

      <CanvasCard {...card("photo-tech1")} x={650} y={440} rotate={-6} width={230} zIndex={2}>
        <PhotoNote src="/tech-1.jpg" alt="Circuit board close-up" caption="Where the interesting problems live." />
      </CanvasCard>

      <CanvasCard {...card("photo-event1")} x={1460} y={380} rotate={5} width={220} zIndex={2}>
        <PhotoNote src="/event-1.jpg" alt="Live event crowd" caption="Conferences, occasionally." />
      </CanvasCard>

      <CanvasCard {...card("photo-kitchen1")} x={1510} y={680} rotate={-3} width={230} zIndex={2}>
        <PhotoNote src="/kitchen-1.jpg" alt="Participants cooking together" caption="Community over competition." />
      </CanvasCard>

      <CanvasCard {...card("photo-tech2")} x={760} y={730} rotate={4} width={240} zIndex={2}>
        <PhotoNote src="/tech-2.jpg" alt="Team collaborating around a table" caption="Best ideas happen around a table." />
      </CanvasCard>

      <CanvasCard {...card("photo-screen1")} x={960} y={890} rotate={-5} width={210} zIndex={1}>
        <PhotoNote src="/screen-1.jpg" alt="Analytics dashboard on screen" caption="Numbers, but make them fun." />
      </CanvasCard>

      <CanvasCard {...card("widget-coffee")} x={1770} y={510} rotate={3} width={190} zIndex={3}>
        <CoffeeCounterCard />
      </CanvasCard>

      <CanvasCard {...card("widget-todo")} x={1790} y={760} rotate={-3} width={240} zIndex={3}>
        <TodoWidgetCard />
      </CanvasCard>
    </InfiniteCanvas>
  );
}
