// Look: Cyberpunk HUD. Activity heatmap (weeks x weekdays) in the center,
// ranked projects on the left, sessions of the selected day on the right,
// linked by drawn-in connector lines.
(function () {
  const MAG = "#ff2bd6", CYA = "#00f0ff", YEL = "#fcee0a";
  const pad = (n) => String(n).padStart(2, "0");
  const dk = (d) => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const WD = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  const css = `
.lk-hud { --mag:${MAG}; --cya:${CYA}; --yel:${YEL}; --bgc:#05060a; --pn:#080a12;
  background: radial-gradient(1200px 700px at 50% 40%, #0d1020 0%, #05060a 70%), #05060a; color: #e6f6ff; overflow: hidden;
  font-family: var(--mono); display: grid; grid-template-rows: auto 1fr; gap: 14px; padding: 16px 18px 78px; }
.lk-hud::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(rgba(0,240,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,.045) 1px, transparent 1px);
  background-size: 40px 40px; mask-image: radial-gradient(ellipse at center, #000 30%, transparent 85%); }
.lk-hud::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 140px; pointer-events: none; z-index: 30;
  background: linear-gradient(transparent, rgba(0,240,255,.05) 70%, rgba(0,240,255,.12) 98%, transparent);
  animation: hud-sweep 7s linear infinite; }
@keyframes hud-sweep { from { transform: translateY(-160px); } to { transform: translateY(100vh); } }
@media (prefers-reduced-motion: reduce) { .lk-hud::after { display: none; } }
.lk-hud .scanl { position: absolute; inset: 0; pointer-events: none; z-index: 29; background: repeating-linear-gradient(transparent 0 2px, rgba(0,0,0,.18) 2px 3px); opacity: .5; }

/* Clipped neon panels */
.lk-hud .hp { --cut: 16px; position: relative; padding: 1px; min-height: 0; min-width: 0;
  background: linear-gradient(140deg, color-mix(in srgb, var(--pc, var(--cya)) 80%, transparent), rgba(0,240,255,.12) 40%, rgba(255,43,214,.35));
  clip-path: polygon(0 0, calc(100% - var(--cut)) 0, 100% var(--cut), 100% 100%, var(--cut) 100%, 0 calc(100% - var(--cut))); }
.lk-hud .hb { height: 100%; background: linear-gradient(180deg, rgba(10,13,24,.96), rgba(6,7,12,.97));
  clip-path: polygon(0 0, calc(100% - var(--cut) + .5px) 0, 100% calc(var(--cut) - .5px), 100% 100%, calc(var(--cut) - .5px) 100%, 0 calc(100% - var(--cut) + .5px));
  display: flex; flex-direction: column; min-height: 0; }
.lk-hud .ph { display: flex; align-items: center; gap: 10px; padding: 12px 16px 10px; border-bottom: 1px solid rgba(0,240,255,.14); }
.lk-hud .ph h3 { margin: 0; font: 700 12px var(--display); letter-spacing: .18em; text-transform: uppercase; color: var(--pc, var(--cya)); white-space: nowrap; }
.lk-hud .ph .sub { margin-left: auto; font-size: 11px; color: #6f86a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-hud .ph::before { content: ""; width: 6px; height: 6px; background: var(--pc, var(--cya)); box-shadow: 0 0 8px var(--pc, var(--cya)); flex: none; }

/* Top bar */
.lk-hud .top { display: flex; align-items: stretch; gap: 14px; position: relative; z-index: 2; }
.lk-hud .brand { display: flex; flex-direction: column; justify-content: center; padding: 0 6px; min-width: 0; }
.lk-hud .brand b { font: 900 22px var(--display); letter-spacing: .14em; color: #fff; text-shadow: 0 0 12px rgba(0,240,255,.6); white-space: nowrap; }
.lk-hud .brand b i { font-style: normal; color: var(--mag); text-shadow: 0 0 12px rgba(255,43,214,.7); }
.lk-hud .brand small { color: #6f86a0; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; white-space: nowrap; }
.lk-hud .ctrs { flex: 1; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; min-width: 0; }
.lk-hud .ctr { --cut: 12px; }
.lk-hud .ctr .hb { padding: 10px 14px; justify-content: center; }
.lk-hud .ctr span { font-size: 10.5px; letter-spacing: .2em; text-transform: uppercase; color: #6f86a0; }
.lk-hud .ctr b { font: 700 30px var(--display); color: var(--pc); text-shadow: 0 0 14px color-mix(in srgb, var(--pc) 60%, transparent); line-height: 1.1; font-variant-numeric: tabular-nums; white-space: nowrap; }
.lk-hud .live { --cut: 12px; --pc: var(--mag); width: 150px; flex: none; }
.lk-hud .live .hb { align-items: center; justify-content: center; gap: 4px; padding: 8px 10px; text-align: center; }
.lk-hud .live b { font: 900 18px var(--display); letter-spacing: .25em; color: var(--mag); display: flex; align-items: center; gap: 8px; }
.lk-hud .live b::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: var(--mag); box-shadow: 0 0 10px var(--mag); animation: blink 1.1s ease-in-out infinite; }
.lk-hud .live.off b { color: #6f86a0; } .lk-hud .live.off b::before { background: #3a4558; box-shadow: none; animation: none; }
.lk-hud .live small { font-size: 10.5px; color: #8aa0b8; line-height: 1.3; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Main grid */
.lk-hud .main { display: grid; grid-template-columns: minmax(200px, 300px) minmax(0, 1fr) minmax(260px, 400px); gap: 16px; min-height: 0; position: relative; z-index: 2; }

/* Projects */
.lk-hud .projs { --pc: var(--yel); }
.lk-hud .plist { flex: 1; padding: 8px 10px 12px; display: flex; flex-direction: column; gap: 2px; }
.lk-hud .pr { display: grid; grid-template-columns: 1fr auto; gap: 2px 10px; padding: 7px 8px; text-align: left; position: relative; border-left: 2px solid transparent; transition: background .2s, border-color .2s; }
.lk-hud .pr:hover { background: rgba(252,238,10,.05); }
.lk-hud .pr.on { background: rgba(252,238,10,.09); border-left-color: var(--yel); }
.lk-hud .pr .nm { font-size: 12.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #dfe9f3; }
.lk-hud .pr .ct { font-size: 12px; color: var(--yel); font-weight: 700; }
.lk-hud .pr .bar { grid-column: 1 / -1; height: 4px; background: rgba(255,255,255,.05); position: relative; overflow: hidden; }
.lk-hud .pr .bar i { position: absolute; inset: 0 auto 0 0; width: var(--w); background: linear-gradient(90deg, var(--yel), color-mix(in srgb, var(--yel) 40%, var(--mag)));
  box-shadow: 0 0 8px rgba(252,238,10,.6); transform-origin: left; animation: hud-bar 1.1s var(--spring-soft) both; animation-delay: calc(var(--i) * 40ms + 200ms); }
@keyframes hud-bar { from { transform: scaleX(0); } }
.lk-hud .pr .mt { grid-column: 1 / -1; font-size: 10.5px; color: #5f7590; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-hud .pr.all .nm { color: var(--yel); letter-spacing: .08em; text-transform: uppercase; font-size: 11px; }

/* Heatmap */
.lk-hud .heat { --pc: var(--cya); }
.lk-hud .hm { flex: 1; min-height: 0; padding: 14px 18px 8px; display: grid; grid-template-columns: 62px repeat(7, minmax(0, 1fr)); grid-template-rows: 20px; grid-auto-rows: minmax(0, 1fr); gap: 7px; }
.lk-hud .hm .wh { font-size: 11px; color: #6f86a0; text-align: center; letter-spacing: .14em; align-self: end; }
.lk-hud .hm .wl { font-size: 10.5px; color: #6f86a0; align-self: center; line-height: 1.25; }
.lk-hud .hm .wl b { display: block; color: #9fb5cc; font-size: 11.5px; }
.lk-hud .cell { --t: 0; position: relative; min-height: 0; border: 1px solid rgba(0,240,255, calc(.12 + var(--t) * .5));
  background: color-mix(in srgb, var(--cya) calc(var(--t) * 72%), #070a12);
  box-shadow: 0 0 calc(var(--t) * 22px) rgba(0,240,255, calc(var(--t) * .55)), inset 0 0 calc(var(--t) * 14px) rgba(255,255,255, calc(var(--t) * .25));
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
  display: grid; place-items: center; transition: transform .35s var(--spring), outline-color .2s; animation: hud-cell .6s var(--spring) both; animation-delay: calc(var(--i) * 12ms); }
@keyframes hud-cell { from { opacity: 0; transform: scale(.6); } }
.lk-hud .cell.zero { cursor: default; background: repeating-linear-gradient(135deg, rgba(255,255,255,.015) 0 4px, transparent 4px 8px), #06080e; }
.lk-hud .cell.fut { opacity: .25; border-style: dashed; }
.lk-hud .cell:not(.zero):hover { transform: scale(1.06); z-index: 2; }
.lk-hud .cell b { font: 700 clamp(12px, 1.4vw, 18px) var(--display); color: color-mix(in srgb, var(--cya) 70%, white); }
.lk-hud .cell.hot b { color: #031015; text-shadow: none; }
.lk-hud .cell .sd { position: absolute; left: 6px; bottom: 5px; display: flex; gap: 3px; }
.lk-hud .cell .sd i { width: 5px; height: 5px; background: var(--mag); box-shadow: 0 0 5px var(--mag); transform: rotate(45deg); }
.lk-hud .cell.hot .sd i { background: #2a0726; box-shadow: none; }
.lk-hud .cell .dn { position: absolute; right: 12px; top: 3px; font-size: 9.5px; color: rgba(160,200,220,.5); }
.lk-hud .cell.hot .dn { color: rgba(0,20,26,.6); }
.lk-hud .cell.today::after { content: ""; position: absolute; left: 0; top: 0; width: 10px; height: 10px; background: var(--yel); clip-path: polygon(0 0, 100% 0, 0 100%); }
.lk-hud .cell.sel { border: 2px solid var(--mag); box-shadow: 0 0 0 1px var(--mag), 0 0 26px rgba(255,43,214,.7); z-index: 3; }
.lk-hud .legend { display: flex; align-items: center; gap: 6px; font-size: 10.5px; color: #6f86a0; padding: 2px 18px 0; }
.lk-hud .legend i { width: 14px; height: 10px; display: inline-block; background: color-mix(in srgb, var(--cya) calc(var(--t) * 72%), #070a12); border: 1px solid rgba(0,240,255,.25); }
.lk-hud .legend .sp { margin-left: auto; }
/* Hour profile of selected day */
.lk-hud .hours { padding: 8px 18px 14px; }
.lk-hud .hours .hl { display: flex; justify-content: space-between; font-size: 11px; color: #8aa0b8; margin-bottom: 6px; gap: 10px; }
.lk-hud .hours .hl b { color: var(--mag); font-family: var(--display); font-size: 12px; letter-spacing: .08em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-hud .hbars { height: 46px; display: grid; grid-template-columns: repeat(24, 1fr); gap: 3px; align-items: end; }
.lk-hud .hbars i { display: block; background: linear-gradient(var(--mag), rgba(255,43,214,.25)); box-shadow: 0 0 8px rgba(255,43,214,.45); min-height: 2px; transform-origin: bottom; animation: hud-hb .7s var(--spring) both; animation-delay: calc(var(--i) * 18ms); }
.lk-hud .hbars i.z { background: rgba(255,255,255,.07); box-shadow: none; }
@keyframes hud-hb { from { transform: scaleY(0); } }
.lk-hud .hax { display: grid; grid-template-columns: repeat(4, 1fr); font-size: 9.5px; color: #4f6580; margin-top: 3px; }

/* Day sessions */
.lk-hud .days { --pc: var(--mag); }
.lk-hud .dlist { flex: 1; padding: 10px 10px 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.lk-hud .sr { --cut: 10px; position: relative; text-align: left; display: grid; grid-template-columns: 4px minmax(0, 1fr) auto; gap: 4px 10px; padding: 10px 12px 10px 0;
  background: linear-gradient(90deg, rgba(255,43,214,.08), rgba(0,240,255,.03)); border: 1px solid rgba(255,43,214,.22);
  clip-path: polygon(0 0, calc(100% - var(--cut)) 0, 100% var(--cut), 100% 100%, 0 100%); transition: background .2s, transform .35s var(--spring); }
.lk-hud .sr:hover { background: linear-gradient(90deg, rgba(255,43,214,.2), rgba(0,240,255,.07)); transform: translateX(-3px); }
.lk-hud .sr .hu { grid-row: 1 / span 2; background: hsl(var(--h) 80% 62%); box-shadow: 0 0 10px hsl(var(--h) 80% 62%); }
.lk-hud .sr .tt { font: 700 13px var(--sans); color: #f2f6ff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 7px; }
.lk-hud .sr .tt span { overflow: hidden; text-overflow: ellipsis; }
.lk-hud .sr .st { grid-row: 1 / span 2; grid-column: 3; text-align: right; align-self: center; }
.lk-hud .sr .st b { display: block; font: 700 18px var(--display); color: var(--cya); line-height: 1; }
.lk-hud .sr .st small { font-size: 9.5px; color: #6f86a0; letter-spacing: .12em; }
.lk-hud .sr .mt { font-size: 11px; color: #7d93ab; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-hud .sr .mt em { font-style: normal; color: var(--yel); }
.lk-hud .dfoot { padding: 9px 16px 12px; border-top: 1px solid rgba(255,43,214,.15); font-size: 10.5px; color: #6f86a0; letter-spacing: .06em; }
.lk-hud .empty { color: #6f86a0; font-size: 12px; padding: 20px 6px; text-align: center; }

/* Connector overlay */
.lk-hud svg.links { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; overflow: visible; }
.lk-hud svg.links path { fill: none; stroke: url(#hudlg); stroke-width: 1.4; filter: drop-shadow(0 0 4px rgba(255,43,214,.8)); }
.lk-hud svg.links circle { fill: #fff; filter: drop-shadow(0 0 4px var(--mag)); }

@media (max-width: 1150px) {
  .lk-hud { padding: 12px 12px 76px; gap: 10px; }
  .lk-hud .brand { display: none; }
  .lk-hud .ctr b { font-size: 22px; }
  .lk-hud .live { width: 112px; }
  .lk-hud .main { grid-template-columns: 200px minmax(0, 1fr) 280px; gap: 10px; }
  .lk-hud .hm { grid-template-columns: 44px repeat(7, minmax(0, 1fr)); padding: 10px 10px 6px; gap: 5px; }
  .lk-hud .hm .wl span { display: none; }
  .lk-hud .cell .dn { display: none; }
  .lk-hud .projs .ph .sub { display: none; }
  .lk-hud .hours { padding: 6px 10px 10px; } .lk-hud .hbars { height: 32px; }
  .lk-hud .legend { padding: 0 10px; }
}
@media (max-height: 760px) { .lk-hud .hbars { height: 28px; } .lk-hud .ctr b { font-size: 22px; } }
`;

  function render(root, A) {
    const D = A.DATA;
    const sById = Object.fromEntries(D.sessions.map((s) => [s.id, s]));
    // Index: day -> sessionId -> {steps, first, last, hours[24]}
    const byDay = new Map();
    for (const s of D.sessions) for (const n of s.nodes) {
      const k = dk(n.ts); if (!byDay.has(k)) byDay.set(k, new Map());
      const m = byDay.get(k); if (!m.has(s.id)) m.set(s.id, { s, steps: 0, first: n.ts, last: n.ts, hours: new Array(24).fill(0) });
      const e = m.get(s.id); e.steps++; if (n.ts < e.first) e.first = n.ts; if (n.ts > e.last) e.last = n.ts; e.hours[new Date(n.ts).getHours()]++;
    }
    const st = { proj: null, day: null };
    const entries = (k) => [...(byDay.get(k)?.values() || [])].filter((e) => !st.proj || e.s.project === st.proj).sort((a, b) => b.last.localeCompare(a.last));
    const daySteps = (k) => entries(k).reduce((n, e) => n + e.steps, 0);
    const latestDay = () => { const ks = [...byDay.keys()].sort().reverse(); return ks.find((k) => entries(k).length) || ks[0]; };

    // Week rows: newest week on top, cover all data but cap at 8 rows
    const allKeys = [...byDay.keys()].sort();
    const monday = (d) => { d = new Date(d); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; };
    const lastMon = monday(new Date(Math.max(Date.now(), Date.parse(D.generatedAt))));
    const firstMon = monday(allKeys[0] ? allKeys[0] + "T12:00:00" : Date.now());
    const nWeeks = Math.max(5, Math.min(8, Math.round((lastMon - firstMon) / 6048e5) + 1));
    const weeks = Array.from({ length: nWeeks }, (_, i) => { const m = new Date(lastMon); m.setDate(m.getDate() - 7 * i); return m; });
    const todayK = dk(Date.now());
    const kw = (d) => { const t = new Date(d); t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7)); const y = new Date(t.getFullYear(), 0, 4); return 1 + Math.round(((t - y) / 864e5 - 3 + ((y.getDay() + 6) % 7)) / 7); };

    const anyLive = D.sessions.filter((s) => s.live);
    const projs = D.projects.slice().sort((a, b) => b.sessions.length - a.sessions.length || b.steps - a.steps);
    const maxP = Math.max(...projs.map((p) => p.sessions.length));

    root.innerHTML = `<div class="scanl"></div>
      <div class="top">
        <div class="brand"><b>SESSION<i>//</i>ATLAS</b><small>Neural activity monitor</small></div>
        <div class="ctrs">
          ${[["Sessions", D.totals.sessions, CYA, 0], ["Schritte", D.totals.steps, MAG, 0], ["Agents", D.totals.agents, YEL, 0], ["Kosten", D.totals.cost, CYA, 1]]
            .map(([l, v, c, $], i) => `<div class="hp ctr in" style="--pc:${c};--i:${i}"><div class="hb"><span>${l}</span><b data-ctr="${v}" data-usd="${$}">0</b></div></div>`).join("")}
        </div>
        <div class="hp live in ${anyLive.length ? "" : "off"}" style="--i:4"><div class="hb"><b>${anyLive.length ? "LIVE" : "IDLE"}</b>
          <small>${anyLive.length ? `${anyLive.length} Session${anyLive.length > 1 ? "s" : ""} aktiv` : "zuletzt aktiv<br>" + A.esc(A.rel(D.sessions[0].end))}</small></div></div>
      </div>
      <div class="main">
        <section class="hp projs in" style="--i:2"><div class="hb"><div class="ph"><h3>Projekte</h3><span class="sub">${D.projects.length} gesamt</span></div><div class="plist scroll"></div></div></section>
        <section class="hp heat in" style="--i:3"><div class="hb"><div class="ph"><h3>Aktivität</h3><span class="sub" data-hsub></span></div>
          <div class="hm"></div>
          <div class="legend">weniger ${[0, .25, .5, .75, 1].map((t) => `<i style="--t:${t}"></i>`).join("")} mehr<span class="sp">Zahl = Schritte · <i style="width:6px;height:6px;background:var(--mag);border:0;transform:rotate(45deg)"></i> = Session</span></div>
          <div class="hours"></div></div></section>
        <section class="hp days in" style="--i:4"><div class="hb"><div class="ph"><h3>Sessions an diesem Tag</h3><span class="sub" data-dsub></span></div><div class="dlist scroll"></div><div class="dfoot">Zeile anklicken: Verlauf und Schritte öffnen</div></div></section>
      </div>
      <svg class="links"><defs><linearGradient id="hudlg" gradientUnits="userSpaceOnUse" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${MAG}"/><stop offset="1" stop-color="${CYA}"/></linearGradient></defs><g></g></svg>`;

    const $ = (q) => root.querySelector(q);
    const plist = $(".plist"), hm = $(".hm"), dlist = $(".dlist"), hours = $(".hours"), svg = $("svg.links"), lg = svg.querySelector("g");

    // Animated counters
    let raf = 0; const t0 = performance.now();
    const ctrs = [...root.querySelectorAll("[data-ctr]")];
    const fmtC = (el, v) => el.dataset.usd === "1" ? `$${Math.round(v).toLocaleString("de-DE")}` : Math.round(v).toLocaleString("de-DE");
    const tick = (now) => { const p = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - p, 4);
      ctrs.forEach((el) => (el.textContent = fmtC(el, +el.dataset.ctr * e))); if (p < 1) raf = requestAnimationFrame(tick); };
    if (reduced()) ctrs.forEach((el) => (el.textContent = fmtC(el, +el.dataset.ctr))); else raf = requestAnimationFrame(tick);
    A.onCleanup(() => cancelAnimationFrame(raf));

    function renderProjects() {
      plist.innerHTML = `<button class="pr all ${st.proj ? "" : "on"}" data-proj=""><span class="nm">Alle Projekte</span><span class="ct">${D.totals.sessions}</span></button>` +
        projs.map((p, i) => `<button class="pr ${st.proj === p.path ? "on" : ""}" data-proj="${A.esc(p.path)}" title="${A.esc(A.short(p.path))}">
          <span class="nm">${A.esc(p.name)}</span><span class="ct">${p.sessions.length}</span>
          <span class="bar"><i style="--w:${(p.sessions.length / maxP) * 100}%;--i:${i}"></i></span>
          <span class="mt">${p.steps} Schritte · ${A.esc(A.rel(p.last))}</span></button>`).join("");
    }
    function renderHeat() {
      const vals = []; for (const w of weeks) for (let d = 0; d < 7; d++) { const x = new Date(w); x.setDate(x.getDate() + d); vals.push(daySteps(dk(x))); }
      const max = Math.max(1, ...vals);
      let html = `<span></span>` + WD.map((d) => `<span class="wh">${d}</span>`).join(""), idx = 0;
      weeks.forEach((w, wi) => {
        html += `<span class="wl"><b>KW ${kw(w)}</b><span>${w.getDate()}.${w.getMonth() + 1}.</span></span>`;
        for (let d = 0; d < 7; d++) {
          const x = new Date(w); x.setDate(x.getDate() + d); const k = dk(x), v = vals[wi * 7 + d], es = entries(k);
          const t = v ? 0.18 + 0.82 * (Math.log(1 + v) / Math.log(1 + max)) : 0;
          html += `<button class="cell ${v ? "" : "zero"} ${k > todayK ? "fut" : ""} ${t > .6 ? "hot" : ""} ${k === todayK ? "today" : ""} ${k === st.day ? "sel" : ""}" data-day="${k}" style="--t:${t.toFixed(3)};--i:${idx++}"
            title="${A.esc(A.day(x))} · ${v} Schritte · ${es.length} Sessions">${v ? `<b>${v}</b><span class="sd">${"<i></i>".repeat(Math.min(5, es.length))}</span>` : ""}<span class="dn">${x.getDate()}</span></button>`;
        }
      });
      hm.style.gridTemplateRows = `20px repeat(${weeks.length}, minmax(0, 1fr))`;
      hm.innerHTML = html;
      const tot = vals.reduce((a, b) => a + b, 0), active = vals.filter(Boolean).length;
      $("[data-hsub]").textContent = `${active} aktive Tage · ${tot} Schritte`;
    }
    function renderDay() {
      const es = entries(st.day), x = new Date(st.day + "T12:00:00");
      const h = new Array(24).fill(0); es.forEach((e) => e.hours.forEach((v, i) => (h[i] += v)));
      const mh = Math.max(1, ...h);
      hours.innerHTML = `<div class="hl"><b>${A.esc(A.day(x)).toUpperCase()}</b><span>Schritte pro Stunde</span></div>
        <div class="hbars">${h.map((v, i) => `<i class="${v ? "" : "z"}" style="height:${v ? 8 + (v / mh) * 92 : 4}%;--i:${i}" title="${pad(i)}:00 · ${v} Schritte"></i>`).join("")}</div>
        <div class="hax"><span>00</span><span>06</span><span>12</span><span>18</span></div>`;
      $("[data-dsub]").textContent = `${es.length} ${es.length === 1 ? "Session" : "Sessions"}`;
      dlist.innerHTML = es.length ? es.map((e, i) => `<button class="sr in" style="--h:${e.s.hue};--i:${i}" data-open="${e.s.id}" data-sid="${e.s.id}">
          <span class="hu"></span>
          <span class="tt">${e.s.live ? `<span class="dot live"></span>` : ""}<span>${A.esc(e.s.label)}</span></span>
          <span class="st"><b>${e.steps}</b><small>SCHR.</small></span>
          <span class="mt"><em>${A.esc(e.s.projName)}</em> · ${A.hhmm(e.first)}-${A.hhmm(e.last)}${e.s.agents.length ? ` · ${e.s.agents.length} Agents` : ""}</span>
        </button>`).join("") : `<div class="empty">Keine Sessions an diesem Tag.</div>`;
      setTimeout(() => drawLinks(true), 30);
    }

    // Connector lines from selected cell to visible session rows
    function drawLinks(animate) {
      const rr = root.getBoundingClientRect(), cell = hm.querySelector(".cell.sel");
      if (!cell) { lg.innerHTML = ""; return; }
      const c = cell.getBoundingClientRect(), lr = dlist.getBoundingClientRect();
      const x0 = c.right - rr.left, y0 = c.top + c.height / 2 - rr.top;
      const lgd = svg.querySelector("#hudlg"); lgd.setAttribute("x1", x0); lgd.setAttribute("x2", lr.left - rr.left);
      const rows = [...dlist.querySelectorAll(".sr")];
      let html = "";
      rows.forEach((r, i) => {
        const b = r.getBoundingClientRect(), y = b.top + b.height / 2;
        if (y < lr.top + 6 || y > lr.bottom - 6) return;
        const x1 = b.left - rr.left - 2, y1 = y - rr.top, mx = (x0 + x1) / 2;
        html += `<path id="hl${i}" d="M${x0},${y0} C${mx},${y0} ${mx},${y1} ${x1},${y1}" style="opacity:${Math.max(.35, 1 - i * .08)}"/>`;
        if (!reduced()) html += `<circle r="2"><animateMotion dur="${2.2 + i * .2}s" repeatCount="indefinite" begin="${.6 + i * .12}s"><mpath href="#hl${i}"/></animateMotion></circle>`;
      });
      html += `<circle cx="${x0}" cy="${y0}" r="3.5" style="fill:${MAG}"/>`;
      lg.innerHTML = html;
      if (animate && !reduced()) lg.querySelectorAll("path").forEach((p, i) => {
        const L = p.getTotalLength(); p.style.strokeDasharray = L;
        p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 800, delay: 120 + i * 50, easing: "cubic-bezier(.6,0,.2,1)", fill: "backwards" });
      });
    }

    function select(k) { st.day = k; hm.querySelectorAll(".cell.sel").forEach((c) => c.classList.remove("sel")); hm.querySelector(`[data-day="${k}"]`)?.classList.add("sel"); renderDay(); }
    root.addEventListener("click", (e) => {
      const p = e.target.closest("[data-proj]");
      if (p) { st.proj = p.dataset.proj || null; if (!entries(st.day).length) st.day = latestDay(); renderProjects(); renderHeat(); renderDay(); return; }
      const c = e.target.closest(".cell"); if (c && !c.classList.contains("zero")) select(c.dataset.day);
    });
    const onScroll = () => drawLinks(false);
    dlist.addEventListener("scroll", onScroll, { passive: true });
    let rt; const onResize = () => { clearTimeout(rt); rt = setTimeout(() => drawLinks(false), 60); };
    addEventListener("resize", onResize);
    A.onCleanup(() => { removeEventListener("resize", onResize); clearTimeout(rt); });

    st.day = latestDay();
    renderProjects(); renderHeat(); renderDay();
    // Redraw once panel entrance animations settle
    let at; root.addEventListener("animationend", (e) => { if (!e.target.classList.contains("in")) return; clearTimeout(at); at = setTimeout(() => drawLinks(true), 40); });
    const t2 = setTimeout(() => drawLinks(false), 1500);
    A.onCleanup(() => { clearTimeout(at); clearTimeout(t2); });
  }

  Atlas.register({ key: "hud", name: "Cyberpunk HUD", tagline: "Aktivitaet als Heatmap", css, render, wantsArrows: false,
    onSelect(id) { document.querySelectorAll(".lk-hud .sr").forEach((r) => (r.style.outline = r.dataset.sid === id ? "1px solid #ff2bd6" : "")); } });
})();
