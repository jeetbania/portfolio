import type { Metadata } from "next";
import { projects } from "@/data/projects";
import WorkPageBody from "@/components/WorkPageBody";
import Footer from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";

export const metadata: Metadata = {
  title: "Work",
  description: "Product, UX, and motion design work.",
};

export default function WorkPage() {
  return (
    <main style={{ background: "var(--col-bg)" }}>
      <div style={{
        maxWidth: "1020px",
        margin: "0 auto",
        padding: "clamp(110px, 15vh, 160px) clamp(24px, 5vw, 72px) clamp(24px, 5vw, 64px)",
      }}>
        {/* ── Hero + mode toggle + content — center-aligned to match the
            About page treatment. maxWidth'd h1/p need margin:auto too,
            not just text-align, since text-align only centers the text
            INSIDE the box — the box itself still needs centering within
            the full-width container. Split into WorkPageBody (client)
            since the Work/Interactions toggle needs state; this file
            stays a server component so the `metadata` export above still
            works. ─────────────────────────────────────────────────── */}
        <WorkPageBody projects={projects} />
      </div>

      <RoundedCap />
      <Footer />
    </main>
  );
}
