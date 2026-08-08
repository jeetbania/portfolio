import Folder from "./Folder";
import { projects } from "@/data/projects";

export default function WorkGrid() {
  return (
    <section
      id="work"
      aria-label="Selected work"
      className="work-section"
      style={{
        padding: "clamp(16px,2.5vh,32px) clamp(24px,5vw,72px) clamp(24px,4vh,48px)",
        maxWidth: "1020px",
        margin: "0 auto",
      }}
    >
      {/* Header — centred */}
      <div style={{ marginBottom:"clamp(36px,5vh,56px)", textAlign:"center" }}>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"11px", letterSpacing:"0.1em",
          textTransform:"uppercase", color:"var(--col-muted)", marginBottom:"10px" }}>
          Selected work
        </p>
        <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(34px,5vw,56px)",
          fontWeight:400, lineHeight:1.05, letterSpacing:"-0.02em" }}>
          Peak into my work
        </h2>
        <p style={{ fontFamily:"var(--font-hand)", fontSize:"clamp(20px,2.8vw,26px)",
          color:"var(--col-muted)", marginTop:"8px" }}>
          Yep, go ahead and judge it
        </p>
      </div>

      {/* 2-column on desktop; collapses to 1 column on mobile via
          .work-grid's media query in globals.css — pure CSS, no JS,
          so desktop is byte-for-byte unaffected. */}
      <div className="work-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)",
        gap:"clamp(14px,2vw,24px)" }}>
        {projects.map(project => (
          <Folder key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
