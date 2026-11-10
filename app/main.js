// Session Atlas desktop app (prototype stage).
// Main process: reads ~/.claude live, serves the session data to the UI and runs
// real terminals (node-pty) so "Weitermachen" resumes Claude Code inside the app.
import { app, BrowserWindow, ipcMain } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { watch, existsSync } from "node:fs";
import { homedir } from "node:os";
import pty from "node-pty";
import { extract } from "../scripts/extract.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PROJECTS = join(homedir(), ".claude", "projects");

let win = null;
let data = extract({ write: false });

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
try { watch(PROJECTS, { recursive: true }, (_ev, file) => { if (file && file.endsWith(".jsonl")) scheduleRefresh(); }); }
catch (e) { console.error("watch failed:", e.message); }

ipcMain.on("atlas:data-sync", (e) => { e.returnValue = data; });

// ---------- Terminals ----------
const terms = new Map();
let nextId = 1;
const SID = /^[0-9a-f-]{36}$/i;

ipcMain.handle("pty:spawn", (_e, { sessionId, cwd, fork, cols = 100, rows = 30 }) => {
  if (sessionId && !SID.test(sessionId)) throw new Error("invalid session id");
  const shell = process.env.SHELL || "/bin/zsh";
  const dir = cwd && existsSync(cwd) ? cwd : homedir();
  // Login shell so PATH (nvm, homebrew) matches the user's terminal; stay in a shell after claude exits.
  const claude = sessionId ? `claude --resume ${sessionId}${fork ? " --fork-session" : ""}` : "claude";
  // If the app itself was started from inside Claude Code, drop the inherited child-session markers,
  // otherwise the resumed session would run without saving its transcript.
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("CLAUDE_CODE_") && k !== "CLAUDECODE"));
  const p = pty.spawn(shell, ["-l", "-i", "-c", `${claude}; exec ${shell} -l -i`], {
    name: "xterm-256color", cols, rows, cwd: dir,
    env: { ...env, TERM: "xterm-256color", COLORTERM: "truecolor" },
  });
  const id = nextId++;
  terms.set(id, p);
  p.onData((d) => win?.webContents.send("pty:data", id, d));
  p.onExit(({ exitCode }) => { terms.delete(id); win?.webContents.send("pty:exit", id, exitCode); });
  return { id, cwd: dir };
});
ipcMain.on("pty:write", (_e, id, d) => terms.get(id)?.write(d));
ipcMain.on("pty:resize", (_e, id, cols, rows) => { try { terms.get(id)?.resize(cols, rows); } catch {} });
ipcMain.on("pty:kill", (_e, id) => { terms.get(id)?.kill(); terms.delete(id); });

// ---------- Window ----------
function createWindow() {
  win = new BrowserWindow({
    width: 1480, height: 940, minWidth: 980, minHeight: 640,
    title: "Session Atlas",
    titleBarStyle: "hiddenInset",
    vibrancy: "under-window", visualEffectState: "active",
    backgroundColor: "#0a0c11",
    webPreferences: { preload: join(HERE, "preload.cjs"), contextIsolation: true, nodeIntegration: false },
  });
  win.loadFile(join(ROOT, "prototype", "prototype-looks.html"), { query: { look: process.env.ATLAS_LOOK || "nvim" } });
  win.on("closed", () => { win = null; for (const p of terms.values()) p.kill(); terms.clear(); });
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
