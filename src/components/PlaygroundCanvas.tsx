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
import { useIsMobile } from "@/lib/useIsMobile";

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

/* Each card's position/rotation exists in TWO variants — DESKTOP_LAYOUT
   (four loose columns with real breathing room, per earlier feedback
   that a tighter version read as chaotic on a wide screen where there
   was room to spare) and MOBILE_LAYOUT (a much denser cluster). Reusing
   the desktop spread on a phone was tried first and came back "too
   scattered... difficult to move around to find things" — a phone
   doesn't have room to spare, so the SAME wide-open layout that reads
   as spacious on desktop just reads as far-flung on mobile, needing
   real panning to find anything. MOBILE_LAYOUT packs the same 10 cards
   into a much smaller bounding box instead, closer to the real corkboard
   references from earlier — more overlap, less distance between any two
   cards, comfortably explorable without much panning at all. */
type Layout = { x: number; y: number; rotate: number };

const DESKTOP_LAYOUT: Record<string, Layout> = {
  "sticky-1": { x: 880, y: 540, rotate: -4 },
  "widget-todo": { x: 900, y: 900, rotate: -3 },
  "photo-screen1": { x: 860, y: 1270, rotate: -5 },
  "photo-tech1": { x: 1260, y: 460, rotate: 4 },
  "photo-tech2": { x: 1280, y: 830, rotate: -4 },
  "photo-event1": { x: 1660, y: 520, rotate: 5 },
  "photo-kitchen1": { x: 1680, y: 890, rotate: -3 },
  "widget-calendar": { x: 1650, y: 1260, rotate: 3 },
  "sticky-2": { x: 2040, y: 480, rotate: 3 },
  "sticky-3": { x: 2060, y: 850, rotate: -3 },
};

const MOBILE_LAYOUT: Record<string, Layout> = {
  "sticky-1": { x: 1400, y: 500, rotate: -5 },
  "widget-todo": { x: 1420, y: 770, rotate: -3 },
  "photo-screen1": { x: 1390, y: 1040, rotate: -6 },
  "photo-tech1": { x: 1560, y: 450, rotate: 4 },
  "photo-tech2": { x: 1575, y: 720, rotate: -4 },
  "widget-calendar": { x: 1550, y: 990, rotate: 3 },
  "photo-event1": { x: 1720, y: 480, rotate: 5 },
  "photo-kitchen1": { x: 1735, y: 750, rotate: -3 },
  "sticky-2": { x: 1710, y: 1020, rotate: 3 },
  "sticky-3": { x: 1560, y: 1260, rotate: -4 },
};

/* NOT the card cluster's full bounding box — deliberately smaller,
   roughly "a column and a bit" on desktop or "most of the board" on
   mobile (MOBILE_LAYOUT's own cluster is only ~440x830 world units, so
   this fits nearly the whole thing). InfiniteCanvas uses this to
   auto-fit its initial zoom on a narrow viewport — fitting the ENTIRE
   desktop board in was tried first and came back too zoomed out to read
   anything (per feedback) — this fits a comfortably legible slice
   instead. On a wide desktop viewport this is a no-op either way
   (already bigger than even the full board, clamps back to 1). */
const DESKTOP_CONTENT_BOUNDS = { width: 620, height: 760 };
const MOBILE_CONTENT_BOUNDS = { width: 560, height: 950 };

/* Hue-rotate degrees applied to the real pin.svg asset (a purple pin) —
   see Pin.tsx for why this is a hue shift rather than hand-edited
   gradient stops. 0 keeps the pin's native purple. */
const PIN_HUES = [150, -60, 0];

export default function PlaygroundCanvas() {
  const isMobile = useIsMobile();
  const [pinned, setPinned] = useState<Record<string, number>>({});
  const [bgColor, setBgColor] = useState<string | null>(null);

  const layout = isMobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT;
  const contentBounds = isMobile ? MOBILE_CONTENT_BOUNDS : DESKTOP_CONTENT_BOUNDS;
  const initialCenter = isMobile ? { x: 1560, y: 800 } : { x: 1560, y: 990 };

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

  // CanvasCard seeds its own drag-position ref from x/y ONCE at mount
  // (deliberately — that ref, not props, is what the drag physics
  // reads/writes from then on) and never reacts to x/y changing on a
  // later render. isMobile itself starts false and flips true a beat
  // after mount (see useIsMobile's own doc comment) — without a key
  // tied to it, every card would mount once with DESKTOP_LAYOUT's
  // coordinates already baked into that ref, and switching `layout`
  // afterward would visibly do nothing. This key forces a real
  // unmount/remount when the mode changes, so each card's ref re-seeds
  // from whichever layout is actually correct. Passed as its own literal
  // JSX attribute below, not spread from the `card()` props object —
  // React (19) specifically flags a spread-in `key` as an error, it has
  // to be a real attribute on the element.
  const cardKey = (id: string) => `${id}-${isMobile}`;

  const card = (id: string) => ({
    id,
    ...layout[id],
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
      initialCenter={initialCenter}
      fitWidth={contentBounds.width}
      fitHeight={contentBounds.height}
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
      <CanvasCard key={cardKey("sticky-1")} {...card("sticky-1")} width={210} zIndex={5}>
        <StickyNote seed="#B8631F" index="01" title="On design" text="Good design disappears. Bad design apologizes." />
      </CanvasCard>

      <CanvasCard key={cardKey("widget-todo")} {...card("widget-todo")} width={220} zIndex={4}>
        <TodoWidgetCard seed="#1F7A52" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-screen1")} {...card("photo-screen1")} width={190} zIndex={3}>
        <PhotoNote src="/screen-1.jpg" alt="Analytics dashboard on screen" title="The Numbers" subtitle="made fun, mostly" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-tech1")} {...card("photo-tech1")} width={210} zIndex={4}>
        <PhotoNote src="/tech-1.jpg" alt="Circuit board close-up" title="The Build" subtitle="where it happens" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-tech2")} {...card("photo-tech2")} width={220} zIndex={5}>
        <PhotoNote src="/tech-2.jpg" alt="Team collaborating around a table" title="The Huddle" subtitle="best ideas, argued over" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-event1")} {...card("photo-event1")} width={200} zIndex={4}>
        <PhotoNote src="/event-1.jpg" alt="Live event crowd" title="The Crowd" subtitle="conferences, occasionally" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-kitchen1")} {...card("photo-kitchen1")} width={210} zIndex={5}>
        <PhotoNote src="/kitchen-1.jpg" alt="Participants cooking together" title="The Table" subtitle="community > competition" />
      </CanvasCard>

      <CanvasCard key={cardKey("widget-calendar")} {...card("widget-calendar")} width={210} zIndex={3}>
        <CalendarCard />
      </CanvasCard>

      <CanvasCard key={cardKey("sticky-2")} {...card("sticky-2")} width={210} zIndex={4}>
        <StickyNote seed="#2A5FA5" index="02" title="Old habits" text="Still sketch everything on paper before Figma touches it." />
      </CanvasCard>

      <CanvasCard key={cardKey("sticky-3")} {...card("sticky-3")} width={200} zIndex={5}>
        <StickyNote seed="#75308B" index="03" title="Fun fact" text="Ask me about the dino in the footer. I'm weirdly proud of it." />
      </CanvasCard>
    </InfiniteCanvas>
  );
}
