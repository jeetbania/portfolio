export interface Interaction {
  id: string;
  /** Not shown on the card itself (Jeet didn't want a caption overlay) —
   * only used to build the video's aria-label, so it still needs to be a
   * clear, short description of what the interaction is. */
  title: string;
  /** /<file>.mp4 — flat in public/ like every other video on this site
   * (case-study heroes included), not a subfolder. Same compression
   * recipe: H.264, no audio track, faststart. */
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
 * the tweet it was posted to. First two real clips landed Aug 2026, both
 * from source screen recordings Jeet supplied (Downloads/Interactions/):
 * 60fps H.264 exports at 11.6Mbps/2506x1410 (Checklist, 24.6MB) and
 * 19.8Mbps/3744x1856 (Slot Machine, 45.2MB) — recompressed to 1920px-wide
 * 30fps H.264, audio stripped (cards autoplay muted, so the AAC track was
 * dead weight), landing at ~1.5MB/1.35MB (~94% smaller), full-decode-
 * validated with no visible artifacting on either even at full pixel
 * zoom. 1920px (not the original 1280px pass) specifically because these
 * now render as a single full-width card in a vertical stack rather than
 * a half-width grid cell — needed the extra resolution headroom to stay
 * sharp at that size.
 *
 * Ordered NEWEST FIRST — this array's order is the display order, there's
 * no separate date field. Add new entries at the TOP of this array (not
 * the bottom) as Jeet posts new clips; drop the compressed .mp4 flat in
 * public/, fill in the tweet URL, done.
 */
export const interactions: Interaction[] = [
  {
    id: "slot-machine",
    title: "Slot machine UI",
    video: "/interaction-slot-machine.mp4",
    tweetUrl: "https://x.com/figmajeet/status/2082860943504216286?s=20",
  },
  {
    id: "checklist",
    title: "Daily checklist",
    video: "/interaction-checklist.mp4",
    tweetUrl: "https://x.com/figmajeet/status/2076921912694063302?s=20",
  },
];
