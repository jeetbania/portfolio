/**
 * A pushpin — CSS-only (no SVG asset yet; swap for one later if a hand-
 * drawn version shows up). Built as a small radial-gradient sphere with a
 * bright highlight offset toward the top-left (a fixed "light source",
 * same convention as every other glossy/glass highlight already used on
 * this site) plus a soft cast shadow, which is what actually sells the
 * "3D ball sitting proud of the page" read at this size — a flat colored
 * circle alone looks like a bullet point, not a pin.
 */
export function Pin({ color, size = 30 }: { color: string; size?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 40%, white) 0%, ${color} 52%, color-mix(in srgb, ${color} 72%, black) 100%)`,
        boxShadow: `0 ${size * 0.12}px ${size * 0.22}px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -2px 3px rgba(0,0,0,0.25)`,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "16%",
          left: "24%",
          width: "26%",
          height: "22%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.75)",
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}
