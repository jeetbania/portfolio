/**
 * Autoplay/muted/looping hero video, standing in for the usual
 * AnchoredImage hero when a project has one (Project.heroVideo in
 * projects.ts). Used to be plain server-renderable markup, no client JS
 * needed — but that assumed `poster` always resolves to a real file.
 * A project can now have a real video before it has a real poster image
 * (Spaces International, Aug 2026: video was ready, mockups weren't) —
 * for that case, this needs the exact same "missing image reads as still
 * loading, not broken" treatment every other image in the codebase
 * already gets (see ImageSkeleton.tsx, used identically in
 * imageAnchor.tsx's AnchoredImage and Folder.tsx), which needs the
 * onLoad callback below and so needs to be a client component now.
 * autoplay/loop/mute stay plain HTML attributes either way, and the
 * prefers-reduced-motion handling is still pure CSS (see .hero-video in
 * globals.css), not a media-query check in JS.
 *
 * `poster` is required, not optional — it's what paints instantly before
 * the video has downloaded/decoded a frame (much better perceived
 * performance than a blank box), it's what a reduced-motion visitor sees
 * INSTEAD of the video (the CSS rule hides <video>, and this <img> behind
 * it, using the exact same object-fit/position, is what's left visible),
 * and it's what renders if the browser can't play the source at all.
 * Always pass `project.images[0].src`/`.alt`.
 *
 * ── Encoding requirements for the source file ──────────────────────
 * - Format: MP4, H.264 codec, yuv420p pixel format. This is the one
 *   combination every browser autoplays muted without a user gesture —
 *   WebM/VP9 is smaller but Safari's support has historically been spotty,
 *   and this is a background loop, not something worth gambling on.
 * - Strip audio entirely (`-an` in ffmpeg) — it's muted anyway, and an
 *   audio track is pure wasted bytes.
 * - `-movflags +faststart` — moves metadata to the front of the file so
 *   the video can start playing before it's fully downloaded. Without
 *   this the whole file has to arrive first.
 * - Keep the clip SHORT (5-15s) since it loops — a shorter loop is a
 *   smaller file for the same visual result. 1080p (1920px) is plenty;
 *   more is wasted bytes for a background loop nobody examines pixel by
 *   pixel.
 * - Target CRF ~24-28 with `-preset slow` (better compression at the same
 *   quality, encoding just takes longer) — aim for well under 8MB,
 *   ideally 2-5MB.
 *
 * Example ffmpeg command:
 *   ffmpeg -i input.mov -vcodec libx264 -crf 26 -preset slow -an \
 *     -vf scale=1920:-2 -movflags +faststart incore-hero.mp4
 * Or use HandBrake with a "Web" preset at similar settings if you'd
 * rather not use the command line.
 */
"use client";

import { useState } from "react";
import { ImageSkeleton } from "./ImageSkeleton";

export default function HeroVideo({
  src, posterSrc, posterAlt,
}: { src: string; posterSrc: string; posterAlt: string }) {
  // Same loaded/showSkeleton split as AnchoredImage — `loaded` flips the
  // instant onLoad fires, `showSkeleton` lingers 320ms longer so the
  // skeleton's own fade-out transition can finish playing instead of
  // popping off mid-fade, then unmounts for good (no animation running
  // in the background for the rest of the page's life). Never resets on
  // a `posterSrc` change since this component's `src`/`posterSrc` are
  // fixed for its whole mounted lifetime (no gallery/carousel reuse
  // here, unlike AnchoredImage).
  const [loaded, setLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const onLoad = () => {
    setLoaded(true);
    setTimeout(() => setShowSkeleton(false), 320);
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {showSkeleton && <ImageSkeleton visible={!loaded} />}
      {/* eslint-disable-next-line @next/next/no-img-element -- plain img,
          not next/image: this sits permanently behind the video (not just
          as a loading placeholder) as the prefers-reduced-motion fallback,
          so it needs to render identically without depending on next/image's
          client-side behavior. */}
      <img
        src={posterSrc}
        alt={posterAlt}
        onLoad={onLoad}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          opacity: loaded ? 1 : 0, transition: "opacity 280ms var(--ease-out)",
        }}
      />
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={posterSrc}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
