/**
 * Loading placeholder for real photos — reverse-engineered from an AI
 * image-generation "generating..." loading UI (the ChatGPT/Gemini-style
 * treatment: a dot grid with a soft blob-shaped highlight that drifts and
 * morphs across it). Kept only that dot-morph visual; deliberately dropped
 * the reference's "Generating image" label, prompt text, and resolution
 * chip — those describe a generation IN PROGRESS, which isn't what's
 * happening here. This is just "the photo hasn't arrived yet."
 *
 * Colors come from --case-card-bg / --skeleton-dot / --skeleton-glow
 * (globals.css), so it's beige in light mode and the same raised dark
 * surface as every other card in dark mode — not the reference's flat
 * gray/black, which would look foreign against this site's palette.
 *
 * Purely presentational — doesn't own the "is it loaded yet" state
 * itself, so it can drop into any `position: relative` image box (see
 * AnchoredImage in imageAnchor.tsx, Folder.tsx) the same way.
 */
export function ImageSkeleton({ visible }: { visible: boolean }) {
  return (
    <div className="img-skeleton" aria-hidden="true" style={{ opacity: visible ? 1 : 0 }}>
      <span className="img-skeleton-dots" />
      <span className="img-skeleton-glow" />
    </div>
  );
}
