/**
 * Flat, monochrome placeholder thumbnail for tools with no real
 * screenshot yet (currently the two Figma plugins, dev-mode only, no
 * marketing image exists for either). Deliberately flat/ghost-card, not
 * a colorful gradient blob like GradientThumb, per Jeet's established
 * preference against gradient/colorful illustrations for placeholder
 * states, this is meant to read as "nothing to show yet," not as art.
 */
export default function ToolPlaceholderThumb({ radius }: { radius?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        background: "var(--surface-wash)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.32 }}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="var(--col-muted)" strokeWidth="1.4" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="var(--col-muted)" strokeWidth="1.4" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="var(--col-muted)" strokeWidth="1.4" />
        <circle cx="17.5" cy="17.5" r="3.5" stroke="var(--col-muted)" strokeWidth="1.4" />
      </svg>
    </div>
  );
}
