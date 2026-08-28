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
      {tools.map((tool, i) => (
        <div
          key={tool.slug}
          style={{ height: "100%", animation: "work-item-in 460ms var(--ease-spring) both", animationDelay: `${i * 45}ms` }}
          onAnimationEnd={e => { e.currentTarget.style.animation = "none"; }}
        >
          <ToolCard tool={tool} />
        </div>
      ))}
    </div>
  );
}
