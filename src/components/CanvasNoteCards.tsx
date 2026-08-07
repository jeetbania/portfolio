"use client";

import { useTheme } from "@/lib/theme";
import { MountFrame, InnerCard, derivePalette } from "./CanvasCardChrome";
import { EditableText } from "@/lib/contentEditor";
import { AnchoredImage } from "@/lib/imageAnchor";

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
 *
 * `id` on both is the card's own id (e.g. "sticky-1", "photo-tech1", same
 * one PlaygroundCanvas.tsx already uses for pin state) — it's what makes
 * each text field's EditableText id stable and unique
 * ("sticky-1.title", "photo-tech1.subtitle", ...) without either
 * component needing to know anything about the page around it.
 */

export function StickyNote({
  id,
  index,
  title,
  text,
  seed,
}: {
  id: string;
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
          <EditableText
            id={`${id}.index`}
            baseValue={index}
            style={{ fontFamily: "var(--font-hand)", color: palette.ink, fontSize: "36px", lineHeight: "36px" }}
          />
          <EditableText
            id={`${id}.title`}
            baseValue={title}
            style={{ fontFamily: "var(--font-sans)", color: "var(--canvas-ink-strong)", fontSize: "18px", fontWeight: 600, lineHeight: "23px" }}
          />
        </div>
        <EditableText
          id={`${id}.text`}
          baseValue={text}
          as="p"
          style={{
            fontFamily: "var(--font-sans)", color: palette.text, fontSize: "14px",
            letterSpacing: "-0.01em", lineHeight: "19px", margin: 0,
          }}
        />
      </InnerCard>
    </MountFrame>
  );
}

export function PhotoNote({
  id, src, alt, title, subtitle, aspectRatio = "1/1",
}: {
  id: string;
  src: string; alt: string;
  /** Bold handwritten-style caption, e.g. "The Build" — like a name scrawled under a real polaroid. */
  title: string;
  subtitle: string;
  /** CSS aspect-ratio for the photo itself, e.g. the source image's real
   * "2765/3686" — the polaroid's mat/caption stay fixed-shape, but this is
   * what makes a landscape photo's card read as wider and a portrait
   * photo's read as narrower/taller instead of every card being forced
   * into the same square crop regardless of what the source image
   * actually looks like. Defaults to a square for any caller that doesn't
   * pass one. */
  aspectRatio?: string;
}) {
  return (
    <div style={{
      background: "var(--canvas-mount-bg)",
      borderRadius: "10px",
      padding: "10px 10px 18px",
      boxShadow: "var(--canvas-mount-shadow)",
      outline: "2px solid var(--canvas-mount-outline)",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio, borderRadius: "3px", overflow: "hidden" }}>
        <AnchoredImage src={src} alt={alt} sizes="300px" />
      </div>
      <div style={{ paddingTop: "13px", textAlign: "center" }}>
        <EditableText
          id={`${id}.title`}
          baseValue={title}
          as="p"
          style={{ fontFamily: "var(--font-hand)", fontSize: "25px", lineHeight: "25px", color: "var(--canvas-ink-strong)", margin: 0 }}
        />
        <EditableText
          id={`${id}.subtitle`}
          baseValue={subtitle}
          as="p"
          style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--col-muted)", margin: "3px 0 0" }}
        />
      </div>
    </div>
  );
}
