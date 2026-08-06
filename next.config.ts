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
  },
};

export default nextConfig;
