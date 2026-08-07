"use client";

import Image from "next/image";
import { useTheme } from "@/lib/theme";
import { MountFrame, InnerCard, derivePalette } from "./CanvasCardChrome";

/**
 * StickyNote — a numeral (in the site's handwritten font) + a short title
 * + a longer line, inside the shared MountFrame/InnerCard chrome (see
 * CanvasCardChrome.tsx). Colors all come from ONE seed hex via
 * derivePalette — pick a new accent by picking one new color, not four —
 * and the theme (light/dark) comes from useTheme() so the same seed
 * produces a correctly-legible result in either mode.
 *
 * PhotoNote — a polaroid: thick bottom mat, square photo, a handwritten-
 * feeling caption underneath. The colored thumbtack dot from the first
 * pass is gone per feedback (read as clutter) — the mat's own shape
 * already sells "physical object pinned to a board" on its own.
 */

export function StickyNote({
  index,
  title,
  text,
  seed,
}: {
  /** Small numeral, e.g. "01". */
  index: string;
  title: string;
  text: string;
  seed: string;
}) {
  const { theme } = useTheme();
  const palette = derivePalette(seed, theme === "dark");
  return (
    <MountFrame>
      <InnerCard palette={palette} style={{ padding: "24px 17px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "var(--font-hand)", color: palette.ink, fontSize: "36px", lineHeight: "36px" }}>
            {index}
          </span>
          <span style={{ fontFamily: "var(--font-sans)", color: "var(--canvas-ink-strong)", fontSize: "18px", fontWeight: 600, lineHeight: "23px" }}>
            {title}
          </span>
        </div>
        <p style={{
          fontFamily: "var(--font-sans)", color: palette.text, fontSize: "14px",
          letterSpacing: "-0.01em", lineHeight: "19px", margin: 0,
        }}>
          {text}
        </p>
      </InnerCard>
    </MountFrame>
  );
}

export function PhotoNote({
  src, alt, title, subtitle,
}: {
  src: string; alt: string;
  /** Bold handwritten-style caption, e.g. "The Build" — like a name scrawled under a real polaroid. */
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{
      background: "var(--canvas-mount-bg)",
      borderRadius: "10px",
      padding: "10px 10px 18px",
      boxShadow: "var(--canvas-mount-shadow)",
      outline: "2px solid var(--canvas-mount-outline)",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "3px", overflow: "hidden" }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="260px" draggable={false} />
      </div>
      <div style={{ paddingTop: "13px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-hand)", fontSize: "25px", lineHeight: "25px", color: "var(--canvas-ink-strong)", margin: 0 }}>
          {title}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--col-muted)", margin: "3px 0 0" }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
