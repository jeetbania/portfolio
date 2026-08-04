"use client";

import { useMemo, useState } from "react";
import BlogCard from "./BlogCard";
import FilterBar, { type SortDir } from "./FilterBar";
import { blogCategories } from "@/data/blog";
import type { BlogPost } from "@/data/blog";

export default function BlogFilterGrid({ posts }: { posts: BlogPost[] }) {
  const filters = ["All", ...blogCategories];
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortDir>("newest");

  const filtered = useMemo(() => {
    let list = active === "All" ? posts : posts.filter(p => p.category === active);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) =>
      sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
    return list;
  }, [posts, active, query, sort]);

  return (
    <>
      <FilterBar
        filters={filters}
        active={active}
        onActiveChange={setActive}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search posts"
        sort={sort}
        onSortToggle={() => setSort(s => (s === "newest" ? "oldest" : "newest"))}
      />

      {filtered.length > 0 ? (
        <div
          className="blog-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(272px, 1fr))",
            gap: "clamp(14px, 2vw, 22px)",
          }}
        >
          {filtered.map((post, i) => (
            <div
              key={`${active}-${sort}-${post.slug}`}
              style={{ height: "100%", animation: `work-item-in 460ms var(--ease-spring) both`, animationDelay: `${i * 45}ms` }}
              onAnimationEnd={e => { e.currentTarget.style.animation = "none"; }}
            >
              <BlogCard post={post} />
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
