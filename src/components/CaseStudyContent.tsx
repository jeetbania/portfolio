"use client";

import { useDialKit } from "dialkit";
import type { ContentBlock } from "@/data/caseStudies";
import { CASE_STUDY_STYLE } from "@/lib/caseStudyStyles";
import { AnchoredImage } from "@/lib/imageAnchor";
import QuoteBlock from "./QuoteBlock";

/**
 * Live-tunable numbers for the image/image-grid cards below, exposed as a
 * DialKit panel (see the floating dial icon — bottom-right by default —
 * once `<DialRoot />` from layout.tsx is on screen). Purely a design/dev
 * tool: DialKit hides itself in production builds automatically, so this
 * never ships to real visitors. `persist: true` + a stable `id` keeps the
 * values in localStorage and reconnects every CaseStudyContent instance on
 * the page (there's one per nav section) — and CaseStudyCover.tsx's hero
 * banner, and CaseStudyShell.tsx's container — to the SAME "Image Card"
 * folder, instead of spawning a separate panel per mount. Exported so those
 * other components can reconnect to it too.
 *
 * Only gap/padding/cardRadius remain here — columns/rows and the "which
 * whole-page layout" dropdown that used to live alongside them were both
 * exploration-only controls. Now that the layout (Wide Editorial, see
 * src/lib/caseStudyStyles.ts) and the image counts/arrangement (fixed per
 * block — see caseStudies.ts) are both settled, image-grid slot count comes
 * straight from real content instead of a slider preview.
 *
 * Defaults below are the tuned values from the first dial-tweaking pass
 * (gap 18 / padding 5 / cardRadius 21) — not the original design's numbers.
 * Moving a slider only changes the live preview in your browser; landing on
 * numbers you like again means asking for them to be baked in here the same
 * way.
 *
 * Per-image crop position is a separate dev tool, not a DialKit panel — see
 * src/lib/imageAnchor.tsx (its floating "🎯 Anchor images" button lives
 * bottom-left, this panel is bottom-right).
 */
export function useImageCardDials() {
  const { imageCard } = useDialKit("Case Study", {
    imageCard: {
      gap: [18, 0, 40],
      padding: [5, 0, 40],
      cardRadius: [21, 0, 48],
    },
  }, { id: "case-study-image-card", persist: true });
  return imageCard;
}

export type ImageCardValues = ReturnType<typeof useImageCardDials>;

/**
 * "Placeholder card" wrapper — the shell every image/image-grid block sits
 * in. CASE_STUDY_STYLE's cardStyle is "flush" (Wide Editorial): no frame,
 * padding, or shadow — the image itself gets `dial.cardRadius` directly,
 * for a denser, edge-to-edge grid. (The alternate "boxed" nested-frame
 * look — `--case-card-bg` fill, soft shadow, inset padding — lived here
 * before Wide Editorial was chosen; resurrect it from git history if a
 * boxed variant is ever wanted again.)
 */
export function PlaceholderCard({
  children, aspectRatio = "16/10", dial, innerBackground = "var(--col-bg)",
}: { children?: React.ReactNode; aspectRatio?: string; dial: ImageCardValues; innerBackground?: string }) {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio,
      borderRadius: `${dial.cardRadius}px`,
      overflow: "hidden",
      background: innerBackground,
    }}>
      {children}
    </div>
  );
}

function Block({ block, tintHex, dial }: { block: ContentBlock; tintHex: string; dial: ImageCardValues }) {
  switch (block.type) {
    case "heading":
      /* Sub-headings within a section — Sans Semibold, same rule as the
         About page: Serif is reserved for the one big hero headline only. */
      return (
        <h3 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(19px, 2.4vw, 22px)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          marginTop: "4px",
        }}>
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(17px, 1.9vw, 22px)",
          fontWeight: 500,
          lineHeight: 1.4,
          letterSpacing: "-0.03em",
          color: "var(--col-muted)",
        }}>
          {block.text}
        </p>
      );

    case "image": {
      const aspectRatio = block.wide ? CASE_STUDY_STYLE.wideImageAspect : CASE_STUDY_STYLE.gridImageAspect;
      return (
        <figure style={{ margin: 0 }}>
          <PlaceholderCard aspectRatio={aspectRatio} dial={dial}>
            <AnchoredImage src={block.src} alt={block.alt} sizes={`(max-width: 900px) 100vw, ${CASE_STUDY_STYLE.contentColumnWidth}px`} defaultFocalPoint={block.focalPoint} />
          </PlaceholderCard>
          {block.caption && (
            <figcaption style={{
              fontFamily: "var(--font-sans)", fontSize: "13px",
              color: "var(--col-muted-2)", marginTop: "10px", paddingLeft: "8px",
            }}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "imageGrid": {
      /* Columns come straight from the block's own image count now (2
         images = 2 side by side) — this used to be an exploratory preview
         driven by "Image Card" columns/rows sliders (cycling through fewer
         real images to fill however many slots you dragged to); now that
         the case-study template's image slots are fixed content, the real
         list is the whole story. */
      const n = block.images.length;
      // Each tile's real desktop CSS width: the content column split N
      // ways, minus the (n-1) gaps between tiles. Mobile keeps every tile
      // side by side too (no responsive column collapse here), so the vw
      // fraction mirrors that instead of assuming a stack.
      const tileWidth = Math.round((CASE_STUDY_STYLE.contentColumnWidth - dial.gap * (n - 1)) / n);
      const tileSizes = `(max-width: 900px) ${Math.round(100 / n)}vw, ${tileWidth}px`;
      return (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gap: `${dial.gap}px`,
        }}>
          {block.images.map((img, i) => (
            <PlaceholderCard key={i} aspectRatio={CASE_STUDY_STYLE.gridImageAspect} dial={dial}>
              <AnchoredImage src={img.src} alt={img.alt} sizes={tileSizes} defaultFocalPoint={img.focalPoint} />
            </PlaceholderCard>
          ))}
        </div>
      );
    }

    case "quote":
      return <QuoteBlock text={block.text} attribution={block.attribution} />;

    case "stats":
      /* Metric tiles — one white card, tiles inside laid out in a row.
         Matches the "$2.1M / First-quarter revenue" tile pattern. */
      return (
        <div style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          background: "var(--surface-opaque)",
          borderRadius: "24px",
          padding: "8px",
          boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.12)",
        }}>
          {block.items.map(item => (
            <div key={item.label} style={{
              flex: "1 1 150px",
              padding: "20px 18px",
              borderRadius: "16px",
              background: "var(--col-bg)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(24px,3vw,32px)", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--col-fg)" }}>
                {item.value}
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "15px", letterSpacing: "-0.03em", color: "var(--col-muted)", lineHeight: 1.3 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <ul style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "0", listStyle: "none" }}>
          {block.items.map((item, i) => (
            <li key={i} style={{
              fontFamily: "var(--font-sans)", fontSize: "clamp(16px, 1.6vw, 19px)", fontWeight: 500,
              lineHeight: 1.45, letterSpacing: "-0.02em", color: "var(--col-muted)",
              display: "flex", gap: "10px",
            }}>
              <span aria-hidden="true" style={{ color: tintHex, flexShrink: 0 }}>✦</span>
              {item}
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

export default function CaseStudyContent({
  id, label, blocks, tintHex, index,
}: {
  id: string; label: string; blocks: ContentBlock[]; tintHex: string; index: number;
}) {
  const dial = useImageCardDials();

  return (
    <section
      id={id}
      data-case-study-section
      style={{
        scrollMarginTop: "100px",
        // Tightened (was 20/56/20) — the old spacing read as too airy
        // between sections and between a heading and what follows it.
        paddingTop: index === 0 ? 0 : "16px",
        paddingBottom: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h2 style={{
        fontFamily: "var(--font-sans)",
        fontSize: "clamp(24px, 3.2vw, 32px)",
        fontWeight: 600,
        letterSpacing: "-0.02em",
        textTransform: "capitalize",
      }}>
        {label}
      </h2>
      {blocks.map((block, i) => (
        <Block key={i} block={block} tintHex={tintHex} dial={dial} />
      ))}
    </section>
  );
}
