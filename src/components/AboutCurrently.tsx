"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Tooltip from "./Tooltip";

/* ── Tool icon pills ─────────────────────────────────────────────── */
const TOOLS = [
  { src: "/logo-figma.png",  alt: "Figma" },
  { src: "/logo-paper.png",  alt: "Paper.design" },
  { src: "/logo-claude.png", alt: "Claude" },
  { src: "/logo-ae.png",     alt: "After Effects" },
];

/* ── Marquee chip data — two tracks, staggered for variety ─────── */
const TRACK_A = [
  "Product Design","Motion Design","Design Systems","AI Workflows",
  "Frontend Experiments","Food & Coffee","Travelling","Reading",
  "Watching Movies","Tweeting","Photography","Typography",
];
const TRACK_B = [
  "Interaction Design","Micro-animations","Design Tokens","Prototyping",
  "Hiking","Music","Sketching","Figma Plugins","Dark Mode","Architecture",
  "Open Source","Creative Coding",
];

/* Repeat the tracks so the seamless loop never shows a gap */
const double = (arr: string[]) => [...arr, ...arr];

function ToolPill({ src, alt }: { src: string; alt: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Tooltip label={alt}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "52px", height: "52px",
          display: "grid", placeItems: "center",
          flexShrink: 0,
          cursor: "default",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 220ms cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        <Image
          src={src} alt={alt} width={44} height={44}
          style={{
            objectFit: "contain",
            filter: hovered
              ? "drop-shadow(0 12px 22px rgba(var(--shadow-tint-rgb),0.30)) drop-shadow(0 3px 6px rgba(var(--shadow-tint-rgb),0.18))"
              : "drop-shadow(0 5px 12px rgba(var(--shadow-tint-rgb),0.20)) drop-shadow(0 1px 3px rgba(var(--shadow-tint-rgb),0.10))",
            transition: "filter 220ms ease-out",
          }}
        />
      </div>
    </Tooltip>
  );
}

/* A single pill in the marquee track */
function Chip({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      padding: "7px 16px",
      borderRadius: "99px",
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: "-0.01em",
      color: "var(--col-fg)",
      background: "var(--surface-glass)",
      border: "1px solid rgba(0,0,0,0.12)",
      boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      whiteSpace: "nowrap" as const,
    }}>
      {label}
    </span>
  );
}

/* Infinite marquee row — direction: 1 = right, -1 = left */
function MarqueeRow({ items, direction, speed = 28 }: { items: string[]; direction: 1 | -1; speed?: number }) {
  const track = double(items);
  const totalItems = items.length;
  /* Each pill is ~160px wide incl. gap on average */
  const totalWidth = totalItems * 168;

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        /* We animate the wrapper — translateX from 0 to -50% for left, 0 to +50% for right */
        animation: `marquee-${direction === 1 ? "right" : "left"} ${speed}s linear infinite`,
        willChange: "transform",
      }}
    >
      {track.map((label, i) => <Chip key={`${label}-${i}`} label={label} />)}
    </div>
  );
}

export default function AboutCurrently() {
  return (
    <div style={{
      position: "relative",
      borderRadius: "24px",
      background: "var(--surface-opaque)",
      boxShadow: "0 2px 6px rgba(var(--shadow-tint-rgb),0.10)",
      overflow: "hidden",
      width: "100%",
    }}>
      {/* "Currently" label */}
      <div style={{
        padding: "15px 26px 0",
        fontFamily: "var(--font-sans)",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "var(--col-muted)",
      }}>
        Currently
      </div>

      {/* Inset panel */}
      <div style={{
        margin: "10px 7px 7px",
        borderRadius: "15px",
        background: "var(--col-bg)",
        padding: "20px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}>

        {/* Location row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flexShrink: 0, width: "40px", height: "40px", display: "grid", placeItems: "center",
            boxShadow: "0 4px 12px rgba(var(--shadow-tint-rgb),0.14), 0 1px 3px rgba(var(--shadow-tint-rgb),0.08)",
            borderRadius: "12px", overflow: "hidden" }}>
            <Image src="/icon-location.svg" alt="" width={40} height={40} style={{ display: "block" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--col-fg)" }}>
              Darjeeling, India
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 400, color: "var(--col-muted)" }}>
              Designing digital experiences
            </span>
          </div>
        </div>

        {/* Hairline */}
        <div style={{ height: 1, background: "var(--col-hairline)" }} />

        {/* Things I enjoy — double-layer marquee */}
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--col-muted)", marginBottom: "12px" }}>
            Things I enjoy
          </p>

          {/* Marquee container with fade masks on left + right edges */}
          <div style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            /* Fade left + right — same mask on both sides */
            WebkitMaskImage: "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
            maskImage: "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
          }}>
            <MarqueeRow items={TRACK_A} direction={-1} speed={24} />
            <MarqueeRow items={TRACK_B} direction={1}  speed={27} />
          </div>
        </div>

        {/* Hairline */}
        <div style={{ height: 1, background: "var(--col-hairline)" }} />

        {/* Selected tools — logos only */}
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--col-muted)", marginBottom: "12px" }}>
            Selected tools
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {TOOLS.map(t => <ToolPill key={t.alt} {...t} />)}
          </div>
        </div>
      </div>

      {/* Marquee keyframes injected as a style tag — avoids globals.css pollution */}
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
