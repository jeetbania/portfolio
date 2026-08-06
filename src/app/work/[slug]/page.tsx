import { projects } from "@/data/projects";
import { getCaseStudy } from "@/data/caseStudies";
import { notFound } from "next/navigation";
import CaseStudyNav from "@/components/CaseStudyNav";
import CaseStudyContent from "@/components/CaseStudyContent";
import CaseStudyCover from "@/components/CaseStudyCover";
import CaseStudyShell from "@/components/CaseStudyShell";
import NextProjectLink from "@/components/NextProjectLink";
import ToolLogo from "@/components/ToolLogo";
import { MetaTiles, MetaTile } from "@/components/MetaTiles";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  return { title: project ? `${project.title} — Jeet Bania` : "Case Study" };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  if (!project) notFound();
  const caseStudy = getCaseStudy(slug);

  const currentIndex = projects.findIndex(p => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main>
      <CaseStudyShell slug={slug}>
        {/* ── Two-column grid: Back + TOC rail (left) | everything else
            (right) — the title, hero, and every section share ONE left
            edge that's indented from the TOC, not flush with it. ──── */}
        <div className="case-study-grid">
          {/* Left rail — CaseStudyNav renders the back link + section
              nav together as one sticky group (see CaseStudyNav.tsx). */}
          <CaseStudyNav
            items={caseStudy ? caseStudy.sections.map(s => ({ id: s.id, label: s.label })) : []}
            backHref="/#work"
            backLabel="Back"
          />

          {/* Right column — title through footer teaser */}
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(40px, 6.5vw, 72px)",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "14px",
              }}
            >
              {project.title}
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
              {project.description}
            </p>

            {caseStudy && (
              <MetaTiles>
                <MetaTile label="Role">
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--col-fg)" }}>
                    {caseStudy.meta.role}
                  </div>
                </MetaTile>
                <MetaTile label="Timeline">
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--col-fg)" }}>
                    {caseStudy.meta.timeline}
                  </div>
                </MetaTile>
                {caseStudy.meta.team && (
                  <MetaTile label="Team" grow={160}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--col-fg)" }}>
                      {caseStudy.meta.team}
                    </div>
                  </MetaTile>
                )}
                {caseStudy.meta.tools && (
                  <MetaTile label="Tools">
                    <div style={{ display: "flex", gap: "8px" }}>
                      {caseStudy.meta.tools.map(tool => (
                        <ToolLogo key={tool} name={tool} size={30} />
                      ))}
                    </div>
                  </MetaTile>
                )}
              </MetaTiles>
            )}

            {/* Hero cover — shares the "Image Card" dial values (padding,
                corner radius) with every image/image-grid block in
                CaseStudyContent.tsx below, via CaseStudyCover.tsx. */}
            <CaseStudyCover
              src={project.images[0].src}
              alt={project.images[0].alt}
              tintHex={project.tintHex}
              focalPoint={project.images[0].focalPoint}
            />

            {caseStudy ? (
              caseStudy.sections.map((section, i) => (
                <CaseStudyContent key={section.id} id={section.id} label={section.label} blocks={section.blocks} tintHex={project.tintHex} index={i} />
              ))
            ) : (
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--col-muted)" }}>
                Case study content coming soon.
              </p>
            )}

            <NextProjectLink project={nextProject} />
          </div>
        </div>
      </CaseStudyShell>

      <RoundedCap />
      <Footer />
    </main>
  );
}
