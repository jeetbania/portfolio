"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import { EditableText } from "@/lib/contentEditor";

/**
 * A calendar widget — reworked twice now per feedback: first to drop the
 * three-card photo-stack composition down to a single flat card (it was
 * borrowed from a different reference and didn't need to carry over),
 * then to actually feel like a small Apple Calendar widget instead of a
 * generic date display. What that meant concretely: a red month badge
 * matching the real Calendar app icon's own convention, a genuinely live
 * clock (ticks every second, not just "today's date" computed once), and
 * a short agenda list you can tap to cross an item off — same
 * satisfying-toggle language as the to-do list sitting next to it.
 *
 * Also fixed: this card wasn't draggable at all. The bug was stopping
 * pointerdown propagation on the whole card's root wrapper instead of
 * just its buttons — that ate the drag gesture before CanvasCard's own
 * handler ever saw it, for a drag starting ANYWHERE on the card, not
 * just on a button. Same fix as CanvasWidgetCards.tsx: stopPropagation
 * only on the actual interactive controls now.
 */

const AGENDA: { time: string; label: string; dot: string }[] = [
  { time: "9:30", label: "Standup", dot: "#3E7BFA" },
  { time: "1:00", label: "Design review", dot: "#2E9B6B" },
  { time: "6:00", label: "Ship it 🚀", dot: "#E8734A" },
];

export function CalendarCard({ id }: { id: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [reminderSet, setReminderSet] = useState(false);
  const [done, setDone] = useState<boolean[]>(() => AGENDA.map(() => false));
  // Starts null rather than `new Date()` — the server renders this
  // component too (at whatever instant its render happens to run), and
  // the client's first render happens at a slightly later instant, so
  // "the current time" is never actually the same value on both sides.
  // React hydration compares server and client markup and errors on any
  // mismatch; starting from an identical, non-time-dependent value on
  // both, then only ever setting the real clock inside an effect (which
  // only runs client-side, after hydration), sidesteps that entirely.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const weekday = now ? now.toLocaleDateString("en-US", { weekday: "long" }) : "";
  const month = now ? now.toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "";
  const day = now ? now.getDate() : "";
  const time = now ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }) : "";

  const toggleDone = (i: number) => setDone(d => d.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div style={{
      background: "var(--canvas-mount-bg)",
      borderRadius: "18px",
      boxShadow: "var(--canvas-mount-shadow)",
      outline: "2px solid var(--canvas-mount-outline)",
      padding: "18px 18px 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        {/* Month badge — same shape/proportion language as the real iOS
            Calendar app icon (red header, huge date number below it). */}
        <div style={{
          flexShrink: 0, width: "48px", borderRadius: "11px", overflow: "hidden",
          boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
        }}>
          <div style={{
            background: "#E8433E", color: "#fff",
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "10px",
            letterSpacing: "0.03em", textAlign: "center", padding: "3px 0",
          }}>
            {month}
          </div>
          <div style={{
            background: "var(--canvas-ink-strong)", color: "var(--canvas-mount-bg)",
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "22px",
            textAlign: "center", padding: "3px 0 5px", lineHeight: 1,
          }}>
            {day}
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px", color: "var(--canvas-ink-strong)", margin: 0, lineHeight: 1.2 }}>
            {weekday}
          </p>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--col-muted)",
            margin: "2px 0 0", fontVariantNumeric: "tabular-nums",
          }}>
            {time}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "14px" }}>
        {AGENDA.map((item, i) => (
          <button
            key={item.label}
            onClick={() => toggleDone(i)}
            onPointerDown={e => e.stopPropagation()}
            style={{
              display: "flex", alignItems: "center", gap: "9px",
              width: "100%", padding: "6px 0",
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              borderTop: i > 0 ? "1px solid var(--canvas-mount-outline)" : "none",
              opacity: done[i] ? 0.5 : 1,
              transition: "opacity 180ms var(--ease-out)",
            }}
          >
            <span aria-hidden="true" style={{ flexShrink: 0, width: "7px", height: "7px", borderRadius: "50%", background: item.dot }} />
            <EditableText
              id={`${id}.agenda[${i}].time`}
              baseValue={item.time}
              style={{
                fontFamily: "var(--font-sans)", fontSize: "12.5px", color: "var(--col-muted)",
                fontVariantNumeric: "tabular-nums", flexShrink: 0,
              }}
            />
            <EditableText
              id={`${id}.agenda[${i}].label`}
              baseValue={item.label}
              style={{
                fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--canvas-ink-strong)",
                textDecoration: done[i] ? "line-through" : "none",
              }}
            />
          </button>
        ))}
      </div>

      <button
        onClick={() => setReminderSet(s => !s)}
        onPointerDown={e => e.stopPropagation()}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
          padding: "10px 14px",
          borderRadius: "999px",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "12.5px",
          // The "set" state used to blend gold into --canvas-mount-bg for
          // both themes — fine in light mode, but in dark mode that mix
          // lands on a muddy dark olive with barely-legible text. A solid,
          // fully-saturated gold with dark ink reads clearly regardless of
          // what's behind it, so dark mode gets its own values instead of
          // reusing light mode's softer blend.
          background: reminderSet ? (isDark ? "#F0B429" : "#FDECC8") : "var(--surface-glass)",
          color: reminderSet ? (isDark ? "#2E1F03" : "#8A5B0A") : "var(--canvas-ink-strong)",
          transition: "background 200ms var(--ease-out), color 200ms var(--ease-out), transform 220ms cubic-bezier(0.34,1.6,0.64,1)",
          transform: reminderSet ? "scale(1.03)" : "scale(1)",
        }}
      >
        {reminderSet ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7.2 5.5 10.2 11.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Reminder set
          </>
        ) : (
          <>🔔 Set a reminder</>
        )}
      </button>
    </div>
  );
}
