import { PlaceholderCard } from "./CaseStudyContent";
import { CASE_STUDY_STYLE, IMAGE_CARD_STYLE } from "@/lib/caseStudyStyles";
import { AnchoredImage, type FocalPoint } from "@/lib/imageAnchor";

/**
 * The big hero image at the top of a case-study page — was previously its
 * own hardcoded copy of PlaceholderCard's markup (same padding/radius
 * numbers, pasted rather than shared), which is why it silently kept the
 * OLD numbers whenever the shared ones changed: it wasn't actually wired
 * to the same values. Reusing PlaceholderCard here instead means the
 * cover always matches the section-body images' padding/radius.
 *
 * No longer a client component — it used to need `useImageCardDials`
 * (a hook, so page.tsx's Server Component couldn't call it directly),
 * but that DialKit panel is gone now that its values are settled
 * (IMAGE_CARD_STYLE, a plain constant). AnchoredImage still renders fine
 * as a client child of this Server Component.
 *
 * `heroAspect` comes from the baked-in Wide Editorial style (see
 * src/lib/caseStudyStyles.ts).
 */
export default function CaseStudyCover({
  src, alt, tintHex, focalPoint,
}: { src: string; alt: string; tintHex: string; focalPoint?: FocalPoint }) {
  return (
    <div style={{ marginBottom: "64px" }}>
      <PlaceholderCard aspectRatio={CASE_STUDY_STYLE.heroAspect} dial={IMAGE_CARD_STYLE} innerBackground={`${tintHex}33`}>
        <AnchoredImage
          src={src}
          alt={alt}
          sizes={`(max-width: 900px) 100vw, ${CASE_STUDY_STYLE.contentColumnWidth}px`}
          priority
          defaultFocalPoint={focalPoint}
        />
      </PlaceholderCard>
    </div>
  );
}
