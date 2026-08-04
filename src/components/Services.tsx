"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { withGlassShine } from "@/lib/hoverStyles";
import { useTheme } from "@/lib/theme";

/* ══════════════════════════════════════════════════════════════════
   Rocket icon — user-supplied glyph (background rect stripped so the
   gradient card shows through), same treatment as the footer logo:
   gradient card + white outline + soft drop-shadow.
   ══════════════════════════════════════════════════════════════════ */
const ROCKET_PATHS = `
<path d="M13.4502 51.7395C14.1439 52.1285 14.8447 52.5049 15.5342 52.9015C14.699 54.4027 13.8412 55.8913 13.0197 57.4036C13.7591 57.8115 14.5146 58.2087 15.2261 58.6607L12.7733 63.0349C13.4948 63.4394 14.2112 63.8412 14.923 64.2569L13.6726 66.4869L16.0399 67.8177L17.2975 65.575C18.0246 65.9695 18.7436 66.3727 19.4622 66.7823L20.6504 64.6633L21.9221 62.3955C22.6666 62.8063 23.4083 63.2222 24.1521 63.6459L26.6657 59.1632C27.3844 59.5728 28.1048 59.9734 28.8308 60.364L30.1067 58.0886L14.7213 49.4614C14.2879 50.2165 13.8661 50.9747 13.453 51.741L13.4502 51.7395Z" fill="currentColor"/>
<path d="M45.9124 50.9401L47.1431 48.7454L46.0054 48.1074L47.9372 44.6446L45.8077 43.4572C46.2095 42.7408 46.6173 42.0312 47.0014 41.3048C46.5807 41.0557 46.1558 40.8141 45.7281 40.5775L47.0346 38.2298L44.9585 37.0656L53.0111 22.6873L51.5429 21.8641C52.162 20.7423 52.79 19.6223 53.4242 18.509L51.7114 17.5485C52.127 16.8133 52.5403 16.0702 52.9447 15.3255L51.5471 14.5418L52.7962 12.3143L51.4037 11.5335L52.6357 9.33633L51.1298 8.49186C51.5456 7.75023 51.9666 7.01137 52.3709 6.2666L50.986 5.49003C51.4076 4.73826 51.8524 3.98632 52.2473 3.22299L49.9009 1.91393L48.6299 4.16886L46.8637 3.18513C46.4417 3.92 46.0233 4.66027 45.6113 5.4008L44.2466 4.63553L43.021 6.83302L41.7496 6.12008L40.4865 8.34299L38.8417 7.42071C38.4259 8.16233 38.0164 8.90434 37.5944 9.63921L36.0679 8.78986L34.1922 12.1349L32.8931 11.4064C30.101 16.2437 27.4459 21.1679 24.7018 26.0321L22.8023 24.9669C22.4089 25.6449 22.0255 26.3285 21.65 27.01L19.0893 25.5807L17.7308 27.9856L15.6169 26.8002L13.8428 29.97L12.7246 29.3563C12.3059 30.1029 11.893 30.8629 11.4592 31.6011L10.3652 30.9976L2.28513 45.4131L4.48231 46.6452L5.65638 44.5514L6.76889 45.1752L9.96433 39.4766C11.7938 40.4892 13.6287 41.4982 15.4438 42.5425L13.5137 45.9964L24.7547 52.293L33.6115 57.266C34.2515 56.1128 34.8727 54.9458 35.5505 53.8139C37.3819 54.8408 39.2444 55.842 41.0489 56.9169L37.8959 62.5398L39.0361 63.1792C38.6391 63.9049 38.2385 64.6253 37.8303 65.3414L39.9922 66.5537L48.0734 52.1422L45.9165 50.9328L45.9124 50.9401ZM33.5462 23.4407C35.3913 20.0852 37.2592 16.7422 39.1548 13.4149C42.1185 15.0304 45.0451 16.7179 47.9892 18.3687L42.3756 28.3976L33.5505 23.4391L33.5462 23.4407Z" fill="currentColor"/>
<path d="M36.994 22.4527L41.454 24.9536L44.5348 19.4593L40.0703 16.9725C39.0361 18.7932 38.008 20.6207 36.9965 22.4542L36.994 22.4527Z" fill="currentColor"/>
`.trim();

/* ══════════════════════════════════════════════════════════════════
   Service data
   ══════════════════════════════════════════════════════════════════ */
type Service = { title: string; desc: string; popular?: boolean };

const SERVICES: Service[] = [
  { title: "Website Design", desc: "Conversion-focused websites that tell your story, build trust and turn visitors into customers.", popular: true },
  { title: "Brand Identity", desc: "Visual identities that give your business a unique voice and make you unforgettable." },
  { title: "Product Design", desc: "Intuitive digital experiences that are easy to use and built for growth." },
  { title: "Design Systems", desc: "Reusable components and guidelines that keep your product consistent and scalable." },
  { title: "Motion Design",  desc: "Subtle animations and interactions that bring your brand to life." },
];

const CYCLE_MS = 3400;
const RING_R = 15;
const RING_C = 2 * Math.PI * RING_R;

/* ── Circular progress ring — fills green, restarts per active card ──
   Always runs, hover included — the cycle keeps advancing underneath a
   hovered card rather than freezing, per product decision. */
function ProgressRing({ playKey }: { playKey: number }) {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true" style={{ display: "block" }}>
      <circle cx="19" cy="19" r={RING_R} fill="none" stroke="var(--col-hairline)" strokeWidth="3" />
      <circle
        key={playKey /* remounts to restart the fill animation each cycle */}
        cx="19" cy="19" r={RING_R} fill="none"
        stroke="#37B26C" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={RING_C}
        style={{
          transform: "rotate(-90deg)", transformOrigin: "19px 19px",
          animation: `ringFill ${CYCLE_MS}ms linear forwards`,
        }}
      />
      <style>{`
        @keyframes ringFill {
          from { stroke-dashoffset: ${RING_C}; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main section
   ══════════════════════════════════════════════════════════════════ */
export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setActive(i => (i + 1) % SERVICES.length);
    setPlayKey(k => k + 1);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(advance, CYCLE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, advance]);

  function selectManually(i: number) {
    if (i === active) return;
    setActive(i);
    setPlayKey(k => k + 1);
  }

  return (
    <section
      id="services"
      aria-label="Services"
      style={{
        padding: "clamp(60px,10vh,100px) clamp(20px,5vw,60px)",
        maxWidth: "780px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(28px,4vh,40px)" }}>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"11px", letterSpacing:"0.14em",
          textTransform:"uppercase", color:"var(--col-muted)", marginBottom:"14px" }}>
          Services
        </p>
        <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(30px,4.5vw,44px)",
          fontWeight:400, lineHeight:1.12, letterSpacing:"-0.02em" }}>
          Everything you need, designed to{" "}
          <em style={{ fontStyle:"italic", color:"#3B5BDB" }}>make an impact</em>.
        </h2>
      </div>

      {/* Rocket banner — gradient card + white outline, same recipe as the footer logo.
          Fully opaque in both themes (no dot-grid bleed-through); dark mode
          gets a lighter, more vivid indigo-violet instead of a dim translucent one. */}
      <div style={{
        display: "flex", alignItems: "center", gap: "16px",
        padding: "20px 22px",
        borderRadius: "22px",
        marginBottom: "18px",
        background: isDark
          ? "linear-gradient(135deg, #454DAE 0%, #5B4FC7 100%)"
          : "linear-gradient(135deg, #E4EFFC 0%, #EDEBFE 100%)",
        border: isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.8)",
        transition: "background 320ms var(--ease-out), border-color 320ms var(--ease-out)",
      }}>
        <div style={{
          width: "clamp(46px,5.5vw,54px)", height: "clamp(46px,5.5vw,54px)", flexShrink: 0,
          borderRadius: "16px",
          background: isDark
            ? "linear-gradient(155deg, #C9D2FF 0%, #6459C9 100%)"
            : "linear-gradient(160deg, #D6E2FF 0%, #ffffff 100%)",
          outline: isDark ? "2px solid rgba(255,255,255,0.45)" : "2px solid #fff",
          boxShadow: isDark
            ? "0 4px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4)"
            : "0 3px 8px rgba(59,91,219,0.18)",
          display: "grid", placeItems: "center",
          color: isDark ? "#2A2470" : "#3B5BDB",
          transition: "background 320ms var(--ease-out), outline-color 320ms var(--ease-out)",
        }}>
          <svg width="60%" height="60%" viewBox="0 0 66 70" fill="none" dangerouslySetInnerHTML={{ __html: ROCKET_PATHS }} />
        </div>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "clamp(13.5px,1.6vw,15px)",
          lineHeight: 1.55, color: isDark ? "#EAEAFF" : "#3B5BDB", margin: 0, fontWeight: 500,
          transition: "color 320ms var(--ease-out)",
        }}>
          The right design can transform your idea into a product people love.
          Explore the services I offer to bring your vision to life.
        </p>
      </div>

      {/*
       * Opaque blocker (matches --col-bg exactly) wraps the translucent
       * wash — this is what actually hides the dot grid completely,
       * regardless of the wash's own opacity. The wash on top is purely
       * decorative shading, not the thing doing the blocking.
       */}
      <div style={{ borderRadius: "26px", background: "var(--col-bg)" }}>
        <div
          style={{
            borderRadius: "26px",
            background: "var(--surface-wash)",
            padding: "18px",
          }}
        >
        {/* Spinner label */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 8px 16px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            style={{ animation: "spin 1.4s linear infinite" }}>
            <circle cx="8" cy="8" r="6.5" stroke="var(--col-hairline)" strokeWidth="1.6" strokeDasharray="3 3" />
          </svg>
          <span style={{ fontFamily:"var(--font-sans)", fontSize:"13px", color:"var(--col-muted)" }}>
            {SERVICES.length} services available
          </span>
        </div>

        {/* List */}
        <div>
          {SERVICES.map((s, i) => {
            const isActive = i === active;
            return (
              <div key={s.title}>
                <button
                  onClick={() => selectManually(i)}
                  style={{
                    width: "100%", textAlign: "left",
                    display: "flex", alignItems: "flex-start", gap: "16px",
                    padding: isActive ? "18px 18px" : "16px 8px",
                    marginBottom: isActive ? "4px" : 0,
                    borderRadius: "18px",
                    background: isActive ? "var(--surface-card)" : "transparent",
                    border: "none",
                    boxShadow: isActive
                      ? withGlassShine("0 2px 6px rgba(var(--shadow-tint-rgb),0.05), 0 10px 24px rgba(var(--shadow-tint-rgb),0.08)")
                      : "none",
                    cursor: "pointer",
                    transition: "background 160ms var(--ease-out), box-shadow 160ms var(--ease-out), padding 160ms var(--ease-out)",
                  }}
                >
                  {/* Number / progress ring */}
                  <div style={{
                    flexShrink: 0, width: 38, height: 38, borderRadius: "50%",
                    display: "grid", placeItems: "center",
                    background: isActive ? "transparent" : "var(--col-chip-muted)",
                    fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600,
                    color: "var(--col-muted)",
                  }}>
                    {isActive ? (
                      <ProgressRing playKey={playKey} />
                    ) : (
                      i + 1
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ minWidth: 0, paddingTop: isActive ? "2px" : "1px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <h3 style={{
                        fontFamily: "var(--font-sans)", fontSize: isActive ? "16px" : "15px",
                        fontWeight: 600, color: "var(--col-fg)", margin: 0,
                        transition: "font-size 320ms var(--ease-out)",
                      }}>
                        {s.title}
                      </h3>
                      {s.popular && (
                        <span style={{
                          fontFamily: "var(--font-sans)", fontSize: "10.5px", fontWeight: 600,
                          /* Was #1F9D55 — 3.09:1 against #DFF7E8, under
                             WCAG AA's 4.5:1 at this size. #177640 clears
                             it (~5:1), same green family, just darker. */
                          color: "#177640", background: "#DFF7E8",
                          padding: "2px 9px", borderRadius: "99px",
                          border: "1px solid rgba(31,157,85,0.15)",
                          whiteSpace: "nowrap",
                        }}>
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontFamily: "var(--font-sans)", fontSize: "13.5px", lineHeight: 1.5,
                      color: "var(--col-muted)", margin: 0,
                    }}>
                      {s.desc}
                    </p>
                  </div>
                </button>

                {!isActive && i < SERVICES.length - 1 && (
                  <div style={{ height: 1, background: "var(--col-hairline)", margin: "0 8px" }} />
                )}
              </div>
            );
          })}
        </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
