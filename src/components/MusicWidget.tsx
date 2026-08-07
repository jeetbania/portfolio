"use client";

import { useEffect, useState } from "react";
import GradientThumb from "./GradientThumb";

/**
 * A "Listening to..." widget copied off a reference almost exactly:
 * a fanned stack of album covers that lift on hover, click one to morph
 * the whole panel into a now-playing view (album art + a vinyl record
 * peeking out behind it, track info, a Spotify link, transport
 * controls). Real audio playback isn't wired up — no licensed audio to
 * actually play, and this is a personal-site widget, not a music app —
 * but the PLAY button isn't just decorative either: it spins the vinyl
 * and ticks a real elapsed-time counter via setInterval, which gets you
 * most of the "this feels alive" payoff without needing an actual
 * <audio> element or hosted track files.
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
  duration: number; // seconds, kept short since this is a simulated preview, not a real track
  spotifyUrl?: string;
};

const TRACKS: Track[] = [
  { artist: "Night Static", title: "Overdrive", colors: ["#6C4FD1", "#A79AFF", "#2A1D5C"], duration: 24 },
  { artist: "Paper Cranes", title: "Low Tide", colors: ["#1F9D55", "#6EDB98", "#0E4A28"], duration: 21 },
  { artist: "Radio Silence", title: "Fast Forward", colors: ["#E8734A", "#F5C15A", "#7A2E12"], duration: 18 },
  { artist: "Sunday Static", title: "Afterglow", colors: ["#C23B6B", "#F58FB0", "#5C1230"], duration: 26 },
  { artist: "The Long Way", title: "Home Movies", colors: ["#C77D11", "#F5C15A", "#5C3A08"], duration: 22 },
  { artist: "Nova & Wren", title: "Static Bloom", colors: ["#2563C7", "#6FA8F5", "#12245C"], duration: 20 },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

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
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const active = activeIndex !== null ? order[activeIndex] : null;

  useEffect(() => {
    if (!playing || !active) return;
    const id = setInterval(() => {
      setElapsed(e => (e + 1 >= active.duration ? 0 : e + 1));
    }, 1000);
    return () => clearInterval(id);
  }, [playing, active]);

  const pick = (i: number) => {
    setActiveIndex(i);
    setElapsed(0);
    setPlaying(false);
  };

  const step = (dir: 1 | -1) => {
    if (activeIndex === null) return;
    const next = (activeIndex + dir + order.length) % order.length;
    pick(next);
  };

  return (
    <div className="music-widget" onPointerDown={e => e.stopPropagation()}>
      {active ? (
        <NowPlaying
          track={active}
          playing={playing}
          elapsed={elapsed}
          onBack={() => setActiveIndex(null)}
          onTogglePlay={() => setPlaying(p => !p)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      ) : (
        <Browse tracks={order} onShuffle={() => setOrder(shuffle(order))} onPick={pick} />
      )}
    </div>
  );
}

function Browse({ tracks, onShuffle, onPick }: { tracks: Track[]; onShuffle: () => void; onPick: (i: number) => void }) {
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
      <div style={{ display: "flex", paddingBottom: "8px" }}>
        {tracks.map((track, i) => (
          <button
            key={track.artist + track.title}
            className="music-album"
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

function NowPlaying({
  track, playing, elapsed, onBack, onTogglePlay, onPrev, onNext,
}: {
  track: Track; playing: boolean; elapsed: number;
  onBack: () => void; onTogglePlay: () => void; onPrev: () => void; onNext: () => void;
}) {
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
            className={playing ? "music-vinyl music-vinyl-spinning" : "music-vinyl"}
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
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--canvas-ink-strong)", margin: "0 0 8px" }}>
            {track.title}
          </p>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "11.5px", color: "var(--col-muted)",
            margin: "0 0 12px", fontVariantNumeric: "tabular-nums",
          }}>
            {formatTime(elapsed)} / {formatTime(track.duration)}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button className="music-transport" onClick={onPrev} aria-label="Previous track">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M4 2v10M12 3 5 7l7 4V3Z" /></svg>
            </button>
            <button className="music-transport music-transport-play" onClick={onTogglePlay} aria-label={playing ? "Pause" : "Play"}>
              {playing ? (
                <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3" height="10" rx="1" /><rect x="8" y="2" width="3" height="10" rx="1" /></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M3.5 2.3v9.4a.8.8 0 0 0 1.22.68l7.6-4.7a.8.8 0 0 0 0-1.36l-7.6-4.7a.8.8 0 0 0-1.22.68Z" /></svg>
              )}
            </button>
            <button className="music-transport" onClick={onNext} aria-label="Next track">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M10 2v10M2 3l7 4-7 4V3Z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
