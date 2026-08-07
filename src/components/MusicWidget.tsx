"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import GradientThumb from "./GradientThumb";
import { ImageSkeleton } from "./ImageSkeleton";
import { useIsMobile } from "@/lib/useIsMobile";
import { TRACKS, type Track } from "@/data/music";

/**
 * A "Listening to..." widget: a fanned stack of album covers that lift on
 * hover with a real frosted-glass frame — click one to switch to a
 * now-playing view.
 *
 * The transition is two phases:
 *  1. `pickedIndex` phase (~180ms) — every album EXCEPT the one just
 *     clicked drops down and fades out (.music-album-exit below),
 *     clearing the stage. The picked cover itself sits untouched here.
 *  2. Once the stage is clear, `activeIndex` swaps Browse for NowPlaying,
 *     which cross-fades in (.music-widget-fade) while the vinyl reveals
 *     out from directly behind/inside the art and settles to its right
 *     (music-vinyl-entering, in globals.css).
 *
 * An earlier version tried to make the picked album's cover literally fly
 * from its grid slot into the now-playing layout using a Motion shared
 * `layoutId` across the view swap. In testing that produced a real,
 * ugly glitch — the card's own background box would desync from its
 * content for a beat (visibly taller, torn away from the pills above it)
 * before snapping to the right size, because the shared-layout animation
 * and this auto-height, non-`layout` card were fighting over how tall the
 * widget should be mid-transition. The fix here is deliberately boring
 * instead: `bodyRef`'s own height is measured off the new content
 * (`contentRef.scrollHeight`) and animated with a single plain CSS
 * `transition: height`, no layout-projection system involved — a value
 * that can't disagree with itself.
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
 * On mobile (useIsMobile()) this renders a genuinely different, smaller
 * structure — a single-cover teaser pill sitting just above the zoom
 * controls — rather than a shrunk copy of the full widget, which never
 * fit well at phone width and collided with other overlay chrome up top.
 * Tapping the teaser expands into the exact same Browse/NowPlaying UI
 * everyone else sees; `mobileExpanded` only toggles which of the two
 * renders, it never resets `order`/`activeIndex`/`pickedIndex` — so
 * whichever track was playing (or wasn't) survives collapsing the panel
 * back down.
 *
 * The album row's own sizing (cover size, overlap, radius) is driven by
 * CSS container query units (cqw), not fixed pixel values computed in
 * JS — see .music-widget's `container-type` and .music-album-cover in
 * globals.css. Hardcoded pixel math here TWICE undershot or overshot the
 * widget's actual rendered width (once too cramped, then overflowing the
 * card entirely) because it was guessing at a width instead of being
 * anchored to it; cqw units are relative to the widget's REAL content
 * width at all times; mobile expanded panel, that same math self-adjusts.
 *
 * Track data (artist/title/spotifyUrl/cover) lives in src/data/music.ts,
 * not here — same "don't invent a parallel data source" convention as
 * projects.ts/blog.ts. A track renders its real `cover` image (from
 * public/albums/) via AlbumArt below when one's set, falling back to a
 * GradientThumb blob (already used for blog placeholder covers) built
 * from `colors` otherwise — so placeholder tracks read honestly as
 * placeholders, not fake specific albums, until real art exists.
 */

const DEFAULT_COLORS: readonly [string, string, string] = ["#8A8A92", "#B8B8C0", "#4A4A52"];

/** Real cover art if `track.cover` is set, else a gradient placeholder.
 * Real covers get the same dot-morph loading skeleton used everywhere
 * else on the site (ImageSkeleton, imageAnchor.tsx) — real photo files
 * can take a beat, and this reads as "the photo hasn't arrived yet"
 * instead of a blank flash. Each call site (Browse's small cover,
 * NowPlaying's bigger one) gets its own independent load/skeleton state,
 * since they're separate <Image> requests (usually resolved instantly
 * from cache on the second one, but not assumed here). */
function AlbumArt({ track, radius }: { track: Track; radius: number }) {
  const [loaded, setLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => setShowSkeleton(false), 320);
    return () => clearTimeout(t);
  }, [loaded]);

  if (!track.cover) {
    return <GradientThumb colors={track.colors ?? DEFAULT_COLORS} radius={radius} />;
  }

  return (
    <>
      {showSkeleton && <ImageSkeleton visible={!loaded} />}
      <Image
        src={`/albums/${track.cover}`}
        alt={`${track.title} by ${track.artist}`}
        fill
        className="object-cover"
        sizes="140px"
        draggable={false}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 280ms var(--ease-out)" }}
      />
    </>
  );
}

/* Standard cross-browser line-clamp trick (Chrome/Safari/Firefox all
   support the -webkit- prefixed properties now, including Firefox since
   2023) — wraps to at most 2 lines, ellipsis-truncates anything past
   that. Takes a base style object so callers can still set their own
   font/color/margin alongside it. */
function lineClamp2(base: React.CSSProperties): React.CSSProperties {
  return {
    ...base,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

/* How long the pick phase gets to finish before the view actually swaps
   to NowPlaying — matches .music-album-flip-pick's own animation
   duration (the OTHER albums' drop-away is quicker and comfortably
   finishes within this window too). */
const EXIT_PHASE_MS = 420;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MusicWidget() {
  const isMobile = useIsMobile();
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [order, setOrder] = useState(TRACKS);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const active = activeIndex !== null ? order[activeIndex] : null;

  const pick = (i: number) => {
    if (pickedIndex !== null) return;
    setPickedIndex(i);
    setTimeout(() => {
      setActiveIndex(i);
      setPickedIndex(null);
    }, EXIT_PHASE_MS);
  };

  /* Re-measures and animates the card's own height to match whichever
     view is now showing — see the file-level comment for why this is a
     plain CSS height transition rather than a Motion layout animation. */
  useLayoutEffect(() => {
    if (bodyRef.current && contentRef.current) {
      bodyRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, [active]);

  // Mobile only: tap outside the expanded panel to collapse it back to
  // the single-cover teaser — same convention as BackgroundPicker's own
  // mobile expand panel.
  useEffect(() => {
    if (!isMobile || !mobileExpanded) return;
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMobileExpanded(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [isMobile, mobileExpanded]);

  if (isMobile && !mobileExpanded) {
    // Teaser shows whatever's actually going on — the active track's
    // cover if one's picked, otherwise just the first in the current
    // order — so re-opening the panel doesn't feel like it "reset."
    const previewTrack = active ?? order[0];
    return (
      <div ref={wrapRef} onPointerDown={e => e.stopPropagation()}>
        <button
          type="button"
          className="music-widget-collapsed"
          onClick={() => setMobileExpanded(true)}
          aria-label={active ? `Now playing: ${active.title} by ${active.artist}. Tap to open.` : "Open the music widget"}
        >
          <div className="music-widget-collapsed-art">
            <AlbumArt track={previewTrack} radius={11} />
          </div>
          <span className="music-widget-collapsed-label">{active ? active.title : "Listening to…"}</span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 7.5 6 4l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="music-widget" onPointerDown={e => e.stopPropagation()}>
      {isMobile && (
        <button type="button" className="music-widget-minimize" onClick={() => setMobileExpanded(false)} aria-label="Minimize the music widget">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <div ref={bodyRef} className="music-widget-body">
        <div ref={contentRef} key={active ? "playing" : "browse"} className="music-widget-fade">
          {active ? (
            <NowPlaying track={active} onBack={() => setActiveIndex(null)} />
          ) : (
            <Browse
              tracks={order}
              pickedIndex={pickedIndex}
              onShuffle={() => setOrder(shuffle(order))}
              onPick={pick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Browse({
  tracks, pickedIndex, onShuffle, onPick,
}: { tracks: Track[]; pickedIndex: number | null; onShuffle: () => void; onPick: (i: number) => void }) {
  // Drives the play-button hover cue via real React state instead of a
  // pure CSS :hover selector — belt-and-suspenders after that CSS-only
  // version reportedly wasn't showing up for a real visitor. State tied
  // to a plain mouse enter/leave is unambiguous: it either did or didn't
  // fire, no cascade/selector-matching to second-guess.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      {/* Cover size/overlap/radius all come from .music-album-cover in
          globals.css via container-query (cqw) units, NOT fixed pixel
          values computed here — see the file-level comment for why:
          hardcoded px math has already broken twice (too small, then
          overflowing) by guessing at the widget's width instead of
          being anchored to its real, current one. justify-content:
          center is what gives it even breathing room on both sides. */}
      <div className="music-album-row">
        {tracks.map((track, i) => (
          <button
            key={track.artist + track.title}
            className={`music-album ${
              pickedIndex === i ? "music-album-flip-pick"
                : pickedIndex !== null ? "music-album-exit"
                : ""
            }`}
            onClick={() => onPick(i)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(h => (h === i ? null : h))}
            disabled={pickedIndex !== null}
            style={{
              zIndex: i,
              // A custom property, not a literal `transform` — the hover
              // rule in globals.css needs to ADD a lift on top of this
              // same rotation, not replace it, and CSS can't otherwise
              // reach into a value React computed per-card.
              ["--album-rotate" as string]: `${(i - (tracks.length - 1) / 2) * 3.5}deg`,
            } as React.CSSProperties}
            aria-label={`Play ${track.title} by ${track.artist}`}
          >
            <div className="music-album-cover">
              <AlbumArt track={track} radius={14} />
              {/* Hover-only "click me" cue — replaces the old tooltip
                  (removed per feedback, wasn't needed) and the plain
                  translucent border (also removed — this reads as an
                  actual affordance instead of just a highlighted edge).
                  opacity driven by `hoveredIndex` state, not CSS :hover —
                  see the comment on that state above. */}
              <span className="music-album-play-hint" aria-hidden="true" style={{ opacity: hoveredIndex === i ? 1 : 0 }}>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M3.2 2 9.6 6 3.2 10V2Z" fill="#fff" />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function NowPlaying({ track, onBack }: { track: Track; onBack: () => void }) {
  return (
    <div>
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
          <div style={{ position: "absolute", left: 0, top: "6px", width: "108px", height: "108px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.32)", zIndex: 2 }}>
            <AlbumArt track={track} radius={12} />
          </div>
        </div>

        {/* Real artist/title text varies a lot in length ("Blue" vs.
            "Nusrat Fateh Ali Khan") — wraps up to 2 lines and clips with
            an ellipsis past that (the standard cross-browser line-clamp
            technique), instead of the old single-line ellipsis, which cut
            longer names off almost immediately. The widget's own height
            already adapts to whatever this ends up needing (see the
            useLayoutEffect above), so 2 lines here just means a slightly
            taller card, not a layout break. */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={lineClamp2({ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--col-muted)", margin: "0 0 3px", lineHeight: 1.3 })}>
            {track.artist}
          </p>
          <p style={lineClamp2({ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--canvas-ink-strong)", margin: 0, lineHeight: 1.25 })}>
            {track.title}
          </p>
        </div>
      </div>
    </div>
  );
}
