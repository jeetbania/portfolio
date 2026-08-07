"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { withGlassShine, QUICK_EASE } from "@/lib/hoverStyles";
import { useIsMobile } from "@/lib/useIsMobile";

/* ══════════════════════════════════════════════════════════════════
   Icon assets — the three pixel-glyph SVGs supplied by the user.
   Recoloured per-card via string replace (fill="black" → accent),
   same technique used for the footer's obstacle sprites.
   ══════════════════════════════════════════════════════════════════ */

const PROJECT_ICON = `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 13.5V11.5H32V5.5H30V3.5H14V5.5H12V11.5H2V13.5H0V25.5H44V13.5H42ZM16 7.5H28V11.5H16V7.5ZM44 29.5V41.5H42V43.5H2V41.5H0V29.5H16V33.5H28V29.5H44Z" fill="black"/></svg>`;
const COFFEE_ICON  = `<svg viewBox="0 0 88 100" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M41.0591 0V5.8828H46.938V0H41.0591Z" fill="black"/><path d="M58.699 11.7661V5.8833H46.937V11.7661H58.699Z" fill="black"/><path d="M64.582 23.5272V11.7612H58.7031V23.5272H64.582Z" fill="black"/><path d="M35.1799 17.645V23.5278H46.9419V17.645H35.1799Z" fill="black"/><path d="M29.301 41.1802H35.1799V23.5352H29.301V41.1802Z" fill="black"/><path d="M46.9409 29.414H58.7029V23.5312H46.9409V29.414Z" fill="black"/><path d="M41.0591 47.0591V41.1763H35.1802V47.0591H41.0591Z" fill="black"/><path d="M82.2229 82.3549H70.4609V64.7099H82.2229V58.8271H70.4609V52.9443L-0.101074 52.9404V88.2374H5.77783V58.8234H11.6567V82.3504H17.5356V88.2332H58.6956V94.116H64.5745V88.2332H82.2155V82.3504L82.2229 82.3549Z" fill="black"/><path d="M88.102 82.355V64.71H82.2231V82.355H88.102Z" fill="black"/><path d="M5.7771 88.2378V94.1206H11.656V88.2378H5.7771Z" fill="black"/><path d="M11.6599 100H58.7029V94.1172H11.6599V100Z" fill="black"/></g></svg>`;
const PLUGIN_ICON  = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M19.2 32V38.4H28.8V32H38.4V38.4H48V48H38.4V41.6H28.8V48H19.2V41.6H9.6V48H0V38.4H9.6V32H19.2ZM35.2 25.6H28.8V19.2H35.2V16H12.8V19.2H19.2V25.6H12.8V22.4H6.4V16H0V9.6H6.4V3.2H12.8V0H19.2V6.4H12.8V9.6H35.2V6.4H28.8V0H35.2V3.2H41.6V9.6H48V16H41.6V22.4H35.2V25.6Z" fill="black"/></g></svg>`;

function recolor(svg: string, color: string) {
  return svg.replace(/fill="black"/g, `fill="${color}"`);
}

/* ══════════════════════════════════════════════════════════════════
   Card data
   ══════════════════════════════════════════════════════════════════ */

type CardDef = {
  label: string;
  value?: string;
  subtitle: string;
  darkAccent: string;
  lightAccent: string;
  tint: string;
  shadowRgb: string;
  icon?: string;      // recoloured SVG markup
  image?: string;     // real photo/cover, shown instead of the icon tile
  imageFill?: boolean; // true = image fills the whole card top (book cover style)
};

const CARDS: CardDef[] = [
  {
    label: "Current project",
    value: "DealSage",
    subtitle: "Website redesign",
    darkAccent: "#6C4FD1", lightAccent: "#A79AFF", tint: "#EDEBFE",
    shadowRgb: "108,79,209",
    icon: PROJECT_ICON,
  },
  {
    label: "Currently reading",
    subtitle: "Nir Eyal",
    darkAccent: "#C77D11", lightAccent: "#F5C15A", tint: "#FBF0DA",
    shadowRgb: "184,121,15",
    image: "/book-cover.png",
    imageFill: true,
  },
  {
    label: "Side project",
    value: "Figma Plugin",
    subtitle: "Design System",
    darkAccent: "#1F9D55", lightAccent: "#6EDB98", tint: "#E1F5E9",
    shadowRgb: "31,157,85",
    icon: PLUGIN_ICON,
  },
  {
    label: "Music",
    value: "The 1975",
    subtitle: "Somebody Else",
    darkAccent: "#C23B6B", lightAccent: "#F58FB0", tint: "#FCE7ED",
    shadowRgb: "194,59,107",
    image: "/album-cover.jpg",
  },
  {
    label: "Coffee count",
    value: "12",
    subtitle: "cups this week",
    darkAccent: "#2563C7", lightAccent: "#6FA8F5", tint: "#E4EFFC",
    shadowRgb: "37,99,199",
    icon: COFFEE_ICON,
  },
];

/* Fan geometry — outer cards rotate + drop more, centre stays highest */
const FAN = [
  { rotate: -9,   y: 10 },
  { rotate: -4.5, y: 3  },
  { rotate: 0,    y: 0  },
  { rotate: 5,    y: 4  },
  { rotate: 10,   y: 11 },
];

/* Mobile stack geometry — the reference (a "scrapbook" collage of
   photos/cards, tossed onto the page at slightly different angles,
   corners tucked under one another) instead of the neat, evenly-aligned
   grid the first pass landed on. Each card gets its own small independent
   rotation (alternating sign so neighbors visibly cant against each
   other, not all leaning the same way) plus a small x/y nudge that pulls
   it slightly toward whichever card it should tuck under — negative
   marginTop does the real work of the row-to-row overlap (see FanCard),
   this x/y is just the finishing "scattered" touch on top of that. */
const MOBILE_STACK = [
  { rotate: -4,   x: 2,  y: 0,  marginTop: 0   },
  { rotate: 3,    x: -3, y: 6,  marginTop: 0   },
  { rotate: -2.5, x: 4,  y: -4, marginTop: -18 },
  { rotate: 3.5,  x: -4, y: 2,  marginTop: -12 },
  { rotate: -2,   x: 0,  y: -3, marginTop: -16 },
];

/* ══════════════════════════════════════════════════════════════════
   Canned "quick ask" responses
   ══════════════════════════════════════════════════════════════════ */
const RESPONSES: { keys: string[]; answer: string }[] = [
  { keys: ["work", "project", "doing", "building", "portfolio"],
    answer: "Right now I'm deep in a portfolio redesign, honestly obsessing over folder physics more than anyone reasonably should." },
  { keys: ["music", "listen", "song", "playlist", "band"],
    answer: "Currently on repeat: The 1975. Ask me for a playlist sometime, I have opinions." },
  { keys: ["book", "read", "reading"],
    answer: "I'm reading Hooked by Nir Eyal. Equal parts fascinating and slightly terrifying." },
  { keys: ["coffee", "caffeine", "tea"],
    answer: "Averaging way too many cups a week. My design system has better documentation than my sleep schedule does." },
  { keys: ["contact", "hire", "email", "reach", "talk", "available"],
    answer: "Best way to reach me is the \u201CLet's Talk\u201D button up top. I actually reply, promise." },
  { keys: ["who", "you", "about", "yourself"],
    answer: "I'm Jeet, a product designer who loves clean systems, tiny interactions, and asking \u201Cwhy\u201D one too many times." },
];
const FALLBACK = "Good question, I don't have a canned answer for that one yet. The \u201CLet's Talk\u201D button up top gets you a real one though.";

function getResponse(query: string): string {
  const q = query.toLowerCase();
  for (const r of RESPONSES) if (r.keys.some(k => q.includes(k))) return r.answer;
  return FALLBACK;
}

/* ══════════════════════════════════════════════════════════════════
   Card
   ══════════════════════════════════════════════════════════════════ */
function FanCard({ card, index, mounted, isMobile, gridSpanFull }: { card: CardDef; index: number; mounted: boolean; isMobile: boolean; gridSpanFull?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const geo = FAN[index];
  const restingZ = 10 - Math.abs(index - 2);

  /*
   * Mobile no longer tries to squeeze into the same overlapping/rotated
   * fan as desktop — at fan-card width (~76px) that overlap read as
   * skewed and cramped. Instead mobile renders these full-width-of-their-
   * grid-cell in a 2-column stack (see Playground's mobile branch below),
   * but per the reference, still leans into its own small rotation and
   * tucks slightly under its neighbor (MOBILE_STACK above) — a scrapbook
   * pile, not a perfectly-aligned grid. Desktop branch (clamp-based fan)
   * is untouched.
   */
  const mobileGeo = MOBILE_STACK[index];
  const cardWidth   = isMobile ? "100%" : "clamp(122px, 15vw, 168px)";
  const overlap     = isMobile ? "0px" : "clamp(-24px,-3vw,-14px)";
  const cardPadding = isMobile ? "14px 14px 18px" : "14px 13px 34px";
  const tileSize    = isMobile ? "40px" : "clamp(46px,5.4vw,56px)";
  const tileRadius  = isMobile ? "10px" : "13px";
  const labelSize   = isMobile ? "10.5px" : "clamp(11px,1.1vw,12.5px)";
  const valueSize   = isMobile ? "14px" : "clamp(14px,1.6vw,16px)";
  const subSize     = isMobile ? "11px": "clamp(11px,1.2vw,12.5px)";
  const labelGap    = isMobile ? "7px" : "10px";
  const tileGap     = isMobile ? "10px" : "12px";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: cardWidth,
        marginLeft: isMobile ? 0 : (index === 0 ? 0 : overlap),
        /* Negative marginTop is what actually creates the row-to-row
           overlap/tuck on mobile — rotation alone only pokes corners out
           a few px, this is what makes a card genuinely slide up under
           the row above it, like the reference. */
        marginTop: isMobile ? `${mobileGeo.marginTop}px` : undefined,
        gridColumn: isMobile && gridSpanFull ? "1 / -1" : undefined,
        transform: isMobile
          ? `rotate(${mobileGeo.rotate}deg) translate(${mobileGeo.x}px, ${(mounted ? mobileGeo.y : mobileGeo.y + 20)}px)`
          : (mounted
              ? `rotate(${geo.rotate}deg) translateY(${hovered ? geo.y - 18 : geo.y}px)`
              : `rotate(${geo.rotate}deg) translateY(${geo.y + 40}px)`),
        opacity: mounted ? 1 : 0,
        transformOrigin: "bottom center",
        transition: mounted
          ? "transform 160ms cubic-bezier(0.34,1.3,0.64,1), box-shadow 160ms var(--ease-out)"
          : `transform 420ms cubic-bezier(0.34,1.15,0.64,1) ${index * 60}ms, opacity 420ms ease-out ${index * 60}ms`,
        zIndex: isMobile ? index : (hovered ? 50 : restingZ),
        cursor: "default",
      }}
    >
      {/*
       * Two-layer "folder" stack: a solid gradient back card peeks above
       * a translucent glass front card — same blur/saturate recipe as
       * the nav header, not a flat clipped strip.
       */}
      <div style={{ position: "relative" }}>
        {/* Back card — solid gradient, peeks ~9px above the front card */}
        <div style={{
          position: "absolute",
          top: "-9px", left: 0, right: 0, bottom: 0,
          borderRadius: "18px",
          background: `linear-gradient(180deg, ${card.lightAccent} 0%, ${card.darkAccent} 100%)`,
          boxShadow: hovered
            ? `0 4px 10px rgba(${card.shadowRgb},0.24), 0 20px 36px rgba(${card.shadowRgb},0.20)`
            : `0 2px 6px rgba(${card.shadowRgb},0.18), 0 10px 22px rgba(${card.shadowRgb},0.12)`,
          zIndex: 0,
          transition: "box-shadow 300ms var(--ease-out)",
        }} />

        {/* Front card — deliberately theme-independent (like the project
            folders): stays a light glass card regardless of site theme,
            so the vivid backing colour always shows through vibrantly. */}
        <div style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "18px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.68)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.78)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
        }}>
        {/* Every card shares the same structure now: label → square tile → value → subtitle */}
        <div style={{ padding: cardPadding }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: labelSize,
            fontWeight: 500, color: "#6B6B6B", margin: `0 0 ${labelGap}`,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {card.label}
          </p>

          {/* Square tile — icons get a top-to-bottom gradient + white glyph;
              photos (book/album) just fill the same square, centred. */}
          <div style={{
            position: "relative",
            width: tileSize, height: tileSize,
            borderRadius: tileRadius,
            overflow: "hidden",
            background: card.image
              ? "#f2f2f5"
              : `linear-gradient(180deg, ${card.lightAccent} 0%, ${card.darkAccent} 100%)`,
            outline: "1px solid rgba(255,255,255,0.4)",
            boxShadow: `0 2px 6px rgba(${card.shadowRgb},0.2)`,
            marginBottom: tileGap,
            display: "grid", placeItems: "center",
          }}>
            {card.image ? (
              <Image src={card.image} alt={card.label} fill className="object-cover" sizes="60px" />
            ) : (
              <div
                style={{ width: "52%", height: "52%" }}
                dangerouslySetInnerHTML={{ __html: recolor(card.icon!, "#ffffff") }}
              />
            )}
          </div>

          {card.value && (
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: valueSize,
                fontWeight: 700, color: "#17171c", margin: "0 0 2px", lineHeight: 1.2,
              }}>
                {card.value}
              </p>
            )}
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: subSize,
              color: "#6B6B6B", margin: 0, lineHeight: 1.3,
            }}>
              {card.subtitle}
            </p>
        </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Pixel loader — 8 square "pixels" chasing around a ring, next to the
   shimmering "Let me think..." label. Blocky/stepped on purpose (squares,
   not a smooth spinner arc) to read as a retro "processing" indicator
   rather than a generic loading spinner — sells "something's computing"
   more than a plain shimmer alone. Keyframe lives in globals.css
   (pixel-loader-tick); each dot gets a negative animation-delay so they
   sit at evenly-spaced phases of the same cycle instead of firing in sync.
   ══════════════════════════════════════════════════════════════════ */
const PIXEL_COUNT = 8;
const PIXEL_LOADER_COLOR = "#7C6FF0";

function PixelLoader({ size = 16 }: { size?: number }) {
  const dot = 3;
  const radius = size / 2 - dot / 2 - 1;
  return (
    <div aria-hidden="true" style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {Array.from({ length: PIXEL_COUNT }).map((_, i) => {
        const angle = (i / PIXEL_COUNT) * Math.PI * 2 - Math.PI / 2;
        const x = size / 2 + radius * Math.cos(angle) - dot / 2;
        const y = size / 2 + radius * Math.sin(angle) - dot / 2;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: x, top: y, width: dot, height: dot,
              background: PIXEL_LOADER_COLOR,
              animation: "pixel-loader-tick 1000ms linear infinite",
              animationDelay: `${(i / PIXEL_COUNT) * -1000}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Quick-ask bar — expands in place to reveal the answer
   ══════════════════════════════════════════════════════════════════ */
function QuickAsk({ mounted }: { mounted: boolean }) {
  const [value,    setValue]    = useState("");
  const [thinking, setThinking] = useState(false);
  const [reply,    setReply]    = useState<{ q: string; a: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDismissTimer = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  };

  function closeReply() {
    clearDismissTimer();
    setReply(null);
  }

  function submit() {
    const q = value.trim();
    if (!q || thinking) return;
    setThinking(true);
    setReply(null);
    clearDismissTimer();
    setTimeout(() => {
      setReply({ q, a: getResponse(q) });
      setThinking(false);
      setValue("");
      /* Auto-close the answer after a few seconds, same fluid collapse
         used for manual dismissal */
      dismissTimer.current = setTimeout(closeReply, 7000);
    }, 2800); /* long enough for the shimmering "Let me think..." + pixel
                 loader to read as real, ongoing work rather than a flash —
                 gives the shimmer (1600ms loop) time for a full sweep plus
                 change, and the pixel loader (1000ms loop) a few full spins */
  }

  /* Close on any click outside the bar — same animated collapse */
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (!reply) return;
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeReply();
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [reply]);

  useEffect(() => () => clearDismissTimer(), []);

  return (
    <div
      ref={wrapperRef}
      style={{
      maxWidth: "780px", margin: "0 auto", position: "relative",
      zIndex: 30,
      /* Negative top margin pulls the bar up so it overlaps the bottom
         of the fanned cards — matches the reference where the cards'
         lower edge disappears behind the bar. */
      marginTop: "clamp(-24px,-3vw,-14px)",
      transform: mounted ? "translateY(0)" : "translateY(16px)",
      opacity: mounted ? 1 : 0,
      transition: "transform 460ms cubic-bezier(0.34,1.1,0.64,1) 320ms, opacity 460ms ease-out 320ms",
    }}>
      {/* Deliberately no focus ring on this bar — it wraps a text input,
          and browsers apply :focus-visible to inputs even on a plain
          mouse click (a real spec quirk, not overridable via CSS alone
          per input), so a ring here would show on click too, which read
          as ugly. Knowingly trading the WCAG 2.4.7 credit on this one
          element for that. */}
      <div style={{
        borderRadius: "26px",
        background: "var(--surface-opaque)",
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",
        border: "1px solid var(--surface-glass-border)",
        boxShadow: "0 2px 6px rgba(var(--shadow-tint-rgb),0.06), 0 20px 44px rgba(var(--shadow-tint-rgb),0.10)",
        overflow: "hidden",
      }}>
        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "rgba(124,111,240,0.10)",
            borderRadius: "999px", padding: "9px 14px", flexShrink: 0,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#7C6FF0" aria-hidden="true">
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
            </svg>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"13px", fontWeight:500, color:"#5B4FD1", whiteSpace:"nowrap" }}>
              Quick ask
            </span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }}
            placeholder="Ask anything about me..."
            style={{
              flex: 1, minWidth: 0, border: "none", outline: "none",
              background: "transparent",
              fontFamily: "var(--font-sans)", fontSize: "14px",
              color: "var(--col-fg)", padding: "8px 4px",
            }}
          />

          <button
            onClick={submit}
            aria-label="Ask"
            disabled={thinking}
            style={{
              flexShrink: 0, width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(155deg, #7C6FF0 0%, #3B5BDB 100%)",
              border: "none", display: "grid", placeItems: "center",
              cursor: thinking ? "default" : "pointer",
              boxShadow: "0 4px 12px rgba(59,91,219,0.35)",
              opacity: thinking ? 0.7 : 1,
              transition: `transform 220ms ${QUICK_EASE}, opacity 160ms var(--ease-out), box-shadow 200ms var(--ease-out)`,
            }}
            onMouseEnter={e => {
              if (thinking) return;
              e.currentTarget.style.transform = "translateY(-2px) scale(1.04)";
              e.currentTarget.style.boxShadow = withGlassShine("0 8px 18px rgba(59,91,219,0.42)");
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,91,219,0.35)";
            }}
          >
            {thinking ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="4" cy="8" r="1.4" fill="white" opacity="0.9">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0s" />
                </circle>
                <circle cx="8" cy="8" r="1.4" fill="white" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.15s" />
                </circle>
                <circle cx="12" cy="8" r="1.4" fill="white" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.3s" />
                </circle>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M7.5 12V3M7.5 3 3 7.5M7.5 3 12 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/*
         * Response expands INSIDE the same bar using the 0fr→1fr grid-row
         * trick — this animates height smoothly without measuring the DOM.
         */}
        <div style={{
          display: "grid",
          gridTemplateRows: (thinking || reply) ? "1fr" : "0fr",
          transition: "grid-template-rows 420ms cubic-bezier(0.34,1.05,0.64,1)",
        }}>
          <div style={{ overflow: "hidden" }}>
            {(thinking || reply) && (
              <div style={{
                padding: "2px 20px 18px",
                borderTop: "1px solid var(--col-hairline)",
                marginTop: "2px",
                paddingTop: "16px",
                textAlign: "left",
              }}>
                {thinking ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <PixelLoader />
                    <span
                      className="t-shimmer"
                      data-text="Let me think..."
                      style={{
                        fontFamily: "var(--font-sans)", fontSize: "clamp(14px,1.6vw,16px)",
                        fontWeight: 400, lineHeight: 1.5,
                      }}
                    >
                      Let me think...
                    </span>
                  </div>
                ) : (
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: "clamp(14px,1.6vw,16px)",
                    fontWeight: 400,
                    color: "var(--col-fg)", margin: 0, lineHeight: 1.5,
                  }}>
                    {reply!.a}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main section
   ══════════════════════════════════════════════════════════════════ */
export default function Playground() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    /* Trigger the entrance animation once the section scrolls into view */
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="playground"
      aria-label="Playground and personality"
      style={{
        padding: "clamp(24px,4vh,48px) clamp(20px,4vw,60px) clamp(80px,12vh,140px)",
        maxWidth: "1100px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{
        marginBottom: "clamp(28px,4vh,48px)", textAlign: "center",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 460ms ease-out, transform 460ms ease-out",
      }}>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"11px", letterSpacing:"0.1em",
          textTransform:"uppercase", color:"var(--col-muted)", marginBottom:"10px" }}>
          The human behind the pixels
        </p>
        <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(30px,4.5vw,48px)",
          fontWeight:400, lineHeight:1.05, letterSpacing:"-0.02em" }}>
          A little bit about{" "}
          <em style={{ fontStyle:"italic", color:"#3B5BDB" }}>me</em>
        </h2>
      </div>

      {/* No overflow-x here anymore — overflow-x:hidden on this row was
          forcing overflow-y to compute as "auto" per the CSS spec (this
          applies regardless of what overflow-y is literally set to when
          the other axis isn't "visible" — a hard CSS constraint, not a
          bug), which clipped hover-lifted cards and showed a scrollbar.
          The horizontal safety net now lives on <body> instead (see
          globals.css), a level that has no vertical hover effects to
          protect, so it can safely force overflow-x without side effects. */}
      {isMobile ? (
        /* Mobile: a plain 2-column stack instead of the desktop fan —
           squeezing 5 rotated, overlapping cards into a narrow viewport
           read as skewed/cramped rather than playful. Upright cards in a
           grid (same content/visual design, just full-width-of-cell) fix
           that. Odd count (5) — last card spans both columns rather than
           leaving a lopsided gap next to an empty cell. */
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "12px", alignItems: "start",
          position: "relative", zIndex: 1,
        }}>
          {CARDS.map((card, i) => (
            <FanCard
              key={card.label} card={card} index={i} mounted={mounted} isMobile={isMobile}
              gridSpanFull={i === CARDS.length - 1 && CARDS.length % 2 === 1}
            />
          ))}
        </div>
      ) : (
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "flex-end",
          paddingTop: "32px", position: "relative", zIndex: 1,
        }}>
          {CARDS.map((card, i) => (
            <FanCard key={card.label} card={card} index={i} mounted={mounted} isMobile={isMobile} />
          ))}
        </div>
      )}

      <QuickAsk mounted={mounted} />
    </section>
  );
}
