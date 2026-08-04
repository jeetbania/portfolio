"use client";

import { useEffect, useRef } from "react";

export default function HeroName() {
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleScroll = () => {
      const y = window.scrollY;
      /* Start fading at 60px, fully gone by 220px */
      const p = Math.min(Math.max((y - 60) / 160, 0), 1);
      el.style.opacity   = String(1 - p);
      el.style.transform = `scale(${1 - p * 0.12}) translateY(${-p * 24}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <h1
      ref={nameRef}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(64px, 10vw, 120px)",
        fontWeight: 400,
        lineHeight: 0.95,
        letterSpacing: "-0.025em",
        color: "var(--col-fg)",
        transformOrigin: "center top",
        willChange: "transform, opacity",
        userSelect: "none",
      }}
    >
      Jeet Bania
    </h1>
  );
}
