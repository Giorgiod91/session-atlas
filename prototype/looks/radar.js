// Look: Radar. Sonar screen: distance = how long ago, angle sector = project. A rotating sweep reveals blips
// that fade until the next pass; live sessions pulse permanently. Contacts list + HUD readout on the side.
(function () {
  const css = `
.lk-radar { --ph: #5dffc4; --ph2: #2dd4bf; --amb: #ffc861; background: radial-gradient(1000px 800px at 55% 50%, #04140f, #010605 70%); overflow: hidden; user-select: none; -webkit-user-select: none; font-family: var(--mono); }
.lk-radar canvas.rd-c { position: absolute; inset: 0; width: 100%; height: 100%; }
.lk-radar.hov canvas.rd-c { cursor: pointer; }
.lk-radar .rd-crt { position: absolute; inset: 0; pointer-events: none; z-index: 5;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px); mix-blend-mode: multiply; animation: rdFlick 5s steps(1) infinite; }
@keyframes rdFlick { 0%, 100% { opacity: .85; } 47% { opacity: .7; } 48% { opacity: .9; } }
.lk-radar .rd-noise { position: absolute; inset: -40%; pointer-events: none; z-index: 5; opacity: .06; mix-blend-mode: screen;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: rdGrain .9s steps(5) infinite; }
@keyframes rdGrain { 0% { transform: translate(0,0); } 25% { transform: translate(-4%,3%); } 50% { transform: translate(3%,-2%); } 75% { transform: translate(-2%,-4%); } 100% { transform: translate(0,0); } }
.lk-radar .rd-vig { position: absolute; inset: 0; pointer-events: none; z-index: 4; background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.75) 100%); }

/* Glass panels with a phosphor tint */
.lk-radar .rd-p { position: absolute; z-index: 6; border-radius: 16px; background: rgba(4,22,17,.55); border: 1px solid rgba(93,255,196,.18);
  backdrop-filter: blur(16px) saturate(140%); -webkit-backdrop-filter: blur(16px) saturate(140%);
  box-shadow: 0 0 0 1px rgba(0,0,0,.4), 0 0 40px rgba(45,212,191,.06) inset, 0 18px 40px rgba(0,0,0,.5); }
.lk-radar .rd-p::before { content: ""; position: absolute; inset: 6px; border-radius: 11px; pointer-events: none;
  background: linear-gradient(var(--ph), var(--ph)) left top / 10px 1px no-repeat, linear-gradient(var(--ph), var(--ph)) left top / 1px 10px no-repeat,
    linear-gradient(var(--ph), var(--ph)) right top / 10px 1px no-repeat, linear-gradient(var(--ph), var(--ph)) right top / 1px 10px no-repeat,
    linear-gradient(var(--ph), var(--ph)) left bottom / 10px 1px no-repeat, linear-gradient(var(--ph), var(--ph)) left bottom / 1px 10px no-repeat,
    linear-gradient(var(--ph), var(--ph)) right bottom / 10px 1px no-repeat, linear-gradient(var(--ph), var(--ph)) right bottom / 1px 10px no-repeat; opacity: .55; }
.lk-radar .rd-h { display: flex; align-items: baseline; gap: 8px; padding: 14px 16px 8px; font: 700 10.5px var(--mono); letter-spacing: .2em; color: var(--ph); text-shadow: 0 0 10px rgba(93,255,196,.5); }
.lk-radar .rd-h small { margin-left: auto; letter-spacing: .08em; color: rgba(93,255,196,.55); font-weight: 600; text-shadow: none; }

.lk-radar .rd-list { left: 16px; top: 16px; bottom: 80px; width: 318px; display: flex; flex-direction: column; animation: rdIn .7s var(--spring) both; }
@keyframes rdIn { from { opacity: 0; transform: translateX(-20px); } }
.lk-radar .rd-rows { flex: 1; min-height: 0; padding: 0 8px 14px; -webkit-mask-image: linear-gradient(#000 90%, transparent); mask-image: linear-gradient(#000 90%, transparent); }
.lk-radar .rd-row { width: 100%; display: grid; grid-template-columns: 26px minmax(0,1fr) auto; gap: 8px; align-items: center; padding: 7px 8px; border-radius: 9px; text-align: left; position: relative;
  border: 1px solid transparent; transition: background .15s, border-color .15s; }
.lk-radar .rd-row:hover, .lk-radar .rd-row.on { background: rgba(255,200,97,.08); border-color: rgba(255,200,97,.35); }
.lk-radar .rd-row .no { font: 400 17px "VT323", monospace; color: rgba(93,255,196,.5); }
.lk-radar .rd-row.on .no { color: var(--amb); }
.lk-radar .rd-row .t { min-width: 0; }
.lk-radar .rd-row b { display: block; font: 600 12.5px var(--sans); color: #d6fff0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-radar .rd-row small { --h: 170; display: flex; align-items: center; gap: 6px; font: 500 10.5px var(--mono); color: rgba(160,230,205,.55); white-space: nowrap; overflow: hidden; }
.lk-radar .rd-row small i { width: 6px; height: 6px; border-radius: 1px; background: hsl(var(--h) 75% 62%); flex: none; }
.lk-radar .rd-row small span { overflow: hidden; text-overflow: ellipsis; }
.lk-radar .rd-row .ag { font: 400 16px "VT323", monospace; color: rgba(93,255,196,.7); text-align: right; line-height: 1; }
.lk-radar .rd-row .ag.live { color: var(--ph); text-shadow: 0 0 8px var(--ph); animation: blink 1.2s ease-in-out infinite; }
.lk-radar .rd-sep { padding: 10px 8px 4px; font: 700 9.5px var(--mono); letter-spacing: .22em; color: rgba(93,255,196,.4); }

.lk-radar .rd-det { right: 16px; top: 16px; width: 300px; padding-bottom: 14px; transition: right .65s var(--spring); animation: rdIn2 .7s var(--spring) .1s both; }
@keyframes rdIn2 { from { opacity: 0; transform: translateX(20px); } }
.lk-radar .rd-det .bd { padding: 2px 16px 0; }
.lk-radar .rd-det .tt { font: 700 16px var(--sans); color: #eafff7; line-height: 1.25; margin: 2px 0 10px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; min-height: 40px; }
.lk-radar .rd-det dl { margin: 0; display: grid; grid-template-columns: auto minmax(0,1fr); gap: 5px 12px; font-size: 11px; }
.lk-radar .rd-det dt { color: rgba(93,255,196,.5); letter-spacing: .14em; font-weight: 700; font-size: 9.5px; padding-top: 3px; }
.lk-radar .rd-det dd { margin: 0; font: 400 18px/1 "VT323", monospace; color: var(--ph); text-shadow: 0 0 8px rgba(93,255,196,.45); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-radar .rd-det dd.amb { color: var(--amb); text-shadow: 0 0 8px rgba(255,200,97,.5); }
.lk-radar .rd-det .bar { height: 6px; margin: 12px 0 4px; border-radius: 2px; background: rgba(93,255,196,.08); overflow: hidden; }
.lk-radar .rd-det .bar i { display: block; height: 100%; background: repeating-linear-gradient(90deg, var(--ph) 0 4px, transparent 4px 6px); box-shadow: 0 0 10px var(--ph); transition: width .5s var(--spring); }
.lk-radar .rd-det .go { margin-top: 12px; width: 100%; height: 36px; border-radius: 9px; font: 700 11px var(--mono); letter-spacing: .2em; color: #021510; background: var(--ph);
  box-shadow: 0 0 22px rgba(93,255,196,.4); transition: transform .3s var(--spring), filter .2s; }
.lk-radar .rd-det .go:hover { filter: brightness(1.1); transform: translateY(-1px); }
.lk-radar .rd-det .go:active { transform: scale(.96); }
.lk-radar .rd-top { position: absolute; z-index: 6; top: 22px; left: 50%; transform: translateX(-50%); display: flex; justify-content: center; pointer-events: none; white-space: nowrap; }
.lk-radar .rd-top span { font: 400 20px "VT323", monospace; letter-spacing: .14em; color: var(--ph); text-shadow: 0 0 10px rgba(93,255,196,.6); padding: 2px 14px; border-radius: 8px; background: rgba(1,8,6,.55); }
.lk-radar .rd-top span em { font-style: normal; color: var(--amb); text-shadow: 0 0 10px rgba(255,200,97,.6); }
.lk-radar .rd-boot { position: absolute; z-index: 7; left: 50%; top: 50%; transform: translate(-50%,-50%); font: 400 26px "VT323", monospace; letter-spacing: .25em; color: var(--ph); text-shadow: 0 0 14px var(--ph); pointer-events: none; transition: opacity .4s; white-space: nowrap; }
.lk-radar .rd-boot.off { opacity: 0; }
@media (max-width: 1240px) {
  .lk-radar .rd-det { right: auto; left: 16px; top: auto; bottom: 80px; width: 318px; }
  .lk-radar .rd-det .tt { -webkit-line-clamp: 2; min-height: 0; }
  .lk-radar .rd-det .bar, .lk-radar .rd-det .go, .lk-radar .rd-det .wide { display: none; }
  .lk-radar .rd-list { bottom: 296px; }
}
@media (prefers-reduced-motion: reduce) { .lk-radar .rd-crt, .lk-radar .rd-noise, .lk-radar .rd-row .ag.live { animation: none; } }
`;

  let st = null;

  function render(root, A) {
    const { sessions, projects } = A.DATA;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skipBoot = reduce || window.__ATLAS_TEST;
    const now = Date.now(), HOUR = 36e5, DAY = 864e5;
    const mid = new Date(); mid.setHours(0, 0, 0, 0);
    const todayAge = Math.max(HOUR * 1.5, now - mid.getTime());
    const TAU = Math.PI * 2;
    const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
    const live = sessions.filter((s) => s.live).length;

    root.innerHTML = `
      <canvas class="rd-c"></canvas>
      <div class="rd-top"><span>SEKTOR-SCAN · ${sessions.length} KONTAKTE${live ? ` · <em>${live} AKTIV</em>` : ""} · <b class="rd-clk"></b></span></div>
      <aside class="rd-p rd-list"><div class="rd-h">KONTAKTE<small>nach Nähe</small></div><div class="rd-rows scroll"></div></aside>
      <aside class="rd-p rd-det"></aside>
      <div class="rd-boot">${skipBoot ? "" : "SYSTEM BEREIT_"}</div>
      <div class="rd-vig"></div><div class="rd-noise"></div><div class="rd-crt"></div>`;
    const cv = root.querySelector("canvas"), ctx = cv.getContext("2d");
    const rowsEl = root.querySelector(".rd-rows"), det = root.querySelector(".rd-det"), clk = root.querySelector(".rd-clk"), boot = root.querySelector(".rd-boot");

    // ---------- Model ----------
    const bands = [
      { name: "1 STD", max: HOUR, r0: 0.07, r1: 0.25 },
      { name: "HEUTE", max: todayAge, r0: 0.25, r1: 0.5 },
      { name: "WOCHE", max: 7 * DAY, r0: 0.5, r1: 0.75 },
      { name: "ÄLTER", max: Math.max(8 * DAY, ...sessions.map((s) => now - Date.parse(s.end))) + DAY, r0: 0.75, r1: 0.95 },
    ];
    const distOf = (age) => {
      let prev = 0;
      for (const b of bands) { if (age <= b.max) { const t = (age - prev) / (b.max - prev); return { r: b.r0 + (b.r1 - b.r0) * Math.sqrt(Math.max(0, t)), band: b }; } prev = b.max; }
      return { r: 0.95, band: bands[3] };
    };
    const projOrder = projects.slice().sort((a, b) => b.last.localeCompare(a.last));
    const span = TAU / projOrder.length;
    projOrder.forEach((p, i) => { p._a0 = -Math.PI / 2 + i * span; });
    const blips = [];
    projOrder.forEach((p) => {
      const l = p.sessions.slice().sort((a, b) => a.end.localeCompare(b.end));
      l.forEach((s, j) => {
        const d = distOf(now - Date.parse(s.end));
        const a = p._a0 + span * (l.length === 1 ? 0.5 : 0.2 + 0.6 * (j / (l.length - 1)));
        blips.push({ s, p, a, rn: d.r, band: d.band, size: 2.6 + Math.sqrt(s.nodes.length) * 0.75, x: 0, y: 0 });
      });
    });
    const order = sessions.slice(); // newest first
    const blipOf = Object.fromEntries(blips.map((b) => [b.s.id, b]));
    order.forEach((s, i) => (blipOf[s.id].no = i + 1));

    // ---------- Layout ----------
    let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 100;
    function layout() {
      dpr = Math.min(2, devicePixelRatio || 1); W = root.clientWidth; H = root.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      const L = root.querySelector(".rd-list").getBoundingClientRect().right + 10;
      const dr = det.getBoundingClientRect();
      const Rt = dr.top < 100 && dr.left > W / 2 ? dr.left - 10 : W - 10;
      const top = 58, bot = H - 76;
      cx = (L + Rt) / 2; cy = (top + bot) / 2;
      R = Math.max(80, Math.min((Rt - L) / 2 - 112, (bot - top) / 2 - 22));
      root.querySelector(".rd-top").style.left = cx + "px";
      // Place blips, then relax overlaps a little in screen space
      blips.forEach((b) => { b.x = cx + Math.cos(b.a) * b.rn * R; b.y = cy + Math.sin(b.a) * b.rn * R; });
      for (let it = 0; it < 40; it++) for (let i = 0; i < blips.length; i++) for (let j = i + 1; j < blips.length; j++) {
        const a = blips[i], b = blips[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.1, min = a.size + b.size + 9;
        if (d < min) { const o = (min - d) / 2; a.x -= dx / d * o; a.y -= dy / d * o; b.x += dx / d * o; b.y += dy / d * o; }
      }
      blips.forEach((b) => { b.ang = Math.atan2(b.y - cy, b.x - cx); });
    }

    // ---------- Panels ----------
    let hover = null, sel = null;
    function renderRows() {
      let html = "", lastBand = null;
      order.forEach((s) => {
        const b = blipOf[s.id];
        if (b.band !== lastBand) { html += `<div class="rd-sep">${b.band === bands[0] ? "ZONE 1 · LETZTE STUNDE" : b.band === bands[1] ? "ZONE 2 · HEUTE" : b.band === bands[2] ? "ZONE 3 · DIESE WOCHE" : "ZONE 4 · ÄLTER"}</div>`; lastBand = b.band; }
        html += `<button class="rd-row" data-id="${s.id}"><span class="no">${String(b.no).padStart(2, "0")}</span>
          <span class="t"><b>${A.esc(s.label)}</b><small style="--h:${s.hue}"><i></i><span>${A.esc(s.projName)} · ${s.nodes.length} Schr.</span></small></span>
          <span class="ag ${s.live ? "live" : ""}">${s.live ? "LIVE" : A.relShort(s.end).toUpperCase()}</span></button>`;
      });
      rowsEl.innerHTML = html;
    }
    const bearing = (b) => Math.round(((b.ang + Math.PI / 2) / TAU * 360 + 720) % 360);
    function renderDet() {
      const b = hover || (sel && blipOf[sel]) || blipOf[order[0].id], s = b.s;
      const maxSteps = Math.max(...sessions.map((x) => x.nodes.length));
      det.innerHTML = `<div class="rd-h">${hover ? "ZIEL ERFASST" : sel ? "ZIEL GEWÄHLT" : "LETZTER KONTAKT"}<small>#${String(b.no).padStart(2, "0")}</small></div>
        <div class="bd"><div class="tt">${A.esc(s.label)}</div>
        <dl><dt>PROJEKT</dt><dd>${A.esc(s.projName.toUpperCase())}</dd>
          <dt>ZEIT</dt><dd class="${s.live ? "amb" : ""}">${s.live ? "LIVE" : A.esc(A.rel(s.end).toUpperCase())}</dd>
          <dt class="wide">DATUM</dt><dd class="wide">${A.esc(A.day(s.end).toUpperCase())} ${A.hhmm(s.end)}</dd>
          <dt>SCHRITTE</dt><dd>${String(s.nodes.length).padStart(3, "0")}</dd>
          <dt>AGENTS</dt><dd>${1 + s.agents.length}${s.agents.length ? ` <span style="opacity:.6">(+${s.agents.length} SUB)</span>` : ""}</dd>
          <dt class="wide">PEILUNG</dt><dd class="wide">${String(bearing(b)).padStart(3, "0")}° · ${b.band.name}</dd></dl>
        <div class="bar"><i style="width:${Math.max(3, (s.nodes.length / maxSteps) * 100)}%"></i></div>
        <button class="go" data-open="${s.id}">ÖFFNEN ▸</button></div>`;
    }
    function setHover(b, fromList) {
      if (b === hover) return;
      hover = b; root.classList.toggle("hov", !!b);
      rowsEl.querySelectorAll(".rd-row.on").forEach((r) => r.classList.remove("on"));
      if (b) { const r = rowsEl.querySelector(`[data-id="${b.s.id}"]`); if (r) { r.classList.add("on"); if (!fromList) r.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }); } }
      renderDet();
    }
    renderRows();
    rowsEl.addEventListener("pointerover", (e) => { const r = e.target.closest(".rd-row"); if (r) setHover(blipOf[r.dataset.id], true); });
    rowsEl.addEventListener("pointerleave", () => setHover(null));
    rowsEl.addEventListener("click", (e) => { const r = e.target.closest(".rd-row"); if (r) A.open(r.dataset.id); });

    // ---------- Pointer on scope ----------
    let T = 0, sats = [];
    function pick(mx, my) {
      let best = null, bd = 1e9;
      for (const s of sats) { const d = Math.hypot(s.x - mx, s.y - my); if (d < 6 && d < bd) { bd = d; best = s; } }
      if (best) return best;
      for (const b of blips) { const d = Math.hypot(b.x - mx, b.y - my); if (d < b.size + 8 && d < bd) { bd = d; best = b; } }
      return best;
    }
    let skipBootNow = skipBoot;
    cv.addEventListener("pointermove", (e) => { const h = pick(e.clientX, e.clientY); setHover(h ? (h.parent || h) : null); hoverSat = h && h.parent ? h : null; });
    cv.addEventListener("pointerleave", () => setHover(null));
    cv.addEventListener("click", (e) => {
      skipBootNow = true;
      const h = pick(e.clientX, e.clientY); if (!h) return;
      if (h.parent) A.open(h.parent.s.id, h.ag.node); else A.open(h.s.id);
    });
    let hoverSat = null;

    // ---------- Draw ----------
    const PH = "93,255,196", AMB = "255,200,97";
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const bootP = skipBootNow ? 1 : Math.min(1, T / 1.4);
      const eo = 1 - Math.pow(1 - bootP, 3);
      const RR = R * eo;
      const sw = reduce ? -Math.PI / 2 + 0.001 : (T * TAU / 6) - Math.PI / 2;

      // Scope disc
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.05);
      g.addColorStop(0, "rgba(20,70,52,.38)"); g.addColorStop(0.7, "rgba(8,40,30,.25)"); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.05, 0, TAU); ctx.fill();

      // Sector dividers and labels
      ctx.lineWidth = 1;
      projOrder.forEach((p) => {
        const a = p._a0;
        ctx.strokeStyle = `rgba(${PH},.10)`;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * RR * 0.07, cy + Math.sin(a) * RR * 0.07); ctx.lineTo(cx + Math.cos(a) * RR, cy + Math.sin(a) * RR); ctx.stroke();
        // rim tick colored by project
        ctx.strokeStyle = `hsla(${p.hue},80%,62%,.8)`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, RR + 4, a + 0.03, a + span - 0.03); ctx.stroke(); ctx.lineWidth = 1;
        if (bootP < 1) return;
        const m = a + span / 2, lx = cx + Math.cos(m) * (R + 16), ly = cy + Math.sin(m) * (R + 16);
        const hot = hover && hover.p === p;
        ctx.font = `${hot ? 700 : 600} 10.5px "JetBrains Mono", monospace`;
        ctx.textAlign = Math.cos(m) > 0.25 ? "left" : Math.cos(m) < -0.25 ? "right" : "center";
        ctx.textBaseline = Math.sin(m) > 0.5 ? "top" : Math.sin(m) < -0.5 ? "bottom" : "middle";
        ctx.fillStyle = hot ? `rgba(${AMB},1)` : `rgba(${PH},.62)`;
        ctx.fillText(trunc(p.name.toUpperCase(), 15), lx, ly);
      });

      // Rings
      bands.forEach((b, i) => {
        ctx.strokeStyle = `rgba(${PH},${i === 3 ? 0.35 : 0.2})`; ctx.setLineDash(i === 3 ? [] : [2, 4]);
        ctx.beginPath(); ctx.arc(cx, cy, RR * b.r1, 0, TAU); ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(${PH},.08)`;
      ctx.beginPath(); ctx.moveTo(cx - RR, cy); ctx.lineTo(cx + RR, cy); ctx.moveTo(cx, cy - RR); ctx.lineTo(cx, cy + RR); ctx.stroke();
      // fine degree ticks
      for (let d = 0; d < 72; d++) {
        const a = d / 72 * TAU, l = d % 6 ? 4 : 9;
        ctx.strokeStyle = `rgba(${PH},${d % 6 ? 0.18 : 0.4})`;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (RR - l), cy + Math.sin(a) * (RR - l)); ctx.lineTo(cx + Math.cos(a) * RR, cy + Math.sin(a) * RR); ctx.stroke();
      }
      // Ring labels along the upper-left diagonal
      if (bootP >= 1) {
        ctx.font = `400 15px VT323, monospace`; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        // Labels sit on the sector boundary at 12 o'clock, right on each ring, where no blip can be
        ctx.textAlign = "center";
        bands.forEach((b) => {
          const x = cx, y = cy - R * b.r1;
          const w = ctx.measureText(b.name).width;
          ctx.fillStyle = "rgba(1,10,7,.85)"; ctx.fillRect(x - w / 2 - 5, y - 7, w + 10, 14);
          ctx.fillStyle = `rgba(${PH},.8)`; ctx.fillText(b.name, x, y + 1);
        });
      }

      // Sweep afterglow (additive)
      ctx.globalCompositeOperation = "lighter";
      if (!reduce) {
        const wedge = 1.4;
        const cg = ctx.createConicGradient(sw - wedge, cx, cy);
        cg.addColorStop(0, `rgba(${PH},0)`); cg.addColorStop(wedge / TAU * 0.75, `rgba(45,212,191,.07)`); cg.addColorStop(wedge / TAU, `rgba(${PH},.3)`); cg.addColorStop(wedge / TAU + 0.0001, `rgba(${PH},0)`);
        ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, RR, sw - wedge, sw + 0.002); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = `rgba(${PH},.9)`; ctx.lineWidth = 1.6; ctx.shadowColor = `rgb(${PH})`; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sw) * RR, cy + Math.sin(sw) * RR); ctx.stroke();
        ctx.shadowBlur = 0; ctx.lineWidth = 1;
      }

      // Blips
      sats = [];
      if (bootP >= 0.6) blips.forEach((b) => {
        const delta = ((sw - b.ang) % TAU + TAU) % TAU;
        const glow = reduce ? 1 : Math.exp(-delta / 2.4);
        const isH = hover === b, isS = sel === b.s.id;
        const al = isH || isS ? 1 : 0.4 + 0.6 * glow;
        const col = b.s.live ? PH : `${hslRgb(b.s.hue)}`;
        // halo
        const hr = b.size * (3 + glow * 2.5);
        const hg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, hr);
        hg.addColorStop(0, `rgba(${PH},${0.5 * al})`); hg.addColorStop(1, `rgba(${PH},0)`);
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(b.x, b.y, hr, 0, TAU); ctx.fill();
        ctx.fillStyle = `rgba(${col},${al})`; ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, TAU); ctx.fill();
        ctx.fillStyle = `rgba(235,255,248,${al * 0.9})`; ctx.beginPath(); ctx.arc(b.x, b.y, b.size * 0.4, 0, TAU); ctx.fill();
        // ping just after the beam passes
        if (!reduce && delta < 0.9) { const q = delta / 0.9; ctx.strokeStyle = `rgba(${PH},${(1 - q) * 0.7})`; ctx.beginPath(); ctx.arc(b.x, b.y, b.size + q * 16, 0, TAU); ctx.stroke(); }
        if (b.s.live) {
          for (let k = 0; k < 2; k++) { const q = reduce ? 0.5 : ((T * 0.7 + k * 0.5) % 1); ctx.strokeStyle = `rgba(${AMB},${(1 - q) * 0.9})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(b.x, b.y, b.size + 3 + q * 20, 0, TAU); ctx.stroke(); }
          ctx.lineWidth = 1;
        }
        // subagent satellites
        const n = b.s.agents.length;
        b.s.agents.forEach((ag, j) => {
          const oa = (reduce ? 0 : T * 1.3) + j * TAU / n, orr = b.size + 7 + (j % 2) * 3;
          const sx = b.x + Math.cos(oa) * orr, sy = b.y + Math.sin(oa) * orr;
          sats.push({ x: sx, y: sy, parent: b, ag });
          ctx.fillStyle = `rgba(196,181,255,${0.5 + 0.5 * al})`; ctx.beginPath(); ctx.arc(sx, sy, hoverSat && hoverSat.ag === ag ? 2.8 : 1.7, 0, TAU); ctx.fill();
        });
        if (n) { ctx.strokeStyle = `rgba(196,181,255,${0.15 * al})`; ctx.beginPath(); ctx.arc(b.x, b.y, b.size + 8.5, 0, TAU); ctx.stroke(); }
      });
      ctx.globalCompositeOperation = "source-over";

      // Center: you
      ctx.fillStyle = `rgb(${PH})`; ctx.shadowColor = `rgb(${PH})`; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.moveTo(cx, cy - 6); ctx.lineTo(cx + 5, cy + 5); ctx.lineTo(cx, cy + 2.5); ctx.lineTo(cx - 5, cy + 5); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      if (bootP >= 1) { ctx.font = "400 14px VT323, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillStyle = `rgba(${PH},.7)`; ctx.fillText("DU", cx, cy + 9); }

      // Labels for the newest contacts (readable, collision-checked)
      if (bootP >= 1) {
        const placed = [];
        ctx.font = "600 11.5px Figtree, sans-serif"; ctx.textBaseline = "middle";
        const cand = order.slice(0, 6).map((s) => blipOf[s.id]);
        if (hover && !cand.includes(hover)) cand.unshift(hover);
        cand.forEach((b) => {
          const right = b.x >= cx; const txt = trunc(b.s.label, 26), w = ctx.measureText(txt).width;
          const x = right ? b.x + b.size + 10 : b.x - b.size - 10 - w, y = b.y - b.size - 6;
          const box = { x0: x - 4, x1: x + w + 4, y0: y - 8, y1: y + 8 };
          if (b !== hover && placed.some((o) => o.x0 < box.x1 && o.x1 > box.x0 && o.y0 < box.y1 && o.y1 > box.y0)) return;
          placed.push(box);
          ctx.fillStyle = "rgba(1,10,7,.72)"; ctx.fillRect(box.x0, box.y0, box.x1 - box.x0, 16);
          ctx.strokeStyle = b === hover ? `rgba(${AMB},.6)` : `rgba(${PH},.25)`; ctx.strokeRect(box.x0 + 0.5, box.y0 + 0.5, box.x1 - box.x0 - 1, 15);
          ctx.fillStyle = b === hover ? `rgb(${AMB})` : "#d6fff0"; ctx.textAlign = "left"; ctx.fillText(txt, x, y + 0.5);
        });
      }

      // Target reticle + connecting line to the contact row
      const tgt = hover || (sel && blipOf[sel]);
      if (tgt && bootP >= 1) {
        const r = tgt.size + 9 + (reduce ? 0 : Math.sin(T * 5) * 1.5), c = 6;
        ctx.strokeStyle = `rgb(${AMB})`; ctx.lineWidth = 1.5; ctx.shadowColor = `rgb(${AMB})`; ctx.shadowBlur = 8;
        ctx.save(); ctx.translate(tgt.x, tgt.y); ctx.rotate(reduce ? 0 : T * 0.6);
        for (let q = 0; q < 4; q++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(-r, -r + c); ctx.lineTo(-r, -r); ctx.lineTo(-r + c, -r); ctx.stroke(); }
        ctx.restore(); ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(${AMB},.25)`; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(tgt.x, tgt.y); ctx.stroke();
        const row = hover && rowsEl.querySelector(`[data-id="${tgt.s.id}"]`), lr = rowsEl.getBoundingClientRect();
        if (row) {
          const rr = row.getBoundingClientRect(); const ry = Math.max(lr.top + 6, Math.min(lr.bottom - 6, rr.top + rr.height / 2)), rx = lr.right + 10;
          ctx.strokeStyle = `rgba(${AMB},.7)`; ctx.setLineDash([4, 3]);
          const ex = tgt.x - (tgt.x > rx ? r + 2 : -r - 2);
          ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + 24, ry); ctx.lineTo(ex, tgt.y); ctx.stroke();
          ctx.setLineDash([]); ctx.fillStyle = `rgb(${AMB})`; ctx.beginPath(); ctx.arc(rx, ry, 2.5, 0, TAU); ctx.fill();
        }
        ctx.setLineDash([]);
      }
    }
    // hue -> rgb string for blip cores (matches hsl(h 80% 70%))
    const rgbCache = {};
    function hslRgb(h) {
      if (rgbCache[h]) return rgbCache[h];
      const s = 0.8, l = 0.7, k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
      return (rgbCache[h] = [f(0), f(8), f(4)].map((v) => Math.round(v * 255)).join(","));
    }

    // ---------- Loop ----------
    let raf = 0, last = performance.now();
    function frame(time) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) { last = time; return; }
      T += Math.min(0.05, (time - last) / 1000); last = time;
      if (!skipBootNow && T > 1.6) skipBootNow = true;
      if (skipBootNow && !boot.classList.contains("off")) boot.classList.add("off");
      draw();
    }
    const tickClock = () => { clk.textContent = new Date().toLocaleTimeString("de-DE"); };
    tickClock(); const iv = setInterval(tickClock, 1000);
    const onResize = () => layout();
    layout(); renderDet(); draw();
    if (skipBoot) boot.classList.add("off");
    addEventListener("resize", onResize);
    raf = requestAnimationFrame(frame);
    st = { set sel(v) { sel = v; renderDet(); } };
    A.onCleanup(() => { cancelAnimationFrame(raf); clearInterval(iv); removeEventListener("resize", onResize); st = null; });
  }

  Atlas.register({
    key: "radar", name: "Radar", tagline: "Was ist gerade aktiv?", css, render,
    onSelect(id) { if (st) st.sel = id; },
  });
})();
