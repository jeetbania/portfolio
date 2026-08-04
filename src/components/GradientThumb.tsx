/**
 * Soft, blurred-gradient placeholder thumbnail — stands in for real blog
 * cover art until that exists. Deliberately theme-independent (same
 * reasoning as Folder.tsx / Playground fan cards, see CLAUDE.md): it's
 * imagery, not chrome, so it should look identical in light and dark mode
 * rather than trying to follow the site's color tokens.
 *
 * Expects an ancestor with `position: relative` and a defined size (an
 * aspect-ratio box) — this fills it via `position: absolute; inset: 0`,
 * the same contract as next/image's `fill` prop.
 */

const BLOB_LAYOUT = [
  { top: "-18%", left: "-12%", size: "78%" },
  { top: "8%",   left: "42%",  size: "88%" },
  { top: "42%",  left: "-10%", size: "72%" },
];

export default function GradientThumb({
  colors,
  radius,
}: {
  colors: readonly [string, string, string] | readonly string[];
  radius?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: radius,
        background: "#F1F0EA",
      }}
    >
      {colors.slice(0, 3).map((c, i) => {
        const p = BLOB_LAYOUT[i % BLOB_LAYOUT.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: c,
              filter: "blur(38px)",
              opacity: 0.85,
            }}
          />
        );
      })}
      {/* Faint vignette to soften edges against the card border, matching
          the airy/washed-out look of the reference gradient thumbnails. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(120% 120% at 50% 30%, transparent 40%, rgba(255,255,255,0.28) 100%)",
        }}
      />
    </div>
  );
}
