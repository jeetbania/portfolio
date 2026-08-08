export interface Interaction {
  id: string;
  /** Short caption shown on the card and used as the video's aria-label —
   * what the interaction is, not a full case-study description. */
  title: string;
  /** /interactions/<file>.mp4 — same compression recipe as case-study
   * hero videos (see CLAUDE.md / HeroVideo.tsx): H.264, no audio track,
   * short loop, faststart. */
  video: string;
  /** Optional still frame shown before the video loads. Falls back to
   * the video's own first frame (browsers paint that automatically)
   * when omitted, so this is a nice-to-have, not a requirement. */
  poster?: string;
  /** The tweet this clip was originally posted to — the whole card
   * links out here. */
  tweetUrl: string;
}

/**
 * The "Interactions" tab on /work (src/components/WorkPageBody.tsx) — a
 * feed of short muted autoplaying UI-animation clips, each linking out to
 * the tweet it was posted to. Empty for now: Jeet hasn't picked which
 * clips to feature or exported/compressed them yet (Aug 2026). Add
 * entries here once he has — drop the compressed .mp4 in public/interactions/,
 * fill in the tweet URL — and InteractionsGrid picks it up automatically,
 * no other code changes needed. Until then it shows an honest "coming
 * soon" empty state rather than placeholder/fake content.
 */
export const interactions: Interaction[] = [];
