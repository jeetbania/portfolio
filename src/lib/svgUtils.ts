/** Inline an SVG string as a `data:` URI — used to hand hand-authored SVG
 * markup to a <canvas> drawImage() or an <img>/CSS background, since both
 * need a URL, not raw markup. */
export function toDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Swap every `fill="white"`/`fill="black"`/matching `stroke=` in a
 * hand-authored SVG string for a single runtime color — the same
 * recolor-by-string-replace trick used for every monochrome glyph in
 * this project (icons authored once in black/white, tinted per use). */
export function recolorFill(svg: string, color: string) {
  return svg
    .replace(/fill="white"/g, `fill="${color}"`).replace(/fill="black"/g, `fill="${color}"`)
    .replace(/stroke="white"/g, `stroke="${color}"`).replace(/stroke="black"/g, `stroke="${color}"`);
}
