/**
 * Shared "glass shine" hover treatment — the subtle top-edge highlight
 * (an inset white line simulating a glass bevel/reflection) used on the
 * hero CTA. Reused everywhere a button needs that same premium hover feel.
 */
export const GLASS_SHINE = "inset 0 1px 0 rgba(255,255,255,0.12)";

/** Quick, slightly overshooting ease for hover transforms — snappy, not linear. */
export const QUICK_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/** Appends the glass shine highlight to an existing box-shadow value. */
export function withGlassShine(ambientShadow: string): string {
  return `${ambientShadow}, ${GLASS_SHINE}`;
}
