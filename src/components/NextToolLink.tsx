import Link from "next/link";
import type { Tool } from "@/data/tools";

/** Closing teaser for tool pages, same pattern as NextPostLink/NextProjectLink. */
export default function NextToolLink({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      style={{ display: "block", marginTop: "64px", paddingTop: "8px", textDecoration: "none", color: "inherit" }}
      className="next-project-teaser"
    >
      <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(18px, 2.2vw, 24px)", color: "var(--col-muted)", marginBottom: "2px" }}>
        Next tool
      </div>
      <div
        className="next-project-teaser-name"
        style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(38px, 7vw, 76px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--col-fg)", transition: "color 220ms var(--ease-out)" }}
      >
        {tool.title}
      </div>
    </Link>
  );
}
