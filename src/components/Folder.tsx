"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { animate } from "motion";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { useTheme } from "@/lib/theme";

interface FolderProps {
  project: Project;
  strongGlass?: boolean;
}

const OPEN_SPRING  = { type: "spring" as const, duration: 0.5,  bounce: 0.22 };
const CLOSE_SPRING = { type: "spring" as const, duration: 0.32, bounce: 0.05 };
const IMG_SPRINGS  = [
  { type: "spring" as const, duration: 0.46, bounce: 0.18 },
  { type: "spring" as const, duration: 0.52, bounce: 0.14 },
  { type: "spring" as const, duration: 0.58, bounce: 0.10 },
];

/*
 * RESTING and OPEN positions — Motion owns ALL transforms on image els.
 * Never set CSS `transform` inline on these elements; only Motion.
 * This prevents the 360° spin on first hover (CSS→Motion handoff).
 */
const REST = [
  { x: "-5%", y: "0%", rotate: -4, scale: 1 },
  { x:  "0%", y: "0%", rotate:  0, scale: 1 },
  { x:  "5%", y: "0%", rotate:  4, scale: 1 },
];

/* Images break out of folder left/right (overflow:visible on wrapper) */
const OPEN_POS = [
  { x: "-18%", y: "-20%", rotate: -8, scale: 1 },
  { x:   "0%", y: "-26%", rotate:  0, scale: 1 },
  { x:  "18%", y: "-20%", rotate:  8, scale: 1 },
];

const back = `
  M0,22 A22,22 0 0 1 22,0 L155,0 A22,22 0 0 1 177,22
  A32,32 0 0 0 209,54 L374,54 A26,26 0 0 1 400,80
  L400,314 A26,26 0 0 1 374,340 L26,340 A26,26 0 0 1 0,314 Z
`.trim();

const CARDS = [
  { cx: 20, w: 30, aspect: "2/3"  },
  { cx: 50, w: 38, aspect: "4/3"  },
  { cx: 80, w: 30, aspect: "2/3"  },
];

export default function Folder({ project, strongGlass }: FolderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const flapRef  = useRef<HTMLDivElement>(null);
  const imgRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const initDone = useRef(false);
  const reduced  = typeof window !== "undefined"
    ? matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const s = (cfg: object) => reduced ? { duration: 0 } : cfg;

  /*
   * Set initial resting transforms via Motion (not CSS) — this is the key fix.
   * Motion tracks its own transform state; mixing CSS transform with Motion
   * on the same element causes it to interpolate through 360° on first hover.
   */
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    imgRefs.current.forEach((el, i) => {
      if (!el) return;
      animate(el, REST[i], { duration: 0 }); // instant — just seeds Motion's state
    });
  }, []);

  const doOpen = useCallback(() => {
    if (open) return;
    setOpen(true);
    if (flapRef.current) animate(flapRef.current, { rotateX: -22 }, s(OPEN_SPRING));
    imgRefs.current.forEach((el, i) => {
      if (!el) return;
      animate(el, OPEN_POS[i], { ...s(IMG_SPRINGS[i] ?? IMG_SPRINGS[0]), delay: i * 0.045 });
    });
  }, [open]);

  const doClose = useCallback(() => {
    if (!open) return;
    setOpen(false);
    if (flapRef.current) animate(flapRef.current, { rotateX: 0 }, s(CLOSE_SPRING));
    imgRefs.current.forEach((el, i) => {
      if (!el) return;
      animate(el, REST[i], { ...s(CLOSE_SPRING), delay: i * 0.02 });
    });
  }, [open]);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#3B5BDB] rounded-3xl"
      onMouseEnter={doOpen}
      onMouseLeave={doClose}
      onFocus={doOpen}
      onBlur={doClose}
      /* No aria-label — it was replacing the link's whole accessible name
         with just the title ("View X case study"), silently dropping the
         description and tag text a screen reader user would otherwise
         hear (and tripping WCAG 2.5.3, since the visible tag text then
         had no match in the accessible name at all). Letting the name
         compute from content is both more informative and correct. */
    >
      <div className="relative w-full select-none" style={{ perspective: "900px" }}>

        {/* Back SVG */}
        <svg
          viewBox="0 0 400 340"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
          style={{
            filter: [
              "drop-shadow(0 1px 2px rgba(0,0,0,0.07))",
              "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
              "drop-shadow(0 16px 36px rgba(0,0,0,0.11))",
            ].join(" "),
          }}
        >
          <path d={back} fill={project.tintHex} fillOpacity={isDark ? 0.72 : 0.55} />
          <path d={back} fill="none" stroke="white" strokeOpacity={0.7} strokeWidth={1} />
        </svg>

        {/*
         * overflow:visible here — lets images break outside the folder boundary
         * for the perspective "spreading cards" effect on hover.
         * The flap clips itself via its own border-radius.
         */}
        <div className="relative w-full" style={{ paddingBottom: "85%", overflow: "visible" }}>

          {/* Preview images */}
          {project.images.slice(0, 3).map((img, i) => {
            const { cx, w, aspect } = CARDS[i];
            const left = cx - w / 2;
            return (
              <div
                key={img.src + i}
                ref={el => { imgRefs.current[i] = el; }}
                className="absolute"
                style={{
                  width: `${w}%`,
                  aspectRatio: aspect,
                  top: "8%",
                  left: `${left}%`,
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 3px 11px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.13)",
                  willChange: "transform",
                  zIndex: i === 1 ? 3 : 2,
                  /* NO CSS transform here — Motion owns this entirely */
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 900px) 35vw, 18vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            );
          })}

          {/* Acrylic flap */}
          <div
            ref={flapRef}
            className="absolute inset-x-0"
            style={{
              top: "32%",
              bottom: 0,
              borderRadius: "18px",
              transformOrigin: "bottom center",
              background: isDark
                ? `linear-gradient(160deg, ${project.tintHex}A6 0%, ${project.tintHex}80 100%)`
                : `linear-gradient(160deg, ${project.tintHex}58 0%, ${project.tintHex}44 100%)`,
              backdropFilter: strongGlass
                ? "blur(34px) saturate(220%) brightness(1.06)"
                : "blur(22px) saturate(190%) brightness(1.04)",
              WebkitBackdropFilter: strongGlass
                ? "blur(34px) saturate(220%) brightness(1.06)"
                : "blur(22px) saturate(190%) brightness(1.04)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65), inset 0 0 0 1px rgba(255,255,255,0.22)",
              zIndex: 10,
              willChange: "transform",
            }}
          >
            <div
              className="absolute inset-0 flex flex-col justify-between"
              style={{ padding: "16px 16px 16px" }}
            >
              {/* Top block — title then description */}
              <div className="min-w-0">
                <p style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(21px,2.6vw,28px)",
                  fontWeight:400, lineHeight:1.15, color:"var(--col-fg)", marginBottom:"6px" }}>
                  {project.title}
                </p>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:"12px",
                  color:"var(--col-muted)", lineHeight:1.45 }}>
                  {project.description}
                </p>
              </div>

              {/* Bottom row — tags + arrow, pinned to the flap's bottom edge */}
              <div className="flex items-end justify-between">
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily:"var(--font-sans)", fontSize:"10px", letterSpacing:"0.02em",
                      padding:"2px 7px", borderRadius:"99px",
                      background:"rgba(255,255,255,0.55)", border:"1px solid rgba(255,255,255,0.75)",
                      color:"#1A1A1A",
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{
                  flexShrink:0, width:30, height:30, borderRadius:"50%",
                  background:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.9)",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.07)", display:"grid", placeItems:"center",
                }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 10L10 2M10 2H4.5M10 2V7.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
