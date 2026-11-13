// The little companion: a pixel figure that walks along the statusline, now and then says how much of your
// plan limit is left, who waits for you, when a loop turned green. Its mood shows the situation at a glance:
// hops while agents work, waves when one waits, sweats near the limit, sleeps at night. Click (or :Begleiter) for details.
(function () {
  const A = window.Atlas, esc = A.esc, lim = window.atlasApp?.limits;
  const KEY = "atlas.mascot";
  let on = true; try { on = localStorage.getItem(KEY) !== "off"; } catch {}
  const css = `
  #mascot { position:fixed; left:60px; bottom:57px; z-index:36; cursor:pointer; user-select:none; transition:left 4s cubic-bezier(.45,.05,.4,1), opacity .3s; }
  #mascot.hide { opacity:0; pointer-events:none; }
  body.loops-open #mascot { bottom:14px; }
  #mascot .spr { width:42px; height:30px; display:block; image-rendering:pixelated; }
  #mascot .bod { animation:mbob 1.8s ease-in-out infinite; }
  #mascot.walk .bod { animation:mbob .36s ease-in-out infinite; }
  #mascot.m-run .bod { animation:mhop .55s cubic-bezier(.3,0,.5,1) infinite; }
  #mascot.m-sleep .bod { animation:mbob 3.5s ease-in-out infinite; }
  #mascot.flip .spr { transform:scaleX(-1); }
  @keyframes mbob { 50% { transform:translateY(-2px); } }
  @keyframes mhop { 0%,100% { transform:translateY(0); } 40% { transform:translateY(-7px); } }
  #mascot .sig { position:absolute; left:50%; top:-16px; transform:translateX(-50%); font:800 12px var(--mono); pointer-events:none; }
  #mascot.m-wait .sig { color:#fabd2f; animation:mbob .5s infinite; } #mascot.m-sweat .sig { color:#83a598; animation:mdrop 1.2s infinite; }
  #mascot.m-sleep .sig { color:#83a598; animation:mz 2.4s infinite; } #mascot.m-sad .sig { color:#fb4934; }
  @keyframes mdrop { from { transform:translate(6px,0); opacity:1; } to { transform:translate(8px,10px); opacity:0; } }
  @keyframes mz { from { transform:translate(4px,4px) scale(.7); opacity:0; } 40% { opacity:1; } to { transform:translate(12px,-10px) scale(1.1); opacity:0; } }
  #mascot .sh { width:30px; height:5px; border-radius:50%; background:rgba(0,0,0,.45); margin:0 auto; filter:blur(1px); }
  #mascot .bub { position:absolute; bottom:44px; left:var(--bl,-110px); width:max-content; max-width:270px; transform:scale(.6); transform-origin:var(--bo,50%) bottom; opacity:0; pointer-events:none;
    transition:transform .25s cubic-bezier(.3,1.6,.6,1), opacity .2s; background:#ebdbb2; color:#1d1611; border-radius:12px; padding:7px 11px; font:600 11.5px/1.4 var(--mono); box-shadow:0 12px 30px rgba(0,0,0,.45); }
  #mascot .bub::after { content:""; position:absolute; left:var(--bo,50%); bottom:-5px; width:11px; height:11px; background:#ebdbb2; transform:translateX(-50%) rotate(45deg); border-radius:2px; }
  #mascot .bub.show { opacity:1; transform:scale(1); }
  #mascot .bub b { color:#b4532a; }
  #mascot .bub .bar { height:5px; border-radius:3px; background:rgba(0,0,0,.12); margin-top:5px; overflow:hidden; } #mascot .bub .bar i { display:block; height:100%; background:var(--c); }
  #mpanel { position:fixed; z-index:37; bottom:96px; left:20px; width:310px; background:rgba(29,32,33,.98); border:1px solid #504945; border-radius:14px; padding:14px; color:#d5c4a1; font:500 12px/1.45 var(--mono);
    box-shadow:0 24px 60px rgba(0,0,0,.55); }
  #mpanel[hidden] { display:none; }
  #mpanel h4 { color:#ebdbb2; display:flex; align-items:center; gap:8px; margin:0 0 10px; font-size:13px; }
  #mpanel .r { margin-bottom:10px; } #mpanel .r > div:first-child { display:flex; justify-content:space-between; } #mpanel .r b { color:#ebdbb2; }
  #mpanel .bar { height:6px; border-radius:3px; background:#3c3836; overflow:hidden; margin:4px 0 2px; } #mpanel .bar i { display:block; height:100%; background:var(--c); border-radius:3px; }
  #mpanel small, #mpanel .dim { color:#928374; }
  #mpanel .row { display:flex; gap:8px; align-items:center; min-height:22px; }
  #mpanel .w { cursor:pointer; border-radius:5px; padding:0 4px; margin:0 -4px; } #mpanel .w:hover { background:#3c3836; }
  #mpanel .ell { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; }
  #mpanel .dot { width:7px; height:7px; border-radius:50%; background:var(--c); flex:none; }
  #mpanel .acts { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
  #mpanel button { font:inherit; font-size:11px; border:1px solid #504945; border-radius:6px; padding:2px 8px; color:#d5c4a1; background:#282828; cursor:pointer; }
  #mpanel button:hover { border-color:#7c6f64; }
  #mpanel kbd { font:700 10px var(--mono); color:#a89984; border:1px solid rgba(235,219,178,.16); border-bottom-width:2px; border-radius:4px; padding:0 4px; }
  @media (prefers-reduced-motion: reduce) { #mascot, #mascot * { animation:none !important; transition:opacity .2s !important; } }
  `;
  const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);
  const M = document.createElement("div"); M.id = "mascot"; M.title = "Begleiter: Klick für Limits";
  M.innerHTML = `<div class="bub"></div><span class="sig"></span><div class="bod"><svg class="spr" viewBox="0 0 14 10" shape-rendering="crispEdges"></svg></div><div class="sh"></div>`;
  const P = document.createElement("div"); P.id = "mpanel"; P.hidden = true;
  document.body.append(M, P);
  const SPR = M.querySelector("svg"), BUB = M.querySelector(".bub"), SIG = M.querySelector(".sig");

  // ---------- sprite ----------
  const BODY = ["...########...", "..##########..", ".####e##e####.", ".############.", "##############", ".############.", "..##########.."];
  const LEGS = [["..#.#....#.#..", ".............."], ["...#.#..#.#...", ".............."]];
  function draw(svg, { frame = 0, eyes = "open", wave = false } = {}) {
    const rows = BODY.map((r, y) => {
      let x = r;
      if (eyes === "shut") x = x.replace(/e/g, "#");
      if (eyes === "sleep" && y === 2) x = ".####-##-####.";
      if (wave && y === 4) x = frame ? "#############." : ".############.";
      return x;
    });
    if (wave) rows[frame ? 1 : 3] = rows[frame ? 1 : 3].replace(/\.$/, "#");
    const out = [];
    [...rows, ...LEGS[frame]].forEach((r, y) => [...r].forEach((c, x) => {
      if (c === ".") return;
      out.push(`<rect x="${x}" y="${y + 1}" width="1.03" height="1.03" fill="${c === "e" ? "#1d1611" : c === "-" ? "#7a3a20" : y === 0 ? "#f3a27c" : "#e07a4f"}"/>`);
    }));
    out.push(`<rect x="6.5" y="0" width="1" height="1" fill="#fabd2f"/>`);
    svg.innerHTML = out.join("");
  }

  // ---------- state ----------
  let limits = null, mood = "idle", walking = false, frame = 0, blink = false, x = 60, loopsRunning = 0, prev = { waiting: new Set(), five: null };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmtIn = (t) => { const m = Math.max(0, Math.round((t - Date.now()) / 60e3)); return m < 60 ? `${m} min` : m < 48 * 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${Math.round(m / 1440)} Tagen`; };
  const clock = (t) => new Date(t).toLocaleString("de-DE", Date.now() + 864e5 < t ? { weekday: "short", hour: "2-digit", minute: "2-digit" } : { hour: "2-digit", minute: "2-digit" });
  const colorFor = (p) => (p >= 90 ? "#fb4934" : p >= 70 ? "#fabd2f" : "#8ec07c");
  function agents() {
    const now = Date.now(), run = [], wait = [];
    for (const s of A.DATA.sessions.slice(0, 80)) { const a = A.agentState(s, now); if (a.st === "run") run.push(s); else if (a.st === "wait" && a.why !== "im Terminal offen") wait.push(s); }
    return { run, wait };
  }
  const todayCost = () => { const d = new Date().toDateString(); return A.DATA.sessions.filter((s) => new Date(s.end).toDateString() === d).reduce((n, s) => n + (s.cost?.usd || 0), 0); };
  function computeMood() {
    const { run, wait } = agents(), h = new Date().getHours(), five = limits?.five?.pct ?? 0;
    if (mood === "happy" || mood === "sad") return mood; // short-lived event moods
    if (wait.length) return "wait";
    if (five >= 80) return "sweat";
    if (run.length || loopsRunning) return "run";
    if (h >= 23 || h < 6) return "sleep";
    return "idle";
  }
  function setMood(m) {
    mood = m; M.className = M.className.replace(/\bm-\w+/g, "").trim() + " m-" + m;
    SIG.textContent = { wait: "!", sweat: "💧", sleep: "z", sad: "?", happy: "✦" }[m] || "";
  }
  setInterval(() => { if (walking) frame ^= 1; else if (mood === "wait") frame = (Date.now() / 400 | 0) % 2; else frame = 0; draw(SPR, { frame, eyes: mood === "sleep" ? "sleep" : blink ? "shut" : "open", wave: mood === "wait" && !walking }); }, 180);
  setInterval(() => { blink = true; setTimeout(() => (blink = false), 140); }, 3600);

  // ---------- speech ----------
  // keep the bubble inside the window: centred over the figure unless that would cut it off
  function placeBubble(at = x) {
    const w = BUB.offsetWidth || 240, mid = 21;
    const left = Math.max(10 - at, Math.min(innerWidth - 10 - at - w, mid - w / 2));
    BUB.style.setProperty("--bl", left + "px"); BUB.style.setProperty("--bo", Math.max(12, Math.min(w - 12, mid - left)) + "px");
  }
  let sayT, lastSay = 0;
  function say(html, m, ms = 6500) {
    if (!on) return;
    BUB.innerHTML = html; placeBubble(); BUB.classList.add("show"); lastSay = Date.now();
    clearTimeout(sayT); sayT = setTimeout(() => { BUB.classList.remove("show"); if (mood === "happy" || mood === "sad") setMood(computeMood() === mood ? "idle" : computeMood()); }, ms);
    if (m) { setMood(m); setTimeout(() => { if (mood === m) { mood = "idle"; setMood(computeMood()); } }, ms); }
  }
  const bar = (p) => `<div class="bar" style="--c:${colorFor(p)}"><i style="width:${Math.min(100, p)}%"></i></div>`;
  const TIPS = [
    () => limits?.five ? `Noch <b>${100 - limits.five.pct} %</b> im 5-Stunden-Fenster. Reset in ${fmtIn(limits.five.resetsAt)}.${bar(limits.five.pct)}` : null,
    () => limits?.week ? `Diese Woche <b>${limits.week.pct} %</b> genutzt. Reset ${clock(limits.week.resetsAt)}.${bar(limits.week.pct)}` : null,
    () => { const w = agents().wait; return w.length ? `<b>${esc(w[0].label.slice(0, 40))}</b> wartet auf dich${w.length > 1 ? ` (und ${w.length - 1} weitere)` : ""}.` : null; },
    () => { const c = todayCost(); return c > 0 ? `Heute bisher <b>${A.usd ? A.usd(c) : "$" + c.toFixed(2)}</b> in deinen Sessions.` : null; },
    () => loopsRunning ? `<b>${loopsRunning}</b> ${loopsRunning === 1 ? "Loop läuft" : "Loops laufen"}. Ich melde mich, wenn's grün ist.` : null,
    () => `Klick auf mich für alle Limits. <b>:Loops</b> startet einen Loop.`,
  ];
  let tipN = 0;
  function nextTip() { for (let i = 0; i < TIPS.length; i++) { const t = TIPS[tipN++ % TIPS.length](); if (t) return say(t); } }

  // events: limits crossing thresholds, an agent starting to wait
  function checkEvents() {
    const five = limits?.five?.pct;
    if (five != null && prev.five != null) {
      for (const th of [50, 80, 95]) if (prev.five < th && five >= th) say(`Achtung: <b>${five} %</b> vom 5-Stunden-Fenster weg. Reset ${clock(limits.five.resetsAt)}.${bar(five)}`, th >= 80 ? "sweat" : null, 9000);
      if (prev.five >= 50 && five < 20) say(`Frisches Fenster! Nur <b>${five} %</b> genutzt.`, "happy");
    }
    if (five != null) prev.five = five;
    const { wait } = agents(), ids = new Set(wait.map((s) => s.id));
    const fresh = wait.find((s) => !prev.waiting.has(s.id));
    if (fresh && prev.waiting.size + 1 > 0 && prev.init) { const q = A.askOf?.(fresh); say(`<b>${esc(fresh.label.slice(0, 40))}</b> wartet auf dich${q ? `: „${esc(q.slice(0, 90))}“` : "."}`, "wait", 8000); }
    prev.waiting = ids; prev.init = true;
  }

  // ---------- walking ----------
  function wander() {
    if (!on) return;
    const vis = !document.body.classList.contains("term-open");
    if (vis && !reduce && mood !== "sleep" && !BUB.classList.contains("show") && P.hidden) {
      const nx = 30 + Math.random() * Math.max(100, innerWidth - 140);
      M.classList.toggle("flip", nx < x); M.classList.add("walk"); walking = true;
      M.style.left = nx + "px"; x = nx; placeBubble(nx);
      setTimeout(() => { walking = false; M.classList.remove("walk"); if (Date.now() - lastSay > 80e3) nextTip(); }, 4000);
    }
    setTimeout(wander, 22e3 + Math.random() * 30e3);
  }

  // ---------- panel ----------
  function paintPanel() {
    const { run, wait } = agents(), l = limits;
    const win = (name, w, hint) => w ? `<div class="r"><div><span>${name}</span><b>${w.pct} %</b></div>${`<div class="bar" style="--c:${colorFor(w.pct)}"><i style="width:${Math.min(100, w.pct)}%"></i></div>`}<small>Reset ${clock(w.resetsAt)} · in ${fmtIn(w.resetsAt)}${hint ? ` · ${hint}` : ""}</small></div>` : "";
    let pace = "";
    if (l?.five && l.five.pct > 5) { const left = l.five.resetsAt - Date.now(), used = 5 * 3600e3 - left; if (used > 10 * 60e3) { const full = Date.now() + ((100 - l.five.pct) / l.five.pct) * used; if (full < l.five.resetsAt) pace = `bei dem Tempo voll um ${clock(full)}`; } }
    P.innerHTML = `<h4><svg viewBox="0 0 14 10" width="28" height="20" shape-rendering="crispEdges" class="mini"></svg>Deine Limits</h4>
      ${l && (l.five || l.week) ? win("5-Stunden-Fenster", l.five, pace) + win("Woche, alle Modelle", l.week) + win("Woche, Opus", l.opus) + `<div class="dim" style="margin:-4px 0 10px">Stand vor ${fmtIn(Date.now() * 2 - l.at).replace(/^0 min$/, "unter 1 min")}</div>`
        : `<div class="dim" style="margin-bottom:10px">Noch keine Werte. Claude meldet die Limits nur mit Abo (Pro, Max). „Aktualisieren“ fragt kurz nach.</div>`}
      <div class="row"><span class="dim">Heute in Sessions</span><b style="margin-left:auto;color:#ebdbb2">${A.usd ? A.usd(todayCost()) : "$" + todayCost().toFixed(2)}</b></div>
      <div class="row"><span class="dim">Arbeiten gerade</span><b style="margin-left:auto;color:#ebdbb2">${run.length} Agenten${loopsRunning ? ` · ${loopsRunning} Loops` : ""}</b></div>
      ${wait.length ? `<div class="dim" style="margin-top:6px">Warten auf dich:</div>${wait.slice(0, 4).map((s) => `<div class="row w" data-sid="${s.id}"><span class="dot" style="--c:#fabd2f"></span><span class="ell">${esc(s.label)}</span><span class="dim" style="margin-left:auto">${esc(s.projName)}</span></div>`).join("")}` : ""}
      <div class="acts"><button data-m="refresh">Aktualisieren</button><button data-m="loops">Loops öffnen</button><button data-m="off">Ausblenden</button></div>
      <div class="dim" style="margin-top:8px">Wieder einblenden mit <b>:Begleiter</b> · <kbd>Esc</kbd> schliesst</div>`;
    draw(P.querySelector(".mini"));
  }
  function togglePanel(show = P.hidden) { P.hidden = !show; if (show) { P.style.left = Math.min(innerWidth - 330, Math.max(12, x - 130)) + "px"; paintPanel(); refresh(false); } }
  M.addEventListener("click", (e) => { e.stopPropagation(); togglePanel(); });
  P.addEventListener("click", async (e) => {
    e.stopPropagation();
    const w = e.target.closest("[data-sid]"); if (w) { togglePanel(false); A.open?.(w.dataset.sid); return; }
    const b = e.target.closest("[data-m]"); if (!b) return;
    if (b.dataset.m === "refresh") { b.textContent = "fragt nach …"; await refresh(true); paintPanel(); }
    else if (b.dataset.m === "loops") { togglePanel(false); window.AtlasLoops?.open(); }
    else if (b.dataset.m === "off") setOn(false);
  });
  document.addEventListener("click", () => { if (!P.hidden) togglePanel(false); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !P.hidden) { P.hidden = true; } }, true);

  // ---------- limits ----------
  async function refresh(force) { if (!lim) return; const r = await lim.refresh(force); if (r?.ok && r.value) { limits = r.value; checkEvents(); } }
  if (lim) {
    lim.onUpdate((l) => { limits = l; checkEvents(); if (!P.hidden) paintPanel(); });
    lim.get().then((r) => { if (r?.ok) limits = r.value; prev.five = limits?.five?.pct ?? null; refresh(false); });
    setInterval(() => refresh(false), 30 * 60e3);
  }
  setInterval(() => { setMood(computeMood()); checkEvents(); }, 5000);

  function setOn(v) {
    on = v; try { localStorage.setItem(KEY, v ? "on" : "off"); } catch {}
    M.classList.toggle("hide", !v); if (!v) { P.hidden = true; BUB.classList.remove("show"); }
    else say("Da bin ich wieder.", "happy", 3000);
  }
  M.classList.toggle("hide", !on);
  setMood(computeMood());
  setTimeout(() => { if (on) say(limits?.five ? `Hi! Noch <b>${100 - limits.five.pct} %</b> in deinem 5-Stunden-Fenster.${bar(limits.five.pct)}` : "Hi! Ich pass auf deine <b>Limits</b> und Agenten auf.", "happy"); }, 2500);
  setTimeout(wander, 9000);

  window.AtlasMascot = { say, setOn, toggle: () => setOn(!on), panel: togglePanel, isOn: () => on, loopsChanged: (n) => { loopsRunning = n; } };
})();
