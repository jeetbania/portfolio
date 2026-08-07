"use client";

import { useState } from "react";
import { InfiniteCanvas } from "./InfiniteCanvas";
import { CanvasCard } from "./CanvasCard";
import { StickyNote, PhotoNote } from "./CanvasNoteCards";
import { TodoWidgetCard, CoffeeCounterCard } from "./CanvasWidgetCards";
import { CalendarCard } from "./CanvasCalendarCard";
import { PinTray } from "./PinTray";
import { MusicWidget } from "./MusicWidget";
import { BackgroundPicker } from "./BackgroundPicker";

/**
 * Everything on /playground lives here. Back to a contained canvas per
 * feedback (page.tsx frames it now — see that file), and PinTray/
 * MusicWidget/BackgroundPicker all sit in InfiniteCanvas's `overlay`
 * slot (fixed to the canvas's own corner, not the pannable world).
 *
 * Pin state (which cards are locked down, and which pin color) and the
 * canvas's background tint both live here as real React state — both
 * are deliberate, infrequent actions, so a normal re-render each time is
 * fine, and this is the natural lift-state-up point since the controls
 * and every <CanvasCard> both need them.
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
  const [bgColor, setBgColor] = useState<string | null>(null);

  const dropPin = (cardId: string, hueRotate: number) => {
    setPinned(p => ({ ...p, [cardId]: hueRotate }));
  };

  const unpin = (cardId: string) => {
    setPinned(p => {
      if (!Object.prototype.hasOwnProperty.call(p, cardId)) return p;
      const next = { ...p };
      delete next[cardId];
      return next;
    });
  };

  const card = (id: string) => ({
    id,
    pinned: Object.prototype.hasOwnProperty.call(pinned, id),
    pinHue: pinned[id],
    onUnpin: unpin,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
  });

  return (
    <InfiniteCanvas
      worldWidth={WORLD_WIDTH}
      worldHeight={WORLD_HEIGHT}
      initialCenter={INITIAL_CENTER}
      backgroundColor={bgColor ?? undefined}
      overlay={
        <>
          <PinTray hues={PIN_HUES} onDropOnCard={dropPin} />
          <MusicWidget />
          <BackgroundPicker value={bgColor} onChange={setBgColor} />
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

      <CanvasCard {...card("photo-tech1")} x={740} y={640} rotate={-6} width={210} zIndex={2}>
        <PhotoNote src="/tech-1.jpg" alt="Circuit board close-up" title="The Build" subtitle="where it happens" />
      </CanvasCard>

      <CanvasCard {...card("photo-event1")} x={2010} y={610} rotate={5} width={200} zIndex={2}>
        <PhotoNote src="/event-1.jpg" alt="Live event crowd" title="The Crowd" subtitle="conferences, occasionally" />
      </CanvasCard>

      <CanvasCard {...card("photo-kitchen1")} x={1960} y={1080} rotate={-3} width={210} zIndex={2}>
        <PhotoNote src="/kitchen-1.jpg" alt="Participants cooking together" title="The Table" subtitle="community > competition" />
      </CanvasCard>

      <CanvasCard {...card("photo-tech2")} x={780} y={1080} rotate={4} width={220} zIndex={2}>
        <PhotoNote src="/tech-2.jpg" alt="Team collaborating around a table" title="The Huddle" subtitle="best ideas, argued over" />
      </CanvasCard>

      <CanvasCard {...card("photo-screen1")} x={1200} y={1320} rotate={-5} width={190} zIndex={1}>
        <PhotoNote src="/screen-1.jpg" alt="Analytics dashboard on screen" title="The Numbers" subtitle="made fun, mostly" />
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
