"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { animate } from "motion";
import { useTheme } from "@/lib/theme";
import { useIsMobile } from "@/lib/useIsMobile";

/* Sections that get auto-highlighted as user scrolls */
const SECTIONS = [
  { id: "about",      href: "/about",       label: "About",      side: "left"  },
  { id: "playground", href: "/#playground", label: "Playground", side: "left"  },
  { id: "work",       href: "/work",        label: "Work",       side: "right" },
  { id: "blog",       href: "/blog",        label: "Blog",       side: "right" },
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
    const sectionIds = SECTIONS.map(s => s.id);
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
   DESKTOP nav — unchanged from before, byte-for-byte, gated behind
   isMobile === false so nothing here can regress the desktop layout.
   ══════════════════════════════════════════════════════════════════ */
function DesktopNav() {
  const { visible, active } = useHeaderState();
  const [hovered, setHovered] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (visible) {
      animate(el, { y: 0, opacity: 1, scale: 1 },
        reduced ? { duration: 0 } : { type: "spring", duration: 0.45, bounce: 0.26 });
    } else {
      animate(el, { y: -14, opacity: 0, scale: 0.96 },
        reduced ? { duration: 0 } : { type: "spring", duration: 0.28, bounce: 0 });
    }
  }, [visible]);

  const NavLink = useCallback(({ href, label }: { href: string; label: string }) => {
    const isActive  = active  === href;
    const isHovered = hovered === href;
    return (
      <Link
        href={href}
        onMouseEnter={() => setHovered(href)}
        onMouseLeave={() => setHovered(null)}
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
  }, [active, hovered]);

  const Divider = () => (
    <div aria-hidden="true" style={{ width: 1, height: 16, background: "var(--col-border)", margin: "0 3px", flexShrink: 0 }} />
  );

  const leftLinks  = SECTIONS.filter(s => s.side === "left");
  const rightLinks = SECTIONS.filter(s => s.side === "right");

  return (
    <div style={{ position: "fixed", top: "14px", left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        ref={wrapRef}
        style={{
          display: "inline-flex", alignItems: "center", gap: "2px",
          padding: "5px 8px", borderRadius: "99px",
          background: "var(--surface-nav)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          border: "1px solid var(--surface-glass-border)",
          boxShadow: [
            "0 1px 0 rgba(255,255,255,0.2) inset",
            "0 2px 8px rgba(var(--shadow-tint-rgb),0.1)",
            "0 8px 24px rgba(var(--shadow-tint-rgb),0.06)",
          ].join(", "),
          pointerEvents: visible ? "auto" : "none",
          willChange: "transform, opacity",
          opacity: 0,
          transform: "translateY(-14px) scale(0.96)",
          transition: "background 320ms var(--ease-out), border-color 320ms var(--ease-out), box-shadow 320ms var(--ease-out)",
        }}
      >
        <nav aria-label="Left navigation" style={{ display: "flex", alignItems: "center", gap: "1px" }}>
          {leftLinks.map(n => <NavLink key={n.href} href={n.href} label={n.label} />)}
        </nav>
        <Divider />
        <Link href="/" style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 400, color: "var(--col-fg)", textDecoration: "none", padding: "4px 14px", whiteSpace: "nowrap" as const, letterSpacing: "-0.01em" }}>
          Jeet Bania
        </Link>
        <Divider />
        <nav aria-label="Right navigation" style={{ display: "flex", alignItems: "center", gap: "1px" }}>
          {rightLinks.map(n => <NavLink key={n.href} href={n.href} label={n.label} />)}
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
const PANEL_OPEN_SPRING  = { type: "spring" as const, duration: 0.48, bounce: 0.4  };
const PANEL_CLOSE_SPRING = { type: "spring" as const, duration: 0.28, bounce: 0.08 };
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
        reduced ? { duration: 0 } : { type: "spring", duration: 0.36, bounce: 0.1, delay: 0.06 });
    } else {
      animate(box, { width: `${pillSize}px`, height: `${pillSize}px`, opacity: 0 },
        reduced ? { duration: 0 } : PANEL_CLOSE_SPRING);
      animate(body, { opacity: 0, y: -6 },
        reduced ? { duration: 0 } : { type: "spring", duration: 0.18, bounce: 0 });
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
