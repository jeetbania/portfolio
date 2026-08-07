import Image from "next/image";

/**
 * The two "face" designs rendered inside a <CanvasCard>.
 *
 * StickyNote deliberately does NOT use this site's glass treatment —
 * per feedback, glass read as generically "app UI," not a sticky note.
 * Redesigned after a reference showing flat, opaque pastel cards with a
 * soft grounded shadow (not a colored/tinted glow) and a small numeral —
 * closer to real paper lifted off a board than a translucent panel. Like
 * the homepage fan cards, these are deliberately theme-independent
 * "stickers" (see CLAUDE.md's note on Folder.tsx/Playground.tsx) — same
 * vivid pastel and fixed dark ink color in both light and dark mode,
 * which is also why the text color below is a literal hex rather than
 * var(--col-fg): that token flips to near-white in dark mode and would
 * vanish against a light pastel background.
 *
 * PhotoNote keeps the site's usual glass card frame (blur, hairline
 * border) — that wasn't called out, and it's what makes a photo read as
 * "part of this site" rather than a plain Polaroid.
 */

export function StickyNote({
  text,
  tint,
  index,
}: {
  text: string;
  tint: string;
  /** Optional small numeral in the corner, e.g. "01" — purely decorative. */
  index?: string;
}) {
  return (
    <div
      style={{
        padding: "20px 20px 22px",
        borderRadius: "16px",
        background: `linear-gradient(160deg, color-mix(in srgb, ${tint} 22%, white) 0%, color-mix(in srgb, ${tint} 42%, white) 100%)`,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 10px 20px rgba(0,0,0,0.12), 0 26px 44px rgba(0,0,0,0.12)",
      }}
    >
      {index && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: `color-mix(in srgb, ${tint} 60%, black)`,
            margin: "0 0 8px",
          }}
        >
          {index}
        </p>
      )}
      <p
        style={{
          fontFamily: "var(--font-hand)",
          fontSize: "19px",
          lineHeight: 1.42,
          color: "#2B2A28",
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
