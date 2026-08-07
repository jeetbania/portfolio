"use client";

import { useState } from "react";
import { InfiniteCanvas } from "./InfiniteCanvas";
import { CanvasCard } from "./CanvasCard";
import { StickyNote, PhotoNote } from "./CanvasNoteCards";
import { TodoWidgetCard } from "./CanvasWidgetCards";
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
const INITIAL_CENTER = { x: 1560, y: 990 };

/* The card cluster's own bounding box (world units) — deliberately
   smaller than WORLD_WIDTH/HEIGHT, which is the whole pannable area, not
   "the board." InfiniteCanvas uses this to auto-fit its initial zoom so
   a narrow (mobile) viewport starts zoomed out enough to actually show
   more than one column, instead of starting at 100% and cropping most of
   the board off-screen — see the fitWidth/fitHeight prop below. */
const CONTENT_BOUNDS = { width: 1500, height: 1180 };

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
      fitWidth={CONTENT_BOUNDS.width}
      fitHeight={CONTENT_BOUNDS.height}
      height="min(84vh, 920px)"
      backgroundColor={bgColor ?? undefined}
      overlay={
        <>
          <PinTray hues={PIN_HUES} onDropOnCard={dropPin} />
          <MusicWidget />
          <BackgroundPicker value={bgColor} onChange={setBgColor} />
        </>
      }
    >
      {/* Card layout — four loose columns with real breathing room between
          them (per feedback that the earlier tight interlocked version
          read as chaotic), not a rigid grid either: rotation and a little
          per-card y-offset keep it feeling placed by hand rather than
          snapped to a spreadsheet. */}

      {/* ── Column A ── */}
      <CanvasCard {...card("sticky-1")} x={880} y={540} rotate={-4} width={210} zIndex={5}>
        <StickyNote seed="#B8631F" index="01" title="On design" text="Good design disappears. Bad design apologizes." />
      </CanvasCard>

      <CanvasCard {...card("widget-todo")} x={900} y={900} rotate={-3} width={220} zIndex={4}>
        <TodoWidgetCard seed="#1F7A52" />
      </CanvasCard>

      <CanvasCard {...card("photo-screen1")} x={860} y={1270} rotate={-5} width={190} zIndex={3}>
        <PhotoNote src="/screen-1.jpg" alt="Analytics dashboard on screen" title="The Numbers" subtitle="made fun, mostly" />
      </CanvasCard>

      {/* ── Column B ── */}
      <CanvasCard {...card("photo-tech1")} x={1260} y={460} rotate={4} width={210} zIndex={4}>
        <PhotoNote src="/tech-1.jpg" alt="Circuit board close-up" title="The Build" subtitle="where it happens" />
      </CanvasCard>

      <CanvasCard {...card("photo-tech2")} x={1280} y={830} rotate={-4} width={220} zIndex={5}>
        <PhotoNote src="/tech-2.jpg" alt="Team collaborating around a table" title="The Huddle" subtitle="best ideas, argued over" />
      </CanvasCard>

      {/* ── Column C ── */}
      <CanvasCard {...card("photo-event1")} x={1660} y={520} rotate={5} width={200} zIndex={4}>
        <PhotoNote src="/event-1.jpg" alt="Live event crowd" title="The Crowd" subtitle="conferences, occasionally" />
      </CanvasCard>

      <CanvasCard {...card("photo-kitchen1")} x={1680} y={890} rotate={-3} width={210} zIndex={5}>
        <PhotoNote src="/kitchen-1.jpg" alt="Participants cooking together" title="The Table" subtitle="community > competition" />
      </CanvasCard>

      <CanvasCard {...card("widget-calendar")} x={1650} y={1260} rotate={3} width={210} zIndex={3}>
        <CalendarCard />
      </CanvasCard>

      {/* ── Column D ── */}
      <CanvasCard {...card("sticky-2")} x={2040} y={480} rotate={3} width={210} zIndex={4}>
        <StickyNote seed="#2A5FA5" index="02" title="Old habits" text="Still sketch everything on paper before Figma touches it." />
      </CanvasCard>

      <CanvasCard {...card("sticky-3")} x={2060} y={850} rotate={-3} width={200} zIndex={5}>
        <StickyNote seed="#75308B" index="03" title="Fun fact" text="Ask me about the dino in the footer. I'm weirdly proud of it." />
      </CanvasCard>
    </InfiniteCanvas>
  );
}
