/**
 * Case-study/blog "spec sheet" row (Role/Timeline/Team/Tools, or
 * Author/Published/Read time) — styled as the same nested-box tile card
 * used for the "stats" content block (see CaseStudyContent.tsx's "stats"
 * case: an opaque outer card + individual --col-bg tiles inside). Was
 * previously bare label/value text floating directly on the page
 * background with a thin top divider — reusing this established card
 * pattern instead of inventing a new one keeps every "row of small facts"
 * on the site looking like one system. (Tried the same hover-lift the
 * About page's tool tiles use here too — read badly on plain text tiles,
 * so these stay static.)
 */
export function MetaTiles({ children, maxWidth = "620px" }: { children: React.ReactNode; maxWidth?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        background: "var(--surface-opaque)",
        borderRadius: "22px",
        padding: "8px",
        boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.1), var(--glass-bevel)",
        maxWidth,
        marginBottom: "48px",
      }}
    >
      {children}
    </div>
  );
}

export function MetaTile({
  label, children, grow = 130,
}: { label: string; children: React.ReactNode; grow?: number }) {
  return (
    <div
      style={{
        flex: `1 1 ${grow}px`,
        minWidth: 0,
        padding: "16px 18px",
        borderRadius: "16px",
        background: "var(--col-bg)",
        display: "flex",
        flexDirection: "column",
        gap: "7px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "10.5px",
          fontWeight: 600,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--col-muted-2)",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
