// Look: Synthwave. Sessions are neon pillars on an endless 80s grid; lanes are projects, depth is time.
(() => {
  const css = `
.lk-synthwave { background: #0a0420; overflow: hidden; user-select: none; --mag: #ff2fd0; --cyn: #2ff3ff; }
.lk-synthwave canvas.sw-cv { position: absolute; inset: 0; width: 100%; height: 100%; display: block; cursor: grab; touch-action: none; }
.lk-synthwave canvas.sw-cv.drag { cursor: grabbing; }
.lk-synthwave canvas.sw-cv.hot { cursor: pointer; }
.lk-synthwave .sw-scan { position: absolute; inset: 0; pointer-events: none; z-index: 5;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,.13) 0 1px, transparent 1px 3px); mix-blend-mode: multiply; }
.lk-synthwave .sw-top { position: absolute; left: 50%; top: 14px; transform: translateX(-50%); z-index: 20; display: flex; flex-direction: column; align-items: center; gap: 8px; pointer-events: none; }
.lk-synthwave .sw-title { position: relative; margin: 0; font: 900 clamp(26px, 3.4vw, 44px)/1 var(--display); letter-spacing: .12em; white-space: nowrap;
  background: linear-gradient(180deg, #ffffff 0%, #e3ecff 30%, #8aa2e8 48%, #1d2560 50%, #ff9de6 52%, #ff4fc4 72%, #ffe3f7 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-stroke: .6px rgba(255,255,255,.35);
  filter: drop-shadow(0 0 1px rgba(255,255,255,.6)) drop-shadow(0 0 14px rgba(255,47,208,.55)) drop-shadow(0 3px 0 rgba(40,10,80,.9)); animation: swin .9s var(--spring) both; }
.lk-synthwave .sw-sub { font: 400 19px/1 "VT323", var(--mono); letter-spacing: .14em; color: #9ff8ff; text-shadow: 0 0 8px rgba(47,243,255,.7); text-transform: uppercase; }
@keyframes swin { from { opacity: 0; transform: translateY(-12px) scale(.94); } }
.lk-synthwave .sw-scrub { pointer-events: auto; width: min(460px, calc(100vw - 40px)); padding: 9px 14px 10px; border-radius: 14px; background: rgba(14,4,36,.62); border-color: rgba(255,47,208,.28); }
.lk-synthwave .sw-scrub .row1 { display: flex; justify-content: space-between; align-items: baseline; font: 700 10px var(--mono); letter-spacing: .16em; text-transform: uppercase; color: rgba(255,200,245,.6); }
.lk-synthwave .sw-scrub .row1 b { font: 700 12.5px var(--mono); letter-spacing: .04em; text-transform: none; color: #fff; text-shadow: 0 0 10px rgba(47,243,255,.7); }
.lk-synthwave .sw-track { position: relative; height: 22px; margin-top: 6px; cursor: pointer; }
.lk-synthwave .sw-track::before { content: ""; position: absolute; left: 0; right: 0; top: 10px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, rgba(47,243,255,.35), rgba(255,47,208,.6)); }
.lk-synthwave .sw-tick { position: absolute; top: 6px; width: 2px; height: 10px; margin-left: -1px; border-radius: 1px; background: var(--c); opacity: .75; }
.lk-synthwave .sw-knob { position: absolute; top: 3px; width: 16px; height: 16px; margin-left: -8px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 3px rgba(255,47,208,.6), 0 0 16px #ff2fd0; }
.lk-synthwave .sw-now { pointer-events: auto; position: absolute; right: 18px; top: 18px; z-index: 20; display: inline-flex; gap: 8px; align-items: center; padding: 9px 14px; border-radius: 999px;
  font: 700 11px var(--display); letter-spacing: .14em; text-transform: uppercase; color: #ffe6fa; background: rgba(14,4,36,.6); border: 1px solid rgba(255,47,208,.4); backdrop-filter: blur(12px);
  transition: transform .45s var(--spring), border-color .2s, opacity .3s; }
.lk-synthwave .sw-now:hover { transform: scale(1.05); border-color: var(--cyn); }
.lk-synthwave .sw-now.off { opacity: 0; pointer-events: none; transform: translateY(-8px); }
.lk-synthwave .sw-help { position: absolute; left: 16px; bottom: 16px; z-index: 20; max-width: 300px; padding: 10px 13px; font-size: 11.5px; line-height: 1.5; color: rgba(236,233,245,.72);
  background: rgba(14,4,36,.55); border-color: rgba(47,243,255,.22); border-radius: 12px; }
.lk-synthwave .sw-help b { color: #fff; font-weight: 700; }
.lk-synthwave .sw-tip { position: fixed; z-index: 40; width: 280px; padding: 12px 14px; pointer-events: none; opacity: 0; transform: translateY(6px) scale(.97);
  transition: opacity .16s, transform .4s var(--spring); background: rgba(16,4,38,.86); border-color: color-mix(in srgb, var(--c, #ff2fd0) 55%, transparent); border-radius: 14px;
  box-shadow: 0 0 26px color-mix(in srgb, var(--c, #ff2fd0) 30%, transparent), 0 18px 44px rgba(0,0,0,.5); }
.lk-synthwave .sw-tip.show { opacity: 1; transform: none; }
.lk-synthwave .sw-tip h4 { margin: 3px 0 7px; font-size: 14.5px; line-height: 1.25; }
.lk-synthwave .sw-tip .k { display: flex; gap: 12px; flex-wrap: wrap; font: 600 11.5px var(--mono); color: var(--ink-2); margin-bottom: 6px; }
.lk-synthwave .sw-tip .k b { color: var(--ink); }
.lk-synthwave .sw-tip .hint { font: 400 15px/1 "VT323", var(--mono); letter-spacing: .1em; color: var(--cyn); margin-top: 8px; text-transform: uppercase; }
@media (prefers-reduced-motion: reduce) { .lk-synthwave .sw-title { animation: none; } }
@media (max-height: 760px) { .lk-synthwave .sw-sub { display: none; } }
`;

  const MAG = [255, 47, 208], CYN = [47, 243, 255];
  const LW = 2.6, CAMH = 2.0, NEAR0 = 10, FAR = 110, CLIP = 1.2, GRID = 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const spring = (s, dt, k = 90, c = 16) => { const a = (s.t - s.x) * k - s.v * c; s.v += a * dt; s.x += s.v * dt; };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rnd = (i, k) => { let h = Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(k + 7, 0x85ebca6b); h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 13; return (h >>> 0) / 4294967296; };
  let api = null;

  function render(root, A) {
    const D = A.DATA, esc = A.esc;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = reduce || window.ATLAS_STILL;

    // Lanes: newest projects in the middle, older ones alternate outwards
    const projs = D.projects.slice().sort((a, b) => b.last.localeCompare(a.last));
    const slots = projs.map((_, r) => (r === 0 ? 0 : r % 2 ? (r + 1) / 2 : -r / 2));
    const minS = Math.min(...slots), maxS = Math.max(...slots);
    const lanes = projs.map((p, r) => { const s = slots[r]; const u = (s - minS) / Math.max(1, maxS - minS);
      const c = Math.abs(s) % 2 ? mix(CYN, [110, 140, 255], u * 0.6) : mix(MAG, [255, 120, 90], u * 0.45); return { p, r, x: s * LW, c }; });
    const laneOf = new Map(lanes.map((l) => [l.p.path, l]));

    // Depth: newest at z=0, older sessions further away, gaps grow with real time
    const sess = D.sessions.slice();
    const pillars = []; let z = 0;
    sess.forEach((s, i) => {
      if (i) { const gapH = Math.max(0, (Date.parse(sess[i - 1].end) - Date.parse(s.end)) / 36e5); z += 3.4 + Math.min(10, Math.sqrt(gapH) * 1.1); }
      const l = laneOf.get(s.project);
      pillars.push({ s, l, x: l.x, z, h: 0.55 + Math.sqrt(s.nodes.length) * 0.46, t: Date.parse(s.end) });
    });
    const zMin = -NEAR0, zMax = Math.max(zMin + 1, z - NEAR0);
    const timeAt = (zz) => {
      if (zz <= 0) return pillars[0].t;
      for (let i = 1; i < pillars.length; i++) if (pillars[i].z >= zz) { const a = pillars[i - 1], b = pillars[i]; return a.t + (b.t - a.t) * ((zz - a.z) / (b.z - a.z || 1)); }
      return pillars[pillars.length - 1].t;
    };
    // Day markers along the depth axis
    const days = []; { let lastDay = ""; for (const p of pillars) { const d = new Date(p.t).toDateString(); if (d !== lastDay) { days.push({ z: p.z - 0.9, t: p.t }); lastDay = d; } } }

    const latest = D.sessions[0];
    root.innerHTML = `
      <canvas class="sw-cv"></canvas>
      <div class="sw-scan"></div>
      <div class="sw-top">
        <h1 class="sw-title">SESSION ATLAS</h1>
        <div class="sw-sub">Zeitreise · ${D.totals.sessions} Sessions · ${projs.length} Projekte</div>
        <div class="sw-scrub glass"><div class="row1"><span>Älter</span><b class="sw-date">-</b><span>Jetzt</span></div>
          <div class="sw-track">${pillars.map((p) => `<i class="sw-tick" style="left:${((1 - (p.z - 0) / Math.max(1, z)) * 100).toFixed(2)}%;--c:${rgba(p.l.c, 1)}"></i>`).join("")}<span class="sw-knob"></span></div></div>
      </div>
      <button class="sw-now off">${A.ic("clock")} Zurück zu jetzt</button>
      <div class="sw-help glass"><b>Säule</b> = Session, Höhe = Schritte. <b>Spur</b> = Projekt (Name am Horizont). Nah = neu, Horizont = alt. <b>Scrollen</b> fliegt durch die Zeit, <b>Ziehen</b> schwenkt, <b>Klick</b> öffnet. Ring = Agents.</div>
      <div class="sw-tip glass"></div>`;

    const cv = root.querySelector("canvas"), ctx = cv.getContext("2d");
    const tip = root.querySelector(".sw-tip"), dateEl = root.querySelector(".sw-date"), knob = root.querySelector(".sw-knob"), track = root.querySelector(".sw-track"), nowBtn = root.querySelector(".sw-now");

    let W = 0, H = 0, dpr = 1, f = 1, hy = 0, dzL = 40, mountains = [], stars = [];
    function layout() {
      W = root.clientWidth || innerWidth; H = root.clientHeight || innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      f = Math.max(700, W * 0.85); hy = Math.round(H * 0.46);
      dzL = Math.max(26, (projs.length * LW * f) / Math.max(400, W - 120));
      stars = Array.from({ length: Math.round((W * hy) / 2600) }, (_, i) => [rnd(i, 1) * W, rnd(i, 2) * hy * 0.95, rnd(i, 3) * 1.3 + 0.3, rnd(i, 4) * 6]);
      mountains = [0, 1].map((L) => { const pts = []; const n = 34; for (let i = 0; i <= n; i++) { const u = i / n; const base = Math.sin(u * 9 + L * 2) * 0.35 + Math.sin(u * 23 + L) * 0.2 + rnd(i, 10 + L) * 0.45;
        const edge = Math.min(1, Math.abs(u - 0.5) * 2.4); pts.push([u, (0.25 + base * 0.75) * (L ? 0.11 : 0.17) * H * (0.35 + edge * 0.85)]); } return pts; });
    }

    const cam = { x: { x: 0, t: 0, v: 0 }, z: { x: still ? zMin : zMin - 46, t: zMin, v: 0 } };
    let T = 0, hover = null, selId = null, hits = [], laneHits = [];

    const proj = (x, y, zz) => { const dz = zz - cam.z.x; if (dz < 0.25) return null; const k = f / dz; return [W / 2 + (x - cam.x.x) * k, hy + (CAMH - y) * k, k]; };
    const truncCache = new Map();
    function fit(text, maxW, key) {
      const ck = key + "|" + Math.round(maxW); let v = truncCache.get(ck); if (v != null) return v;
      if (ctx.measureText(text).width <= maxW) v = text;
      else { let lo = 0, hi = text.length; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (ctx.measureText(text.slice(0, m) + "…").width <= maxW) lo = m; else hi = m - 1; } v = lo ? text.slice(0, lo).trimEnd() + "…" : ""; }
      truncCache.set(ck, v); return v;
    }

    function drawSky() {
      let g = ctx.createLinearGradient(0, 0, 0, hy);
      g.addColorStop(0, "#07021a"); g.addColorStop(0.45, "#1c0a44"); g.addColorStop(0.8, "#5a1468"); g.addColorStop(1, "#c42a86");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, hy + 1);
      for (const [x, y, r, ph] of stars) { ctx.globalAlpha = (0.35 + 0.65 * Math.abs(Math.sin(T * 0.8 + ph))) * (1 - y / hy) ** 0.6; ctx.fillStyle = "#fff"; ctx.fillRect(x, y, r, r); }
      ctx.globalAlpha = 1;
      // Sun with receding stripes
      const R = Math.min(W * 0.17, H * 0.25), sx = W / 2 - cam.x.x * 4, sy = hy - R * 0.42;
      g = ctx.createRadialGradient(sx, sy, R * 0.6, sx, sy, R * 2.4); g.addColorStop(0, "rgba(255,90,170,.45)"); g.addColorStop(1, "rgba(255,60,160,0)");
      ctx.fillStyle = g; ctx.fillRect(sx - R * 2.4, sy - R * 2.4, R * 4.8, R * 4.8);
      ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI * 2); ctx.clip();
      g = ctx.createLinearGradient(0, sy - R, 0, sy + R); g.addColorStop(0, "#fff6a8"); g.addColorStop(0.35, "#ffc552"); g.addColorStop(0.62, "#ff6a7a"); g.addColorStop(1, "#ff1f9e");
      ctx.fillStyle = g; ctx.fillRect(sx - R, sy - R, R * 2, R * 2);
      // Cut stripes by repainting the sky gradient in thin bands
      const sg = ctx.createLinearGradient(0, 0, 0, hy); sg.addColorStop(0, "#07021a"); sg.addColorStop(0.45, "#1c0a44"); sg.addColorStop(0.8, "#5a1468"); sg.addColorStop(1, "#c42a86");
      ctx.fillStyle = sg;
      const off = still ? 0 : (T * 6) % 1;
      for (let i = 0; i < 9; i++) { const u = (i + off) / 9; const y = sy - R * 0.05 + u * R * 1.1; const th = 1 + u * R * 0.075; ctx.fillRect(sx - R, y, R * 2, th); }
      ctx.restore();
      // Mountains
      mountains.forEach((pts, L) => {
        const par = L ? 10 : 18, ox = -cam.x.x * par;
        ctx.beginPath(); ctx.moveTo(-40, hy + 1);
        for (const [u, h] of pts) ctx.lineTo(-40 + u * (W + 80) + ox * 0.2, hy - h);
        ctx.lineTo(W + 40, hy + 1); ctx.closePath();
        const mg = ctx.createLinearGradient(0, hy - 0.2 * H, 0, hy); mg.addColorStop(0, L ? "#1b0838" : "#2a0a4a"); mg.addColorStop(1, L ? "#0c0322" : "#16052e");
        ctx.fillStyle = mg; ctx.fill();
        ctx.strokeStyle = L ? rgba(CYN, 0.55) : rgba(MAG, 0.75); ctx.lineWidth = 1.2; ctx.stroke();
      });
    }

    function drawFloor() {
      let g = ctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, "#2a0636"); g.addColorStop(0.25, "#12021f"); g.addColorStop(1, "#05000d");
      ctx.fillStyle = g; ctx.fillRect(0, hy, W, H - hy);
      const drift = still ? 0 : (T * 0.7) % GRID;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      for (const [lw, a] of [[4, 0.12], [1.1, 0.75]]) {
        ctx.lineWidth = lw;
        // Horizontal lines
        const k0 = Math.floor((cam.z.x + CLIP + drift) / GRID);
        for (let k = k0; k < k0 + 70; k++) {
          const zz = k * GRID - drift; const dz = zz - cam.z.x; if (dz < 0.6 || dz > FAR) continue;
          const y = hy + CAMH * f / dz; if (y > H + 5) continue;
          const fade = clamp((y - hy) / 60, 0, 1);
          ctx.strokeStyle = rgba(MAG, a * fade); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        // Vertical lines converge to the vanishing point
        const j0 = Math.floor((cam.x.x - 40) / LW), j1 = Math.ceil((cam.x.x + 40) / LW);
        for (let j = j0; j <= j1; j++) {
          const x = (j + 0.5) * LW; const pa = proj(x, 0, cam.z.x + FAR), pb = proj(x, 0, cam.z.x + 0.6);
          const gr = ctx.createLinearGradient(0, pa[1], 0, Math.min(H, pb[1])); gr.addColorStop(0, rgba(MAG, 0)); gr.addColorStop(0.08, rgba(MAG, a * 0.8)); gr.addColorStop(1, rgba(MAG, a));
          ctx.strokeStyle = gr; ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
        }
      }
      // Lane guides in lane color
      ctx.lineWidth = 2;
      for (const l of lanes) {
        const pa = proj(l.x, 0, cam.z.x + dzL), pb = proj(l.x, 0, cam.z.x + 0.6);
        const gr = ctx.createLinearGradient(0, pa[1], 0, Math.min(H, pb[1])); gr.addColorStop(0, rgba(l.c, 0.5)); gr.addColorStop(1, rgba(l.c, 0.08));
        ctx.strokeStyle = gr; ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
      }
      ctx.restore();
      // Day markers
      ctx.font = "600 11px JetBrains Mono, monospace"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
      let lastY = 1e9;
      for (const d of days) {
        const dz = d.z - cam.z.x; if (dz < 2 || dz > 70) continue;
        const y = hy + CAMH * f / dz; if (y > H - 20 || lastY - y < 18) continue; lastY = y;
        const a = clamp((y - hy) / 50, 0, 1) * clamp((dz - 2) / 3, 0, 1);
        ctx.fillStyle = rgba(CYN, 0.18 * a); ctx.fillRect(0, y - 0.5, W, 1);
        const label = `${A.day(d.t)}`; const tw = ctx.measureText(label).width;
        ctx.fillStyle = `rgba(8,2,22,${0.8 * a})`; ctx.beginPath(); ctx.roundRect(W - tw - 34, y - 9, tw + 16, 18, 5); ctx.fill();
        ctx.fillStyle = rgba([190, 250, 255], 0.9 * a); ctx.fillText(label, W - tw - 26, y + 0.5);
      }
      // Horizon haze
      g = ctx.createLinearGradient(0, hy - 30, 0, hy + 70); g.addColorStop(0, "rgba(255,60,170,0)"); g.addColorStop(0.35, "rgba(255,80,180,.35)"); g.addColorStop(1, "rgba(255,60,170,0)");
      ctx.fillStyle = g; ctx.fillRect(0, hy - 30, W, 100);
      ctx.fillStyle = "rgba(255,200,240,.85)"; ctx.fillRect(0, hy, W, 1);
    }

    function drawLaneLabels() {
      laneHits = [];
      const pos = lanes.map((l) => ({ l, p: proj(l.x, 0, cam.z.x + dzL) })).filter((o) => o.p).sort((a, b) => a.p[0] - b.p[0]);
      const sp = LW * f / dzL;
      ctx.font = "700 11px Figtree, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      pos.forEach((o, i) => {
        const x = o.p[0]; if (x < -60 || x > W + 60) return;
        const y = hy - 14 - (i % 2) * 22, maxW = Math.min(170, sp * 2 - 14);
        const t = fit(o.l.p.name, maxW - 20, "lane" + o.l.r), tw = ctx.measureText(t).width + 20;
        ctx.strokeStyle = rgba(o.l.c, 0.5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x, o.p[1]); ctx.stroke();
        ctx.fillStyle = "rgba(10,2,26,.86)"; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 9, tw, 18, 9); ctx.fill();
        ctx.strokeStyle = rgba(o.l.c, 0.75); ctx.stroke();
        ctx.fillStyle = rgba(o.l.c, 1); ctx.beginPath(); ctx.arc(x - tw / 2 + 9, y, 2.5, 0, 7); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.fillText(t, x + 4, y + 0.5);
        laneHits.push({ x: x - tw / 2, y: y - 9, w: tw, h: 18, l: o.l });
      });
    }

    function ring(p, P, front, alpha) {
      const n = Math.min(5, p.s.agents.length); if (!n) return;
      const yy = p.h * 0.62, r = 1.05;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = rgba(CYN, 0.55 * alpha); ctx.lineWidth = 1.6; ctx.beginPath(); let started = false;
      for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI * 2; if ((Math.sin(a) < 0) !== front) { started = false; continue; }
        const q = proj(p.x + Math.cos(a) * r, yy, p.z + Math.sin(a) * r); if (!q) continue; if (!started) { ctx.moveTo(q[0], q[1]); started = true; } else ctx.lineTo(q[0], q[1]); }
      ctx.stroke();
      for (let k = 0; k < n; k++) {
        const a = T * 1.5 + (k / n) * Math.PI * 2; if ((Math.sin(a) < 0) !== front) continue;
        const q = proj(p.x + Math.cos(a) * r, yy, p.z + Math.sin(a) * r); if (!q) continue;
        const rr = Math.max(3, q[2] * 0.09); const g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], rr * 2.5);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`); g.addColorStop(0.3, rgba(CYN, 0.9 * alpha)); g.addColorStop(1, rgba(CYN, 0));
        ctx.fillStyle = g; ctx.fillRect(q[0] - rr * 2.5, q[1] - rr * 2.5, rr * 5, rr * 5);
      }
      ctx.restore();
    }

    function drawPillar(p) {
      const dz = p.z - cam.z.x; if (dz - 0.5 < CLIP || dz > FAR) return null;
      const alpha = clamp((dz - CLIP - 0.5) / 2.5, 0, 1) * clamp((FAR - dz) / 40, 0, 1); if (alpha <= 0.02) return null;
      const xl = p.x - 0.5, xr = p.x + 0.5, zf = p.z - 0.5, zb = p.z + 0.5;
      const F = [proj(xl, 0, zf), proj(xr, 0, zf), proj(xr, p.h, zf), proj(xl, p.h, zf)];
      if (F[1][0] < -50 || F[0][0] > W + 50) return null;
      const c = p.l.c, isH = hover === p, isS = selId === p.s.id, live = p.s.live;
      const pulse = live && !still ? 0.7 + 0.3 * Math.sin(T * 5) : 1;
      ring(p, null, false, alpha);
      ctx.save(); ctx.globalAlpha = alpha;
      // Floor reflection / pad glow
      const bw = F[1][0] - F[0][0], by = F[0][1], ph = F[0][1] - F[3][1];
      let g = ctx.createLinearGradient(0, by, 0, by + ph * 0.5); g.addColorStop(0, rgba(c, isH ? 0.45 : 0.28)); g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g; ctx.fillRect(F[0][0], by, bw, ph * 0.5);
      const pg = ctx.createRadialGradient(F[0][0] + bw / 2, by, 0, F[0][0] + bw / 2, by, bw * 1.4); pg.addColorStop(0, rgba(c, 0.35)); pg.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = pg; ctx.fillRect(F[0][0] - bw, by - bw * 0.5, bw * 3, bw);
      const face = (pts, fill) => { ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
      // Side face
      let S = null;
      if (cam.x.x < xl) S = [proj(xl, 0, zf), proj(xl, 0, zb), proj(xl, p.h, zb), proj(xl, p.h, zf)];
      else if (cam.x.x > xr) S = [proj(xr, 0, zf), proj(xr, 0, zb), proj(xr, p.h, zb), proj(xr, p.h, zf)];
      if (S && S.every(Boolean)) { g = ctx.createLinearGradient(0, S[0][1], 0, S[3][1]); g.addColorStop(0, rgba(c, 0.3)); g.addColorStop(1, "rgba(20,4,40,.85)"); face(S, g); }
      // Front face
      g = ctx.createLinearGradient(0, F[0][1], 0, F[3][1]);
      g.addColorStop(0, rgba(mix(c, [255, 255, 255], isH ? 0.25 : 0), (isH ? 0.8 : 0.62) * pulse)); g.addColorStop(0.55, rgba(mix(c, [40, 6, 70], 0.55), 0.8)); g.addColorStop(1, rgba(mix(c, [20, 4, 40], 0.75), 0.92));
      face(F, g);
      // Inner horizontal scan bands to read height
      ctx.save(); ctx.beginPath(); F.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,.07)"; const st = Math.max(3, p.l && F[0][2] * 0.22);
      for (let y = F[0][1] - st; y > F[3][1]; y -= st) ctx.fillRect(F[0][0], y, bw, 1);
      ctx.restore();
      // Top cap
      const Tp = cam.x && CAMH > p.h ? [proj(xl, p.h, zf), proj(xr, p.h, zf), proj(xr, p.h, zb), proj(xl, p.h, zb)] : null;
      if (Tp && Tp.every(Boolean)) face(Tp, rgba(mix(c, [255, 255, 255], 0.55), 0.9));
      // Neon edges with bloom
      ctx.globalCompositeOperation = "lighter";
      const edge = isS ? [45, 212, 191] : live ? [120, 255, 170] : c;
      for (const [lw, a] of [[isH ? 9 : 6, isH ? 0.3 : 0.16], [1.5, 1]]) {
        ctx.strokeStyle = rgba(mix(edge, [255, 255, 255], a === 1 ? 0.35 : 0), a * pulse); ctx.lineWidth = lw; ctx.beginPath();
        F.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
        if (S && S.every(Boolean)) { ctx.moveTo(S[1][0], S[1][1]); ctx.lineTo(S[2][0], S[2][1]); ctx.lineTo(S[3][0], S[3][1]); }
        if (Tp && Tp.every(Boolean)) { ctx.moveTo(Tp[1][0], Tp[1][1]); ctx.lineTo(Tp[2][0], Tp[2][1]); ctx.lineTo(Tp[3][0], Tp[3][1]); ctx.lineTo(Tp[0][0], Tp[0][1]); }
        ctx.stroke();
      }
      ctx.restore();
      ring(p, null, true, alpha);
      const top = Math.min(F[3][1], Tp && Tp[2] ? Tp[2][1] : F[3][1]);
      return { x: Math.min(F[0][0], S ? Math.min(S[0][0], S[1][0]) : 1e9) - 4, y: top - 4, w: Math.max(F[1][0], S ? Math.max(S[0][0], S[1][0]) : -1e9) - Math.min(F[0][0], S ? Math.min(S[0][0], S[1][0]) : 1e9) + 8, h: by - top + 8, p, alpha, cx: F[0][0] + bw / 2, top, k: F[0][2] };
    }

    function drawLabels(drawn) {
      const placed = [];
      ctx.textBaseline = "middle"; ctx.textAlign = "left";
      // Nearest first so close pillars win label space
      for (const d of drawn.slice().sort((a, b) => b.k - a.k)) {
        if (d.alpha < 0.5 || d.k < f / 46) continue;
        const s = d.p.s, isH = hover === d.p;
        const big = d.k > f / 20;
        ctx.font = `700 ${big ? 12.5 : 11.5}px Figtree, sans-serif`;
        const maxW = big ? 210 : 160;
        const title = fit(s.label, maxW, s.id + (big ? "b" : "s")), tw = ctx.measureText(title).width;
        ctx.font = "600 10px JetBrains Mono, monospace";
        const meta = `${s.live ? "LIVE · " : ""}${s.nodes.length} Schritte · ${A.relShort(s.end)}`; const mw = ctx.measureText(meta).width;
        const w = Math.max(tw, mw) + 20, h = 36, x = clamp(d.cx - w / 2, 8, W - w - 8), y = d.top - h - 12;
        if (y < hy - 120 && !isH) continue;
        const box = [x - 4, y - 4, w + 8, h + 8];
        if (!isH && placed.some((b) => box[0] < b[0] + b[2] && b[0] < box[0] + box[2] && box[1] < b[1] + b[3] && b[1] < box[1] + box[3])) continue;
        placed.push(box);
        ctx.globalAlpha = d.alpha;
        ctx.strokeStyle = rgba(d.p.l.c, 0.6); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(d.cx, y + h); ctx.lineTo(d.cx, d.top - 2); ctx.stroke();
        ctx.fillStyle = isH ? "rgba(30,6,60,.95)" : "rgba(10,2,26,.86)"; ctx.beginPath(); ctx.roundRect(x, y, w, h, 7); ctx.fill();
        ctx.strokeStyle = rgba(d.p.l.c, isH ? 1 : 0.55); ctx.stroke();
        ctx.fillStyle = rgba(d.p.l.c, 1); ctx.fillRect(x, y + 7, 2.5, h - 14);
        ctx.font = `700 ${big ? 12.5 : 11.5}px Figtree, sans-serif`; ctx.fillStyle = "#fff"; ctx.fillText(title, x + 10, y + 13);
        ctx.font = "600 10px JetBrains Mono, monospace"; ctx.fillStyle = s.live ? "#8dffb6" : "rgba(220,210,245,.7)"; ctx.fillText(meta, x + 10, y + 26);
        ctx.globalAlpha = 1;
      }
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSky(); drawFloor();
      const drawn = [];
      for (let i = pillars.length - 1; i >= 0; i--) { const d = drawPillar(pillars[i]); if (d) drawn.push(d); }
      drawLaneLabels();
      hits = drawn; // far..near, hit test from the end
      drawLabels(drawn);
      // Vignette
      const g = ctx.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.4, W / 2, H * 0.55, Math.max(W, H) * 0.8);
      g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.45)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Scrubber
      const frac = clamp((cam.z.x - zMin) / (zMax - zMin), 0, 1);
      knob.style.left = ((1 - frac) * 100).toFixed(2) + "%";
      const t = timeAt(cam.z.x + NEAR0);
      dateEl.textContent = `${A.day(t)} · ${A.hhmm(t)}`;
      nowBtn.classList.toggle("off", cam.z.t - zMin < 3);
    }

    let raf = 0, last = performance.now();
    function frame(now) {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
      if (!still) T += dt;
      spring(cam.x, dt, 110, 19); spring(cam.z, dt, 60, 14);
      draw();
      const moving = Math.abs(cam.z.t - cam.z.x) > 0.01 || Math.abs(cam.z.v) > 0.01 || Math.abs(cam.x.t - cam.x.x) > 0.005 || Math.abs(cam.x.v) > 0.005;
      if (!reduce || moving) raf = requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    const xMin = Math.min(...lanes.map((l) => l.x)), xMax = Math.max(...lanes.map((l) => l.x));
    const setZ = (v) => { cam.z.t = clamp(v, zMin, zMax); kick(); };
    const hitAt = (x, y) => {
      for (const h of laneHits) if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return { lane: h.l };
      for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return { p: h.p }; }
      return null;
    };
    function showTip(p, x, y) {
      const s = p.s; tip.style.setProperty("--c", rgba(p.l.c, 1));
      tip.innerHTML = `<div class="cap mono" style="color:${rgba(mix(p.l.c, [255, 255, 255], 0.3), 1)}">${esc(s.projName)}${s.live ? ` · <span style="color:var(--green)">läuft gerade</span>` : ""}</div>
        <h4>${esc(s.label)}</h4>
        <div class="k"><span>${A.day(s.end)} ${A.hhmm(s.end)}</span><span>${A.rel(s.end)}</span></div>
        <div class="k"><span><b>${s.nodes.length}</b> Schritte</span><span>${s.agents.length ? `<b>${s.agents.length}</b> Subagents` : "nur Claude"}</span></div>
        <div class="row">${s.modelList.slice(0, 3).map(A.mp).join("")}${s.agents.slice(0, 2).map((a) => `<span class="tag">${esc(A.aName(a.type))}</span>`).join("")}</div>
        <div class="hint">Klick = öffnen</div>`;
      tip.classList.add("show"); placeTip(x, y);
    }
    const placeTip = (x, y) => { tip.style.left = (x + 300 > W ? x - 296 : x + 18) + "px"; tip.style.top = clamp(y + 16, 12, H - 210) + "px"; };

    let down = null;
    const onDown = (e) => { down = { x: e.clientX, y: e.clientY, cx: cam.x.t, cz: cam.z.t, drag: false }; cam.z.x = cam.z.t === zMin && cam.z.x < zMin - 1 ? cam.z.t : cam.z.x; cv.setPointerCapture(e.pointerId); };
    const onMove = (e) => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (down) {
        const ddx = e.clientX - down.x, ddy = e.clientY - down.y;
        if (!down.drag && Math.hypot(ddx, ddy) > 5) { down.drag = true; cv.classList.add("drag"); tip.classList.remove("show"); hover = null; }
        if (down.drag) { cam.x.t = clamp(down.cx - ddx / (f / NEAR0), xMin - LW, xMax + LW); setZ(down.cz - ddy * 0.06); return; }
      }
      const h = hitAt(x, y); const np = h?.p || null;
      if (np !== hover) { hover = np; if (np) showTip(np, e.clientX, e.clientY); else tip.classList.remove("show"); kick(); }
      else if (np) placeTip(e.clientX, e.clientY);
      cv.classList.toggle("hot", !!h);
    };
    const onUp = (e) => {
      if (!down) return; const wasDrag = down.drag; down = null; cv.classList.remove("drag"); if (wasDrag) return;
      const r = cv.getBoundingClientRect(), h = hitAt(e.clientX - r.left, e.clientY - r.top);
      if (h?.p) { tip.classList.remove("show"); A.open(h.p.s.id); }
      else if (h?.lane) { cam.x.t = h.lane.x; const first = pillars.find((p) => p.l === h.lane); if (first) setZ(first.z - NEAR0); kick(); }
    };
    const onLeave = () => { if (hover) { hover = null; tip.classList.remove("show"); kick(); } };
    const onWheel = (e) => { e.preventDefault(); if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { cam.x.t = clamp(cam.x.t + e.deltaX * 0.01, xMin - LW, xMax + LW); kick(); } else setZ(cam.z.t + e.deltaY * 0.035); };
    cv.addEventListener("pointerdown", onDown); cv.addEventListener("pointermove", onMove); cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointerleave", onLeave); cv.addEventListener("wheel", onWheel, { passive: false });
    // Scrubber drag
    let scrub = false;
    const scrubTo = (e) => { const r = track.getBoundingClientRect(); const u = clamp((e.clientX - r.left) / r.width, 0, 1); setZ(zMin + (1 - u) * (zMax - zMin)); };
    const onTDown = (e) => { scrub = true; track.setPointerCapture(e.pointerId); scrubTo(e); };
    const onTMove = (e) => { if (scrub) scrubTo(e); };
    track.addEventListener("pointerdown", onTDown); track.addEventListener("pointermove", onTMove); track.addEventListener("pointerup", () => (scrub = false));
    nowBtn.addEventListener("click", () => { setZ(zMin); cam.x.t = 0; });

    const onResize = () => { layout(); truncCache.clear(); kick(); };
    const onVis = () => { if (!document.hidden) kick(); };
    addEventListener("resize", onResize); document.addEventListener("visibilitychange", onVis);
    document.fonts?.ready?.then(() => { truncCache.clear(); kick(); });
    layout(); kick();

    api = { select(id) { selId = id; kick(); } };
    A.onCleanup(() => { cancelAnimationFrame(raf); raf = -1; removeEventListener("resize", onResize); document.removeEventListener("visibilitychange", onVis); api = null; });
  }

  function onSelect(id) { api?.select(id); }

  Atlas.register({ key: "synthwave", name: "Synthwave", tagline: "Zeitreise auf dem Neon-Grid", css, render, onSelect, wantsArrows: false });
})();
