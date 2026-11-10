// Look "flow": Sankey style ribbons from projects to sessions to the models and subagents that did the work.
(() => {
  const css = `
.lk-flow { overflow:hidden; color:var(--ink);
  background: radial-gradient(900px 520px at 12% 0%, rgba(139,108,255,.16), transparent 60%), radial-gradient(800px 600px at 95% 100%, rgba(45,212,191,.12), transparent 60%), radial-gradient(600px 400px at 60% 40%, rgba(34,211,238,.05), transparent 70%), #07080d; }
.lk-flow::before { content:""; position:absolute; inset:0; pointer-events:none; opacity:.35;
  background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px); background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%); }
.lk-flow .fl-blob { position:absolute; width:520px; height:520px; border-radius:50%; filter:blur(90px); opacity:.18; pointer-events:none; animation:flBlob 26s ease-in-out infinite alternate; }
@keyframes flBlob { to { transform:translate(120px, 60px) scale(1.15); } }
.lk-flow .fl-top { position:absolute; left:24px; right:24px; top:18px; display:flex; align-items:flex-end; gap:20px; }
.lk-flow .fl-title { min-width:0; flex:1; }
.lk-flow .fl-title .cap { font:700 10.5px var(--mono); letter-spacing:.2em; text-transform:uppercase; color:var(--ink-3); }
.lk-flow .fl-title h1 { margin:4px 0 0; font:800 26px/1.1 var(--sans); letter-spacing:-.02em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  color:#f3f0ff; }
.lk-flow .fl-stats { display:flex; gap:10px; flex:none; }
.lk-flow .fl-stat { min-width:118px; padding:10px 14px; border-radius:14px; }
.lk-flow .fl-stat span { display:block; font:700 10px var(--mono); letter-spacing:.16em; text-transform:uppercase; color:var(--ink-3); }
.lk-flow .fl-stat b { display:block; font:800 24px/1.15 var(--mono); font-variant-numeric:tabular-nums; margin-top:2px; }
.lk-flow .fl-stat:nth-child(1) b { color:#c4b5ff; } .lk-flow .fl-stat:nth-child(2) b { color:#7ee8d8; } .lk-flow .fl-stat:nth-child(3) b { color:#67e8f9; } .lk-flow .fl-stat:nth-child(4) b { color:#fcd34d; }
.lk-flow .fl-heads { position:absolute; left:24px; right:24px; top:104px; height:20px; }
.lk-flow .fl-heads span { position:absolute; top:0; font:700 10.5px var(--mono); letter-spacing:.16em; text-transform:uppercase; color:var(--ink-3); white-space:nowrap; }
.lk-flow .fl-heads span b { color:var(--ink-2); }
.lk-flow .fl-sc { position:absolute; left:24px; right:24px; top:128px; bottom:76px; overflow-x:hidden; }
.lk-flow .fl-cv { position:relative; width:100%; }
.lk-flow svg.fl-svg { position:absolute; left:0; top:0; overflow:visible; }
.lk-flow .rb { fill:none; mix-blend-mode:screen; stroke-opacity:.42; cursor:pointer; transition:stroke-opacity .55s var(--spring-soft), opacity .55s var(--spring-soft); }
.lk-flow .sh { fill:none; pointer-events:none; mix-blend-mode:screen; animation:fadein 1s ease 1.6s both; transition:opacity .5s; }
.lk-flow.hov .rb { opacity:.08; }
.lk-flow.hov .sh { opacity:0; }
.lk-flow.hov .rb.on { opacity:1; stroke-opacity:.78; }
.lk-flow .nd { position:absolute; display:flex; flex-direction:column; justify-content:center; padding:0 10px; border-radius:9px; min-width:0; overflow:hidden; cursor:pointer;
  background:rgba(14,16,24,.7); border:1px solid rgba(255,255,255,.1); backdrop-filter:blur(14px) saturate(150%); -webkit-backdrop-filter:blur(14px) saturate(150%);
  box-shadow:0 1px 0 rgba(255,255,255,.06) inset, 0 8px 24px rgba(0,0,0,.35);
  transition:opacity .55s var(--spring-soft), transform .45s var(--spring), border-color .25s, box-shadow .3s; }
.lk-flow .nd::before { content:""; position:absolute; top:0; bottom:0; width:3px; background:var(--c); box-shadow:0 0 14px var(--c); }
.lk-flow .nd.p::before { right:0; } .lk-flow .nd.s::before { left:0; } .lk-flow .nd.r::before { left:0; }
.lk-flow .nd.s::after { content:""; position:absolute; top:0; bottom:0; right:0; width:3px; background:var(--c); opacity:.6; }
.lk-flow .nd:hover { transform:translateX(2px); border-color:color-mix(in srgb, var(--c) 60%, transparent); box-shadow:0 0 0 1px color-mix(in srgb, var(--c) 30%, transparent), 0 10px 30px rgba(0,0,0,.45), 0 0 30px color-mix(in srgb, var(--c) 18%, transparent); }
.lk-flow.hov .nd { opacity:.22; }
.lk-flow.hov .nd.on { opacity:1; border-color:color-mix(in srgb, var(--c) 55%, transparent); }
.lk-flow .nd .l1 { display:flex; align-items:center; gap:7px; min-width:0; font-size:12.5px; font-weight:700; line-height:1.2; }
.lk-flow .nd .l1 .tx { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; flex:1; }
.lk-flow .nd .l1 .tm { font:600 10.5px var(--mono); color:var(--ink-3); flex:none; }
.lk-flow .nd .l2 { font:500 10.5px var(--mono); color:var(--ink-2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px; }
.lk-flow .nd.tiny { padding:0 8px 0 10px; border-radius:7px; } .lk-flow .nd.tiny .l1 { font-size:11.5px; }
.lk-flow .nd.xs { border-radius:5px; } .lk-flow .nd.xs .l1 { font-size:10.5px; } .lk-flow .nd.xs .l1 .tm { font-size:9.5px; }
.lk-flow .nd.r { padding:8px 12px; justify-content:flex-start; }
.lk-flow .nd.r .l1 { font-size:14px; }
.lk-flow .nd.r .bot { color:var(--c); }
.lk-flow .nd.r .l3 { display:flex; gap:5px; flex-wrap:wrap; margin-top:6px; }
.lk-flow .rsec { position:absolute; font:700 10px var(--mono); letter-spacing:.16em; text-transform:uppercase; color:var(--ink-3); }
@media (max-width:1100px) { .lk-flow .fl-stat { min-width:92px; padding:8px 10px; } .lk-flow .fl-stat b { font-size:19px; } .lk-flow .fl-title h1 { font-size:20px; } }
@media (prefers-reduced-motion: reduce) { .lk-flow .fl-blob { animation:none; } }
`;

  let api = null;
  const FAM = { opus: "#8b6cff", sonnet: "#3b82f6", haiku: "#22c55e", fable: "#f97316", x: "#8a8799" };
  const AGC = ["#2dd4bf", "#22d3ee", "#fb7185", "#fabd2f", "#4ade80"];

  function render(root, A) {
    const D = A.DATA;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cu = [];
    root.innerHTML = `<div class="fl-blob" style="left:-120px;top:-160px;background:#8b6cff"></div><div class="fl-blob" style="right:-160px;bottom:-200px;background:#2dd4bf;animation-delay:-9s"></div>
      <div class="fl-top"><div class="fl-title"><div class="cap">Session Atlas · Fluss</div><h1>Wohin ist deine Arbeit geflossen?</h1></div>
        <div class="fl-stats">${[["Sessions", D.totals.sessions, 0], ["Schritte", D.totals.steps, 0], ["Agents", D.totals.agents, 0], ["Kosten", D.totals.cost, 2]]
          .map(([l, v, d], i) => `<div class="fl-stat glass in" style="--i:${i}"><span>${l}</span><b data-cu="${v}" data-dec="${d}">${d ? "$0.00" : "0"}</b></div>`).join("")}</div></div>
      <div class="fl-heads" id="flHeads"></div>
      <div class="fl-sc scroll" id="flSc"><div class="fl-cv" id="flCv"></div></div>`;

    // Animated count-up for the summary numbers
    root.querySelectorAll("[data-cu]").forEach((el, i) => {
      const to = +el.dataset.cu, dec = +el.dataset.dec, fmt = (v) => (dec ? "$" + v.toFixed(2) : Math.round(v).toLocaleString("de-DE"));
      if (reduce) { el.textContent = fmt(to); return; }
      const t0 = performance.now() + i * 90, dur = 1500;
      const step = (now) => { const p = Math.max(0, Math.min(1, (now - t0) / dur)); el.textContent = fmt(to * (1 - Math.pow(2, -10 * p))); if (p < 1) cu.push(requestAnimationFrame(step)); else el.textContent = fmt(to); };
      cu.push(requestAnimationFrame(step));
    });

    const sc = root.querySelector("#flSc"), cv = root.querySelector("#flCv"), heads = root.querySelector("#flHeads");
    let pinned = null, hoverKey = null, first = true;

    // ---------- data: links ----------
    const totReplies = D.sessions.reduce((n, s) => n + Object.values(s.models || {}).reduce((a, m) => a + (m.replies || 0), 0), 0) || 1;
    const ratio = D.totals.steps / totReplies, AU = 4; // one agent run counts like 4 steps of width
    const rights = new Map(); // key -> {key, kind, name, color, val, sessions:Set, models}
    const sess = D.sessions.map((s) => {
      const outs = [];
      const fams = {};
      for (const [m, info] of Object.entries(s.models || {})) { const mi = A.modelInfo(m); (fams[mi.name] ||= { mi, r: 0 }).r += info.replies || 0; }
      for (const [name, f] of Object.entries(fams)) {
        const key = "m:" + name; if (!rights.has(key)) rights.set(key, { key, kind: "m", name, fam: f.mi.fam, color: FAM[f.mi.fam] || FAM.x, val: 0, cnt: 0, sessions: new Set() });
        const r = rights.get(key); r.val += f.r; r.sessions.add(s.id); outs.push({ key, v: f.r * ratio, label: f.r });
      }
      const ag = {};
      for (const a of s.agents) { const n = A.aName(a.type); (ag[n] ||= { n: 0, models: new Set() }).n++; Object.keys(a.models || {}).forEach((m) => ag[n].models.add(m)); }
      for (const [name, g] of Object.entries(ag)) {
        const key = "a:" + name; if (!rights.has(key)) rights.set(key, { key, kind: "a", name, color: AGC[[...rights.values()].filter((x) => x.kind === "a").length % AGC.length], val: 0, cnt: 0, sessions: new Set(), models: new Set() });
        const r = rights.get(key); r.cnt += g.n; r.sessions.add(s.id); g.models.forEach((m) => r.models.add(m)); outs.push({ key, v: g.n * AU, label: g.n });
      }
      const outV = outs.reduce((n, o) => n + o.v, 0);
      return { s, outs, outV, v: Math.max(s.nodes.length, outV) };
    });
    const byId = new Map(sess.map((x) => [x.s.id, x]));
    const groups = D.projects.map((p) => ({ p, ss: p.sessions.map((s) => byId.get(s.id)) }));
    const R = [...rights.values()].sort((a, b) => (a.kind === b.kind ? (b.val + b.cnt) - (a.val + a.cnt) : a.kind === "m" ? -1 : 1));

    function layout() {
      const W = sc.clientWidth, Hav = Math.max(320, sc.clientHeight - 8);
      const pw = Math.round(Math.max(140, Math.min(210, W * .15))), sw = Math.round(Math.max(190, Math.min(300, W * .24))), rw = Math.round(Math.max(160, Math.min(240, W * .17)));
      const sx = Math.round(pw + (W - pw - sw - rw) * .46), rx = W - rw;
      const GS = 2, GG = Hav < 600 ? 5 : 7, N = sess.length, G = groups.length;
      const MIN = Math.max(14, Math.min(17, Math.floor((Hav - GG * (G - 1) - GS * (N - G)) / N) - 1)), PMIN = Math.max(MIN, 20);
      const total = (k) => groups.reduce((n, g) => n + Math.max(PMIN, g.ss.reduce((a, x) => a + Math.max(MIN, x.v * k), 0) + GS * (g.ss.length - 1)), 0) + GG * (groups.length - 1);
      const maxV = Math.max(...sess.map((x) => x.v)), maxSteps = Math.max(...sess.map((x) => x.s.nodes.length)), maxOut = Math.max(1, ...sess.map((x) => x.outV));
      let lo = .05, hi = Math.min(4, 150 / maxV);
      if (total(hi) <= Hav) lo = hi; else for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (total(m) <= Hav) lo = m; else hi = m; }
      const k = Math.max(lo, .05);
      // Positions for projects and sessions
      let y = 0;
      for (const g of groups) {
        const inner = g.ss.reduce((a, x) => a + Math.max(MIN, x.v * k), 0) + GS * (g.ss.length - 1);
        const gh = Math.max(PMIN, inner); let sy = y + (gh - inner) / 2;
        for (const x of g.ss) { x.h = Math.max(MIN, x.v * k); x.y = sy; x.inT = 2 + (x.h - 5) * Math.sqrt(x.s.nodes.length / maxSteps); const ot = 2 + (x.h - 5) * Math.sqrt(x.outV / maxOut); x.outs.forEach((o) => { o.t = Math.max(1.5, ot * o.v / (x.outV || 1)); }); sy += x.h + GS; }
        g.y = y; g.h = gh; g.bar = g.ss.reduce((a, x) => a + x.inT, 0);
        g.ch = Math.min(gh, Math.max(PMIN, g.bar + 10)); g.cy = y + (gh - g.ch) / 2;
        y += gh + GG;
      }
      let H = Math.max(Hav, y - GG);
      // Right nodes: incoming thickness = outs scaled by k
      for (const r of R) { r.inc = sess.flatMap((x) => x.outs.filter((o) => o.key === r.key).map((o) => ({ x, o, t: o.t }))); r.sum = r.inc.reduce((a, b) => a + b.t, 0); r.h = Math.max(r.kind === "m" ? 70 : 58, r.sum + 16); }
      const hasA = R.some((r) => r.kind === "a"), RG = 14, SEC = 24;
      const rTot = R.reduce((a, r) => a + r.h, 0) + RG * (R.length - 1) + SEC * (hasA ? 2 : 1);
      let ry = Math.max(0, (H - rTot) / 2); if (rTot > H) H = rTot;
      const secs = [];
      R.forEach((r, i) => {
        if (i === 0) { secs.push({ y: ry, t: "Modelle" }); ry += SEC; }
        if (r.kind === "a" && (i === 0 || R[i - 1].kind !== "a")) { secs.push({ y: ry, t: "Subagents" }); ry += SEC; }
        r.y = ry; ry += r.h + RG;
      });
      return { W, H, pw, sw, rw, sx, rx, k, secs };
    }

    function build() {
      const L = layout(); const { W, H, pw, sw, rw, sx, rx, secs } = L;
      heads.innerHTML = `<span style="left:0">Projekte <b>${groups.length}</b></span><span style="left:${sx}px">Sessions <b>${sess.length}</b> · neueste zuerst</span><span style="left:${rx}px">Wer hat gearbeitet</span>`;
      const pc = (h) => `hsl(${h} 80% 62%)`;
      const curve = (x1, y1, x2, y2) => { const dx = (x2 - x1) * .5; return `M${x1.toFixed(1)},${y1.toFixed(1)} C${(x1 + dx).toFixed(1)},${y1.toFixed(1)} ${(x2 - dx).toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`; };
      const defs = [], paths = []; let gi = 0;
      const grad = (x1, x2, c1, c2) => { const id = "flg" + gi++; defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" x2="${x2}" y1="0" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`); return id; };
      // Project -> session ribbons (stacked inside the project bar)
      let li = 0;
      for (const g of groups) {
        let by = g.cy + g.ch / 2 - g.bar / 2;
        for (const x of g.ss) {
          const y1 = by + x.inT / 2; by += x.inT;
          const y2 = x.y + x.h / 2, id = grad(pw, sx, pc(g.p.hue), `hsl(${x.s.hue} 85% 72%)`);
          paths.push({ d: curve(pw - 1, y1, sx + 1, y2), t: x.inT, id, p: g.p.path, s: x.s.id, r: "", i: li++ });
        }
      }
      // Session -> model/agent ribbons; stacked at the session edge and at the target in session order
      const outStart = new Map(sess.map((x) => [x.s.id, x.y + x.h / 2 - x.outs.reduce((a, o) => a + o.t, 0) / 2]));
      const rCur = new Map(R.map((r) => [r.key, r.y + r.h / 2 - r.sum / 2]));
      const order = sess.slice().sort((a, b) => a.y - b.y);
      let ri = 0;
      for (const x of order) for (const o of x.outs) {
        const r = rights.get(o.key), t = o.t;
        const ys = outStart.get(x.s.id); outStart.set(x.s.id, ys + t);
        const yr = rCur.get(r.key); rCur.set(r.key, yr + t);
        const id = grad(sx + sw, rx, `hsl(${x.s.hue} 85% 72%)`, r.color);
        paths.push({ d: curve(sx + sw - 1, ys + t / 2, rx + 1, yr + t / 2), t, id, p: x.s.project, s: x.s.id, r: r.key, i: li + ri++ * .6 });
      }
      const shine = reduce ? "" : `<linearGradient id="flShine" gradientUnits="userSpaceOnUse" x1="0" x2="${Math.round(W * .22)}" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
        <animateTransform attributeName="gradientTransform" type="translate" from="${-Math.round(W * .3)} 0" to="${Math.round(W * 1.05)} 0" dur="9s" repeatCount="indefinite"/></linearGradient>`;
      const ap = (o) => `data-p="${A.esc(o.p)}" data-s="${o.s}" data-r="${o.r}"`;
      cv.style.height = H + "px";
      cv.innerHTML = `<svg class="fl-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join("")}${shine}</defs>
        <g>${paths.map((o) => `<path class="rb${first && !reduce ? " draw" : ""}" ${ap(o)} data-open="${o.s}" d="${o.d}" stroke="url(#${o.id})" stroke-width="${o.t.toFixed(2)}" style="--i:${Math.round(o.i)}"/>`).join("")}</g>
        ${reduce ? "" : `<g>${paths.map((o) => `<path class="sh" d="${o.d}" stroke="url(#flShine)" stroke-width="${o.t.toFixed(2)}"/>`).join("")}</g>`}</svg>
        ${groups.map((g, i) => `<div class="nd p ${g.ch < 30 ? "tiny" : ""} ${g.ch < 17 ? "xs" : ""} ${first ? "in" : ""}" data-p="${A.esc(g.p.path)}" style="--i:${i};--c:${pc(g.p.hue)};left:0;top:${g.cy}px;width:${pw}px;height:${g.ch}px" title="${A.esc(A.short(g.p.path))}">
          <div class="l1"><span class="tx">${A.esc(g.p.name)}</span><span class="tm">${A.relShort(g.p.last)}</span></div>${g.ch >= 30 ? `<div class="l2">${g.ss.length} ${g.ss.length === 1 ? "Session" : "Sessions"} · ${g.p.steps} Schritte</div>` : ""}</div>`).join("")}
        ${sess.map((x, i) => { const s = x.s, two = x.h >= 34; return `<div class="nd s ${two ? "" : "tiny"} ${x.h < 17 ? "xs" : ""} ${first ? "in" : ""}" data-open="${s.id}" data-s="${s.id}" data-p="${A.esc(s.project)}" style="--i:${Math.min(i, 24)};--c:hsl(${s.hue} 85% 72%);left:${sx}px;top:${x.y}px;width:${sw}px;height:${x.h}px" title="${A.esc(s.label)}">
          <div class="l1">${s.live ? `<span class="dot live"></span>` : ""}<span class="tx">${A.esc(s.label)}</span><span class="tm">${A.relShort(s.end)}</span></div>
          ${two ? `<div class="l2">${s.nodes.length} Schritte${s.agents.length ? ` · ${s.agents.length} Agents` : ""} · ${A.rel(s.end)}</div>` : ""}</div>`; }).join("")}
        ${secs.map((t) => `<div class="rsec fadein" style="left:${rx}px;top:${t.y + 4}px">${t.t}</div>`).join("")}
        ${R.map((r, i) => `<div class="nd r ${first ? "in" : ""}" data-r="${r.key}" style="--i:${i + 6};--c:${r.color};left:${rx}px;top:${r.y}px;width:${rw}px;height:${r.h}px">
          <div class="l1"><span class="bot">${A.ic("bot")}</span><span class="tx">${A.esc(r.name)}</span></div>
          <div class="l2">${r.kind === "m" ? `${r.val.toLocaleString("de-DE")} Antworten` : `${r.cnt} ${r.cnt === 1 ? "Lauf" : "Läufe"}`} · ${r.sessions.size} ${r.sessions.size === 1 ? "Session" : "Sessions"}</div>
          ${r.kind === "a" && r.h >= 70 ? `<div class="l3">${[...r.models].map(A.mp).join("")}</div>` : ""}</div>`).join("")}`;
      if (first && !reduce) cv.querySelectorAll("path.rb").forEach((p) => p.style.setProperty("--len", Math.ceil(p.getTotalLength()) + 2));
      first = false;
      applyHover();
    }

    // ---------- hover / pin highlighting of a full flow ----------
    function sets(key) {
      if (!key) return null;
      const [kind, val] = key; let S;
      if (kind === "p") S = new Set(sess.filter((x) => x.s.project === val).map((x) => x.s.id));
      else if (kind === "s") S = new Set([val]);
      else S = new Set(rights.get(val)?.sessions || []);
      const P = new Set([...S].map((id) => byId.get(id).s.project));
      const Rk = kind === "r" ? new Set([val]) : new Set([...S].flatMap((id) => byId.get(id).outs.map((o) => o.key)));
      return { S, P, R: Rk };
    }
    function applyHover() {
      const st = sets(hoverKey || pinned);
      root.classList.toggle("hov", !!st);
      if (!st) { cv.querySelectorAll(".on").forEach((e) => e.classList.remove("on")); return; }
      cv.querySelectorAll(".rb").forEach((e) => { const d = e.dataset; e.classList.toggle("on", st.S.has(d.s) && (!d.r || st.R.has(d.r))); });
      cv.querySelectorAll(".nd").forEach((e) => { const d = e.dataset; e.classList.toggle("on", d.r ? st.R.has(d.r) : d.s ? st.S.has(d.s) : st.P.has(d.p)); });
    }
    const keyOf = (el) => { const d = el.dataset; if (el.classList.contains("rb")) return ["s", d.s]; if (d.r) return ["r", d.r]; if (d.s) return ["s", d.s]; if (d.p) return ["p", d.p]; return null; };
    cv.addEventListener("mouseover", (e) => { const el = e.target.closest(".nd,.rb"); const k = el ? keyOf(el) : null; if (String(k) !== String(hoverKey)) { hoverKey = k; applyHover(); } });
    cv.addEventListener("mouseleave", () => { hoverKey = null; applyHover(); });
    cv.addEventListener("click", (e) => { const el = e.target.closest(".nd.p,.nd.r"); if (!el) return; const k = keyOf(el); pinned = String(pinned) === String(k) ? null : k; applyHover(); });

    let rt; const onResize = () => { clearTimeout(rt); rt = setTimeout(build, 120); };
    addEventListener("resize", onResize);
    A.onCleanup(() => { removeEventListener("resize", onResize); clearTimeout(rt); cu.forEach(cancelAnimationFrame); api = null; });
    api = { select(id) { pinned = id ? ["s", id] : null; applyHover(); } };
    build();
  }

  Atlas.register({ key: "flow", name: "Fluss", tagline: "Projekte > Sessions > Modelle & Agents", wantsArrows: false, css, render, onSelect: (id) => api?.select(id) });
})();
