"use client";

import ToolCard from "./ToolCard";
import type { Tool } from "@/data/tools";

/**
 * Just the animated grid, split out of /tools/page.tsx into its own
 * Client Component, same reason BlogFilterGrid is split from /blog/page.tsx:
 * the per-card entrance animation needs an onAnimationEnd handler, which
 * can't be passed from a Server Component (page.tsx keeps its `metadata`
 * export, which requires staying a Server Component itself).
 */
export default function ToolsGrid({ tools }: { tools: Tool[] }) {
  return (
    <div
      className="tool-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "clamp(14px, 2vw, 24px)",
      }}
    >
      {tools.map((tool, i) => {
        // An odd tool count (true today, at 5) leaves the last row with
        // only one card, the other half of that row was just bare page
        // background sitting directly next to a filled card, a hard,
        // visible edge that's what actually looked like a rendering
        // glitch near the bottom of the grid. Spanning the lone trailing
        // card across both columns removes the empty half entirely
        // instead of just living with it.
        const isTrailingOdd = tools.length % 2 === 1 && i === tools.length - 1;
        return (
          <div
            key={tool.slug}
            style={{
              height: "100%",
              gridColumn: isTrailingOdd ? "1 / -1" : undefined,
              animation: "work-item-in 460ms var(--ease-spring) both",
              animationDelay: `${i * 45}ms`,
            }}
            onAnimationEnd={e => { e.currentTarget.style.animation = "none"; }}
          >
            <ToolCard tool={tool} wide={isTrailingOdd} />
          </div>
        );
      })}
    </div>
  );
}
