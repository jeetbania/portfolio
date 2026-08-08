import { interactions } from "@/data/interactions";
import InteractionCard from "./InteractionCard";

/**
 * The "Interactions" tab's content — a feed of short UI-animation clips
 * (see src/data/interactions.ts for the empty-until-Jeet-adds-some data
 * file, and InteractionCard.tsx for the card itself). Same
 * dashed-border-glass empty state WorkFilterGrid uses for "no results",
 * reused here for "no clips yet" rather than inventing a second visual
 * language for the same basic idea.
 */
export default function InteractionsGrid() {
  if (interactions.length === 0) {
    return (
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
          New interactions dropping soon, check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div
      className="interactions-grid"
      style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(14px,2vw,24px)" }}
    >
      {interactions.map((interaction, i) => (
        <InteractionCard key={interaction.id} interaction={interaction} index={i} />
      ))}
    </div>
  );
}
