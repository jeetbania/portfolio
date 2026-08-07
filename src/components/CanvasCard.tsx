"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCanvasZoom } from "./InfiniteCanvas";
import { Pin } from "./Pin";

/**
 * A card living inside an <InfiniteCanvas>. Two very different modes:
 *
 * - Unpinned (default): draggable. Position eases toward wherever you
 *   dragged it (not an instant snap), the card tilts as you drag it
 *   sideways, and on release it springs back to its resting angle while
 *   coasting a little further on its last velocity (inertia). Runs off
 *   refs + one rAF loop, the same imperative pattern as imageAnchor.tsx —
 *   a card can move on every animation frame while dragged; routing that
 *   through React state would mean a full re-render per frame for
 *   something purely visual. Drag deltas are divided by the canvas's
 *   current zoom (see useCanvasZoom) so a card always tracks the cursor
 *   1:1 on screen regardless of zoom level.
 *
 * - Pinned (a <Pin> was dropped on it, see PinTray.tsx): position locks
 *   at rest — no more drag physics — and a small pushpin renders stuck
 *   into its top edge. Still reacts to the mouse though, just
 *   differently: a "stretch toward the cursor" 3D tilt on hover, like a
 *   photo pinned to a corkboard nudging as you brush past it, so a
 *   pinned card doesn't go completely inert. `data-card-id` is what
 *   PinTray's drop-target hit-testing (`elementFromPoint`) looks for.
 */

const LERP_POS = 0.22;
const LERP_ROT = 0.16;
const LERP_SCALE = 0.22;
const MAX_TILT = 14; // deg either side of resting rotation while dragging
const TILT_GAIN = 0.28; // how eagerly tilt accumulates per px of horizontal drag
const INERTIA_DAMPING = 0.9;
const INERTIA_STOP = 0.04;
const DRAG_SCALE = 1.045;
const HOVER_TILT_MAX = 10; // deg, the pinned-card "stretch toward cursor" effect

export function CanvasCard({
  id,
  x,
  y,
  rotate = 0,
  width,
  worldWidth,
  worldHeight,
  zIndex = 1,
  pinned = false,
  pinHue,
  onUnpin,
  children,
  style,
}: {
  id: string;
  x: number;
  y: number;
  rotate?: number;
  width: number;
  worldWidth: number;
  worldHeight: number;
  zIndex?: number;
  pinned?: boolean;
  pinHue?: number;
  /** Called when the hammer button (shown on hover while pinned) is clicked. */
  onUnpin?: (id: string) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const zoomRef = useCanvasZoom();
  const stateRef = useRef({
    x, y, tx: x, ty: y,
    rot: rotate, trot: rotate,
    scale: 1, tscale: 1,
    dragging: false,
    vx: 0, vy: 0,
    lastClientX: 0, lastClientY: 0,
  });

  const apply = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    const s = stateRef.current;
    el.style.left = `${s.x}px`;
    el.style.top = `${s.y}px`;
    el.style.transform = `rotate(${s.rot}deg) scale(${s.scale})`;
  }, []);

  // Deliberately empty deps — mount once, run forever (until unmount).
  // worldWidth/worldHeight/width/pinned were in this array before, which
  // seems harmless (none of them are expected to change for a given card
  // instance) but wasn't: a card whose children re-render often enough
  // (TodoWidgetCard's own task/input state, for instance) could tear this
  // effect down and rebuild it faster than a single animation frame,
  // repeatedly canceling the rAF handle before it ever got to fire —
  // `apply()` never runs, so the card LOOKS undraggable even though
  // onPointerMove is correctly updating its target position underneath.
  // A pinned card doesn't need this loop at all (position is locked), but
  // pinned/unpinned are two entirely different `return` branches below —
  // switching between them already remounts this effect via the normal
  // unmount/mount cycle, it doesn't need to be a dependency here too.
  useEffect(() => {
    if (pinned) return; // locked in place — no physics loop needed at all
    let raf = 0;
    const loop = () => {
      const s = stateRef.current;
      if (!s.dragging && (Math.abs(s.vx) > INERTIA_STOP || Math.abs(s.vy) > INERTIA_STOP)) {
        s.tx += s.vx;
        s.ty += s.vy;
        s.vx *= INERTIA_DAMPING;
        s.vy *= INERTIA_DAMPING;
        if (Math.abs(s.vx) < INERTIA_STOP) s.vx = 0;
        if (Math.abs(s.vy) < INERTIA_STOP) s.vy = 0;
        const maxX = Math.max(0, worldWidth - width);
        const maxY = Math.max(0, worldHeight - (elRef.current?.offsetHeight ?? 0));
        s.tx = clampNum(s.tx, 0, maxX);
        s.ty = clampNum(s.ty, 0, maxY);
      }
      s.x += (s.tx - s.x) * LERP_POS;
      s.y += (s.ty - s.y) * LERP_POS;
      s.rot += (s.trot - s.rot) * LERP_ROT;
      s.scale += (s.tscale - s.scale) * LERP_SCALE;
      apply();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    // Critical: stops this from also starting a canvas pan underneath.
    e.stopPropagation();
    if (pinned) return;
    const el = elRef.current;
    if (!el) return;
    const s = stateRef.current;
    s.dragging = true;
    s.vx = 0;
    s.vy = 0;
    s.lastClientX = e.clientX;
    s.lastClientY = e.clientY;
    s.tscale = DRAG_SCALE;
    el.setPointerCapture(e.pointerId);
    el.classList.add("canvas-card-dragging");
    el.style.zIndex = "50"; // float above every other card while held
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pinned) return;
    const s = stateRef.current;
    if (!s.dragging) return;
    const zoom = zoomRef.current || 1;
    const dx = (e.clientX - s.lastClientX) / zoom;
    const dy = (e.clientY - s.lastClientY) / zoom;
    s.lastClientX = e.clientX;
    s.lastClientY = e.clientY;

    const maxX = Math.max(0, worldWidth - width);
    const maxY = Math.max(0, worldHeight - (elRef.current?.offsetHeight ?? 0));
    s.tx = clampNum(s.tx + dx, 0, maxX);
    s.ty = clampNum(s.ty + dy, 0, maxY);

    s.vx = dx * 0.6;
    s.vy = dy * 0.6;

    // Tilt accumulates toward the drag direction (not snapped to it) —
    // clamped to the resting angle +/- MAX_TILT, eased in by the rAF loop
    // above (LERP_ROT) rather than applied instantly, so it reads as a
    // "lean into the drag" rather than a jitter.
    s.trot = clampNum(s.trot + dx * TILT_GAIN, rotate - MAX_TILT, rotate + MAX_TILT);
  };

  const endDrag = () => {
    if (pinned) return;
    const s = stateRef.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.trot = rotate;
    s.tscale = 1;
    const el = elRef.current;
    el?.classList.remove("canvas-card-dragging");
    if (el) el.style.zIndex = String(zIndex);
  };

  /* Pinned-only: a "stretch toward cursor" hover tilt (3D perspective
     rotate, not a position drag) — CSS-transitioned rather than run
     through the rAF loop above, since it's a lighter, different-feeling
     interaction (hover, not drag) and doesn't need the drag physics'
     inertia/lerp machinery. */
  const onPinnedHover = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotate(${rotate}deg) perspective(700px) rotateX(${(-py * HOVER_TILT_MAX).toFixed(2)}deg) rotateY(${(px * HOVER_TILT_MAX).toFixed(2)}deg) scale(1.035)`;
  };
  const onPinnedLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `rotate(${rotate}deg)`;
  };

  if (pinned) {
    return (
      <div
        ref={elRef}
        data-card-id={id}
        className="canvas-card canvas-card-pinned"
        onPointerDown={onPointerDown}
        onPointerMove={onPinnedHover}
        onPointerLeave={onPinnedLeave}
        onDragStart={e => e.preventDefault()}
        style={{
          position: "absolute",
          width,
          left: x,
          top: y,
          transform: `rotate(${rotate}deg)`,
          transition: "transform 260ms cubic-bezier(0.22,1,0.36,1)",
          transformStyle: "preserve-3d",
          zIndex,
          ...style,
        }}
      >
        <div className="canvas-card-pin">
          <Pin hueRotate={pinHue ?? 0} />
        </div>
        {onUnpin && (
          <button
            type="button"
            className="card-unpin-hammer"
            aria-label="Remove pin"
            title="Remove pin"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onUnpin(id)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3.6" y="6.6" width="11.4" height="5.4" rx="2.1" transform="rotate(-45 9.3 9.3)" fill="currentColor" />
              <path d="M13.2 13.2 20 20" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {children}
      </div>
    );
  }

  return (
    <div
      ref={elRef}
      data-card-id={id}
      className="canvas-card"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDragStart={e => e.preventDefault()} // kills the native "ghost image" drag, which fights our own pointer-based drag
      style={{
        position: "absolute",
        width,
        left: x,
        top: y,
        transform: `rotate(${rotate}deg)`,
        zIndex,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function clampNum(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
