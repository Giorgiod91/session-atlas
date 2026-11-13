// Loops and recipes: Claude works headless (claude -p) in a project folder, then the verify commands run.
// Red: the failing output goes back to the same session and Claude tries again, until green or a limit is hit.
// A recipe is a list of steps (prompt, loop, verify) that share one session.
// Also keeps the real plan limits (5 hour window, week) that every claude -p run reports.
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

export const DEFAULT_RECIPES = [
  { id: "loop", name: "Bis es grün ist", desc: "Ein Auftrag, danach prüfen, bei Rot zurück an Claude",
    steps: [{ type: "loop", model: null, prompt: "{auftrag}" }] },
  { id: "feature", name: "Feature", desc: "Planen, bauen bis grün, Review, nochmal prüfen",
    steps: [
      { type: "prompt", model: "opus", prompt: "Erstelle einen kurzen Umsetzungsplan für diesen Auftrag. Ändere noch keine Dateien.\n\nAuftrag: {auftrag}" },
      { type: "loop", model: "sonnet", prompt: "Setze den Plan jetzt um." },
      { type: "prompt", model: "opus", prompt: "Lies den gesamten Diff (git diff) kritisch wie ein Reviewer. Behebe echte Fehler direkt, keine reinen Stilfragen. Fasse am Ende in drei Sätzen zusammen, was du geändert hast." },
      { type: "verify", model: "sonnet", prompt: "" },
    ] },
  { id: "fix", name: "Fehler beheben", desc: "Erst prüfen, dann reparieren bis grün",
    steps: [{ type: "verify", model: null, prompt: "Hinweis vom Nutzer: {auftrag}" }] },
  { id: "aufraeumen", name: "Aufräumen", desc: "Refactor ohne Verhaltensänderung, Prüfungen bleiben grün",
    steps: [{ type: "loop", model: "sonnet", prompt: "Räume den Code auf, ohne das Verhalten zu ändern: {auftrag}" }] },
];

const TYPES = ["prompt", "loop", "verify"], MODELS = ["opus", "sonnet", "haiku"], PERMS = ["acceptEdits", "bypassPermissions"];
const ANSI = /\x1b\[[0-9;?]*[ -/]*[@-~]/g;
const clip = (s, n) => (String(s || "").length > n ? "…" + String(s).slice(-n) : String(s || ""));
const head = (s, n) => (String(s || "").length > n ? String(s).slice(0, n) + "…" : String(s || ""));
function target(i = {}) {
  const v = i.file_path || i.path || i.command || i.pattern || i.url || i.description || i.prompt || "";
  return head(String(v).replace(/\s+/g, " ").replace(/^\/Users\/[^/]+\//, "~/"), 90);
}

export function createLoops({ home, demo, send, cli, isProject }) {
  const DIR = join(home, ".session-atlas");
  const RECIPES = join(DIR, "recipes.json"), RUNS = join(DIR, "runs.json"), LIMITS = join(DIR, "limits.json");
  // Demo mode keeps its runs, recipes and limits in memory: it must never read or overwrite the real ones
  const mem = new Map(), own = (p) => demo && p.startsWith(DIR);
  if (!demo) try { mkdirSync(DIR, { recursive: true }); } catch {}
  const readJson = (p, d) => { if (own(p)) return mem.has(p) ? structuredClone(mem.get(p)) : d; try { return JSON.parse(readFileSync(p, "utf8")); } catch { return d; } };
  const writeJson = (p, v) => { if (own(p)) return void mem.set(p, structuredClone(v)); try { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, JSON.stringify(v, null, 2)); } catch (e) { console.error("write", p, e.message); } };

  // ---------- limits ----------
  let limits = demo ? { five: { pct: 62, resetsAt: Date.now() + 98 * 60e3 }, week: { pct: 41, resetsAt: Date.now() + 3 * 864e5 }, status: "allowed", at: Date.now() } : readJson(LIMITS, null);
  function onLimits(info) {
    const w = info?.unifiedWindows || {};
    const win = (x) => (x && typeof x.utilization === "number" ? { pct: Math.round(x.utilization * 100), resetsAt: (x.resetsAt || 0) * 1000, status: x.status } : null);
    const next = { five: win(w.five_hour), week: win(w.seven_day), opus: win(w.seven_day_opus), status: info?.status || null, at: Date.now() };
    if (!next.five && info?.rateLimitType === "five_hour" && typeof info.utilization === "number") next.five = { pct: Math.round(info.utilization * 100), resetsAt: (info.resetsAt || 0) * 1000 };
    if (!next.five && !next.week) return;
    limits = next; writeJson(LIMITS, limits); send("limits:update", limits);
  }
  let pinging = null;
  async function refreshLimits(force) {
    if (demo) return limits;
    if (!force && limits && Date.now() - limits.at < 10 * 60e3) return limits;
    if (pinging) return pinging;
    pinging = (async () => {
      const { bin, env } = await cli();
      await new Promise((ok) => {
        const p = spawn(bin, ["-p", "ok", "--model", "haiku", "--output-format", "stream-json", "--verbose", "--no-session-persistence", "--max-turns", "1"], { cwd: home, env, stdio: ["ignore", "pipe", "ignore"] });
        let buf = ""; const t = setTimeout(() => p.kill(), 60e3);
        p.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) { const l = buf.slice(0, i); buf = buf.slice(i + 1); try { const ev = JSON.parse(l); if (ev.type === "rate_limit_event") onLimits(ev.rate_limit_info); } catch {} } });
        p.on("close", () => { clearTimeout(t); ok(); }); p.on("error", () => { clearTimeout(t); ok(); });
      });
      pinging = null; return limits;
    })();
    return pinging;
  }

  // ---------- recipes ----------
  function cleanRecipe(r) {
    if (!r || typeof r !== "object") return null;
    const id = String(r.id || r.name || "").toLowerCase().replace(/[^a-z0-9äöüß_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
    const steps = (Array.isArray(r.steps) ? r.steps : []).slice(0, 12).map((s) => ({
      type: TYPES.includes(s?.type) ? s.type : "prompt", model: MODELS.includes(s?.model) ? s.model : null, prompt: String(s?.prompt || "").slice(0, 4000) }))
      .filter((s) => s.type === "verify" || s.prompt.trim());
    return id && steps.length ? { id, name: String(r.name || id).slice(0, 60), desc: String(r.desc || "").slice(0, 160), steps } : null;
  }
  const recipes = () => { const own = readJson(RECIPES, null); return Array.isArray(own) && own.length ? own.map(cleanRecipe).filter(Boolean) : DEFAULT_RECIPES; };
  function saveRecipes(list) {
    if (!Array.isArray(list)) throw new Error("Liste erwartet");
    const clean = list.slice(0, 40).map(cleanRecipe).filter(Boolean);
    if (!clean.length) throw new Error("Mindestens ein Rezept mit einem Schritt");
    writeJson(RECIPES, clean); return clean;
  }

  // ---------- verify suggestions per project ----------
  function detect(cwd) {
    if (!isProject(cwd)) return [];
    const out = [], has = (f) => existsSync(join(cwd, f));
    const pkg = readJson(join(cwd, "package.json"), null);
    if (pkg?.scripts) {
      const pm = has("bun.lock") || has("bun.lockb") ? "bun run" : has("pnpm-lock.yaml") ? "pnpm run" : has("yarn.lock") ? "yarn" : "npm run";
      for (const s of ["test", "typecheck", "check", "lint", "build"]) if (pkg.scripts[s] && !/no test specified/.test(pkg.scripts[s])) out.push(`${pm} ${s}`);
      if (!pkg.scripts.typecheck && has("tsconfig.json")) out.push("npx tsc --noEmit");
    }
    if (has("Cargo.toml")) out.push("cargo test");
    if (has("go.mod")) out.push("go test ./...");
    if (has("pyproject.toml") || has("pytest.ini")) out.push("pytest -q");
    if (!out.length && has("Makefile") && /^test:/m.test(readFileSync(join(cwd, "Makefile"), "utf8"))) out.push("make test");
    return out.slice(0, 6);
  }

  // ---------- runs ----------
  const runs = new Map();
  for (const r of readJson(RUNS, [])) if (r && r.id) { if (r.status === "läuft") r.status = "gestoppt"; runs.set(r.id, r); }
  let saveT = null;
  const snap = (r) => { const { child, stop, ...rest } = r; return rest; };
  function emit(r) {
    send("loop:update", snap(r));
    clearTimeout(saveT); saveT = setTimeout(() => writeJson(RUNS, [...runs.values()].slice(-40).map(snap)), 800);
  }
  const log = (r, kind, text) => { r.log.push({ ts: Date.now(), kind, text: head(text, 300) }); if (r.log.length > 120) r.log.splice(0, r.log.length - 120); emit(r); };

  function callClaude(r, prompt, model) {
    return new Promise(async (ok) => {
      if (demo) return demoCall(r, ok);
      const { bin, env } = await cli();
      const args = ["-p", prompt, "--output-format", "stream-json", "--verbose", "--permission-mode", r.perm];
      if (model) args.push("--model", model);
      if (r.sessionId) args.push("--resume", r.sessionId);
      const p = spawn(bin, args, { cwd: r.cwd, env, stdio: ["ignore", "pipe", "pipe"] });
      r.child = p;
      let buf = "", result = null, err = "", text = "";
      const t = setTimeout(() => { log(r, "err", "Claude-Lauf nach 30 min abgebrochen"); p.kill(); }, 30 * 60e3);
      p.stdout.on("data", (d) => {
        buf += d; let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i); buf = buf.slice(i + 1); let ev; try { ev = JSON.parse(line); } catch { continue; }
          if (ev.type === "system" && ev.subtype === "init" && ev.session_id && !r.sessionId) { r.sessionId = ev.session_id; emit(r); }
          else if (ev.type === "assistant") for (const b of ev.message?.content || []) { if (b.type === "tool_use") log(r, "tool", `${b.name} ${target(b.input)}`); else if (b.type === "text" && b.text?.trim()) text = b.text; }
          else if (ev.type === "rate_limit_event") onLimits(ev.rate_limit_info);
          else if (ev.type === "result") result = ev;
        }
      });
      p.stderr.on("data", (d) => { err = (err + d).slice(-2000); });
      p.on("error", (e) => { err = e.message; });
      p.on("close", (code) => { clearTimeout(t); r.child = null; if (result?.session_id) r.sessionId = result.session_id; ok({ code, result, err: err.replace(ANSI, ""), text: result?.result || text }); });
    });
  }

  function runCheck(r, cmd) {
    return new Promise(async (ok) => {
      if (demo) return demoCheck(r, cmd, ok);
      const { env } = await cli();
      const t0 = Date.now(), shell = process.env.SHELL || "/bin/zsh";
      const p = spawn(shell, ["-l", "-c", cmd], { cwd: r.cwd, env: { ...env, CI: "1", FORCE_COLOR: "0" }, stdio: ["ignore", "pipe", "pipe"], detached: true });
      r.child = p;
      let out = "";
      const add = (d) => { out = (out + d).slice(-8000); };
      p.stdout.on("data", add); p.stderr.on("data", add);
      const t = setTimeout(() => { add("\n[nach 15 min abgebrochen]"); try { process.kill(-p.pid); } catch {} }, 15 * 60e3);
      p.on("error", (e) => add(e.message));
      p.on("close", (code) => { clearTimeout(t); r.child = null; ok({ cmd, ok: code === 0, code, ms: Date.now() - t0, tail: clip(out.replace(ANSI, "").trim(), 2500) }); });
    });
  }

  const fill = (r, s) => String(s || "").replace(/\{auftrag\}/g, r.task).replace(/\{vorher\}/g, head(r.lastText || "", 3000));
  function failPrompt(r, checks, hint) {
    const bad = checks.filter((c) => !c.ok);
    return `Die Prüfung ist fehlgeschlagen. Behebe die Ursache im Code.\nÄndere oder lösche keine Tests, nur damit sie grün werden, und schalte keine Prüfungen ab.\n${hint ? `\n${hint}\n` : ""}\n` +
      bad.map((c) => `Befehl: ${c.cmd} (Exit ${c.code})\nAusgabe, gekürzt:\n\`\`\`\n${clip(c.tail, 3500)}\n\`\`\``).join("\n\n");
  }
  const sig = (checks) => checks.filter((c) => !c.ok).map((c) => c.cmd + ":" + c.tail.replace(/\d+(\.\d+)?\s*(ms|s)\b/g, "").replace(/\s+/g, " ").slice(-800)).join("|");

  async function checksOf(r, it) {
    it.checks = [];
    for (const cmd of r.verify) {
      if (r.stopped) return null;
      log(r, "check", `prüft: ${cmd}`);
      const c = await runCheck(r, cmd); it.checks.push(c);
      log(r, c.ok ? "ok" : "bad", `${c.ok ? "grün" : "rot"}: ${cmd}${c.ok ? "" : ` (Exit ${c.code})`}`);
    }
    return it.checks;
  }
  const overBudget = (r) => r.cost >= r.maxUsd;

  async function claudeTurn(r, step, prompt) {
    if (overBudget(r)) { r.status = "budget"; log(r, "err", `Budget von $${r.maxUsd} erreicht`); return null; }
    const res = await callClaude(r, prompt, step.model);
    if (r.stopped) return null;
    const cost = res.result?.total_cost_usd || 0; r.cost = +(r.cost + cost).toFixed(4);
    if (res.result?.is_error || (!res.result && res.code !== 0)) { r.status = "fehler"; log(r, "err", `Claude: ${head(res.result?.result || res.err || `Exit ${res.code}`, 240)}`); return null; }
    r.lastText = res.text; log(r, "say", head(res.text.replace(/\s+/g, " "), 240));
    return res;
  }

  async function runStep(r, step) {
    step.status = "läuft"; emit(r);
    if (step.type === "prompt") {
      const it = { n: 1, started: Date.now() }; step.iters.push(it);
      const res = await claudeTurn(r, step, fill(r, step.prompt)); if (!res) return false;
      it.ended = Date.now(); step.status = "fertig"; emit(r); return true;
    }
    if (!r.verify.length) { r.status = "fehler"; log(r, "err", "Keine Prüf-Befehle angegeben"); return false; }
    let last = "", same = 0;
    for (let n = 1; n <= r.maxIter; n++) {
      const it = { n, started: Date.now() }; step.iters.push(it); step.iter = n; emit(r);
      if (step.type === "loop" && n === 1) { if (!(await claudeTurn(r, step, fill(r, step.prompt)))) return false; }
      else if (n > 1 || step.type === "loop") { if (!(await claudeTurn(r, step, failPrompt(r, step.iters[n - 2].checks, step.type === "verify" ? fill(r, step.prompt) : "")))) return false; }
      const checks = await checksOf(r, it); if (!checks) return false;
      it.ended = Date.now(); it.ok = checks.every((c) => c.ok); emit(r);
      if (it.ok) { step.status = "grün"; emit(r); return true; }
      const s = sig(checks); same = s === last ? same + 1 : 0; last = s;
      if (same >= 2) { r.status = "kreist"; log(r, "err", "Dreimal derselbe Fehler, Loop angehalten"); return false; }
      if (n === r.maxIter) { r.status = "rot"; log(r, "err", `Nach ${n} Läufen immer noch rot`); return false; }
    }
    return false;
  }

  async function execute(r) {
    log(r, "start", `${r.recipe.name}: ${head(r.task.replace(/\s+/g, " "), 160)}`);
    for (let i = 0; i < r.steps.length; i++) {
      r.stepIdx = i; emit(r);
      const ok = await runStep(r, r.steps[i]);
      if (!ok) { if (r.stopped) r.status = "gestoppt"; else if (r.status === "läuft") r.status = "fehler"; r.steps[i].status = r.status; break; }
    }
    if (r.status === "läuft") { r.status = "grün"; log(r, "done", `fertig · $${r.cost.toFixed(2)}`); }
    r.ended = Date.now(); emit(r);
    send("loop:done", { id: r.id, status: r.status, name: r.recipe.name, project: r.cwd.split("/").pop() });
  }

  function start(o = {}) {
    const rec = recipes().find((x) => x.id === o.recipeId);
    if (!rec) throw new Error("Rezept nicht gefunden");
    if (!demo && !isProject(o.cwd)) throw new Error("Projekt nicht gefunden");
    const task = String(o.task || "").trim();
    if (!task || task.length > 8000) throw new Error("Auftrag fehlt oder ist zu lang");
    const verify = (Array.isArray(o.verify) ? o.verify : []).map((c) => String(c).trim()).filter(Boolean).slice(0, 10);
    if (verify.some((c) => c.length > 500)) throw new Error("Prüf-Befehl zu lang");
    if (rec.steps.some((s) => s.type !== "prompt") && !verify.length) throw new Error("Dieses Rezept braucht mindestens einen Prüf-Befehl");
    const r = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), recipe: { id: rec.id, name: rec.name }, cwd: o.cwd, task, verify,
      maxIter: Math.min(20, Math.max(1, +o.maxIter || 8)), maxUsd: Math.min(50, Math.max(0.1, +o.maxUsd || 3)), perm: PERMS.includes(o.perm) ? o.perm : "acceptEdits",
      sessionId: typeof o.sessionId === "string" && /^[0-9a-f-]{36}$/i.test(o.sessionId) ? o.sessionId : null,
      steps: rec.steps.map((s) => ({ ...s, status: "wartet", iters: [] })), stepIdx: 0, status: "läuft", cost: 0, started: Date.now(), ended: null, log: [] };
    runs.set(r.id, r); emit(r); execute(r);
    return snap(r);
  }
  function stop(id) {
    const r = runs.get(id); if (!r || r.status !== "läuft") return false;
    r.stopped = true; r.status = "gestoppt";
    try { if (r.child) { r.child.pid && process.kill(-r.child.pid); } } catch {} try { r.child?.kill(); } catch {}
    log(r, "err", "Von dir gestoppt"); return true;
  }
  function remove(id) { const r = runs.get(id); if (!r || r.status === "läuft") return false; runs.delete(id); writeJson(RUNS, [...runs.values()].map(snap)); return true; }
  const killAll = () => { for (const r of runs.values()) if (r.status === "läuft") stop(r.id); };

  // ---------- demo: fake progress so screenshots work without calling Claude ----------
  const DEMO_TOOLS = ["Read src/search.ts", "Edit src/search.ts", "Bash bun test search", "Edit tests/search.test.ts", "Grep normalize"];
  function demoCall(r, ok) {
    let k = 0; const iv = setInterval(() => { if (r.stopped) { clearInterval(iv); return ok({ code: 1, result: null, text: "" }); } log(r, "tool", DEMO_TOOLS[(k + r.log.length) % DEMO_TOOLS.length]); if (++k >= 3) { clearInterval(iv); r.sessionId ||= "demo0000-0000-4000-8000-000000000001"; ok({ code: 0, result: { total_cost_usd: 0.31 }, text: "Ich habe die Normalisierung für Umlaute ergänzt und die Suche angepasst." }); } }, 900);
  }
  function demoCheck(r, cmd, ok) {
    const n = r.steps[r.stepIdx]?.iter || 1, fail = n < 3 && /test/.test(cmd);
    setTimeout(() => ok({ cmd, ok: !fail, code: fail ? 1 : 0, ms: 1400, tail: fail ? `✗ findet "Müsli" bei Suche nach "musli"\n  expected 1 result, got 0\n${4 - n} failed, 21 passed` : "24 passed" }), 1400);
  }

  return { recipes, saveRecipes, detect, start, stop, remove, killAll, list: () => [...runs.values()].map(snap).sort((a, b) => b.started - a.started), limits: () => limits, refreshLimits };
}
