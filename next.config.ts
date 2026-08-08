import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* There's an unrelated package.json/package-lock.json in the home
     directory (outside this project entirely), and Turbopack's
     workspace-root auto-detection walks up and finds it, which is wrong
     for this project and throws a build-time warning. Pinning the root
     here to this directory removes the ambiguity. */
  turbopack: {
    root: __dirname,
  },
  images: {
    /* Next's Image Optimization re-encodes every served image at
       `quality: 75` by default — even when the source is an already-
       compressed WebP — which was visibly softening the YAP Global case
       study photos on top of their own compression. Next 16 requires any
       non-default quality used by an `<Image quality={N}>` to be listed
       here first. 75 stays allowed since most `<Image>`s across the site
       don't pass `quality` explicitly and fall back to it; 85 is what
       AnchoredImage (src/lib/imageAnchor.tsx) — the shared renderer for
       every case-study image — asks for instead. */
    qualities: [75, 85],
    /* Was unset (Next's own default), which produced `Cache-Control:
       public, max-age=0, must-revalidate` on every /_next/image response —
       every single view of a case-study photo, including navigating back
       to a page you'd already loaded, forced a fresh round-trip to check
       "did this change?" (confirmed via curl against production, Aug
       2026). A full ETag-checked revalidation is cheap on its own (a few
       hundred ms, no re-download), but it's a real, measurable delay when
       a dozen images are doing it at once on the /work grid, and it's
       what Jeet was noticing. 1 day (not longer): this project's actual
       workflow is re-uploading a photo under the SAME filename after
       recompressing it, so a visitor who loaded a page recently could
       keep seeing a stale image for up to this window — a day bounds
       that risk while still killing the "revalidate on literally every
       view" overhead for anyone browsing around within the same day. */
    minimumCacheTTL: 86400,
  },
  /* Raw static files in public/ (case-study photos next/image doesn't
     touch on their original path, hero videos, everything) had the exact
     same max-age=0 problem as the images.minimumCacheTTL above, for the
     same reason (no override = Vercel's conservative default for
     unhashed filenames) and the same fix, for the same 1-day-not-longer
     reasoning. */
  async headers() {
    return [
      {
        source: "/:path*.:ext(webp|jpg|jpeg|png|mp4|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
