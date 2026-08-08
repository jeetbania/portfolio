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
      <div style={{ marginBottom: "clamp(48px, 7vh, 72px)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "22px" }}>
          <WorkModeToggle mode={mode} onModeChange={setMode} />
        </div>
        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: "clamp(38px, 6vw, 64px)",
          fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "18px",
          maxWidth: "680px", marginLeft: "auto", marginRight: "auto",
        }}>
          {mode === "work"
            ? "A closer look at what I've built."
            : "Small stuff, shipped quickly."}
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 500,
          letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--col-muted)",
          maxWidth: "560px", marginLeft: "auto", marginRight: "auto",
        }}>
          {mode === "work"
            ? "Product design, motion, and everything in between — six projects, six different problems, one obsession with getting the details right."
            : "UI experiments and micro-interactions I've posted along the way, no case study attached. Click any clip to see the original post."}
        </p>
      </div>

      {mode === "work" ? <WorkFilterGrid projects={projects} /> : <InteractionsGrid />}
    </>
  );
}
