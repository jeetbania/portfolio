"use client";

import { useId } from "react";

/** Deterministic 1-4 pick from React's own per-instance id, not
 * Math.random() — random would run once during SSR and again during
 * client hydration (two separate JS engine calls), disagree, and trip a
 * hydration-mismatch warning (confirmed: this is exactly what happened on
 * first pass — React silently overwrote the server-picked variant with
 * the client's different random pick on every skeleton, logged as an
 * error). useId() returns the same string on both passes by construction,
 * so hashing it is stable while still differing across instances. */
function pickVariant(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return 1 + (Math.abs(hash) % 4);
}

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
 *
 * The blob's travel path is one of 4 variants (img-skel-morph-1..4 in
 * globals.css, each its own direction/scale/duration/phase — see that
 * file's comment for why), picked via pickVariant() above so it's stable
 * for the instance's whole lifetime and matches between server and client
 * render. Needs client JS (useId), which is why this is now a client
 * component (it used to be a plain server-renderable one — fine while
 * every instance shared a single animation, not fine once instances
 * needed to differ). Without this variance, every skeleton on a page —
 * e.g. the homepage folder stack's 3 at once — ran the identical
 * keyframes in lockstep, which read as one mechanical effect rather than
 * several independently-drifting ones.
 */
export function ImageSkeleton({ visible }: { visible: boolean }) {
  const variant = pickVariant(useId());
  return (
    <div className="img-skeleton" aria-hidden="true" style={{ opacity: visible ? 1 : 0 }}>
      <span className="img-skeleton-dots" />
      <span className={`img-skeleton-glow img-skeleton-glow-${variant}`} />
    </div>
  );
}
