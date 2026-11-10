// Look: Git-Strom. A `git log --graph` / lazygit style river of sessions in a Neovim skin:
// newest on top, one lane per project, sessions as commit nodes, subagents as short side
// branches, steps of the cursor row as dots on a sub-lane. j/k moves, Enter opens.
(function () {
  const css = `
.lk-river { --bg0: #0b0b0c; --bg1: #141415; --bg2: #1d2021; --bg3: #32302f; --fg: #ebdbb2; --fg2: #d5c4a1; --gray: #928374; --gray2: #665c54;
  --yellow: #fabd2f; --orange: #fe8019; --green: #b8bb26; --aqua: #8ec07c; --blue: #83a598; --purple: #d3869b; --red: #fb4934; }
.lk-river { overflow: hidden; color: var(--fg); font: 500 13px/1.45 var(--mono);
  background:
    radial-gradient(900px 600px at 85% -10%, rgba(254,128,25,.10), transparent 60%),
    radial-gradient(800px 600px at -5% 105%, rgba(142,192,124,.09), transparent 60%),
    radial-gradient(600px 500px at 50% 50%, rgba(131,165,152,.05), transparent 70%),
    #070707; }
.lk-river::after { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 9; opacity: .35;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px); mix-blend-mode: multiply; }
.lk-river .rv-win { position: absolute; inset: 14px 14px 12px; display: flex; flex-direction: column; border-radius: 14px; overflow: hidden;
  background: rgba(16,16,17,.74); border: 1px solid rgba(235,219,178,.09);
  backdrop-filter: blur(20px) saturate(130%); -webkit-backdrop-filter: blur(20px) saturate(130%);
  box-shadow: 0 1px 0 rgba(235,219,178,.06) inset, 0 30px 80px rgba(0,0,0,.6); animation: rvWin .8s var(--spring) backwards; }
@keyframes rvWin { from { opacity: 0; transform: scale(.985) translateY(10px); } }

/* Statusline (lualine style) */
.lk-river .rv-sl { flex: none; height: 28px; display: flex; align-items: stretch; background: var(--bg2); font-size: 12px; font-weight: 700; white-space: nowrap; overflow: hidden; }
.lk-river .rv-sl > span { display: flex; align-items: center; gap: 7px; padding: 0 14px 0 12px; }
.lk-river .rv-sl .md { background: var(--yellow); color: #1d2021; letter-spacing: .06em; padding-right: 20px; clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%); transition: background .3s; }
.lk-river .rv-sl .md.vis { background: var(--orange); }
.lk-river .rv-sl .sg { background: var(--bg3); color: var(--fg2); margin-left: -8px; padding-left: 18px; padding-right: 20px; clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%); }
.lk-river .rv-sl .sg svg.i { width: 14px; height: 14px; color: var(--aqua); }
.lk-river .rv-sl .fn { color: var(--fg2); font-weight: 500; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.lk-river .rv-sl .fn b { color: var(--fg); }
.lk-river .rv-sl .sp { flex: 1; padding: 0; }
.lk-river .rv-sl .r { color: var(--gray); font-weight: 500; }
.lk-river .rv-sl .rs { background: var(--bg3); color: var(--fg2); padding-left: 20px; clip-path: polygon(9px 0, 100% 0, 100% 100%, 9px 100%, 0 50%); }
.lk-river .rv-sl .rm { background: var(--aqua); color: #1d2021; padding-left: 20px; margin-left: -8px; min-width: 96px; justify-content: center; clip-path: polygon(9px 0, 100% 0, 100% 100%, 9px 100%, 0 50%); }

/* Winbar: lane legend */
.lk-river .rv-wb { flex: none; height: 34px; display: flex; align-items: center; gap: 6px; padding: 0 12px; border-bottom: 1px solid rgba(235,219,178,.07); background: rgba(10,10,10,.55); overflow: hidden; }
.lk-river .rv-wb .lg { display: flex; gap: 4px; min-width: 0; overflow: hidden; flex: 1; mask-image: linear-gradient(90deg, #000 92%, transparent); }
.lk-river .rv-wb .lg button { flex: none; display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 6px; font: 600 11.5px var(--mono); color: var(--fg2);
  border: 1px solid transparent; transition: background .2s, border-color .2s; animation: rvFade .5s ease backwards; animation-delay: calc(var(--k) * 40ms + 200ms); }
.lk-river .rv-wb .lg button:hover, .lk-river .rv-wb .lg button.on { background: rgba(235,219,178,.06); border-color: rgba(235,219,178,.12); }
.lk-river .rv-wb .lg i { width: 9px; height: 9px; border-radius: 2px; background: var(--c); box-shadow: 0 0 8px var(--c); }
.lk-river .rv-wb .lg small { color: var(--gray); font-weight: 500; }
.lk-river .rv-wb .keys { flex: none; display: flex; gap: 10px; color: var(--gray); font-size: 11.5px; }
.lk-river kbd { font: 700 11px var(--mono); color: var(--yellow); }
@keyframes rvFade { from { opacity: 0; } }

/* Buffer */
.lk-river .rv-body { position: relative; flex: 1; min-height: 0; }
.lk-river .rv-sc { position: absolute; inset: 0; overflow: auto; scrollbar-width: thin; scrollbar-color: rgba(235,219,178,.16) transparent; padding: 6px 0 96px; }
.lk-river .rv-cv { position: absolute; top: 0; left: var(--gut); z-index: 2; pointer-events: none; }
.lk-river .rv-gutbg { position: absolute; top: 0; bottom: 0; left: 0; width: var(--gut); background: rgba(0,0,0,.18); border-right: 1px solid rgba(235,219,178,.05); pointer-events: none; }

.lk-river .rv-day { position: sticky; top: 0; z-index: 3; height: 30px; display: flex; align-items: stretch; padding-left: calc(var(--gut) + var(--gw)); pointer-events: none; }
.lk-river .rv-day .in { flex: 1; display: flex; align-items: center; gap: 10px; padding: 0 16px 0 2px; background: linear-gradient(180deg, rgba(18,18,19,.97), rgba(18,18,19,.92)); border-bottom: 1px solid rgba(235,219,178,.06); }
.lk-river .rv-day b { color: var(--purple); font-weight: 700; }
.lk-river .rv-day .at { color: var(--gray2); }
.lk-river .rv-day i { font-style: normal; color: var(--gray); font-size: 11.5px; }
.lk-river .rv-day .rule { flex: 1; height: 1px; background: repeating-linear-gradient(90deg, rgba(235,219,178,.16) 0 4px, transparent 4px 8px); }

.lk-river .rv-row { position: relative; height: 58px; cursor: pointer; animation: rvRow .7s var(--spring) backwards; animation-delay: calc(min(var(--k), 18) * 35ms + 250ms); }
@keyframes rvRow { from { opacity: 0; transform: translateX(-12px); } }
.lk-river .rv-row::before { content: ""; position: absolute; inset: 0; background: transparent; transition: background .25s; }
.lk-river .rv-row.on::before { background: linear-gradient(90deg, rgba(235,219,178,.075), rgba(235,219,178,.035) 70%, transparent); }
.lk-river .rv-row.sel::before { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 45%, transparent); }
.lk-river .rv-row .ln { position: absolute; left: 0; top: 13px; width: var(--gut); padding-right: 10px; text-align: right; color: var(--gray2); font-size: 12px; font-variant-numeric: tabular-nums; transition: color .2s; }
.lk-river .rv-row.on .ln { color: var(--yellow); font-weight: 700; }
.lk-river .rv-tx { position: relative; margin-left: calc(var(--gut) + var(--gw)); margin-right: 84px; padding-top: 11px; min-width: 0; }
.lk-river .l1 { display: flex; align-items: baseline; gap: 10px; min-width: 0; white-space: nowrap; }
.lk-river .hash { color: var(--yellow); flex: none; opacity: .85; }
.lk-river .ttl { color: var(--fg); font-weight: 700; font-family: var(--sans); font-size: 14px; overflow: hidden; text-overflow: ellipsis; min-width: 0; letter-spacing: -.005em; }
.lk-river .rv-row:hover .ttl, .lk-river .rv-row.on .ttl { text-shadow: 1px 0 rgba(251,73,52,.35), -1px 0 rgba(131,165,152,.35); }
.lk-river .ref { flex: none; color: var(--c); font-weight: 700; font-size: 12px; }
.lk-river .ref em { font-style: normal; color: var(--aqua); }
.lk-river .live { flex: none; color: var(--green); font-size: 11.5px; font-weight: 700; }
.lk-river .live::before { content: ""; display: inline-block; width: 7px; height: 7px; margin-right: 5px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); animation: blink 1.4s ease-in-out infinite; }
.lk-river .l2 { position: relative; height: 20px; margin-top: 3px; }
.lk-river .meta { position: absolute; inset: 0; color: var(--gray); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: opacity .25s, transform .45s var(--spring); }
.lk-river .meta b { color: var(--fg2); font-weight: 600; }
.lk-river .meta .ag { color: var(--aqua); }
.lk-river .rv-row.on .meta { opacity: 0; transform: translateY(-8px); }
.lk-river .dots { position: absolute; left: 0; right: 0; top: 2px; height: 16px; display: flex; align-items: center; gap: 3px; pointer-events: none; }
.lk-river .rv-row.on .dots { pointer-events: auto; }
.lk-river .sd { flex: 0 1 11px; min-width: 3px; height: 11px; border-radius: 6px; background: var(--c); opacity: 0; transform: scale(0); position: relative;
  transition: transform .5s var(--spring), opacity .2s, height .3s var(--spring), box-shadow .2s; transition-delay: 0s; }
.lk-river .sd::after { content: ""; position: absolute; inset: -6px -2px; }
.lk-river .sd.ag { box-shadow: 0 0 0 2px #0b0b0c, 0 0 0 3.5px var(--aqua); }
.lk-river .sd.last { background: var(--yellow); box-shadow: 0 0 10px rgba(250,189,47,.7); }
.lk-river .rv-row.on .sd { opacity: .9; transform: none; transition-delay: calc(min(var(--j), 60) * 7ms + 60ms); }
.lk-river .rv-row.on .sd:hover { height: 16px; opacity: 1; box-shadow: 0 0 12px var(--c); }
.lk-river .rv-row .rt { position: absolute; right: 18px; top: 12px; text-align: right; color: var(--gray); font-size: 12px; line-height: 1.5; }
.lk-river .rv-row .rt b { display: block; color: var(--fg2); font-weight: 600; }

.lk-river .rv-end { position: relative; height: 44px; }
.lk-river .rv-end .tx { position: absolute; left: calc(var(--gut) + var(--gw)); top: 12px; color: var(--gray); }
.lk-river .rv-end .tx b { color: var(--orange); }
.lk-river .tilde { height: 20px; padding-left: 12px; color: #458588; font-weight: 700; }

.lk-river .rv-tip { position: fixed; z-index: 30; pointer-events: none; max-width: 360px; padding: 9px 11px; border-radius: 8px; font-size: 12px;
  background: rgba(29,32,33,.97); border: 1px solid rgba(235,219,178,.14); box-shadow: 0 14px 34px rgba(0,0,0,.55);
  opacity: 0; transform: translateY(4px); transition: opacity .12s, transform .3s var(--spring); }
.lk-river .rv-tip.on { opacity: 1; transform: none; }
.lk-river .rv-tip .h { color: var(--yellow); font-weight: 700; }
.lk-river .rv-tip .h span { color: var(--gray); font-weight: 500; }
.lk-river .rv-tip .t { margin-top: 4px; color: var(--fg); font-family: var(--sans); font-size: 12.5px; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
.lk-river .rv-tip .f { margin-top: 5px; color: var(--gray); font-size: 11px; }

.lk-river.skip *, .lk-river.skip *::before { animation-delay: 0s !important; animation-duration: .01ms !important; }
@media (prefers-reduced-motion: reduce) {
  .lk-river *, .lk-river *::before, .lk-river *::after { animation-duration: 1ms !important; animation-delay: 0s !important; transition-duration: 1ms !important; transition-delay: 0s !important; }
}
`;

  let api = null;

  function render(root, A) {
    const D = A.DATA, S = D.sessions, esc = A.esc;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ac = new AbortController(), sig = { signal: ac.signal };
    let dead = false, raf = 0;
    A.onCleanup(() => { dead = true; cancelAnimationFrame(raf); ac.abort(); ro.disconnect(); api = null; });

    const GUT = 50, LS = 20, ROW = 58, NODE_Y = 21, TRACK_Y = 43, GX0 = 14;
    const gen = Date.parse(D.generatedAt);

    // ---------- Lanes: one per project, columns reused greedily ----------
    const pj = new Map();
    S.forEach((s, i) => { let p = pj.get(s.project); if (!p) { p = { key: s.project, name: s.projName, hue: s.hue, first: i, last: i, n: 0 }; pj.set(s.project, p); } p.last = i; p.n++; });
    const lanes = [...pj.values()].sort((a, b) => a.first - b.first);
    const colEnd = [];
    for (const l of lanes) {
      l.open = gen - Date.parse(S[l.first].end) < 36 * 3600e3; // recently active: lane stays open to the top
      const start = l.open ? -1e9 : l.first;
      let c = colEnd.findIndex((e) => e <= start - 2);
      if (c < 0) { c = colEnd.length; colEnd.push(0); }
      colEnd[c] = l.last; l.col = c;
      l.x = GX0 + (c + 1) * LS;
      l.color = `hsl(${l.hue} 62% 64%)`;
    }
    const laneOf = new Map(lanes.map((l) => [l.key, l]));
    const GW = GX0 + (colEnd.length + 1) * LS + 18;

    // ---------- Markup ----------
    const groups = []; let g = null;
    S.forEach((s, i) => { const k = new Date(s.end).toDateString(); if (!g || g.k !== k) { g = { k, ts: s.end, rows: [] }; groups.push(g); } g.rows.push(i); });
    const isToday = (ts) => new Date(ts).toDateString() === new Date(gen).toDateString();
    const rowHtml = (s, i) => {
      const l = laneOf.get(s.project), agentSteps = new Set(s.agents.map((a) => a.node));
      return `<div class="rv-row" data-i="${i}" style="--c:${l.color};--k:${i}">
        <span class="ln">${i + 1}</span>
        <div class="rv-tx">
          <div class="l1"><span class="hash">${esc(s.id.slice(0, 7))}</span><span class="ttl">${esc(s.label)}</span><span class="ref">(${i === 0 ? "<em>HEAD -&gt;</em> " : ""}${esc(s.projName)})</span>${s.live ? `<span class="live">läuft</span>` : ""}</div>
          <div class="l2"><span class="meta">${esc(A.rel(s.end))} · <b>${s.nodes.length}</b> ${s.nodes.length === 1 ? "Schritt" : "Schritte"}${s.agents.length ? ` · <span class="ag">${s.agents.length} Agents</span>` : ""} · ${esc(s.modelList.map((m) => A.modelInfo(m).name).join(", ") || "-")}${s.branch ? ` · ${esc(s.branch)}` : ""}</span>
            <span class="dots">${s.nodes.map((n, j) => `<button class="sd ${agentSteps.has(n.id) ? "ag" : ""} ${j === s.nodes.length - 1 ? "last" : ""}" data-sid="${esc(s.id)}" data-nid="${esc(n.id)}" data-j="${j}" style="--j:${j}" aria-label="Schritt ${j + 1}"></button>`).join("")}</span></div>
        </div>
        <span class="rt"><b>${A.hhmm(s.end)}</b>${esc(A.relShort(s.end))}</span></div>`;
    };
    const oldest = S.reduce((m, s) => (s.start < m ? s.start : m), S[S.length - 1].start);
    root.innerHTML = `<div class="rv-win" style="--gut:${GUT}px;--gw:${GW}px">
      <div class="rv-sl"><span class="md" data-mode>NORMAL</span><span class="sg">${A.ic("branch")}atlas</span><span class="fn"><b>git-strom.log</b>&nbsp;· ${lanes.length} Spuren · ${D.totals.steps} Schritte</span>
        <span class="sp"></span><span class="r" data-pct-hint></span><span class="rs" data-pos>1:${S.length}</span><span class="rm" data-pct>Top</span></div>
      <div class="rv-wb"><div class="lg">${lanes.map((l, k) => `<button data-lane="${k}" style="--c:${l.color};--k:${k}" title="${esc(A.short(l.key))}"><i></i>${esc(l.name)} <small>${l.n}</small></button>`).join("")}</div>
        <div class="keys"><span><kbd>j</kbd>/<kbd>k</kbd> bewegen</span><span><kbd>Enter</kbd> öffnen</span><span><kbd>g</kbd>/<kbd>G</kbd> Anfang/Ende</span></div></div>
      <div class="rv-body"><div class="rv-gutbg"></div>
        <div class="rv-sc">${groups.map((gr) => `<div class="rv-day"><span class="in"><span class="at">@@</span><b>${isToday(gr.ts) ? "Heute" : esc(A.day(gr.ts))}</b><i>${gr.rows.length} ${gr.rows.length === 1 ? "Session" : "Sessions"}</i><span class="rule"></span><span class="at">@@</span></span></div>${gr.rows.map((i) => rowHtml(S[i], i)).join("")}`).join("")}
          <div class="rv-end"><span class="tx"><b>Anfang</b> · erste Session ${esc(A.day(oldest))}</span></div>
          ${Array.from({ length: 6 }, () => `<div class="tilde">~</div>`).join("")}
        </div>
        <canvas class="rv-cv"></canvas></div>
      <div class="rv-tip"></div></div>`;

    const $ = (s) => root.querySelector(s);
    const sc = $(".rv-sc"), cv = $(".rv-cv"), ctx = cv.getContext("2d"), tip = $(".rv-tip"), body = $(".rv-body");
    const rowEls = [...root.querySelectorAll(".rv-row")], endEl = $(".rv-end");
    const posEl = $("[data-pos]"), pctEl = $("[data-pct]"), modeEl = $("[data-mode]");

    // ---------- Geometry (content coordinates, from layout) ----------
    let rowTop = [], rootY = 0, W = 0, H = 0, dpr = 1;
    const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
    const measure = () => {
      rowTop = rowEls.map((el) => el.offsetTop);
      rootY = endEl.offsetTop + 22;
      for (const l of lanes) {
        l.topA = l.open ? -1e9 : rowTop[l.first] - 16; l.topB = l.open ? -1e9 : rowTop[l.first] + NODE_Y - 5;
        l.botA = rowTop[l.last] + NODE_Y + 8; l.botB = rowTop[l.last] + ROW + 14;
        l.y0 = l.open ? 0 : l.topA; l.len = l.botB - l.y0;
      }
      dpr = Math.min(2, devicePixelRatio || 1); W = GW; H = body.clientHeight;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.width = `${W}px`; cv.style.height = `${H}px`; }
    };
    const xAt = (l, y) => {
      if (!l.open && y < l.topB) return GX0 + (l.x - GX0) * ease((y - l.topA) / (l.topB - l.topA));
      if (y > l.botA) return l.x + (GX0 - l.x) * ease((y - l.botA) / (l.botB - l.botA));
      return l.x;
    };
    measure();

    // ---------- Particles ----------
    const sprites = new Map();
    const sprite = (color) => {
      if (sprites.has(color)) return sprites.get(color);
      const c = document.createElement("canvas"); c.width = c.height = 32; const x = c.getContext("2d");
      const gr = x.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.18, color); gr.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = gr; x.fillRect(0, 0, 32, 32); sprites.set(color, c); return c;
    };
    const parts = [];
    const seed = () => {
      parts.length = 0;
      for (const l of lanes) {
        const n = l.open ? Math.max(4, Math.round(l.len / 85)) : Math.max(1, Math.round(l.len / 150));
        for (let k = 0; k < n; k++) parts.push({ l, y: l.y0 + Math.random() * l.len, v: (l.open ? 62 : 38) * (0.8 + Math.random() * 0.45), s: l.open ? 1 : 0.7 });
      }
      const tl = { trunk: true, y0: 0, len: rootY };
      for (let k = 0; k < Math.round(rootY / 200); k++) parts.push({ l: tl, y: Math.random() * rootY, v: 26 + Math.random() * 10, s: 0.55 });
    };
    seed();

    // ---------- Cursor + spring scroll ----------
    let cur = 0, sTarget = null, sPos = 0, sVel = 0, curT = 0;
    const lnEls = rowEls.map((el) => el.querySelector(".ln"));
    const drawerOpen = () => document.getElementById("drawer")?.classList.contains("open");
    const setCur = (i, fromKey) => {
      i = Math.max(0, Math.min(S.length - 1, i));
      if (i !== cur) { rowEls[cur].classList.remove("on"); curT = performance.now(); }
      cur = i; rowEls[cur].classList.add("on");
      lnEls.forEach((el, k) => { el.textContent = k === cur ? String(k + 1) : String(Math.abs(k - cur)); });
      posEl.textContent = `${cur + 1}:${S.length}`;
      root.querySelectorAll("[data-lane]").forEach((b) => b.classList.toggle("on", lanes[+b.dataset.lane].key === S[cur].project));
      if (fromKey) {
        const top = rowTop[cur], vh = sc.clientHeight;
        if (top - sc.scrollTop < 44 || top + ROW - sc.scrollTop > vh - 110) {
          const t = Math.max(0, Math.min(sc.scrollHeight - vh, top - vh * 0.36));
          if (reduce) sc.scrollTop = t; else { sTarget = t; sPos = sc.scrollTop; }
        }
        if (drawerOpen()) A.open(S[cur].id);
      }
    };
    setCur(0, false);
    sc.addEventListener("wheel", () => { sTarget = null; sVel = 0; }, { passive: true, signal: ac.signal });
    sc.addEventListener("scroll", () => {
      const max = sc.scrollHeight - sc.clientHeight, p = max > 0 ? sc.scrollTop / max : 0;
      pctEl.textContent = sc.scrollTop < 2 ? "Top" : p > 0.995 ? "Bot" : `${Math.round(p * 100)}%`;
    }, { passive: true, signal: ac.signal });

    // ---------- Draw loop ----------
    const t0 = performance.now(), INTRO = reduce ? 0 : 1200;
    let introSkip = false, last = t0;
    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) { last = now; return; }
      const dt = Math.min(1 / 30, (now - last) / 1000); last = now;
      if (sTarget != null) {
        const a = 190 * (sTarget - sPos) - 25 * sVel; sVel += a * dt; sPos += sVel * dt; sc.scrollTop = sPos;
        if (Math.abs(sTarget - sPos) < 0.5 && Math.abs(sVel) < 4) { sc.scrollTop = sTarget; sTarget = null; sVel = 0; }
      }
      const st = sc.scrollTop, vy0 = st - 30, vy1 = st + H + 30;
      const reveal = introSkip || !INTRO ? 1 : ease(Math.min(1, (now - t0 - 150) / INTRO));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (reveal < 1) { ctx.beginPath(); ctx.rect(0, 0, W, H * reveal); ctx.clip(); }
      ctx.translate(0, -st);
      ctx.lineCap = "round"; ctx.lineJoin = "round";

      // Trunk
      ctx.strokeStyle = "rgba(146,131,116,.45)"; ctx.lineWidth = 2; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(GX0, Math.max(0, vy0)); ctx.lineTo(GX0, Math.min(rootY, vy1)); ctx.stroke();

      // Lanes
      const curLane = laneOf.get(S[cur].project);
      for (const l of lanes) {
        const a = Math.max(l.y0, vy0), b = Math.min(l.botB, vy1); if (a >= b) continue;
        const hot = l === curLane;
        ctx.strokeStyle = l.color; ctx.globalAlpha = hot ? 1 : l.open ? 0.85 : 0.6; ctx.lineWidth = hot ? 2.6 : 2;
        ctx.shadowColor = l.color; ctx.shadowBlur = hot ? 12 : l.open ? 6 : 0;
        ctx.beginPath();
        for (let y = a; ; y += 3) { const yy = Math.min(y, b); const x = xAt(l, yy); if (yy === a) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); if (yy >= b) break; }
        ctx.stroke();
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;

      // Subagent side branches and step sub-lane
      S.forEach((s, i) => {
        const y = rowTop[i] + NODE_Y; if (y < vy0 - 60 || y > vy1 + 60) return;
        const l = laneOf.get(s.project), x = l.x;
        if (s.agents.length) {
          const n = s.agents.length, y1 = y + 4, y2 = y + 32, bx = x + 9;
          ctx.strokeStyle = "#8ec07c"; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.85;
          ctx.beginPath(); ctx.moveTo(x, y1); ctx.bezierCurveTo(x, y1 + 6, bx, y1 + 4, bx, y1 + 10); ctx.lineTo(bx, y2 - 10); ctx.bezierCurveTo(bx, y2 - 4, x, y2 - 6, x, y2); ctx.stroke();
          const nd = Math.min(n, 5);
          for (let k = 0; k < nd; k++) { const yy = y1 + 10 + (nd === 1 ? 0.5 : k / (nd - 1)) * (y2 - y1 - 20); ctx.fillStyle = "#0b0b0c"; ctx.beginPath(); ctx.arc(bx, yy, 2.6, 0, 7); ctx.fill(); ctx.fillStyle = "#8ec07c"; ctx.beginPath(); ctx.arc(bx, yy, 1.8, 0, 7); ctx.fill(); }
          ctx.globalAlpha = 1;
        }
        if (i === cur) {
          const k = reduce ? 1 : ease(Math.min(1, (now - curT) / 380)), ty = rowTop[i] + TRACK_Y, ex = W + 2;
          ctx.strokeStyle = l.color; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.9 * k; ctx.setLineDash([3, 3]);
          const mx = x + (ex - x) * 0.55; ctx.beginPath(); ctx.moveTo(x + 6, y); ctx.bezierCurveTo(mx, y, mx, ty, x + 6 + (ex - x - 6) * k, ty); ctx.stroke();
          ctx.setLineDash([]); ctx.globalAlpha = 1;
        }
      });

      // Commit nodes
      S.forEach((s, i) => {
        const y = rowTop[i] + NODE_Y; if (y < vy0 - 20 || y > vy1 + 20) return;
        const l = laneOf.get(s.project), x = l.x, r = 4 + Math.min(3, Math.sqrt(s.nodes.length) / 3), on = i === cur;
        if (on) { ctx.strokeStyle = l.color; ctx.globalAlpha = 0.35 + 0.25 * Math.sin(now / 260); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r + 5 + Math.sin(now / 260) * 1.2, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
        ctx.shadowColor = l.color; ctx.shadowBlur = on || s.live ? 14 : 6;
        ctx.fillStyle = i === 0 || s.live || on ? l.color : "#141415"; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        ctx.shadowBlur = 0; ctx.strokeStyle = l.color; ctx.lineWidth = 2; ctx.stroke();
      });
      // Root marker
      if (rootY > vy0 && rootY < vy1) { ctx.fillStyle = "#fe8019"; ctx.save(); ctx.translate(GX0, rootY); ctx.rotate(Math.PI / 4); ctx.fillRect(-4, -4, 8, 8); ctx.restore(); }

      // Particles flowing down the lanes
      if (!reduce) {
        ctx.globalCompositeOperation = "lighter";
        for (const p of parts) {
          p.y += p.v * dt; if (p.y > p.l.y0 + p.l.len) p.y = p.l.y0 + Math.random() * 20;
          if (p.y < vy0 || p.y > vy1) continue;
          const x = p.l.trunk ? GX0 : xAt(p.l, p.y), hot = !p.l.trunk && p.l === curLane;
          const sz = (hot ? 18 : 13) * p.s, img = sprite(p.l.trunk ? "rgba(213,196,161,.7)" : p.l.color);
          ctx.globalAlpha = hot ? 1 : 0.8; ctx.drawImage(img, x - sz / 2, p.y - sz / 2, sz, sz);
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }
      ctx.restore();
      if (reveal < 1) { const yy = H * reveal; const gr = ctx.createLinearGradient(0, yy - 30, 0, yy); gr.addColorStop(0, "rgba(250,189,47,0)"); gr.addColorStop(1, "rgba(250,189,47,.35)"); ctx.fillStyle = gr; ctx.fillRect(0, yy - 30, W, 30); }
    };
    draw(performance.now());
    const ro = new ResizeObserver(() => { if (!dead) { measure(); seed(); } });
    ro.observe(body);
    // Fonts can shift layout after first paint
    document.fonts?.ready.then(() => { if (!dead) { measure(); seed(); } });

    // ---------- Interaction ----------
    sc.addEventListener("pointermove", (e) => {
      const row = e.target.closest(".rv-row"); if (row && +row.dataset.i !== cur) setCur(+row.dataset.i, false);
    }, sig);
    const showTip = (dot) => {
      const s = S.find((x) => x.id === dot.dataset.sid), j = +dot.dataset.j, n = s.nodes[j], r = dot.getBoundingClientRect();
      const ags = s.agents.filter((a) => a.node === n.id).length;
      tip.innerHTML = `<div class="h">Schritt ${j + 1} <span>von ${s.nodes.length} · ${esc(A.day(n.ts))} ${A.hhmm(n.ts)}</span></div><div class="t">${esc(n.text.replace(/\s+/g, " ").slice(0, 240)) || "(ohne Text)"}</div>
        <div class="f">${ags ? `${ags} Agents gestartet · ` : ""}${n.edits.length ? `${n.edits.length} Dateien · ` : ""}Klick öffnet diesen Schritt</div>`;
      tip.classList.add("on");
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      tip.style.left = `${Math.max(8, Math.min(innerWidth - tw - 8, r.left + r.width / 2 - tw / 2))}px`;
      tip.style.top = `${r.bottom + th + 18 > innerHeight - 70 ? r.top - th - 30 : r.bottom + 10}px`;
      modeEl.textContent = "VISUAL"; modeEl.classList.add("vis");
    };
    const hideTip = () => { tip.classList.remove("on"); modeEl.textContent = "NORMAL"; modeEl.classList.remove("vis"); };
    sc.addEventListener("pointerover", (e) => { const d = e.target.closest(".sd"); if (d && d.closest(".rv-row.on")) showTip(d); }, sig);
    sc.addEventListener("pointerout", (e) => { if (e.target.closest(".sd")) hideTip(); }, sig);
    sc.addEventListener("scroll", hideTip, { passive: true, signal: ac.signal });
    root.addEventListener("click", (e) => {
      if (!introSkip && performance.now() - t0 < INTRO + 400) { introSkip = true; root.classList.add("skip"); }
      const d = e.target.closest(".sd"); if (d && d.closest(".rv-row.on")) { hideTip(); return A.open(d.dataset.sid, d.dataset.nid); }
      const row = e.target.closest(".rv-row"); if (row) { setCur(+row.dataset.i, false); return A.open(S[+row.dataset.i].id); }
      const lb = e.target.closest("[data-lane]"); if (lb) setCur(lanes[+lb.dataset.lane].first, true);
    }, sig);
    let lastG = 0;
    document.addEventListener("keydown", (e) => {
      if (e.target.matches?.("input,textarea,[contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "j" || k === "ArrowDown") { e.preventDefault(); setCur(cur + 1, true); }
      else if (k === "k" || k === "ArrowUp") { e.preventDefault(); setCur(cur - 1, true); }
      else if (k === "G") setCur(S.length - 1, true);
      else if (k === "g") { const n = performance.now(); if (n - lastG < 600) setCur(0, true); lastG = n; }
      else if (k === "Enter" || k === "o") { e.preventDefault(); A.open(S[cur].id); }
      else return;
      hideTip();
    }, sig);

    api = { select(id) { rowEls.forEach((el, i) => el.classList.toggle("sel", S[i].id === id)); } };
  }

  Atlas.register({ key: "river", name: "Git-Strom", tagline: "Wie lazygit, aber schoen", css, render, onSelect: (id) => api?.select(id), wantsArrows: false });
})();
