import Link from "next/link";
import type { BlogPost } from "@/data/blog";

/** Closing teaser for blog posts — same pattern as NextProjectLink. */
export default function NextPostLink({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
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
        Next post
      </div>
      <div
        className="next-project-teaser-name"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(38px, 7vw, 76px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: "var(--col-fg)",
          transition: "color 220ms var(--ease-out)",
        }}
      >
        {post.title}
      </div>
    </Link>
  );
}
