"use client";

import { ContentEditorProvider, ContentEditorToggle } from "@/lib/contentEditor";
import PlaygroundCanvas from "./PlaygroundCanvas";

/**
 * Same tool as the case-study pages' own CaseStudyShell.tsx (in-place
 * copy editing, see src/lib/contentEditor.tsx) — dev-only (renders
 * nothing in production, per ContentEditorToggle's own early return),
 * click any dashed-outlined text on the page and type to edit it, then
 * "Copy JSON" to hand back the final copy. Uses its own slug
 * ("playground", not tied to any case study) so edits here live under
 * their own localStorage key and never collide with a real case study's.
 *
 * Only wraps <PlaygroundCanvas> (not the whole /playground page) since
 * that's where every <EditableText> actually lives — StickyNote,
 * PhotoNote, TodoWidgetCard, and CalendarCard all read from this same
 * context now (see their own files for the `id` prop each one takes to
 * build stable, unique field ids like "sticky-1.title").
 */
export default function PlaygroundShell() {
  return (
    <ContentEditorProvider slug="playground">
      <PlaygroundCanvas />
      <ContentEditorToggle />
    </ContentEditorProvider>
  );
}
