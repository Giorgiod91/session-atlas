// Look: Zeitmaschine. Sessions as stacked glass cards receding into a tunnel, newest in front.
// Wheel / drag / arrow keys fly through time with spring physics; a day scale on the right jumps.
(function () {
  const css = `
.lk-deck { overflow: hidden; user-select: none; touch-action: none;
  background:
    radial-gradient(700px 480px at 30% 18%, rgba(120,70,255,.20), transparent 65%),
    radial-gradient(800px 520px at 78% 72%, rgba(20,170,200,.14), transparent 65%),
    radial-gradient(1200px 800px at 50% 40%, #0b0d24, #04040c 70%); }
.lk-deck .dk-neb { position: absolute; inset: -20%; pointer-events: none; opacity: .55; filter: blur(40px);
  background: conic-gradient(from 0deg at 45% 45%, rgba(139,108,255,.0), rgba(139,108,255,.22), rgba(45,212,191,.0) 30%, rgba(251,113,133,.12) 55%, rgba(34,211,238,.0) 70%, rgba(139,108,255,.0));
  animation: dkNeb 60s linear infinite; }
@keyframes dkNeb { to { transform: rotate(360deg); } }
.lk-deck canvas.dk-stars { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

/* Header */
.lk-deck .dk-head { position: absolute; left: 28px; top: 22px; z-index: 30; pointer-events: none; }
.lk-deck .dk-head .k { font: 700 10.5px var(--mono); letter-spacing: .3em; text-transform: uppercase; color: rgba(190,180,255,.6); }
.lk-deck .dk-head h1 { margin: 4px 0 0; font: 900 22px var(--display); letter-spacing: .14em; color: #f1edff; text-shadow: 0 0 22px rgba(139,108,255,.65); }
.lk-deck .dk-head .cap { margin-top: 6px; }
.lk-deck .dk-now { position: absolute; left: 28px; top: 112px; z-index: 30; pointer-events: none; }
.lk-deck .dk-now .d { font: 800 30px/1.1 var(--display); letter-spacing: .04em; color: #fff; text-shadow: 0 0 22px rgba(139,108,255,.75); white-space: nowrap; }
.lk-deck .dk-now .s { font: 600 11.5px var(--mono); color: var(--ink-2); letter-spacing: .1em; }

/* Stack */
.lk-deck .dk-stack { position: absolute; left: 0; right: 130px; top: 0; bottom: 0; perspective: 1300px; perspective-origin: 50% 8%; transition: right .6s var(--spring); }
.lk-deck.dk-open .dk-stack { right: 640px; }
.lk-deck.dk-open .dk-now { opacity: 0; }
.lk-deck .dk-now { transition: opacity .3s ease; }
.lk-deck .dk-card { position: absolute; left: 50%; top: 57%; width: var(--cw, 700px); height: var(--chh, 372px); margin-left: calc(var(--cw, 700px) / -2); margin-top: calc(var(--chh, 372px) / -2);
  border-radius: 24px; padding: 20px 24px 18px; display: flex; flex-direction: column; gap: 10px; will-change: transform, opacity; visibility: hidden;
  background: linear-gradient(155deg, #23213e, #111220 55%, #0e1822);
  border: 1px solid rgba(255,255,255,.13);
  box-shadow: 0 1px 0 rgba(255,255,255,.12) inset, 0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4); }
.lk-deck .dk-card::before { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: linear-gradient(120deg, hsl(var(--h) 80% 62% / .16), transparent 40%), radial-gradient(500px 200px at 100% 0%, hsl(var(--h) 80% 62% / .10), transparent 70%); }
.lk-deck .dk-card::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: #05060f; opacity: var(--dim, 0); }
.lk-deck .dk-card > * { position: relative; z-index: 1; }
.lk-deck .dk-card:not(.front) * { pointer-events: none !important; }
.lk-deck .dk-card:not(.front) { cursor: pointer; }
.lk-deck .dk-card.front { cursor: pointer; border-color: hsl(var(--h) 80% 70% / .45);
  box-shadow: 0 1px 0 rgba(255,255,255,.16) inset, 0 50px 110px rgba(0,0,0,.65), 0 0 70px hsl(var(--h) 80% 62% / .16); }
.lk-deck .dk-card.on { border-color: #fff; }

.lk-deck .dk-top { display: flex; align-items: center; gap: 10px; min-width: 0; }
.lk-deck .chip { display: inline-flex; align-items: center; gap: 7px; padding: 4px 11px 4px 9px; border-radius: 999px; font: 700 12px var(--sans); min-width: 0; max-width: 46%;
  background: hsl(var(--h) 80% 62% / .14); border: 1px solid hsl(var(--h) 80% 62% / .4); color: hsl(var(--h) 90% 82%); }
.lk-deck .chip .sw { width: 8px; height: 8px; border-radius: 50%; background: hsl(var(--h) 80% 62%); box-shadow: 0 0 10px hsl(var(--h) 80% 62%); flex: none; }
.lk-deck .chip span:last-child { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.lk-deck .dk-top .live { font: 700 11px var(--mono); color: var(--green); display: inline-flex; gap: 6px; align-items: center; }
.lk-deck .dk-top .tm { margin-left: auto; font: 600 12px var(--mono); color: var(--ink-2); white-space: nowrap; }
.lk-deck .dk-top .tm b { color: var(--ink); }
.lk-deck .dk-card h2 { margin: 2px 0 0; font: 800 27px/1.12 var(--sans); letter-spacing: -.03em; color: #fff; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.lk-deck .dk-last { font-size: 13px; color: var(--ink-2); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.4; }
.lk-deck .dk-last b { color: var(--ink-3); font: 700 10.5px var(--mono); letter-spacing: .12em; text-transform: uppercase; margin-right: 6px; }
.lk-deck .lbl { font: 700 10px var(--mono); letter-spacing: .16em; text-transform: uppercase; color: var(--ink-3); display: flex; gap: 8px; }
.lk-deck .lbl .r { margin-left: auto; letter-spacing: .04em; text-transform: none; }

/* Step dots path */
.lk-deck .dk-steps { flex: 1; min-height: 52px; justify-content: center; display: flex; flex-direction: column; gap: 4px; }
.lk-deck .dk-steps svg { width: 100%; flex: 1; min-height: 40px; max-height: 64px; overflow: visible; }
.lk-deck .dk-steps .ln { fill: none; stroke: url(#dkg); stroke-width: 2.2; stroke-linecap: round; }
.lk-deck .dk-card.front .dk-steps .ln { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); animation: dkDraw 1.1s cubic-bezier(.6,0,.2,1) .05s forwards; }
@keyframes dkDraw { to { stroke-dashoffset: 0; } }
.lk-deck .dk-steps .pt { fill: #191b2e; stroke: hsl(var(--h) 80% 70%); stroke-width: 2; transition: r .3s var(--spring), fill .2s; cursor: pointer; }
.lk-deck .dk-steps .pt:hover { fill: hsl(var(--h) 80% 70%); r: 7; }
.lk-deck .dk-steps .end { fill: #fff; stroke: hsl(var(--h) 80% 70%); stroke-width: 3; filter: drop-shadow(0 0 6px hsl(var(--h) 90% 66%)) drop-shadow(0 0 14px hsl(var(--h) 90% 60%)); }
.lk-deck .dk-steps .halo { fill: hsl(var(--h) 90% 66% / .35); animation: dkHalo 1.8s ease-out infinite; transform-box: fill-box; transform-origin: center; pointer-events: none; }
@keyframes dkHalo { from { transform: scale(.6); opacity: 1; } to { transform: scale(2.4); opacity: 0; } }
.lk-deck .dk-steps text { font: 700 10px var(--mono); fill: var(--ink-3); }

/* Bottom row: agents, models, continue */
.lk-deck .dk-bot { display: flex; align-items: center; gap: 14px; min-width: 0; }
.lk-deck .dk-ag { display: flex; align-items: center; gap: 8px; min-width: 0; }
.lk-deck .dk-ag svg { height: 46px; flex: none; overflow: visible; }
.lk-deck .dk-ag .t { font: 600 12px var(--sans); color: var(--ink-2); white-space: nowrap; }
.lk-deck .dk-ag .t b { color: var(--ink); }
.lk-deck .dk-models { display: flex; gap: 6px; flex-wrap: nowrap; overflow: hidden; min-width: 0; }
.lk-deck .go { margin-left: auto; flex: none; display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 14px; font: 800 13.5px var(--sans); color: #fff;
  background: linear-gradient(135deg, hsl(var(--h) 80% 60%), #5b3cff); box-shadow: 0 10px 30px hsl(var(--h) 80% 50% / .35), inset 0 1px 0 rgba(255,255,255,.25);
  transition: transform .4s var(--spring), filter .2s; }
.lk-deck .go:hover { transform: translateY(-2px) scale(1.04); filter: brightness(1.12); }
.lk-deck .go:active { transform: scale(.96); }

/* Time scale */
.lk-deck .dk-time { position: absolute; z-index: 25; right: 20px; top: 92px; bottom: 92px; width: 104px; cursor: ns-resize; transition: right .6s var(--spring); }
.lk-deck.dk-open .dk-time { right: 528px; }
.lk-deck .dk-time .rail { position: absolute; right: 18px; top: 0; bottom: 0; width: 2px; border-radius: 2px; background: linear-gradient(rgba(139,108,255,.7), rgba(45,212,191,.35)); }
.lk-deck .dk-time .tick { position: absolute; right: 13px; width: 12px; height: 1px; background: rgba(255,255,255,.28); }
.lk-deck .dk-time .dl { position: absolute; right: 32px; transform: translateY(-50%); font: 600 10.5px var(--mono); color: var(--ink-3); white-space: nowrap; transition: color .2s; }
.lk-deck .dk-time .dl.on { color: var(--ink); }
.lk-deck .dk-time .sd { position: absolute; right: 16px; width: 6px; height: 6px; margin-top: -3px; border-radius: 50%; background: hsl(var(--h) 80% 62%); opacity: .75; }
.lk-deck .dk-time .mk { position: absolute; right: 6px; width: 30px; height: 30px; margin-top: -15px; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, #fff 0 4px, rgba(180,160,255,.85) 5px, rgba(139,108,255,.25) 9px, transparent 15px); box-shadow: 0 0 24px rgba(139,108,255,.8); }
.lk-deck .dk-time .mk::after { content: ""; position: absolute; right: 26px; top: 14px; width: 30px; height: 2px; background: linear-gradient(90deg, transparent, rgba(190,170,255,.9)); }
.lk-deck .dk-hint { position: absolute; left: 28px; bottom: 26px; z-index: 30; font: 600 11.5px var(--mono); color: var(--ink-3); display: flex; gap: 8px; align-items: center; pointer-events: none; }
.lk-deck .dk-hint kbd { font: 700 11px var(--mono); padding: 2px 7px; border-radius: 6px; border: 1px solid var(--line); background: rgba(255,255,255,.05); color: var(--ink-2); }
@media (max-width: 1180px) { .lk-deck .dk-hint { display: none; } }
@media (max-width: 1180px) { .lk-deck .dk-now .d { font-size: 20px; } .lk-deck .dk-now { top: 104px; } }
@media (prefers-reduced-motion: reduce) { .lk-deck .dk-neb, .lk-deck .dk-steps .halo { animation: none; } }
`;

  function render(root, A) {
    const D = A.DATA, S = D.sessions, esc = A.esc, N = S.length;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let yStep = 44, pos = 0, vel = 0, target = 0, front = -1, raf = 0, idleT = 0, last = performance.now(), onId = null;

    // ---------- Card markup ----------
    function stepsSvg(s) {
      const MAX = 34, nodes = s.nodes, k = Math.min(nodes.length, MAX), list = nodes.slice(-k), hidden = nodes.length - k;
      const W = 640, H = 50, x0 = hidden ? 46 : 12, span = W - x0 - 14;
      const dx = k > 1 ? Math.min(46, span / (k - 1)) : 0;
      const pts = list.map((n, i) => ({ n, x: x0 + i * dx, y: H / 2 + Math.sin(i * .85) * (k > 3 ? 11 : 6) }));
      let d = `M${pts[0].x},${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], mx = (a.x + b.x) / 2; d += ` C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`; }
      const len = Math.round(pts.length > 1 ? (pts[pts.length - 1].x - pts[0].x) * 1.25 + 20 : 1);
      const lastP = pts[pts.length - 1];
      return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMid meet">
        ${hidden ? `<text x="0" y="${H / 2 + 4}">+${hidden}</text>` : ""}
        ${pts.length > 1 ? `<path class="ln" style="--len:${len}" d="${d}"/>` : ""}
        ${pts.slice(0, -1).map((p, i) => `<circle class="pt" cx="${p.x}" cy="${p.y}" r="${k > 24 ? 4 : 5}" data-open="${esc(s.id)}" data-open-step="${esc(p.n.id)}"><title>Schritt ${hidden + i + 1}: ${esc(p.n.text.replace(/\s+/g, " ").slice(0, 90))}</title></circle>`).join("")}
        <circle class="halo" cx="${lastP.x}" cy="${lastP.y}" r="9"/>
        <circle class="pt end" cx="${lastP.x}" cy="${lastP.y}" r="7" data-open="${esc(s.id)}" data-open-step="${esc(lastP.n.id)}"><title>Letzter Schritt: ${esc(lastP.n.text.replace(/\s+/g, " ").slice(0, 90))}</title></circle>
      </svg>`;
    }
    function agentsSvg(s, i) {
      const ag = s.agents.slice(0, 5), n = ag.length;
      const W = n ? 56 + n * 34 : 34, H = 46, cx = 17, cy = 23;
      const pos = ag.map((_, j) => ({ x: 62 + j * 34, y: j % 2 ? 31 : 15 }));
      return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
        ${pos.map((p, j) => `<path id="dkp-${i}-${j}" d="M${cx},${cy} C${cx + 26},${cy} ${p.x - 26},${p.y} ${p.x},${p.y}" fill="none" stroke="hsl(${s.hue} 80% 70% / .35)" stroke-width="1.4"/>`).join("")}
        ${reduce ? "" : pos.map((p, j) => [0, .5].map((o) => `<circle r="1.8" fill="hsl(${s.hue} 90% 80%)"><animateMotion dur="${1.6 + j * .2}s" begin="${(-o * (1.6 + j * .2) - .01).toFixed(2)}s" repeatCount="indefinite"><mpath href="#dkp-${i}-${j}"/></animateMotion></circle>`).join("")).join("")}
        <circle cx="${cx}" cy="${cy}" r="14" fill="url(#dkorb)" stroke="rgba(255,255,255,.4)"/>
        <g transform="translate(${cx - 8},${cy - 8}) scale(.68)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><rect x="4.5" y="8" width="15" height="11" rx="3.5"/><path d="M12 5v3M9.5 13v1M14.5 13v1"/></g>
        ${pos.map((p, j) => `<g><title>${esc(A.aName(ag[j].type))}${ag[j].description ? ": " + esc(ag[j].description) : ""}</title><circle cx="${p.x}" cy="${p.y}" r="10" fill="hsl(${s.hue} 60% 22%)" stroke="hsl(${s.hue} 80% 70%)" stroke-width="1.4"/>
          <g transform="translate(${p.x - 6},${p.y - 6}) scale(.5)" fill="none" stroke="hsl(${s.hue} 90% 85%)" stroke-width="2.4" stroke-linecap="round"><rect x="4.5" y="8" width="15" height="11" rx="3.5"/><path d="M12 5v3"/></g></g>`).join("")}
      </svg>`;
    }
    const cards = S.map((s, i) => `<article class="dk-card" data-i="${i}" style="--h:${s.hue}">
        <div class="dk-top"><span class="chip"><span class="sw"></span><span>${esc(s.projName)}${s.branch ? " · " + esc(s.branch) : ""}</span></span>
          ${s.live ? `<span class="live"><span class="dot live"></span>läuft</span>` : ""}
          <span class="tm"><b>${esc(A.day(s.end))} ${esc(A.hhmm(s.end))}</b> · ${esc(A.rel(s.end))}</span></div>
        <h2>${esc(s.label)}</h2>
        <div class="dk-last"><b>Zuletzt</b>${esc((s.last?.text || "").replace(/\s+/g, " ").slice(0, 220))}</div>
        <div class="dk-steps"><div class="lbl"><span>Verlauf</span><span class="r">${s.nodes.length} ${s.nodes.length === 1 ? "Schritt" : "Schritte"} · Punkt anklicken</span></div>${stepsSvg(s)}</div>
        <div class="dk-bot">
          <div class="dk-ag">${agentsSvg(s, i)}<span class="t">${s.agents.length ? `<b>Claude + ${s.agents.length}</b> ${s.agents.length === 1 ? "Agent" : "Agents"}` : "Claude allein"}</span></div>
          <div class="dk-models">${s.modelList.slice(0, 2).map(A.mp).join("")}</div>
          <button class="go" data-open="${esc(s.id)}" data-open-step="${esc(s.last.id)}">${A.ic("play")} Weitermachen</button>
        </div></article>`).join("");

    root.innerHTML = `
      <div class="dk-neb"></div><canvas class="dk-stars"></canvas>
      <svg width="0" height="0" style="position:absolute"><defs>
        <linearGradient id="dkg" x1="0" x2="1"><stop offset="0" stop-color="#8b6cff" stop-opacity=".35"/><stop offset="1" stop-color="#2dd4bf"/></linearGradient>
        <radialGradient id="dkorb" cx=".3" cy=".3"><stop offset="0" stop-color="#b9a6ff"/><stop offset="1" stop-color="#5b3cff"/></radialGradient></defs></svg>
      <div class="dk-head"><div class="k">Chronik · ${D.totals.sessions} Sessions</div><h1>ZEITMASCHINE</h1><div class="cap">${D.projects.length} Projekte · ${D.totals.steps} Schritte</div></div>
      <div class="dk-now"><div class="d"></div><div class="s"></div></div>
      <div class="dk-stack">${cards}</div>
      <div class="dk-time"><div class="rail"></div></div>
      <div class="dk-hint"><kbd>↑</kbd><kbd>↓</kbd> Mausrad oder ziehen: durch die Zeit fliegen</div>`;

    const stack = root.querySelector(".dk-stack"), cardEls = [...stack.querySelectorAll(".dk-card")];
    const nowD = root.querySelector(".dk-now .d"), nowS = root.querySelector(".dk-now .s");
    const tl = root.querySelector(".dk-time");

    // ---------- Time scale: equal band per day, sessions spread within their day ----------
    const dayKey = (t) => new Date(t).toDateString();
    const days = []; S.forEach((s, i) => { const k = dayKey(s.end); if (!days.length || days[days.length - 1].k !== k) days.push({ k, ts: s.end, idx: [] }); days[days.length - 1].idx.push(i); });
    let sy = [], tlH = 0, mk = null, dls = [];
    function buildTime() {
      tlH = tl.clientHeight; const bh = tlH / days.length; sy = new Array(N);
      const labelEvery = bh < 18 ? Math.ceil(18 / bh) : 1;
      let html = `<div class="rail"></div>`;
      days.forEach((d, k) => {
        const top = k * bh;
        d.idx.forEach((i, j) => { sy[i] = top + (j + .5) / d.idx.length * bh; });
        html += `<div class="tick" style="top:${top}px"></div>`;
        if (k % labelEvery === 0) html += `<div class="dl" data-day="${k}" style="top:${top + bh / 2}px">${esc(new Date(d.ts).toLocaleDateString("de-DE", { day: "numeric", month: "short" }))}</div>`;
      });
      S.forEach((s, i) => { html += `<div class="sd" style="top:${sy[i]}px;--h:${s.hue}"></div>`; });
      html += `<div class="mk"></div>`;
      tl.innerHTML = html; mk = tl.querySelector(".mk"); dls = [...tl.querySelectorAll(".dl")];
    }
    const posToY = (p) => { const i = Math.max(0, Math.min(N - 1, Math.floor(p))), f = Math.max(0, Math.min(1, p - i)); return i >= N - 1 ? sy[N - 1] : sy[i] + (sy[i + 1] - sy[i]) * f; };
    function yToPos(y) {
      if (y <= sy[0]) return 0; if (y >= sy[N - 1]) return N - 1;
      for (let i = 0; i < N - 1; i++) if (y <= sy[i + 1]) return i + (y - sy[i]) / Math.max(1e-6, sy[i + 1] - sy[i]);
      return N - 1;
    }

    // ---------- Layout ----------
    function size() {
      const W = stack.clientWidth, H = stack.clientHeight;
      const cw = Math.max(400, Math.min(720, W - 140)), chh = Math.max(290, Math.min(338, H * .4));
      yStep = Math.max(30, Math.min(56, H * .062));
      root.style.setProperty("--cw", cw + "px"); root.style.setProperty("--chh", chh + "px");
      buildTime(); sizeStars(); apply();
    }

    // ---------- Apply transforms for the current position ----------
    function apply() {
      for (let i = 0; i < N; i++) {
        const el = cardEls[i], d = i - pos;
        if (d < -1.1 || d > 5.6) { if (el.style.visibility !== "hidden") el.style.visibility = "hidden"; continue; }
        el.style.visibility = "visible";
        let tf, op, dim;
        if (d >= 0) { tf = `translate3d(0, ${-d * yStep}px, ${-d * 230}px)`; op = Math.min(1, Math.max(0, (5.6 - d) / 1.8)); dim = Math.min(.82, d * .2); }
        else { tf = `translate3d(0, ${-d * 220}px, ${-d * 420}px) rotateX(${d * 10}deg)`; op = Math.max(0, 1 + d * 2.4); dim = 0; }
        el.style.transform = tf; el.style.opacity = op.toFixed(3); el.style.setProperty("--dim", dim.toFixed(3)); el.style.zIndex = 1000 - Math.round(d * 10);
      }
      const f = Math.max(0, Math.min(N - 1, Math.round(pos)));
      if (f !== front) {
        if (front >= 0) { cardEls[front].classList.remove("front"); cardEls[front].removeAttribute("data-open"); }
        front = f; const el = cardEls[f]; el.classList.add("front"); el.setAttribute("data-open", S[f].id);
        const s = S[f]; nowD.innerHTML = esc(new Date(s.end).toLocaleDateString("de-DE", { weekday: "long" })) + "<br>" + esc(new Date(s.end).toLocaleDateString("de-DE", { day: "numeric", month: "long" }));
        nowS.textContent = `${A.rel(s.end)} · ${f + 1} / ${N}`;
        const dk = days.findIndex((d) => d.idx.includes(f)); dls.forEach((x) => x.classList.toggle("on", +x.dataset.day === dk));
      }
      if (mk) mk.style.top = posToY(pos) + "px";
    }

    // ---------- Starfield with warp streaks ----------
    const cv = root.querySelector("canvas.dk-stars"), ctx = cv.getContext("2d");
    let cw = 0, ch = 0, dpr = 1;
    const stars = Array.from({ length: 420 }, () => ({ x: (Math.random() - .5) * 2, y: (Math.random() - .5) * 2, z: Math.random() * .98 + .02, c: Math.random() }));
    function sizeStars() { dpr = Math.min(2, devicePixelRatio || 1); cw = root.clientWidth; ch = root.clientHeight; cv.width = cw * dpr; cv.height = ch * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function drawStars(dt) {
      ctx.clearRect(0, 0, cw, ch);
      const vx = stack.offsetLeft + stack.clientWidth / 2, vy = ch * .32, f = Math.max(cw, ch) * .5;
      const speed = reduce ? 0 : .03 + Math.min(4, Math.abs(vel)) * .55, dir = vel < -.02 ? -1 : 1;
      const streak = Math.min(.5, Math.abs(vel) * .09);
      ctx.lineCap = "round";
      for (const s of stars) {
        s.z -= speed * dt * dir;
        if (s.z <= .02) { s.z = 1; s.x = (Math.random() - .5) * 2; s.y = (Math.random() - .5) * 2; }
        else if (s.z > 1) { s.z = .03; s.x = (Math.random() - .5) * 2; s.y = (Math.random() - .5) * 2; }
        const px = vx + s.x / s.z * f * .5, py = vy + s.y / s.z * f * .5;
        if (px < -50 || px > cw + 50 || py < -50 || py > ch + 50) continue;
        const a = Math.min(1, (1 - s.z) * 1.2), w = Math.max(.5, (1 - s.z) * 2.2);
        const col = s.c < .7 ? `rgba(220,225,255,${a})` : s.c < .87 ? `rgba(170,150,255,${a})` : `rgba(120,230,240,${a})`;
        if (streak > .01) {
          const z2 = Math.min(1, s.z + streak * dir), qx = vx + s.x / z2 * f * .5, qy = vy + s.y / z2 * f * .5;
          ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(px, py); ctx.stroke();
        } else { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px, py, w * .6, 0, 6.283); ctx.fill(); }
      }
    }

    // ---------- Spring loop ----------
    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (document.hidden) { last = now; return; }
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (reduce) { pos = target; vel = 0; }
      else { const acc = 180 * (target - pos) - 24 * vel; vel += acc * dt; pos += vel * dt; if (Math.abs(target - pos) < .0005 && Math.abs(vel) < .002) { pos = target; vel = 0; } }
      apply(); drawStars(dt);
    }
    const clampT = (t) => Math.max(0, Math.min(N - 1, t));
    const snapLater = () => { clearTimeout(idleT); idleT = setTimeout(() => { target = Math.round(target); }, 140); };
    function goTo(i) { target = clampT(i); if (reduce) { pos = target; apply(); } }

    // ---------- Input ----------
    const onWheel = (e) => {
      e.preventDefault();
      if (e.target.closest(".dk-time")) { goTo(Math.round(target) + Math.sign(e.deltaY)); return; }
      target = clampT(target + e.deltaY / 220); snapLater(); if (reduce) { pos = target; apply(); }
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    let drag = null, moved = false;
    root.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      const onTl = !!e.target.closest(".dk-time");
      drag = { y: e.clientY, t: target, tl: onTl }; moved = false;
      if (onTl) { goTo(yToPos(e.clientY - tl.getBoundingClientRect().top)); moved = true; }
    });
    const onPMove = (e) => {
      if (!drag) return;
      if (drag.tl) { target = clampT(yToPos(e.clientY - tl.getBoundingClientRect().top)); if (reduce) { pos = target; apply(); } return; }
      const dy = e.clientY - drag.y; if (Math.abs(dy) > 6) moved = true;
      if (moved) { target = clampT(drag.t - dy / 110); if (reduce) { pos = target; apply(); } }
    };
    const onPUp = () => { if (!drag) return; drag = null; target = Math.round(target); if (reduce) { pos = target; apply(); } };
    window.addEventListener("pointermove", onPMove); window.addEventListener("pointerup", onPUp);
    // Swallow the click that ends a drag; a click on a card behind the front one flies to it
    root.addEventListener("click", (e) => {
      if (moved) { e.stopPropagation(); moved = false; return; }
      const c = e.target.closest(".dk-card:not(.front)"); if (c) { e.stopPropagation(); goTo(+c.dataset.i); }
    }, true);
    const onKey = (e) => {
      if (e.target.matches?.("input,textarea,[contenteditable]")) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); goTo(Math.round(target) + 1); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); goTo(Math.round(target) - 1); }
      else if (e.key === "Home") goTo(0); else if (e.key === "End") goTo(N - 1);
      else if (e.key === "Enter" && front >= 0) A.open(S[front].id);
    };
    document.addEventListener("keydown", onKey);
    const onResize = () => size();
    window.addEventListener("resize", onResize);

    size();
    raf = requestAnimationFrame(tick);
    if (reduce) drawStars(0);

    A.onCleanup(() => {
      cancelAnimationFrame(raf); clearTimeout(idleT);
      window.removeEventListener("pointermove", onPMove); window.removeEventListener("pointerup", onPUp);
      window.removeEventListener("resize", onResize); document.removeEventListener("keydown", onKey);
    });

    api.onSelect = (id) => {
      onId = id; root.classList.toggle("dk-open", !!id);
      cardEls.forEach((c) => c.classList.remove("on"));
      if (!id) { setTimeout(size, 650); return; }
      const i = S.findIndex((s) => s.id === id); if (i >= 0) { cardEls[i].classList.add("on"); goTo(i); }
      setTimeout(size, 650);
    };
  }

  const api = { onSelect: null };
  Atlas.register({ key: "deck", name: "Zeitmaschine", tagline: "Durch die Zeit fliegen", css, render, wantsArrows: false,
    onSelect(id) { api.onSelect?.(id); } });
})();
