"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCanvasZoom } from "./InfiniteCanvas";

/**
 * A draggable card living inside an <InfiniteCanvas>. The physics here
 * are a from-scratch reimplementation of what made an earlier portfolio's
 * "about" board fun to touch: position eases toward wherever you dragged
 * it (not an instant snap), the card tilts as you drag it sideways (not a
 * fixed rotation), and on release it springs back to its resting angle
 * while coasting a little further on its last velocity (inertia) instead
 * of stopping dead. All of it runs off refs + one rAF loop per card, the
 * same imperative pattern as imageAnchor.tsx — a card can move on every
 * animation frame while dragged; routing that through React state would
 * mean a full re-render per frame for something purely visual.
 *
 * Drag deltas are divided by the canvas's current zoom (see
 * useCanvasZoom) so a card always tracks the cursor 1:1 on screen
 * regardless of how zoomed in/out the canvas is — without that, dragging
 * at 2x zoom would fling the card twice as far as your hand actually moved.
 */

const LERP_POS = 0.22;
const LERP_ROT = 0.16;
const LERP_SCALE = 0.22;
const MAX_TILT = 14; // deg either side of resting rotation while dragging
const TILT_GAIN = 0.28; // how eagerly tilt accumulates per px of horizontal drag
const INERTIA_DAMPING = 0.9;
const INERTIA_STOP = 0.04;
const DRAG_SCALE = 1.045;

export function CanvasCard({
  x,
  y,
  rotate = 0,
  width,
  worldWidth,
  worldHeight,
  zIndex = 1,
  children,
  style,
}: {
  x: number;
  y: number;
  rotate?: number;
  width: number;
  worldWidth: number;
  worldHeight: number;
  zIndex?: number;
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

  useEffect(() => {
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
  }, [apply, worldWidth, worldHeight, width]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Critical: stops this from also starting a canvas pan underneath.
    e.stopPropagation();
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
    const s = stateRef.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.trot = rotate;
    s.tscale = 1;
    const el = elRef.current;
    el?.classList.remove("canvas-card-dragging");
    if (el) el.style.zIndex = String(zIndex);
  };

  return (
    <div
      ref={elRef}
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
