import Image from "next/image";
import type { ContentBlock } from "@/data/caseStudies";
import QuoteBlock from "./QuoteBlock";

/**
 * White "placeholder card" wrapper — the shell every image/image-grid block
 * sits in: rounded-24px card, soft shadow, small inset padding, with the
 * actual image (or a flat placeholder tone until real images land) inside
 * a rounded-16px inner box. Matches the Paper.design case-study template.
 */
function PlaceholderCard({
  children, aspectRatio = "16/10",
}: { children?: React.ReactNode; aspectRatio?: string }) {
  return (
    <div style={{
      background: "var(--surface-opaque)",
      borderRadius: "24px",
      /* Nested-box look: more room above the inner image, equal on the
         other three sides — not a uniform inset. */
      padding: "28px 10px 10px",
      boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.12)",
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        borderRadius: "16px",
        overflow: "hidden",
        background: "var(--col-bg)",
      }}>
        {children}
      </div>
    </div>
  );
}

function Block({ block, tintHex }: { block: ContentBlock; tintHex: string }) {
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
          <PlaceholderCard aspectRatio={block.wide ? "16/9" : "4/3"}>
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

    case "imageGrid":
      /* Each image gets its own card, laid out side by side — matches the
         reference's two independent cards, not one card split in half. */
      return (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(block.images.length, 2)}, 1fr)`,
          gap: "12px",
        }}>
          {block.images.map((img, i) => (
            <PlaceholderCard key={img.src + i} aspectRatio="4/3">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 900px) 50vw, 340px" />
            </PlaceholderCard>
          ))}
        </div>
      );

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
        <Block key={i} block={block} tintHex={tintHex} />
      ))}
    </section>
  );
}
