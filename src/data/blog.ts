import type { ContentBlock, CaseStudySection } from "@/data/caseStudies";

export type { ContentBlock };

/**
 * Blog posts reuse the exact same `ContentBlock` vocabulary (and section/TOC
 * shape) as case studies — see `caseStudies.ts`. That's deliberate: the
 * internal blog page reuses `CaseStudyNav` + `CaseStudyContent` verbatim so
 * it automatically matches the case-study aesthetic instead of drifting
 * into its own thing.
 */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;        // ISO, e.g. "2026-06-12"
  readTime: string;     // e.g. "6 min read"
  /** 3 pastel hex colors used to paint the blurred-gradient thumbnail. */
  gradient: [string, string, string];
  /** First gradient color, reused for quote accents etc. */
  tintHex: string;
  author: string;
  sections: CaseStudySection[];
}

export const blogCategories = ["Design", "Product", "Motion", "Notes"] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "designing-incores-onboarding-three-times-over",
    title: "Designing InCore's onboarding, three times over",
    excerpt:
      "The first version was correct and nobody used it. The second was fast and nobody trusted it. Here's what the third one got right.",
    category: "Design",
    date: "2026-06-18",
    readTime: "6 min read",
    gradient: ["#B8CEF5", "#D4C9F5", "#B8F0D8"],
    tintHex: "#B8CEF5",
    author: "Jeet Bania",
    sections: [
      {
        id: "the-problem",
        label: "The problem",
        blocks: [
          {
            type: "paragraph",
            text: "Every engineering team we onboarded to InCore asked the same question in week one: \"where do I actually start?\" The product had forty capabilities and one entry point — a dashboard that treated a first-time licensing lead and a five-year power user identically.",
          },
          {
            type: "paragraph",
            text: "Our first attempt fixed this with more structure: a guided checklist, progress bars, the works. It was correct. It was also completely ignored — completion rates sat at 11% after three weeks.",
          },
        ],
      },
      {
        id: "what-changed",
        label: "What changed",
        blocks: [
          {
            type: "paragraph",
            text: "The checklist assumed people wanted to be taught the product. What they actually wanted was to finish the one task that brought them there — usually licensing a specific core — and see everything else later, on their own terms.",
          },
          {
            type: "quote",
            text: "Onboarding isn't a tour of the house. It's directions to the one room they're trying to get to.",
          },
          {
            type: "list",
            items: [
              "Collapsed forty capabilities into three entry intents, chosen up front",
              "Replaced the checklist with a single contextual next-step, one at a time",
              "Let the dashboard stay empty until there was something real to show",
            ],
          },
        ],
      },
      {
        id: "takeaways",
        label: "Takeaways",
        blocks: [
          {
            type: "stats",
            items: [
              { value: "11% → 64%", label: "Onboarding completion, week one" },
              { value: "3rd", label: "Attempt that actually shipped" },
              { value: "9 days", label: "Median time to first license" },
            ],
          },
          {
            type: "paragraph",
            text: "The lesson wasn't \"simplify.\" It was that a guided tour and a shortcut solve two different problems, and I'd spent two rounds solving the wrong one.",
          },
        ],
      },
    ],
  },
  {
    slug: "what-nobody-tells-you-about-handoff",
    title: "What nobody tells you about handoff",
    excerpt:
      "Design handoff isn't a file export. It's the last chance to be in the room before your intent becomes someone else's interpretation.",
    category: "Product",
    date: "2026-05-02",
    readTime: "5 min read",
    gradient: ["#F5D4B8", "#F5C6DC", "#F5EFB8"],
    tintHex: "#F5D4B8",
    author: "Jeet Bania",
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Most handoff advice is about tooling — dev mode, redlines, design tokens synced to code. All useful. None of it addresses the actual failure mode, which is that by the time engineering opens the file, the reasoning behind every decision has already left the room with you.",
          },
          {
            type: "paragraph",
            text: "A spacing value survives handoff. The reason you chose 12px over 16px almost never does — and that reason is usually the part worth protecting.",
          },
        ],
      },
      {
        id: "the-fix",
        label: "The fix",
        blocks: [
          {
            type: "paragraph",
            text: "I started writing a one-paragraph \"why\" next to every non-obvious decision directly in the file — not a separate doc nobody opens, but a sticky note living where the component lives. It's slower to write. It's saved every project it's been on from at least one silent regression.",
          },
          {
            type: "image",
            src: "/screen-1.jpg",
            alt: "Annotated component spec with inline reasoning notes",
            caption: "Reasoning lives next to the thing it explains, not three tabs away.",
          },
        ],
      },
    ],
  },
  {
    slug: "micro-interactions-are-tiny-arguments",
    title: "Micro-interactions are just tiny arguments",
    excerpt:
      "Every easing curve is making a claim about how something should feel. Most interfaces make that claim by accident.",
    category: "Motion",
    date: "2026-07-09",
    readTime: "4 min read",
    gradient: ["#D4C9F5", "#B8E4F5", "#F5C6DC"],
    tintHex: "#D4C9F5",
    author: "Jeet Bania",
    sections: [
      {
        id: "the-claim",
        label: "The claim",
        blocks: [
          {
            type: "paragraph",
            text: "A button that snaps into its hover state is arguing \"this is instant and free.\" A button that eases in with a little overshoot is arguing \"this had weight, and now it's settled.\" Neither is wrong — but shipping the wrong one for the action is a small, constant tax on trust.",
          },
          {
            type: "quote",
            text: "Nobody reads your easing curve. Everybody feels it.",
          },
        ],
      },
      {
        id: "rules-of-thumb",
        label: "Rules of thumb",
        blocks: [
          {
            type: "list",
            items: [
              "Reversible, low-stakes actions (hover, toggle) — fast, linear-ish, no overshoot",
              "Consequential actions (delete, submit) — a beat slower, so the pause reads as weight",
              "Anything appearing near a cursor — should feel summoned, not teleported",
            ],
          },
          {
            type: "paragraph",
            text: "The goal isn't more motion. Half the fixes I make to a rushed interface are removing animation that was arguing something the product didn't mean to say.",
          },
        ],
      },
    ],
  },
  {
    slug: "a-year-of-freelancing-in-numbers",
    title: "A year of freelancing, in numbers",
    excerpt:
      "Twelve months, six clients, one spreadsheet I was too afraid to open until January. Here's what it actually looked like.",
    category: "Notes",
    date: "2026-01-14",
    readTime: "7 min read",
    gradient: ["#C8E6C0", "#B8F0D8", "#F5EFB8"],
    tintHex: "#C8E6C0",
    author: "Jeet Bania",
    sections: [
      {
        id: "the-year",
        label: "The year",
        blocks: [
          {
            type: "paragraph",
            text: "I went independent in January without a plan beyond \"figure it out.\" A year later the honest answer is: it worked, but not for any of the reasons I expected going in.",
          },
          {
            type: "stats",
            items: [
              { value: "6", label: "Clients across the year" },
              { value: "3", label: "Came back for a second project" },
              { value: "41%", label: "Of time spent not billing" },
            ],
          },
        ],
      },
      {
        id: "what-i-got-wrong",
        label: "What I got wrong",
        blocks: [
          {
            type: "paragraph",
            text: "I underpriced the first two projects badly enough that I was effectively subsidizing them. I also assumed good work would market itself — it doesn't; the unglamorous stuff (a clear case study, a fast reply, showing up on time) did more for the pipeline than any single project.",
          },
          {
            type: "paragraph",
            text: "None of this is a warning. It's closer to a note to next-January-me, who I'm fairly sure is about to make a slightly different set of the same mistakes.",
          },
        ],
      },
    ],
  },
  {
    slug: "the-case-for-boring-design-systems",
    title: "The case for boring design systems",
    excerpt:
      "The best design system I ever shipped had almost no personality. That was the whole point.",
    category: "Design",
    date: "2026-03-27",
    readTime: "5 min read",
    gradient: ["#F5C6DC", "#F5B8B8", "#F5D4B8"],
    tintHex: "#F5C6DC",
    author: "Jeet Bania",
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Design systems get pitched as creative infrastructure, which is true, but it's the wrong thing to optimize for on day one. A system's real job is to make the boring 80% of the product disappear so the interesting 20% can stand out.",
          },
          {
            type: "paragraph",
            text: "The moment a button component starts having opinions about brand expression, every team using it inherits a decision they didn't sign up for.",
          },
        ],
      },
      {
        id: "boring-on-purpose",
        label: "Boring, on purpose",
        blocks: [
          {
            type: "list",
            items: [
              "Components default to invisible — personality is opt-in, not baked in",
              "One accent color per surface, chosen at the page level, not the component level",
              "If a component needs a comment explaining when to use it, it's two components",
            ],
          },
          {
            type: "quote",
            text: "A good design system is the least interesting part of the product. That's the compliment, not the complaint.",
          },
        ],
      },
    ],
  },
  {
    slug: "why-i-stopped-using-variables-for-everything",
    title: "Why I stopped using variables for everything",
    excerpt:
      "Tokenizing every value in a file felt rigorous. It was actually just indirection with extra steps.",
    category: "Product",
    date: "2026-04-11",
    readTime: "4 min read",
    gradient: ["#B8E4F5", "#B8CEF5", "#C9B8F5"],
    tintHex: "#B8E4F5",
    author: "Jeet Bania",
    sections: [
      {
        id: "the-habit",
        label: "The habit",
        blocks: [
          {
            type: "paragraph",
            text: "For a while, every spacing value, every one-off color, every corner radius in my files became a variable. It looked disciplined. In practice it meant every design review turned into archaeology — three clicks to find out that \"spacing/lg\" resolved to a number I could've just typed.",
          },
        ],
      },
      {
        id: "where-i-landed",
        label: "Where I landed",
        blocks: [
          {
            type: "paragraph",
            text: "Tokens earn their keep when a value is shared across many surfaces and needs to move together — brand color, type scale, the handful of spacing steps that actually repeat. Everything else is faster, clearer, and just as maintainable as a literal value sitting where you can see it.",
          },
          {
            type: "paragraph",
            text: "Indirection is a tool, not a virtue. I only reach for it now when something will actually need to change in one place and propagate — not by default, just in case.",
          },
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}
