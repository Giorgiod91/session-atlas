// Look: Neon City. Projects are skyscrapers in a rainy cyberpunk night, sessions are lit floors with neon signs.
(() => {
  const css = `
.lk-neoncity { background: #05030d; overflow: hidden; user-select: none; --mag: #ff3cdc; --cyn: #25f4ff; }
.lk-neoncity canvas.nc-cv { position: absolute; inset: 0; width: 100%; height: 100%; display: block; cursor: grab; touch-action: none; }
.lk-neoncity canvas.nc-cv.drag { cursor: grabbing; }
.lk-neoncity canvas.nc-cv.hot { cursor: pointer; }
.lk-neoncity .nc-leg { position: absolute; left: 16px; top: 16px; bottom: 84px; width: var(--lw, 272px); display: flex; flex-direction: column; padding: 16px 12px 12px; z-index: 20;
  background: rgba(10,6,24,.58); border-color: rgba(255,60,220,.22); }
.lk-neoncity .nc-leg::before { content: ""; position: absolute; left: 14px; right: 14px; top: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--mag), var(--cyn), transparent); opacity: .85; }
.lk-neoncity .nc-brand { padding: 0 6px 12px; border-bottom: 1px solid var(--line); margin-bottom: 10px; }
.lk-neoncity .nc-brand h1 { margin: 0; font: 900 18px var(--display); letter-spacing: .22em; color: #ffe8fb; text-shadow: 0 0 8px rgba(255,60,220,.9), 0 0 22px rgba(255,60,220,.5); }
.lk-neoncity .nc-brand h1 span { color: #dffcff; text-shadow: 0 0 8px rgba(37,244,255,.9), 0 0 22px rgba(37,244,255,.45); }
.lk-neoncity .nc-brand .cap { font-family: var(--mono); font-size: 11px; margin-top: 5px; }
.lk-neoncity .nc-sec { font: 700 10px var(--mono); letter-spacing: .18em; text-transform: uppercase; color: var(--cyn); padding: 2px 6px 8px; display: flex; justify-content: space-between; }
.lk-neoncity .nc-list { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 2px; margin: 0 -4px; padding: 0 4px; }
.lk-neoncity .nc-it { display: grid; grid-template-columns: 10px 1fr auto; gap: 10px; align-items: center; padding: 7px 8px; border-radius: 11px; text-align: left; width: 100%;
  border: 1px solid transparent; transition: background .2s, border-color .2s, transform .45s var(--spring); }
.lk-neoncity .nc-it:hover { background: rgba(255,60,220,.08); border-color: rgba(255,60,220,.22); transform: translateX(3px); }
.lk-neoncity .nc-it.on { background: hsl(var(--h) 90% 55% / .12); border-color: hsl(var(--h) 90% 62% / .55); }
.lk-neoncity .nc-it i { width: 10px; height: 20px; border-radius: 2px 2px 1px 1px; background: linear-gradient(hsl(var(--h) 100% 72%), hsl(var(--h) 90% 40%)); box-shadow: 0 0 10px hsl(var(--h) 100% 60% / .7); }
.lk-neoncity .nc-it b { display: block; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-neoncity .nc-it small { display: block; font: 500 11px var(--mono); color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-neoncity .nc-it em { font: 700 11px var(--mono); font-style: normal; color: var(--ink-2); }
.lk-neoncity .nc-it .lv { color: var(--green); }
.lk-neoncity .nc-help { font-size: 11.5px; color: var(--ink-3); padding: 10px 6px 0; border-top: 1px solid var(--line); margin-top: 8px; line-height: 1.5; }
.lk-neoncity .nc-help b { color: var(--ink-2); font-weight: 600; }
.lk-neoncity .nc-bill { position: absolute; top: 16px; left: var(--bx, 50%); transform: translateX(-50%); width: min(580px, var(--bw, 580px)); z-index: 15;
  display: flex; gap: 14px; align-items: center; padding: 12px 12px 12px 16px; border-radius: 14px;
  background: linear-gradient(120deg, rgba(37,244,255,.13), rgba(255,60,220,.13)), rgba(6,4,18,.8);
  border: 1px solid rgba(37,244,255,.45); box-shadow: 0 0 0 1px rgba(255,60,220,.18) inset, 0 0 28px rgba(37,244,255,.2), 0 0 70px rgba(255,60,220,.14);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); animation: ncholo 7s steps(1) infinite, ncin .9s var(--spring) both .2s; }
.lk-neoncity .nc-bill::before { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(160,240,255,.05) 0 1px, transparent 1px 3px); animation: ncscan 4s linear infinite; }
.lk-neoncity .nc-bill::after { content: ""; position: absolute; left: 30%; right: 30%; top: 100%; height: 46px; pointer-events: none;
  background: linear-gradient(rgba(37,244,255,.16), transparent); clip-path: polygon(0 0, 100% 0, 70% 100%, 30% 100%); }
@keyframes ncholo { 0%, 100% { opacity: 1; } 61% { opacity: 1; } 62% { opacity: .78; } 63% { opacity: 1; } 64% { opacity: .9; } 65% { opacity: 1; } }
@keyframes ncscan { to { background-position: 0 30px; } }
@keyframes ncin { from { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(.96); } }
.lk-neoncity .nc-bill .tx { min-width: 0; flex: 1; position: relative; }
.lk-neoncity .nc-bill .k { font: 700 10px var(--mono); letter-spacing: .2em; text-transform: uppercase; color: var(--cyn); display: flex; gap: 8px; align-items: center; }
.lk-neoncity .nc-bill .k .dot { width: 7px; height: 7px; background: var(--mag); box-shadow: 0 0 8px var(--mag); animation: blink 1.4s ease-in-out infinite; }
.lk-neoncity .nc-bill .k .dot.live { background: var(--green); box-shadow: 0 0 8px var(--green); }
.lk-neoncity .nc-bill h3 { margin: 3px 0 2px; font: 800 17px/1.25 var(--sans); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff;
  text-shadow: -1px 0 rgba(255,60,220,.55), 1px 0 rgba(37,244,255,.55); }
.lk-neoncity .nc-bill h3 small { font: 600 13px var(--mono); color: var(--cyn); margin-right: 6px; text-shadow: none; }
.lk-neoncity .nc-bill .m { font: 500 11.5px var(--mono); color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-neoncity .nc-go { position: relative; flex: none; display: inline-flex; align-items: center; gap: 8px; padding: 11px 15px; border-radius: 10px; font: 800 13px var(--sans);
  color: #07040f; background: linear-gradient(135deg, #7ff8ff, #25f4ff 40%, #ff3cdc); box-shadow: 0 0 18px rgba(37,244,255,.45), 0 0 34px rgba(255,60,220,.25);
  transition: transform .45s var(--spring), filter .2s; }
.lk-neoncity .nc-go:hover { transform: scale(1.05); filter: brightness(1.12); }
.lk-neoncity .nc-go:active { transform: scale(.95); }
.lk-neoncity .nc-go svg.i { width: 15px; height: 15px; fill: currentColor; }
.lk-neoncity .nc-tip { position: fixed; z-index: 40; width: 276px; padding: 12px 14px; pointer-events: none; opacity: 0; transform: translateY(6px) scale(.97);
  transition: opacity .16s, transform .4s var(--spring); background: rgba(8,5,20,.84); border-color: hsl(var(--h, 300) 95% 62% / .5); border-radius: 14px;
  box-shadow: 0 0 24px hsl(var(--h, 300) 95% 55% / .22), 0 18px 44px rgba(0,0,0,.5); }
.lk-neoncity .nc-tip.show { opacity: 1; transform: none; }
.lk-neoncity .nc-tip h4 { margin: 3px 0 7px; font-size: 14.5px; line-height: 1.25; }
.lk-neoncity .nc-tip .k { display: flex; gap: 12px; font: 600 11.5px var(--mono); color: var(--ink-2); margin-bottom: 6px; flex-wrap: wrap; }
.lk-neoncity .nc-tip .k b { color: var(--ink); }
.lk-neoncity .nc-tip .hint { font: 600 10.5px var(--mono); color: var(--cyn); margin-top: 8px; letter-spacing: .06em; }
@media (prefers-reduced-motion: reduce) { .lk-neoncity .nc-bill, .lk-neoncity .nc-bill::before { animation: none; } }
`;

  const MAG = "#ff3cdc", CYN = "#25f4ff";
  const TW = 228, DX = 32, DY = -19, SP = 320, MINB = 32, LOBBY = 64;
  const fnv = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  // Integer hash -> [0,1)
  const ih = (a, b, c) => { let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35) ^ Math.imul(c + 0x165667b1, 0x27d4eb2f);
    h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return (h >>> 0) / 4294967296; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeOut = (x) => 1 - Math.pow(1 - x, 3);
  const spring = (s, dt, k = 120, c = 17) => { const a = (s.t - s.x) * k - s.v * c; s.v += a * dt; s.x += s.v * dt; };
  let api = null;

  function render(root, A) {
    const D = A.DATA, esc = A.esc;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const projs = D.projects.slice().sort((a, b) => b.last.localeCompare(a.last));
    const latest = D.sessions[0];
    const byId = Object.fromEntries(D.sessions.map((s) => [s.id, s]));

    root.innerHTML = `
      <canvas class="nc-cv"></canvas>
      <div class="nc-bill">
        <div class="tx"><div class="k"><span class="dot ${latest.live ? "live" : ""}"></span>Holo-Feed · ${latest.live ? "läuft gerade" : esc(A.rel(latest.end))}</div>
          <h3><small>Zuletzt:</small>${esc(latest.label)}</h3>
          <div class="m">${esc(latest.projName)} · ${latest.nodes.length} Schritte · ${A.day(latest.end)} ${A.hhmm(latest.end)}</div></div>
        <button class="nc-go" data-go>${A.ic("play")} Weitermachen</button>
      </div>
      <aside class="nc-leg glass">
        <div class="nc-brand"><h1>NEON <span>CITY</span></h1><div class="cap">${projs.length} Türme · ${D.totals.sessions} Etagen · ${D.totals.steps} Schritte</div></div>
        <div class="nc-sec"><span>Skyline</span><span>neueste zuerst</span></div>
        <div class="nc-list scroll">${projs.map((p, i) => `<button class="nc-it in" data-t="${i}" style="--h:${p.hue};--i:${i + 2}"><i></i>
          <span style="min-width:0"><b>${esc(p.name)}</b><small>${p.sessions.some((s) => s.live) ? `<span class="lv">● </span>` : ""}${p.sessions.length} ${p.sessions.length === 1 ? "Etage" : "Etagen"} · ${p.steps} Schritte</small></span><em>${A.relShort(p.last)}</em></button>`).join("")}</div>
        <div class="nc-help"><b>Turm</b> = Projekt, <b>Etage</b> = Session (oben = neueste). Etage anklicken öffnet sie. <b>Ziehen</b> oder <b>Scrollen</b> fährt durch die Stadt. Drohnen = Agents.</div>
      </aside>
      <div class="nc-tip glass"></div>`;

    const cv = root.querySelector("canvas"), ctx = cv.getContext("2d");
    const tip = root.querySelector(".nc-tip"), bill = root.querySelector(".nc-bill"), leg = root.querySelector(".nc-leg");

    // Towers: newest project in the center, the rest alternate outwards and step back
    const towers = projs.map((p, r) => {
      const s = Math.max(0.74, 1 - r * 0.028);
      const slot = r === 0 ? 0 : r % 2 ? (r + 1) / 2 : -r / 2;
      return { p, r, s, lift: (1 - s) * 170, wx: slot * SP, seed: fnv(p.path), bands: p.sessions.slice().reverse().map((se) => ({ se, seed: fnv(se.id) })) };
    });
    const towerOf = new Map(towers.map((t) => [t.p.path, t]));
    const minX = Math.min(...towers.map((t) => t.wx)) - 120, maxX = Math.max(...towers.map((t) => t.wx)) + 120;

    // Flying-car routes: hop between towers in order of recent activity
    const hops = [];
    for (const se of D.sessions.slice(0, 18)) { const t = towerOf.get(se.project); if (!hops.length || hops[hops.length - 1].t !== t) hops.push({ t, se }); }
    const links = []; for (let i = 0; i < Math.min(9, hops.length - 1); i++) links.push([hops[i], hops[i + 1], i]);

    let W = 0, H = 0, dpr = 1, LW = 272, cx0 = 0, gy = 0, K = 1;
    let sky = [];
    function layout() {
      W = root.clientWidth || innerWidth; H = root.clientHeight || innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      LW = W < 1150 ? 236 : 272;
      const areaL = LW + 32; cx0 = areaL + (W - areaL) / 2;
      gy = Math.round(H - Math.max(118, H * 0.17));
      const maxH = gy - 176;
      K = Math.min(9, ...towers.map((t) => (maxH - LOBBY - MINB * t.bands.length) / Math.max(1, t.bands.reduce((n, b) => n + Math.sqrt(b.se.nodes.length), 0))));
      K = Math.max(0.12, K);
      for (const t of towers) { let y = LOBBY; for (const b of t.bands) { b.h = MINB + Math.sqrt(b.se.nodes.length) * K; b.y0 = y; y += b.h; } t.hgt = y; }
      root.style.setProperty("--lw", LW + "px");
      bill.style.setProperty("--bx", cx0 + "px"); bill.style.setProperty("--bw", (W - areaL - 40) + "px");
      // Background skyline layers (decorative, wrap around)
      sky = [0.22, 0.45].map((par, li) => {
        const P = Math.max(2600, W + 800), out = []; let x = 0, k = 0;
        while (x < P) { const w = 36 + ih(li, k, 1) * 70, h = (li ? 0.16 : 0.24) * gy + ih(li, k, 2) * (li ? 0.28 : 0.36) * gy;
          const win = []; for (let j = 0; j < 14; j++) win.push([ih(li, k, 10 + j) * (w - 6) + 2, ih(li, k, 40 + j) * (h - 10) + 6, ih(li, k, 70 + j) < 0.3]);
          out.push({ x, w, h, win, ant: ih(li, k, 3) < 0.25 }); x += w + 4 + ih(li, k, 4) * 26; k++; }
        return { par, P, out };
      });
      truncCache.clear();
    }

    // Camera with springs
    const cam = { x: 0, t: 0, v: 0 }, zoom = { x: reduce ? 1 : 0.9, t: 1, v: 0 };
    let focusT = null, hover = null, selId = null;
    let introT0 = reduce || window.ATLAS_STILL ? -1e9 : performance.now();

    const truncCache = new Map();
    function fit(text, maxW, key) {
      const ck = key + "|" + Math.round(maxW); let v = truncCache.get(ck); if (v != null) return v;
      if (ctx.measureText(text).width <= maxW) v = text;
      else { let lo = 0, hi = text.length; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (ctx.measureText(text.slice(0, m) + "…").width <= maxW) lo = m; else hi = m - 1; } v = lo ? text.slice(0, lo).trimEnd() + "…" : ""; }
      truncCache.set(ck, v); return v;
    }
    const neon = (h, l = 62, a = 1) => `hsla(${h},100%,${l}%,${a})`;
    const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };

    // Screen geometry of a tower for the current frame
    function geo(t, now) {
      const z = zoom.x, sc = t.s * z;
      const g = reduce ? 1 : easeOut(clamp((now - introT0 - t.r * 40) / 800, 0, 1));
      const w = TW * sc, x0 = cx0 + (t.wx - cam.x) * z - w / 2, yb = gy - t.lift * z;
      return { sc, g, w, x0, yb, ht: t.hgt * sc * g, dx: DX * sc, dy: DY * sc };
    }
    const bandY = (G, b) => { const yBot = G.yb - b.y0 * G.sc; return [yBot - b.h * G.sc, yBot]; };

    let T = 0, hits = [];
    function draw(now) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Sky
      let gr = ctx.createLinearGradient(0, 0, 0, gy);
      gr.addColorStop(0, "#04020b"); gr.addColorStop(0.55, "#0e0824"); gr.addColorStop(1, "#2a0d38");
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, gy);
      // Hazy moon and horizon glow
      const mx = cx0 + W * 0.18 - cam.x * 0.05, my = gy * 0.3;
      gr = ctx.createRadialGradient(mx, my, 0, mx, my, 120); gr.addColorStop(0, "rgba(255,190,240,.22)"); gr.addColorStop(0.25, "rgba(255,120,220,.1)"); gr.addColorStop(1, "rgba(255,60,220,0)");
      ctx.fillStyle = gr; ctx.fillRect(mx - 120, my - 120, 240, 240);
      ctx.fillStyle = "rgba(255,210,245,.16)"; ctx.beginPath(); ctx.arc(mx, my, 26, 0, 7); ctx.fill();
      gr = ctx.createLinearGradient(0, gy * 0.55, 0, gy); gr.addColorStop(0, "rgba(255,60,220,0)"); gr.addColorStop(1, "rgba(255,60,220,.18)");
      ctx.fillStyle = gr; ctx.fillRect(0, gy * 0.55, W, gy * 0.45);

      // Skyline silhouettes with parallax
      sky.forEach((L, li) => {
        const off = ((-(cam.x * L.par) % L.P) + L.P) % L.P;
        ctx.fillStyle = li ? "#0d0920" : "#140c2c";
        for (const rep of [-L.P, 0]) for (const b of L.out) {
          const x = b.x + off + rep - 200; if (x > W || x + b.w < 0) continue;
          ctx.fillRect(x, gy - b.h, b.w, b.h);
          if (b.ant) ctx.fillRect(x + b.w / 2 - 1, gy - b.h - 18, 2, 18);
        }
        ctx.fillStyle = li ? "rgba(140,240,255,.35)" : "rgba(255,120,230,.22)";
        for (const rep of [-L.P, 0]) for (const b of L.out) {
          const x = b.x + off + rep - 200; if (x > W || x + b.w < 0) continue;
          for (const [wx, wy, on] of b.win) if (on) ctx.fillRect(x + wx, gy - b.h + wy, 2, 2);
        }
      });
      // Low fog over the skyline
      gr = ctx.createLinearGradient(0, gy - gy * 0.3, 0, gy); gr.addColorStop(0, "rgba(40,10,60,0)"); gr.addColorStop(1, "rgba(60,16,80,.55)");
      ctx.fillStyle = gr; ctx.fillRect(0, gy - gy * 0.3, W, gy * 0.3);

      const geos = new Map(towers.map((t) => [t, geo(t, now)]));

      // Flying-car trails behind the towers
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      for (const [a, b, i] of links) {
        const Ga = geos.get(a.t), Gb = geos.get(b.t);
        const ba = a.t.bands.find((x) => x.se === a.se), bb = b.t.bands.find((x) => x.se === b.se);
        const [ya0, ya1] = bandY(Ga, ba), [yb0, yb1] = bandY(Gb, bb);
        const p0 = [Ga.x0 + Ga.w / 2, (ya0 + ya1) / 2], p3 = [Gb.x0 + Gb.w / 2, (yb0 + yb1) / 2];
        const top = Math.min(Ga.yb - Ga.ht, Gb.yb - Gb.ht) - 50 - (i % 3) * 22;
        const p1 = [p0[0] + (p3[0] - p0[0]) * 0.15, top], p2 = [p0[0] + (p3[0] - p0[0]) * 0.85, top];
        const B = (u) => { const m = 1 - u; return [m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0], m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1]]; };
        const fade = Math.min(Ga.g, Gb.g);
        ctx.strokeStyle = `rgba(255,60,220,${0.13 * fade})`; ctx.lineWidth = 1; ctx.setLineDash([2, 6]);
        ctx.beginPath(); ctx.moveTo(...p0); ctx.bezierCurveTo(...p1, ...p2, ...p3); ctx.stroke(); ctx.setLineDash([]);
        for (let c = 0; c < 2; c++) {
          const u = (T * 0.06 * (1 + (i % 3) * 0.15) + c * 0.5 + i * 0.13) % 1;
          const col = c ? [255, 70, 90] : [150, 245, 255];
          for (let j = 0; j < 14; j++) {
            const u0 = u - j * 0.009, u1 = u - (j + 1) * 0.009; if (u1 < 0) break;
            const q0 = B(u0), q1 = B(u1);
            ctx.strokeStyle = `rgba(${col},${(1 - j / 14) * 0.85 * fade})`; ctx.lineWidth = 2.2 - j * 0.12;
            ctx.beginPath(); ctx.moveTo(...q0); ctx.lineTo(...q1); ctx.stroke();
          }
          const q = B(u); const rg = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 9);
          rg.addColorStop(0, `rgba(${col},${0.9 * fade})`); rg.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = rg; ctx.fillRect(q[0] - 9, q[1] - 9, 18, 18);
        }
      }
      ctx.restore();

      // Towers, far to near
      hits = [];
      const order = towers.slice().sort((a, b) => b.r - a.r);
      for (const t of order) drawTower(t, geos.get(t), now);

      // Wet street: rippled reflection of everything above the ground line
      const R = H - gy;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#04030a"; ctx.fillRect(0, gy * dpr, cv.width, R * dpr);
      const strip = 3 * dpr;
      for (let y = 0; y < R * dpr; y += strip) {
        const sy = gy * dpr - y - strip; if (sy < 0) break;
        const wob = reduce ? 0 : Math.sin(y * 0.045 / dpr + T * 2.2) * (1 + y / (R * dpr) * 5) * dpr;
        ctx.globalAlpha = 0.42 * (1 - y / (R * dpr)) ** 1.2;
        ctx.save(); ctx.translate(wob, gy * dpr + y + strip); ctx.scale(1, -1);
        ctx.drawImage(cv, 0, sy, cv.width, strip, 0, 0, cv.width, strip); ctx.restore();
      }
      ctx.restore();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gr = ctx.createLinearGradient(0, gy, 0, H); gr.addColorStop(0, "rgba(10,4,24,.05)"); gr.addColorStop(1, "rgba(4,2,10,.85)");
      ctx.fillStyle = gr; ctx.fillRect(0, gy, W, R);
      // Curb neon line
      gr = ctx.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, "rgba(255,60,220,.0)"); gr.addColorStop(0.3, "rgba(255,60,220,.7)"); gr.addColorStop(0.7, "rgba(37,244,255,.7)"); gr.addColorStop(1, "rgba(37,244,255,0)");
      ctx.fillStyle = gr; ctx.fillRect(0, gy, W, 1.5);
      ctx.globalAlpha = 0.25; ctx.fillRect(0, gy - 2, W, 5); ctx.globalAlpha = 1;

      // Rain and splashes
      if (!reduce) drawRain();
      // Vignette
      gr = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,.5)"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    }

    function drones(t, G, b, y0, y1, front) {
      const n = Math.min(5, b.se.agents.length); if (!n) return;
      const cx = G.x0 + G.w / 2 + G.dx / 2, cy = (y0 + y1) / 2 + G.dy / 2, rx = G.w / 2 + G.dx / 2 + 18 * G.sc, ry = 9 * G.sc;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      if (!front) { ctx.strokeStyle = "rgba(255,60,220,.18)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.stroke(); }
      for (let k = 0; k < n; k++) {
        const ang = T * 1.4 + (k / n) * Math.PI * 2 + (b.seed % 100);
        if ((Math.sin(ang) > 0) !== front) continue;
        const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry, col = k % 2 ? "37,244,255" : "255,60,220";
        for (let j = 1; j < 6; j++) { const a2 = ang - j * 0.06; ctx.fillStyle = `rgba(${col},${0.25 - j * 0.04})`; ctx.fillRect(cx + Math.cos(a2) * rx - 1, cy + Math.sin(a2) * ry - 1, 2, 2); }
        const rg = ctx.createRadialGradient(x, y, 0, x, y, 8); rg.addColorStop(0, `rgba(${col},.95)`); rg.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = rg; ctx.fillRect(x - 8, y - 8, 16, 16); ctx.fillStyle = "#fff"; ctx.fillRect(x - 1, y - 1, 2, 2);
      }
      ctx.restore();
    }

    function drawTower(t, G, now) {
      const { x0, w, yb, ht, dx, dy, sc } = G; const h = t.p.hue;
      if (x0 + w + dx < -60 || x0 > W + 60 || ht < 1) return;
      const dim = focusT && focusT !== t;
      ctx.save(); if (dim) ctx.globalAlpha = 0.6;
      const yt = yb - ht;
      for (const b of t.bands) { const [y0, y1] = bandY(G, b); if (y1 - 2 > yt) drones(t, G, b, Math.max(y0, yt), y1, false); }
      // Base glow
      let gr = ctx.createRadialGradient(x0 + w / 2, yb, 0, x0 + w / 2, yb, w * 0.9);
      gr.addColorStop(0, neon(h, 60, 0.22)); gr.addColorStop(1, neon(h, 60, 0)); ctx.fillStyle = gr; ctx.fillRect(x0 - w * 0.4, yb - w * 0.9, w * 1.8, w * 0.9);
      // Side face
      ctx.beginPath(); ctx.moveTo(x0 + w, yb); ctx.lineTo(x0 + w + dx, yb + dy); ctx.lineTo(x0 + w + dx, yt + dy); ctx.lineTo(x0 + w, yt); ctx.closePath();
      gr = ctx.createLinearGradient(x0 + w, 0, x0 + w + dx, 0); gr.addColorStop(0, `hsl(${h} 40% 9%)`); gr.addColorStop(1, `hsl(${h} 50% 5%)`);
      ctx.fillStyle = gr; ctx.fill();
      ctx.fillStyle = neon(h, 70, 0.35);
      for (let yy = yb - 8 * sc; yy > yt + 4; yy -= 9 * sc) for (let c = 0; c < 2; c++) if (ih(t.seed, Math.round((yb - yy) / sc), c) < 0.3) { const fx = x0 + w + dx * (0.3 + c * 0.4); ctx.fillRect(fx, yy + dy * (0.3 + c * 0.4), 2.5 * sc, 3 * sc); }
      // Front face
      gr = ctx.createLinearGradient(x0, 0, x0 + w, 0); gr.addColorStop(0, `hsl(${h} 35% 7%)`); gr.addColorStop(0.5, `hsl(${h} 30% 10%)`); gr.addColorStop(1, `hsl(${h} 35% 8%)`);
      ctx.fillStyle = gr; ctx.fillRect(x0, yt, w, ht);
      ctx.save(); ctx.beginPath(); ctx.rect(x0, yt, w, ht); ctx.clip();
      // Lobby with glowing entrance and a small project caption
      {
        const ly = yb - LOBBY * sc;
        ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(x0, ly, w, LOBBY * sc);
        const dw = 34 * sc, dh = 30 * sc, dxp = x0 + w / 2 - dw / 2;
        const dg = ctx.createLinearGradient(0, yb - dh, 0, yb); dg.addColorStop(0, neon(h, 70, 0.15)); dg.addColorStop(1, neon(h, 70, 0.75));
        ctx.fillStyle = dg; ctx.fillRect(dxp, yb - dh, dw, dh);
        ctx.fillStyle = "rgba(0,0,0,.5)"; ctx.fillRect(x0 + w / 2 - 0.5, yb - dh, 1, dh);
        ctx.fillStyle = neon(h, 65, 0.9); ctx.fillRect(x0, ly, w, 2);
        ctx.font = "600 10px JetBrains Mono, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "rgba(220,215,240,.72)";
        const n = t.bands.length; ctx.fillText(fit(`${n} ${n === 1 ? "Etage" : "Etagen"} · ${t.p.steps} Schritte`, w - 12, "lob" + t.r), x0 + w / 2, ly + 13 * sc);
      }
      const cols = Math.max(4, Math.floor(w / (11 * sc))), cw = w / cols;
      const buckets = [neon(h, 72, 0.75), "rgba(255,214,140,.7)", "rgba(160,245,255,.65)"];
      for (const b of t.bands) {
        const [y0, y1] = bandY(G, b); if (y1 < yt) continue;
        const se = b.se, isHover = hover && hover.se === se, isSel = selId === se.id;
        const flick = se.live && !reduce ? 0.6 + 0.4 * Math.abs(Math.sin(T * 9 + Math.sin(T * 23))) : 1;
        // Windows
        const rows = Math.max(1, Math.floor((y1 - y0 - 4) / (9 * sc)));
        const p = isHover ? 0.75 : se.live ? 0.6 : 0.34;
        for (let bk = 0; bk < 3; bk++) {
          ctx.beginPath();
          for (let rI = 0; rI < rows; rI++) for (let c = 0; c < cols; c++) {
            const v = ih(b.seed, rI, c); if (v >= p || Math.floor((v / p) * 3) !== bk) continue;
            ctx.rect(x0 + c * cw + cw * 0.22, y1 - 4 - (rI + 1) * 9 * sc + 2 * sc, cw * 0.56, 4.5 * sc);
          }
          ctx.fillStyle = buckets[bk]; ctx.globalAlpha = (dim ? 0.6 : 1) * (bk === 0 ? flick : 1); ctx.fill();
        }
        ctx.globalAlpha = dim ? 0.6 : 1;
        // Floor separator
        ctx.fillStyle = neon(h, 60, 0.55); ctx.fillRect(x0, y0, w, 1);
        if (isHover || isSel || se.live) {
          ctx.save(); ctx.globalCompositeOperation = "lighter";
          const gg = ctx.createLinearGradient(0, y0, 0, y1); const col = isSel ? "45,212,191" : se.live && !isHover ? "74,222,128" : null;
          const c0 = col ? `rgba(${col},${0.28 * flick})` : neon(h, 60, 0.38), c1 = col ? `rgba(${col},0.05)` : neon(h, 60, 0.08);
          gg.addColorStop(0, c0); gg.addColorStop(1, c1); ctx.fillStyle = gg; ctx.fillRect(x0, y0, w, y1 - y0); ctx.restore();
        }
        // Neon sign plate
        const bh = y1 - y0, ph = Math.min(20, bh - 6);
        if (ph >= 11) {
          const px = x0 + 7, pw = w - 14, py = y0 + Math.min(4, (bh - ph) / 2);
          rr(px, py, pw, ph, 4); ctx.fillStyle = isHover ? `hsla(${h},60%,12%,.96)` : "rgba(5,4,14,.9)"; ctx.fill();
          ctx.strokeStyle = isSel ? "#2dd4bf" : neon(h, 65, isHover ? 1 : 0.42); ctx.lineWidth = isHover || isSel ? 1.5 : 1; ctx.stroke();
          ctx.fillStyle = se.live ? `rgba(74,222,128,${flick})` : neon(h, 62, 0.95); ctx.fillRect(px + 3, py + 3, 2.5, ph - 6);
          const fs = ph >= 17 ? 11.5 : 10.5;
          ctx.font = `600 10px ${"JetBrains Mono"}, monospace`; ctx.textBaseline = "middle";
          const tm = se.live ? "live" : A.relShort(se.end), tw = ctx.measureText(tm).width;
          ctx.fillStyle = se.live ? "#7dffa8" : "rgba(200,195,225,.75)"; ctx.textAlign = "right"; ctx.fillText(tm, px + pw - 6, py + ph / 2 + 0.5);
          ctx.font = `600 ${fs}px Figtree, sans-serif`; ctx.textAlign = "left"; ctx.fillStyle = isHover ? "#fff" : "#efeaff";
          ctx.fillText(fit(se.label, pw - tw - 24, se.id + fs), px + 10, py + ph / 2 + 0.5);
          if (isHover) { ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = neon(h, 60, 0.35); ctx.lineWidth = 5; rr(px - 1, py - 1, pw + 2, ph + 2, 5); ctx.stroke(); ctx.restore(); }
        }
        hits.push({ x: x0, y: Math.max(y0, yt), w: w + dx, h: y1 - Math.max(y0, yt), se, t });
      }
      ctx.restore();
      // Neon edges
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      for (const [lw, a] of [[6, 0.12], [1.4, 0.9]]) {
        ctx.strokeStyle = neon(h, 65, a); ctx.lineWidth = lw; ctx.beginPath();
        ctx.moveTo(x0, yb); ctx.lineTo(x0, yt); ctx.lineTo(x0 + w, yt); ctx.lineTo(x0 + w + dx, yt + dy); ctx.lineTo(x0 + w + dx, yb + dy);
        ctx.moveTo(x0 + w, yt); ctx.lineTo(x0 + w, yb); ctx.stroke();
      }
      ctx.restore();
      // Roof
      ctx.beginPath(); ctx.moveTo(x0, yt); ctx.lineTo(x0 + w, yt); ctx.lineTo(x0 + w + dx, yt + dy); ctx.lineTo(x0 + dx, yt + dy); ctx.closePath();
      ctx.fillStyle = `hsl(${h} 40% 14%)`; ctx.fill(); ctx.strokeStyle = neon(h, 70, 0.6); ctx.lineWidth = 1; ctx.stroke();
      if (G.g > 0.98) {
        // Antenna with blinking beacon
        const ax = x0 + w * 0.78 + dx / 2, ay = yt + dy / 2;
        ctx.strokeStyle = "rgba(200,190,230,.5)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, ay - 30 * sc); ctx.stroke();
        const bl = reduce ? 0.8 : (Math.sin(T * 3 + t.r) > 0.2 ? 1 : 0.15);
        const rg = ctx.createRadialGradient(ax, ay - 30 * sc, 0, ax, ay - 30 * sc, 9); rg.addColorStop(0, `rgba(255,60,80,${bl})`); rg.addColorStop(1, "rgba(255,60,80,0)");
        ctx.fillStyle = rg; ctx.fillRect(ax - 9, ay - 30 * sc - 9, 18, 18);
        // Rooftop name sign
        ctx.font = `700 ${t.r < 3 ? 11.5 : 10.5}px Orbitron, sans-serif`; ctx.letterSpacing = "1.5px";
        const name = fit(t.p.name.toUpperCase(), w + dx - 18, "roof" + t.r);
        const nw = ctx.measureText(name).width + 18, nx = x0 + (w + dx) / 2 - nw / 2 - 8 * sc, ny = yt + dy / 2 - 30;
        rr(nx, ny, nw, 22, 5); ctx.fillStyle = "rgba(5,3,14,.9)"; ctx.fill();
        ctx.strokeStyle = neon(h, 65, focusT === t ? 1 : 0.6); ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = neon(h, 84, 1); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowColor = neon(h, 60, 0.9); ctx.shadowBlur = 10;
        ctx.fillText(name, nx + nw / 2 + 0.75, ny + 11.5); ctx.shadowBlur = 0; ctx.letterSpacing = "0px";
        if (focusT === t || hover?.t === t) hits.push({ x: nx, y: ny, w: nw, h: 22, roof: t });
      }
      for (const b of t.bands) { const [y0, y1] = bandY(G, b); if (y1 - 2 > yt) drones(t, G, b, Math.max(y0, yt), y1, true); }
      ctx.restore();
    }

    // Rain
    const drops = [], splashes = [];
    const nDrops = () => Math.round(Math.min(420, (W * H) / 4200));
    function drawRain() {
      while (drops.length < nDrops()) drops.push({ x: Math.random() * W * 1.2 - W * 0.1, y: Math.random() * H, l: 8 + Math.random() * 16, v: 520 + Math.random() * 420, stop: gy + Math.random() * (H - gy) });
      ctx.strokeStyle = "rgba(175,205,255,.2)"; ctx.lineWidth = 1; ctx.beginPath();
      for (const d of drops) { ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.l * 0.16, d.y - d.l); }
      ctx.stroke();
      ctx.strokeStyle = "rgba(190,230,255,.32)";
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i], k = s.a / 0.35; if (k >= 1) { splashes.splice(i, 1); continue; }
        ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.ellipse(s.x, s.y, 2 + k * 9, 0.8 + k * 2.2, 0, 0, 7); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    function stepRain(dt) {
      for (const d of drops) {
        d.y += d.v * dt; d.x += d.v * dt * 0.16;
        if (d.y > d.stop) { if (splashes.length < 70) splashes.push({ x: d.x, y: d.stop, a: 0 }); d.y = -Math.random() * 60; d.x = Math.random() * W * 1.2 - W * 0.15; d.stop = gy + Math.random() * (H - gy); }
      }
      for (const s of splashes) s.a += dt;
    }

    // Frame loop
    let raf = 0, last = performance.now();
    function frame(now) {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
      if (!reduce) { T += dt; stepRain(dt); }
      spring(cam, dt); spring(zoom, dt);
      draw(now);
      const moving = Math.abs(cam.t - cam.x) > 0.3 || Math.abs(cam.v) > 0.3 || Math.abs(zoom.t - zoom.x) > 0.001 || Math.abs(zoom.v) > 0.001;
      if (!reduce || moving) raf = requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    // Interaction
    function focusTower(i) {
      const t = towers[i]; if (!t) return;
      if (focusT === t) { focusT = null; zoom.t = 1; } else { focusT = t; cam.t = t.wx; zoom.t = 1.07; }
      leg.querySelectorAll(".nc-it").forEach((el) => el.classList.toggle("on", focusT && +el.dataset.t === i));
      kick();
    }
    const hitAt = (x, y) => { for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h; } return null; };
    function showTip(se, x, y) {
      tip.style.setProperty("--h", se.hue);
      tip.innerHTML = `<div class="cap mono" style="color:hsl(${se.hue} 95% 74%)">${esc(se.projName)}${se.live ? ` · <span style="color:var(--green)">läuft gerade</span>` : ""}</div>
        <h4>${esc(se.label)}</h4>
        <div class="k"><span>${A.day(se.end)} ${A.hhmm(se.end)}</span><span>${A.rel(se.end)}</span></div>
        <div class="k"><span><b>${se.nodes.length}</b> Schritte</span><span>${se.agents.length ? `<b>${se.agents.length}</b> Subagents (Drohnen)` : "nur Claude"}</span></div>
        <div class="row">${se.modelList.slice(0, 3).map(A.mp).join("")}${se.agents.slice(0, 2).map((a) => `<span class="tag">${esc(A.aName(a.type))}</span>`).join("")}</div>
        <div class="hint">Klicken zum Öffnen</div>`;
      tip.classList.add("show"); placeTip(x, y);
    }
    function placeTip(x, y) { const tx = x + 296 > W ? x - 290 : x + 18; tip.style.left = tx + "px"; tip.style.top = clamp(y + 16, 12, H - 200) + "px"; }

    let down = null;
    const onDown = (e) => { down = { x: e.clientX, y: e.clientY, cx: cam.x, drag: false }; introT0 = Math.min(introT0, performance.now() - 3000); cv.setPointerCapture(e.pointerId); };
    const onMove = (e) => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (down) {
        if (!down.drag && Math.abs(e.clientX - down.x) > 4) { down.drag = true; cv.classList.add("drag"); tip.classList.remove("show"); hover = null; }
        if (down.drag) { cam.t = cam.x = clamp(down.cx - (e.clientX - down.x) / zoom.x, minX, maxX); cam.v = 0; kick(); return; }
      }
      const h = hitAt(x, y);
      const nh = h && h.se ? h : null;
      if ((nh && nh.se) !== (hover && hover.se)) { hover = nh; if (nh) showTip(nh.se, e.clientX, e.clientY); else tip.classList.remove("show"); kick(); }
      else if (nh) placeTip(e.clientX, e.clientY);
      cv.classList.toggle("hot", !!h);
    };
    const onUp = (e) => {
      if (!down) return; const wasDrag = down.drag; down = null; cv.classList.remove("drag");
      if (wasDrag) return;
      const r = cv.getBoundingClientRect(), h = hitAt(e.clientX - r.left, e.clientY - r.top);
      if (h?.se) { tip.classList.remove("show"); A.open(h.se.id); }
      else if (h?.roof) focusTower(towers.indexOf(h.roof));
    };
    const onLeave = () => { if (hover) { hover = null; tip.classList.remove("show"); kick(); } };
    const onWheel = (e) => {
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      cam.t = clamp(cam.t + d * 0.9 / zoom.x, minX, maxX);
      if (focusT) { focusT = null; zoom.t = 1; leg.querySelectorAll(".nc-it.on").forEach((el) => el.classList.remove("on")); }
      kick();
    };
    cv.addEventListener("pointerdown", onDown); cv.addEventListener("pointermove", onMove); cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointerleave", onLeave); cv.addEventListener("wheel", onWheel, { passive: false });
    leg.addEventListener("click", (e) => { const it = e.target.closest("[data-t]"); if (it) focusTower(+it.dataset.t); });
    bill.querySelector("[data-go]").addEventListener("click", () => A.open(latest.id, latest.last?.id));

    const onResize = () => { layout(); kick(); };
    const onVis = () => { if (!document.hidden) kick(); };
    addEventListener("resize", onResize); document.addEventListener("visibilitychange", onVis);
    document.fonts?.ready?.then(() => { truncCache.clear(); kick(); });
    layout(); kick();

    api = { select(id) { selId = id; kick(); } };
    A.onCleanup(() => { cancelAnimationFrame(raf); raf = -1; removeEventListener("resize", onResize); document.removeEventListener("visibilitychange", onVis); api = null; });
  }

  function onSelect(id) { api?.select(id); }

  Atlas.register({ key: "neoncity", name: "Neon City", tagline: "Projekte als Wolkenkratzer", css, render, onSelect, wantsArrows: false });
})();
