"use client";

import { useEffect, useState } from "react";

/**
 * Gates the two floating dev tools (AnchorToggle in imageAnchor.tsx,
 * ContentEditorToggle in contentEditor.tsx) so they never render on the
 * real production site. Both used to bail out on `NODE_ENV === "production"`,
 * but that check got removed because Next sets NODE_ENV=production for
 * EVERY `next build` output — Vercel preview deployments included — so it
 * was hiding the tools on preview too, not just prod, which is where this
 * workflow (edit in a live deployment, "Copy JSON", hand the values back)
 * actually needs them. Result: with no check at all, both tools were
 * rendering on jeetcreates.cc itself. Not acceptable — per Jeet, these must
 * never appear on the main site, without having to ask each time.
 *
 * Hostname is the one signal that actually distinguishes "the real
 * production domain" from "a preview deployment or local dev", and it
 * doesn't depend on Vercel dashboard configuration (e.g. whether System
 * Environment Variables are exposed to the client) the way NEXT_PUBLIC_
 * VERCEL_ENV would. Defaults to `false` (hidden) so the server-rendered
 * pass and the client's first render agree — no hydration mismatch — then
 * flips true post-mount if the hostname isn't the production one. A real
 * visitor on jeetcreates.cc never sees so much as a flash of either tool.
 */
const PRODUCTION_HOST_SUFFIX = "jeetcreates.cc";

export function useDevToolsAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(!window.location.hostname.endsWith(PRODUCTION_HOST_SUFFIX));
  }, []);
  return allowed;
}
