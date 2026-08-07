"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import GradientThumb from "./GradientThumb";

/**
 * A "Listening to..." widget: a fanned stack of album covers that lift on
 * hover with a real frosted-glass frame — click one to switch to a
 * now-playing view.
 *
 * The transition is two choreographed phases, chosen after feedback that
 * the earlier "flip the whole card over" version felt jarring:
 *  1. `pickedIndex` phase (plain CSS, ~180ms) — every album EXCEPT the one
 *     just clicked drops down and fades out (.music-album-exit below),
 *     clearing the stage. The picked cover itself is untouched here.
 *  2. Once the stage is clear, `activeIndex` swaps the view from Browse
 *     to NowPlaying. The picked cover carries a Motion `layoutId` shared
 *     by its counterpart in NowPlaying, so Motion animates it smoothly
 *     from its old grid slot into its new position on the left of the
 *     now-playing layout, rather than either view faking that motion by
 *     hand — this is exactly what shared layout animations are for. The
 *     vinyl then reveals out from directly behind/inside that art and
 *     settles to the right of it (music-vinyl-entering, in globals.css),
 *     with the track text living in its own flex slot further right still
 *     so nothing overlaps it regardless of how the vinyl animates.
 *
 * No real audio, no transport controls — per feedback, the play/pause/
 * skip buttons were unnecessary once there's nothing to actually control;
 * the now-playing view is just the art, the vinyl, and the artist/title.
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

/* How long the "other albums drop away" phase gets to finish (matches
   .music-album-exit's own transition duration, plus a small buffer)
   before the view actually swaps to NowPlaying. */
const EXIT_PHASE_MS = 210;

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
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? order[activeIndex] : null;

  const pick = (i: number) => {
    if (pickedIndex !== null) return;
    setPickedIndex(i);
    setTimeout(() => {
      setActiveIndex(i);
      setPickedIndex(null);
    }, EXIT_PHASE_MS);
  };

  return (
    <div className="music-widget" onPointerDown={e => e.stopPropagation()}>
      <LayoutGroup id="music-widget">
        <AnimatePresence mode="popLayout" initial={false}>
          {active ? (
            <NowPlaying key="playing" track={active} onBack={() => setActiveIndex(null)} />
          ) : (
            <Browse
              key="browse"
              tracks={order}
              pickedIndex={pickedIndex}
              onShuffle={() => setOrder(shuffle(order))}
              onPick={pick}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}

function Browse({
  tracks, pickedIndex, onShuffle, onPick,
}: { tracks: Track[]; pickedIndex: number | null; onShuffle: () => void; onPick: (i: number) => void }) {
  return (
    <div>
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
            className={`music-album ${pickedIndex !== null && pickedIndex !== i ? "music-album-exit" : ""}`}
            onClick={() => onPick(i)}
            disabled={pickedIndex !== null}
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
            <motion.div
              layoutId={`cover-${track.artist}-${track.title}`}
              layout
              style={{ position: "relative", width: "56px", height: "56px", borderRadius: "9px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}
            >
              <GradientThumb colors={track.colors} radius={9} />
            </motion.div>
            <span className="music-album-tooltip">
              {track.artist}<br />
              <strong>{track.title}</strong>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function NowPlaying({ track, onBack }: { track: Track; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.05, duration: 0.2 } }}>
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

      {/* Art + vinyl live inside one fixed-width slot (178px — 108 for the
          art, plus the vinyl's full 96px-wide peek to its right) so the
          text slot after it has a guaranteed real gap no matter how the
          vinyl's own reveal transform moves it — that's what was
          overlapping the track name before. */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ position: "relative", width: "178px", height: "120px", flexShrink: 0 }}>
          <div
            aria-hidden="true"
            className="music-vinyl music-vinyl-entering"
            style={{ position: "absolute", left: "82px", top: "12px", width: "96px", height: "96px" }}
          />
          <motion.div
            layoutId={`cover-${track.artist}-${track.title}`}
            layout
            style={{ position: "absolute", left: 0, top: "6px", width: "108px", height: "108px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.32)", zIndex: 2 }}
          >
            <GradientThumb colors={track.colors} radius={12} />
          </motion.div>
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--col-muted)", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {track.artist}
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--canvas-ink-strong)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {track.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
