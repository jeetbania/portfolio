"use client";

import Image from "next/image";
import { PlaceholderCard, useImageCardDials } from "./CaseStudyContent";

/**
 * The big hero image at the top of a case-study page — was previously its
 * own hardcoded copy of PlaceholderCard's markup (same padding/radius
 * numbers, pasted rather than shared), which is why it silently kept the
 * OLD numbers when the "Image Card" dial was tuned: it wasn't actually
 * wired to the same values. Reusing PlaceholderCard + useImageCardDials
 * here instead means the cover now reconnects to the exact same "Case
 * Study" DialKit panel as the section-body images, so a future tuning
 * pass (or these already-baked defaults) applies everywhere at once.
 *
 * Split into its own client component because page.tsx (the Server
 * Component that renders it) can't call the useImageCardDials hook
 * directly.
 */
export default function CaseStudyCover({
  src, alt, tintHex,
}: { src: string; alt: string; tintHex: string }) {
  const dial = useImageCardDials();

  return (
    <div style={{ marginBottom: "64px" }}>
      <PlaceholderCard aspectRatio="16/10" dial={dial} innerBackground={`${tintHex}33`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="900px" priority />
      </PlaceholderCard>
    </div>
  );
}
