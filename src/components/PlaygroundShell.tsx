"use client";

import { ContentEditorProvider, ContentEditorToggle } from "@/lib/contentEditor";
import { AnchorProvider, AnchorToggle } from "@/lib/imageAnchor";
import PlaygroundCanvas from "./PlaygroundCanvas";

/**
 * Same two dev-tool pattern as the case-study pages' own CaseStudyShell.tsx:
 * - `<ContentEditorProvider>` + `<ContentEditorToggle>` — in-place copy
 *   editing (src/lib/contentEditor.tsx), toggle top-left. Click any
 *   dashed-outlined text on the page and type to edit it, then "Copy
 *   JSON" to hand back the final copy.
 * - `<AnchorProvider>` + `<AnchorToggle>` — per-image crop/zoom
 *   (src/lib/imageAnchor.tsx), toggle bottom-left. Click/drag directly on
 *   a photo to pick its focal point, scroll/pinch/+−  to zoom in past the
 *   default cover crop.
 * Both use their own slug ("playground", not tied to any case study) so
 * edits here live under their own localStorage keys and never collide
 * with a real case study's.
 *
 * Only wraps <PlaygroundCanvas> (not the whole /playground page) since
 * that's where every <EditableText>/<AnchoredImage> actually lives —
 * StickyNote, PhotoNote, TodoWidgetCard, and CalendarCard all read from
 * this same context now (see their own files for the `id` prop each one
 * takes to build stable, unique field ids like "sticky-1.title").
 */
export default function PlaygroundShell() {
  return (
    <AnchorProvider slug="playground">
      <ContentEditorProvider slug="playground">
        <PlaygroundCanvas />
        <AnchorToggle />
        <ContentEditorToggle />
      </ContentEditorProvider>
    </AnchorProvider>
  );
}
