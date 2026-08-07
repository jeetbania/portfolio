/**
 * Shared chrome for the "mounted paper" card style — reimplemented from a
 * paper.design reference: a neutral outer mount (generous top margin,
 * like a photo mat) framing a smaller colored inner card. Used by
 * StickyNote and TodoWidgetCard so both read as the same family of
 * object sitting on the board, not two unrelated designs.
 *
 * Dark-mode-aware, unlike the homepage fan cards/folders — those are
 * deliberately fixed "stickers" per CLAUDE.md, but these were reported
 * looking wrong in dark mode twice now: first flat white regardless of
 * theme, then (after that fix) too dark to read — mixing each seed at
 * just 12% into a near-black base produced a muddy near-black card with
 * illegible same-toned text on top of it. derivePalette now takes the
 * theme explicitly and uses a real second formula for dark mode instead
 * of just swapping the base color into the same percentages: more seed
 * in the fill (so the color actually reads as that color, not near-
 * black), and body text is a flat near-white rather than a seed tint —
 * per feedback, trying to keep muted-but-colored text legible against a
 * dark fill wasn't worth the contrast fight light mode doesn't have.
 */

export function MountFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        background: "var(--canvas-mount-bg)",
        borderRadius: "24px",
        boxShadow: "var(--canvas-mount-shadow)",
        outline: "2px solid var(--canvas-mount-outline)",
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
  /** Inner card fill — a tint of the seed. */
  bg: string;
  /** Inner card's bottom edge — a richer tint, reads as a lip/shadow line. */
  borderBottom: string;
  /** Numerals/labels — the seed boosted for legibility in whichever direction the theme needs. */
  ink: string;
  /** Body text. */
  text: string;
};

/**
 * The "color logic" requested: every value below is derived from ONE seed
 * hex via color-mix (the same technique Pin.tsx's highlight/shadow uses),
 * so picking a new accent for a new card is just picking one new hex —
 * but the FORMULA branches by theme, not just the base color, since a
 * light card and a dark card need different amounts of seed to both read
 * clearly as "that color" and stay legible.
 */
export function derivePalette(seed: string, isDark: boolean): Palette {
  if (isDark) {
    return {
      seed,
      bg: `color-mix(in srgb, ${seed} 40%, var(--canvas-tint-base))`,
      borderBottom: `color-mix(in srgb, ${seed} 62%, var(--canvas-tint-base))`,
      ink: `color-mix(in srgb, ${seed} 82%, white)`,
      text: "rgba(255,255,255,0.88)",
    };
  }
  return {
    seed,
    bg: `color-mix(in srgb, ${seed} 12%, var(--canvas-tint-base))`,
    borderBottom: `color-mix(in srgb, ${seed} 30%, var(--canvas-tint-base))`,
    ink: `color-mix(in srgb, ${seed} 78%, var(--canvas-ink-strong))`,
    text: `color-mix(in srgb, ${seed} 62%, var(--canvas-tint-base))`,
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
        boxShadow: "var(--canvas-inner-shadow)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
