import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import BlogFilterGrid from "@/components/BlogFilterGrid";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";

export const metadata: Metadata = {
  title: "Blog - Jeet Bania",
  description: "Notes on design, product, and motion.",
};

export default function BlogPage() {
  return (
    <main style={{ background: "var(--col-bg)" }}>
      <div style={{
        maxWidth: "1160px",
        margin: "0 auto",
        padding: "clamp(110px, 15vh, 160px) clamp(24px, 5vw, 72px) clamp(24px, 5vw, 64px)",
      }}>
        {/* ── Hero — center-aligned to match the About page treatment.
            maxWidth'd h1/p need margin:auto too, not just text-align. ── */}
        <div style={{ marginBottom: "clamp(48px, 7vh, 72px)", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--col-muted)", marginBottom: "14px",
          }}>
            Blog
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(38px, 6vw, 64px)",
            fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "18px",
            maxWidth: "680px", marginLeft: "auto", marginRight: "auto",
          }}>
            Notes from the process.
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 500,
            letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--col-muted)",
            maxWidth: "560px", marginLeft: "auto", marginRight: "auto",
          }}>
            Design, product, and motion: the things I keep re-learning, written down before I forget them again.
          </p>
        </div>

        <BlogFilterGrid posts={blogPosts} />
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
