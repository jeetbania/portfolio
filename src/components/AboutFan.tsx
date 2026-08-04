"use client";

import { useRef, useEffect, useCallback } from "react";
import { animate } from "motion";
import Image from "next/image";

/* 7 placeholder photos, center one is index 3 — swap the src (and update
   the alt alongside it) once real personal photos replace these. */
const PHOTOS = [
  { src: "/tech-1.jpg",    alt: "Circuit board close-up" },
  { src: "/event-1.jpg",   alt: "Live event crowd" },
  { src: "/kitchen-1.jpg", alt: "Participants cooking together" },
  { src: "/screen-1.jpg",  alt: "Analytics dashboard on screen" },
  { src: "/tech-2.jpg",    alt: "Team collaborating around a table" },
  { src: "/event-2.jpg",   alt: "Conference audience" },
  { src: "/kitchen-2.jpg", alt: "Kitchen scene" },
];
const N = PHOTOS.length;
const CENTER = (N - 1) / 2;

/* Speech-bubble shapes (user-supplied SVGs) — tail sits off-center within
   each shape's own width, not extending past it. "Left" leans its body
   rightward from the tail, "right" leans leftward — pairing left-tail with
   the pill on the fan's left side (and vice versa) keeps both bubbles
   leaning toward the center instead of overhanging the stage's edges. */
const SPEECH_SHAPES = {
  left: {
    viewBox: "0 0 80 39",
    path: "M65 0C73.2843 0 80 6.71573 80 15C80 23.2843 73.2843 30 65 30H34.3496C33.653 30.6904 33.0085 31.3759 32.5 32C31.2651 33.5155 29.9326 35.6756 28.9541 37.3691C28.2391 38.606 26.4899 38.7878 25.5752 37.6904L19.167 30H15C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0H65Z",
    aspect: 80 / 39,
  },
  right: {
    viewBox: "0 0 75 39",
    path: "M60 0C68.2843 0 75 6.71573 75 15C75 23.2843 68.2843 30 60 30H55.833L49.4248 37.6904C48.5101 38.7878 46.7609 38.606 46.0459 37.3691C45.0674 35.6756 43.7349 33.5155 42.5 32C41.9915 31.3759 41.347 30.6904 40.6504 30H15C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 1.20798e-07 15 0H60Z",
    aspect: 75 / 39,
  },
};
/* Native shapes are 30 units of "belly" (where the label sits) out of a
   39-unit total height — the rest is the tail poking out below. */
const SPEECH_BELLY_FRACTION = 30 / 39;

/* Little callouts pinned above specific cards — copy is just a
   placeholder for now, swap the labels whenever. One pastel-blue
   highlight, the rest subtle gray. */
const PILLS = [
  { afterIndex: 1, label: "tokyo trip", variant: "left" as const,  bg: "#C7E2F7", fg: "#1E4A66" },
  { afterIndex: 5, label: "fav meal",   variant: "right" as const, bg: "#E6E6E6", fg: "#3A3A3A" },
];
const PILL_HEIGHT = 56; // px, rendered size — width follows each shape's own aspect ratio
/* Clear space kept between a pill's tail tip and the card it points at —
   generous enough that it still clears HOVER_LIFT without the two ever
   touching. */
const PILL_CARD_GAP = 26;

const OPEN_DELAY_MS     = 450;  // pause before anything happens
/* Position (rise + fade) leads; rotation trails slightly behind and takes
   a touch longer to settle — reads as "it lifts, then straightens" rather
   than one blended motion. Both slowed down and given more spring than
   before, per feedback: subtle rotation was right, pacing was too quick. */
const POSITION_SPRING   = { type: "spring" as const, duration: 0.65, bounce: 0.3  };
const ROTATE_SPRING     = { type: "spring" as const, duration: 0.85, bounce: 0.32, delay: 0.1 };
const FANOUT_OVERLAP_MS = 420;  // fan-out starts slightly before entrance settles
/* Slightly slower than before, per feedback — same shape, just a touch
   more unhurried. */
const FANOUT_DURATION_S  = 0.92;
const FANOUT_SPRING      = { type: "spring" as const, duration: FANOUT_DURATION_S, bounce: 0.34 };
/* Pills pop in while the fan is still settling into place (not after it
   has fully stopped) — timed at the same ~82%-through point of the
   fan-out spring as before, just rescaled to its new, slower duration. */
const PILL_POP_DELAY_MS = FANOUT_OVERLAP_MS + Math.round(FANOUT_DURATION_S * 1000 * 0.82);
const PILL_SPRING       = { type: "spring" as const, duration: 0.5, bounce: 0.55 };
const HOVER_SPRING      = { type: "spring" as const, duration: 0.35, bounce: 0.30 };
const HOVER_LIFT        = 12;

/* Subtle mouse-follow on the speech bubbles — a small parallax offset
   toward the cursor, not a real drag. Lives on its own inner element (see
   pillFollowRefs below) so it never fights the outer pill's Motion-owned
   entrance transform (opacity/scale/y), same "one system per element"
   rule Folder.tsx follows for its hover cards. */
const FOLLOW_MAX_X = 7;  // px
const FOLLOW_MAX_Y = 5;  // px
const FOLLOW_SPRING = { type: "spring" as const, duration: 0.4, bounce: 0.35 };

export default function AboutFan() {
  const stageRef  = useRef<HTMLDivElement>(null);
  const groupRef  = useRef<HTMLDivElement>(null);   // entrance: fade + rise + de-rotate, as ONE unit
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const pillRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const pillFollowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const openedRef = useRef(false);
  const initDone  = useRef(false);
  const fanPosRef = useRef<{ x: number; y: number; rotate: number }[]>([]);
  const reduced   = typeof window !== "undefined"
    ? matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const s = (cfg: object) => (reduced ? { duration: 0 } : cfg);

  /* Seed via Motion (not CSS) so nothing fights on the first real animate call */
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    if (groupRef.current) animate(groupRef.current, { opacity: 0, y: 18, rotate: 12 }, { duration: 0 });
    cardRefs.current.forEach(el => {
      if (el) animate(el, { x: 0, y: 0, rotate: 0 }, { duration: 0 });
    });
    pillRefs.current.forEach(el => {
      if (el) animate(el, { opacity: 0, scale: 0.6, y: 8 }, { duration: 0 });
    });
    pillFollowRefs.current.forEach(el => {
      if (el) animate(el, { x: 0, y: 0 }, { duration: 0 });
    });
  }, []);

  /* Compute fan targets from the ACTUAL rendered size at open-time, so the
     same code produces a proportional fan at any viewport width — this is
     what makes it work on mobile without a separate branch. */
  const computeFanPositions = useCallback(() => {
    const stageW = stageRef.current?.getBoundingClientRect().width ?? 900;
    const cardW  = groupRef.current?.getBoundingClientRect().width ?? 150;
    /* A step close to a full card-width apart — cards mostly sit side by
       side with only a sliver of overlap, not the old ~50%-overlap stack
       (kept slightly narrower than an earlier pass — that one fanned out
       a touch too wide). */
    const usable = stageW * 0.90;
    const step   = Math.max((usable - cardW) / (N - 1), cardW * 0.72);
    return PHOTOS.map((_, i) => {
      const offset = i - CENTER;
      return {
        x: offset * step,
        y: Math.abs(offset) * (cardW * 0.16),
        rotate: offset * 9,
      };
    });
  }, []);

  const doOpen = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;

    /* Phase 1 — position leads (fade + rise settles first), rotation
       trails a beat behind and finishes slightly after — two separate
       animate() calls on the same element's different transform channels,
       so they run concurrently but visibly offset. */
    if (groupRef.current) {
      animate(groupRef.current, { opacity: 1, y: 0 }, s(POSITION_SPRING));
      animate(groupRef.current, { rotate: 0 }, s(ROTATE_SPRING));
    }

    /* Phase 2 — fan out, all cards simultaneously (no stagger), slightly
       overlapping the tail end of phase 1 so the motion reads as one
       continuous gesture rather than two separate steps. */
    const start = () => {
      const positions = computeFanPositions();
      fanPosRef.current = positions;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        animate(el, positions[i], s(FANOUT_SPRING));
      });

      /* Park each pill above the top edge of its associated card, in the
         same group-local coordinate space the cards themselves move in.
         offsetWidth/Height (not getBoundingClientRect) on purpose — the
         pill is still scale:0.6 from the seed above at this point, and
         getBoundingClientRect would report that shrunk size instead of
         its natural one. */
      const cardW = groupRef.current?.offsetWidth ?? 130;
      PILLS.forEach((pill, i) => {
        const el = pillRefs.current[i];
        const pos = positions[pill.afterIndex];
        if (!el || !pos) return;
        const pillW = el.offsetWidth;
        const pillH = el.offsetHeight;
        el.style.left = `${pos.x + cardW / 2 - pillW / 2}px`;
        el.style.top  = `${pos.y - pillH - PILL_CARD_GAP}px`;
      });
    };

    const popPills = () => {
      pillRefs.current.forEach((el, i) => {
        if (!el) return;
        animate(el, { opacity: 1, scale: 1, y: 0 }, { ...s(PILL_SPRING), delay: i * 0.14 });
      });
    };

    if (reduced) { start(); popPills(); return; }
    setTimeout(start, FANOUT_OVERLAP_MS);
    setTimeout(popPills, PILL_POP_DELAY_MS);
  }, [computeFanPositions, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (reduced) { doOpen(); return; }
    const el = stageRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          timer = setTimeout(doOpen, OPEN_DELAY_MS);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); if (timer) clearTimeout(timer); };
  }, [reduced, doOpen]);

  const onEnter = (i: number) => {
    if (!openedRef.current || !fanPosRef.current[i]) return;
    const el = cardRefs.current[i];
    if (!el) return;
    const pos = fanPosRef.current[i];
    animate(el, { x: pos.x, y: pos.y - HOVER_LIFT, rotate: pos.rotate }, s(HOVER_SPRING));
  };
  const onLeave = (i: number) => {
    if (!openedRef.current || !fanPosRef.current[i]) return;
    const el = cardRefs.current[i];
    if (!el) return;
    animate(el, fanPosRef.current[i], s(HOVER_SPRING));
  };

  const onPillMouseMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const el = pillFollowRefs.current[i];
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    animate(el, { x: px * FOLLOW_MAX_X * 2, y: py * FOLLOW_MAX_Y * 2 }, s(FOLLOW_SPRING));
  };
  const onPillMouseLeave = (i: number) => {
    const el = pillFollowRefs.current[i];
    if (!el) return;
    animate(el, { x: 0, y: 0 }, s(FOLLOW_SPRING));
  };

  return (
    <div
      ref={stageRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "960px",
        height: "clamp(190px, 30vw, 300px)",
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Entrance mover — fade / rise / de-rotate as one unit */}
      <div
        ref={groupRef}
        style={{
          position: "relative",
          width: "clamp(100px, 16vw, 150px)",
          height: "clamp(119px, 19vw, 178px)",
          willChange: "transform, opacity",
        }}
      >
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            ref={el => { cardRefs.current[i] = el; }}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={() => onLeave(i)}
            style={{
              position: "absolute",
              inset: 0,
              willChange: "transform",
              zIndex: i,
            }}
          >
            {/* position:relative here is required — Next/Image `fill` needs
                THIS element to be the positioned ancestor, otherwise it
                sizes against the outer absolute-positioned card div instead
                and visually spills past this div's border-radius/overflow. */}
            <div style={{
              position: "relative",
              width: "100%", height: "100%",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 6px 14px rgba(var(--shadow-tint-rgb),0.10), 0 1px 3px rgba(var(--shadow-tint-rgb),0.06)",
            }}>
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="140px" />
            </div>
          </div>
        ))}

        {/* Speech-bubble callouts — positioned imperatively in doOpen()
            (left/top set directly, in the same coordinate space the cards
            translate in), then popped in with Motion once the fan is
            almost done settling. Left at (0,0)/hidden until then. No
            shadows on these by design — flat, subtle color only. */}
        {PILLS.map((pill, i) => {
          const shape = SPEECH_SHAPES[pill.variant];
          const width = PILL_HEIGHT * shape.aspect;
          return (
            <div
              key={pill.label}
              ref={el => { pillRefs.current[i] = el; }}
              onMouseMove={e => onPillMouseMove(e, i)}
              onMouseLeave={() => onPillMouseLeave(i)}
              style={{
                position: "absolute",
                left: 0, top: 0,
                width, height: PILL_HEIGHT,
                zIndex: 20,
                /* Was pointer-events:none (purely decorative sticker) —
                   now needs real events for the mouse-follow, but it still
                   floats clear above the cards (see PILL_CARD_GAP) so this
                   can't shadow their own hover/click targets. */
                pointerEvents: "auto",
                cursor: "default",
                willChange: "transform, opacity",
              }}
            >
              {/* Follow offset lives on its own inner element so it never
                  fights the outer div's Motion-owned entrance transform. */}
              <div
                ref={el => { pillFollowRefs.current[i] = el; }}
                style={{ position: "relative", width: "100%", height: "100%", willChange: "transform" }}
              >
                <svg
                  width={width} height={PILL_HEIGHT} viewBox={shape.viewBox}
                  fill="none" xmlns="http://www.w3.org/2000/svg"
                  style={{ position: "absolute", inset: 0 }}
                  aria-hidden="true"
                >
                  <path d={shape.path} fill={pill.bg} />
                </svg>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  bottom: `${PILL_HEIGHT * (1 - SPEECH_BELLY_FRACTION)}px`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(12px, 1.3vw, 14px)",
                    fontWeight: 600,
                    textTransform: "lowercase",
                    color: pill.fg,
                    whiteSpace: "nowrap",
                  }}>
                    {pill.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
