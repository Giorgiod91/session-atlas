// Look: Sternbild-Zeitachse. Horizontal timeline, one swim row per project, sessions as glowing stars.
(() => {
  const css = `
.lk-constellation { --bgc: #050913; background: radial-gradient(1200px 500px at 85% -10%, rgba(34,211,238,.09), transparent 65%), radial-gradient(900px 600px at 0% 110%, rgba(139,108,255,.1), transparent 60%), var(--bgc);
  overflow: hidden; user-select: none; -webkit-user-select: none; font-family: var(--sans); }
.lk-constellation::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .35;
  background-image: radial-gradient(rgba(255,255,255,.5) .6px, transparent 1px), radial-gradient(rgba(160,220,255,.4) .5px, transparent 1px);
  background-size: 173px 151px, 97px 113px; background-position: 13px 41px, 61px 7px; }

/* Header */
.lk-constellation .cs-top { position: absolute; z-index: 4; top: 16px; left: 20px; right: 20px; height: 46px; display: flex; align-items: center; gap: 14px; }
.lk-constellation .cs-brand { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.lk-constellation .cs-brand .k { font: 700 10.5px var(--display); letter-spacing: .3em; color: var(--cyan); text-shadow: 0 0 12px rgba(34,211,238,.5); }
.lk-constellation .cs-brand .s { font: 500 11.5px var(--mono); color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-constellation .cs-seg { margin-left: auto; position: relative; display: flex; padding: 4px; border-radius: 13px; gap: 2px; }
.lk-constellation .cs-seg button { position: relative; z-index: 1; height: 32px; padding: 0 14px; border-radius: 9px; font: 700 12.5px var(--mono); color: var(--ink-2); transition: color .25s, transform .3s var(--spring); }
.lk-constellation .cs-seg button:hover { color: var(--ink); }
.lk-constellation .cs-seg button:active { transform: scale(.94); }
.lk-constellation .cs-seg button.on { color: #e6fbff; }
.lk-constellation .cs-seg .pill { position: absolute; top: 4px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, rgba(34,211,238,.22), rgba(139,108,255,.22)); border: 1px solid rgba(34,211,238,.4);
  box-shadow: 0 0 18px rgba(34,211,238,.18); transition: left .55s var(--spring), width .55s var(--spring), opacity .3s; }
.lk-constellation .cs-range { font: 600 11.5px var(--mono); color: var(--ink-3); white-space: nowrap; min-width: 150px; text-align: right; }

/* Minimap */
.lk-constellation .cs-mini { position: absolute; z-index: 3; top: 72px; left: 20px; right: 20px; height: 40px; border-radius: 12px; overflow: hidden; cursor: pointer;
  background: rgba(10,16,32,.7); border: 1px solid rgba(120,170,255,.13); }
.lk-constellation .cs-mini svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.lk-constellation .cs-win { position: absolute; top: 2px; bottom: 2px; border-radius: 9px; border: 1px solid rgba(34,211,238,.65); background: rgba(34,211,238,.08);
  box-shadow: 0 0 16px rgba(34,211,238,.25), inset 0 0 12px rgba(34,211,238,.12); cursor: grab; }
.lk-constellation .cs-mini .ml { position: absolute; top: 3px; font: 600 9px var(--mono); color: var(--ink-3); letter-spacing: .06em; pointer-events: none; }

/* Timeline frame */
.lk-constellation .cs-tl { position: absolute; top: 124px; left: 20px; right: 20px; bottom: 76px; border-radius: 16px; overflow: hidden; cursor: grab;
  background: linear-gradient(180deg, rgba(12,20,40,.55), rgba(8,12,26,.4)); border: 1px solid rgba(120,170,255,.1); }
.lk-constellation.dragging .cs-tl { cursor: grabbing; }
.lk-constellation .cs-grid { position: absolute; inset: 0; pointer-events: none; }
.lk-constellation .gl { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(140,180,255,.07); }
.lk-constellation .gl.wk { background: rgba(140,180,255,.16); }
.lk-constellation .gl.hr { background: rgba(140,180,255,.04); }
.lk-constellation .gtoday { position: absolute; top: 0; bottom: 0; background: linear-gradient(180deg, rgba(34,211,238,.07), rgba(34,211,238,.02)); }
.lk-constellation .gx { position: absolute; top: 9px; font: 600 10.5px var(--mono); color: var(--ink-3); white-space: nowrap; letter-spacing: .02em; }
.lk-constellation .gx.wk { color: var(--ink-2); }
.lk-constellation .gx.td { color: var(--cyan); }
.lk-constellation .now { position: absolute; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: linear-gradient(180deg, var(--cyan), rgba(34,211,238,.15)); box-shadow: 0 0 14px rgba(34,211,238,.7); }
.lk-constellation .now b { position: absolute; top: 5px; left: 50%; transform: translateX(-50%); font: 800 9.5px var(--display); letter-spacing: .18em; color: #031016; background: var(--cyan); padding: 3px 7px 3px 9px; border-radius: 999px; box-shadow: 0 0 16px rgba(34,211,238,.8); white-space: nowrap; }
.lk-constellation .now::after { content: ""; position: absolute; left: 50%; top: 30px; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 0 0 rgba(34,211,238,.6); animation: cs-ping 2s ease-out infinite; }
@keyframes cs-ping { 70%, 100% { box-shadow: 0 0 0 14px rgba(34,211,238,0); } }
.lk-constellation .cs-body { position: absolute; top: 32px; left: 0; right: 0; bottom: 0; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.15) transparent; }
.lk-constellation .cs-inner { position: relative; }
.lk-constellation .cs-row { position: absolute; left: 0; right: 0; border-top: 1px solid rgba(140,180,255,.06); }
.lk-constellation .cs-row:nth-child(even) { background: rgba(140,180,255,.018); }
.lk-constellation .cs-lab { position: absolute; z-index: 2; left: 0; top: 0; bottom: 0; display: flex; align-items: center; padding: 0 10px; pointer-events: none;
  background: linear-gradient(90deg, rgba(7,11,24,.96) 82%, rgba(7,11,24,0)); }
.lk-constellation .cs-lab > div { --h: 200; display: flex; align-items: center; gap: 8px; min-width: 0; width: 100%; padding: 4px 10px; border-radius: 10px;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); backdrop-filter: blur(10px); }
.lk-constellation .cs-lab i { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--h) 80% 62%); box-shadow: 0 0 8px hsl(var(--h) 80% 62%); flex: none; }
.lk-constellation .cs-lab span { min-width: 0; display: flex; flex-direction: column; line-height: 1.2; }
.lk-constellation .cs-lab b { font-size: 12.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-constellation .cs-lab small { font: 500 10px var(--mono); color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-constellation .cs-plot { position: absolute; inset: 0; }
.lk-constellation .cs-plot svg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.lk-constellation .cs-line { fill: none; stroke: rgba(150,220,255,.38); stroke-width: 1; stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.6s cubic-bezier(.6,0,.2,1) forwards; animation-delay: calc(var(--i) * 70ms + 300ms); }
.lk-constellation .cs-bar { stroke-linecap: round; }

/* Session stars */
.lk-constellation .cs-n { position: absolute; left: 0; top: 0; width: 0; height: 0; z-index: 1; }
.lk-constellation .cs-n button { position: absolute; left: calc(var(--r) * -1); top: calc(var(--r) * -1); width: calc(var(--r) * 2); height: calc(var(--r) * 2); border-radius: 50%; --h: 200;
  background: radial-gradient(circle, #fff 0 18%, hsl(var(--h) 95% 80%) 38%, hsl(var(--h) 85% 58%) 72%, hsl(var(--h) 85% 45%) 100%);
  box-shadow: 0 0 calc(var(--r) * 1.2) hsl(var(--h) 85% 60% / .7), 0 0 calc(var(--r) * 3) hsl(var(--h) 85% 55% / .22); transition: transform .4s var(--spring), box-shadow .3s; }
.lk-constellation .cs-n button:hover, .lk-constellation .cs-n.sel button { transform: scale(1.35); box-shadow: 0 0 0 2px rgba(255,255,255,.85), 0 0 calc(var(--r) * 1.6) hsl(var(--h) 85% 60%), 0 0 calc(var(--r) * 4) hsl(var(--h) 85% 55% / .4); }
.lk-constellation .cs-n.live button::after { content: ""; position: absolute; inset: -5px; border-radius: 50%; border: 1px solid var(--green); animation: cs-ping2 1.8s ease-out infinite; }
@keyframes cs-ping2 { from { transform: scale(.8); opacity: 1; } to { transform: scale(1.8); opacity: 0; } }
.lk-constellation .cs-n .lb { position: absolute; top: -8px; left: calc(var(--r) + 7px); font: 600 11.5px var(--sans); color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; line-height: 16px; text-shadow: 0 0 6px #050913, 0 0 3px #050913; transition: color .2s; }
.lk-constellation .cs-n .lb.hot { color: var(--ink); }
.lk-constellation .cs-n:hover .lb { color: #fff; }
.lk-constellation .cs-sat { position: absolute; left: 0; top: 0; width: 0; height: 0; pointer-events: none; animation: cs-orbit var(--d) linear infinite; animation-delay: var(--dl); }
.lk-constellation .cs-sat::after { content: ""; position: absolute; left: var(--o); top: -2px; width: 4px; height: 4px; border-radius: 50%; background: var(--violet); box-shadow: 0 0 6px #b9a6ff; }
@keyframes cs-orbit { to { transform: rotate(360deg); } }
.lk-constellation .cs-off { position: absolute; z-index: 1; top: 50%; transform: translateY(-50%); font: 600 10.5px var(--mono); color: var(--ink-3); padding: 3px 8px; border-radius: 999px;
  border: 1px dashed rgba(140,180,255,.25); background: rgba(8,12,26,.7); white-space: nowrap; transition: color .2s, border-color .2s; }
.lk-constellation .cs-off:hover { color: var(--cyan); border-color: rgba(34,211,238,.6); }

/* Tooltip */
.lk-constellation .cs-tip { position: absolute; z-index: 10; width: 280px; padding: 12px 14px; border-radius: 14px; pointer-events: none; opacity: 0; transform: translateY(6px) scale(.97);
  transition: opacity .2s, transform .35s var(--spring); background: rgba(12,18,36,.78); border-color: rgba(34,211,238,.25); }
.lk-constellation .cs-tip.show { opacity: 1; transform: none; }
.lk-constellation .cs-tip h4 { margin: 0 0 4px; font-size: 14px; font-weight: 800; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.lk-constellation .cs-tip .pj { font: 600 11px var(--mono); color: var(--ink-2); display: flex; align-items: center; gap: 6px; }
.lk-constellation .cs-tip .kv { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin: 10px 0 8px; }
.lk-constellation .cs-tip .kv div { background: rgba(0,0,0,.28); border: 1px solid var(--line); border-radius: 9px; padding: 5px 8px; font: 500 10px var(--mono); color: var(--ink-3); }
.lk-constellation .cs-tip .kv b { display: block; font: 800 13px var(--mono); color: var(--ink); }
.lk-constellation .cs-tip .ab { font-size: 11.5px; color: var(--ink-2); margin-top: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.lk-constellation .cs-tip .hint { margin-top: 8px; font: 600 10px var(--mono); color: var(--cyan); letter-spacing: .06em; }
.lk-constellation .cs-hint { position: absolute; left: 22px; bottom: 26px; font: 500 11px var(--mono); color: var(--ink-3); }
@media (max-width: 1250px) { .lk-constellation .cs-hint { display: none; } }
@media (max-width: 900px) { .lk-constellation .cs-range { display: none; } }
@media (prefers-reduced-motion: reduce) { .lk-constellation .cs-sat, .lk-constellation .now::after, .lk-constellation .cs-n.live button::after { animation: none; } }
`;

  let root, A, selId = null;
  const H = 3600e3, D = 24 * H;

  function render(el, atlas) {
    root = el; A = atlas;
    const { projects, sessions, totals } = A.DATA;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const now = Date.now();
    const T = (iso) => Date.parse(iso);
    const tMin = Math.min(...sessions.map((s) => T(s.start))) - 12 * H, tMax = now + 6 * H;
    const sod = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
    const today0 = sod(now);

    // Rows: projects ordered by most recent activity; sessions oldest -> newest inside a row
    const rows = projects.map((p, ri) => ({ p, ri, list: p.sessions.slice().sort((a, b) => a.end.localeCompare(b.end)) }));
    const multiDay = (s) => sod(T(s.start)) !== sod(T(s.end));

    root.innerHTML = `
      <div class="cs-top">
        <div class="cs-brand glass" style="padding:8px 14px;border-radius:14px"><span class="k">STERNBILD</span><span class="s">${totals.sessions} Sessions · ${projects.length} Projekte · ${totals.steps} Schritte</span></div>
        <div class="cs-seg glass"><span class="pill"></span><button data-v="day">Heute</button><button data-v="week">Woche</button><button data-v="all">Alles</button></div>
        <div class="cs-range"></div>
      </div>
      <div class="cs-mini"><svg></svg><div class="cs-win"></div></div>
      <div class="cs-tl"><div class="cs-grid"></div>
        <div class="cs-body"><div class="cs-inner">
          ${rows.map((r) => `<div class="cs-row" data-row="${r.ri}"></div>`).join("")}
          <div class="cs-plot"><svg>
            ${rows.map((r) => r.list.map((s) => `<line class="cs-bar" data-bar="${s.id}" stroke="hsl(${r.p.hue} 80% 62%)" stroke-opacity="${multiDay(s) ? .38 : .22}" stroke-width="${multiDay(s) ? 4 : 3}"/>`).join("")).join("")}
            ${rows.map((r) => r.list.length > 1 ? `<path class="cs-line" data-line="${r.ri}" pathLength="1" style="--i:${r.ri}"/>` : "").join("")}
          </svg>
          ${rows.map((r) => r.list.map((s, j) => `<div class="cs-n ${s.live ? "live" : ""} ${s.id === selId ? "sel" : ""}" data-n="${s.id}">
              <button class="in" data-open="${s.id}" aria-label="${A.esc(s.label)}" style="--i:${r.ri + j * 0.5};--h:${r.p.hue}"></button>
              ${s.agents.map((_, k) => `<span class="cs-sat" style="--o:12px;--d:${4 + k * 0.9}s;--dl:-${(k * 1.3).toFixed(1)}s"></span>`).join("")}
              <span class="lb"></span></div>`).join("")).join("")}
          </div>
          ${rows.map((r) => `<div class="cs-lab" data-lab="${r.ri}"><div style="--h:${r.p.hue}" title="${A.esc(A.short(r.p.path))}"><i></i><span><b>${A.esc(r.p.name)}</b><small>${r.p.sessions.length} · ${A.esc(A.rel(r.p.last))}</small></span></div></div>`).join("")}
          ${rows.map((r) => `<button class="cs-off" data-off="${r.ri}" hidden></button>`).join("")}
        </div></div>
      </div>
      <div class="cs-tip glass"></div>
      <div class="cs-hint">Ziehen oder seitlich scrollen · Strg + Scrollen zoomt</div>`;

    const $ = (s) => root.querySelector(s), $$ = (s) => [...root.querySelectorAll(s)];
    const tl = $(".cs-tl"), grid = $(".cs-grid"), body = $(".cs-body"), inner = $(".cs-inner"), plot = $(".cs-plot"), tip = $(".cs-tip");
    const mini = $(".cs-mini"), win = $(".cs-win"), range = $(".cs-range");
    const nodeEl = Object.fromEntries($$(".cs-n").map((e) => [e.dataset.n, e]));
    const barEl = Object.fromEntries($$("[data-bar]").map((e) => [e.dataset.bar, e]));
    const lineEl = Object.fromEntries($$("[data-line]").map((e) => [e.dataset.line, e]));
    const rowEl = $$(".cs-row"), labEl = $$(".cs-lab"), offEl = $$(".cs-off");

    // ---------- Geometry ----------
    const G = { W: 0, LW: 168, PW: 0, rowH: 40 };
    const measure = () => {
      G.W = tl.clientWidth; G.LW = G.W < 900 ? 132 : 172; G.PW = G.W - G.LW - 34;
      const avail = body.clientHeight;
      G.rowH = Math.max(36, Math.min(66, Math.floor(avail / rows.length)));
      inner.style.height = rows.length * G.rowH + "px";
      plot.style.clipPath = `inset(-20px 0 -20px ${G.LW}px)`;
      rowEl.forEach((e, i) => { e.style.top = i * G.rowH + "px"; e.style.height = G.rowH + "px"; });
      labEl.forEach((e, i) => { e.style.top = i * G.rowH + "px"; e.style.height = G.rowH + "px"; e.style.width = G.LW + "px"; });
      offEl.forEach((e, i) => { e.style.top = i * G.rowH + G.rowH / 2 + "px"; e.style.left = G.LW + 8 + "px"; });
      // Static per-session vertical placement and size
      rows.forEach((r, ri) => r.list.forEach((s, j) => {
        const jit = r.list.length > 1 ? [0, -1, 1, -0.5, 0.5][j % 5] * G.rowH * 0.2 : 0;
        s._y = ri * G.rowH + G.rowH / 2 + jit;
        s._r = Math.min(G.rowH * 0.24, 3 + Math.sqrt(s.nodes.length) * 0.95);
        const n = nodeEl[s.id]; n.style.setProperty("--r", s._r.toFixed(1) + "px");
        n.querySelectorAll(".cs-sat").forEach((x, k) => x.style.setProperty("--o", (s._r + 4 + (k % 2) * 4).toFixed(1) + "px"));
      }));
    };

    // ---------- View with spring camera ----------
    const V = { c: 0, s: 0, vc: 0, vs: 0, tc: 0, ts: 0 }; // center (ms) and log(span)
    const v0 = () => V.c - Math.exp(V.s) / 2, v1 = () => V.c + Math.exp(V.s) / 2;
    const X = (t) => G.LW + ((t - v0()) / Math.exp(V.s)) * G.PW;
    const presets = {
      day: () => { const st = sessions.filter((s) => T(s.end) >= today0).map((s) => T(s.start)); const a = Math.max(today0, Math.min(now - 4 * H, ...st) - H); return [a, now + 1.5 * H]; },
      week: () => [now - 7 * D, now + 8 * H],
      all: () => [tMin, tMax],
    };
    let mode = "all", raf = 0;
    const setTarget = (a, b) => {
      const span = Math.max(2 * H, Math.min(tMax - tMin + 4 * D, b - a));
      V.tc = Math.max(tMin, Math.min(tMax, (a + b) / 2)); V.ts = Math.log(span);
    };
    const go = (a, b, anim = true) => {
      setTarget(a, b);
      if (!anim || reduce) { V.c = V.tc; V.s = V.ts; V.vc = V.vs = 0; layout(); return; }
      if (!raf) { let last = performance.now(); const tick = (t) => {
        let dt = Math.min(0.05, (t - last) / 1000); last = t;
        const K = 120, C = 17;
        while (dt > 0) { const h = Math.min(dt, 1 / 120); dt -= h;
          const sp = Math.exp(V.s);
          V.vc += (-K * (V.c - V.tc) / sp - C * V.vc) * h; V.c += V.vc * sp * h; // center velocity in spans/s
          V.vs += (-K * (V.s - V.ts) - C * V.vs) * h; V.s += V.vs * h; }
        layout();
        const done = Math.abs(V.c - V.tc) < Math.exp(V.s) * 1e-4 && Math.abs(V.s - V.ts) < 1e-4 && Math.abs(V.vc) < 1e-3 && Math.abs(V.vs) < 1e-3;
        if (done) { V.c = V.tc; V.s = V.ts; layout(); raf = 0; } else raf = requestAnimationFrame(tick);
      }; raf = requestAnimationFrame(tick); }
    };
    const preset = (m, anim) => { mode = m; const [a, b] = presets[m](); go(a, b, anim); segUpdate(); };

    const segBtns = $$(".cs-seg button"), pill = $(".cs-seg .pill");
    const segUpdate = () => {
      const b = segBtns.find((x) => x.dataset.v === mode);
      segBtns.forEach((x) => x.classList.toggle("on", x === b));
      pill.style.opacity = b ? 1 : 0;
      if (b) { pill.style.left = b.offsetLeft + "px"; pill.style.width = b.offsetWidth + "px"; }
    };

    // ---------- Per-frame layout ----------
    const fmtD = (t, long) => new Date(t).toLocaleDateString("de-DE", long ? { weekday: "short", day: "numeric", month: "short" } : { day: "numeric", month: "short" });
    const layout = () => {
      const a = v0(), b = v1(), span = b - a, pxD = (G.PW / span) * D;
      // Grid + axis
      let g = "";
      const tx0 = X(today0), tx1 = X(today0 + D);
      if (tx1 > G.LW && tx0 < G.W) g += `<div class="gtoday" style="left:${Math.max(G.LW, tx0)}px;width:${Math.min(G.W, tx1) - Math.max(G.LW, tx0)}px"></div>`;
      const hourStep = pxD > 1800 ? 1 : pxD > 900 ? 2 : pxD > 450 ? 3 : pxD > 260 ? 6 : 0;
      for (let d = sod(a); d <= b; d = sod(d + D + 3 * H)) { // DST-safe day stepping
        const dd = new Date(d);
        const x = X(d), wk = dd.getDay() === 1, td = d === today0;
        if (hourStep) for (let h = hourStep; h < 24; h += hourStep) {
          const hx = X(d + h * H); if (hx < G.LW || hx > G.W) continue;
          g += `<div class="gl hr" style="left:${hx}px"></div>`;
          if (pxD / (24 / hourStep) > 46) g += `<div class="gx" style="left:${hx + 4}px">${String(h).padStart(2, "0")}:00</div>`;
        }
        if (x < G.LW - 2 || x > G.W) continue;
        g += `<div class="gl ${wk ? "wk" : ""}" style="left:${x}px"></div>`;
        const showLbl = pxD >= 70 || (pxD >= 30 && wk) || (wk && pxD >= 14) || td;
        if (showLbl && x + 40 < G.W && (x + 50 < X(now) - 40 || x > X(now) + 40)) g += `<div class="gx ${wk ? "wk" : ""} ${td ? "td" : ""}" style="left:${x + 5}px">${td ? "Heute" : fmtD(d, pxD >= 70)}</div>`;
      }
      const nx = X(now);
      if (nx > G.LW && nx < G.W + 2) g += `<div class="now" style="left:${nx}px"><b>JETZT</b></div>`;
      grid.innerHTML = g;

      // Bars, nodes, labels
      rows.forEach((r, ri) => {
        let pts = [], anyIn = false;
        r.list.forEach((s, j) => {
          const x = X(T(s.end)), xs = X(T(s.start)), n = nodeEl[s.id], br = barEl[s.id];
          n.style.transform = `translate(${x.toFixed(1)}px,${s._y.toFixed(1)}px)`;
          const vis = x > G.LW - 30 && x < G.W + 30; n.style.visibility = vis ? "" : "hidden";
          if (x > G.LW + 4 && x < G.W) anyIn = true;
          br.setAttribute("x1", xs.toFixed(1)); br.setAttribute("x2", x.toFixed(1)); br.setAttribute("y1", s._y.toFixed(1)); br.setAttribute("y2", s._y.toFixed(1));
          br.style.display = x - xs > s._r * 1.2 ? "" : "none";
          pts.push([x, s._y]);
          // Label to the right if there is room before the next star in the row
          const next = r.list[j + 1], room = (next ? X(T(next.end)) - next._r : G.W - 12) - x - s._r - 14;
          const lb = n.querySelector(".lb"), w = Math.min(room, 230);
          if (w > 60 && x > G.LW + 2 && x < G.W - 40) { if (lb.textContent !== s.label) lb.textContent = s.label; lb.style.maxWidth = w + "px"; lb.style.display = ""; lb.classList.toggle("hot", j === r.list.length - 1); }
          else lb.style.display = "none";
        });
        if (lineEl[ri]) lineEl[ri].setAttribute("d", "M" + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" L"));
        // Off-screen hint: everything in this row is older than the view
        const off = offEl[ri], lastX = pts[pts.length - 1][0];
        if (!anyIn && lastX < G.LW + 4) { off.hidden = false; off.textContent = `‹ ${A.rel(r.p.last)}`; off.dataset.t = T(r.p.last); }
        else off.hidden = true;
      });

      // Minimap window + range text
      const mw = mini.clientWidth, mx = (t) => ((t - tMin) / (tMax - tMin)) * mw;
      const wl = Math.max(0, mx(a)), wr = Math.min(mw, mx(b));
      win.style.left = wl + "px"; win.style.width = Math.max(10, wr - wl) + "px";
      range.textContent = `${fmtD(a)} - ${fmtD(b)}`;
    };

    // ---------- Minimap content ----------
    const drawMini = () => {
      const mw = mini.clientWidth, mh = mini.clientHeight, mx = (t) => ((t - tMin) / (tMax - tMin)) * mw;
      let s = "";
      for (let d = sod(tMin + D + 3 * H); d < tMax; d = sod(d + D + 3 * H)) { const dd = new Date(d);
        if (dd.getDay() === 1) s += `<line x1="${mx(d)}" x2="${mx(d)}" y1="0" y2="${mh}" stroke="rgba(140,180,255,.14)"/><text x="${mx(d) + 4}" y="${mh - 5}" fill="rgba(170,190,230,.45)" font-size="9" font-family="JetBrains Mono, monospace">${fmtD(d)}</text>`; }
      rows.forEach((r, ri) => r.list.forEach((x) => {
        const y = 5 + (ri / Math.max(1, rows.length - 1)) * (mh - 18), x0 = mx(T(x.start)), x1 = mx(T(x.end));
        if (x1 - x0 > 2) s += `<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="hsl(${r.p.hue} 80% 62%)" stroke-opacity=".35" stroke-width="2"/>`;
        s += `<circle cx="${x1}" cy="${y}" r="${1.4 + Math.sqrt(x.nodes.length) * 0.2}" fill="hsl(${r.p.hue} 80% 68%)"/>`;
      }));
      s += `<line x1="${mx(now)}" x2="${mx(now)}" y1="0" y2="${mh}" stroke="#22d3ee" stroke-width="1.5"/>`;
      mini.querySelector("svg").innerHTML = s;
    };

    // ---------- Tooltip ----------
    const showTip = (s, n) => {
      const ms = T(s.end) - T(s.start), st = new Date(T(s.start)), en = new Date(T(s.end));
      const same = sod(T(s.start)) === sod(T(s.end));
      tip.innerHTML = `<div class="pj"><i class="dot" style="background:hsl(${s.hue} 80% 62%)"></i>${A.esc(s.projName)}${s.live ? ` · <span style="color:var(--green)">läuft gerade</span>` : ""}</div>
        <h4>${A.esc(s.label)}</h4>
        <div class="cap mono">${A.esc(A.day(st))} ${A.hhmm(st)} - ${same ? "" : A.esc(A.day(en)) + " "}${A.hhmm(en)} · ${A.esc(A.rel(s.end))}</div>
        <div class="kv"><div><b>${s.nodes.length}</b>Schritte</div><div><b>${s.agents.length}</b>Agents</div><div><b>${A.fmtDur(ms)}</b>Dauer</div></div>
        <div class="row">${s.modelList.map(A.mp).join("") || `<span class="tag">kein Modell</span>`}</div>
        ${s.about ? `<div class="ab">${A.esc(s.about)}</div>` : ""}
        <div class="hint">KLICKEN ZUM ÖFFNEN</div>`;
      const rr = root.getBoundingClientRect(), nr = n.getBoundingClientRect();
      const tw = 280, th = tip.offsetHeight || 200;
      let x = nr.left - rr.left + 18, y = nr.top - rr.top - th / 2;
      if (x + tw > rr.width - 12) x = nr.left - rr.left - tw - 18;
      y = Math.max(12, Math.min(rr.height - th - 80, y));
      tip.style.left = x + "px"; tip.style.top = y + "px"; tip.classList.add("show");
    };
    const hideTip = () => tip.classList.remove("show");
    const byId = Object.fromEntries(sessions.map((s) => [s.id, s]));
    const onOver = (e) => {
      const n = e.target.closest(".cs-n button");
      if (n && !drag) showTip(byId[n.parentElement.dataset.n], n); else if (!e.target.closest(".cs-tip")) hideTip();
    };

    // ---------- Interaction ----------
    let drag = null, moved = false;
    const panBy = (dxPx) => { const sp = Math.exp(V.s), d = (-dxPx / G.PW) * sp; mode = null; segUpdate(); go(v0() + d, v1() + d, false); };
    const onDown = (e) => {
      if (e.button !== 0) return;
      const inMini = e.target.closest(".cs-mini"), inTl = e.target.closest(".cs-tl");
      if (!inMini && !inTl) return;
      if (e.target.closest(".cs-off")) return;
      moved = false;
      if (inMini) {
        const r = mini.getBoundingClientRect(), t = tMin + ((e.clientX - r.left) / r.width) * (tMax - tMin);
        if (!e.target.closest(".cs-win")) { const sp = Math.exp(V.s); mode = null; segUpdate(); go(t - sp / 2, t + sp / 2, true); }
        drag = { x: e.clientX, mini: true, c: V.tc, scale: (tMax - tMin) / r.width };
      } else drag = { x: e.clientX, c: V.c, scale: -Math.exp(V.s) / G.PW };
    };
    const onMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!moved && Math.abs(dx) < 4) return;
      if (!moved) { moved = true; root.classList.add("dragging"); hideTip(); cancelAnimationFrame(raf); raf = 0; mode = null; segUpdate(); }
      const c = drag.c + dx * drag.scale, sp = Math.exp(V.s);
      go(c - sp / 2, c + sp / 2, false);
    };
    const onUp = () => { drag = null; root.classList.remove("dragging"); };
    const onClick = (e) => {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; return; }
      const v = e.target.closest("[data-v]"), off = e.target.closest(".cs-off");
      if (v) return preset(v.dataset.v, true);
      if (off) { const t = +off.dataset.t, sp = Math.exp(V.s); mode = null; segUpdate(); go(t - sp * 0.3, t + sp * 0.7, true); }
    };
    const onWheel = (e) => {
      if (!e.target.closest(".cs-tl,.cs-mini")) return;
      const r = tl.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); hideTip();
        const px = Math.max(G.LW, e.clientX - r.left), t = v0() + ((px - G.LW) / G.PW) * Math.exp(V.s);
        const f = Math.exp(e.deltaY * 0.01), a = t - (t - v0()) * f, b = t + (v1() - t) * f;
        cancelAnimationFrame(raf); raf = 0; mode = null; segUpdate(); go(a, b, false); return;
      }
      const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      const canV = body.scrollHeight > body.clientHeight + 1;
      if (horiz || !canV) { e.preventDefault(); hideTip(); cancelAnimationFrame(raf); raf = 0; panBy(-(horiz ? (e.deltaX || e.deltaY) : e.deltaY)); }
    };
    let rz; const onResize = () => { measure(); drawMini(); layout(); segUpdate(); };

    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("click", onClick, true);
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("mouseover", onOver);
    root.addEventListener("mouseleave", hideTip);
    body.addEventListener("scroll", hideTip);
    const ro = new ResizeObserver(onResize); ro.observe(tl);
    A.onCleanup(() => {
      cancelAnimationFrame(raf); raf = 0; clearTimeout(rz); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      root.classList.remove("dragging");
    });

    const qv = new URLSearchParams(location.search).get("cview"); // optional start view for testing
    measure(); drawMini(); preset(presets[qv] ? qv : "week", false);
    requestAnimationFrame(segUpdate);
  }

  function onSelect(id) {
    selId = id;
    if (!root) return;
    root.querySelectorAll(".cs-n.sel").forEach((x) => x.classList.remove("sel"));
    if (id) root.querySelector(`.cs-n[data-n="${id}"]`)?.classList.add("sel");
  }

  Atlas.register({ key: "constellation", name: "Sternbild-Zeitachse", tagline: "Zeit von links nach rechts", css, render, onSelect, wantsArrows: false });
})();
