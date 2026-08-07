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
const INITIAL_CENTER = { x: 1400, y: 860 };

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
      {/* Decorative, non-draggable "stickers" scattered between the card
          clusters below — pure flavor (no state, no CanvasCard wrapper),
          same spirit as the washi tape / doodles in a real corkboard
          reference, filling the gaps between cards instead of leaving
          them bare. */}
      <BoardSticker x={1195} y={640} rotate={-14} color="#B8631F" shape="star" />
      <BoardSticker x={1460} y={905} rotate={10} color="#2A5FA5" shape="squiggle" />
      <BoardSticker x={1210} y={1215} rotate={18} color="#75308B" shape="plus" />

      {/* Card layout — a tight, overlapping three-column cluster (a real
          pin board's stack of notes/photos), not a ring of cards spaced
          evenly around empty middle space like the earlier drafts. Each
          column has its own light x-jitter per row so edges interlock
          instead of lining up in a rigid grid. */}

      {/* ── Column A ── */}
      <CanvasCard {...card("sticky-1")} x={1000} y={520} rotate={-5} width={210} zIndex={5}>
        <StickyNote seed="#B8631F" index="01" title="On design" text="Good design disappears. Bad design apologizes." />
      </CanvasCard>

      <CanvasCard {...card("widget-todo")} x={1035} y={800} rotate={-3} width={220} zIndex={6}>
        <TodoWidgetCard seed="#1F7A52" />
      </CanvasCard>

      <CanvasCard {...card("photo-screen1")} x={980} y={1085} rotate={-6} width={190} zIndex={4}>
        <PhotoNote src="/screen-1.jpg" alt="Analytics dashboard on screen" title="The Numbers" subtitle="made fun, mostly" />
      </CanvasCard>

      {/* ── Column B ── */}
      <CanvasCard {...card("photo-tech1")} x={1290} y={480} rotate={-6} width={210} zIndex={4}>
        <PhotoNote src="/tech-1.jpg" alt="Circuit board close-up" title="The Build" subtitle="where it happens" />
      </CanvasCard>

      <CanvasCard {...card("photo-tech2")} x={1330} y={765} rotate={5} width={220} zIndex={6}>
        <PhotoNote src="/tech-2.jpg" alt="Team collaborating around a table" title="The Huddle" subtitle="best ideas, argued over" />
      </CanvasCard>

      <CanvasCard {...card("sticky-3")} x={1270} y={1045} rotate={-3} width={200} zIndex={5}>
        <StickyNote seed="#75308B" index="03" title="Fun fact" text="Ask me about the dino in the footer. I'm weirdly proud of it." />
      </CanvasCard>

      {/* ── Column C ── */}
      <CanvasCard {...card("photo-event1")} x={1580} y={465} rotate={5} width={200} zIndex={4}>
        <PhotoNote src="/event-1.jpg" alt="Live event crowd" title="The Crowd" subtitle="conferences, occasionally" />
      </CanvasCard>

      <CanvasCard {...card("photo-kitchen1")} x={1620} y={745} rotate={-4} width={210} zIndex={6}>
        <PhotoNote src="/kitchen-1.jpg" alt="Participants cooking together" title="The Table" subtitle="community > competition" />
      </CanvasCard>

      <CanvasCard {...card("sticky-2")} x={1555} y={1005} rotate={3} width={210} zIndex={5}>
        <StickyNote seed="#2A5FA5" index="02" title="Old habits" text="Still sketch everything on paper before Figma touches it." />
      </CanvasCard>

      <CanvasCard {...card("widget-calendar")} x={1600} y={1275} rotate={2} width={210} zIndex={4}>
        <CalendarCard />
      </CanvasCard>
    </InfiniteCanvas>
  );
}

/* Tiny inline "sticker" shapes — plain SVG, no interactivity, always
   themed via a fixed seed color (like the folder/fan cards elsewhere,
   these are decoration, not chrome, so they don't flip with the theme). */
function BoardSticker({
  x, y, rotate, color, shape,
}: { x: number; y: number; rotate: number; color: string; shape: "star" | "squiggle" | "plus" }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", left: x, top: y,
        transform: `rotate(${rotate}deg)`,
        opacity: 0.5, pointerEvents: "none", zIndex: 1,
      }}
    >
      {shape === "star" && (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M13 1l2.8 8.1L24 12l-8.2 2.9L13 23l-2.8-8.1L2 12l8.2-2.9L13 1Z" fill={color} />
        </svg>
      )}
      {shape === "squiggle" && (
        <svg width="40" height="18" viewBox="0 0 40 18" fill="none">
          <path d="M2 14C7 4 11 4 16 10S25 16 30 8 36 3 38 5" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {shape === "plus" && (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2V20M2 11H20" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
