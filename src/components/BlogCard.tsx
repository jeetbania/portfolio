import Link from "next/link";
import GradientThumb from "./GradientThumb";
import type { BlogPost } from "@/data/blog";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="blog-card block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current"
      style={{
        display: "flex",
        flexDirection: "column",
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
      {/* Thumbnail — nested-box treatment, small inset on all sides.
          flexShrink:0 keeps its aspect-ratio box from being squashed by
          the flex column once the content below varies in height. */}
      <div style={{ padding: "10px 10px 0", flexShrink: 0 }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/11",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <GradientThumb colors={post.gradient} />
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
            {post.category}
          </span>
        </div>
      </div>

      {/* Content — flex:1 so it fills whatever space the grid row gives
          the card, with the author/arrow row pinned to the bottom via
          marginTop:auto regardless of how much title/excerpt text there
          is. Title and excerpt are both height-reserved (line-clamped
          AND given a minHeight matching that clamp) so a one-line title
          takes the same vertical space as a two-line one — that, plus
          the pinned footer, is what keeps every card the same height. */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "var(--col-muted-2)",
            marginBottom: "8px",
          }}
        >
          {formatDate(post.date)} · {post.readTime}
        </div>

        {/* h2, not h3 — the blog listing page's only heading above this is
            the page's own h1, so h3 here skipped a level (WCAG 1.3.1 /
            Lighthouse's heading-order audit). */}
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            marginBottom: "8px",
            minHeight: "calc(1.3em * 2)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}
        >
          {post.title}
        </h2>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            lineHeight: 1.55,
            color: "var(--col-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
            minHeight: "calc(1.55em * 2)",
            marginBottom: "16px",
          }}
        >
          {post.excerpt}
        </p>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              aria-hidden="true"
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: post.tintHex,
                border: "1px solid var(--col-border)",
              }}
            />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", fontWeight: 500, color: "var(--col-fg)" }}>
              {post.author}
            </span>
          </div>
          <div
            className="blog-card-arrow"
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--col-chip-muted)",
              display: "grid",
              placeItems: "center",
              color: "var(--col-fg)",
            }}
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
