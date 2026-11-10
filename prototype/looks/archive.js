// Look: Holo-Archiv. A sci-fi archive hall: one glowing shelf rack per project, sessions as hologram crystals,
// a projector at the bottom that plays back the hovered session.
(function () {
  const css = `
.lk-archive { overflow: hidden; user-select: none; color: #d9f6ff;
  --cy: 190; --holo: hsl(192 100% 70%); --holo-2: hsl(200 100% 62%);
  background:
    radial-gradient(1100px 520px at 60% 108%, rgba(40,160,255,.22), transparent 62%),
    radial-gradient(900px 600px at 62% -12%, rgba(30,90,200,.28), transparent 60%),
    radial-gradient(500px 900px at 100% 50%, rgba(0,180,255,.07), transparent 70%),
    linear-gradient(180deg, #030713 0%, #050b1c 55%, #02040b 100%); }
.lk-archive canvas.ar-dust { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

/* ---------- Hall (3D) ---------- */
.lk-archive .ar-hall { position: absolute; left: 304px; right: var(--rr, 0px); top: 0; bottom: 0; perspective: 1100px; perspective-origin: 50% 16%; z-index: 2; }
.lk-archive .ar-shelves { position: absolute; inset: 0; transform-style: preserve-3d; }
.lk-archive .ar-hall::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 120px; z-index: 60; pointer-events: none; background: linear-gradient(180deg, #030713 20%, transparent); }
.lk-archive .ar-floor { position: absolute; left: -60%; right: -60%; bottom: 0; height: 2600px; transform-origin: 50% 100%; transform: rotateX(86deg); pointer-events: none;
  background:
    repeating-linear-gradient(90deg, rgba(90,200,255,.16) 0 1px, transparent 1px 90px),
    repeating-linear-gradient(0deg, rgba(90,200,255,.12) 0 1px, transparent 1px 90px),
    radial-gradient(closest-side at 50% 100%, rgba(60,170,255,.25), transparent);
  -webkit-mask-image: linear-gradient(0deg, #000 10%, transparent 85%); mask-image: linear-gradient(0deg, #000 10%, transparent 85%); }
.lk-archive .ar-wall { position: absolute; top: -20%; bottom: -20%; width: 2400px; pointer-events: none;
  background: repeating-linear-gradient(90deg, rgba(80,190,255,.10) 0 2px, transparent 2px 160px), linear-gradient(90deg, rgba(10,30,60,.5), transparent);
  -webkit-mask-image: linear-gradient(90deg, #000, transparent 80%); mask-image: linear-gradient(90deg, #000, transparent 80%); }
.lk-archive .ar-wall.l { left: 0; transform-origin: 0 50%; transform: rotateY(84deg); }
.lk-archive .ar-wall.r { right: 0; transform-origin: 100% 50%; transform: rotateY(-84deg); -webkit-mask-image: linear-gradient(-90deg, #000, transparent 80%); mask-image: linear-gradient(-90deg, #000, transparent 80%);
  background: repeating-linear-gradient(90deg, rgba(80,190,255,.10) 0 2px, transparent 2px 160px), linear-gradient(-90deg, rgba(10,30,60,.5), transparent); }

/* Shelf rack: one per project */
.lk-archive .ar-shelf { position: absolute; left: 50%; bottom: var(--shelfB, 330px); width: var(--shelfW, 900px); margin-left: calc(var(--shelfW, 900px) / -2);
  padding: 34px 18px 10px; border-radius: 16px 16px 6px 6px; transform-origin: 50% 100%;
  background: linear-gradient(180deg, rgba(8,22,44,.92), rgba(4,12,26,.96));
  border: 1px solid rgba(110,210,255,.22); box-shadow: 0 0 0 1px rgba(0,0,0,.4), 0 30px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(160,230,255,.12);
  transition: transform 1s var(--spring), opacity .6s ease, filter .6s ease; cursor: pointer; }
.lk-archive .ar-shelf.front { cursor: default; border-color: rgba(120,220,255,.45); box-shadow: 0 0 0 1px rgba(0,0,0,.4), 0 40px 80px rgba(0,0,0,.6), 0 0 60px rgba(40,170,255,.18), inset 0 1px 0 rgba(160,230,255,.2); }
.lk-archive .ar-shelf::before { content: ""; position: absolute; left: 14px; right: 14px; top: 0; height: 2px; border-radius: 2px;
  background: linear-gradient(90deg, transparent, hsl(var(--h) 90% 66%), transparent); opacity: .85; }
.lk-archive .ar-sl-label { position: absolute; left: 18px; right: 18px; top: 9px; display: flex; align-items: center; gap: 10px; font: 700 11px var(--mono); letter-spacing: .14em; text-transform: uppercase; color: rgba(190,235,255,.75); }
.lk-archive .ar-sl-label .nm { color: #eafaff; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 50%; }
.lk-archive .ar-sl-label .sw { width: 9px; height: 9px; border-radius: 2px; background: hsl(var(--h) 80% 62%); box-shadow: 0 0 10px hsl(var(--h) 80% 62%); flex: none; transform: rotate(45deg); }
.lk-archive .ar-sl-label .r { margin-left: auto; letter-spacing: .06em; text-transform: none; font-weight: 600; color: rgba(160,215,240,.6); white-space: nowrap; }
.lk-archive .ar-tier { position: relative; display: flex; gap: 12px; justify-content: center; padding: 6px 4px 14px; }
.lk-archive .ar-tier::after { content: ""; position: absolute; left: -8px; right: -8px; bottom: 2px; height: 5px; border-radius: 3px;
  background: linear-gradient(90deg, rgba(60,170,255,.1), rgba(120,225,255,.85), rgba(60,170,255,.1));
  box-shadow: 0 0 18px rgba(80,200,255,.55), 0 6px 26px rgba(80,200,255,.25); }

/* Hologram crystal */
.lk-archive .ar-cry { position: relative; width: var(--cryW, 150px); height: var(--cryH, 118px); flex: none; text-align: left; padding: 10px 11px 9px; display: flex; flex-direction: column; gap: 3px;
  color: #c9f4ff; background: linear-gradient(180deg, rgba(90,210,255,.22), rgba(40,130,255,.08) 70%, rgba(90,210,255,.16));
  clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
  text-shadow: 0 0 8px rgba(80,210,255,.55);
  animation: arFlick 7s steps(1) infinite; animation-delay: var(--fd, 0s);
  transition: transform .5s var(--spring), background .25s ease, filter .25s ease; }
.lk-archive .ar-cry::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(170,240,255,.09) 0 1px, transparent 1px 3px); animation: arScan 4s linear infinite; }
.lk-archive .ar-cry::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  clip-path: inherit; box-shadow: inset 0 0 0 1px rgba(140,230,255,.55), inset 0 0 22px rgba(80,200,255,.25); }
.lk-archive .ar-cry .k { font: 700 9.5px var(--mono); letter-spacing: .14em; text-transform: uppercase; color: rgba(160,225,255,.7); display: flex; gap: 6px; align-items: center; }
.lk-archive .ar-cry .k .dot { width: 6px; height: 6px; }
.lk-archive .ar-cry .t { font: 700 13px/1.25 var(--sans); hyphens: auto; overflow-wrap: break-word; color: #effcff; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; letter-spacing: -.005em; }
.lk-archive .ar-cry .m { margin-top: auto; font: 600 10.5px var(--mono); color: rgba(170,225,250,.75); display: flex; justify-content: space-between; gap: 6px; white-space: nowrap; }
.lk-archive .ar-cry .m b { color: #8ff0ff; }
.lk-archive .ar-shelf.front .ar-cry:hover, .lk-archive .ar-cry.hot, .lk-archive .ar-cry.on { transform: translateY(-8px) scale(1.04); filter: brightness(1.25);
  background: linear-gradient(180deg, rgba(120,225,255,.34), rgba(40,150,255,.14) 70%, rgba(120,225,255,.26)); }
.lk-archive .ar-cry:hover .t, .lk-archive .ar-cry.hot .t { text-shadow: -1px 0 rgba(255,80,150,.55), 1px 0 rgba(60,240,255,.7), 0 0 10px rgba(80,210,255,.6); }
.lk-archive .ar-cry.on { box-shadow: none; filter: brightness(1.35); }
.lk-archive .ar-cry.on::after { box-shadow: inset 0 0 0 2px #9ff3ff, inset 0 0 30px rgba(120,230,255,.45); }
.lk-archive .ar-cry.more { align-items: center; justify-content: center; text-align: center; font: 700 12px var(--mono); color: #9ff3ff; }
.lk-archive .ar-shelf:not(.front) .ar-cry { pointer-events: none; }
@keyframes arFlick { 0%, 100% { opacity: 1; } 91% { opacity: .78; } 92% { opacity: 1; } 95% { opacity: .9; } 96% { opacity: 1; } }
@keyframes arScan { to { background-position: 0 30px; } }

/* ---------- Header in hall ---------- */
.lk-archive .ar-head { position: absolute; left: 340px; right: calc(40px + var(--rr, 0px)); top: 22px; z-index: 5; display: flex; align-items: flex-start; gap: 18px; pointer-events: none; }
.lk-archive .ar-head .k { font: 700 10.5px var(--mono); letter-spacing: .3em; color: rgba(140,215,255,.6); text-transform: uppercase; }
.lk-archive .ar-head h1 { margin: 4px 0 0; font: 900 22px var(--display); letter-spacing: .16em; color: #e6fbff; text-shadow: 0 0 18px rgba(80,200,255,.6); }
.lk-archive .ar-head .k, .lk-archive .ar-head h1 { white-space: nowrap; }
.lk-archive.ar-open .ar-head .hint { display: none; }
.lk-archive .ar-head .hint { margin-left: auto; display: flex; gap: 8px; align-items: center; font: 600 11.5px var(--mono); color: rgba(170,220,245,.7); }
.lk-archive .ar-head kbd { font: 700 11px var(--mono); padding: 2px 7px; border-radius: 6px; border: 1px solid rgba(120,210,255,.35); background: rgba(40,120,200,.15); color: #bff1ff; }

/* ---------- Left glass index ---------- */
.lk-archive .ar-index { position: absolute; z-index: 6; left: 18px; top: 18px; bottom: 82px; width: 272px; display: flex; flex-direction: column; border-radius: 20px; overflow: hidden;
  background: linear-gradient(180deg, rgba(20,50,90,.38), rgba(8,20,40,.5)); border: 1px solid rgba(120,210,255,.2);
  backdrop-filter: blur(20px) saturate(150%); -webkit-backdrop-filter: blur(20px) saturate(150%); box-shadow: 0 20px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(170,230,255,.12); }
.lk-archive .ar-ih { padding: 16px 16px 12px; border-bottom: 1px solid rgba(120,210,255,.14); }
.lk-archive .ar-ih .k { font: 700 10px var(--mono); letter-spacing: .26em; color: rgba(140,215,255,.6); text-transform: uppercase; }
.lk-archive .ar-ih .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 10px; }
.lk-archive .ar-ih .stats div { padding: 7px 8px; border-radius: 10px; background: rgba(0,20,40,.35); border: 1px solid rgba(120,210,255,.12); }
.lk-archive .ar-ih .stats b { display: block; font: 800 17px var(--mono); color: #dff8ff; }
.lk-archive .ar-ih .stats span { font: 600 10px var(--mono); color: rgba(160,210,235,.65); text-transform: uppercase; letter-spacing: .08em; }
.lk-archive .ar-list { flex: 1; padding: 8px; display: flex; flex-direction: column; gap: 2px; }
.lk-archive .ar-pi { position: relative; display: grid; grid-template-columns: 4px 1fr auto; gap: 10px; align-items: center; padding: 8px 10px 8px 8px; border-radius: 12px; text-align: left;
  transition: background .2s, transform .45s var(--spring); }
.lk-archive .ar-pi .bar { width: 4px; height: 26px; border-radius: 3px; background: hsl(var(--h) 80% 62%); opacity: .55; transition: opacity .2s, box-shadow .2s; }
.lk-archive .ar-pi .nm { display: block; font-weight: 700; font-size: 13.5px; color: #e4f6ff; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.lk-archive .ar-pi .sub { display: block; font: 600 10.5px var(--mono); color: rgba(160,210,235,.6); }
.lk-archive .ar-pi .n { font: 800 12px var(--mono); color: rgba(170,230,255,.8); padding: 2px 8px; border-radius: 999px; background: rgba(60,160,255,.12); border: 1px solid rgba(120,210,255,.18); }
.lk-archive .ar-pi:hover { background: rgba(90,190,255,.08); }
.lk-archive .ar-pi.on { background: linear-gradient(90deg, rgba(80,190,255,.2), rgba(80,190,255,.04)); transform: translateX(4px); }
.lk-archive .ar-pi.on .bar { opacity: 1; box-shadow: 0 0 12px hsl(var(--h) 80% 62%); }
.lk-archive .ar-pi.on .nm { color: #fff; }

/* ---------- Projector ---------- */
.lk-archive .ar-proj { position: absolute; z-index: 4; left: calc(304px + (100% - 304px - var(--rr, 0px)) / 2); bottom: 70px; width: var(--projW, 400px); margin-left: calc(var(--projW, 400px) / -2); height: calc(var(--projH, 190px) + 70px); pointer-events: none; perspective: 900px; }
.lk-archive .ar-beam { position: absolute; left: 4%; right: 4%; bottom: 14px; top: calc(var(--projH, 190px) - 4px); clip-path: polygon(0 0, 100% 0, 57% 100%, 43% 100%);
  background: linear-gradient(0deg, rgba(120,225,255,.42), rgba(80,190,255,.06) 80%, transparent); filter: blur(.5px); animation: arBeam 3s ease-in-out infinite; }
@keyframes arBeam { 50% { opacity: .7; } }
.lk-archive .ar-emit { position: absolute; left: 50%; bottom: 0; width: 120px; height: 28px; margin-left: -60px; border-radius: 50%;
  background: radial-gradient(closest-side, #dffaff, rgba(90,210,255,.8) 40%, rgba(40,120,255,.2) 75%, transparent); box-shadow: 0 0 40px rgba(80,200,255,.6); }
.lk-archive .ar-emit::after { content: ""; position: absolute; inset: -6px -30px; border-radius: 50%; border: 1px solid rgba(140,230,255,.4); }
.lk-archive .ar-holo { position: absolute; left: 0; right: 0; top: 0; height: var(--projH, 190px); pointer-events: auto; cursor: pointer; padding: 14px 18px 12px; display: flex; flex-direction: column; gap: 4px;
  color: #d4f7ff; background: linear-gradient(180deg, rgba(70,190,255,.2), rgba(30,120,255,.1)); border: 1px solid rgba(140,230,255,.55); border-radius: 6px;
  box-shadow: 0 0 40px rgba(60,180,255,.25), inset 0 0 30px rgba(80,200,255,.18); text-shadow: 0 0 8px rgba(80,210,255,.6);
  transform-style: preserve-3d; animation: arSpin 9s ease-in-out infinite, arFlick 5s steps(1) infinite; overflow: hidden; }
.lk-archive .ar-holo::before { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(170,240,255,.1) 0 1px, transparent 1px 3px); animation: arScan 3s linear infinite; }
.lk-archive .ar-holo::after { content: ""; position: absolute; left: 0; right: 0; height: 40%; top: -40%; pointer-events: none; background: linear-gradient(180deg, transparent, rgba(170,240,255,.12), transparent); animation: arSweep 3.2s linear infinite; }
@keyframes arSweep { to { top: 100%; } }
@keyframes arSpin { 0%, 100% { transform: rotateY(-9deg) rotateX(4deg); } 50% { transform: rotateY(9deg) rotateX(4deg); } }
.lk-archive .ar-holo.swap { animation: arSwap .55s var(--spring), arFlick 5s steps(1) infinite; }
@keyframes arSwap { from { transform: rotateY(80deg) scale(.9); opacity: 0; } }
.lk-archive .ar-holo .k { font: 700 9.5px var(--mono); letter-spacing: .2em; text-transform: uppercase; color: rgba(160,225,255,.75); display: flex; gap: 8px; align-items: center; }
.lk-archive .ar-holo .k .r { margin-left: auto; letter-spacing: .04em; text-transform: none; }
.lk-archive .ar-holo h3 { margin: 0; font: 800 16px/1.2 var(--sans); color: #f0fcff; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.lk-archive .ar-holo .ty { flex: 1; min-height: 0; overflow: hidden; font: 500 12px/1.45 var(--mono); color: rgba(200,240,255,.88); }
.lk-archive .ar-holo .ty::before { content: "> "; color: #7ff0ff; }
.lk-archive .ar-holo .ty i { display: inline-block; width: 7px; height: 13px; margin-left: 2px; vertical-align: -2px; background: #8ff3ff; animation: blink .9s steps(1) infinite; }
.lk-archive .ar-holo .ab { font: 500 11.5px/1.4 var(--sans); color: rgba(170,220,245,.6); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-shadow: none; }
.lk-archive .ar-holo .f { display: flex; gap: 10px; font: 600 10.5px var(--mono); color: rgba(170,225,250,.8); white-space: nowrap; }
.lk-archive .ar-holo .f b { color: #9ff3ff; }

@media (max-width: 1100px) {
  .lk-archive .ar-index { width: 220px; }
  .lk-archive .ar-hall { left: 250px; }
  .lk-archive .ar-head { left: 280px; }
  .lk-archive .ar-proj { left: calc(250px + (100% - 250px - var(--rr, 0px)) / 2); }
  .lk-archive .ar-head .hint span.long { display: none; }
  .lk-archive .ar-ih .stats b { font-size: 14px; }
  .lk-archive .ar-ih .stats span { font-size: 8.5px; letter-spacing: .04em; }
}
@media (prefers-reduced-motion: reduce) {
  .lk-archive .ar-cry, .lk-archive .ar-cry::before, .lk-archive .ar-holo, .lk-archive .ar-holo::before, .lk-archive .ar-holo::after, .lk-archive .ar-beam { animation: none !important; }
}
`;

  function render(root, A) {
    const D = A.DATA, esc = A.esc;
    const P = D.projects;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let sel = 0, hover = null, pageOf = {}, typeT = null, wheelAcc = 0, wheelLock = 0, onId = null;

    root.innerHTML = `
      <canvas class="ar-dust"></canvas>
      <div class="ar-hall"><div class="ar-floor"></div><div class="ar-wall l"></div><div class="ar-wall r"></div><div class="ar-shelves"></div></div>
      <div class="ar-head"><div><div class="k">Sektor 7 · Sitzungsarchiv</div><h1>HOLO-ARCHIV</h1></div>
        <div class="hint"><kbd>↑</kbd><kbd>↓</kbd><span class="long">oder Mausrad: Regal wechseln</span> · <span class="long">Kristall anklicken: öffnen</span></div></div>
      <aside class="ar-index">
        <div class="ar-ih"><div class="k">Archiv-Index</div>
          <div class="stats"><div><b>${D.totals.sessions}</b><span>Sessions</span></div><div><b>${P.length}</b><span>Regale</span></div><div><b>${D.totals.steps}</b><span>Schritte</span></div></div></div>
        <div class="ar-list scroll">${P.map((p, i) => `<button class="ar-pi" data-pi="${i}" style="--h:${p.hue}"><span class="bar"></span>
          <span style="min-width:0"><span class="nm">${esc(p.name)}</span><span class="sub">${esc(A.rel(p.last))}</span></span><span class="n">${p.sessions.length}</span></button>`).join("")}</div>
      </aside>
      <div class="ar-proj"><div class="ar-beam"></div><div class="ar-emit"></div><div class="ar-holo"></div></div>`;

    const hall = root.querySelector(".ar-hall"), shelvesEl = root.querySelector(".ar-shelves"), holo = root.querySelector(".ar-holo");
    const listBtns = [...root.querySelectorAll(".ar-pi")];
    let shelfEls = [];

    // ---------- Layout: size crystals and shelves to the hall ----------
    function build() {
      const W = hall.clientWidth, H = hall.clientHeight;
      const small = H < 780;
      const projH = small ? 138 : 178, projW = Math.min(small ? 360 : 420, W - 40);
      root.style.setProperty("--projH", projH + "px"); root.style.setProperty("--projW", projW + "px");
      const shelfB = 70 + projH + 70 + 18;
      const shelfW = Math.min(W - 60, 1060);
      const avail = H - shelfB - 150; // room above for header and receding racks
      const maxN = Math.max(...P.map((p) => p.sessions.length));
      const gap = 12, inner = shelfW - 36 - 8;
      // Fit everything into at most two tiers; shrink crystals down to a readable minimum
      const fit = (w) => Math.max(1, Math.floor((inner + gap) / (w + gap)));
      let cols = Math.min(6, fit(118));
      if (Math.ceil(maxN / cols) > 2) cols = Math.max(cols, Math.min(Math.ceil(maxN / 2), fit(104)));
      const cryW = Math.min(158, Math.floor((inner - gap * (cols - 1)) / cols));
      const tiersMax = Math.min(2, Math.ceil(maxN / cols));
      const cryH = Math.max(86, Math.min(122, Math.floor((avail - 44) / tiersMax) - 22));
      root.style.setProperty("--shelfB", shelfB + "px"); root.style.setProperty("--shelfW", shelfW + "px");
      root.style.setProperty("--cryW", cryW + "px"); root.style.setProperty("--cryH", cryH + "px");
      const cap = cols * 2;
      shelvesEl.innerHTML = P.map((p, i) => {
        const ss = p.sessions; const per = cap - 1, pages = ss.length > cap ? Math.ceil(ss.length / per) : 1;
        const pg = (pageOf[i] || 0) % pages, off = pages > 1 ? pg * per : 0;
        const show = pages > 1 ? ss.slice(off, off + per) : ss;
        const cells = show.map((s, jj) => { const j = jj + off; return `<button class="ar-cry" data-sid="${esc(s.id)}" data-open="${esc(s.id)}" style="--fd:${(-(j * 1.7 + i * 2.3) % 7).toFixed(2)}s">
            <span class="k">${s.live ? `<span class="dot live"></span>live` : `#${String(j + 1).padStart(2, "0")}`}<span style="margin-left:auto">${esc(A.relShort(s.end))}</span></span>
            <span class="t">${esc(s.label)}</span>
            <span class="m"><span><b>${s.nodes.length}</b> Schr.</span><span>${esc(A.hhmm(s.end))}</span></span></button>`; });
        if (pages > 1) cells.push(`<button class="ar-cry more" data-more="${i}">${pg + 1 < pages ? `+${ss.length - off - show.length} weitere` : "zum Anfang"}<br><small>Seite ${pg + 1}/${pages}</small></button>`);
        const tiers = []; for (let k = 0; k < cells.length; k += cols) tiers.push(cells.slice(k, k + cols));
        const used = Math.min(cols, cells.length), wI = Math.max(Math.min(560, shelfW), Math.min(shelfW, used * (cryW + gap) + 60));
        return `<div class="ar-shelf" data-shelf="${i}" style="--h:${p.hue};width:${wI}px;margin-left:${-wI / 2}px">
          <div class="ar-sl-label"><span class="sw"></span><span class="nm">${esc(p.name)}</span><span>${ss.length} ${ss.length === 1 ? "Kristall" : "Kristalle"}</span><span class="r">zuletzt ${esc(A.rel(p.last))}</span></div>
          ${tiers.map((t) => `<div class="ar-tier">${t.join("")}</div>`).join("")}</div>`;
      }).join("");
      shelfEls = [...shelvesEl.querySelectorAll(".ar-shelf")];
      place(true);
      if (onId) root.querySelector(`.ar-cry[data-sid="${CSS.escape(onId)}"]`)?.classList.add("on");
    }

    // ---------- Depth placement: selected rack in front, others recede ----------
    function place(instant) {
      shelfEls.forEach((el, i) => {
        const d = i - sel;
        if (instant) el.style.transition = "none";
        el.classList.toggle("front", d === 0);
        if (d < 0) { el.style.transform = `translate3d(0, 260px, 520px)`; el.style.opacity = 0; el.style.pointerEvents = "none"; el.style.zIndex = 50; }
        else {
          el.style.transform = `translate3d(0, ${-d * 128}px, ${-d * 460}px)`;
          el.style.opacity = d > 3 ? 0 : d === 0 ? 1 : Math.max(0, .8 - d * .15);
          el.style.filter = d === 0 ? "none" : `brightness(${Math.max(.35, .75 - d * .1)}) saturate(.8)`;
          el.style.pointerEvents = d > 3 ? "none" : "auto"; el.style.zIndex = 40 - d;
        }
        if (instant) { el.offsetWidth; el.style.transition = ""; }
      });
      listBtns.forEach((b, i) => b.classList.toggle("on", i === sel));
      listBtns[sel]?.scrollIntoView({ block: "nearest" });
    }
    function select(i) {
      i = Math.max(0, Math.min(P.length - 1, i)); if (i === sel) return;
      sel = i; place(false); project(null);
    }

    // ---------- Projector: hovered (or newest) session as rotating holo card ----------
    function project(s) {
      s = s || P[sel].sessions[0];
      if (holo.dataset.sid === s.id) return;
      holo.dataset.sid = s.id; holo.setAttribute("data-open", s.id);
      root.querySelectorAll(".ar-cry.hot").forEach((c) => c.classList.remove("hot"));
      root.querySelector(`.ar-shelf.front .ar-cry[data-sid="${CSS.escape(s.id)}"]`)?.classList.add("hot");
      holo.classList.remove("swap"); holo.offsetWidth; if (!reduce) holo.classList.add("swap");
      const txt = (s.last?.text || "").replace(/\s+/g, " ").trim().slice(0, 240);
      holo.innerHTML = `<div class="k"><span>Projektion · ${esc(s.projName)}</span><span class="r">${esc(A.rel(s.end))}</span></div>
        <h3>${esc(s.label)}</h3><div class="ty"><span class="tt"></span><i></i></div>${s.about && s.nodes.length > 1 ? `<div class="ab">Begonnen mit: ${esc(s.about)}</div>` : ""}
        <div class="f"><span><b>${s.nodes.length}</b> Schritte</span>${s.agents.length ? `<span><b>${s.agents.length}</b> Agents</span>` : ""}<span>${esc(s.modelList.map((m) => A.modelInfo(m).name).slice(0, 2).join(" · ") || "-")}</span><span style="margin-left:auto">Klick: öffnen</span></div>`;
      const tt = holo.querySelector(".tt");
      clearInterval(typeT);
      if (reduce) { tt.textContent = txt; return; }
      let k = 0; typeT = setInterval(() => { k += 2; tt.textContent = txt.slice(0, k); if (k >= txt.length) clearInterval(typeT); }, 16);
    }

    // ---------- Input ----------
    root.addEventListener("click", (e) => {
      const mo = e.target.closest("[data-more]"); if (mo) { const i = +mo.dataset.more; pageOf[i] = (pageOf[i] || 0) + 1; build(); return; }
      const pi = e.target.closest("[data-pi]"); if (pi) { select(+pi.dataset.pi); return; }
      const sh = e.target.closest(".ar-shelf:not(.front)"); if (sh) select(+sh.dataset.shelf);
    });
    root.addEventListener("mouseover", (e) => {
      const c = e.target.closest(".ar-shelf.front .ar-cry[data-sid]"); if (!c || c === hover) return;
      hover = c; project(D.sessions.find((s) => s.id === c.dataset.sid));
    });
    root.addEventListener("mouseout", (e) => { const c = e.target.closest(".ar-cry[data-sid]"); if (c && !c.contains(e.relatedTarget)) hover = null; });
    const onWheel = (e) => {
      if (e.target.closest(".ar-list")) return;
      e.preventDefault(); const now = performance.now();
      wheelAcc += e.deltaY; if (now < wheelLock) return;
      if (Math.abs(wheelAcc) > 40) { select(sel + Math.sign(wheelAcc)); wheelAcc = 0; wheelLock = now + 380; }
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    const onKey = (e) => {
      if (e.target.matches?.("input,textarea,[contenteditable]")) return;
      if (e.key === "ArrowDown") { e.preventDefault(); select(sel + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); select(sel - 1); }
      else if (e.key === "Enter" && holo.dataset.sid) A.open(holo.dataset.sid);
    };
    document.addEventListener("keydown", onKey);

    // ---------- Parallax + dust (one loop) ----------
    const cv = root.querySelector("canvas.ar-dust"), ctx = cv.getContext("2d");
    let cw = 0, ch = 0, dpr = 1, mx = 0, my = 0, tx = 0, ty = 0, raf = 0, last = performance.now();
    const motes = Array.from({ length: 110 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .3, s: Math.random() * .012 + .004, p: Math.random() * 6.28 }));
    function size() {
      dpr = Math.min(2, devicePixelRatio || 1); cw = root.clientWidth; ch = root.clientHeight;
      cv.width = cw * dpr; cv.height = ch * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(dt) {
      ctx.clearRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = "lighter";
      const px = cw * .55, py = ch - 92;
      for (const m of motes) {
        m.y -= m.s * dt; m.p += dt * .8; if (m.y < -.02) { m.y = 1.02; m.x = Math.random(); }
        const x = m.x * cw + Math.sin(m.p) * 6 - mx * 14 * m.r, y = m.y * ch - my * 8 * m.r;
        const a = .15 + .25 * Math.sin(m.p * .7) ** 2;
        ctx.fillStyle = `rgba(140,220,255,${a})`; ctx.beginPath(); ctx.arc(x, y, m.r, 0, 6.283); ctx.fill();
      }
      // Projector sparkle
      const g = ctx.createRadialGradient(px, py, 0, px, py, 160);
      g.addColorStop(0, "rgba(90,200,255,.16)"); g.addColorStop(1, "rgba(90,200,255,0)");
      ctx.fillStyle = g; ctx.fillRect(px - 160, py - 160, 320, 320);
      ctx.globalCompositeOperation = "source-over";
    }
    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      mx += (tx - mx) * Math.min(1, dt * 4); my += (ty - my) * Math.min(1, dt * 4);
      hall.style.perspectiveOrigin = `${50 - mx * 8}% ${16 - my * 6}%`;
      shelvesEl.style.transform = `translate(${mx * -10}px, ${my * -6}px)`;
      draw(dt);
    }
    const onMove = (e) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; };
    const onResize = () => { size(); build(); if (reduce) draw(0); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    size(); build(); project(null);
    if (reduce) draw(0); else raf = requestAnimationFrame(tick);

    A.onCleanup(() => {
      cancelAnimationFrame(raf); clearInterval(typeT);
      window.removeEventListener("mousemove", onMove); window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    });

    // Drawer open: highlight crystal and bring its rack to the front
    api.onSelect = (id) => {
      const was = !!onId; onId = id;
      root.style.setProperty("--rr", id ? "512px" : "0px"); root.classList.toggle("ar-open", !!id);
      if (was !== !!id) build();
      root.querySelectorAll(".ar-cry.on").forEach((c) => c.classList.remove("on"));
      if (!id) return;
      const pi = P.findIndex((p) => p.sessions.some((s) => s.id === id));
      if (pi >= 0) select(pi);
      root.querySelector(`.ar-cry[data-sid="${CSS.escape(id)}"]`)?.classList.add("on");
      const s = D.sessions.find((x) => x.id === id); if (s) { holo.dataset.sid = ""; project(s); }
    };
  }

  const api = { onSelect: null };
  Atlas.register({ key: "archive", name: "Holo-Archiv", tagline: "Sessions als Hologramm-Datenkristalle", css, render, wantsArrows: false,
    onSelect(id) { api.onSelect?.(id); } });
})();
