/**
 * The pushpin — now the real asset (public/pin.svg, a glossy 3D pin with
 * gradient shading + a noise-textured highlight), not the earlier
 * CSS-only approximation. Recolored per pin via CSS `hue-rotate` rather
 * than editing the SVG's gradient stops directly — the source has five
 * gradients plus filter-based noise/shadow layers all tuned together for
 * one purple pin; hue-rotate shifts all of them by the same amount at
 * once, so the lighting/shadow/gloss relationships that make it read as
 * a real 3D object stay intact no matter which color comes out, instead
 * of me hand-picking five new stop colors per hue and risking a mismatch.
 */
export function Pin({ hueRotate = 0, size = 30 }: { hueRotate?: number; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- filter: hue-rotate() needs a plain <img>/CSS filter target; next/image's runtime optimization has no reason to touch a small static decorative SVG anyway.
    <img
      src="/pin.svg"
      alt=""
      aria-hidden="true"
      draggable={false}
      width={size}
      height={size * (51 / 45)}
      style={{
        display: "block",
        filter: `hue-rotate(${hueRotate}deg)`,
      }}
    />
  );
}
