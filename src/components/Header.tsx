"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { animate } from "motion";
import { useTheme } from "@/lib/theme";
import { useIsMobile } from "@/lib/useIsMobile";

/* Nav links. Only `/#...` hrefs are in-page anchors on the homepage and
   get scroll-spy auto-highlighted (see the sectionIds filter below) —
   Playground points at its own real route now (a "Coming Soon" stub for
   now), not the homepage's Playground section, so it never highlights
   while scrolling past that section anymore. */
const SECTIONS = [
  { id: "about",      href: "/about",       label: "About",      side: "left"  },
  { id: "playground", href: "/playground",  label: "Playground", side: "left"  },
  { id: "work",       href: "/work",        label: "Work",       side: "right" },
  { id: "blog",       href: "/blog",        label: "Blog",       side: "right" },
  { id: "tools",      href: "/tools",       label: "Tools",      side: "right" },
  { id: "contact",    href: "/#contact",    label: "Contact",    side: "right" },
];

/* ── Theme toggle — icon shows the mode you'd switch TO ─────────────── */
function ThemeToggle({ size = 26 }: { size?: number }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      onClick={toggle}
      aria-label={label}
      style={{
        width: size, height: size, borderRadius: "50%",
        display: "grid", placeItems: "center",
        border: "none", background: "transparent",
        cursor: "pointer", flexShrink: 0,
        color: "var(--col-muted)",
        transition: "color 180ms var(--ease-out), background 180ms var(--ease-out)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = "var(--col-fg)";
        e.currentTarget.style.background = "var(--surface-glass)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = "var(--col-muted)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {isDark ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.7l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M14 9.3A6.3 6.3 0 1 1 6.7 2 5 5 0 0 0 14 9.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Shared logic — scroll visibility + active section — used by both
   the desktop and mobile render branches below.
   ══════════════════════════════════════════════════════════════════ */
function useHeaderState() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(!isHome);
  const [active,  setActive]  = useState<string | null>(null);

  useEffect(() => {
    if (!isHome) { setVisible(true); setActive(null); return; }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 100);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const sectionIds = SECTIONS.filter(s => s.href.startsWith("/#")).map(s => s.id);
    const els = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        let bestId: string | null = null;
        let bestRatio = 0;
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestId = entry.target.id;
          }
        });
        if (bestId) setActive(`/#${bestId}`);
      },
      { threshold: [0.2, 0.5], rootMargin: "0px 0px -30% 0px" }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  return { visible, active };
}

/* ══════════════════════════════════════════════════════════════════
   DESKTOP nav — FIRST DRAFT of the bottom floating bar (Aug 2026), per
   Jeet: too many links sitting in one row at the top. Behavior:
     - Hero (home page, scrollY < 100): fully expanded, every link shown,
       same set as the old top bar.
     - Scrolled past the hero: collapses down to just About / Jeet Bania /
       Work / Theme, the "always visible" set, plus a Menu pill.
     - Clicking Menu (or the little arrow-hint pill beside it) force-
       expands the collapsed extras back in, growing the bar sideways.
       Scrolling again while manually expanded collapses it right back,
       same as leaving the hero would.
     - Every other page (no hero to be "at the top of"): starts collapsed,
       Menu still works to expand/collapse manually.
   Non-home pages never auto-hide/show anymore (there's no hero baseline
   to return to), so the old visible-on-scroll enter/exit animation is
   gone entirely, this bar is just always there, expanded or collapsed.
   Still gated behind isMobile === false — MobileNav (top, hamburger
   panel) is completely untouched and has its own "too many links"
   answer already. ══════════════════════════════════════════════════ */
/* Separate open/close springs, bouncier opening, snappier settling on
   close, same asymmetry MobileNav's panel morph already uses below.
   Module-level (not re-created every DesktopNav render) since they're
   just plain objects passed straight to Motion's animate(). */
const EXTRA_LINKS_OPEN_SPRING  = { type: "spring" as const, duration: 0.58, bounce: 0.34 };
const EXTRA_LINKS_CLOSE_SPRING = { type: "spring" as const, duration: 0.4,  bounce: 0.08 };

/* Hoisted to module scope on purpose: NavLinkGroup owns refs that a
   width/opacity animation writes into directly (see below), so it needs
   to be the SAME component across DesktopNav's re-renders. Defining a
   component function INSIDE another component (the original NavLink/
   Collapsible both did this) gives it a new identity every render,
   which for a plain presentational component is harmless, but here it
   would make React unmount+remount this on every unrelated re-render
   (e.g. hovering a different link), wiping out the in-flight animation
   each time. Same reasoning is why NavLink is hoisted too, everything
   it needs (active/hovered) now comes in as props instead of closure. */
function NavLink({
  href, label, isActive, isHovered, onEnter, onLeave,
}: { href: string; label: string; isActive: boolean; isHovered: boolean; onEnter: () => void; onLeave: () => void }) {
  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "13px",
        fontWeight: isActive ? 500 : 400,
        color: isActive || isHovered ? "var(--col-fg)" : "var(--col-muted)",
        padding: "4px 12px",
        borderRadius: "99px",
        background: isActive
          ? "var(--surface-glass-strong)"
          : isHovered
          ? "var(--surface-glass)"
          : "transparent",
        boxShadow: isActive
          ? "0 1px 4px rgba(var(--shadow-tint-rgb),0.12), 0 0 0 1px var(--surface-glass-border), var(--glass-bevel)"
          : "none",
        transition: "all 180ms var(--ease-out)",
        textDecoration: "none",
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </Link>
  );
}

/* The collapsible "extra links" group — animates real pixel width via
   Motion (a proper spring, run over requestAnimationFrame) instead of
   the CSS grid-template-columns 0fr/1fr trick this replaced, which
   looked choppy: browsers don't interpolate that property smoothly
   frame to frame, and a plain cubic-bezier transition on it has no real
   bounce. Width target is measured off the inner wrapper's own
   scrollWidth (same technique as MobileNav's panel height below), so it
   grows to the links' actual rendered width, not a guessed max-width. */
function NavLinkGroup({
  links, expanded, activeHref, hoveredHref, onHover,
}: {
  links: typeof SECTIONS; expanded: boolean; activeHref: string | null;
  hoveredHref: string | null; onHover: (href: string | null) => void;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (expanded) {
      const targetWidth = inner.scrollWidth;
      animate(outer, { width: `${targetWidth}px` }, reduced ? { duration: 0 } : EXTRA_LINKS_OPEN_SPRING);
      animate(inner, { opacity: 1 }, reduced ? { duration: 0 } : { type: "spring", duration: 0.42, bounce: 0.1, delay: 0.06 });
    } else {
      animate(outer, { width: "0px" }, reduced ? { duration: 0 } : EXTRA_LINKS_CLOSE_SPRING);
      animate(inner, { opacity: 0 }, reduced ? { duration: 0 } : { type: "spring", duration: 0.22, bounce: 0 });
    }
  }, [expanded]);

  return (
    <div ref={outerRef} style={{ overflow: "hidden", width: 0 }}>
      <div ref={innerRef} style={{ display: "flex", alignItems: "center", gap: "1px", whiteSpace: "nowrap", opacity: 0 }}>
        {links.map(n => (
          <NavLink
            key={n.href}
            href={n.href}
            label={n.label}
            isActive={activeHref === n.href}
            isHovered={hoveredHref === n.href}
            onEnter={() => onHover(n.href)}
            onLeave={() => onHover(null)}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { active } = useHeaderState();
  const [hovered, setHovered] = useState<string | null>(null);
  const [atTop, setAtTop] = useState(isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const expanded = (isHome && atTop) || menuOpen;

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (isHome) setAtTop(window.scrollY < 100);
        // Any scroll collapses a manual expand, whether that scroll left
        // the hero or just happened while the menu was open elsewhere.
        setMenuOpen(false);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const Divider = () => (
    <div aria-hidden="true" style={{ width: 1, height: 16, background: "var(--col-border)", margin: "0 3px", flexShrink: 0 }} />
  );

  /* First link on each side stays visible when collapsed (About, Work),
     everything after it is the "extra" set that morphs away. */
  const leftLinks   = SECTIONS.filter(s => s.side === "left");
  const rightLinks  = SECTIONS.filter(s => s.side === "right");
  const leftMain    = leftLinks[0];
  const leftExtra   = leftLinks.slice(1);
  const rightMain   = rightLinks[0];
  const rightExtra  = rightLinks.slice(1);

  const toggleMenu = () => setMenuOpen(o => !o);

  return (
    <div style={{ position: "fixed", bottom: "14px", left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", pointerEvents: "none" }}>
      {/* Separate little "look here" pill — only shown while collapsed,
          points at the Menu button (now the bar's leftmost control)
          since some visitors won't guess it's clickable on its own.
          Clicking this does the same thing Menu does. Rendered before
          the main bar in the DOM so it sits to its left. */}
      {!expanded && (
        <button
          onClick={toggleMenu}
          aria-hidden="true"
          tabIndex={-1}
          className="desktop-nav-hint"
          style={{
            width: 30, height: 30, borderRadius: "50%",
            display: "grid", placeItems: "center",
            // No backdrop-filter here on purpose — two separate blurred
            // glass surfaces sitting 8px apart (this + the main bar) is
            // what was actually causing the visible seam reported near
            // the footer/tool cards, confirmed by testing: the artifact
            // only ever appeared once this pill existed alongside the
            // main bar, never with the bar alone (its expanded state,
            // hero). Solid, fully opaque background sidesteps the whole
            // class of bug instead of chasing the exact Chromium
            // internals that caused it, this pill is small/plain enough
            // that it doesn't need its own glass treatment anyway.
            background: "var(--col-bg)",
            border: "1px solid var(--surface-glass-border)",
            boxShadow: "0 2px 8px rgba(var(--shadow-tint-rgb),0.1)",
            color: "var(--col-muted)",
            cursor: "pointer",
            pointerEvents: "auto",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            {/* Points right, at the Menu button just inside the main
                bar's left edge. */}
            <path d="M1 6h9M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: "2px",
          padding: "5px 8px", borderRadius: "99px",
          // Fully solid, no backdrop-filter — this bar now roams over
          // every kind of page content (grids, the footer's game), and
          // any amount of translucency showed a visible seam wherever a
          // real edge/gutter in that content sat behind it (confirmed:
          // fainter at higher opacity, gone only once fully opaque).
          // Matches --surface-nav's own hue exactly, so it still reads
          // as "the same nav" even without the glass see-through.
          background: "var(--col-bg)",
          border: "1px solid var(--surface-glass-border)",
          boxShadow: [
            "0 1px 0 rgba(255,255,255,0.2) inset",
            "0 2px 8px rgba(var(--shadow-tint-rgb),0.1)",
            "0 8px 24px rgba(var(--shadow-tint-rgb),0.06)",
          ].join(", "),
          pointerEvents: "auto",
          transition: "background 320ms var(--ease-out), border-color 320ms var(--ease-out), box-shadow 320ms var(--ease-out)",
        }}
      >
        {/* Menu toggle — moved to the bar's leading edge per feedback,
            reads better on the left. Icon flips to a close "x" once
            expanded (whether that's from being manually opened, or just
            from sitting in the hero), so it always reads as "click me to
            go back". */}
        <button
          onClick={toggleMenu}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--col-muted)",
            padding: "4px 10px", borderRadius: "99px", border: "none",
            background: "transparent", cursor: "pointer",
            transition: "background 180ms var(--ease-out), color 180ms var(--ease-out)",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-glass)"; e.currentTarget.style.color = "var(--col-fg)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--col-muted)"; }}
        >
          Menu
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"
            style={{ transition: "transform 260ms var(--ease-spring)", transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }}>
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
        <Divider />

        <nav aria-label="Left navigation" style={{ display: "flex", alignItems: "center", gap: "1px" }}>
          <NavLink href={leftMain.href} label={leftMain.label} isActive={active === leftMain.href} isHovered={hovered === leftMain.href}
            onEnter={() => setHovered(leftMain.href)} onLeave={() => setHovered(null)} />
          {leftExtra.length > 0 && (
            <NavLinkGroup links={leftExtra} expanded={expanded} activeHref={active} hoveredHref={hovered} onHover={setHovered} />
          )}
        </nav>
        <Divider />
        <Link href="/" style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 400, color: "var(--col-fg)", textDecoration: "none", padding: "4px 14px", whiteSpace: "nowrap" as const, letterSpacing: "-0.01em" }}>
          Jeet Bania
        </Link>
        <Divider />
        <nav aria-label="Right navigation" style={{ display: "flex", alignItems: "center", gap: "1px" }}>
          <NavLink href={rightMain.href} label={rightMain.label} isActive={active === rightMain.href} isHovered={hovered === rightMain.href}
            onEnter={() => setHovered(rightMain.href)} onLeave={() => setHovered(null)} />
          {rightExtra.length > 0 && (
            <NavLinkGroup links={rightExtra} expanded={expanded} activeHref={active} hoveredHref={hovered} onHover={setHovered} />
          )}
        </nav>

        <Divider />
        <ThemeToggle />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MOBILE nav — two separate pills (logo, menu) instead of one pill that
   grows downward. The logo stays a stable, centered anchor; tapping the
   menu pill pops a floating glass panel below it — same visual language
   (blur/border/shadow) and scale+opacity transition as the bottom
   MobileFloatingMenu used for the case-study TOC / filter tabs, just
   anchored at the top with the panel opening downward instead of up.
   Completely separate component/markup from desktop, so nothing here
   can ever affect the desktop nav.
   ══════════════════════════════════════════════════════════════════ */
/* Panel open/close — a true shape morph (width + height, via Motion)
   instead of a scale/translate pop, so it reads as the button fluidly
   growing into the panel rather than a box popping into place (the
   transitions.dev "plus → menu" pattern). Border-radius deliberately
   stays constant: at the small collapsed size it's clamped by the
   browser to a perfect circle automatically (radius can't exceed half
   the box's shorter side), and at the open size it just reads as a
   normal rounded-panel corner — no radius keyframing needed at all.
   Separate open/close curves — closing snappier with almost no bounce,
   matching the folder-card convention in Folder.tsx (OPEN_SPRING/
   CLOSE_SPRING). */
const PANEL_OPEN_SPRING  = { type: "spring" as const, duration: 0.64, bounce: 0.32 };
const PANEL_CLOSE_SPRING = { type: "spring" as const, duration: 0.44, bounce: 0.06 };
const PANEL_GAP = 18; /* logo/menu row → panel top edge */

function MobileNav() {
  const { visible, active } = useHeaderState();
  const { theme, toggle: toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const logoRef     = useRef<HTMLDivElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);
  const menuRef      = useRef<HTMLDivElement>(null);
  const panelRef      = useRef<HTMLDivElement>(null);
  const panelBodyRef  = useRef<HTMLDivElement>(null);
  const [pillSize, setPillSize] = useState(48);
  const [openWidth, setOpenWidth] = useState(320);

  /* Menu button height matched to the logo pill's actual rendered
     height (was hardcoded 44px, which drifted slightly from the logo
     pill's real height and read as "top aligned" against it). Measured
     rather than assumed since it depends on live font metrics. */
  useEffect(() => {
    const el = logoLinkRef.current;
    if (!el) return;
    /* offsetHeight (border-box: content + padding + border), not
       ResizeObserver's default contentRect (content box only, excludes
       the pill's own padding/border) — the mismatch was exactly why the
       button came out shorter than the pill it's meant to match. */
    const ro = new ResizeObserver(() => setPillSize(el.offsetHeight));
    ro.observe(el);
    setPillSize(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => setOpenWidth(Math.min(320, window.innerWidth - 32));
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const targets = [logoRef.current, menuRef.current].filter(Boolean) as HTMLElement[];
    if (targets.length === 0) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (visible) {
      targets.forEach(el => animate(el, { y: 0, opacity: 1, scale: 1 },
        reduced ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0.24 }));
    } else {
      targets.forEach(el => animate(el, { y: -14, opacity: 0, scale: 0.96 },
        reduced ? { duration: 0 } : { type: "spring", duration: 0.26, bounce: 0 }));
      setOpen(false);
    }
  }, [visible]);

  /* Panel morph — separate from the show/hide animation above since it
     runs on a different trigger (`open`, not `visible`) and targets
     different elements (the panel box + its content, not the logo/menu
     pills). Two animations run together: the box's width/height grows
     from a small seed (the button's own footprint) up to the panel's
     full measured size, while the content cross-fades in/out slightly
     offset so text doesn't smear mid-resize. */
  useEffect(() => {
    const box = panelRef.current;
    const body = panelBodyRef.current;
    if (!box || !body) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      const contentHeight = body.scrollHeight;
      animate(box, { width: `${openWidth}px`, height: `${contentHeight}px`, opacity: 1 },
        reduced ? { duration: 0 } : PANEL_OPEN_SPRING);
      animate(body, { opacity: 1, y: 0 },
        reduced ? { duration: 0 } : { type: "spring", duration: 0.46, bounce: 0.08, delay: 0.1 });
    } else {
      animate(box, { width: `${pillSize}px`, height: `${pillSize}px`, opacity: 0 },
        reduced ? { duration: 0 } : PANEL_CLOSE_SPRING);
      animate(body, { opacity: 0, y: -6 },
        reduced ? { duration: 0 } : { type: "spring", duration: 0.3, bounce: 0 });
    }
  }, [open, openWidth, pillSize]);

  /* Close on any click outside the pills/panel — same pattern as
     MobileFloatingMenu / the Quick Ask reply bar. */
  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (logoRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const closeAndGo = () => setOpen(false);

  const MobileLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = active === href;
    return (
      <Link
        href={href}
        onClick={closeAndGo}
        style={{
          display: "block",
          fontFamily: "var(--font-sans)",
          fontSize: "16px",
          fontWeight: isActive ? 600 : 400,
          color: isActive ? "var(--col-fg)" : "var(--col-muted)",
          padding: "12px 18px",
          borderRadius: "14px",
          background: isActive ? "var(--surface-glass-strong)" : "transparent",
          textDecoration: "none",
          textAlign: "center",
          transition: "background 160ms var(--ease-out), color 160ms var(--ease-out)",
        }}
      >
        {label}
      </Link>
    );
  };

  /* Shared "nav pill" recipe — same glass/blur/shadow both new pills use,
     matching what the single old pill (and the desktop pill) already
     looked like, just applied to two smaller shapes instead of one bar. */
  const pillShadow = [
    "0 1px 0 rgba(255,255,255,0.2) inset",
    "0 2px 8px rgba(var(--shadow-tint-rgb),0.1)",
    "0 8px 24px rgba(var(--shadow-tint-rgb),0.08)",
  ].join(", ");

  return (
    <>
      {/* Backdrop — dims the page while the menu panel is open, tap
          anywhere on it to close. Sits below the pills (zIndex 95 vs
          their 100) so the pills themselves stay fully visible/usable. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 95,
          background: "rgba(0,0,0,0.32)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 220ms var(--ease-out)",
        }}
      />

      {/* Logo pill — its own independently fixed, truly centered anchor.
          The centering transform (translateX(-50%)) lives on this OUTER,
          never-animated wrapper; the INNER logoRef div is the sole target
          of Motion's show/hide animation. Mixing a baked-in CSS transform
          with Motion's own transform writes on the same element is what
          caused Folder.tsx's documented 360°-spin bug — keeping them on
          separate elements avoids that entirely. */}
      <div style={{ position: "fixed", top: "14px", left: "50%", transform: "translateX(-50%)", zIndex: 100, pointerEvents: "none" }}>
        <div
          ref={logoRef}
          style={{
            pointerEvents: visible ? "auto" : "none",
            opacity: 0,
            transform: "translateY(-14px) scale(0.96)",
          }}
        >
          <Link
            ref={logoLinkRef}
            href="/"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "12px 22px",
              borderRadius: "99px",
              background: "var(--surface-nav)",
              backdropFilter: "blur(22px) saturate(180%)",
              WebkitBackdropFilter: "blur(22px) saturate(180%)",
              border: "1px solid var(--surface-glass-border)",
              boxShadow: pillShadow,
              fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 400,
              color: "var(--col-fg)", letterSpacing: "-0.01em",
              textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            Jeet Bania
          </Link>
        </div>
      </div>

      {/* Menu pill — independently fixed to the right edge, with its
          expand panel anchored below it via position:absolute. Absolute
          (not a normal flex-flow sibling) matters: a statically-flowed
          panel keeps reserving its full closed-state box even at
          scale(0.92)/opacity:0 (CSS transforms never collapse layout),
          and this container's default pointer-events:auto made that
          invisible box swallow taps to whatever page content scrolled
          underneath it — the actual cause of the "Copy Email unclickable"
          and "Quick Ask untypeable" bugs. Taking the panel out of flow
          shrinks this box down to just the visible button. */}
      <div
        ref={menuRef}
        style={{
          position: "fixed", top: "14px",
          right: "calc(16px + env(safe-area-inset-right, 0px))",
          zIndex: 100,
          pointerEvents: visible ? "auto" : "none",
          opacity: 0,
          transform: "translateY(-14px) scale(0.96)",
        }}
      >
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{
            flexShrink: 0,
            width: pillSize, height: pillSize,
            borderRadius: "50%",
            display: "grid", placeItems: "center",
            background: "var(--surface-nav)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            border: "1px solid var(--surface-glass-border)",
            boxShadow: pillShadow,
            cursor: "pointer",
          }}
        >
          {open ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3 3 13" stroke="var(--col-fg)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 5h12M2 11h12" stroke="var(--col-fg)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Panel — animated directly (no extra positioning wrapper needed):
            width/height are Motion-owned (the shape morph), pointerEvents
            is a plain conditional style that doesn't conflict with that
            since it isn't a transform property. Starts at the button's own
            footprint (pillSize × pillSize, which the constant borderRadius
            below auto-clamps into a circle) and grows into the full panel
            — reads as the button fluidly becoming the menu rather than a
            separate box popping in beside it. */}
        <div
          ref={panelRef}
          aria-hidden={!open}
          style={{
            position: "absolute", top: `calc(100% + ${PANEL_GAP}px)`, right: 0,
            width: pillSize, height: pillSize,
            borderRadius: "22px",
            background: "var(--surface-nav)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            border: "1px solid var(--surface-glass-border)",
            boxShadow: "0 20px 44px rgba(var(--shadow-tint-rgb),0.2), var(--glass-bevel)",
            overflow: "hidden",
            opacity: 0,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <nav
            ref={panelBodyRef}
            aria-label="Mobile navigation"
            style={{
              display: "flex", flexDirection: "column", gap: "2px",
              padding: "10px",
              width: openWidth,
              opacity: 0,
              transform: "translateY(-6px)",
            }}
          >
            {SECTIONS.map(s => <MobileLink key={s.href} href={s.href} label={s.label} />)}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", width: "100%",
                paddingTop: "10px", marginTop: "6px",
                border: "none", borderTop: "1px solid var(--col-border)",
                background: "transparent", cursor: "pointer",
              }}
            >
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--col-muted)" }}>
                Theme
              </span>
              <span style={{ width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--col-muted)" }}>
                {isDark ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.7l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1"
                      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M14 9.3A6.3 6.3 0 1 1 6.7 2 5 5 0 0 0 14 9.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Entry point — picks the render branch. isMobile starts false (SSR
   default), so the desktop nav is what server-renders; the mobile
   nav takes over after mount on narrow viewports. Since the two are
   entirely separate components, neither can leak styling into the
   other.
   ══════════════════════════════════════════════════════════════════ */
export default function Header() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileNav /> : <DesktopNav />;
}
