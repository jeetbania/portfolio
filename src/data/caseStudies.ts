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
  | { type: "image"; src: string; alt: string; caption?: string; wide?: boolean }
  | { type: "imageGrid"; images: { src: string; alt: string }[] }
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
    meta: { role: "UX Designer, Motion", timeline: "2024", tools: ["Figma", "After Effects"] },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          { type: "paragraph", text: "Placeholder overview for YAP Global — an event experience platform redefining how communities gather." },
          { type: "stats", items: [{ value: "Placeholder", label: "Timeline" }, { value: "UX Designer, Motion", label: "Role" }] },
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
