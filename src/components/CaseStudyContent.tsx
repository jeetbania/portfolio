"use client";

import type { ContentBlock } from "@/data/caseStudies";
import { CASE_STUDY_STYLE, IMAGE_CARD_STYLE } from "@/lib/caseStudyStyles";
import { AnchoredImage } from "@/lib/imageAnchor";
import { EditableText } from "@/lib/contentEditor";
import QuoteBlock from "./QuoteBlock";
import BeforeAfterSlider from "./BeforeAfterSlider";

export type ImageCardValues = typeof IMAGE_CARD_STYLE;

/**
 * "Placeholder card" wrapper — the shell every image/image-grid block sits
 * in. CASE_STUDY_STYLE's cardStyle is "flush" (Wide Editorial): no frame,
 * padding, or shadow — the image itself gets `dial.cardRadius` directly,
 * for a denser, edge-to-edge grid. (The alternate "boxed" nested-frame
 * look — `--case-card-bg` fill, soft shadow, inset padding — lived here
 * before Wide Editorial was chosen; resurrect it from git history if a
 * boxed variant is ever wanted again.)
 *
 * `dial` used to be the live values from a DialKit "Image Card" panel
 * (gap/padding/cardRadius sliders); now that those are settled it's just
 * `IMAGE_CARD_STYLE` (src/lib/caseStudyStyles.ts) passed straight through
 * — same shape, so nothing downstream needed to change, just the source.
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

const PARAGRAPH_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "clamp(17px, 1.9vw, 22px)",
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: "-0.03em",
  color: "var(--col-muted)",
};

const HEADING_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "clamp(19px, 2.4vw, 22px)",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  marginTop: "4px",
};

function Block({
  block, tintHex, dial, sectionId, blockIndex,
}: { block: ContentBlock; tintHex: string; dial: ImageCardValues; sectionId: string; blockIndex: number }) {
  // Every editable field's id is self-describing — sectionId + block
  // index (+ sub-index for list/stats items) — so the copy tool's export
  // (src/lib/contentEditor.tsx) never needs to know ContentBlock's shape,
  // just where in it a given string lives.
  const blockId = `${sectionId}.blocks[${blockIndex}]`;

  switch (block.type) {
    case "heading":
      /* Sub-headings within a section — Sans Semibold, same rule as the
         About page: Serif is reserved for the one big hero headline only. */
      return <EditableText id={`${blockId}.text`} baseValue={block.text} as="h3" style={HEADING_STYLE} />;

    case "paragraph":
      return <EditableText id={`${blockId}.text`} baseValue={block.text} as="p" style={PARAGRAPH_STYLE} />;

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
      return (
        <QuoteBlock
          text={block.text}
          attribution={block.attribution}
          textId={`${blockId}.text`}
          attributionId={block.attribution ? `${blockId}.attribution` : undefined}
        />
      );

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
          {block.items.map((item, i) => (
            <div key={i} style={{
              flex: "1 1 150px",
              padding: "20px 18px",
              borderRadius: "16px",
              background: "var(--col-bg)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}>
              <EditableText
                id={`${blockId}.items[${i}].value`}
                baseValue={item.value}
                as="div"
                style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(24px,3vw,32px)", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--col-fg)" }}
              />
              <EditableText
                id={`${blockId}.items[${i}].label`}
                baseValue={item.label}
                as="div"
                style={{ fontFamily: "var(--font-sans)", fontSize: "15px", letterSpacing: "-0.03em", color: "var(--col-muted)", lineHeight: 1.3 }}
              />
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
              <EditableText id={`${blockId}.items[${i}]`} baseValue={item} as="span" />
            </li>
          ))}
        </ul>
      );

    case "beforeAfter":
      return (
        <BeforeAfterSlider
          before={block.before}
          after={block.after}
          beforeLabel={block.beforeLabel}
          afterLabel={block.afterLabel}
          editableId={blockId}
        />
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
      <EditableText
        id={`${id}.label`}
        baseValue={label}
        as="h2"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(24px, 3.2vw, 32px)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          textTransform: "capitalize",
        }}
      />
      {blocks.map((block, i) => (
        <Block key={i} block={block} tintHex={tintHex} dial={IMAGE_CARD_STYLE} sectionId={id} blockIndex={i} />
      ))}
    </section>
  );
}
