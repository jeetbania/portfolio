"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * A Figma/Miro-style pannable, zoomable canvas — built after studying two
 * references (a Framer "about" page with a draggable board of sticky notes
 * + captioned photos, and an earlier portfolio's drag-with-tilt physics on
 * individual cards) but going a step further than either: those were a
 * fixed-size scrollable board, not a true infinite canvas with independent
 * pan AND zoom. Interaction model matches design tools, since that's the
 * most legible convention for "drag the background to move, scroll to
 * zoom" that most visitors will already have muscle memory for:
 *  - Drag empty canvas → pan.
 *  - Plain wheel / two-finger trackpad scroll → pan.
 *  - Ctrl/Cmd + wheel (trackpad pinch reports as this) → zoom to cursor.
 *  - Two-finger touch pinch → zoom to the pinch midpoint (+ follows it).
 *  - +/− /reset buttons → same zoom-to-center math, no pointer needed.
 *
 * Pan/zoom state lives in refs, not React state, and is applied by
 * mutating the world div's transform directly — the same imperative,
 * no-re-render-per-frame pattern already used for drag/zoom elsewhere in
 * this codebase (see imageAnchor.tsx's AnchoredImage). A pointer can move
 * dozens of times a second; routing that through setState would mean a
 * full React re-render per event for zero visual benefit.
 *
 * Current zoom is exposed to descendant `CanvasCard`s via a plain ref in
 * context (not a value in context) — cards need to divide drag deltas by
 * the live zoom level so 1px of mouse movement always feels like 1px of
 * on-screen movement regardless of how zoomed in/out the canvas is, but
 * they read it imperatively inside their own pointermove handlers, never
 * at render time, so putting it in a ref (instead of state) avoids
 * re-rendering every card on every zoom tick too.
 */

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_WHEEL_SENSITIVITY = 0.0016;
const ZOOM_BUTTON_STEP = 1.25;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const ZoomContext = createContext<React.MutableRefObject<number> | null>(null);

/** Falls back to a static ref of 1 so a CanvasCard never throws if it's
 * ever rendered outside an InfiniteCanvas — same no-throw-fallback
 * pattern as useAnchorContext/useContentEditorContext. */
export function useCanvasZoom(): React.MutableRefObject<number> {
  const ctx = useContext(ZoomContext);
  const fallback = useRef(1);
  return ctx ?? fallback;
}

export function InfiniteCanvas({
  worldWidth,
  worldHeight,
  initialCenter,
  height = "min(76vh, 720px)",
  backgroundColor,
  overlay,
  children,
}: {
  worldWidth: number;
  worldHeight: number;
  /** World-space point centered in the viewport on first load / reset. Defaults to the world's center. */
  initialCenter?: { x: number; y: number };
  height?: string;
  /** Overrides the canvas's own backdrop color (default var(--col-bg)) —
   * e.g. BackgroundPicker.tsx letting a visitor pick a pastel tint. Set
   * on the container itself, not just the world, so it still covers the
   * whole viewport once panned past the world's own bounds. */
  backgroundColor?: string;
  /** UI chrome that sits ON TOP of the canvas but OUTSIDE the pannable/
   * zoomable world — e.g. PinTray. Anything passed as `children` instead
   * pans and zooms with the world; anything passed here stays fixed to
   * the container's own corner, same as the built-in hint chip/zoom
   * controls below. */
  overlay?: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const zoomRef = useCanvasZoomOwnRef();
  const panRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; midX: number; midY: number } | null>(null);
  const [hintVisible, setHintVisible] = useState(true);

  const center = initialCenter ?? { x: worldWidth / 2, y: worldHeight / 2 };

  const applyTransform = useCallback(() => {
    const w = worldRef.current;
    if (!w) return;
    w.style.transform = `translate(${panRef.current.x}px, ${panRef.current.y}px) scale(${zoomRef.current})`;
  }, [zoomRef]);

  /* Generous overscroll margin (40% of the viewport on each side) so
     panning to the world's edge still leaves it feeling expansive rather
     than hitting a hard wall — "almost infinite," not literally boundless,
     since an actually-unbounded world would mean cards can get lost with
     no way back short of the reset button. */
  const clampPan = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scaledW = worldWidth * zoomRef.current;
    const scaledH = worldHeight * zoomRef.current;
    const marginX = rect.width * 0.4;
    const marginY = rect.height * 0.4;
    const minX = Math.min(rect.width - scaledW - marginX, marginX);
    const maxX = marginX;
    const minY = Math.min(rect.height - scaledH - marginY, marginY);
    const maxY = marginY;
    panRef.current.x = clamp(panRef.current.x, minX, maxX);
    panRef.current.y = clamp(panRef.current.y, minY, maxY);
  }, [worldWidth, worldHeight, zoomRef]);

  const dismissHint = useCallback(() => {
    setHintVisible(v => (v ? false : v));
  }, []);

  const centerOn = useCallback((point: { x: number; y: number }, zoom: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomRef.current = zoom;
    panRef.current = {
      x: rect.width / 2 - point.x * zoom,
      y: rect.height / 2 - point.y * zoom,
    };
    clampPan();
    applyTransform();
  }, [clampPan, applyTransform, zoomRef]);

  useEffect(() => {
    centerOn(center, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zoomBy = useCallback((factor: number, cx?: number, cy?: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = cx ?? rect.width / 2;
    const py = cy ?? rect.height / 2;
    const worldX = (px - panRef.current.x) / zoomRef.current;
    const worldY = (py - panRef.current.y) / zoomRef.current;
    zoomRef.current = clamp(zoomRef.current * factor, ZOOM_MIN, ZOOM_MAX);
    panRef.current.x = px - worldX * zoomRef.current;
    panRef.current.y = py - worldY * zoomRef.current;
    clampPan();
    applyTransform();
  }, [clampPan, applyTransform, zoomRef]);

  /* Native (non-React) wheel listener, added with {passive:false} —
     React marks its synthetic onWheel as passive at the root listener in
     modern versions, which silently no-ops preventDefault() and leaves
     the page scrolling underneath the canvas instead of panning it. */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      dismissHint();
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        const factor = 1 - e.deltaY * ZOOM_WHEEL_SENSITIVITY;
        zoomBy(factor, e.clientX - rect.left, e.clientY - rect.top);
      } else {
        panRef.current.x -= e.deltaX;
        panRef.current.y -= e.deltaY;
        clampPan();
        applyTransform();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomBy, clampPan, applyTransform, dismissHint]);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 1) {
      draggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY, panX: panRef.current.x, panY: panRef.current.y };
      containerRef.current?.setPointerCapture(e.pointerId);
      containerRef.current?.classList.add("panning");
    } else if (pointersRef.current.size === 2) {
      draggingRef.current = false;
      const pts = [...pointersRef.current.values()];
      pinchRef.current = {
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        midX: (pts[0].x + pts[1].x) / 2,
        midY: (pts[0].y + pts[1].y) / 2,
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const rect = containerRef.current!.getBoundingClientRect();
      zoomBy(dist / pinchRef.current.dist, midX - rect.left, midY - rect.top);
      panRef.current.x += midX - pinchRef.current.midX;
      panRef.current.y += midY - pinchRef.current.midY;
      clampPan();
      applyTransform();
      pinchRef.current = { dist, midX, midY };
      return;
    }

    if (!draggingRef.current) return;
    panRef.current.x = dragStartRef.current.panX + (e.clientX - dragStartRef.current.x);
    panRef.current.y = dragStartRef.current.panY + (e.clientY - dragStartRef.current.y);
    clampPan();
    applyTransform();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) {
      draggingRef.current = false;
      containerRef.current?.classList.remove("panning");
    }
  };

  return (
    <ZoomContext.Provider value={zoomRef}>
      <div
        ref={containerRef}
        className="infinite-canvas"
        style={{
          position: "relative", overflow: "hidden", height,
          ...(backgroundColor ? { background: backgroundColor, transition: "background 320ms var(--ease-out)" } : {}),
        }}
        onPointerDown={handlePointerDown}
        onPointerDownCapture={dismissHint}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={worldRef}
          className="canvas-world"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: worldWidth,
            height: worldHeight,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>

        <div
          aria-hidden="true"
          className="canvas-hint"
          style={{ opacity: hintVisible ? 1 : 0 }}
        >
          <span>↕ Drag to pan</span>
          <span className="canvas-hint-dot" />
          <span>⌘/Ctrl + scroll to zoom</span>
        </div>

        {/* onPointerDown stopPropagation on every button here — same fix
            as PinTray's: this panel lives inside the pan-handling
            container, so without it a drag that starts on a button (not
            just a click) would also pan the canvas underneath. Plain
            clicks masked this before since a stationary pointerdown/up
            with no movement never visibly pans anything. */}
        <div className="canvas-controls">
          <button type="button" aria-label="Zoom in" onPointerDown={e => e.stopPropagation()} onClick={() => zoomBy(ZOOM_BUTTON_STEP)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1.5V12.5M1.5 7H12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" aria-label="Zoom out" onPointerDown={e => e.stopPropagation()} onClick={() => zoomBy(1 / ZOOM_BUTTON_STEP)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1.5 7H12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" aria-label="Reset view" onPointerDown={e => e.stopPropagation()} onClick={() => centerOn(center, 1)}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1M13.5 1.5V4.6H10.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {overlay}
      </div>
    </ZoomContext.Provider>
  );
}

/* Small helper so InfiniteCanvas's own zoomRef and the context it hands
   descendants are guaranteed to be the exact same ref object. */
function useCanvasZoomOwnRef() {
  return useRef(1);
}
