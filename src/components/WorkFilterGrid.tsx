"use client";

import { useMemo, useState } from "react";
import Folder from "./Folder";
import FilterBar, { type SortDir } from "./FilterBar";
import type { Project } from "@/data/projects";

/* Curated, not derived from every tag in projects.ts — keeps the bar short
   enough to sit on one line next to search + sort instead of wrapping. */
const FILTERS = ["All", "UX Design", "Motion", "Branding", "Dev"];

export default function WorkFilterGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortDir>("newest");

  const filtered = useMemo(() => {
    let list = active === "All" ? projects : projects.filter(p => p.tags.includes(active));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    /* Projects don't carry a date field — "Newest" keeps the catalog's own
       order (its natural, most-recent-first sequence), "Oldest" reverses it. */
    if (sort === "oldest") list = [...list].reverse();
    return list;
  }, [projects, active, query, sort]);

  return (
    <>
      <FilterBar
        filters={FILTERS}
        active={active}
        onActiveChange={setActive}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search projects"
        sort={sort}
        onSortToggle={() => setSort(s => (s === "newest" ? "oldest" : "newest"))}
      />

      {filtered.length > 0 ? (
        <div
          className="work-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(14px,2vw,24px)" }}
        >
          {filtered.map((project, i) => (
            <div
              key={`${active}-${sort}-${project.slug}`}
              style={{ animation: `work-item-in 460ms var(--ease-spring) both`, animationDelay: `${i * 45}ms` }}
              onAnimationEnd={e => { e.currentTarget.style.animation = "none"; }}
            >
              <Folder project={project} strongGlass />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "64px 24px",
            textAlign: "center",
            borderRadius: "20px",
            background: "var(--surface-glass)",
            border: "1px dashed var(--col-border)",
          }}
        >
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "20px", color: "var(--col-muted)" }}>
            Nothing here yet — try a different search or filter.
          </p>
        </div>
      )}
    </>
  );
}
