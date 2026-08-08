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
            text: "InCore Semiconductors is a Chennai-based fabless semiconductor company building customizable RISC-V processor IP, grown out of the SHAKTI processor program at IIT Madras and backed by Peak XV Partners. Instead of manufacturing chips, InCore licenses processor cores and SoC design tools, charging a license fee plus an optional volume-tied royalty.",
          },
          {
            type: "paragraph",
            text: "I worked on InCore's website through a design agency, on and off, from early 2024 through mid-2025. It wasn't a single redesign and launch: brand discovery and a first product-page pass, a full homepage rebuild about a year later after a strategy shift, then ongoing SEO fixes, landing pages, and content support.",
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
            text: "InCore's own list of problems was specific and unglamorous: not enough product information for evaluating engineers, a broken enquiry form, no in-house developer to keep any of it updated. The stakes were higher than a typical B2B site too, since InCore's buyers are SoC architects who can't afford to pick the wrong vendor.",
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
            text: "About a year in, a second problem emerged: InCore's internal automation platform, the SoC Generator, let one engineer do in minutes what used to take a team months. It became the company's real differentiator internally, but the site still presented it as one of several equal offerings, and rising bounce rate suggested visitors weren't getting the message.",
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
            text: "I worked from a structured brand and audience questionnaire the client filled out directly. Two details shaped everything downstream: the buyer is highly risk-averse, since picking the wrong CPU vendor is a costly, career-relevant decision, and the company had zero in-house technical capacity, so every design decision also had to be realistic for a non-developer to maintain.",
          },
          {
            type: "paragraph",
            text: "The first deliverable was structuring the product section around a flow the client had in their head but hadn't put into a page hierarchy: Build Your Own Core, Buy a Core across two tiers, Buy a Full Chip across SoC options, each leading to a sales enquiry, plus a documentation area. I wrote the copy and structure directly from that flow instead of inventing a new one.",
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
            text: "About a year later, the client's strategy shifted internally: SoC Generator, not the individual IP cores, was becoming the flagship product they wanted every visitor to understand first. That meant changing what the homepage was fundamentally organized around, not just how it looked. I rebuilt the structure so SoC Generator anchored the hero, with the RISC-V cores (renamed Core-Hubs to avoid confusion) and reference designs repositioned underneath it as supporting offerings.",
          },
          {
            type: "paragraph",
            text: "Because the strategy shift was urgent and a full rebuild takes time, the work split into two passes: a fast one-week update to surface SoC Generator messaging on the existing site, then a fuller homepage rebuild the next month, so the business-critical message went live without waiting on the complete redesign.",
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
            text: "Once the new homepage was live, I kept iterating on real SEO and performance reports the client shared every few months: fixing Core Web Vitals, addressing keyword cannibalization between competing pages, adjusting internal linking to the SoC Generator page after a report showed its clicks climbing while overall traffic fell.",
          },
          {
            type: "paragraph",
            text: "Some fixes were mundane but real: a gated brochure stuck on the client's OneDrive, moved into the site's own documentation page with a proper download link; a broken enquiry form caused by an expired API key, which also surfaced a case for redundant email. I kept producing supporting material too, landing pages, documentation, newsroom summaries, as InCore kept shipping new products.",
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
            text: "The site went through two concrete milestones: a working product-page structure in 2024, and a full homepage rebuild in January 2025 that repositioned SoC Generator as the flagship product. Real SEO reports afterward showed a mixed picture: clicks to the SoC Generator page rose sharply while overall traffic dipped, engagement improving even as sessions declined. I kept adjusting internal linking, CTA placement, and performance against that data rather than treating the rebuild as finished. I don't have lead-volume or conversion numbers from the enquiry form itself, so I'm leaving that claim out.",
          },
          {
            type: "paragraph",
            text: "The main lesson: a homepage redesign request can be a business-strategy request wearing a design costume. When InCore asked for a refresh, the real change was that the company had decided what it wanted to be known for, and the old structure worked against that. The other lesson was treating the site as something to keep tuning against real data, not a project with one finish line.",
          },
        ],
      },
    ],
  },
  {
    /* Real content, from a source doc Jeet supplied (Aug 2026), not
       placeholder. No em dashes, same standing preference as the other
       real case studies. No `tools`/`team` in meta — the source doc
       flags the CMS as "inherited, not explicitly reconfirmed as the
       rebuild platform" rather than a confirmed detail, and no team was
       named beyond "a small team," so neither gets invented here. Kept
       deliberately short throughout, per Jeet's own note that the case
       studies (Spaces International especially) had gotten too long —
       this one's the new shorter baseline, not just this section. Only 8
       of the 9 real images are used below; migrateful-showcase-3.webp
       (a phone mockup of the same "Behind Every Dish" section
       showcase-1.webp already covers on laptop) was left out as a near
       duplicate rather than shown twice. */
    slug: "migrateful",
    meta: {
      role: "UX Design, IA & Content Strategy",
      timeline: "Aug 2023 — Sep 2023",
    },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Migrateful is a UK charity that trains refugees, asylum seekers, and migrants to teach cookery classes, helping them toward employment and integration. Founded in 2017, it has since supported 79+ migrant chefs across more than 3,000 classes.",
          },
          {
            type: "paragraph",
            text: "I worked on the website rebuild as part of a small team, covering content strategy, page copy, and layout direction across the homepage, About Us, Meet the Chefs, Our Impact, and Donate. Their old site, 152 pages and 51 plugins deep, had broken down under its own complexity and needed a clean rebuild.",
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
              { value: "£140", label: "per class, priced and positioned like a premium product" },
              { value: "3,000+", label: "classes already run, 79+ chefs supported going in" },
              { value: "5", label: "pages rebuilt: home, About, chefs, impact, donate" },
            ],
          },
        ],
      },
      {
        id: "problem-statement",
        label: "Problem Statement",
        blocks: [
          {
            type: "quote",
            text: "We are not a charity with lots of photos of us smiling in church halls, we are a slick professional company, and that is why we can charge a lot because our product is worth a lot.",
            attribution: "Migrateful",
          },
          {
            type: "paragraph",
            text: "That's a real tension for a charity site to hold: premium enough to sell a £140 class, still an honest nonprofit underneath. The client's own instructions were specific, not vague brand talk.",
          },
          {
            type: "list",
            items: [
              "Photography closer to a high-end hospitality brand than typical charity imagery",
              "No white saviour framing, chefs and staff read as one team",
              "Homepage stays apolitical, so the blog moved off it entirely",
              "No UK-specific slang, the audience is international",
            ],
          },
        ],
      },
      {
        id: "approach",
        label: "Approach",
        blocks: [
          {
            type: "paragraph",
            text: "The client had already reviewed comparable sites (Migration Matters, Settle, Breaking Barriers, Kerb) with specific, itemized reactions, so I worked from those concrete likes and dislikes instead of starting visual research from zero. Early structural drafts had the homepage competing for attention across chefs, classes, volunteering, and donations, which I simplified to one strong hero image and one clear action, book a class, with everything else moved to supporting sections.",
          },
          {
            type: "paragraph",
            text: "Chef bios and testimonials came from real submissions, trimmed to a consistent, readable length rather than written from scratch. One early open question, serif versus sans-serif headings, got resolved by direct client feedback rather than the more generic \"modern nonprofit\" default, and serif stuck.",
          },
          { type: "image", src: "/migrateful-approach.webp", alt: "Migrateful website, homepage mockup", wide: true },
        ],
      },
      {
        id: "showcase",
        label: "Showcase",
        blocks: [
          {
            type: "paragraph",
            text: "The site had to serve four different audiences, the public booking classes, businesses arranging private events, volunteers signing up for shifts, and the internal team updating content, so pages like Meet the Chefs needed to support both storytelling and a direct booking action at once.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/migrateful-showcase-2.webp", alt: "Migrateful website, Syrian cooking class event page mockup" },
              { src: "/migrateful-design-2.webp", alt: "Migrateful website, Bristol class page mockup" },
            ],
          },
          { type: "image", src: "/migrateful-showcase-1.webp", alt: "Migrateful website, chef stories section mockup", wide: true },
          { type: "image", src: "/migrateful-showcase-4.webp", alt: "Migrateful website, mobile navigation mockup", wide: true },
        ],
      },
      {
        id: "design-system",
        label: "Design System",
        blocks: [
          {
            type: "paragraph",
            text: "The visual system leaned into the premium positioning the client wanted: confident serif headings, a restrained purple and orange palette, and real photography over stock or illustration wherever possible.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/migrateful-design-1.webp", alt: "Migrateful design system, colors and typography" },
              { src: "/migrateful-design-3.webp", alt: "Migrateful design system, Alumni Chef Network card" },
            ],
          },
          { type: "image", src: "/migrateful-design-4.webp", alt: "Migrateful design system, book cover", wide: true },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "I don't have a launch date, traffic, or conversion numbers from this engagement, so I'm not claiming an outcome I can't support. What I can point to is a genuinely collaborative process, the client's detailed, page-by-page feedback (naming exact problems, citing specific competitor sites) carried through into real copy and structure across the homepage, About Us, Meet the Chefs, Impact, and Donate.",
          },
          {
            type: "paragraph",
            text: "The client had already thought through their own positioning before I got involved, a charity insisting it should look like a premium hospitality brand rather than a typical nonprofit. My job was translating that specific, sometimes counterintuitive instinct into consistent copy and structure, not inventing a direction from scratch.",
          },
        ],
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
      team: "Natural Eye Media, small internal team",
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
            text: "YAP Global is an international PR and communications agency for crypto, DeFi, and Web3 companies, founded in 2018 by former journalist Samantha Yap. By 2025 the agency had just been through a full brand refresh, new logo, new colors, new identity, but the website hadn't caught up.",
          },
          {
            type: "paragraph",
            text: "I led the redesign at Natural Eye Media, covering UX, IA, content strategy, and copy across the homepage, service pages, case studies, careers, and a redesigned newsletter section called The Context, all built to a hard deadline: launch before EthCC, a major Web3 conference, on June 30, 2025.",
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
              { value: "2026", label: "Still an active account, new assets shipping past launch" },
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
            text: "The rebrand had already happened, new logo, new colors, new identity, but the site hadn't caught up, and the client felt it: cluttered, forgettable, not converting. A glossary section meant to explain crypto terms was working against them; they wanted to read as a serious PR agency, not a Web3 101 course.",
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
            text: "I started from an internal discovery questionnaire, adapted for a rebrand context, and had the client fill it out across two passes plus a call, cross-referencing all three and treating the most recent answers as the ones that mattered when they conflicted. That surfaced five distinct audiences: business leads, newsletter subscribers, industry peers, journalists, job seekers.",
          },
          {
            type: "paragraph",
            text: "The client pointed me to a competitor's homepage they liked and asked for a copy read, not a visual one, so I pulled out what was actually working there (a confident opening line, benefits-led service copy, credibility placed high) and rebuilt that structure in YAP's own voice. The IA followed the same conversion-first logic: hero, trust signals, case studies, services, newsletter, contact, getting a high-intent visitor to proof as fast as possible.",
          },
          { type: "image", src: "/yap-approach.webp", alt: "YAP Global website, tablet mockup, approach", wide: true, focalPoint: { x: 52.03, y: 71.65, zoom: 1.28 } },
        ],
      },
      {
        id: "showcase",
        label: "Showcase",
        blocks: [
          {
            type: "paragraph",
            text: "Three homepage directions went in front of the client. Instead of picking a single winner, I took their detailed, section-by-section feedback on what to keep from each and merged the strongest pieces into one: the wins section and tile motif from one direction, the services structure from another, the testimonial treatment from a third.",
          },
          {
            type: "paragraph",
            text: "The rebrand centered on a quotation-mark symbol tied to the agency's name, a nod to \"yapping,\" their own word for storytelling. Rather than a static logo mark, I used it as a recurring visual anchor between sections, signaling continuity as the page scrolled from one part of the story to the next.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/yap-showcase-1.webp", alt: "YAP Global newsfeed page, tablet mockup among fruit", focalPoint: { x: 57.24, y: 35.70, zoom: 1.21 } },
              { src: "/yap-showcase-2.webp", alt: "YAP Global \"We Yap With Purpose\" values page, tablet mockup", focalPoint: { x: 51.33, y: 16.06, zoom: 1.33 } },
            ],
          },
          { type: "image", src: "/yap-showcase-3.webp", alt: "YAP Global website, tablet mockup, showcase", wide: true, focalPoint: { x: 51.93, y: 50.36 } },
          { type: "image", src: "/yap-showcase-4.webp", alt: "YAP Global website, tablet mockup, showcase", wide: true, focalPoint: { x: 70.77, y: 14.04, zoom: 1.13 } },
        ],
      },
      {
        id: "design-system",
        label: "Design System",
        blocks: [
          {
            type: "paragraph",
            text: "The client had used a physical newspaper prop at a conference to represent their newsletter, The Context. I carried that straight onto the site, building the section as an actual open-newspaper spread instead of a generic email signup block, so the physical and digital brand moments matched.",
          },
          {
            type: "paragraph",
            text: "Two problems came up in launch week. The client wanted \"learn more\" arrows removed from service items pointing to unbuilt pages, dead links are worse than no links, so I swapped in small descriptive tags instead. And with internal pages still incomplete the day before launch, I reused the site's approved 404 styling to build a coming-soon page fast rather than push the launch back.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/yap-design-1.webp", alt: "YAP Global website, tablet mockup, design details", focalPoint: { x: 48.28, y: 71.45, zoom: 1.08 } },
              { src: "/yap-design-2.webp", alt: "YAP Global website, tablet mockup, design details", focalPoint: { x: 40.22, y: 52.53, zoom: 1.33 } },
            ],
          },
          { type: "image", src: "/yap-design-3.webp", alt: "YAP Global website, tablet mockup, design details", wide: true, focalPoint: { x: 50.79, y: 49.81 } },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "The site launched on schedule ahead of EthCC, coming-soon page and all. The founder's reaction to the 404 page was positive enough that the team reused its style under deadline pressure, and the relationship didn't end at launch, I was still producing new branded assets more than a year later. I don't have post-launch traffic or conversion numbers to share, so I'm leaving that out rather than guessing.",
          },
          {
            type: "paragraph",
            text: "The real lesson was editing across three competing, client-approved directions instead of refining just one, merging specific feedback into a single coherent system rather than defending any one direction as \"the\" answer. If I did this again, I'd flag page-readiness risk earlier instead of solving it with a coming-soon page the day before launch.",
          },
        ],
      },
    ],
  },
  {
    /* Real content, from a source doc Jeet supplied (Aug 2026), not
       placeholder — same as InCore/YAP Global/Arc Studio. No em dashes
       anywhere in this case study's copy, same standing preference as
       the other real case studies. No `tools` in meta — the source doc
       says so directly ("this project stayed in content/IA territory, so
       no build platform was discussed"), and no `team` either, since none
       was mentioned. Real mockups landed Aug 8 2026 (see the note on
       Project.images in projects.ts) — one of them (design-1.webp, a
       Style Guide cover) is why this now HAS a `design-system` section
       despite the source doc's own framing of the engagement as
       content/IA-only. See that section's own note and the Conclusion
       below for how that's reconciled without overstating the scope. */
    slug: "spaces-international",
    meta: {
      role: "UX Design, IA & Content Strategy",
      timeline: "Feb 2024 — May 2024",
    },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Spaces International is a charity and social enterprise built around social inclusion, working through three initiatives: Safe Spaces (listening to lived experience), Transformed Spaces (helping organisations become more inclusive), and Open Spaces (helping people launch business ideas). In their own words, their vision is to empower individuals and organisations to engage with social inclusion in a meaningful way.",
          },
          {
            type: "paragraph",
            text: "I worked on content strategy and page copy for their website redesign, starting from three personas the client's own team had already built, one per initiative. The work ran February through May 2024 and covered the homepage, all three initiative pages, About Us, Get Involved, and Contact Us.",
          },
        ],
      },
      {
        id: "tldr",
        label: "TL;DR",
        blocks: [
          {
            type: "paragraph",
            text: "Spaces International's existing copy explained the organisation reasonably well, just outdated. The harder problem: three distinct initiatives, three very different audiences (a school counsellor, a corporate CEO, an aspiring entrepreneur), all needing to read as one coherent charity rather than three programs bolted together. I worked from the client's own personas to write genuinely different content for each audience rather than one generic nonprofit voice repeated three times.",
          },
          {
            type: "stats",
            items: [
              { value: "3", label: "connected initiatives, one shared brand" },
              { value: "3", label: "client-built personas driving every page's content" },
              { value: "7", label: "pages restructured: home, 3 initiatives, About, Get Involved, Contact" },
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
            text: "This wasn't a redesign-from-crisis situation. The real challenge was structural and tonal: three initiatives under one shared brand, each speaking to a completely different visitor.",
          },
          {
            type: "quote",
            text: "A bit outdated, but still explains decently what we do.",
            attribution: "Spaces International, on their previous site copy",
          },
          {
            type: "list",
            items: [
              "Safe Spaces (Listen): a school counsellor looking for respectful ways to talk about difficult social topics",
              "Transformed Spaces (Learn): a corporate leader looking for a credible, structured DEI partner",
              "Open Spaces (Engage): an aspiring social entrepreneur who needs funding, mentorship, and physical resources",
            ],
          },
          {
            type: "paragraph",
            text: "Treating these as one audience would have flattened the site into generic charity language. The organisation also had a nuanced position to hold: they support inclusion without promoting any specific worldview, a line that's easy to get wrong in either direction, preachy on one side, noncommittal on the other.",
          },
        ],
      },
      {
        id: "approach",
        label: "Approach",
        blocks: [
          {
            type: "heading",
            text: "Refusing to generate content before understanding the full picture",
          },
          {
            type: "paragraph",
            text: "I deliberately held off on writing any copy until I had both the existing site content and all three personas in hand, so the first real content decisions were grounded in audience research the client had already invested in, not a generic nonprofit template.",
          },
          {
            type: "heading",
            text: "Treating each persona as its own content strategy, not a relabeled template",
          },
          {
            type: "paragraph",
            text: "Safe Spaces leaned into discussion formats for a school counsellor; Transformed Spaces leaned into consulting access and measurable frameworks for a corporate leader; Open Spaces leaned into mentorship and funding for an aspiring entrepreneur. Each came from that persona's actual goals, not one \"get involved\" message with the initiative name swapped.",
          },
          {
            type: "heading",
            text: "Protecting the client's own words rather than smoothing them",
          },
          {
            type: "paragraph",
            text: "The \"Our Beliefs\" section kept the client's own reasoning intact (they support inclusion without promoting any specific worldview) rather than flattening it into generic \"we believe in diversity\" language. Team testimonials, including one contributor listed only as \"Identity Protected,\" were left exactly as given, a hard rule rather than a style suggestion. Get Involved became four parallel doors (Events, Internships, Resources, Hannah Grace Day) instead of one long page trying to cover all four at once.",
          },
        ],
      },
      {
        /* Real screenshots, uploaded Aug 8 2026, replacing the earlier
           not-yet-uploaded placeholders. What actually landed doesn't
           match 1:1 with what was assumed before the mockups existed —
           no Transformed Spaces or About Us screens came through, but
           Safe Spaces, the footer, a Join Our Community section, and a
           404 page did — captions below describe what's actually in each
           image rather than the original guess. spaces-international-
           design-2.webp is a near-duplicate of showcase.webp (same Open
           Spaces page, a different phone-mockup treatment) and was left
           out on Jeet's call rather than used alongside it. */
        id: "showcase",
        label: "Showcase",
        blocks: [
          { type: "image", src: "/spaces-international-showcase.webp", alt: "Open Spaces initiative page, persona-matched content for entrepreneurs", wide: true, focalPoint: { x: 51.54, y: 34.91 } },
          {
            type: "imageGrid",
            images: [
              { src: "/spaces-international-showcase-1.webp", alt: "Safe Spaces initiative page, persona-matched content for listening and support" },
              { src: "/spaces-international-showcase-3.webp", alt: "Get Involved page, Join Our Community section with volunteer opportunities" },
            ],
          },
          {
            type: "imageGrid",
            images: [
              { src: "/spaces-international-showcase-2.webp", alt: "Site footer, newsletter signup and full site navigation" },
              { src: "/spaces-international-showcase-4.webp", alt: "Custom 404 page, on-brand even at a dead end" },
            ],
          },
        ],
      },
      {
        /* Only one real design asset exists (design-1.webp, a Style
           Guide cover) — not the usual 3-image grid+wide pattern the
           other case studies' Design System sections use, since there
           isn't a design iteration story to tell here, just this one
           artifact. Kept honest about that in the copy below rather than
           padding it out. */
        id: "design-system",
        label: "Design System",
        blocks: [
          {
            type: "paragraph",
            text: "This engagement stayed almost entirely in content and IA, but it did produce one piece of real visual groundwork: a lightweight style guide covering type (Be Vietnam Pro), button specs, and the palette, an orange anchor against black and white with a couple of softer supporting tones.",
          },
          { type: "image", src: "/spaces-international-design-1.webp", alt: "Spaces International Style Guide cover, typography, button, and color specs", wide: true },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "This stayed almost entirely in content strategy rather than full visual design, so I don't have client feedback rounds or a launch milestone to point to. What I can point to is a complete, persona-matched content structure across the homepage, three initiative pages, About Us, Get Involved, and Contact Us, plus a lightweight style guide that gave the direction a real visual anchor. I don't have launch or engagement data to share beyond that.",
          },
          {
            type: "paragraph",
            text: "The main discipline this reinforced was resisting the urge to generate content before understanding who it was for. \"One brand, three audiences\" is a genuinely different problem from \"one brand talked about three ways\": a school counsellor, a founder, and a CEO need different proof points and different levels of formality, even under one shared mission.",
          },
        ],
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
            text: "Arc Studio is a creative agency focused entirely on Web3 and crypto companies, offering branding, podcast production, social media, and website design. This case study covers the agency's own site, not a client project.",
          },
          {
            type: "paragraph",
            text: "I led the design work myself, developing the visual identity, IA, and page templates, working closely with an internal stakeholder who reviewed and shaped the direction throughout. The project started in March 2025 and continued through mid-2025 as internal pages (About, service templates, case study pages) were built out.",
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
            text: "Most Web3 marketing agency websites look alike. Mapping the direct competitor landscape (Coinbound, Lunar Strategy, MarketAcross, Crowdcreate, Serotonin, Coinband) turned up the same pattern everywhere: bold hero statement, client-logo strip, testimonial carousel, services grid. None of it was wrong, but none of it gave a visitor a reason to remember one agency over another.",
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
            text: "There was also a practical problem: with ten-plus page types to design and copy still evolving, designing every page from scratch against a moving target would have meant constant rework.",
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
            text: "Instead of treating Arc as a one-line metaphor for the hero section, I used it as the entire creative brief. An arc is also a physical shape across cultures and history: Roman archways, Japanese torii gates, the arc of a falling apple, the curve of a story, a source to pull from for nearly every page rather than inventing a new concept each time.",
          },
          {
            type: "paragraph",
            text: "An early hero version used heavy orange marquee ribbons alongside a colosseum image, but that didn't survive feedback. What stuck was the Arc de Triomphe itself as the hero visual, its arch masked so scrolling creates a parallax effect of moving through it, literally walking the visitor through the arc. The agency's own name became an interactive piece of the page instead of just a word in the logo.",
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
            text: "The orange accent came under scrutiny more than once for being visually too strong, particularly in ribbon banners and background blocks. Rather than abandoning it, since it stayed the throughline accent across the site, I moved to a lighter shade wherever it was overpowering the content around it.",
          },
          {
            type: "paragraph",
            text: "For the About page, the brief was handwritten notes from a call: Japanese gates, arcs, Newton, cave art from India, no religious notes. I turned that into a structured, section-by-section image brief: a torii gate as a portal motif in the hero, a Roman archway merging into a torii gate for the blend of cultures, a modernized Newton's apple tree with an orange apple falling toward an arc, and Indian cave art transitioning into digital linework, deliberately avoiding any religious iconography as instructed.",
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
            text: "Rather than custom-designing four separate service pages, I built one repeatable structure (hero statement, service breakdown, the Arc Studio edge, selected work, FAQ, CTA) and applied it to branding, podcast production, website design, and social media, changing only copy and supporting visuals per page. The case study template followed the same logic: a consistent challenge, approach, results, gallery structure across every client project.",
          },
          {
            type: "paragraph",
            text: "For internal pages, I laid out the intended content structure first, sent it ahead of final copy, and only moved into visual design once real copy existed against it, so the design work wasn't chasing a moving target every time messaging changed. For Work and Case Study specifically, I used a studio called Off-Mind's site as a structural reference for its challenge-to-results flow, then rebuilt that flow in Arc Studio's own classical-meets-digital language rather than copying its look.",
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
            text: "The clearest checkpoint: after the hero and homepage iterations, the internal stakeholder confirmed the final design was approved, with only copy adjustments and small image swaps requested afterward, not another structural round. The same visual language (classical art references, the orange accent, the tone of voice) held up well enough to be reused across service page templates and the About page months later, suggesting the identity worked as an actual system. I don't have launch dates, traffic, or lead numbers for the live site, so I'm leaving out a performance claim.",
          },
          {
            type: "paragraph",
            text: "The main thing this project taught me was to take a name seriously as a design constraint, not a marketing throwaway. Once arc became a literal, physical shape with real historical range to draw from, almost every design decision had somewhere to start from instead of a brand-new concept invented per page. The other real skill exercised was translating loose, informal input into a structured, page-by-page art direction brief, closer to editing someone else's half-formed instinct into something buildable than generating ideas in the abstract.",
          },
        ],
      },
    ],
  },
  {
    /* Rough placeholder, not sourced from a real doc like InCore/YAP
       Global/Arc Studio were — Jeet gave a quick narrative outline
       (Aug 2026) instead of a source doc, to be replaced once one exists.
       No em dashes, same standing preference as the other case studies. */
    slug: "dealsage",
    meta: {
      role: "Design System & Positioning",
      timeline: "2025",
      tools: ["Figma"],
    },
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder: DealSage is an AI-powered finance company that came to us early, wanting help with product design and how the company should be positioned in the market.",
          },
          {
            type: "paragraph",
            text: "Placeholder: we led the design and positioning work and shipped a full design system. DealSage's own team later used that system, working with Claude, to build out the rest of the website themselves.",
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
              { value: "2025", label: "Placeholder: engagement timeline" },
              { value: "1", label: "Placeholder: design system shipped, reused across the site" },
              { value: "AI Finance", label: "Placeholder: industry, an AI-native product" },
              { value: "Claude", label: "Placeholder: what DealSage used to build the rest of the site" },
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
            text: "Placeholder: DealSage needed a credible design foundation and a clear market position before building out its product site, without an in-house design team to define either.",
          },
          {
            type: "list",
            items: [
              "Placeholder: no consistent visual identity yet",
              "Placeholder: needed help with product and brand positioning",
              "Placeholder: wanted to keep building and iterating independently after launch",
            ],
          },
        ],
      },
      {
        /* Image slot 2 of 8 (1 = the hero cover on page.tsx). Trimmed from
           the usual 9-image template to fit 8 real images: Showcase stays
           a pair plus 1 single (not 2). Design System used to drop its
           trailing single entirely (only 7 images existed) but Jeet's
           Aug 8 2026 rename freed up a design-3.webp, so it now has the
           full pair-plus-single like InCore/Arc Studio. See
           CaseStudyContent.tsx/caseStudies.ts if the count ever needs to
           change again. */
        id: "approach",
        label: "Approach",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder: we started with brand and product positioning, working out how DealSage wanted to be understood in the AI finance space before any visual design began.",
          },
          {
            type: "paragraph",
            text: "Placeholder: from there we built a full design system, components, patterns, and guidelines DealSage's team could apply consistently as they kept building.",
          },
          { type: "image", src: "/dealsage-approach.webp", alt: "DealSage site, approach mockup", wide: true },
        ],
      },
      {
        /* Image slots 3–5 of 7: a side-by-side pair, then one full-width
           single. */
        id: "showcase",
        label: "Showcase",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder: the design system covered the core pages and components DealSage needed most, ready to extend as the product grew.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/dealsage-showcase-1.webp", alt: "DealSage site, showcase mockup" },
              { src: "/dealsage-showcase-2.webp", alt: "DealSage site, showcase mockup" },
            ],
          },
          { type: "image", src: "/dealsage-showcase-3.webp", alt: "DealSage site, showcase mockup", wide: true },
        ],
      },
      {
        /* Image slots 6–8 of 8: a side-by-side pair, then one full-width
           single (design-3.webp, added Aug 8 2026 — see the note above). */
        id: "design-system",
        label: "Design System",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder: once the system shipped, DealSage's own team used it, working with Claude, to build out the rest of the website themselves.",
          },
          {
            type: "imageGrid",
            images: [
              { src: "/dealsage-design-1.webp", alt: "DealSage site, design details mockup" },
              { src: "/dealsage-design-2.webp", alt: "DealSage site, design details mockup" },
            ],
          },
          { type: "image", src: "/dealsage-design-3.webp", alt: "DealSage site, design details mockup", wide: true },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "Placeholder: real outcome and metrics coming once they're available.",
          },
        ],
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(c => c.slug === slug);
}
