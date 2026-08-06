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
  /* Real max CSS width of the content column images actually render into
     at desktop — containerWidth minus its own worst-case padding
     (clamp(24px,5vw,64px) each side, maxing at 64px), minus the
     .case-study-grid rail (200px) and its gap (64px): 1560 - 128 - 200 -
     64 = 1168, rounded up a little for headroom. Feeds every
     AnchoredImage's `sizes` hint (CaseStudyContent.tsx/CaseStudyCover.tsx)
     so the browser fetches source images that actually match what's
     rendered instead of a stale, smaller number — a mismatch here is what
     was making the YAP Global photos look over-compressed: the browser
     was fetching ~720px-wide sources for what's now a ~1168px box and
     CSS-upscaling them. Keep this in sync if containerWidth/the rail/gap
     ever change again. */
  contentColumnWidth: 1200,
};
