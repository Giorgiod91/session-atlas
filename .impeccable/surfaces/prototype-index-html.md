---
version: 1
slug: "prototype-index-html"
primary_target: "prototype/index.html"
related_targets: []
---

# Session Atlas canvas prototype

Scope: prototype/index.html, the whole app surface. Mode: Operate.
Audience: Claude Code users of any technical level; window stays open all day next to the terminal.
Task: see where you left off, browse projects > sessions > prompt steps on a pan/zoom canvas, open a step, resume.
Constraints: single static HTML + data.js, no build; session content never leaves the machine.
Steer from the user: also offer a Neovim-flavoured look, delivered as a second theme of the same surface.

## Direction contract

THESIS: A friendly consumer-app world laid over an infinite canvas: soft cards on a warm tinted ground, plain-language labels, and one saturated action color that only ever marks something you can press. Refuses the dark-neon AI-tool default and the grey dev-tool list.
OWN-WORLD: Warm ground #FFF4E6 with a faint warm dot grid, white cards with large radii (20-28px) and soft offset shadows, warm surface tiles #F7EBDD for icons and badges, text #2B241F / #6F625A, action #FF6A3D reserved for resume buttons, the active tab and the latest step. Rounded humanist sans (Figtree), drawn stroke icons in one weight. Warm dark variant follows the OS setting (use scene: window open all day next to a dark terminal): ground #1f1a16, cards #2a2420, action #FF6A3D with dark text. Light action darkened to #cc4213 for 4.8:1 with white text. Vim theme: gruvbox-dark ground, mono type (it is a terminal world), square split-window cards with title rules, statusline instead of bottom bar, yellow as the action color.
STORY: The visitor sees "Hier hast du aufgehört" with the latest session and one big resume action, understands every project as a card of session rows, zooms into a session to read its steps as connected cards, and resumes from any step.
FIRST VIEWPORT: Top-left brand pill and breadcrumbs, top-right search. On the canvas, a large resume card for the latest session leads at top-left, its last steps listed and a full-width orange "Weitermachen" button; project cards (title, count, session rows with icon tile, title, time, step bar, chevron) flow to its right and below. Bottom center: floating tab bar with a raised round orange resume button in the middle.
FORM: Warm consumer app surface (dealt challenger, competitive, chosen by the user), position: challenger; seed key 3ced54a8.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
