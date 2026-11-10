// Look: Mission Dashboard. Premium analytics dashboard (Linear/Vercel/Grafana spirit):
// nav rail, KPI row with count-up + sparklines, activity area chart, sortable session table,
// live feed of latest steps, agent mini graph and a model donut. Dark glass, restrained neon.
(function () {
  const css = `
.lk-dashboard { overflow: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.14) transparent; color: var(--ink);
  background:
    radial-gradient(1100px 600px at 20% -12%, rgba(34,211,238,.10), transparent 60%),
    radial-gradient(900px 700px at 110% 30%, rgba(139,108,255,.13), transparent 60%),
    radial-gradient(700px 500px at 40% 120%, rgba(45,212,191,.07), transparent 60%),
    #05060a; }
.lk-dashboard::before { content: ""; position: fixed; inset: 0; pointer-events: none; opacity: .5;
  background-image: linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);
  background-size: 44px 44px; mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 85%); }
.lk-dashboard .db { position: relative; display: grid; grid-template-columns: 76px minmax(0, 1fr); min-height: 100%; }

/* ---------- Rail ---------- */
.lk-dashboard .db-rail { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 0;
  border-right: 1px solid rgba(255,255,255,.07); background: rgba(8,10,16,.55); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 5; }
.lk-dashboard .db-logo { width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 14px; font: 800 13px var(--mono); color: #fff;
  background: conic-gradient(from 210deg, #22d3ee, #8b6cff, #2dd4bf, #22d3ee); box-shadow: 0 0 0 1px rgba(255,255,255,.15) inset, 0 6px 24px rgba(34,211,238,.25); position: relative; }
.lk-dashboard .db-logo::after { content: ""; position: absolute; inset: 2px; border-radius: 10px; background: #0b0d14; }
.lk-dashboard .db-logo span { position: relative; z-index: 1; color: #a5f3fc; }
.lk-dashboard .db-nav { position: relative; display: flex; flex-direction: column; gap: 4px; }
.lk-dashboard .db-nav button { position: relative; z-index: 1; width: 60px; padding: 9px 0 7px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 4px;
  color: var(--ink-3); font: 600 10.5px var(--sans); transition: color .2s; }
.lk-dashboard .db-nav button:hover { color: var(--ink); }
.lk-dashboard .db-nav button.on { color: #e6fbff; }
.lk-dashboard .db-nav button svg.i { width: 20px; height: 20px; }
.lk-dashboard .db-pill { position: absolute; left: 0; width: 60px; border-radius: 12px; background: linear-gradient(180deg, rgba(34,211,238,.16), rgba(139,108,255,.12));
  border: 1px solid rgba(103,232,249,.25); box-shadow: 0 0 18px rgba(34,211,238,.12); transition: top .6s var(--spring), height .6s var(--spring); }
.lk-dashboard .db-pill::before { content: ""; position: absolute; left: -9px; top: 25%; bottom: 25%; width: 3px; border-radius: 3px; background: #67e8f9; box-shadow: 0 0 10px #22d3ee; }
.lk-dashboard .db-rail .foot { margin-top: auto; display: flex; flex-direction: column; align-items: center; gap: 6px; font: 700 9.5px var(--mono); letter-spacing: .12em; color: var(--ink-3); margin-bottom: 58px; }

/* ---------- Main ---------- */
.lk-dashboard .db-main { min-width: 0; padding: 18px 22px 72px; display: flex; flex-direction: column; gap: 14px; }
@media (min-width: 1200px) and (min-height: 760px) {
  .lk-dashboard .db-main { height: 100vh; }
  .lk-dashboard .db-grid { flex: 1 1 0; min-height: 0; }
}
.lk-dashboard .db-top { display: flex; align-items: flex-end; gap: 14px; flex-wrap: wrap; }
.lk-dashboard .db-top .eb { font: 700 10.5px var(--mono); letter-spacing: .2em; text-transform: uppercase; color: var(--ink-3); }
.lk-dashboard .db-top h1 { margin: 3px 0 0; font-size: 26px; font-weight: 800; letter-spacing: -.03em; line-height: 1.05; }
.lk-dashboard .db-top .r { margin-left: auto; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.lk-dashboard .db-badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 11px; border-radius: 999px; border: 1px solid rgba(255,255,255,.09);
  background: rgba(255,255,255,.04); font: 600 12px var(--sans); color: var(--ink-2); }
.lk-dashboard .db-badge b { color: var(--ink); font-family: var(--mono); font-weight: 700; }
.lk-dashboard .db-badge .pulse { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 0 rgba(74,222,128,.6); animation: dbPulse 2s ease-out infinite; }
@keyframes dbPulse { 70% { box-shadow: 0 0 0 7px rgba(74,222,128,0); } 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); } }

/* Panels */
.lk-dashboard .db-p { position: relative; min-width: 0; min-height: 0; border-radius: 16px; display: flex; flex-direction: column;
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.018));
  border: 1px solid rgba(255,255,255,.08); backdrop-filter: blur(18px) saturate(140%); -webkit-backdrop-filter: blur(18px) saturate(140%);
  box-shadow: 0 1px 0 rgba(255,255,255,.06) inset, 0 16px 40px rgba(0,0,0,.35);
  animation: dbIn .9s var(--spring) backwards; animation-delay: calc(var(--i, 0) * 70ms + 40ms); transition: border-color .3s, box-shadow .4s; }
.lk-dashboard .db-p.flash { border-color: rgba(103,232,249,.55); box-shadow: 0 0 0 3px rgba(34,211,238,.12), 0 16px 40px rgba(0,0,0,.35); }
@keyframes dbIn { from { opacity: 0; transform: translateY(18px) scale(.97); } }
.lk-dashboard .db-ph { display: flex; align-items: center; gap: 10px; padding: 13px 16px 0; flex: none; min-width: 0; }
.lk-dashboard .db-ph h3 { margin: 0; font-size: 13.5px; font-weight: 700; letter-spacing: -.01em; white-space: nowrap; }
.lk-dashboard .db-ph .sub { color: var(--ink-3); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.lk-dashboard .db-ph .r { margin-left: auto; display: flex; gap: 8px; align-items: center; flex: none; }
.lk-dashboard .lg { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--ink-2); }
.lk-dashboard .lg i { width: 10px; height: 3px; border-radius: 2px; background: var(--c); }
.lk-dashboard .lg i.b { height: 8px; width: 8px; border-radius: 2px; }

/* KPIs */
.lk-dashboard .db-kpis { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; flex: none; }
.lk-dashboard .db-kpi { padding: 13px 15px 12px; overflow: hidden; }
.lk-dashboard .db-kpi::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .3s;
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--c) 14%, transparent), transparent 60%); }
.lk-dashboard .db-kpi:hover::after { opacity: 1; }
.lk-dashboard .db-kpi .kh { display: flex; align-items: center; gap: 7px; font: 600 12px var(--sans); color: var(--ink-2); }
.lk-dashboard .db-kpi .kh .ico { width: 22px; height: 22px; border-radius: 7px; display: grid; place-items: center; color: var(--c);
  background: color-mix(in srgb, var(--c) 14%, transparent); border: 1px solid color-mix(in srgb, var(--c) 28%, transparent); }
.lk-dashboard .db-kpi .kh .ico svg.i { width: 13px; height: 13px; }
.lk-dashboard .db-kpi .kv { margin-top: 8px; font: 700 27px/1 var(--mono); letter-spacing: -.04em; font-variant-numeric: tabular-nums; }
.lk-dashboard .db-kpi .ks { margin-top: 6px; font-size: 11.5px; color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 56%; }
.lk-dashboard .db-kpi .ks b { color: var(--ink-2); font-family: var(--mono); font-weight: 700; }
.lk-dashboard .db-kpi svg.sp { position: absolute; right: 12px; bottom: 12px; width: 44%; height: 38px; overflow: visible; }
.lk-dashboard .sp .ln { fill: none; stroke: var(--c); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: dbDraw 1.4s cubic-bezier(.6,0,.2,1) forwards; animation-delay: calc(var(--i, 0) * 80ms + 300ms); filter: drop-shadow(0 0 4px color-mix(in srgb, var(--c) 70%, transparent)); }
.lk-dashboard .sp .ar { animation: dbFade 1s ease backwards; animation-delay: calc(var(--i, 0) * 80ms + 900ms); }
.lk-dashboard .sp rect { fill: var(--c); transform-box: fill-box; transform-origin: bottom; animation: dbBar .8s var(--spring) backwards; animation-delay: calc(var(--k) * 18ms + 400ms); }
@keyframes dbDraw { to { stroke-dashoffset: 0; } }
@keyframes dbFade { from { opacity: 0; } }
@keyframes dbBar { from { transform: scaleY(0); } }

/* Grid */
.lk-dashboard .db-grid { display: grid; gap: 14px; grid-template-columns: minmax(0, 1fr) 340px; grid-template-rows: auto minmax(0, 1fr);
  grid-template-areas: "chart side" "table side"; }
.lk-dashboard .a-chart { grid-area: chart; }
.lk-dashboard .a-table { grid-area: table; }
.lk-dashboard .db-side { grid-area: side; min-height: 0; display: grid; gap: 14px; grid-template-rows: minmax(0, 1fr) auto auto; }
@media (max-width: 1199px) {
  .lk-dashboard .db-grid { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; grid-template-areas: "chart" "table" "side"; }
  .lk-dashboard .db-side { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: auto auto; grid-template-areas: "feed ag" "feed mo"; }
  .lk-dashboard .a-feed { grid-area: feed; max-height: 560px; } .lk-dashboard .a-ag { grid-area: ag; } .lk-dashboard .a-mo { grid-area: mo; }
  .lk-dashboard .tb-body { max-height: 470px; }
  .lk-dashboard .db-kpi .kv { font-size: 23px; }
  .lk-dashboard .db-kpi .ks { max-width: none; }
  .lk-dashboard .db-kpi svg.sp { position: static; display: block; width: 100%; height: 26px; margin-top: 8px; }
}
@media (max-width: 760px) {
  .lk-dashboard .db-side { grid-template-columns: minmax(0, 1fr); grid-template-areas: "feed" "ag" "mo"; }
}

/* Activity chart */
.lk-dashboard .ch-wrap { position: relative; height: 172px; margin: 6px 6px 8px; }
.lk-dashboard .ch-wrap svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.lk-dashboard .ch-grid line { stroke: rgba(255,255,255,.06); }
.lk-dashboard .ch-ax { fill: var(--ink-3); font: 500 10.5px var(--mono); }
.lk-dashboard .ch-line { fill: none; stroke: url(#dbLineG); stroke-width: 2.4; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(34,211,238,.55)); }
.lk-dashboard .ch-bar { fill: rgba(139,108,255,.22); }
.lk-dashboard .ch-bar.on { fill: rgba(139,108,255,.5); }
.lk-dashboard .ch-bar.pick { fill: rgba(250,189,47,.45); }
.lk-dashboard .ch-x { stroke: rgba(230,251,255,.45); stroke-dasharray: 3 3; opacity: 0; transition: opacity .15s; }
.lk-dashboard .ch-dot { fill: #05060a; stroke: #67e8f9; stroke-width: 2.4; opacity: 0; transition: opacity .15s; filter: drop-shadow(0 0 6px #22d3ee); }
.lk-dashboard .ch-wrap.hov .ch-x, .lk-dashboard .ch-wrap.hov .ch-dot { opacity: 1; }
.lk-dashboard .ch-tip { position: absolute; top: 4px; pointer-events: none; min-width: 168px; max-width: 250px; padding: 10px 12px; border-radius: 12px; z-index: 3;
  background: rgba(12,14,22,.92); border: 1px solid rgba(255,255,255,.12); box-shadow: 0 14px 34px rgba(0,0,0,.5); font-size: 12px;
  opacity: 0; transform: translateY(4px) scale(.97); transition: opacity .15s, transform .35s var(--spring); }
.lk-dashboard .ch-wrap.hov .ch-tip { opacity: 1; transform: none; }
.lk-dashboard .ch-tip .d { font: 700 11px var(--mono); color: var(--ink-3); letter-spacing: .06em; text-transform: uppercase; }
.lk-dashboard .ch-tip .kv { display: flex; justify-content: space-between; gap: 12px; margin-top: 4px; color: var(--ink-2); }
.lk-dashboard .ch-tip .kv b { font-family: var(--mono); color: var(--ink); }
.lk-dashboard .ch-tip .ss { margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,.08); display: grid; gap: 2px; color: var(--ink-2); }
.lk-dashboard .ch-tip .ss span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-dashboard .ch-tip .hint { margin-top: 6px; font-size: 10.5px; color: var(--ink-3); }

/* Table */
.lk-dashboard .a-table { min-height: 300px; }
.lk-dashboard .db-filter { display: flex; align-items: center; gap: 7px; padding: 6px 10px; border-radius: 10px; background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.09); color: var(--ink-3);
  transition: border-color .2s, box-shadow .2s; }
.lk-dashboard .db-filter:focus-within { border-color: rgba(103,232,249,.5); box-shadow: 0 0 0 3px rgba(34,211,238,.12); }
.lk-dashboard .db-filter svg.i { width: 14px; height: 14px; }
.lk-dashboard .db-filter input { width: 190px; border: 0; outline: 0; background: none; color: var(--ink); font: 500 12.5px var(--sans); }
.lk-dashboard .db-filter kbd { font: 700 10px var(--mono); padding: 1px 5px; border-radius: 4px; border: 1px solid rgba(255,255,255,.14); color: var(--ink-3); }
.lk-dashboard .daychip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 6px 4px 10px; border-radius: 999px; font: 600 11.5px var(--sans);
  background: rgba(250,189,47,.12); border: 1px solid rgba(250,189,47,.35); color: #fde68a; animation: dbIn .5s var(--spring); }
.lk-dashboard .daychip svg.i { width: 13px; height: 13px; }
.lk-dashboard .tb { display: flex; flex-direction: column; min-height: 0; flex: 1; margin-top: 10px; }
.lk-dashboard .tb-r { display: grid; grid-template-columns: minmax(0, 2.5fr) minmax(0, 1.05fr) 128px 62px minmax(0, .8fr) 92px 44px; gap: 12px; align-items: center; padding: 0 16px; }
.lk-dashboard .tb-h { flex: none; height: 32px; border-top: 1px solid rgba(255,255,255,.06); border-bottom: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.02); }
.lk-dashboard .tb-h button { display: inline-flex; align-items: center; gap: 4px; font: 700 10.5px var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); text-align: left; white-space: nowrap; }
.lk-dashboard .tb-h button:hover { color: var(--ink-2); }
.lk-dashboard .tb-h button.on { color: #a5f3fc; }
.lk-dashboard .tb-h button .ar { display: inline-block; width: 10px; transition: transform .45s var(--spring); }
.lk-dashboard .tb-h button.on.up .ar { transform: rotate(180deg); }
.lk-dashboard .tb-body { flex: 1; min-height: 0; overflow: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.14) transparent; padding: 4px 0 8px; }
.lk-dashboard .db-row { position: relative; height: 44px; cursor: pointer; border-radius: 10px; margin: 1px 6px; padding: 0 10px; outline: none;
  transition: background .2s; animation: dbRow .7s var(--spring) backwards; animation-delay: calc(var(--k, 0) * 28ms + 350ms); }
@keyframes dbRow { from { opacity: 0; transform: translateY(10px); } }
.lk-dashboard .db-row:hover, .lk-dashboard .db-row:focus-visible { background: rgba(255,255,255,.045); }
.lk-dashboard .db-row.sel { background: linear-gradient(90deg, rgba(34,211,238,.13), rgba(139,108,255,.06)); box-shadow: inset 0 0 0 1px rgba(103,232,249,.28); }
.lk-dashboard .db-row.sel::before { content: ""; position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px; border-radius: 3px; background: #67e8f9; box-shadow: 0 0 8px #22d3ee; }
.lk-dashboard .c-t { display: flex; align-items: center; gap: 9px; min-width: 0; }
.lk-dashboard .c-t .tt { font-weight: 650; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-dashboard .c-t .dot { background: hsl(var(--h) 80% 62% / .5); }
.lk-dashboard .c-t .dot.live { background: var(--green); box-shadow: 0 0 8px var(--green); }
.lk-dashboard .chip { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 3px 9px; border-radius: 999px; font: 600 11.5px var(--sans);
  background: hsl(var(--h) 80% 62% / .1); border: 1px solid hsl(var(--h) 80% 62% / .25); color: hsl(var(--h) 85% 82%); }
.lk-dashboard .chip i { width: 6px; height: 6px; border-radius: 50%; background: hsl(var(--h) 80% 62%); flex: none; }
.lk-dashboard .chip span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-dashboard .c-s { display: flex; align-items: center; gap: 8px; }
.lk-dashboard .c-s .n { font: 700 12.5px var(--mono); width: 26px; text-align: right; font-variant-numeric: tabular-nums; }
.lk-dashboard .c-s .bar { flex: 1; height: 6px; border-radius: 4px; background: rgba(255,255,255,.06); overflow: hidden; }
.lk-dashboard .c-s .bar i { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, hsl(var(--h) 80% 55% / .7), hsl(var(--h) 85% 70%));
  transform-origin: left; animation: dbGrow 1s var(--spring) backwards; animation-delay: calc(var(--k, 0) * 28ms + 600ms); }
@keyframes dbGrow { from { transform: scaleX(0); } }
.lk-dashboard .c-a { font: 700 12.5px var(--mono); color: var(--ink-3); display: flex; align-items: center; gap: 4px; }
.lk-dashboard .c-a.has { color: #5eead4; }
.lk-dashboard .c-a svg.i { width: 14px; height: 14px; }
.lk-dashboard .c-m { display: flex; gap: 4px; min-width: 0; overflow: hidden; }
.lk-dashboard .c-l { font-size: 12.5px; color: var(--ink-2); white-space: nowrap; }
.lk-dashboard .play { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; color: #a5f3fc; background: rgba(34,211,238,.1); border: 1px solid rgba(103,232,249,.3);
  transition: transform .4s var(--spring), background .2s, box-shadow .2s; }
.lk-dashboard .play svg.i { width: 13px; height: 13px; fill: currentColor; }
.lk-dashboard .play:hover { transform: scale(1.15); background: rgba(34,211,238,.25); box-shadow: 0 0 16px rgba(34,211,238,.4); }
.lk-dashboard .tb-empty { padding: 30px; text-align: center; color: var(--ink-3); }

/* Feed */
.lk-dashboard .a-feed .fd { flex: 1; min-height: 0; overflow: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.14) transparent; padding: 8px 8px 10px; }
.lk-dashboard .fi { position: relative; display: grid; grid-template-columns: 46px minmax(0, 1fr); gap: 10px; width: 100%; text-align: left; padding: 8px 8px; border-radius: 10px;
  transition: background .2s; animation: dbFeed .7s var(--spring) backwards; animation-delay: calc(var(--k) * 45ms + 500ms); }
@keyframes dbFeed { from { opacity: 0; transform: translateX(14px); } }
.lk-dashboard .fi:hover { background: rgba(255,255,255,.045); }
.lk-dashboard .fi.sel { background: rgba(34,211,238,.08); }
.lk-dashboard .fi .tm { font: 700 12px var(--mono); color: var(--ink-2); padding-top: 1px; }
.lk-dashboard .fi .tm small { display: block; font-weight: 500; font-size: 10.5px; color: var(--ink-3); }
.lk-dashboard .fi::before { content: ""; position: absolute; left: 54px; top: 13px; width: 2px; bottom: -9px; background: rgba(255,255,255,.06); }
.lk-dashboard .fi:last-child::before { display: none; }
.lk-dashboard .fi .bd { min-width: 0; position: relative; padding-left: 10px; }
.lk-dashboard .fi .bd::before { content: ""; position: absolute; left: -9px; top: 5px; width: 8px; height: 8px; border-radius: 50%; background: hsl(var(--h) 80% 62%); box-shadow: 0 0 8px hsl(var(--h) 80% 62% / .8); }
.lk-dashboard .fi .sn { font-size: 11px; color: hsl(var(--h) 70% 76%); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
.lk-dashboard .fi .tx { font-size: 12.5px; color: var(--ink); line-height: 1.38; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-top: 1px; }
.lk-dashboard .fi .tm .new { display: inline-block; margin-top: 3px; font: 800 9px var(--mono); letter-spacing: .1em; color: #05060a; background: #4ade80; padding: 1px 4px; border-radius: 4px; }

/* Agent graph */
.lk-dashboard .ag { position: relative; height: 150px; margin: 4px 8px 4px; cursor: pointer; }
.lk-dashboard .ag > svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.lk-dashboard .ag .thr { fill: none; stroke: url(#dbThr); stroke-width: 1.5; opacity: .75; stroke-dasharray: 1; stroke-dashoffset: 1; animation: dbDraw 1.1s cubic-bezier(.6,0,.2,1) forwards; animation-delay: calc(var(--k) * 90ms + 700ms); }
.lk-dashboard .an { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 3px; text-align: center; animation: dbPop .8s var(--spring) backwards; animation-delay: calc(var(--k) * 90ms + 500ms); }
@keyframes dbPop { from { opacity: 0; transform: translate(-50%, -50%) scale(.4); } }
.lk-dashboard .an .orb { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; color: #a5f3fc; background: radial-gradient(circle at 35% 30%, rgba(45,212,191,.35), rgba(13,18,28,.95));
  border: 1px solid rgba(94,234,212,.45); box-shadow: 0 0 14px rgba(45,212,191,.25); transition: transform .4s var(--spring); }
.lk-dashboard .an .orb svg.i { width: 15px; height: 15px; }
.lk-dashboard .an:hover .orb { transform: scale(1.18); }
.lk-dashboard .an.main .orb { width: 42px; height: 42px; color: #fff; background: radial-gradient(circle at 30% 30%, #b9a6ff, #5b3cff); border-color: rgba(196,181,255,.6); box-shadow: 0 0 26px rgba(139,108,255,.55); }
.lk-dashboard .an.main .orb svg.i { width: 20px; height: 20px; }
.lk-dashboard .an .orb { position: relative; }
.lk-dashboard .an .ring { position: absolute; inset: 0; animation: dbSpin 14s linear infinite; pointer-events: none; }
.lk-dashboard .an .ring i { position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px; border-radius: 50%; background: #5eead4; box-shadow: 0 0 6px #2dd4bf; transform: rotate(var(--a)) translateX(23px); }
@keyframes dbSpin { to { transform: rotate(360deg); } }
.lk-dashboard .an .orb em { position: absolute; right: -14px; top: -8px; font: 800 10.5px var(--mono); font-style: normal; padding: 1px 5px; border-radius: 999px; background: #2dd4bf; color: #04110f; box-shadow: 0 0 10px rgba(45,212,191,.6); }
.lk-dashboard .an b { margin-top: 3px; font-size: 11px; font-weight: 700; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.lk-dashboard .ag-f { display: flex; align-items: center; gap: 8px; padding: 0 16px 13px; font-size: 12px; color: var(--ink-2); min-width: 0; }
.lk-dashboard .ag-f span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.lk-dashboard .ag-empty { padding: 26px 16px; color: var(--ink-3); font-size: 12.5px; text-align: center; }

/* Donut */
.lk-dashboard .mo { display: grid; grid-template-columns: 88px minmax(0, 1fr); gap: 16px; align-items: center; padding: 8px 16px 12px; }
.lk-dashboard .mo svg { width: 88px; height: 88px; transform: rotate(-90deg); overflow: visible; }
.lk-dashboard .mo .arc { fill: none; stroke-width: 11; transition: stroke-dasharray 1.4s cubic-bezier(.6,0,.2,1); }
.lk-dashboard .mo .dn { position: relative; }
.lk-dashboard .mo .dn .c { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; font: 700 15px/1.1 var(--mono); }
.lk-dashboard .mo .dn .c small { display: block; font: 600 10px var(--sans); color: var(--ink-3); }
.lk-dashboard .mo ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; min-width: 0; }
.lk-dashboard .mo li { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; gap: 8px; align-items: center; font-size: 12.5px; }
.lk-dashboard .mo li i { width: 10px; height: 10px; border-radius: 3px; background: var(--c); box-shadow: 0 0 8px var(--c); }
.lk-dashboard .mo li span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lk-dashboard .mo li b { font: 700 12px var(--mono); color: var(--ink-2); }
.lk-dashboard .mo li small { grid-column: 2 / 4; margin-top: -5px; font-size: 11px; color: var(--ink-3); }

@media (prefers-reduced-motion: reduce) {
  .lk-dashboard *, .lk-dashboard *::before, .lk-dashboard *::after { animation-duration: 1ms !important; animation-delay: 0s !important; transition-duration: 1ms !important; }
}
`;

  const MODEL_C = { opus: "#8b6cff", sonnet: "#60a5fa", haiku: "#4ade80", fable: "#fb923c", x: "#94a3b8" };
  // Small inline icons the shell does not provide
  const svgI = (d) => `<svg class="i" viewBox="0 0 24 24">${d}</svg>`;
  const I_CHIP = svgI('<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3"/>');
  const I_STEP = svgI('<path d="M4 18h4v-4h4v-4h4V6h4"/>');
  const I_COST = svgI('<path d="M12 3.5v17M16 7.5c-.8-1.2-2.2-2-4-2-2.2 0-4 1.2-4 3s1.6 2.6 4 3.2 4 1.4 4 3.3-1.8 3-4 3c-1.9 0-3.4-.9-4.2-2.2"/>');
  const I_CAL = svgI('<rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>');

  let api = null; // per-mount handle for onSelect

  function render(root, A) {
    const D = A.DATA, S = D.sessions, esc = A.esc;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ac = new AbortController(), sig = { signal: ac.signal };
    const timers = []; let dead = false;
    A.onCleanup(() => { dead = true; ac.abort(); timers.forEach(clearTimeout); ro.disconnect(); api = null; });
    const SPRING = getComputedStyle(document.documentElement).getPropertyValue("--spring").trim() || "cubic-bezier(.2,.9,.3,1.15)";

    // ---------- Daily series over the last 30 days ----------
    const N = 30, end = new Date(D.generatedAt); end.setHours(0, 0, 0, 0);
    const days = Array.from({ length: N }, (_, i) => { const d = new Date(end); d.setDate(d.getDate() - (N - 1 - i)); return { d, steps: 0, sess: new Map(), agents: 0, cost: 0 }; });
    const dIdx = new Map(days.map((x, i) => [x.d.toDateString(), i]));
    const key = (ts) => new Date(ts).toDateString();
    const allDays = new Set();
    for (const s of S) {
      for (const n of s.nodes) {
        allDays.add(key(n.ts));
        const i = dIdx.get(key(n.ts)); if (i == null) continue;
        days[i].steps++; days[i].sess.set(s.id, (days[i].sess.get(s.id) || 0) + 1);
      }
      for (const a of s.agents) { const i = dIdx.get(key(a.start)); if (i != null) days[i].agents++; }
      const ci = dIdx.get(key(s.end)); if (ci != null) days[ci].cost += s.cost?.usd || 0;
    }
    const last7 = (f) => days.slice(-7).reduce((n, x) => n + f(x), 0);
    const activeIn30 = days.filter((x) => x.steps).length;
    const kpis = [
      { k: "Sessions", c: "#22d3ee", ic: A.ic("grid"), v: D.totals.sessions, int: true, s: `7 Tage <b>${new Set(days.slice(-7).flatMap((x) => [...x.sess.keys()])).size}</b> aktiv`, ser: days.map((x) => x.sess.size) },
      { k: "Schritte", c: "#a78bfa", ic: I_STEP, v: D.totals.steps, int: true, s: `7 Tage <b>${last7((x) => x.steps)}</b>`, ser: days.map((x) => x.steps) },
      { k: "Agents", c: "#2dd4bf", ic: A.ic("bot"), v: D.totals.agents, int: true, s: `in <b>${S.filter((s) => s.agents.length).length}</b> Sessions`, ser: days.map((x) => x.agents) },
      { k: "Kosten", c: "#fbbf24", ic: I_COST, v: D.totals.cost, int: false, s: `7 Tage <b>${A.usd(last7((x) => x.cost))}</b>`, ser: days.map((x) => x.cost) },
      { k: "Aktive Tage", c: "#fb7185", ic: I_CAL, v: allDays.size, int: true, s: `<b>${activeIn30}</b> von 30 Tagen`, ser: days.map((x) => (x.steps ? 1 : 0)), bars: true },
    ];

    // Monotone cubic path (no overshoot below the baseline)
    const smooth = (p) => {
      const n = p.length; if (n < 2) return "";
      const dx = [], m = [], t = [];
      for (let i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
      t[0] = m[0]; t[n - 1] = m[n - 2];
      for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
      for (let i = 0; i < n - 1; i++) {
        if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
        const a = t[i] / m[i], b = t[i + 1] / m[i], h = a * a + b * b;
        if (h > 9) { const k = 3 / Math.sqrt(h); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
      }
      let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
      for (let i = 0; i < n - 1; i++) {
        const h = dx[i] / 3;
        d += ` C${(p[i][0] + h).toFixed(1)},${(p[i][1] + t[i] * h).toFixed(1)} ${(p[i + 1][0] - h).toFixed(1)},${(p[i + 1][1] - t[i + 1] * h).toFixed(1)} ${p[i + 1][0].toFixed(1)},${p[i + 1][1].toFixed(1)}`;
      }
      return d;
    };
    const spark = (k, i) => {
      const W = 120, H = 38, ser = k.ser, max = Math.max(...ser, 1e-9);
      if (k.bars) {
        const bw = W / ser.length;
        return `<svg class="sp" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${ser.map((v, j) => `<rect style="--k:${j};opacity:${v ? .85 : .18}" x="${(j * bw + .6).toFixed(1)}" y="${v ? 6 : H - 3}" width="${(bw - 1.4).toFixed(1)}" height="${v ? H - 6 : 3}" rx="1"/>`).join("")}</svg>`;
      }
      const pts = ser.map((v, j) => [j / (ser.length - 1) * W, H - 3 - v / max * (H - 8)]);
      const d = smooth(pts);
      return `<svg class="sp" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="dbSp${i}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${k.c}" stop-opacity=".32"/><stop offset="1" stop-color="${k.c}" stop-opacity="0"/></linearGradient></defs>
        <path class="ar" d="${d} L${W},${H} L0,${H} Z" fill="url(#dbSp${i})"/><path class="ln" pathLength="1" vector-effect="non-scaling-stroke" d="${d}"/></svg>`;
    };

    // ---------- Feed, agents, models ----------
    const feed = S.flatMap((s) => s.nodes.map((n) => ({ s, n }))).sort((a, b) => b.n.ts.localeCompare(a.n.ts)).slice(0, 16);
    const today = new Date(D.generatedAt).toDateString();
    const agS = S.reduce((best, s) => (s.agents.length > (best?.agents.length || 0) ? s : best), null);
    const fam = new Map();
    for (const s of S) for (const [m, v] of Object.entries(s.models || {})) {
      const mi = A.modelInfo(m), cur = fam.get(mi.name) || { name: mi.name, fam: mi.fam, r: 0, t: 0, s: new Set() };
      cur.r += v?.replies || 0; cur.t += v?.tokens || 0; cur.s.add(s.id); fam.set(mi.name, cur);
    }
    const models = [...fam.values()].sort((a, b) => b.r - a.r), totR = models.reduce((n, m) => n + m.r, 0) || 1;
    const R = 44, C = 2 * Math.PI * R;
    let acc = 0;
    const arcs = models.map((m) => { const len = m.r / totR * C, o = acc; acc += len; return { m, len: Math.max(0, len - (models.length > 1 ? 2 : 0)), o }; });
    const famCount = {};
    const mColor = (m) => { const n = famCount[m.fam] = (famCount[m.fam] || 0) + 1; return n === 1 ? MODEL_C[m.fam] : `color-mix(in srgb, ${MODEL_C[m.fam]} ${100 - n * 22}%, white)`; };
    models.forEach((m) => { m.c = mColor(m); });

    const maxSteps = Math.max(...S.map((s) => s.nodes.length), 1);
    const fmtDay = (d) => d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
    const genTime = A.hhmm(D.generatedAt);
    const liveN = S.filter((s) => s.live).length;

    // ---------- Markup ----------
    root.innerHTML = `<div class="db">
      <nav class="db-rail" aria-label="Bereiche">
        <div class="db-logo"><span>SA</span></div>
        <div class="db-nav"><div class="db-pill"></div>
          <button class="on" data-nav="top">${A.ic("grid")}<span>Übersicht</span></button>
          <button data-nav="proj">${A.ic("folder")}<span>Projekte</span></button>
          <button data-nav="agents">${A.ic("bot")}<span>Agents</span></button>
          <button data-nav="models">${I_CHIP}<span>Modelle</span></button>
        </div>
        <div class="foot"><span class="dot ${liveN ? "live" : ""}"></span>${liveN ? "LIVE" : "RUHE"}</div>
      </nav>
      <main class="db-main">
        <header class="db-top">
          <div><div class="eb">Session Atlas · Mission Control</div><h1>Übersicht</h1></div>
          <div class="r">
            <span class="db-badge"><span class="pulse"></span>${liveN ? `<b>${liveN}</b> läuft gerade` : "Alles ruhig"}</span>
            <span class="db-badge">Projekte <b>${D.projects.length}</b></span>
            <span class="db-badge">Stand <b>${esc(genTime)}</b></span>
          </div>
        </header>
        <section class="db-kpis">${kpis.map((k, i) => `<div class="db-p db-kpi" style="--i:${i};--c:${k.c}">
            <div class="kh"><span class="ico">${k.ic}</span>${k.k}</div>
            <div class="kv" data-count="${k.v}" ${k.int ? "data-int" : ""}>${k.int ? 0 : "$0.00"}</div>
            <div class="ks">${k.s}</div>${spark(k, i)}</div>`).join("")}</section>
        <section class="db-grid">
          <div class="db-p a-chart" style="--i:5" data-sec="top">
            <div class="db-ph"><h3>Aktivität</h3><span class="sub">Schritte pro Tag · letzte 30 Tage</span>
              <div class="r"><span class="lg" style="--c:#67e8f9"><i></i>Schritte</span><span class="lg" style="--c:rgba(139,108,255,.6)"><i class="b"></i>Sessions</span></div></div>
            <div class="ch-wrap"><svg data-chart></svg><div class="ch-tip"></div></div>
          </div>
          <div class="db-p a-table" style="--i:6" data-sec="proj">
            <div class="db-ph"><h3>Sessions</h3><span class="sub" data-count-lbl></span>
              <div class="r"><span data-daychip></span><label class="db-filter">${A.ic("search")}<input data-q placeholder="Titel, Projekt oder Modell filtern" aria-label="Sessions filtern"><kbd>/</kbd></label></div></div>
            <div class="tb">
              <div class="tb-r tb-h">
                <button data-sort="title">Titel<span class="ar">↓</span></button><button data-sort="proj">Projekt<span class="ar">↓</span></button>
                <button data-sort="steps">Schritte<span class="ar">↓</span></button><button data-sort="agents">Agents<span class="ar">↓</span></button>
                <button data-sort="models">Modelle<span class="ar">↓</span></button><button data-sort="last" class="on">Zuletzt<span class="ar">↓</span></button><span></span>
              </div>
              <div class="tb-body" data-body></div>
            </div>
          </div>
          <div class="db-side">
            <div class="db-p a-feed" style="--i:7">
              <div class="db-ph"><h3>Live-Feed</h3><span class="sub">neueste Schritte</span><div class="r"><span class="dot live"></span></div></div>
              <div class="fd">${feed.map(({ s, n }, k) => {
                const isToday = key(n.ts) === today, fresh = Date.parse(D.generatedAt) - Date.parse(n.ts) < 30 * 60e3;
                return `<button class="fi" data-feed="${esc(s.id)}" data-step="${esc(n.id)}" style="--k:${k};--h:${s.hue}" title="${esc(s.label)}">
                  <span class="tm">${A.hhmm(n.ts)}<small>${isToday ? "heute" : esc(A.day(n.ts))}</small>${fresh ? `<span class="new">NEU</span>` : ""}</span>
                  <span class="bd"><span class="sn" style="display:block">${esc(s.projName)} · ${esc(s.label)}</span><span class="tx">${esc(n.text.replace(/\s+/g, " ").slice(0, 200)) || "(ohne Text)"}</span></span>
                  </button>`;
              }).join("")}</div>
            </div>
            <div class="db-p a-ag" style="--i:8" data-sec="agents">
              <div class="db-ph"><h3>Agents</h3><span class="sub">${agS ? `größtes Team · ${1 + agS.agents.length} beteiligt` : "keine Subagents"}</span></div>
              ${agS ? `<div class="ag" data-ag title="Session öffnen"></div>
                <div class="ag-f"><span class="chip" style="--h:${agS.hue};flex:none"><i></i><span>${esc(agS.projName)}</span></span><span>${esc(agS.label)}</span></div>`
                : `<div class="ag-empty">Bisher hat Claude überall allein gearbeitet.</div>`}
            </div>
            <div class="db-p a-mo" style="--i:9" data-sec="models">
              <div class="db-ph"><h3>Modelle</h3><span class="sub">Anteil der Antworten</span></div>
              <div class="mo"><div class="dn"><svg viewBox="0 0 104 104"><circle cx="52" cy="52" r="${R}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="11"/>
                ${arcs.map((a) => `<circle class="arc" cx="52" cy="52" r="${R}" stroke="${a.m.c}" stroke-dasharray="0 ${C}" data-len="${a.len.toFixed(2)}" stroke-dashoffset="${(-a.o).toFixed(2)}" style="filter:drop-shadow(0 0 5px ${a.m.c})"/>`).join("")}</svg>
                <div class="c"><div>${models[0] ? Math.round(models[0].r / totR * 100) : 0}%<small>${esc(models[0]?.name || "-")}</small></div></div></div>
                <ul>${models.slice(0, 4).map((m) => `<li style="--c:${m.c}"><i></i><span>${esc(m.name)}</span><b>${Math.round(m.r / totR * 100)}%</b><small>${m.r.toLocaleString("de-DE")} Antworten · ${A.fmtTok(m.t)} Tokens · ${m.s.size} Sessions</small></li>`).join("") || `<li><span class="cap">Keine Modelldaten</span></li>`}</ul></div>
            </div>
          </div>
        </section>
      </main></div>`;

    const $ = (s) => root.querySelector(s);

    // ---------- Count-up ----------
    root.querySelectorAll("[data-count]").forEach((el, i) => {
      const to = +el.dataset.count, isInt = el.hasAttribute("data-int");
      const fmt = (v) => (isInt ? Math.round(v).toLocaleString("de-DE") : `$${v.toFixed(2)}`);
      if (reduce) { el.textContent = fmt(to); return; }
      const t0 = performance.now() + 250 + i * 80, dur = 1300;
      const tick = (t) => { if (dead) return; const k = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(2, -10 * k); el.textContent = fmt(k >= 1 ? to : to * e); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      timers.push(setTimeout(() => { el.textContent = fmt(to); }, 2600));
    });
    // Cursor-following light in KPI cards
    $(".db-kpis").addEventListener("pointermove", (e) => { const t = e.target.closest(".db-kpi"); if (!t) return; const r = t.getBoundingClientRect(); t.style.setProperty("--mx", `${e.clientX - r.left}px`); t.style.setProperty("--my", `${e.clientY - r.top}px`); }, sig);

    // ---------- Activity chart ----------
    const chWrap = $(".ch-wrap"), chSvg = $("[data-chart]"), tip = $(".ch-tip");
    let geo = null, pickDay = null, first = true;
    const drawChart = () => {
      const W = chWrap.clientWidth, H = chWrap.clientHeight; if (!W) return;
      const pl = 34, pr = 8, pt = 12, pb = 22, iw = W - pl - pr, ih = H - pt - pb;
      const maxS = Math.max(...days.map((x) => x.steps), 4), nice = Math.ceil(maxS / 4 / 5) * 5 || 1, top = nice * 4;
      const maxSess = Math.max(...days.map((x) => x.sess.size), 1);
      const X = (i) => pl + (i / (N - 1)) * iw, Y = (v) => pt + ih - (v / top) * ih;
      const pts = days.map((x, i) => [X(i), Y(x.steps)]), d = smooth(pts), bw = Math.max(3, iw / N * 0.5);
      geo = { X, Y, pl, iw, W, pts };
      const anim = first && !reduce;
      chSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      chSvg.innerHTML = `<defs>
          <linearGradient id="dbLineG" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#8b6cff"/><stop offset=".55" stop-color="#22d3ee"/><stop offset="1" stop-color="#67e8f9"/></linearGradient>
          <linearGradient id="dbAreaG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#22d3ee" stop-opacity=".28"/><stop offset=".7" stop-color="#8b6cff" stop-opacity=".05"/><stop offset="1" stop-color="#8b6cff" stop-opacity="0"/></linearGradient>
          <clipPath id="dbReveal"><rect x="0" y="-20" height="${H + 40}" width="${anim ? 0 : W}">${anim ? `<animate attributeName="width" from="0" to="${W}" begin="0.45s" dur="1.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".55 0 .2 1"/>` : ""}</rect></clipPath></defs>
        <g class="ch-grid">${[0, 1, 2, 3, 4].map((k) => `<line x1="${pl}" x2="${W - pr}" y1="${Y(nice * k)}" y2="${Y(nice * k)}"/><text class="ch-ax" x="${pl - 8}" y="${Y(nice * k) + 3.5}" text-anchor="end">${nice * k}</text>`).join("")}</g>
        ${days.map((x, i) => (i % 5 === 4 || i === 0) && i !== N - 1 ? `<text class="ch-ax" x="${X(i)}" y="${H - 4}" text-anchor="middle">${x.d.getDate()}.${x.d.getMonth() + 1}.</text>` : "").join("")}
        <text class="ch-ax" x="${X(N - 1)}" y="${H - 4}" text-anchor="end">heute</text>
        <g>${days.map((x, i) => x.sess.size ? `<rect class="ch-bar ${pickDay === i ? "pick" : ""}" data-bar="${i}" x="${X(i) - bw / 2}" y="${pt + ih - (x.sess.size / maxSess) * ih * 0.45}" width="${bw}" height="${(x.sess.size / maxSess) * ih * 0.45}" rx="2"/>` : "").join("")}</g>
        <g clip-path="url(#dbReveal)"><path d="${d} L${X(N - 1)},${pt + ih} L${pl},${pt + ih} Z" fill="url(#dbAreaG)"/><path class="ch-line" d="${d}"/>
          ${days.map((x, i) => x.steps ? `<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="2.2" fill="#a5f3fc" opacity=".8"/>` : "").join("")}</g>
        <line class="ch-x" y1="${pt}" y2="${pt + ih}"/><circle class="ch-dot" r="5"/>
        <rect data-hit x="${pl - 8}" y="0" width="${iw + 16}" height="${H}" fill="transparent" style="cursor:crosshair"/>`;
      first = false;
    };
    const hoverAt = (clientX) => {
      if (!geo) return null;
      const r = chSvg.getBoundingClientRect(), x = clientX - r.left;
      const i = Math.max(0, Math.min(N - 1, Math.round(((x - geo.pl) / geo.iw) * (N - 1))));
      const [px, py] = geo.pts[i], dd = days[i];
      chSvg.querySelector(".ch-x").setAttribute("x1", px); chSvg.querySelector(".ch-x").setAttribute("x2", px);
      chSvg.querySelector(".ch-dot").setAttribute("cx", px); chSvg.querySelector(".ch-dot").setAttribute("cy", py);
      chSvg.querySelectorAll(".ch-bar.on").forEach((b) => b.classList.remove("on"));
      chSvg.querySelector(`[data-bar="${i}"]`)?.classList.add("on");
      const top = [...dd.sess.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, n]) => ({ s: S.find((s) => s.id === id), n }));
      tip.innerHTML = `<div class="d">${esc(fmtDay(dd.d))}</div><div class="kv">Schritte <b>${dd.steps}</b></div><div class="kv">Sessions <b>${dd.sess.size}</b></div>
        ${dd.agents ? `<div class="kv">Agents <b>${dd.agents}</b></div>` : ""}
        ${top.length ? `<div class="ss">${top.map((t) => `<span><b style="color:hsl(${t.s.hue} 80% 70%)">${t.n}</b> · ${esc(t.s.label)}</span>`).join("")}</div><div class="hint">Klicken filtert die Tabelle</div>` : `<div class="hint">Kein Schritt an diesem Tag</div>`}`;
      const tw = tip.offsetWidth || 190;
      tip.style.left = `${px + 14 + tw > geo.W ? px - tw - 14 : px + 14}px`;
      chWrap.classList.add("hov");
      return i;
    };
    chWrap.addEventListener("pointermove", (e) => hoverAt(e.clientX), sig);
    chWrap.addEventListener("pointerleave", () => chWrap.classList.remove("hov"), sig);
    chWrap.addEventListener("click", (e) => { const i = hoverAt(e.clientX); if (i == null || !days[i].steps) return; setDay(pickDay === i ? null : i); }, sig);
    drawChart();
    let rT; const ro = new ResizeObserver(() => { clearTimeout(rT); rT = setTimeout(() => { if (!dead) drawChart(); }, 100); timers.push(rT); });
    ro.observe(chWrap);

    // ---------- Session table ----------
    const body = $("[data-body]"), qEl = $("[data-q]"), cntLbl = $("[data-count-lbl]"), dayChip = $("[data-daychip]");
    const rowEls = new Map();
    S.forEach((s, k) => {
      const el = document.createElement("div");
      el.className = "tb-r db-row"; el.dataset.id = s.id; el.tabIndex = 0; el.setAttribute("role", "button");
      el.style.setProperty("--h", s.hue); el.style.setProperty("--k", Math.min(k, 18));
      el.innerHTML = `<div class="c-t"><span class="dot ${s.live ? "live" : ""}"></span><span class="tt" title="${esc(s.label)}">${esc(s.label)}</span></div>
        <div><span class="chip" title="${esc(A.short(s.project))}"><i></i><span>${esc(s.projName)}</span></span></div>
        <div class="c-s"><span class="n">${s.nodes.length}</span><span class="bar"><i style="width:${Math.max(4, s.nodes.length / maxSteps * 100).toFixed(1)}%"></i></span></div>
        <div class="c-a ${s.agents.length ? "has" : ""}">${s.agents.length ? `${A.ic("bot")}${s.agents.length}` : "-"}</div>
        <div class="c-m">${s.modelList.slice(0, 2).map(A.mp).join("")}${s.modelList.length > 2 ? `<span class="tag">+${s.modelList.length - 2}</span>` : ""}</div>
        <div class="c-l" title="${esc(A.day(s.end))} ${A.hhmm(s.end)}">${s.live ? `<span style="color:var(--green)">läuft</span>` : esc(A.rel(s.end))}</div>
        <div><button class="play" data-play="${esc(s.id)}" aria-label="Am letzten Schritt öffnen" title="Am letzten Schritt öffnen">${A.ic("play")}</button></div>`;
      rowEls.set(s.id, el);
    });
    const sort = { key: "last", dir: -1 };
    const cmp = {
      title: (a, b) => a.label.localeCompare(b.label, "de"), proj: (a, b) => a.projName.localeCompare(b.projName, "de") || b.end.localeCompare(a.end),
      steps: (a, b) => a.nodes.length - b.nodes.length, agents: (a, b) => a.agents.length - b.agents.length || a.nodes.length - b.nodes.length,
      models: (a, b) => a.modelList.length - b.modelList.length || (a.modelList[0] || "").localeCompare(b.modelList[0] || ""), last: (a, b) => a.end.localeCompare(b.end),
    };
    const applyTable = (animate) => {
      const q = qEl.value.trim().toLowerCase();
      const dayKey = pickDay != null ? days[pickDay].d.toDateString() : null;
      const vis = S.filter((s) => (!q || `${s.label} ${s.projName} ${s.modelList.map((m) => A.modelInfo(m).name).join(" ")} ${s.branch || ""}`.toLowerCase().includes(q))
        && (!dayKey || s.nodes.some((n) => key(n.ts) === dayKey)))
        .sort((a, b) => (sort.key === "proj" ? cmp.proj(a, b) * (sort.dir > 0 ? 1 : -1) : cmp[sort.key](a, b) * sort.dir));
      const before = new Map();
      if (animate) for (const el of body.children) if (el.classList.contains("db-row")) before.set(el, el.getBoundingClientRect().top);
      const keep = new Set(vis.map((s) => s.id));
      for (const [id, el] of rowEls) if (!keep.has(id)) el.remove();
      body.querySelector(".tb-empty")?.remove();
      vis.forEach((s) => body.appendChild(rowEls.get(s.id)));
      if (!vis.length) body.insertAdjacentHTML("beforeend", `<div class="tb-empty">Keine Session passt zum Filter.</div>`);
      cntLbl.textContent = vis.length === S.length ? `${S.length} insgesamt` : `${vis.length} von ${S.length}`;
      if (!animate) return;
      // Re-inserted rows must not replay their CSS entrance
      vis.forEach((s) => { const el = rowEls.get(s.id); el.style.animation = "none"; el.querySelector(".bar i").style.animation = "none"; });
      if (reduce) return;
      vis.forEach((s, k) => {
        const el = rowEls.get(s.id), b = before.get(el), a = el.getBoundingClientRect().top;
        try {
          if (b == null) el.animate([{ opacity: 0, transform: "translateY(10px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 550, easing: SPRING, delay: Math.min(k, 12) * 18 });
          else if (Math.abs(b - a) > 0.5) el.animate([{ transform: `translateY(${b - a}px)` }, { transform: "none" }], { duration: 780, easing: SPRING });
        } catch { /* easing unsupported: no motion */ }
      });
    };
    const setDay = (i) => {
      pickDay = i;
      chSvg.querySelectorAll(".ch-bar").forEach((b) => b.classList.toggle("pick", +b.dataset.bar === i));
      dayChip.innerHTML = i == null ? "" : `<button class="daychip" data-clearday>${esc(fmtDay(days[i].d))} ${A.ic("x")}</button>`;
      applyTable(true);
    };
    const setSort = (k) => {
      if (sort.key === k) sort.dir *= -1; else { sort.key = k; sort.dir = k === "title" || k === "proj" ? 1 : -1; }
      root.querySelectorAll("[data-sort]").forEach((b) => { b.classList.toggle("on", b.dataset.sort === sort.key); b.classList.toggle("up", b.dataset.sort === sort.key && sort.dir > 0); });
      applyTable(true);
    };
    applyTable(false);
    qEl.addEventListener("input", () => applyTable(true), sig);

    // ---------- Agent mini graph ----------
    const agEl = $("[data-ag]");
    const drawAgents = () => {
      if (!agEl || !agS) return;
      const W = agEl.clientWidth, H = agEl.clientHeight; if (!W) return;
      // Up to 6 agents individually, more get grouped by type with a count badge
      let items = agS.agents.map((a) => ({ label: A.aName(a.type), n: 1, node: a.node, title: `${A.aName(a.type)}: ${a.description || ""}` }));
      if (items.length > 6) {
        const gm = new Map();
        for (const a of agS.agents) { const k = A.aName(a.type), g = gm.get(k) || { label: k, n: 0, node: a.node, title: "" }; g.n++; g.title = `${k}: ${g.n} Agents`; gm.set(k, g); }
        items = [...gm.values()].sort((a, b) => b.n - a.n).slice(0, 6);
      }
      const n = items.length, cx = W / 2, cy = 28, stag = n > 3;
      const pos = items.map((_, i) => { const t = n === 1 ? 0.5 : i / (n - 1); return { x: n === 1 ? cx : 34 + t * (W - 68), y: stag ? (i % 2 ? H - 26 : H - 62) : H - 40 }; });
      const lw = Math.min(120, stag ? (W - 20) / Math.ceil(n / 2) : (W - 20) / n);
      agEl.innerHTML = `<svg viewBox="0 0 ${W} ${H}"><defs><linearGradient id="dbThr" gradientUnits="userSpaceOnUse" x1="0" y1="${cy}" x2="0" y2="${H}"><stop offset="0" stop-color="#8b6cff"/><stop offset="1" stop-color="#2dd4bf"/></linearGradient>
          <radialGradient id="dbPt"><stop offset="0" stop-color="#e6fffb"/><stop offset=".4" stop-color="#5eead4"/><stop offset="1" stop-color="#5eead4" stop-opacity="0"/></radialGradient></defs>
        ${pos.map((p, i) => { const thr = Math.min(3, items[i].n), out = [];
          for (let q = 0; q < thr; q++) { const o = (q - (thr - 1) / 2) * 14, id = `dbth${i}_${q}`;
            out.push(`<path class="thr" pathLength="1" id="${id}" style="--k:${i}" d="M${cx},${cy + 20} C${cx + o},${cy + (p.y - cy) * 0.55} ${p.x + o},${cy + (p.y - cy) * 0.35} ${p.x},${p.y - 16}"/>`);
            if (!reduce) out.push([0, 1].map((j) => `<circle r="${j ? 2.5 : 4}" fill="url(#dbPt)" opacity="0"><set attributeName="opacity" to="1" begin="${1.6 + i * 0.15 + q * 0.4 + j * 1.1}s"/><animateMotion dur="${2 + i * 0.23 + q * 0.3}s" repeatCount="indefinite" begin="${1.6 + i * 0.15 + q * 0.4 + j * 1.1}s"><mpath href="#${id}"/></animateMotion></circle>`).join(""));
          }
          return out.join(""); }).join("")}</svg>
        <div class="an main" style="left:${cx}px;top:${cy}px;--k:0"><span class="orb">${A.ic("bot")}</span></div>
        ${items.map((a, i) => `<div class="an" data-agstep="${esc(a.node || "")}" style="left:${pos[i].x}px;top:${pos[i].y}px;--k:${i + 1};width:${lw}px" title="${esc(a.title)}"><span class="orb">${A.ic("bot")}${a.n > 1 ? `<span class="ring">${Array.from({ length: Math.min(a.n, 14) }, (_, k) => `<i style="--a:${(k / Math.min(a.n, 14)) * 360}deg"></i>`).join("")}</span><em>×${a.n}</em>` : ""}</span><b>${esc(a.label)}</b></div>`).join("")}`;
    };
    drawAgents();
    const ro2 = new ResizeObserver(() => { if (!dead) drawAgents(); });
    if (agEl) { ro2.observe(agEl); A.onCleanup(() => ro2.disconnect()); }
    // Donut sweep in
    timers.push(setTimeout(() => root.querySelectorAll(".mo .arc").forEach((c) => c.setAttribute("stroke-dasharray", `${c.dataset.len} ${C}`)), reduce ? 0 : 700));

    // ---------- Nav rail ----------
    const pill = $(".db-pill");
    const placePill = (btn) => { pill.style.top = `${btn.offsetTop}px`; pill.style.height = `${btn.offsetHeight}px`; };
    placePill($(".db-nav button.on"));
    const flash = (el) => { if (!el) return; el.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }); el.classList.add("flash"); timers.push(setTimeout(() => el.classList.remove("flash"), 1100)); };

    // ---------- Events ----------
    root.addEventListener("click", (e) => {
      const t = e.target;
      const play = t.closest("[data-play]"); if (play) { const s = S.find((x) => x.id === play.dataset.play); return A.open(s.id, s.last?.id); }
      const sb = t.closest("[data-sort]"); if (sb) return setSort(sb.dataset.sort);
      if (t.closest("[data-clearday]")) return setDay(null);
      const fi = t.closest("[data-feed]"); if (fi) return A.open(fi.dataset.feed, fi.dataset.step);
      const an = t.closest("[data-agstep]"); if (an && agS) return A.open(agS.id, an.dataset.agstep || undefined);
      if (t.closest("[data-ag]") && agS) return A.open(agS.id);
      const row = t.closest(".db-row"); if (row) return A.open(row.dataset.id);
      const nb = t.closest("[data-nav]");
      if (nb) {
        root.querySelectorAll("[data-nav]").forEach((b) => b.classList.toggle("on", b === nb)); placePill(nb);
        const v = nb.dataset.nav;
        if (v === "top") { root.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); flash($(".a-chart")); }
        if (v === "proj") { if (sort.key !== "proj") setSort("proj"); flash($(".a-table")); }
        if (v === "agents") { if (sort.key !== "agents") setSort("agents"); flash($(".a-ag")); }
        if (v === "models") flash($(".a-mo"));
      }
    }, sig);
    root.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.classList?.contains("db-row")) A.open(e.target.dataset.id); }, sig);
    document.addEventListener("keydown", (e) => { if (e.key === "/" && !e.target.matches("input,textarea,[contenteditable]")) { e.preventDefault(); qEl.focus(); } }, sig);

    api = {
      select(id) {
        for (const [k, el] of rowEls) el.classList.toggle("sel", k === id);
        root.querySelectorAll(".fi").forEach((f) => f.classList.toggle("sel", f.dataset.feed === id));
        if (id) rowEls.get(id)?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
      },
    };
  }

  Atlas.register({ key: "dashboard", name: "Mission Dashboard", tagline: "Profi-Dashboard mit Live-Charts", css, render, onSelect: (id) => api?.select(id), wantsArrows: false });
})();
