// Session Atlas desktop app (prototype stage).
// Main process: reads ~/.claude live, serves the session data to the UI, runs real terminals (node-pty)
// so "Weitermachen" resumes Claude Code inside the app, stores notes and lists MCP servers.
// ATLAS_DEMO=1 swaps all personal data for fictional demo data (for screenshots).
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { join, dirname, resolve, basename, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { watch, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, lstatSync, statSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { execFile } from "node:child_process";
import pty from "node-pty";
import { extract } from "../scripts/extract.mjs";
import { demoData, demoMcp } from "../scripts/demo-data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const HOME = homedir();
const PROJECTS = join(HOME, ".claude", "projects");
const DEMO = process.env.ATLAS_DEMO === "1";
const NOTES_DIR = DEMO ? join(HERE, "demo", "notes") : join(HOME, ".session-atlas", "notes");
try { mkdirSync(NOTES_DIR, { recursive: true }); } catch (e) { console.error("notes dir:", e.message); }

app.setName("Session Atlas");

let win = null;
let data = DEMO ? demoData() : extract({ write: false });

// ---------- Live data: re-read when Claude Code appends to a transcript ----------
let timer = null;
function scheduleRefresh() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      data = extract({ write: false });
      win?.webContents.send("atlas:data-updated", data);
    } catch (e) { console.error("extract failed:", e.message); }
  }, 1200);
}
if (!DEMO) {
  try { watch(PROJECTS, { recursive: true }, (_ev, file) => { if (file && file.endsWith(".jsonl")) scheduleRefresh(); }); }
  catch (e) { console.error("watch failed:", e.message); }
}

ipcMain.on("atlas:data-sync", (e) => { e.returnValue = data; });
ipcMain.on("atlas:info-sync", (e) => { e.returnValue = { demo: DEMO, notesDir: NOTES_DIR, home: DEMO ? data.home : HOME }; });

// Child processes must not inherit the markers of a Claude Code session the app may have been started from,
// otherwise a resumed session would run without saving its transcript.
const baseEnv = () => Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("CLAUDE_CODE_") && k !== "CLAUDECODE"));
const projectDirs = () => [...new Set(data.sessions.map((s) => s.cwd).filter(Boolean))];

// ---------- Terminals ----------
const terms = new Map();
let nextId = 1;
const SID = /^[0-9a-f-]{36}$/i;

// ---------- New project: folder (+ git init + README) under ~/gitroot, then Claude starts there ----------
ipcMain.handle("project:create", async (_e, { name, parent } = {}) => {
  const slug = String(name || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
  if (!slug || slug.startsWith(".") || slug.length > 60) throw new Error("Ungültiger Projektname");
  // Parent must be an existing folder inside the home directory (default: ~/projects for own projects)
  const base = resolve(typeof parent === "string" && parent ? parent : join(homedir(), "projects"));
  if (!(base + "/").startsWith(homedir() + "/")) throw new Error("Ordner muss in deinem Benutzerordner liegen");
  mkdirSync(base, { recursive: true });
  const dir = join(base, slug);
  const existed = existsSync(dir);
  mkdirSync(dir, { recursive: true });
  if (!existsSync(join(dir, ".git"))) await new Promise((ok) => execFile("git", ["init", "-q", "-b", "main"], { cwd: dir }, () => ok()));
  if (!existsSync(join(dir, "README.md"))) writeFileSync(join(dir, "README.md"), `# ${String(name).trim()}\n`);
  return { path: dir, existed };
});
// Native folder picker for "Anderer Ordner..."
ipcMain.handle("project:pick-parent", async () => {
  const r = await dialog.showOpenDialog(win, { title: "Wo soll das Projekt liegen?", defaultPath: homedir(), properties: ["openDirectory", "createDirectory"] });
  return r.canceled ? null : r.filePaths[0];
});

ipcMain.handle("pty:spawn", (_e, { sessionId, cwd, fork, prompt, cols = 100, rows = 30 } = {}) => {
  if (sessionId && !SID.test(sessionId)) throw new Error("invalid session id");
  if (prompt != null && (typeof prompt !== "string" || prompt.length > 8000)) throw new Error("invalid prompt");
  const shell = process.env.SHELL || "/bin/zsh";
  const dir = !DEMO && typeof cwd === "string" && existsSync(cwd) ? cwd : HOME;
  // The prompt travels as an env var and is only referenced as "$ATLAS_PROMPT", never pasted into the shell string.
  const claude = sessionId ? `claude --resume ${sessionId}${fork ? " --fork-session" : ""}` : prompt ? `claude "$ATLAS_PROMPT"; unset ATLAS_PROMPT` : "claude";
  const env = { ...baseEnv(), TERM: "xterm-256color", COLORTERM: "truecolor" };
  if (prompt) env.ATLAS_PROMPT = prompt;
  // Login shell so PATH (nvm, homebrew) matches the user's terminal; stay in a shell after claude exits.
  const p = pty.spawn(shell, ["-l", "-i", "-c", `${claude}; exec ${shell} -l -i`], { name: "xterm-256color", cols, rows, cwd: dir, env });
  const id = nextId++;
  terms.set(id, p);
  p.onData((d) => win?.webContents.send("pty:data", id, d));
  p.onExit(({ exitCode }) => { terms.delete(id); win?.webContents.send("pty:exit", id, exitCode); });
  return { id, cwd: dir };
});
ipcMain.on("pty:write", (_e, id, d) => terms.get(id)?.write(d));
ipcMain.on("pty:resize", (_e, id, cols, rows) => { try { terms.get(id)?.resize(cols, rows); } catch {} });
ipcMain.on("pty:kill", (_e, id) => { terms.get(id)?.kill(); terms.delete(id); });

// ---------- Notes ----------
// Allowed: *.md directly inside the notes folder, or directly inside a known session project folder.
// Real paths are compared, so ".." and symlinked folders or files cannot escape.
const realOr = (p) => { try { return realpathSync(p); } catch { return null; } };
function notePath(p, { mustExist = true } = {}) {
  if (typeof p !== "string" || p.includes("\0") || !isAbsolute(p) || !/\.md$/i.test(p) || resolve(p) !== p) throw new Error("Pfad nicht erlaubt");
  const dir = realOr(dirname(p));
  const allowed = [realOr(NOTES_DIR), ...(DEMO ? [] : projectDirs().map(realOr))].filter(Boolean);
  if (!dir || !allowed.includes(dir)) throw new Error("Pfad nicht erlaubt");
  const target = join(dir, basename(p));
  if (existsSync(target)) { const st = lstatSync(target); if (st.isSymbolicLink() || !st.isFile()) throw new Error("Pfad nicht erlaubt"); }
  else if (mustExist) throw new Error("Datei nicht gefunden");
  return target;
}
const frontProject = (text) => { const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/); const p = m?.[1].match(/^project:\s*(.+?)\s*$/m)?.[1]; return p && isAbsolute(p) ? p : null; };
function mdFiles(dir, withProject) {
  let names = [];
  try { names = readdirSync(dir).filter((n) => /\.md$/i.test(n) && !n.startsWith(".")); } catch { return []; }
  const out = [];
  for (const n of names.slice(0, 60)) {
    const p = join(dir, n);
    try {
      const st = lstatSync(p); if (!st.isFile() || st.size > 2e6) continue;
      const f = { path: p, name: n, mtime: st.mtimeMs, size: st.size };
      if (withProject) f.project = frontProject(readFileSync(p, "utf8").slice(0, 4000));
      out.push(f);
    } catch {}
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
ipcMain.handle("notes:list", () => ({
  dir: NOTES_DIR, dirLabel: DEMO ? "~/.session-atlas/notes" : NOTES_DIR.replace(HOME, "~"),
  notes: mdFiles(NOTES_DIR, true),
  projects: DEMO ? [] : projectDirs().filter((d) => d !== HOME && existsSync(d)).map((project) => ({ project, files: mdFiles(project, false) })).filter((x) => x.files.length),
}));
ipcMain.handle("notes:read", (_e, p) => { const t = notePath(p); if (statSync(t).size > 2e6) throw new Error("Datei zu gross"); return { path: t, text: readFileSync(t, "utf8") }; });
ipcMain.handle("notes:write", (_e, { path, text } = {}) => {
  if (typeof text !== "string" || text.length > 5e6) throw new Error("Inhalt ungültig");
  const t = notePath(path, { mustExist: false });
  writeFileSync(t, text, "utf8");
  return { path: t, bytes: Buffer.byteLength(text), lines: text.split("\n").length };
});
const TEMPLATE = (name) => `# Anforderungen: ${name}\n\n## Ziel\n\n\n## Muss\n- \n\n## Kann\n- \n\n## Nicht\n- \n\n## Offene Fragen\n- \n`;
ipcMain.handle("notes:create", (_e, { name, template, project } = {}) => {
  const clean = String(name || "").replace(/\.md$/i, "").replace(/[^\p{L}\p{N} _.-]/gu, "").replace(/^[.\s]+/, "").trim().slice(0, 80);
  if (!clean) throw new Error("Name fehlt");
  const p = join(NOTES_DIR, clean + ".md");
  if (existsSync(p)) return { path: notePath(p), existed: true };
  const proj = typeof project === "string" && projectDirs().includes(project) ? project : null;
  const head = proj ? `---\nproject: ${proj}\n---\n` : "";
  writeFileSync(p, head + (template === "anforderungen" ? TEMPLATE(clean) : `# ${clean}\n\n`), { encoding: "utf8", flag: "wx" });
  return { path: p, existed: false };
});

// ---------- MCP servers (read-only listing; changes go through the claude CLI) ----------
const MASK = "••••";
function maskUrl(u) {
  try {
    const x = new URL(u);
    const auth = x.username || x.password ? `${MASK}@` : "";
    const q = [...x.searchParams.keys()].map((k) => `${k}=${MASK}`).join("&");
    return `${x.protocol}//${auth}${x.host}${x.pathname}${q ? "?" + q : ""}`;
  } catch { return String(u).replace(/\?.*$/, "?" + MASK); }
}
const SECRETY = /(key|token|secret|passw|auth|bearer|credential|cookie)/i;
function maskArgs(args) {
  if (!Array.isArray(args)) return [];
  return args.map((raw, i) => {
    const a = String(raw), prev = i ? String(args[i - 1]) : "";
    if (/^-{1,2}[\w.-]+$/.test(prev) && SECRETY.test(prev)) return MASK;
    if (/^bearer$/i.test(prev)) return MASK;
    const kv = a.match(/^([^=\s]*=)(.+)$/); if (kv && SECRETY.test(kv[1])) return kv[1] + MASK;
    const hd = a.match(/^([\w-]+:\s*)(.+)$/); if (hd && SECRETY.test(hd[1])) return hd[1] + MASK;
    if (/^(sk-|ghp_|gho_|ghs_|github_pat_|xox[abpr]-|eyJ|AKIA|glpat-)/.test(a) || /^[A-Za-z0-9_+/=-]{32,}$/.test(a)) return MASK;
    if (/^https?:\/\//i.test(a)) return maskUrl(a);
    return a;
  });
}
const server = (name, s = {}) => ({
  name, type: s.type || (s.url ? "http" : "stdio"), command: s.command ? String(s.command) : null, args: maskArgs(s.args),
  url: s.url ? maskUrl(s.url) : null, envKeys: Object.keys(s.env || {}), headerKeys: Object.keys(s.headers || {}),
});
const group = (scope, project, source, obj) => ({ scope, project, source, servers: Object.entries(obj || {}).map(([n, s]) => server(n, s)) });
ipcMain.handle("mcp:list", () => {
  const groups = [];
  if (DEMO) {
    groups.push(group("user", null, "~/.claude.json", demoMcp.user));
    for (const [p, o] of Object.entries(demoMcp.project)) groups.push(group("project", p, ".mcp.json", o));
    for (const [p, o] of Object.entries(demoMcp.local)) groups.push(group("local", p, "~/.claude.json", o));
    return { demo: true, groups };
  }
  let cfg = {};
  try { cfg = JSON.parse(readFileSync(join(HOME, ".claude.json"), "utf8")); } catch {}
  groups.push(group("user", null, "~/.claude.json", cfg.mcpServers));
  for (const p of projectDirs()) {
    try { const j = JSON.parse(readFileSync(join(p, ".mcp.json"), "utf8")); if (Object.keys(j.mcpServers || {}).length) groups.push(group("project", p, ".mcp.json", j.mcpServers)); } catch {}
  }
  for (const [p, v] of Object.entries(cfg.projects || {})) if (Object.keys(v?.mcpServers || {}).length) groups.push(group("local", p, "~/.claude.json", v.mcpServers));
  return { demo: false, groups };
});

// Resolve the claude binary and PATH once from a login shell (apps started from the Dock get a minimal PATH)
let cliP = null;
function cli() {
  if (cliP) return cliP;
  cliP = new Promise((ok) => {
    const shell = process.env.SHELL || "/bin/zsh";
    execFile(shell, ["-l", "-i", "-c", 'printf "__A__%s__A__%s__A__" "$PATH" "$(command -v claude)"'], { timeout: 15000, env: baseEnv() }, (_err, stdout = "") => {
      const m = String(stdout).match(/__A__([\s\S]*?)__A__([\s\S]*?)__A__/);
      ok({ bin: m && m[2].startsWith("/") ? m[2].trim() : "claude", env: { ...baseEnv(), PATH: m?.[1] || process.env.PATH } });
    });
  });
  return cliP;
}
async function runClaude(args, cwd) {
  const { bin, env } = await cli();
  return new Promise((ok) => execFile(bin, args, { cwd, env, timeout: 60000, maxBuffer: 4e6 }, (err, stdout = "", stderr = "") =>
    ok({ code: err ? (err.code ?? 1) : 0, timedOut: !!err?.killed, stdout: String(stdout), stderr: String(stderr) })));
}
const projectCwd = (p) => (typeof p === "string" && projectDirs().includes(p) && existsSync(p) ? p : null);
const demoOff = { ok: false, demo: true, out: "Im Demo-Modus deaktiviert" };

ipcMain.handle("mcp:check", async (_e, { project } = {}) => {
  if (DEMO) return demoOff;
  const r = await runClaude(["mcp", "list"], projectCwd(project) || HOME);
  // Only names and status go to the UI; the raw lines may contain URLs with tokens
  const status = [];
  for (const line of r.stdout.split("\n")) {
    const m = line.match(/^(.+?): .* - (\S+)\s+(.*)$/u);
    if (m) status.push({ name: m[1].trim(), ok: /[✓✔]/.test(m[2]), failed: /[✗✘×]/.test(m[2]), text: m[3].replace(/https?:\/\/\S+/g, "").replace(/`/g, "").slice(0, 80) });
  }
  return { ok: r.code === 0, timedOut: r.timedOut, status, out: r.code === 0 ? "" : (r.stderr || r.stdout).replace(/https?:\/\/\S+/g, "").slice(0, 300) };
});

const NAME = /^[A-Za-z0-9_.-]{1,64}$/;
const SCOPES = ["user", "project", "local"], TRANSPORTS = ["stdio", "http", "sse"];
function scrub(text, secrets) { let t = text; for (const s of secrets) if (s && s.length > 2) t = t.split(s).join(MASK); return t.replace(/https?:\/\/\S+/g, (u) => maskUrl(u)).slice(0, 600); }

ipcMain.handle("mcp:add", async (_e, o = {}) => {
  if (DEMO) return demoOff;
  const { name, scope, transport, target } = o;
  const args = Array.isArray(o.args) ? o.args.map(String).filter(Boolean) : [];
  const env = Array.isArray(o.env) ? o.env.map((x) => String(x).trim()).filter(Boolean) : [];
  if (!NAME.test(name || "")) return { ok: false, out: "Name: nur Buchstaben, Ziffern, - _ ." };
  if (!SCOPES.includes(scope) || !TRANSPORTS.includes(transport)) return { ok: false, out: "Scope oder Transport ungültig" };
  if (typeof target !== "string" || !target.trim() || target.length > 2000) return { ok: false, out: transport === "stdio" ? "Befehl fehlt" : "URL fehlt" };
  if (transport !== "stdio" && !/^https?:\/\//i.test(target.trim())) return { ok: false, out: "URL muss mit http:// oder https:// beginnen" };
  const cwd = scope === "user" ? HOME : projectCwd(o.project);
  if (!cwd) return { ok: false, out: "Projekt fehlt oder existiert nicht" };
  const flags = [], secrets = [];
  for (const line of env) {
    if (transport === "stdio") { if (!/^[A-Za-z_][A-Za-z0-9_]*=/.test(line)) return { ok: false, out: `Env-Zeile ungültig (KEY=VALUE): ${line.split("=")[0]}` }; flags.push("-e", line); secrets.push(line.slice(line.indexOf("=") + 1)); }
    else { if (!/^[A-Za-z0-9-]+:\s*\S/.test(line)) return { ok: false, out: `Header ungültig (Name: Wert): ${line.split(":")[0]}` }; flags.push("-H", line); secrets.push(line.slice(line.indexOf(":") + 1).trim()); }
  }
  // Options first, then "--" so neither the name nor command args can be read as flags
  const r = await runClaude(["mcp", "add", "-s", scope, "-t", transport, ...flags, "--", name, target.trim(), ...(transport === "stdio" ? args : [])], cwd);
  return { ok: r.code === 0, out: scrub((r.stdout + "\n" + r.stderr).trim(), secrets) };
});

ipcMain.handle("mcp:remove", async (_e, { name, scope, project } = {}) => {
  if (DEMO) return demoOff;
  if (!NAME.test(name || "") || !SCOPES.includes(scope)) return { ok: false, out: "Ungültiger Server" };
  const cwd = scope === "user" ? HOME : projectCwd(project);
  if (!cwd) return { ok: false, out: "Projekt fehlt oder existiert nicht" };
  const r = await runClaude(["mcp", "remove", "-s", scope, "--", name], cwd);
  return { ok: r.code === 0, out: scrub((r.stdout + "\n" + r.stderr).trim(), []) };
});

// ---------- Window ----------
const ICON = join(HERE, "icon.png");
function createWindow() {
  win = new BrowserWindow({
    width: 1480, height: 940, minWidth: 980, minHeight: 640,
    title: "Session Atlas", icon: existsSync(ICON) ? ICON : undefined,
    titleBarStyle: "hiddenInset",
    vibrancy: "under-window", visualEffectState: "active",
    backgroundColor: "#0c0d0e",
    webPreferences: { preload: join(HERE, "preload.cjs"), contextIsolation: true, nodeIntegration: false },
  });
  win.loadFile(join(HERE, "renderer", "index.html"));
  win.on("closed", () => { win = null; for (const p of terms.values()) p.kill(); terms.clear(); });
}

app.whenReady().then(() => {
  if (process.platform === "darwin" && existsSync(ICON)) app.dock?.setIcon(ICON);
  createWindow();
});
app.on("window-all-closed", () => app.quit());
app.on("render-process-gone", (_e, _w, d) => console.error("renderer gone:", d.reason));

