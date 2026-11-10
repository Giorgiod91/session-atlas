// Look: Retro-Terminal. A phosphor CRT monitor running a tmux-like layout:
// projects tree, sessions with ASCII step bars, numbered steps, and a bottom
// pane with an ASCII activity chart plus the subagent tree. Keyboard first.
(function () {
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  const dk = (d) => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  const css = `
.lk-crt { --ph: #ffb000; --ph-hi: #ffd27a; --ph-dim: rgba(255,176,0,.42); --ph-low: rgba(255,176,0,.16); --ph-bg: #120b02;
  background: radial-gradient(1200px 700px at 50% 30%, #2a2622, #121110 70%), #121110; overflow: hidden; font-family: var(--mono); }
.lk-crt.green { --ph: #39ff7a; --ph-hi: #b6ffcf; --ph-dim: rgba(57,255,122,.42); --ph-low: rgba(57,255,122,.15); --ph-bg: #03100a; }
/* Monitor bezel */
.lk-crt .cr-bezel { position: absolute; left: 14px; right: 14px; top: 12px; bottom: 74px; border-radius: 34px; padding: 22px;
  background: linear-gradient(160deg, #3b3832, #23211d 45%, #191714); box-shadow: 0 1px 0 rgba(255,255,255,.12) inset, 0 -2px 0 rgba(0,0,0,.5) inset, 0 30px 60px rgba(0,0,0,.6); }
.lk-crt .cr-brand { position: absolute; left: 34px; bottom: 3px; font: 400 15px "VT323", monospace; letter-spacing: .3em; color: #8b8478; }
.lk-crt .cr-led { position: absolute; right: 38px; bottom: 7px; width: 7px; height: 7px; border-radius: 50%; background: var(--ph); box-shadow: 0 0 8px var(--ph); }
/* The glass: curvature via radius + inner vignette */
.lk-crt .cr-screen { position: relative; height: 100%; border-radius: 30px / 38px; overflow: hidden; background: radial-gradient(ellipse at 50% 45%, color-mix(in srgb, var(--ph) 9%, var(--ph-bg)), var(--ph-bg) 75%, #000);
  box-shadow: 0 0 0 3px #0b0a09, 0 0 0 5px #4a463e; color: var(--ph); }
.lk-crt .cr-screen::before { content: ""; position: absolute; inset: 0; z-index: 20; pointer-events: none; border-radius: inherit;
  background: repeating-linear-gradient(180deg, rgba(0,0,0,.26) 0 1px, transparent 1px 3px);
  box-shadow: inset 0 0 90px 10px rgba(0,0,0,.85), inset 0 0 16px 4px rgba(0,0,0,.9); }
.lk-crt .cr-screen::after { content: ""; position: absolute; inset: 0; z-index: 21; pointer-events: none; border-radius: inherit;
  background: radial-gradient(ellipse 70% 40% at 30% 8%, rgba(255,255,255,.06), transparent 70%); animation: cr-flick 5s steps(1) infinite; }
@keyframes cr-flick { 0%,100% { opacity: 1; } 41% { opacity: .55; } 42% { opacity: 1; } 77% { opacity: .8; } 78% { opacity: 1; } }
.lk-crt .cr-glow { position: absolute; inset: 0; z-index: 19; pointer-events: none; background: color-mix(in srgb, var(--ph) 4%, transparent); animation: cr-pulse 0.11s steps(2) infinite; }
@keyframes cr-pulse { 50% { opacity: .55; } }
.lk-crt .cr-roll { position: absolute; left: 0; right: 0; height: 120px; z-index: 22; pointer-events: none; background: linear-gradient(transparent, color-mix(in srgb, var(--ph) 5%, transparent), transparent); animation: cr-roll 9s linear infinite; }
@keyframes cr-roll { from { top: -130px; } to { top: 100%; } }
@media (prefers-reduced-motion: reduce) { .lk-crt .cr-screen::after, .lk-crt .cr-glow, .lk-crt .cr-roll { animation: none; } .lk-crt .cr-roll { display: none; } }

.lk-crt .cr-in { position: absolute; inset: 0; padding: 16px 26px 12px; display: grid; grid-template-rows: auto minmax(0, 1fr) minmax(130px, 32%) auto; gap: 8px; text-shadow: 0 0 5px color-mix(in srgb, var(--ph) 55%, transparent); }
.lk-crt .cr-head { display: flex; align-items: flex-end; gap: 18px; min-width: 0; }
.lk-crt .cr-head h1 { margin: 0; font: 400 40px/0.9 "VT323", monospace; letter-spacing: .06em; color: var(--ph-hi); white-space: nowrap;
  text-shadow: 0 0 6px var(--ph), 0 0 22px color-mix(in srgb, var(--ph) 50%, transparent); }
.lk-crt .cr-head .cur { display: inline-block; width: .5em; height: .8em; background: var(--ph-hi); margin-left: 6px; vertical-align: -2px; animation: blink 1s steps(1) infinite; box-shadow: 0 0 10px var(--ph); }
.lk-crt .cr-hint { margin-left: auto; font-size: 11.5px; color: var(--ph-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.lk-crt .cr-hint b { color: var(--ph); font-weight: 700; }
.lk-crt .cr-top { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr) minmax(0, 1.5fr); gap: 8px; min-height: 0; }
.lk-crt .cr-bot { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 8px; min-height: 0; }
/* tmux-like panes */
.lk-crt .pn { position: relative; border: 1px solid var(--ph-dim); min-height: 0; min-width: 0; display: flex; flex-direction: column; padding: 12px 4px 6px; }
.lk-crt .pn.on { border-color: var(--ph); box-shadow: 0 0 12px color-mix(in srgb, var(--ph) 35%, transparent), inset 0 0 14px color-mix(in srgb, var(--ph) 12%, transparent); }
.lk-crt .pn > .t { position: absolute; top: -9px; left: 10px; padding: 0 6px; background: var(--ph-bg); font: 400 18px/18px "VT323", monospace; letter-spacing: .08em; color: var(--ph-dim); white-space: nowrap; max-width: calc(100% - 20px); overflow: hidden; text-overflow: ellipsis; }
.lk-crt .pn.on > .t { color: var(--ph-hi); }
.lk-crt .pn > .t i { font-style: normal; opacity: .7; }
.lk-crt .ls { flex: 1; overflow: auto; scrollbar-width: none; min-height: 0; }
.lk-crt .ls::-webkit-scrollbar { display: none; }
.lk-crt .r { display: flex; gap: 8px; align-items: baseline; padding: 1px 8px; font-size: 12.5px; line-height: 19px; white-space: pre; cursor: pointer; min-width: 0; }
.lk-crt .r .x { overflow: hidden; text-overflow: ellipsis; min-width: 0; flex: 1; }
.lk-crt .r .d { color: var(--ph-dim); flex: none; }
.lk-crt .r .g { color: var(--ph-dim); flex: none; }
.lk-crt .r:hover { background: var(--ph-low); }
.lk-crt .r.sel { background: color-mix(in srgb, var(--ph) 28%, transparent); }
.lk-crt .pn.on .r.sel { background: var(--ph); color: var(--ph-bg); text-shadow: none; }
.lk-crt .pn.on .r.sel .d, .lk-crt .pn.on .r.sel .g { color: color-mix(in srgb, var(--ph-bg) 75%, var(--ph)); }
.lk-crt .r.off { opacity: .55; }
.lk-crt .r .lv { color: var(--ph-hi); animation: blink 1s steps(1) infinite; }
.lk-crt .ttl { padding: 0 8px 4px; font-size: 11.5px; color: var(--ph-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-crt .empty { padding: 6px 10px; color: var(--ph-dim); font-size: 12.5px; }
.lk-crt pre { margin: 0; padding: 2px 10px; font: 500 12px/15px var(--mono); white-space: pre; overflow: hidden; }
.lk-crt pre .hi { color: var(--ph-hi); } .lk-crt pre .lo { color: var(--ph-dim); }
.lk-crt .tree { overflow: auto; scrollbar-width: none; flex: 1; }
.lk-crt .tree .ag { cursor: pointer; } .lk-crt .tree .ag:hover { background: var(--ph-low); }
/* Statusline */
.lk-crt .cr-stat { display: flex; align-items: center; height: 22px; font-size: 12px; background: color-mix(in srgb, var(--ph) 18%, transparent); white-space: nowrap; overflow: hidden; min-width: 0; }
.lk-crt .cr-stat > span { padding: 0 10px; height: 100%; display: flex; align-items: center; }
.lk-crt .cr-stat .s0 { background: var(--ph); color: var(--ph-bg); font-weight: 800; text-shadow: none; }
.lk-crt .cr-stat .w { color: var(--ph-dim); cursor: pointer; } .lk-crt .cr-stat .w.on { color: var(--ph-hi); font-weight: 700; }
.lk-crt .cr-stat .fl { flex: 1; min-width: 0; overflow: hidden; }
.lk-crt .cr-stat .fl input { all: unset; width: 100%; color: var(--ph-hi); caret-color: var(--ph-hi); font: 600 12px var(--mono); }
.lk-crt .cr-stat .rt { color: var(--ph-dim); }
/* Boot sequence */
.lk-crt .cr-boot { position: absolute; inset: 0; z-index: 18; background: var(--ph-bg); padding: 34px 40px; font: 400 22px/1.25 "VT323", monospace; color: var(--ph); cursor: pointer; transition: opacity .25s; text-shadow: 0 0 6px var(--ph); }
.lk-crt .cr-boot.gone { opacity: 0; pointer-events: none; }
.lk-crt .cr-boot small { display: block; margin-top: 18px; font-size: 16px; color: var(--ph-dim); }
`;

  function render(root, A) {
    const D = A.DATA;
    root.innerHTML = `<div class="cr-bezel"><div class="cr-screen"><div class="cr-in">
        <div class="cr-head"><h1>SESSION ATLAS<span class="cur"></span></h1>
          <div class="cr-hint"><b>j/k</b> bewegen · <b>h/l</b> Fenster · <b>Enter</b> oeffnen · <b>/</b> filtern · <b>G</b> Phosphor <span data-ph>bernstein</span></div></div>
        <div class="cr-top">
          <section class="pn" data-pane="0"><div class="t">0:projects</div><div class="ls" data-l="0"></div></section>
          <section class="pn" data-pane="1"><div class="t">1:sessions</div><div class="ttl" data-t="1"></div><div class="ls" data-l="1"></div></section>
          <section class="pn" data-pane="2"><div class="t">2:steps</div><div class="ttl" data-t="2"></div><div class="ls" data-l="2"></div></section>
        </div>
        <div class="cr-bot">
          <section class="pn"><div class="t">3:aktivitaet <i>(Schritte/Tag, 21 Tage)</i></div><pre data-chart></pre></section>
          <section class="pn"><div class="t">4:agents</div><div class="tree" data-tree></div></section>
        </div>
        <div class="cr-stat"></div>
      </div><div class="cr-glow"></div><div class="cr-roll"></div><div class="cr-boot"></div></div>
      <div class="cr-brand">ATLAS-80 · PHOSPHOR</div><div class="cr-led"></div></div>`;
    const $ = (s) => root.querySelector(s);
    const st = { pane: 1, p: 0, s: 0, k: 0, filter: "", filtering: false, open: null };
    try { if (localStorage.getItem("atlas-crt-ph") === "green") root.classList.add("green"); } catch {}

    const match = (s) => !st.filter || (s.label + " " + s.projName + " " + s.about).toLowerCase().includes(st.filter.toLowerCase());
    const projs = () => D.projects.map((p) => ({ p, ss: p.sessions.filter(match) })).filter((x) => x.ss.length);
    const cur = () => {
      const ps = projs(); st.p = Math.min(st.p, Math.max(0, ps.length - 1));
      const P = ps[st.p]; const ss = P ? P.ss : []; st.s = Math.min(st.s, Math.max(0, ss.length - 1));
      const S = ss[st.s]; const ks = S ? S.nodes : []; st.k = Math.min(st.k, Math.max(0, ks.length - 1));
      return { ps, P, ss, S, ks };
    };

    function bar(n, max) { const f = Math.max(1, Math.round((n / max) * 10)); return "[" + "#".repeat(f) + ".".repeat(10 - f) + "]"; }

    function draw(scroll) {
      const { ps, P, ss, S, ks } = cur();
      root.querySelectorAll(".pn[data-pane]").forEach((el) => el.classList.toggle("on", +el.dataset.pane === st.pane));
      // Projects tree
      $("[data-l='0']").innerHTML = ps.length ? `<div class="r off"><span class="x">~/</span></div>` + ps.map((x, i) => {
        const last = i === ps.length - 1, live = x.ss.some((s) => s.live);
        return `<div class="r ${i === st.p ? "sel" : ""}" data-cp="${i}"><span class="g">${last ? "└──" : "├──"}</span><span class="x">${A.esc(x.p.name)}</span>${live ? `<span class="lv">*</span>` : ""}<span class="d">${pad(x.ss.length)}</span></div>`;
      }).join("") : `<div class="empty">kein Treffer fuer "${A.esc(st.filter)}"</div>`;
      // Sessions
      const maxN = Math.max(1, ...ss.map((s) => s.nodes.length));
      $("[data-t='1']").textContent = P ? `${A.short(P.p.path)} · ${ss.length} Session${ss.length === 1 ? "" : "s"}` : "";
      $("[data-l='1']").innerHTML = ss.map((s, i) => `<div class="r ${i === st.s ? "sel" : ""} ${s.id === st.open ? "op" : ""}" data-cs="${i}" title="${A.esc(s.label)}">
        <span class="g">${bar(s.nodes.length, maxN)}</span><span class="d">${pad(s.nodes.length, 3)}</span><span class="x">${s.live ? `<span class="lv">&gt;</span> ` : ""}${A.esc(s.label)}</span><span class="d">${A.relShort(s.end).padStart(3)}</span></div>`).join("");
      // Steps
      $("[data-t='2']").textContent = S ? `${S.label}` : "";
      $("[data-l='2']").innerHTML = S ? ks.map((nd, i) => {
        const ags = S.agents.filter((a) => a.node === nd.id).length, ed = nd.edits.length;
        const mk = (ed ? ` *${ed}` : "") + (ags ? ` @${ags}` : "");
        return `<div class="r ${i === st.k ? "sel" : ""} ${S.onPath.has(nd.id) ? "" : "off"}" data-ck="${i}"><span class="d">${pad(i + 1)}${nd.id === S.last.id ? ">" : S.onPath.has(nd.id) ? " " : "~"}</span><span class="x">${A.esc(nd.text.replace(/\s+/g, " "))}</span><span class="g">${mk}</span><span class="d">${A.hhmm(nd.ts)}</span></div>`;
      }).join("") : "";
      drawChart(P); drawTree(S); drawStat(P, S);
      if (scroll !== false) root.querySelectorAll(".ls .sel").forEach((el) => el.scrollIntoView({ block: "nearest" }));
    }

    function drawChart(P) {
      const pre = $("[data-chart]"), box = pre.parentElement;
      const nDays = Math.max(10, Math.min(45, Math.floor((box.clientWidth - 70) / 21.6) || 21));
      const H = Math.max(3, Math.min(12, Math.floor((box.clientHeight - 24) / 15) - 3 || 6));
      box.querySelector(".t i").textContent = `(Schritte/Tag, ${nDays} Tage)`;
      const days = []; const now = new Date(D.generatedAt);
      for (let i = nDays - 1; i >= 0; i--) { const d = new Date(now); d.setDate(d.getDate() - i); days.push(d); }
      const all = {}, mine = {};
      for (const s of D.sessions) for (const n of s.nodes) { const k = dk(n.ts); all[k] = (all[k] || 0) + 1; if (P && s.project === P.p.path) mine[k] = (mine[k] || 0) + 1; }
      const max = Math.max(1, ...days.map((d) => all[dk(d)] || 0));
      const rows = [];
      for (let r = H; r >= 1; r--) {
        let line = (r === H ? String(max).padStart(3) : r === 1 ? "  0" : "   ") + " │";
        for (const d of days) {
          const a = (all[dk(d)] || 0) / max * H, m = (mine[dk(d)] || 0) / max * H;
          const c = (m >= r - 0.5 || (r === 1 && m > 0)) ? `<span class="hi">██</span>` : a >= r - 0.5 ? `<span class="lo">░░</span>` : (r === 1 && a > 0 ? `<span class="lo">▁▁</span>` : "  ");
          line += c + " ";
        }
        rows.push(line);
      }
      rows.push("    └" + "─".repeat(days.length * 3));
      rows.push("     " + days.map((d, i) => (i % 3 === 0 ? pad(d.getDate()) : "  ") + " ").join(""));
      rows.push(`     <span class="hi">██</span> ${A.esc(P ? P.p.name : "-")}   <span class="lo">░░</span> alle Projekte`);
      pre.innerHTML = rows.join("\n");
    }

    function drawTree(S) {
      const el = $("[data-tree]");
      if (!S) { el.innerHTML = ""; return; }
      const ag = S.agents;
      const head = `<pre><span class="hi">● ${A.esc(S.agentName || "Claude")}</span> <span class="lo">${A.esc(S.modelList.map((m) => A.modelInfo(m).name).join(", "))} · ${S.nodes.length} Schritte · ${A.usd(S.cost?.usd)}</span></pre>`;
      if (!ag.length) { el.innerHTML = head + `<pre><span class="lo">└── (keine Subagents, Claude allein)</span></pre>`; return; }
      el.innerHTML = head + ag.map((a, i) => {
        const last = i === ag.length - 1, no = S.nodes.findIndex((n) => n.id === a.node) + 1;
        return `<pre class="ag" data-ag="${A.esc(a.node || "")}"><span class="lo">${last ? "└──" : "├──"}</span> <span class="hi">${A.esc(A.aName(a.type))}</span> <span class="lo">${A.fmtTok(a.tokens)} tok${no ? " · #" + pad(no) : ""}</span>
<span class="lo">${last ? "   " : "│  "}  ${A.esc((a.description || "").slice(0, 60))}</span></pre>`;
      }).join("");
    }

    function drawStat(P, S) {
      const names = ["projects", "sessions", "steps"];
      const t = new Date();
      $(".cr-stat").innerHTML = `<span class="s0">[atlas]</span>${names.map((n, i) => `<span class="w ${i === st.pane ? "on" : ""}" data-pn="${i}">${i}:${n}${i === st.pane ? "*" : ""}</span>`).join("")}
        <span class="fl">${st.filtering ? `<input data-f value="${A.esc(st.filter)}" placeholder="/filter ..." spellcheck="false">` : st.filter ? `/${A.esc(st.filter)} <span class="rt">(Esc loescht)</span>` : `<span class="rt">${A.esc(S ? S.label : "")}</span>`}</span>
        <span class="rt">${D.totals.sessions} sess · ${D.totals.steps} steps · ${A.usd(D.totals.cost)}</span><span class="s0">${pad(t.getHours())}:${pad(t.getMinutes())} ${pad(t.getDate())}.${pad(t.getMonth() + 1)}</span>`;
      if (st.filtering) { const inp = $("[data-f]"); inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    }

    function move(d) {
      const { ps, ss, ks } = cur();
      if (st.pane === 0) { st.p = Math.max(0, Math.min(ps.length - 1, st.p + d)); st.s = 0; st.k = 0; }
      else if (st.pane === 1) { st.s = Math.max(0, Math.min(ss.length - 1, st.s + d)); st.k = 0; }
      else st.k = Math.max(0, Math.min(ks.length - 1, st.k + d));
      draw();
    }
    function enter() {
      const { S, ks } = cur();
      if (st.pane === 0) { st.pane = 1; draw(); return; }
      if (!S) return;
      if (st.pane === 1) A.open(S.id); else A.open(S.id, ks[st.k]?.id);
    }
    function togglePh() {
      root.classList.toggle("green");
      const g = root.classList.contains("green");
      $("[data-ph]").textContent = g ? "gruen" : "bernstein";
      try { localStorage.setItem("atlas-crt-ph", g ? "green" : "amber"); } catch {}
    }
    $("[data-ph]").textContent = root.classList.contains("green") ? "gruen" : "bernstein";

    // Boot sequence: typed lines, max ~1.4s, skippable
    const boot = $(".cr-boot"); let bootT = [];
    const endBoot = () => { bootT.forEach(clearTimeout); bootT = []; boot.classList.add("gone"); };
    if (reduced()) endBoot();
    else {
      const lines = ["ATLAS-80 BIOS v2.6  (c) Phosphor Werke", "Speichertest .......... 640K OK", `Lese ~/.claude ........ ${D.totals.sessions} Sessions, ${D.projects.length} Projekte`, `Subagents ............. ${D.totals.agents}`, "Starte tmux ..."];
      let html = "", t = 0;
      lines.forEach((ln) => {
        for (let c = 1; c <= ln.length; c += 3) { const part = ln.slice(0, c); bootT.push(setTimeout(() => { boot.innerHTML = html + A.esc(part) + "█<small>Klick oder Taste zum Ueberspringen</small>"; }, t)); t += 9; }
        t += 60; bootT.push(setTimeout(() => { html += A.esc(ln) + "<br>"; }, t - 1));
      });
      bootT.push(setTimeout(endBoot, Math.min(t + 120, 1500)));
      boot.addEventListener("click", endBoot);
    }

    // Mouse
    root.addEventListener("click", (e) => {
      const r = e.target.closest("[data-cp],[data-cs],[data-ck],[data-pn],[data-pane],.ag");
      if (!r) return;
      const d = r.dataset;
      if (d.cp != null) { st.pane = 0; st.p = +d.cp; st.s = 0; st.k = 0; draw(false); }
      else if (d.cs != null) { st.pane = 1; st.s = +d.cs; st.k = 0; draw(false); A.open(cur().S.id); }
      else if (d.ck != null) { st.pane = 2; st.k = +d.ck; draw(false); const { S, ks } = cur(); A.open(S.id, ks[st.k].id); }
      else if (d.pn != null) { st.pane = +d.pn; draw(); }
      else if (d.ag != null) { const { S } = cur(); if (S) A.open(S.id, d.ag || undefined); }
      else if (d.pane != null) { st.pane = +d.pane; draw(false); }
    });
    root.addEventListener("input", (e) => { if (e.target.matches("[data-f]")) { st.filter = e.target.value; st.p = st.s = st.k = 0; draw(); } });

    const onKey = (e) => {
      if (!boot.classList.contains("gone")) { endBoot(); e.preventDefault(); return; }
      if (e.target.matches("[data-f]")) {
        if (e.key === "Enter" || e.key === "Escape") { if (e.key === "Escape") st.filter = ""; st.filtering = false; e.preventDefault(); e.stopPropagation(); draw(); }
        return;
      }
      if (e.target.matches("input,textarea,[contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "j" || k === "ArrowDown") move(1);
      else if (k === "k" || k === "ArrowUp") move(-1);
      else if (k === "l" || k === "ArrowRight" || (k === "Tab" && !e.shiftKey)) { st.pane = (st.pane + 1) % 3; draw(); }
      else if (k === "h" || k === "ArrowLeft" || (k === "Tab" && e.shiftKey)) { st.pane = (st.pane + 2) % 3; draw(); }
      else if (k === "Enter") enter();
      else if (k === "/") { st.filtering = true; draw(false); }
      else if (k === "g" || k === "G") togglePh();
      else if (k === "Escape" && st.filter) { st.filter = ""; draw(); return; }
      else return;
      e.preventDefault();
    };
    document.addEventListener("keydown", onKey, true);
    let rt; const onResize = () => { clearTimeout(rt); rt = setTimeout(() => draw(false), 120); };
    addEventListener("resize", onResize);
    const clock = setInterval(() => { if (!document.hidden && !st.filtering) drawStat(cur().P, cur().S); }, 30000);
    A.onCleanup(() => { removeEventListener("resize", onResize); clearTimeout(rt); document.removeEventListener("keydown", onKey, true); clearInterval(clock); bootT.forEach(clearTimeout); });
    // Expose for onSelect
    api = { mark: (id) => { st.open = id; } };
    draw();
  }

  let api = null;
  Atlas.register({ key: "crt", name: "Retro-Terminal", tagline: "Phosphor-Bildschirm mit tmux-Fenstern", css, render, wantsArrows: true,
    onSelect(id) { api?.mark(id); } });
})();
