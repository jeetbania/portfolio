"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { EditableText } from "@/lib/contentEditor";
import { CASE_STUDY_STYLE, IMAGE_CARD_STYLE } from "@/lib/caseStudyStyles";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Draggable before/after image comparison. Deliberately doesn't reuse
 * AnchoredImage (the anchor tool's pan/zoom drag would fight this
 * component's own drag-to-reveal over the exact same box) — both images
 * here render plain, centered, via next/image directly.
 *
 * Technique: the "after" image fills the box normally; the "before" image
 * sits on top of it in an identical full-size layer, clipped with
 * `clip-path: inset()` down to the revealed sliver — clip-path (not a
 * shrinking width) so the image itself is never squished, just masked.
 * The divider + handle sit at that same percentage.
 *
 * Built on Pointer Events (unifies mouse/touch/pen — same technique as
 * the anchor tool), so touch dragging works with no extra code beyond
 * `touchAction: "none"` to stop the browser's own scroll gesture from
 * competing with the drag. Keyboard-accessible too: the handle is a real
 * `role="slider"` button, arrow keys nudge it.
 */
export default function BeforeAfterSlider({
  before, after, beforeLabel = "Before", afterLabel = "After", editableId,
}: {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  beforeLabel?: string;
  afterLabel?: string;
  /** Base id for this block's editable labels (e.g. "showcase.blocks[2]") — EditableText ids become `${editableId}.beforeLabel` / `.afterLabel`. */
  editableId: string;
}) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromPointer = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
  }, []);

  const sizes = `(max-width: 900px) 100vw, ${CASE_STUDY_STYLE.contentColumnWidth}px`;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: CASE_STUDY_STYLE.wideImageAspect,
        borderRadius: `${IMAGE_CARD_STYLE.cardRadius}px`,
        overflow: "hidden",
        cursor: "ew-resize",
        touchAction: "none",
        userSelect: "none",
      }}
      onPointerDown={e => {
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromPointer(e.clientX);
      }}
      onPointerMove={e => {
        if (!dragging) return;
        updateFromPointer(e.clientX);
      }}
      onPointerUp={() => setDragging(false)}
    >
      {/* "After" — full, underneath */}
      <Image src={after.src} alt={after.alt} fill className="object-cover" sizes={sizes} quality={85} style={{ objectPosition: "50% 50%" }} />

      {/* "Before" — identical full-size layer on top, clipped to reveal
          only the left `position`% instead of being resized/squished. */}
      <div style={{
        position: "absolute", inset: 0,
        clipPath: `inset(0 ${100 - position}% 0 0)`,
        transition: dragging ? "none" : "clip-path 200ms var(--ease-out)",
      }}>
        <Image src={before.src} alt={before.alt} fill className="object-cover" sizes={sizes} quality={85} style={{ objectPosition: "50% 50%" }} />
      </div>

      {/* Corner labels — editable via the copy tool, static text otherwise. */}
      <div style={{ position: "absolute", top: "14px", left: "14px", pointerEvents: "none" }}>
        <span style={labelChipStyle}>
          <EditableText id={`${editableId}.beforeLabel`} baseValue={beforeLabel} as="span" />
        </span>
      </div>
      <div style={{ position: "absolute", top: "14px", right: "14px", pointerEvents: "none" }}>
        <span style={labelChipStyle}>
          <EditableText id={`${editableId}.afterLabel`} baseValue={afterLabel} as="span" />
        </span>
      </div>

      {/* Divider line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, bottom: 0,
          left: `${position}%`,
          width: "2px",
          transform: "translateX(-1px)",
          background: "#fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.25), 0 0 12px rgba(0,0,0,0.3)",
          pointerEvents: "none",
          transition: dragging ? "none" : "left 200ms var(--ease-out)",
        }}
      />

      {/* Handle — the actual keyboard-focusable slider control. Icon
          (two outward-facing chevrons) is the "instruct dragging" cue. */}
      <div
        role="slider"
        aria-label="Drag to compare before and after"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        style={{
          position: "absolute",
          left: `${position}%`, top: "50%",
          transform: "translate(-50%, -50%)",
          width: "40px", height: "40px",
          borderRadius: "50%",
          background: "#fff",
          display: "grid", placeItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)",
          cursor: "ew-resize",
          transition: dragging ? "none" : "left 200ms var(--ease-out)",
        }}
        onKeyDown={e => {
          if (e.key === "ArrowLeft") { e.preventDefault(); setPosition(p => clamp(p - 4, 0, 100)); }
          if (e.key === "ArrowRight") { e.preventDefault(); setPosition(p => clamp(p + 4, 0, 100)); }
          if (e.key === "Home") { e.preventDefault(); setPosition(0); }
          if (e.key === "End") { e.preventDefault(); setPosition(100); }
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M5.5 3 2 8l3.5 5M10.5 3 14 8l-3.5 5" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

const labelChipStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "var(--font-sans)",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  color: "#fff",
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  padding: "5px 10px",
  borderRadius: "99px",
};
