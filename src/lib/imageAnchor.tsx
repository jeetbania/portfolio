"use client";

import Image from "next/image";
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";

/**
 * Dev-only "image anchor" tool — the DialKit-style live-tuning workflow
 * used for the Image Card sliders, but for something DialKit has no control
 * type for: picking a focal point ON an image by clicking/dragging directly
 * on it, instead of eyeballing abstract x/y sliders. Checked DialKit's
 * control types first (slider/toggle/color/text/select/spring/action/
 * folder — no 2D point picker) before building this from scratch.
 *
 * Same shape as the Image Card dial: live-edit in the browser, values
 * persist to localStorage per case study (`case-study-anchors:{slug}`) so
 * they survive reloads, then once you land on values you like, copy them
 * out (the floating panel's "Copy JSON" button) and hand them to me to bake
 * into caseStudies.ts/projects.ts as each image's `focalPoint`. The toggle
 * button/panel only ever renders in development — `AnchorToggle` bails out
 * in `NODE_ENV === "production"` the same way `<DialRoot />` hides itself,
 * and since `anchorModeOn` starts `false` every mount and is never
 * persisted, a real visitor has no way to reach edit mode even if this
 * code ships. `<AnchoredImage>` is what everything renders through —
 * always applies whatever focal point is active (persisted override, else
 * the code-baked default, else dead center), so the same component works
 * identically whether anchor mode is on or off.
 */

/**
 * `zoom` is optional and defaults to 1 (today's plain object-position pan,
 * no extra crop) — existing persisted/baked anchors with no `zoom` field
 * keep working unchanged. Added after a real case: a shallow-depth-of-field
 * photo can have its sharp subject in one corner and soft background
 * bokeh everywhere else — panning alone can only choose WHICH part shows,
 * it can't crop tighter to exclude the soft parts around it. Zoom does.
 */
export type FocalPoint = { x: number; y: number; zoom?: number };

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
// Tuned so one mouse-wheel notch (~deltaY 100) reads as roughly a 0.2x
// step, and trackpad pinch (many small deltaY events) feels proportionally
// smooth rather than jumpy.
const ZOOM_WHEEL_SENSITIVITY = 0.002;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function focalPointToCss(fp?: FocalPoint): string {
  if (!fp) return "50% 50%";
  return `${Math.round(clamp(fp.x, 0, 100))}% ${Math.round(clamp(fp.y, 0, 100))}%`;
}

type AnchorMap = Record<string, FocalPoint>;

type AnchorContextValue = {
  anchors: AnchorMap;
  anchorModeOn: boolean;
  setAnchorModeOn: (on: boolean) => void;
  setAnchor: (src: string, fp: FocalPoint) => void;
  resetAll: () => void;
};

const AnchorContext = createContext<AnchorContextValue | null>(null);

function storageKey(slug: string) {
  return `case-study-anchors:${slug}`;
}

/** Wrap a whole case-study page (or any page) in this once — every
 * `<AnchoredImage>` inside reconnects to the same shared state via context. */
export function AnchorProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const [anchors, setAnchors] = useState<AnchorMap>({});
  const [anchorModeOn, setAnchorModeOn] = useState(false);
  const loadedRef = useRef(false);

  // Load persisted overrides once per slug, client-side only — avoids an
  // SSR/hydration mismatch (localStorage doesn't exist on the server).
  useEffect(() => {
    loadedRef.current = false;
    try {
      const raw = localStorage.getItem(storageKey(slug));
      setAnchors(raw ? JSON.parse(raw) : {});
    } catch {
      setAnchors({});
    }
    loadedRef.current = true;
  }, [slug]);

  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      localStorage.setItem(storageKey(slug), JSON.stringify(anchors));
    } catch {
      // localStorage unavailable (private mode, quota) — live editing still
      // works for this session, it just won't survive a reload.
    }
  }, [anchors, slug]);

  const setAnchor = useCallback((src: string, fp: FocalPoint) => {
    setAnchors(prev => ({ ...prev, [src]: fp }));
  }, []);

  const resetAll = useCallback(() => setAnchors({}), []);

  const value = useMemo<AnchorContextValue>(() => ({
    anchors, anchorModeOn, setAnchorModeOn, setAnchor, resetAll,
  }), [anchors, anchorModeOn, setAnchor, resetAll]);

  return <AnchorContext.Provider value={value}>{children}</AnchorContext.Provider>;
}

const EMPTY_ANCHORS: AnchorMap = {};
function noop() {}

/** No-provider fallback so `<AnchoredImage>` also works standalone (e.g.
 * CaseStudyContent rendered from the blog post page, which reuses its
 * blocks/images but doesn't wrap them in `<AnchorProvider>`) — falls back
 * to each image's baked-in `defaultFocalPoint`/center, with editing
 * inertly disabled rather than throwing. Only pages that mount an
 * `<AnchorProvider>` (currently just case studies, via CaseStudyShell.tsx)
 * get live anchor editing. */
const FALLBACK_ANCHOR_CONTEXT: AnchorContextValue = {
  anchors: EMPTY_ANCHORS,
  anchorModeOn: false,
  setAnchorModeOn: noop,
  setAnchor: noop,
  resetAll: noop,
};

function useAnchorContext(): AnchorContextValue {
  return useContext(AnchorContext) ?? FALLBACK_ANCHOR_CONTEXT;
}

/**
 * Drop-in replacement for `<Image fill className="object-cover" />` inside
 * a `position: relative` box (PlaceholderCard). Always applies the active
 * focal point (persisted edit > `defaultFocalPoint` from the data file >
 * center) via `object-position`. When anchor mode is on, also renders a
 * click/drag catcher + crosshair on top — invisible and inert otherwise.
 */
export function AnchoredImage({
  src, alt, sizes, priority, defaultFocalPoint, className = "object-cover",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  defaultFocalPoint?: FocalPoint;
  className?: string;
}) {
  const { anchors, anchorModeOn, setAnchor } = useAnchorContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const current = anchors[src] ?? defaultFocalPoint ?? { x: 50, y: 50 };
  const zoom = current.zoom ?? 1;

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setAnchor(src, {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 0, 100),
      zoom: current.zoom,
    });
  }, [src, setAnchor, current.zoom]);

  const setZoom = useCallback((nextZoom: number) => {
    setAnchor(src, { x: current.x, y: current.y, zoom: clamp(nextZoom, ZOOM_MIN, ZOOM_MAX) });
  }, [src, setAnchor, current.x, current.y]);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      onPointerDown={anchorModeOn ? (e) => {
        e.preventDefault();
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromPointer(e.clientX, e.clientY);
      } : undefined}
      onPointerMove={anchorModeOn ? (e) => {
        if (!draggingRef.current) return;
        updateFromPointer(e.clientX, e.clientY);
      } : undefined}
      onPointerUp={anchorModeOn ? () => { draggingRef.current = false; } : undefined}
      onWheel={anchorModeOn ? (e) => {
        // Handles both a plain mouse wheel and trackpad pinch-to-zoom —
        // Chrome/Safari both report pinch gestures as wheel events.
        e.preventDefault();
        setZoom(zoom - e.deltaY * ZOOM_WHEEL_SENSITIVITY);
      } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={85}
        className={className}
        style={{
          objectPosition: focalPointToCss(current),
          // Cropping in tighter than the natural object-fit:cover crop —
          // scaling the already-cover-fit, already-positioned image around
          // the SAME focal-point percentage as its transform-origin keeps
          // that point visually anchored while zooming in around it.
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: focalPointToCss(current),
        }}
      />
      {anchorModeOn && (
        <>
          <div style={{
            position: "absolute", inset: 0, cursor: "crosshair",
            outline: "2px solid rgba(255,70,70,0.9)", outlineOffset: "-2px",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            left: `${current.x}%`, top: `${current.y}%`,
            width: "22px", height: "22px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "2px solid #fff",
            background: "rgba(255,70,70,0.85)",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.4)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "6px", right: "6px",
            display: "flex", alignItems: "center", gap: "4px",
            background: "rgba(0,0,0,0.72)", color: "#fff",
            fontFamily: "var(--font-mono)", fontSize: "11px",
            padding: "3px 4px 3px 6px", borderRadius: "5px",
          }}>
            <span style={{ pointerEvents: "none" }}>
              {Math.round(current.x)}%, {Math.round(current.y)}% · {zoom.toFixed(2)}×
            </span>
            <button
              onClick={() => setZoom(zoom - 0.2)}
              title="Zoom out (or scroll on the image)"
              style={zoomBtnStyle}
            >−</button>
            <button
              onClick={() => setZoom(zoom + 0.2)}
              title="Zoom in (or scroll on the image)"
              style={zoomBtnStyle}
            >+</button>
            <button
              onClick={() => setAnchor(src, { x: 50, y: 50, zoom: 1 })}
              title="Reset this image's crop"
              style={zoomBtnStyle}
            >↺</button>
          </div>
        </>
      )}
    </div>
  );
}

const zoomBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.16)", color: "#fff", border: "none",
  borderRadius: "3px", width: "16px", height: "16px", lineHeight: "16px",
  padding: 0, cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "11px",
};

const anchorBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.12)", color: "#fff", border: "none",
  borderRadius: "6px", padding: "6px 8px", cursor: "pointer",
  fontFamily: "var(--font-mono)", fontSize: "11px",
};

/** Floating "Anchor images" toggle + panel — mount once alongside
 * `<AnchorProvider>`. Renders nothing in production. */
export function AnchorToggle() {
  const { anchorModeOn, setAnchorModeOn, anchors, resetAll } = useAnchorContext();
  const [copied, setCopied] = useState(false);

  if (process.env.NODE_ENV === "production") return null;

  const count = Object.keys(anchors).length;

  const handleCopy = async () => {
    const json = JSON.stringify(anchors, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API blocked (e.g. no HTTPS/permission) — surface the
      // JSON directly so the values aren't stranded.
      window.prompt("Copy this JSON:", json);
    }
  };

  return (
    <div style={{
      position: "fixed", left: "20px", bottom: "20px", zIndex: 9999,
      display: "flex", flexDirection: "column", gap: "8px",
      fontFamily: "var(--font-mono)", fontSize: "12px",
    }}>
      {anchorModeOn && (
        <div style={{
          background: "rgba(20,20,24,0.92)", color: "#fff",
          borderRadius: "10px", padding: "10px 12px",
          display: "flex", flexDirection: "column", gap: "8px",
          width: "190px", boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}>
          <div style={{ lineHeight: 1.4 }}>Click/drag to pan. Scroll, pinch, or use +/− to zoom in.</div>
          <div style={{ opacity: 0.7 }}>{count} custom anchor{count === 1 ? "" : "s"}</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={handleCopy} style={anchorBtnStyle}>{copied ? "Copied!" : "Copy JSON"}</button>
            <button onClick={resetAll} style={anchorBtnStyle}>Reset all</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setAnchorModeOn(!anchorModeOn)}
        style={{
          alignSelf: "flex-start",
          background: anchorModeOn ? "#e04b4b" : "rgba(20,20,24,0.92)",
          color: "#fff", border: "none", borderRadius: "999px",
          padding: "10px 16px", cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
      >
        {anchorModeOn ? "✕ Exit anchor mode" : "🎯 Anchor images"}
      </button>
    </div>
  );
}
