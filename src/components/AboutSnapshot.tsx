import type { ReactNode } from "react";
import { withGlassShine } from "@/lib/hoverStyles";

/* ── Minimal monoline icons — generic glyphs only, never a reproduction
   of any brand's actual logomark (Figma/Adobe/Anthropic marks included). */
function Icon({ path, size = 16 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PATHS = {
  pin:     "M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  layers:  "M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5",
  orbit:   "M12 5a7 7 0 1 1-4.95 2.05M7.05 3v4.05H3",
  grid:    "M4 4h7v7H4V4ZM13 4h7v7h-7V4ZM4 13h7v7H4v-7ZM13 13h7v7h-7v-7Z",
  sparkle: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18",
  code:    "M9 8 4 12l5 4M15 8l5 4-5 4",
  shapes:  "M8 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM16 3h4v4h-4a3 3 0 0 1 0-6h.5M16 15a3 3 0 1 0 3 3v-3h-3Z",
  doc:     "M7 3h7l4 4v14H7V3ZM14 3v4h4M10 12h5M10 15.5h5",
  frame:   "M4 5h16v14H4V5ZM10 9.5v5l4-2.5-4-2.5Z",
};

interface ToolTile { label: string; icon: keyof typeof PATHS; gradient: string; }

const TOOLS: ToolTile[] = [
  { label: "Figma",        icon: "shapes",  gradient: "linear-gradient(135deg, var(--folder-incore), var(--folder-yap))" },
  { label: "Paper.design", icon: "doc",     gradient: "linear-gradient(135deg, var(--folder-migrateful), var(--folder-incore))" },
  { label: "After Effects",icon: "frame",   gradient: "linear-gradient(135deg, var(--folder-fourth), var(--folder-migrateful))" },
  { label: "Claude",       icon: "sparkle", gradient: "linear-gradient(135deg, var(--folder-yap), var(--folder-fourth))" },
];

interface Interest { label: string; icon: keyof typeof PATHS; tint: string; }

const INTERESTS: Interest[] = [
  { label: "Product Design",        icon: "layers",  tint: "var(--folder-incore)" },
  { label: "Motion Design",         icon: "orbit",   tint: "var(--folder-migrateful)" },
  { label: "Design Systems",        icon: "grid",    tint: "var(--folder-yap)" },
  { label: "AI Workflows",          icon: "sparkle", tint: "var(--folder-fourth)" },
  { label: "Frontend Experiments",  icon: "code",    tint: "var(--folder-incore)" },
];

function Divider() {
  return <div style={{ height: 1, background: "var(--col-hairline)" }} />;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--font-sans)",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--col-muted-2)",
        marginBottom: "14px",
      }}
    >
      {children}
    </span>
  );
}

export default function AboutSnapshot() {
  return (
    <div
      style={{
        borderRadius: "28px",
        background: "var(--surface-card)",
        border: "1px solid var(--surface-card-border)",
        boxShadow: "0 16px 40px rgba(var(--shadow-tint-rgb),0.08)",
        overflow: "hidden",
      }}
    >
      {/* ── Currently ─────────────────────────────────────────────── */}
      <div style={{ padding: "26px 28px" }}>
        <Eyebrow>Currently</Eyebrow>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "42px", height: "42px", flexShrink: 0,
              borderRadius: "13px",
              display: "grid", placeItems: "center",
              background: "linear-gradient(135deg, var(--folder-yap), var(--folder-migrateful))",
              color: "#1A1A1A",
              boxShadow: withGlassShine("0 4px 12px rgba(var(--shadow-tint-rgb),0.14)"),
            }}
          >
            <Icon path={PATHS.pin} size={18} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--col-fg)" }}>
              Bengaluru, India
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "13.5px", color: "var(--col-muted)", marginTop: "1px" }}>
              Designing digital products
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* ── Things I enjoy ───────────────────────────────────────── */}
      <div style={{ padding: "24px 28px" }}>
        <Eyebrow>Things I enjoy</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {INTERESTS.map(item => (
            <div
              key={item.label}
              className="snapshot-tile"
              style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                padding: "7px 13px 7px 10px",
                borderRadius: "99px",
                background: item.tint + "3d",
                border: `1px solid ${item.tint}90`,
                color: "var(--col-fg)",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 500,
                boxShadow: "0 2px 6px rgba(var(--shadow-tint-rgb),0.06)",
              }}
            >
              <Icon path={PATHS[item.icon]} size={14} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── Selected tools ───────────────────────────────────────── */}
      <div style={{ padding: "24px 28px 28px" }}>
        <Eyebrow>Selected tools</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
          {TOOLS.map(tool => (
            <div
              key={tool.label}
              className="snapshot-tile"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "76px" }}
            >
              <div
                style={{
                  width: "52px", height: "52px",
                  borderRadius: "16px",
                  display: "grid", placeItems: "center",
                  background: tool.gradient,
                  color: "#1A1A1A",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 6px 16px rgba(var(--shadow-tint-rgb),0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <Icon path={PATHS[tool.icon]} size={20} />
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "11.5px", color: "var(--col-muted)", textAlign: "center", lineHeight: 1.2 }}>
                {tool.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
