// Look: Mindmap. Radial tree "Du" -> projects -> sessions, with pan/zoom and spring camera.
(() => {
  const css = `
.lk-mindmap { background: radial-gradient(900px 700px at 50% 48%, rgba(139,108,255,.13), transparent 70%), radial-gradient(600px 400px at 85% 10%, rgba(34,211,238,.06), transparent 70%), #07080d;
  overflow: hidden; cursor: grab; user-select: none; -webkit-user-select: none; }
.lk-mindmap.dragging { cursor: grabbing; }
.lk-mindmap .mm-grid { position: absolute; inset: 0; pointer-events: none; opacity: .5;
  background-image: radial-gradient(rgba(255,255,255,.09) 1px, transparent 1.4px); }
.lk-mindmap .mm-world { position: absolute; left: 0; top: 0; transform-origin: 0 0; will-change: transform; }
.lk-mindmap .mm-world.anim { transition: transform .95s var(--spring); }
.lk-mindmap svg.mm-svg { position: absolute; left: 0; top: 0; width: 1px; height: 1px; overflow: visible; pointer-events: none; }
.lk-mindmap .mm-link { fill: none; stroke-width: 1.6; stroke-linecap: round; opacity: .55; transition: opacity .35s, stroke-width .35s; }
.lk-mindmap .mm-link.trunk { stroke-width: 2.4; opacity: .7; }
.lk-mindmap .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
.lk-mindmap .mm-part { transition: opacity .3s; }

/* Center orb */
.lk-mindmap .mm-core-w { position: absolute; left: -80px; top: -46px; width: 160px; }
.lk-mindmap .mm-core { position: relative; display: grid; place-items: center; text-align: center; gap: 6px; cursor: pointer; }
.lk-mindmap .mm-orb { width: 92px; height: 92px; border-radius: 50%; display: grid; place-items: center; font: 900 22px var(--display); letter-spacing: .06em; color: #fff;
  background: radial-gradient(circle at 32% 28%, #c9b8ff, #8b6cff 42%, #4a2bd9 78%, #2a1580);
  box-shadow: 0 0 0 1px rgba(255,255,255,.25) inset, 0 0 40px rgba(139,108,255,.7), 0 0 120px rgba(139,108,255,.35); transition: transform .5s var(--spring); }
.lk-mindmap .mm-core:hover .mm-orb { transform: scale(1.07); }
.lk-mindmap .mm-ring { position: absolute; left: 50%; top: 46px; width: 130px; height: 130px; margin: -65px 0 0 -65px; border-radius: 50%; border: 1px dashed rgba(164,139,255,.35); pointer-events: none; }
.lk-mindmap .mm-core small { position: relative; font: 600 11px var(--mono); color: var(--ink-2); white-space: nowrap; letter-spacing: .04em; padding: 2px 9px; border-radius: 999px; background: rgba(7,8,13,.82); border: 1px solid rgba(139,108,255,.25); }

/* Project pills */
.lk-mindmap .mm-proj { position: absolute; display: flex; justify-content: center; align-items: center; gap: 8px; height: 34px; padding: 0 6px 0 12px; border-radius: 999px;
  --h: 262; background: linear-gradient(180deg, hsl(var(--h) 60% 20% / .62), hsl(var(--h) 50% 12% / .62)); border: 1px solid hsl(var(--h) 80% 62% / .5);
  backdrop-filter: blur(14px) saturate(160%); -webkit-backdrop-filter: blur(14px) saturate(160%);
  box-shadow: 0 0 22px hsl(var(--h) 80% 55% / .22), 0 1px 0 rgba(255,255,255,.1) inset; cursor: pointer; white-space: nowrap; font: 700 13px var(--sans);
  transition: transform .45s var(--spring), opacity .3s, box-shadow .3s; }
.lk-mindmap .mm-proj:hover { transform: scale(1.07); box-shadow: 0 0 34px hsl(var(--h) 80% 55% / .45), 0 1px 0 rgba(255,255,255,.1) inset; }
.lk-mindmap .mm-proj .nm { min-width: 0; max-width: 160px; overflow: hidden; text-overflow: ellipsis; }
.lk-mindmap .mm-proj .ct { font: 700 11px var(--mono); padding: 2px 7px; border-radius: 999px; background: hsl(var(--h) 80% 62% / .2); color: hsl(var(--h) 90% 82%); }
.lk-mindmap .mm-proj i { width: 8px; height: 8px; border-radius: 50%; background: hsl(var(--h) 80% 62%); box-shadow: 0 0 8px hsl(var(--h) 80% 62%); flex: none; }

/* Session chips */
.lk-mindmap .mm-sess { position: absolute; width: 188px; height: 44px; padding: 6px 10px 6px 12px; border-radius: 12px; text-align: left;
  --h: 262; background: rgba(18,20,30,.62); border: 1px solid rgba(255,255,255,.11); border-left: 2px solid hsl(var(--h) 80% 62% / .85);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 8px 22px rgba(0,0,0,.35);
  display: flex; flex-direction: column; justify-content: center; gap: 2px; cursor: pointer; transition: transform .4s var(--spring), opacity .3s, border-color .25s, box-shadow .3s, background .25s; }
.lk-mindmap .mm-sess:hover, .lk-mindmap .mm-sess.sel { transform: translateY(-2px) scale(1.04); background: rgba(26,28,42,.85); border-color: hsl(var(--h) 80% 62% / .6); box-shadow: 0 0 26px hsl(var(--h) 80% 55% / .3), 0 12px 30px rgba(0,0,0,.45); z-index: 3; }
.lk-mindmap .mm-sess.sel { outline: 1px solid hsl(var(--h) 80% 70%); }
.lk-mindmap .mm-sess b { display: block; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-mindmap .mm-sess span.meta { display: flex; gap: 6px; align-items: center; font: 500 10px var(--mono); color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-mindmap .mm-sess span.meta em { font-style: normal; color: var(--ink-2); }
.lk-mindmap .mm-sess .dot { width: 6px; height: 6px; }
.lk-mindmap .mm-pin { position: absolute; width: 9px; height: 9px; margin: -4.5px 0 0 -4.5px; border-radius: 50%; background: hsl(var(--h) 80% 66%); box-shadow: 0 0 10px hsl(var(--h) 80% 60%); pointer-events: none; transition: opacity .3s, transform .4s var(--spring); }
.lk-mindmap .mm-sat { position: absolute; width: 0; height: 0; pointer-events: none; animation: mm-orbit var(--d, 7s) linear infinite; animation-delay: var(--dl, 0s); }
.lk-mindmap .mm-sat::after { content: ""; position: absolute; left: var(--r, 14px); top: -2.5px; width: 5px; height: 5px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 8px var(--teal); }
@keyframes mm-orbit { to { transform: rotate(360deg); } }

/* Hover focus: highlight one path, dim everything else */
.lk-mindmap.hov .mm-link, .lk-mindmap.hov .mm-part { opacity: .1; }
.lk-mindmap.hov .mm-sess, .lk-mindmap.hov .mm-proj, .lk-mindmap.hov .mm-pin { opacity: .3; }
.lk-mindmap.hov .mm-link.hl { opacity: 1; stroke-width: 2.6; }
.lk-mindmap.hov .mm-sess.hl, .lk-mindmap.hov .mm-proj.hl, .lk-mindmap.hov .mm-pin.hl { opacity: 1; }

/* HUD */
.lk-mindmap .mm-hud { position: absolute; z-index: 5; display: flex; align-items: center; gap: 10px; }
.lk-mindmap .mm-title { top: 18px; left: 20px; padding: 10px 16px; border-radius: 16px; flex-direction: column; align-items: flex-start; gap: 2px; cursor: default; }
.lk-mindmap .mm-title .k { font: 700 10.5px var(--display); letter-spacing: .28em; color: #b9a6ff; }
.lk-mindmap .mm-title .s { font: 500 12px var(--mono); color: var(--ink-2); }
.lk-mindmap .mm-ctl { top: 18px; right: 20px; padding: 5px; border-radius: 14px; gap: 4px; }
.lk-mindmap .mm-ctl button { height: 32px; min-width: 32px; padding: 0 10px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; font: 700 12.5px var(--sans); color: var(--ink); transition: background .2s, transform .3s var(--spring); }
.lk-mindmap .mm-ctl button:hover { background: rgba(255,255,255,.09); }
.lk-mindmap .mm-ctl button:active { transform: scale(.92); }
.lk-mindmap .mm-ctl .zk { font: 600 11px var(--mono); color: var(--ink-3); min-width: 42px; text-align: center; }
.lk-mindmap .mm-hint { left: 20px; bottom: 22px; font: 500 11px var(--mono); color: var(--ink-3); pointer-events: none; }
@media (max-width: 1250px) { .lk-mindmap .mm-hint { display: none; } }
@media (max-width: 1100px) { .lk-mindmap .mm-title .s { display: none; } }
@media (prefers-reduced-motion: reduce) { .lk-mindmap .mm-sat { animation: none; } .lk-mindmap .mm-part { display: none; } }
`;

  let root, A, selId = null;

  function render(el, atlas) {
    root = el; A = atlas;
    const { projects, totals } = A.DATA;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const col = (h, l = 62) => `hsl(${h} 80% ${l}%)`;
    const EX = 1.5; // horizontal stretch: screens are wide
    const SW = 188, SH = 44, PH = 34;

    // ---------- Layout ----------
    // Rotate so the largest project sits on the right, where vertical stacking reads naturally.
    const order = projects.slice();
    const big = order.reduce((b, p, i) => (p.sessions.length > order[b].sessions.length ? i : b), 0);
    const GAP = 0.7, wsum = order.reduce((n, p) => n + p.sessions.length + GAP, 0);
    const wOf = (p) => p.sessions.length + GAP;
    let before = 0; for (let i = 0; i < big; i++) before += wOf(order[i]);
    let ang = -((before + wOf(order[big]) / 2) / wsum) * Math.PI * 2;

    const rects = [{ x: -70, y: -60, w: 140, h: 150 }]; // center orb + caption
    const hit = (r) => rects.some((o) => r.x < o.x + o.w + 10 && r.x + r.w + 10 > o.x && r.y < o.y + o.h + 8 && r.y + r.h + 8 > o.y);
    const P = [], S = [];
    order.forEach((p, pi) => {
      const span = (wOf(p) / wsum) * Math.PI * 2, mid = ang + span / 2;
      const pw = Math.min(160, p.name.length * 8.4) + 86;
      let r = 150, pr;
      for (let k = 0; k < 120; k++, r += 10) {
        const x = Math.cos(mid) * r * EX, y = Math.sin(mid) * r;
        pr = { x: x - pw / 2, y: y - PH / 2, w: pw, h: PH, cx: x, cy: y };
        if (!hit(pr)) break;
      }
      rects.push(pr);
      const pp = { p, i: pi, x: pr.cx, y: pr.cy, w: pw, a0: ang, span, mid, r };
      P.push(pp);
      ang += span;
    });
    P.forEach((pp) => {
      const n = pp.p.sessions.length, inner = pp.span * (n / (n + GAP));
      const a0 = pp.mid - inner / 2;
      pp.p.sessions.forEach((s, si) => {
        const a = a0 + ((si + 0.5) / n) * inner, c = Math.cos(a), sn = Math.sin(a);
        let r = Math.max(pp.r + 115, 270), rc, ax, ay;
        for (let k = 0; k < 200; k++, r += 12) {
          ax = c * r * EX; ay = sn * r;
          let x, y;
          if (c > 0.3) { x = ax + 12; y = ay - SH / 2; }
          else if (c < -0.3) { x = ax - 12 - SW; y = ay - SH / 2; }
          else { x = ax - SW / 2; y = sn > 0 ? ay + 12 : ay - 12 - SH; }
          rc = { x, y, w: SW, h: SH };
          if (!hit(rc)) break;
        }
        rects.push(rc);
        S.push({ s, pp, ax, ay, rc, side: c > 0.3 ? 1 : c < -0.3 ? -1 : 0, sn });
      });
    });

    // ---------- Paths ----------
    const curve = (x1, y1, x2, y2) => `C${(x1 + (x2 - x1) * 0.55).toFixed(1)},${y1.toFixed(1)} ${(x1 + (x2 - x1) * 0.45).toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
    const trunk = (pp) => `M0,0 ${curve(0, 0, pp.x, pp.y)}`;
    const branch = (q) => {
      // Vertical-ish ends for top/bottom chips, horizontal for side chips
      if (q.side === 0) {
        const my = q.pp.y + (q.ay - q.pp.y) * 0.5;
        return `C${q.pp.x.toFixed(1)},${my.toFixed(1)} ${q.ax.toFixed(1)},${my.toFixed(1)} ${q.ax.toFixed(1)},${q.ay.toFixed(1)}`;
      }
      return curve(q.pp.x, q.pp.y, q.ax, q.ay);
    };
    const recent = S.slice().sort((a, b) => b.s.end.localeCompare(a.s.end)).slice(0, 5);

    // ---------- DOM ----------
    const svg = `<svg class="mm-svg" aria-hidden="true">
      <defs>${P.map((pp) => `<linearGradient id="mmg${pp.i}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${pp.x.toFixed(1)}" y2="${pp.y.toFixed(1)}"><stop offset="0" stop-color="#8b6cff"/><stop offset="1" stop-color="${col(pp.p.hue)}"/></linearGradient>`).join("")}</defs>
      ${P.map((pp, i) => `<path class="mm-link trunk draw" data-p="${pp.i}" pathLength="1" style="--i:${i}" d="${trunk(pp)}" stroke="url(#mmg${pp.i})"/>`).join("")}
      ${S.map((q, i) => `<path class="mm-link draw" data-s="${q.s.id}" pathLength="1" style="--i:${i * 0.6 + 8}" d="M${q.pp.x.toFixed(1)},${q.pp.y.toFixed(1)} ${branch(q)}" stroke="${col(q.pp.p.hue)}"/>`).join("")}
      ${reduce ? "" : recent.map((q, i) => `<path id="mmr${i}" d="${trunk(q.pp)} ${branch(q)}" fill="none" stroke="none"/>
        ${[0, 1].map((k) => `<circle class="mm-part" data-s="${q.s.id}" r="${k ? 1.8 : 2.6}" fill="${k ? col(q.pp.p.hue, 75) : "#e9e2ff"}" opacity="0"><animate attributeName="opacity" from="0" to="${k ? .7 : 1}" begin="${2.4 + i * 0.3}s" dur=".4s" fill="freeze"/><animateMotion dur="${3.2 + i * 0.35}s" begin="${2.4 + i * 0.3 + k * 1.6}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .55 1"><mpath href="#mmr${i}"/></animateMotion></circle>`).join("")}`).join("")}
    </svg>`;
    const core = `<div class="mm-core-w"><div class="mm-core in" data-fit><div class="mm-ring"></div><div class="mm-orb">DU</div>
      <small>${totals.sessions} Sessions · ${projects.length} Projekte</small></div></div>`;
    const pills = P.map((pp, i) => `<button class="mm-proj in" data-proj="${pp.i}" data-p="${pp.i}" style="--i:${i + 4};--h:${pp.p.hue};left:${(pp.x - pp.w / 2).toFixed(1)}px;top:${(pp.y - PH / 2).toFixed(1)}px;width:${pp.w.toFixed(0)}px" title="${A.esc(A.short(pp.p.path))}">
      <i></i><span class="nm">${A.esc(pp.p.name)}</span><span class="ct">${pp.p.sessions.length}</span></button>`).join("");
    const chips = S.map((q, i) => {
      const s = q.s, n = s.agents.length;
      return `<span class="mm-pin fadein" data-s="${s.id}" style="--i:${i * 0.6 + 14};--h:${q.pp.p.hue};left:${q.ax.toFixed(1)}px;top:${q.ay.toFixed(1)}px"></span>
      ${s.agents.map((_, k) => `<span class="mm-sat" style="left:${q.ax.toFixed(1)}px;top:${q.ay.toFixed(1)}px;--r:${9 + (k % 2) * 5}px;--d:${5 + k * 1.3}s;--dl:-${(k * 1.7).toFixed(1)}s"></span>`).join("")}
      <button class="mm-sess in ${s.id === selId ? "sel" : ""}" data-open="${s.id}" data-s="${s.id}" data-pp="${q.pp.i}" style="--i:${i * 0.6 + 12};--h:${q.pp.p.hue};left:${q.rc.x.toFixed(1)}px;top:${q.rc.y.toFixed(1)}px" title="${A.esc(s.label)}">
        <b>${A.esc(s.label)}</b><span class="meta">${s.live ? `<span class="dot live"></span>` : ""}<em>${A.esc(A.rel(s.end))}</em> · ${s.nodes.length} ${s.nodes.length === 1 ? "Schritt" : "Schritte"}${n ? ` · <span style="color:var(--teal)">${n} ${n === 1 ? "Agent" : "Agents"}</span>` : ""}</span></button>`;
    }).join("");

    root.innerHTML = `<div class="mm-grid"></div><div class="mm-world">${svg}${pills}${chips}${core}</div>
      <div class="mm-hud mm-title glass"><span class="k">SESSION ATLAS</span><span class="s">${totals.steps} Schritte · ${totals.agents} Agents · zuletzt ${A.esc(A.rel(A.DATA.sessions[0].end))}</span></div>
      <div class="mm-hud mm-ctl glass"><button data-zoom="-1" aria-label="Verkleinern">-</button><span class="zk mono">100%</span><button data-zoom="1" aria-label="Vergrößern">+</button><button data-fit>${A.ic("grid")} Einpassen</button></div>
      <div class="mm-hud mm-hint">Ziehen bewegt · Strg + Scrollen zoomt</div>`;
    root.querySelector(".mm-sess.sel")?.classList.remove("sel");
    if (selId) root.querySelector(`.mm-sess[data-s="${selId}"]`)?.classList.add("sel");

    // ---------- Camera ----------
    const world = root.querySelector(".mm-world"), grid = root.querySelector(".mm-grid"), zk = root.querySelector(".zk");
    const cam = { x: 0, y: 0, k: 1 };
    let animT;
    const apply = (anim) => {
      clearTimeout(animT);
      world.classList.toggle("anim", !!anim);
      if (anim) animT = setTimeout(() => world.classList.remove("anim"), 1000);
      world.style.transform = `translate(${cam.x}px,${cam.y}px) scale(${cam.k})`;
      const g = 28 * cam.k;
      grid.style.backgroundSize = `${g}px ${g}px`;
      grid.style.backgroundPosition = `${cam.x}px ${cam.y}px`;
      grid.style.transition = anim ? "background-position .95s var(--spring), background-size .95s var(--spring)" : "none";
      zk.textContent = Math.round(cam.k * 100) + "%";
    };
    const bbox = (list) => {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const r of list) { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); }
      return { x0, y0, x1, y1 };
    };
    const area = () => {
      const W = root.clientWidth, H = root.clientHeight, drawer = document.getElementById("drawer")?.classList.contains("open") ? Math.min(512, W * 0.45) : 0;
      return { l: 24, t: 76, r: W - 24 - drawer, b: H - 78 };
    };
    const fitTo = (b, maxK, anim, minK) => {
      const a = area(), bw = b.x1 - b.x0, bh = b.y1 - b.y0;
      cam.k = Math.max(minK || 0.2, Math.min(maxK, (a.r - a.l) / bw, (a.b - a.t) / bh));
      cam.x = (a.l + a.r) / 2 - ((b.x0 + b.x1) / 2) * cam.k;
      cam.y = (a.t + a.b) / 2 - ((b.y0 + b.y1) / 2) * cam.k;
      apply(anim);
    };
    const fitAll = (anim) => fitTo(bbox(rects), 1.25, anim, 0.6);
    const focusProj = (i) => {
      const pp = P[i], list = [{ x: pp.x - pp.w / 2, y: pp.y - PH / 2, w: pp.w, h: PH }, ...S.filter((q) => q.pp === pp).map((q) => q.rc), { x: -40, y: -40, w: 80, h: 80 }];
      fitTo(bbox(list), 1.6, true);
    };
    const zoomAt = (f, px, py, anim) => {
      const k = Math.max(0.2, Math.min(3, cam.k * f));
      cam.x = px - (px - cam.x) * (k / cam.k); cam.y = py - (py - cam.y) * (k / cam.k); cam.k = k;
      apply(anim);
    };
    fitAll(false);

    // ---------- Interaction ----------
    let drag = null, moved = false;
    const onDown = (e) => {
      if (e.button !== 0 || e.target.closest(".mm-ctl")) return;
      drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y }; moved = false;
    };
    const onMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      if (!moved) { moved = true; root.classList.add("dragging"); world.classList.remove("anim"); }
      cam.x = drag.cx + dx; cam.y = drag.cy + dy; apply(false);
    };
    const onUp = () => { drag = null; root.classList.remove("dragging"); };
    const onClickCapture = (e) => {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; return; }
      const z = e.target.closest("[data-zoom]"), f = e.target.closest("[data-fit]"), p = e.target.closest("[data-proj]");
      const r = root.getBoundingClientRect();
      if (z) return zoomAt(+z.dataset.zoom > 0 ? 1.35 : 1 / 1.35, r.width / 2, r.height / 2, true);
      if (f) return fitAll(true);
      if (p) return focusProj(+p.dataset.proj);
    };
    const onWheel = (e) => {
      e.preventDefault();
      const r = root.getBoundingClientRect();
      const mouseWheel = e.deltaMode === 1 || (e.deltaX === 0 && Math.abs(e.deltaY) >= 50 && Number.isInteger(e.deltaY));
      if (e.ctrlKey || e.metaKey || mouseWheel) zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX - r.left, e.clientY - r.top, false);
      else { cam.x -= e.deltaX; cam.y -= e.deltaY; apply(false); }
    };
    // Hover: light up the path back to the center
    const onOver = (e) => {
      const c = e.target.closest(".mm-sess");
      root.querySelectorAll(".hl").forEach((x) => x.classList.remove("hl"));
      if (!c) return root.classList.remove("hov");
      root.classList.add("hov");
      root.querySelectorAll(`[data-s="${c.dataset.s}"],[data-p="${c.dataset.pp}"]`).forEach((x) => x.classList.add("hl"));
    };
    const onLeave = () => { root.classList.remove("hov"); };
    let rz; const onResize = () => { clearTimeout(rz); rz = setTimeout(() => fitAll(true), 120); };

    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("click", onClickCapture, true);
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("mouseover", onOver);
    root.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    A.onCleanup(() => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", onResize);
      clearTimeout(animT); clearTimeout(rz);
      root.classList.remove("hov", "dragging");
    });
  }

  function onSelect(id) {
    selId = id;
    if (!root) return;
    root.querySelectorAll(".mm-sess.sel").forEach((x) => x.classList.remove("sel"));
    if (id) root.querySelector(`.mm-sess[data-s="${id}"]`)?.classList.add("sel");
  }

  Atlas.register({ key: "mindmap", name: "Mindmap", tagline: "Du in der Mitte, alles verbunden", css, render, onSelect, wantsArrows: false });
})();
