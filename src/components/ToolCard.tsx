import Link from "next/link";
import Image from "next/image";
import ToolPlaceholderThumb from "./ToolPlaceholderThumb";
import type { Tool } from "@/data/tools";

/**
 * Grid card for /tools. Modeled on BlogCard, minus the author row and
 * excerpt field Jeet didn't want here, the tagline does double duty as
 * both. Thumbnail is a real OG image where one exists (thumb set), or
 * ToolPlaceholderThumb for the two Figma plugins that don't have one yet.
 *
 * `wide`: for the lone trailing card when the tool count is odd (see
 * ToolsGrid), spanning both grid columns, switches to a horizontal
 * (image left, text right) layout instead of stretching the normal
 * vertical card to double width, which would have left the thumbnail
 * a very short, oddly-proportioned strip.
 */
export default function ToolCard({ tool, wide = false }: { tool: Tool; wide?: boolean }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tool-card block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#3B5BDB]"
      style={{
        display: "flex",
        flexDirection: wide ? "row" : "column",
        height: "100%",
        borderRadius: "22px",
        background: "var(--surface-opaque)",
        boxShadow: "0 1px 2px rgba(var(--shadow-tint-rgb),0.06), 0 8px 24px rgba(var(--shadow-tint-rgb),0.08), var(--glass-bevel)",
        border: "1px solid var(--surface-card-border)",
        textDecoration: "none",
        color: "inherit",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: wide ? "10px 0 10px 10px" : "10px 10px 0", flexShrink: 0, width: wide ? "42%" : undefined }}>
        <div style={{ position: "relative", width: "100%", height: wide ? "100%" : undefined, aspectRatio: wide ? undefined : "16/10", borderRadius: "16px", overflow: "hidden" }}>
          {tool.thumb ? (
            <Image src={tool.thumb} alt="" fill sizes="(max-width: 700px) 100vw, 480px" style={{ objectFit: "cover" }} />
          ) : (
            <ToolPlaceholderThumb />
          )}
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              padding: "5px 12px",
              borderRadius: "99px",
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.75)",
              backdropFilter: "blur(14px) saturate(180%)",
              WebkitBackdropFilter: "blur(14px) saturate(180%)",
              fontFamily: "var(--font-sans)",
              fontSize: "11.5px",
              fontWeight: 600,
              letterSpacing: "0.01em",
              color: "#1A1A1A",
            }}
          >
            {tool.kind === "web" ? "Web app" : "Figma plugin"}
          </span>
        </div>
      </div>

      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "19px", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.25, marginBottom: "8px" }}>
          {tool.title}
        </h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14.5px", lineHeight: 1.55, color: "var(--col-muted)", marginBottom: "16px" }}>
          {tool.tagline}
        </p>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", fontWeight: 500, color: tool.tintHex }}>
            {tool.builtWith}
          </span>
          <div
            className="tool-card-arrow"
            style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: "var(--col-chip-muted)", display: "grid", placeItems: "center", color: "var(--col-fg)" }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 10L10 2M10 2H4.5M10 2V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
