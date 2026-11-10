# Session Atlas

Visuelle Übersicht über die eigenen Claude-Code-Sessions: Projekte, Verlauf als Knoten, Suche, Hashtags und "hier weitermachen".

## Prototyp

```sh
node scripts/extract.mjs   # liest ~/.claude/projects, schreibt prototype/data.js (lokal, gitignored)
open prototype/index.html

# Live wie bei Orca: Daten alle 4 s neu, die Agents-Ansicht lädt sie selbst nach
node scripts/extract.mjs --watch
open "prototype/index.html#agents"
```

Die Ansicht **Agents** zeigt pro Session den Hauptagent und alle Subagents (Typ, Auftrag, Ergebnis, Werkzeuge, Dauer, Tokens), welches Modell geantwortet hat (Opus, Sonnet, Haiku …), Kosten und alle Anfragen als Zeitleiste.

Session-Inhalte werden nie committet, nur der Code.

## Desktop-App (Prototyp)

```sh
cd app
bun install        # einmalig, kompiliert node-pty für Electron
bun run start      # ATLAS_LOOK=bento bun run start öffnet einen anderen Look
```

Die App liest `~/.claude` selbst und live (kein `extract.mjs` nötig). „Weitermachen“ öffnet unten ein eingebautes Terminal im Projektordner und startet dort `claude --resume <id>`; mehrere Sessions laufen als Tabs. „Ab hier weitermachen“ startet einen neuen Zweig (`--fork-session`), zum genauen Schritt geht es dann mit `/rewind`. Terminal ein/aus: `Ctrl+\``.

Alle Looks zum Durchklicken: `prototype/prototype-looks.html` (← → oder Raster-Symbol unten).
