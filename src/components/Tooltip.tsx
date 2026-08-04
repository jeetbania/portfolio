"use client";

import { cloneElement, isValidElement } from "react";
import type { ReactElement } from "react";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Pure-CSS hover/focus tooltip (transitions.dev pattern — see the
 * `.t-tt*` rules in globals.css). Wraps a single trigger element,
 * injecting the `t-tt-trigger` class it needs for the CSS to pick up
 * both hover (via the wrap) and keyboard focus (via the adjacent-
 * sibling `:focus-visible + .t-tt` rule).
 *
 * Hover has no real touch equivalent — on mobile a tooltip can only ever
 * appear via a stray tap-and-hold or a sticky `:focus-visible` state, both
 * accidental. Skip the tooltip markup there entirely and render just the
 * trigger.
 */
export default function Tooltip({
  label, children,
}: { label: string; children: ReactElement<{ className?: string }> }) {
  const isMobile = useIsMobile();

  if (isMobile) return children;

  const trigger = isValidElement(children)
    ? cloneElement(children, {
        className: [children.props.className, "t-tt-trigger"].filter(Boolean).join(" "),
      })
    : children;

  return (
    <span className="t-tt-wrap">
      {trigger}
      <span className="t-tt" role="tooltip">{label}</span>
    </span>
  );
}
