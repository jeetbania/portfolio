import Image from "next/image";

/**
 * The two "face" designs rendered inside a <CanvasCard> — visually this
 * is where the references' style (Framer about-page's colored sticky
 * notes + bold-captioned photos) gets reinterpreted in this site's own
 * glass language instead of copied: flat colored paper becomes a tinted
 * translucent card (blur + a hairline border in the same hue), and a
 * plain photo + caption becomes the same rounded, bordered, blurred glass
 * frame every other card on this site already uses (QuoteBlock,
 * PlaceholderCard) rather than a plain Polaroid.
 */

export function StickyNote({ text, tint }: { text: string; tint: string }) {
  return (
    <div
      style={{
        padding: "20px 20px 22px",
        borderRadius: "16px",
        background: `linear-gradient(160deg, ${tint}3d 0%, ${tint}16 100%)`,
        border: `1px solid ${tint}59`,
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",
        boxShadow:
          "0 2px 8px rgba(var(--shadow-tint-rgb),0.08), 0 16px 30px rgba(var(--shadow-tint-rgb),0.10), var(--glass-bevel)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-hand)",
          fontSize: "20px",
          lineHeight: 1.45,
          color: "var(--col-fg)",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
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
