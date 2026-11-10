// Look: Waben. Hexagonal honeycomb holotable, one cluster per project, spiral by recency.
(function () {
  const css = `
.lk-hive { overflow: hidden; cursor: grab; touch-action: none; user-select: none;
  background:
    radial-gradient(ellipse 60% 55% at 56% 46%, rgba(45,212,191,.13), transparent 70%),
    radial-gradient(ellipse 40% 30% at 56% 50%, rgba(250,189,47,.05), transparent 70%),
    #03090b; }
.lk-hive.drag { cursor: grabbing; }
.lk-hive::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(rgba(45,212,191,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.055) 1px, transparent 1px);
  background-size: 44px 44px; -webkit-mask-image: radial-gradient(ellipse 70% 70% at 55% 48%, #000 30%, transparent 85%); mask-image: radial-gradient(ellipse 70% 70% at 55% 48%, #000 30%, transparent 85%); }
.lk-hive .hv-fx { position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,.16) 0 1px, transparent 1px 3px), radial-gradient(ellipse at 55% 48%, transparent 55%, rgba(0,0,0,.55)); }
.lk-hive .hv-fx::after { content: ""; position: absolute; left: 0; right: 0; height: 160px; top: -160px;
  background: linear-gradient(transparent, rgba(45,212,191,.05), transparent); animation: hvScan 7s linear infinite; }
@keyframes hvScan { to { transform: translateY(calc(100vh + 160px)); } }

.lk-hive .hv-world { position: absolute; left: 0; top: 0; transform-origin: 0 0; z-index: 1; will-change: transform; }
.lk-hive .hv-svg { position: absolute; left: 0; top: 0; width: 1px; height: 1px; overflow: visible; pointer-events: none; }
.lk-hive .hv-svg.top { z-index: 5; }
.lk-hive .lat { fill: none; stroke: rgba(45,212,191,.09); stroke-width: 1; }
.lk-hive .lnk path { fill: none; stroke: var(--amber); stroke-width: 1.4; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; filter: drop-shadow(0 0 3px rgba(250,189,47,.9));
  transition: stroke-dashoffset .55s cubic-bezier(.6,0,.2,1), opacity .25s; }
.lk-hive .lnk circle { fill: #ffe39a; opacity: 0; transition: opacity .3s .35s; }
.lk-hive .lnk.on path { stroke-dashoffset: 0; opacity: .85; }
.lk-hive .lnk.on circle { opacity: 1; }

/* Hex cells */
.lk-hive .hc { position: absolute; z-index: 2; scale: 1; transition: scale .55s var(--spring), opacity .35s ease, filter .35s ease;
  filter: drop-shadow(0 0 calc(var(--a) * 10px) rgba(45,212,191,calc(var(--a) * .55))); }
.lk-hive .hx, .lk-hive .hx::before { position: absolute; inset: 0; clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); }
.lk-hive .hx { background: rgba(45,212,191, calc(.25 + var(--a) * .6)); animation: hvIn .8s var(--spring) backwards; animation-delay: calc(var(--d) * 32ms + 150ms); }
.lk-hive .hx::before { content: ""; inset: 1.5px; background: linear-gradient(160deg, rgba(45,212,191, calc(.08 + var(--a) * .5)), rgba(6,30,32, .92) 85%); }
@keyframes hvIn { from { transform: scale(0) rotate(-30deg); opacity: 0; } }
.lk-hive .hx svg.rg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.lk-hive .rg polygon { fill: none; stroke-width: 3; stroke-linecap: round; }
.lk-hive .rg .bg { stroke: rgba(255,255,255,.07); }
.lk-hive .rg .fg { stroke: #9ff7ea; filter: drop-shadow(0 0 2px #2dd4bf); }
.lk-hive .lb, .lk-hive .hvt { position: absolute; inset: 14% 12%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; transition: opacity .2s; }
.lk-hive .lb b { font: 700 17px var(--display); letter-spacing: .04em; color: #dffcf7; text-shadow: 0 0 8px rgba(45,212,191,.8); }
.lk-hive .lb small { font: 700 10px var(--mono); color: rgba(190,250,240,.6); margin-top: 1px; }
.lk-hive .hvt { opacity: 0; gap: 2px; }
.lk-hive .hvt b { font: 700 7.6px/1.2 var(--sans); color: #fff; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; word-break: break-word; }
.lk-hive .hvt small { font: 700 6.5px var(--mono); color: var(--amber); }
.lk-hive .bot { position: absolute; left: 50%; top: 9%; translate: -50% 0; color: var(--amber); filter: drop-shadow(0 0 3px rgba(250,189,47,.8)); }
.lk-hive .bot svg.i { width: 11px; height: 11px; stroke-width: 2.2; }
.lk-hive .hc.s { cursor: pointer; }
.lk-hive .hc.s:hover, .lk-hive .hc.s.hot, .lk-hive .hc.s:focus-visible { scale: 1.6; z-index: 6; filter: drop-shadow(0 0 16px rgba(250,189,47,.65)); outline: none; }
.lk-hive .hc.s.hot .hx { background: var(--amber); }
.lk-hive .hc.s.hot .lb { opacity: 0; }
.lk-hive .hc.s.hot .hvt { opacity: 1; }
.lk-hive .hc.s.hot .bot { opacity: 0; }
.lk-hive .hc.sib { filter: drop-shadow(0 0 12px rgba(45,212,191,.9)); }
.lk-hive .hc.sib .hx::before { background: linear-gradient(160deg, rgba(45,212,191,.55), rgba(6,40,42,.9) 85%); }
.lk-hive .hv-world.dim .hc:not(.sib):not(.hot):not(.p.sib) { opacity: .28; }
.lk-hive .hc.sel .hx { background: var(--amber); }
.lk-hive .hc.sel { filter: drop-shadow(0 0 14px rgba(250,189,47,.8)); }
.lk-hive .hc.live { animation: hvLive 1.6s ease-in-out infinite; }
@keyframes hvLive { 50% { filter: drop-shadow(0 0 18px rgba(74,222,128,.95)); } }
.lk-hive .hc.live .hx { background: var(--green); }

/* Project hub hex */
.lk-hive .hc.p { cursor: pointer; filter: drop-shadow(0 0 calc(4px + var(--a) * 12px) rgba(250,189,47, calc(.2 + var(--a) * .5))); }
.lk-hive .hc.p .hx { background: rgba(250,189,47, calc(.35 + var(--a) * .6)); }
.lk-hive .hc.p .hx::before { inset: 2px; background: radial-gradient(circle at 50% 30%, rgba(250,189,47, calc(.06 + var(--a) * .14)), rgba(10,12,8,.96) 70%); }
.lk-hive .hc.p .lb { inset: 16% 7%; }
.lk-hive .hc.p .lb b { font: 800 14px/1.1 var(--sans); letter-spacing: -.01em; color: #ffe8b0; text-shadow: 0 0 8px rgba(250,189,47,.55), 0 1px 2px #000; max-width: 100%; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; }
.lk-hive .hc.p .lb small { color: rgba(255,232,176,.65); margin-top: 3px; }
.lk-hive .hc.p:hover, .lk-hive .hc.p.sib { scale: 1.08; }

/* Tooltip */
.lk-hive .hv-tip { position: fixed; z-index: 30; pointer-events: none; width: 260px; padding: 11px 13px; border-radius: 14px;
  background: rgba(6,20,22,.78); border: 1px solid rgba(45,212,191,.35); box-shadow: 0 0 0 1px rgba(45,212,191,.08) inset, 0 16px 40px rgba(0,0,0,.5), 0 0 30px rgba(45,212,191,.15);
  backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%);
  opacity: 0; transform: translateY(6px) scale(.97); transition: opacity .15s, transform .35s var(--spring); }
.lk-hive .hv-tip.on { opacity: 1; transform: none; }
.lk-hive .hv-tip .k { font: 700 9.5px var(--mono); letter-spacing: .16em; text-transform: uppercase; color: var(--amber); display: flex; gap: 6px; align-items: center; }
.lk-hive .hv-tip b { display: block; margin-top: 4px; font-size: 14px; line-height: 1.25; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
.lk-hive .hv-tip .m { margin-top: 7px; display: flex; gap: 10px; flex-wrap: wrap; font: 600 11px var(--mono); color: rgba(190,250,240,.7); }
.lk-hive .hv-tip .h { margin-top: 8px; font-size: 11px; color: var(--ink-3); }

/* Legend */
.lk-hive .hv-leg { position: absolute; z-index: 10; left: 16px; top: 16px; bottom: 80px; width: 262px; display: flex; flex-direction: column; cursor: default;
  background: rgba(6,18,20,.62); border-color: rgba(45,212,191,.2); animation: hvSlide .8s var(--spring) backwards .1s; }
@keyframes hvSlide { from { opacity: 0; transform: translateX(-30px); } }
.lk-hive .hv-leg .hd { padding: 16px 16px 12px; border-bottom: 1px solid rgba(45,212,191,.15); }
.lk-hive .hv-leg .hd .t { font: 900 15px var(--display); letter-spacing: .14em; color: #bff8ee; text-shadow: 0 0 12px rgba(45,212,191,.6); }
.lk-hive .hv-leg .hd .s { font: 600 10.5px var(--mono); color: rgba(190,250,240,.55); margin-top: 4px; letter-spacing: .04em; }
.lk-hive .hv-leg .ls { flex: 1; min-height: 0; padding: 6px; }
.lk-hive .hv-leg button.pr { width: 100%; display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 7px 10px; border-radius: 10px; text-align: left; transition: background .2s;
  animation: hvRow .6s var(--spring) backwards; animation-delay: calc(.25s + var(--k) * 30ms); }
@keyframes hvRow { from { opacity: 0; transform: translateX(-12px); } }
.lk-hive .hv-leg button.pr:hover, .lk-hive .hv-leg button.pr.on { background: rgba(45,212,191,.1); }
.lk-hive .hv-leg button.pr.on { box-shadow: inset 2px 0 0 var(--amber); }
.lk-hive .hv-leg .mh { width: 14px; height: 16px; clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); background: rgba(250,189,47, calc(.25 + var(--a) * .75)); }
.lk-hive .hv-leg .nm { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: 700; font-size: 13px; }
.lk-hive .hv-leg .nm small { display: block; font: 600 10.5px var(--mono); color: var(--ink-3); }
.lk-hive .hv-leg .ct { font: 700 11px var(--mono); color: rgba(190,250,240,.7); }
.lk-hive .hv-leg .ft { padding: 10px 16px 12px; border-top: 1px solid rgba(45,212,191,.15); display: grid; gap: 6px; font-size: 11px; color: var(--ink-3); }
.lk-hive .hv-leg .ft div { display: flex; align-items: center; gap: 8px; }
.lk-hive .hv-leg .ft .sw { width: 34px; height: 8px; border-radius: 4px; background: linear-gradient(90deg, rgba(45,212,191,.15), rgba(45,212,191,.95)); flex: none; }
.lk-hive .hv-leg .ft svg.i { width: 14px; height: 14px; }
.lk-hive .hv-leg .ft .rgx { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #9ff7ea; border-right-color: transparent; flex: none; }

/* HUD controls */
.lk-hive .hv-hud { position: absolute; z-index: 10; right: 16px; top: 16px; display: flex; align-items: center; gap: 4px; padding: 5px; border-radius: 14px; cursor: default;
  background: rgba(6,18,20,.62); border-color: rgba(45,212,191,.2); animation: hvSlide .8s var(--spring) backwards .2s; }
.lk-hive .hv-hud button { min-width: 32px; height: 32px; padding: 0 10px; border-radius: 10px; display: grid; place-items: center; font: 700 13px var(--mono); color: #bff8ee; transition: background .2s; }
.lk-hive .hv-hud button:hover { background: rgba(45,212,191,.14); }
.lk-hive .hv-hud .z { font: 600 11px var(--mono); color: rgba(190,250,240,.6); min-width: 46px; text-align: center; }
.lk-hive .hv-hint { position: absolute; z-index: 10; right: 20px; top: 64px; font: 600 10.5px var(--mono); color: rgba(190,250,240,.4); letter-spacing: .04em; pointer-events: none; }

@media (max-width: 760px) { .lk-hive .hv-leg { width: 200px; } }
@media (prefers-reduced-motion: reduce) {
  .lk-hive .hv-fx::after, .lk-hive .hc.live { animation: none; }
}
`;

  const SQ3 = Math.sqrt(3), R = 46;
  const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  const key = (q, r) => q + "," + r;
  const toXY = (q, r) => ({ x: R * SQ3 * (q + r / 2), y: R * 1.5 * r });
  const dist = (q, r) => (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2;
  function ring(q, r, rad) {
    if (rad === 0) return [[q, r]];
    const out = []; let cq = q + DIRS[4][0] * rad, cr = r + DIRS[4][1] * rad;
    for (let i = 0; i < 6; i++) for (let j = 0; j < rad; j++) { out.push([cq, cr]); cq += DIRS[i][0]; cr += DIRS[i][1]; }
    return out;
  }
  const hexPts = (cx, cy, rad) => [0, 1, 2, 3, 4, 5].map((i) => { const a = Math.PI / 180 * (60 * i - 90); return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]; });

  function render(root, A) {
    const D = A.DATA, esc = A.esc, now = Date.now();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const recency = (ts) => { const d = Math.max(0, (now - Date.parse(ts)) / 864e5); return Math.max(0.06, Math.min(1, 1 - Math.log(1 + d) / Math.log(1 + 45))); };
    const maxSteps = Math.max(...D.sessions.map((s) => s.nodes.length), 1);

    // ---------- Layout: clusters along a hex spiral, newest project in the center ----------
    const P = D.projects.slice().sort((a, b) => b.last.localeCompare(a.last));
    const occ = new Map();
    const free = (cells, ci) => cells.every(([q, r]) => !occ.has(key(q, r)) && DIRS.every(([dq, dr]) => { const o = occ.get(key(q + dq, r + dr)); return o === undefined || o === ci; }));
    const clusterCells = (q, r, n) => { const cells = [[q, r]]; for (let rad = 1; cells.length < n + 1; rad++) for (const c of ring(q, r, rad)) { if (cells.length >= n + 1) break; cells.push(c); } return cells; };
    const spiral = []; for (let rad = 0; rad < 40; rad++) spiral.push(...ring(0, 0, rad));
    const clusters = P.map((p, ci) => {
      const n = p.sessions.length;
      let cells = null;
      for (const [q, r] of spiral) { const c = clusterCells(q, r, n); if (free(c, ci)) { cells = c; break; } }
      cells.forEach(([q, r]) => occ.set(key(q, r), ci));
      const hub = toXY(...cells[0]);
      return { p, ci, hub, a: recency(p.last), cells, sess: p.sessions.map((s, j) => ({ s, ...toXY(...cells[j + 1]), q: cells[j + 1][0], r: cells[j + 1][1] })) };
    });
    let maxD = 0; for (const k of occ.keys()) { const [q, r] = k.split(",").map(Number); maxD = Math.max(maxD, dist(q, r)); }
    const xs = [], ys = []; for (const k of occ.keys()) { const [q, r] = k.split(",").map(Number); const p = toXY(q, r); xs.push(p.x); ys.push(p.y); }
    const B = { x0: Math.min(...xs) - R, x1: Math.max(...xs) + R, y0: Math.min(...ys) - R, y1: Math.max(...ys) + R };

    // Background lattice of empty cells
    let lat = "";
    for (let rad = 0; rad <= maxD + 3; rad++) for (const [q, r] of ring(0, 0, rad)) {
      if (occ.has(key(q, r))) continue; const c = toXY(q, r);
      lat += "M" + hexPts(c.x, c.y, R - 3).map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
    }

    // ---------- Markup ----------
    const W = R * SQ3, H = R * 2;
    const ringSvg = (frac) => { const pts = hexPts(50, 57.735, 50).map((p) => p.join(",")).join(" "); return `<svg class="rg" viewBox="0 0 100 115.47"><g transform="translate(50 57.735) scale(.8) translate(-50 -57.735)"><polygon class="bg" points="${pts}" pathLength="100"/><polygon class="fg" points="${pts}" pathLength="100" stroke-dasharray="${(frac * 100).toFixed(1)} 100"/></g></svg>`; };
    const cellBox = (x, y, sc) => `left:${x - (W * sc) / 2}px;top:${y - (H * sc) / 2}px;width:${W * sc}px;height:${H * sc}px`;
    let html = "", lines = "";
    for (const c of clusters) {
      const d0 = dist(...c.cells[0]);
      html += `<div class="hc p" data-c="${c.ci}" style="${cellBox(c.hub.x, c.hub.y, 1.1)};--a:${c.a.toFixed(2)};--d:${d0}" role="button" tabindex="-1" aria-label="${esc(c.p.name)}">
        <div class="hx"><div class="lb"><b>${esc(c.p.name)}</b><small>${c.p.sessions.length} ${c.p.sessions.length === 1 ? "Session" : "Sess."}</small></div></div></div>`;
      for (const it of c.sess) {
        const s = it.s, a = recency(s.end), frac = Math.log(1 + s.nodes.length) / Math.log(1 + maxSteps);
        html += `<div class="hc s ${s.live ? "live" : ""}" data-c="${c.ci}" data-sid="${esc(s.id)}" style="${cellBox(it.x, it.y, 0.86)};--a:${a.toFixed(2)};--d:${dist(it.q, it.r)}" role="button" tabindex="0" aria-label="${esc(s.label)}">
          <div class="hx">${ringSvg(frac)}
            <div class="lb"><b>${esc(s.initials)}</b><small>${esc(A.relShort(s.end))}</small></div>
            <div class="hvt"><b>${esc(s.label)}</b><small>${A.hhmm(s.end)} · ${s.nodes.length} Schr.</small></div>
            ${s.agents.length ? `<span class="bot">${A.ic("bot")}</span>` : ""}</div></div>`;
      }
      lines += `<g class="lnk" data-c="${c.ci}">${c.sess.map((it) => { const dx = it.x - c.hub.x, dy = it.y - c.hub.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, sx = c.hub.x + ux * R * 0.55, sy = c.hub.y + uy * R * 0.55, ex = it.x - ux * R * 0.35, ey = it.y - uy * R * 0.35, mx = (sx + ex) / 2 - uy * 8, my = (sy + ey) / 2 + ux * 8;
        return `<path pathLength="1" d="M${sx.toFixed(1)},${sy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2.2"/>`; }).join("")}</g>`;
    }

    root.innerHTML = `
      <div class="hv-world"><svg class="hv-svg"><path class="lat" d="${lat}"/></svg>${html}<svg class="hv-svg top">${lines}</svg></div>
      <div class="hv-fx"></div>
      <aside class="hv-leg glass">
        <div class="hd"><div class="t">PROJEKTE</div><div class="s">${P.length} Waben · ${D.totals.sessions} Sessions</div></div>
        <div class="ls scroll">${clusters.map((c, k) => `<button class="pr" data-pk="${c.ci}" style="--a:${c.a.toFixed(2)};--k:${Math.min(k, 16)}"><span class="mh"></span><span class="nm">${esc(c.p.name)}<small>${esc(A.rel(c.p.last))}</small></span><span class="ct">${c.p.sessions.length}</span></button>`).join("")}</div>
        <div class="ft"><div><span class="sw"></span>Leuchtkraft = wie frisch</div><div><span class="rgx"></span>Innenring = Anzahl Schritte</div><div style="color:var(--amber)">${A.ic("bot")}<span style="color:var(--ink-3)">mit Subagents</span></div></div>
      </aside>
      <div class="hv-hud glass"><button data-z="-1" aria-label="Herauszoomen">-</button><span class="z" data-zr>100%</span><button data-z="1" aria-label="Hineinzoomen">+</button><button data-fit>Alles</button></div>
      <div class="hv-hint">Ziehen = bewegen · Scrollen = zoomen</div>
      <div class="hv-tip" data-tip></div>`;

    const world = root.querySelector(".hv-world"), tip = root.querySelector("[data-tip]"), zr = root.querySelector("[data-zr]");
    const cellsByC = new Map(); root.querySelectorAll(".hc").forEach((el) => { const c = +el.dataset.c; (cellsByC.get(c) || cellsByC.set(c, []).get(c)).push(el); });
    const lnk = [...root.querySelectorAll(".lnk")];

    // ---------- Camera with a small spring integrator ----------
    const area = () => { const lw = innerWidth > 760 ? 290 : 0; return { l: lw, t: 60, r: innerWidth, b: innerHeight - 76 }; };
    const cam = { cx: 0, cy: 0, k: 1 }, tgt = { cx: 0, cy: 0, k: 1 }, vel = { cx: 0, cy: 0, k: 0 };
    let raf = 0, last = 0;
    const apply = () => {
      const a = area(), acx = (a.l + a.r) / 2, acy = (a.t + a.b) / 2;
      world.style.transform = `translate(${acx - cam.cx * cam.k}px, ${acy - cam.cy * cam.k}px) scale(${cam.k})`;
      zr.textContent = Math.round(cam.k * 100) + "%";
    };
    const step = (t) => {
      const dt = Math.min(0.032, (t - last) / 1000 || 0.016); last = t;
      let moving = false;
      for (const p of ["cx", "cy", "k"]) {
        const stiff = 120, damp = 17;
        const acc = -stiff * (cam[p] - tgt[p]) - damp * vel[p]; vel[p] += acc * dt; cam[p] += vel[p] * dt;
        if (Math.abs(cam[p] - tgt[p]) > (p === "k" ? 0.0005 : 0.05) || Math.abs(vel[p]) > (p === "k" ? 0.001 : 0.1)) moving = true;
      }
      if (!moving) Object.assign(cam, tgt);
      apply(); raf = moving ? requestAnimationFrame(step) : 0;
    };
    const springTo = (cx, cy, k) => { Object.assign(tgt, { cx, cy, k }); if (reduce) { Object.assign(cam, tgt); return apply(); } if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };
    const setNow = (cx, cy, k) => { cancelAnimationFrame(raf); raf = 0; Object.assign(cam, { cx, cy, k }); Object.assign(tgt, cam); vel.cx = vel.cy = vel.k = 0; apply(); };
    const fitK = () => { const a = area(); return Math.max(0.55, Math.min(1.25, (a.r - a.l - 40) / (B.x1 - B.x0), (a.b - a.t - 20) / (B.y1 - B.y0))); };
    const fit = () => springTo((B.x0 + B.x1) / 2, (B.y0 + B.y1) / 2, fitK());
    setNow((B.x0 + B.x1) / 2, (B.y0 + B.y1) / 2, fitK() * (reduce ? 1 : 0.72));
    if (!reduce) setTimeout(fit, 60); else fit();

    // ---------- Focus a project cluster ----------
    let focusC = null;
    const focus = (ci) => {
      root.querySelectorAll(".hv-leg .pr").forEach((b) => b.classList.toggle("on", +b.dataset.pk === ci));
      focusC = ci; highlight(ci, null);
      if (ci == null) return;
      const c = clusters[ci], ps = [c.hub, ...c.sess];
      const bx0 = Math.min(...ps.map((p) => p.x)) - R, bx1 = Math.max(...ps.map((p) => p.x)) + R, by0 = Math.min(...ps.map((p) => p.y)) - R, by1 = Math.max(...ps.map((p) => p.y)) + R;
      const a = area(), k = Math.max(0.9, Math.min(2.2, (a.r - a.l) * 0.5 / (bx1 - bx0), (a.b - a.t) * 0.55 / (by1 - by0)));
      springTo((bx0 + bx1) / 2, (by0 + by1) / 2, k);
    };

    // ---------- Hover: lift, siblings glow, links draw in ----------
    let hotEl = null;
    const highlight = (ci, el) => {
      if (hotEl && hotEl !== el) hotEl.classList.remove("hot"); hotEl = el; if (el) el.classList.add("hot");
      root.querySelectorAll(".hc.sib").forEach((x) => x.classList.remove("sib"));
      const show = ci ?? focusC;
      world.classList.toggle("dim", show != null);
      if (show != null) (cellsByC.get(show) || []).forEach((x) => x.classList.add("sib"));
      lnk.forEach((g) => g.classList.toggle("on", +g.dataset.c === show));
    };
    const showTip = (el, e) => {
      if (el.classList.contains("p")) {
        const c = clusters[+el.dataset.c];
        tip.innerHTML = `<div class="k">${A.ic("folder")} Projekt</div><b>${esc(c.p.name)}</b><div class="m"><span>${c.p.sessions.length} Sessions</span><span>${c.p.steps} Schritte</span><span>${esc(A.rel(c.p.last))}</span></div><div class="h">Klicken zum Heranzoomen</div>`;
      } else {
        const s = D.sessions.find((x) => x.id === el.dataset.sid);
        tip.innerHTML = `<div class="k">${esc(s.projName)}${s.live ? ` · <span style="color:var(--green)">läuft</span>` : ""}</div><b>${esc(s.label)}</b>
          <div class="m"><span>${A.day(s.end)} ${A.hhmm(s.end)}</span><span>${esc(A.rel(s.end))}</span><span>${s.nodes.length} Schritte</span>${s.agents.length ? `<span style="color:var(--amber)">${s.agents.length} Agents</span>` : ""}</div><div class="h">Klicken zum Öffnen</div>`;
      }
      tip.classList.add("on"); moveTip(e);
    };
    const moveTip = (e) => { const h = tip.offsetHeight, x = e.clientX + 26, y = e.clientY - h - 26 > 8 ? e.clientY - h - 26 : e.clientY + 26; tip.style.left = `${Math.min(x, innerWidth - 276)}px`; tip.style.top = `${Math.min(y, innerHeight - h - 80)}px`; };

    // ---------- Pointer: pan, click, hover ----------
    let drag = null, moved = false;
    const onDown = (e) => {
      if (e.button !== 0 || e.target.closest(".hv-leg,.hv-hud")) return;
      drag = { x: e.clientX, y: e.clientY, cx: cam.cx, cy: cam.cy }; moved = false;
    };
    const onMove = (e) => {
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!moved && Math.hypot(dx, dy) > 4) { moved = true; root.classList.add("drag"); tip.classList.remove("on"); }
        if (moved) { setNow(drag.cx - dx / cam.k, drag.cy - dy / cam.k, cam.k); return; }
      }
      const el = e.target.closest(".hc");
      if (el !== hotEl) { if (el) { highlight(+el.dataset.c, el); showTip(el, e); } else { highlight(null, null); tip.classList.remove("on"); } }
      else if (el) moveTip(e);
    };
    const onUp = () => { drag = null; root.classList.remove("drag"); };
    const onClick = (e) => {
      if (moved) { moved = false; return; }
      const b = e.target.closest("[data-pk]"); if (b) { const ci = +b.dataset.pk; return focus(focusC === ci ? null : ci); }
      const z = e.target.closest("[data-z]"); if (z) { const k = Math.max(0.3, Math.min(3, tgt.k * (+z.dataset.z > 0 ? 1.3 : 1 / 1.3))); return springTo(tgt.cx, tgt.cy, k); }
      if (e.target.closest("[data-fit]")) { focus(null); return fit(); }
      const el = e.target.closest(".hc");
      if (el?.dataset.sid) return A.open(el.dataset.sid);
      if (el) return focus(+el.dataset.c);
      if (!e.target.closest(".hv-leg,.hv-hud") && focusC != null) focus(null);
    };
    const onWheel = (e) => {
      if (e.target.closest(".hv-leg")) return;
      e.preventDefault();
      const a = area(), acx = (a.l + a.r) / 2, acy = (a.t + a.b) / 2;
      const wx = cam.cx + (e.clientX - acx) / cam.k, wy = cam.cy + (e.clientY - acy) / cam.k;
      const k = Math.max(0.3, Math.min(3, cam.k * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018))));
      setNow(wx - (e.clientX - acx) / k, wy - (e.clientY - acy) / k, k);
    };
    const onKey = (e) => { const el = e.target.closest?.(".hc.s"); if (el && e.key === "Enter") A.open(el.dataset.sid); };
    const onLeave = () => { highlight(null, null); tip.classList.remove("on"); };
    root.addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    root.addEventListener("click", onClick);
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("keydown", onKey);
    root.addEventListener("pointerleave", onLeave);
    const onResize = () => apply();
    addEventListener("resize", onResize);

    // Selection from the shared drawer: mark the hex and keep it visible left of the drawer
    hive.onSelect = (id) => {
      root.querySelectorAll(".hc.sel").forEach((x) => x.classList.remove("sel"));
      if (!id) return;
      const el = root.querySelector(`.hc[data-sid="${CSS.escape(id)}"]`); if (!el) return;
      el.classList.add("sel");
      const c = clusters[+el.dataset.c], it = c.sess.find((x) => x.s.id === id);
      const a = area(), visCx = (a.l + Math.min(a.r, innerWidth - 520)) / 2, acx = (a.l + a.r) / 2;
      const k = Math.max(tgt.k, 1.1);
      springTo(it.x + (acx - visCx) / k, it.y, k);
    };

    A.onCleanup(() => {
      cancelAnimationFrame(raf); hive.onSelect = null;
      removeEventListener("pointermove", onMove); removeEventListener("pointerup", onUp); removeEventListener("resize", onResize);
    });
  }

  const hive = { key: "hive", name: "Waben", tagline: "Projekte als Waben-Cluster", css, render, onSelect: null, wantsArrows: false };
  Atlas.register(hive);
})();
