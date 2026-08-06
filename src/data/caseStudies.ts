/**
 * Case study content — separate from `projects.ts` (which stays the
 * lightweight "card" data used by the homepage folder grid).
 *
 * `projects.ts`   → what the WorkGrid folder needs (title, tint, cover images)
 * `caseStudies.ts` → what the /work/[slug] page needs (everything below the fold)
 *
 * Every project should have exactly one CaseStudy entry with a matching slug.
 * Sections are a flexible array — not every project needs the same section
 * set, so this is NOT hardcoded to one fixed list of tabs. Whatever sections
 * you give a project become that project's nav tabs, in order. The default
 * scaffold below follows the Overview / TL;DR / Problem Statement / Approach
 * / Showcase / Design System / Conclusion structure from the case study
 * template (Aug 2026 Paper.design pass).
 */

import type { FocalPoint } from "@/lib/imageAnchor";

export interface CaseStudyMeta {
  role: string;
  timeline: string;
  team?: string;
  tools?: string[];
}

/**
 * Content blocks — the vocabulary a case study section is built from.
 * Adding a new block type later just means: add the variant here, add one
 * render case in CaseStudyContent.tsx. Everything else (nav, scroll-spy,
 * layout) is generic and untouched.
 */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string; wide?: boolean; focalPoint?: FocalPoint }
  | { type: "imageGrid"; images: { src: string; alt: string; focalPoint?: FocalPoint }[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "stats"; items: { label: string; value: string }[] }
  | { type: "list"; items: string[] };

export interface CaseStudySection {
  /** Anchor id + nav key. Keep it short, kebab-case. */
  id: string;
  /** Label shown in the tab nav. */
  label: string;
  blocks: ContentBlock[];
}

export interface CaseStudy {
  /** Must match a Project.slug in projects.ts */
  slug: string;
  meta: CaseStudyMeta;
  sections: CaseStudySection[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "incore",
    meta: {
      role: "Lead Product Designer",
      timeline: "Jun 2024 — Nov 2024",
      team: "2 designers, 4 engineers, 1 PM",
      tools: ["Figma", "Framer", "Notion"],
    },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder — the 2–3 sentence framing of what this project was and why it mattered. Engineering teams licensing RISC-V chips had no connected workflow — everything lived across spreadsheets, PDFs, and email threads.",
          },
          {
            type: "paragraph",
            text: "Placeholder — a second paragraph on the shape of the solution and what changed once it shipped.",
          },
        ],
      },
      {
        id: "tldr",
        label: "TL;DR",
        blocks: [
          {
            type: "stats",
            items: [
              { value: "6 months", label: "From kickoff to launch" },
              { value: "40%", label: "Placeholder — reduction in onboarding time" },
              { value: "12", label: "Placeholder — engineering teams onboarded" },
              { value: "3", label: "Placeholder — core flows redesigned" },
            ],
          },
        ],
      },
      {
        id: "problem-statement",
        label: "Problem Statement",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder — the sharpest version of the problem, stated plainly. What was broken, for whom, and why the existing workflow couldn't scale.",
          },
          {
            type: "quote",
            text: "Placeholder problem statement — the single sentence that framed everything downstream.",
          },
        ],
      },
      {
        /* Image slot 2 of 9 (1 = the hero cover on page.tsx). This
           template is fixed at 9 image slots total, in this exact order:
           hero → this single → Showcase's pair + 2 singles → Design
           System's pair + 1 single. See CaseStudyContent.tsx/caseStudies.ts
           if that count ever needs to change. */
        id: "approach",
        label: "Approach",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder — how the problem was approached: research method, key constraints, the first few directions explored before landing on this one.",
          },
          { type: "image", src: "/tech-1.jpg", alt: "Approach placeholder", wide: true },
        ],
      },
      {
        /* Image slots 3–6 of 9: a side-by-side pair, then two full-width
           singles. */
        id: "showcase",
        label: "Showcase",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder — walk through the 2–4 flows that mattered most.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/chip.png", alt: "Showcase placeholder 1" },
              { src: "/screen-1.jpg", alt: "Showcase placeholder 2" },
            ],
          },
          { type: "image", src: "/tech-2.jpg", alt: "Showcase placeholder 3", wide: true },
          { type: "image", src: "/service-1.jpg", alt: "Showcase placeholder 4", wide: true },
        ],
      },
      {
        /* Image slots 7–9 of 9: a side-by-side pair, then one full-width
           single. */
        id: "design-system",
        label: "Design System",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder — the components, tokens, or patterns built to keep this scalable across future features.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/screen-2.jpg", alt: "Design system placeholder 1" },
              { src: "/service-2.jpg", alt: "Design system placeholder 2" },
            ],
          },
          { type: "image", src: "/service-3.jpg", alt: "Design system placeholder 3", wide: true },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder — what shipped, what it changed, and what you'd do differently next time.",
          },
        ],
      },
    ],
  },
  {
    slug: "migrateful",
    meta: { role: "UX Designer", timeline: "2024", tools: ["Figma"] },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          { type: "paragraph", text: "Placeholder overview for Migrateful — community cooking events connecting migrants with local residents." },
          { type: "stats", items: [{ value: "Placeholder", label: "Timeline" }, { value: "UX Designer", label: "Role" }] },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [{ type: "paragraph", text: "Placeholder conclusion." }],
      },
    ],
  },
  {
    slug: "yap-global",
    meta: {
      /* Below is real content, from a source doc Jeet supplied (Aug 2026)
         — not placeholder. Tools intentionally stays Figma-only: the
         source doc explicitly flags the production platform as
         unconfirmed ("worth confirming and filling in yourself") rather
         than guessing, so nothing's been invented here either. */
      role: "UX Design, Content Strategy & IA",
      timeline: "May 2025 — Jun 2025",
      team: "Natural Eye Media — small internal team",
      tools: ["Figma"],
    },
    /* Same 9-image template as InCore: hero (page.tsx, via projects.ts's
       images[0]) → 1 single (Approach) → pair + 2 singles (Showcase) →
       pair + 1 single (Design System). Every image below already has a
       `focalPoint` baked in from the anchor tool (src/lib/imageAnchor.tsx)
       — Jeet's tuned crop/zoom values, not defaults. */
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "YAP Global is an international PR and communications agency for crypto, DeFi, and Web3 companies, founded in 2018 by former journalist Samantha Yap. By 2025 the agency had just been through a full brand refresh — new logo, new colors, new identity — but the website hadn't caught up.",
          },
          {
            type: "paragraph",
            text: "I led the redesign at Natural Eye Media, the agency handling the project, covering UX, IA, content strategy, and copy across the homepage, service pages, case studies, careers, and a redesigned newsletter section called The Context — all built to a hard deadline: launch before EthCC, a major Web3 conference, on June 30, 2025.",
          },
        ],
      },
      {
        id: "tldr",
        label: "TL;DR",
        blocks: [
          {
            type: "stats",
            items: [
              { value: "Jun 2025", label: "Shipped on schedule, ahead of EthCC" },
              { value: "3 → 1", label: "Competing homepage directions merged into one" },
              { value: "7", label: "Site sections redesigned, home to a rebuilt newsletter" },
              { value: "2026", label: "Still an active account — new assets shipping past launch" },
            ],
          },
        ],
      },
      {
        id: "problem-statement",
        label: "Problem Statement",
        blocks: [
          {
            type: "paragraph",
            text: "The rebrand had already happened — new logo, new colors, new identity — but the site hadn't caught up, and the client felt it: cluttered, forgettable, and not converting. A glossary section meant to explain crypto terms was working against them; they wanted to read as a serious international PR agency, not a Web3 101 course.",
          },
          {
            type: "list",
            items: [
              "Cluttered and not memorable",
              "Visitors weren't taking action on the site",
              "A glossary section that undercut the positioning they wanted",
              "No consistent way to show proof of past work",
            ],
          },
          {
            type: "quote",
            text: "We'd rather have low traffic and high intent vs low intent and high traffic.",
            attribution: "YAP Global",
          },
        ],
      },
      {
        id: "approach",
        label: "Approach",
        blocks: [
          {
            type: "paragraph",
            text: "I started from an internal discovery questionnaire, adapted for a rebrand context, and had the client fill it out across two separate passes plus a call — cross-referencing all three and treating the most recent answers as the ones that mattered when they conflicted. That surfaced five distinct audiences the site had to speak to: business leads, newsletter subscribers, industry peers, journalists, and job seekers, each needing something different from the page.",
          },
          {
            type: "paragraph",
            text: "For content, the client pointed me to a competitor's homepage they liked and asked for a copy read, not a visual one — so I pulled out what was actually working there (a confident opening line, benefits-led service copy, credibility placed high) and rebuilt that structure in YAP's own voice. Since the goal was conversion, not discovery, the IA followed the same logic: hero, trust signals, case studies, services, newsletter, contact — getting a high-intent visitor to proof as fast as possible.",
          },
          { type: "image", src: "/yap-approach.webp", alt: "YAP Global website, tablet mockup — approach", wide: true, focalPoint: { x: 52.03, y: 71.65, zoom: 1.28 } },
        ],
      },
      {
        id: "showcase",
        label: "Showcase",
        blocks: [
          {
            type: "paragraph",
            text: "Three homepage directions went in front of the client, and instead of picking a single winner, I took their detailed, section-by-section feedback — what to keep from each — and merged the strongest pieces into one: the wins section and tile motif from one direction, the services structure and landing layout from another, the testimonial treatment from a third.",
          },
          {
            type: "paragraph",
            text: "The rebrand centered on a quotation-mark symbol tied to the agency's name — a nod to \"yapping,\" their own word for storytelling. Instead of treating it as a static logo mark, I used it as a recurring visual anchor between sections, signaling continuity as the page scrolled from one part of the story to the next.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/yap-showcase-1.webp", alt: "YAP Global newsfeed page, tablet mockup among fruit", focalPoint: { x: 57.24, y: 35.70, zoom: 1.21 } },
              { src: "/yap-showcase-2.webp", alt: "YAP Global \"We Yap With Purpose\" values page, tablet mockup", focalPoint: { x: 51.33, y: 16.06, zoom: 1.33 } },
            ],
          },
          { type: "image", src: "/yap-showcase-3.webp", alt: "YAP Global website, tablet mockup — showcase", wide: true, focalPoint: { x: 51.93, y: 50.36 } },
          { type: "image", src: "/yap-showcase-4.webp", alt: "YAP Global website, tablet mockup — showcase", wide: true, focalPoint: { x: 70.77, y: 14.04, zoom: 1.13 } },
        ],
      },
      {
        id: "design-system",
        label: "Design System",
        blocks: [
          {
            type: "paragraph",
            text: "The client had used a physical newspaper prop at a conference to represent their newsletter, The Context — I carried that straight onto the site, building the section as an actual open-newspaper spread instead of a generic email signup block, so the physical brand moment and the digital one matched.",
          },
          {
            type: "paragraph",
            text: "Two problems came up in launch week. The client wanted \"learn more\" arrows removed from service items pointing to pages that weren't built yet — dead links are worse than no links — so I replaced them with small descriptive tags instead of reintroducing a link that led nowhere. And with a handful of internal pages still incomplete the day before launch, I reused the site's already-approved 404 page styling to build a coming-soon page fast, instead of pushing the whole launch back.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/yap-design-1.webp", alt: "YAP Global website, tablet mockup — design details", focalPoint: { x: 48.28, y: 71.45, zoom: 1.08 } },
              { src: "/yap-design-2.webp", alt: "YAP Global website, tablet mockup — design details", focalPoint: { x: 40.22, y: 52.53, zoom: 1.33 } },
            ],
          },
          { type: "image", src: "/yap-design-3.webp", alt: "YAP Global website, tablet mockup — design details", wide: true, focalPoint: { x: 50.79, y: 49.81 } },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "The site launched on schedule ahead of EthCC, coming-soon page and all. The founder's reaction to the 404 page was positive enough that the team reused its style under deadline pressure, and the relationship didn't end at launch — I was still producing new branded assets for YAP Global more than a year later. I don't have post-launch traffic or conversion numbers to share, so I'm leaving that out rather than guessing.",
          },
          {
            type: "paragraph",
            text: "The real lesson was learning to edit across three competing, client-approved directions instead of refining just one — merging documented, specific feedback into a single coherent system rather than defending any one direction as \"the\" answer. If I did this again, I'd flag page-readiness risk earlier in the timeline, instead of solving it with a coming-soon page the day before launch.",
          },
        ],
      },
    ],
  },
  {
    slug: "fourth-project",
    meta: { role: "UX Researcher, UI Designer", timeline: "2024", tools: ["Figma"] },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          { type: "paragraph", text: "Placeholder overview — a design exploration in data visualisation and dashboard UX." },
          { type: "stats", items: [{ value: "Placeholder", label: "Timeline" }, { value: "UX Researcher, UI Designer", label: "Role" }] },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [{ type: "paragraph", text: "Placeholder conclusion." }],
      },
    ],
  },
  {
    slug: "fifth-project",
    meta: { role: "TBD", timeline: "TBD", tools: ["Figma"] },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          { type: "paragraph", text: "Placeholder — real case study content coming soon." },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [{ type: "paragraph", text: "Placeholder conclusion." }],
      },
    ],
  },
  {
    slug: "sixth-project",
    meta: { role: "TBD", timeline: "TBD", tools: ["Figma"] },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          { type: "paragraph", text: "Placeholder — real case study content coming soon." },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [{ type: "paragraph", text: "Placeholder conclusion." }],
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(c => c.slug === slug);
}
