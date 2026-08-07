import Image from "next/image";
import { MountFrame, InnerCard, derivePalette } from "./CanvasCardChrome";

/**
 * StickyNote — a numeral (in the site's handwritten font) + a short title
 * + a longer line, inside the shared MountFrame/InnerCard chrome (see
 * CanvasCardChrome.tsx). Colors all come from ONE seed hex via
 * derivePalette — pick a new accent by picking one new color, not four.
 *
 * PhotoNote — a polaroid, not a plain bordered photo+caption. The flat
 * card version of this read as boring next to everything else on the
 * canvas; a polaroid's thick bottom mat + a handwritten-feeling caption
 * underneath is a lot more alive, and it's the same "physical object
 * pinned to a board" language the sticky notes already speak. A small
 * flat colored dot sits at the top like a thumbtack — deliberately NOT
 * the real <Pin> component (that's reserved for the actual "this card is
 * locked" mechanic; reusing it here for pure decoration would blur what
 * an actual pin means).
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
  src, alt, title, subtitle, dot,
}: {
  src: string; alt: string;
  /** Bold handwritten-style caption, e.g. "The Build" — like a name scrawled under a real polaroid. */
  title: string;
  subtitle: string;
  /** Hex for the small thumbtack dot at the top. */
  dot: string;
}) {
  return (
    <div style={{
      position: "relative",
      background: "var(--canvas-mount-bg)",
      borderRadius: "10px",
      padding: "10px 10px 18px",
      boxShadow: "var(--canvas-mount-shadow)",
      outline: "2px solid var(--canvas-mount-outline)",
    }}>
      <span aria-hidden="true" style={{
        position: "absolute", top: "-7px", left: "50%", transform: "translateX(-50%)",
        width: "15px", height: "15px", borderRadius: "50%",
        background: dot, boxShadow: "0 2px 4px rgba(0,0,0,0.35)", zIndex: 2,
      }} />
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
