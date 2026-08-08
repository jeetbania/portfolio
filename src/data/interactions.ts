export interface Interaction {
  id: string;
  /** Short caption shown on the card and used as the video's aria-label —
   * what the interaction is, not a full case-study description. */
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
 * 19.8Mbps/3744x1856 (Slot Machine, 45.2MB) — recompressed to 1280px-wide
 * 30fps H.264, audio stripped (cards autoplay muted, so the AAC track was
 * dead weight), landing at 574KB and 464KB respectively (~98% smaller),
 * full-decode-validated with no visible artifacting on either. Add more
 * entries here the same way — drop the compressed .mp4 flat in public/,
 * fill in the tweet URL — and InteractionsGrid picks it up automatically.
 */
export const interactions: Interaction[] = [
  {
    id: "checklist",
    title: "Daily checklist",
    video: "/interaction-checklist.mp4",
    tweetUrl: "https://x.com/figmajeet/status/2076921912694063302?s=20",
  },
  {
    id: "slot-machine",
    title: "Slot machine UI",
    video: "/interaction-slot-machine.mp4",
    tweetUrl: "https://x.com/figmajeet/status/2082860943504216286?s=20",
  },
];
