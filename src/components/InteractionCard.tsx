"use client";

import type { Interaction } from "@/data/interactions";

/**
 * One clip in the /work "Interactions" tab (see InteractionsGrid.tsx) —
 * autoplaying, muted, looping video, whole card links out to the tweet it
 * was posted to. `muted` + `playsInline` are both load-bearing: without
 * `muted` most browsers block autoplay outright, and without `playsInline`
 * iOS Safari forces the video into fullscreen the instant it starts.
 *
 * Card is a fixed 16:9 box regardless of the source clip's own aspect
 * ratio, with the video `object-fit: cover`'d into it — the old
 * `height: "auto"` (natural aspect) approach let each clip's own ratio
 * decide the card's height, and since the two source clips don't share
 * an aspect ratio, a CSS grid with default `align-items: stretch`
 * stretched the shorter card's box to match its row-mate, exposing a
 * blank strip of the card's own background below the video. A fixed
 * aspect-ratio box sidesteps that entirely: every card is the same
 * shape no matter what the source footage looks like. Source videos are
 * exported at 1920px wide specifically so this holds up uncropped-looking
 * and sharp even when a card renders near full container width, not just
 * at grid-cell size.
 *
 * No caption overlay — per Jeet, the clip's title isn't needed on the
 * card itself. The accessible name still lives in the wrapping <a>'s
 * aria-label, and the hover lift + deeper shadow (see .interaction-card
 * in globals.css) is the only affordance that this links out.
 */
export default function InteractionCard({ interaction, index }: { interaction: Interaction; index: number }) {
  return (
    <a
      href={interaction.tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${interaction.title}, view the original post`}
      className="interaction-card"
      style={{
        display: "block",
        position: "relative",
        aspectRatio: "16 / 9",
        borderRadius: "20px",
        overflow: "hidden",
        background: "var(--surface-card-tinted)",
        border: "1px solid var(--surface-card-border)",
        boxShadow: "0 4px 14px rgba(var(--shadow-tint-rgb),0.10), 0 1px 3px rgba(var(--shadow-tint-rgb),0.08)",
        animation: "work-item-in 460ms var(--ease-spring) both",
        animationDelay: `${index * 45}ms`,
      }}
      onAnimationEnd={e => { e.currentTarget.style.animation = "none"; }}
    >
      <video
        src={interaction.video}
        poster={interaction.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{
          display: "block", position: "absolute", inset: 0,
          width: "100%", height: "100%", objectFit: "cover",
          background: "var(--surface-wash)",
        }}
      />
    </a>
  );
}
