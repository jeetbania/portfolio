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
   MOBILE nav — a compact pill that expands downward into a full
   vertical menu. Completely separate component/markup from desktop,
   so nothing here can ever affect the desktop nav.
   ══════════════════════════════════════════════════════════════════ */
function MobileNav() {
  const { visible, active } = useHeaderState();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (visible) {
      animate(el, { y: 0, opacity: 1, scale: 1 },
        reduced ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0.24 });
    } else {
      animate(el, { y: -14, opacity: 0, scale: 0.96 },
        reduced ? { duration: 0 } : { type: "spring", duration: 0.26, bounce: 0 });
      setOpen(false);
    }
  }, [visible]);

  /* Close the expanded menu whenever the section changes (link tapped) */
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

  return (
    <div style={{ position: "fixed", top: "14px", left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center", pointerEvents: "none", padding: "0 16px" }}>
      <div
        ref={wrapRef}
        style={{
          width: "min(320px, 100%)",
          borderRadius: "26px",
          background: "var(--surface-nav)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          border: "1px solid var(--surface-glass-border)",
          boxShadow: [
            "0 1px 0 rgba(255,255,255,0.2) inset",
            "0 2px 8px rgba(var(--shadow-tint-rgb),0.1)",
            "0 8px 24px rgba(var(--shadow-tint-rgb),0.08)",
          ].join(", "),
          pointerEvents: visible ? "auto" : "none",
          opacity: 0,
          transform: "translateY(-14px) scale(0.96)",
          overflow: "hidden",
          transition: "background 320ms var(--ease-out), border-color 320ms var(--ease-out)",
        }}
      >
        {/* Compact bar — always visible while the nav is shown */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 8px 10px 18px",
            background: "transparent", border: "none", cursor: "pointer",
          }}
        >
          <span style={{
            fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 400,
            color: "var(--col-fg)", letterSpacing: "-0.01em",
          }}>
            Jeet Bania
          </span>

          {/* Hamburger ⇄ close */}
          <span style={{
            width: 34, height: 34, borderRadius: "50%",
            display: "grid", placeItems: "center",
            background: "var(--surface-glass)",
            flexShrink: 0,
          }}>
            {open ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3 3 13" stroke="var(--col-fg)" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 5h12M2 11h12" stroke="var(--col-fg)" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </span>
        </button>

        {/* Expandable panel — 0fr → 1fr grid trick, same pattern used
            for the Quick Ask response reveal elsewhere in the app */}
        <div style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 360ms cubic-bezier(0.34,1.05,0.64,1)",
        }}>
          <div style={{ overflow: "hidden" }}>
            <nav
              aria-label="Mobile navigation"
              style={{
                display: "flex", flexDirection: "column", gap: "2px",
                padding: "4px 10px 14px",
                borderTop: "1px solid var(--col-border)",
                marginTop: "2px",
              }}
            >
              {SECTIONS.map(s => <MobileLink key={s.href} href={s.href} label={s.label} />)}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", paddingTop: "10px", marginTop: "6px",
                borderTop: "1px solid var(--col-border)",
              }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--col-muted)" }}>
                  Theme
                </span>
                <ThemeToggle size={30} />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
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
