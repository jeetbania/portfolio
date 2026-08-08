"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import WorkModeToggle, { type WorkMode } from "./WorkModeToggle";
import WorkFilterGrid from "./WorkFilterGrid";
import InteractionsGrid from "./InteractionsGrid";

/**
 * /work's hero + content area, split out from page.tsx (a server
 * component, needed for the `metadata` export) since switching modes
 * needs client state. Mirrors the reference pattern this was built from:
 * a "Work / Interactions" toggle at the very top switches the whole
 * content area between the case-study grid and the short-clip feed
 * (InteractionsGrid.tsx) — two different kinds of content, not a filter
 * within one grid, which is why this doesn't just extend FilterBar.
 */
export default function WorkPageBody({ projects }: { projects: Project[] }) {
  const [mode, setMode] = useState<WorkMode>("work");

  return (
    <>
      {/* marginBottom was clamp(48px,7vh,72px), sized back when a subtitle
          paragraph sat between the h1 and the grid below — once that was
          removed the same gap read as way too much dead space directly
          under the heading. Tightened now that the h1 is the last thing
          in this block. */}
      <div style={{ marginBottom: "clamp(24px, 3.5vh, 36px)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "22px" }}>
          <WorkModeToggle mode={mode} onModeChange={setMode} />
        </div>
        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: "clamp(38px, 6vw, 64px)",
          fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em",
          maxWidth: "680px", marginLeft: "auto", marginRight: "auto",
        }}>
          {mode === "work"
            ? "A closer look at what I've built."
            : "Small stuff, shipped quickly."}
        </h1>
      </div>

      {mode === "work" ? <WorkFilterGrid projects={projects} /> : <InteractionsGrid />}
    </>
  );
}
