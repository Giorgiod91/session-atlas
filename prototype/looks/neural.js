// Look: Neuronales Netz. Force-directed canvas graph: sessions are glowing neurons clustered by project,
// synapses carry electrical pulses. Own tiny physics (repulsion, springs, centering, damping).
(function () {
  const css = `
.lk-neural { background: radial-gradient(1100px 700px at 65% 40%, #0d0b1f, #05050b 70%); overflow: hidden; user-select: none; -webkit-user-select: none; }
.lk-neural canvas.nn-c { position: absolute; inset: 0; width: 100%; height: 100%; cursor: grab; touch-action: none; }
.lk-neural.drag canvas.nn-c { cursor: grabbing; }
.lk-neural.hov canvas.nn-c { cursor: pointer; }
.lk-neural .nn-noise { position: absolute; inset: -50%; pointer-events: none; opacity: .07; mix-blend-mode: screen;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: nnGrain 1.2s steps(6) infinite; }
@keyframes nnGrain { 0% { transform: translate(0,0); } 33% { transform: translate(-3%,2%); } 66% { transform: translate(2%,-3%); } 100% { transform: translate(0,0); } }
.lk-neural .nn-vig { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 60% 45%, transparent 55%, rgba(0,0,0,.6)); }

.lk-neural .nn-panel { position: absolute; z-index: 3; top: 16px; left: 16px; bottom: 80px; width: 300px; display: flex; flex-direction: column; padding: 16px 14px 10px; border-radius: 22px;
  background: linear-gradient(170deg, rgba(139,108,255,.1), rgba(255,255,255,.035) 40%, rgba(45,212,191,.04)); animation: nnIn .8s var(--spring) both; }
@keyframes nnIn { from { opacity: 0; transform: translateX(-24px) scale(.97); } }
.lk-neural .nn-brand { display: flex; align-items: center; gap: 10px; padding: 0 4px; }
.lk-neural .nn-logo { width: 30px; height: 30px; border-radius: 50%; flex: none; position: relative;
  background: radial-gradient(circle at 40% 35%, #fff 0 8%, #c4b5ff 20%, #7c5cff 48%, rgba(124,92,255,0) 72%); box-shadow: 0 0 24px rgba(139,108,255,.65); }
.lk-neural .nn-logo::after { content: ""; position: absolute; inset: -6px; border-radius: 50%; border: 1px solid rgba(196,181,255,.35); animation: nnRing 2.6s ease-out infinite; }
@keyframes nnRing { from { transform: scale(.7); opacity: 1; } to { transform: scale(1.5); opacity: 0; } }
.lk-neural .nn-brand b { display: block; font: 700 11px var(--display); letter-spacing: .28em; color: #d8ceff; text-shadow: 0 0 14px rgba(139,108,255,.7); }
.lk-neural .nn-brand small { display: block; font: 500 11px var(--mono); color: var(--ink-3); margin-top: 2px; }
.lk-neural .nn-search { margin: 14px 0 10px; position: relative; }
.lk-neural .nn-search svg.i { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--ink-3); transition: color .2s; }
.lk-neural .nn-search input { width: 100%; height: 40px; padding: 0 34px 0 36px; border-radius: 13px; border: 1px solid var(--line); background: rgba(0,0,0,.3); color: var(--ink);
  font: 500 13.5px var(--sans); outline: none; transition: border-color .25s, box-shadow .3s; }
.lk-neural .nn-search input::placeholder { color: var(--ink-3); }
.lk-neural .nn-search input:focus { border-color: rgba(167,139,250,.7); box-shadow: 0 0 0 4px rgba(139,108,255,.15), 0 0 24px rgba(139,108,255,.25); }
.lk-neural .nn-search input:focus + svg.i { color: #c4b5ff; }
.lk-neural .nn-search .cnt { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font: 700 10.5px var(--mono); color: #c4b5ff; }
.lk-neural .nn-lbl { display: flex; justify-content: space-between; padding: 4px 6px 6px; font: 700 10px var(--mono); letter-spacing: .16em; text-transform: uppercase; color: var(--ink-3); }
.lk-neural .nn-list { flex: 1; min-height: 0; margin: 0 -6px; padding: 0 6px; -webkit-mask-image: linear-gradient(#000 88%, transparent); mask-image: linear-gradient(#000 88%, transparent); padding-bottom: 20px; }
.lk-neural .nn-row { --h: 262; width: 100%; display: grid; grid-template-columns: 12px minmax(0,1fr) auto; gap: 10px; align-items: center; padding: 8px 8px; border-radius: 12px; text-align: left;
  transition: background .2s, transform .35s var(--spring); animation: nnRow .6s var(--spring) both; animation-delay: calc(var(--i) * 30ms + 200ms); }
@keyframes nnRow { from { opacity: 0; transform: translateX(-10px); } }
.lk-neural .nn-row:hover, .lk-neural .nn-row.on { background: rgba(255,255,255,.07); transform: translateX(3px); }
.lk-neural .nn-row .sw { width: 10px; height: 10px; border-radius: 50%; background: hsl(var(--h) 85% 64%); box-shadow: 0 0 10px hsl(var(--h) 85% 60%); position: relative; }
.lk-neural .nn-row .sw.live::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; border: 1.5px solid var(--green); animation: nnRing 1.8s ease-out infinite; }
.lk-neural .nn-row .t { min-width: 0; }
.lk-neural .nn-row .t b { display: block; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-neural .nn-row .t small { display: block; font: 500 10.5px var(--mono); color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-neural .nn-row .r { font: 600 10.5px var(--mono); color: var(--ink-3); }
.lk-neural .nn-row mark { background: rgba(139,108,255,.35); color: #fff; border-radius: 3px; padding: 0 1px; }
.lk-neural .nn-empty { padding: 20px 8px; color: var(--ink-3); font-size: 12.5px; }

.lk-neural .nn-card { position: absolute; z-index: 4; left: 0; top: 0; width: 270px; padding: 12px 14px; border-radius: 16px; pointer-events: none;
  background: rgba(14,12,30,.72); border-color: rgba(167,139,250,.3); opacity: 0; transform: translateY(6px) scale(.96); transition: opacity .18s, transform .4s var(--spring); }
.lk-neural .nn-card.on { opacity: 1; transform: none; }
.lk-neural .nn-card .pj { --h: 262; display: flex; align-items: center; gap: 6px; font: 600 11px var(--mono); color: hsl(var(--h) 85% 74%); }
.lk-neural .nn-card .pj i { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--h) 85% 64%); box-shadow: 0 0 8px hsl(var(--h) 85% 60%); }
.lk-neural .nn-card h4 { margin: 4px 0 0; font-size: 14.5px; line-height: 1.25; font-weight: 800; letter-spacing: -.01em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.lk-neural .nn-card .kv { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 6px; margin-top: 10px; }
.lk-neural .nn-card .kv div { background: rgba(0,0,0,.3); border: 1px solid var(--line); border-radius: 9px; padding: 5px 8px; font: 500 9.5px var(--mono); color: var(--ink-3); letter-spacing: .04em; }
.lk-neural .nn-card .kv b { display: block; font: 800 12.5px var(--mono); color: var(--ink); white-space: nowrap; letter-spacing: 0; }
.lk-neural .nn-card .hint { display: flex; justify-content: space-between; gap: 8px; white-space: nowrap; margin-top: 8px; font: 600 10px var(--mono); color: #c4b5ff; letter-spacing: .06em; }

.lk-neural .nn-hud { position: absolute; z-index: 3; top: 16px; right: 16px; display: flex; gap: 8px; align-items: center; transition: right .65s var(--spring); }
.lk-neural .nn-hud .st { padding: 8px 12px; border-radius: 13px; font: 600 11px var(--mono); color: var(--ink-3); white-space: nowrap; }
.lk-neural .nn-hud .st b { color: var(--ink); margin-right: 3px; }
.lk-neural .nn-hud button { width: 36px; height: 36px; border-radius: 12px; display: grid; place-items: center; font: 700 16px var(--mono); color: var(--ink-2); transition: transform .3s var(--spring), color .2s; }
.lk-neural .nn-hud button:hover { color: var(--ink); transform: scale(1.08); }
.lk-neural .nn-hud button:active { transform: scale(.92); }
.lk-neural .nn-help { position: absolute; z-index: 2; right: 20px; bottom: 22px; font: 500 11px var(--mono); color: var(--ink-3); pointer-events: none; }
@media (max-width: 1250px) { .lk-neural .nn-help { display: none; } .lk-neural .nn-hud .st.x { display: none; } }
@media (max-width: 900px) { .lk-neural .nn-panel { width: 250px; } }
@media (prefers-reduced-motion: reduce) { .lk-neural .nn-noise, .lk-neural .nn-logo::after, .lk-neural .nn-row .sw.live::after { animation: none; } }
`;

  let st = null; // per-render state, also used by onSelect

  function render(root, A) {
    const { sessions, projects, totals } = A.DATA;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skipIntro = reduce || window.__ATLAS_TEST;
    const now = Date.now();
    const DAY = 864e5;
    const dayKey = (iso) => new Date(iso).toDateString();
    const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

    root.innerHTML = `
      <canvas class="nn-c"></canvas><div class="nn-noise"></div><div class="nn-vig"></div>
      <aside class="nn-panel glass">
        <div class="nn-brand"><span class="nn-logo"></span><div><b>NEURONEN</b><small>${totals.sessions} Sessions · ${projects.length} Projekte</small></div></div>
        <label class="nn-search"><input type="search" placeholder="Neuronen durchsuchen…" spellcheck="false" autocomplete="off">${A.ic("search")}<span class="cnt"></span></label>
        <div class="nn-lbl"><span>Zuletzt</span><span class="nn-lr">aktiv</span></div>
        <div class="nn-list scroll"></div>
      </aside>
      <div class="nn-hud"><span class="st glass"><b>${totals.steps}</b>Schritte</span><span class="st glass x"><b>${totals.agents}</b>Agents</span>
        <button class="glass" data-z="1" aria-label="Hineinzoomen">+</button><button class="glass" data-z="-1" aria-label="Herauszoomen">−</button><button class="glass" data-z="0" aria-label="Alles zeigen">${A.ic("grid")}</button></div>
      <div class="nn-card glass"></div>
      <div class="nn-help">Ziehen = bewegen · Rad = zoomen · Klick = öffnen</div>`;

    const cv = root.querySelector("canvas"), ctx = cv.getContext("2d");
    const card = root.querySelector(".nn-card"), list = root.querySelector(".nn-list"), input = root.querySelector("input"), cnt = root.querySelector(".cnt");

    // ---------- Graph ----------
    const nodes = [], links = [];
    const projOrder = projects.slice().sort((a, b) => b.sessions.length - a.sessions.length);
    const PR = 150 + projOrder.length * 26; // ring radius for project anchors
    projOrder.forEach((p, i) => {
      const a = (i / projOrder.length) * Math.PI * 2 + 0.3, rr = i === 0 ? 0 : PR * (i % 2 ? 1 : 0.72);
      p._a = { kind: "anchor", p, x: Math.cos(a) * rr, y: Math.sin(a) * rr, vx: 0, vy: 0, r: 0, hue: p.hue, mass: 4 };
      nodes.push(p._a);
    });
    const byId = {};
    sessions.forEach((s, i) => {
      const an = s.project && projects.find((p) => p.path === s.project)._a;
      const ang = i * 2.399, d = 30 + (i % 5) * 12;
      const age = (now - Date.parse(s.end)) / DAY;
      const n = { kind: "s", s, x: an.x + Math.cos(ang) * d, y: an.y + Math.sin(ang) * d, vx: 0, vy: 0, hue: s.hue, mass: 1,
        r: 5 + Math.sqrt(s.nodes.length) * 2.1, heat: Math.max(0.12, Math.exp(-age / 3)), born: i, an };
      byId[s.id] = n; nodes.push(n);
      links.push({ a: an, b: n, len: 46 + n.r * 2, k: 0.05, vis: false });
      s.agents.forEach((ag, j) => {
        const sa = { kind: "a", ag, s, x: n.x + 10 + j * 3, y: n.y + 10, vx: 0, vy: 0, r: 2.6, hue: 262, mass: 0.25, parent: n, born: i };
        nodes.push(sa); links.push({ a: n, b: sa, len: n.r + 10, k: 0.25, vis: false, sat: true });
      });
    });
    // Synapses: same project, shared edited files, same day (thin, faint)
    const syn = new Map();
    const addSyn = (x, y, type) => {
      const key = x.s.id < y.s.id ? x.s.id + y.s.id : y.s.id + x.s.id;
      const cur = syn.get(key);
      if (cur) { if (type === "proj") cur.type = "proj"; else if (type === "file" && cur.type === "day") cur.type = "file"; return; }
      syn.set(key, { a: x, b: y, type, vis: true, len: type === "proj" ? 70 : 170, k: type === "proj" ? 0.012 : type === "file" ? 0.006 : 0.0025 });
    };
    const sn = sessions.map((s) => byId[s.id]);
    projects.forEach((p) => { const l = p.sessions.slice().sort((a, b) => a.start.localeCompare(b.start)); for (let i = 1; i < l.length; i++) addSyn(byId[l[i - 1].id], byId[l[i].id], "proj"); });
    for (let i = 0; i < sn.length; i++) for (let j = i + 1; j < sn.length; j++) {
      const a = sn[i], b = sn[j];
      const fa = new Set(a.s.files || []);
      if ((b.s.files || []).some((f) => fa.has(f))) addSyn(a, b, "file");
      else if (dayKey(a.s.end) === dayKey(b.s.end) || dayKey(a.s.start) === dayKey(b.s.start)) addSyn(a, b, "day");
    }
    const synapses = [...syn.values()];
    links.push(...synapses);
    const nbr = new Map(sn.map((n) => [n, new Set()]));
    synapses.forEach((l) => { nbr.get(l.a).add(l.b); nbr.get(l.b).add(l.a); });

    // ---------- Physics ----------
    const drag = { node: null, pan: false, sx: 0, sy: 0, moved: false, ox: 0, oy: 0 };
    let alpha = 1;
    function tick() {
      const N = nodes.length;
      for (let i = 0; i < N; i++) {
        const a = nodes[i]; if (a.kind === "a") continue;
        for (let j = i + 1; j < N; j++) {
          const b = nodes[j]; if (b.kind === "a") continue;
          let dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy || 0.01;
          if (d2 > 160000) continue;
          const both = a.kind === "anchor" && b.kind === "anchor";
          const f = ((both ? 9000 : a.kind === "anchor" || b.kind === "anchor" ? 900 : 1300) + (a.r + b.r) * 40) / d2 * alpha;
          const d = Math.sqrt(d2); dx /= d; dy /= d;
          a.vx -= dx * f / a.mass; a.vy -= dy * f / a.mass; b.vx += dx * f / b.mass; b.vy += dy * f / b.mass;
          const min = a.r + b.r + 10; // soft collision
          if (d < min && a.kind === "s" && b.kind === "s") { const o = (min - d) * 0.25; a.x -= dx * o; a.y -= dy * o; b.x += dx * o; b.y += dy * o; }
        }
      }
      for (const l of links) {
        const dx = l.b.x - l.a.x, dy = l.b.y - l.a.y, d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = (d - l.len) * l.k * (l.sat ? 1 : alpha + 0.15);
        const fx = dx / d * f, fy = dy / d * f;
        l.a.vx += fx / l.a.mass; l.a.vy += fy / l.a.mass; l.b.vx -= fx / l.b.mass; l.b.vy -= fy / l.b.mass;
      }
      for (const n of nodes) {
        if (n.kind === "anchor") { n.vx -= n.x * 0.004 * (alpha + 0.1); n.vy -= n.y * 0.004 * (alpha + 0.1); }
        if (n === drag.node) { n.vx = n.vy = 0; continue; }
        n.vx *= n.kind === "a" ? 0.7 : 0.82; n.vy *= n.kind === "a" ? 0.7 : 0.82;
        const sp = Math.hypot(n.vx, n.vy); if (sp > 30) { n.vx *= 30 / sp; n.vy *= 30 / sp; }
        n.x += n.vx; n.y += n.vy;
      }
      alpha = Math.max(0.03, alpha * 0.985);
    }
    for (let i = 0; i < 380; i++) tick();
    alpha = 0.12;

    // ---------- View ----------
    let W = 0, H = 0, dpr = 1;
    const view = { x: 0, y: 0, k: 1 }, target = { x: 0, y: 0, k: 1 };
    const panelW = () => (root.querySelector(".nn-panel").getBoundingClientRect().right || 316);
    function fit(instant) {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      nodes.forEach((n) => { if (n.kind === "a") return; x0 = Math.min(x0, n.x - n.r); y0 = Math.min(y0, n.y - n.r); x1 = Math.max(x1, n.x + n.r); y1 = Math.max(y1, n.y + n.r); });
      const left = panelW() + 30, right = W - 30 - (document.getElementById("drawer").classList.contains("open") ? 512 : 0), top = 70, bot = H - 90;
      const k = Math.min(1.6, Math.min((right - left) / (x1 - x0 + 120), (bot - top) / (y1 - y0 + 80)));
      target.k = k; target.x = (left + right) / 2 - ((x0 + x1) / 2) * k; target.y = (top + bot) / 2 - ((y0 + y1) / 2) * k;
      if (instant) Object.assign(view, target);
    }
    function resize() {
      dpr = Math.min(2, devicePixelRatio || 1); W = root.clientWidth; H = root.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; fit(true);
    }
    const toScreen = (n) => ({ x: n.x * view.k + view.x, y: n.y * view.k + view.y });
    const toWorld = (x, y) => ({ x: (x - view.x) / view.k, y: (y - view.y) / view.k });

    // Pre-rendered glow sprites per hue (additive)
    const sprites = {};
    function sprite(h) {
      if (sprites[h]) return sprites[h];
      const c = document.createElement("canvas"), S = 128; c.width = c.height = S; const g = c.getContext("2d");
      const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      gr.addColorStop(0, `hsla(${h},95%,85%,1)`); gr.addColorStop(0.12, `hsla(${h},90%,70%,.85)`); gr.addColorStop(0.35, `hsla(${h},85%,58%,.28)`); gr.addColorStop(1, `hsla(${h},85%,50%,0)`);
      g.fillStyle = gr; g.fillRect(0, 0, S, S); return (sprites[h] = c);
    }

    // ---------- Pulses ----------
    const pulses = [];
    function spawnPulses(dt) {
      if (reduce) return;
      for (const l of synapses) {
        const heat = Math.max(l.a.heat, l.b.heat);
        if (Math.random() < dt * (0.02 + heat * 0.22) * (l.type === "proj" ? 1.4 : 0.6) && pulses.length < 90) {
          const fwd = Math.random() < 0.5;
          pulses.push({ l, t: 0, fwd, sp: 0.35 + Math.random() * 0.5, h: (fwd ? l.a : l.b).hue });
        }
      }
    }

    // ---------- Interaction state ----------
    let hover = null, sel = null, query = "", matches = null, listHover = null;
    function pick(mx, my) {
      let best = null, bd = 1e9;
      for (const n of nodes) {
        if (n.kind === "anchor") continue;
        const p = toScreen(n), d = Math.hypot(p.x - mx, p.y - my), rr = Math.max(9, n.r * view.k + 5);
        if (d < rr && d < bd) { bd = d; best = n; }
      }
      return best;
    }
    const focusNode = () => listHover || (hover && (hover.kind === "a" ? hover.parent : hover)) || null;

    function showCard() {
      const f = hover;
      if (!f) { card.classList.remove("on"); return; }
      const s = f.s, n = f.kind === "a" ? f.parent : f;
      card.innerHTML = f.kind === "a"
        ? `<div class="pj" style="--h:262"><i></i>Subagent · ${A.esc(A.aName(f.ag.type))}</div><h4>${A.esc(f.ag.description || f.ag.task || "Subagent")}</h4>
           <div class="kv"><div>Dauer<b>${A.fmtDur(Date.parse(f.ag.end) - Date.parse(f.ag.start))}</b></div><div>Tokens<b>${A.fmtTok(f.ag.tokens || 0)}</b></div><div>Steps<b>${f.ag.steps || 0}</b></div></div>
           <div class="hint"><span>Subagent</span><span>IN SESSION ÖFFNEN ▸</span></div>`
        : `<div class="pj" style="--h:${s.hue}"><i></i>${A.esc(s.projName)}${s.live ? ` · <span style="color:var(--green)">läuft</span>` : ""}</div><h4>${A.esc(s.label)}</h4>
           <div class="kv"><div>Zuletzt<b>${A.esc(A.rel(s.end))}</b></div><div>Schritte<b>${s.nodes.length}</b></div><div>Agents<b>${1 + s.agents.length}</b></div></div>
           <div class="hint"><span>${A.esc(A.day(s.end))} · ${A.hhmm(s.end)}</span><span>ÖFFNEN ▸</span></div>`;
      placeCard(n);
      card.classList.add("on");
    }
    function placeCard(n) {
      const p = toScreen(n), cw = 270, ch = card.offsetHeight || 130, off = n.r * view.k + 16;
      let x = p.x + off, y = p.y - ch / 2;
      if (x + cw > W - 12) x = p.x - off - cw;
      y = Math.max(12, Math.min(H - ch - 80, y));
      card.style.transform = ""; card.style.left = x + "px"; card.style.top = y + "px";
    }

    // ---------- List ----------
    const hl = (t) => { const e = A.esc(t); if (!query) return e; const i = t.toLowerCase().indexOf(query); if (i < 0) return e; return A.esc(t.slice(0, i)) + "<mark>" + A.esc(t.slice(i, i + query.length)) + "</mark>" + A.esc(t.slice(i + query.length)); };
    function renderList() {
      const rows = (matches ? sessions.filter((s) => matches.has(s.id)) : sessions).slice(0, 40);
      cnt.textContent = matches ? `${matches.size}` : "";
      root.querySelector(".nn-lr").textContent = matches ? "Treffer" : "aktiv";
      list.innerHTML = rows.length ? rows.map((s, i) => `<button class="nn-row" style="--i:${Math.min(i, 14)};--h:${s.hue}" data-id="${s.id}">
          <span class="sw ${s.live ? "live" : ""}"></span><span class="t"><b>${hl(s.label)}</b><small>${hl(s.projName)} · ${s.nodes.length} Schritte</small></span><span class="r">${A.relShort(s.end)}</span></button>`).join("")
        : `<div class="nn-empty">Kein Neuron passt zu „${A.esc(query)}“.</div>`;
    }
    input.addEventListener("input", () => {
      query = input.value.trim().toLowerCase();
      matches = query ? new Set(sessions.filter((s) => (s.label + " " + s.projName + " " + s.about + " " + (s.branch || "")).toLowerCase().includes(query)).map((s) => s.id)) : null;
      renderList();
    });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && matches && matches.size) A.open([...matches][0]); });
    list.addEventListener("click", (e) => { const b = e.target.closest(".nn-row"); if (b) A.open(b.dataset.id); });
    list.addEventListener("pointerover", (e) => { const b = e.target.closest(".nn-row"); listHover = b ? byId[b.dataset.id] : null; });
    list.addEventListener("pointerleave", () => { listHover = null; });
    renderList();

    root.querySelector(".nn-hud").addEventListener("click", (e) => {
      const b = e.target.closest("[data-z]"); if (!b) return; const z = +b.dataset.z;
      if (!z) return fit(false);
      const cx = (panelW() + W) / 2, cy = H / 2, k = Math.max(0.25, Math.min(4, target.k * (z > 0 ? 1.35 : 1 / 1.35)));
      target.x = cx - (cx - target.x) * (k / target.k); target.y = cy - (cy - target.y) * (k / target.k); target.k = k;
    });

    // ---------- Pointer ----------
    cv.addEventListener("pointerdown", (e) => {
      cv.setPointerCapture(e.pointerId);
      drag.sx = e.clientX; drag.sy = e.clientY; drag.moved = false;
      const n = pick(e.clientX, e.clientY);
      if (n) { drag.node = n; } else { drag.pan = true; drag.ox = target.x; drag.oy = target.y; }
      root.classList.add("drag");
    });
    cv.addEventListener("pointermove", (e) => {
      if (drag.node || drag.pan) {
        if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 4) drag.moved = true;
        if (drag.node && drag.moved) { const w = toWorld(e.clientX, e.clientY); drag.node.x = w.x; drag.node.y = w.y; alpha = Math.max(alpha, 0.3); }
        if (drag.pan) { target.x = view.x = drag.ox + e.clientX - drag.sx; target.y = view.y = drag.oy + e.clientY - drag.sy; }
        return;
      }
      const n = pick(e.clientX, e.clientY);
      if (n !== hover) { hover = n; root.classList.toggle("hov", !!n); showCard(); }
    });
    const up = (e) => {
      const n = drag.node, click = !drag.moved;
      drag.node = null; drag.pan = false; root.classList.remove("drag");
      if (click && n) A.open(n.s.id, n.kind === "a" ? n.ag.node : undefined);
    };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", () => { if (!drag.node && !drag.pan) { hover = null; root.classList.remove("hov"); showCard(); } });
    cv.addEventListener("wheel", (e) => {
      e.preventDefault();
      const k = Math.max(0.25, Math.min(4, target.k * Math.exp(-e.deltaY * 0.0015)));
      target.x = e.clientX - (e.clientX - target.x) * (k / target.k); target.y = e.clientY - (e.clientY - target.y) * (k / target.k); target.k = k;
    }, { passive: false });

    // ---------- Draw ----------
    const t0 = performance.now();
    function draw(time) {
      const T = (time - t0) / 1000;
      const intro = skipIntro ? 1 : Math.min(1, T / 1.3);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const f = focusNode(), lit = f ? new Set([f, ...nbr.get(f)]) : null;
      const dimOf = (n) => {
        const base = n.kind === "a" ? n.parent : n;
        if (lit) return lit.has(base) ? 1 : 0.12;
        if (matches) return matches.has(base.s.id) ? 1 : 0.12;
        return 1;
      };
      const k = view.k;
      ctx.save(); ctx.translate(view.x, view.y); ctx.scale(k, k);

      // Project anchor auras + labels underneath
      ctx.globalCompositeOperation = "lighter";
      for (const p of projOrder) {
        const a = p._a; const kids = sn.filter((n) => n.an === a); if (!kids.length) continue;
        let cx = 0, cy = 0; kids.forEach((n) => { cx += n.x; cy += n.y; }); cx /= kids.length; cy /= kids.length; p._c = { x: cx, y: cy };
        const rad = 60 + Math.sqrt(kids.length) * 40;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        const on = lit ? kids.some((n) => lit.has(n)) : matches ? kids.some((n) => matches.has(n.s.id)) : true;
        g.addColorStop(0, `hsla(${p.hue},80%,55%,${(on ? 0.09 : 0.025) * intro})`); g.addColorStop(1, `hsla(${p.hue},80%,55%,0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 7); ctx.fill();
      }

      // Synapses
      ctx.lineCap = "round";
      for (const l of synapses) {
        const d = Math.min(dimOf(l.a), dimOf(l.b));
        const on = lit && lit.has(l.a) && lit.has(l.b) && (l.a === f || l.b === f);
        const base = l.type === "proj" ? 0.3 : l.type === "file" ? 0.17 : 0.09;
        const al = (on ? 0.75 : base * (d < 1 ? 0.3 : 1)) * intro;
        if (al < 0.01) continue;
        const g = ctx.createLinearGradient(l.a.x, l.a.y, l.b.x, l.b.y);
        g.addColorStop(0, `hsla(${l.a.hue},85%,65%,${al})`); g.addColorStop(1, `hsla(${l.b.hue},85%,65%,${al})`);
        ctx.strokeStyle = g; ctx.lineWidth = (on ? 1.6 : l.type === "proj" ? 1.1 : 0.7) / Math.sqrt(k);
        ctx.setLineDash(l.type === "day" && !on ? [2 / k, 5 / k] : []);
        ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y);
        // gentle curve
        const mx = (l.a.x + l.b.x) / 2 + (l.b.y - l.a.y) * 0.08, my = (l.a.y + l.b.y) / 2 - (l.b.x - l.a.x) * 0.08;
        l.mx = mx; l.my = my;
        ctx.quadraticCurveTo(mx, my, l.b.x, l.b.y); ctx.stroke();
      }
      ctx.setLineDash([]);

      // Pulses
      for (const p of pulses) {
        const l = p.l, d = Math.min(dimOf(l.a), dimOf(l.b)); const t = p.fwd ? p.t : 1 - p.t;
        const q = (u) => { const v = 1 - u; return { x: v * v * l.a.x + 2 * v * u * l.mx + u * u * l.b.x, y: v * v * l.a.y + 2 * v * u * l.my + u * u * l.b.y }; };
        for (let j = 0; j < 5; j++) {
          const u = Math.max(0, Math.min(1, t - (p.fwd ? 1 : -1) * j * 0.025)), pt = q(u);
          const al = (1 - j / 5) * d * Math.sin(Math.PI * p.t) ** 0.5;
          const s = (3.2 - j * 0.45) / Math.sqrt(k);
          ctx.fillStyle = j === 0 ? `rgba(255,255,255,${al})` : `hsla(${p.h},95%,72%,${al * 0.7})`;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, s, 0, 7); ctx.fill();
        }
        const pt = q(t); ctx.globalAlpha = 0.6 * d; ctx.drawImage(sprite(p.h), pt.x - 10 / k, pt.y - 10 / k, 20 / k, 20 / k); ctx.globalAlpha = 1;
      }

      // Satellite tethers + neurons
      for (const n of nodes) {
        if (n.kind === "anchor") continue;
        const appear = skipIntro ? 1 : Math.max(0, Math.min(1, (T - n.born * 0.025) / 0.6));
        if (appear <= 0) continue;
        const sc = appear < 1 ? 1 - Math.pow(1 - appear, 3) * Math.cos(appear * 6) : 1; // springy pop
        const d = dimOf(n);
        if (n.kind === "a") {
          ctx.strokeStyle = `rgba(196,181,255,${0.35 * d})`; ctx.lineWidth = 0.7 / k;
          ctx.beginPath(); ctx.moveTo(n.parent.x, n.parent.y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
        const breathe = reduce ? 1 : 1 + Math.sin(T * 2 + n.born) * 0.06 * (n.heat || 0.3);
        const R = n.r * sc * breathe * (n === hover || n === listHover ? 1.25 : 1);
        const gr = R * (n.kind === "a" ? 5 : 3.4 + (n.heat || 0) * 1.6);
        ctx.globalAlpha = d * (0.55 + 0.45 * (n.heat || 0.5));
        ctx.drawImage(sprite(n.hue), n.x - gr, n.y - gr, gr * 2, gr * 2);
        ctx.globalAlpha = d;
        ctx.fillStyle = n.kind === "a" ? "#e9e3ff" : `hsl(${n.hue},90%,${78 + (n.heat || 0) * 12}%)`;
        ctx.beginPath(); ctx.arc(n.x, n.y, R * (n.kind === "a" ? 0.9 : 0.42), 0, 7); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Rings: selection, live, search match (normal compositing for crisp lines)
      ctx.globalCompositeOperation = "source-over";
      for (const n of sn) {
        const s = n.s;
        if (s.live && !reduce) {
          const ph = (T * 0.6 + n.born * 0.1) % 1;
          ctx.strokeStyle = `rgba(74,222,128,${(1 - ph) * 0.8})`; ctx.lineWidth = 1.5 / k;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 4 + ph * 18, 0, 7); ctx.stroke();
        }
        if (matches && matches.has(s.id)) { ctx.strokeStyle = "rgba(196,181,255,.85)"; ctx.lineWidth = 1.4 / k; ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 5, 0, 7); ctx.stroke(); }
        if (sel === s.id || n === f) {
          ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.6 / k; const rr = n.r + 7;
          ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(reduce ? 0 : T * 0.8);
          for (let q = 0; q < 4; q++) { ctx.beginPath(); ctx.arc(0, 0, rr, q * Math.PI / 2 + 0.2, q * Math.PI / 2 + 1.2); ctx.stroke(); }
          ctx.restore();
        }
      }
      ctx.restore();

      // Labels in screen space (crisp text)
      ctx.textBaseline = "middle";
      const placed = [];
      const hit = (b) => placed.some((o) => o.x0 < b.x1 && o.x1 > b.x0 && o.y0 < b.y1 && o.y1 > b.y0);
      for (const p of projOrder) {
        if (!p._c) continue; const kids = sn.filter((n) => n.an === p._a);
        let top = 1e9; kids.forEach((n) => { top = Math.min(top, n.y - n.r); });
        const sx = p._c.x * k + view.x; let sy = top * k + view.y - 16;
        const on = lit ? kids.some((n) => lit.has(n)) : matches ? kids.some((n) => matches.has(n.s.id)) : true;
        ctx.font = `700 ${Math.max(9.5, Math.min(12, 11 * Math.sqrt(k)))}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        const txt = trunc(p.name, 22).toUpperCase().split("").join(String.fromCharCode(8202));
        const tw = ctx.measureText(txt).width; let yy = sy;
        for (let g = 0; g < 6; g++) { const b = { x0: sx - tw / 2 - 4, x1: sx + tw / 2 + 4, y0: yy - 8, y1: yy + 8 }; if (!hit(b)) { placed.push(b); break; } yy -= 15; }
        sy = yy;
        ctx.fillStyle = `hsla(${p.hue},85%,72%,${(on ? 0.75 : 0.18) * intro})`;
        ctx.shadowColor = `hsla(${p.hue},85%,55%,.6)`; ctx.shadowBlur = 10;
        ctx.fillText(txt, sx, sy); ctx.shadowBlur = 0;
      }
      // Session titles: for focus neighbourhood, search hits, or the few biggest/latest when zoomed in enough
      const labelSet = new Set();
      if (lit) lit.forEach((n) => labelSet.add(n));
      else if (matches) sn.forEach((n) => matches.has(n.s.id) && labelSet.add(n));
      else sn.forEach((n, i) => { if (i < 5 || (k > 1.1 && n.s.nodes.length > 20)) labelSet.add(n); });
      ctx.textAlign = "left"; ctx.font = `600 12px Figtree, sans-serif`;
      [...labelSet].sort((a, b) => (b === f) - (a === f) || b.heat - a.heat).forEach((n) => {
        const p = toScreen(n), x = p.x + n.r * k + 8, y = p.y;
        const txt = trunc(n.s.label, 34), w = ctx.measureText(txt).width;
        const box = { x0: x - 2, x1: x + w + 2, y0: y - 9, y1: y + 9 };
        if (n !== f && hit(box)) return;
        placed.push(box);
        ctx.fillStyle = "rgba(5,5,11,.55)"; ctx.fillRect(box.x0 - 3, box.y0, box.x1 - box.x0 + 6, 18);
        ctx.fillStyle = n === f ? "#fff" : `rgba(236,233,245,${0.85 * intro})`;
        ctx.fillText(txt, x, y + 0.5);
      });
    }

    // ---------- Loop ----------
    let raf = 0, last = performance.now();
    function frame(time) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) { last = time; return; }
      const dt = Math.min(0.05, (time - last) / 1000); last = time;
      if (!reduce || drag.node || alpha > 0.04) tick();
      // ease view towards target (spring-ish)
      view.x += (target.x - view.x) * 0.16; view.y += (target.y - view.y) * 0.16; view.k += (target.k - view.k) * 0.16;
      spawnPulses(dt);
      for (let i = pulses.length - 1; i >= 0; i--) { pulses[i].t += dt * pulses[i].sp; if (pulses[i].t >= 1) pulses.splice(i, 1); }
      draw(time);
      if (hover) placeCard(hover.kind === "a" ? hover.parent : hover);
    }
    const onResize = () => resize();
    resize(); draw(performance.now() + (skipIntro ? 0 : 0));
    addEventListener("resize", onResize);
    raf = requestAnimationFrame(frame);

    st = { set sel(v) { sel = v; }, refit: () => setTimeout(() => fit(false), 60) };
    A.onCleanup(() => { cancelAnimationFrame(raf); removeEventListener("resize", onResize); st = null; });
  }

  Atlas.register({
    key: "neural", name: "Neuronales Netz", tagline: "Sessions als lebendes Netz", css, render,
    onSelect(id) { if (!st) return; st.sel = id; st.refit(); },
  });
})();
