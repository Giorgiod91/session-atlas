// Fictional demo data with the same shape as extract(). Used for screenshots and demos,
// so nothing from real (possibly confidential) sessions ever ends up in images or the repo.
const HOME = "/Users/demo";
const PROJECTS = [
  { dir: "rezept-app", branch: "feat/suche" },
  { dir: "wetterstation", branch: "main" },
  { dir: "portfolio-site", branch: "redesign" },
  { dir: "haushaltsbuch", branch: "main" },
  { dir: "game-jam-2026", branch: "level-2" },
  { dir: "dotfiles", branch: "main" },
  { dir: "ki-notizen", branch: "main" },
  { dir: "fahrrad-tracker", branch: "api" },
];
const TOPICS = {
  "rezept-app": ["Volltextsuche für Rezepte", "Zutatenliste als Einkaufszettel", "Bilder-Upload mit Vorschau", "Dark Mode für die App"],
  "wetterstation": ["Sensor-Daten per MQTT einlesen", "Diagramm für Temperaturverlauf", "Alarm bei Frost"],
  "portfolio-site": ["Startseite neu gestalten", "Projekt-Galerie mit Filter", "Kontaktformular absichern", "Lighthouse auf 100 bringen"],
  "haushaltsbuch": ["CSV-Import von Kontoauszügen", "Kategorien automatisch erkennen", "Monatsbericht als PDF"],
  "game-jam-2026": ["Spielfigur mit Sprung-Physik", "Level-Editor als JSON", "Soundeffekte einbauen"],
  "dotfiles": ["Neovim-Config aufräumen", "tmux Statusline", "Setup-Skript für neuen Mac"],
  "ki-notizen": ["Notizen mit Tags durchsuchen", "Zusammenfassung pro Woche"],
  "fahrrad-tracker": ["GPX-Dateien einlesen", "Höhenprofil anzeigen", "Strava-Export"],
};
const PROMPTS = [
  "Kannst du mir erklären, wie das aufgebaut ist?", "Bau das bitte ein und schreib Tests dazu", "Das sieht noch nicht gut aus, mach es übersichtlicher",
  "Warum schlägt der Test fehl?", "Refactor das in kleinere Funktionen", "Füg eine Fehlermeldung hinzu, wenn die Datei fehlt",
  "Zeig mir zwei Varianten für das Layout", "Mach die Animation weicher", "Kannst du die README aktualisieren?",
  "Prüf bitte, ob das auch auf dem Handy funktioniert", "Schreib einen Commit und erklär kurz die Änderung", "Was fehlt noch bis zur ersten Version?",
];
const REPLIES = [
  "Erledigt. Ich habe die Logik in ein eigenes Modul verschoben und drei Tests ergänzt, alle laufen grün.",
  "Der Fehler kam von einem fehlenden await beim Laden. Ist behoben, der Test läuft wieder.",
  "Ich habe zwei Varianten gebaut: eine kompakte Liste und eine Karten-Ansicht. Die Liste ist bei vielen Einträgen übersichtlicher.",
  "Die README beschreibt jetzt Installation, Start und die wichtigsten Befehle.",
];
const FILES = ["src/app.ts", "src/search.ts", "src/ui/List.tsx", "README.md", "tests/search.test.ts", "src/styles.css", "src/api/client.ts", "config.json"];
const AGENTS = [
  ["Explore", "Codebasis nach Suchlogik durchsuchen"], ["general-purpose", "Tests für den Import schreiben"],
  ["Plan", "Umsetzungsplan für die Galerie"], ["general-purpose", "Lighthouse-Probleme sammeln"], ["Explore", "Alle Stellen mit Datumsformat finden"],
];

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = Math.floor(rnd() * 16); return (c === "x" ? r : (r & 3) | 8).toString(16); });
const MODELS = ["claude-opus-5-5", "claude-opus-5-5", "claude-sonnet-5-5", "claude-haiku-5-5"];

export function demoData(now = Date.now()) {
  seed = 7;
  const sessions = [];
  let ago = 0.2; // hours
  for (let i = 0; i < 26; i++) {
    const p = PROJECTS[i % PROJECTS.length === 0 ? 0 : Math.floor(rnd() * PROJECTS.length)];
    const title = pick(TOPICS[p.dir]);
    const steps = 2 + Math.floor(rnd() * (i < 4 ? 14 : 9));
    const end = now - ago * 3600e3; const start = end - steps * (4 + rnd() * 10) * 60e3;
    const model = pick(MODELS);
    const nodes = []; let prev = null;
    for (let k = 0; k < steps; k++) {
      const id = uuid(), ts = new Date(start + (end - start) * (k / Math.max(1, steps - 1))).toISOString();
      const edits = rnd() < 0.55 ? [...new Set(Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => `${HOME}/code/${p.dir}/${pick(FILES)}`))] : [];
      nodes.push({ id, parent: prev, text: k === 0 ? `${title}: ${pick(PROMPTS)}` : pick(PROMPTS), ts, edits, reply: pick(REPLIES), replyTs: ts, models: [model], agents: [] });
      prev = id;
    }
    const agents = [];
    if (i % 5 === 1) {
      const n = 1 + Math.floor(rnd() * 3);
      for (let a = 0; a < n; a++) {
        const [type, description] = pick(AGENTS), node = nodes[Math.min(nodes.length - 1, 1 + a)];
        const aStart = Date.parse(node.ts) + 20e3, dur = (1 + rnd() * 5) * 60e3;
        const ag = { id: uuid().replace(/-/g, "").slice(0, 17), type, description, toolUseId: null, background: rnd() < 0.5, finished: true, depth: 1,
          models: { [pick(["claude-sonnet-5-5", "claude-haiku-5-5", model])]: { replies: 6, tokens: 40000 } }, tools: { Read: 6 + Math.floor(rnd() * 9), Grep: 3, Bash: 2 },
          task: `${description}. Berichte kurz, was du gefunden hast.`, result: "Gefunden: 4 relevante Stellen, Details in der Liste oben.", start: new Date(aStart).toISOString(),
          end: new Date(aStart + dur).toISOString(), tokens: 30000 + Math.floor(rnd() * 90000), steps: 5 + Math.floor(rnd() * 12), mtime: aStart + dur, node: node.id, requestedModel: null };
        node.agents.push(ag.id); agents.push(ag);
      }
    }
    const files = [...new Set(nodes.flatMap((n) => n.edits))];
    sessions.push({ id: uuid(), dir: `-Users-demo-code-${p.dir}`, title: null, aiTitle: title, cwd: `${HOME}/code/${p.dir}`, branch: p.branch,
      start: new Date(start).toISOString(), end: new Date(end).toISOString(), files, tools: ["Read", "Edit", "Bash"], hashtags: [], nodes, msgCount: steps * 6,
      models: { [model]: { replies: steps * 3, tokens: steps * 21000 } }, cost: { usd: +(steps * (model.includes("opus") ? 0.42 : 0.09)).toFixed(2), ms: end - start, apiMs: (end - start) / 4,
        added: Math.floor(rnd() * 400), removed: Math.floor(rnd() * 90), byModel: { [model]: steps * 0.4 } }, app: "cli", agentName: null, agents, fileMtime: i === 0 ? now - 30e3 : end });
    ago += i < 5 ? 1 + rnd() * 3 : 6 + rnd() * 30;
  }
  sessions.sort((a, b) => b.end.localeCompare(a.end));
  return { generatedAt: new Date(now).toISOString(), home: HOME, sessions };
}

export const demoMcp = {
  user: { github: { type: "stdio", command: "npx", args: ["-y", "@modelcontextprotocol/server-github"], env: { GITHUB_TOKEN: "x" } },
    filesystem: { type: "stdio", command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem", "/Users/demo/code"] } },
  project: { "/Users/demo/code/rezept-app": { postgres: { type: "stdio", command: "npx", args: ["-y", "@modelcontextprotocol/server-postgres"], env: { DATABASE_URL: "x" } } } },
  local: { "/Users/demo/code/portfolio-site": { browser: { type: "http", url: "http://localhost:3333/mcp" } } },
};
