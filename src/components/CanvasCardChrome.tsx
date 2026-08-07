/**
 * Shared chrome for the "mounted paper" card style — reimplemented from a
 * paper.design reference: a neutral off-white outer mount (generous top
 * margin, like a photo mat) framing a smaller colored inner card. Used by
 * StickyNote, TodoWidgetCard, and CoffeeCounterCard so all three read as
 * the same family of object sitting on the board, not three unrelated
 * designs.
 *
 * Deliberately theme-independent (fixed hex values, not var(--col-*)) —
 * same "sticker on a board" convention as the homepage fan cards and the
 * project folders (see CLAUDE.md): this is meant to look like real paper
 * lifted off the canvas, not reactive app chrome, so it stays the same
 * off-white mount in both light and dark mode.
 */

export function MountFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        background: "#F9F9F9",
        borderRadius: "24px",
        boxShadow: "0 5px 17px rgba(0,0,0,0.22)",
        outline: "2px solid #FFFFFF",
        overflow: "clip",
        paddingTop: "42px",
        paddingBottom: "13px",
        paddingInline: "13px",
      }}
    >
      {children}
    </div>
  );
}

export type Palette = {
  seed: string;
  /** Inner card fill — a faint tint of the seed. */
  bg: string;
  /** Inner card's bottom edge — a slightly richer tint, reads as a lip/shadow line. */
  borderBottom: string;
  /** The seed itself — used for numerals/labels, needs to stay legible and saturated. */
  ink: string;
  /** Body text — a mid tint, muted but still colored (not plain gray). */
  text: string;
};

/**
 * The "color logic" requested: every value below is derived from ONE seed
 * hex via color-mix, the same technique Pin.tsx already uses for its
 * highlight/shadow — so picking a new accent for a new card is just
 * picking one new hex, not four hand-tuned ones, and the relationship
 * between bg/border/ink/text stays consistent across every card.
 */
export function derivePalette(seed: string): Palette {
  return {
    seed,
    bg: `color-mix(in srgb, ${seed} 12%, white)`,
    borderBottom: `color-mix(in srgb, ${seed} 30%, white)`,
    ink: seed,
    text: `color-mix(in srgb, ${seed} 58%, white)`,
  };
}

/** The inner colored card every mounted card's content sits inside. */
export function InnerCard({ palette, style, children }: { palette: Palette; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: "12px",
        background: palette.bg,
        borderBottom: `2px solid ${palette.borderBottom}`,
        boxShadow: "0 2px 3px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
