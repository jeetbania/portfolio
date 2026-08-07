"use client";

import { useState } from "react";
import { InfiniteCanvas } from "./InfiniteCanvas";
import { CanvasCard } from "./CanvasCard";
import { StickyNote, PhotoNote } from "./CanvasNoteCards";
import { TodoWidgetCard, CoffeeCounterCard } from "./CanvasWidgetCards";
import { CalendarCard } from "./CanvasCalendarCard";
import { PinTray } from "./PinTray";

/**
 * Everything on /playground lives here. Two things changed shape from the
 * first draft, per feedback:
 *
 * - The heading used to be plain content INSIDE the pannable world (so it
 *   panned/zoomed away like everything else). Now it's passed through
 *   InfiniteCanvas's `overlay` prop instead (same slot PinTray already
 *   used) and centered via .playground-heading in globals.css — it never
 *   moves, no matter what happens to the canvas underneath it.
 *   pointer-events: none on that class is what lets clicks/drags reach
 *   through to whatever canvas content happens to sit behind it.
 * - Cards are laid out in a loose ring around the world's center instead
 *   of a cluster starting near the top-left — with the heading now fixed
 *   dead-center of the viewport, the center of the INITIAL view needed to
 *   stay relatively clear so cards don't load in stacked directly behind
 *   the (unmovable) title.
 *
 * Pin state (which cards are locked down, and in what color) lives here
 * as real React state — pinning is a deliberate, infrequent action, so a
 * normal re-render per pin is fine, and this is the natural lift-state-up
 * point since both <PinTray> and every <CanvasCard> need it.
 */

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 1800;
const INITIAL_CENTER = { x: 1500, y: 900 };

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
      overlay={
        <>
          <div className="playground-heading" aria-hidden={false}>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--col-muted)", marginBottom: "14px",
            }}>
              Playground
            </p>
            <h1 style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4.2vw, 54px)",
              fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "16px",
            }}>
              A corner of the site with no real point.
            </h1>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 500,
              letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--col-muted)",
              maxWidth: "480px", marginLeft: "auto", marginRight: "auto",
            }}>
              Drag the canvas, zoom in and out, move the cards wherever you want. Grab a pin if you want one to stay put.
            </p>
          </div>
          <PinTray colors={PIN_COLORS} onDropOnCard={dropPin} />
        </>
      }
    >
      <CanvasCard {...card("sticky-1")} x={1050} y={550} rotate={-4} width={210} zIndex={4}>
        <StickyNote seed="#B8631F" index="01" title="On design" text="Good design disappears. Bad design apologizes." />
      </CanvasCard>

      <CanvasCard {...card("sticky-2")} x={1780} y={560} rotate={3} width={210} zIndex={5}>
        <StickyNote seed="#2A5FA5" index="02" title="Old habits" text="Still sketch everything on paper before Figma touches it." />
      </CanvasCard>

      <CanvasCard {...card("sticky-3")} x={1080} y={1160} rotate={-2} width={200} zIndex={3}>
        <StickyNote seed="#75308B" index="03" title="Fun fact" text="Ask me about the dino in the footer. I'm weirdly proud of it." />
      </CanvasCard>

      <CanvasCard {...card("photo-tech1")} x={760} y={650} rotate={-6} width={220} zIndex={2}>
        <PhotoNote src="/tech-1.jpg" alt="Circuit board close-up" caption="Where the interesting problems live." />
      </CanvasCard>

      <CanvasCard {...card("photo-event1")} x={2000} y={620} rotate={5} width={210} zIndex={2}>
        <PhotoNote src="/event-1.jpg" alt="Live event crowd" caption="Conferences, occasionally." />
      </CanvasCard>

      <CanvasCard {...card("photo-kitchen1")} x={1950} y={1080} rotate={-3} width={220} zIndex={2}>
        <PhotoNote src="/kitchen-1.jpg" alt="Participants cooking together" caption="Community over competition." />
      </CanvasCard>

      <CanvasCard {...card("photo-tech2")} x={790} y={1080} rotate={4} width={230} zIndex={2}>
        <PhotoNote src="/tech-2.jpg" alt="Team collaborating around a table" caption="Best ideas happen around a table." />
      </CanvasCard>

      <CanvasCard {...card("photo-screen1")} x={1190} y={1330} rotate={-5} width={200} zIndex={1}>
        <PhotoNote src="/screen-1.jpg" alt="Analytics dashboard on screen" caption="Numbers, but make them fun." />
      </CanvasCard>

      <CanvasCard {...card("widget-coffee")} x={2070} y={890} rotate={3} width={180} zIndex={3}>
        <CoffeeCounterCard seed="#B8375B" />
      </CanvasCard>

      <CanvasCard {...card("widget-todo")} x={710} y={890} rotate={-3} width={220} zIndex={3}>
        <TodoWidgetCard seed="#1F7A52" />
      </CanvasCard>

      <CanvasCard {...card("widget-calendar")} x={1650} y={1300} rotate={2} width={210} zIndex={3}>
        <CalendarCard />
      </CanvasCard>
    </InfiniteCanvas>
  );
}
