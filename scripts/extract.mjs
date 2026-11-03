// Liest ~/.claude/projects/*/*.jsonl und schreibt prototype/data.js (gitignored).
// Prototyp-Extractor: kein Index, keine DB, nur genug Daten fuer die Klick-Demo.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import { homedir } from "node:os";

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

const sessions = [];
for (const dir of readdirSync(ROOT)) {
  const pdir = join(ROOT, dir);
  if (!statSync(pdir).isDirectory()) continue;
  for (const f of readdirSync(pdir)) {
    if (!f.endsWith(".jsonl")) continue;
    const id = basename(f, ".jsonl");
    const s = { id, dir, title: null, aiTitle: null, cwd: null, branch: null, start: null, end: null,
      files: new Set(), tools: new Set(), hashtags: new Set(), nodes: [], msgCount: 0 };
    const byUuid = new Map();
    for (const line of readFileSync(join(pdir, f), "utf8").split("\n")) {
      if (!line) continue;
      let d; try { d = JSON.parse(line); } catch { continue; }
      if (d.type === "custom-title") s.title = d.customTitle;
      if (d.type === "ai-title") s.aiTitle = d.aiTitle;
      if (d.type === "relocated") s.cwd = d.relocatedCwd;
      if (d.isSidechain) continue;
      if (d.uuid && d.type !== "user" && d.type !== "assistant") {
        byUuid.set(d.uuid, { parent: d.parentUuid ?? d.logicalParentUuid ?? null, prompt: null, ts: d.timestamp });
        continue;
      }
      if (d.type !== "user" && d.type !== "assistant") continue;
      s.msgCount++;
      s.cwd ??= d.cwd;
      if (d.gitBranch && d.gitBranch !== "HEAD") s.branch = d.gitBranch;
      s.start ??= d.timestamp;
      s.end = d.timestamp;
      let text = null;
      if (d.type === "user" && !d.isMeta) text = promptText(d.message);
      const real = isRealPrompt(text);
      const entry = { parent: d.parentUuid, prompt: real ? clip(text.trim(), 600) : null, ts: d.timestamp, edits: [], reply: null };
      byUuid.set(d.uuid, entry);
      if (real) for (const m of text.matchAll(/(?:^|\s)#(\p{L}[\p{L}\p{N}_-]{1,30})/gu)) s.hashtags.add(m[1].toLowerCase());
      if (d.type === "assistant" && Array.isArray(d.message?.content)) {
        for (const b of d.message.content) {
          if (b.type !== "tool_use") continue;
          s.tools.add(b.name);
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
        const node = { id: uuid, parent: promptParent(uuid), text: n.prompt, ts: n.ts, edits: [], reply: null, replyTs: null };
        nodeById.set(uuid, node); s.nodes.push(node);
      }
    }
    // Antworten und Datei-Aenderungen dem zugehoerigen Prompt-Knoten zuordnen
    for (const [uuid, n] of byUuid) {
      if (n.prompt || (!n.edits?.length && !n.reply)) continue;
      const owner = nodeById.get(promptParent(uuid));
      if (!owner) continue;
      for (const e of n.edits) if (!owner.edits.includes(e)) owner.edits.push(e);
      if (n.reply && (!owner.replyTs || n.ts > owner.replyTs)) { owner.reply = clip(n.reply, 1600); owner.replyTs = n.ts; }
    }
    if (!s.nodes.length) continue;
    s.nodes.sort((a, b) => a.ts.localeCompare(b.ts));
    sessions.push({ ...s, files: [...s.files].slice(-12), tools: [...s.tools], hashtags: [...s.hashtags] });
  }
}

sessions.sort((a, b) => b.end.localeCompare(a.end));
writeFileSync(OUT, "window.SESSION_DATA = " + JSON.stringify({ generatedAt: new Date().toISOString(), home: homedir(), sessions }) + ";\n");
console.log(`${sessions.length} Sessions, ${sessions.reduce((n, s) => n + s.nodes.length, 0)} Prompt-Knoten -> prototype/data.js`);
