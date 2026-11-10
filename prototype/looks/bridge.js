// Look: Kommandobruecke. An original starship bridge console. The curved
// central viewscreen shows the selected project as a glowing node graph
// (sessions linked chronologically by beams with flowing particles, subagents
// as small escort ships). Left: project selector, right: telemetry and log,
// bottom: ticker of the latest prompts. Switching projects warps the screen.
(function () {
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n) => String(n).padStart(2, "0");
  const dk = (d) => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  // Damped spring 0 -> 1 (closed form, overshoots a little like Framer Motion)
  const spring = (t) => t <= 0 ? 0 : 1 - Math.exp(-7 * t) * Math.cos(11 * t);

  const css = `
.lk-bridge { --c1: #5fe3ff; --c2: #ffb347; --c3: #9d8cff; --pnl: rgba(14,24,40,.62); --edge: rgba(95,227,255,.35);
  background: radial-gradient(1100px 600px at 50% 38%, #0b1730 0%, #050912 60%, #02040a 100%); overflow: hidden; color: #dff6ff; font-family: var(--sans);
  display: grid; grid-template-rows: auto minmax(0, 1fr) 38px; gap: 12px; padding: 14px 18px 80px; }
.lk-bridge::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .5;
  background-image: radial-gradient(1px 1px at 12% 18%, #fff8, transparent), radial-gradient(1px 1px at 82% 12%, #fff6, transparent), radial-gradient(1px 1px at 64% 88%, #fff5, transparent), radial-gradient(1px 1px at 22% 74%, #fff5, transparent), radial-gradient(1.5px 1.5px at 92% 60%, #fff7, transparent), radial-gradient(1px 1px at 40% 6%, #fff6, transparent); }
/* Header */
.lk-bridge .br-top { position: relative; display: flex; align-items: center; gap: 16px; height: 46px; padding: 0 22px; min-width: 0;
  background: linear-gradient(90deg, transparent, rgba(95,227,255,.09) 20%, rgba(95,227,255,.09) 80%, transparent);
  clip-path: polygon(0 0, 100% 0, calc(100% - 26px) 100%, 26px 100%); }
.lk-bridge .br-top::after { content: ""; position: absolute; left: 26px; right: 26px; bottom: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--c1), transparent); }
.lk-bridge .br-top h1 { margin: 0; font: 700 15px var(--display); letter-spacing: .32em; color: #fff; white-space: nowrap; text-shadow: 0 0 14px rgba(95,227,255,.6); }
.lk-bridge .br-top h1 i { font-style: normal; color: var(--c2); }
.lk-bridge .br-top .sd { margin-left: auto; font: 600 11.5px var(--mono); letter-spacing: .14em; color: #8fb6c8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.lk-bridge .br-top .sd b { color: var(--c1); }
.lk-bridge .hum { height: 4px; flex: 0 0 90px; border-radius: 2px; background: linear-gradient(90deg, var(--c2), transparent); animation: br-hum 3.2s ease-in-out infinite; }
@keyframes br-hum { 50% { opacity: .35; } }
/* Main grid */
.lk-bridge .br-main { display: grid; grid-template-columns: minmax(190px, 250px) minmax(0, 1fr) minmax(220px, 290px); gap: 16px; min-height: 0; }
.lk-bridge .cons { position: relative; display: flex; flex-direction: column; min-height: 0; min-width: 0; padding: 14px 14px 12px;
  background: linear-gradient(180deg, rgba(20,36,58,.7), rgba(8,14,26,.75)); border: 1px solid var(--edge);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 20px 40px rgba(0,0,0,.45); }
.lk-bridge .cons.l { clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px)); transform: perspective(900px) rotateY(6deg); transform-origin: left center; }
.lk-bridge .cons.r { clip-path: polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px); transform: perspective(900px) rotateY(-6deg); transform-origin: right center; }
.lk-bridge .cons::before { content: ""; position: absolute; top: 0; left: 18%; right: 18%; height: 2px; background: var(--c1); box-shadow: 0 0 12px var(--c1); animation: br-hum 4.5s ease-in-out infinite; }
.lk-bridge .cons.r::before { background: var(--c2); box-shadow: 0 0 12px var(--c2); animation-delay: -2s; }
.lk-bridge .ch { display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px; }
.lk-bridge .ch h3 { margin: 0; font: 700 11.5px var(--display); letter-spacing: .26em; text-transform: uppercase; color: var(--c1); }
.lk-bridge .cons.r .ch h3 { color: var(--c2); }
.lk-bridge .ch span { margin-left: auto; font: 600 10.5px var(--mono); color: #6f8da0; }
/* Project selector */
.lk-bridge .pl { flex: 1; overflow: auto; scrollbar-width: none; display: flex; flex-direction: column; gap: 3px; min-height: 0; }
.lk-bridge .pb { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 7px 10px; text-align: left;
  border-left: 2px solid transparent; background: rgba(255,255,255,.02); transition: background .2s, border-color .2s, transform .4s var(--spring); }
.lk-bridge .pb:hover { background: rgba(95,227,255,.08); transform: translateX(3px); }
.lk-bridge .pb.on { background: linear-gradient(90deg, rgba(95,227,255,.2), rgba(95,227,255,.03)); border-left-color: var(--c1); }
.lk-bridge .pb b { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-bridge .pb small { display: block; font: 500 10.5px var(--mono); color: #7c98aa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-bridge .pb em { font: 700 11px var(--mono); font-style: normal; color: #9fc4d6; }
.lk-bridge .lt { width: 8px; height: 8px; border-radius: 2px; background: var(--lc); box-shadow: 0 0 8px var(--lc); animation: br-lt var(--sp, 3s) ease-in-out infinite; animation-delay: var(--dl, 0s); }
@keyframes br-lt { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
/* Viewscreen */
.lk-bridge .vs { position: relative; min-height: 0; min-width: 0; border-radius: 50% 50% 50% 50% / 7% 7% 7% 7%; overflow: hidden;
  background: radial-gradient(ellipse at 50% 50%, #0b1a33, #040812 75%); box-shadow: 0 0 0 1px rgba(95,227,255,.35), 0 0 40px rgba(95,227,255,.12), inset 0 0 80px rgba(0,0,0,.9); }
.lk-bridge .vs canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.lk-bridge .vs::after { content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit; background: linear-gradient(180deg, rgba(255,255,255,.05), transparent 30%), repeating-linear-gradient(0deg, rgba(95,227,255,.025) 0 1px, transparent 1px 4px); }
.lk-bridge .vs-h { position: absolute; top: 7%; left: 0; right: 0; text-align: center; pointer-events: none; z-index: 3; padding: 0 60px; }
.lk-bridge .vs-h small { font: 600 10.5px var(--mono); letter-spacing: .3em; color: #7fb3c9; text-transform: uppercase; }
.lk-bridge .vs-h b { display: block; font: 700 22px var(--display); letter-spacing: .12em; color: #fff; text-shadow: 0 0 18px var(--pc, var(--c1)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-bridge .lay { position: absolute; inset: 0; z-index: 2; transform-origin: 50% 55%; }
.lk-bridge .nl { position: absolute; transform: translateX(-50%); text-align: center; pointer-events: none; }
.lk-bridge .nl b { display: block; font-size: 12px; font-weight: 700; color: #eaf8ff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 6px #000, 0 0 2px #000; }
.lk-bridge .nl small { display: block; font: 500 10.5px var(--mono); color: #8fb6c8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 4px #000; }
.lk-bridge .nl.on b { color: var(--c2); }
.lk-bridge .vs-f { position: absolute; bottom: 6%; left: 0; right: 0; text-align: center; font: 600 10.5px var(--mono); letter-spacing: .2em; color: #5f8296; pointer-events: none; z-index: 3; }
/* Holographic card */
.lk-bridge .holo { position: absolute; z-index: 5; width: 270px; padding: 12px 14px; pointer-events: none; opacity: 0; transform: translateY(8px) scale(.94); transition: opacity .2s, transform .45s var(--spring);
  background: linear-gradient(160deg, rgba(95,227,255,.2), rgba(20,50,80,.55)), repeating-linear-gradient(0deg, rgba(95,227,255,.06) 0 1px, transparent 1px 3px);
  border: 1px solid rgba(95,227,255,.6); box-shadow: 0 0 24px rgba(95,227,255,.25), inset 0 0 20px rgba(95,227,255,.12); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px)); }
.lk-bridge .holo.show { opacity: 1; transform: none; }
.lk-bridge .holo h4 { margin: 0 0 6px; font-size: 14px; line-height: 1.25; color: #fff; text-shadow: -1px 0 rgba(255,80,160,.45), 1px 0 rgba(95,227,255,.6); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.lk-bridge .holo p { margin: 0 0 8px; font-size: 12px; color: #b5d6e4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.lk-bridge .holo .kv { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font: 500 10px var(--mono); color: #7fb3c9; text-transform: uppercase; letter-spacing: .06em; }
.lk-bridge .holo .kv b { display: block; font: 700 14px var(--mono); color: #eaf8ff; letter-spacing: 0; }
.lk-bridge .holo .go { margin-top: 8px; font: 700 10.5px var(--mono); letter-spacing: .18em; color: var(--c2); }
/* Telemetry */
.lk-bridge .tm { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.lk-bridge .tm div { padding: 8px 10px; background: rgba(0,0,0,.25); border: 1px solid rgba(255,179,71,.2); }
.lk-bridge .tm span { font: 600 9.5px var(--mono); letter-spacing: .16em; text-transform: uppercase; color: #8a9db0; }
.lk-bridge .tm b { display: block; font: 700 22px var(--display); color: #fff; font-variant-numeric: tabular-nums; text-shadow: 0 0 12px rgba(255,179,71,.45); white-space: nowrap; }
.lk-bridge .bars { display: flex; align-items: flex-end; gap: 3px; height: 64px; padding: 0 2px; border-bottom: 1px solid rgba(255,179,71,.3); }
.lk-bridge .bars i { flex: 1; min-height: 2px; background: linear-gradient(0deg, rgba(255,179,71,.35), var(--c2)); transform-origin: bottom; transition: transform .7s var(--spring); }
.lk-bridge .bars i.z { background: rgba(255,255,255,.08); }
.lk-bridge .bl { display: flex; justify-content: space-between; font: 500 10px var(--mono); color: #6f8698; margin: 4px 0 12px; }
.lk-bridge .log { flex: 1; overflow: auto; scrollbar-width: none; min-height: 0; display: flex; flex-direction: column; gap: 2px; }
.lk-bridge .log button { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; text-align: left; padding: 6px 8px; font-size: 12.5px; background: rgba(255,255,255,.02); transition: background .2s; }
.lk-bridge .log button:hover, .lk-bridge .log button.hv { background: rgba(255,179,71,.12); }
.lk-bridge .log span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-bridge .log em { font: 500 10.5px var(--mono); font-style: normal; color: #8a9db0; }
/* Ticker */
.lk-bridge .tk { position: relative; display: flex; align-items: center; overflow: hidden; min-width: 0; background: rgba(8,16,30,.8); border-top: 1px solid rgba(95,227,255,.3); border-bottom: 1px solid rgba(95,227,255,.3);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
.lk-bridge .tk-l { flex: none; padding: 0 14px; font: 700 10.5px var(--display); letter-spacing: .24em; color: var(--c2); }
.lk-bridge .tk-r { display: flex; white-space: nowrap; animation: br-crawl var(--dur, 80s) linear infinite; }
.lk-bridge .tk:hover .tk-r { animation-play-state: paused; }
.lk-bridge .tk-r button { padding: 0 22px; font-size: 12.5px; color: #cfe8f3; white-space: nowrap; }
.lk-bridge .tk-r button b { color: var(--c1); font: 700 11px var(--mono); margin-right: 8px; }
.lk-bridge .tk-r button:hover { color: #fff; }
@keyframes br-crawl { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .lk-bridge .tk-r, .lk-bridge .lt, .lk-bridge .hum, .lk-bridge .cons::before { animation: none; } .lk-bridge .tk { overflow-x: auto; } }
@media (max-width: 1100px) { .lk-bridge .br-main { grid-template-columns: minmax(170px, 210px) minmax(0, 1fr) minmax(200px, 240px); gap: 12px; } .lk-bridge .cons.l, .lk-bridge .cons.r { transform: none; } }
`;

  function render(root, A) {
    const D = A.DATA;
    const projs = D.projects.slice().sort((a, b) => b.last.localeCompare(a.last));
    const now = Date.parse(D.generatedAt);
    const recentNodes = D.sessions.flatMap((s) => s.nodes.map((n) => ({ s, n }))).sort((a, b) => b.n.ts.localeCompare(a.n.ts)).slice(0, 14);
    const tickerHtml = recentNodes.map(({ s, n }) => `<button data-open="${s.id}" data-open-step="${n.id}"><b>${A.esc(s.projName)} · ${A.hhmm(n.ts)}</b>${A.esc(n.text.replace(/\s+/g, " ").slice(0, 90))}</button>`).join("");
    const sd = new Date(D.generatedAt);
    root.innerHTML = `
      <header class="br-top"><span class="hum"></span><h1>ATLAS <i>·</i> KOMMANDOBRUECKE</h1>
        <div class="sd">STERNZEIT <b>${sd.getFullYear()}.${String(Math.floor((sd - new Date(sd.getFullYear(), 0, 0)) / 864e5)).padStart(3, "0")}</b> · ${D.totals.sessions} MISSIONEN · ${D.projects.length} SEKTOREN · ${D.totals.agents} BEGLEITSCHIFFE</div><span class="hum" style="transform:scaleX(-1)"></span></header>
      <div class="br-main">
        <aside class="cons l"><div class="ch"><h3>Projekte</h3><span>${projs.length} Sektoren</span></div><div class="pl"></div></aside>
        <section class="vs"><canvas></canvas><div class="vs-h"><small>Hauptschirm · Projekt</small><b></b></div><div class="lay"></div><div class="holo"></div><div class="vs-f"></div></section>
        <aside class="cons r"><div class="ch"><h3>Telemetrie</h3><span data-tn></span></div>
          <div class="tm"><div><span>Schritte</span><b data-c="steps">0</b></div><div><span>Agents</span><b data-c="agents">0</b></div><div><span>Missionen</span><b data-c="sess">0</b></div><div><span>Kosten</span><b data-c="cost">$0</b></div></div>
          <div class="bars"></div><div class="bl"><span data-b0></span><span>Aktivitaet 14 Tage</span><span>heute</span></div>
          <div class="ch" style="margin-bottom:6px"><h3>Logbuch</h3><span>neueste zuerst</span></div><div class="log"></div></aside>
      </div>
      <div class="tk"><span class="tk-l">FUNK</span><div class="tk-r" style="--dur:${Math.max(40, recentNodes.length * 7)}s">${tickerHtml}${tickerHtml}</div></div>`;
    const $ = (s) => root.querySelector(s);
    const vs = $(".vs"), cv = $("canvas"), ctx = cv.getContext("2d"), lay = $(".lay"), holo = $(".holo");
    const RM = reduced();

    // Project selector with status lights (live: green fast, <1d: cyan, <7d: amber, older: dim)
    $(".pl").innerHTML = projs.map((p, i) => {
      const live = p.sessions.some((s) => s.live), age = (now - Date.parse(p.last)) / 864e5;
      const lc = live ? "#4ade80" : age < 1 ? "#5fe3ff" : age < 7 ? "#ffb347" : "#4b5d70";
      return `<button class="pb" data-p="${i}" style="--lc:${lc};--sp:${live ? 0.9 : 2.4 + (i % 4) * 0.6}s;--dl:${-(i * 0.37)}s"><span class="lt"></span>
        <span style="min-width:0"><b>${A.esc(p.name)}</b><small>${A.rel(p.last)}</small></span><em>${p.sessions.length}</em></button>`;
    }).join("");

    // ---------- Canvas state ----------
    let W = 0, H = 0, dpr = 1, P = null, nodes = [], beams = [], hover = null, sel = null, raf = 0, t0 = performance.now();
    let warpT = reduced() ? -1e9 : performance.now() - 350, pending = null, swapped = true; // warp: out-phase 0..0.35s, then spring in (also used as intro)
    const stars = Array.from({ length: 260 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
    const sprites = new Map();
    function sprite(col) {
      if (sprites.has(col)) return sprites.get(col);
      const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "#fff"); gr.addColorStop(0.15, col); gr.addColorStop(0.5, col.replace(/[\d.]+\)$/, "0.25)")); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); sprites.set(col, c); return c;
    }
    const hsla = (h, l, a) => `hsla(${h}, 85%, ${l}%, ${a})`;

    function layout() {
      if (!P) return;
      const ss = P.sessions.slice().sort((a, b) => a.start.localeCompare(b.start)), n = ss.length;
      const mx = Math.max(80, W * 0.1), mid = H * 0.56, big = n <= 2 ? 1.5 : 1;
      const spacing = n > 1 ? (W - 2 * mx) / (n - 1) : W;
      // Few sessions: a gentle wave with labels below. Many: two lanes (upper labels above,
      // lower labels below) so neighbours never share label space.
      const lanes = n > 1 && spacing < 170, amp = lanes ? Math.min(H * 0.14, 90) : H * 0.1;
      nodes = ss.map((s, i) => {
        const x = n === 1 ? W / 2 : mx + i * spacing;
        const y = n === 1 ? mid : lanes ? mid + (i % 2 ? amp : -amp) + Math.sin(i * 2.1) * 10 : mid + Math.sin(i * 1.3 + 0.4) * amp;
        const r = Math.min(26, 7 + Math.sqrt(s.nodes.length) * 2.1) * big;
        const lw = n === 1 ? 300 : lanes ? Math.min(220, spacing * 2 - 14) : Math.min(240, spacing - 14);
        return { s, x, y, r, i, below: lanes ? i % 2 === 1 : true, lw, off: r * 1.18 + (s.agents.length ? 18 : 8) };
      });
      beams = nodes.slice(1).map((b, i) => { const a = nodes[i]; const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2 - 26 - Math.abs(b.x - a.x) * 0.08;
        return { a, b, cx, cy, ps: Array.from({ length: 4 }, (_, k) => ({ t: k / 4, v: 0.18 + Math.random() * 0.12 })) }; });
      lay.innerHTML = nodes.map((nd) => `<div class="nl ${sel === nd.s.id ? "on" : ""}" data-n="${nd.i}" style="left:${nd.x}px;top:${nd.below ? nd.y + nd.off : nd.y - nd.off - 34}px;width:${nd.lw}px">
        <b>${A.esc(nd.s.label)}</b><small>${nd.s.nodes.length} Schritte · ${A.relShort(nd.s.end)}${nd.s.agents.length ? " · " + nd.s.agents.length + " Begleiter" : ""}</small></div>`).join("");
    }
    function resize() {
      dpr = Math.min(2, devicePixelRatio || 1);
      W = vs.clientWidth; H = vs.clientHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); layout();
      if (RM && P) frame(performance.now());
    }

    const bz = (a, c, b, t) => { const u = 1 - t; return u * u * a + 2 * u * t * c + t * t * b; };
    function frame(now) {
      raf = 0;
      if (document.hidden) { schedule(); return; }
      if (vs.clientWidth !== Math.round(W) || vs.clientHeight !== Math.round(H)) resize();
      const time = (now - t0) / 1000, wt = (now - warpT) / 1000;
      // Warp phases
      let gScale = 1, gAlpha = 1, warp = 0;
      if (!swapped && wt >= 0.35) { swapped = true; P = pending; applyProject(); }
      if (wt < 0.35) { const k = wt / 0.35; gScale = 1 + k * k * 1.4; gAlpha = 1 - k; warp = k; }
      else if (wt < 1.6) { const k = wt - 0.35; const sp = spring(k); gScale = 0.55 + 0.45 * sp; gAlpha = Math.min(1, k * 3); warp = Math.max(0, 1 - k * 1.4); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#040812"; ctx.fillRect(0, 0, W, H);
      // Starfield with streaks during warp
      const cx = W / 2, cy = H * 0.55, speed = RM ? 0 : 0.0009 + warp * 0.03;
      ctx.globalCompositeOperation = "lighter";
      for (const st of stars) {
        const pz = st.z; st.z -= speed; if (st.z <= 0.02) { st.z = 1; st.x = Math.random() * 2 - 1; st.y = Math.random() * 2 - 1; continue; }
        const sx = cx + (st.x / st.z) * W * 0.5, sy = cy + (st.y / st.z) * H * 0.5;
        const a = Math.min(1, (1 - st.z) * 1.3);
        if (warp > 0.08) { const px = cx + (st.x / pz) * W * 0.5 - (sx - cx) * warp * 0.25, py = cy + (st.y / pz) * H * 0.5 - (sy - cy) * warp * 0.25;
          ctx.strokeStyle = `rgba(170,225,255,${a})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke(); }
        else { ctx.fillStyle = `rgba(200,235,255,${a * 0.8})`; ctx.fillRect(sx, sy, 1.3, 1.3); }
      }
      // Graph
      if (P && nodes.length) {
        const h = P.hue;
        ctx.save(); ctx.globalAlpha = gAlpha; ctx.translate(cx, cy); ctx.scale(gScale, gScale); ctx.translate(-cx, -cy);
        // Slowly turning reticle rings frame the sector
        const rr = Math.min(W, H) * 0.42, rot = RM ? 0 : time * 0.05;
        ctx.lineWidth = 1; ctx.strokeStyle = "rgba(95,227,255,.07)"; ctx.setLineDash([2, 10]);
        ctx.beginPath(); ctx.arc(cx, cy, rr, rot, rot + Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(255,179,71,.12)"; for (let k = 0; k < 4; k++) { const a0 = -rot * 2 + k * Math.PI / 2; ctx.beginPath(); ctx.arc(cx, cy, rr * 0.82, a0, a0 + 0.5); ctx.stroke(); }
        // Horizon grid arc for depth
        ctx.strokeStyle = "rgba(95,227,255,.07)"; ctx.lineWidth = 1;
        for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.ellipse(cx, H * 0.98, W * 0.25 * k, H * 0.09 * k, 0, Math.PI, 0); ctx.stroke(); }
        for (const b of beams) {
          const g = ctx.createLinearGradient(b.a.x, 0, b.b.x, 0); g.addColorStop(0, hsla(h, 62, 0.55)); g.addColorStop(1, hsla((h + 40) % 360, 66, 0.55));
          ctx.strokeStyle = g; ctx.lineWidth = 6; ctx.globalAlpha = gAlpha * 0.12; ctx.beginPath(); ctx.moveTo(b.a.x, b.a.y); ctx.quadraticCurveTo(b.cx, b.cy, b.b.x, b.b.y); ctx.stroke();
          ctx.lineWidth = 1.6; ctx.globalAlpha = gAlpha * 0.85; ctx.stroke();
          ctx.globalAlpha = gAlpha;
          const spr = sprite(hsla((h + 30) % 360, 75, 1));
          for (const p of b.ps) { if (!RM) p.t = (p.t + p.v / 60) % 1; const x = bz(b.a.x, b.cx, b.b.x, p.t), y = bz(b.a.y, b.cy, b.b.y, p.t); ctx.drawImage(spr, x - 9, y - 9, 18, 18); }
        }
        for (const nd of nodes) {
          const on = hover === nd || sel === nd.s.id, live = nd.s.live, col = live ? "hsla(140, 80%, 60%, 1)" : hsla(h, 64, 1);
          const pulse = RM ? 1 : 1 + Math.sin(time * 2 + nd.i) * 0.06;
          const R = nd.r * (on ? 1.18 : 1) * pulse;
          ctx.drawImage(sprite(col), nd.x - R * 2.6, nd.y - R * 2.6, R * 5.2, R * 5.2);
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = "rgba(4,10,22,.85)"; ctx.beginPath(); ctx.arc(nd.x, nd.y, R * 0.78, 0, 7); ctx.fill();
          ctx.strokeStyle = col; ctx.lineWidth = on ? 2.4 : 1.6; ctx.beginPath(); ctx.arc(nd.x, nd.y, R * 0.78, 0, 7); ctx.stroke();
          ctx.fillStyle = "#eaf8ff"; ctx.font = `700 ${Math.max(10, Math.min(14, R * 0.6))}px "JetBrains Mono", monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(String(nd.s.nodes.length), nd.x, nd.y + 0.5);
          if (on) { ctx.strokeStyle = "rgba(255,179,71,.85)"; ctx.setLineDash([4, 5]); ctx.lineDashOffset = -time * 20; ctx.beginPath(); ctx.arc(nd.x, nd.y, R + 9, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
          // Escort ships for subagents
          const ag = nd.s.agents, na = ag.length;
          if (na) {
            const orb = R + 16; ctx.strokeStyle = "rgba(95,227,255,.18)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(nd.x, nd.y, orb, orb * 0.55, 0, 0, 7); ctx.stroke();
            for (let k = 0; k < na; k++) {
              const ang = (RM ? 0 : time * 0.7) + (k / na) * Math.PI * 2, x = nd.x + Math.cos(ang) * orb, y = nd.y + Math.sin(ang) * orb * 0.55;
              const dir = Math.atan2(Math.cos(ang) * orb * 0.55, -Math.sin(ang) * orb);
              ctx.save(); ctx.translate(x, y); ctx.rotate(dir); ctx.globalCompositeOperation = "lighter"; ctx.drawImage(sprite("rgba(95,227,255,1)"), -8, -8, 16, 16);
              ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = "#dff9ff"; ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, -3.5); ctx.lineTo(-2, 0); ctx.lineTo(-4, 3.5); ctx.closePath(); ctx.fill(); ctx.restore();
            }
          }
          ctx.globalCompositeOperation = "lighter";
        }
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";
      // Sync crisp HTML labels with the canvas transform
      lay.style.transform = gScale === 1 ? "" : `scale(${gScale})`; lay.style.opacity = gAlpha;
      lay.style.transformOrigin = `${cx}px ${cy}px`;
      schedule();
    }
    const schedule = () => { if (!RM && !raf) raf = requestAnimationFrame(frame); };

    // ---------- Project switching ----------
    let cur = -1;
    function applyProject() {
      $(".vs-h b").textContent = P.name; vs.style.setProperty("--pc", `hsl(${P.hue} 80% 62%)`);
      $(".vs-f").textContent = `${A.short(P.path)} · ${P.sessions.length} MISSION${P.sessions.length === 1 ? "" : "EN"} · KNOTEN ANKLICKEN ZUM OEFFNEN`;
      hover = null; holo.classList.remove("show"); layout(); telemetry();
    }
    function select(i) {
      if (i === cur || !projs[i]) return; cur = i;
      root.querySelectorAll(".pb").forEach((b) => b.classList.toggle("on", +b.dataset.p === i));
      root.querySelector(`.pb[data-p="${i}"]`)?.scrollIntoView({ block: "nearest" });
      if (RM || !P) { P = projs[i]; applyProject(); if (RM) frame(performance.now()); return; }
      pending = projs[i]; swapped = false; warpT = performance.now();
    }

    // ---------- Telemetry ----------
    const counters = {}; const cRaf = new Set();
    function countTo(key, val, fmt) {
      const el = root.querySelector(`[data-c="${key}"]`), from = counters[key] || 0; counters[key] = val;
      if (RM) { el.textContent = fmt(val); return; }
      const st = performance.now();
      const step = (n) => { const k = Math.min(1, (n - st) / 900), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (val - from) * e); if (k < 1) { const id = requestAnimationFrame(step); cRaf.add(id); } };
      cRaf.add(requestAnimationFrame(step));
    }
    function telemetry() {
      const ss = P.sessions;
      $("[data-tn]").textContent = P.name;
      countTo("steps", P.steps, (v) => Math.round(v)); countTo("agents", P.agents, (v) => Math.round(v)); countTo("sess", ss.length, (v) => Math.round(v));
      countTo("cost", ss.reduce((n, s) => n + (s.cost?.usd || 0), 0), (v) => "$" + v.toFixed(2));
      const days = [], counts = {};
      for (const s of ss) for (const n of s.nodes) counts[dk(n.ts)] = (counts[dk(n.ts)] || 0) + 1;
      for (let i = 13; i >= 0; i--) { const d = new Date(now); d.setDate(d.getDate() - i); days.push(counts[dk(d)] || 0); }
      const mx = Math.max(1, ...days);
      const d0 = new Date(now); d0.setDate(d0.getDate() - 13); $("[data-b0]").textContent = `${d0.getDate()}.${d0.getMonth() + 1}.`;
      const bars = $(".bars");
      bars.innerHTML = days.map((v) => `<i class="${v ? "" : "z"}" title="${v} Schritte" style="height:${v ? Math.max(6, (v / mx) * 100) : 3}%;transform:scaleY(${RM ? 1 : 0})"></i>`).join("");
      if (!RM) requestAnimationFrame(() => requestAnimationFrame(() => bars.querySelectorAll("i").forEach((el, k) => { el.style.transitionDelay = k * 25 + "ms"; el.style.transform = "scaleY(1)"; })));
      $(".log").innerHTML = ss.map((s) => `<button data-open="${s.id}" data-sid="${s.id}"><span>${s.live ? "● " : ""}${A.esc(s.label)}</span><em>${s.nodes.length} · ${A.relShort(s.end)}</em></button>`).join("");
    }

    // ---------- Hover + click on the viewscreen ----------
    function hit(e) {
      const r = vs.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      let best = null, bd = 1e9; for (const nd of nodes) { const d = Math.hypot(nd.x - x, nd.y - y); if (d < nd.r + 16 && d < bd) { bd = d; best = nd; } }
      return best;
    }
    function showHolo(nd) {
      if (!nd) { holo.classList.remove("show"); vs.style.cursor = ""; return; }
      const s = nd.s; vs.style.cursor = "pointer";
      holo.innerHTML = `<h4>${A.esc(s.label)}</h4><p>${A.esc(s.about || "")}</p>
        <div class="kv"><div>Schritte<b>${s.nodes.length}</b></div><div>Agents<b>${s.agents.length}</b></div><div>Kosten<b>${A.usd(s.cost?.usd)}</b></div><div>Zuletzt<b>${A.relShort(s.end)}</b></div></div>
        <div class="go">${s.live ? "● LAEUFT · " : ""}${A.day(s.start)} · KLICK = OEFFNEN</div>`;
      const left = nd.x + 300 > W ? nd.x - 270 - nd.r - 18 : nd.x + nd.r + 18;
      const top = Math.max(10, Math.min(H - 190, nd.y - 70));
      holo.style.left = Math.max(8, left) + "px"; holo.style.top = top + "px"; holo.classList.add("show");
    }
    const onMove = (e) => { const nd = hit(e); if (nd !== hover) { hover = nd; showHolo(nd); root.querySelectorAll(".log button").forEach((b) => b.classList.toggle("hv", !!nd && b.dataset.sid === nd.s.id)); if (RM) frame(performance.now()); } };
    vs.addEventListener("pointermove", onMove);
    vs.addEventListener("pointerleave", () => { hover = null; showHolo(null); });
    vs.addEventListener("click", (e) => { const nd = hit(e); if (nd) A.open(nd.s.id); });
    root.addEventListener("click", (e) => { const b = e.target.closest(".pb"); if (b) select(+b.dataset.p); });
    const onKey = (e) => {
      if (e.target.matches("input,textarea,[contenteditable]")) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); select(Math.max(0, Math.min(projs.length - 1, cur + (e.key === "ArrowDown" ? 1 : -1)))); }
    };
    document.addEventListener("keydown", onKey);

    // Observe the viewscreen itself: fonts or grid changes resize it without a window resize
    let rt; const onResize = () => { clearTimeout(rt); rt = setTimeout(resize, 60); };
    const ro = new ResizeObserver(onResize); ro.observe(vs);
    const onVis = () => { if (!document.hidden) schedule(); };
    document.addEventListener("visibilitychange", onVis);
    api = { sel: (id) => { sel = id; lay.querySelectorAll(".nl").forEach((el) => el.classList.toggle("on", nodes[+el.dataset.n]?.s.id === id)); if (RM) frame(performance.now()); } };
    A.onCleanup(() => { cancelAnimationFrame(raf); raf = -1; cRaf.forEach(cancelAnimationFrame); ro.disconnect(); clearTimeout(rt);
      document.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", onVis); api = null; });

    resize(); select(0); schedule();
  }

  let api = null;
  Atlas.register({ key: "bridge", name: "Kommandobruecke", tagline: "Raumschiff-Konsole", css, render, wantsArrows: false,
    onSelect(id) { api?.sel(id); } });
})();
