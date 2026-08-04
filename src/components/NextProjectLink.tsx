import Link from "next/link";
import type { Project } from "@/data/projects";

/**
 * Closing teaser — big serif project name, sitting directly in the content
 * flow (not a bordered card) right before the page curves into the footer.
 * Matches the Paper.design template's "Next Project / [Name]" moment.
 */
export default function NextProjectLink({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      style={{
        display: "block",
        marginTop: "64px",
        paddingTop: "8px",
        textDecoration: "none",
        color: "inherit",
      }}
      className="next-project-teaser"
    >
      <div style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(18px, 2.2vw, 24px)",
        color: "var(--col-muted)",
        marginBottom: "2px",
      }}>
        Next project
      </div>
      <div
        className="next-project-teaser-name"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(52px, 10vw, 108px)",
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          color: "var(--col-fg)",
          transition: "color 220ms var(--ease-out)",
        }}
      >
        {project.title}
      </div>
    </Link>
  );
}
