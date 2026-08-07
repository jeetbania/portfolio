"use client";

import { useState } from "react";
import { InfiniteCanvas } from "./InfiniteCanvas";
import { CanvasCard } from "./CanvasCard";
import { StickyNote, PhotoNote } from "./CanvasNoteCards";
import { TodoWidgetCard, CoffeeCounterCard } from "./CanvasWidgetCards";
import { CalendarCard } from "./CanvasCalendarCard";
import { PinTray } from "./PinTray";

/**
 * Everything on /playground lives here. No heading anymore — per
 * feedback it read as cleaner without one, so this page opens directly
 * on the canvas itself; PinTray is the only thing left in InfiniteCanvas's
 * `overlay` slot (fixed to the canvas's own corner, not the pannable
 * world).
 *
 * Cards are laid out in a loose ring around the world's center — that
 * gap in the middle used to matter because a fixed heading sat there;
 * now it's just breathing room, which still reads fine (an "almost
 * infinite" canvas earns a bit of open space).
 *
 * Pin state (which cards are locked down, and which pin color) lives
 * here as real React state — pinning is a deliberate, infrequent action,
 * so a normal re-render per pin is fine, and this is the natural
 * lift-state-up point since both <PinTray> and every <CanvasCard> need it.
 */

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 1800;
const INITIAL_CENTER = { x: 1500, y: 900 };

/* Hue-rotate degrees applied to the real pin.svg asset (a purple pin) —
   see Pin.tsx for why this is a hue shift rather than hand-edited
   gradient stops. 0 keeps the pin's native purple. */
const PIN_HUES = [150, -60, 0];

export default function PlaygroundCanvas() {
  const [pinned, setPinned] = useState<Record<string, number>>({});

  const dropPin = (cardId: string, hueRotate: number) => {
    setPinned(p => ({ ...p, [cardId]: hueRotate }));
  };

  const card = (id: string) => ({
    id,
    pinned: Object.prototype.hasOwnProperty.call(pinned, id),
    pinHue: pinned[id],
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
  });

  return (
    <InfiniteCanvas
      worldWidth={WORLD_WIDTH}
      worldHeight={WORLD_HEIGHT}
      initialCenter={INITIAL_CENTER}
      height="88svh"
      overlay={<PinTray hues={PIN_HUES} onDropOnCard={dropPin} />}
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

      <CanvasCard {...card("photo-tech1")} x={740} y={640} rotate={-6} width={210} zIndex={2}>
        <PhotoNote src="/tech-1.jpg" alt="Circuit board close-up" title="The Build" subtitle="where it happens" dot="#E8734A" />
      </CanvasCard>

      <CanvasCard {...card("photo-event1")} x={2010} y={610} rotate={5} width={200} zIndex={2}>
        <PhotoNote src="/event-1.jpg" alt="Live event crowd" title="The Crowd" subtitle="conferences, occasionally" dot="#3E7BFA" />
      </CanvasCard>

      <CanvasCard {...card("photo-kitchen1")} x={1960} y={1080} rotate={-3} width={210} zIndex={2}>
        <PhotoNote src="/kitchen-1.jpg" alt="Participants cooking together" title="The Table" subtitle="community > competition" dot="#2E9B6B" />
      </CanvasCard>

      <CanvasCard {...card("photo-tech2")} x={780} y={1080} rotate={4} width={220} zIndex={2}>
        <PhotoNote src="/tech-2.jpg" alt="Team collaborating around a table" title="The Huddle" subtitle="best ideas, argued over" dot="#8B5CF6" />
      </CanvasCard>

      <CanvasCard {...card("photo-screen1")} x={1200} y={1320} rotate={-5} width={190} zIndex={1}>
        <PhotoNote src="/screen-1.jpg" alt="Analytics dashboard on screen" title="The Numbers" subtitle="made fun, mostly" dot="#E0527A" />
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
