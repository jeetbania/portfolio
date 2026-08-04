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
        height: "var(--rounded-cap)",
        marginBottom: "calc(-1 * var(--rounded-cap))",
        background: "var(--col-bg)",
        borderRadius: "0 0 var(--rounded-cap) var(--rounded-cap)",
      }}
    />
  );
}
