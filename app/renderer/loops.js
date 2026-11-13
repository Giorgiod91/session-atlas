// Loops and recipes (desktop app): start a loop "until green", watch it live, edit your recipes.
// The work happens in the main process (loops.mjs); this file is only the window on top of the Atlas.
(function () {
  const api = window.atlasApp?.loops;
  if (!api) return;
  const A = window.Atlas, esc = A.esc;
  const css = `
  #loops { position:fixed; inset:0; z-index:35; display:flex; flex-direction:column; background:#0f1011; color:#d5c4a1; font:500 12.5px/1.45 var(--mono);
    transform:translateY(16px); opacity:0; pointer-events:none; transition:transform .35s cubic-bezier(.2,.9,.25,1), opacity .25s; }
  #loops.open { transform:none; opacity:1; pointer-events:auto; }
  #loops kbd { font:700 10px var(--mono); color:#bdae93; background:rgba(235,219,178,.07); border:1px solid rgba(235,219,178,.16); border-bottom-width:2px; border-radius:4px; padding:0 4px; }
  #loops .lb { height:34px; padding-left:78px; -webkit-app-region:drag; display:flex; align-items:stretch; background:#141617; border-bottom:1px solid #0a0b0b; flex:none; }
  #loops .lb > * { -webkit-app-region:no-drag; }
  #loops .lb .ttl { display:flex; align-items:center; gap:8px; padding:0 14px; color:#1a0f0a; background:#e07a4f; font-weight:800; letter-spacing:.06em; font-size:11.5px; }
  #loops .lb .tab { display:flex; align-items:center; gap:6px; padding:0 14px; color:#928374; border-right:1px solid #0a0b0b; }
  #loops .lb .tab.on { color:#ebdbb2; background:#1b1d1e; box-shadow:inset 0 -2px 0 #e07a4f; }
  #loops .lb .sp { flex:1; -webkit-app-region:drag; }
  #loops .lb .hk { display:flex; align-items:center; gap:10px; padding:0 14px; color:#928374; font-size:11px; }
  #loops .lm { flex:1; min-height:0; display:grid; grid-template-columns:330px minmax(0,1fr); }
  #loops .side { border-right:1px solid #1d2021; overflow:auto; padding:8px 0; }
  #loops .side h4 { color:#928374; font-weight:600; font-style:italic; padding:6px 14px; font-size:11.5px; }
  #loops .it { display:grid; grid-template-columns:12px minmax(0,1fr) auto; gap:4px 9px; align-items:center; padding:7px 14px; cursor:pointer; border-left:2px solid transparent; }
  #loops .it:hover { background:#16181a; }
  #loops .it.on { background:#1d2021; border-left-color:#e07a4f; }
  #loops .it .t { color:#ebdbb2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  #loops .it .m { grid-column:2 / 4; color:#928374; font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  #loops .it .c { color:#928374; font-size:11px; }
  #loops .empty { color:#928374; padding:14px; }
  #loops .dot { width:8px; height:8px; border-radius:50%; background:var(--c,#665c54); display:inline-block; flex:none; }
  #loops .dot.live { animation:lpulse 1.2s ease-in-out infinite; }
  @keyframes lpulse { 50% { box-shadow:0 0 0 4px color-mix(in srgb, var(--c) 25%, transparent); } }
  #loops .main { overflow:auto; padding:18px 22px 40px; }
  #loops .hd { display:flex; gap:12px; align-items:flex-start; margin-bottom:14px; }
  #loops .hd h2 { color:#ebdbb2; font-size:16px; line-height:1.3; flex:1; min-width:0; overflow-wrap:anywhere; }
  #loops .badge { border-radius:20px; padding:2px 10px; font-weight:800; font-size:11px; color:#141617; background:var(--c); white-space:nowrap; }
  #loops .meta { display:flex; gap:16px; flex-wrap:wrap; color:#928374; margin-bottom:16px; font-size:11.5px; }
  #loops .meta b { color:#d5c4a1; font-weight:600; }
  #loops .pipe { display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:18px; }
  #loops .stp { border:1px solid #3c3836; background:#16181a; border-radius:10px; padding:7px 11px; min-width:120px; }
  #loops .stp b { color:#ebdbb2; display:block; } #loops .stp small { color:#928374; }
  #loops .stp.now { border-color:#e07a4f; box-shadow:0 0 0 3px rgba(224,122,79,.12); }
  #loops .stp.ok { border-color:rgba(142,192,124,.6); } #loops .stp.bad { border-color:rgba(251,73,52,.6); }
  #loops .arr { color:#665c54; }
  #loops .sec { color:#928374; font-style:italic; margin:16px 0 8px; } #loops .sec b { color:#bdae93; font-style:normal; }
  #loops .pips { display:flex; gap:5px; flex-wrap:wrap; }
  #loops .pips i { width:22px; height:22px; border-radius:6px; display:grid; place-items:center; font-style:normal; font-size:10.5px; font-weight:800; color:#141617; background:var(--c,#3c3836); }
  #loops .pips i.run { background:transparent; border:1.5px dashed #e07a4f; color:#e07a4f; }
  #loops .chk { border:1px solid #282828; border-radius:8px; margin-bottom:6px; overflow:hidden; }
  #loops .chk .ch { display:flex; gap:8px; align-items:center; padding:5px 10px; background:#16181a; }
  #loops .chk .ch b { color:#ebdbb2; font-weight:600; } #loops .chk .ch span:last-child { margin-left:auto; color:#928374; font-size:11px; }
  #loops .chk pre { margin:0; padding:8px 10px; max-height:180px; overflow:auto; font:11px/1.45 var(--mono); color:#bdae93; white-space:pre-wrap; background:#0b0c0c; }
  #loops .log { background:#0b0c0c; border:1px solid #1d2021; border-radius:10px; padding:8px 10px; font-size:11.5px; max-height:300px; overflow:auto; }
  #loops .log div { display:flex; gap:8px; padding:1px 0; } #loops .log .ts { color:#665c54; flex:none; }
  #loops .log .tool { color:#83a598; } #loops .log .ok { color:#8ec07c; } #loops .log .bad, #loops .log .err { color:#f08a7c; } #loops .log .say { color:#d5c4a1; } #loops .log .start, #loops .log .done { color:#e07a4f; } #loops .log .check { color:#928374; }
  #loops .acts { display:flex; gap:8px; flex-wrap:wrap; margin-top:16px; }
  #loops button.b { border:1px solid #3c3836; border-radius:7px; padding:4px 11px; color:#d5c4a1; background:#16181a; font:inherit; cursor:pointer; }
  #loops button.b:hover { border-color:#665c54; }
  #loops button.b.p { background:#e07a4f; color:#1a0f0a; border-color:#e07a4f; font-weight:800; }
  #loops .frm { display:grid; grid-template-columns:130px minmax(0,1fr); gap:10px 14px; align-items:start; max-width:860px; }
  #loops .frm label { color:#bdae93; padding-top:5px; } #loops .frm label small { display:block; color:#928374; font-size:10.5px; }
  #loops .frm input, #loops .frm select, #loops .frm textarea { font:inherit; color:#ebdbb2; background:#16181a; border:1px solid #3c3836; border-radius:7px; padding:5px 8px; width:100%; outline:none; }
  #loops .frm textarea { resize:vertical; min-height:70px; }
  #loops .frm :focus { border-color:#e07a4f; box-shadow:0 0 0 3px rgba(224,122,79,.15); }
  #loops .frm .row2 { display:flex; gap:10px; } #loops .frm .row2 > * { flex:1; }
  #loops .frm .hint { color:#928374; font-size:11px; margin-top:4px; }
  #loops .frm .sugg { display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; }
  #loops .frm .sugg button { font:inherit; font-size:11px; border:1px solid #3c3836; border-radius:20px; padding:0 9px; color:#bdae93; background:none; cursor:pointer; }
  #loops .err-msg { color:#f08a7c; margin-top:8px; }
  #loops .rec-steps { display:flex; flex-direction:column; gap:6px; }
  `;
  const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);
  const el = document.createElement("div"); el.id = "loops"; document.body.appendChild(el);

  const COL = { "läuft": "#e07a4f", "grün": "#8ec07c", "rot": "#fb4934", "kreist": "#fabd2f", "budget": "#fabd2f", "gestoppt": "#928374", "fehler": "#fb4934", "wartet": "#504945", "fertig": "#8ec07c" };
  const TYPE = { prompt: ["Prompt", "ein Auftrag"], loop: ["Loop", "bauen bis grün"], verify: ["Prüfen", "bei Rot reparieren"] };
  const st = { open: false, tab: "runs", runs: [], recipes: [], sel: null, form: null, rsel: 0, err: "" };
  const ago = (t) => { const s = Math.round((Date.now() - t) / 1000); return s < 60 ? `${s} s` : s < 3600 ? `${Math.round(s / 60)} min` : `${Math.round(s / 3600)} h`; };
  const hm = (t) => new Date(t).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const proj = (p) => String(p || "").split("/").pop();
  const projects = () => A.DATA.projects.map((p) => p.path).filter((p) => p && p.startsWith("/"));

  async function load() {
    const [r, rc] = await Promise.all([api.list(), api.recipes()]);
    if (r.ok) st.runs = r.value; if (rc.ok) st.recipes = rc.value;
    if (!st.sel && st.runs[0]) st.sel = st.runs[0].id;
  }
  api.onUpdate((r) => { const i = st.runs.findIndex((x) => x.id === r.id); if (i >= 0) st.runs[i] = r; else { st.runs.unshift(r); } if (st.open && !st.form) paintSoon(); window.AtlasMascot?.loopsChanged?.(running()); });
  api.onDone((d) => {
    const ok = d.status === "grün", msg = ok ? `Loop grün: ${d.project}` : `Loop ${d.status}: ${d.project}`;
    A.toast(msg, d.name); window.AtlasMascot?.say(ok ? `Loop <b>${esc(d.project)}</b> ist grün ✓` : `Loop <b>${esc(d.project)}</b>: ${esc(d.status)}`, ok ? "happy" : "sad");
    if (!document.hasFocus() && "Notification" in window) { try { new Notification(msg, { body: d.name, silent: false }); } catch {} }
  });
  const running = () => st.runs.filter((r) => r.status === "läuft").length;
  let paintT = null; const paintSoon = () => { if (!paintT) paintT = requestAnimationFrame(() => { paintT = null; paint(); }); };

  // ---------- paint ----------
  function paint() {
    const keys = st.form ? `<span><kbd>Tab</kbd> nächstes Feld</span><span><kbd>⌘ Enter</kbd> ${st.form.kind === "recipe" ? "speichern" : "starten"}</span><span><kbd>Esc</kbd> abbrechen</span>`
      : st.tab === "runs" ? `<span><kbd>j</kbd><kbd>k</kbd> wählen</span><span><kbd>n</kbd> neuer Loop</span><span><kbd>s</kbd> stoppen</span><span><kbd>o</kbd> Session öffnen</span><span><kbd>x</kbd> entfernen</span><span><kbd>Tab</kbd> Rezepte</span><span><kbd>Esc</kbd> zurück</span>`
      : `<span><kbd>j</kbd><kbd>k</kbd> wählen</span><span><kbd>e</kbd> bearbeiten</span><span><kbd>n</kbd> neues Rezept</span><span><kbd>Enter</kbd> damit starten</span><span><kbd>x</kbd> löschen</span><span><kbd>Tab</kbd> Läufe</span>`;
    el.innerHTML = `<div class="lb"><span class="ttl">⟳ LOOPS</span><button class="tab ${st.tab === "runs" ? "on" : ""}" data-tab="runs">Läufe <span style="color:#e07a4f">${running() || ""}</span></button><button class="tab ${st.tab === "recipes" ? "on" : ""}" data-tab="recipes">Rezepte</button><span class="sp"></span><span class="hk">${keys}</span></div>
      <div class="lm"><div class="side">${st.tab === "runs" ? sideRuns() : sideRecipes()}</div><div class="main">${st.form ? formHTML() : st.tab === "runs" ? detailRun() : detailRecipe()}</div></div>`;
    const lg = el.querySelector(".log"); if (lg) lg.scrollTop = lg.scrollHeight;
    if (st.form && !st.form.painted) { st.form.painted = true; requestAnimationFrame(() => el.querySelector(st.form.focus || "[data-f]")?.focus()); }
  }
  function sideRuns() {
    if (!st.runs.length) return `<h4>-- Läufe</h4><div class="empty">Noch keine Loops. <kbd>n</kbd> startet einen.</div>`;
    return `<h4>-- Läufe</h4>` + st.runs.map((r) => { const s = r.steps[r.stepIdx] || {}; return `<div class="it ${r.id === st.sel ? "on" : ""}" data-run="${r.id}">
      <span class="dot ${r.status === "läuft" ? "live" : ""}" style="--c:${COL[r.status] || "#665c54"}"></span><span class="t">${esc(r.task.replace(/\s+/g, " "))}</span><span class="c">$${r.cost.toFixed(2)}</span>
      <span class="m">${esc(proj(r.cwd))} · ${esc(r.recipe.name)} · ${r.status === "läuft" ? `Schritt ${r.stepIdx + 1}/${r.steps.length}${s.iter ? `, Lauf ${s.iter}` : ""}` : esc(r.status)} · vor ${ago(r.started)}</span></div>`; }).join("");
  }
  function detailRun() {
    const r = st.runs.find((x) => x.id === st.sel);
    if (!r) return `<div class="empty" style="padding:0"><h2 style="color:#ebdbb2;font-size:16px;margin-bottom:8px">Loops: Claude arbeitet, bis es wirklich passt</h2>
      Du gibst einen Auftrag und Prüf-Befehle (Tests, Typecheck, Lint, eigenes Skript). Claude arbeitet, danach laufen die Prüfungen. Bei Rot geht die Fehlermeldung automatisch zurück an Claude, bis alles grün ist oder ein Limit erreicht ist.<div class="acts"><button class="b p" data-act="new">Neuer Loop <kbd>n</kbd></button></div></div>`;
    const cur = r.steps[r.stepIdx];
    const loopStep = r.steps.filter((s) => s.iters.length && s.type !== "prompt").slice(-1)[0];
    const lastIt = loopStep?.iters.filter((i) => i.checks).slice(-1)[0];
    return `<div class="hd"><h2>${esc(r.task)}</h2><span class="badge" style="--c:${COL[r.status]}">${esc(r.status)}</span></div>
      <div class="meta"><span>Projekt <b>${esc(proj(r.cwd))}</b></span><span>Rezept <b>${esc(r.recipe.name)}</b></span><span>Kosten <b>$${r.cost.toFixed(2)}</b> von $${r.maxUsd}</span><span>max <b>${r.maxIter}</b> Läufe pro Schritt</span><span>Rechte <b>${r.perm === "bypassPermissions" ? "alles erlaubt" : "Dateien ändern"}</b></span><span>${r.ended ? `Dauer <b>${Math.max(1, Math.round((r.ended - r.started) / 60e3))} min</b>` : `läuft seit <b>${ago(r.started)}</b>`}</span></div>
      <div class="pipe">${r.steps.map((s, i) => `${i ? '<span class="arr">→</span>' : ""}<div class="stp ${i === r.stepIdx && r.status === "läuft" ? "now" : ""} ${s.status === "grün" || s.status === "fertig" ? "ok" : ["rot", "fehler", "kreist", "budget"].includes(s.status) ? "bad" : ""}"><b>${i + 1}. ${TYPE[s.type][0]}${s.model ? ` · ${s.model}` : ""}</b><small>${esc(s.status)}${s.iters.length && s.type !== "prompt" ? ` · ${s.iters.length} ${s.iters.length === 1 ? "Lauf" : "Läufe"}` : ""}</small></div>`).join("")}</div>
      ${loopStep ? `<div class="sec">-- <b>Läufe</b> · ${TYPE[loopStep.type][0]}</div><div class="pips">${loopStep.iters.map((it) => `<i class="${it.ok == null && r.status === "läuft" ? "run" : ""}" style="--c:${it.ok ? "#8ec07c" : it.ok === false ? "#fb4934" : "#3c3836"}">${it.n}</i>`).join("")}</div>` : ""}
      ${lastIt ? `<div class="sec">-- <b>Prüfung</b> · Lauf ${lastIt.n}</div>${lastIt.checks.map((c) => `<div class="chk"><div class="ch"><span class="dot" style="--c:${c.ok ? "#8ec07c" : "#fb4934"}"></span><b>${esc(c.cmd)}</b><span>${c.ok ? "grün" : `Exit ${c.code}`} · ${(c.ms / 1000).toFixed(1)} s</span></div>${c.ok ? "" : `<pre>${esc(c.tail)}</pre>`}</div>`).join("")}` : ""}
      <div class="sec">-- <b>Protokoll</b></div><div class="log">${r.log.map((l) => `<div><span class="ts">${hm(l.ts)}</span><span class="${l.kind}">${l.kind === "tool" ? "● " : ""}${esc(l.text)}</span></div>`).join("")}</div>
      <div class="acts">${r.status === "läuft" ? `<button class="b" data-act="stop">Stoppen <kbd>s</kbd></button>` : `<button class="b p" data-act="again">Nochmal mit Änderungen <kbd>a</kbd></button>`}${r.sessionId ? `<button class="b" data-act="open">Session im Terminal <kbd>o</kbd></button>` : ""}<button class="b" data-act="new">Neuer Loop <kbd>n</kbd></button>${r.status !== "läuft" ? `<button class="b" data-act="del">Entfernen <kbd>x</kbd></button>` : ""}</div>`;
  }
  function sideRecipes() {
    return `<h4>-- Rezepte</h4>` + st.recipes.map((r, i) => `<div class="it ${i === st.rsel ? "on" : ""}" data-rec="${i}"><span class="dot" style="--c:#e07a4f"></span><span class="t">${esc(r.name)}</span><span class="c">${r.steps.length}</span><span class="m">${esc(r.desc || r.steps.map((s) => TYPE[s.type][0]).join(" → "))}</span></div>`).join("");
  }
  function detailRecipe() {
    const r = st.recipes[st.rsel]; if (!r) return "";
    return `<div class="hd"><h2>${esc(r.name)}</h2></div><div class="meta"><span>${esc(r.desc)}</span></div>
      <div class="pipe">${r.steps.map((s, i) => `${i ? '<span class="arr">→</span>' : ""}<div class="stp"><b>${i + 1}. ${TYPE[s.type][0]}${s.model ? ` · ${s.model}` : ""}</b><small>${TYPE[s.type][1]}</small></div>`).join("")}</div>
      <div class="sec">-- <b>Schritte</b></div><div class="rec-steps">${r.steps.map((s, i) => `<div class="chk"><div class="ch"><b>${i + 1}. ${TYPE[s.type][0]}</b><span>${s.model || "Standard-Modell"}</span></div>${s.prompt ? `<pre>${esc(s.prompt)}</pre>` : ""}</div>`).join("")}</div>
      <div class="acts"><button class="b p" data-act="userec">Damit starten <kbd>Enter</kbd></button><button class="b" data-act="editrec">Bearbeiten <kbd>e</kbd></button><button class="b" data-act="newrec">Neues Rezept <kbd>n</kbd></button><button class="b" data-act="delrec">Löschen <kbd>x</kbd></button></div>
      <div class="sec">Platzhalter: <b>{auftrag}</b> dein Auftrag, <b>{vorher}</b> die letzte Antwort. Alle Schritte laufen in derselben Session.</div>`;
  }

  // ---------- forms ----------
  const toDsl = (steps) => steps.map((s) => `${s.type}${s.model ? " " + s.model : ""}: ${String(s.prompt || "").split("\n").join("\n  ")}`).join("\n");
  function fromDsl(text) {
    const out = [];
    for (const line of String(text).split("\n")) {
      const m = line.match(/^(prompt|loop|verify)(?:\s+(opus|sonnet|haiku))?\s*:\s?(.*)$/i);
      if (m) out.push({ type: m[1].toLowerCase(), model: m[2] ? m[2].toLowerCase() : null, prompt: m[3] });
      else if (out.length && line.trim()) out[out.length - 1].prompt += "\n" + line.replace(/^ {2}/, "");
      else if (line.trim()) throw new Error(`Diese Zeile verstehe ich nicht: „${line.slice(0, 40)}“. Erlaubt: prompt, loop, verify`);
    }
    return out;
  }
  function formHTML() {
    const f = st.form;
    if (f.kind === "recipe") return `<div class="hd"><h2>${f.idx == null ? "Neues Rezept" : "Rezept bearbeiten"}</h2></div><div class="frm">
      <label>Name</label><input data-f="name" value="${esc(f.name)}" maxlength="60">
      <label>Beschreibung</label><input data-f="desc" value="${esc(f.desc)}" maxlength="160">
      <label>Schritte<small>eine Zeile pro Schritt</small></label><div><textarea data-f="steps" rows="10" spellcheck="false">${esc(f.steps)}</textarea>
        <div class="hint"><b>prompt</b> ein Auftrag · <b>loop</b> Auftrag, dann prüfen, bei Rot zurück · <b>verify</b> erst prüfen, bei Rot reparieren. Optional Modell: <b>opus</b>, <b>sonnet</b>, <b>haiku</b>. Weitere Zeilen mit zwei Leerzeichen am Anfang gehören zum Schritt davor.<br>Beispiel: <code>loop sonnet: Setze den Plan um. {auftrag}</code></div></div>
      <span></span><div><button class="b p" data-act="saverec">Speichern <kbd>⌘ Enter</kbd></button> <button class="b" data-act="cancel">Abbrechen <kbd>Esc</kbd></button>${st.err ? `<div class="err-msg">${esc(st.err)}</div>` : ""}</div></div>`;
    const ps = projects();
    return `<div class="hd"><h2>Neuer Loop</h2></div><div class="frm">
      <label>Projekt</label><select data-f="cwd">${ps.map((p) => `<option value="${esc(p)}" ${p === f.cwd ? "selected" : ""}>${esc(proj(p))}  ·  ${esc(A.short(p))}</option>`).join("")}</select>
      <label>Rezept</label><select data-f="recipeId">${st.recipes.map((r) => `<option value="${esc(r.id)}" ${r.id === f.recipeId ? "selected" : ""}>${esc(r.name)}  ·  ${esc(r.steps.map((s) => TYPE[s.type][0]).join(" → "))}</option>`).join("")}</select>
      <label>Auftrag<small>was soll Claude tun?</small></label><textarea data-f="task" rows="4" placeholder="z. B. Die Suche soll Tippfehler und Umlaute verzeihen">${esc(f.task)}</textarea>
      <label>Prüfung<small>ein Befehl pro Zeile, alle müssen grün sein</small></label><div><textarea data-f="verify" rows="3" spellcheck="false" placeholder="bun test">${esc(f.verify)}</textarea>
        ${f.sugg?.length ? `<div class="sugg"><span class="hint" style="margin:0">gefunden:</span>${f.sugg.map((c) => `<button data-sugg="${esc(c)}">+ ${esc(c)}</button>`).join("")}</div>` : `<div class="hint">Im Projekt nichts gefunden. Jeder Befehl geht, auch ein eigenes Skript wie ./check.sh</div>`}</div>
      <label>Grenzen</label><div class="row2"><div><input data-f="maxIter" type="number" min="1" max="20" value="${f.maxIter}"><div class="hint">max Läufe pro Schritt</div></div><div><input data-f="maxUsd" type="number" min="0.1" max="50" step="0.5" value="${f.maxUsd}"><div class="hint">max Dollar</div></div>
        <div><select data-f="perm"><option value="acceptEdits" ${f.perm !== "bypassPermissions" ? "selected" : ""}>Dateien ändern erlaubt</option><option value="bypassPermissions" ${f.perm === "bypassPermissions" ? "selected" : ""}>Alles erlaubt (auch Befehle)</option></select><div class="hint">Rechte für Claude</div></div></div>
      <span></span><div><button class="b p" data-act="start">Loop starten <kbd>⌘ Enter</kbd></button> <button class="b" data-act="cancel">Abbrechen <kbd>Esc</kbd></button>
        <div class="hint">Läuft als eigene Session (claude -p). Sie taucht danach ganz normal in deiner Liste auf und lässt sich weiterführen.</div>${st.err ? `<div class="err-msg">${esc(st.err)}</div>` : ""}</div></div>`;
  }
  function readForm() { el.querySelectorAll("[data-f]").forEach((i) => { st.form[i.dataset.f] = i.value; }); }
  async function suggest(cwd) { const r = await api.detect(cwd); if (!st.form || st.form.cwd !== cwd) return; st.form.sugg = r.ok ? r.value : []; if (!st.form.verify && st.form.sugg.length) st.form.verify = st.form.sugg.filter((c) => /test/.test(c)).slice(0, 1).join("\n") || st.form.sugg[0]; st.form.painted = false; st.form.focus = `[data-f="${document.activeElement?.dataset?.f || "task"}"]`; paint(); }
  function newLoop(o = {}) {
    const ps = projects(); const prev = o.from;
    st.err = ""; st.tab = "runs";
    st.form = { kind: "loop", cwd: prev?.cwd || o.cwd || ps[0] || "", recipeId: prev?.recipe.id || o.recipeId || st.recipes[0]?.id, task: prev?.task || o.task || "", verify: prev ? prev.verify.join("\n") : "",
      maxIter: prev?.maxIter || 8, maxUsd: prev?.maxUsd || 3, perm: prev?.perm || "acceptEdits", sugg: [], focus: o.task || prev ? '[data-f="task"]' : '[data-f="cwd"]' };
    paint(); suggest(st.form.cwd);
  }
  async function submit() {
    readForm(); const f = st.form; st.err = "";
    if (f.kind === "recipe") {
      try {
        const steps = fromDsl(f.steps); if (!steps.length) throw new Error("Mindestens ein Schritt");
        const list = st.recipes.slice(), rec = { id: f.id || f.name, name: f.name.trim() || "Rezept", desc: f.desc.trim(), steps };
        if (f.idx == null) list.push(rec); else list[f.idx] = rec;
        const r = await api.saveRecipes(list); if (!r.ok) throw new Error(r.error);
        st.recipes = r.value; st.rsel = f.idx ?? st.recipes.length - 1; st.form = null; paint();
      } catch (e) { st.err = e.message; f.painted = true; paint(); }
      return;
    }
    const r = await api.start({ cwd: f.cwd, recipeId: f.recipeId, task: f.task, verify: f.verify.split("\n"), maxIter: +f.maxIter, maxUsd: +f.maxUsd, perm: f.perm });
    if (!r.ok) { st.err = r.error; paint(); return; }
    st.form = null; st.sel = r.value.id; if (!st.runs.some((x) => x.id === r.value.id)) st.runs.unshift(r.value); paint();
    window.AtlasMascot?.say(`Loop gestartet. Ich sag Bescheid, wenn er <b>grün</b> ist.`, "happy");
  }

  // ---------- actions ----------
  async function act(a) {
    const r = st.runs.find((x) => x.id === st.sel);
    if (a === "new") newLoop();
    else if (a === "cancel") { st.form = null; st.err = ""; paint(); }
    else if (a === "start" || a === "saverec") submit();
    else if (a === "stop" && r) await api.stop(r.id);
    else if (a === "again" && r) newLoop({ from: r });
    else if (a === "del" && r && r.status !== "läuft") { await api.remove(r.id); st.runs = st.runs.filter((x) => x.id !== r.id); st.sel = st.runs[0]?.id || null; paint(); }
    else if (a === "open" && r?.sessionId) { const s = A.DATA.sessions.find((x) => x.id === r.sessionId); close(); if (s) A.resume(s); else window.AtlasTerminal?.open({ id: r.sessionId, cwd: r.cwd, project: r.cwd, label: r.task.slice(0, 40) }, false); }
    else if (a === "userec") { const rc = st.recipes[st.rsel]; if (rc) newLoop({ recipeId: rc.id }); }
    else if (a === "editrec") { const rc = st.recipes[st.rsel]; if (rc) { st.err = ""; st.form = { kind: "recipe", idx: st.rsel, id: rc.id, name: rc.name, desc: rc.desc, steps: toDsl(rc.steps), focus: '[data-f="steps"]' }; paint(); } }
    else if (a === "newrec") { st.err = ""; st.tab = "recipes"; st.form = { kind: "recipe", idx: null, name: "", desc: "", steps: "prompt opus: Mach einen kurzen Plan für: {auftrag}\nloop sonnet: Setze den Plan um.", focus: '[data-f="name"]' }; paint(); }
    else if (a === "delrec") { if (st.recipes.length < 2) return A.toast("Das letzte Rezept bleibt"); const list = st.recipes.filter((_, i) => i !== st.rsel); const res = await api.saveRecipes(list); if (res.ok) { st.recipes = res.value; st.rsel = Math.max(0, st.rsel - 1); paint(); } }
  }
  el.addEventListener("click", (e) => {
    const t = e.target;
    const tab = t.closest("[data-tab]"); if (tab) { st.tab = tab.dataset.tab; st.form = null; return paint(); }
    const run = t.closest("[data-run]"); if (run && !st.form) { st.sel = run.dataset.run; return paint(); }
    const rec = t.closest("[data-rec]"); if (rec && !st.form) { st.rsel = +rec.dataset.rec; return paint(); }
    const sg = t.closest("[data-sugg]"); if (sg) { readForm(); const lines = st.form.verify.split("\n").map((x) => x.trim()).filter(Boolean); if (!lines.includes(sg.dataset.sugg)) lines.push(sg.dataset.sugg); st.form.verify = lines.join("\n"); st.form.painted = false; st.form.focus = '[data-f="verify"]'; return paint(); }
    const b = t.closest("[data-act]"); if (b) act(b.dataset.act);
  });
  el.addEventListener("change", (e) => { if (e.target.dataset?.f === "cwd" && st.form) { readForm(); st.form.verify = ""; suggest(st.form.cwd); } });

  // Keys: while open, nothing reaches the Atlas underneath
  window.addEventListener("keydown", (e) => {
    if (!st.open) return;
    const k = e.key, inField = e.target.matches?.("input,textarea,select");
    if (e.metaKey && k === "Escape") return; // terminal toggle stays global
    if (e.metaKey && k === "Enter" && st.form) { e.preventDefault(); e.stopPropagation(); return submit(); }
    if (e.metaKey || e.ctrlKey) return;
    e.stopPropagation();
    if (k === "Escape") { e.preventDefault(); if (st.form) act("cancel"); else close(); return; }
    if (st.form || inField) return;
    const list = st.tab === "runs" ? st.runs : st.recipes;
    const move = (d) => { if (st.tab === "runs") { const i = Math.max(0, Math.min(list.length - 1, list.findIndex((x) => x.id === st.sel) + d)); st.sel = list[i]?.id; } else st.rsel = Math.max(0, Math.min(list.length - 1, st.rsel + d)); paint(); el.querySelector(".it.on")?.scrollIntoView({ block: "nearest" }); };
    if (k === "j" || k === "ArrowDown") { e.preventDefault(); move(1); }
    else if (k === "k" || k === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (k === "Tab") { e.preventDefault(); st.tab = st.tab === "runs" ? "recipes" : "runs"; paint(); }
    else if (k === "q") close();
    else if (st.tab === "runs") { const m = { n: "new", s: "stop", o: "open", x: "del", a: "again" }[k]; if (m) { e.preventDefault(); act(m); } }
    else { const m = { n: "newrec", e: "editrec", x: "delrec", Enter: "userec" }[k]; if (m) { e.preventDefault(); act(m); } }
  }, true);

  async function open(o = {}) {
    await load(); st.open = true; document.body.classList.add("loops-open"); el.classList.add("open");
    if (o.recipes) { st.tab = "recipes"; st.form = null; }
    if (o.new) newLoop(o); else paint();
  }
  function close() { st.open = false; st.form = null; el.classList.remove("open"); document.body.classList.remove("loops-open"); document.activeElement?.blur?.(); }
  load();
  window.AtlasLoops = { open, close, toggle: () => (st.open ? close() : open()), isOpen: () => st.open, running, runs: () => st.runs };
})();
