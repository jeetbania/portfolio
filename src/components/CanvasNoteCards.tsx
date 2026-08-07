import Image from "next/image";
import { MountFrame, InnerCard, derivePalette } from "./CanvasCardChrome";

/**
 * StickyNote — redesigned off a paper.design reference: a numeral (in the
 * site's handwritten font) + a short title + a longer line, inside the
 * shared MountFrame/InnerCard chrome (see CanvasCardChrome.tsx). Colors
 * all come from ONE seed hex via derivePalette — pick a new accent by
 * picking one new color, not four.
 *
 * PhotoNote is unchanged — it keeps the site's usual glass card frame
 * (blur, hairline border), which wasn't part of this redesign.
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
  const palette = derivePalette(seed);
  return (
    <MountFrame>
      <InnerCard palette={palette} style={{ padding: "24px 17px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "var(--font-hand)", color: palette.ink, fontSize: "36px", lineHeight: "36px" }}>
            {index}
          </span>
          <span style={{ fontFamily: "var(--font-sans)", color: "#1A1A1A", fontSize: "18px", fontWeight: 600, lineHeight: "23px" }}>
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

export function PhotoNote({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <div
      style={{
        borderRadius: "18px",
        overflow: "hidden",
        background: "var(--surface-card)",
        border: "1px solid var(--surface-card-border)",
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",
        boxShadow:
          "0 2px 8px rgba(var(--shadow-tint-rgb),0.08), 0 18px 34px rgba(var(--shadow-tint-rgb),0.12), var(--glass-bevel)",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="260px" draggable={false} />
      </div>
      <div style={{ padding: "13px 15px 15px" }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "-0.005em",
            lineHeight: 1.4,
            color: "var(--col-fg)",
            margin: 0,
          }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}
