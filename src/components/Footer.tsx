"use client";

import { useEffect, useRef, useState } from "react";
import { celebrateCopy } from "@/lib/celebrateCopy";
import { withGlassShine, QUICK_EASE } from "@/lib/hoverStyles";
import { recolorFill } from "@/lib/svgUtils";
import DinoGame from "./DinoGame";

/* Social icons — pixel-glyph SVGs, recoloured white for the dark footer.
   (The mail glyph used to double as DinoGame's "Contact me" link icon —
   DinoGame.tsx now carries its own copy since it moved to its own file.) */
const SOCIAL_ICONS: Record<string, string> = {
  mail: `<svg viewBox="0 0 63 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M56.4446 8.75635V12.3117H52.8319V15.867H56.4446V19.4224V22.9777V26.5331V30.0884V33.6438V37.1991H52.8319V40.7545H49.2766H45.7213H42.1659H38.6106H35.0552H31.4999H27.9445H24.3892H20.8338H17.2785H13.7231H10.1104V37.1991H6.5551V33.6438V30.0884V26.5331V22.9777V19.4224V15.867H10.1104V12.3117H6.5551V8.75635H2.99976V12.3117V15.867V19.4224V22.9777V26.5331V30.0884V33.6438V37.1991V40.7545H6.5551V44.3098H10.1104H13.7231H17.2785H20.8338H24.3892H27.9445H31.4999H35.0552H38.6106H42.1659H45.7213H49.2766H52.8319H56.4446V40.7545H60V37.1991V33.6438V30.0884V26.5331V22.9777V19.4224V15.867V12.3117V8.75635H56.4446Z" fill="white"/><path d="M45.7216 26.5332H42.1663V30.0885H45.7216V26.5332Z" fill="white"/><path d="M20.8339 26.5332H17.2786V30.0885H20.8339V26.5332Z" fill="white"/><path d="M31.4999 30.0885H35.0553V26.5332H31.4999H27.9446V30.0885H31.4999Z" fill="white"/><path d="M24.3893 26.5334H27.9447V22.978H24.3893H20.834V26.5334H24.3893Z" fill="white"/><path d="M42.1661 26.5334V22.978H38.6108H35.0554V26.5334H38.6108H42.1661Z" fill="white"/><path d="M17.2787 22.9777H20.8341V19.4224H17.2787H13.7234V22.9777H17.2787Z" fill="white"/><path d="M49.277 22.9777V19.4224H45.7216H42.1663V22.9777H45.7216H49.277Z" fill="white"/><path d="M17.2787 30.0884H13.7234V33.6437H17.2787V30.0884Z" fill="white"/><path d="M49.2768 30.0884H45.7214V33.6437H49.2768V30.0884Z" fill="white"/><path d="M13.6659 33.644H10.1106V37.1994H13.6659V33.644Z" fill="white"/><path d="M52.832 33.644H49.2766V37.1994H52.832V33.644Z" fill="white"/><path d="M13.6659 15.8667H10.1106V19.422H13.6659V15.8667Z" fill="white"/><path d="M52.832 15.8667H49.2766V19.422H52.832V15.8667Z" fill="white"/><path d="M13.7232 8.75652H17.2786H20.8339H24.3893H27.9446H31.4999H35.0553H38.6106H42.166H45.7213H49.2767H52.832H56.4447V5.20117H52.832H49.2767H45.7213H42.166H38.6106H35.0553H31.4999H27.9446H24.3893H20.8339H17.2786H13.7232H10.1105H6.55518V8.75652H10.1105H13.7232Z" fill="white"/></svg>`,
  linkedin: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 4V2H4V4H2V44H4V46H44V44H46V4H44ZM26 24V40H20V18H26V20H28V18H36V20H38V40H32V24H26ZM8 16V10H14V16H8ZM14 18V40H8V18H14Z" fill="white"/></svg>`,
  x: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M31 20V18H33V16H35V14H37V12H39V10H41V8H43V6H45V4H39V6H37V8H35V10H33V12H31V14H29V16H25V14H23V12H21V8H19V6H17V4H3V6H5V8H7V10H9V14H11V16H13V20H15V22H17V26H19V28H17V30H15V32H13V34H11V36H9V38H7V40H5V42H3V44H9V42H11V40H13V38H15V36H17V34H19V32H23V34H25V36H27V40H29V42H31V44H45V42H43V40H41V38H39V34H37V32H35V28H33V26H31V22H29V20H31ZM31 28V30H33V34H35V36H37V40H31V36H29V34H27V32H25V28H23V26H21V24H19V20H17V18H15V14H13V12H11V8H17V10H19V14H21V16H23V20H25V22H27V24H29V28H31Z" fill="white"/></svg>`,
  instagram: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34 18V16H32V14H30V12H18V14H16V16H14V18H12V30H14V32H16V34H18V36H30V34H32V32H34V30H36V18H34ZM32 28H30V30H28V32H20V30H18V28H16V20H18V18H20V16H28V18H30V20H32V28Z" fill="white"/><path d="M44 10V6H42V4H38V2H10V4H6V6H4V10H2V38H4V42H6V44H10V46H38V44H42V42H44V38H46V10H44ZM42 38H40V40H38V42H10V40H8V38H6V10H8V8H10V6H38V8H40V10H42V38Z" fill="white"/><path d="M34 10H38V14H34V10Z" fill="white"/></svg>`,
  doc: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3h7l4 4v14H7V3Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v4h4" stroke="white" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.5 12.5h5M9.5 15.5h5M9.5 9.5h2" stroke="white" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

/* ══════════════════════════════════════════════════════════════════
   Footer dot backdrop — white dots on the dark footer background
   ══════════════════════════════════════════════════════════════════ */
function FooterDots() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const SPACING = 24, R = 0.8;
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    for (let y = SPACING / 2; y < h; y += SPACING)
      for (let x = SPACING / 2; x < w; x += SPACING) {
        ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
      }
  }, []);
  return (
    <canvas ref={ref} aria-hidden="true"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}/>
  );
}

/* Copy email pill — matches the reference screenshot: pill shape, light bg, copy icon */
function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("jeetbania14@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* fallback — the label still shows the address */ }

    // Slight scale up/back-down on the button itself
    setPulsing(true);
    setTimeout(() => setPulsing(false), 260);

    // Particle burst — originates from the button's own center
    if (btnRef.current) celebrateCopy(btnRef.current);
  };

  return (
    <button
      ref={btnRef}
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:"relative",
        display:"inline-flex", alignItems:"center", gap:"8px",
        padding:"11px 20px",
        borderRadius:"99px",
        background: hovered ? "#2a2a2a" : "#1e1e1e",
        border:"1px solid rgba(255,255,255,0.14)",
        color:"rgba(255,255,255,0.85)",
        fontFamily:"var(--font-sans)", fontSize:"15px", fontWeight:500,
        cursor:"pointer",
        letterSpacing:"-0.01em",
        boxShadow:"0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        transition:`background 180ms var(--ease-out), transform 220ms ${QUICK_EASE}`,
        transform: pulsing ? "translateY(-2px) scale(1.06)" : hovered ? "translateY(-2px)" : "none",
      }}
    >
      {copied ? "Copied!" : "Copy email"}
      {/* Copy icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="8" y="8" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Social icon button — dark gray glyph by default; on hover the box
   goes solid white with a black glyph and the glass-shine highlight.
   ══════════════════════════════════════════════════════════════════ */
function SocialIcon({
  icon, href, label, wide,
}: { icon: string; href: string; label: string; wide?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: wide ? "auto" : 44, height: 44, flexShrink: 0,
        padding: wide ? "0 18px" : undefined,
        borderRadius: "99px",
        background: hovered ? "#2a2a2a" : "#1e1e1e",
        border: hovered ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.14)",
        display: "grid", placeItems: "center",
        /* Ambient shadow at rest is mostly decorative here — the footer's
           own #0a0a0a background is too close to black for it to read as
           real depth. The inset top highlight is what actually does the
           work (same "glass bevel" language as --glass-bevel elsewhere,
           just hardcoded since the footer opts out of theme tokens
           entirely — see the tooltip-color comment above). */
        boxShadow: hovered
          ? "0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.14)"
          : "0 2px 6px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: `background 200ms var(--ease-out), border-color 200ms var(--ease-out), box-shadow 200ms var(--ease-out), transform 220ms ${QUICK_EASE}`,
      }}
    >
      <div
        style={{ width: wide ? 20 : 16, height: wide ? 15 : 16 }}
        dangerouslySetInnerHTML={{
          __html: recolorFill(
            icon.replace("<svg ", '<svg width="100%" height="100%" style="display:block" '),
            hovered ? "#ffffff" : "#8f8f99"
          ),
        }}
      />
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main Footer — dark background, light game card
   ══════════════════════════════════════════════════════════════════ */
export default function Footer() {
  return (
    <footer
      id="contact"
      aria-label="Contact and footer"
      style={{
        position:"relative", zIndex:1,
        background:"#0a0a0a", color:"#fff",
        overflow:"hidden",
        minHeight:"88svh",
        display:"flex", flexDirection:"column",
      }}
    >
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }}>
        <FooterDots />
      </div>

      <div style={{
        position:"relative", zIndex:2, flex:1,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        textAlign:"center",
        padding:"clamp(72px,11vh,110px) clamp(20px,5vw,60px) clamp(28px,4vh,48px)",
      }}>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"16px", fontWeight:500,
          /* Was .4 — 3.77:1 against #0a0a0a, under WCAG AA's 4.5:1 for
             text this size. .5 clears it (~5.3:1) while staying clearly
             secondary to the "Work with me." headline below it. */
          color:"rgba(255,255,255,0.5)", marginBottom:"20px" }}>
          Still here?
        </p>

        <h2 style={{
          fontFamily:"var(--font-serif)", fontStyle:"normal",
          fontSize:"clamp(48px,10vw,110px)", fontWeight:400,
          lineHeight:0.95, letterSpacing:"-0.03em", color:"#fff", margin:"0 0 40px",
        }}>
          Work with me.
        </h2>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", width:"100%", maxWidth:"520px", marginBottom:"clamp(24px,4vh,36px)",
          /* Footer stays visually dark regardless of the site theme, so its
              tooltips need their own fixed light-on-dark colors rather than
              the theme-linked --tt-bg/--tt-fg (which would go near-black on
              near-black in light mode). */
          "--tt-bg": "#f0f0f0", "--tt-fg": "#1a1a1a" } as React.CSSProperties}>
          {/* Row 1 — copy email, on its own line and centered */}
          <div style={{ display:"flex", justifyContent:"center" }}>
            <CopyEmailButton />
          </div>
          {/* Row 2 — every social icon together, centered as a group */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", flexWrap:"wrap" }}>
            <SocialIcon icon={SOCIAL_ICONS.doc}      href="https://drive.google.com/file/d/1qRbyp_2e90zz7zLxOyyCzbZGaBslcn3w/view?usp=sharing" label="CV / Resume" />
            <SocialIcon icon={SOCIAL_ICONS.linkedin} href="https://www.linkedin.com/in/jeetbania/"    label="LinkedIn" />
            <SocialIcon icon={SOCIAL_ICONS.x}        href="https://x.com/figmajeet"                   label="X" />
            <SocialIcon icon={SOCIAL_ICONS.instagram} href="https://instagram.com/jeetbania"           label="Instagram" />
          </div>
        </div>

        <DinoGame />

        <div style={{
          width:"100%", maxWidth:"920px", display:"flex",
          justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:"8px",
          fontFamily:"var(--font-sans)", fontSize:"11px", fontWeight:500,
          /* Was .24 — 2.06:1 against #0a0a0a, a hard WCAG AA fail (needs
             4.5:1 at this size). .5 clears it (~5.3:1). */
          color:"rgba(255,255,255,0.5)", marginTop:"clamp(24px,4vh,36px)",
        }}>
          <span>© 2026 Jeet Bania · Definitely not my first draft.</span>
          <span>Built with love, caffeine, and too many Figma frames.</span>
        </div>
      </div>
    </footer>
  );
}
