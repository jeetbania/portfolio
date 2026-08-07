"use client";

import { useRef, useState } from "react";
import { Pin } from "./Pin";

/**
 * A small dispenser of pins, sitting outside the canvas (so grabbing one
 * never fights the canvas's own pan/drag handling — this never touches
 * `.infinite-canvas`'s DOM tree at all). Drag one onto any card and it
 * locks in place there via `data-card-id` hit-testing at drop time
 * (`document.elementFromPoint`, not canvas coordinates — simplest thing
 * that works since this only cares about screen position, not world
 * position).
 *
 * The dragged pin itself is a "ghost" — a fixed-position element that
 * tracks the pointer imperatively (direct style mutation, not React
 * state) for the same reason every other drag in this feature does that:
 * a pointer can move dozens of times a second. Only *which* pin is being
 * dragged (its hue-rotate, for what to render in the ghost — see
 * Pin.tsx) is React state, since that only changes twice per drag —
 * start and end.
 */
export function PinTray({
  hues,
  onDropOnCard,
}: {
  hues: number[];
  onDropOnCard: (cardId: string, hueRotate: number) => void;
}) {
  const ghostRef = useRef<HTMLDivElement>(null);
  const [draggingHue, setDraggingHue] = useState<number | null>(null);
  // A ref, not state — this only exists for imperative classList cleanup
  // (which element currently has the "you're about to drop here"
  // highlight), never read during render, so it doesn't need to trigger
  // one. Tracking it as state instead was the original bug here: onUp
  // closed over whatever value existed when the drag STARTED (always
  // null), not whatever onMove had most recently set — so cleanup could
  // silently target the wrong element (or none) and leave a stray
  // highlight class stuck on a card forever.
  const hoveredCardRef = useRef<HTMLElement | null>(null);

  const startDrag = (hueRotate: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    // The tray is rendered inside InfiniteCanvas's own pointerdown-driven
    // pan container (via the `overlay` prop) — without this, grabbing a
    // pin also started a canvas pan underneath it, same class of bug
    // CanvasCard's own stopPropagation guards against.
    e.stopPropagation();
    setDraggingHue(hueRotate);
    positionGhost(e.clientX, e.clientY);

    const onMove = (ev: PointerEvent) => {
      positionGhost(ev.clientX, ev.clientY);
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const cardEl = el?.closest<HTMLElement>("[data-card-id]") ?? null;
      if (hoveredCardRef.current === cardEl) return;
      hoveredCardRef.current?.classList.remove("canvas-card-pin-target");
      cardEl?.classList.add("canvas-card-pin-target");
      hoveredCardRef.current = cardEl;
    };

    // Shared cleanup for both a real drop (onUp) and an aborted one
    // (onCancel) — tears down the listeners and the ghost regardless of
    // how the gesture ended, so nothing can outlive it.
    const cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      // Belt-and-suspenders: clear the highlight from EVERY card, not
      // just the one we think is hovered — guarantees no stray class
      // survives the drag regardless of how it got there.
      document.querySelectorAll(".canvas-card-pin-target").forEach(el => el.classList.remove("canvas-card-pin-target"));
      hoveredCardRef.current = null;
      setDraggingHue(null);
    };

    const onUp = (ev: PointerEvent) => {
      cleanup();
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const cardEl = el?.closest<HTMLElement>("[data-card-id]");
      if (cardEl?.dataset.cardId) onDropOnCard(cardEl.dataset.cardId, hueRotate);
    };

    // Was the actual bug behind the leftover "pin stuck in a corner of
    // the page" glitch: the browser/OS can cancel a pointer sequence
    // mid-drag without ever firing pointerup — a real, common mobile
    // Safari quirk, and especially likely here since the tray sits right
    // at the screen's top-left corner, exactly where an edge-swipe
    // gesture gets recognized. Without a pointercancel listener, cleanup
    // never ran: the ghost (position: fixed) stayed mounted forever at
    // wherever it last was, visible as a stray clipped pin outside the
    // canvas regardless of scrolling or panning afterward.
    const onCancel = () => cleanup();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
  };

  function positionGhost(x: number, y: number) {
    const el = ghostRef.current;
    if (!el) return;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }

  return (
    <>
      <div className="pin-tray">
        <div className="pin-tray-pins">
          {hues.map(hueRotate => (
            <div
              key={hueRotate}
              onPointerDown={startDrag(hueRotate)}
              className="pin-tray-pin"
              role="button"
              aria-label="Drag to pin a card in place"
            >
              <Pin hueRotate={hueRotate} />
            </div>
          ))}
        </div>
      </div>

      {draggingHue !== null && (
        <div ref={ghostRef} className="pin-ghost">
          <Pin hueRotate={draggingHue} size={36} />
        </div>
      )}
    </>
  );
}
