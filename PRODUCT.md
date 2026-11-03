# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Prototype: a single self-contained static HTML file plus a Node extractor script (`scripts/extract.mjs`), no build step.
Real app (confirmed 2026-11-03 in the question round): React + Vite + Framer Motion front end, served by a local Bun server that reads `~/.claude` live. It is a local tool, not a hosted website: a hosted site cannot read a user's local session files. Distribution is still to be decided (e.g. `bunx`/npm package first, desktop app later).

## Users

Claude Code users of any technical level, including people without a developer background. The app will be released publicly as open source. Each person looks only at their own local sessions. Typical use: the window stays open all day and the user keeps jumping between sessions and projects.

## Product Purpose

Session Atlas shows your Claude Code sessions visually: projects, the sessions inside them, and every prompt as a step in a history. You can see at a glance where you left off, what Claude answered, and which files changed at each step, and you can pick up again at any point. Success means a user finds the session or the step they want within seconds and continues from there without reading IDs or file paths.

## Positioning

It reads the session transcripts Claude Code already writes locally (`~/.claude/projects/*/*.jsonl`), including the message tree (uuid/parentUuid) and the per-prompt file backups (`~/.claude/file-history`). That makes it a step-by-step history, like the history panel in an image editor, rather than a plain list of chats.

## Operating Context

- Runs locally next to the terminal where Claude Code runs; nothing leaves the machine.
- Resuming means running `claude --resume <id>` (optionally `--fork-session`) in the project folder. Jumping to an earlier step is currently done with `/rewind` inside Claude Code.
- Session titles come from Claude Code (`custom-title`, `ai-title`).

## Capabilities and Constraints

- Three levels: all projects, one project, one session as prompt cards on a pan/zoom canvas.
- Per step: prompt, Claude's last text answer, files edited.
- Search over titles, prompts and files; hashtags (auto-derived, taken from prompts, user-added).
- Session contents can contain customer data and must never be committed or sent anywhere.
- Wanted (question round, 2026-11-03): built-in terminal (resume runs inside the app), per-step diffs, restoring files to a step's state, AI summary per session, mascot, "today" recap, pins, command palette (Cmd+K), activity heatmap, live updates while sessions run.
- Wanted: user-defined organisation, i.e. own folders/collections plus hashtag filters, on top of the automatic project grouping.
- Undecided: resuming directly at a mid-session step by click; how the star map and the subway line split the session views.

## Evidence on Hand

The author's real local data: 32 sessions, 18 project folders, about 720 prompt steps. No users, testimonials or metrics exist yet; none may be invented.

## Brand Commitments

- Visual world: warm consumer-app surface (cream ground, soft white cards, one action color) chosen by the user; a Neovim/gruvbox theme as a second look.
- Motion is part of the brand: the user asked for the full show (camera flights, spring pop-in, drawing threads, card-to-detail morph, tilt, time-travel scrubber, a small celebration on resume).
- Quality bar: the author's own flea-market app (a separate, private project) for visual detail and personality.

## Product Principles

1. "Where was I?" must be answerable in one glance.
2. Plain language over technical detail; IDs and paths stay in the background.
3. Local and private by default.
4. Every step is a place you can return to.
