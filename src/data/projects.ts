import type { FocalPoint } from "@/lib/imageAnchor";

export interface ProjectImage {
  src: string;
  alt: string;
  /** Where CaseStudyCover.tsx anchors this image inside its (usually
   * cropped) hero frame — see src/lib/imageAnchor.tsx. Omit for dead
   * center. */
  focalPoint?: FocalPoint;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tint: string;          // CSS custom property name
  tintHex: string;       // Raw hex for inline acrylic tint
  images: ProjectImage[];
  tags: string[];
  /**
   * Optional autoplay/muted/looping hero video (CaseStudyCover.tsx),
   * shown instead of images[0] at the top of the case-study page.
   * images[0] still MUST exist and be a real photo regardless — it's
   * the video's `poster` (visible while the video loads, and permanently
   * for prefers-reduced-motion visitors and the homepage folder-card
   * thumbnail, which never plays video). See src/components/HeroVideo.tsx
   * for encoding requirements (MP4/H.264, no audio track, short loop).
   */
  heroVideo?: string;
}

export const projects: Project[] = [
  {
    slug: "incore",
    title: "InCore",
    description: "Chennai-based RISC-V processor IP company, redesigned around a new flagship product.",
    tint: "var(--folder-incore)",
    tintHex: "#B8F0D8",
    /* images[0] is also the case-study hero (page.tsx reads it directly),
       heroVideo's poster frame (paints before the video loads, and is
       what a prefers-reduced-motion visitor sees instead of it — see
       HeroVideo.tsx), and the homepage folder-card thumbnail (which never
       plays video). incore-approach.webp is standing in as all three for
       now rather than a real still pulled from the video itself — swap
       it for one anytime; every case-study page reads it straight from
       here. */
    images: [
      { src: "/incore-approach.webp",   alt: "InCore website, approach mockup" },
      { src: "/incore-showcase-1.webp", alt: "InCore website, showcase mockup" },
      { src: "/incore-showcase-3.webp", alt: "InCore website, showcase mockup" },
    ],
    tags: ["UX Design", "Content Strategy"],
    heroVideo: "/incore-hero.mp4",
  },
  {
    slug: "migrateful",
    title: "Migrateful",
    description: "Community cooking events connecting migrants with local residents.",
    tint: "var(--folder-migrateful)",
    tintHex: "#D4C9F5",
    images: [
      { src: "/kitchen.png",   alt: "Migrateful cooking event" },
      { src: "/kitchen-1.jpg", alt: "Participants cooking together" },
      { src: "/kitchen-2.jpg", alt: "Kitchen scene" },
    ],
    tags: ["UX Design", "Branding"],
  },
  {
    slug: "yap-global",
    title: "YAP Global",
    description: "International PR agency for crypto and Web3 companies, rebranded and rebuilt against a hard conference deadline.",
    tint: "var(--folder-yap)",
    tintHex: "#B8CEF5",
    /* images[0] is also the case-study hero (page.tsx reads it directly),
       heroVideo's poster frame (paints before the video loads, and is
       what a prefers-reduced-motion visitor sees instead of it — see
       HeroVideo.tsx), and the homepage folder-card thumbnail (which never
       plays video) — set its `focalPoint` once you've anchored it, and it
       applies everywhere it's used. Folder.tsx only reads the first 3 for
       the homepage folder-card stack; the full 9-image set lives in
       caseStudies.ts's blocks below. */
    images: [
      { src: "/yap-hero.webp",       alt: "YAP Global hero" },
      { src: "/yap-showcase-1.webp", alt: "YAP Global showcase 1" },
      { src: "/yap-showcase-3.webp", alt: "YAP Global showcase 3" },
    ],
    tags: ["UX Design", "Brand Identity"],
    heroVideo: "/yap-global-hero.mp4",
  },
  {
    slug: "spaces-international",
    title: "Spaces International",
    description: "Charity and social enterprise for social inclusion, its site rebuilt around three real audience personas.",
    tint: "var(--folder-spaces)",
    tintHex: "#F5D4B8",
    /* Real content, from a source doc Jeet supplied (Aug 2026) — same as
       InCore/YAP Global/Arc Studio. Real mockups landed Aug 8 2026 too
       (spaces-international-*.webp); images[0] is the approach shot
       (laptop lifestyle photo of the homepage), same triple role as
       incore-approach.webp/arc-approach.webp: case-study hero fallback,
       heroVideo's poster frame, and the homepage folder-card thumbnail
       (Folder.tsx only reads this array's first 3). The other uploaded
       files (showcase/showcase-1..4, design-1, design-2) are still being
       sorted into caseStudies.ts's Showcase section — see the note there. */
    images: [
      { src: "/spaces-international-approach.webp", alt: "Spaces International website, homepage mockup" },
      { src: "/spaces-international-showcase-1.webp", alt: "Spaces International website, Safe Spaces initiative page mockup" },
      { src: "/spaces-international-showcase-3.webp", alt: "Spaces International website, Join Our Community section mockup" },
    ],
    tags: ["UX Design", "Content Strategy"],
    heroVideo: "/spaces-international-hero.mp4",
  },
  {
    slug: "arc-studio",
    title: "Arc Studio",
    description: "Web3 creative agency's own site, redesigned around the literal shape of its name.",
    tint: "var(--folder-arc)",
    tintHex: "#F2A65A",
    /* images[0] is also the case-study hero (page.tsx reads it directly),
       heroVideo's poster frame (paints before the video loads, and is
       what a prefers-reduced-motion visitor sees instead of it — see
       HeroVideo.tsx), and the homepage folder-card thumbnail (which never
       plays video). arc-approach.webp is standing in as all three for
       now rather than a real still pulled from the video itself — swap
       it for one anytime; every case-study page reads it straight from
       here. */
    images: [
      { src: "/arc-approach.webp",   alt: "Arc Studio site, approach mockup" },
      { src: "/arc-showcase-1.webp", alt: "Arc Studio site, showcase mockup" },
      { src: "/arc-showcase-3.webp", alt: "Arc Studio site, showcase mockup" },
    ],
    tags: ["Brand Identity", "Art Direction"],
    heroVideo: "/arc-studio-hero.mp4",
  },
  {
    slug: "dealsage",
    title: "DealSage",
    description: "Placeholder: AI finance company, design system and positioning work.",
    /* Tint/color untouched for now (still the old --folder-sixth green) —
       unlike Arc Studio's real confirmed orange brand accent, there's no
       real DealSage brand color to go on yet, so this stays a genuine
       placeholder rather than a guess. */
    tint: "var(--folder-sixth)",
    tintHex: "#C8E6C0",
    /* images[0] is also the case-study hero (page.tsx reads it directly).
       Only 6 of the 7 images below are in public/ so far (dealsage-
       showcase-3.webp is still pending) — that one block will show a
       broken image until it's added, same as InCore/Arc Studio's hero
       did while waiting on theirs. */
    images: [
      { src: "/dealsage-hero.webp",       alt: "DealSage site, mockup" },
      { src: "/dealsage-approach.webp",   alt: "DealSage site, mockup" },
      { src: "/dealsage-showcase-1.webp", alt: "DealSage site, mockup" },
    ],
    tags: ["Product Design", "Design System"],
  },
];
