// Look "columns": Neovim/Telescope inspired Miller columns with spring-routed connector wires.
(() => {
  const css = `
.lk-columns { --bg0:#0b0c0d; --fg:#ebdbb2; --fg2:#a89984; --fg3:#665c54; --am:#fabd2f; --aq:#8ec07c; --or:#fe8019; --bl:#83a598; --pu:#d3869b;
  font-family: var(--mono); color: var(--fg); overflow: hidden;
  background: radial-gradient(1100px 600px at 8% -12%, rgba(250,189,47,.09), transparent 60%), radial-gradient(900px 600px at 100% 115%, rgba(142,192,124,.09), transparent 60%), #0b0c0d; }
.lk-columns::before { content:""; position:absolute; inset:0; pointer-events:none; opacity:.5;
  background-image: radial-gradient(rgba(235,219,178,.07) 1px, transparent 1px); background-size: 22px 22px; }
.lk-columns .cl-wrap { position:absolute; inset:12px 14px 78px; display:flex; flex-direction:column; gap:10px; }
/* statusline */
.lk-columns .cl-sl { display:flex; align-items:stretch; height:28px; border-radius:8px; overflow:hidden; background:rgba(40,40,40,.75); border:1px solid rgba(235,219,178,.08); font-size:11.5px; flex:none; }
.lk-columns .cl-sl > span { display:flex; align-items:center; padding:0 12px; white-space:nowrap; }
.lk-columns .sl-mode { background:var(--am); color:#1d2021; font-weight:800; letter-spacing:.08em; transition:background .3s; clip-path:polygon(0 0,100% 0,calc(100% - 10px) 100%,0 100%); padding-right:20px !important; }
.lk-columns .sl-mode.ins { background:var(--aq); }
.lk-columns .sl-b { background:#3c3836; color:var(--fg); margin-left:-10px; padding-left:20px !important; clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%); padding-right:20px !important; }
.lk-columns .sl-path { color:var(--fg2); min-width:0; overflow:hidden; text-overflow:ellipsis; flex:1 1 auto; display:block !important; line-height:28px; }
.lk-columns .sl-path b { color:var(--fg); font-weight:600; }
.lk-columns .sl-path i { color:var(--fg3); font-style:normal; padding:0 6px; }
.lk-columns .sl-r { margin-left:auto; color:var(--fg2); gap:14px; }
.lk-columns .sl-r b { color:var(--am); font-weight:700; }
.lk-columns .sl-pos { background:#3c3836; color:var(--fg); clip-path:polygon(10px 0,100% 0,100% 100%,0 100%); padding-left:20px !important; }
.lk-columns .sl-clk { background:var(--aq); color:#1d2021; font-weight:800; }
/* telescope prompt */
.lk-columns .cl-tel { display:flex; align-items:center; gap:10px; height:44px; padding:0 14px; border-radius:12px; flex:none; background:rgba(20,20,20,.55); }
.lk-columns .cl-tel .pr { color:#1d2021; background:var(--or); font-weight:800; font-size:10.5px; padding:3px 8px; border-radius:5px; letter-spacing:.06em; }
.lk-columns .cl-tel .gt { color:var(--am); font-weight:800; }
.lk-columns .cl-tel input { flex:1; min-width:80px; background:none; border:0; outline:0; color:var(--fg); font:500 13.5px var(--mono); caret-color:var(--am); }
.lk-columns .cl-tel input::placeholder { color:var(--fg3); }
.lk-columns .cl-tel .res { color:var(--fg2); font-size:11.5px; white-space:nowrap; }
.lk-columns .keys { display:flex; gap:6px; align-items:center; color:var(--fg3); font-size:11px; white-space:nowrap; }
.lk-columns kbd { font:700 10.5px var(--mono); color:var(--fg); background:rgba(235,219,178,.08); border:1px solid rgba(235,219,178,.15); border-bottom-width:2px; border-radius:5px; padding:1px 6px; }

/* columns */
.lk-columns .cl-cols { position:relative; flex:1; min-height:0; display:grid; grid-template-columns:minmax(160px,.8fr) minmax(210px,1.15fr) minmax(210px,1.1fr) minmax(230px,1.25fr); gap:44px; }
.lk-columns .cl-col { position:relative; display:flex; flex-direction:column; min-height:0; min-width:0; border-radius:14px; background:rgba(24,24,24,.5);
  transition:border-color .35s, box-shadow .5s var(--spring-soft); }
.lk-columns .cl-col.on { border-color:rgba(250,189,47,.5); box-shadow:0 0 0 1px rgba(250,189,47,.18), 0 0 46px rgba(250,189,47,.07), 0 18px 44px rgba(0,0,0,.45); }
.lk-columns .cl-ch { display:flex; align-items:center; gap:8px; height:36px; padding:0 12px; border-bottom:1px solid rgba(235,219,178,.08); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--fg2); flex:none; }
.lk-columns .cl-ch .n { color:#1d2021; background:var(--fg3); border-radius:4px; padding:0 5px; font-weight:800; letter-spacing:0; transition:background .3s; }
.lk-columns .cl-col.on .cl-ch .n { background:var(--am); }
.lk-columns .cl-col.on .cl-ch { color:var(--fg); }
.lk-columns .cl-ch .cnt { margin-left:auto; letter-spacing:0; text-transform:none; color:var(--fg3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lk-columns .cl-list { position:relative; flex:1; min-height:0; padding:6px 0 10px; }
.lk-columns .cl-hl { position:absolute; left:6px; right:6px; top:0; height:46px; border-radius:9px; z-index:0; pointer-events:none;
  background:linear-gradient(90deg, rgba(142,192,124,.13), rgba(142,192,124,.03)); border:1px solid rgba(142,192,124,.28); box-shadow:inset 3px 0 0 var(--aq);
  transition:transform .6s var(--spring), height .45s var(--spring), background .3s, border-color .3s, box-shadow .3s; }
.lk-columns .cl-col.on .cl-hl { background:linear-gradient(90deg, rgba(250,189,47,.18), rgba(250,189,47,.04)); border-color:rgba(250,189,47,.42); box-shadow:inset 3px 0 0 var(--am), 0 0 24px rgba(250,189,47,.08); }
.lk-columns .cl-hl.none { opacity:0; }
.lk-columns .cl-it { position:relative; z-index:1; display:grid; grid-template-columns:36px minmax(0,1fr) auto auto; align-items:center; height:46px; padding-right:12px; cursor:pointer; border-radius:9px; margin:0 6px;
  animation:clIn .45s var(--spring) both; animation-delay:calc(var(--i,0) * 18ms); }
@keyframes clIn { from { opacity:0; transform:translateX(-8px); } }
.lk-columns .cl-it:hover { background:rgba(235,219,178,.035); }
.lk-columns .ln { text-align:right; padding-right:10px; color:var(--fg3); font-size:11px; font-variant-numeric:tabular-nums; }
.lk-columns .cl-it.sel .ln { color:var(--am); font-weight:800; }
.lk-columns .bd { min-width:0; display:flex; flex-direction:column; gap:1px; }
.lk-columns .t { font-size:12.5px; color:var(--fg); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:7px; }
.lk-columns .t > span { overflow:hidden; text-overflow:ellipsis; }
.lk-columns .m { font-size:10.5px; color:var(--fg2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lk-columns .rt { font-size:10.5px; color:var(--fg3); padding-left:8px; white-space:nowrap; }
.lk-columns .cl-it.sel .rt { color:var(--fg2); }
.lk-columns .pdot { width:8px; height:8px; border-radius:2px; flex:none; background:hsl(var(--h) 80% 62%); box-shadow:0 0 10px hsl(var(--h) 80% 62% / .5); }
.lk-columns .fz { color:var(--am); font-weight:800; }
.lk-columns .ag { color:var(--aq); }
.lk-columns .now { color:#1d2021; background:var(--aq); font-size:9.5px; font-weight:800; padding:0 5px; border-radius:4px; flex:none; }
.lk-columns .br { color:var(--pu); flex:none; }
.lk-columns .br svg.i { width:12px; height:12px; }
.lk-columns .cl-open { width:24px; height:24px; border-radius:7px; display:grid; place-items:center; color:#1d2021; background:var(--am); margin-left:8px; opacity:0; transform:scale(.6); transition:opacity .2s, transform .4s var(--spring); }
.lk-columns .cl-open svg.i { width:12px; height:12px; fill:#1d2021; }
.lk-columns .cl-it.sel .cl-open { opacity:1; transform:none; }
.lk-columns .cl-empty { padding:24px 16px; color:var(--fg3); font-size:12px; }
/* preview */
.lk-columns .cl-pv { flex:1; min-height:0; padding:12px 14px 14px; display:flex; flex-direction:column; gap:10px; font-size:12px; }
.lk-columns .pv-in { animation:clPv .5s var(--spring) both; display:flex; flex-direction:column; gap:10px; }
@keyframes clPv { from { opacity:0; transform:translateY(8px); } }
.lk-columns .pv-ti { font:700 14px var(--mono); color:var(--fg); line-height:1.3; }
.lk-columns .pv-sub { color:var(--fg2); font-size:11px; }
.lk-columns .pv-l { font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--fg3); display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.lk-columns .pv-l::before { content:"--"; color:var(--am); letter-spacing:0; }
.lk-columns .pv-q { background:rgba(250,189,47,.06); border:1px solid rgba(250,189,47,.2); border-left:3px solid var(--am); border-radius:8px; padding:9px 11px; color:var(--fg); white-space:pre-wrap; line-height:1.5;
  display:-webkit-box; -webkit-line-clamp:7; -webkit-box-orient:vertical; overflow:hidden; }
.lk-columns .pv-a { background:rgba(142,192,124,.05); border:1px solid rgba(142,192,124,.18); border-left:3px solid var(--aq); border-radius:8px; padding:9px 11px; color:var(--fg2); white-space:pre-wrap; line-height:1.5;
  display:-webkit-box; -webkit-line-clamp:9; -webkit-box-orient:vertical; overflow:hidden; }
.lk-columns .pv-tags { display:flex; flex-wrap:wrap; gap:5px; }
.lk-columns .pv-tags span { font-size:10.5px; padding:2px 7px; border-radius:5px; background:rgba(131,165,152,.12); color:var(--bl); border:1px solid rgba(131,165,152,.2); max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lk-columns .pv-ag { display:grid; grid-template-columns:22px 1fr; gap:4px 8px; align-items:center; padding:7px 9px; border-radius:8px; background:rgba(211,134,155,.07); border:1px solid rgba(211,134,155,.2); }
.lk-columns .pv-ag svg.i { width:16px; height:16px; color:var(--pu); }
.lk-columns .pv-ag b { font-size:12px; color:var(--fg); }
.lk-columns .pv-ag small { grid-column:2; color:var(--fg2); font-size:10.5px; display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
.lk-columns .pv-f { flex:none; padding:10px 12px; border-top:1px solid rgba(235,219,178,.08); display:flex; gap:8px; }
.lk-columns .cl-go { flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 12px; border-radius:10px; font:800 12.5px var(--mono); color:#1d2021;
  background:linear-gradient(135deg, var(--am), #f5a623); box-shadow:0 6px 24px rgba(250,189,47,.22); transition:transform .35s var(--spring), filter .2s; }
.lk-columns .cl-go svg.i { width:14px; height:14px; fill:#1d2021; }
.lk-columns .cl-go:hover { filter:brightness(1.08); transform:translateY(-1px); }
.lk-columns .cl-go:active { transform:scale(.96); }
.lk-columns .cl-col.on .cl-go { box-shadow:0 0 0 2px rgba(250,189,47,.35), 0 6px 26px rgba(250,189,47,.32); }
/* wires */
.lk-columns .cl-wires { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:3; overflow:visible; }
.lk-columns .w-fan { fill:none; stroke:rgba(235,219,178,.09); stroke-width:1; }
.lk-columns .w-glow { fill:none; stroke-width:7; opacity:.32; filter:blur(4px); }
.lk-columns .w-core { fill:none; stroke-width:2; }
.lk-columns .w-flow { fill:none; stroke:#fff8e0; stroke-width:2.4; stroke-linecap:round; stroke-dasharray:0.5 13; opacity:.85; animation:clFlow 1.1s linear infinite; }
@keyframes clFlow { to { stroke-dashoffset:-13.5; } }
.lk-columns .w-end { fill:#1d2021; stroke-width:2; }
.lk-columns .w-g { transition:opacity .4s; }
.lk-columns .w-g.off { opacity:0; }
@media (max-width:1180px) { .lk-columns .keys { display:none; }
  .lk-columns .cl-cols { grid-template-columns:minmax(120px,.62fr) minmax(190px,1.25fr) minmax(170px,1fr) minmax(200px,1fr); gap:30px; }
  .lk-columns .cl-it { grid-template-columns:26px minmax(0,1fr) auto auto; padding-right:8px; margin:0 4px; }
  .lk-columns .ln { padding-right:7px; } .lk-columns .t { font-size:12px; } .lk-columns .cl-col[data-c="0"] .rt { display:none; } }
@media (prefers-reduced-motion: reduce) { .lk-columns .w-flow { animation:none; } .lk-columns .cl-it, .lk-columns .pv-in { animation:none; } }
`;

  let api = null;

  function render(root, A) {
    const D = A.DATA;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = { col: 1, q: "", idx: [0, 0, 0], plist: [], slist: [], tlist: [], match: new Map() };

    root.innerHTML = `<div class="cl-wrap">
      <div class="cl-sl"><span class="sl-mode" id="clMode">NORMAL</span><span class="sl-b">atlas</span><span class="sl-path" id="clPath"></span>
        <span class="sl-r"><span><b>${D.totals.sessions}</b> Sessions</span><span><b>${D.projects.length}</b> Projekte</span><span><b>${D.totals.steps}</b> Schritte</span></span>
        <span class="sl-pos" id="clPos"></span><span class="sl-clk" id="clClk"></span></div>
      <div class="cl-tel glass"><span class="pr">TELESCOPE</span><span class="gt">&gt;</span>
        <input id="clQ" placeholder="Sessions suchen ...  ( / drücken )" autocomplete="off" spellcheck="false">
        <span class="res" id="clRes"></span>
        <span class="keys"><kbd>j</kbd><kbd>k</kbd> bewegen <kbd>h</kbd><kbd>l</kbd> Spalte <kbd>Enter</kbd> öffnen <kbd>/</kbd> suchen</span></div>
      <div class="cl-cols" id="clCols">
        ${["Projekte", "Sessions", "Schritte"].map((n, i) => `<section class="cl-col glass" data-c="${i}"><header class="cl-ch"><span class="n">${i + 1}</span>${n}<span class="cnt" id="clCnt${i}"></span></header>
          <div class="cl-list scroll" id="clL${i}"><div class="cl-hl"></div><div class="cl-items"></div></div></section>`).join("")}
        <section class="cl-col glass" data-c="3"><header class="cl-ch"><span class="n">4</span>Vorschau<span class="cnt" id="clCnt3"></span></header>
          <div class="cl-pv scroll" id="clPv"></div><div class="pv-f" id="clPf"></div></section>
        <svg class="cl-wires" id="clW"><defs>${[0, 1, 2].map((i) => `<linearGradient id="clg${i}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fabd2f"/><stop offset="1" stop-color="#8ec07c"/></linearGradient>`).join("")}</defs>
          <g id="clFans"></g>
          ${[0, 1, 2].map((i) => `<g class="w-g" id="clw${i}"><path class="w-glow" stroke="url(#clg${i})"/><path class="w-core" stroke="url(#clg${i})"/><path class="w-flow"/>
            <circle class="w-end" r="3.5" stroke="#fabd2f"/><circle class="w-end" r="3.5" stroke="#8ec07c"/></g>`).join("")}
        </svg>
      </div></div>`;

    const $ = (id) => root.querySelector("#" + id);
    const cols = $("clCols"), colEls = [...root.querySelectorAll(".cl-col")], lists = [0, 1, 2].map((i) => $("clL" + i)), input = $("clQ");

    // ---------- fuzzy matching (fzf-like subsequence) ----------
    function fzOne(tok, str) {
      const s = str.toLowerCase(); let j = 0, score = 0, prev = -2; const idx = [];
      for (let i = 0; i < s.length && j < tok.length; i++) {
        if (s[i] === tok[j]) { idx.push(i); score += 1 + (i === prev + 1 ? 3 : 0) + (i === 0 || /[\s\-_/.]/.test(s[i - 1]) ? 2 : 0); prev = i; j++; }
      }
      return j === tok.length ? { score, idx } : null;
    }
    function fuzzy(q, s) {
      const toks = q.toLowerCase().split(/\s+/).filter(Boolean); let score = 0; const hi = new Set();
      for (const t of toks) {
        const a = fzOne(t, s.label);
        if (a) { score += a.score * 2; a.idx.forEach((i) => hi.add(i)); continue; }
        const b = fzOne(t, s.projName + " " + s.about);
        if (!b) return null; score += b.score * .5;
      }
      return { score, hi };
    }
    const hl = (s) => {
      const m = st.match.get(s.id); if (!m || !m.hi.size) return A.esc(s.label);
      return [...s.label].map((c, i) => (m.hi.has(i) ? `<span class="fz">${A.esc(c)}</span>` : A.esc(c))).join("");
    };

    // ---------- data for each column ----------
    function filtered() {
      st.match.clear();
      if (!st.q.trim()) return D.sessions;
      const out = [];
      for (const s of D.sessions) { const m = fuzzy(st.q, s); if (m) { st.match.set(s.id, m); out.push(s); } }
      return out.sort((a, b) => st.match.get(b.id).score - st.match.get(a.id).score);
    }
    function buildProjects() {
      const fs = filtered(); st.fs = fs;
      const ps = D.projects.map((p) => ({ p, ss: fs.filter((s) => s.project === p.path) })).filter((x) => x.ss.length);
      st.plist = [{ all: true, ss: fs }, ...ps];
      $("clRes").textContent = `${fs.length} / ${D.sessions.length}`;
    }
    const curP = () => st.plist[st.idx[0]];
    const curS = () => st.slist[st.idx[1]];
    const curT = () => st.tlist[st.idx[2]];

    // ---------- rendering of lists ----------
    function rowHTML(i, body, meta, right, extra = "") {
      return `<div class="cl-it" data-i="${i}" style="--i:${Math.min(i, 14)}"><span class="ln">${i + 1}</span><span class="bd"><span class="t">${body}</span><span class="m">${meta}</span></span>${right}${extra}</div>`;
    }
    function renderP() {
      const tot = st.plist[0].ss;
      lists[0].querySelector(".cl-items").innerHTML = st.plist.map((x, i) => x.all
        ? rowHTML(i, `<span class="pdot" style="--h:40"></span><span>Alle Projekte</span>`, `${tot.length} Sessions · ${tot.reduce((n, s) => n + s.nodes.length, 0)} Schritte`, `<span class="rt">*</span>`)
        : rowHTML(i, `<span class="pdot" style="--h:${x.p.hue}"></span><span>${A.esc(x.p.name)}</span>`, `${x.ss.length} ${x.ss.length === 1 ? "Session" : "Sessions"} · ${x.ss.reduce((n, s) => n + s.nodes.length, 0)} Schritte`, `<span class="rt">${A.relShort(x.p.last)}</span>`)).join("");
      $("clCnt0").textContent = `${st.plist.length - 1}`;
    }
    function renderS() {
      const p = curP(); st.slist = p ? p.ss : [];
      const el = lists[1].querySelector(".cl-items");
      el.innerHTML = st.slist.length ? st.slist.map((s, i) => rowHTML(i,
        `${s.live ? `<span class="dot live"></span>` : ""}<span>${hl(s)}</span>`,
        `${p.all ? `<span style="color:hsl(${s.hue} 70% 68%)">${A.esc(s.projName)}</span> · ` : ""}${s.nodes.length} Schritte${s.agents.length ? ` · <span class="ag">${s.agents.length} Agents</span>` : ""}${s.cost ? ` · ${A.usd(s.cost.usd)}` : ""}`,
        `<span class="rt">${A.relShort(s.end)}</span>`,
        `<button class="cl-open" data-open="${s.id}" title="Session öffnen" aria-label="Session öffnen">${A.ic("play")}</button>`)).join("")
        : `<div class="cl-empty">Keine Treffer für "${A.esc(st.q)}"</div>`;
      $("clCnt1").textContent = st.slist.length ? `${st.idx[1] + 1}/${st.slist.length}` : "0";
    }
    function renderT() {
      const s = curS(); st.tlist = s ? s.nodes : [];
      const el = lists[2].querySelector(".cl-items");
      el.innerHTML = st.tlist.map((n, i) => {
        const ags = s.agents.filter((a) => a.node === n.id).length;
        return rowHTML(i,
          `${s.onPath.has(n.id) ? "" : `<span class="br" title="Seitenweg">${A.ic("branch")}</span>`}<span>${A.esc(n.text.replace(/\s+/g, " ") || "(leer)")}</span>${n.id === s.last.id ? `<span class="now">JETZT</span>` : ""}`,
          `${A.hhmm(n.ts)}${n.edits.length ? ` · ${n.edits.length} Dateien` : ""}${ags ? ` · <span class="ag">${ags} Agents</span>` : ""}`,
          `<span class="rt">${A.relShort(n.ts)}</span>`);
      }).join("") || `<div class="cl-empty">Keine Schritte</div>`;
    }
    const clean = (t) => String(t || "").replace(/\*\*/g, "").replace(/^#+\s*/gm, "").replace(/`/g, "").trim();
    function renderPv() {
      const s = curS(), n = curT(), pv = $("clPv"), pf = $("clPf");
      if (!s || !n) { pv.innerHTML = `<div class="cl-empty">Nichts ausgewählt</div>`; pf.innerHTML = ""; $("clCnt3").textContent = ""; return; }
      const ags = s.agents.filter((a) => a.node === n.id);
      const models = [...new Set(n.models || [])];
      const reply = clean(n.reply);
      pv.innerHTML = `<div class="pv-in">
        <div><div class="pv-ti">${A.esc(s.label)}</div><div class="pv-sub">${A.esc(s.projName)}${s.branch ? " · " + A.esc(s.branch) : ""} · ${A.day(n.ts)} ${A.hhmm(n.ts)}</div></div>
        <div class="pv-l">Du hast gefragt</div><div class="pv-q">${A.esc(n.text || "(leer)")}</div>
        <div class="pv-l">Claude hat geantwortet ${models.map(A.mp).join("")}</div>
        <div class="pv-a">${A.esc(reply ? reply.slice(0, 900) + (reply.length > 900 ? " ..." : "") : "Keine Textantwort in diesem Schritt.")}</div>
        ${n.edits.length ? `<div class="pv-l">Dateien geändert · ${n.edits.length}</div><div class="pv-tags">${n.edits.slice(0, 10).map((f) => `<span title="${A.esc(f)}">${A.esc(f.split("/").pop())}</span>`).join("")}${n.edits.length > 10 ? `<span>+${n.edits.length - 10}</span>` : ""}</div>` : ""}
        ${ags.length ? `<div class="pv-l">Agents gestartet · ${ags.length}</div>${ags.map((a) => `<div class="pv-ag">${A.ic("bot")}<b>${A.esc(A.aName(a.type))}</b><small>${A.esc(a.description || "")} ${Object.keys(a.models || {}).map(A.mp).join("")}</small></div>`).join("")}` : ""}
      </div>`;
      pv.scrollTop = 0;
      const isNow = n.id === s.last.id;
      pf.innerHTML = `<button class="cl-go" data-open="${s.id}" data-open-step="${n.id}">${A.ic("play")} ${isNow ? "Hier weitermachen" : "Ab hier weitermachen"}</button>`;
      $("clCnt3").textContent = `Schritt ${st.idx[2] + 1}/${st.tlist.length}`;
    }

    // ---------- selection highlight + statusline ----------
    const rowEl = (c) => lists[c]?.querySelector(`.cl-it[data-i="${st.idx[c]}"]`);
    function placeHl(c, instant) {
      const h = lists[c].querySelector(".cl-hl"), el = rowEl(c);
      lists[c].querySelectorAll(".cl-it.sel").forEach((x) => x.classList.remove("sel"));
      if (!el) { h.classList.add("none"); return; }
      h.classList.remove("none"); el.classList.add("sel");
      if (instant) h.style.transition = "none";
      h.style.transform = `translateY(${el.offsetTop}px)`; h.style.height = el.offsetHeight + "px";
      if (instant) { h.offsetWidth; h.style.transition = ""; }
    }
    function ensureVisible(c) {
      const el = rowEl(c), L = lists[c]; if (!el) return;
      const top = el.offsetTop, bot = top + el.offsetHeight, pad = 50;
      if (top - pad < L.scrollTop) L.scrollTo({ top: Math.max(0, top - pad), behavior: reduce ? "auto" : "smooth" });
      else if (bot + pad > L.scrollTop + L.clientHeight) L.scrollTo({ top: bot + pad - L.clientHeight, behavior: reduce ? "auto" : "smooth" });
    }
    function status() {
      const p = curP(), s = curS(), n = curT();
      const parts = [p ? (p.all ? "Alle Projekte" : A.esc(p.p.name)) : "-"];
      if (s) parts.push(`<b>${A.esc(s.label)}</b>`);
      if (n) parts.push(`Schritt ${st.idx[2] + 1}`);
      $("clPath").innerHTML = parts.join("<i>&gt;</i>");
      $("clPos").textContent = `Spalte ${st.col + 1}/4`;
      $("clCnt1").textContent = st.slist.length ? `${st.idx[1] + 1}/${st.slist.length}` : "0";
      $("clCnt2").textContent = st.tlist.length ? `${st.idx[2] + 1}/${st.tlist.length}` : "";
      colEls.forEach((c, i) => c.classList.toggle("on", i === st.col));
    }
    const clock = () => { $("clClk").textContent = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }); };
    clock(); const clkT = setInterval(clock, 20e3);

    // ---------- selection changes cascade to the right ----------
    function setP(i, opts = {}) {
      st.idx[0] = Math.max(0, Math.min(st.plist.length - 1, i));
      renderP(); st.idx[1] = 0; renderS(); setS(0, { cascade: true, ...opts }); placeHl(0, opts.instant); ensureVisible(0);
    }
    function setS(i, opts = {}) {
      if (!opts.cascade && i === st.idx[1] && st.tlist.length) return;
      st.idx[1] = Math.max(0, Math.min(st.slist.length - 1, i));
      renderT(); st.idx[2] = Math.max(0, st.tlist.length - 1);
      placeHl(1, opts.instant); placeHl(2, true); ensureVisible(1);
      lists[2].scrollTop = lists[2].scrollHeight;
      renderPv(); status(); kick();
    }
    function setT(i) {
      st.idx[2] = Math.max(0, Math.min(st.tlist.length - 1, i));
      placeHl(2); ensureVisible(2); renderPv(); status(); kick();
    }
    function move(d) {
      const c = st.col;
      if (c === 0) { if (st.idx[0] + d >= 0 && st.idx[0] + d < st.plist.length) { st.idx[0] += d; st.idx[1] = 0; placeHl(0); ensureVisible(0); renderS(); setS(0, { cascade: true }); } }
      else if (c === 1) { if (st.slist.length) setS(st.idx[1] + d); }
      else if (c === 2) setT(st.idx[2] + d);
      else $("clPv").scrollBy({ top: d * 60, behavior: reduce ? "auto" : "smooth" });
    }
    function jump(end) {
      const c = st.col, len = [st.plist.length, st.slist.length, st.tlist.length][c];
      if (c > 2 || !len) return; move((end ? len - 1 : 0) - st.idx[c]);
    }
    function setCol(c) { st.col = Math.max(0, Math.min(3, c)); status(); }
    function openCur() {
      const s = curS(); if (st.col === 0) return setCol(1); if (!s) return;
      if (st.col === 1) A.open(s.id); else A.open(s.id, curT()?.id);
    }
    function refilter() {
      const prev = curP(); const prevKey = prev?.all ? "*" : prev?.p.path;
      buildProjects();
      let i = st.plist.findIndex((x) => (x.all ? "*" : x.p.path) === prevKey); if (i < 0) i = 0;
      setP(i);
    }

    // ---------- wires with spring physics ----------
    const svg = $("clW"), fansG = $("clFans");
    const spr = () => ({ x: null, v: 0, t: 0 });
    const W = [0, 1, 2].map((i) => ({ g: $("clw" + i), y1: spr(), y2: spr(), x1: 0, x2: 0, ok: false, grad: $("clg" + i) }));
    let fans = [], raf = 0, last = 0;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const curve = (x1, y1, x2, y2) => { const dx = (x2 - x1) * .62; return `M${x1.toFixed(1)},${y1.toFixed(1)} C${(x1 + dx).toFixed(1)},${y1.toFixed(1)} ${(x2 - dx).toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`; };
    function measure() {
      const cr = cols.getBoundingClientRect(); if (!cr.width) return;
      const pr = colEls.map((c) => c.getBoundingClientRect());
      const yOf = (c) => {
        const el = rowEl(c); if (!el) return null;
        const r = el.getBoundingClientRect(), L = lists[c].getBoundingClientRect();
        return clamp(r.top + r.height / 2, L.top + 14, L.bottom - 14) - cr.top;
      };
      fans = [];
      for (let i = 0; i < 3; i++) {
        const w = W[i], y1 = yOf(i);
        let y2;
        if (i < 2) y2 = yOf(i + 1);
        else { const q = root.querySelector(".pv-q"); y2 = q ? clamp(q.getBoundingClientRect().top + 14, pr[3].top + 40, pr[3].bottom - 60) - cr.top : null; }
        w.ok = y1 != null && y2 != null;
        w.g.classList.toggle("off", !w.ok);
        if (!w.ok) continue;
        w.x1 = pr[i].right - cr.left - 10; w.x2 = pr[i + 1].left - cr.left + 10;
        w.y1.t = y1; w.y2.t = y2;
        if (w.y1.x == null || reduce) { w.y1.x = y1; w.y2.x = y2; }
        w.grad.setAttribute("x1", w.x1); w.grad.setAttribute("x2", w.x2);
        // faint fan to every other visible row of the next list
        if (i < 2) {
          const L = lists[i + 1].getBoundingClientRect();
          lists[i + 1].querySelectorAll(".cl-it:not(.sel)").forEach((el) => {
            const r = el.getBoundingClientRect(); const y = r.top + r.height / 2;
            if (y > L.top + 8 && y < L.bottom - 8) fans.push({ w, y: y - cr.top });
          });
        }
      }
    }
    function draw() {
      for (const w of W) {
        if (!w.ok) continue;
        const d = curve(w.x1, w.y1.x, w.x2, w.y2.x);
        const ps = w.g.querySelectorAll("path"); ps.forEach((p) => p.setAttribute("d", d));
        const cs = w.g.querySelectorAll("circle");
        cs[0].setAttribute("cx", w.x1); cs[0].setAttribute("cy", w.y1.x); cs[1].setAttribute("cx", w.x2); cs[1].setAttribute("cy", w.y2.x);
      }
      fansG.innerHTML = fans.map((f) => `<path class="w-fan" d="${curve(f.w.x1, f.w.y1.x, f.w.x2, f.y)}"/>`).join("");
    }
    function tick(ts) {
      const dt = Math.min(1 / 30, last ? (ts - last) / 1000 : 1 / 60); last = ts;
      let moving = false;
      for (const w of W) for (const s of [w.y1, w.y2]) {
        if (s.x == null) continue;
        const a = -190 * (s.x - s.t) - 17 * s.v; s.v += a * dt; s.x += s.v * dt;
        if (Math.abs(s.x - s.t) > .15 || Math.abs(s.v) > .15) moving = true; else { s.x = s.t; s.v = 0; }
      }
      draw();
      raf = moving ? requestAnimationFrame(tick) : 0; if (!raf) last = 0;
    }
    function kick() { measure(); if (reduce) return draw(); if (!raf) raf = requestAnimationFrame(tick); }

    // ---------- events ----------
    lists.forEach((L, c) => {
      L.addEventListener("scroll", kick, { passive: true });
      L.addEventListener("click", (e) => {
        const it = e.target.closest(".cl-it"); if (!it || e.target.closest("[data-open]")) return;
        const i = +it.dataset.i; st.col = c;
        if (c === 0) { if (i !== st.idx[0]) setP(i); else status(); }
        else if (c === 1) { setS(i); status(); }
        else setT(i);
      });
      L.addEventListener("dblclick", (e) => { const it = e.target.closest(".cl-it"); if (it && c > 0) openCur(); });
    });
    colEls[3].addEventListener("click", () => setCol(3));
    $("clPv").addEventListener("scroll", kick, { passive: true });
    input.addEventListener("input", () => { st.q = input.value; refilter(); });
    input.addEventListener("focus", () => { const m = $("clMode"); m.textContent = "SUCHE"; m.classList.add("ins"); });
    input.addEventListener("blur", () => { const m = $("clMode"); m.textContent = "NORMAL"; m.classList.remove("ins"); });
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target === input) {
        if (e.key === "Enter" || e.key === "ArrowDown") { e.preventDefault(); input.blur(); setCol(1); }
        return;
      }
      if (e.target.matches?.("input,textarea,[contenteditable]")) return;
      const k = e.key;
      if (k === "/") { e.preventDefault(); input.focus(); input.select(); }
      else if (k === "j" || k === "ArrowDown") { e.preventDefault(); move(1); }
      else if (k === "k" || k === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (k === "h" || k === "ArrowLeft") { e.preventDefault(); setCol(st.col - 1); }
      else if (k === "l" || k === "ArrowRight") { e.preventDefault(); setCol(st.col + 1); }
      else if (k === "g") jump(false);
      else if (k === "G") jump(true);
      else if (k === "Enter") { e.preventDefault(); openCur(); }
      else if (k === "Escape" && st.q && !document.getElementById("drawer").classList.contains("open")) { input.value = ""; st.q = ""; refilter(); }
    };
    document.addEventListener("keydown", onKey);
    const onResize = () => { [0, 1, 2].forEach((c) => placeHl(c, true)); kick(); };
    addEventListener("resize", onResize);
    // fonts can shift row metrics after first paint
    document.fonts?.ready.then(() => onResize());
    A.onCleanup(() => { document.removeEventListener("keydown", onKey); removeEventListener("resize", onResize); clearInterval(clkT); cancelAnimationFrame(raf); api = null; });

    api = { sync(id) {
      if (!id) return; const s = D.sessions.find((x) => x.id === id); if (!s || curS()?.id === id) return;
      const i = st.slist.findIndex((x) => x.id === id); if (i >= 0) setS(i);
    } };

    buildProjects();
    st.idx[0] = st.plist.length > 1 ? 0 : 0;
    setP(0, { instant: true });
    requestAnimationFrame(() => { [0, 1, 2].forEach((c) => placeHl(c, true)); kick(); });
  }

  Atlas.register({ key: "columns", name: "Spalten (nvim)", tagline: "Projekt > Session > Schritt, wie Telescope", wantsArrows: true, css, render, onSelect: (id) => api?.sync(id) });
})();
