import { tools, getTool } from "@/data/tools";
import { notFound } from "next/navigation";
import CaseStudyNav from "@/components/CaseStudyNav";
import CaseStudyContent from "@/components/CaseStudyContent";
import NextToolLink from "@/components/NextToolLink";
import ToolBrowserMockup from "@/components/ToolBrowserMockup";
import ToolPlaceholderThumb from "@/components/ToolPlaceholderThumb";
import { MetaTiles, MetaTile } from "@/components/MetaTiles";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";

export function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  return { title: tool ? tool.title : "Tools" };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const currentIndex = tools.findIndex(t => t.slug === slug);
  const nextTool = tools[(currentIndex + 1) % tools.length];

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
        {/* Same two-column grid as the case study/blog templates: Back +
            TOC rail (left) | title through footer teaser (right). */}
        <div className="case-study-grid">
          <CaseStudyNav
            items={tool.sections.map(s => ({ id: s.id, label: s.label }))}
            backHref="/tools"
            backLabel="Back to tools"
          />

          <div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "12.5px", fontWeight: 600,
              letterSpacing: "0.02em",
              color: `color-mix(in srgb, ${tool.tintHex} 45%, black)`,
              marginBottom: "12px",
            }}>
              {tool.kind === "web" ? "Web app" : "Figma plugin"}
            </p>
            <h1 style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 5.4vw, 56px)",
              fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "14px",
            }}>
              {tool.title}
            </h1>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "clamp(18px, 2.1vw, 24px)",
              fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.3,
              color: "var(--col-muted)", marginBottom: "32px",
            }}>
              {tool.tagline}
            </p>

            <MetaTiles>
              <MetaTile label="Type">
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--col-fg)" }}>
                  {tool.kind === "web" ? "Web app" : "Figma plugin"}
                </div>
              </MetaTile>
              <MetaTile label="Built with" grow={190}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--col-fg)" }}>
                  {tool.builtWith}
                </div>
              </MetaTile>
              <MetaTile label="Status">
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--col-fg)" }}>
                  {tool.kind === "web" ? "Live" : "Dev mode only"}
                </div>
              </MetaTile>
            </MetaTiles>

            {/* The tool itself. Real screenshots inside a Mac-style browser
                mockup, each with a "Visit" button out to the actual site,
                per Jeet: he'd rather send people to the real domain than
                embed it (an iframe here would also be dead weight). Two
                side by side for the jukebox pair, one full-width otherwise.
                Figma plugins have no live URL/screenshot at all, so they
                get a plain placeholder card instead of pretending to. */}
            {tool.variants.length > 0 ? (
              <div
                className="tool-variant-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: tool.variants.length > 1 ? "repeat(2, 1fr)" : "1fr",
                  gap: "20px",
                  marginBottom: "64px",
                }}
              >
                {tool.variants.map(variant => (
                  <div key={variant.label} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {variant.screenshot && <ToolBrowserMockup src={variant.screenshot} alt={`${variant.label} screenshot`} />}
                    {variant.url && (
                      <a
                        href={variant.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                          fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
                          color: "var(--cta-text)", background: "var(--cta-bg)", border: "1px solid var(--cta-border)",
                          borderRadius: "99px", padding: "11px 20px", textDecoration: "none",
                          boxShadow: "0 1px 3px var(--cta-shadow), inset 0 1px 0 var(--cta-shine-rest)",
                        }}
                      >
                        Visit {tool.variants.length > 1 ? variant.label : "the site"}
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M1 11L11 1M11 1H4.5M11 1V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: "var(--surface-opaque)",
                  borderRadius: "24px",
                  padding: "28px 10px 10px",
                  boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.12)",
                  marginBottom: "64px",
                }}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "16px", overflow: "hidden" }}>
                  <ToolPlaceholderThumb radius={16} />
                </div>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--col-muted-2)",
                  textAlign: "center", padding: "14px 10px 4px",
                }}>
                  Figma plugin, runs in dev mode inside Figma itself, no live link to share yet.
                </p>
              </div>
            )}

            {tool.sections.map((section, i) => (
              <CaseStudyContent key={section.id} id={section.id} label={section.label} blocks={section.blocks} tintHex={tool.tintHex} index={i} />
            ))}

            <NextToolLink tool={nextTool} />
          </div>
        </div>
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
