import type { ContentBlock, CaseStudySection } from "@/data/caseStudies";

export type { ContentBlock };

/**
 * One live instance of a tool. Most tools have exactly one (their own
 * site, or the plugin itself with no live URL). The jukebox entry has
 * two, since Prem Bhai Ke Gaane and Himesh Ka Suroor are the same
 * codebase pointed at a different artist, one page for the pair.
 *
 * `url`/`screenshot` are both omitted for Figma plugins: there's no live
 * site to link to or screenshot, since a dev-mode plugin only runs inside
 * Figma itself. `ToolCard`/the tool page both check for their absence and
 * fall back to a flat placeholder instead of pretending one exists.
 */
export interface ToolVariant {
  label: string;
  url?: string;
  screenshot?: string;
}

export interface Tool {
  slug: string;
  title: string;
  /** One line, shown on the grid card and as the page's dek. No author,
   * no separate excerpt field, per Jeet's request, this doubles as both. */
  tagline: string;
  kind: "web" | "plugin";
  /** Grid-card thumbnail, real OG art where one already existed. Omitted
   * for the two Figma plugins (no marketing image exists yet), ToolCard
   * falls back to ToolPlaceholderThumb. */
  thumb?: string;
  tintHex: string;
  builtWith: string;
  variants: ToolVariant[];
  sections: CaseStudySection[];
}

/**
 * Ordered NEWEST FIRST by when each tool was actually built (Vercel
 * project creation date for the three web apps, folder mtime for the two
 * local-only Figma plugins), same convention as blog.ts, add new entries
 * at the TOP.
 */
export const tools: Tool[] = [
  {
    slug: "dither-motion",
    title: "Dither Motion",
    tagline: "A live WebGL motion tool: procedural 3D and particle scenes pushed through a real-time Bayer dither shader, with PNG and video export.",
    kind: "web",
    thumb: "/tool-dither-motion-thumb.webp",
    tintHex: "#6B7A45",
    builtWith: "Toolcraft, Three.js, WebGL/GLSL",
    variants: [
      { label: "Dither Motion", url: "https://toolcraft-app-chi.vercel.app", screenshot: "/tool-dither-motion-screenshot.webp" },
    ],
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Dither Motion renders live 3D scenes, a rotating torus knot, or a persistent particle \"Flow Particles\" mode, and runs the whole thing through a real-time ordered Bayer dither shader: the pixelated halftone look from old low-color displays and 90s web graphics. It was built with Toolcraft, starting from a short reference clip of a fintech landing page using a similar dithered rotating shape as style inspiration, not a clone target.",
          },
        ],
      },
      {
        id: "how-it-works",
        label: "How it works",
        blocks: [
          {
            type: "paragraph",
            text: "Under the hood it's a two-pass WebGL renderer. The first pass renders the actual 3D scene into an offscreen buffer every frame. The second pass is a full-screen shader that samples that buffer against a selectable Bayer matrix (2x2, 4x4, or 8x8) and turns it into dithered pixels, with its own intensity, brightness, contrast, and gamma controls. Whatever's in the live preview is exactly what gets exported, the preview and the PNG/video export both run through the identical render function.",
          },
        ],
      },
      {
        id: "flow-particles",
        label: "Flow particles",
        blocks: [
          {
            type: "paragraph",
            text: "The Flow Particles mode replaces the rotating object with a few thousand particles simulated with real physics: shape attraction, curl-noise flow fields, ripples, and repulsion, rather than faking movement with a per-frame random offset. Getting it to read as an actual flowing field instead of scattered noise took a couple of passes. The first version had every particle sampling its own random point in the noise, which looked like static rather than a current. Sharing one flow field across every particle, so neighbors move together instead of independently, is what finally made it look like particles being carried by something instead of just jittering in place.",
          },
        ],
      },
    ],
  },
  {
    slug: "glint",
    title: "Glint",
    tagline: "A personal visual-bookmarking app in the mymind.com style: save anything, get it back searchable and color-tagged.",
    kind: "web",
    thumb: "/tool-glint-thumb.webp",
    tintHex: "#7C6FE0",
    builtWith: "Next.js, Postgres, Vercel Blob",
    variants: [
      { label: "Glint", url: "https://glint-jeetbania.vercel.app", screenshot: "/tool-glint-screenshot.webp" },
    ],
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Glint is a personal second brain, in the same spirit as mymind.com: paste in an image, a link, or a note, and it saves itself. No folders to file it into, no tags to remember to add. It started as a rough clone to learn the pattern and became its own thing, renamed from an early \"mymind clone\" working title once it stopped feeling like a copy.",
          },
        ],
      },
      {
        id: "how-it-works",
        label: "How it works",
        blocks: [
          {
            type: "paragraph",
            text: "Every image gets its dominant colors extracted client-side and bucketed into about a dozen color families, which is what powers the color filter in the library view. Everything is full-text searchable through Postgres, notes and checklists are built on Tiptap, and the whole thing sits behind one shared password instead of a full account system, since it only ever needed to be usable by one person.",
          },
        ],
      },
      {
        id: "design",
        label: "Design",
        blocks: [
          {
            type: "paragraph",
            text: "The look, the fonts, the blur and shadow values, all of it was pulled directly from this portfolio's own liquid-glass design system rather than invented separately, so anything that changes here can be ported over there deliberately instead of the two drifting apart by accident.",
          },
        ],
      },
    ],
  },
  {
    slug: "jukebox-players",
    title: "Prem Bhai Ke Gaane & Himesh Ka Suroor",
    tagline: "Two custom YouTube-playlist jukebox sites, same architecture, two different Bollywood icons.",
    kind: "web",
    thumb: "/tool-jukebox-thumb.webp",
    tintHex: "#C9714B",
    builtWith: "Next.js, Vercel",
    variants: [
      { label: "Prem Bhai Ke Gaane", url: "https://prem-bhai-ke-gaane.vercel.app", screenshot: "/tool-prem-bhai-screenshot.webp" },
      { label: "Himesh Ka Suroor", url: "https://himesh-ka-suroor.vercel.app", screenshot: "/tool-himesh-screenshot.webp" },
    ],
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Prem Bhai Ke Gaane started as a joke: a single page that just plays Salman Khan movie songs on loop, one after another, like a jukebox. It got enough of a reaction that it turned into an actual small product, and a second one for Himesh Reshammiya followed not long after, built on the exact same codebase.",
          },
        ],
      },
      {
        id: "how-it-works",
        label: "How it works",
        blocks: [
          {
            type: "paragraph",
            text: "Both sites pull from a curated YouTube playlist and play it back through a custom player, not a YouTube embed. A track queue, shuffle, and autoplay-next all run client-side, so the interface looks and feels like a real music app instead of a video wrapped in an iframe.",
          },
          {
            type: "list",
            items: [
              "A liquid-glass player with a spinning vinyl disc that only spins while a track is actually playing",
              "Shuffle and a random track on page load, so it isn't the same opening song every visit",
              "A Now Playing badge that's honest about buffering instead of pretending playback started instantly",
              "A live listener count and a maintenance banner for when YouTube itself is having a bad day",
            ],
          },
        ],
      },
      {
        id: "reusing-the-architecture",
        label: "Reusing the architecture",
        blocks: [
          {
            type: "paragraph",
            text: "Himesh Ka Suroor reused Prem Bhai Ke Gaane's entire architecture: same player, same queue logic, same glass design system, just a new playlist, a new color palette, and new artwork. Turning an entire jukebox site over to a new artist took a fraction of the time the first one did, which was really the point of building it properly the first time.",
          },
        ],
      },
    ],
  },
  {
    slug: "motion-composer",
    title: "Motion Composer",
    tagline: "A preset-driven animation plugin for native Figma Motion. Real, editable keyframes, not a fake preview.",
    kind: "plugin",
    tintHex: "#8B5CF6",
    builtWith: "Figma Plugin API, figma.motion",
    variants: [],
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "Figma shipped a real Motion timeline as a beta, and Motion Composer is a plugin that writes actual keyframes into it. Select a layer, pick a preset, hit Apply, and it shows up as a normal, fully editable keyframe track in Figma's own Motion panel. No JSON export, no separate preview player standing in for the real thing.",
          },
        ],
      },
      {
        id: "how-it-works",
        label: "How it works",
        blocks: [
          {
            type: "paragraph",
            text: "The whole plugin funnels through one function that talks to the real API: it takes a small preset definition and converts it into applyManualKeyframeTrack calls, skipping any keyframe that wouldn't actually change a value so the resulting timeline stays clean instead of cluttered. It ships with twelve presets across four categories: object entrances like Fade Up and Pop Spring, text effects like Word Reveal, staggered card entrances, and loops like Wiggle and an Infinite Marquee.",
          },
        ],
      },
      {
        id: "whats-next",
        label: "What's next",
        blocks: [
          {
            type: "paragraph",
            text: "There's an early seed of an \"AI Motion Suggestions\" feature already in there: cheap structural heuristics that look at what's selected (is it all text? are the frames similarly sized?) to guess which preset probably fits. It isn't doing anything smart yet, but the hook is there.",
          },
        ],
      },
    ],
  },
  {
    slug: "tokenforge",
    title: "TokenForge",
    tagline: "One Figma plugin, one scan, three tools: colors, typography, and shadows and radius.",
    kind: "plugin",
    tintHex: "#4B5563",
    builtWith: "Figma Plugin API, vanilla JS",
    variants: [],
    sections: [
      {
        id: "overview",
        label: "Overview",
        blocks: [
          {
            type: "paragraph",
            text: "TokenForge replaces three separate plugins I'd built earlier, one for colors, one for typography, one for shadows and corner radius, with a single plugin that scans a selection once and populates all three tabs together instead of re-scanning the layer tree for every tool.",
          },
        ],
      },
      {
        id: "how-it-works",
        label: "How it works",
        blocks: [
          {
            type: "paragraph",
            text: "Scan Selection walks every layer in the selection and pulls out every solid fill, stroke, text color, and shadow color, grouping them by hue and naming them on a 50 to 950 shade scale so the results don't just collapse into a dozen rows all labeled \"White.\" Near-duplicate colors get a merge suggestion, split into a confident auto-merge and a \"review this one\" case, tuned specifically not to flatten colors that are intentionally close but different, like a hover state next to its default.",
          },
        ],
      },
      {
        id: "typography-and-shadows",
        label: "Typography and shadows",
        blocks: [
          {
            type: "paragraph",
            text: "The Typography tab does the same walk for every font size and family combination in use, with a bulk rename or merge for near-duplicate sizes, like an accidental 14px and 14.2px that should really be the same value. Shadows & Radius groups every shadow effect and corner radius by shape (Soft, Sharp, Layered, Deep Shadow, and so on) and tags each with a guessed element type pulled from the layer's name. Every value it finds is live-editable, so changing a radius applies it straight to every node that used the old one.",
          },
        ],
      },
    ],
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}
