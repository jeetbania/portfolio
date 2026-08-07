/**
 * Decorative "cap" that sits right above the Footer — creates the illusion
 * of the content card curving into the black footer via rounded bottom
 * corners, without wrapping any interactive content in overflow:hidden
 * (an earlier version did that and caused a real performance/flicker
 * regression — see commit history). This is a plain, non-wrapping sibling
 * that overlaps the footer's top edge by exactly its own height.
 */
export default function RoundedCap() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        zIndex: 2,
        /* height +1px / marginTop -1px is a deliberate 1px overlap into
           Playground's bottom edge, not a mistake — even though both
           sides paint the exact same --col-bg, sitting them exactly
           flush left a faint seam visible on some screens (reported: a
           hairline right above this curve, mobile). That's a known
           browser compositing artifact where two adjacent same-color
           layers still show a 1-device-pixel gap at their shared edge,
           especially on non-integer devicePixelRatio screens. Overlapping
           by 1px instead of abutting exactly papers over it. marginBottom
           is unchanged so the net effect on the footer's position below
           is exactly zero — only the top edge moved. */
        height: "calc(var(--rounded-cap) + 1px)",
        marginTop: "-1px",
        marginBottom: "calc(-1 * var(--rounded-cap))",
        background: "var(--col-bg)",
        borderRadius: "0 0 var(--rounded-cap) var(--rounded-cap)",
      }}
    />
  );
}
