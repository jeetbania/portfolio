"use client";

import HeroName from "./HeroName";
import { AnnotationArrow } from "./AnnotationArrow";
import { withGlassShine } from "@/lib/hoverStyles";
import { useTheme } from "@/lib/theme";

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="hero"
      aria-label="Introduction"
      style={{
        position: "relative",
        minHeight: "88svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: "clamp(36px, 6vh, 60px)",
        paddingBottom: "clamp(16px, 2.5vh, 28px)",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      {/* Decorative shadows — stay pure black in both themes */}
      <img src="/shadow-large.svg" alt="" aria-hidden="true"
        style={{ position:"absolute", left:"-80px", top:"-40px",
          width:"clamp(340px,44vw,680px)", opacity: isDark ? 0.22 : 0.16,
          pointerEvents:"none", transition:"opacity 320ms var(--ease-out)" }} />
      <img src="/shadow-small.svg" alt="" aria-hidden="true"
        style={{ position:"absolute", right:"-60px", top:"0",
          width:"clamp(240px,34vw,500px)", opacity: isDark ? 0.22 : 0.16,
          pointerEvents:"none", transition:"opacity 320ms var(--ease-out)" }} />

      {/* Centre column */}
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column",
        alignItems:"center", textAlign:"center" }}>

        <p style={{ fontFamily:"var(--font-sans)", fontSize:"12px", letterSpacing:"0.1em",
          textTransform:"uppercase", color:"var(--col-muted)", marginBottom:"14px" }}>
          UX Design, Motion Design
        </p>

        <HeroName />

        <div style={{ marginTop:"clamp(18px,3vh,32px)" }}>
          <p style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(19px,2.7vw,27px)",
            fontWeight:400, lineHeight:1.4, color:"var(--col-fg)" }}>
            I make real experiences that<br />
            connect with{" "}
            <em style={{ fontStyle:"italic", color:"#3B5BDB" }}>real people</em>
          </p>
          {/* Arrow sits to the RIGHT of the text — the asset itself (see
              AnnotationArrow.tsx) already points back up-left toward it,
              no rotate/flip needed here. */}
          <p style={{ fontFamily:"var(--font-hand)", fontSize:"clamp(20px,2.8vw,26px)",
            color:"var(--col-muted)", marginTop:"6px" }}>
            yes, actual humans <AnnotationArrow />
          </p>
        </div>

        {/* CTAs — glass primary, ghost secondary. Colors run entirely off
            CSS variables so dark mode needs zero JS branching here. */}
        <div style={{ marginTop:"clamp(14px,2.2vh,24px)", display:"flex",
          alignItems:"center", gap:"10px" }}>

          <a
            href="/#contact"
            style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              fontFamily:"var(--font-sans)", fontSize:"14px", fontWeight:500,
              color:"var(--cta-text)",
              background:"var(--cta-bg)",
              border:"1px solid var(--cta-border)",
              borderRadius:"99px", padding:"10px 22px", textDecoration:"none",
              boxShadow:"0 1px 3px var(--cta-shadow), inset 0 1px 0 var(--cta-shine-rest)",
              backdropFilter:"blur(12px) saturate(160%)",
              WebkitBackdropFilter:"blur(12px) saturate(160%)",
              transition:`background 220ms var(--ease-out), color 220ms var(--ease-out), box-shadow 220ms var(--ease-out), border-color 220ms var(--ease-out)`,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = "var(--cta-bg-hover)";
              el.style.color = "var(--cta-text-hover)";
              el.style.borderColor = "transparent";
              el.style.boxShadow = withGlassShine("0 6px 16px var(--cta-shadow-hover)");
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = "var(--cta-bg)";
              el.style.color = "var(--cta-text)";
              el.style.borderColor = "var(--cta-border)";
              el.style.boxShadow = "0 1px 3px var(--cta-shadow), inset 0 1px 0 var(--cta-shine-rest)";
            }}
          >
            Let&apos;s Talk
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 11L11 1M11 1H4.5M11 1V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Secondary — solid page-bg fill (no border/shadow) instead of
              transparent: against the dotted background canvas, a fully
              transparent button let the dots show straight through its
              own label, making it read as barely there. Matching the
              page's own background color opaquely blocks the dots behind
              it while staying visually secondary next to the primary CTA
              purely through the lack of border/shadow/tint. */}
          <a
            href="/#work"
            style={{
              fontFamily:"var(--font-sans)", fontSize:"14px", fontWeight:600,
              color:"var(--col-muted)", textDecoration:"none",
              padding:"10px 18px", borderRadius:"99px",
              background:"var(--col-bg)",
              transition:"color 160ms var(--ease-out)",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--col-fg)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--col-muted)"; }}
          >
            View work
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div aria-hidden="true" style={{ position:"absolute", bottom:"24px", left:"50%",
        transform:"translateX(-50%)", display:"flex", flexDirection:"column",
        alignItems:"center", gap:"5px", opacity:0.25, color:"var(--col-fg)" }}>
        <span style={{ fontFamily:"var(--font-sans)", fontSize:"9px", letterSpacing:"0.12em", textTransform:"uppercase" }}>scroll</span>
        <svg width="1" height="22" viewBox="0 0 1 22">
          <line x1="0.5" y1="0" x2="0.5" y2="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"/>
        </svg>
      </div>
    </section>
  );
}
