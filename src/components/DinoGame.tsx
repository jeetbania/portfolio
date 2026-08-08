"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { toDataUri, recolorFill } from "@/lib/svgUtils";
import { withGlassShine, QUICK_EASE } from "@/lib/hoverStyles";

/**
 * "Jeet Run" — the dino-runner easter egg, originally built into
 * Footer.tsx and now pulled out into its own file so the 404 page
 * (src/app/not-found.tsx) can use it as its centerpiece too, not just
 * the footer. Only real change from the footer version: the spacebar
 * jump used to gate on `document.getElementById("contact")` being in
 * view (the footer's own id) — that only made sense when this game only
 * ever lived inside the footer. It now checks the game's own canvas
 * bounding rect instead, so it works correctly wherever it's mounted.
 */

const CLAWD_PATH =
  "M9 12H39V22H44V26H39V32H37V36H34V32H32V36H29V32H19V36H16V32H14V36H11V32H9V26H4V22H9V12ZM14 16V22H16V16H14ZM32 16V22H34V16H32Z";

const PLAYER_SVG = `
<svg width="105" height="110" viewBox="0 0 105 110" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#pf0)">
<g clip-path="url(#pc0)">
<rect x="14.9" y="10.9" width="75" height="80" rx="12" fill="white"/>
<g filter="url(#pf1)">
<path d="M81.5731 57.9375C91.3087 71.8859 87.4 79.1306 81.5731 83.3999C66.9 90.3999 51.2546 88.3999 45.9 88.3999C41.519 88.3999 30.461 88.934 23.6461 81.6692C16.8312 74.4044 18.2916 32.2684 22.1858 20.1604C25.3012 10.4739 53.502 19.5146 63.0753 25.4879C66.645 30.4925 71.8375 43.989 81.5731 57.9375Z" fill="url(#pg0)"/>
</g>
<rect x="52.9" y="24.9" width="11" height="18" rx="5.5" fill="#15388E"/>
<rect x="67.9" y="24.9" width="10" height="18" rx="5" fill="#15388E"/>
</g>
<rect x="16.9" y="12.9" width="71" height="76" rx="10" stroke="#EAE7FD" stroke-width="4"/>
</g>
<defs>
<filter id="pf0" x="0" y="0" width="104.8" height="109.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/><feGaussianBlur stdDeviation="7.45"/><feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.435 0 0 0 0 0.173 0 0 0 0 0.569 0 0 0 0.11 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="e1"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/><feGaussianBlur stdDeviation="2.1"/><feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.435 0 0 0 0 0.173 0 0 0 0 0.569 0 0 0 0.11 0"/>
<feBlend mode="normal" in2="e1" result="e2"/>
<feBlend mode="normal" in="SourceGraphic" in2="e2" result="shape"/>
</filter>
<filter id="pf1" x="14.9" y="11.9" width="76.6" height="80.76" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="2" result="e1"/>
</filter>
<linearGradient id="pg0" x1="67.4" y1="33.4" x2="24.4" y2="87.9" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/><stop offset="0.423" stop-color="#EAE8FD"/><stop offset="1" stop-color="white"/>
</linearGradient>
<clipPath id="pc0"><rect x="14.9" y="10.9" width="75" height="80" rx="12" fill="white"/></clipPath>
</defs>
</svg>`.trim();

/* Header logo — shadow applied via CSS filter on the wrapping element,
   matching the two-layer indigo shadow used throughout the card system. */
const LOGO_SVG = `
<svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2.4375" y="2.4375" width="99.125" height="99.125" rx="23.5625" fill="url(#lg0)"/>
<rect x="2.4375" y="2.4375" width="99.125" height="99.125" rx="23.5625" stroke="#F3F7FF" stroke-width="4.875"/>
<g clip-path="url(#lc0)">
<path d="M67.7083 32.5V40.625H73.125V67.7083H67.7083V73.125H37.9167V67.7083H32.5V40.625H37.9167V32.5H67.7083ZM48.75 40.625H43.3333V46.0417H37.9167V54.1667H43.3333V67.7083H62.2917V54.1667H67.7083V46.0417H62.2917V51.4583H56.875V46.0417H62.2917V40.625H56.875V46.0417H48.75V40.625ZM51.4583 59.5833V65H46.0417V59.5833H51.4583ZM59.5833 59.5833V65H54.1667V59.5833H59.5833ZM48.75 46.0417V51.4583H43.3333V46.0417H48.75Z" fill="#15388E"/>
</g>
<defs>
<linearGradient id="lg0" x1="52" y1="3.25" x2="52" y2="96.6875" gradientUnits="userSpaceOnUse">
<stop stop-color="#D6E2FF"/><stop offset="1" stop-color="white"/>
</linearGradient>
<clipPath id="lc0"><rect width="40.625" height="40.625" fill="white" transform="translate(32.5 32.5)"/></clipPath>
</defs>
</svg>`.trim();

/* A standalone copy of the mail glyph (same markup as Footer.tsx's
   SOCIAL_ICONS.mail) — only needed here for the dead-state "Contact me
   for help" link, not worth a shared icon registry for one glyph. */
const MAIL_ICON = `<svg viewBox="0 0 63 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M56.4446 8.75635V12.3117H52.8319V15.867H56.4446V19.4224V22.9777V26.5331V30.0884V33.6438V37.1991H52.8319V40.7545H49.2766H45.7213H42.1659H38.6106H35.0552H31.4999H27.9445H24.3892H20.8338H17.2785H13.7231H10.1104V37.1991H6.5551V33.6438V30.0884V26.5331V22.9777V19.4224V15.867H10.1104V12.3117H6.5551V8.75635H2.99976V12.3117V15.867V19.4224V22.9777V26.5331V30.0884V33.6438V37.1991V40.7545H6.5551V44.3098H10.1104H13.7231H17.2785H20.8338H24.3892H27.9445H31.4999H35.0552H38.6106H42.1659H45.7213H49.2766H52.8319H56.4446V40.7545H60V37.1991V33.6438V30.0884V26.5331V22.9777V19.4224V15.867V12.3117V8.75635H56.4446Z" fill="white"/><path d="M45.7216 26.5332H42.1663V30.0885H45.7216V26.5332Z" fill="white"/><path d="M20.8339 26.5332H17.2786V30.0885H20.8339V26.5332Z" fill="white"/><path d="M31.4999 30.0885H35.0553V26.5332H31.4999H27.9446V30.0885H31.4999Z" fill="white"/><path d="M24.3893 26.5334H27.9447V22.978H24.3893H20.834V26.5334H24.3893Z" fill="white"/><path d="M42.1661 26.5334V22.978H38.6108H35.0554V26.5334H38.6108H42.1661Z" fill="white"/><path d="M17.2787 22.9777H20.8341V19.4224H17.2787H13.7234V22.9777H17.2787Z" fill="white"/><path d="M49.277 22.9777V19.4224H45.7216H42.1663V22.9777H45.7216H49.277Z" fill="white"/><path d="M17.2787 30.0884H13.7234V33.6437H17.2787V30.0884Z" fill="white"/><path d="M49.2768 30.0884H45.7214V33.6437H49.2768V30.0884Z" fill="white"/><path d="M13.6659 33.644H10.1106V37.1994H13.6659V33.644Z" fill="white"/><path d="M52.832 33.644H49.2766V37.1994H52.832V33.644Z" fill="white"/><path d="M13.6659 15.8667H10.1106V19.422H13.6659V15.8667Z" fill="white"/><path d="M52.832 15.8667H49.2766V19.422H52.832V15.8667Z" fill="white"/><path d="M13.7232 8.75652H17.2786H20.8339H24.3893H27.9446H31.4999H35.0553H38.6106H42.166H45.7213H49.2767H52.832H56.4447V5.20117H52.832H49.2767H45.7213H42.166H38.6106H35.0553H31.4999H27.9446H24.3893H20.8339H17.2786H13.7232H10.1105H6.55518V8.75652H10.1105H13.7232Z" fill="white"/></svg>`;

/* Reset icon — normalised to fill its wrapper */
const RESET_ICON = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block"><path d="M18.6667 3.5V2.41667H17.5833V1.33333H16.5V0.25H5.66667V1.33333H4.58333V2.41667H3.5V3.5H2.41667V2.41667V1.33333H0.25V7.8333H6.75V5.66667H4.58333V4.58333H5.66667V3.5H6.75V2.41667H14.3333V3.5H15.4167V4.58333H16.5V5.66667H17.5833V14.3333H16.5V15.4167H15.4167V16.5H14.3333V17.5833H6.75V16.5H5.66667V15.4167H4.58333V14.3333H3.5V13.25H1.33333V16.5H2.41667V17.5833H3.5V18.6667H4.58333V19.75H16.5V18.6667H17.5833V17.5833H18.6667V16.5H19.75V3.5H18.6667Z" fill="#BDBDBD"/></svg>`;

/* Obstacle cards — same "gradient card + white outline + centred glyph" language as the logo */
function obstacleSvg(light: string, dark: string, shadowRgb: string) {
  return `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="of" x="-60%" y="-50%" width="220%" height="220%">
<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="rgb(${shadowRgb})" flood-opacity="0.2"/>
<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgb(${shadowRgb})" flood-opacity="0.15"/>
</filter>
<linearGradient id="og" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
<stop stop-color="${light}"/><stop offset="1" stop-color="white"/>
</linearGradient>
</defs>
<g filter="url(#of)">
<rect x="5" y="5" width="54" height="54" rx="14" fill="url(#og)"/>
<rect x="5" y="5" width="54" height="54" rx="14" fill="none" stroke="white" stroke-width="3"/>
<g transform="translate(10.5,10.5)">
<path d="${CLAWD_PATH}" fill="${dark}"/>
</g>
</g>
</svg>`.trim();
}

const OBSTACLE_DEFS = [
  { id: "bug",      light: "#FFE1E1", dark: "#C23B3B", shadow: "194,59,59"   },
  { id: "deadline", light: "#FFF1CC", dark: "#B8790F", shadow: "184,121,15" },
  { id: "scope",    light: "#EDE7FF", dark: "#6C4FD1", shadow: "108,79,209" },
  { id: "email",    light: "#DCEBFF", dark: "#2563C7", shadow: "37,99,199"  },
  { id: "meeting",  light: "#DFF7E8", dark: "#1F9D55", shadow: "31,157,85"  },
];

type GameStatus = "idle" | "running" | "dead";

const CARD_BG = "#F8F9FD";
const SHADOW_STRONG = "0 3px 11px rgba(49,54,138,0.20)";
const SHADOW_SOFT   = "0 3px 11px rgba(49,54,138,0.11)";

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score,  setScore]  = useState(0);
  const [best,   setBest]   = useState(0);
  const [status, setStatus] = useState<GameStatus>("idle");

  const obstacleUris = useMemo(
    () => OBSTACLE_DEFS.map(d => toDataUri(obstacleSvg(d.light, d.dark, d.shadow))),
    []
  );
  const playerUri = useMemo(() => toDataUri(PLAYER_SVG), []);

  useEffect(() => {
    setBest(parseInt(localStorage.getItem("jeetRunBest") || "0", 10));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const playerImg = new Image();
    playerImg.src = playerUri;
    const obstacleImgs = obstacleUris.map(uri => {
      const img = new Image();
      img.src = uri;
      return img;
    });

    const SPEED_START = 5.5;
    const SPEED_MAX   = 11;
    const GRAVITY     = 0.52;
    const JUMP_VY     = -10.5;
    const PLAYER_W = 44, PLAYER_H = 46;

    const state = {
      status: "idle" as GameStatus,
      score: 0,
      speed: SPEED_START,
      groundY: 0,
      dino: { x:44, y:0, vy:0, onGround:true },
      obstacles: [] as { x:number; w:number; h:number; typeIdx:number; bob:number }[],
      spawnTimer: 80,
      frame: 0,
    };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio||1,2);
      const w = canvas!.clientWidth||700, h = canvas!.clientHeight||150;
      canvas!.width=w*dpr; canvas!.height=h*dpr;
      ctx!.setTransform(dpr,0,0,dpr,0,0);
      state.groundY = h - 32;
      state.dino.y  = state.groundY - PLAYER_H;
    }
    resize();
    window.addEventListener("resize", resize, {passive:true});

    function reset() {
      state.status="running"; state.score=0; state.speed=SPEED_START;
      state.obstacles=[]; state.spawnTimer=80;
      state.dino.vy=0; state.dino.onGround=true;
      state.dino.y = state.groundY - PLAYER_H;
      setStatus("running");
    }

    function jump() {
      if (state.status==="dead") { reset(); return; }
      if (state.status==="idle") { reset(); return; }
      if (state.dino.onGround) { state.dino.vy=JUMP_VY; state.dino.onGround=false; }
    }

    function spawn() {
      const typeIdx = Math.floor(Math.random()*OBSTACLE_DEFS.length);
      const sc = 0.8 + Math.random()*0.28;
      const size = Math.round(38*sc);
      state.obstacles.push({
        x: canvas!.clientWidth+24, w:size, h:size,
        typeIdx, bob: Math.random()*Math.PI*2,
      });
      state.spawnTimer = 58 + Math.random()*65 - Math.min(state.speed*1.8,24);
    }

    function collides(ax:number,ay:number,aw:number,ah:number,bx:number,by:number,bw:number,bh:number) {
      return ax < bx+bw-8 && ax+aw-8 > bx && ay < by+bh-6 && ay+ah-6 > by;
    }

    function drawGround(cw: number) {
      const groundY = state.groundY;
      ctx!.strokeStyle = "rgba(49,54,138,0.08)";
      ctx!.lineWidth = 1;
      ctx!.beginPath(); ctx!.moveTo(0, groundY+0.5); ctx!.lineTo(cw, groundY+0.5); ctx!.stroke();
      const spacing = 28;
      const off = (state.frame*state.speed*0.5) % spacing;
      ctx!.fillStyle = "rgba(49,54,138,0.14)";
      for (let x = -off; x < cw; x += spacing) {
        ctx!.beginPath(); ctx!.arc(x, groundY+8, 1.5, 0, Math.PI*2); ctx!.fill();
      }
    }

    function draw() {
      const cw=canvas!.clientWidth, ch=canvas!.clientHeight;
      ctx!.clearRect(0,0,cw,ch);
      drawGround(cw);

      /* Player, sitting ON the ground line, with subtle squash/stretch */
      const d = state.dino;
      const stretch = Math.max(-0.14, Math.min(0.14, d.vy/60));
      ctx!.save();
      const cx = d.x + PLAYER_W/2, cy = d.y + PLAYER_H;
      ctx!.translate(cx, cy);
      ctx!.scale(1 - stretch*0.5, 1 + stretch*0.5);
      ctx!.translate(-cx, -cy);
      if (playerImg.complete && playerImg.naturalWidth > 0) {
        ctx!.drawImage(playerImg, d.x, d.y, PLAYER_W, PLAYER_H);
      } else {
        ctx!.fillStyle = "#EAE7FD";
        ctx!.beginPath(); ctx!.roundRect(d.x, d.y, PLAYER_W, PLAYER_H, 10); ctx!.fill();
      }
      ctx!.restore();

      /* Obstacles — base sits exactly on the ground line like the player */
      for (const o of state.obstacles) {
        const bob = Math.sin(state.frame*0.12 + o.bob) * 1.5;
        const oy = state.groundY - o.h + bob;
        const img = obstacleImgs[o.typeIdx];
        if (img.complete && img.naturalWidth > 0) {
          ctx!.drawImage(img, o.x, oy, o.w, o.h);
        } else {
          ctx!.fillStyle = OBSTACLE_DEFS[o.typeIdx].light;
          ctx!.beginPath(); ctx!.roundRect(o.x, oy, o.w, o.h, 12); ctx!.fill();
        }
      }

      ctx!.textAlign="center";
      /* Anchored to the player's own top edge (d.y), not canvas-center
         (ch/2) — canvas height is responsive (clamp(165px,18vw,190px)),
         and at the smaller end ch/2 sat almost exactly where the player
         sprite's head/speech-bubble icon is, overlapping it. Tying the
         text to d.y keeps a constant clearance above the character
         regardless of how tall the canvas actually is. */
      if (state.status==="idle") {
        ctx!.fillStyle="rgba(49,54,138,0.32)";
        ctx!.font="600 13px 'Instrument Sans',sans-serif";
        ctx!.fillText("TAP OR PRESS SPACE TO START", cw/2, d.y-14);
      }
      if (state.status==="dead") {
        ctx!.fillStyle="rgba(20,20,30,0.78)";
        ctx!.font="700 16px 'Instrument Sans',sans-serif";
        ctx!.fillText("GAME OVER", cw/2, d.y-32);
        ctx!.fillStyle="rgba(49,54,138,0.4)";
        ctx!.font="500 12px 'Instrument Sans',sans-serif";
        ctx!.fillText("↻  Tap or Space to restart", cw/2, d.y-14);
      }
    }

    let raf = 0;
    function tick() {
      state.frame++;
      if (state.status==="running") {
        state.dino.vy += GRAVITY;
        state.dino.y  += state.dino.vy;
        if (state.dino.y >= state.groundY-PLAYER_H) {
          state.dino.y = state.groundY-PLAYER_H;
          state.dino.vy = 0; state.dino.onGround = true;
        }
        state.spawnTimer--;
        if (state.spawnTimer<=0) spawn();
        state.obstacles.forEach(o => { o.x -= state.speed; });
        state.obstacles = state.obstacles.filter(o => o.x+o.w > -40);

        for (const o of state.obstacles) {
          const oy = state.groundY - o.h;
          if (collides(state.dino.x, state.dino.y, PLAYER_W, PLAYER_H, o.x, oy, o.w, o.h)) {
            state.status="dead";
            const cur = parseInt(localStorage.getItem("jeetRunBest")||"0",10);
            if (state.score > cur) {
              localStorage.setItem("jeetRunBest", String(state.score));
              setBest(state.score);
            }
            setStatus("dead");
            setScore(state.score);
            break;
          }
        }
        state.score++;
        if (state.score % 200 === 0) state.speed = Math.min(state.speed+0.3, SPEED_MAX);
        setScore(state.score);
      }
      draw();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    canvas.addEventListener("pointerdown", e => { e.preventDefault(); jump(); });
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      /* Never hijack Space while the person is typing anywhere on the page —
         this was swallowing spaces inside the Quick Ask input. */
      const active = document.activeElement as HTMLElement | null;
      const tag = active?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || active?.isContentEditable) return;
      /* Only jump if THIS game's own canvas is actually in view — checked
         against the canvas itself (not a page-specific element id) so this
         component works correctly no matter which page it's mounted on. */
      const r = canvas!.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { e.preventDefault(); jump(); }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("keydown", onKey);
    };
  }, [playerUri, obstacleUris]);

  const fmt = (n:number) => String(n).padStart(5,"0");

  function resetBest() {
    if (!confirm("Reset your best score?")) return;
    localStorage.setItem("jeetRunBest", "0");
    setBest(0);
  }

  return (
    /* Outer card — the biggest nested box: pale bg, thick white outline,
       deep shadow. Theme-independent by design (same "sticker" reasoning
       as Folder.tsx/Playground.tsx fan cards — see CLAUDE.md) so it reads
       the same whether it's sitting on the black footer or a light/dark
       page background, which is exactly why this could be pulled out of
       the footer and dropped onto the 404 page unchanged. */
    <div style={{
      width: "min(880px,100%)", margin: "0 auto",
      borderRadius: "clamp(28px,4vw,44px)",
      background: CARD_BG,
      outline: "6px solid #fff",
      outlineOffset: "0px",
      boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      padding: "clamp(18px,2.4vw,22px)",
    }}>
      {/* Header row — no extra side padding, inherits the outer card's uniform padding */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        gap:"16px", flexWrap:"wrap", padding:"0 0 16px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          {/* Logo — shadow applied here via CSS filter (asset itself has none) */}
          <div
            style={{
              width:"clamp(34px,3.6vw,44px)", height:"clamp(34px,3.6vw,44px)", flexShrink:0,
              filter: "drop-shadow(0 3px 8px rgba(49,54,138,0.22)) drop-shadow(0 1px 2px rgba(49,54,138,0.15))",
            }}
            dangerouslySetInnerHTML={{
              __html: LOGO_SVG.replace(
                '<svg width="104" height="104"',
                '<svg width="100%" height="100%" style="display:block"'
              ),
            }}
          />
          <div style={{ textAlign:"left" }}>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"clamp(17px,2vw,21px)", fontWeight:700,
              color:"#000", margin:0, lineHeight:1.2, textAlign:"left" }}>
              Jeet Run
            </p>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"clamp(13px,1.6vw,16px)", fontWeight:400,
              color:"#6E6E6E", margin:"2px 0 0", lineHeight:1.3, display:"flex", alignItems:"center", gap:"4px",
              textAlign:"left" }}>
              Dodge client chaos <span aria-hidden="true">⚡️</span>
            </p>
          </div>
        </div>

        <div className="jeet-run-stats-row" style={{ display:"flex", alignItems:"stretch", gap:"8px" }}>
          <div style={{ display:"flex", alignItems:"stretch", gap:"8px" }}>
            {/* Score pill — SAME bg as the outer card, white outline, soft shadow */}
            <div style={{
              background:CARD_BG, borderRadius:"13px",
              outline:"1px solid #fff",
              boxShadow: SHADOW_SOFT,
              padding:"7px 18px", textAlign:"left", minWidth:78,
            }}>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"13px", fontWeight:700,
                color:"#6E6E6E", margin:"0 0 1px" }}>
                SCORE
              </p>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"clamp(18px,2vw,22px)", fontWeight:600,
                color:"#3465CC", margin:0, fontVariantNumeric:"tabular-nums" }}>
                {fmt(score)}
              </p>
            </div>

            {/* Best pill */}
            <div style={{
              background:CARD_BG, borderRadius:"13px",
              outline:"1px solid #fff",
              boxShadow: SHADOW_SOFT,
              padding:"7px 18px", textAlign:"left", minWidth:78,
            }}>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"13px", fontWeight:700,
                color:"#6E6E6E", margin:"0 0 1px", textAlign:"center" }}>
                BEST
              </p>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"clamp(18px,2vw,22px)", fontWeight:600,
                color:"#2C765D", margin:0, fontVariantNumeric:"tabular-nums" }}>
                {fmt(best)}
              </p>
            </div>
          </div>

          <button
            onClick={resetBest}
            aria-label="Reset best score"
            title="Reset best score"
            style={{
              width:52, borderRadius:"13px",
              background:CARD_BG, outline:"1px solid #fff",
              boxShadow: SHADOW_SOFT,
              border:"none", display:"grid", placeItems:"center",
              cursor:"pointer", flexShrink:0,
              transition:`box-shadow 200ms var(--ease-out), transform 220ms ${QUICK_EASE}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = withGlassShine(SHADOW_STRONG);
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = SHADOW_SOFT;
            }}
          >
            <div style={{ width: 18, height: 18 }} dangerouslySetInnerHTML={{ __html: RESET_ICON }} />
          </button>
        </div>
      </div>

      {/* Game viewport — same bg, thicker white outline, stronger shadow */}
      <canvas
        ref={canvasRef}
        style={{
          display:"block", width:"100%", height:"clamp(165px,18vw,190px)",
          cursor:"pointer", background:CARD_BG,
          borderRadius:"clamp(20px,3vw,34px)",
          outline:"4px solid #fff",
          boxShadow: SHADOW_STRONG,
        }}
      />

      <div style={{
        padding:"16px 0 0",
        fontFamily:"var(--font-sans)", fontSize:"13px",
        color:"rgba(49,54,138,0.75)", textAlign:"center",
        display:"flex", alignItems:"center", justifyContent:"center", gap:"6px",
      }}>
        {status !== "dead" ? (
          <span>↑ Space / tap to start · dodge client chaos</span>
        ) : (
          <a href="mailto:jeetbania14@gmail.com"
            style={{
              display:"inline-flex", alignItems:"center", gap:"6px",
              color:"#3465CC", textDecoration:"none",
            }}>
            <span
              style={{ width:13, height:10, flexShrink:0 }}
              dangerouslySetInnerHTML={{ __html: recolorFill(MAIL_ICON, "#3465CC") }}
            />
            Contact me for help.
          </a>
        )}
      </div>
    </div>
  );
}
