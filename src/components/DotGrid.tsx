"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme";

export default function DotGrid() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Matches --dot-color in globals.css for each theme */
    const dotColor = theme === "dark" ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.38)";

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const SPACING = 28, BASE_R = 0.7, MAX_R = 2.8, INFLUENCE = 200;

    let w = 0, h = 0;
    let dots: { x: number; y: number; r: number }[] = [];
    const pointer = { x: -9999, y: -9999 };
    let rafId = 0;

    function buildDots() {
      dots = [];
      for (let y = SPACING / 2; y < h; y += SPACING)
        for (let x = SPACING / 2; x < w; x += SPACING)
          dots.push({ x, y, r: BASE_R });
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width  = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = dotColor;
      for (const d of dots) {
        const dx = d.x - pointer.x, dy = d.y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const target = dist < INFLUENCE
          ? BASE_R + (MAX_R - BASE_R) * (1 - dist / INFLUENCE)
          : BASE_R;
        d.r += (target - d.r) * (reduced ? 1 : 0.14);
        if (d.r > 0.15) {
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function loop() { draw(); rafId = requestAnimationFrame(loop); }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
    window.addEventListener("pointerleave", () => { pointer.x = -9999; pointer.y = -9999; });

    if (reduced) draw(); else rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [theme, isHome]);

  if (!isHome) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position:"fixed", inset:0, width:"100%", height:"100%",
        pointerEvents:"none", zIndex:0 }}
    />
  );
}
