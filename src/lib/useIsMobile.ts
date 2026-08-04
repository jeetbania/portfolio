"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Reusable across every future page — reserved specifically for cases
 * where mobile needs a genuinely different DOM/interaction structure
 * (like the nav's expand/collapse pattern), not just smaller sizing.
 * Pure sizing/spacing differences should use a CSS media query instead
 * (see the `@media (max-width: 767px)` block in globals.css) since that
 * resolves instantly at first paint with no JS/hydration flash.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
