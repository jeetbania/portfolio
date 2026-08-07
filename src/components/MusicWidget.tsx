"use client";

import { useState } from "react";
import GradientThumb from "./GradientThumb";

/**
 * A "Listening to..." widget copied off a reference almost exactly: a
 * fanned stack of album covers that lift (now with a real frosted-glass
 * hover, not just a bare transform) — click one and it flips on its Y
 * axis like turning a sleeve over, then the panel morphs into a
 * now-playing view where a vinyl record rolls out from behind the album
 * art and spins continuously, like it just started playing.
 *
 * No real audio, no transport controls — per feedback, the play/pause/
 * skip buttons were unnecessary once there's nothing to actually control;
 * the now-playing view is just the art, the spinning vinyl, and the
 * artist/title, which is closer to a glance-able "what's on" widget than
 * a player anyway.
 *
 * Anchored to the canvas viewport's own corner via InfiniteCanvas's
 * `overlay` prop (see PlaygroundCanvas.tsx) — a persistent piece of
 * furniture, not a card that scatters around the world like everything
 * else on the board.
 *
 * Placeholder tracks/art only, per request — swap TRACKS below once real
 * songs/covers/Spotify links exist. Cover art is GradientThumb (already
 * used for blog placeholder covers) rather than any stock photo, since
 * there's no real art to show yet and a soft gradient blob reads
 * honestly as "placeholder," not as a fake specific album.
 */

type Track = {
  artist: string;
  title: string;
  colors: readonly [string, string, string];
  spotifyUrl?: string;
};

const TRACKS: Track[] = [
  { artist: "Night Static", title: "Overdrive", colors: ["#6C4FD1", "#A79AFF", "#2A1D5C"] },
  { artist: "Paper Cranes", title: "Low Tide", colors: ["#1F9D55", "#6EDB98", "#0E4A28"] },
  { artist: "Radio Silence", title: "Fast Forward", colors: ["#E8734A", "#F5C15A", "#7A2E12"] },
  { artist: "Sunday Static", title: "Afterglow", colors: ["#C23B6B", "#F58FB0", "#5C1230"] },
  { artist: "The Long Way", title: "Home Movies", colors: ["#C77D11", "#F5C15A", "#5C3A08"] },
  { artist: "Nova & Wren", title: "Static Bloom", colors: ["#2563C7", "#6FA8F5", "#12245C"] },
];

/* Matches the .music-album-flip CSS animation's own duration — the
   Browse view keeps rendering (playing the flip) for exactly this long
   before MusicWidget swaps it out for NowPlaying. */
const FLIP_DURATION_MS = 420;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MusicWidget() {
  const [order, setOrder] = useState(TRACKS);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? order[activeIndex] : null;

  const pick = (i: number) => {
    if (flippingIndex !== null) return;
    setFlippingIndex(i);
    setTimeout(() => {
      setActiveIndex(i);
      setFlippingIndex(null);
    }, FLIP_DURATION_MS);
  };

  return (
    <div className="music-widget" onPointerDown={e => e.stopPropagation()}>
      {active ? (
        <NowPlaying track={active} onBack={() => setActiveIndex(null)} />
      ) : (
        <Browse tracks={order} flippingIndex={flippingIndex} onShuffle={() => setOrder(shuffle(order))} onPick={pick} />
      )}
    </div>
  );
}

function Browse({
  tracks, flippingIndex, onShuffle, onPick,
}: { tracks: Track[]; flippingIndex: number | null; onShuffle: () => void; onPick: (i: number) => void }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "19px", color: "var(--canvas-ink-strong)" }}>
          Listening to…
        </span>
        <button className="music-pill" onClick={onShuffle}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M12.5 4A5.5 5.5 0 1 0 13.4 7.6M12.5 1V4H9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Refresh
        </button>
      </div>
      <div className="music-album-row" style={{ display: "flex", paddingBottom: "8px" }}>
        {tracks.map((track, i) => (
          <button
            key={track.artist + track.title}
            className={`music-album ${flippingIndex === i ? "music-album-flipping" : ""}`}
            onClick={() => onPick(i)}
            style={{
              marginLeft: i === 0 ? 0 : "-30px",
              zIndex: i,
              // A custom property, not a literal `transform` — the hover
              // rule in globals.css needs to ADD a lift on top of this
              // same rotation, not replace it, and CSS can't otherwise
              // reach into a value React computed per-card.
              ["--album-rotate" as string]: `${(i - (tracks.length - 1) / 2) * 3.5}deg`,
            } as React.CSSProperties}
            aria-label={`Play ${track.title} by ${track.artist}`}
          >
            <div style={{ position: "relative", width: "56px", height: "56px", borderRadius: "9px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
              <GradientThumb colors={track.colors} radius={9} />
            </div>
            <span className="music-album-tooltip">
              {track.artist}<br />
              <strong>{track.title}</strong>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

function NowPlaying({ track, onBack }: { track: Track; onBack: () => void }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <button className="music-pill" onClick={onBack}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M7.5 2 3 6l4.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <a
          className="music-pill"
          href={track.spotifyUrl ?? "#"}
          target={track.spotifyUrl ? "_blank" : undefined}
          rel="noreferrer"
          onClick={e => { if (!track.spotifyUrl) e.preventDefault(); }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.59 14.4a.62.62 0 0 1-.85.21c-2.33-1.43-5.27-1.75-8.72-.96a.63.63 0 0 1-.28-1.22c3.78-.87 7.02-.5 9.64 1.12.3.18.39.57.21.85Zm1.22-2.72a.77.77 0 0 1-1.06.26c-2.67-1.64-6.73-2.12-9.88-1.16a.78.78 0 1 1-.45-1.49c3.6-1.09 8.08-.56 11.14 1.32.36.22.48.7.25 1.07Zm.1-2.83c-3.2-1.9-8.49-2.08-11.55-1.15a.93.93 0 1 1-.54-1.78c3.51-1.06 9.34-.86 13.03 1.33a.93.93 0 0 1-.94 1.6Z" />
          </svg>
          See on Spotify ↗
        </a>
      </div>

      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <div style={{ position: "relative", width: "108px", height: "108px", flexShrink: 0 }}>
          <div
            aria-hidden="true"
            className="music-vinyl music-vinyl-entering"
            style={{ position: "absolute", right: "-34px", top: "16px", width: "96px", height: "96px" }}
          />
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.32)" }}>
            <GradientThumb colors={track.colors} radius={12} />
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--col-muted)", margin: "0 0 2px" }}>
            {track.artist}
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--canvas-ink-strong)", margin: 0 }}>
            {track.title}
          </p>
        </div>
      </div>
    </>
  );
}
