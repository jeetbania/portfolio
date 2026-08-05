/**
 * The case-study page's design style — baked in as "Wide Editorial" after
 * comparing it live against two other candidates (Compact, Large Feature)
 * via a DialKit dropdown. That dropdown is gone now that the choice is
 * final; this is just the settled set of numbers, kept in one place so
 * CaseStudyContent/Cover/Shell agree on them.
 *
 * - Wide container (1560px) with more room than the original 1160px.
 * - "flush" cards: the image fills the card edge-to-edge (radius applied
 *   directly, no padding/fill/shadow frame) for a denser, magazine feel.
 *
 * Gap/padding/cardRadius stay live-tunable via the "Image Card" DialKit
 * folder (see useImageCardDials in CaseStudyContent.tsx) — those are still
 * useful spacing/radius knobs independent of which layout was chosen.
 */
export const CASE_STUDY_STYLE = {
  containerWidth: 1560,
  cardStyle: "flush" as const,
  heroAspect: "21/9",
  wideImageAspect: "16/9",
  gridImageAspect: "1/1",
};
