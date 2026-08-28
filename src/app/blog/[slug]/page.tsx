import { blogPosts, getBlogPost } from "@/data/blog";
import { notFound } from "next/navigation";
import CaseStudyNav from "@/components/CaseStudyNav";
import CaseStudyContent from "@/components/CaseStudyContent";
import NextPostLink from "@/components/NextPostLink";
import GradientThumb from "@/components/GradientThumb";
import { MetaTiles, MetaTile } from "@/components/MetaTiles";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";

export function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  return { title: post ? `${post.title} - Jeet Bania` : "Blog" };
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const nextPost = blogPosts[(currentIndex + 1) % blogPosts.length];

  return (
    <main>
      <div
        style={{
          minHeight: "100svh",
          padding: "clamp(110px, 15vh, 160px) clamp(24px, 5vw, 64px) clamp(24px, 5vw, 64px)",
          maxWidth: "1160px",
          margin: "0 auto",
        }}
      >
        {/* Same two-column grid as the case study template: Back + TOC
            rail (left) | title through footer teaser (right). */}
        <div className="case-study-grid">
          <CaseStudyNav
            items={post.sections.map(s => ({ id: s.id, label: s.label }))}
            backHref="/blog"
            backLabel="Back to blog"
          />

          <div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "12.5px", fontWeight: 600,
              letterSpacing: "0.02em",
              /* Every post.tintHex is a pastel picked for gradient
                 thumbnails/accents, not for text — used raw here it was
                 ~1.4:1 against the page background, a hard WCAG AA fail.
                 Darkening it 55% toward black keeps each post's own accent
                 color recognizable while clearing 4.5:1 (still ≥4.5 for
                 every current tint, checked against the palette in
                 data/blog.ts, with margin for new ones). */
              color: `color-mix(in srgb, ${post.tintHex} 45%, black)`,
              marginBottom: "12px",
            }}>
              {post.category}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(36px, 5.8vw, 60px)",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                marginBottom: "14px",
              }}
            >
              {post.title}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(18px, 2.1vw, 24px)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: 1.3,
                color: "var(--col-muted)",
                marginBottom: "32px",
              }}
            >
              {post.excerpt}
            </p>

            <MetaTiles>
              <MetaTile label="Author">
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--col-fg)" }}>
                  {post.author}
                </div>
              </MetaTile>
              <MetaTile label="Published" grow={150}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--col-fg)" }}>
                  {formatDate(post.date)}
                </div>
              </MetaTile>
              <MetaTile label="Read time">
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--col-fg)" }}>
                  {post.readTime}
                </div>
              </MetaTile>
            </MetaTiles>

            {/* Hero cover — same nested-box treatment as the case study
                template, filled with the gradient-thumb placeholder until
                real cover art exists. */}
            <div
              style={{
                background: "var(--surface-opaque)",
                borderRadius: "24px",
                padding: "28px 10px 10px",
                boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.12)",
                marginBottom: "64px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <GradientThumb colors={post.gradient} radius={16} />
              </div>
            </div>

            {post.sections.map((section, i) => (
              <CaseStudyContent key={section.id} id={section.id} label={section.label} blocks={section.blocks} tintHex={post.tintHex} index={i} />
            ))}

            <NextPostLink post={nextPost} />
          </div>
        </div>
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
