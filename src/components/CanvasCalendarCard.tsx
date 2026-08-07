"use client";

import { useState } from "react";

/**
 * A calendar widget rebuilt off a reference screenshot: a stack of three
 * cards (two peeking behind at slight angles, one flat white card in
 * front holding the actual content) rather than the mount+inner-card
 * chrome the notes/todo/coffee cards use — this one's a genuinely
 * different composition (a photo stack, not a matted card), so it gets
 * its own layout instead of being forced into CanvasCardChrome.
 *
 * Shows today's actual date (computed client-side at render — this is
 * already a client component, and the date only needs to be right for
 * whoever's looking at the page right now, not stable across a server
 * render). The "slightly more interactive" ask: the reminder button is a
 * real toggle, not a static label — click it and it switches to a
 * confirmed state with its own color and icon, same satisfying-toggle
 * feel as the to-do list's checkboxes next to it on the canvas.
 */
export function CalendarCard() {
  const [reminderSet, setReminderSet] = useState(false);

  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "short" });
  const day = now.getDate();
  const month = now.toLocaleDateString("en-US", { month: "long" });

  return (
    <div style={{ position: "relative" }} onPointerDown={e => e.stopPropagation()}>
      {/* Back layer — plain, furthest back, a few "ring binder" dots
          visible along its exposed left edge. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", left: "-16px", top: "22px",
          width: "100%", height: "88%",
          borderRadius: "18px",
          background: "var(--canvas-mount-bg)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.14)",
          transform: "rotate(-8deg)",
          zIndex: 0,
        }}
      >
        <div style={{ position: "absolute", left: "14px", top: "16px", display: "flex", flexDirection: "column", gap: "9px" }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ width: "13px", height: "13px", borderRadius: "50%", background: "color-mix(in srgb, var(--canvas-ink-strong) 12%, transparent)" }} />
          ))}
        </div>
        <span style={{
          position: "absolute", left: "20px", bottom: "10px",
          fontFamily: "var(--font-hand)", fontSize: "18px", color: "var(--col-muted)",
          transform: "rotate(2deg)",
        }}>
          Something fun, maybe
        </span>
      </div>

      {/* Middle layer — cream-to-gold, peeking above/right of the front card. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", left: "12px", top: "-14px",
          width: "94%", height: "86%",
          borderRadius: "18px",
          background: "linear-gradient(180deg, #FCF1BE 0%, #F6D949 62%)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.16)",
          transform: "rotate(5deg)",
          zIndex: 1,
        }}
      >
        <span style={{
          position: "absolute", top: "14px", left: "18px",
          fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px",
          letterSpacing: "0.06em", textTransform: "uppercase", color: "#B8912A",
        }}>
          Calendar 🛈
        </span>
      </div>

      {/* Front layer — the actual content. */}
      <div style={{
        position: "relative", zIndex: 2,
        background: "var(--canvas-mount-bg)",
        borderRadius: "18px",
        boxShadow: "0 10px 26px rgba(0,0,0,0.20)",
        padding: "20px 18px 16px",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px",
          letterSpacing: "0.06em", textTransform: "uppercase", color: "#D9A420",
          margin: "0 0 6px",
        }}>
          Today
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "20px", color: "var(--canvas-ink-strong)", margin: "0 0 3px", lineHeight: 1.15 }}>
          {weekday}, {day} {month}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", color: "var(--col-muted)", margin: "0 0 22px" }}>
          Live from the calendar
        </p>
        <button
          onClick={() => setReminderSet(s => !s)}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
            padding: "11px 14px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px",
            background: reminderSet ? "color-mix(in srgb, #F6D949 35%, var(--canvas-mount-bg))" : "var(--surface-glass)",
            color: reminderSet ? "#8A5B0A" : "var(--canvas-ink-strong)",
            transition: "background 200ms var(--ease-out), color 200ms var(--ease-out), transform 220ms cubic-bezier(0.34,1.6,0.64,1)",
            transform: reminderSet ? "scale(1.03)" : "scale(1)",
          }}
        >
          {reminderSet ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7.2 5.5 10.2 11.5 3.8" stroke="#8A5B0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Reminder set
            </>
          ) : (
            <>🔔 Set a reminder</>
          )}
        </button>
      </div>
    </div>
  );
}
