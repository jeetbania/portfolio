# Case study content format

This is the format for handing me real case study copy + assets later.
Duplicate `TEMPLATE.md`, fill it in per project (e.g. `incore.md`), drop
your images in `/public`, and send the .md files back — I'll transcribe
them into `src/data/caseStudies.ts` directly. This file isn't parsed at
build time; it's a handoff format between us, so the syntax only needs
to be predictable, not machine-strict.

## Structure

```md
---
slug: incore
role: Lead Product Designer
timeline: Jun 2024 — Nov 2024
team: 2 designers, 4 engineers, 1 PM
tools: Figma, Framer, Notion
---

## Introduction

A paragraph is just a plain line of text like this one.

**Stats**
- Timeline: 6 months
- Platform: Web app
- Role: Lead Product Designer

## User research

### A subheading inside a section

Another paragraph.

![Alt text describing the image](research-1.jpg)
![Alt text for a second image](research-2.jpg)

> A pulled quote goes in a blockquote.
> — optional attribution on its own line

- A bullet
- Another bullet
- Becomes a checkmark list on the page
```

## How each line maps to the page

| Markdown | Becomes |
|---|---|
| `---` frontmatter block | Case study meta (role, timeline, team, tools) |
| `## Section Label` | A new tab in the sticky nav + a new section |
| `### Text` | A subheading within the current section |
| Plain text line | A paragraph |
| `**Stats**` + `- Label: Value` lines | A row of stat chips |
| `![alt](filename.jpg)` | An image. Two in a row (no blank line between) become a 2-up grid |
| `> text` (+ optional `> — attribution`) | A pulled quote |
| `- item` (not under `**Stats**`) | A checkmark list |

## Notes

- Section order in the file = tab order on the page. Not every project
  needs the same sections — skip whatever doesn't apply.
- Image filenames should match whatever you drop into `/public` (same
  convention as the existing project covers — no subfolders needed).
- Keep paragraphs focused — one idea each reads better in the layout's
  ~620px content column than one long block.
