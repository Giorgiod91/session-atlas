// Look: Spotlight. Search-first command palette (Raycast-like) over a soft
// spring-physics graph of all sessions. Matching nodes light up and drift to center.
(function () {
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  const css = `
.lk-spotlight { background: radial-gradient(900px 600px at 20% 10%, rgba(139,108,255,.16), transparent 60%),
  radial-gradient(800px 600px at 85% 90%, rgba(45,212,191,.12), transparent 60%), #07080d; overflow: hidden; }
.lk-spotlight canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.lk-spotlight .wrap { position: absolute; left: 0; right: 0; top: clamp(24px, 10vh, 110px); bottom: 78px; display: flex; justify-content: center; align-items: flex-start; padding: 0 16px; pointer-events: none;
  transition: transform .7s var(--spring); }
.lk-spotlight.dw .wrap { transform: translateX(min(-250px, calc((100vw - 500px) / 2 - 50vw))); }
.lk-spotlight .pal { pointer-events: auto; width: min(720px, 100%); max-height: 100%; display: flex; flex-direction: column; border-radius: 22px;
  background: rgba(20,22,32,.58); border: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(30px) saturate(170%); -webkit-backdrop-filter: blur(30px) saturate(170%);
  box-shadow: 0 1px 0 rgba(255,255,255,.1) inset, 0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(139,108,255,.08); animation: sp-pop .8s var(--spring) both; }
@keyframes sp-pop { from { opacity: 0; transform: translateY(18px) scale(.95); } }
.lk-spotlight .q { display: flex; align-items: center; gap: 14px; padding: 18px 22px; border-bottom: 1px solid rgba(255,255,255,.08); }
.lk-spotlight .q svg.i { width: 24px; height: 24px; color: var(--violet); }
.lk-spotlight .q input { flex: 1; min-width: 0; background: none; border: 0; outline: 0; color: var(--ink); font: 600 23px var(--sans); letter-spacing: -.01em; }
.lk-spotlight .q input::placeholder { color: var(--ink-3); }
.lk-spotlight kbd { font: 600 11px var(--mono); color: var(--ink-2); padding: 3px 7px; border-radius: 6px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-bottom-width: 2px; white-space: nowrap; }
.lk-spotlight .res { flex: 1; min-height: 0; padding: 8px 10px 10px; }
.lk-spotlight .grp { font: 700 10.5px var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); padding: 12px 12px 6px; display: flex; justify-content: space-between; }
.lk-spotlight .it { display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; gap: 12px; align-items: center; width: 100%; text-align: left; padding: 9px 12px; border-radius: 12px; position: relative;
  transition: background .15s; }
.lk-spotlight .it.sel { background: rgba(139,108,255,.18); box-shadow: 0 0 0 1px rgba(139,108,255,.35) inset; }
.lk-spotlight .it .av { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; font: 800 12px var(--mono); color: #0b0c12;
  background: linear-gradient(135deg, hsl(var(--h) 80% 70%), hsl(var(--h) 75% 52%)); }
.lk-spotlight .it .av.st { background: rgba(255,255,255,.07); color: var(--ink-2); border: 1px solid var(--line); }
.lk-spotlight .it .av.ag { background: rgba(45,212,191,.15); color: var(--teal); border: 1px solid rgba(45,212,191,.35); }
.lk-spotlight .it .t { font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-spotlight .it .s { font-size: 12px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-spotlight .it .sn { font-size: 13px; color: var(--ink); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.4; }
.lk-spotlight .it .r { font: 600 11.5px var(--mono); color: var(--ink-3); text-align: right; white-space: nowrap; display: flex; align-items: center; gap: 8px; }
.lk-spotlight .it .r .go { opacity: 0; transition: opacity .15s; }
.lk-spotlight .it.sel .r .go { opacity: 1; }
.lk-spotlight mark { background: rgba(250,189,47,.22); color: #ffe29a; border-radius: 3px; padding: 0 1px; }
.lk-spotlight .ft { display: flex; gap: 16px; align-items: center; padding: 10px 18px; border-top: 1px solid rgba(255,255,255,.08); font-size: 11.5px; color: var(--ink-3); flex-wrap: wrap; }
.lk-spotlight .ft span { display: inline-flex; gap: 6px; align-items: center; }
.lk-spotlight .ft .ct { margin-left: auto; font-family: var(--mono); }
.lk-spotlight .none { padding: 30px 16px; text-align: center; color: var(--ink-2); }
/* Empty state */
.lk-spotlight .cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; padding: 0 4px 6px; }
.lk-spotlight .card { text-align: left; padding: 12px 13px; border-radius: 14px; background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.09); display: flex; flex-direction: column; gap: 7px; min-width: 0;
  transition: transform .4s var(--spring), background .2s, border-color .2s; }
.lk-spotlight .card:hover, .lk-spotlight .card.sel { background: rgba(139,108,255,.14); border-color: rgba(139,108,255,.45); transform: translateY(-2px); }
.lk-spotlight .card .hd { display: flex; align-items: center; gap: 7px; font-size: 11.5px; color: var(--ink-2); min-width: 0; }
.lk-spotlight .card .hd b { width: 8px; height: 8px; border-radius: 50%; background: hsl(var(--h) 80% 62%); box-shadow: 0 0 8px hsl(var(--h) 80% 62%); flex: none; }
.lk-spotlight .card .hd span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lk-spotlight .card .hd em { margin-left: auto; font-style: normal; font-family: var(--mono); color: var(--ink-3); white-space: nowrap; }
.lk-spotlight .card .tt { font-weight: 700; font-size: 13.5px; line-height: 1.3; height: 2.6em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.lk-spotlight .spark { position: relative; height: 12px; }
.lk-spotlight .spark::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: rgba(255,255,255,.1); }
.lk-spotlight .spark i { position: absolute; top: 50%; width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; border-radius: 50%; background: hsl(var(--h) 80% 66%); opacity: .85; }
.lk-spotlight .spark i.l { width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px; background: #fff; box-shadow: 0 0 8px hsl(var(--h) 80% 66%); }
.lk-spotlight .card .ft2 { font: 600 10.5px var(--mono); color: var(--ink-3); }
.lk-spotlight .chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 6px 8px; }
.lk-spotlight .chip { display: inline-flex; align-items: center; gap: 7px; padding: 5px 11px; border-radius: 999px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); font-size: 12.5px; font-weight: 600;
  max-width: 220px; transition: background .2s, transform .35s var(--spring); }
.lk-spotlight .chip:hover { background: rgba(255,255,255,.1); transform: translateY(-1px); }
.lk-spotlight .chip b { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--h) 80% 62%); flex: none; }
.lk-spotlight .chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lk-spotlight .chip small { color: var(--ink-3); font-family: var(--mono); }
.lk-spotlight .hint { position: absolute; left: 0; right: 0; top: calc(clamp(24px, 10vh, 110px) - 30px); text-align: center; font: 700 10.5px var(--mono); letter-spacing: .3em; text-transform: uppercase; color: var(--ink-3); pointer-events: none; }
.lk-spotlight .hint { transition: opacity .3s; } .lk-spotlight.dw .hint { opacity: 0; }
@media (max-width: 760px) { .lk-spotlight .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 760px), (max-height: 720px) { .lk-spotlight .card { gap: 5px; padding: 10px 11px; } .lk-spotlight .hint { display: none; } .lk-spotlight .q { padding: 14px 18px; } .lk-spotlight .q input { font-size: 20px; } }
`;

  // Fuzzy match: all terms as substrings (AND); single-term fallback to subsequence for short texts.
  function match(text, terms, fuzzy) {
    const low = text.toLowerCase(); const ranges = []; let score = 0;
    for (const t of terms) {
      const i = low.indexOf(t);
      if (i < 0) { ranges.length = 0; score = -1; break; }
      ranges.push([i, i + t.length]); score += 100 - Math.min(60, i * .3) + (i === 0 || /\W/.test(low[i - 1]) ? 25 : 0);
    }
    if (score >= 0) return { score, ranges };
    if (!fuzzy || terms.length !== 1 || terms[0].length < 3) return null;
    const t = terms[0]; let j = 0, gaps = 0, last = -1; const r = [];
    for (let i = 0; i < low.length && j < t.length; i++) if (low[i] === t[j]) { if (last >= 0) gaps += i - last - 1; r.push([i, i + 1]); last = i; j++; }
    if (j < t.length || gaps > t.length) return null;
    return { score: 40 - gaps, ranges: r };
  }
  function hl(A, text, ranges) {
    const rs = ranges.slice().sort((a, b) => a[0] - b[0]); let out = "", p = 0;
    for (const [a, b] of rs) { if (a < p) continue; out += A.esc(text.slice(p, a)) + "<mark>" + A.esc(text.slice(a, b)) + "</mark>"; p = b; }
    return out + A.esc(text.slice(p));
  }
  function snippet(A, text, ranges) {
    const t = text.replace(/\s+/g, " "); const low = t.toLowerCase();
    // re-locate ranges in whitespace-normalized text
    const rs = ranges.map(([a, b]) => { const w = text.slice(a, b).replace(/\s+/g, " ").toLowerCase(); const i = low.indexOf(w); return i < 0 ? null : [i, i + w.length]; }).filter(Boolean);
    const first = rs.length ? Math.min(...rs.map((r) => r[0])) : 0;
    const from = Math.max(0, first - 50), to = Math.min(t.length, from + 190);
    const cut = t.slice(from, to), shifted = rs.map(([a, b]) => [a - from, b - from]).filter(([a, b]) => a >= 0 && b <= cut.length);
    return (from > 0 ? "..." : "") + hl(A, cut, shifted) + (to < t.length ? "..." : "");
  }

  function render(root, A) {
    const D = A.DATA, S = D.sessions;
    root.innerHTML = `<canvas></canvas><div class="hint">Session Atlas</div>
      <div class="wrap"><div class="pal">
        <label class="q">${A.ic("search")}<input type="text" placeholder="Wonach suchst du?" autocomplete="off" spellcheck="false"><kbd>${S.length} Sessions</kbd></label>
        <div class="res scroll"></div>
        <div class="ft"><span><kbd>↑</kbd><kbd>↓</kbd> wählen</span><span><kbd>Enter</kbd> öffnen</span><span><kbd>Esc</kbd> leeren</span><span class="ct"></span></div>
      </div></div>`;
    const input = root.querySelector("input"), res = root.querySelector(".res"), ct = root.querySelector(".ft .ct"), cv = root.querySelector("canvas");
    let nav = [], sel = 0, hits = new Set(), query = "";

    function setSel(i, scroll) {
      sel = Math.max(0, Math.min(nav.length - 1, i));
      res.querySelectorAll("[data-nav]").forEach((el) => el.classList.toggle("sel", +el.dataset.nav === sel));
      if (scroll) res.querySelector(`[data-nav="${sel}"]`)?.scrollIntoView({ block: "nearest" });
    }
    const spark = (s) => {
      const t0 = Date.parse(s.nodes[0].ts), t1 = Date.parse(s.last.ts), span = Math.max(1, t1 - t0);
      const ns = s.nodes.length > 40 ? s.nodes.filter((_, i) => i % Math.ceil(s.nodes.length / 40) === 0 || i === s.nodes.length - 1) : s.nodes;
      return `<div class="spark">${ns.map((n, i) => `<i class="${n === s.last ? "l" : ""}" style="left:${s.nodes.length === 1 ? 50 : 3 + ((Date.parse(n.ts) - t0) / span) * 94}%"></i>`).join("")}</div>`;
    };

    function renderEmpty() {
      const recent = S.slice(0, 6);
      const projs = D.projects.slice().sort((a, b) => b.last.localeCompare(a.last));
      nav = recent.map((s) => ({ sid: s.id }));
      res.innerHTML = `<div class="grp"><span>Zuletzt</span><span>Pfeiltasten oder Klick</span></div>
        <div class="cards">${recent.map((s, i) => `<button class="card in" style="--i:${i};--h:${s.hue}" data-nav="${i}">
          <span class="hd"><b></b><span>${A.esc(s.projName)}</span><em>${A.esc(A.relShort(s.end))}</em></span>
          <span class="tt">${A.esc(s.label)}</span>${spark(s)}
          <span class="ft2">${s.nodes.length} ${s.nodes.length === 1 ? "Schritt" : "Schritte"}${s.agents.length ? ` · ${s.agents.length} Agents` : ""}${s.live ? " · läuft" : ""}</span></button>`).join("")}</div>
        <div class="grp"><span>Projekte</span><span>anklicken zum Filtern</span></div>
        <div class="chips">${projs.map((p, i) => `<button class="chip in" style="--i:${i + 6};--h:${p.hue}" data-chip="${A.esc(p.name)}" title="${A.esc(A.short(p.path))}"><b></b><span>${A.esc(p.name)}</span><small>${p.sessions.length}</small></button>`).join("")}</div>`;
      ct.textContent = `${D.totals.steps} Schritte durchsuchbar`;
      hits = new Set(); setSel(0);
    }

    function search(q) {
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      const ses = [], steps = [], ags = [];
      for (const s of S) {
        let m1 = match(s.label, terms, true); const m2 = match(s.projName, terms, true), m3 = s.about ? match(s.about, terms, false) : null;
        if (m1 && m1.score < 50 && (m2 || m3)) m1 = null;
        const best = [m1 && { ...m1, w: 3, f: "label" }, m2 && { ...m2, w: 2, f: "proj" }, m3 && { ...m3, w: 1, f: "about" }].filter(Boolean).sort((a, b) => b.score * b.w - a.score * a.w)[0];
        if (best) ses.push({ s, m: best, score: best.score * best.w, m1, m2 });
        for (const n of s.nodes) { const m = match(n.text, terms, false); if (m) steps.push({ s, n, m, score: m.score + Date.parse(n.ts) / 1e13 }); }
        for (const a of s.agents) {
          const txt = `${A.aName(a.type)} ${a.description || ""}`; const m = match(txt, terms, true) || match(a.task || "", terms, false);
          if (m) ags.push({ s, a, m, txt, onTxt: !!match(txt, terms, true) });
        }
      }
      ses.sort((a, b) => b.score - a.score); steps.sort((a, b) => b.score - a.score);
      return { ses, steps, ags, terms };
    }

    function renderResults(q) {
      const r = search(q); nav = []; let html = "", k = 0;
      const I = () => Math.min(k, 12);
      if (r.ses.length) {
        html += `<div class="grp"><span>Sessions</span><span>${r.ses.length}</span></div>`;
        html += r.ses.slice(0, 6).map(({ s, m1, m2, m }) => { nav.push({ sid: s.id }); const i = k++;
          return `<button class="it in" style="--i:${I()};--h:${s.hue}" data-nav="${i}"><span class="av">${A.esc(s.initials)}</span>
            <span style="min-width:0"><div class="t">${m1 ? hl(A, s.label, m1.ranges) : A.esc(s.label)}</div>
            <div class="s">${m2 ? hl(A, s.projName, m2.ranges) : A.esc(s.projName)} · ${s.nodes.length} ${s.nodes.length === 1 ? "Schritt" : "Schritte"}${m.f === "about" ? " · im ersten Auftrag" : ""}</div></span>
            <span class="r">${A.esc(A.rel(s.end))}<kbd class="go">↵</kbd></span></button>`; }).join("");
      }
      if (r.steps.length) {
        html += `<div class="grp"><span>Schritte</span><span>${r.steps.length}${r.steps.length > 8 ? " · Top 8" : ""}</span></div>`;
        html += r.steps.slice(0, 8).map(({ s, n, m }) => { nav.push({ sid: s.id, step: n.id }); const i = k++; const no = s.path.findIndex((x) => x.id === n.id);
          return `<button class="it in" style="--i:${I()};--h:${s.hue}" data-nav="${i}"><span class="av st">${no >= 0 ? no + 1 : A.ic("branch")}</span>
            <span style="min-width:0"><div class="sn">${snippet(A, n.text, m.ranges)}</div><div class="s">${A.esc(s.label)}</div></span>
            <span class="r">${A.esc(A.day(n.ts))}<kbd class="go">↵</kbd></span></button>`; }).join("");
      }
      if (r.ags.length) {
        html += `<div class="grp"><span>Agents</span><span>${r.ags.length}</span></div>`;
        html += r.ags.slice(0, 5).map(({ s, a, m, txt, onTxt }) => { nav.push({ sid: s.id, step: a.node }); const i = k++;
          return `<button class="it in" style="--i:${I()}" data-nav="${i}"><span class="av ag">${A.ic("bot")}</span>
            <span style="min-width:0"><div class="t">${onTxt ? hl(A, txt, m.ranges) : A.esc(txt)}</div><div class="s">${onTxt ? "" : "im Auftrag gefunden · "}${A.esc(s.label)}</div></span>
            <span class="r">${A.fmtTok(a.tokens)} Tok.<kbd class="go">↵</kbd></span></button>`; }).join("");
      }
      res.innerHTML = html || `<div class="none">Nichts gefunden für „${A.esc(q)}“.<br><span class="cap">Versuch ein anderes Wort oder einen Projektnamen.</span></div>`;
      ct.textContent = `${r.ses.length} Sessions · ${r.steps.length} Schritte · ${r.ags.length} Agents`;
      hits = new Set([...r.ses.map((x) => x.s.id), ...r.steps.map((x) => x.s.id), ...r.ags.map((x) => x.s.id)]);
      setSel(0);
    }
    const update = () => { query = input.value.trim(); query ? renderResults(query) : renderEmpty(); retarget(); };
    input.addEventListener("input", update);

    const openNav = (i) => { const n = nav[i]; if (n) A.open(n.sid, n.step); };
    res.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-chip]"); if (chip) { input.value = chip.dataset.chip; update(); input.focus(); return; }
      const it = e.target.closest("[data-nav]"); if (it) openNav(+it.dataset.nav);
    });
    res.addEventListener("mousemove", (e) => { const it = e.target.closest("[data-nav]"); if (it && +it.dataset.nav !== sel) setSel(+it.dataset.nav); });

    const onKey = (e) => {
      if (document.getElementById("drawer")?.classList.contains("open") && e.target !== input) return;
      const grid = !query; // cards are a 2 or 3 column grid
      const cols = grid ? getComputedStyle(res.querySelector(".cards")).gridTemplateColumns.split(" ").length : 1;
      if (e.key === "ArrowDown") { e.preventDefault(); setSel(sel + cols, true); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel(sel - cols, true); }
      else if (grid && e.key === "ArrowRight" && e.target !== input) { e.preventDefault(); setSel(sel + 1); }
      else if (grid && e.key === "ArrowLeft" && e.target !== input) { e.preventDefault(); setSel(sel - 1); }
      else if (e.key === "Enter" && (e.target === input || e.target === document.body)) { e.preventDefault(); openNav(sel); }
      else if (e.key === "Escape" && e.target === input && input.value) { input.value = ""; update(); setTimeout(() => input.focus(), 0); }
      else if (e.target !== input && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) input.focus();
    };
    document.addEventListener("keydown", onKey);
    A.onCleanup(() => document.removeEventListener("keydown", onKey));

    // ---------- Background graph with spring physics ----------
    const ctx = cv.getContext("2d"); let W = 0, H = 0, dpr = 1;
    const projIdx = new Map(D.projects.map((p, i) => [p.path, i]));
    const nodes = S.map((s, i) => ({ s, x: 0, y: 0, vx: 0, vy: 0, hx: 0, hy: 0, tx: 0, ty: 0, r: 2.2 + Math.sqrt(s.nodes.length) * .55, ph: i * 1.7, glow: 0 }));
    const edges = [];
    for (const p of D.projects) for (let i = 1; i < p.sessions.length; i++) edges.push([S.indexOf(p.sessions[i - 1]), S.indexOf(p.sessions[i]), 1]);
    for (let i = 1; i < S.length; i++) edges.push([i - 1, i, 0]);
    function layout() {
      const r = cv.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const np = D.projects.length;
      nodes.forEach((n, i) => {
        const pi = projIdx.get(n.s.project), a = (pi / np) * Math.PI * 2 - Math.PI / 2, k = n.s.id.charCodeAt(0) + n.s.id.charCodeAt(1) * 7 + i;
        const rr = 0.36 + ((k % 13) / 13) * 0.12, ja = ((k % 7) - 3) * 0.06;
        n.hx = W / 2 + Math.cos(a + ja) * W * rr; n.hy = H / 2 + Math.sin(a + ja) * H * (rr + .02);
        if (!n.x) { n.x = W / 2 + (n.hx - W / 2) * 1.3; n.y = H / 2 + (n.hy - H / 2) * 1.3; }
      });
      retarget();
    }
    function retarget() {
      const list = nodes.filter((n) => hits.has(n.s.id)); const m = list.length;
      nodes.forEach((n) => { n.tx = n.hx; n.ty = n.hy; n.on = false; });
      list.forEach((n, i) => { const a = (i / Math.max(1, m)) * Math.PI * 2 - Math.PI / 2; const rx = Math.min(W * .34, 470), ry = Math.min(H * .3, 290);
        n.tx = W / 2 + Math.cos(a) * rx; n.ty = H * .45 + Math.sin(a) * ry; n.on = true; });
      if (reduced()) { nodes.forEach((n) => { n.x = n.tx; n.y = n.ty; }); draw(0); }
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H); const q = !!query;
      for (const [a, b, same] of edges) {
        const A1 = nodes[a], B1 = nodes[b], on = A1.on && B1.on;
        ctx.strokeStyle = on ? "rgba(180,160,255,.35)" : `rgba(255,255,255,${(same ? .07 : .035) * (q ? .6 : 1)})`;
        ctx.lineWidth = on ? 1.2 : 1; ctx.beginPath(); ctx.moveTo(A1.x, A1.y);
        const mx = (A1.x + B1.x) / 2, my = (A1.y + B1.y) / 2; ctx.quadraticCurveTo(mx + (H / 2 - my) * .15, my + (mx - W / 2) * .15, B1.x, B1.y); ctx.stroke();
      }
      for (const n of nodes) {
        const c = `hsl(${n.s.hue} 80% ${n.on ? 70 : 62}%)`;
        ctx.globalAlpha = q ? (n.on ? 1 : .22) : .75;
        if (n.on || n.s.live) { ctx.shadowColor = c; ctx.shadowBlur = 18; } else ctx.shadowBlur = 0;
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (n.on ? 1.5 : 1), 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }
    let raf = 0, last = performance.now();
    function loop(now) {
      const dt = Math.min(2, (now - last) / 16.67); last = now;
      for (const n of nodes) {
        const wob = n.on ? 0 : 6;
        const tx = n.tx + Math.sin(now / 2600 + n.ph) * wob, ty = n.ty + Math.cos(now / 3100 + n.ph) * wob;
        n.vx += (tx - n.x) * .012 * dt; n.vy += (ty - n.y) * .012 * dt; n.vx *= Math.pow(.88, dt); n.vy *= Math.pow(.88, dt);
        n.x += n.vx * dt; n.y += n.vy * dt;
      }
      draw(now); raf = requestAnimationFrame(loop);
    }
    layout();
    if (reduced()) { nodes.forEach((n) => { n.x = n.tx; n.y = n.ty; }); draw(0); } else raf = requestAnimationFrame(loop);
    const onResize = () => layout(); addEventListener("resize", onResize);
    A.onCleanup(() => { cancelAnimationFrame(raf); removeEventListener("resize", onResize); });

    renderEmpty(); retarget();
    setTimeout(() => input.focus(), 50);
  }

  Atlas.register({ key: "spotlight", name: "Spotlight", tagline: "Suchen zuerst, wie Raycast", css, render, wantsArrows: true,
    onSelect(id) { document.getElementById("stage")?.classList.toggle("dw", !!id); } });
})();
