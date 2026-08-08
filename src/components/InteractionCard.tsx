"use client";

import type { Interaction } from "@/data/interactions";

/**
 * One clip in the /work "Interactions" tab (see InteractionsGrid.tsx) —
 * autoplaying, muted, looping video, whole card links out to the tweet it
 * was posted to. `muted` + `playsInline` are both load-bearing: without
 * `muted` most browsers block autoplay outright, and without `playsInline`
 * iOS Safari forces the video into fullscreen the instant it starts.
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
        borderRadius: "20px",
        overflow: "hidden",
        background: "var(--surface-card-tinted)",
        border: "1px solid var(--surface-card-border)",
        boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.06), var(--glass-bevel)",
        animation: "work-item-in 460ms var(--ease-spring) both",
        animationDelay: `${index * 45}ms`,
      }}
      onAnimationEnd={e => { e.currentTarget.style.animation = "none"; }}
    >
      {/* Decorative — the caption chip below carries the accessible name
          via the wrapping <a>'s aria-label, so the video itself stays out
          of the a11y tree rather than being announced twice. */}
      <video
        src={interaction.video}
        poster={interaction.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "auto", background: "var(--surface-wash)" }}
      />

      <div style={{
        position: "absolute", left: "14px", bottom: "14px",
        display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 8px 8px 14px", borderRadius: "99px",
        background: "var(--surface-opaque)",
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
        border: "1px solid var(--surface-glass-border)",
        boxShadow: "var(--glass-bevel)",
      }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", fontWeight: 500, color: "var(--col-fg)" }}>
          {interaction.title}
        </span>
        <span className="interaction-card-badge" style={{
          display: "grid", placeItems: "center", width: "22px", height: "22px",
          borderRadius: "50%", background: "var(--surface-glass-strong)", color: "var(--col-fg)",
          flexShrink: 0,
        }}>
          <svg width="10" height="10" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M3 12 12 3M12 3H5M12 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  );
}
