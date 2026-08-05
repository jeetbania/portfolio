@AGENTS.md

# Jeet Bania Portfolio — Project Context

## Stack
Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Motion library, Lenis (installed, not yet wired to a scroll instance). Deployed target: Vercel. Custom UI components use **inline styles**, not Tailwind classes — Tailwind is present but this project's convention is inline `style={{}}` objects for anything bespoke.

## Fonts
Instrument Serif (headlines / italic accents), Instrument Sans (body). Loaded via Google Fonts link in `layout.tsx`.

## Design token system — always use these, don't hardcode colors
All theme-sensitive colors live in `src/app/globals.css`:
- Base tokens in `:root` (light), overridden in `[data-theme="dark"]`
- Key tokens: `--col-bg`, `--col-fg`, `--col-muted`, `--col-border`, `--surface-glass`, `--surface-glass-strong`, `--surface-opaque`, `--surface-card-tinted`, `--surface-nav`, `--cta-bg` / `--cta-bg-hover` / `--cta-shine-rest` / `--cta-shadow*`, `--shadow-tint-rgb` (used as `rgba(var(--shadow-tint-rgb), 0.1)`), `--col-hairline`, `--col-chip-muted`, `--surface-wash`
- `src/lib/theme.tsx` — `ThemeProvider` + `useTheme()` hook. Theme persists to localStorage, defaults to **light always** (deliberately does NOT follow OS `prefers-color-scheme` — a person's system dark mode should not force dark on first visit).
- `src/lib/hoverStyles.ts` — `withGlassShine(shadow)` and `QUICK_EASE`. **Lesson learned: only apply `withGlassShine()` on hover states, never resting states** — it reads as an unwanted glow on dark backgrounds when applied at rest. Resting states should get a plain ambient shadow; the shine is a hover "reward."
- `src/lib/useIsMobile.ts` — reserved for components needing a genuinely different STRUCTURE on mobile (see Header.tsx's separate DesktopNav/MobileNav). For pure sizing/spacing differences, use a CSS media query in `globals.css` instead (see the `@media (max-width: 767px)` block, e.g. `.work-grid`) — it resolves at first paint with no JS/hydration flash, and can't accidentally affect desktop since it's scoped by max-width.

## Architectural patterns worth knowing before touching anything
1. **Theme-independent "sticker" elements**: the project folder cards (`Folder.tsx`) and the "about me" fan cards (`Playground.tsx`) deliberately do NOT follow the site theme — they stay their own vivid/light-glass selves in both light and dark mode, like colorful stickers on the page. Don't "fix" this by wiring them to theme tokens; it's intentional.
2. **CSS overflow-x/y quirk**: setting `overflow-x: hidden` on an element forces the browser to compute `overflow-y` as `auto` regardless of what you literally write for it — this is spec behavior, not a bug, and it WILL clip anything that visually extends beyond the box (e.g. hover-lifted cards) even if you explicitly set `overflow-y: visible`. If you need to guard against horizontal overflow on an element that also has vertical hover effects, put the `overflow-x: hidden` guard on a different ancestor (or on `body`, which already has it globally) — never on the same element as the vertical effect.
3. **Theme init script + hydration**: `layout.tsx` injects a blocking `<script>` (`THEME_INIT_SCRIPT` from `theme.tsx`) that sets `data-theme` on `<html>` before React hydrates, to avoid a flash of the wrong theme. This requires `suppressHydrationWarning` on the `<html>` tag specifically, since the server-rendered HTML won't have that attribute.
4. **Case study images**: `next.config.ts` has no `images` override, so Next's built-in Image Optimization is active (on-the-fly resize + AVIF/WebP re-encode per requested size, served through Vercel's Image Optimization API in production, cached after first request). That optimizes what a *visitor's browser* downloads — it does nothing for the source file sitting in `public/` or in git, and `next dev` doesn't run it at all. Compress/resize source images before adding them to `public/` rather than committing multi-MB files as-is (repo bloat, slower clones/dev).

## Current state
Homepage is fully built and mobile-responsive: Hero, WorkGrid (project folders), Services (auto-cycling list w/ progress ring), Playground (fan cards + Quick Ask chat), Footer (dino runner game + socials). Dark mode complete with a floating toggle + nav toggle.

## Not built yet — next task
`src/app/work/[slug]/page.tsx` is a bare placeholder (title, tags, description, basic image grid, "coming soon" box). This needs real case-study design work.

Project data lives in `src/data/projects.ts` — each entry has `slug`, `title`, `description`, `tintHex`, `images[]`, `tags[]`. Four projects exist: incore, migrateful, yap-global, fourth-project. The case-study template needs to work for all four; extend this data file with more fields (sections, body copy, etc.) as the template's needs become clear — don't invent a parallel data source.
