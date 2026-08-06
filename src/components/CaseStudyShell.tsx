"use client";

import { CASE_STUDY_STYLE } from "@/lib/caseStudyStyles";
import { AnchorProvider, AnchorToggle } from "@/lib/imageAnchor";

/**
 * Wraps the case-study page's whole content column (nav rail + title +
 * hero + sections) and sets its max-width to the baked-in Wide Editorial
 * container width (see src/lib/caseStudyStyles.ts). Also owns the page's
 * `<AnchorProvider>` — the shared per-image focal-point state every
 * `<AnchoredImage>` in CaseStudyCover.tsx/CaseStudyContent.tsx below
 * reconnects to (see src/lib/imageAnchor.tsx) — and renders the one
 * `<AnchorToggle />` button for the whole page. Needs to be a client
 * component for that provider; it was briefly a plain server component
 * between the two.
 */
export default function CaseStudyShell({
  slug, children,
}: { slug: string; children: React.ReactNode }) {
  return (
    <AnchorProvider slug={slug}>
      <div
        style={{
          minHeight: "100svh",
          padding: "clamp(110px, 15vh, 160px) clamp(24px, 5vw, 64px) clamp(24px, 5vw, 64px)",
          maxWidth: `${CASE_STUDY_STYLE.containerWidth}px`,
          margin: "0 auto",
        }}
      >
        {children}
      </div>
      <AnchorToggle />
    </AnchorProvider>
  );
}
