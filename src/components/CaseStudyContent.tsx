"use client";

import Image from "next/image";
import { useDialKit } from "dialkit";
import type { ContentBlock } from "@/data/caseStudies";
import QuoteBlock from "./QuoteBlock";

/**
 * Live-tunable numbers for the image/image-grid cards below, exposed as a
 * DialKit panel (see the floating dial icon — bottom-right by default —
 * once `<DialRoot />` from layout.tsx is on screen). Purely a design/dev
 * tool: DialKit hides itself in production builds automatically, so this
 * never ships to real visitors. `persist: true` + a stable `id` keeps the
 * values in localStorage and reconnects every CaseStudyContent instance on
 * the page (there's one per nav section) to the SAME "Image Card" folder,
 * instead of spawning a separate panel per section.
 */
function useImageCardDials() {
  const { imageCard } = useDialKit("Case Study", {
    imageCard: {
      gap: [12, 0, 40],
      padding: [10, 0, 40],
      columns: [2, 1, 6, 1],
      rows: [1, 1, 6, 1],
      cardRadius: [24, 0, 48],
    },
  }, { id: "case-study-image-card", persist: true });
  return imageCard;
}

type ImageCardValues = ReturnType<typeof useImageCardDials>;

/**
 * White "placeholder card" wrapper — the shell every image/image-grid block
 * sits in: rounded card, soft shadow, small inset padding, with the actual
 * image (or a flat placeholder tone until real images land) inside a
 * rounded inner box. Matches the Paper.design case-study template.
 *
 * `dial.padding` and `dial.cardRadius` come straight from the "Image Card"
 * DialKit folder above. The outer padding keeps its original asymmetric
 * shape (more room above the image than the other three sides) by adding
 * a fixed +18px on top of the dialed value, instead of baking in a second
 * hardcoded number — so the nested-box look survives however far the
 * slider gets pushed. The inner image box's radius is derived from the
 * outer one (-8px, floored at 0) so it keeps reading as "nested" instead
 * of the two radii drifting apart as cardRadius moves.
 */
function PlaceholderCard({
  children, aspectRatio = "16/10", dial,
}: { children?: React.ReactNode; aspectRatio?: string; dial: ImageCardValues }) {
  return (
    <div style={{
      background: "var(--surface-opaque)",
      borderRadius: `${dial.cardRadius}px`,
      padding: `${dial.padding + 18}px ${dial.padding}px ${dial.padding}px`,
      boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.12)",
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        borderRadius: `${Math.max(dial.cardRadius - 8, 0)}px`,
        overflow: "hidden",
        background: "var(--col-bg)",
      }}>
        {children}
      </div>
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

    case "image":
      return (
        <figure style={{ margin: 0 }}>
          <PlaceholderCard aspectRatio={block.wide ? "16/9" : "4/3"} dial={dial}>
            <Image src={block.src} alt={block.alt} fill className="object-cover" sizes="(max-width: 900px) 100vw, 720px" />
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

    case "imageGrid": {
      /* Slot count comes from the "Image Card" dials, not block.images.length
         — dial.columns × dial.rows is a live layout preview (up to 6×6) so a
         2-or-3-image placeholder set can still stand in for a bigger future
         gallery grid. Slots beyond the real image list cycle back through
         it (i % length) rather than going blank, so every slider position
         still previews real photography instead of empty tone boxes. */
      const slotCount = dial.columns * dial.rows;
      const slots = Array.from({ length: slotCount }, (_, i) => block.images[i % block.images.length]);
      return (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${dial.columns}, 1fr)`,
          gap: `${dial.gap}px`,
        }}>
          {slots.map((img, i) => (
            <PlaceholderCard key={i} aspectRatio="4/3" dial={dial}>
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 900px) 50vw, 340px" />
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
        paddingTop: index === 0 ? 0 : "20px",
        paddingBottom: "56px",
        borderBottom: "1px solid var(--col-hairline)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
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
