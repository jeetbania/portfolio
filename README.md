# Jeet Bania — Portfolio

Personal portfolio site — case studies, blog, and a bit of personality. Built with Next.js (App Router), TypeScript, and Tailwind CSS v4, with Motion for animation.

**Live:** _add your domain here once it's live_

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + design tokens in `src/app/globals.css` (custom UI is inline-styled, not Tailwind utility classes — see `CLAUDE.md`)
- **Animation:** [Motion](https://motion.dev)
- **Fonts:** Instrument Sans, Instrument Serif, Shadows Into Light — self-hosted via `next/font/google`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command          | Description                         |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start the local dev server           |
| `npm run build`  | Production build                     |
| `npm run start`  | Serve the production build locally   |
| `npm run lint`   | Run ESLint                           |

## Project structure

```
src/
  app/            Routes (App Router) — home, about, work, blog, and their [slug] pages
  components/     UI components
  data/           Content: projects, case studies, blog posts
  lib/            Theme provider, small hooks/utilities
content/          Case study writing guides/templates
public/           Static assets (images, icons)
```

## Content

Case studies live in `src/data/projects.ts` (card-level info) and `src/data/caseStudies.ts` (full page content, section by section). Blog posts live in `src/data/blog.ts`. See `content/CASE-STUDY-CONTENT-GUIDE.md` and `content/TEMPLATE.md` for the writing format.

## Deployment

Deploys cleanly to [Vercel](https://vercel.com) with zero config — connect this repo and it picks up `next build` automatically, including image optimization (`next.config.ts` has no `unoptimized` override).
