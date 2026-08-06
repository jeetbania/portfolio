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
}

export const projects: Project[] = [
  {
    slug: "incore",
    title: "InCore",
    description: "RISC-V SoC design platform for next-generation chip licensing.",
    tint: "var(--folder-incore)",
    tintHex: "#B8F0D8",
    images: [
      { src: "/cover.png",  alt: "InCore product cover" },
      { src: "/chip.png",   alt: "Semiconductor chip" },
      { src: "/tech-1.jpg", alt: "Circuit board close-up" },
    ],
    tags: ["Product Design", "Design System"],
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
    description: "Event experience platform redefining how communities gather and celebrate.",
    tint: "var(--folder-yap)",
    tintHex: "#B8CEF5",
    /* images[0] is also the case-study hero (page.tsx reads it directly) —
       set its `focalPoint` once you've anchored it, and it applies there
       too. Folder.tsx only reads the first 3 for the homepage folder-card
       stack; the full 9-image set lives in caseStudies.ts's blocks below. */
    images: [
      { src: "/yap-hero.webp",       alt: "YAP Global hero" },
      { src: "/yap-showcase-1.webp", alt: "YAP Global showcase 1" },
      { src: "/yap-showcase-3.webp", alt: "YAP Global showcase 3" },
    ],
    tags: ["UX Design", "Motion"],
  },
  {
    slug: "fourth-project",
    title: "Fourth Project",
    description: "A design exploration in data visualisation and dashboard UX.",
    tint: "var(--folder-fourth)",
    tintHex: "#F5D4B8",
    images: [
      { src: "/screen-1.jpg", alt: "Analytics dashboard" },
      { src: "/screen-2.jpg", alt: "Mobile app screens" },
      { src: "/tech-2.jpg",   alt: "Team collaboration" },
    ],
    tags: ["UX Research", "UI Design"],
  },
  {
    slug: "fifth-project",
    title: "Fifth Project",
    description: "Placeholder — a real case study will replace this soon.",
    tint: "var(--folder-fifth)",
    tintHex: "#F5C6DC",
    images: [
      { src: "/album-cover.jpg", alt: "Placeholder cover" },
      { src: "/service-1.jpg",   alt: "Placeholder detail" },
      { src: "/service-2.jpg",   alt: "Placeholder detail" },
    ],
    tags: ["Branding", "UI Design"],
  },
  {
    slug: "sixth-project",
    title: "Sixth Project",
    description: "Placeholder — a real case study will replace this soon.",
    tint: "var(--folder-sixth)",
    tintHex: "#C8E6C0",
    images: [
      { src: "/book-cover.png", alt: "Placeholder cover" },
      { src: "/service-3.jpg",  alt: "Placeholder detail" },
      { src: "/tech-1.jpg",     alt: "Placeholder detail" },
    ],
    tags: ["Product Design", "Motion"],
  },
];
