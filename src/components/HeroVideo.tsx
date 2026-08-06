/**
 * Autoplay/muted/looping hero video, standing in for the usual
 * AnchoredImage hero when a project has one (Project.heroVideo in
 * projects.ts). Plain server-renderable markup, no client JS needed:
 * autoplay/loop/mute are just HTML attributes, and the
 * prefers-reduced-motion handling below is pure CSS (see .hero-video in
 * globals.css) rather than a media-query check in JS.
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
export default function HeroVideo({
  src, posterSrc, posterAlt,
}: { src: string; posterSrc: string; posterAlt: string }) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- plain img,
          not next/image: this sits permanently behind the video (not just
          as a loading placeholder) as the prefers-reduced-motion fallback,
          so it needs to render identically without depending on next/image's
          client-side behavior. */}
      <img
        src={posterSrc}
        alt={posterAlt}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
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
