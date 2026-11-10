// Liest ~/.claude/projects/*/*.jsonl und schreibt prototype/data.js (gitignored).
// Prototyp-Extractor: kein Index, keine DB, nur genug Daten fuer die Klick-Demo.
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { homedir } from "node:os";
import { pathToFileURL } from "node:url";

const ROOT = join(homedir(), ".claude", "projects");
const OUT = new URL("../prototype/data.js", import.meta.url);
const clip = (s, n = 280) => (s.length > n ? s.slice(0, n) + "..." : s);

function promptText(msg) {
  const c = msg?.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) {
    if (c.some((b) => b.type === "tool_result")) return null;
    return c.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  }
  return null;
}

function isRealPrompt(t) {
  if (!t) return false;
  const s = t.trim();
  return s && !s.startsWith("<") && !s.startsWith("[Request interrupted") && !s.startsWith("Caveat:");
}

// Tokens einer Antwort: neu gelesen + neu gecacht + geschrieben (Cache-Lesen zaehlt nicht, sonst explodiert die Zahl)
const tok = (u) => (u?.input_tokens || 0) + (u?.cache_creation_input_tokens || 0) + (u?.output_tokens || 0);
const addModel = (map, model, u) => {
  if (!model || model.startsWith("<")) return;
  const m = (map[model] ||= { replies: 0, tokens: 0 });
  m.replies++; m.tokens += tok(u);
};

// Subagents liegen neben der Session: <session>/subagents/agent-<id>.jsonl (+ .meta.json)
function readSubagents(sdir) {
  const dir = join(sdir, "subagents");
  if (!existsSync(dir)) return [];
  const out = [];
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".jsonl")) continue;
    const id = basename(f, ".jsonl").replace(/^agent-/, "");
    let meta = {};
    try { meta = JSON.parse(readFileSync(join(dir, `agent-${id}.meta.json`), "utf8")); } catch {}
    const a = { id, type: meta.agentType || "Agent", description: meta.description || null, toolUseId: meta.toolUseId || null,
      background: meta.requestShape === "background", finished: meta.finished !== false, depth: meta.spawnDepth || 1,
      models: {}, tools: {}, task: null, result: null, start: null, end: null, tokens: 0, steps: 0 };
    for (const line of readFileSync(join(dir, f), "utf8").split("\n")) {
      if (!line) continue;
      let d; try { d = JSON.parse(line); } catch { continue; }
      if (d.type !== "user" && d.type !== "assistant") continue;
      a.start ??= d.timestamp; a.end = d.timestamp;
      if (d.type === "user" && !a.task) { const t = promptText(d.message); if (t) a.task = clip(t.trim(), 500); }
      if (d.type === "assistant") {
        a.steps++;
        addModel(a.models, d.message?.model, d.message?.usage); a.tokens += tok(d.message?.usage);
        for (const b of d.message?.content || []) {
          if (b.type === "tool_use") a.tools[b.name] = (a.tools[b.name] || 0) + 1;
          if (b.type === "text" && b.text.trim()) a.result = clip(b.text.trim(), 900);
        }
      }
    }
    a.mtime = statSync(join(dir, f)).mtimeMs;
    if (a.start) out.push(a);
  }
  return out;
}

// Exported for the desktop app: returns the data instead of (or as well as) writing data.js
export function extract({ write = true } = {}) {
const sessions = [];
for (const dir of readdirSync(ROOT)) {
  const pdir = join(ROOT, dir);
  if (!statSync(pdir).isDirectory()) continue;
  for (const f of readdirSync(pdir)) {
    if (!f.endsWith(".jsonl")) continue;
    const id = basename(f, ".jsonl");
    const s = { id, dir, title: null, aiTitle: null, cwd: null, branch: null, start: null, end: null,
      files: new Set(), tools: new Set(), hashtags: new Set(), nodes: [], msgCount: 0,
      models: {}, cost: null, app: null, agentName: null, agents: [] };
    const spawnedBy = new Map(); // tool_use id des Agent-Aufrufs -> uuid der Nachricht
    const byUuid = new Map();
    for (const line of readFileSync(join(pdir, f), "utf8").split("\n")) {
      if (!line) continue;
      let d; try { d = JSON.parse(line); } catch { continue; }
      if (d.type === "custom-title") s.title = d.customTitle;
      if (d.type === "ai-title") s.aiTitle = d.aiTitle;
      if (d.type === "relocated") s.cwd = d.relocatedCwd;
      if (d.type === "agent-name") s.agentName = d.agentName;
      if (d.type === "cost-state") s.cost = { usd: d.totalCostUSD, ms: d.totalDuration, apiMs: d.totalAPIDuration,
        added: d.totalLinesAdded, removed: d.totalLinesRemoved,
        byModel: Object.fromEntries(Object.entries(d.modelUsage || {}).map(([m, u]) => [m, u.costUSD || 0])) };
      if (d.isSidechain) continue;
      if (d.uuid && d.type !== "user" && d.type !== "assistant") {
        byUuid.set(d.uuid, { parent: d.parentUuid ?? d.logicalParentUuid ?? null, prompt: null, ts: d.timestamp });
        continue;
      }
      if (d.type !== "user" && d.type !== "assistant") continue;
      s.msgCount++;
      s.cwd ??= d.cwd;
      if (d.entrypoint) s.app = d.entrypoint;
      if (d.gitBranch && d.gitBranch !== "HEAD") s.branch = d.gitBranch;
      s.start ??= d.timestamp;
      s.end = d.timestamp;
      let text = null;
      if (d.type === "user" && !d.isMeta) text = promptText(d.message);
      const real = isRealPrompt(text);
      const entry = { parent: d.parentUuid, prompt: real ? clip(text.trim(), 600) : null, ts: d.timestamp, edits: [], reply: null, model: null, spawns: [] };
      if (d.type === "assistant") { entry.model = d.message?.model?.startsWith("<") ? null : d.message?.model; addModel(s.models, entry.model, d.message?.usage); }
      byUuid.set(d.uuid, entry);
      if (real) for (const m of text.matchAll(/(?:^|\s)#(\p{L}[\p{L}\p{N}_-]{1,30})/gu)) s.hashtags.add(m[1].toLowerCase());
      if (d.type === "assistant" && Array.isArray(d.message?.content)) {
        for (const b of d.message.content) {
          if (b.type !== "tool_use") continue;
          s.tools.add(b.name);
          if (b.name === "Agent" || b.name === "Task") { spawnedBy.set(b.id, d.uuid); entry.spawns.push({ toolUseId: b.id, type: b.input?.subagent_type || "general-purpose", description: b.input?.description || null, model: b.input?.model || null }); }
          const fp = b.input?.file_path;
          if (fp && ["Edit", "Write", "NotebookEdit"].includes(b.name)) { s.files.add(fp); entry.edits.push(fp); }
        }
        const txt = d.message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
        if (txt) entry.reply = txt;
      }
    }
    // Baum auf Prompt-Knoten verdichten: Eltern = naechster Vorfahre mit Prompt
    const promptParent = (uuid) => {
      let p = byUuid.get(uuid)?.parent, guard = 0;
      while (p && guard++ < 100000) {
        const n = byUuid.get(p);
        if (!n) return null;
        if (n.prompt) return p;
        p = n.parent;
      }
      return null;
    };
    const nodeById = new Map();
    for (const [uuid, n] of byUuid) {
      if (n.prompt && n.ts) {
        const node = { id: uuid, parent: promptParent(uuid), text: n.prompt, ts: n.ts, edits: [], reply: null, replyTs: null, models: [], agents: [] };
        nodeById.set(uuid, node); s.nodes.push(node);
      }
    }
    // Antworten und Datei-Aenderungen dem zugehoerigen Prompt-Knoten zuordnen
    for (const [uuid, n] of byUuid) {
      if (n.prompt || (!n.edits?.length && !n.reply && !n.model)) continue;
      const owner = nodeById.get(promptParent(uuid));
      if (!owner) continue;
      if (n.model && !owner.models.includes(n.model)) owner.models.push(n.model);
      for (const e of n.edits) if (!owner.edits.includes(e)) owner.edits.push(e);
      if (n.reply && (!owner.replyTs || n.ts > owner.replyTs)) { owner.reply = clip(n.reply, 1600); owner.replyTs = n.ts; }
    }
    if (!s.nodes.length) continue;
    // Subagents einlesen und dem Prompt zuordnen, der sie gestartet hat
    const spawnInfo = new Map();
    for (const n of byUuid.values()) for (const sp of n.spawns || []) spawnInfo.set(sp.toolUseId, sp);
    for (const a of readSubagents(join(pdir, id))) {
      const msg = a.toolUseId && spawnedBy.get(a.toolUseId);
      const owner = msg && (byUuid.get(msg)?.prompt ? nodeById.get(msg) : nodeById.get(promptParent(msg)));
      a.node = owner?.id || null;
      a.requestedModel = spawnInfo.get(a.toolUseId)?.model || null;
      if (!a.description) a.description = spawnInfo.get(a.toolUseId)?.description || null;
      if (owner) owner.agents.push(a.id);
      s.agents.push(a);
    }
    s.agents.sort((a, b) => a.start.localeCompare(b.start));
    s.fileMtime = statSync(join(pdir, f)).mtimeMs;
    s.nodes.sort((a, b) => a.ts.localeCompare(b.ts));
    sessions.push({ ...s, files: [...s.files].slice(-12), tools: [...s.tools], hashtags: [...s.hashtags] });
  }
}

sessions.sort((a, b) => b.end.localeCompare(a.end));
const data = { generatedAt: new Date().toISOString(), home: homedir(), sessions };
if (write) writeFileSync(OUT, "window.SESSION_DATA = " + JSON.stringify(data) + ";\n");
return data;
}

// --watch: alle paar Sekunden neu schreiben, die Agents-Ansicht laedt die Daten dann selbst nach
const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
const watch = isCli && process.argv.includes("--watch");
const report = (ss) => `${ss.length} Sessions, ${ss.reduce((n, s) => n + s.nodes.length, 0)} Prompt-Knoten, ${ss.reduce((n, s) => n + s.agents.length, 0)} Subagents -> prototype/data.js`;
if (isCli) console.log(report(extract().sessions));
if (watch) {
  console.log("Live-Modus: aktualisiert alle 4 Sekunden (Strg+C beendet)");
  setInterval(() => { try { extract(); } catch (e) { console.error(e.message); } }, 4000);
}
