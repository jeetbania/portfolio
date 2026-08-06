"use client";

import { CASE_STUDY_STYLE } from "@/lib/caseStudyStyles";
import { AnchorProvider, AnchorToggle } from "@/lib/imageAnchor";
import { ContentEditorProvider, ContentEditorToggle } from "@/lib/contentEditor";

/**
 * Wraps the case-study page's whole content column (nav rail + title +
 * hero + sections) and sets its max-width to the baked-in Wide Editorial
 * container width (see src/lib/caseStudyStyles.ts). Also owns the page's
 * two dev-tool providers/toggles — every `<AnchoredImage>` and
 * `<EditableText>` below (CaseStudyCover.tsx/CaseStudyContent.tsx) needs
 * one of these as an ancestor to actually be editable, not just read its
 * defaults:
 * - `<AnchorProvider>` + `<AnchorToggle>` — per-image crop/zoom
 *   (src/lib/imageAnchor.tsx), toggle bottom-left.
 * - `<ContentEditorProvider>` + `<ContentEditorToggle>` — in-place copy
 *   editing (src/lib/contentEditor.tsx), toggle top-left.
 * Needs to be a client component for these providers.
 */
export default function CaseStudyShell({
  slug, children,
}: { slug: string; children: React.ReactNode }) {
  return (
    <AnchorProvider slug={slug}>
      <ContentEditorProvider slug={slug}>
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
        <ContentEditorToggle />
      </ContentEditorProvider>
    </AnchorProvider>
  );
}
