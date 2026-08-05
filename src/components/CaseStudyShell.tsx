import { CASE_STUDY_STYLE } from "@/lib/caseStudyStyles";

/**
 * Wraps the case-study page's whole content column (nav rail + title +
 * hero + sections) and sets its max-width to the baked-in Wide Editorial
 * container width (see src/lib/caseStudyStyles.ts). No longer needs to be
 * a client component now that there's no dial read here — this used to
 * pick its width from a "Page Style" dropdown that's since been baked in.
 */
export default function CaseStudyShell({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
