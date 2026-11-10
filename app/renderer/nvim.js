// Look "nvim": the columns look grown into a real Neovim - dashboard, bufferline, neo-tree, windows with
// relative numbers and signs, spring cables with particles, lualine, cmdline, Telescope, which-key, notify.
(() => {
  const css = `
.lk-nvim { --bgh:#1d2021; --bg0:#282828; --bg1:#3c3836; --bg2:#504945; --bg3:#665c54; --fg:#ebdbb2; --fg2:#d5c4a1; --fg3:#bdae93; --fg4:#a89984; --gr:#928374;
  --rd:#fb4934; --gn:#b8bb26; --ye:#fabd2f; --bl:#83a598; --pu:#d3869b; --aq:#8ec07c; --or:#fe8019; --rh:22px; --tw:222px; --gut:40px;
  font: 500 12.5px/1.4 var(--mono); color:var(--fg); overflow:hidden;
  background: radial-gradient(1200px 700px at 8% -12%, rgba(250,189,47,.09), transparent 60%), radial-gradient(1000px 700px at 108% 118%, rgba(142,192,124,.09), transparent 60%), #0c0d0e; }
.lk-nvim [hidden] { display:none !important; }
.lk-nvim svg.i { width:13px; height:13px; }
.lk-nvim kbd { font:700 10.5px var(--mono); color:var(--fg); background:rgba(235,219,178,.07); border:1px solid rgba(235,219,178,.16); border-bottom-width:2px; border-radius:5px; padding:0 5px; }
.lk-nvim .nv-term { position:absolute; left:12px; right:12px; top:10px; bottom:10px; transition:bottom .5s cubic-bezier(.2,.9,.25,1); display:flex; flex-direction:column; background:var(--bgh); border:1px solid rgba(235,219,178,.1);
  border-radius:12px; overflow:hidden; box-shadow:0 30px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(0,0,0,.6), 0 0 120px rgba(250,189,47,.04); }

/* ---------- dashboard ---------- */
.lk-nvim .nv-dash { flex:1; min-height:0; overflow:auto; scrollbar-width:none; display:flex; flex-direction:column; align-items:center; padding:3.2vh 24px 14px; cursor:default; }
.lk-nvim .nv-dash::-webkit-scrollbar { display:none; }
.lk-nvim .dh-logo { position:relative; font-size:clamp(6.5px, .76vw, 12px); line-height:.94; font-weight:700; white-space:pre; letter-spacing:-.04em; flex:none; }
.lk-nvim .dh-logo .lg { display:block; }
.lk-nvim .dh-logo .lg-fg { position:absolute; inset:0; }
.lk-nvim .dh-logo .lg-sh { color:#504945; }
.lk-nvim .dh-logo .lg-fg span { background:linear-gradient(90deg, #fabd2f 0%, #fe8019 18%, #d3869b 30%, #8ec07c 44%, #83a598 50%, #8ec07c 62%, #fe8019 82%, #fabd2f 100%); background-size:200% 100%;
  -webkit-background-clip:text; background-clip:text; color:transparent; animation:nvShim 9s ease-in-out infinite alternate; filter:drop-shadow(0 0 10px rgba(250,189,47,.28)); }
.lk-nvim .dh-logo span { display:block; clip-path:inset(0 0 0 0); animation:nvType .85s steps(48) both; animation-delay:calc(var(--r) * 90ms); }
.lk-nvim .dh-logo .lg-fg span { animation:nvType .85s steps(48) both, nvShim 9s ease-in-out 1.2s infinite alternate; animation-delay:calc(var(--r) * 90ms), 1.2s; }
@keyframes nvType { from { clip-path:inset(0 100% 0 0); } }
@keyframes nvShim { from { background-position:0% 0; } to { background-position:100% 0; } }
.lk-nvim .dh-sub { margin-top:10px; color:var(--gr); font-style:italic; font-size:12px; text-align:center; }
.lk-nvim .dh-sub b { color:var(--fg3); font-style:normal; font-weight:600; }
.lk-nvim .dh-grid { display:grid; grid-template-columns:minmax(290px, 400px) minmax(400px, 590px); gap:20px 58px; margin-top:22px; width:100%; justify-content:center; }
.lk-nvim .dh-h { color:var(--gr); font-style:italic; font-size:11.5px; margin:0 0 6px; display:flex; gap:8px; align-items:baseline; white-space:nowrap; }
.lk-nvim .dh-h b { font-style:normal; color:var(--fg3); font-weight:600; }
.lk-nvim .dh-h .r { margin-left:auto; font-style:normal; }
.lk-nvim .dh-mi, .lk-nvim .dh-rc { position:relative; display:grid; align-items:center; width:100%; text-align:left; border-radius:6px; padding:0 10px; cursor:pointer;
  animation:nvUp .55s var(--spring) both; animation-delay:calc(450ms + var(--i) * 40ms); }
@keyframes nvUp { from { opacity:0; transform:translateY(8px); } }
.lk-nvim .dh-mi { grid-template-columns:24px 1fr auto; height:30px; font-size:13px; }
.lk-nvim .dh-mi .g { color:var(--c); display:grid; }
.lk-nvim .dh-mi .g svg.i { width:15px; height:15px; }
.lk-nvim .dh-mi .k { color:var(--c); font-weight:800; }
.lk-nvim .dh-mi:hover, .lk-nvim .dh-rc:hover { background:rgba(235,219,178,.04); }
.lk-nvim .dh-mi.on, .lk-nvim .dh-rc.on { background:#32302f; box-shadow:inset 2px 0 0 var(--ye); }
.lk-nvim .dh-mi.on::after, .lk-nvim .dh-rc.on::after { content:""; position:absolute; left:34px; top:7px; bottom:7px; width:2px; background:var(--ye); animation:nvBlink 1.06s steps(1) infinite; }
.lk-nvim .dh-rc { grid-template-columns:26px minmax(0,1fr) auto auto; height:26px; font-size:12px; gap:0 8px; }
.lk-nvim .dh-rc.on::after { left:44px; }
.lk-nvim .dh-rc .k { color:var(--bl); font-weight:800; text-align:center; }
.lk-nvim .dh-rc .t { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--fg2); }
.lk-nvim .dh-rc .p { font-size:11px; white-space:nowrap; max-width:110px; overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .dh-rc .a { font-size:11px; color:var(--bg3); white-space:nowrap; width:28px; text-align:right; }
.lk-nvim .dh-lazy { margin-top:12px; color:var(--gr); font-size:11.5px; padding-left:10px; }
.lk-nvim .dh-lazy b { color:var(--ye); font-weight:600; }
.lk-nvim .dh-right { display:flex; flex-direction:column; gap:14px; min-width:0; border-radius:10px; transition:box-shadow .5s, background .5s; padding:2px 4px; }
.lk-nvim .dh-right.pulse { background:rgba(250,189,47,.035); box-shadow:0 0 0 1px rgba(250,189,47,.3), 0 0 40px rgba(250,189,47,.08); }
.lk-nvim .dh-tot { display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; }
.lk-nvim .dh-tot div { padding:6px 10px 7px; border-left:2px solid var(--c); background:linear-gradient(90deg, color-mix(in srgb, var(--c) 10%, transparent), transparent); border-radius:0 6px 6px 0;
  animation:nvUp .6s var(--spring) both; animation-delay:calc(300ms + var(--i) * 60ms); }
.lk-nvim .dh-tot b { display:block; font-size:21px; font-weight:800; color:var(--c); font-variant-numeric:tabular-nums; line-height:1.15; }
.lk-nvim .dh-tot small { color:var(--fg4); font-size:10.5px; letter-spacing:.06em; text-transform:uppercase; }
.lk-nvim .dh-two { display:grid; grid-template-columns:auto 1fr; gap:24px; align-items:start; }
.lk-nvim .spk { display:flex; gap:8px; align-items:flex-end; }
.lk-nvim .spk-g { font-family:"Apple Braille", "Segoe UI Symbol", var(--mono); font-size:22px; line-height:1; letter-spacing:.22em; white-space:pre;
  background:linear-gradient(0deg, #8ec07c, #fabd2f); -webkit-background-clip:text; background-clip:text; color:transparent; animation:nvReveal 1.1s var(--spring-soft) .5s both; }
.lk-nvim .spk-g span { display:block; }
.lk-nvim .spk-ax { border-top:1px solid #3c3836; margin-top:3px; padding-top:3px; display:flex; justify-content:space-between; font-size:10px; color:var(--bg3); }
.lk-nvim .spk-y { font-size:10px; color:var(--fg4); display:flex; flex-direction:column; justify-content:space-between; height:84px; padding-bottom:16px; }
.lk-nvim .spk-n { font-size:11px; color:var(--fg4); margin-top:6px; }
.lk-nvim .spk-n b { color:var(--ye); }
@keyframes nvReveal { from { clip-path:inset(0 100% 0 0); } to { clip-path:inset(0 0 0 0); } }
.lk-nvim .hm { display:grid; grid-template-columns:auto 1fr; gap:0 6px; font-size:11px; line-height:12px; }
.lk-nvim .hm-d { color:var(--bg3); font-size:9.5px; display:grid; grid-template-rows:repeat(7, 12px); }
.lk-nvim .hm-c { white-space:pre; letter-spacing:.04em; animation:nvReveal 1s var(--spring-soft) .7s both; }
.lk-nvim .hm-c span { cursor:default; }
.lk-nvim .hm-l { grid-column:2; margin-top:5px; color:var(--bg3); font-size:10px; white-space:pre; }
.lk-nvim .pb { display:grid; grid-template-columns:minmax(0,130px) 1fr auto; gap:2px 10px; align-items:center; font-size:11.5px; }
.lk-nvim .pb .n { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--fg3); }
.lk-nvim .pb .b { white-space:pre; color:var(--c); text-shadow:0 0 12px color-mix(in srgb, var(--c) 40%, transparent); overflow:hidden; animation:nvReveal 1s var(--spring-soft) both; animation-delay:calc(600ms + var(--i) * 70ms); }
.lk-nvim .pb .v { color:var(--fg4); font-variant-numeric:tabular-nums; text-align:right; }
.lk-nvim .mb { white-space:pre; font-size:12px; letter-spacing:0; overflow:hidden; animation:nvReveal 1.2s var(--spring-soft) .9s both; }
.lk-nvim .ml { display:flex; gap:14px; flex-wrap:wrap; font-size:11px; color:var(--fg4); margin-top:4px; }
.lk-nvim .ml i { font-style:normal; color:var(--c); }
.lk-nvim .dh-quote { margin-top:20px; color:var(--gr); font-style:italic; font-size:12px; text-align:center; }
.lk-nvim .dh-hint { margin-top:6px; color:var(--bg3); font-size:11px; text-align:center; animation:nvPulse 2.6s ease-in-out infinite; }
@keyframes nvPulse { 50% { opacity:.45; } }

/* ---------- editor: bufferline ---------- */
.lk-nvim .nv-ed { flex:1; min-height:0; display:flex; flex-direction:column; }
.lk-nvim .nv-bl { height:30px; display:flex; align-items:stretch; background:#141617; border-bottom:1px solid #0a0b0b; flex:none; }
.lk-nvim .bl-off { width:var(--tw); flex:none; display:flex; align-items:center; justify-content:center; gap:7px; color:var(--fg3); font-size:11.5px; background:#191b1c; border-right:1px solid #0a0b0b; letter-spacing:.04em; }
.lk-nvim .bl-off svg.i { color:var(--ye); }
.lk-nvim .bl-tabs { flex:1; min-width:0; display:flex; overflow:hidden; }
.lk-nvim .tab { position:relative; display:flex; align-items:center; gap:7px; padding:0 8px 0 13px; max-width:230px; min-width:0; flex:0 1 auto; color:var(--gr); cursor:pointer; border-right:1px solid #0a0b0b; font-size:12px;
  transition:background .2s, color .2s; animation:nvTab .45s var(--spring) both; }
@keyframes nvTab { from { opacity:0; transform:translateY(-6px); } }
.lk-nvim .tab:hover { background:#1b1d1e; color:var(--fg3); }
.lk-nvim .tab.on { background:var(--bgh); color:var(--fg); }
.lk-nvim .tab.on::before { content:""; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--ye); box-shadow:0 0 12px var(--ye); }
.lk-nvim .tab .ico { color:hsl(var(--h) 70% 64%); font-size:10px; }
.lk-nvim .tab .nm { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lk-nvim .tab.pv .nm { font-style:italic; }
.lk-nvim .tab .x { width:18px; height:18px; border-radius:4px; display:grid; place-items:center; flex:none; color:var(--gr); font-size:13px; line-height:1; }
.lk-nvim .tab .x:hover { background:var(--bg1); color:var(--rd); }
.lk-nvim .tab .x .md { color:var(--gn); font-size:10px; }
.lk-nvim .tab:hover .x .md { display:none; }
.lk-nvim .tab .x .cx { display:none; }
.lk-nvim .tab:hover .x .cx, .lk-nvim .tab .x .cx.show { display:inline; }
.lk-nvim .bl-r { margin-left:auto; display:flex; align-items:center; gap:6px; padding:0 12px; color:var(--gr); font-size:11px; white-space:nowrap; }
.lk-nvim .bl-r b { color:#1d2021; background:var(--bl); border-radius:3px; padding:0 6px; font-weight:800; }

/* ---------- editor: windows ---------- */
.lk-nvim .nv-main { position:relative; flex:1; min-height:0; display:grid; grid-template-columns:var(--tw) var(--gut) minmax(0,1.2fr) var(--gut) minmax(0,1.1fr) var(--gut) minmax(0,1.1fr); }
.lk-nvim .nv-w { position:relative; display:flex; flex-direction:column; min-width:0; min-height:0; animation:nvWin .55s var(--spring) both; animation-delay:calc(var(--i, 0) * 60ms); }
@keyframes nvWin { from { opacity:0; transform:translateY(10px); } }
.lk-nvim .nv-w.tree { background:#191b1c; border-right:1px solid #0a0b0b; }
.lk-nvim .sep { position:relative; }
.lk-nvim .sep::before { content:""; position:absolute; left:50%; top:0; bottom:0; width:1px; background:#32302f; }
.lk-nvim .wb { height:27px; display:flex; align-items:center; gap:8px; padding:0 10px; font-size:11.5px; color:var(--gr); border-bottom:1px solid #2a2827; flex:none; white-space:nowrap; position:relative; }
.lk-nvim .wb .n { color:#1d2021; background:var(--bg3); border-radius:3px; padding:0 5px; font-weight:800; transition:background .3s; }
.lk-nvim .wb .f { color:var(--fg4); overflow:hidden; text-overflow:ellipsis; min-width:0; }
.lk-nvim .wb .f b { color:var(--fg2); font-weight:600; }
.lk-nvim .wb .c { margin-left:auto; color:var(--bg3); }
.lk-nvim .nv-w.on .wb { color:var(--fg); }
.lk-nvim .nv-w.on .wb .n { background:var(--ye); }
.lk-nvim .nv-w.on .wb::after { content:""; position:absolute; left:0; right:0; bottom:-1px; height:1px; background:linear-gradient(90deg, var(--ye), rgba(250,189,47,0)); }
.lk-nvim .wl { position:relative; flex:1; min-height:0; overflow:auto; scrollbar-width:none; padding:4px 0 12px; }
.lk-nvim .wl::-webkit-scrollbar { display:none; }
.lk-nvim .nv-w:not(.on) .rows { opacity:.74; }
.lk-nvim .cl { position:absolute; left:0; right:0; top:0; height:var(--rh); background:#282625; pointer-events:none; z-index:0; transition:transform .55s var(--spring), background .3s, box-shadow .3s; }
.lk-nvim .nv-w.on .cl { background:linear-gradient(90deg, rgba(250,189,47,.12), rgba(250,189,47,.035) 70%, rgba(250,189,47,.02)); box-shadow:inset 2px 0 0 var(--ye); }
.lk-nvim .cur { position:absolute; left:var(--cx, 70px); top:0; width:1ch; height:var(--rh); pointer-events:none; z-index:3; transition:transform .55s var(--spring); }
.lk-nvim .cur::before { content:""; position:absolute; left:0; right:0; top:3px; bottom:3px; background:var(--fg); mix-blend-mode:difference; border-radius:1px; animation:nvBlink 1.06s steps(1) infinite; }
.lk-nvim .nv-w:not(.on) .cur { opacity:0; }
@keyframes nvBlink { 50% { opacity:0; } }
.lk-nvim .r { position:relative; z-index:1; height:var(--rh); display:grid; grid-template-columns:22px 36px 14px minmax(0,1fr) auto auto; align-items:center; padding-right:12px; cursor:pointer; white-space:nowrap; }
.lk-nvim .r:hover { background:rgba(235,219,178,.025); }
.lk-nvim .r.vis { background:rgba(211,134,155,.16); }
.lk-nvim .sg { text-align:center; font-weight:800; display:grid; place-items:center; }
.lk-nvim .sg.add { color:var(--gn); } .lk-nvim .sg.bot { color:var(--pu); } .lk-nvim .sg.now { color:var(--aq); text-shadow:0 0 8px var(--aq); } .lk-nvim .sg.live { color:var(--gn); animation:nvPulse 1.4s infinite; }
.lk-nvim .sg svg.i { width:12px; height:12px; }
.lk-nvim .nu { text-align:right; padding-right:9px; color:#5a524c; font-size:11px; font-variant-numeric:tabular-nums; }
.lk-nvim .r.sel .nu { color:var(--ye); font-weight:800; }
.lk-nvim .fc { color:#4a4441; font-size:11px; }
.lk-nvim .fc.o { color:var(--fg4); }
.lk-nvim .tx { overflow:hidden; text-overflow:ellipsis; color:var(--fg2); }
.lk-nvim .r.sel .tx { color:var(--fg); }
.lk-nvim .tx .fz { color:var(--or); font-weight:800; }
.lk-nvim .tx .br { color:var(--pu); }
.lk-nvim .tx .jt { color:#1d2021; background:var(--aq); font-size:9.5px; font-weight:800; padding:0 4px; border-radius:3px; margin-left:6px; }
.lk-nvim .vt { color:#5f5752; font-size:11px; padding-left:10px; max-width:150px; overflow:hidden; text-overflow:ellipsis; font-style:italic; }
.lk-nvim .r.sel .vt { color:var(--fg4); }
.lk-nvim .vt .ag { color:var(--pu); }
.lk-nvim .op { width:20px; height:18px; margin-left:6px; border-radius:4px; display:grid; place-items:center; color:#1d2021; background:var(--ye); font-weight:800; font-size:11px; opacity:0; transform:scale(.5); transition:opacity .2s, transform .35s var(--spring); }
.lk-nvim .r.sel .op { opacity:1; transform:none; }
.lk-nvim .nv-w:not(.on) .r.sel .op { opacity:.5; }
/* tree */
.lk-nvim .tree .r { grid-template-columns:auto 14px 20px minmax(0,1fr) auto; padding-left:8px; }
.lk-nvim .tree .ig { color:#3c3836; white-space:pre; }
.lk-nvim .tree .fo { color:var(--gr); font-size:10px; }
.lk-nvim .tree .fo.o { color:var(--ye); }
.lk-nvim .tree .fi { color:hsl(var(--h) 65% 62%); display:grid; }
.lk-nvim .tree .fi svg.i { width:14px; height:14px; }
.lk-nvim .tree .r.root .tx { color:var(--bl); font-weight:700; }
.lk-nvim .tree .r.proj .tx { color:var(--fg2); }
.lk-nvim .tree .r.sess .tx { color:var(--fg4); font-size:12px; }
.lk-nvim .tree .r.sel .tx { color:var(--fg); }
.lk-nvim .tree .vt { font-style:normal; max-width:none; }
.lk-nvim .tree .vt .cnt { color:var(--bg3); background:rgba(235,219,178,.05); border-radius:8px; padding:0 6px; }
.lk-nvim .tree .r.sel .vt .cnt { color:var(--fg2); background:rgba(250,189,47,.12); }
.lk-nvim .tree .cur { display:none; }
/* scrollbar / minimap */
.lk-nvim .sbar { position:absolute; right:1px; top:31px; bottom:4px; width:7px; z-index:4; pointer-events:none; }
.lk-nvim .sbar .th { position:absolute; left:0; right:0; background:rgba(235,219,178,.11); border-radius:3px; transition:top .25s var(--spring-soft), height .25s; }
.lk-nvim .sbar b { position:absolute; height:2px; border-radius:1px; }
.lk-nvim .sbar b.add { left:0; width:3px; background:var(--gn); } .lk-nvim .sbar b.bot { right:0; width:3px; background:var(--pu); }
.lk-nvim .sbar b.now { left:0; right:0; background:var(--aq); box-shadow:0 0 6px var(--aq); } .lk-nvim .sbar b.cur { left:0; right:0; height:3px; background:var(--ye); transition:top .4s var(--spring); }
/* preview buffer */
.lk-nvim .pv { padding:10px 16px 14px 14px; display:flex; flex-direction:column; gap:7px; font-size:12px; }
.lk-nvim .ty { animation:nvTy .42s cubic-bezier(.3,.7,.2,1) both; animation-delay:calc(var(--i) * 45ms); }
@keyframes nvTy { from { clip-path:inset(0 100% 0 0); opacity:.3; } to { clip-path:inset(0 0 0 0); opacity:1; } }
.lk-nvim .md-h1 { color:var(--or); font-weight:800; font-size:13.5px; line-height:1.35; }
.lk-nvim .md-h1 i, .lk-nvim .md-h2 i { font-style:normal; color:#5f5752; margin-right:6px; font-weight:600; }
.lk-nvim .md-c { color:var(--gr); font-style:italic; font-size:11px; }
.lk-nvim .md-h2 { color:var(--ye); font-weight:700; margin-top:4px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.lk-nvim .md-h2.aq { color:var(--aq); } .lk-nvim .md-h2.bl { color:var(--bl); } .lk-nvim .md-h2.pu { color:var(--pu); }
.lk-nvim .md-q, .lk-nvim .md-a { white-space:pre-wrap; line-height:1.55; border-left:2px solid; padding:2px 0 2px 11px; overflow:hidden; display:-webkit-box; -webkit-box-orient:vertical; overflow-wrap:anywhere; }
.lk-nvim .md-q { color:var(--fg); border-color:var(--ye); -webkit-line-clamp:7; }
.lk-nvim .md-a { color:var(--fg3); border-color:var(--aq); -webkit-line-clamp:11; }
.lk-nvim .md-li { color:var(--fg3); font-size:11.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .md-li i { font-style:normal; color:var(--bl); margin-right:8px; }
.lk-nvim .md-li.ag i { color:var(--pu); }
.lk-nvim .md-li small { color:var(--gr); margin-left:6px; }
.lk-nvim .pv-f { flex:none; padding:9px 12px; border-top:1px solid #2a2827; display:flex; gap:8px; }
.lk-nvim .go { flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:8px 12px; border-radius:7px; font:800 12.5px var(--mono); color:#1d2021;
  background:linear-gradient(135deg, var(--ye), #f5a623); box-shadow:0 6px 24px rgba(250,189,47,.2); transition:transform .35s var(--spring), filter .2s; }
.lk-nvim .go:hover { filter:brightness(1.08); transform:translateY(-1px); }
.lk-nvim .go:active { transform:scale(.96); }
.lk-nvim .go svg.i { fill:#1d2021; }
.lk-nvim .empty { padding:18px 16px; color:var(--gr); font-style:italic; }
/* cables */
.lk-nvim .wires { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:6; overflow:visible; }
.lk-nvim .w-glow { fill:none; stroke-width:7; opacity:.5; }
.lk-nvim .w-core { fill:none; stroke-width:2; stroke-linecap:round; }
.lk-nvim .w-end { fill:#1d2021; stroke-width:2; }
.lk-nvim .w-p { fill:#fff6d8; }
.lk-nvim .w-g { transition:opacity .35s; }
.lk-nvim .w-g.off { opacity:0; }
/* agents buffer */
.lk-nvim .nv-ag { grid-column:3 / -1; }
.lk-nvim .ag-wrap { position:relative; padding:8px 0 20px; }
.lk-nvim .ag-wrap .r { grid-template-columns:22px 36px minmax(0,1fr) auto; }
.lk-nvim .ag-l { display:flex; align-items:center; gap:8px; min-width:0; overflow:hidden; }
.lk-nvim .ag-l .bx { white-space:pre; color:#504945; flex:none; }
.lk-nvim .ag-l .rt { color:hsl(var(--h) 70% 64%); flex:none; text-shadow:0 0 10px hsl(var(--h) 70% 60% / .6); }
.lk-nvim .ag-l .nd { color:var(--bl); flex:none; }
.lk-nvim .ag-l .dt { color:var(--pu); flex:none; text-shadow:0 0 8px var(--pu); }
.lk-nvim .ag-l b { color:var(--fg); font-weight:700; flex:none; }
.lk-nvim .ag-l .sl { color:var(--fg); font-weight:800; overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .ag-l .st { color:var(--fg3); overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .ag-l .ds { color:var(--gr); font-style:italic; overflow:hidden; text-overflow:ellipsis; min-width:0; }
.lk-nvim .ag-r { display:flex; align-items:center; gap:8px; color:var(--fg4); font-size:11px; padding-left:10px; }
.lk-nvim .ag-r .mp { font-size:10px; padding:1px 7px; }
.lk-nvim .ag-r .du { color:var(--ye); }
.lk-nvim .ag-c { color:var(--gr); font-style:italic; padding:0 12px 0 22px; }
.lk-nvim .ag-pt { position:absolute; left:0; top:0; width:6px; height:6px; border-radius:50%; background:#fff1c4; pointer-events:none; z-index:2;
  box-shadow:0 0 6px 2px var(--pc, #d3869b), 0 0 14px 4px color-mix(in srgb, var(--pc, #d3869b) 50%, transparent); offset-rotate:0deg; offset-anchor:50% 50%;
  animation:nvRide var(--d, 2.6s) linear infinite; animation-delay:var(--dl, 0s); }
@keyframes nvRide { 0% { offset-distance:0%; opacity:0; } 8% { opacity:1; } 88% { opacity:1; } 100% { offset-distance:100%; opacity:0; } }
.lk-nvim .ag-line { position:absolute; pointer-events:none; z-index:0; }

/* ---------- statusline + cmdline ---------- */
.lk-nvim .nv-sl { height:24px; display:flex; align-items:stretch; background:#282828; flex:none; font-size:11.5px; white-space:nowrap; position:relative; z-index:8; }
.lk-nvim .nv-sl > span { display:flex; align-items:center; gap:6px; }
.lk-nvim .s-a { background:var(--mc); color:#1d2021; font-weight:800; letter-spacing:.06em; padding:0 18px 0 12px; clip-path:polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%); z-index:3; transition:background .3s; }
.lk-nvim .s-b { background:var(--bg2); color:var(--fg2); margin-left:-9px; padding:0 18px 0 19px; clip-path:polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%); z-index:2; }
.lk-nvim .s-b svg.i { width:12px; height:12px; color:var(--or); }
.lk-nvim .s-c { background:var(--bg1); margin-left:-9px; padding:0 14px 0 19px; flex:1 1 auto; min-width:0; color:var(--fg3); overflow:hidden; }
.lk-nvim .s-c .fn { overflow:hidden; text-overflow:ellipsis; min-width:0; }
.lk-nvim .s-c .fn b { color:var(--fg); font-weight:600; }
.lk-nvim .s-c .fn i { color:var(--bg3); font-style:normal; padding:0 5px; }
.lk-nvim .s-c .mo { color:var(--gn); }
.lk-nvim .s-x { background:var(--bg1); color:var(--fg4); padding:0 12px; gap:12px !important; }
.lk-nvim .s-x .m { color:var(--c); }
.lk-nvim .s-x .$ { color:var(--ye); }
.lk-nvim .s-sc { background:var(--bg1); color:var(--or); font-weight:800; padding:0 10px 0 4px; min-width:44px; justify-content:flex-end; }
.lk-nvim .s-sc.on { text-shadow:0 0 10px rgba(254,128,25,.6); }
.lk-nvim .s-y { background:var(--bg2); color:var(--fg2); padding:0 12px 0 20px; clip-path:polygon(9px 0, 100% 0, 100% 100%, 9px 100%, 0 50%); margin-left:-9px; }
.lk-nvim .s-z { background:var(--mc); color:#1d2021; font-weight:800; padding:0 12px 0 20px; clip-path:polygon(9px 0, 100% 0, 100% 100%, 9px 100%, 0 50%); margin-left:-9px; transition:background .3s; }
.lk-nvim .nv-cmd { height:23px; display:flex; align-items:center; padding:0 10px; background:var(--bgh); flex:none; font-size:12px; gap:10px; position:relative; z-index:8; }
.lk-nvim .nv-cmd .msg { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--fg3); }
.lk-nvim .nv-cmd .msg.err { color:var(--rd); } .lk-nvim .nv-cmd .msg.ok { color:var(--aq); } .lk-nvim .nv-cmd .msg.md { color:var(--fg); font-weight:700; }
.lk-nvim .nv-cmd .cin { flex:1; display:flex; align-items:center; min-width:0; }
.lk-nvim .nv-cmd .cin b { color:var(--or); font-weight:800; margin-right:2px; }
.lk-nvim .nv-cmd input { flex:1; min-width:0; background:none; border:0; outline:0; color:var(--fg); font:500 12px var(--mono); caret-color:var(--or); padding:0; }
.lk-nvim .nv-cmd .show { color:var(--fg4); min-width:40px; text-align:right; }
.lk-nvim .nv-cmd .hint { color:var(--bg3); font-size:11px; white-space:nowrap; }
.lk-nvim .nv-cmd .hint kbd { font-size:10px; padding:0 4px; color:var(--fg4); }

/* ---------- floating windows (only these are glass) ---------- */
.lk-nvim .fl { background:rgba(29,32,33,.8); border:1px solid rgba(235,219,178,.2); border-radius:9px; backdrop-filter:blur(18px) saturate(150%); -webkit-backdrop-filter:blur(18px) saturate(150%);
  box-shadow:0 1px 0 rgba(255,255,255,.05) inset, 0 24px 60px rgba(0,0,0,.55); }
.lk-nvim .wild { position:absolute; left:10px; bottom:52px; z-index:20; min-width:380px; max-width:calc(100% - 20px); padding:5px; display:flex; flex-direction:column; animation:nvPop .3s var(--spring) both; }
@keyframes nvPop { from { opacity:0; transform:translateY(8px) scale(.98); } }
.lk-nvim .wild button { display:grid; grid-template-columns:24px 120px 1fr; text-align:left; padding:4px 8px; border-radius:5px; font-size:12px; align-items:center; }
.lk-nvim .wild button i { font-style:normal; color:var(--or); }
.lk-nvim .wild button b { color:var(--fg); font-weight:600; }
.lk-nvim .wild button span { color:var(--gr); font-size:11.5px; }
.lk-nvim .wild button.on { background:rgba(254,128,25,.16); }
.lk-nvim .wild button.on b { color:var(--or); }
.lk-nvim .tel-bg { position:absolute; inset:0; z-index:24; background:rgba(10,11,12,.42); animation:fadein .25s both; }
.lk-nvim .tel { position:absolute; z-index:25; left:7%; right:7%; top:6%; bottom:9%; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.08fr); grid-template-rows:auto minmax(0,1fr); gap:12px; animation:nvTel .45s var(--spring) both; }
@keyframes nvTel { from { opacity:0; transform:scale(.965) translateY(10px); } }
.lk-nvim .tp { position:relative; min-height:0; display:flex; flex-direction:column; }
.lk-nvim .tp > .tt { position:absolute; top:-9px; left:50%; transform:translateX(-50%); padding:0 8px; border-radius:4px; font-size:11px; font-weight:700; color:#1d2021; background:var(--c, var(--ye)); white-space:nowrap; z-index:2; }
.lk-nvim .t-pr { grid-column:1; grid-row:1; height:44px; flex-direction:row; align-items:center; gap:10px; padding:0 14px; --c:var(--or); }
.lk-nvim .t-pr .gt { color:var(--or); font-weight:800; }
.lk-nvim .t-pr input { flex:1; min-width:0; background:none; border:0; outline:0; color:var(--fg); font:500 13.5px var(--mono); caret-color:var(--or); }
.lk-nvim .t-pr input::placeholder { color:var(--bg3); }
.lk-nvim .t-pr .cnt { color:var(--gr); font-size:11px; white-space:nowrap; }
.lk-nvim .t-rs { grid-column:1; grid-row:2; padding:10px 6px 8px; --c:var(--ye); }
.lk-nvim .t-rs .list { flex:1; min-height:0; overflow:auto; scrollbar-width:none; }
.lk-nvim .t-rs .list::-webkit-scrollbar { display:none; }
.lk-nvim .ti { display:grid; grid-template-columns:16px 18px minmax(0,1fr) auto; align-items:center; gap:0 4px; height:24px; padding:0 8px; border-radius:5px; cursor:pointer; font-size:12px; white-space:nowrap; }
.lk-nvim .ti .car { color:var(--rd); font-weight:800; opacity:0; }
.lk-nvim .ti .k { font-size:11px; display:grid; }
.lk-nvim .ti .k.s { color:hsl(var(--h) 70% 64%); } .lk-nvim .ti .k.t { color:var(--gr); }
.lk-nvim .ti .k svg.i { width:12px; height:12px; }
.lk-nvim .ti .x { overflow:hidden; text-overflow:ellipsis; color:var(--fg3); }
.lk-nvim .ti .x .fz { color:var(--or); font-weight:800; }
.lk-nvim .ti .mt { color:#5f5752; font-size:10.5px; padding-left:10px; max-width:180px; overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .ti.on { background:rgba(235,219,178,.08); }
.lk-nvim .ti.on .car { opacity:1; }
.lk-nvim .ti.on .x { color:var(--fg); }
.lk-nvim .t-pv { grid-column:2; grid-row:1 / 3; padding:16px 16px 12px; --c:var(--aq); }
.lk-nvim .t-pv .pv { padding:0; overflow:auto; scrollbar-width:none; flex:1; min-height:0; }
.lk-nvim .t-pv .pv::-webkit-scrollbar { display:none; }
.lk-nvim .t-pv .md-a { -webkit-line-clamp:16; }
.lk-nvim .t-pv .md-q { -webkit-line-clamp:9; }
.lk-nvim .t-ft { display:flex; gap:12px; color:var(--bg3); font-size:10.5px; padding:6px 8px 0; flex-wrap:wrap; }
.lk-nvim .wk { position:absolute; left:50%; bottom:56px; z-index:22; transform:translateX(-50%); width:min(920px, calc(100% - 28px)); padding:14px 18px 12px; animation:nvWk .38s var(--spring) both; }
@keyframes nvWk { from { opacity:0; transform:translate(-50%, 14px); } }
.lk-nvim .wk-h { display:flex; gap:10px; align-items:center; color:var(--gr); font-size:11px; margin-bottom:10px; }
.lk-nvim .wk-h b { color:#1d2021; background:var(--bl); border-radius:3px; padding:0 6px; }
.lk-nvim .wk-g { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:3px 22px; }
.lk-nvim .wk-g button, .lk-nvim .wk-g div { display:grid; grid-template-columns:112px 16px 1fr; align-items:center; text-align:left; font-size:12px; padding:2px 6px; border-radius:4px; white-space:nowrap; }
.lk-nvim .wk-g button:hover { background:rgba(235,219,178,.06); }
.lk-nvim .wk-g .k { color:var(--ye); font-weight:800; }
.lk-nvim .wk-g .ar { color:#5f5752; }
.lk-nvim .wk-g .d { color:var(--fg3); overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .wk-g .grp .d { color:var(--bl); }
.lk-nvim .wk-g .grp .k { color:var(--or); }
.lk-nvim .wk-sec { grid-column:1 / -1; color:var(--gr) !important; font-style:italic; font-size:11px !important; margin-top:6px; display:block !important; padding-left:6px !important; }
.lk-nvim .ntf { position:absolute; top:40px; right:14px; z-index:40; width:320px; display:flex; flex-direction:column; gap:8px; pointer-events:none; transition:right .55s var(--spring); }
.lk-nvim.dw-open .ntf { right:520px; }
.lk-nvim .nt { position:relative; pointer-events:auto; padding:9px 12px 11px 14px; border-left:3px solid var(--c); overflow:hidden; animation:nvNt .55s var(--spring) both; border-radius:6px 9px 9px 6px; }
.lk-nvim .nt.out { animation:nvNtOut .35s ease forwards; }
@keyframes nvNt { from { opacity:0; transform:translateX(40px); } }
@keyframes nvNtOut { to { opacity:0; transform:translateX(30px); } }
.lk-nvim .nt-h { display:flex; gap:8px; align-items:center; font-size:11.5px; color:var(--c); font-weight:800; }
.lk-nvim .nt-h svg.i { width:13px; height:13px; }
.lk-nvim .nt-h small { margin-left:auto; color:var(--gr); font-weight:500; }
.lk-nvim .nt-m { color:var(--fg2); font-size:12px; margin-top:3px; }
.lk-nvim .nt code { display:block; margin-top:5px; font:11px var(--mono); color:var(--fg4); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .nt::after { content:""; position:absolute; left:0; bottom:0; height:2px; width:100%; background:var(--c); opacity:.55; transform-origin:left; animation:nvBar 3.2s linear forwards; }
@keyframes nvBar { to { transform:scaleX(0); } }
.lk-nvim .nt.info { --c:var(--aq); } .lk-nvim .nt.warn { --c:var(--ye); } .lk-nvim .nt.err { --c:var(--rd); }


/* ---------- bufferline: note buffers ---------- */
.lk-nvim .tab .nti { color:var(--gn); display:grid; }
.lk-nvim .tab .nti svg.i { width:12px; height:12px; }
.lk-nvim .tab .pl { color:var(--gn); font-weight:800; margin-left:5px; }
.lk-nvim .tab.nt.on::before { background:var(--gn); box-shadow:0 0 12px var(--gn); }

/* ---------- notes view ---------- */
.lk-nvim .nv-notes { position:relative; flex:1; min-height:0; display:grid; grid-template-columns:calc(var(--tw) + 46px) 14px minmax(0,1fr); }
.lk-nvim .nv-notes .tree .r.note .tx { color:var(--fg3); font-size:12px; }
.lk-nvim .nv-notes .tree .r.note.opn .tx { color:var(--fg); }
.lk-nvim .nv-notes .tree .r.note.sel .tx { color:var(--fg); }
.lk-nvim .nv-notes .tree .fi.nf { color:var(--fg4); }
.lk-nvim .nv-notes .tree .fi.nf.ln { color:var(--aq); }
.lk-nvim .nv-notes .tree .fi.nf.pf { color:var(--bl); }
.lk-nvim .nv-notes .tree .fi.nf svg.i { width:13px; height:13px; }
.lk-nvim .nv-notes .tree .r.dir .sub { color:var(--bg3); font-size:10.5px; margin-left:8px; }
.lk-nvim .nt-ed { min-width:0; }
.lk-nvim .nt-host { position:relative; flex:1; min-height:0; }
.lk-nvim .nt-cm { position:absolute; inset:0; display:none; }
.lk-nvim .nt-cm.on { display:block; animation:nvWin .4s var(--spring) both; }
.lk-nvim .nt-cm .cm-editor { height:100%; }
.lk-nvim .nt-ed:not(.on) .cm-activeLine { background:transparent; box-shadow:none; }
.lk-nvim .nt-empty { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; color:var(--gr); }
.lk-nvim .nt-empty b { color:var(--fg2); font-size:14px; }
.lk-nvim .nt-empty .ks { display:grid; grid-template-columns:auto auto; gap:6px 16px; font-size:12px; margin-top:6px; }
.lk-nvim .nt-empty .ks span:nth-child(odd) { text-align:right; color:var(--ye); font-weight:700; }
.lk-nvim .nt-ed .wb .f i { font-style:normal; color:var(--gn); font-weight:800; margin-left:6px; }
.lk-nvim .nt-ed .wb .pj { color:hsl(var(--h) 68% 64%); }
.lk-nvim .go.sec { flex:0 0 auto; background:#32302f; color:var(--fg2); box-shadow:none; border:1px solid #504945; }
.lk-nvim .go.sec:hover { color:var(--fg); }
.lk-nvim .go kbd { background:rgba(29,32,33,.18); border-color:rgba(29,32,33,.35); color:#1d2021; }
.lk-nvim .go.sec kbd { background:rgba(235,219,178,.07); border-color:rgba(235,219,178,.16); color:var(--fg4); }

/* ---------- mcp view ---------- */
.lk-nvim .nv-mcp { position:relative; flex:1; min-height:0; display:flex; flex-direction:column; }
.lk-nvim .nv-mcp .nv-w { flex:1; }
.lk-nvim .mc .r { grid-template-columns:22px 36px minmax(0,1fr) auto; }
.lk-nvim .mc-l { display:flex; align-items:center; gap:9px; min-width:0; overflow:hidden; }
.lk-nvim .mc-l .bx { white-space:pre; color:#504945; flex:none; }
.lk-nvim .mc-l .fo { color:var(--ye); flex:none; }
.lk-nvim .mc-l b { color:var(--fg); font-weight:700; flex:none; }
.lk-nvim .mc-l .sc { flex:none; color:#1d2021; font-weight:800; font-size:10.5px; padding:0 6px; border-radius:3px; background:var(--c); }
.lk-nvim .mc-l .sc.user { --c:var(--bl); } .lk-nvim .mc-l .sc.project { --c:var(--aq); } .lk-nvim .mc-l .sc.local { --c:var(--pu); }
.lk-nvim .mc-l .src { color:var(--gr); font-style:italic; overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .mc-l .tp { flex:none; font-size:10.5px; padding:0 6px; border-radius:3px; border:1px solid currentColor; color:var(--or); }
.lk-nvim .mc-l .tp.http, .lk-nvim .mc-l .tp.sse { color:var(--bl); }
.lk-nvim .mc-l .cm { color:var(--fg4); overflow:hidden; text-overflow:ellipsis; min-width:0; }
.lk-nvim .mc-r { display:flex; align-items:center; gap:8px; color:var(--fg4); font-size:11px; padding-left:12px; }
.lk-nvim .mc-r .ek { color:var(--ye); background:rgba(250,189,47,.08); border-radius:3px; padding:0 6px; }
.lk-nvim .mc-r .st { color:var(--gr); font-style:italic; max-width:220px; overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .mc .sg.ok { color:var(--gn); } .lk-nvim .mc .sg.bad { color:var(--rd); } .lk-nvim .mc .sg.spin { color:var(--ye); } .lk-nvim .mc .sg.unk { color:var(--bg3); }
.lk-nvim .mc-hint { flex:none; display:flex; align-items:center; gap:14px; flex-wrap:wrap; padding:8px 14px; border-top:1px solid #2a2827; color:var(--gr); font-size:11.5px; }
.lk-nvim .mc-hint .note { font-style:italic; margin-left:auto; }
.lk-nvim .mc-hint button { color:var(--fg3); display:inline-flex; gap:6px; align-items:center; }
.lk-nvim .mc-hint button:hover { color:var(--fg); }

/* ---------- select popup (vim.ui.select) + form ---------- */
.lk-nvim .nv-dim { position:absolute; inset:0; z-index:28; background:rgba(10,11,12,.45); animation:fadein .2s both; }
.lk-nvim .nv-sel { position:absolute; z-index:29; left:50%; top:26%; transform:translateX(-50%); width:min(600px, calc(100% - 40px)); padding:16px 8px 8px; display:flex; flex-direction:column; gap:2px; animation:nvSel .35s var(--spring) both; }
@keyframes nvSel { from { opacity:0; transform:translate(-50%, 10px) scale(.98); } }
.lk-nvim .nv-sel > .tt, .lk-nvim .nv-form > .tt { position:absolute; top:-9px; left:50%; transform:translateX(-50%); padding:0 8px; border-radius:4px; font-size:11px; font-weight:800; color:#1d2021; background:var(--c, var(--or)); white-space:nowrap; }
.lk-nvim .si { display:grid; grid-template-columns:16px 22px minmax(0,1fr) auto; align-items:center; gap:0 6px; padding:7px 10px; border-radius:5px; text-align:left; }
.lk-nvim .si .car { color:var(--rd); font-weight:800; opacity:0; }
.lk-nvim .si .k { color:var(--or); font-weight:800; }
.lk-nvim .si .l { display:flex; flex-direction:column; min-width:0; }
.lk-nvim .si .l b { color:var(--fg2); font-weight:700; font-size:12.5px; }
.lk-nvim .si .l small { color:var(--gr); font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lk-nvim .si .h { color:var(--fg4); font-size:11px; padding-left:12px; white-space:nowrap; }
.lk-nvim .si.on { background:rgba(254,128,25,.14); }
.lk-nvim .si.on .car { opacity:1; }
.lk-nvim .si.on .l b { color:var(--or); }
.lk-nvim .si.off { opacity:.45; }
.lk-nvim .nv-sel .t-ft { padding:8px 10px 2px; border-top:1px solid #32302f; margin-top:6px; }
.lk-nvim .nv-form { position:absolute; z-index:29; left:50%; top:50%; transform:translate(-50%, -50%); width:min(680px, calc(100% - 40px)); padding:22px 20px 14px; --c:var(--aq); animation:nvForm .35s var(--spring) both; }
@keyframes nvForm { from { opacity:0; transform:translate(-50%, calc(-50% + 10px)) scale(.98); } }
.lk-nvim .ff { display:grid; grid-template-columns:118px minmax(0,1fr); gap:8px 14px; align-items:center; }
.lk-nvim .ff > label { color:var(--fg4); font-size:12px; text-align:right; }
.lk-nvim .ff > label::after { content:":"; color:var(--bg3); }
.lk-nvim .ff input, .lk-nvim .ff textarea { width:100%; background:#1a1c1d; border:1px solid #3c3836; border-radius:4px; color:var(--fg); font:500 12.5px var(--mono); padding:5px 9px; outline:0; caret-color:var(--ye); resize:vertical; }
.lk-nvim .ff textarea { min-height:58px; line-height:1.5; }
.lk-nvim .ff input::placeholder, .lk-nvim .ff textarea::placeholder { color:#5a524c; }
.lk-nvim .ff input:focus, .lk-nvim .ff textarea:focus, .lk-nvim .ff .ch:focus { border-color:var(--ye); box-shadow:0 0 0 1px rgba(250,189,47,.25); outline:0; }
.lk-nvim .ff .ch { display:flex; gap:4px; align-items:center; border:1px solid transparent; border-radius:4px; padding:3px; min-width:0; }
.lk-nvim .ff .ch span { padding:1px 10px; border-radius:3px; color:var(--fg4); cursor:pointer; font-size:12px; }
.lk-nvim .ff .ch span:hover { color:var(--fg); }
.lk-nvim .ff .ch span.on { background:var(--ye); color:#1d2021; font-weight:800; }
.lk-nvim .ff .ch.one i { font-style:normal; color:var(--ye); font-weight:800; padding:0 6px; cursor:pointer; }
.lk-nvim .ff .ch.one b { color:var(--fg); }
.lk-nvim .ff .ch.one small { color:var(--gr); margin-left:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lk-nvim .ff .hl { grid-column:2; margin-top:-4px; color:var(--gr); font-style:italic; font-size:11px; }
.lk-nvim .ff [hidden] { display:none !important; }
.lk-nvim .ff-f { display:flex; align-items:center; gap:12px; margin-top:14px; padding-top:10px; border-top:1px solid #32302f; }
.lk-nvim .ff-f .hint { color:var(--bg3); font-size:11px; display:flex; gap:10px; flex-wrap:wrap; flex:1; }
.lk-nvim .ff-f .hint kbd { font-size:10px; padding:0 4px; color:var(--fg4); }
.lk-nvim .ff-f .go { flex:none; padding:6px 14px; }
.lk-nvim .ff-out { margin-top:10px; white-space:pre-wrap; font-size:11.5px; color:var(--fg3); border-left:2px solid var(--c, var(--aq)); padding:2px 0 2px 10px; max-height:120px; overflow:auto; }
.lk-nvim .ff-out.err { --c:var(--rd); color:var(--rd); }

@media (max-width:1180px) { .lk-nvim { --tw:186px; --gut:26px; }
  .lk-nvim .r { grid-template-columns:18px 30px 10px minmax(0,1fr) auto auto; padding-right:8px; }
  .lk-nvim .cur { --cx:58px !important; }
  .lk-nvim .vt { max-width:84px; font-size:10.5px; }
  .lk-nvim .nv-w[data-w="2"] .vt { display:none; }
  .lk-nvim .dh-grid { grid-template-columns:minmax(250px, 320px) minmax(0, 560px); }
  .lk-nvim .dh-h .r { display:none; }
  .lk-nvim .spk-g { font-size:17px; letter-spacing:.12em; }
  .lk-nvim .spk-y { height:68px; }
  .lk-nvim .dh-two { gap:16px; }
  .lk-nvim .tree .r { padding-left:4px; }
  .lk-nvim .dh-grid { grid-template-columns:minmax(260px, 340px) minmax(360px, 520px); gap:18px 30px; }
  .lk-nvim .s-x .enc, .lk-nvim .nv-cmd .hint { display:none; }
  .lk-nvim .wk-g { grid-template-columns:repeat(2, minmax(0,1fr)); } }
@media (max-height:760px) { .lk-nvim { --rh:21px; } .lk-nvim .nv-dash { padding-top:16px; } .lk-nvim .dh-grid { margin-top:14px; } .lk-nvim .dh-mi { height:26px; } .lk-nvim .dh-rc { height:23px; } .lk-nvim .dh-quote { margin-top:12px; } }
@media (prefers-reduced-motion: reduce) { .lk-nvim *, .lk-nvim *::before, .lk-nvim *::after { animation-duration:.001s !important; animation-iteration-count:1 !important; transition-duration:.001s !important; }
  .lk-nvim .ag-pt { display:none; } }
`;

  // ANSI-shadow style block letters, only the ones needed for the banner
  const FONT = {
    S: ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║", "╚══════╝"],
    E: ["███████╗", "██╔════╝", "█████╗  ", "██╔══╝  ", "███████╗", "╚══════╝"],
    I: ["██╗", "██║", "██║", "██║", "██║", "╚═╝"],
    O: [" ██████╗ ", "██╔═══██╗", "██║   ██║", "██║   ██║", "╚██████╔╝", " ╚═════╝ "],
    N: ["███╗   ██╗", "████╗  ██║", "██╔██╗ ██║", "██║╚██╗██║", "██║ ╚████║", "╚═╝  ╚═══╝"],
    A: [" █████╗ ", "██╔══██╗", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"],
    T: ["████████╗", "╚══██╔══╝", "   ██║   ", "   ██║   ", "   ██║   ", "   ╚═╝   "],
    L: ["██╗     ", "██║     ", "██║     ", "██║     ", "███████╗", "╚══════╝"],
    " ": ["   ", "   ", "   ", "   ", "   ", "   "],
  };
  const EIGHTH = ["", "▏", "▎", "▍", "▌", "▋", "▊", "▉"];
  const FAM = { opus: "#d3869b", sonnet: "#83a598", haiku: "#b8bb26", fable: "#fe8019", x: "#928374" };
  const MODE_C = { NORMAL: "#fabd2f", VISUAL: "#d3869b", "V-LINE": "#d3869b", "V-BLOCK": "#d3869b", COMMAND: "#fe8019", INSERT: "#b8bb26", REPLACE: "#fb4934" };
  const QUOTES = ["Jede Session ist ein Faden. Hier laufen sie zusammen.", "Nicht neu anfangen. Weitermachen, wo es gut war.",
    "Ein guter Schritt zurück ist oft der schnellste nach vorn.", "Der beste Prompt ist der, den du schon geschrieben hast."];

  let api = null;

  function render(root, A) {
    const t0 = performance.now();
    const D = A.DATA, esc = A.esc;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const one = (t) => String(t || "").replace(/\s+/g, " ").trim();
    const clean = (t) => String(t || "").replace(/\*\*/g, "").replace(/^#+\s*/gm, "").replace(/`/g, "").trim();
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const sById = new Map();
    const indexSessions = () => { sById.clear(); for (const s of D.sessions) sById.set(s.id, s); };
    indexSessions();
    const hsl = (h, l = 64) => `hsl(${h} 68% ${l}%)`;
    let alive = true;
    const timers = new Set();
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); if (alive) fn(); }, ms); timers.add(t); return t; };

    const st = { view: "dash", win: 1, mode: "NORMAL", tree: [], tIdx: 0, open: new Set(), sKey: null, slist: [], sIdx: 0, tlist: [], pIdx: 0,
      bufs: [], buf: null, visual: null, count: "", g: false, z: false, d: false, show: "", dIdx: 0, dTotal: 12, agRows: [], aIdx: 0, tel: null, wk: false, cmd: null, drawer: false,
      notes: { list: null, tree: [], idx: 0, win: 0, closed: new Set(), refocus: false }, mcp: { data: null, rows: [], sel: [], si: 0, status: new Map(), checking: false, frame: 0 },
      sel: null, form: null, confirm: null };
    if (D.sessions[0]) st.open.add(D.sessions[0].project);
    D.sessions.slice(0, 3).reverse().forEach((s) => st.bufs.push({ id: s.id, pin: true }));

    // ================= markup =================
    root.innerHTML = `<div class="nv-term" id="nvTerm">
      <div class="nv-dash" id="nvDash"></div>
      <div class="nv-ed" id="nvEd" hidden>
        <div class="nv-bl"><span class="bl-off" id="nvBlOff">${A.ic("folder")} Explorer</span><div class="bl-tabs" id="nvTabs"></div><span class="bl-r" id="nvBlR"></span></div>
        <div class="nv-main" id="nvMain">
          <section class="nv-w tree" data-w="0" style="--i:0"><header class="wb"><span class="n">1</span><span class="f">neo-tree</span><span class="c" id="nvC0"></span></header>
            <div class="wl" id="nvL0"><div class="cl"></div><div class="cur"></div><div class="rows"></div></div><div class="sbar" id="nvSb0"><i class="th"></i></div></section>
          <i class="sep ed-only"></i>
          <section class="nv-w ed-only" data-w="1" style="--i:1;--cx:72px"><header class="wb"><span class="n">2</span><span class="f" id="nvF1"></span><span class="c" id="nvC1"></span></header>
            <div class="wl" id="nvL1"><div class="cl"></div><div class="cur"></div><div class="rows"></div></div><div class="sbar" id="nvSb1"><i class="th"></i></div></section>
          <i class="sep ed-only"></i>
          <section class="nv-w ed-only" data-w="2" style="--i:2;--cx:72px"><header class="wb"><span class="n">3</span><span class="f" id="nvF2"></span><span class="c" id="nvC2"></span></header>
            <div class="wl" id="nvL2"><div class="cl"></div><div class="cur"></div><div class="rows"></div></div><div class="sbar" id="nvSb2"><i class="th"></i></div></section>
          <i class="sep ed-only"></i>
          <section class="nv-w ed-only" data-w="3" style="--i:3"><header class="wb"><span class="n">4</span><span class="f" id="nvF3"></span><span class="c" id="nvC3"></span></header>
            <div class="wl pvw" id="nvPv"></div><div class="pv-f" id="nvPf"></div></section>
          <section class="nv-w nv-ag" data-w="1" id="nvAgW" style="--cx:58px" hidden><header class="wb"><span class="n">2</span><span class="f"><b>agents.tree</b> · wer hat für Claude gearbeitet</span><span class="c" id="nvCa"></span></header>
            <div class="wl" id="nvLa"><div class="cl"></div><div class="cur"></div><div class="rows ag-wrap" id="nvAgRows"></div></div></section>
          <svg class="wires" id="nvW"><defs>
            <filter id="nvBlur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
            <filter id="nvGlow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            ${[["#fe8019", "#fabd2f"], ["#fabd2f", "#8ec07c"], ["#8ec07c", "#83a598"]].map((c, i) => `<linearGradient id="nvg${i}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`).join("")}</defs>
            ${[0, 1, 2].map((i) => `<g class="w-g off" id="nvw${i}"><path class="w-glow" stroke="url(#nvg${i})" filter="url(#nvBlur)"/><path class="w-core" stroke="url(#nvg${i})"/>
              ${[0, 1, 2].map(() => `<circle class="w-p" r="2.3" filter="url(#nvGlow)"/>`).join("")}<circle class="w-end" r="3.5"/><circle class="w-end" r="3.5"/></g>`).join("")}
          </svg>
        </div>
        <div class="nv-notes" id="nvNotes" hidden>
          <section class="nv-w tree on" data-nw="0"><header class="wb"><span class="n">1</span><span class="f">neo-tree <b>notes</b></span><span class="c" id="nvNC0"></span></header>
            <div class="wl" id="nvNL"><div class="cl"></div><div class="cur"></div><div class="rows"></div></div></section>
          <i class="sep"></i>
          <section class="nv-w nt-ed" data-nw="1"><header class="wb"><span class="n">2</span><span class="f" id="nvNF"></span><span class="c" id="nvNCnt"></span></header>
            <div class="nt-host" id="nvNHost"><div class="nt-empty" id="nvNEmpty"><b>Keine Notiz offen</b><span>Links eine Notiz wählen oder eine neue anlegen</span>
              <div class="ks"><span>Enter</span><span>Notiz öffnen</span><span>:new Name</span><span>neue Notiz</span><span>:Anforderungen Name</span><span>Vorlage fürs gewählte Projekt</span><span>Space a</span><span>Notiz an Claude geben</span></div></div></div>
            <div class="pv-f" id="nvNFoot"></div></section>
        </div>
        <div class="nv-mcp" id="nvMcp" hidden>
          <section class="nv-w on" style="--cx:58px"><header class="wb"><span class="n">1</span><span class="f"><b>mcp.servers</b> · Werkzeuge für Claude Code</span><span class="c" id="nvMC"></span></header>
            <div class="wl" id="nvML"><div class="cl"></div><div class="cur"></div><div class="rows mc" id="nvMRows"></div></div>
            <div class="mc-hint"><button data-mact="check"><kbd>c</kbd> Status prüfen</button><button data-mact="add"><kbd>a</kbd> hinzufügen</button><button data-mact="remove"><kbd>dd</kbd> entfernen</button><button data-mact="reload"><kbd>r</kbd> neu laden</button>
              <span class="note">claude.ai-Connectors gehören zu deinem Account und werden auf claude.ai verwaltet, sie stehen nicht hier.</span></div></section>
        </div>
      </div>
      <div class="nv-sl" id="nvSl"></div>
      <div class="nv-cmd" id="nvCmd"><span class="msg" id="nvMsg"></span><span class="cin" id="nvCin" hidden><b>:</b><input id="nvCmdIn" autocomplete="off" spellcheck="false"></span>
        <span class="hint" id="nvHint"><kbd>Space</kbd> Hilfe <kbd>/</kbd> suchen <kbd>:</kbd> Befehl</span></div>
      <div class="wild fl" id="nvWild" hidden></div>
      <div class="tel-bg" id="nvTelBg" hidden></div>
      <div class="tel" id="nvTel" hidden>
        <div class="tp t-pr fl"><span class="tt">Sessions &amp; Schritte finden</span><span class="gt">&gt;</span><input id="nvTelIn" placeholder="tippen zum Suchen ..." autocomplete="off" spellcheck="false"><span class="cnt" id="nvTelCnt"></span></div>
        <div class="tp t-rs fl"><span class="tt">Ergebnisse</span><div class="list" id="nvTelList"></div>
          <div class="t-ft"><span><kbd>↑</kbd><kbd>↓</kbd> wählen</span><span><kbd>Enter</kbd> öffnen</span><span><kbd>Esc</kbd> schliessen</span></div></div>
        <div class="tp t-pv fl"><span class="tt">Vorschau</span><div class="pv" id="nvTelPv"></div></div>
      </div>
      <div class="wk fl" id="nvWk" hidden></div>
      <div class="nv-dim" id="nvDim" hidden></div>
      <div class="nv-sel fl" id="nvSel" hidden></div>
      <div class="nv-form fl" id="nvForm" hidden></div>
      <div class="ntf" id="nvNtf"></div>
    </div>`;

    const $ = (id) => root.querySelector("#" + id);
    const term = $("nvTerm"), dash = $("nvDash"), ed = $("nvEd"), main = $("nvMain");
    const wins = [...root.querySelectorAll(".nv-w[data-w]")].slice(0, 4);
    const lists = [$("nvL0"), $("nvL1"), $("nvL2")];
    const pvEl = $("nvPv"), pfEl = $("nvPf"), agW = $("nvAgW"), agList = $("nvLa"), agRowsEl = $("nvAgRows");
    const msgEl = $("nvMsg");
    // showcmd lives at the right of the statusline (pending keys like "g", "5", "z")
    const showEl = { set textContent(v) { st.show = v || ""; const el = root.querySelector("#nvShowSl"); if (el) { el.textContent = st.show; el.classList.toggle("on", !!st.show); } } };

    // ================= notify (nvim-notify) =================
    const ntf = $("nvNtf");
    function notify(msg, o = {}) {
      const el = document.createElement("div");
      el.className = `nt fl ${o.lv || "info"}`;
      el.innerHTML = `<div class="nt-h">${A.ic(o.icon || (o.lv === "err" ? "x" : o.lv === "warn" ? "clock" : "bot"))}<span>${esc(o.title || "Atlas")}</span><small>${A.hhmm(Date.now())}</small></div>
        <div class="nt-m">${esc(msg)}</div>${o.code ? `<code>${esc(o.code)}</code>` : ""}`;
      ntf.prepend(el);
      while (ntf.children.length > 4) ntf.lastChild.remove();
      later(() => { el.classList.add("out"); later(() => el.remove(), 360); }, 3200);
    }
    function cmdMsg(text, cls = "") { msgEl.className = "msg " + cls; msgEl.textContent = text; }

    // ================= stats for the dashboard =================
    const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const perDay = new Map(), days30 = [];
    function computeStats() {
      perDay.clear(); days30.length = 0;
      for (const s of D.sessions) for (const n of s.nodes) { const k = dayKey(new Date(n.ts)); perDay.set(k, (perDay.get(k) || 0) + 1); }
      for (let i = 29; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); days30.push({ d, v: perDay.get(dayKey(d)) || 0 }); }
    }
    computeStats();
    const dlabel = (d) => d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });

    function braille(vals, rows) {
      const max = Math.max(1, ...vals), levels = rows * 4;
      const h = vals.map((v) => (v ? Math.max(1, Math.round((v / max) * levels)) : 0));
      const L = [0x01, 0x02, 0x04, 0x40], R = [0x08, 0x10, 0x20, 0x80];
      const out = [];
      for (let r = 0; r < rows; r++) {
        const chars = [];
        for (let c = 0; c < vals.length; c += 2) {
          let code = 0;
          for (let d = 0; d < 4; d++) {
            const lvl = (rows - 1 - r) * 4 + (4 - d);
            if (h[c] >= lvl) code |= L[d];
            if ((h[c + 1] || 0) >= lvl) code |= R[d];
          }
          chars.push(String.fromCharCode(0x2800 + code));
        }
        out.push(chars);
      }
      return out;
    }
    const bar = (frac, cells) => {
      const u = clamp(frac, 0, 1) * cells * 8; let full = Math.floor(u / 8), rem = Math.round(u - full * 8);
      if (rem === 8) { full++; rem = 0; }
      return "█".repeat(full) + (rem && full < cells ? EIGHTH[rem] : "") || "▏";
    };

    const DASH_MENU = [["r", "Zuletzt", "clock", "#83a598"], ["f", "Suchen", "search", "#fabd2f"], ["p", "Projekte", "folder", "#8ec07c"], ["n", "Notizen", "note", "#b8bb26"],
      ["a", "Agents", "bot", "#d3869b"], ["m", "MCP-Server", "plug", "#8ec07c"], ["o", "Neues Projekt", "folder", "#fabd2f"], ["s", "Statistik", "grid", "#fe8019"], ["q", "Schliessen", "x", "#928374"]];
    function renderDash() {
      const word = "SESSION ATLAS";
      const rows = [0, 1, 2, 3, 4, 5].map((r) => [...word].map((c) => FONT[c][r]).join(""));
      const fg = rows.map((l) => l.replace(/[^█]/g, " ")), sh = rows.map((l) => l.replace(/█/g, " "));
      const T = D.totals;
      const sp = braille(days30.map((x) => x.v), 3);
      const vals = days30.map((x) => x.v), mx = Math.max(...vals), sum = vals.reduce((a, b) => a + b, 0);
      const peak = days30.reduce((a, b) => (b.v > a.v ? b : a), days30[0]);
      const active = vals.filter(Boolean).length;
      // heatmap weekday x week (12 weeks, Monday first)
      const WEEKS = innerWidth < 1180 ? 9 : 12, start = new Date(today); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (WEEKS - 1) * 7);
      const cells = []; let hmax = 1;
      for (let wd = 0; wd < 7; wd++) { cells.push([]); for (let w = 0; w < WEEKS; w++) { const d = new Date(start); d.setDate(d.getDate() + w * 7 + wd); const v = d > today ? -1 : perDay.get(dayKey(d)) || 0; hmax = Math.max(hmax, v); cells[wd].push({ d, v }); } }
      const glyph = (v) => (v < 0 ? "  " : v === 0 ? "··" : v / hmax <= .2 ? "░░" : v / hmax <= .45 ? "▒▒" : v / hmax <= .75 ? "▓▓" : "██");
      const hcol = (v) => (v <= 0 ? "#3c3836" : v / hmax <= .2 ? "#5d7a52" : v / hmax <= .45 ? "#79a067" : v / hmax <= .75 ? "#8ec07c" : "#b8e08e");
      const topP = D.projects.slice().sort((a, b) => b.steps - a.steps).slice(0, 6), pmax = topP[0]?.steps || 1;
      const fam = {}; for (const s of D.sessions) for (const [m, v] of Object.entries(s.models || {})) { const f = A.modelInfo(m).fam; fam[f] = (fam[f] || 0) + (v.replies || 0); }
      const famList = Object.entries(fam).sort((a, b) => b[1] - a[1]), famTot = famList.reduce((n, x) => n + x[1], 0) || 1;
      const MB = 44; let used = 0;
      const mbar = famList.map(([f, v], i) => { let n = i === famList.length - 1 ? MB - used : Math.max(1, Math.round((v / famTot) * MB)); n = Math.max(0, Math.min(n, MB - used)); used += n; return `<span style="color:${FAM[f] || FAM.x}">${"█".repeat(n)}</span>`; }).join("");
      const recent = D.sessions.slice(0, 6);
      const menu = DASH_MENU;
      const quote = QUOTES[Math.floor(Date.now() / 864e5) % QUOTES.length];
      const ms = Math.max(1, Math.round(performance.now() - t0));
      dash.innerHTML = `
        <div class="dh-logo" aria-label="Session Atlas"><div class="lg lg-sh">${sh.map((l, r) => `<span style="--r:${r}">${l}</span>`).join("")}</div>
          <div class="lg lg-fg">${fg.map((l, r) => `<span style="--r:${r}">${l}</span>`).join("")}</div></div>
        <div class="dh-sub">deine Claude-Code-Sessions als Editor · <b>${D.projects.length}</b> Projekte · <b>${D.totals.sessions}</b> Sessions</div>
        <div class="dh-grid">
          <div class="dh-left">
            <div class="dh-h">-- <b>Menü</b><span class="r"><kbd>j</kbd> <kbd>k</kbd> <kbd>Enter</kbd></span></div>
            ${menu.map(([k, l, ic, c], i) => `<button class="dh-mi" data-dk="${k}" data-di="${i}" style="--i:${i};--c:${c}"><span class="g">${A.ic(ic)}</span><span>${l}</span><span class="k">${k}</span></button>`).join("")}
            <div class="dh-h" style="margin-top:14px">-- <b>Zuletzt</b><span class="r">Zahl drücken öffnet</span></div>
            ${recent.map((s, i) => `<button class="dh-rc" data-open="${s.id}" data-open-step="${s.last.id}" data-di="${i + menu.length}" style="--i:${i + menu.length}"><span class="k">${i + 1}</span><span class="t">${esc(one(s.label))}</span>
              <span class="p" style="color:${hsl(s.hue)}">${esc(s.projName)}</span><span class="a">${A.relShort(s.end)}</span></button>`).join("")}
            <div class="dh-lazy">⚡ Atlas geladen · <b>${T.sessions}</b> Sessions · <b>${T.steps}</b> Schritte in <b>${ms}ms</b></div>
          </div>
          <div class="dh-right" id="nvStats">
            <div class="dh-tot">${[["Sessions", T.sessions, "#83a598", 0], ["Schritte", T.steps, "#fabd2f", 0], ["Agents", T.agents, "#d3869b", 0], ["Kosten", T.cost, "#8ec07c", 2]].map(([l, v, c, dec], i) =>
              `<div style="--c:${c};--i:${i}"><b data-cu="${v}" data-dec="${dec}">${dec ? "$0.00" : "0"}</b><small>${l}</small></div>`).join("")}</div>
            <div class="dh-two">
              <div><div class="dh-h">-- <b>Schritte pro Tag</b> · 30 Tage</div>
                <div class="spk"><div><div class="spk-g">${sp.map((row) => `<span>${row.map((ch, j) => `<i style="font-style:normal" title="${esc(dlabel(days30[j * 2].d))}: ${days30[j * 2].v} · ${esc(dlabel(days30[j * 2 + 1].d))}: ${days30[j * 2 + 1].v}">${ch}</i>`).join("")}</span>`).join("")}</div>
                  <div class="spk-ax"><span>-30T</span><span>-15T</span><span>heute</span></div></div><div class="spk-y"><span>${mx}</span><span>0</span></div></div>
                <div class="spk-n">Ø <b>${Math.round(sum / 30)}</b>/Tag · Spitze <b>${peak.v}</b> am ${esc(dlabel(peak.d))} · ${active} aktive Tage</div></div>
              <div><div class="dh-h">-- <b>Wochenrhythmus</b> · ${WEEKS} Wochen</div>
                <div class="hm"><div class="hm-d">${["Mo", "", "Mi", "", "Fr", "", "So"].map((x) => `<span>${x}</span>`).join("")}</div>
                  <div class="hm-c">${cells.map((row) => row.map((c) => `<span style="color:${hcol(c.v)}" title="${esc(dlabel(c.d))}: ${Math.max(0, c.v)} Schritte">${glyph(c.v)}</span>`).join(" ")).join("\n")}</div>
                  <div class="hm-l">weniger <span style="color:#3c3836">··</span> <span style="color:#5d7a52">░░</span> <span style="color:#79a067">▒▒</span> <span style="color:#8ec07c">▓▓</span> <span style="color:#b8e08e">██</span> mehr</div></div></div>
            </div>
            <div><div class="dh-h">-- <b>Top-Projekte</b> · nach Schritten</div>
              <div class="pb">${topP.map((p, i) => `<span class="n">${esc(p.name)}</span><span class="b" style="--c:${hsl(p.hue)};--i:${i}">${bar(p.steps / pmax, 26)}</span><span class="v">${p.steps}</span>`).join("")}</div></div>
            <div><div class="dh-h">-- <b>Modelle</b> · Antworten</div>
              <div class="mb">${mbar}</div>
              <div class="ml">${famList.map(([f, v]) => `<span><i style="--c:${FAM[f] || FAM.x}">■</i> ${esc(f === "x" ? "andere" : f[0].toUpperCase() + f.slice(1))} ${Math.round((v / famTot) * 100)}%</span>`).join("")}</div></div>
          </div>
        </div>
        <div class="dh-quote">-- "${esc(quote)}"</div>
        <div class="dh-hint">Taste drücken oder klicken: weiter zum Editor</div>`;
      st.dTotal = menu.length + recent.length;
      markDash();
      countUp();
    }
    function countUp() {
      const els = [...dash.querySelectorAll("[data-cu]")];
      const fmt = (el, v) => { const dec = +el.dataset.dec; el.textContent = dec ? "$" + v.toFixed(dec) : Math.round(v).toLocaleString("de-DE"); };
      if (reduce) { els.forEach((el) => fmt(el, +el.dataset.cu)); return; }
      const t1 = performance.now() + 250; let done = false;
      const step = () => {
        const now = performance.now();
        if (!alive || st.view !== "dash" || done) return;
        const k = clamp((now - t1) / 1100, 0, 1), e = 1 - Math.pow(1 - k, 4);
        els.forEach((el) => fmt(el, +el.dataset.cu * e));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      later(() => { done = true; els.forEach((el) => fmt(el, +el.dataset.cu)); }, 1700);
    }
    const markDash = () => dash.querySelectorAll("[data-di]").forEach((el) => el.classList.toggle("on", +el.dataset.di === st.dIdx));

    // ================= tree (neo-tree) =================
    function buildTree() {
      st.tree = [{ k: "root" }];
      D.projects.forEach((p, pi) => {
        const lastP = pi === D.projects.length - 1;
        st.tree.push({ k: "proj", p, lastP });
        if (st.open.has(p.path)) p.sessions.forEach((s, j) => st.tree.push({ k: "sess", s, p, lastP, last: j === p.sessions.length - 1 }));
      });
    }
    function renderTree() {
      lists[0].querySelector(".rows").innerHTML = st.tree.map((r, i) => {
        if (r.k === "root") return `<div class="r root" data-i="${i}"><span class="ig"></span><span class="fo o">▾</span><span class="fi" style="--h:40">${A.ic("folder")}</span><span class="tx">Alle Sessions</span><span class="vt"><span class="cnt">${D.sessions.length}</span></span></div>`;
        if (r.k === "proj") { const o = st.open.has(r.p.path);
          return `<div class="r proj" data-i="${i}"><span class="ig">${r.lastP ? "└ " : "├ "}</span><span class="fo ${o ? "o" : ""}">${o ? "▾" : "▸"}</span><span class="fi" style="--h:${r.p.hue}">${A.ic("folder")}</span><span class="tx">${esc(r.p.name)}</span><span class="vt"><span class="cnt">${r.p.sessions.length}</span></span></div>`; }
        return `<div class="r sess" data-i="${i}"><span class="ig">${r.lastP ? "  " : "│ "}${r.last ? "└ " : "├ "}</span><span class="fo">${r.s.live ? `<span class="sg live">●</span>` : ""}</span><span class="fi" style="--h:${r.s.hue};font-size:10px">◆</span><span class="tx">${esc(one(r.s.label))}</span><span class="vt">${A.relShort(r.s.end)}</span></div>`;
      }).join("");
      $("nvC0").textContent = `${D.projects.length} Projekte`;
    }

    // ================= rows for sessions + steps =================
    const fresh = (s) => s.live || Date.now() - Date.parse(s.end) < 864e5;
    function renderSessions() {
      const all = st.sKey === "*";
      lists[1].querySelector(".rows").innerHTML = st.slist.map((s, i) => {
        const sign = s.live ? `<span class="sg live">●</span>` : s.agents.length ? `<span class="sg bot">${A.ic("bot")}</span>` : s.files.length ? `<span class="sg add">+</span>` : `<span class="sg"></span>`;
        const vt = all ? `<span style="color:${hsl(s.hue, 60)}">${esc(trunc(s.projName, 12))}</span> · ${A.relShort(s.end)}` : `${s.nodes.length} Schr.${s.agents.length ? ` · <span class="ag">${s.agents.length} Ag.</span>` : ""} · ${A.relShort(s.end)}`;
        return `<div class="r" data-i="${i}">${sign}<span class="nu"></span><span class="fc"></span><span class="tx">${esc(one(s.label))}</span><span class="vt">${vt}</span><button class="op" data-open="${s.id}" title="Session öffnen">⏎</button></div>`;
      }).join("") || `<div class="empty">Keine Sessions</div>`;
      const p = st.sKey === "*" ? null : D.projects.find((x) => x.path === st.sKey);
      $("nvF1").innerHTML = `<b>${p ? esc(p.name) : "alle"}</b>/sessions`;
    }
    function renderSteps() {
      const s = curS(); if (!s) { lists[2].querySelector(".rows").innerHTML = ""; return; }
      let prevDay = "";
      lists[2].querySelector(".rows").innerHTML = st.tlist.map((n, i) => {
        const ags = s.agents.filter((a) => a.node === n.id).length;
        const sign = n.id === s.last.id ? `<span class="sg now">●</span>` : ags ? `<span class="sg bot">${A.ic("bot")}</span>` : n.edits.length ? `<span class="sg add">+</span>` : `<span class="sg"></span>`;
        const dk = new Date(n.ts).toDateString(), first = dk !== prevDay; prevDay = dk;
        const vt = `${first ? A.day(n.ts).replace(/\.$/, "") + " " : ""}${A.hhmm(n.ts)}`;
        return `<div class="r" data-i="${i}">${sign}<span class="nu"></span><span class="fc ${first ? "o" : ""}">${first ? "▾" : "│"}</span><span class="tx">${s.onPath.has(n.id) ? "" : `<span class="br">↳ </span>`}${esc(one(n.text) || "(leer)")}${n.id === s.last.id ? `<span class="jt">JETZT</span>` : ""}</span><span class="vt">${vt}</span><button class="op" data-open="${s.id}" data-open-step="${n.id}" title="Schritt öffnen">⏎</button></div>`;
      }).join("") || `<div class="empty">Keine Schritte</div>`;
      $("nvF2").innerHTML = `<b>${esc(trunc(one(s.label), 26))}</b>`;
    }
    const trunc = (t, n) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
    function renderPv(typed = true) {
      const s = curS(), n = curT();
      if (!s || !n) { pvEl.innerHTML = `<div class="empty">Nichts ausgewählt</div>`; pfEl.innerHTML = ""; return; }
      pvEl.innerHTML = previewHTML(s, n, typed);
      if (typed) pvEl.scrollTop = 0;
      const isNow = n.id === s.last.id;
      pfEl.innerHTML = `<button class="go" data-open="${s.id}" data-open-step="${n.id}">${A.ic("play")} ${isNow ? "Hier weitermachen" : "Ab hier weitermachen"}</button>`;
      $("nvF3").innerHTML = `<b>schritt-${st.pIdx + 1}.md</b>`;
      $("nvC3").textContent = `${st.pIdx + 1}/${st.tlist.length}`;
    }
    function previewHTML(s, n, typed, hlIdx) {
      const ags = s.agents.filter((a) => a.node === n.id), models = [...new Set(n.models || [])], reply = clean(n.reply);
      let i = 0; const ty = () => (typed && !reduce ? `ty" style="--i:${Math.min(i++, 14)}` : "");
      return `<div class="pv">
        <div class="md-h1 ${ty()}"><i>#</i>${hlIdx ? hlIdx : esc(one(s.label))}</div>
        <div class="md-c ${ty()}">-- ${esc(s.projName)}${s.branch ? " · " + esc(s.branch) : ""} · ${A.day(n.ts)} ${A.hhmm(n.ts)} · Schritt ${s.nodes.indexOf(n) + 1}/${s.nodes.length}</div>
        <div class="md-h2 ${ty()}"><i>##</i>Du hast gefragt</div>
        <div class="md-q ${ty()}">${esc(n.text || "(leer)")}</div>
        <div class="md-h2 aq ${ty()}"><i>##</i>Claude hat geantwortet ${models.map(A.mp).join("")}</div>
        <div class="md-a ${ty()}">${esc(reply ? reply.slice(0, 1400) + (reply.length > 1400 ? " ..." : "") : "Keine Textantwort in diesem Schritt.")}</div>
        ${n.edits.length ? `<div class="md-h2 bl ${ty()}"><i>##</i>Dateien geändert · ${n.edits.length}</div>${n.edits.slice(0, 8).map((f) => `<div class="md-li ${ty()}" title="${esc(f)}"><i>•</i>${esc(f.split("/").pop())}<small>${esc(f.split("/").slice(-3, -1).join("/"))}</small></div>`).join("")}${n.edits.length > 8 ? `<div class="md-li"><i>•</i>+${n.edits.length - 8} weitere</div>` : ""}` : ""}
        ${ags.length ? `<div class="md-h2 pu ${ty()}"><i>##</i>Agents gestartet · ${ags.length}</div>${ags.map((a) => `<div class="md-li ag ${ty()}"><i>●</i>${esc(A.aName(a.type))}<small>${esc(a.description || "")}</small></div>`).join("")}` : ""}
      </div>`;
    }

    // ================= state helpers =================
    const curS = () => st.slist[st.sIdx];
    const curT = () => st.tlist[st.pIdx];
    const rowEl = (w, i) => (w === "a" ? agRowsEl : lists[w].querySelector(".rows")).querySelector(`.r[data-i="${i}"]`);
    const idxOf = (w) => (w === "a" ? st.agRows[st.aIdx]?.row : [st.tIdx, st.sIdx, st.pIdx][w]);
    function placeCursor(w, instant) {
      const L = w === "a" ? agList : lists[w], i = idxOf(w), el = i == null ? null : rowEl(w, i);
      (w === "a" ? agRowsEl : L.querySelector(".rows")).querySelectorAll(".r.sel").forEach((x) => x.classList.remove("sel"));
      const cl = L.querySelector(".cl"), cu = L.querySelector(".cur");
      if (!el) { cl.style.opacity = 0; cu.style.opacity = 0; return; }
      cl.style.opacity = ""; cu.style.opacity = "";
      el.classList.add("sel");
      const y = el.offsetTop;
      if (instant || reduce) { cl.style.transition = cu.style.transition = "none"; }
      cl.style.transform = cu.style.transform = `translateY(${y}px)`;
      if (instant || reduce) { cl.offsetWidth; cl.style.transition = cu.style.transition = ""; }
    }
    function nums(w) {
      const cur = idxOf(w);
      const rows = lists[w].querySelectorAll(".rows .r");
      rows.forEach((r, i) => { const nu = r.querySelector(".nu"); if (nu) nu.textContent = i === cur ? String(i + 1) : String(Math.abs(i - cur)); });
      if (st.visual && st.visual.w === w) { const [a, b] = [Math.min(st.visual.a, cur), Math.max(st.visual.a, cur)]; rows.forEach((r, i) => r.classList.toggle("vis", i >= a && i <= b)); }
      else rows.forEach((r) => r.classList.remove("vis"));
    }
    function ensureVisible(w, instant) {
      const L = w === "a" ? agList : lists[w], el = rowEl(w, idxOf(w)); if (!el) return;
      const top = el.offsetTop, bot = top + el.offsetHeight, pad = 44;
      const b = instant || reduce ? "auto" : "smooth";
      if (top - pad < L.scrollTop) L.scrollTo({ top: Math.max(0, top - pad), behavior: b });
      else if (bot + pad > L.scrollTop + L.clientHeight) L.scrollTo({ top: bot + pad - L.clientHeight, behavior: b });
    }
    // scrollbar with markers (satellite-like)
    function sbar(w) {
      const sb = $("nvSb" + w); if (!sb) return;
      const L = lists[w], H = sb.clientHeight, n = w === 0 ? st.tree.length : w === 1 ? st.slist.length : st.tlist.length;
      const sh = Math.max(1, L.scrollHeight), th = sb.querySelector(".th");
      const vis = L.clientHeight / sh;
      th.style.display = vis >= 1 ? "none" : "";
      th.style.height = Math.max(14, vis * H) + "px"; th.style.top = (L.scrollTop / sh) * H + "px";
      let marks = "";
      const pos = (i) => ((i + .5) / Math.max(1, n)) * (H - 3);
      if (w === 2) { const s = curS(); if (s) st.tlist.forEach((nd, i) => { const ag = s.agents.some((a) => a.node === nd.id); if (nd.edits.length) marks += `<b class="add" style="top:${pos(i)}px"></b>`; if (ag) marks += `<b class="bot" style="top:${pos(i)}px"></b>`; if (nd.id === s.last.id) marks += `<b class="now" style="top:${pos(i)}px"></b>`; }); }
      if (w === 1) st.slist.forEach((s, i) => { if (s.agents.length) marks += `<b class="bot" style="top:${pos(i)}px"></b>`; if (s.files.length) marks += `<b class="add" style="top:${pos(i)}px"></b>`; });
      marks += `<b class="cur" style="top:${pos(idxOf(w))}px"></b>`;
      sb.innerHTML = `<i class="th" style="${th.getAttribute("style") || ""}"></i>${marks}`;
    }
    const sbarAll = () => [0, 1, 2].forEach(sbar);

    // ================= buffers (bufferline) =================
    function touchBuf(id, pin) {
      let b = st.bufs.find((x) => x.id === id);
      if (!b) {
        b = { id, pin: !!pin };
        const pv = st.bufs.findIndex((x) => !x.pin);
        if (pv >= 0) st.bufs[pv] = b; else st.bufs.push(b);
        if (st.bufs.length > 10) { const j = st.bufs.findIndex((x) => x.id !== id && x.kind !== "note"); if (j >= 0) st.bufs.splice(j, 1); }
      } else if (pin) b.pin = true;
      st.buf = id; renderTabs();
    }
    function renderTabs() {
      const curBuf = st.view === "mcp" ? null : st.buf;
      $("nvTabs").innerHTML = st.bufs.map((b, i) => {
        if (b.kind === "note") return `<div class="tab nt ${b.id === curBuf ? "on" : ""}" data-buf="${esc(b.id)}" style="animation-delay:${i * 30}ms" title="${esc(b.path)}"><span class="ico nti">${A.ic("note")}</span><span class="nm">${esc(b.name)}</span>${b.dirty ? `<span class="pl">[+]</span>` : ""}
          <span class="x" data-bx="${esc(b.id)}"><span class="cx show">×</span></span></div>`;
        const s = sById.get(b.id); if (!s) return "";
        return `<div class="tab ${b.id === curBuf ? "on" : ""} ${b.pin ? "" : "pv"}" data-buf="${b.id}" style="--h:${s.hue};animation-delay:${i * 30}ms" title="${esc(s.label)}"><span class="ico">◆</span><span class="nm">${esc(trunc(one(s.label), 26))}</span>
          <span class="x" data-bx="${b.id}">${fresh(s) ? `<span class="md" title="frisch, letzte 24h">●</span>` : ""}<span class="cx ${fresh(s) ? "" : "show"}">×</span></span></div>`;
      }).join("");
      $("nvBlR").innerHTML = `<b>${Math.max(1, st.bufs.findIndex((b) => b.id === st.buf) + 1)}/${st.bufs.length}</b> Buffer`;
    }
    // o.force drops unsaved note changes, o.ask asks first (mouse / x), otherwise vim's E37
    function closeBuf(id, o = {}) {
      const i = st.bufs.findIndex((b) => b.id === id); if (i < 0) return;
      const b = st.bufs[i];
      if (b.kind === "note" && b.dirty && !o.force) {
        if (o.ask) return confirmAsk(`${b.name} hat ungespeicherte Änderungen. Verwerfen? (y/n)`, () => closeBuf(id, { force: true }));
        return cmdMsg("E37: Nicht gespeichert seit der letzten Änderung (:w speichert, :q! verwirft)", "err");
      }
      st.bufs.splice(i, 1);
      if (b.kind === "note") { b.ed?.destroy(); b.host?.remove(); }
      if (id === st.buf) {
        if (st.view === "notes") {
          const notes = st.bufs.filter((x) => x.kind === "note");
          if (notes.length) openNote(notes[Math.min(notes.length - 1, Math.max(0, i - 1))].path);
          else { st.buf = null; showNoteHost(); renderTabs(); noteBar(); renderNotesTree(); status(); }
        } else if (!st.bufs.length) { renderTabs(); return showDash(); }
        else activateBuf(st.bufs[Math.min(i, st.bufs.length - 1)]);
      } else { renderTabs(); if (b.kind === "note") renderNotesTree(); }
      cmdMsg(`Buffer geschlossen`, "");
    }
    function activateBuf(b) { if (!b) return; if (b.kind === "note") openNote(b.path); else gotoSession(b.id, null, { pin: true }); }
    function cycleBuf(d) {
      if (!st.bufs.length) return;
      const i = st.bufs.findIndex((b) => b.id === st.buf);
      activateBuf(st.bufs[(i + d + st.bufs.length) % st.bufs.length]);
    }

    // ================= selection cascade =================
    function listFor(row) {
      if (!row || row.k === "root") return { key: "*", list: D.sessions };
      const p = row.p; return { key: p.path, list: p.sessions };
    }
    function setTree(i, o = {}) {
      st.tIdx = clamp(i, 0, st.tree.length - 1);
      const row = st.tree[st.tIdx], { key, list } = listFor(row);
      const changed = key !== st.sKey;
      st.sKey = key; st.slist = list;
      if (changed) renderSessions();
      let si = o.sessId ? list.findIndex((s) => s.id === o.sessId) : row?.k === "sess" ? list.indexOf(row.s) : changed ? 0 : st.sIdx;
      placeCursor(0, o.instant); ensureVisible(0, o.instant); nums(0);
      setSess(Math.max(0, si), { force: changed || o.force, stepId: o.stepId, instant: o.instant, pin: o.pin });
    }
    function setSess(i, o = {}) {
      const prev = curS();
      st.sIdx = clamp(i, 0, Math.max(0, st.slist.length - 1));
      const s = curS();
      if (s !== prev || o.force || o.stepId) {
        st.tlist = s ? s.nodes : [];
        renderSteps();
        const si = o.stepId ? st.tlist.findIndex((n) => n.id === o.stepId) : -1;
        st.pIdx = si >= 0 ? si : Math.max(0, st.tlist.length - 1);
        placeCursor(2, true); nums(2);
        if (si >= 0) ensureVisible(2, true); else lists[2].scrollTop = lists[2].scrollHeight;
        renderPv();
        if (s) touchBuf(s.id, o.pin);
      }
      // keep the tree cursor on the matching child row when it sits on a session
      const tr = st.tree[st.tIdx];
      if (tr?.k === "sess" && s && tr.s !== s) { const j = st.tree.findIndex((r) => r.k === "sess" && r.s === s); if (j >= 0) { st.tIdx = j; placeCursor(0); ensureVisible(0); } }
      $("nvC1").textContent = st.slist.length ? `${st.sIdx + 1}/${st.slist.length}` : "0";
      $("nvC2").textContent = st.tlist.length ? `${st.pIdx + 1}/${st.tlist.length}` : "";
      placeCursor(1, o.instant); ensureVisible(1, o.instant); nums(1);
      remember(); sbarAll(); status(); kick();
    }
    // live data refills the arrays in place, so the selection is remembered by id
    function remember() { const s = curS(), n = curT(), r = st.tree[st.tIdx]; st.selIds = { s: s?.id, n: n?.id, last: !!s && n?.id === s.last.id, t: r?.k === "proj" ? "p:" + r.p.path : r?.k === "sess" ? "s:" + r.s.id : "root" }; }
    function setStep(i) {
      st.pIdx = clamp(i, 0, Math.max(0, st.tlist.length - 1));
      placeCursor(2); ensureVisible(2); nums(2); renderPv(); sbar(2); remember();
      $("nvC2").textContent = st.tlist.length ? `${st.pIdx + 1}/${st.tlist.length}` : "";
      status(); kick();
    }
    function gotoSession(id, stepId, o = {}) {
      const s = sById.get(id); if (!s) return;
      if (st.view === "dash") showEditor();
      if (st.view !== "editor") setView("editor");
      const cur = st.tree[st.tIdx];
      if (cur?.k === "root") { setTree(0, { sessId: id, stepId, pin: o.pin, force: true }); return; }
      if (!st.open.has(s.project)) { st.open.add(s.project); buildTree(); renderTree(); }
      const j = st.tree.findIndex((r) => r.k === "proj" && r.p.path === s.project);
      setTree(j, { sessId: id, stepId, pin: o.pin, force: true });
    }
    function toggleFold(i) {
      const r = st.tree[i]; if (!r || r.k !== "proj") return;
      if (st.open.has(r.p.path)) st.open.delete(r.p.path); else st.open.add(r.p.path);
      buildTree(); renderTree();
      st.tIdx = st.tree.indexOf(r); placeCursor(0, true); nums(0); sbar(0); remember(); kick();
    }

    // ================= windows + modes =================
    function setWin(w) {
      const max = st.view === "agents" ? 1 : 3;
      st.win = clamp(w, 0, max);
      wins.forEach((el, i) => el.classList.toggle("on", st.view !== "agents" && i === st.win));
      agW.classList.toggle("on", st.view === "agents" && st.win === 1);
      if (st.win >= 2 && curS()) touchBuf(curS().id, true);
      if (st.visual && st.visual.w !== st.win) exitVisual();
      status();
    }
    function setMode(m) { st.mode = m; status(); }
    function exitVisual() { if (!st.visual) return; const w = st.visual.w; st.visual = null; nums(w); setMode("NORMAL"); cmdMsg(""); }

    // ================= statusline (lualine) =================
    function status() {
      const mc = MODE_C[st.mode] || MODE_C.NORMAL, s = curS(), n = curT();
      let c = "", x = "", y = "", br = "main";
      const clk = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
      if (st.view === "dash") { c = `<span class="fn"><b>dashboard</b></span>`; y = `${D.totals.sessions} Sessions`; br = "atlas"; }
      else if (st.view === "notes") {
        const b = curNote(), pj = b && noteProject(b);
        br = pj ? A.projName(pj) : "notes";
        if (b) {
          const cu = b.ed.cursor(), L = b.ed.lines();
          c = `<span class="fn">${b.pf ? esc(A.projName(dirOf(b.path))) : "notes"}<i>/</i><b>${esc(b.name)}</b></span>${b.dirty ? `<span class="mo">[+]</span>` : ""}`;
          x = `<span class="enc">utf-8 · markdown</span>`;
          y = `${cu.line}:${cu.col} · ${L <= 1 ? "Alle" : cu.line === 1 ? "Top" : cu.line === L ? "Bot" : Math.round(((cu.line - 1) / (L - 1)) * 100) + "%"}`;
        } else { c = `<span class="fn"><b>notes</b></span>`; y = `${st.notes.list?.notes.length || 0} Notizen`; }
      } else if (st.view === "mcp") {
        const n = (st.mcp.data?.groups || []).reduce((k, g) => k + g.servers.length, 0);
        br = "mcp"; c = `<span class="fn">mcp<i>/</i><b>servers</b></span>${st.mcp.data?.demo ? `<span class="mo">demo</span>` : ""}`; y = `${n} Server`;
      }
      else if (st.view === "agents") {
        const r = st.agRows[st.aIdx], as = r && sById.get(r.sid);
        c = `<span class="fn">agents<i>/</i><b>${as ? esc(trunc(one(as.label), 60)) : "-"}</b></span>`;
        y = `Eintrag ${st.aIdx + 1}/${st.agRows.length}`; br = as?.branch || "main";
      } else if (s) {
        const m = (n?.models || [])[0] || s.modelList[0], mi = A.modelInfo(m);
        br = s.branch || "-";
        c = `<span class="fn">${esc(s.projName)}<i>/</i><b>${esc(one(s.label))}</b></span>${fresh(s) ? `<span class="mo">[+]</span>` : ""}`;
        x = `${m ? `<span class="m" style="--c:${FAM[mi.fam] || FAM.x};color:${FAM[mi.fam] || FAM.x}">${esc(mi.name)}</span>` : ""}<span style="color:var(--ye)">${A.usd(s.cost?.usd)}</span><span class="enc">utf-8 · md</span>`;
        const pct = st.tlist.length <= 1 ? "Alle" : st.pIdx === 0 ? "Top" : st.pIdx === st.tlist.length - 1 ? "Bot" : Math.round((st.pIdx / (st.tlist.length - 1)) * 100) + "%";
        y = `Schritt ${st.pIdx + 1}/${st.tlist.length} · ${pct}`;
      }
      $("nvSl").innerHTML = `<span class="s-a" style="--mc:${mc}">${st.mode}</span><span class="s-b">${A.ic("branch")}${esc(br)}</span><span class="s-c">${c}</span>
        ${x ? `<span class="s-x">${x}</span>` : ""}<span class="s-sc ${st.show ? "on" : ""}" id="nvShowSl">${esc(st.show)}</span><span class="s-y">${y}</span><span class="s-z" style="--mc:${mc}">${clk}</span>`;
    }
    const clkT = setInterval(() => alive && status(), 20e3);

    // ================= cables with spring physics + particles =================
    const svg = $("nvW");
    const spr = () => ({ x: null, v: 0, t: 0 });
    const W = [0, 1, 2].map((i) => {
      const g = $("nvw" + i);
      return { g, y1: spr(), y2: spr(), x1: 0, x2: 0, ok: false, grad: $("nvg" + i), paths: [...g.querySelectorAll("path")], parts: [...g.querySelectorAll(".w-p")], ends: [...g.querySelectorAll(".w-end")], len: 0 };
    });
    W[0].ends[0].setAttribute("stroke", "#fe8019"); W[0].ends[1].setAttribute("stroke", "#fabd2f");
    W[1].ends[0].setAttribute("stroke", "#fabd2f"); W[1].ends[1].setAttribute("stroke", "#8ec07c");
    W[2].ends[0].setAttribute("stroke", "#8ec07c"); W[2].ends[1].setAttribute("stroke", "#83a598");
    function measure() {
      if (st.view !== "editor") { W.forEach((w) => { w.ok = false; w.g.classList.add("off"); }); return; }
      const mr = main.getBoundingClientRect(); if (!mr.width) return;
      const wr = wins.map((el) => el.getBoundingClientRect());
      const yOf = (w) => {
        const el = rowEl(w, idxOf(w)); if (!el) return null;
        const r = el.getBoundingClientRect(), L = lists[w].getBoundingClientRect();
        return clamp(r.top + r.height / 2, L.top + 10, L.bottom - 10) - mr.top;
      };
      for (let i = 0; i < 3; i++) {
        const w = W[i], y1 = yOf(i);
        let y2;
        if (i < 2) y2 = yOf(i + 1);
        else { const q = pvEl.querySelector(".md-q"); y2 = q ? clamp(q.getBoundingClientRect().top + 9, wr[3].top + 40, wr[3].bottom - 70) - mr.top : null; }
        w.ok = y1 != null && y2 != null;
        w.g.classList.toggle("off", !w.ok);
        if (!w.ok) continue;
        w.x1 = wr[i].right - mr.left + 1; w.x2 = wr[i + 1].left - mr.left - 1;
        w.y1.t = y1; w.y2.t = y2;
        if (w.y1.x == null || reduce) { w.y1.x = y1; w.y2.x = y2; }
        w.grad.setAttribute("x1", w.x1); w.grad.setAttribute("x2", w.x2);
      }
    }
    const curve = (x1, y1, x2, y2) => { const dx = (x2 - x1) * .7; return `M${x1.toFixed(1)},${y1.toFixed(1)} C${(x1 + dx).toFixed(1)},${y1.toFixed(1)} ${(x2 - dx).toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`; };
    function draw(time) {
      for (const w of W) {
        if (!w.ok) continue;
        const d = curve(w.x1, w.y1.x, w.x2, w.y2.x);
        w.paths.forEach((p) => p.setAttribute("d", d));
        w.ends[0].setAttribute("cx", w.x1); w.ends[0].setAttribute("cy", w.y1.x); w.ends[1].setAttribute("cx", w.x2); w.ends[1].setAttribute("cy", w.y2.x);
        const core = w.paths[1], len = core.getTotalLength();
        w.parts.forEach((c, k) => {
          if (reduce) { c.setAttribute("r", 0); return; }
          const t = ((time / 1500) + k / 3) % 1, p = core.getPointAtLength(t * len);
          c.setAttribute("cx", p.x.toFixed(1)); c.setAttribute("cy", p.y.toFixed(1));
          c.setAttribute("opacity", Math.sin(Math.PI * t).toFixed(2));
        });
      }
    }
    let raf = 0, lastTs = 0;
    function tick(ts) {
      raf = 0;
      if (!alive || st.view !== "editor" || document.hidden) { lastTs = 0; return; }
      const dt = Math.min(1 / 30, lastTs ? (ts - lastTs) / 1000 : 1 / 60); lastTs = ts;
      let moving = false;
      for (const w of W) for (const s of [w.y1, w.y2]) {
        if (s.x == null) continue;
        const a = -200 * (s.x - s.t) - 18 * s.v; s.v += a * dt; s.x += s.v * dt;
        if (Math.abs(s.x - s.t) > .15 || Math.abs(s.v) > .15) moving = true; else { s.x = s.t; s.v = 0; }
      }
      draw(ts);
      if (moving || !reduce) raf = requestAnimationFrame(tick);
    }
    function kick() { measure(); if (reduce) { draw(0); return; } if (!raf) raf = requestAnimationFrame(tick); }
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);

    // ================= agents view =================
    function renderAgents() {
      const withA = D.sessions.filter((s) => s.agents.length);
      const rows = []; st.agRows = [];
      rows.push({ html: `<div class="ag-c">-- Agents: Helfer, die Claude losgeschickt hat. Enter öffnet die Session beim auslösenden Schritt.</div>` });
      rows.push({ html: "" });
      const paths = [];
      withA.forEach((s) => {
        const rootRow = rows.length;
        st.agRows.push({ row: rootRow, sid: s.id });
        rows.push({ sel: true, sid: s.id, html: `<span class="sg bot">${A.ic("bot")}</span><span class="nu"></span><span class="ag-l"><span class="rt" style="--h:${s.hue}">◆</span><span class="sl">${esc(one(s.label))}</span></span>
          <span class="ag-r"><span style="color:${hsl(s.hue, 60)}">${esc(s.projName)}</span><span>${s.agents.length} Agents</span><span>${A.relShort(s.end)}</span>${s.modelList.slice(0, 1).map(A.mp).join("")}</span>` });
        const groups = [];
        for (const a of s.agents) { let g = groups.find((x) => x.node === a.node); if (!g) groups.push((g = { node: a.node, list: [] })); g.list.push(a); }
        groups.forEach((g, gi) => {
          const lastG = gi === groups.length - 1, n = s.byId[g.node], no = n ? s.nodes.indexOf(n) + 1 : "?";
          const stepRow = rows.length;
          st.agRows.push({ row: stepRow, sid: s.id, step: g.node });
          rows.push({ sel: true, html: `<span class="sg"></span><span class="nu"></span><span class="ag-l"><span class="bx">${lastG ? "└─" : "├─"}</span><span class="nd">◇</span><b>Schritt ${no}</b><span class="st">${esc(trunc(one(n?.text), 120))}</span></span><span class="ag-r">${n ? A.hhmm(n.ts) : ""}</span>` });
          g.list.forEach((a, ai) => {
            const lastA = ai === g.list.length - 1, ar = rows.length;
            st.agRows.push({ row: ar, sid: s.id, step: g.node });
            const dur = a.end && a.start ? A.fmtDur(Date.parse(a.end) - Date.parse(a.start)) : "-";
            rows.push({ sel: true, html: `<span class="sg"></span><span class="nu"></span><span class="ag-l"><span class="bx">${lastG ? " " : "│"}  ${lastA ? "└─" : "├─"}</span><span class="dt">●</span><b>${esc(A.aName(a.type))}</b><span class="ds">${esc(a.description || "")}</span></span>
              <span class="ag-r">${Object.keys(a.models || {}).slice(0, 2).map(A.mp).join("")}<span class="du">${dur}</span><span>${A.fmtTok(a.tokens || 0)} Tok.</span><span>${a.steps || 0} Schr.</span></span>` });
            paths.push({ root: rootRow, step: stepRow, ag: ar, hue: s.hue, k: paths.length });
          });
        });
        rows.push({ html: "" });
      });
      const others = D.sessions.length - withA.length;
      rows.push({ html: `<div class="ag-c">-- ${others} weitere Sessions ohne Agents: dort hat Claude allein gearbeitet.</div>` });
      agRowsEl.innerHTML = rows.map((r, i) => `<div class="r" data-i="${i}" ${r.sel ? "" : `style="cursor:default"`}>${r.html}</div>`).join("") + `<span id="nvCh" style="position:absolute;visibility:hidden;white-space:pre">0000000000</span>`;
      $("nvCa").textContent = `${D.totals.agents} Agents · ${withA.length} Sessions`;
      requestAnimationFrame(() => agParticles(paths));
      st.aIdx = clamp(st.aIdx, 0, Math.max(0, st.agRows.length - 1));
      placeCursor("a", true); agNums();
    }
    function agParticles(paths) {
      if (!alive || st.view !== "agents") return;
      agRowsEl.querySelectorAll(".ag-pt").forEach((e) => e.remove());
      let ch = (agRowsEl.querySelector("#nvCh")?.getBoundingClientRect().width || 75) / 10;
      const first = agRowsEl.querySelector('.r[data-i="0"]'); if (!first) return;
      const RH = first.offsetHeight, top0 = first.offsetTop;
      const bxEl = agRowsEl.querySelector(".ag-l .bx"), bxR = bxEl?.getBoundingClientRect(), base = bxR ? bxR.left - agRowsEl.getBoundingClientRect().left : 70;
      if (bxR && bxR.width) ch = bxR.width / bxEl.textContent.length; // box-drawing glyph advance
      const yc = (row) => top0 + row * RH + RH / 2;
      const x0 = base + ch * .5, xStep = base + ch * 2 + 4, xs = base + ch * 3.5, xAg = base + ch * 5 + 8;
      let html = "";
      paths.forEach((p) => {
        // two rides: trunk -> step node, then step sub-trunk -> agent dot
        const d1 = `path('M ${x0.toFixed(1)} ${(yc(p.root) + 8).toFixed(1)} V ${yc(p.step).toFixed(1)} H ${xStep.toFixed(1)}')`;
        const d2 = `path('M ${xs.toFixed(1)} ${(yc(p.step) + 8).toFixed(1)} V ${yc(p.ag).toFixed(1)} H ${xAg.toFixed(1)}')`;
        const dl = (p.k * .37) % 2.4;
        html += `<i class="ag-pt" style="offset-path:${d1};--pc:${hsl(p.hue)};--d:2.2s;--dl:-${dl.toFixed(2)}s"></i><i class="ag-pt" style="offset-path:${d2};--pc:#d3869b;--d:1.8s;--dl:-${(dl * .8 + .5).toFixed(2)}s"></i>`;
      });
      agRowsEl.insertAdjacentHTML("beforeend", html);
    }
    function agNums() {
      const cur = st.agRows[st.aIdx]?.row;
      agRowsEl.querySelectorAll(".r").forEach((r, i) => { const nu = r.querySelector(".nu"); if (nu) nu.textContent = i === cur ? String(i + 1) : String(Math.abs(i - cur)); });
      $("nvCa").textContent = `${st.aIdx + 1}/${st.agRows.length} · ${D.totals.agents} Agents`;
    }
    function setAg(i) { st.aIdx = clamp(i, 0, Math.max(0, st.agRows.length - 1)); placeCursor("a"); ensureVisible("a"); agNums(); status(); }
    function openAg() { const r = st.agRows[st.aIdx]; if (!r) return; A.open(r.sid, r.step || sById.get(r.sid)?.last.id); }

    // ================= views =================
    function setView(v) {
      st.view = v;
      const ag = v === "agents", nt = v === "notes", mc = v === "mcp";
      main.hidden = nt || mc; notesEl.hidden = !nt; mcpEl.hidden = !mc;
      if (!nt) blurEditor();
      root.querySelectorAll(".ed-only").forEach((el) => (el.hidden = ag));
      agW.hidden = !ag;
      $("nvBlOff").innerHTML = nt ? `${A.ic("note")} Notizen` : mc ? `${A.ic("plug")} MCP` : `${A.ic("folder")} Explorer`;
      if (st.visual) exitVisual();
      if (v === "editor" && curS() && st.buf !== curS().id) touchBuf(curS().id, true);
      if (nt || mc) { setMode("NORMAL"); renderTabs(); }
      else if (ag) { renderAgents(); setWin(1); cmdMsg(":Agents", ""); }
      else { setWin(st.win > 3 ? 1 : st.win); requestAnimationFrame(() => { [0, 1, 2].forEach((w) => placeCursor(w, true)); sbarAll(); kick(); }); }
      status(); kick();
    }
    function showEditor(view = "editor") {
      if (st.view === "dash") { dash.hidden = true; ed.hidden = false; }
      setView(view);
      requestAnimationFrame(() => { [0, 1, 2].forEach((w) => { placeCursor(w, true); nums(w); }); sbarAll(); kick(); });
    }
    function showDash() {
      closeTel(); closeWk(); closeCmd(); closeSel(); closeForm(); blurEditor();
      main.hidden = false; notesEl.hidden = true; mcpEl.hidden = true;
      st.view = "dash"; ed.hidden = true; dash.hidden = false; st.dIdx = 0;
      renderDash(); setMode("NORMAL"); cmdMsg(""); kick();
    }
    function dashAct(k) {
      if (k === "r") { showEditor(); setTree(0, { sessId: D.sessions[0]?.id, force: true }); setWin(1); notify("Neueste Sessions über alle Projekte", { title: "Zuletzt", icon: "clock" }); }
      else if (k === "f") { showEditor(); openTel(""); }
      else if (k === "p") { showEditor(); setWin(0); }
      else if (k === "a") { showEditor("agents"); }
      else if (k === "n") showNotes();
      else if (k === "m") showMcp();
      else if (k === "o") openCmd("NewProject ");
      else if (k === "s") {
        const el = $("nvStats"); el?.classList.add("pulse"); later(() => el?.classList.remove("pulse"), 1400);
        const peak = days30.reduce((a, b) => (b.v > a.v ? b : a), days30[0]);
        notify(`Ø ${Math.round(days30.reduce((n, x) => n + x.v, 0) / 30)} Schritte pro Tag, Spitze ${peak.v} am ${dlabel(peak.d)}.`, { title: "Statistik", icon: "grid", lv: "warn" });
      } else if (k === "q") { showEditor(); notify("Dashboard geschlossen. Zurück mit :Dashboard oder Space d", { title: ":q", icon: "x" }); }
    }

    // ================= cmdline + wildmenu =================
    const CMDS = [["Dashboard", "Startbildschirm mit Statistik"], ["Projects", "Projektbaum fokussieren"], ["Agents", "Agent-Bäume aller Sessions"], ["Recent", "Neueste Sessions, alle Projekte"],
      ["Find", "Telescope öffnen, z.B. :Find login"], ["Notes", "Notizen: Baum und Editor"], ["new", "Neue Notiz, z.B. :new Ideen"], ["Anforderungen", "Vorlage fürs gewählte Projekt, z.B. :Anforderungen Suche"],
      ["Agent", "Notiz an Claude geben"], ["w", "Notiz speichern"], ["wq", "Notiz speichern und schliessen"], ["Mcp", "MCP-Server anzeigen"], ["McpCheck", "MCP-Status prüfen (claude mcp list)"],
      ["McpAdd", "MCP-Server hinzufügen"], ["NewProject", "Neues Projekt anlegen (Ort wählbar), startet Claude dort, z.B. :NewProject shop"], ["Terminal", "Terminal ein / aus (Ctrl+`)"], ["Resume", "Weitermachen-Befehl kopieren"], ["q", "Buffer schliessen"]];
    const ARGS = new Set(["Find", "new", "Anforderungen", "NewProject"]);
    const cin = $("nvCmdIn"), wild = $("nvWild");
    function openCmd(pre = "") {
      closeWk(); st.cmd = { i: -1 };
      $("nvCin").hidden = false; msgEl.hidden = true; $("nvHint").hidden = true;
      cin.value = pre; setMode("COMMAND"); renderWild(); cin.focus();
    }
    function closeCmd() {
      if (!st.cmd) return; st.cmd = null;
      $("nvCin").hidden = true; msgEl.hidden = false; $("nvHint").hidden = false; wild.hidden = true; cin.blur();
      if (st.mode === "COMMAND") setMode("NORMAL");
    }
    const wildMatches = () => { const w = cin.value.trim().split(/\s+/)[0].toLowerCase(); return CMDS.filter(([c]) => c.toLowerCase().startsWith(w)); };
    function renderWild() {
      const m = wildMatches();
      wild.hidden = !m.length || /\s/.test(cin.value.trim());
      wild.innerHTML = m.map(([c, d], i) => `<button data-cmd="${c}" class="${i === st.cmd?.i ? "on" : ""}"><i>:</i><b>${c}</b><span>${d}</span></button>`).join("");
    }
    // New project: create ~/gitroot/<name> (git init + README) and start a fresh Claude session there.
    // It shows up in the tree as soon as Claude has written its first transcript line.
    async function newProject(name) {
      const api = window.atlasApp?.projects;
      if (!api) return cmdMsg("Neue Projekte gibt es nur in der Desktop-App", "err");
      if (!name) return openCmd("NewProject ");
      const home = window.atlasApp?.info?.home || "";
      openSelect(`Neues Projekt: ${name}`, [
        { label: "Eigene Projekte", desc: "~/projects · private Projekte, z.B. für GitHub", hint: "~/projects" },
        { label: "Firma", desc: "~/gitroot · Firmen-Repos (Azure DevOps)", hint: "~/gitroot" },
        { label: "Anderer Ordner …", desc: "Ordner im Mac-Dialog auswählen", hint: "Finder" },
      ], async (i) => {
        const parent = i === 0 ? home + "/projects" : i === 1 ? home + "/gitroot" : await api.pickParent();
        if (!parent) return cmdMsg("Abgebrochen", "");
        try {
          const r = await api.create(name, parent);
          notify(`${r.existed ? "Ordner gab es schon" : "Angelegt"}: ${A.short(r.path)}. Claude startet dort im Terminal.`, { title: ":NewProject", icon: "folder" });
          window.AtlasTerminal?.open(null, false, { cwd: r.path, label: r.path.split("/").pop() });
        } catch (e) { cmdMsg("E: " + String(e.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, ""), "err"); }
      });
    }
    function runCmd(text) {
      closeCmd();
      const t = text.trim(); if (!t) return;
      if (/^\d+$/.test(t)) { if (st.view === "notes" || st.view === "mcp") listJump(+t - 1); else gotoLine(+t); return; }
      const [w, ...rest] = t.split(/\s+/), arg = rest.join(" ");
      const lw = w.toLowerCase();
      if (st.view === "notes" && (lw === "q!" || lw === "x")) { const b = curNote(); if (b) return lw === "x" ? noteEx(b, "wq", {}) : closeBuf(b.id, { force: true }); }
      const hit = CMDS.find(([c]) => c.toLowerCase() === lw) || (lw.length > 1 && CMDS.filter(([c]) => c.toLowerCase().startsWith(lw)).length === 1 ? CMDS.find(([c]) => c.toLowerCase().startsWith(lw)) : null);
      const c = hit ? hit[0] : lw === "qa" || lw === "q!" ? "Dashboard" : null;
      if (!c) { cmdMsg(`E492: Kein Editor-Befehl: ${t}`, "err"); return; }
      if (c === "Dashboard") showDash();
      else if (c === "Projects") { if (st.view === "dash") showEditor(); else if (st.view === "agents") setView("editor"); setWin(0); cmdMsg(":Projects", ""); }
      else if (c === "Agents") { if (st.view === "dash") showEditor("agents"); else setView("agents"); }
      else if (c === "Recent") { if (st.view !== "editor") showEditor(); setTree(0, { sessId: D.sessions[0]?.id, force: true }); setWin(1); cmdMsg(":Recent", ""); }
      else if (c === "Find") { if (st.view === "dash") showEditor(); openTel(arg); }
      else if (c === "Resume") yank(false);
      else if (c === "Notes") showNotes();
      else if (c === "new") newNote(arg, false);
      else if (c === "Anforderungen") newNote(arg, true);
      else if (c === "Agent") agentHandoff();
      else if (c === "w" || c === "wq") { const b = curNote(); if (b) noteEx(b, c, {}); else cmdMsg("E32: Keine Notiz offen", "err"); }
      else if (c === "Mcp") showMcp();
      else if (c === "NewProject") newProject(arg);
      else if (c === "McpCheck") { (st.view === "mcp" ? Promise.resolve() : showMcp()).then(mcpCheck); }
      else if (c === "McpAdd") { (st.view === "mcp" ? Promise.resolve() : showMcp()).then(openMcpForm); }
      else if (c === "Terminal") { if (window.AtlasTerminal) window.AtlasTerminal.toggle(); else cmdMsg("Das Terminal gibt es nur in der Desktop-App", "err"); }
      else if (c === "q") {
        if (st.view === "notes") { const b = curNote(); if (b) closeBuf(b.id); else showEditor(); }
        else if (st.view === "mcp") showEditor();
        else if (st.view === "agents") setView("editor"); else if (st.view === "dash") showEditor(); else if (st.buf) closeBuf(st.buf); }
    }
    function gotoLine(n) {
      const w = st.view === "agents" ? "a" : st.win;
      if (w === "a") return setAg(n - 1);
      if (w === 0) setTree(n - 1); else if (w === 1) setSess(n - 1); else if (w === 2) setStep(n - 1);
    }

    // ================= telescope =================
    const tel = $("nvTel"), telIn = $("nvTelIn"), telList = $("nvTelList");
    const TI = [];
    function buildTI() {
      TI.length = 0;
      for (const s of D.sessions) {
        TI.push({ k: "s", s, txt: one(s.label).slice(0, 160), low: one(s.label).slice(0, 160).toLowerCase(), extra: (s.projName + " " + s.about).toLowerCase() });
        for (const n of s.nodes) { const t = one(n.text).slice(0, 180); if (t) TI.push({ k: "t", s, n, txt: t, low: t.toLowerCase(), extra: "" }); }
      }
    }
    buildTI();
    function fzOne(tok, s) {
      let j = 0, score = 0, prev = -2; const idx = [];
      const direct = s.indexOf(tok);
      if (direct >= 0) { for (let i = 0; i < tok.length; i++) idx.push(direct + i); return { score: tok.length * 6 + (direct === 0 || /[\s\-_/.]/.test(s[direct - 1]) ? 6 : 0), idx }; }
      for (let i = 0; i < s.length && j < tok.length; i++) {
        if (s[i] === tok[j]) { idx.push(i); score += 1 + (i === prev + 1 ? 3 : 0) + (i === 0 || /[\s\-_/.]/.test(s[i - 1]) ? 2 : 0); prev = i; j++; }
      }
      return j === tok.length ? { score, idx } : null;
    }
    function telSearch(q) {
      const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!toks.length) return D.sessions.slice(0, 40).map((s) => ({ it: TI.find((x) => x.k === "s" && x.s === s), hi: new Set(), score: 0 }));
      const out = [];
      for (const it of TI) {
        let score = 0; const hi = new Set(); let ok = true;
        for (const t of toks) {
          const a = fzOne(t, it.low);
          if (a && a.score >= t.length * 1.2) { score += a.score; a.idx.forEach((i) => hi.add(i)); continue; }
          if (it.extra && it.extra.includes(t)) { score += t.length; continue; }
          ok = false; break;
        }
        if (ok) out.push({ it, hi, score: score + (it.k === "s" ? 8 : 0) - (Date.now() - Date.parse(it.n?.ts || it.s.end)) / 864e5 * .05 });
      }
      return out.sort((a, b) => b.score - a.score).slice(0, 80);
    }
    const hlTxt = (txt, hi) => (hi.size ? [...txt].map((c, i) => (hi.has(i) ? `<span class="fz">${esc(c)}</span>` : esc(c))).join("") : esc(txt));
    function openTel(q = "") {
      closeWk(); closeCmd();
      st.tel = { res: [], i: 0 };
      tel.hidden = false; $("nvTelBg").hidden = false;
      telIn.value = q; telIn.focus(); setMode("INSERT"); telRun();
    }
    function closeTel() {
      if (!st.tel) return; st.tel = null;
      tel.hidden = true; $("nvTelBg").hidden = true; telIn.blur();
      if (st.mode === "INSERT") setMode("NORMAL");
    }
    function telRun() {
      st.tel.res = telSearch(telIn.value); st.tel.i = 0;
      $("nvTelCnt").textContent = `${st.tel.res.length} / ${TI.length}`;
      telList.innerHTML = st.tel.res.map((r, i) => `<div class="ti" data-ti="${i}"><span class="car">&gt;</span><span class="k ${r.it.k}" style="--h:${r.it.s.hue}">${r.it.k === "s" ? "◆" : "›"}</span>
        <span class="x">${hlTxt(r.it.txt, r.hi)}</span><span class="mt">${r.it.k === "s" ? esc(r.it.s.projName) : esc(trunc(one(r.it.s.label), 30))}</span></div>`).join("") || `<div class="empty">Keine Treffer</div>`;
      telSel(0);
    }
    function telSel(i) {
      if (!st.tel) return;
      st.tel.i = clamp(i, 0, Math.max(0, st.tel.res.length - 1));
      telList.querySelectorAll(".ti").forEach((el) => el.classList.toggle("on", +el.dataset.ti === st.tel.i));
      telList.querySelector(".ti.on")?.scrollIntoView({ block: "nearest" });
      const r = st.tel.res[st.tel.i];
      if (!r) { $("nvTelPv").innerHTML = `<div class="empty">Nichts zu zeigen</div>`; return; }
      const s = r.it.s, n = r.it.n || s.last;
      $("nvTelPv").innerHTML = previewHTML(s, n, false, r.it.k === "s" ? hlTxt(r.it.txt, r.hi) : null);
    }
    function telOpen() {
      const r = st.tel?.res[st.tel.i]; if (!r) return;
      const s = r.it.s, n = r.it.n;
      closeTel();
      gotoSession(s.id, n?.id || null, { pin: true });
      setWin(n ? 2 : 1);
      A.open(s.id, n?.id || s.last.id);
    }
    telIn.addEventListener("input", () => telRun());
    telIn.addEventListener("keydown", (e) => {
      if (!st.tel) return;
      const k = e.key;
      if (k === "Escape") { e.preventDefault(); e.stopPropagation(); closeTel(); }
      else if (k === "Enter") { e.preventDefault(); e.stopPropagation(); telOpen(); }
      else if (k === "ArrowDown" || (e.ctrlKey && (k === "n" || k === "j"))) { e.preventDefault(); telSel(st.tel.i + 1); }
      else if (k === "ArrowUp" || (e.ctrlKey && (k === "p" || k === "k"))) { e.preventDefault(); telSel(st.tel.i - 1); }
    });
    telList.addEventListener("mousemove", (e) => { const el = e.target.closest(".ti"); if (el && +el.dataset.ti !== st.tel?.i) telSel(+el.dataset.ti); });
    telList.addEventListener("click", (e) => { const el = e.target.closest(".ti"); if (el) { telSel(+el.dataset.ti); telOpen(); } });
    $("nvTelBg").addEventListener("click", closeTel);

    cin.addEventListener("input", () => { if (st.cmd) { st.cmd.i = -1; renderWild(); } });
    cin.addEventListener("keydown", (e) => {
      if (!st.cmd) return;
      const k = e.key, m = wildMatches();
      if (k === "Escape") { e.preventDefault(); e.stopPropagation(); closeCmd(); cmdMsg(""); }
      else if (k === "Enter") { e.preventDefault(); e.stopPropagation(); const pick = st.cmd.i >= 0 && m[st.cmd.i] && !/\s/.test(cin.value.trim()) ? m[st.cmd.i][0] : null; runCmd(pick && pick.toLowerCase() !== cin.value.trim().toLowerCase() ? pick : cin.value); }
      else if (k === "Tab" || k === "ArrowDown" || k === "ArrowUp") {
        e.preventDefault(); if (!m.length) return;
        const d = k === "ArrowUp" || e.shiftKey ? -1 : 1;
        st.cmd.i = (st.cmd.i + d + m.length) % m.length;
        const keep = m; cin.value = keep[st.cmd.i][0] + (ARGS.has(keep[st.cmd.i][0]) ? " " : "");
        wild.innerHTML = keep.map(([c, ds], i) => `<button data-cmd="${c}" class="${i === st.cmd.i ? "on" : ""}"><i>:</i><b>${c}</b><span>${ds}</span></button>`).join("");
        wild.hidden = false;
      } else if (k === "Backspace" && !cin.value) { e.preventDefault(); closeCmd(); }
    });
    cin.addEventListener("blur", () => later(() => { if (st.cmd && document.activeElement !== cin) closeCmd(); }, 120));

    // ================= which-key =================
    const wk = $("nvWk");
    const wkList = () => [["f", "Suchen (Telescope)", "f"], st.view === "notes" ? ["a", "Notiz an Claude geben", "a"] : ["a", "Agents-Bäume", "a"], ["n", "Notizen", "n"], ["m", "MCP-Server", "m"], ["N", "Neues Projekt", "N"],
      ["t", "Terminal ein / aus", "t"], ["d", "Dashboard", "d"], ["p", "Projektbaum", "p"], ["r", "Neueste Sessions", "r"], ["y", "Weitermachen-Befehl kopieren", "y"],
      ["b", "Buffer schliessen", "b"], ["o", "Session im Detail öffnen", "o"], ...(st.view === "notes" ? [["w", "Notiz speichern", "w"]] : [])];
    const KEYS_NOTES = [["j / k", "Notiz wählen"], ["Enter / l", "öffnen, in den Editor"], ["h", "Ordner zu / hoch"], ["Ctrl-w h", "Editor zurück zum Baum"], ["i a o", "schreiben (INSERT)"],
      ["Esc", "zurück zu NORMAL"], ["v / V", "markieren (VISUAL)"], ["u / Ctrl-r", "rückgängig / wieder"], [":w :q :wq", "speichern / schliessen"], [":new Name", "neue Notiz"],
      [":Anforderungen", "+ Name: Vorlage"], ["a", "an Claude geben (im Baum)"], ["r", "Liste neu laden"], ["H / L", "Buffer wechseln"], ["x", "Buffer schliessen"]];
    const KEYS_MCP = [["j / k", "Server wählen"], ["gg / G", "Anfang / Ende"], ["c", "Status prüfen"], ["a", "Server hinzufügen"], ["dd", "Server entfernen"], ["r", "neu laden"], [":McpCheck", "Status prüfen"], [":Notes", "zu den Notizen"]];
    const KEYS = [["j / k", "runter / hoch"], ["h / l", "Fenster links / rechts"], ["w / b", "nächstes / voriges Fenster"], ["0 ^ / $", "erstes / letztes Fenster"],
      ["gg / G", "Anfang / Ende"], ["5j 3k 12G", "Zähler + Bewegung"], ["Ctrl-d/u", "halbe Seite runter / hoch"], ["{ / }", "Projekt / Tag springen"], ["zz", "Zeile zentrieren"],
      ["H / L", "Buffer wechseln"], ["Enter", "öffnen"], ["o", "Ordner auf / zu"], ["v", "Visual: Schritte markieren"], ["V", "Visual Line: ganze Sessions"], ["y", "kopieren (Markdown / Befehl)"],
      ["/", "Telescope"], [":", "Befehlszeile"], ["a", "Agents"], ["x", "Buffer schliessen"], ["Esc", "abbrechen"]];
    function openWk() {
      closeCmd(); st.wk = true; wk.hidden = false;
      wk.innerHTML = `<div class="wk-h"><b>Space</b> Leader · nächste Taste wählen · <kbd>Esc</kbd> schliesst</div>
        <div class="wk-g">${wkList().map(([k, d, a]) => `<button class="grp" data-wk="${a}"><span class="k">${k}</span><span class="ar">→</span><span class="d">${d}</span></button>`).join("")}
          <span class="wk-sec">-- ${st.view === "notes" ? "Tasten in den Notizen" : st.view === "mcp" ? "Tasten in der MCP-Liste" : "Tasten im Editor"}</span>${(st.view === "notes" ? KEYS_NOTES : st.view === "mcp" ? KEYS_MCP : KEYS).map(([k, d]) => `<div><span class="k">${k}</span><span class="ar">→</span><span class="d">${d}</span></div>`).join("")}</div>`;
      showEl.textContent = "␣";
    }
    function closeWk() {
      if (!st.wk) return; st.wk = false; wk.hidden = true; showEl.textContent = "";
      // the leader was pressed inside the notes editor: return there unless the action opened something else
      st.notes.wkFromEd = st.notes.refocus;
      if (st.notes.refocus) { st.notes.refocus = false; later(() => { if (st.view === "notes" && !st.sel && !st.tel && !st.cmd && !st.form && !st.wk && !st.confirm) curNote()?.ed.focus(); }, 40); }
    }
    function leader(k) {
      closeWk();
      if (k === "f") { if (st.view === "dash") showEditor(); openTel(""); }
      else if (k === "a") { if (st.view === "notes") agentHandoff(); else runCmd("Agents"); }
      else if (k === "n") runCmd("Notes");
      else if (k === "N") openCmd("NewProject ");
      else if (k === "m") runCmd("Mcp");
      else if (k === "t") runCmd("Terminal");
      else if (k === "w") { if (st.view === "notes") runCmd("w"); }
      else if (k === "d") showDash();
      else if (k === "p") runCmd("Projects");
      else if (k === "r") runCmd("Recent");
      else if (k === "y") yank(false);
      else if (k === "b") { if ((st.view === "editor" || st.view === "notes") && st.buf) closeBuf(st.buf, { ask: true }); }
      else if (k === "o") { const s = curS(); if (st.view === "editor" && s) A.open(s.id, curT()?.id); }
    }

    // ================= yank =================
    async function copy(text) { try { await navigator.clipboard.writeText(text); return true; } catch { return false; } }
    async function yank(visual) {
      const s = st.view === "agents" ? sById.get(st.agRows[st.aIdx]?.sid) : curS(); if (!s) return;
      if (visual && st.visual) {
        const vw = st.visual.w, a = Math.min(st.visual.a, idxOf(vw)), b = Math.max(st.visual.a, idxOf(vw)), cnt = b - a + 1;
        let md;
        if (vw === 2) md = `# ${one(s.label)}\n\n` + st.tlist.slice(a, b + 1).map((n) => `## Schritt ${st.tlist.indexOf(n) + 1} · ${A.day(n.ts)} ${A.hhmm(n.ts)}\n\n${String(n.text || "").trim()}\n`).join("\n");
        else md = st.slist.slice(a, b + 1).map((x) => `# ${one(x.label)}\n\n_${x.projName} · ${x.nodes.length} Schritte · ${A.day(x.end)}_\n\n` + x.nodes.map((n, i) => `${i + 1}. ${one(n.text)}`).join("\n") + "\n").join("\n");
        const ok = await copy(md); exitVisual();
        const what = vw === 2 ? (cnt === 1 ? "Schritt" : "Schritte") : cnt === 1 ? "Session" : "Sessions";
        notify(`${cnt} ${what} als Markdown ${ok ? "kopiert" : "bereit (Zwischenablage blockiert)"}`, { title: "Yank", icon: "pen", code: md.split("\n")[0], lv: ok ? "info" : "warn" });
        cmdMsg(`${cnt} ${what} kopiert`, "ok"); return;
      }
      const n = curT(), fork = st.view === "editor" && n && n.id !== s.last.id;
      const cmd = `cd '${A.short(s.cwd || s.project)}' && claude --resume ${s.id}${fork ? " --fork-session" : ""}`;
      const ok = await copy(cmd);
      notify(ok ? (fork ? "Befehl kopiert: neuer Weg ab hier" : "Befehl kopiert: weitermachen") : "Befehl (bitte selbst kopieren)", { title: "Resume", icon: "play", code: cmd, lv: ok ? "info" : "warn" });
      cmdMsg(ok ? "Befehl in die Zwischenablage kopiert" : cmd, ok ? "ok" : "");
    }

    // ================= motions =================
    function move(d) {
      if (st.view === "agents") { if (st.win === 0) setTree(st.tIdx + d); else setAg(st.aIdx + d); return; }
      const w = st.win;
      if (w === 0) setTree(st.tIdx + d);
      else if (w === 1) setSess(st.sIdx + d);
      else if (w === 2) setStep(st.pIdx + d);
      else pvEl.scrollBy({ top: d * 66, behavior: reduce ? "auto" : "smooth" });
    }
    function jump(end, line) {
      if (line) return gotoLine(line);
      if (st.view === "agents" && st.win === 1) return setAg(end ? st.agRows.length - 1 : 0);
      const w = st.win;
      if (w === 3) return pvEl.scrollTo({ top: end ? pvEl.scrollHeight : 0, behavior: "smooth" });
      const len = [st.tree.length, st.slist.length, st.tlist.length][w];
      if (w === 0) setTree(end ? len - 1 : 0); else if (w === 1) setSess(end ? len - 1 : 0); else setStep(end ? len - 1 : 0);
    }
    function enter() {
      if (st.view === "agents") { if (st.win === 1) return openAg(); }
      const w = st.win, s = curS();
      if (w === 0) {
        const r = st.tree[st.tIdx];
        if (r?.k === "proj") return toggleFold(st.tIdx);
        if (r?.k === "sess") return A.open(r.s.id);
        return setWin(1);
      }
      if (!s) return;
      touchBuf(s.id, true);
      if (w === 1) A.open(s.id); else A.open(s.id, curT()?.id);
    }

    // half page, paragraph jumps and zz
    const pageRows = (w) => Math.max(3, Math.floor(((w === "a" ? agList : lists[w] || pvEl).clientHeight / (parseFloat(getComputedStyle(root).getPropertyValue("--rh")) || 22)) / 2));
    function halfPage(d) {
      if (st.view === "agents" && st.win === 1) return setAg(st.aIdx + d * pageRows("a"));
      if (st.win === 3) return pvEl.scrollBy({ top: d * pvEl.clientHeight / 2, behavior: reduce ? "auto" : "smooth" });
      move(d * pageRows(st.win));
      showEl.textContent = d > 0 ? "^D" : "^U"; later(() => { if (st.show === "^D" || st.show === "^U") showEl.textContent = ""; }, 600);
    }
    function para(d, times) {
      for (let t = 0; t < times; t++) {
        if (st.view === "agents" && st.win === 1) { // jump between sessions in the agent tree
          let j = st.aIdx + d; while (j >= 0 && j < st.agRows.length && st.agRows[j].step) j += d;
          setAg(clamp(j, 0, st.agRows.length - 1)); continue;
        }
        const w = st.win;
        if (w === 0) { let j = st.tIdx + d; while (j > 0 && j < st.tree.length - 1 && st.tree[j].k !== "proj") j += d; setTree(clamp(j, 0, st.tree.length - 1)); }
        else if (w === 1) { const key = (i) => st.slist[i]?.project; let j = st.sIdx + d; while (j > 0 && j < st.slist.length - 1 && key(j) === key(j - d) && key(j) === key(st.sIdx)) j += d; setSess(clamp(j, 0, st.slist.length - 1)); }
        else if (w === 2) { const dk = (i) => new Date(st.tlist[i].ts).toDateString(); if (!st.tlist.length) return; const cur = dk(st.pIdx); let j = st.pIdx + d;
          if (d > 0) { while (j < st.tlist.length - 1 && dk(j) === cur) j++; } else { while (j > 0 && dk(j) === cur) j--; const tgt = dk(Math.max(0, j)); while (j > 0 && dk(j - 1) === tgt) j--; }
          setStep(clamp(j, 0, st.tlist.length - 1)); }
        else pvEl.scrollBy({ top: d * 160, behavior: "smooth" });
      }
    }
    function center() {
      const w = st.view === "agents" ? "a" : st.win; if (w === 3) return;
      const L = w === "a" ? agList : lists[w], el = rowEl(w, idxOf(w)); if (!el) return;
      L.scrollTo({ top: Math.max(0, el.offsetTop - L.clientHeight / 2 + el.offsetHeight / 2), behavior: reduce ? "auto" : "smooth" });
      cmdMsg("zz · Zeile zentriert", "");
    }

    // ================= floating select (vim.ui.select) + y/n confirm in the cmdline =================
    const dimEl = $("nvDim"), selEl = $("nvSel"), formEl = $("nvForm");
    const blurEditor = () => { const a = document.activeElement; if (a?.closest?.(".cm-editor")) a.blur(); };
    const errMsg = (e) => String(e?.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, "");
    function openSelect(title, items, cb, o = {}) {
      closeWk(); closeCmd(); closeTel(); blurEditor();
      st.sel = { title, items, cb, i: Math.max(0, items.findIndex((x) => !x.off)), refocus: o.refocus, at: performance.now() };
      dimEl.hidden = false; selEl.hidden = false; renderSel(); setMode("NORMAL");
    }
    function renderSel() {
      const S = st.sel;
      selEl.innerHTML = `<span class="tt">${esc(S.title)}</span>` + S.items.map((it, i) => `<button class="si ${i === S.i ? "on" : ""} ${it.off ? "off" : ""}" data-si="${i}"><span class="car">&gt;</span><span class="k">${i + 1}</span>
        <span class="l"><b>${esc(it.label)}</b>${it.desc ? `<small>${esc(it.desc)}</small>` : ""}</span><span class="h">${esc(it.hint || "")}</span></button>`).join("")
        + `<div class="t-ft"><span><kbd>j</kbd><kbd>k</kbd> wählen</span><span><kbd>Enter</kbd> oder <kbd>1</kbd>-<kbd>${S.items.length}</kbd> ausführen</span><span><kbd>Esc</kbd> abbrechen</span></div>`;
    }
    function closeSel(run) {
      const S = st.sel; if (!S) return; st.sel = null; selEl.hidden = true; if (!st.form) dimEl.hidden = true;
      if (run != null && S.items[run] && !S.items[run].off) S.cb(run); else S.refocus?.();
    }
    function selKey(e) {
      const k = e.key, S = st.sel; e.preventDefault();
      if (e.timeStamp <= S.at) return; // the key that opened the popup (e.g. Enter in the cmdline) must not also pick an entry
      const step = (d) => { let j = S.i; for (let n = 0; n < S.items.length; n++) { j = (j + d + S.items.length) % S.items.length; if (!S.items[j].off) break; } S.i = j; renderSel(); };
      if (k === "Escape" || k === "q") closeSel();
      else if (k === "j" || k === "ArrowDown" || k === "Tab") step(1);
      else if (k === "k" || k === "ArrowUp") step(-1);
      else if (k === "Enter") closeSel(S.i);
      else if (/^[1-9]$/.test(k) && +k <= S.items.length) closeSel(+k - 1);
    }
    function confirmAsk(text, cb) { closeCmd(); st.confirm = cb; st.confirmAt = performance.now(); cmdMsg(text, "md"); }

    // ================= notes =================
    const NA = window.atlasApp?.notes, MA = window.atlasApp?.mcp;
    const notesEl = $("nvNotes"), nList = $("nvNL"), nRows = nList.querySelector(".rows"), nHost = $("nvNHost");
    const nTreeW = notesEl.querySelector(".tree"), nEdW = notesEl.querySelector(".nt-ed");
    const dirOf = (p) => p.slice(0, p.lastIndexOf("/"));
    const curNote = () => { const b = st.bufs.find((x) => x.id === st.buf); return b?.kind === "note" ? b : null; };
    const fmProject = (text) => { const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/); return m?.[1].match(/^project:\s*(.+?)\s*$/m)?.[1] || null; };
    // A note belongs to a project via frontmatter, a project file to its folder
    const noteProject = (b) => (b.pf ? dirOf(b.path) : fmProject(b.ed.getDoc()));
    const isProjectFile = (path) => !!st.notes.list && dirOf(path) !== st.notes.list.dir;

    function cursorIn(L, i, instant) {
      const rows = L.querySelector(".rows"), cl = L.querySelector(".cl"), cu = L.querySelector(".cur");
      rows.querySelectorAll(".r.sel").forEach((x) => x.classList.remove("sel"));
      const el = rows.querySelector(`.r[data-i="${i}"]`);
      if (!el) { cl.style.opacity = 0; cu.style.opacity = 0; return; }
      cl.style.opacity = ""; cu.style.opacity = ""; el.classList.add("sel");
      if (instant || reduce) cl.style.transition = cu.style.transition = "none";
      cl.style.transform = cu.style.transform = `translateY(${el.offsetTop}px)`;
      if (instant || reduce) { cl.offsetWidth; cl.style.transition = cu.style.transition = ""; }
      const top = el.offsetTop, bot = top + el.offsetHeight, pad = 44;
      if (top - pad < L.scrollTop) L.scrollTo({ top: Math.max(0, top - pad), behavior: instant || reduce ? "auto" : "smooth" });
      else if (bot + pad > L.scrollTop + L.clientHeight) L.scrollTo({ top: bot + pad - L.clientHeight, behavior: instant || reduce ? "auto" : "smooth" });
      rows.querySelectorAll(".r").forEach((r, j) => { const nu = r.querySelector(".nu"); if (nu) nu.textContent = j === i ? String(j + 1) : String(Math.abs(j - i)); });
    }

    async function loadNotes() {
      const empty = { dir: "~/.session-atlas/notes", notes: [], projects: [] };
      if (!NA) st.notes.list = empty;
      else try { st.notes.list = await NA.list(); } catch (e) { notify(errMsg(e), { lv: "err", title: "Notizen" }); st.notes.list = st.notes.list || empty; }
      buildNotesTree(); renderNotesTree();
    }
    function buildNotesTree() {
      const L = st.notes.list, rows = [], byP = new Map();
      for (const f of L.notes) if (f.project) { if (!byP.has(f.project)) byP.set(f.project, []); byP.get(f.project).push({ ...f, linked: true }); }
      for (const p of L.projects) { if (!byP.has(p.project)) byP.set(p.project, []); byP.get(p.project).push(...p.files.map((f) => ({ ...f, pf: true }))); }
      const order = D.projects.map((p) => p.path), rank = (k) => { const i = order.indexOf(k); return i < 0 ? 1e4 : i; };
      const dirs = [{ key: "global", label: "notes", sub: L.dirLabel || A.short(L.dir), hue: 40, files: L.notes.filter((f) => !f.project) },
        ...[...byP.keys()].sort((a, b) => rank(a) - rank(b)).map((k) => ({ key: k, label: A.projName(k), sub: A.short(k), hue: A.hue(k), files: byP.get(k), project: k }))];
      dirs.forEach((d, di) => {
        const lastD = di === dirs.length - 1;
        rows.push({ k: "dir", d, lastD });
        if (!st.notes.closed.has(d.key)) d.files.forEach((f, fi) => rows.push({ k: "file", f, d, lastD, last: fi === d.files.length - 1 }));
      });
      st.notes.tree = rows;
      st.notes.idx = clamp(st.notes.idx, 0, Math.max(0, rows.length - 1));
    }
    function renderNotesTree() {
      if (!st.notes.list) return;
      nRows.innerHTML = st.notes.tree.map((r, i) => {
        if (r.k === "dir") { const o = !st.notes.closed.has(r.d.key);
          return `<div class="r proj dir ${r.d.key === "global" ? "root" : ""}" data-i="${i}" title="${esc(r.d.sub)}"><span class="ig">${r.lastD ? "└ " : "├ "}</span><span class="fo ${o ? "o" : ""}">${o ? "▾" : "▸"}</span><span class="fi" style="--h:${r.d.hue}">${A.ic("folder")}</span><span class="tx">${esc(r.d.label)}${r.d.key === "global" ? `<span class="sub">${esc(r.d.sub.replace(/\/notes$/, ""))}</span>` : ""}</span><span class="vt"><span class="cnt">${r.d.files.length}</span></span></div>`; }
        const b = st.bufs.find((x) => x.id === "note:" + r.f.path);
        return `<div class="r sess note ${b ? "opn" : ""}" data-i="${i}" title="${esc(r.f.linked ? "mit Projekt verknüpft: " : r.f.pf ? "Datei im Projektordner: " : "")}${esc(r.f.name)}"><span class="ig">${r.lastD ? "  " : "│ "}${r.last ? "└ " : "├ "}</span><span class="fo">${b?.dirty ? `<span class="sg add">●</span>` : ""}</span>
          <span class="fi nf ${r.f.linked ? "ln" : r.f.pf ? "pf" : ""}">${A.ic("note")}</span><span class="tx">${esc(r.f.name)}</span><span class="vt">${A.relShort(r.f.mtime)}</span></div>`;
      }).join("") || `<div class="empty">Noch keine Notizen</div>`;
      $("nvNC0").textContent = `${st.notes.list.notes.length + st.notes.list.projects.reduce((n, p) => n + p.files.length, 0)} Dateien`;
      cursorIn(nList, st.notes.idx, true);
    }
    function setNoteIdx(i) { st.notes.idx = clamp(i, 0, Math.max(0, st.notes.tree.length - 1)); cursorIn(nList, st.notes.idx); setNotesWin(0); }
    function selectTreeFor(path) { const j = st.notes.tree.findIndex((r) => r.k === "file" && r.f.path === path); if (j >= 0) { st.notes.idx = j; cursorIn(nList, j, true); } }
    function setNotesWin(w) { st.notes.win = w; nTreeW.classList.toggle("on", w === 0); nEdW.classList.toggle("on", w === 1); if (w === 0 && !st.cmd && !st.tel) setMode("NORMAL"); }
    function toggleNoteDir(i) {
      const r = st.notes.tree[i]; if (r?.k !== "dir") return;
      if (st.notes.closed.has(r.d.key)) st.notes.closed.delete(r.d.key); else st.notes.closed.add(r.d.key);
      buildNotesTree(); st.notes.idx = st.notes.tree.findIndex((x) => x.k === "dir" && x.d.key === r.d.key); renderNotesTree();
    }
    function showNoteHost() {
      const b = curNote();
      nHost.querySelectorAll(".nt-cm").forEach((el) => el.classList.toggle("on", el === b?.host));
      $("nvNEmpty").hidden = !!b;
      noteBar();
    }
    function noteBar() {
      const b = curNote();
      if (!b) { $("nvNF").innerHTML = `<b>[Kein Name]</b>`; $("nvNCnt").textContent = ""; $("nvNFoot").innerHTML = ""; return; }
      const pj = noteProject(b);
      $("nvNF").innerHTML = `${b.pf ? esc(A.projName(dirOf(b.path))) : "notes"}/<b>${esc(b.name)}</b>${b.dirty ? "<i>[+]</i>" : ""}`;
      $("nvNCnt").innerHTML = pj ? `<span class="pj" style="--h:${A.hue(pj)}">${esc(A.projName(pj))}</span> · ${b.ed.lines()}L` : `${b.ed.lines()}L`;
      $("nvNFoot").innerHTML = `<button class="go" data-nact="agent">${A.ic("bot")} An Claude geben <kbd>Space a</kbd></button><button class="go sec" data-nact="save">Speichern <kbd>:w</kbd></button>`;
    }
    let statusQ = 0;
    const statusSoon = () => { if (!statusQ) statusQ = requestAnimationFrame(() => { statusQ = 0; if (alive) status(); }); };
    nHost.addEventListener("focusin", () => { setNotesWin(1); const b = curNote(); if (b) setMode(b.mode || "NORMAL"); });
    nHost.addEventListener("focusout", (e) => { if (nHost.contains(e.relatedTarget)) return; setNotesWin(0); });

    async function showNotes() {
      closeTel(); closeWk(); closeCmd();
      if (st.view === "dash") { dash.hidden = true; ed.hidden = false; }
      setView("notes");
      await loadNotes();
      if (!curNote()) {
        const open = st.bufs.find((b) => b.kind === "note");
        const recent = [...st.notes.list.notes].sort((a, b) => b.mtime - a.mtime)[0];
        if (open) await openNote(open.path); else if (recent) await openNote(recent.path); else showNoteHost();
      } else { showNoteHost(); selectTreeFor(curNote().path); }
      setNotesWin(0); renderTabs(); status(); cmdMsg(":Notes · Enter öffnet, Space a gibt die Notiz an Claude", "");
    }
    async function openNote(path, o = {}) {
      if (st.view !== "notes") { if (st.view === "dash") { dash.hidden = true; ed.hidden = false; } setView("notes"); if (!st.notes.list) await loadNotes(); }
      let b = st.bufs.find((x) => x.id === "note:" + path);
      if (!b) {
        if (!window.AtlasEditor) { notify("Editor fehlt, bitte `bun run build` ausführen", { lv: "err", title: "Notizen" }); return null; }
        let text;
        try { text = (await NA.read(path)).text; } catch (e) { notify(errMsg(e), { lv: "err", title: "Notiz" }); return null; }
        b = st.bufs.find((x) => x.id === "note:" + path); // opened meanwhile
      if (!b) {
        const host = document.createElement("div"); host.className = "nt-cm"; nHost.appendChild(host);
        b = { id: "note:" + path, kind: "note", path, name: path.split("/").pop(), pin: true, dirty: false, host, mode: "NORMAL", pf: isProjectFile(path) };
        const bb = b;
        b.ed = AtlasEditor.create(host, { doc: text,
          onChange: () => { if (!bb.dirty) { bb.dirty = true; renderTabs(); noteBar(); renderNotesTree(); } if (st.buf === bb.id) statusSoon(); },
          onMode: (m) => { bb.mode = m; if (st.buf === bb.id && st.notes.win === 1) setMode(m); },
          onCursor: () => { if (st.buf === bb.id) statusSoon(); },
          onEx: (n, p) => noteEx(bb, n, p),
          onLeader: () => { st.notes.refocus = true; blurEditor(); openWk(); },
          onLeave: () => { blurEditor(); setNotesWin(0); },
        });
        st.bufs.push(b);
      } }
      st.buf = b.id; showNoteHost(); renderTabs(); renderNotesTree(); selectTreeFor(path); status();
      if (o.focus) later(() => b.ed.focus(), 30);
      return b;
    }
    async function saveNote(b) {
      try {
        const r = await NA.write(b.path, b.ed.getDoc());
        b.dirty = false; renderTabs(); noteBar(); renderNotesTree(); status();
        cmdMsg(`"${b.name}" ${r.lines}L, ${r.bytes}B geschrieben`, "ok");
        if (NA) NA.list().then((l) => { st.notes.list = l; buildNotesTree(); renderNotesTree(); }).catch(() => {});
        return true;
      } catch (e) { cmdMsg(`E212: Kann Datei nicht schreiben: ${errMsg(e)}`, "err"); notify(errMsg(e), { lv: "err", title: ":w" }); return false; }
    }
    async function noteEx(b, n, p = {}) {
      if (n === "w") return saveNote(b);
      if (n === "q") return closeBuf(b.id, { force: p.bang });
      if (n === "wq") { if (await saveNote(b)) closeBuf(b.id, { force: true }); return; }
      if (n === "Agent") return later(() => agentHandoff(b), 30);
      later(() => { blurEditor(); runCmd(n + (p.argString ? " " + p.argString : "")); }, 30);
    }
    function selectedProject() {
      if (st.view === "notes") {
        const r = st.notes.tree[st.notes.idx];
        if (st.notes.win === 0 && r?.d?.project) return r.d.project;
        const b = curNote(), pj = b && noteProject(b); if (pj) return pj;
        if (r?.d?.project) return r.d.project;
      }
      if (st.view === "mcp") { const r = st.mcp.rows[st.mcp.sel[st.mcp.si]]; if (r?.g?.project) return r.g.project; }
      return curS()?.project || D.sessions[0]?.project || null;
    }
    async function newNote(name, tpl) {
      name = (name || "").trim();
      if (!name) return cmdMsg(tpl ? "E471: Name fehlt, z.B. :Anforderungen Rezeptsuche" : "E471: Name fehlt, z.B. :new Ideen", "err");
      if (!NA) return cmdMsg("Notizen gibt es nur in der Desktop-App", "err");
      const project = tpl ? selectedProject() : null;
      try {
        const r = await NA.create({ name, template: tpl ? "anforderungen" : null, project });
        if (st.view !== "notes") { if (st.view === "dash") { dash.hidden = true; ed.hidden = false; } setView("notes"); }
        await loadNotes(); await openNote(r.path, { focus: true });
        cmdMsg(r.existed ? `"${r.path.split("/").pop()}" gibt es schon, geöffnet` : `Neu: ${r.path.split("/").pop()}${project ? " · verknüpft mit " + A.projName(project) : ""}`, "ok");
      } catch (e) { cmdMsg(errMsg(e), "err"); }
    }
    function agentHandoff(bIn) {
      let b = bIn || (st.view === "notes" ? curNote() : null), path = b?.path, pj = b ? noteProject(b) : null;
      if (st.view === "notes" && st.notes.win === 0 && !bIn) { const r = st.notes.tree[st.notes.idx]; if (r?.k === "file") { b = st.bufs.find((x) => x.id === "note:" + r.f.path) || null; path = r.f.path; pj = b ? noteProject(b) : r.f.pf ? dirOf(r.f.path) : r.f.project || null; } }
      if (!path) return cmdMsg("Keine Notiz ausgewählt", "err");
      const name = path.split("/").pop(), T = window.AtlasTerminal, running = !!T?.hasActive?.();
      const wasEd = st.notes.win === 1 || st.notes.wkFromEd; st.notes.wkFromEd = false;
      openSelect(`An Claude geben: ${name}`, [
        { label: "Neue Claude-Session im Projekt", desc: `startet claude in ${pj ? A.short(pj) : "~"} mit dem Auftrag, die Notiz umzusetzen`, hint: pj ? A.projName(pj) : "Home" },
        { label: "An laufende Session senden", desc: `tippt @${name} ins aktive Terminal, ohne Enter`, hint: running ? "Terminal aktiv" : "kein Terminal offen", off: !running },
      ], async (i) => {
        if (!T) return notify("Das Terminal gibt es nur in der Desktop-App", { lv: "warn", title: "Agent" });
        if (b?.dirty && !(await saveNote(b))) return;
        if (i === 0) {
          await T.open(null, false, { cwd: pj || undefined, label: `claude · ${name}`, prompt: `Lies die Datei ${path} und setze die Anforderungen darin um. Frag nach, wenn etwas unklar ist.` });
          notify(`Claude startet in ${pj ? A.projName(pj) : "Home"} und liest deine Notiz`, { title: "Agent", icon: "bot", code: name });
        } else if (T.typeInto("@" + path.replace(/ /g, "\\ ") + " ")) notify("Notiz ins Terminal getippt. Enter schickt sie ab.", { title: "Agent", icon: "term", code: "@" + name });
        else notify("Kein laufendes Terminal. Erst eine Session öffnen.", { lv: "warn", title: "Agent" });
      }, { refocus: () => { if (st.view === "notes" && wasEd) curNote()?.ed.focus(); } });
    }
    function notesKey(e, k, cnt) {
      const r = st.notes.tree[st.notes.idx];
      if (k === "j" || k === "ArrowDown") { e.preventDefault(); setNoteIdx(st.notes.idx + Math.max(1, cnt)); }
      else if (k === "k" || k === "ArrowUp") { e.preventDefault(); setNoteIdx(st.notes.idx - Math.max(1, cnt)); }
      else if (k === "Enter" || k === "l" || k === "o" || k === "ArrowRight") {
        e.preventDefault();
        if (r?.k === "dir") { if (k === "l" && !st.notes.closed.has(r.d.key)) setNoteIdx(st.notes.idx + 1); else toggleNoteDir(st.notes.idx); }
        else if (r?.k === "file") openNote(r.f.path, { focus: true });
        else if (curNote()) curNote().ed.focus();
      }
      else if (k === "h" || k === "ArrowLeft") {
        if (r?.k === "file") setNoteIdx(st.notes.tree.indexOf(st.notes.tree.find((x) => x.k === "dir" && x.d === r.d)));
        else if (r?.k === "dir" && !st.notes.closed.has(r.d.key)) toggleNoteDir(st.notes.idx);
      }
      else if (k === "a") agentHandoff();
      else if (k === "r") { loadNotes(); cmdMsg("Notizen neu geladen", "ok"); }
      else if (k === "x") { const b = curNote(); if (b) closeBuf(b.id, { ask: true }); }
      else if (k === "Tab") { e.preventDefault(); curNote()?.ed.focus(); }
    }

    // ================= MCP servers =================
    const mcpEl = $("nvMcp"), mList = $("nvML"), mRows = $("nvMRows");
    const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
    const SCOPE_TXT = { user: "für alle deine Projekte", project: "im Projekt geteilt (.mcp.json)", local: "nur du, nur dieses Projekt" };
    async function showMcp() {
      closeTel(); closeWk(); closeCmd();
      if (st.view === "dash") { dash.hidden = true; ed.hidden = false; }
      setView("mcp"); await loadMcp(); cmdMsg(":Mcp · c prüft den Status, a fügt hinzu", "");
    }
    async function loadMcp() {
      if (!MA) st.mcp.data = { demo: true, groups: [] };
      else try { st.mcp.data = await MA.list(); } catch (e) { notify(errMsg(e), { lv: "err", title: "MCP" }); st.mcp.data = st.mcp.data || { groups: [] }; }
      buildMcpRows(); renderMcp(); status();
    }
    function buildMcpRows() {
      const rows = [{ k: "c", html: "-- MCP-Server geben Claude Code zusätzliche Werkzeuge. Werte von Env und Headern bleiben verborgen." }, { k: "c", html: "" }];
      for (const g of st.mcp.data.groups) {
        rows.push({ k: "grp", g });
        if (!g.servers.length) rows.push({ k: "c", html: `<span style="padding-left:30px">(keine Server)</span>` });
        g.servers.forEach((s, i) => rows.push({ k: "srv", g, s, last: i === g.servers.length - 1 }));
        rows.push({ k: "c", html: "" });
      }
      const prev = st.mcp.rows[st.mcp.sel[st.mcp.si]];
      st.mcp.rows = rows;
      st.mcp.sel = rows.map((r, i) => (r.k === "c" ? -1 : i)).filter((i) => i >= 0);
      const keep = prev ? st.mcp.sel.findIndex((i) => rows[i].k === prev.k && rows[i].g.scope === prev.g.scope && rows[i].g.project === prev.g.project && rows[i].s?.name === prev.s?.name) : -1;
      st.mcp.si = keep >= 0 ? keep : clamp(st.mcp.si, 0, Math.max(0, st.mcp.sel.length - 1));
      if (!prev) { const f = st.mcp.sel.findIndex((i) => rows[i].k === "srv"); if (f >= 0) st.mcp.si = f; }
    }
    function mcpSign(s) {
      if (st.mcp.checking) return `<span class="sg spin">${SPIN[st.mcp.frame % SPIN.length]}</span>`;
      const x = st.mcp.status.get(s.name);
      return x ? (x.ok ? `<span class="sg ok" title="${esc(x.text)}">✓</span>` : x.failed ? `<span class="sg bad" title="${esc(x.text)}">✗</span>` : `<span class="sg spin" title="${esc(x.text)}">!</span>`) : `<span class="sg unk">·</span>`;
    }
    function renderMcp() {
      mRows.innerHTML = st.mcp.rows.map((r, i) => {
        if (r.k === "c") return `<div class="r" data-i="${i}" style="cursor:default"><span class="sg"></span><span class="nu"></span><span class="ag-c" style="padding-left:0">${r.html}</span><span></span></div>`;
        if (r.k === "grp") { const g = r.g, src = g.scope === "project" ? `${A.short(g.project)}/.mcp.json` : g.scope === "local" ? `~/.claude.json · ${A.short(g.project)}` : g.source;
          return `<div class="r" data-i="${i}"><span class="sg"></span><span class="nu"></span><span class="mc-l"><span class="fo">▾</span><span class="sc ${g.scope}">${g.scope}</span><b>${g.project ? esc(A.projName(g.project)) : "global"}</b><span class="src">${esc(src)} · ${SCOPE_TXT[g.scope]}</span></span><span class="mc-r">${g.servers.length} Server</span></div>`; }
        const s = r.s, x = st.mcp.status.get(s.name), target = s.url || [s.command, ...s.args].filter(Boolean).join(" ");
        return `<div class="r" data-i="${i}" data-sv="${esc(s.name)}">${mcpSign(s)}<span class="nu"></span><span class="mc-l"><span class="bx">${r.last ? "└─" : "├─"}</span><b>${esc(s.name)}</b><span class="tp ${s.type}">${esc(s.type)}</span><span class="cm" title="${esc(target)}">${esc(target)}</span></span>
          <span class="mc-r">${s.envKeys.map((k) => `<span class="ek">${esc(k)}=••••</span>`).join("")}${s.headerKeys.map((k) => `<span class="ek">${esc(k)}: ••••</span>`).join("")}${x && !x.ok && x.text ? `<span class="st">${esc(x.text)}</span>` : ""}</span></div>`;
      }).join("") + `<div class="r" style="cursor:default"><span class="sg"></span><span class="nu"></span><span class="ag-c" style="padding-left:0">-- claude.ai-Connectors (Gmail, Drive ...) hängen an deinem Account und werden auf claude.ai verwaltet, nicht hier.</span><span></span></div>`;
      const n = st.mcp.data.groups.reduce((k, g) => k + g.servers.length, 0);
      $("nvMC").textContent = st.mcp.checking ? `${SPIN[st.mcp.frame % SPIN.length]} prüfe ...` : `${st.mcp.si + 1}/${st.mcp.sel.length} · ${n} Server`;
      cursorIn(mList, st.mcp.sel[st.mcp.si], true);
    }
    function setMcp(si) { st.mcp.si = clamp(si, 0, Math.max(0, st.mcp.sel.length - 1)); cursorIn(mList, st.mcp.sel[st.mcp.si]); $("nvMC").textContent = `${st.mcp.si + 1}/${st.mcp.sel.length}`; status(); }
    async function mcpCheck() {
      if (st.mcp.checking) return;
      if (!MA || st.mcp.data?.demo) return notify("Im Demo-Modus deaktiviert", { lv: "warn", title: "MCP-Status", icon: "plug" });
      const proj = selectedProject();
      st.mcp.checking = true; st.mcp.frame = 0; renderMcp();
      const spin = setInterval(() => { st.mcp.frame++; mRows.querySelectorAll(".sg.spin").forEach((el) => (el.textContent = SPIN[st.mcp.frame % SPIN.length])); $("nvMC").textContent = `${SPIN[st.mcp.frame % SPIN.length]} prüfe ...`; }, 90);
      timers.add(spin);
      cmdMsg(`claude mcp list in ${proj ? A.projName(proj) : "~"} ... (bis 60s)`, "");
      let r;
      try { r = await MA.check({ project: proj }); } catch (e) { r = { ok: false, status: [], out: errMsg(e) }; }
      clearInterval(spin); timers.delete(spin);
      if (!alive) return;
      st.mcp.checking = false;
      for (const x of r.status || []) st.mcp.status.set(x.name, x);
      renderMcp();
      if (r.demo) return notify(r.out, { lv: "warn", title: "MCP-Status" });
      const ok = (r.status || []).filter((x) => x.ok).length, bad = (r.status || []).length - ok;
      notify(r.ok ? `${ok} verbunden${bad ? `, ${bad} mit Problemen` : ""}` : r.timedOut ? "Zeitüberschreitung nach 60 Sekunden" : r.out || "claude mcp list ist fehlgeschlagen",
        { title: "MCP-Status", icon: "plug", lv: r.ok && !bad ? "info" : r.ok ? "warn" : "err", code: proj ? `in ${A.short(proj)}` : "" });
      cmdMsg(r.ok ? `MCP-Status: ${ok} ✓ ${bad} ✗` : "MCP-Status fehlgeschlagen", r.ok ? "ok" : "err");
    }
    function mcpRemove() {
      const r = st.mcp.rows[st.mcp.sel[st.mcp.si]];
      if (r?.k !== "srv") return cmdMsg("Kein Server ausgewählt", "err");
      confirmAsk(`Server ${r.s.name} entfernen? (y/n)`, async () => {
        if (!MA) return;
        cmdMsg(`claude mcp remove ${r.s.name} -s ${r.g.scope} ...`, "");
        const res = await MA.remove({ name: r.s.name, scope: r.g.scope, project: r.g.project }).catch((e) => ({ ok: false, out: errMsg(e) }));
        notify(res.out || (res.ok ? "Entfernt" : "Fehler"), { lv: res.demo ? "warn" : res.ok ? "info" : "err", title: "MCP entfernen", icon: "plug", code: res.demo ? "" : `${r.s.name} · ${r.g.scope}` });
        cmdMsg(res.ok ? `${r.s.name} entfernt` : "", res.ok ? "ok" : "");
        if (res.ok) loadMcp();
      });
    }
    function mcpKey(e, k, cnt) {
      if (k === "j" || k === "ArrowDown") { e.preventDefault(); setMcp(st.mcp.si + Math.max(1, cnt)); }
      else if (k === "k" || k === "ArrowUp") { e.preventDefault(); setMcp(st.mcp.si - Math.max(1, cnt)); }
      else if (k === "c") mcpCheck();
      else if (k === "a") openMcpForm();
      else if (k === "d") { st.d = true; showEl.textContent = "d"; }
      else if (k === "r") { loadMcp(); cmdMsg("MCP-Liste neu geladen", "ok"); }
      else if (k === "Escape") showEditor();
    }
    const listJump = (i) => (st.view === "notes" ? setNoteIdx(Math.min(i, st.notes.tree.length - 1)) : setMcp(Math.min(i, st.mcp.sel.length - 1)));

    // ---------- add form (floating window) ----------
    function openMcpForm() {
      if (st.view !== "mcp") return showMcp().then(openMcpForm);
      closeWk(); closeCmd();
      const pj = selectedProject(), pi = Math.max(0, D.projects.findIndex((p) => p.path === pj));
      st.form = { scope: "user", transport: "stdio", p: pi, busy: false };
      formEl.innerHTML = `<span class="tt">MCP-Server hinzufügen</span>
        <div class="ff">
          <label>Name</label><input data-f="name" placeholder="z.B. github" spellcheck="false" autocomplete="off">
          <label>Scope</label><div class="ch" tabindex="0" data-c="scope">${["user", "project", "local"].map((o) => `<span data-o="${o}">${o}</span>`).join("")}</div><small class="hl" data-h="scope"></small>
          <label>Transport</label><div class="ch" tabindex="0" data-c="transport">${["stdio", "http", "sse"].map((o) => `<span data-o="${o}">${o}</span>`).join("")}</div>
          <label data-l="target">Befehl</label><input data-f="target" spellcheck="false" autocomplete="off">
          <label data-r="args">Args</label><input data-r="args" data-f="args" spellcheck="false" autocomplete="off" placeholder="-y @modelcontextprotocol/server-github">
          <label data-l="env">Env</label><textarea data-f="env" spellcheck="false" placeholder="GITHUB_TOKEN=...   (eine Zeile pro Variable)"></textarea>
          <label data-r="project">Projekt</label><div class="ch one" tabindex="0" data-r="project" data-c="project"><i data-pd="-1">‹</i><b></b><i data-pd="1">›</i><small></small></div>
        </div>
        <div class="ff-f"><span class="hint"><span><kbd>Tab</kbd> nächstes Feld</span><span><kbd>←</kbd><kbd>→</kbd> auswählen</span><span><kbd>Enter</kbd> hinzufügen</span><span><kbd>Esc</kbd> abbrechen</span></span>
          <button class="go" data-fsub>${A.ic("plug")} Hinzufügen</button></div><div class="ff-out" hidden></div>`;
      dimEl.hidden = false; formEl.hidden = false; syncForm();
      formEl.querySelector('[data-f="name"]').focus(); setMode("INSERT");
    }
    function syncForm() {
      const F = st.form, p = D.projects[F.p], stdio = F.transport === "stdio", needP = F.scope !== "user";
      formEl.querySelectorAll(".ch[data-c] span[data-o]").forEach((el) => el.classList.toggle("on", el.dataset.o === F[el.parentElement.dataset.c]));
      formEl.querySelector('[data-h="scope"]').textContent = SCOPE_TXT[F.scope] + (F.scope === "project" ? ", landet im Git-Repo" : "");
      formEl.querySelector('[data-l="target"]').textContent = stdio ? "Befehl" : "URL";
      formEl.querySelector('[data-f="target"]').placeholder = stdio ? "npx" : "https://example.com/mcp";
      formEl.querySelectorAll('[data-r="args"]').forEach((el) => (el.hidden = !stdio));
      formEl.querySelector('[data-l="env"]').textContent = stdio ? "Env" : "Header";
      formEl.querySelector('[data-f="env"]').placeholder = stdio ? "GITHUB_TOKEN=...   (eine Zeile pro Variable)" : "Authorization: Bearer ...   (eine Zeile pro Header)";
      formEl.querySelectorAll('[data-r="project"]').forEach((el) => (el.hidden = !needP));
      const pc = formEl.querySelector('[data-c="project"]');
      pc.querySelector("b").textContent = p ? p.name : "(kein Projekt)"; pc.querySelector("small").textContent = p ? A.short(p.path) : "";
    }
    function cycleChoice(c, d) {
      const F = st.form, opts = { scope: ["user", "project", "local"], transport: ["stdio", "http", "sse"] };
      if (c === "project") F.p = (F.p + d + D.projects.length) % Math.max(1, D.projects.length);
      else { const o = opts[c]; F[c] = o[(o.indexOf(F[c]) + d + o.length) % o.length]; }
      syncForm();
    }
    function closeForm() { if (!st.form) return; st.form = null; formEl.hidden = true; formEl.innerHTML = ""; if (!st.sel) dimEl.hidden = true; setMode("NORMAL"); }
    const splitArgs = (t) => [...t.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((m) => m[1] ?? m[2] ?? m[3]);
    async function submitForm() {
      const F = st.form; if (!F || F.busy) return;
      const v = (f) => formEl.querySelector(`[data-f="${f}"]`).value;
      const o = { name: v("name").trim(), scope: F.scope, transport: F.transport, target: v("target").trim(), args: F.transport === "stdio" ? splitArgs(v("args")) : [],
        env: v("env").split("\n").map((x) => x.trim()).filter(Boolean), project: F.scope === "user" ? null : D.projects[F.p]?.path || null };
      const out = formEl.querySelector(".ff-out");
      const show = (t, err) => { out.hidden = false; out.textContent = t; out.classList.toggle("err", !!err); };
      if (!MA || st.mcp.data?.demo) { notify("Im Demo-Modus deaktiviert", { lv: "warn", title: "MCP hinzufügen", icon: "plug" }); return show("Im Demo-Modus deaktiviert: es wird nichts gespeichert.", true); }
      if (!/^[A-Za-z0-9_.-]{1,64}$/.test(o.name)) return show("Name: nur Buchstaben, Ziffern und - _ .", true);
      if (!o.target) return show(o.transport === "stdio" ? "Befehl fehlt" : "URL fehlt", true);
      F.busy = true; show("claude mcp add läuft ...");
      const r = await MA.add(o).catch((e) => ({ ok: false, out: errMsg(e) }));
      if (!st.form) return; F.busy = false;
      notify(r.out || (r.ok ? "Hinzugefügt" : "Fehler"), { title: "claude mcp add", icon: "plug", lv: r.ok ? "info" : "err" });
      if (r.ok) { closeForm(); await loadMcp(); const j = st.mcp.sel.findIndex((i) => st.mcp.rows[i].s?.name === o.name); if (j >= 0) setMcp(j); }
      else show(r.out || "Fehler", true);
    }
    formEl.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (!st.form) return;
      const k = e.key, el = e.target;
      if (k === "Escape") { e.preventDefault(); return closeForm(); }
      if (k === "Tab") {
        e.preventDefault();
        const f = [...formEl.querySelectorAll("input,textarea,.ch")].filter((x) => !x.hidden && x.offsetParent);
        const i = f.indexOf(el); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus(); return;
      }
      if (el.matches(".ch")) {
        if (k === "ArrowLeft" || k === "h") { e.preventDefault(); cycleChoice(el.dataset.c, -1); }
        else if (k === "ArrowRight" || k === "l" || k === " ") { e.preventDefault(); cycleChoice(el.dataset.c, 1); }
        else if (k === "Enter") { e.preventDefault(); submitForm(); }
        return;
      }
      if (k === "Enter" && (el.tagName !== "TEXTAREA" || e.ctrlKey || e.metaKey)) { e.preventDefault(); submitForm(); }
    });
    formEl.addEventListener("click", (e) => {
      const o = e.target.closest("[data-o]"); if (o) { st.form[o.parentElement.dataset.c] = o.dataset.o; o.parentElement.focus(); return syncForm(); }
      const pd = e.target.closest("[data-pd]"); if (pd) return cycleChoice("project", +pd.dataset.pd);
      if (e.target.closest("[data-fsub]")) submitForm();
    });

    // ================= live data: refresh in place, keep cursor and selection =================
    function refreshData() {
      if (!alive) return;
      indexSessions(); buildTI(); computeStats();
      const rk = (r) => (r?.k === "proj" ? "p:" + r.p.path : r?.k === "sess" ? "s:" + r.s.id : "root");
      const { t: tkey = "root", s: sid, n: nid, last: wasLast } = st.selIds || {};
      buildTree();
      st.tIdx = Math.max(0, st.tree.findIndex((r) => rk(r) === tkey));
      renderTree();
      const { key, list } = listFor(st.tree[st.tIdx]); st.sKey = key; st.slist = list; renderSessions();
      st.sIdx = Math.max(0, list.findIndex((s) => s.id === sid));
      const s = curS(); st.tlist = s ? s.nodes : [];
      renderSteps();
      const ni = st.tlist.findIndex((n) => n.id === nid);
      st.pIdx = s && s.id === sid && wasLast ? st.tlist.length - 1 : ni >= 0 ? ni : Math.max(0, st.tlist.length - 1);
      renderPv(false);
      $("nvC1").textContent = st.slist.length ? `${st.sIdx + 1}/${st.slist.length}` : "0";
      $("nvC2").textContent = st.tlist.length ? `${st.pIdx + 1}/${st.tlist.length}` : "";
      remember(); renderTabs();
      if (st.view === "editor") { [0, 1, 2].forEach((w) => { placeCursor(w, true); nums(w); }); sbarAll(); kick(); }
      else if (st.view === "agents") renderAgents();
      else if (st.view === "dash") { const sub = dash.querySelector(".dh-sub"); if (sub) sub.innerHTML = `deine Claude-Code-Sessions als Editor · <b>${D.projects.length}</b> Projekte · <b>${D.totals.sessions}</b> Sessions`; }
      status();
    }
    const unsubData = A.onDataChanged?.(refreshData);
    A.notifier = (msg, sub) => notify(msg, { code: sub });

    // ================= keyboard =================
    const isPrintable = (e) => e.key.length === 1;
    const onKey = (e) => {
      if (!alive) return;
      if (e.metaKey || e.altKey) return;
      if (st.sel) return selKey(e);
      if (st.form) { if (e.key === "Escape") closeForm(); return; }
      if (e.target.matches?.("input,textarea,[contenteditable]")) return; // telescope, cmdline and the notes editor handle their own keys
      if (st.confirm && e.timeStamp > st.confirmAt) { e.preventDefault(); const cb = st.confirm; st.confirm = null; if (e.key === "y" || e.key === "Y" || e.key === "j") { cmdMsg(""); cb(); } else cmdMsg("Abgebrochen", ""); return; }
      if (e.ctrlKey) {
        const list = st.view === "notes" || st.view === "mcp";
        if (list && !st.tel && !st.wk && (e.key === "d" || e.key === "u")) { e.preventDefault(); const d = e.key === "d" ? 10 : -10; if (st.view === "notes") setNoteIdx(st.notes.idx + d); else setMcp(st.mcp.si + d); }
        else if (list && e.key === "w") { e.preventDefault(); if (st.view === "notes") curNote()?.ed.focus(); }
        else if (st.view !== "dash" && !st.tel && !st.wk && (e.key === "d" || e.key === "u")) { e.preventDefault(); halfPage(e.key === "d" ? 1 : -1); }
        return;
      }
      const k = e.key;
      if (st.wk) { e.preventDefault(); if (k === "Escape" || k === " ") return closeWk(); if (isPrintable(e)) return leader(k); return; }
      if (st.tel) { if (k === "Escape") closeTel(); else telIn.focus(); return; }

      if (st.view === "dash") {
        const total = st.dTotal;
        if (k === "j" || k === "ArrowDown") { e.preventDefault(); st.dIdx = (st.dIdx + 1) % total; markDash(); }
        else if (k === "k" || k === "ArrowUp") { e.preventDefault(); st.dIdx = (st.dIdx - 1 + total) % total; markDash(); }
        else if (k === "Enter") { e.preventDefault(); dash.querySelector(`[data-di="${st.dIdx}"]`)?.click(); }
        else if (/^[1-6]$/.test(k)) { const s = D.sessions[+k - 1]; if (s) { showEditor(); gotoSession(s.id, s.last.id, { pin: true }); setWin(2); A.open(s.id, s.last.id); } }
        else if (k.length === 1 && DASH_MENU.some((m) => m[0] === k)) { e.preventDefault(); dashAct(k); }
        else if (k === ":") { e.preventDefault(); openCmd(); }
        else if (k === "/") { e.preventDefault(); dashAct("f"); }
        else if (k === " ") { e.preventDefault(); openWk(); }
        else if (isPrintable(e)) { showEditor(); }
        return;
      }

      // notes + mcp: own lists with vim motions
      if (st.view === "notes" || st.view === "mcp") {
        if (/^[0-9]$/.test(k) && (st.count || k !== "0")) { st.count += k; showEl.textContent = st.count; return; }
        const cnt = st.count ? +st.count : 0; st.count = "";
        if (st.g) { st.g = false; showEl.textContent = ""; if (k === "g") return listJump(cnt ? cnt - 1 : 0); }
        if (st.d) { st.d = false; showEl.textContent = ""; if (k === "d" && st.view === "mcp") return mcpRemove(); return; }
        if (k === "g") { st.g = true; showEl.textContent = (cnt || "") + "g"; return; }
        showEl.textContent = "";
        if (k === "G") return listJump(cnt ? cnt - 1 : Infinity);
        if (k === ":") { e.preventDefault(); return openCmd(cnt ? String(cnt) : ""); }
        if (k === "/") { e.preventDefault(); return openTel(""); }
        if (k === " ") { e.preventDefault(); return openWk(); }
        if (k === "H") return cycleBuf(-1);
        if (k === "L") return cycleBuf(1);
        if (k.length === 1) e.preventDefault(); // keys that open a form or move focus must not also type their letter
        return st.view === "notes" ? notesKey(e, k, cnt) : mcpKey(e, k, cnt);
      }

      // editor + agents
      if (/^[0-9]$/.test(k) && (st.count || k !== "0")) { st.count += k; showEl.textContent = st.count; return; }
      const cnt = st.count ? +st.count : 0;
      const clear = () => { st.count = ""; if (!st.g) showEl.textContent = ""; };
      if (st.g) { st.g = false; showEl.textContent = ""; if (k === "g") { jump(false, cnt); clear(); return; } }
      if (st.z) { st.z = false; showEl.textContent = ""; if (k === "z") { center(); clear(); return; } }
      if (k === "Escape") { clear(); if (st.visual) exitVisual(); else if (st.view === "agents") setView("editor"); return; }
      if (k === "j" || k === "ArrowDown") { e.preventDefault(); move(Math.max(1, cnt)); }
      else if (k === "k" || k === "ArrowUp") { e.preventDefault(); move(-Math.max(1, cnt)); }
      else if (k === "h" || k === "ArrowLeft") { e.preventDefault(); setWin(st.win - 1); kick(); }
      else if (k === "l" || k === "ArrowRight") { e.preventDefault(); setWin(st.win + 1); kick(); }
      else if (k === "H") cycleBuf(-1);
      else if (k === "L") cycleBuf(1);
      else if (k === "g") { st.g = true; showEl.textContent = (st.count || "") + "g"; return; }
      else if (k === "z") { st.z = true; showEl.textContent = "z"; return; }
      else if (k === "0" || k === "^") { setWin(0); kick(); }
      else if (k === "$") { setWin(st.view === "agents" ? 1 : 3); kick(); }
      else if (k === "w") { setWin(st.win + 1 > (st.view === "agents" ? 1 : 3) ? 0 : st.win + 1); kick(); }
      else if (k === "b") { setWin(st.win - 1 < 0 ? (st.view === "agents" ? 1 : 3) : st.win - 1); kick(); }
      else if (k === "}" || k === "{") para(k === "}" ? 1 : -1, Math.max(1, cnt));
      else if (k === "V" && st.view === "editor") {
        if (st.visual) exitVisual(); else { setWin(1); st.visual = { w: 1, a: idxOf(1), line: true }; setMode("VISUAL"); nums(1); cmdMsg("-- VISUAL LINE --", "md"); }
      }
      else if (k === "G") jump(true, cnt);
      else if (k === "Enter") { e.preventDefault(); enter(); }
      else if (k === "o") { if (st.win === 0) { const r = st.tree[st.tIdx]; if (r?.k === "proj") toggleFold(st.tIdx); else enter(); } else enter(); }
      else if (k === "/") { e.preventDefault(); openTel(""); }
      else if (k === ":") { e.preventDefault(); openCmd(cnt ? String(cnt) : ""); }
      else if (k === " ") { e.preventDefault(); openWk(); }
      else if (k === "a") { if (st.view === "agents") setView("editor"); else setView("agents"); }
      else if (k === "v" && st.view === "editor" && (st.win === 1 || st.win === 2)) {
        if (st.visual) exitVisual(); else { st.visual = { w: st.win, a: idxOf(st.win) }; setMode("VISUAL"); nums(st.win); cmdMsg("-- VISUAL --", "md"); }
      }
      else if (k === "y") yank(!!st.visual);
      else if (k === "x" && st.view === "editor" && st.buf) closeBuf(st.buf, { ask: true });
      clear();
    };
    document.addEventListener("keydown", onKey);

    // ================= mouse =================
    root.addEventListener("click", (e) => {
      if (!alive) return;
      const t = e.target;
      if (t.closest("[data-open]")) { const b = t.closest("[data-open]"); const s = sById.get(b.dataset.open); if (s && st.view === "dash") { showEditor(); gotoSession(s.id, b.dataset.openStep, { pin: true }); } return; }
      const si = t.closest("[data-si]"); if (si) return closeSel(+si.dataset.si);
      if (t.closest("#nvSel,#nvForm")) return;
      if (t.closest("#nvDim")) { closeSel(); closeForm(); return; }
      const bx = t.closest("[data-bx]"); if (bx) { e.stopPropagation(); return closeBuf(bx.dataset.bx, { ask: true }); }
      const tab = t.closest("[data-buf]"); if (tab) return activateBuf(st.bufs.find((b) => b.id === tab.dataset.buf));
      const dk = t.closest("[data-dk]"); if (dk) { st.dIdx = +dk.dataset.di; markDash(); return dashAct(dk.dataset.dk); }
      const cm = t.closest("[data-cmd]"); if (cm) { e.preventDefault(); return ARGS.has(cm.dataset.cmd) && cm.dataset.cmd !== "Find" ? openCmd(cm.dataset.cmd + " ") : runCmd(cm.dataset.cmd + (cm.dataset.cmd === "Find" ? " " : "")); }
      const wkb = t.closest("[data-wk]"); if (wkb) return leader(wkb.dataset.wk);
      if (st.wk && !t.closest("#nvWk")) closeWk();
      if (st.view === "dash") { if (!t.closest("button,.dh-two,.pb,.mb")) showEditor(); return; }
      const na = t.closest("[data-nact]");
      if (na) { const b = curNote(); if (na.dataset.nact === "save" && b) saveNote(b); else if (na.dataset.nact === "agent") agentHandoff(b); return; }
      const ma = t.closest("[data-mact]");
      if (ma) { const a = ma.dataset.mact; if (a === "check") mcpCheck(); else if (a === "add") openMcpForm(); else if (a === "reload") loadMcp(); else if (a === "remove") mcpRemove(); return; }
      if (st.view === "notes") {
        const r = t.closest("#nvNL .r"); if (!r) return;
        const i = +r.dataset.i, row = st.notes.tree[i]; blurEditor(); setNoteIdx(i);
        if (row?.k === "dir") toggleNoteDir(i); else if (row?.k === "file") openNote(row.f.path, { focus: true });
        return;
      }
      if (st.view === "mcp") { const r = t.closest("#nvML .r"); if (!r) return; const j = st.mcp.sel.indexOf(+r.dataset.i); if (j >= 0) setMcp(j); return; }
      const sec = t.closest(".nv-w"); if (!sec) return;
      const w = +sec.dataset.w;
      if (st.view === "agents" && sec === agW) {
        const r = t.closest(".r"); if (!r) return; const j = st.agRows.findIndex((x) => x.row === +r.dataset.i);
        setWin(1); if (j >= 0) setAg(j); return;
      }
      if (w === 3) { setWin(3); kick(); return; }
      const r = t.closest(".r"); setWin(w);
      if (!r) { kick(); return; }
      const i = +r.dataset.i;
      if (w === 0) { if (i === st.tIdx && st.tree[i]?.k === "proj") toggleFold(i); else { setTree(i); if (t.closest(".fo") && st.tree[i]?.k === "proj") toggleFold(i); } }
      else if (w === 1) setSess(i);
      else if (w === 2) setStep(i);
    });
    root.addEventListener("dblclick", (e) => {
      if (!alive || st.view === "dash" || st.view === "notes" || st.view === "mcp") return;
      const r = e.target.closest(".r"), sec = e.target.closest(".nv-w"); if (!r || !sec) return;
      if (sec === agW) return openAg();
      const w = +sec.dataset.w;
      if (w === 0 && st.tree[st.tIdx]?.k === "sess") return A.open(st.tree[st.tIdx].s.id);
      if (w === 1 || w === 2) enter();
    });
    lists.forEach((L, w) => L.addEventListener("scroll", () => { sbar(w); kick(); }, { passive: true }));
    pvEl.addEventListener("scroll", () => kick(), { passive: true });
    let rzQ = 0;
    const onResize = () => { cancelAnimationFrame(rzQ); rzQ = requestAnimationFrame(() => {
      if (!alive) return;
      if (st.view === "editor") { [0, 1, 2].forEach((w) => placeCursor(w, true)); sbarAll(); kick(); }
      else if (st.view === "agents") renderAgents();
      else if (st.view === "notes") cursorIn(nList, st.notes.idx, true);
      else if (st.view === "mcp") cursorIn(mList, st.mcp.sel[st.mcp.si], true);
    }); };
    addEventListener("resize", onResize);
    // the window also changes size when the terminal split opens below
    const ro = new ResizeObserver(onResize); ro.observe(term);
    document.fonts?.ready.then(() => alive && onResize());

    A.onCleanup(() => {
      alive = false;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
      removeEventListener("resize", onResize);
      clearInterval(clkT); timers.forEach(clearTimeout); timers.clear();
      cancelAnimationFrame(raf); api = null; ro.disconnect(); unsubData?.();
      if (A.notifier) A.notifier = null;
      for (const b of st.bufs) if (b.kind === "note") b.ed?.destroy();
    });

    api = {
      sync(id) {
        st.drawer = !!id; root.classList.toggle("dw-open", !!id);
        if (!id || st.view !== "editor") return;
        if (curS()?.id !== id) gotoSession(id);
      },
    };

    // ================= boot =================
    buildTree(); renderTree();
    const firstP = st.tree.findIndex((r) => r.k === "proj" && r.p.path === D.sessions[0]?.project);
    st.win = 1;
    void firstP; setTree(0, { instant: true, force: true, pin: true, sessId: D.sessions[0]?.id });
    renderDash(); status(); cmdMsg("");
    // test hook: ?nv=editor|agents|tel|wk|cmd skips straight to a state (prototype only)
    const hook = new URLSearchParams(location.search).get("nv");
    if (hook) {
      if (hook === "agents") showEditor("agents");
      else if (hook !== "dash") showEditor();
      if (hook === "tel") openTel("look");
      if (hook === "wk") openWk();
      if (hook === "cmd") { openCmd("A"); }
      if (hook === "notes") showNotes();
      if (hook === "mcp") showMcp();
      if (hook === "vis") { setWin(2); move(-3); st.visual = { w: 2, a: st.pIdx }; move(-2); setMode("VISUAL"); nums(2); cmdMsg("-- VISUAL --", "md"); notify("Befehl kopiert: weitermachen", { title: "Resume", icon: "play", code: "cd '~/projects/x' && claude --resume 1234" }); }
    }
  }

  Atlas.register({ key: "nvim", name: "Neovim", tagline: "Wie dein Editor, mit Dashboard", wantsArrows: true, css, render, onSelect: (id) => api?.sync(id) });
})();
