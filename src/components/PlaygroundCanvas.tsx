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

/* Each card's position/rotation/size exists in TWO variants —
   DESKTOP_LAYOUT (four loose columns with real breathing room, per
   earlier feedback that a tighter version read as chaotic on a wide
   screen where there was room to spare) and MOBILE_LAYOUT (a much
   denser cluster). Reusing the desktop spread on a phone was tried
   first and came back "too scattered... difficult to move around to
   find things" — a phone doesn't have room to spare, so the SAME
   wide-open layout that reads as spacious on desktop just reads as
   far-flung on mobile, needing real panning to find anything.
   MOBILE_LAYOUT packs the same 10 cards into a much smaller bounding
   box instead, closer to the real corkboard references from earlier.
   `height` here is an ESTIMATE, not a real prop CanvasCard accepts
   (its actual height is intrinsic to its content) — it only exists so
   computeBounds() below can work out a real bounding box without
   needing to measure the live DOM. */
type Layout = { x: number; y: number; rotate: number; width: number; height: number };

/* Photo cards' width/height (both here and in MOBILE_LAYOUT below) are no
   longer arbitrary — each one is sized off its actual image's aspect
   ratio (see the aspectRatio props at each <PhotoNote> call site further
   down), landscape photos wider, portrait photos narrower/taller, per
   feedback that a polaroid should take its photo's real shape instead of
   every card being forced into the same square crop. `height` here is
   still just computeBounds()'s bounding-box ESTIMATE (mat padding +
   caption block ~82px, added on top of each image's real height at its
   card's width) — not a real CanvasCard prop. */
const DESKTOP_LAYOUT: Record<string, Layout> = {
  "sticky-1": { x: 880, y: 540, rotate: -4, width: 210, height: 200 },
  "widget-todo": { x: 900, y: 900, rotate: -3, width: 220, height: 230 },
  "photo-screen1": { x: 860, y: 1270, rotate: -5, width: 190, height: 335 },
  "photo-tech1": { x: 1260, y: 460, rotate: 4, width: 250, height: 270 },
  "photo-tech2": { x: 1280, y: 830, rotate: -4, width: 250, height: 270 },
  "photo-event1": { x: 1660, y: 520, rotate: 5, width: 190, height: 335 },
  "photo-kitchen1": { x: 1680, y: 890, rotate: -3, width: 180, height: 327 },
  "widget-calendar": { x: 1650, y: 1260, rotate: 3, width: 210, height: 260 },
  "sticky-2": { x: 2040, y: 480, rotate: 3, width: 210, height: 200 },
  "sticky-3": { x: 2060, y: 850, rotate: -3, width: 200, height: 200 },
};

/* Was noticeably tighter — per feedback ("too clamped together"), every
   card here sits ~30% further from the cluster's own center than the
   first pass, same relative arrangement (columns/rows), just with real
   breathing room between neighbors instead of edges nearly touching. */
const MOBILE_LAYOUT: Record<string, Layout> = {
  "sticky-1": { x: 1350, y: 398, rotate: -5, width: 210, height: 200 },
  "widget-todo": { x: 1376, y: 749, rotate: -3, width: 220, height: 230 },
  "photo-screen1": { x: 1337, y: 1100, rotate: -6, width: 175, height: 315 },
  "photo-tech1": { x: 1558, y: 333, rotate: 4, width: 220, height: 247 },
  "photo-tech2": { x: 1577, y: 684, rotate: -4, width: 220, height: 247 },
  "widget-calendar": { x: 1545, y: 1035, rotate: 3, width: 210, height: 260 },
  "photo-event1": { x: 1766, y: 372, rotate: 5, width: 175, height: 315 },
  "photo-kitchen1": { x: 1785, y: 723, rotate: -3, width: 165, height: 306 },
  "sticky-2": { x: 1753, y: 1074, rotate: 3, width: 210, height: 200 },
  "sticky-3": { x: 1557, y: 1386, rotate: -4, width: 200, height: 200 },
};

/* Derives the true bounding box (and its exact center) straight from a
   layout's own x/y/width/height, instead of a hand-picked center that
   has to be kept in sync by eye every time coordinates change — that
   drift is exactly what put the mobile view visibly off-center before:
   the initialCenter constant was typed by hand and just didn't quite
   match where the cluster really sat. This can't drift, since it's
   computed FROM the same numbers the cards actually render at. */
function computeBounds(layout: Record<string, Layout>) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const id in layout) {
    const { x, y, width, height } = layout[id];
    minX = Math.min(minX, x - width / 2);
    maxX = Math.max(maxX, x + width / 2);
    minY = Math.min(minY, y - height / 2);
    maxY = Math.max(maxY, y + height / 2);
  }
  return {
    center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
    width: maxX - minX,
    height: maxY - minY,
  };
}

const MOBILE_BOUNDS = computeBounds(MOBILE_LAYOUT);

/* Desktop keeps a hand-picked, deliberately SMALLER fit box (it's "a
   column and a bit" of the much wider desktop spread, not the whole
   thing — fitting the entire desktop board in came back too zoomed out
   to read, per earlier feedback). Mobile uses the cluster's own real
   bounds (+ a margin) instead, since the cluster IS meant to mostly fit
   in view there. */
const DESKTOP_CONTENT_BOUNDS = { width: 620, height: 760 };
const MOBILE_CONTENT_BOUNDS = { width: MOBILE_BOUNDS.width + 140, height: MOBILE_BOUNDS.height + 140 };

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
  // The camera's world-space TARGET moving right shifts the (fixed-
  // position) cards LEFT on screen — panX = containerWidth/2 -
  // target.x*zoom, so a bigger target.x makes panX more negative, which
  // is what pushes every card's screen position left. Per feedback that
  // the mobile view still read as biased right, offsetting the target
  // past the cluster's own true center (rather than picking a whole new
  // center by hand again) directly nudges the visible content leftward.
  const initialCenter = isMobile
    ? { x: MOBILE_BOUNDS.center.x + 110, y: MOBILE_BOUNDS.center.y }
    : { x: 1560, y: 990 };

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

  const card = (id: string) => {
    // `height` in Layout is only there for computeBounds() above — not a
    // real CanvasCard prop (its height is intrinsic to its content) — so
    // it's stripped out here rather than spread onto the component.
    const { height: _height, ...position } = layout[id];
    return {
      id,
      ...position,
      pinned: Object.prototype.hasOwnProperty.call(pinned, id),
      pinHue: pinned[id],
      onUnpin: unpin,
      worldWidth: WORLD_WIDTH,
      worldHeight: WORLD_HEIGHT,
    };
  };

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
      <CanvasCard key={cardKey("sticky-1")} {...card("sticky-1")} zIndex={5}>
        <StickyNote id="sticky-1" seed="#B8631F" index="01" title="Things I'm Into" text="Designing things people enjoy using, making nice websites, games, good food, and making things fun." />
      </CanvasCard>

      <CanvasCard key={cardKey("widget-todo")} {...card("widget-todo")} zIndex={4}>
        <TodoWidgetCard id="widget-todo" seed="#1F7A52" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-screen1")} {...card("photo-screen1")} zIndex={3}>
        <PhotoNote id="photo-screen1" src="/playground-image-1.jpg" alt="Waffle and iced drinks at a cafe" title="waffle o'clock" subtitle="i was kidding, lunch is still my biggest worry" aspectRatio="2765/3686" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-tech1")} {...card("photo-tech1")} zIndex={4}>
        <PhotoNote id="photo-tech1" src="/playground-image-2.jpg" alt="Snow-capped Himalayan mountain range" title="advantage of living here" subtitle="one of the prettiest views I get to call nearby" aspectRatio="3226/2419" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-tech2")} {...card("photo-tech2")} zIndex={5}>
        <PhotoNote id="photo-tech2" src="/playground-image-3.jpg" alt="Selfie with a friend" title="my favourite hooman" subtitle="she makes everything better 🥰" aspectRatio="5875/4406" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-event1")} {...card("photo-event1")} zIndex={4}>
        <PhotoNote id="photo-event1" src="/playground-image-4.jpg" alt="Graduation day, cap and gown" title="2022 made it!!" subtitle="somehow they let me graduate" aspectRatio="2722/3629" />
      </CanvasCard>

      <CanvasCard key={cardKey("photo-kitchen1")} {...card("photo-kitchen1")} zIndex={5}>
        <PhotoNote id="photo-kitchen1" src="/playground-image-5.jpg" alt="Childhood photo on a bicycle" title="before all this" subtitle="when what's in lunch was my biggest worry" aspectRatio="1675/2277" />
      </CanvasCard>

      <CanvasCard key={cardKey("widget-calendar")} {...card("widget-calendar")} zIndex={3}>
        <CalendarCard id="widget-calendar" />
      </CanvasCard>

      <CanvasCard key={cardKey("sticky-2")} {...card("sticky-2")} zIndex={4}>
        <StickyNote id="sticky-2" seed="#2A5FA5" index="02" title="A Bad Habit" text="I'll sketch something on paper, then immediately start redoing it before I've even finished the sketch." />
      </CanvasCard>

      <CanvasCard key={cardKey("sticky-3")} {...card("sticky-3")} zIndex={5}>
        <StickyNote id="sticky-3" seed="#75308B" index="03" title="Ask Me About" text="the tiny dinosaur I hid somewhere on this website." />
      </CanvasCard>
    </InfiniteCanvas>
  );
}
