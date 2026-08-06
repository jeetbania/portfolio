"use client";

import { useState } from "react";
import { EditableText } from "@/lib/contentEditor";

/**
 * Neutral, code-block-like quote card (deliberately not the old
 * tintHex-tinted, colored-left-border version — that read as loud/ugly).
 * Body copy is upright mono, not italic serif, closer to how Notion
 * treats a code block than a pull-quote. The top-right toolbar (copy /
 * copy-as-markdown) mirrors that same Notion reference.
 *
 * Visibility is CSS-driven (.quote-toolbar / .quote-block in globals.css),
 * not JS hover state — a JS onMouseEnter/Leave toggle never fires on
 * touch at all, and even a CSS :hover-only reveal leaves keyboard users
 * tabbing onto an invisible, pointer-events:none button with no visual
 * feedback. The actual rule: hidden-until-hover/focus only on devices
 * that genuinely support hover (mouse/trackpad); always visible on touch.
 */

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.2 5.5 10.2 11.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 20 6" fill="none" aria-hidden="true">
      <circle cx="3" cy="3" r="1.7" fill="currentColor" />
      <circle cx="10" cy="3" r="1.7" fill="currentColor" />
      <circle cx="17" cy="3" r="1.7" fill="currentColor" />
    </svg>
  );
}

const toolbarBtnStyle: React.CSSProperties = {
  width: 24, height: 24,
  display: "grid", placeItems: "center",
  borderRadius: "6px",
  border: "1px solid var(--surface-glass-border)",
  background: "var(--surface-glass)",
  color: "var(--col-muted)",
  cursor: "pointer",
  transition: "background 140ms var(--ease-out), color 140ms var(--ease-out)",
};

export default function QuoteBlock({
  text, attribution, textId, attributionId,
}: { text: string; attribution?: string; textId: string; attributionId?: string }) {
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  async function copy(value: string, flag: "plain" | "md") {
    try {
      await navigator.clipboard.writeText(value);
      if (flag === "plain") { setCopiedPlain(true); setTimeout(() => setCopiedPlain(false), 1400); }
      else { setCopiedMd(true); setTimeout(() => setCopiedMd(false), 1400); }
    } catch { /* clipboard unavailable — the toolbar just no-ops */ }
  }

  return (
    <blockquote
      className="quote-block"
      style={{
        margin: 0,
        position: "relative",
        padding: "26px 28px 24px",
        borderRadius: "16px",
        background: "var(--surface-card)",
        border: "1px solid var(--surface-card-border)",
        boxShadow: "0 1px 2px rgba(var(--shadow-tint-rgb),0.05), 0 10px 24px rgba(var(--shadow-tint-rgb),0.06), var(--glass-bevel)",
      }}
    >
      <div className="quote-toolbar" style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "4px" }}>
        <button
          onClick={() => copy(text, "plain")}
          aria-label="Copy quote"
          title="Copy"
          style={toolbarBtnStyle}
        >
          {copiedPlain ? <CheckIcon /> : <CopyIcon />}
        </button>
        <button
          onClick={() => copy(attribution ? `> ${text}\n> — ${attribution}` : `> ${text}`, "md")}
          aria-label="Copy as Markdown"
          title="Copy as Markdown"
          style={toolbarBtnStyle}
        >
          {copiedMd ? <CheckIcon /> : <MoreIcon />}
        </button>
      </div>

      <span aria-hidden="true" style={{
        display: "block",
        fontFamily: "var(--font-serif)",
        fontSize: "42px",
        lineHeight: 1,
        color: "var(--col-muted-2)",
        marginBottom: "-4px",
      }}>
        &ldquo;
      </span>
      <EditableText
        id={textId}
        baseValue={text}
        as="p"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(14.5px, 1.6vw, 16px)",
          lineHeight: 1.7,
          color: "var(--col-fg)",
          margin: 0,
        }}
      />
      {attribution && attributionId && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--col-muted)", marginTop: "12px" }}>
          — <EditableText id={attributionId} baseValue={attribution} as="span" />
        </p>
      )}
    </blockquote>
  );
}
