"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useIsMobile } from "@/lib/useIsMobile";
import MobileFloatingMenu from "./MobileFloatingMenu";

interface NavItem {
  id: string;
  label: string;
}

/**
 * Scroll-spy: watches every section for intersection with a band near the
 * top of the viewport and reports whichever one is currently "current" —
 * same IntersectionObserver approach as Header.tsx's active-link tracking,
 * tuned with a tighter rootMargin since these sections sit in a column
 * next to a sticky nav rather than behind a fixed top bar.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
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
        if (bestId) setActive(bestId);
      },
      { threshold: [0.1, 0.3, 0.6], rootMargin: "-110px 0px -55% 0px" }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

/* Back link — shared shape between desktop and mobile, just restyled.
   Lives inside the sticky container on both, not above it, so it scrolls
   as one group with the section nav instead of disappearing on its own. */
function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M11.5 7H2.5M2.5 7L6 3.5M2.5 7L6 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "9px",
        fontFamily: "var(--font-sans)",
        fontSize: "15px",
        fontWeight: 500,
        color: "var(--col-fg)",
        textDecoration: "none",
      }}
    >
      <BackArrow />
      {label}
    </Link>
  );
}

/* ─── Desktop: vertical sticky rail — back link + numbered rows share one
   sticky container so they scroll and stick together as a single group;
   active row gets a pill background, inactive rows get a subtle hover
   pill too. ──────────────────────────────────────────────────────────── */
function DesktopNav({
  items, active, backHref, backLabel,
}: { items: NavItem[]; active: string | null; backHref: string; backLabel: string }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        position: "sticky",
        top: "110px",
        alignSelf: "start",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <BackLink href={backHref} label={backLabel} />
      {items.length > 0 && (
      <nav aria-label="Case study sections" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {items.map((item, i) => {
        const isActive = active === item.id;
        const isHovered = hovered === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              padding: "8px 12px",
              borderRadius: "7px",
              background: isActive ? "var(--toc-active-bg)" : isHovered ? "var(--toc-active-bg)" : "transparent",
              opacity: isActive ? 1 : isHovered ? 0.7 : 1,
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 160ms var(--ease-out), opacity 160ms var(--ease-out)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 500,
                color: isActive ? "var(--col-fg)" : "var(--col-muted-2)",
                transition: "color 160ms var(--ease-out)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 500,
                color: isActive ? "var(--col-fg)" : "var(--col-muted-2)",
                whiteSpace: "nowrap",
                transition: "color 160ms var(--ease-out)",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
      </nav>
      )}
    </div>
  );
}

/* ─── Mobile: bottom floating pill menu — the horizontal sticky-scroller
   this replaces didn't work well on phone (needed a scroll gesture just
   to see what sections existed). Trigger pill shows the current section;
   tapping expands the full list (plus Back) as one MobileFloatingMenu. ── */
function MobileNav({
  items, active, backHref, backLabel,
}: { items: NavItem[]; active: string | null; backHref: string; backLabel: string }) {
  if (items.length === 0) {
    /* Nothing to pick from — just float a small back button. */
    return (
      <Link
        href={backHref}
        aria-label={backLabel}
        style={{
          position: "fixed",
          left: "50%",
          bottom: "calc(18px + env(safe-area-inset-bottom, 0px))",
          transform: "translateX(-50%)",
          zIndex: 50,
          width: 46, height: 46,
          borderRadius: "50%",
          display: "grid", placeItems: "center",
          background: "var(--surface-nav)",
          border: "1px solid var(--surface-glass-border)",
          boxShadow: "0 10px 26px rgba(var(--shadow-tint-rgb),0.2), var(--glass-bevel)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          color: "var(--col-fg)",
        }}
      >
        <BackArrow />
      </Link>
    );
  }

  const activeIndex = Math.max(0, items.findIndex(i => i.id === active));
  const activeItem = items[activeIndex];
  const triggerLabel = `${String(activeIndex + 1).padStart(2, "0")} · ${activeItem.label}`;

  return (
    <MobileFloatingMenu
      triggerLabel={triggerLabel}
      leading={{ label: backLabel, onSelect: () => { window.location.href = backHref; } }}
      items={items.map((item, i) => ({
        key: item.id,
        label: `${String(i + 1).padStart(2, "0")} · ${item.label}`,
        active: item.id === active,
        onSelect: () => scrollToSection(item.id),
      }))}
    />
  );
}

export default function CaseStudyNav({
  items, backHref, backLabel,
}: { items: NavItem[]; backHref: string; backLabel: string }) {
  const isMobile = useIsMobile();
  const ids = items.map(i => i.id);
  const active = useActiveSection(ids);

  return isMobile ? (
    <MobileNav items={items} active={active} backHref={backHref} backLabel={backLabel} />
  ) : (
    <DesktopNav items={items} active={active} backHref={backHref} backLabel={backLabel} />
  );
}
