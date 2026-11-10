// Look: Bento-Cockpit. Apple-keynote style bento grid of glass tiles.
(function () {
  const css = `
.lk-bento { overflow: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.15) transparent;
  background:
    radial-gradient(900px 600px at 8% -10%, rgba(139,108,255,.22), transparent 60%),
    radial-gradient(800px 600px at 105% 110%, rgba(45,212,191,.16), transparent 60%),
    radial-gradient(600px 400px at 70% 20%, rgba(250,189,47,.05), transparent 60%),
    #07080d; }
.lk-bento .bn-wrap { max-width: 1480px; margin: 0 auto; padding: 22px 28px 92px; min-height: 100%; display: flex; flex-direction: column; gap: 16px; }
.lk-bento .bn-top { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
.lk-bento .bn-top .k { font: 700 10.5px var(--mono); letter-spacing: .22em; text-transform: uppercase; color: var(--ink-3); }
.lk-bento .bn-top h1 { margin: 2px 0 0; font-size: 30px; font-weight: 800; letter-spacing: -.035em; line-height: 1.05; color: var(--ink); }
.lk-bento .bn-chips { margin-left: auto; display: flex; gap: 8px; flex-wrap: wrap; }
.lk-bento .bn-chip { padding: 7px 12px; border-radius: 999px; background: rgba(255,255,255,.05); border: 1px solid var(--line); font: 600 12px var(--sans); color: var(--ink-2); }
.lk-bento .bn-chip b { color: var(--ink); font-family: var(--mono); margin-right: 4px; }

.lk-bento .bn-grid { flex: 1 1 0; display: grid; gap: 14px; grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(150px, 1fr)); min-height: 660px;
  grid-template-areas: "r r r r r r l l l c c c" "r r r r r r t t t t t t" "p p p p p a a a a m m m" "p p p p p a a a a m m m"; }
@media (max-width: 1180px) {
  .lk-bento .bn-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: none; grid-auto-rows: minmax(170px, auto); min-height: 0; flex: none;
    grid-template-areas: "r r" "r r" "l c" "t t" "p p" "p p" "a m" "a m"; }
  .lk-bento .plist { max-height: 330px; }
  .lk-bento .t-a, .lk-bento .t-m { min-height: 340px; }
}
@media (max-width: 700px) {
  .lk-bento .bn-grid { grid-template-columns: minmax(0, 1fr); grid-template-areas: "r" "r" "l" "c" "t" "p" "p" "a" "a" "m" "m"; }
  .lk-bento .bn-wrap { padding: 16px 16px 92px; }
}

/* Tile */
.lk-bento .bn-t { position: relative; min-width: 0; min-height: 0; border-radius: 26px; padding: 18px 20px; overflow: hidden; display: flex; flex-direction: column;
  background: linear-gradient(160deg, rgba(255,255,255,.075), rgba(255,255,255,.02) 60%);
  border: 1px solid rgba(255,255,255,.09);
  backdrop-filter: blur(24px) saturate(150%); -webkit-backdrop-filter: blur(24px) saturate(150%);
  box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 20px 50px rgba(0,0,0,.35);
  translate: 0 0; transition: translate .6s var(--spring), box-shadow .4s ease, border-color .3s ease;
  animation: bnIn .95s var(--spring) backwards; animation-delay: calc(var(--i, 0) * 75ms + 60ms); }
.lk-bento .bn-t:hover { translate: 0 -4px; border-color: rgba(255,255,255,.17); box-shadow: 0 1px 0 rgba(255,255,255,.12) inset, 0 30px 70px rgba(0,0,0,.45); }
.lk-bento .bn-t::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .35s ease; border-radius: inherit;
  background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,.085), transparent 50%); }
.lk-bento .bn-t:hover::before { opacity: 1; }
@keyframes bnIn { from { opacity: 0; transform: translateY(26px) scale(.93); } }
.lk-bento .bn-h { display: flex; align-items: center; gap: 8px; font: 700 10.5px var(--mono); letter-spacing: .16em; text-transform: uppercase; color: var(--ink-3); flex: none; }
.lk-bento .bn-h svg.i { width: 15px; height: 15px; }
.lk-bento .bn-h .r { margin-left: auto; letter-spacing: .06em; text-transform: none; font-weight: 600; }

/* Resume tile */
.lk-bento .t-r { padding: 24px 26px; background: linear-gradient(150deg, rgba(139,108,255,.16), rgba(255,255,255,.03) 55%, rgba(45,212,191,.06)); }
.lk-bento .t-r .glow { position: absolute; width: 420px; height: 420px; right: -140px; top: -170px; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, hsl(var(--h) 80% 62% / .3), transparent 65%); filter: blur(10px); }
.lk-bento .t-r > * { flex-shrink: 0; }
.lk-bento .t-r > .about { flex-shrink: 1; min-height: 0; }
.lk-bento .t-r .meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 14px; }
.lk-bento .pill { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 999px; font: 600 12px var(--sans); background: rgba(255,255,255,.07); border: 1px solid var(--line); color: var(--ink-2); max-width: 100%; }
.lk-bento .pill .sw { width: 8px; height: 8px; border-radius: 50%; background: hsl(var(--h) 80% 62%); box-shadow: 0 0 10px hsl(var(--h) 80% 62%); }
.lk-bento .t-r h2 { margin: 10px 0 0; font-size: clamp(24px, 2.3vw, 34px); line-height: 1.08; font-weight: 800; letter-spacing: -.035em; max-width: 92%;
  overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.lk-bento .t-r .about { margin-top: 8px; color: var(--ink-2); font-size: 13.5px; max-width: 88%; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.lk-bento .trail { position: relative; margin-top: auto; padding-top: 14px; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 14px; }
.lk-bento .trail .ln { position: absolute; left: 11px; right: calc((100% - 28px) / var(--n) - 11px); top: 29px; height: 2px; border-radius: 2px; transform-origin: left;
  background: linear-gradient(90deg, rgba(139,108,255,.35), var(--violet), var(--teal)); animation: bnLine 1.1s var(--spring-soft) .45s backwards; }
.lk-bento .trail.one .ln { display: none; }
@keyframes bnLine { from { transform: scaleX(0); } }
.lk-bento .trail button { position: relative; text-align: left; display: grid; gap: 6px; min-width: 0; padding: 0; border-radius: 12px; }
.lk-bento .trail .pt { width: 24px; height: 24px; border-radius: 50%; background: #171a24; border: 2px solid rgba(139,108,255,.7); display: grid; place-items: center; font: 800 9.5px var(--mono); color: var(--ink-2);
  transition: transform .45s var(--spring), box-shadow .3s; animation: bnPop .7s var(--spring) backwards; animation-delay: calc(.55s + var(--k) * 140ms); }
@keyframes bnPop { from { transform: scale(0); } }
.lk-bento .trail .now .pt { background: var(--teal); border-color: #b9fbef; color: #04120f; box-shadow: 0 0 0 6px rgba(45,212,191,.14), 0 0 24px rgba(45,212,191,.6); }
.lk-bento .trail button:hover .pt { transform: scale(1.18); }
.lk-bento .trail .tx { font-size: 12.5px; color: var(--ink-2); line-height: 1.35; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; transition: color .2s; }
.lk-bento .trail button:hover .tx, .lk-bento .trail .now .tx { color: var(--ink); }
.lk-bento .trail .tm { font: 600 10.5px var(--mono); color: var(--ink-3); }
.lk-bento .t-r .act { display: flex; align-items: center; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
.lk-bento .go { display: inline-flex; align-items: center; gap: 10px; padding: 13px 22px 13px 18px; border-radius: 16px; font: 800 15px var(--sans); color: #fff;
  background: linear-gradient(135deg, #9b80ff, #5b3cff 60%, #3b2bd1); box-shadow: 0 10px 30px rgba(91,60,255,.45), 0 1px 0 rgba(255,255,255,.35) inset;
  transition: transform .45s var(--spring), box-shadow .3s, filter .2s; }
.lk-bento .go:hover { transform: translateY(-2px) scale(1.03); filter: brightness(1.1); box-shadow: 0 16px 40px rgba(91,60,255,.6), 0 1px 0 rgba(255,255,255,.35) inset; }
.lk-bento .go:active { transform: scale(.96); }
.lk-bento .go svg.i { fill: currentColor; width: 16px; height: 16px; }
.lk-bento .ghost { padding: 12px 16px; border-radius: 14px; font-weight: 700; font-size: 13px; background: rgba(255,255,255,.06); border: 1px solid var(--line); color: var(--ink-2); transition: background .2s, color .2s; }
.lk-bento .ghost:hover { background: rgba(255,255,255,.11); color: var(--ink); }
.lk-bento .t-r .act .stats { margin-left: auto; display: flex; gap: 14px; font: 600 12px var(--mono); color: var(--ink-3); }
.lk-bento .t-r .act .stats b { color: var(--ink); font-weight: 800; }

/* Live tile */
.lk-bento .live-l { margin-top: 12px; display: grid; gap: 6px; }
.lk-bento .live-l button { display: flex; align-items: center; gap: 10px; text-align: left; padding: 7px 10px; border-radius: 12px; background: rgba(74,222,128,.07); border: 1px solid rgba(74,222,128,.2); min-width: 0; }
.lk-bento .live-l button span:last-child { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: 600; font-size: 13px; }
.lk-bento .pulse { position: relative; width: 10px; height: 10px; border-radius: 50%; background: var(--green); flex: none; }
.lk-bento .pulse::after { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--green); animation: bnPulse 1.8s ease-out infinite; }
@keyframes bnPulse { to { transform: scale(3.2); opacity: 0; } }
.lk-bento .recent { margin-top: auto; display: grid; gap: 2px; }
.lk-bento .recent button { display: grid; grid-template-columns: 7px minmax(0, 1fr) auto; gap: 9px; align-items: center; padding: 5px 8px; margin: 0 -8px; border-radius: 9px; text-align: left; font-size: 12.5px; transition: background .2s; }
.lk-bento .recent button:hover { background: rgba(255,255,255,.07); }
.lk-bento .recent .sw { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--h) 80% 62%); }
.lk-bento .recent .tt { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--ink-2); }
.lk-bento .recent button:hover .tt { color: var(--ink); }
.lk-bento .recent .mono { color: var(--ink-3); font-size: 11px; }
.lk-bento .idle { margin-top: 12px; display: flex; align-items: center; gap: 14px; }
.lk-bento .idle .ring { width: 38px; height: 38px; border-radius: 50%; flex: none; border: 1.5px dashed rgba(255,255,255,.2); display: grid; place-items: center; color: var(--ink-3); }
.lk-bento .idle b { display: block; font-size: 15px; font-weight: 800; letter-spacing: -.01em; }
.lk-bento .idle button { display: block; text-align: left; color: var(--ink-2); font-size: 12.5px; max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.lk-bento .idle button:hover { color: var(--ink); }
.lk-bento .idle > div { min-width: 0; }

/* Cost tile */
.lk-bento .t-c .big { margin-top: 8px; font: 800 clamp(30px, 2.8vw, 40px) var(--mono); letter-spacing: -.04em; line-height: 1; }
.lk-bento .t-c .sub { color: var(--ink-3); font-size: 12px; margin-top: 4px; }
.lk-bento .bars { margin-top: auto; display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; align-items: end; height: 52px; }
.lk-bento .bars div { display: flex; flex-direction: column; align-items: center; gap: 3px; height: 100%; justify-content: flex-end; }
.lk-bento .bars i { display: block; width: 100%; max-width: 22px; border-radius: 5px 5px 2px 2px; background: linear-gradient(var(--amber), rgba(250,189,47,.25)); min-height: 3px;
  transform-origin: bottom; animation: bnGrow .9s var(--spring) backwards; animation-delay: calc(.4s + var(--k) * 50ms); }
.lk-bento .bars i.z { background: rgba(255,255,255,.08); }
.lk-bento .bars small { font: 600 9.5px var(--mono); color: var(--ink-3); }
@keyframes bnGrow { from { transform: scaleY(0); } }

/* Today tile */
.lk-bento .tl { position: relative; margin: auto 8px; top: 4px; height: 54px; flex: none; }
.lk-bento .tl .axis { position: absolute; left: 0; right: 0; top: 30px; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,.04), rgba(255,255,255,.2), rgba(255,255,255,.04)); }
.lk-bento .tl .hr { position: absolute; top: 40px; transform: translateX(-50%); font: 600 9.5px var(--mono); color: var(--ink-3); }
.lk-bento .tl .tick { position: absolute; top: 26px; width: 1px; height: 9px; background: rgba(255,255,255,.18); }
.lk-bento .tl .now { position: absolute; top: -8px; bottom: 14px; width: 1px; background: linear-gradient(transparent, var(--amber)); }
.lk-bento .tl .now::after { content: "jetzt"; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font: 700 9px var(--mono); color: var(--amber); letter-spacing: .08em; }
.lk-bento .tl svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.lk-bento .tl .seg { position: absolute; top: 27px; height: 7px; border-radius: 5px; background: hsl(var(--h) 80% 62% / .35); min-width: 4px; }
.lk-bento .tl .pin { position: absolute; top: 30px; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; background: hsl(var(--h) 80% 62%); border: 2px solid #0b0d14;
  box-shadow: 0 0 14px hsl(var(--h) 80% 62% / .8); transition: transform .4s var(--spring); animation: bnPop .7s var(--spring) backwards; animation-delay: calc(.5s + var(--k) * 120ms); }
.lk-bento .tl .pin:hover { transform: scale(1.45); }
.lk-bento .tl .pin.live::after { content: ""; position: absolute; inset: -2px; border-radius: 50%; border: 2px solid var(--green); animation: bnPulse 1.8s ease-out infinite; }
.lk-bento .chips { flex: none; display: flex; gap: 6px; overflow: hidden; }
.lk-bento .chips button { display: flex; align-items: center; gap: 7px; min-width: 0; flex: 0 1 auto; padding: 5px 10px; border-radius: 10px; background: rgba(255,255,255,.05); border: 1px solid var(--line); font-size: 12px; transition: background .2s; }
.lk-bento .chips button:hover { background: rgba(255,255,255,.1); }
.lk-bento .chips .mono { color: var(--ink-3); font-size: 11px; flex: none; }
.lk-bento .chips .tt { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.lk-bento .chips .sw { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--h) 80% 62%); flex: none; }
.lk-bento .tip { position: fixed; z-index: 40; pointer-events: none; padding: 8px 11px; border-radius: 12px; font-size: 12px; max-width: 280px;
  background: rgba(16,18,26,.86); border: 1px solid var(--line); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 12px 30px rgba(0,0,0,.45);
  opacity: 0; transform: translateY(4px); transition: opacity .15s, transform .3s var(--spring); }
.lk-bento .tip.on { opacity: 1; transform: none; }
.lk-bento .tip b { display: block; }
.lk-bento .tip span { color: var(--ink-3); font: 600 11px var(--mono); }

/* Projects tile */
.lk-bento .t-p { padding-bottom: 10px; }
.lk-bento .plist { -webkit-mask-image: linear-gradient(#000 85%, transparent); mask-image: linear-gradient(#000 85%, transparent); padding-bottom: 24px; margin: 10px -8px 0; flex: 1; min-height: 0; overflow: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.12) transparent; transition: opacity .3s, filter .3s; }
.lk-bento .t-p.exp .plist { opacity: .15; filter: blur(3px); pointer-events: none; }
.lk-bento .prow { width: 100%; display: grid; grid-template-columns: 10px minmax(0, 1fr) auto 64px; gap: 10px; align-items: center; padding: 8px 10px; border-radius: 12px; text-align: left; transition: background .2s;
  animation: bnRow .6s var(--spring) backwards; animation-delay: calc(.35s + var(--k) * 30ms); }
@keyframes bnRow { from { opacity: 0; transform: translateX(-10px); } }
.lk-bento .prow:hover { background: rgba(255,255,255,.06); }
.lk-bento .prow .sw { width: 10px; height: 10px; border-radius: 3px; background: hsl(var(--h) 80% 62%); box-shadow: 0 0 10px hsl(var(--h) 80% 62% / .6); }
.lk-bento .prow .nm { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: 700; font-size: 13.5px; }
.lk-bento .prow .nm small { color: var(--ink-3); font-weight: 600; font-size: 11.5px; margin-left: 6px; }
.lk-bento .prow .when { font: 600 11px var(--mono); color: var(--ink-3); }
.lk-bento .spark { display: flex; align-items: flex-end; gap: 2px; height: 20px; justify-content: flex-end; }
.lk-bento .spark i { width: 5px; border-radius: 2px; background: hsl(var(--h) 80% 62% / .75); min-height: 2px; }
.lk-bento .pexp { position: absolute; z-index: 3; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column;
  background: linear-gradient(160deg, hsl(var(--h) 45% 20%), #0e1018 55%); border: 1px solid hsl(var(--h) 80% 62% / .35);
  box-shadow: 0 20px 50px rgba(0,0,0,.5); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.lk-bento .pexp .ph { display: flex; align-items: center; gap: 10px; padding: 14px 14px 10px; flex: none; }
.lk-bento .pexp .ph .back { width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; background: rgba(255,255,255,.08); flex: none; transition: background .2s; }
.lk-bento .pexp .ph .back:hover { background: rgba(255,255,255,.16); }
.lk-bento .pexp .ph .back svg { transform: rotate(180deg); }
.lk-bento .pexp .ph b { display: block; font-size: 17px; font-weight: 800; letter-spacing: -.02em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.lk-bento .pexp .ph span { display: block; color: var(--ink-3); font: 600 11px var(--mono); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.lk-bento .pexp .ph > div { min-width: 0; }
.lk-bento .pexp .sl { flex: 1; overflow: auto; padding: 0 8px 10px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.12) transparent; }
.lk-bento .pexp .sl button { width: 100%; display: grid; grid-template-columns: 8px minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 9px 8px; border-radius: 10px; text-align: left; transition: background .2s;
  animation: bnRow .55s var(--spring) backwards; animation-delay: calc(.18s + var(--k) * 45ms); }
.lk-bento .pexp .sl button:hover { background: rgba(255,255,255,.07); }
.lk-bento .pexp .sl .tt { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: 600; font-size: 13px; }
.lk-bento .pexp .sl .mono { color: var(--ink-3); font-size: 11px; }
.lk-bento .pexp .sl .dot { width: 8px; height: 8px; background: hsl(var(--h) 80% 62%); }

/* Agents tile */
.lk-bento .t-a { cursor: pointer; }
.lk-bento .ag { position: relative; flex: 1; min-height: 0; margin: 6px -6px 0; }
.lk-bento .ag > svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.lk-bento .ag .thr { fill: none; stroke: url(#bnThr); stroke-width: 1.6; stroke-dasharray: 400; stroke-dashoffset: 400; animation: bnDraw 1.3s cubic-bezier(.6,0,.2,1) forwards; animation-delay: calc(.6s + var(--k) * 110ms); }
@keyframes bnDraw { to { stroke-dashoffset: 0; } }
.lk-bento .ag .an { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 5px; width: 92px; text-align: center; animation: bnPop2 .8s var(--spring) backwards; animation-delay: calc(.3s + var(--k) * 110ms); }
@keyframes bnPop2 { from { opacity: 0; transform: translate(-50%, -50%) scale(.4); } }
.lk-bento .ag .orb { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: rgba(255,255,255,.07); border: 1px solid rgba(45,212,191,.45); box-shadow: 0 0 18px rgba(45,212,191,.25); color: #b9fbef; transition: transform .45s var(--spring); }
.lk-bento .ag .an.main .orb { width: 54px; height: 54px; background: radial-gradient(circle at 30% 30%, #b3a0ff, #5b3cff 70%); border: 0; color: #fff; box-shadow: 0 0 0 8px rgba(139,108,255,.12), 0 0 40px rgba(139,108,255,.6); }
.lk-bento .ag .an.main .orb svg.i { width: 24px; height: 24px; }
.lk-bento .t-a:hover .ag .orb { transform: scale(1.08); }
.lk-bento .ag .an b { font-size: 11px; font-weight: 700; max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.lk-bento .ag .an small { font-size: 10px; color: var(--ink-3); max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-top: -4px; }
.lk-bento .t-a .foot { flex: none; display: flex; align-items: center; gap: 10px; padding-top: 6px; min-width: 0; }
.lk-bento .t-a .foot .tt { min-width: 0; flex: 1; }
.lk-bento .t-a .foot b { display: block; font-size: 14px; font-weight: 800; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.lk-bento .t-a .foot span { color: var(--ink-3); font-size: 12px; }
.lk-bento .t-a .foot .arr { width: 34px; height: 34px; border-radius: 12px; display: grid; place-items: center; background: rgba(255,255,255,.07); border: 1px solid var(--line); flex: none; transition: transform .45s var(--spring), background .2s; }
.lk-bento .t-a:hover .foot .arr { transform: translateX(3px); background: rgba(139,108,255,.3); }

/* Models tile */
.lk-bento .donut { position: relative; flex: 1; min-height: 120px; display: grid; place-items: center; }
.lk-bento .donut svg { width: min(100%, 168px); height: auto; max-height: 100%; overflow: visible; }
.lk-bento .donut .arc { fill: none; stroke-width: 14; stroke-linecap: round; transform: rotate(-90deg); transform-origin: 60px 60px; transition: stroke-dasharray 1.2s var(--spring-soft); }
.lk-bento .donut .ctr { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; pointer-events: none; }
.lk-bento .donut .ctr b { display: block; font: 800 22px var(--mono); letter-spacing: -.03em; }
.lk-bento .donut .ctr span { color: var(--ink-3); font-size: 11px; }
.lk-bento .mlist { flex: none; display: grid; gap: 6px; margin-top: 8px; }
.lk-bento .mlist div { display: flex; align-items: center; gap: 8px; font-size: 12.5px; }
.lk-bento .mlist div .v { margin-left: auto; font: 700 11.5px var(--mono); color: var(--ink-2); }
.lk-bento .mlist .split { height: 6px; border-radius: 4px; overflow: hidden; display: flex; background: rgba(255,255,255,.06); margin-top: 4px; }
.lk-bento .mlist .split i { display: block; height: 100%; }
.lk-bento .mlist .lg { color: var(--ink-3); font-size: 11px; justify-content: space-between; }

@media (prefers-reduced-motion: reduce) {
  .lk-bento .pulse::after, .lk-bento .tl .pin.live::after { animation: none; }
  .lk-bento .bn-t { animation-duration: .01s; }
}
`;

  const FAM_COL = { opus: "#8b6cff", sonnet: "#3b82f6", haiku: "#22c55e", fable: "#f97316", x: "#8a8799" };

  function render(root, A) {
    const D = A.DATA, S = D.sessions, esc = A.esc;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hsl = (h, a = 1) => `hsl(${h} 80% 62% / ${a})`;
    const spring = getComputedStyle(document.documentElement).getPropertyValue("--spring").trim() || "ease";
    const now = Date.now();

    // ---------- Tile: where you left off ----------
    const cur = S[0];
    const trail = cur.path.slice(-3);
    const stepNo = (n) => cur.path.indexOf(n) + 1;
    const tR = `
      <section class="bn-t t-r" style="grid-area:r;--i:0;--h:${cur.hue}"><div class="glow"></div>
        <div class="bn-h">${A.ic("clock")} Hier hast du aufgehört <span class="r">${esc(A.rel(cur.end))}</span></div>
        <div class="meta"><span class="pill"><span class="sw"></span>${esc(cur.projName)}${cur.branch ? ` · ${esc(cur.branch)}` : ""}</span>${cur.live ? `<span class="pill" style="color:var(--green)"><span class="pulse"></span>läuft gerade</span>` : ""}${cur.modelList.slice(0, 2).map(A.mp).join("")}</div>
        <h2>${esc(cur.label)}</h2>
        ${cur.about ? `<div class="about">${esc(cur.about)}</div>` : ""}
        <div class="trail ${trail.length < 2 ? "one" : ""}" style="--n:${Math.max(trail.length, 1)}"><div class="ln"></div>
          ${trail.map((n, k) => `<button data-open="${esc(cur.id)}" data-open-step="${esc(n.id)}" class="${n.id === cur.last.id ? "now" : ""}" style="--k:${k}" title="Schritt öffnen">
            <span class="pt">${stepNo(n)}</span><span class="tm">${A.hhmm(n.ts)}${n.id === cur.last.id ? " · zuletzt" : ""}</span><span class="tx">${esc(n.text.replace(/\s+/g, " ").slice(0, 160))}</span></button>`).join("")}
        </div>
        <div class="act">
          <button class="go" data-go>${A.ic("play")} Weitermachen</button>
          <button class="ghost" data-open="${esc(cur.id)}">Ganze Session</button>
          <span class="stats"><span><b>${cur.nodes.length}</b> Schritte</span>${cur.cost ? `<span><b>${A.usd(cur.cost.usd)}</b></span>` : ""}</span>
        </div>
      </section>`;

    // ---------- Tile: running now ----------
    const live = S.filter((s) => s.live);
    const tL = `
      <section class="bn-t t-l" style="grid-area:l;--i:1">
        <div class="bn-h">${live.length ? `<span class="pulse" style="width:8px;height:8px"></span>` : A.ic("play")} Läuft gerade <span class="r">${live.length || ""}</span></div>
        ${live.length ? `<div class="live-l">${live.slice(0, 3).map((s) => `<button data-open="${esc(s.id)}"><span class="pulse"></span><span>${esc(s.label)}</span></button>`).join("")}</div>`
          : `<div class="idle"><span class="ring">${A.ic("clock")}</span><div><b>Gerade nichts aktiv</b><span class="cap">Zuletzt bearbeitet:</span></div></div>
            <div class="recent">${S.slice(0, 2).map((s) => `<button data-open="${esc(s.id)}" style="--h:${s.hue}"><span class="sw"></span><span class="tt">${esc(s.label)}</span><span class="mono">${esc(A.relShort(s.end))}</span></button>`).join("")}</div>`}
      </section>`;

    // ---------- Tile: cost last 7 days ----------
    const dayStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
    const today0 = dayStart(now);
    const days = [...Array(7)].map((_, k) => ({ t: today0 - (6 - k) * 864e5, usd: 0, n: 0 }));
    for (const s of S) { const d0 = dayStart(Date.parse(s.end)); const d = days.find((x) => x.t === d0); if (d) { d.usd += s.cost?.usd || 0; d.n++; } }
    const weekUsd = days.reduce((n, d) => n + d.usd, 0), weekN = days.reduce((n, d) => n + d.n, 0), maxUsd = Math.max(...days.map((d) => d.usd), 0.01);
    const tC = `
      <section class="bn-t t-c" style="grid-area:c;--i:2">
        <div class="bn-h">Kosten diese Woche <span class="r">7 Tage</span></div>
        <div class="big" data-count="${weekUsd}">$0.00</div>
        <div class="sub">${weekN} Sessions · gesamt ${A.usd(D.totals.cost)}</div>
        <div class="bars">${days.map((d, k) => `<div title="${A.usd(d.usd)}"><i class="${d.usd ? "" : "z"}" style="--k:${k};height:${Math.max(6, (d.usd / maxUsd) * 100) * 0.7}%"></i><small>${new Date(d.t).toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")}</small></div>`).join("")}</div>
      </section>`;

    // ---------- Tile: today on a 24h line ----------
    let dayT = today0, todayS = S.filter((s) => Date.parse(s.end) >= today0);
    let dayLbl = "Heute";
    if (!todayS.length) { dayT = dayStart(Date.parse(cur.end)); todayS = S.filter((s) => dayStart(Date.parse(s.end)) === dayT); dayLbl = "Zuletzt aktiv · " + A.day(cur.end); }
    const pct = (t) => Math.min(100, Math.max(0, ((t - dayT) / 864e5) * 100));
    const todayAsc = todayS.slice().sort((a, b) => a.end.localeCompare(b.end));
    const pts = todayAsc.map((s) => ({ s, x0: pct(Date.parse(s.start)), x1: pct(Date.parse(s.end)) }));
    const arcs = pts.slice(1).map((p, k) => { const a = pts[k].x1, b = p.x1, m = (a + b) / 2, lift = Math.min(26, 8 + (b - a) * 0.9); return { a, b, m, lift }; });
    const tT = `
      <section class="bn-t t-t" style="grid-area:t;--i:3">
        <div class="bn-h">${A.ic("clock")} ${esc(dayLbl)} <span class="r">${todayS.length} ${todayS.length === 1 ? "Session" : "Sessions"}</span></div>
        <div class="tl" data-tl>
          <div class="axis"></div>
          ${[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => `<span class="tick" style="left:${(h / 24) * 100}%"></span>${h % 6 === 0 ? `<span class="hr" style="left:${(h / 24) * 100}%">${String(h).padStart(2, "0")}</span>` : ""}`).join("")}
          ${dayT === today0 ? `<span class="now" style="left:${pct(now)}%"></span>` : ""}
          <svg preserveAspectRatio="none" viewBox="0 0 100 54">${arcs.map((r, k) => `<path d="M${r.a},30 C${r.a},${30 - r.lift} ${r.b},${30 - r.lift} ${r.b},30" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2" vector-effect="non-scaling-stroke" stroke-dasharray="3 3" class="fadein" style="--i:${k + 8}"/>`).join("")}</svg>
          ${pts.map((p, k) => `<span class="seg" style="--h:${p.s.hue};left:${p.x0}%;width:${Math.max(0, p.x1 - p.x0)}%"></span><button class="pin ${p.s.live ? "live" : ""}" style="--h:${p.s.hue};--k:${k};left:${p.x1}%" data-open="${esc(p.s.id)}" data-tip="${k}" aria-label="${esc(p.s.label)}"></button>`).join("")}
        </div>
        <div class="chips">${todayS.slice(0, 4).map((s) => `<button data-open="${esc(s.id)}" style="--h:${s.hue}"><span class="sw"></span><span class="mono">${A.hhmm(s.end)}</span><span class="tt">${esc(s.label)}</span></button>`).join("")}</div>
      </section>`;

    // ---------- Tile: projects ----------
    const P = D.projects.slice().sort((a, b) => b.last.localeCompare(a.last));
    const spark = (p) => { const ss = p.sessions.slice(0, 8).reverse(); const mx = Math.max(...ss.map((s) => s.nodes.length), 1); return `<span class="spark">${ss.map((s) => `<i style="height:${Math.max(10, (s.nodes.length / mx) * 100)}%"></i>`).join("")}</span>`; };
    const tP = `
      <section class="bn-t t-p" style="grid-area:p;--i:4">
        <div class="bn-h">${A.ic("folder")} Projekte <span class="r">${P.length} Projekte · ${D.totals.steps} Schritte</span></div>
        <div class="plist">${P.map((p, k) => `<button class="prow" data-proj="${k}" style="--h:${p.hue};--k:${Math.min(k, 14)}"><span class="sw"></span><span class="nm">${esc(p.name)}<small>${p.sessions.length}</small></span><span class="when">${esc(A.relShort(p.last))}</span>${spark(p)}</button>`).join("")}</div>
      </section>`;

    // ---------- Tile: agent graph ----------
    const ags = S.slice().sort((a, b) => b.agents.length - a.agents.length)[0];
    const subs = ags && ags.agents.length ? ags.agents.slice(0, 6) : [];
    const tA = ags && subs.length ? `
      <section class="bn-t t-a" style="grid-area:a;--i:5" data-open="${esc(ags.id)}" role="button" tabindex="0">
        <div class="bn-h">${A.ic("bot")} Agents <span class="r">meiste Helfer</span></div>
        <div class="ag" data-ag></div>
        <div class="foot"><div class="tt"><b>${esc(ags.label)}</b><span>${esc(ags.projName)} · ${subs.length} Subagents · ${esc(A.rel(ags.end))}</span></div><span class="arr">${A.ic("r")}</span></div>
      </section>`
      : `<section class="bn-t t-a" style="grid-area:a;--i:5"><div class="bn-h">${A.ic("bot")} Agents</div><div class="idle"><span class="ring">${A.ic("bot")}</span><div><b>Keine Subagents</b><span class="cap">Claude hat überall allein gearbeitet.</span></div></div></section>`;

    // ---------- Tile: models ----------
    const fam = {}; let mainR = 0, subR = 0;
    for (const s of S) {
      for (const [m, v] of Object.entries(s.models || {})) { const f = A.modelInfo(m); (fam[f.fam] ||= { name: f.name.split(" ")[0], r: 0, vers: new Set() }).r += v.replies; fam[f.fam].vers.add(f.name); mainR += v.replies; }
      for (const a of s.agents) for (const [m, v] of Object.entries(a.models || {})) { const f = A.modelInfo(m); (fam[f.fam] ||= { name: f.name.split(" ")[0], r: 0, vers: new Set() }).r += v.replies || 0; fam[f.fam].vers.add(f.name); subR += v.replies || 0; }
    }
    const fams = Object.entries(fam).sort((a, b) => b[1].r - a[1].r), totR = fams.reduce((n, f) => n + f[1].r, 0) || 1;
    const C = 2 * Math.PI * 46; let acc = 0;
    const arcsM = fams.map(([k, f]) => { const len = (f.r / totR) * C, gap = fams.length > 1 ? 4 : 0; const el = `<circle class="arc" cx="60" cy="60" r="46" stroke="${FAM_COL[k] || FAM_COL.x}" data-len="${Math.max(0.1, len - gap)}" stroke-dasharray="0 ${C}" stroke-dashoffset="${-acc}" style="filter:drop-shadow(0 0 6px ${FAM_COL[k] || FAM_COL.x})"/>`; acc += len; return el; });
    const tM = `
      <section class="bn-t t-m" style="grid-area:m;--i:6">
        <div class="bn-h">${A.ic("grid")} Modelle <span class="r">Antworten</span></div>
        <div class="donut"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="14"/>${arcsM.join("")}</svg>
          <div class="ctr"><div><b data-count="${totR}" data-int>0</b><span>Antworten</span></div></div></div>
        <div class="mlist">
          ${fams.map(([k, f]) => `<div><span class="mp ${k}">${esc([...f.vers].join(", "))}</span><span class="v">${Math.round((f.r / totR) * 100)}%</span></div>`).join("")}
          <div class="lg"><span>Claude selbst</span><span>Subagents</span></div>
          <div class="split" style="display:flex"><i style="width:${(mainR / (mainR + subR || 1)) * 100}%;background:var(--violet)"></i><i style="width:${(subR / (mainR + subR || 1)) * 100}%;background:var(--teal)"></i></div>
          <div class="lg"><span class="mono">${A.fmtTok(mainR)}</span><span class="mono">${A.fmtTok(subR)}</span></div>
        </div>
      </section>`;

    const hour = new Date().getHours();
    const greet = hour < 11 ? "Guten Morgen" : hour < 18 ? "Hallo" : "Guten Abend";
    root.innerHTML = `<div class="bn-wrap">
      <header class="bn-top"><div><div class="k">Session Atlas · Cockpit</div><h1>${greet}. Hier ist dein Überblick.</h1></div>
        <div class="bn-chips"><span class="bn-chip"><b>${D.totals.sessions}</b>Sessions</span><span class="bn-chip"><b>${D.projects.length}</b>Projekte</span><span class="bn-chip"><b>${D.totals.steps}</b>Schritte</span></div></header>
      <div class="bn-grid">${tR}${tL}${tC}${tT}${tP}${tA}${tM}</div></div>
      <div class="tip" data-tipel></div>`;

    // ---------- Behaviour ----------
    const grid = root.querySelector(".bn-grid");
    root.querySelector("[data-go]").addEventListener("click", () => A.open(cur.id, cur.last.id));

    // Soft light that follows the cursor inside a tile
    const onMove = (e) => { const t = e.target.closest(".bn-t"); if (!t) return; const r = t.getBoundingClientRect(); t.style.setProperty("--mx", `${e.clientX - r.left}px`); t.style.setProperty("--my", `${e.clientY - r.top}px`); };
    grid.addEventListener("pointermove", onMove);

    // Count-up numbers
    const counters = [];
    root.querySelectorAll("[data-count]").forEach((el) => {
      const to = +el.dataset.count, isInt = el.hasAttribute("data-int"), fmt = (v) => isInt ? Math.round(v).toLocaleString("de-DE") : `$${v.toFixed(2)}`;
      if (reduce) { el.textContent = fmt(to); return; }
      const t0 = performance.now() + 450, dur = 1400;
      const tick = (t) => { const k = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - k, 4); el.textContent = fmt(to * e); if (k < 1) counters.push(requestAnimationFrame(tick)); };
      counters.push(requestAnimationFrame(tick));
      counters.push(setTimeout(() => { el.textContent = fmt(to); }, 2600));
    });
    // Donut arcs sweep in
    const dT = setTimeout(() => root.querySelectorAll(".donut .arc").forEach((c) => c.setAttribute("stroke-dasharray", `${c.dataset.len} ${C}`)), reduce ? 0 : 500);

    // Timeline tooltips
    const tip = root.querySelector("[data-tipel]");
    const tl = root.querySelector("[data-tl]");
    tl.addEventListener("pointerover", (e) => {
      const b = e.target.closest("[data-tip]"); if (!b) return; const p = pts[+b.dataset.tip].s, r = b.getBoundingClientRect();
      tip.innerHTML = `<b>${esc(p.label)}</b><span>${esc(p.projName)} · ${A.hhmm(p.start)} bis ${A.hhmm(p.end)} · ${p.nodes.length} Schritte</span>`;
      tip.style.left = `${Math.min(innerWidth - 290, Math.max(8, r.left - 20))}px`; tip.style.top = `${r.top - 62}px`; tip.classList.add("on");
    });
    tl.addEventListener("pointerout", (e) => { if (e.target.closest("[data-tip]")) tip.classList.remove("on"); });

    // Agent graph: main orb, curved threads, particles flowing to each subagent
    const agEl = root.querySelector("[data-ag]");
    const drawAgents = () => {
      if (!agEl) return;
      const W = agEl.clientWidth, H = agEl.clientHeight; if (!W || !H) return;
      const n = subs.length, cx = W / 2, cy = Math.min(46, H * 0.22), by = H - 34;
      const pos = subs.map((_, i) => { const t = n === 1 ? 0.5 : i / (n - 1); const x = 52 + t * (W - 104); return { x, y: by - Math.sin(t * Math.PI) * Math.min(26, H * 0.12) }; });
      agEl.innerHTML = `<svg viewBox="0 0 ${W} ${H}"><defs><linearGradient id="bnThr" gradientUnits="userSpaceOnUse" x1="0" y1="${cy}" x2="0" y2="${by}"><stop offset="0" stop-color="#8b6cff"/><stop offset="1" stop-color="#2dd4bf"/></linearGradient></defs>
        ${pos.map((p, i) => `<path class="thr" id="bnth${i}" style="--k:${i}" d="M${cx},${cy + 24} C${cx},${cy + (by - cy) * 0.55} ${p.x},${p.y - (by - cy) * 0.6} ${p.x},${p.y - 18}"/>
          ${reduce ? "" : `<circle r="2.6" fill="#7df9e6" opacity="0" style="filter:drop-shadow(0 0 4px #2dd4bf)"><set attributeName="opacity" to="1" begin="${1.6 + i * 0.2}s"/><animateMotion dur="${2.1 + i * 0.27}s" repeatCount="indefinite" begin="${1.6 + i * 0.2}s"><mpath href="#bnth${i}"/></animateMotion></circle>
          <circle r="1.8" fill="#c4b5ff" opacity="0"><set attributeName="opacity" to=".8" begin="${2.6 + i * 0.2}s"/><animateMotion dur="${2.1 + i * 0.27}s" repeatCount="indefinite" begin="${2.6 + i * 0.2}s"><mpath href="#bnth${i}"/></animateMotion></circle>`}`).join("")}</svg>
        <div class="an main" style="left:${cx}px;top:${cy}px;--k:0"><span class="orb">${A.ic("bot")}</span></div>
        ${subs.map((a, i) => `<div class="an" style="left:${pos[i].x}px;top:${pos[i].y}px;--k:${i + 1};width:${Math.min(96, (W - 30) / n)}px"><span class="orb">${A.ic("bot")}</span><b>${esc(A.aName(a.type))}</b><small>${esc(a.description || "")}</small></div>`).join("")}`;
    };
    drawAgents();
    let rT; const ro = new ResizeObserver(() => { clearTimeout(rT); rT = setTimeout(drawAgents, 120); });
    if (agEl) ro.observe(agEl);

    // Projects: shared-layout style spring morph from a row into the full tile
    const tileP = root.querySelector(".t-p");
    let exp = null;
    const close = () => {
      if (!exp) return; const { el, from } = exp; exp = null;
      el.querySelector(".sl").style.opacity = "0";
      const anim = el.animate([{ left: "10px", top: "10px", width: `${tileP.clientWidth - 20}px`, height: `${tileP.clientHeight - 20}px`, borderRadius: "20px" },
        { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: "12px", opacity: 0.2 }], { duration: reduce ? 1 : 420, easing: "cubic-bezier(.5,0,.2,1)" });
      tileP.classList.remove("exp");
      anim.onfinish = () => el.remove();
    };
    tileP.addEventListener("click", (e) => {
      if (e.target.closest("[data-back]")) return close();
      const row = e.target.closest("[data-proj]"); if (!row || exp) return;
      const p = P[+row.dataset.proj], tr = tileP.getBoundingClientRect(), rr = row.getBoundingClientRect();
      const from = { left: rr.left - tr.left, top: rr.top - tr.top, width: rr.width, height: rr.height };
      const el = document.createElement("div");
      el.className = "pexp"; el.style.setProperty("--h", p.hue);
      Object.assign(el.style, { left: "10px", top: "10px", right: "10px", bottom: "10px" });
      el.innerHTML = `<div class="ph"><button class="back" data-back aria-label="Zurück">${A.ic("r")}</button><div><b>${esc(p.name)}</b><span>${esc(A.short(p.path))} · ${p.sessions.length} Sessions · ${p.steps} Schritte</span></div></div>
        <div class="sl">${p.sessions.map((s, k) => `<button data-open="${esc(s.id)}" style="--k:${Math.min(k, 12)}"><span class="dot ${s.live ? "live" : ""}"></span><span class="tt">${esc(s.label)}</span><span class="mono">${s.nodes.length} · ${esc(A.relShort(s.end))}</span></button>`).join("")}</div>`;
      tileP.appendChild(el); tileP.classList.add("exp");
      exp = { el, from };
      el.animate([{ left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: "12px", right: "auto", bottom: "auto" },
        { left: "10px", top: "10px", width: `${tileP.clientWidth - 20}px`, height: `${tileP.clientHeight - 20}px`, borderRadius: "20px", right: "auto", bottom: "auto" }],
        { duration: reduce ? 1 : 750, easing: spring });
    });
    const onKey = (e) => { if (e.key === "Escape" && exp) close(); };
    document.addEventListener("keydown", onKey);

    A.onCleanup(() => { ro.disconnect(); clearTimeout(dT); clearTimeout(rT); counters.forEach((h) => { cancelAnimationFrame(h); clearTimeout(h); }); document.removeEventListener("keydown", onKey); });
  }

  Atlas.register({ key: "bento", name: "Bento-Cockpit", tagline: "Alles Wichtige als Kacheln", css, render, wantsArrows: false });
})();
