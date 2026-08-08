"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { useDevToolsAllowed } from "./devToolsGate";

/**
 * Dev-only in-place copy editor for case-study text — the third tool in
 * this set, alongside the (now-removed) Image Card DialKit panel and the
 * still-here image anchor tool (src/lib/imageAnchor.tsx). Checked whether
 * DialKit or Toolcraft could cover this first:
 * - DialKit's control types (slider/toggle/color/text/select/spring/
 *   action/folder) do have a `text` control, but only for a single,
 *   statically-declared string per config key — there's no way to express
 *   "however many paragraph/list/stat blocks this section happens to
 *   have" without a hardcoded max-blocks workaround, and no rich/
 *   multi-line editing surface. Fine for a handful of named knobs, wrong
 *   shape for a whole page of prose.
 * - The "Toolcraft" skills available in this environment are for
 *   generating separate standalone apps, not editing an existing repo's
 *   own components/data — not applicable here.
 * So: bespoke, same shape as imageAnchor.tsx. Values persist to
 * localStorage per case study (`case-study-copy:{slug}`), edited directly
 * on the real rendered page (click text, type, click away) rather than in
 * a separate form — same reasoning as why the anchor tool edits directly
 * on the image instead of via x/y sliders. Copy the JSON out (the panel's
 * "Copy JSON" button) once it reads right, and hand it back to bake into
 * caseStudies.ts as the new source text.
 *
 * Each edit is stored under a self-describing id — e.g.
 * `"showcase.blocks[0].text"`, `"tldr.blocks[0].items[2].label"` — a flat
 * map, not a reconstructed content tree, so this file never needs to know
 * the shape of ContentBlock. `EditableText` is what every editable field
 * in CaseStudyContent.tsx/QuoteBlock.tsx renders through.
 */

type OverrideMap = Record<string, string>;

type ContentEditorContextValue = {
  overrides: OverrideMap;
  editModeOn: boolean;
  setEditModeOn: (on: boolean) => void;
  setOverride: (id: string, value: string) => void;
  resetAll: () => void;
};

const ContentEditorContext = createContext<ContentEditorContextValue | null>(null);

function storageKey(slug: string) {
  return `case-study-copy:${slug}`;
}

/** Wrap a whole case-study page in this once — every `<EditableText>`
 * inside reconnects to the same shared state via context. */
export function ContentEditorProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [editModeOn, setEditModeOn] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = false;
    try {
      const raw = localStorage.getItem(storageKey(slug));
      setOverrides(raw ? JSON.parse(raw) : {});
    } catch {
      setOverrides({});
    }
    loadedRef.current = true;
  }, [slug]);

  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      localStorage.setItem(storageKey(slug), JSON.stringify(overrides));
    } catch {
      // localStorage unavailable — edits still work this session, just
      // won't survive a reload.
    }
  }, [overrides, slug]);

  const setOverride = useCallback((id: string, value: string) => {
    setOverrides(prev => (prev[id] === value ? prev : { ...prev, [id]: value }));
  }, []);

  const resetAll = useCallback(() => setOverrides({}), []);

  const value = useMemo<ContentEditorContextValue>(() => ({
    overrides, editModeOn, setEditModeOn, setOverride, resetAll,
  }), [overrides, editModeOn, setOverride, resetAll]);

  return <ContentEditorContext.Provider value={value}>{children}</ContentEditorContext.Provider>;
}

const EMPTY_OVERRIDES: OverrideMap = {};
function noop() {}

/** No-provider fallback (same reasoning as imageAnchor.tsx's) so
 * CaseStudyContent also works standalone from the blog post page, which
 * reuses it without wrapping it in a ContentEditorProvider. */
const FALLBACK_CONTEXT: ContentEditorContextValue = {
  overrides: EMPTY_OVERRIDES,
  editModeOn: false,
  setEditModeOn: noop,
  setOverride: noop,
  resetAll: noop,
};

function useContentEditorContext(): ContentEditorContextValue {
  return useContext(ContentEditorContext) ?? FALLBACK_CONTEXT;
}

type EditableTag = "p" | "h2" | "h3" | "span" | "div" | "li";

/**
 * Renders `id`'s current value (an override if one's been typed, else
 * `baseValue` from the data file) as the given tag. Outside edit mode
 * this is just that tag with that text — zero visual/behavioral
 * difference from a plain element. In edit mode it becomes directly
 * click-and-type editable in place, dashed-outlined so it's clear what's
 * editable, committing on blur.
 *
 * Deliberately doesn't pass the resolved text as JSX children while
 * editable — contentEditable's DOM mutations happen outside React's
 * render cycle, so handing React the same text as children too would
 * fight the browser over who owns it mid-keystroke. Instead the text is
 * set imperatively (via the ref effect below) and only ever resynced
 * from outside while the field ISN'T focused.
 */
export function EditableText({
  id, baseValue, as = "span", style, className,
}: {
  id: string;
  baseValue: string;
  as?: EditableTag;
  style?: React.CSSProperties;
  className?: string;
}) {
  const { overrides, editModeOn, setOverride } = useContentEditorContext();
  const value = overrides[id] ?? baseValue;
  const ref = useRef<HTMLElement>(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el || !editModeOn) return;
    if (document.activeElement !== el && el.textContent !== value) {
      el.textContent = value;
    }
  }, [value, editModeOn]);

  if (!editModeOn) {
    return <Tag style={style} className={className}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref as React.Ref<never>}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      style={{
        ...style,
        outline: "1px dashed rgba(224,75,75,0.45)",
        outlineOffset: "3px",
        borderRadius: "3px",
        cursor: "text",
      }}
      className={className}
      onFocus={e => {
        e.currentTarget.style.outline = "1px dashed rgba(224,75,75,0.9)";
        e.currentTarget.style.background = "rgba(224,75,75,0.06)";
      }}
      onBlur={e => {
        e.currentTarget.style.outline = "1px dashed rgba(224,75,75,0.45)";
        e.currentTarget.style.background = "transparent";
        setOverride(id, e.currentTarget.textContent ?? "");
      }}
      onPaste={e => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        if (document.queryCommandSupported?.("insertText")) {
          document.execCommand("insertText", false, text);
        } else {
          e.currentTarget.textContent += text;
        }
      }}
      onKeyDown={e => {
        // Every editable field here maps to a single-line string in the
        // data file — Enter commits instead of inserting a line break.
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}

const editorBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.12)", color: "#fff", border: "none",
  borderRadius: "6px", padding: "6px 8px", cursor: "pointer",
  fontFamily: "var(--font-mono)", fontSize: "11px",
};

/** Floating "Edit Copy" toggle + panel — mount once alongside
 * `<ContentEditorProvider>`. Sits top-left (AnchorToggle owns bottom-left)
 * so the two dev-tool docks never collide. Gated by `useDevToolsAllowed()`
 * (devToolsGate.ts) so it renders on Vercel previews and localhost but
 * never on the real production domain — see that file for why NODE_ENV
 * alone can't tell preview and production apart. Edits only ever write to
 * the visitor's own localStorage (per-slug), never anything server-side,
 * but per Jeet this should never even be reachable on the main site — same
 * reasoning as AnchorToggle in imageAnchor.tsx. */
export function ContentEditorToggle() {
  const devToolsAllowed = useDevToolsAllowed();
  const { editModeOn, setEditModeOn, overrides, resetAll } = useContentEditorContext();
  const [copied, setCopied] = useState(false);

  const count = Object.keys(overrides).length;

  const handleCopy = async () => {
    const json = JSON.stringify(overrides, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this JSON:", json);
    }
  };

  if (!devToolsAllowed) return null;

  return (
    <div style={{
      position: "fixed", left: "20px", top: "20px", zIndex: 9999,
      display: "flex", flexDirection: "column", gap: "8px",
      fontFamily: "var(--font-mono)", fontSize: "12px",
    }}>
      <button
        onClick={() => setEditModeOn(!editModeOn)}
        style={{
          alignSelf: "flex-start",
          background: editModeOn ? "#e04b4b" : "rgba(20,20,24,0.92)",
          color: "#fff", border: "none", borderRadius: "999px",
          padding: "10px 16px", cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
      >
        {editModeOn ? "✕ Exit edit mode" : "✏️ Edit copy"}
      </button>
      {editModeOn && (
        <div style={{
          background: "rgba(20,20,24,0.92)", color: "#fff",
          borderRadius: "10px", padding: "10px 12px",
          display: "flex", flexDirection: "column", gap: "8px",
          width: "190px", boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}>
          <div style={{ lineHeight: 1.4 }}>Click any dashed text to edit it. Enter commits.</div>
          <div style={{ opacity: 0.7 }}>{count} field{count === 1 ? "" : "s"} edited</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={handleCopy} style={editorBtnStyle}>{copied ? "Copied!" : "Copy JSON"}</button>
            <button onClick={resetAll} style={editorBtnStyle}>Reset all</button>
          </div>
        </div>
      )}
    </div>
  );
}
