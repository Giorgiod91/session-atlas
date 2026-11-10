// Look: Metro-Plan. Each project is a subway line on a shared day axis, sessions are stations.
(() => {
  const css = `
.lk-metro { background: radial-gradient(1000px 600px at 80% 10%, rgba(60,40,140,.25), transparent 60%), radial-gradient(800px 500px at 10% 90%, rgba(20,120,130,.18), transparent 60%), #07080d; overflow: hidden; user-select: none; }
.lk-metro .mt-frame { position: absolute; left: 16px; top: 16px; right: 16px; bottom: 82px; display: flex; flex-direction: column; overflow: hidden; border-radius: 20px; background: rgba(14,16,24,.55); }
.lk-metro .mt-head { display: flex; height: 58px; border-bottom: 1px solid var(--line); flex: none; }
.lk-metro .mt-title { flex: none; padding: 12px 18px 0; border-right: 1px solid var(--line); }
.lk-metro .mt-title h1 { margin: 0; font: 800 15px var(--sans); letter-spacing: .02em; display: flex; align-items: center; gap: 8px; }
.lk-metro .mt-title h1 span { width: 18px; height: 18px; border-radius: 5px; background: #fff; color: #07080d; display: grid; place-items: center; font: 900 11px var(--sans); }
.lk-metro .mt-title .cap { font: 500 11px var(--mono); color: var(--ink-3); margin-top: 3px; white-space: nowrap; }
.lk-metro .mt-axisvp { flex: 1; overflow: hidden; position: relative; }
.lk-metro .mt-axis { position: absolute; left: 0; top: 0; height: 58px; }
.lk-metro .mt-day { position: absolute; top: 14px; font: 700 11px var(--mono); color: var(--ink-2); white-space: nowrap; }
.lk-metro .mt-day small { display: block; font: 500 10px var(--mono); color: var(--ink-3); letter-spacing: .08em; text-transform: uppercase; }
.lk-metro .mt-day.today { color: var(--teal); }
.lk-metro .mt-day.today small { color: var(--teal); }
.lk-metro .mt-gap { position: absolute; top: 26px; height: 2px; background: repeating-linear-gradient(90deg, rgba(255,255,255,.18) 0 3px, transparent 3px 7px); }
.lk-metro .mt-body { flex: 1; display: flex; min-height: 0; }
.lk-metro .mt-legvp { flex: none; overflow: hidden; position: relative; border-right: 1px solid var(--line); }
.lk-metro .mt-leg { position: absolute; left: 0; right: 0; top: 0; }
.lk-metro .mt-li { position: absolute; left: 8px; right: 8px; display: flex; align-items: center; gap: 10px; padding: 0 10px; border-radius: 12px; text-align: left;
  transition: background .2s, opacity .3s, transform .35s var(--spring); }
.lk-metro .mt-li:hover { background: rgba(255,255,255,.05); transform: translateX(3px); }
.lk-metro .mt-li.on { background: hsl(var(--h) 80% 60% / .12); }
.lk-metro .mt-li i { flex: none; width: 26px; height: 26px; border-radius: 50%; background: hsl(var(--h) 85% 60%); color: #07080d; display: grid; place-items: center;
  font: 900 10.5px var(--sans); font-style: normal; box-shadow: 0 0 14px hsl(var(--h) 90% 60% / .45); }
.lk-metro .mt-li b { display: block; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-metro .mt-li small { display: block; font: 500 10.5px var(--mono); color: var(--ink-3); white-space: nowrap; }
.lk-metro .mt-scroll { flex: 1; overflow: auto; position: relative; cursor: grab; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.15) transparent; }
.lk-metro .mt-scroll.drag { cursor: grabbing; }
.lk-metro .mt-map { position: relative; }
.lk-metro .mt-map svg { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.lk-metro .mt-grid { stroke: rgba(255,255,255,.045); stroke-width: 1; }
.lk-metro .mt-todayband { fill: rgba(45,212,191,.05); }
.lk-metro .mt-line { fill: none; stroke: hsl(var(--h) 88% 62%); stroke-width: 6; stroke-linecap: round; filter: drop-shadow(0 0 6px hsl(var(--h) 90% 55% / .55)); transition: opacity .35s, stroke-width .35s var(--spring); }
.lk-metro .mt-idle { fill: none; stroke: hsl(var(--h) 80% 65% / .28); stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 0 8; }
.lk-metro .mt-xfer { stroke: rgba(255,255,255,.26); stroke-width: 2; stroke-dasharray: 2 5; }
.lk-metro .mt-spur { stroke: hsl(var(--h) 88% 70%); stroke-width: 2; stroke-linecap: round; }
.lk-metro .mt-bot { fill: #fff; stroke: hsl(var(--h) 88% 60%); stroke-width: 1.5; }
.lk-metro .mt-g { transition: opacity .35s; }
.lk-metro .mt-st { position: absolute; width: 0; height: 0; transition: opacity .35s; }
.lk-metro .mt-st .c { position: absolute; width: calc(var(--r) * 2px); height: calc(var(--r) * 2px); left: calc(var(--r) * -1px); top: calc(var(--r) * -1px); border-radius: 50%;
  background: #fff; border: 3px solid hsl(var(--h) 88% 60%); box-shadow: 0 0 10px hsl(var(--h) 90% 60% / .5); transition: transform .4s var(--spring), box-shadow .3s; }
.lk-metro .mt-st.x .c { border-color: #07080d; box-shadow: 0 0 0 2px #fff, 0 0 12px rgba(255,255,255,.35); }
.lk-metro .mt-st.live .c { animation: mtlive 1.6s ease-in-out infinite; }
@keyframes mtlive { 50% { box-shadow: 0 0 0 5px rgba(74,222,128,.35), 0 0 16px rgba(74,222,128,.6); } }
.lk-metro .mt-st .c::after { content: ""; position: absolute; inset: -8px; border-radius: 50%; }
.lk-metro .mt-st .l { position: absolute; left: -4px; max-width: var(--mw); font: 600 11.5px var(--sans); color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 14px;
  text-shadow: 0 1px 3px #000, 0 0 8px #07080d; transition: color .2s; pointer-events: none; }
.lk-metro .mt-st.up .l { bottom: calc(var(--r) * 1px + 3px); }
.lk-metro .mt-st.dn .l { top: calc(var(--r) * 1px + 3px); }
.lk-metro .mt-st:hover .c { transform: scale(1.35); box-shadow: 0 0 0 3px hsl(var(--h) 90% 70% / .45), 0 0 18px hsl(var(--h) 90% 60% / .8); }
.lk-metro .mt-st:hover .l { color: hsl(var(--h) 95% 82%); }
.lk-metro .mt-st.sel .c { transform: scale(1.35); box-shadow: 0 0 0 3px var(--teal), 0 0 20px var(--teal); }
.lk-metro .mt-st.sel .l { color: var(--teal); }
.lk-metro .mt-st.pop { animation: mtpop .6s var(--spring) both; }
@keyframes mtpop { from { opacity: 0; transform: scale(.3); } }
.lk-metro .mt-tip { position: fixed; z-index: 40; padding: 10px 12px; width: 240px; pointer-events: none; opacity: 0; transform: translateY(6px); transition: opacity .2s, transform .35s var(--spring);
  background: rgba(14,16,26,.86); border-radius: 12px; }
.lk-metro .mt-tip.show { opacity: 1; transform: none; }
.lk-metro .mt-tip b { display: block; font-size: 13px; line-height: 1.3; margin: 2px 0 4px; }
.lk-metro.hl .mt-g:not(.on), .lk-metro.hl .mt-st:not(.on) { opacity: .12; }
.lk-metro.hl .mt-li:not(.on) { opacity: .45; }
.lk-metro.hl .mt-g.on .mt-line { stroke-width: 8; }
@media (prefers-reduced-motion: reduce) { .lk-metro .mt-st.live .c { animation: none; } .lk-metro .mt-st.pop { animation: none; } }`;

  let rootEl = null;
  const dayKey = (ts) => new Date(ts).toLocaleDateString("sv-SE");

  function render(root, A) {
    rootEl = root;
    const D = A.DATA, esc = A.esc;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = root.clientWidth || innerWidth, H = root.clientHeight || innerHeight;
    const LW = W < 1150 ? 196 : 232;
    const lines = D.projects.slice().sort((a, b) => b.last.localeCompare(a.last));
    const n = lines.length;
    const bodyH = H - 16 - 82 - 58;
    const RH = Math.max(46, Math.min(72, (bodyH - 24) / n));
    const PAD_T = 12;

    // Day axis from first to last activity; empty days are compressed
    const first = new Date(Math.min(...D.sessions.map((s) => Date.parse(s.end)))); first.setHours(0, 0, 0, 0);
    const lastD = new Date(Math.max(Date.parse(D.generatedAt), ...D.sessions.map((s) => Date.parse(s.end))));
    const days = [];
    for (const d = new Date(first); dayKey(d) <= dayKey(lastD); d.setDate(d.getDate() + 1)) days.push({ key: dayKey(d), date: new Date(d) });
    const slotW = 74, inset = 30;
    // sessions per line per day, ordered by time
    const per = new Map(); // `${line}|${day}` -> sessions
    lines.forEach((p, li) => p.sessions.slice().sort((a, b) => a.end.localeCompare(b.end)).forEach((s) => {
      const k = li + "|" + dayKey(s.end); if (!per.has(k)) per.set(k, []); per.get(k).push(s);
    }));
    let x = 24;
    days.forEach((d) => {
      let mx = 0; for (let li = 0; li < n; li++) mx = Math.max(mx, per.get(li + "|" + d.key)?.length || 0);
      d.active = mx > 0; d.x = x; d.w = mx ? Math.max(132, inset + mx * slotW + 26) : 22; x += d.w;
    });
    const MW = x + 160, MH = PAD_T * 2 + n * RH;
    const todayKey = dayKey(D.generatedAt);
    const dayOf = Object.fromEntries(days.map((d) => [d.key, d]));
    const rowY = (li) => PAD_T + li * RH + RH / 2;

    // Stations
    const st = []; // {s, li, x, y, slot}
    const byLine = lines.map(() => []);
    for (const [k, arr] of per) {
      const [li, dk] = k.split("|"); const d = dayOf[dk];
      arr.forEach((s, slot) => { const o = { s, li: +li, x: d.x + inset + slot * slotW, y: rowY(+li), slot, day: dk }; st.push(o); byLine[+li].push(o); });
    }
    byLine.forEach((arr) => arr.sort((a, b) => a.x - b.x));
    // Label placement: alternate above/below, avoid the neighbouring rows, and
    // trim an earlier label on the same row when a newer station needs the room
    const bands = new Map();
    const band = (k) => { if (!bands.has(k)) bands.set(k, []); return bands.get(k); };
    const room = (li, side, x0) => {
      let lim = 190;
      for (const it of band(li + "|" + side)) { if (it.a > x0) lim = Math.min(lim, it.a - x0 - 10); else if (it.b > x0 - 6 && x0 - 10 - it.a < 44) return 0; }
      for (const it of band(side === "up" ? li - 1 + "|dn" : li + 1 + "|up")) { if (it.a > x0) lim = Math.min(lim, it.a - x0 - 10); else if (it.b > x0 - 6) return 0; }
      return lim;
    };
    byLine.forEach((arr, li) => {
      let prev = "dn";
      arr.forEach((o) => {
        const est = Math.min(190, o.s.label.length * 6.1 + 6), x0 = o.x - 4;
        const pref = prev === "up" ? "dn" : "up", other = pref === "up" ? "dn" : "up";
        const rp = room(li, pref, x0), ro = room(li, other, x0);
        const side = rp >= Math.min(est, 90) || rp >= ro ? pref : other;
        const w = Math.max(44, Math.min(est, side === pref ? rp : ro));
        for (const it of band(li + "|" + side)) if (it.a <= x0 && it.b > x0 - 6) { it.b = x0 - 10; it.o.mw = Math.round(it.b - it.a); }
        o.up = side === "up"; o.mw = Math.round(w); prev = side;
        band(li + "|" + side).push({ a: x0, b: x0 + w, o });
      });
    });
    // Interchanges: lines with a station on the same day
    const dayLines = new Map();
    st.forEach((o) => { if (o.slot === 0) { if (!dayLines.has(o.day)) dayLines.set(o.day, []); dayLines.get(o.day).push(o); } });
    const xferIds = new Set(); let xfers = "";
    for (const [, arr] of dayLines) {
      if (arr.length < 2) continue;
      arr.forEach((o) => xferIds.add(o.s.id));
      const ys = arr.map((o) => o.y);
      xfers += `<line class="mt-xfer" x1="${arr[0].x}" x2="${arr[0].x}" y1="${Math.min(...ys)}" y2="${Math.max(...ys)}"/>`;
    }

    // SVG: grid, today band, lines, agent spurs
    let grid = "";
    days.forEach((d) => {
      if (d.key === todayKey) grid += `<rect class="mt-todayband" x="${d.x}" y="0" width="${d.w}" height="${MH}"/>`;
      if (d.active) grid += `<line class="mt-grid" x1="${d.x}" x2="${d.x}" y1="0" y2="${MH}"/>`;
    });
    let lineSvg = "";
    byLine.forEach((arr, li) => {
      if (!arr.length) return;
      const p = lines[li], y = rowY(li), x0 = arr[0].x - 26, x1 = arr[arr.length - 1].x + 26;
      let spurs = "";
      arr.forEach((o, i) => {
        const ags = o.s.agents; if (!ags.length) return;
        const dir = o.up ? 1 : -1; // opposite side of the label
        ags.forEach((a, j) => {
          const t = ags.length === 1 ? 0 : j / (ags.length - 1) - 0.5;
          const L = 17 + (j % 2) * 5;
          const dx = Math.sin(t * 1.9) * L, dy = Math.cos(t * 1.9) * L * dir;
          spurs += `<line class="mt-spur" x1="${o.x}" y1="${y}" x2="${(o.x + dx).toFixed(1)}" y2="${(y + dy).toFixed(1)}"/><circle class="mt-bot" cx="${(o.x + dx).toFixed(1)}" cy="${(y + dy).toFixed(1)}" r="3"><title>${esc(A.aName(a.type))}</title></circle>`;
        });
      });
      const tEnd = dayOf[todayKey] ? dayOf[todayKey].x + dayOf[todayKey].w - 20 : x1;
      const idle = tEnd - x1 > 30 ? `<path class="mt-idle" d="M${x1 + 10},${y} H${tEnd}"/>` : "";
      lineSvg += `<g class="mt-g" data-line="${li}" style="--h:${p.hue}">${idle}<path class="mt-line" pathLength="1" d="M${x0},${y} H${x1}"/>${spurs}</g>`;
    });

    // Station buttons with alternating labels
    const stHtml = byLine.map((arr, li) => arr.map((o, i) => {
      const s = o.s, up = o.up, mw = o.mw;
      const r = 6 + Math.min(3, s.nodes.length / 25);
      return `<button class="mt-st ${up ? "up" : "dn"} ${xferIds.has(s.id) ? "x" : ""} ${s.live ? "live" : ""} pop" data-open="${s.id}" data-line="${li}" data-sid="${s.id}"
        style="left:${o.x}px;top:${o.y}px;--h:${lines[li].hue};--r:${r.toFixed(1)};--mw:${mw}px;animation-delay:${reduce ? 0 : Math.round(300 + li * 70 + ((o.x - arr[0].x) / Math.max(1, arr[arr.length - 1].x - arr[0].x + 52)) * 1300)}ms"
        aria-label="${esc(s.label)}"><span class="c"></span><span class="l">${esc(s.label)}</span></button>`;
    }).join("")).join("");

    // Axis
    const wd = (d) => d.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
    let axis = "", gapStart = null;
    days.forEach((d, i) => {
      if (d.active) {
        if (gapStart != null) { axis += `<div class="mt-gap" style="left:${gapStart + 4}px;width:${d.x - gapStart - 8}px"></div>`; gapStart = null; }
        axis += `<div class="mt-day ${d.key === todayKey ? "today" : ""}" style="left:${d.x + 12}px">${d.key === todayKey ? "Heute" : wd(d.date)}<small>${d.date.getDate()}. ${d.date.toLocaleDateString("de-DE", { month: "short" }).replace(".", "")}</small></div>`;
      } else if (gapStart == null) gapStart = d.x;
      if (i === days.length - 1 && gapStart != null) axis += `<div class="mt-gap" style="left:${gapStart + 4}px;width:${d.x + d.w - gapStart - 8}px"></div>`;
    });

    const abbr = (name) => { const w = name.replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(" "); return (w.length > 1 ? w[0][0] + w[1][0] : name.slice(0, 2)).toUpperCase(); };
    const legend = lines.map((p, li) => `<button class="mt-li in" data-hl="${li}" style="top:${PAD_T + li * RH + (RH - 40) / 2}px;height:40px;--h:${p.hue};--i:${li}">
      <i>${esc(abbr(p.name))}</i><span style="min-width:0"><b>${esc(p.name)}</b><small>${p.sessions.length} Stat. · ${A.relShort(p.last)}</small></span></button>`).join("");

    root.innerHTML = `<div class="mt-frame glass">
      <div class="mt-head"><div class="mt-title" style="width:${LW}px"><h1><span>M</span>Metro-Plan</h1><div class="cap">${n} Linien · ${D.totals.sessions} Stationen</div></div>
        <div class="mt-axisvp"><div class="mt-axis" style="width:${MW}px">${axis}</div></div></div>
      <div class="mt-body"><div class="mt-legvp" style="width:${LW}px"><div class="mt-leg" style="height:${MH}px">${legend}</div></div>
        <div class="mt-scroll"><div class="mt-map" style="width:${MW}px;height:${MH}px">
          <svg width="${MW}" height="${MH}">${grid}${xfers}${lineSvg}</svg>${stHtml}</div></div></div>
    </div><div class="mt-tip glass"></div>`;

    const sc = root.querySelector(".mt-scroll"), axisEl = root.querySelector(".mt-axis"), legEl = root.querySelector(".mt-leg"), tip = root.querySelector(".mt-tip");
    const sync = () => { axisEl.style.transform = `translateX(${-sc.scrollLeft}px)`; legEl.style.transform = `translateY(${-sc.scrollTop}px)`; };
    sc.addEventListener("scroll", sync);
    sc.scrollLeft = sc.scrollWidth; sync();

    // Draw the lines in
    root.querySelectorAll(".mt-line").forEach((el, i) => {
      el.style.strokeDasharray = "1";
      if (reduce) return;
      el.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1500, delay: 200 + i * 70, easing: "cubic-bezier(.6,0,.2,1)", fill: "backwards" });
    });

    // Wheel pans horizontally, drag pans both ways
    sc.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey) { sc.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive: false });
    let drag = null, moved = false;
    sc.addEventListener("pointerdown", (e) => { if (e.button !== 0) return; drag = { x: e.clientX, y: e.clientY, l: sc.scrollLeft, t: sc.scrollTop }; moved = false; });
    const onMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!moved && Math.hypot(dx, dy) > 4) { moved = true; sc.classList.add("drag"); }
      if (moved) { sc.scrollLeft = drag.l - dx; sc.scrollTop = drag.t - dy; }
    };
    const onUp = () => { drag = null; sc.classList.remove("drag"); };
    addEventListener("pointermove", onMove); addEventListener("pointerup", onUp);
    // Swallow the click that ends a drag so it does not open a station
    sc.addEventListener("click", (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);

    // Legend highlight
    let hl = null;
    root.querySelector(".mt-leg").addEventListener("click", (e) => {
      const b = e.target.closest("[data-hl]"); if (!b) return;
      hl = hl === b.dataset.hl ? null : b.dataset.hl;
      root.classList.toggle("hl", hl != null);
      root.querySelectorAll("[data-line],[data-hl]").forEach((el) => el.classList.toggle("on", hl != null && (el.dataset.line ?? el.dataset.hl) === hl));
      if (hl != null) { // bring the line's newest station into view
        const last = byLine[+hl][byLine[+hl].length - 1];
        if (last && (last.x < sc.scrollLeft + 40 || last.x > sc.scrollLeft + sc.clientWidth - 40)) sc.scrollTo({ left: last.x - sc.clientWidth * 0.6, behavior: "smooth" });
      }
    });

    // Station tooltip
    const byId = Object.fromEntries(D.sessions.map((s) => [s.id, s]));
    sc.addEventListener("mouseover", (e) => {
      const b = e.target.closest(".mt-st"); if (!b || drag) return;
      const s = byId[b.dataset.sid];
      tip.style.borderColor = `hsl(${s.hue} 70% 60% / .45)`;
      tip.innerHTML = `<div class="cap mono" style="color:hsl(${s.hue} 85% 72%)">${esc(s.projName)}${s.live ? ` · <span style="color:var(--green)">läuft</span>` : ""}</div><b>${esc(s.label)}</b>
        <div class="cap mono">${A.day(s.end)} ${A.hhmm(s.end)} · ${s.nodes.length} Schritte${s.agents.length ? ` · ${s.agents.length} Subagents` : ""}</div>`;
      const r = b.getBoundingClientRect();
      let tx = r.left + 16, ty = r.top + 18;
      if (tx + 250 > W) tx = r.left - 256;
      if (ty + 100 > H - 80) ty = r.top - 110;
      tip.style.left = tx + "px"; tip.style.top = ty + "px"; tip.classList.add("show");
    });
    sc.addEventListener("mouseout", (e) => { if (e.target.closest(".mt-st") && !e.relatedTarget?.closest?.(".mt-st")) tip.classList.remove("show"); });
    sc.addEventListener("scroll", () => tip.classList.remove("show"));

    A.onCleanup(() => { removeEventListener("pointermove", onMove); removeEventListener("pointerup", onUp); rootEl = null; });
  }

  function onSelect(id) {
    if (!rootEl) return;
    rootEl.querySelectorAll(".mt-st.sel").forEach((el) => el.classList.remove("sel"));
    if (id) rootEl.querySelector(`.mt-st[data-sid="${id}"]`)?.classList.add("sel");
  }

  Atlas.register({ key: "metro", name: "Metro-Plan", tagline: "Jedes Projekt eine Linie", css, render, onSelect, wantsArrows: false });
})();
