// Look: Galaxie. Each project is a star system, its sessions orbit as planets.
(() => {
  const css = `
@property --inv { syntax: "<number>"; inherits: true; initial-value: 1; }
.lk-galaxy { background: radial-gradient(1200px 700px at 70% 35%, rgba(70,40,140,.28), transparent 60%),
  radial-gradient(900px 600px at 25% 85%, rgba(20,110,140,.22), transparent 60%), radial-gradient(circle at 50% 50%, #0b0d1a, #04050a 75%);
  overflow: hidden; user-select: none; }
.lk-galaxy .gx-stars { position: absolute; left: -5%; top: -5%; width: 1px; height: 1px; border-radius: 50%; transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
.lk-galaxy .gx-stars.t { animation: gxtw 5s ease-in-out infinite alternate; }
.lk-galaxy .gx-stars.t2 { animation: gxtw 7s ease-in-out infinite alternate-reverse; }
@keyframes gxtw { from { opacity: 1; } to { opacity: .35; } }
.lk-galaxy .gx-world { position: absolute; inset: 0; transform-origin: 0 0; transition: transform 1s var(--spring), --inv 1s var(--spring); --inv: 1; }
.lk-galaxy .gx-lanes { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.lk-galaxy .gx-lane-b { fill: none; stroke: rgba(140,190,255,.16); stroke-width: 1.2; vector-effect: non-scaling-stroke; }
.lk-galaxy .gx-lane-d { fill: none; stroke: rgba(120,220,255,.55); stroke-width: 1.2; stroke-dasharray: 3 11; vector-effect: non-scaling-stroke; animation: gxdash 2.4s linear infinite, fadein 1.2s ease both; }
@keyframes gxdash { to { stroke-dashoffset: -28; } }
.lk-galaxy .gx-pt { fill: #bff3ff; filter: drop-shadow(0 0 4px #67e8f9); }
.lk-galaxy .gx-sys { position: absolute; width: 0; height: 0; transition: opacity .6s ease, filter .6s ease; }
.lk-galaxy.focused .gx-sys:not(.on) { opacity: .16; filter: saturate(.3); }
.lk-galaxy .gx-orbit { position: absolute; border-radius: 50%; border: 1px solid hsl(var(--h) 60% 70% / .13); pointer-events: none; }
.lk-galaxy .gx-orbit:first-of-type { border-color: hsl(var(--h) 70% 70% / .22); }
.lk-galaxy .gx-star { position: absolute; width: calc(var(--r) * 2px); height: calc(var(--r) * 2px); left: calc(var(--r) * -1px); top: calc(var(--r) * -1px); border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, #fff 0, hsl(var(--h) 100% 88%) 22%, hsl(var(--h) 90% 62%) 52%, hsl(var(--h) 80% 40%) 100%);
  box-shadow: 0 0 calc(var(--r) * 1px) hsl(var(--h) 90% 60% / .75), 0 0 calc(var(--r) * 3px) hsl(var(--h) 90% 55% / .35), 0 0 calc(var(--r) * 6px) hsl(var(--h) 90% 55% / .15);
  transition: transform .5s var(--spring); animation: gxpulse 4.5s ease-in-out infinite alternate; z-index: 2; }
.lk-galaxy .gx-star:hover { transform: scale(1.18); }
@keyframes gxpulse { to { box-shadow: 0 0 calc(var(--r) * 1.3px) hsl(var(--h) 90% 65% / .9), 0 0 calc(var(--r) * 4px) hsl(var(--h) 90% 55% / .4), 0 0 calc(var(--r) * 8px) hsl(var(--h) 90% 55% / .18); } }
.lk-galaxy .gx-name { position: absolute; left: 0; white-space: nowrap; text-align: center; transform: translateX(-50%) scale(var(--inv)); transform-origin: 50% 0; pointer-events: none; z-index: 3; }
.lk-galaxy .gx-name b { display: block; font: 700 11.5px var(--display); letter-spacing: .14em; text-transform: uppercase; color: hsl(var(--h) 90% 82%); text-shadow: 0 0 12px hsl(var(--h) 90% 50% / .7), 0 1px 2px #000; max-width: 190px; overflow: hidden; text-overflow: ellipsis; }
.lk-galaxy .gx-name small { font: 500 10.5px var(--mono); color: var(--ink-3); text-shadow: 0 1px 2px #000; }
.lk-galaxy .gx-ring { position: absolute; left: 0; top: 0; width: 0; height: 0; animation: gxspin var(--dur) linear infinite var(--del); }
.lk-galaxy .gx-pp { position: absolute; left: 0; top: 0; width: 0; height: 0; }
.lk-galaxy .gx-up { position: absolute; left: 0; top: 0; width: 0; height: 0; animation: gxspin var(--dur) linear infinite reverse var(--del); }
@keyframes gxspin { to { transform: rotate(360deg); } }
.lk-galaxy .gx-sys:hover .gx-ring, .lk-galaxy .gx-sys:hover .gx-up, .lk-galaxy .gx-sys.hot .gx-ring, .lk-galaxy .gx-sys.hot .gx-up { animation-play-state: paused; }
.lk-galaxy .gx-pl { position: absolute; width: calc(var(--s) * 2px); height: calc(var(--s) * 2px); left: calc(var(--s) * -1px); top: calc(var(--s) * -1px); border-radius: 50%;
  background: radial-gradient(circle at 34% 30%, hsl(var(--h) 90% 86%), hsl(var(--h) 80% 58%) 45%, hsl(var(--h) 70% 20%) 100%);
  box-shadow: 0 0 10px hsl(var(--h) 90% 60% / .45); transition: transform .45s var(--spring), box-shadow .3s; z-index: 4; }
.lk-galaxy .gx-pl::after { content: ""; position: absolute; inset: -6px; border-radius: 50%; }
.lk-galaxy .gx-pl:hover, .lk-galaxy .gx-pl.ping { transform: scale(1.6); box-shadow: 0 0 0 2px rgba(255,255,255,.85), 0 0 22px hsl(var(--h) 90% 60% / .9); z-index: 6; }
.lk-galaxy .gx-pl.sel { box-shadow: 0 0 0 2px var(--teal), 0 0 24px var(--teal); }
.lk-galaxy .gx-pl.live::before { content: ""; position: absolute; inset: -5px; border-radius: 50%; border: 1.5px solid var(--green); animation: gxlive 1.8s ease-out infinite; }
@keyframes gxlive { from { transform: scale(.7); opacity: 1; } to { transform: scale(1.8); opacity: 0; } }
.lk-galaxy .gx-pl-l { position: absolute; top: 0; left: calc(var(--s) * 1px + 6px); transform: translateY(-50%) scale(var(--inv)); transform-origin: calc(var(--s) * -1px - 6px) 50%;
  font: 600 11px var(--sans); white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; padding: 2px 7px; border-radius: 7px;
  background: rgba(8,10,20,.62); border: 1px solid hsl(var(--h) 60% 60% / .3); color: var(--ink); backdrop-filter: blur(6px);
  opacity: 0; pointer-events: none; transition: opacity .4s ease; z-index: 5; }
.lk-galaxy .gx-sys.flip .gx-pl-l { left: auto; right: calc(var(--s) * 1px + 6px); transform-origin: calc(100% + var(--s) * 1px + 6px) 50%; }
.lk-galaxy .gx-pl-l.rec, .lk-galaxy .gx-sys.on .gx-pl-l, .lk-galaxy .gx-sys:hover .gx-pl-l { opacity: 1; }
.lk-galaxy.focused .gx-sys:not(.on) .gx-pl-l { opacity: 0; }
.lk-galaxy .gx-hud { position: absolute; left: 16px; top: 16px; width: var(--hw); max-height: calc(100% - 98px); display: flex; flex-direction: column; padding: 16px 12px 12px; z-index: 20;
  background: rgba(10,12,24,.55); border-color: rgba(120,200,255,.18); }
.lk-galaxy .gx-hud::before { content: ""; position: absolute; left: 14px; right: 14px; top: 0; height: 1px; background: linear-gradient(90deg, transparent, #67e8f9, transparent); opacity: .7; }
.lk-galaxy .gx-brand { padding: 0 6px 12px; border-bottom: 1px solid var(--line); margin-bottom: 10px; }
.lk-galaxy .gx-brand h1 { margin: 0; font: 900 17px var(--display); letter-spacing: .2em; color: #e6fbff; text-shadow: 0 0 14px rgba(103,232,249,.55); }
.lk-galaxy .gx-brand .cap { font-family: var(--mono); font-size: 11px; margin-top: 4px; }
.lk-galaxy .gx-sec { font: 700 10px var(--mono); letter-spacing: .18em; text-transform: uppercase; color: #67e8f9; padding: 2px 6px 8px; display: flex; justify-content: space-between; }
.lk-galaxy .gx-list { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 2px; margin: 0 -4px; padding: 0 4px; }
.lk-galaxy .gx-it { display: grid; grid-template-columns: 14px 1fr auto; gap: 9px; align-items: center; padding: 7px 8px; border-radius: 11px; text-align: left; width: 100%;
  transition: background .2s, transform .35s var(--spring); border: 1px solid transparent; }
.lk-galaxy .gx-it:hover { background: rgba(120,200,255,.08); border-color: rgba(120,200,255,.18); transform: translateX(3px); }
.lk-galaxy .gx-it.sel { background: rgba(45,212,191,.1); border-color: rgba(45,212,191,.35); }
.lk-galaxy .gx-it i { width: 12px; height: 12px; border-radius: 50%; background: radial-gradient(circle at 34% 30%, hsl(var(--h) 90% 86%), hsl(var(--h) 80% 55%) 50%, hsl(var(--h) 70% 25%)); box-shadow: 0 0 8px hsl(var(--h) 90% 60% / .6); }
.lk-galaxy .gx-it b { display: block; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-galaxy .gx-it small { display: block; font: 500 11px var(--mono); color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-galaxy .gx-it em { font: 700 11px var(--mono); font-style: normal; color: var(--ink-2); }
.lk-galaxy .gx-help { font-size: 11.5px; color: var(--ink-3); padding: 10px 6px 0; border-top: 1px solid var(--line); margin-top: 8px; line-height: 1.5; }
.lk-galaxy .gx-help b { color: var(--ink-2); font-weight: 600; }
.lk-galaxy .gx-tip { position: fixed; z-index: 40; width: 260px; padding: 12px 14px; pointer-events: none; opacity: 0; transform: translateY(6px) scale(.97);
  transition: opacity .2s, transform .35s var(--spring); background: rgba(12,14,26,.82); border-color: hsl(var(--h, 200) 60% 60% / .4); border-radius: 14px; }
.lk-galaxy .gx-tip.show { opacity: 1; transform: none; }
.lk-galaxy .gx-tip h4 { margin: 2px 0 6px; font-size: 14px; line-height: 1.25; }
.lk-galaxy .gx-tip .k { display: flex; gap: 12px; font: 600 11.5px var(--mono); color: var(--ink-2); margin-bottom: 6px; }
.lk-galaxy .gx-tip .k b { color: var(--ink); }
.lk-galaxy .gx-back { position: absolute; top: 18px; right: 20px; z-index: 25; display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 999px;
  font: 700 11px var(--display); letter-spacing: .14em; text-transform: uppercase; background: rgba(10,12,24,.6); border: 1px solid rgba(120,200,255,.3); color: #cff6ff;
  backdrop-filter: blur(14px); opacity: 0; transform: translateY(-10px); pointer-events: none; transition: opacity .3s, transform .5s var(--spring); }
.lk-galaxy.focused .gx-back { opacity: 1; transform: none; pointer-events: auto; }
.lk-galaxy .gx-back:hover { border-color: #67e8f9; }
.lk-galaxy .gx-sys.enter { animation: gxin 1s var(--spring) both; animation-delay: calc(var(--i) * 60ms + 100ms); }
@keyframes gxin { from { opacity: 0; transform: scale(.4); } }
@media (prefers-reduced-motion: reduce) {
  .lk-galaxy .gx-ring, .lk-galaxy .gx-up, .lk-galaxy .gx-star, .lk-galaxy .gx-stars, .lk-galaxy .gx-lane-d { animation: none !important; }
  .lk-galaxy .gx-pt { display: none; }
}`;

  // Deterministic pseudo random in [0,1) from a string
  const rnd = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; };
  const RING_CAP = [1, 2, 3, 5, 8, 13, 21];
  let rootEl = null;

  function render(root, A) {
    rootEl = root;
    const D = A.DATA, esc = A.esc;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = root.clientWidth || innerWidth, H = root.clientHeight || innerHeight;
    const hudW = W < 1150 ? 248 : 290;
    const ax0 = hudW + 40, ax1 = W - 30, ay0 = 34, ay1 = H - 96;
    const aw = ax1 - ax0, ah = ay1 - ay0;

    // Layout: systems newest first in a serpentine grid
    const projs = D.projects.slice().sort((a, b) => b.last.localeCompare(a.last));
    const n = projs.length;
    const cols = Math.min(n, Math.max(1, Math.round(Math.sqrt((n * aw) / ah))));
    const rows = Math.ceil(n / cols);
    const cw = aw / cols, ch = ah / rows;
    const sys = projs.map((p) => {
      const rings = []; let k = 0;
      for (const s of p.sessions) { (rings[k] ||= []).push(s); if (rings[k].length >= RING_CAP[k]) k++; }
      const rs = Math.min(24, 6 + Math.sqrt(p.steps) * 1.05);
      return { p, rings, rsRaw: rs };
    });
    const outerRaw = (x) => x.rsRaw + 18 + (x.rings.length - 1) * 15 + 8;
    const maxRaw = Math.max(...sys.map(outerRaw));
    const sc = Math.max(0.5, Math.min(1.2, (Math.min(cw, ch * 0.9) * 0.43) / maxRaw));
    sys.forEach((x, i) => {
      const r = Math.floor(i / cols); let c = i % cols; if (r % 2) c = cols - 1 - c;
      const inRow = r === rows - 1 ? n - r * cols : cols;
      const off = r === rows - 1 && inRow < cols ? ((cols - inRow) * cw) / 2 * (r % 2 ? -1 : 1) : 0;
      x.cx = ax0 + (c + 0.5) * cw + off + (rnd(x.p.path + "x") - 0.5) * cw * 0.22;
      x.cy = ay0 + (r + 0.5) * ch + (rnd(x.p.path + "y") - 0.5) * ch * 0.16;
      x.rs = x.rsRaw * Math.max(sc, 0.7);
      x.ringR = x.rings.map((_, j) => (x.rsRaw + 18 + j * 15) * sc);
      x.R = (x.ringR[x.ringR.length - 1] || x.rs) + 8;
    });

    // Always label the newest session of every system; the rest show on hover or zoom
    const recent = new Set(projs.map((p) => p.sessions[0].id));
    const planetSize = (s) => Math.min(11, 3 + Math.sqrt(s.nodes.length) * 0.95) * Math.max(sc, 0.8);

    // Starfield layers built from box-shadows
    const field = (count, size, alpha, seed) => {
      const out = []; let h = seed;
      const r = () => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return (h % 100000) / 100000; };
      for (let i = 0; i < count; i++) { const a = (alpha * (0.4 + r() * 0.6)).toFixed(2); const tint = r() < 0.15 ? "190,230,255" : r() < 0.1 ? "255,220,190" : "255,255,255";
        out.push(`${Math.round(r() * W * 1.1)}px ${Math.round(r() * H * 1.1)}px 0 ${size}px rgba(${tint},${a})`); }
      return out.join(",");
    };

    const sysHtml = sys.map((x, i) => {
      const p = x.p;
      const orbits = x.ringR.map((r) => `<div class="gx-orbit" style="width:${2 * r}px;height:${2 * r}px;left:${-r}px;top:${-r}px"></div>`).join("");
      const rings = x.rings.map((ring, j) => {
        const r = x.ringR[j], dur = 140 + j * 70, del = -rnd(p.path + j) * dur;
        const pl = ring.map((s, q) => {
          const a = (360 / ring.length) * q + rnd(s.id) * 25;
          const sz = planetSize(s);
          return `<div class="gx-pp" style="transform:rotate(${a.toFixed(1)}deg) translateX(${r.toFixed(1)}px) rotate(${(-a).toFixed(1)}deg)"><div class="gx-up">
            <button class="gx-pl ${s.live ? "live" : ""}" data-sid="${s.id}" style="--s:${sz.toFixed(1)}" aria-label="${esc(s.label)}"></button>
            <span class="gx-pl-l ${recent.has(s.id) ? "rec" : ""}" style="--s:${sz.toFixed(1)}">${esc(s.label)}</span></div></div>`;
        }).join("");
        return `<div class="gx-ring" style="--dur:${dur}s;--del:${del.toFixed(1)}s">${pl}</div>`;
      }).join("");
      return `<div class="gx-sys enter ${x.cx + x.R + 150 > W ? "flip" : ""}" data-p="${i}" style="left:${x.cx.toFixed(1)}px;top:${x.cy.toFixed(1)}px;--h:${p.hue};--i:${i}">
        ${orbits}<button class="gx-star" data-star="${i}" style="--r:${x.rs.toFixed(1)}" aria-label="System ${esc(p.name)} heranholen"></button>
        <div class="gx-name" style="top:${(x.R + 4).toFixed(1)}px"><b>${esc(p.name)}</b><small>${p.sessions.length} ${p.sessions.length === 1 ? "Session" : "Sessions"} · ${A.relShort(p.last)}</small></div>
        ${rings}</div>`;
    }).join("");

    // Hyperspace lanes: oldest -> newest by last activity
    const chrono = sys.slice().sort((a, b) => a.p.last.localeCompare(b.p.last));
    let lanes = "", parts = "";
    for (let i = 0; i < chrono.length - 1; i++) {
      const a = chrono[i], b = chrono[i + 1];
      const dx = b.cx - a.cx, dy = b.cy - a.cy, len = Math.hypot(dx, dy) || 1;
      const bend = (i % 2 ? 1 : -1) * 0.16 * len;
      const mx = (a.cx + b.cx) / 2 - (dy / len) * bend, my = (a.cy + b.cy) / 2 + (dx / len) * bend;
      const d = `M${a.cx.toFixed(1)},${a.cy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b.cx.toFixed(1)},${b.cy.toFixed(1)}`;
      lanes += `<path class="gx-lane-b draw" id="gxl${i}" style="--i:${i};--len:${Math.round(len * 1.15)}" d="${d}"/><path class="gx-lane-d" style="animation-delay:0s,${(0.3 + i * 0.05).toFixed(2)}s" d="${d}"/>`;
      if (!reduce) parts += `<circle class="gx-pt" r="1.8"><animateMotion dur="${(len / 70 + 2).toFixed(1)}s" repeatCount="indefinite" begin="${(1 + i * 0.37).toFixed(2)}s"><mpath href="#gxl${i}"/></animateMotion></circle>`;
    }

    const top = D.sessions.slice(0, 8);
    const hud = `<aside class="gx-hud glass" style="--hw:${hudW}px">
      <div class="gx-brand"><h1>GALAXIE</h1><div class="cap">${n} Systeme · ${D.totals.sessions} Sessions · ${D.totals.steps} Schritte</div></div>
      <div class="gx-sec"><span>Zuletzt aktiv</span><span>${top.length}</span></div>
      <div class="gx-list scroll">${top.map((s, i) => `<button class="gx-it in" data-open="${s.id}" data-hl="${s.id}" style="--h:${s.hue};--i:${i + 2}">
        <i></i><span style="min-width:0"><b>${esc(s.label)}</b><small>${s.live ? "● " : ""}${esc(s.projName)} · ${s.nodes.length} Schritte</small></span><em>${A.relShort(s.end)}</em></button>`).join("")}</div>
      <div class="gx-help"><b>Planet</b> = Session, anklicken öffnet sie. <b>Stern</b> = Projekt, anklicken holt das System heran. Innere Bahn = jüngste Session.</div>
    </aside>`;

    root.innerHTML = `
      <div class="gx-stars" style="box-shadow:${field(220, 0.2, 0.55, 7)}"></div>
      <div class="gx-stars t" style="box-shadow:${field(90, 0.6, 0.75, 31)}"></div>
      <div class="gx-stars t2" style="box-shadow:${field(28, 1.1, 0.9, 97)}"></div>
      <div class="gx-world"><svg class="gx-lanes" width="${W}" height="${H}">${lanes}${parts}</svg>${sysHtml}</div>
      ${hud}
      <button class="gx-back">${A.ic("x")} Übersicht</button>
      <div class="gx-tip glass"></div>`;

    const world = root.querySelector(".gx-world"), tip = root.querySelector(".gx-tip");
    const layers = [...root.querySelectorAll(".gx-stars")];
    const byId = Object.fromEntries(D.sessions.map((s) => [s.id, s]));

    // Parallax on the starfield
    const onMove = (e) => {
      const fx = e.clientX / W - 0.5, fy = e.clientY / H - 0.5;
      layers.forEach((l, i) => { l.style.transform = `translate(${(-fx * (i + 1) * 9).toFixed(1)}px,${(-fy * (i + 1) * 7).toFixed(1)}px)`; });
    };
    if (!reduce) root.addEventListener("mousemove", onMove);

    // Focus / zoom a system
    let focused = -1;
    function focus(i) {
      const x = sys[i]; focused = i;
      const mx = (ax0 + ax1) / 2, my = (ay0 + ay1) / 2;
      const k = Math.min(2.6, Math.max(1.2, (Math.min(aw, ah) * 0.36) / x.R));
      world.style.transform = `translate(${(mx - k * x.cx).toFixed(1)}px,${(my - k * x.cy).toFixed(1)}px) scale(${k.toFixed(3)})`;
      world.style.setProperty("--inv", (1 / k).toFixed(3));
      root.classList.add("focused");
      root.querySelectorAll(".gx-sys").forEach((el) => el.classList.toggle("on", +el.dataset.p === i));
    }
    function unfocus() {
      focused = -1; world.style.transform = ""; world.style.setProperty("--inv", "1");
      root.classList.remove("focused"); root.querySelectorAll(".gx-sys.on").forEach((el) => el.classList.remove("on"));
    }

    root.addEventListener("click", (e) => {
      const pl = e.target.closest(".gx-pl");
      if (pl) { hideTip(); return A.open(pl.dataset.sid); }
      const st = e.target.closest("[data-star]");
      if (st) { const i = +st.dataset.star; return focused === i ? unfocus() : focus(i); }
      if (e.target.closest(".gx-back")) return unfocus();
      if (focused >= 0 && !e.target.closest(".gx-sys,.gx-hud")) unfocus();
    });

    // Tooltip card for planets
    function hideTip() { tip.classList.remove("show"); }
    root.addEventListener("mouseover", (e) => {
      const pl = e.target.closest(".gx-pl");
      if (!pl) return;
      const s = byId[pl.dataset.sid]; if (!s) return;
      const ags = s.agents.length ? s.agents.map((a) => A.aName(a.type)).slice(0, 3).join(", ") + (s.agents.length > 3 ? " …" : "") : "nur Claude";
      tip.style.setProperty("--h", s.hue);
      tip.innerHTML = `<div class="cap mono" style="color:hsl(${s.hue} 80% 72%)">${esc(s.projName)}${s.live ? ` · <span style="color:var(--green)">läuft</span>` : ""}</div>
        <h4>${esc(s.label)}</h4>
        <div class="k"><span>${A.day(s.end)} ${A.hhmm(s.end)}</span><span>${A.rel(s.end)}</span></div>
        <div class="k"><span><b>${s.nodes.length}</b> Schritte</span><span><b>${1 + s.agents.length}</b> Agents</span></div>
        <div class="row">${s.modelList.slice(0, 3).map(A.mp).join("")}<span class="tag">${esc(ags)}</span></div>`;
      const r = pl.getBoundingClientRect();
      let tx = r.right + 14, ty = r.top - 20;
      if (tx + 270 > W) tx = r.left - 274;
      ty = Math.max(12, Math.min(H - 190, ty));
      tip.style.left = tx + "px"; tip.style.top = ty + "px";
      tip.classList.add("show");
    });
    root.addEventListener("mouseout", (e) => { if (e.target.closest(".gx-pl") && !e.relatedTarget?.closest?.(".gx-pl")) hideTip(); });

    // HUD hover pings the planet and pauses its system
    root.querySelector(".gx-list").addEventListener("mouseover", (e) => {
      const it = e.target.closest("[data-hl]");
      root.querySelectorAll(".gx-pl.ping").forEach((el) => el.classList.remove("ping"));
      root.querySelectorAll(".gx-sys.hot").forEach((el) => el.classList.remove("hot"));
      if (!it) return;
      const pl = root.querySelector(`.gx-pl[data-sid="${it.dataset.hl}"]`);
      if (pl) { pl.classList.add("ping"); pl.closest(".gx-sys").classList.add("hot"); }
    });
    root.querySelector(".gx-list").addEventListener("mouseleave", () => {
      root.querySelectorAll(".gx-pl.ping").forEach((el) => el.classList.remove("ping"));
      root.querySelectorAll(".gx-sys.hot").forEach((el) => el.classList.remove("hot"));
    });

    // Esc leaves the zoomed system (only when no drawer is open)
    const onKey = (e) => { if (e.key === "Escape" && focused >= 0 && !document.getElementById("drawer")?.classList.contains("open")) unfocus(); };
    document.addEventListener("keydown", onKey, true);
    A.onCleanup(() => { document.removeEventListener("keydown", onKey, true); rootEl = null; });
  }

  function onSelect(id) {
    if (!rootEl) return;
    rootEl.querySelectorAll(".gx-pl.sel,.gx-it.sel").forEach((el) => el.classList.remove("sel"));
    if (!id) return;
    rootEl.querySelectorAll(`.gx-pl[data-sid="${id}"],.gx-it[data-open="${id}"]`).forEach((el) => el.classList.add("sel"));
  }

  Atlas.register({ key: "galaxy", name: "Galaxie", tagline: "Projekte als Sternsysteme", css, render, onSelect, wantsArrows: false });
})();
