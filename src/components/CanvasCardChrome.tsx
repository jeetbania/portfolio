/**
 * Shared chrome for the "mounted paper" card style — reimplemented from a
 * paper.design reference: a neutral outer mount (generous top margin,
 * like a photo mat) framing a smaller colored inner card. Used by
 * StickyNote, TodoWidgetCard, and CoffeeCounterCard so all three read as
 * the same family of object sitting on the board, not three unrelated
 * designs.
 *
 * Dark-mode-aware, unlike the homepage fan cards/folders — those are
 * deliberately fixed "stickers" per CLAUDE.md, but these were reported
 * looking wrong in dark mode (flat white regardless of theme). All the
 * colors below flow from CSS custom properties that flip per theme
 * (globals.css: --canvas-mount-bg, --canvas-tint-base, --canvas-ink-strong),
 * so the mount goes from an off-white mat to a dark neutral card, and
 * every note's accent color goes from a pale tint-on-white to a deep
 * muted tint-on-near-black, automatically.
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
  /** Inner card fill — a faint tint of the seed toward the theme's mount base. */
  bg: string;
  /** Inner card's bottom edge — a slightly richer tint, reads as a lip/shadow line. */
  borderBottom: string;
  /** Numerals/labels — the seed boosted toward the theme's strong ink color, so it stays legible in both directions (darkened a touch in light mode, brightened in dark mode). */
  ink: string;
  /** Body text — a mid tint, muted but still colored (not plain gray), toward the theme's mount base. */
  text: string;
};

/**
 * The "color logic" requested: every value below is derived from ONE seed
 * hex via color-mix, the same technique Pin.tsx's highlight/shadow uses —
 * so picking a new accent for a new card is just picking one new hex, not
 * four hand-tuned ones, and the relationship between bg/border/ink/text
 * stays consistent across every card AND across both themes, since the
 * base each one blends toward is itself a theme-flipping CSS variable
 * rather than a literal "white".
 */
export function derivePalette(seed: string): Palette {
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
