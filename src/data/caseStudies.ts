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
  | { type: "list"; items: string[] }
  /** Draggable before/after comparison — full content-column width, same
   * card treatment as a `wide: true` image (see BeforeAfterSlider.tsx).
   * Not every case study needs one; use it only where there's a real
   * before/after image pair. */
  | {
      type: "beforeAfter";
      before: { src: string; alt: string };
      after: { src: string; alt: string };
      beforeLabel?: string;
      afterLabel?: string;
    };

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
      /* Real content, from a source doc Jeet supplied (Aug 2026), not
         placeholder. `tools` is a reasonable assumption (Figma is about
         as close to a universal design tool as exists), not something
         the source doc explicitly confirms the way it does for the CMS/
         email stack (WordPress + Bricks Builder, Brevo/SendGrid) that
         doesn't belong in a "design tools" tile. No em dashes anywhere in
         this case study's copy, per Jeet's request. */
      role: "UX Design, IA & Content Strategy",
      timeline: "Feb 2024 — Jul 2025 (ongoing)",
      tools: ["Figma"],
    },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "InCore Semiconductors is a Chennai-based fabless semiconductor company building customizable RISC-V processor IP. It grew out of the SHAKTI processor program at IIT Madras and is backed by Peak XV Partners. InCore licenses processor cores and SoC design tools to chip companies instead of manufacturing chips itself, charging a license fee plus an optional royalty tied to volume.",
          },
          {
            type: "paragraph",
            text: "I worked on InCore's website through a design agency, on and off, from early 2024 through mid-2025. It wasn't a single redesign and launch. The engagement started with brand discovery and a first pass at product page structure, returned about a year later for a full homepage rebuild driven by a shift in product strategy, and continued after that with SEO fixes, new landing pages, and ongoing content support.",
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
              { value: "Feb 2024", label: "Engagement started, still ongoing today" },
              { value: "125%", label: "Rise in clicks to the SoC Generator page after the rebuild" },
              { value: "2", label: "Milestones: first product pages, then a full homepage rebuild" },
              { value: "0", label: "In-house developers, every decision had to be non-technical-proof" },
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
            text: "InCore's own list of problems with their site was specific and unglamorous: not enough product information for engineers trying to evaluate them, a broken enquiry form, and no in-house developer to keep any of it updated. The stakes were higher than a typical B2B site too, since InCore's buyers are SoC architects and chip design engineers who can't afford to pick the wrong vendor.",
          },
          {
            type: "list",
            items: [
              "Not enough product information for evaluating engineers",
              "No working way to submit an enquiry, the form was broken",
              "Information going stale quickly as the company evolved",
              "No in-house developer to maintain anything built",
            ],
          },
          {
            type: "quote",
            text: "Cautious about technology vendors to work with, since mistakes are very costly in the semicon industry.",
            attribution: "InCore Semiconductors",
          },
          {
            type: "paragraph",
            text: "About a year in, a second problem emerged. InCore had built an internal automation platform, the SoC Generator, that let one engineer do in minutes what used to take a team of three or four several months. Internally this became the company's real differentiator, but the site still presented it as one of several roughly equal offerings. Bounce rate was rising and sessions were falling, data suggesting visitors weren't getting the message either.",
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
            text: "I worked from a structured brand and audience questionnaire the client filled out directly. Two details shaped everything downstream: the target buyer is highly risk-averse, since choosing the wrong CPU vendor is a costly, career-relevant decision for them, and the company had zero in-house technical capacity to maintain a website, which meant every design decision also had to be realistic for a non-developer to keep updated.",
          },
          {
            type: "paragraph",
            text: "The first real deliverable was structuring the product section around a flow the client already had in their head but hadn't put into a page hierarchy: Build Your Own Core through a core generator, Buy a Core across two core-hub tiers, and Buy a Full Chip across SoC options, each leading to a sales enquiry, plus a documentation area for brochures and specs. I wrote the section copy and page structure directly from that flow instead of inventing a new one.",
          },
          { type: "image", src: "/incore-approach.webp", alt: "InCore website, approach mockup", wide: true },
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
            text: "About a year later, the client's own team had shifted strategy internally. SoC Generator, not the individual IP cores, was becoming the company's flagship product, the thing they wanted every visitor to understand first. That wasn't a request to make the homepage look better, it was a request to change what the homepage was fundamentally organized around. I rebuilt the structure so SoC Generator anchored the hero and the product overview, with the RISC-V cores (renamed Core-Hubs to avoid confusion with \"generator\" language) and reference designs repositioned as supporting offerings underneath it.",
          },
          {
            type: "paragraph",
            text: "Because a full rebuild takes time and the strategy shift was urgent, the work split into two passes: a fast, one-week update to surface SoC Generator messaging on the existing site, followed by a fuller homepage rebuild the next month. That let the business-critical message go live quickly without waiting on the complete redesign.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/incore-showcase-1.webp", alt: "InCore website, showcase mockup" },
              { src: "/incore-showcase-2.webp", alt: "InCore website, showcase mockup" },
            ],
          },
          { type: "image", src: "/incore-showcase-3.webp", alt: "InCore website, showcase mockup", wide: true },
          { type: "image", src: "/incore-showcase-4.webp", alt: "InCore website, showcase mockup", wide: true },
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
            text: "Once the new homepage was live, I kept iterating based on real SEO and performance reports the client shared every few months, not fresh brainstorming each time. That included fixing Core Web Vitals issues, addressing keyword cannibalization between pages competing for the same search terms, and adjusting internal linking to the SoC Generator page after a report showed its clicks were climbing while its overall traffic was falling.",
          },
          {
            type: "paragraph",
            text: "Some of the most useful fixes were mundane but real: a gated brochure stuck on the client's OneDrive that visitors couldn't reliably access, moved into the site's own documentation page with a proper download link, and a broken document form caused by an expired API key, which also surfaced a case for the redundant email setup they'd already been planning. As InCore kept shipping new products and press coverage, I kept producing supporting material too: landing pages, documentation entries, and newsroom summaries written in the company's own voice.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/incore-design-1.webp", alt: "InCore website, design details mockup" },
              { src: "/incore-design-2.webp", alt: "InCore website, design details mockup" },
            ],
          },
          { type: "image", src: "/incore-design-3.webp", alt: "InCore website, design details mockup", wide: true },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "The site went through two concrete milestones: a working product-page structure in 2024, and a full homepage rebuild in January 2025 that repositioned SoC Generator as the flagship product, presented and defended directly to the client on a call. Real SEO reports afterward showed a mixed but informative picture: clicks to the SoC Generator page rose sharply while overall traffic to that page dipped, and engagement improved even as total sessions declined. I used that data to keep adjusting internal linking, CTA placement, and technical performance rather than treating the rebuild as a finished, one-time deliverable. I don't have lead-volume or conversion numbers from the enquiry form itself, so I'm leaving that claim out.",
          },
          {
            type: "paragraph",
            text: "The main lesson here is that a homepage redesign request can actually be a business-strategy request wearing a design costume. When InCore asked for a refresh, the real change underneath it was that the company had decided what it wanted to be known for, and the old structure was working against that decision. The other lesson was how useful it was to treat the site as something to keep tuning against real data instead of a project with one finish line.",
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
    slug: "arc-studio",
    meta: {
      /* Real content, from a source doc Jeet supplied (Aug 2026), not
         placeholder. No em dashes anywhere in this case study's copy,
         same standing preference as InCore's. */
      role: "UX Design, Brand & Art Direction",
      timeline: "Mar 2025 — Jul 2025",
      tools: ["Figma", "Photoshop"],
    },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Arc Studio is a creative agency focused entirely on Web3 and crypto companies, offering branding, podcast production, social media, and website design. This case study covers the agency's own website, not a client project.",
          },
          {
            type: "paragraph",
            text: "I led the design work myself, developing the site's visual identity, information architecture, and page templates, working closely with an internal stakeholder who reviewed and shaped the direction throughout. The project started in March 2025 and continued through mid-2025 as internal pages (About, service templates, case study pages) were built out.",
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
              { value: "Mar 2025", label: "Design work started, wrapped by mid-2025" },
              { value: "10+", label: "Page types unified under one visual system" },
              { value: "4", label: "Service page templates built from one repeatable structure" },
              { value: "1", label: "Design language: literally the shape of an arc, everywhere" },
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
            text: "Most web3 marketing agency websites look alike. Before starting any design work, I mapped the direct competitor landscape (Coinbound, Lunar Strategy, MarketAcross, Crowdcreate, Serotonin, Coinband) and found the same pattern repeating: a bold hero statement, a strip of client logos, a testimonial carousel, a services grid. None of it was wrong, but none of it gave a visitor a reason to remember one agency over another.",
          },
          {
            type: "list",
            items: [
              "A homepage, four service templates, a case study template, an About page, and a blog, all needing to feel like one coherent brand",
              "A name, Arc, that gave a hook, but not yet a design system to build from",
              "Ten-plus page types to design against copy that was still evolving",
            ],
          },
          {
            type: "quote",
            text: "The ribbons felt too heavy, and the colosseum read as meme-ish rather than telling an actual story.",
            attribution: "Internal feedback, on an early hero concept",
          },
          {
            type: "paragraph",
            text: "There was also a practical production problem. With ten-plus page types to design and copy still evolving, designing every page from scratch against a moving target would have meant constant rework.",
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
            text: "Instead of treating Arc as a one-line metaphor for the hero section, I used it as the entire creative brief. An arc is also a physical shape that shows up across cultures and history: Roman archways, Japanese torii gates, the arc of a falling apple, the curve of a story. That gave the identity a source to pull from for nearly every page, rather than needing a new concept invented from zero each time.",
          },
          {
            type: "paragraph",
            text: "An early hero version used heavy orange marquee ribbons alongside a colosseum image, but that didn't survive feedback. The idea that stuck was using the Arc de Triomphe itself as the hero visual, with the inside of the arch masked so that scrolling creates a parallax effect of moving through it, literally walking the visitor through the arc. The agency's own name became an interactive piece of the page instead of just a word in the logo.",
          },
          { type: "image", src: "/arc-approach.webp", alt: "Arc Studio site, approach mockup", wide: true },
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
            text: "The orange accent color came under specific scrutiny more than once for being visually too strong, particularly in the ribbon banners and background blocks. Rather than abandoning the color, since it stayed the throughline accent across the whole site, I moved to a lighter shade in the places it was overpowering the content around it.",
          },
          {
            type: "paragraph",
            text: "For the About page, the brief was a set of handwritten notes from a call: Japanese gates, arcs, Newton, cave art from India, no religious notes. I turned that loose list into a structured, section-by-section image brief: a torii gate as a portal motif in the hero, a Roman archway merging into a torii gate to represent the blend of cultures, a modernized Newton's apple tree with an orange apple falling toward an arc shape, and imagery inspired by Indian cave art transitioning into digital linework, deliberately avoiding any religious iconography as instructed.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/arc-showcase-1.webp", alt: "Arc Studio site, showcase mockup" },
              { src: "/arc-showcase-2.webp", alt: "Arc Studio site, showcase mockup" },
            ],
          },
          { type: "image", src: "/arc-showcase-3.webp", alt: "Arc Studio site, showcase mockup", wide: true },
          { type: "image", src: "/arc-showcase-4.webp", alt: "Arc Studio site, showcase mockup", wide: true },
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
            text: "Rather than custom-designing four separate service pages, I built a single repeatable structure (hero statement, service breakdown, the Arc Studio edge, selected work, FAQ, CTA) and applied it to branding, podcast production, website design, and social media, changing only the copy and supporting visuals per page. The same approach applied to the case study template, which followed a consistent challenge, approach, results, gallery structure across every client project featured.",
          },
          {
            type: "paragraph",
            text: "For the internal pages, I laid out the intended content structure for each page first, sent that ahead of final copy, and only moved into visual design once real copy existed against that structure, which kept the design work from chasing a moving target every time messaging changed. For the Work and Case Study pages specifically, I looked at a studio called Off-Mind's own site as a structural reference for its challenge-to-results narrative flow, then rebuilt that flow in Arc Studio's own classical-meets-digital visual language rather than copying its look.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/arc-design-1.webp", alt: "Arc Studio site, design details mockup" },
              { src: "/arc-design-2.webp", alt: "Arc Studio site, design details mockup" },
            ],
          },
          { type: "image", src: "/arc-design-3.webp", alt: "Arc Studio site, design details mockup", wide: true },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "The clearest checkpoint I have is a direct one: after the hero and homepage iterations, the internal stakeholder confirmed the final design was approved, with only copy adjustments and small image swaps requested afterward, rather than another structural round. The same visual language (the classical art references, the orange accent, the tone of voice) held up well enough to be reused consistently across service page templates and the About page months later, which suggests the identity worked as an actual system rather than a one-off hero concept. I don't have launch dates, traffic, or lead numbers for the live site, so I'm leaving out a performance claim.",
          },
          {
            type: "paragraph",
            text: "The main thing this project taught me was to take a name seriously as a design constraint instead of a marketing throwaway. Once arc became a literal, physical shape with real historical and cultural range to draw from, almost every design decision had somewhere to start from, instead of needing a brand-new concept invented from scratch for every page. The other real skill this project exercised was translating loose, informal input into a structured, page-by-page art direction brief, closer to editing someone else's half-formed instinct into something buildable than generating creative ideas in the abstract.",
          },
        ],
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
