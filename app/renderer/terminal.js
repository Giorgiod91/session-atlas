// Built-in terminal for the desktop app, styled as a Neovim :terminal split under the editor.
// Each tab is a real shell running `claude --resume <id>` (or a fresh claude) in the project folder.
(function () {
  const api = window.atlasApp;
  const css = `
  #term { --tb:#24273a; position: fixed; z-index: 30; inset: 0; display: flex; flex-direction: column;
    background: var(--tb); overflow: hidden; font: 500 12px var(--mono); color: #d5c4a1;
    box-shadow: 0 30px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(0,0,0,.6); transform: translateY(calc(100% + 30px)); opacity: 0;
    transition: transform .5s cubic-bezier(.2,.9,.25,1), opacity .3s, right .45s var(--spring); }
  #term.open { transform: none; opacity: 1; }
  #term.drop::after { content: "Hier loslassen: Pfad wird eingefügt"; position: absolute; inset: 40px 8px 8px; display: grid; place-items: center; border: 1.5px dashed #e07a4f; border-radius: 8px; background: rgba(224,122,79,.07); color: #e07a4f; font-size: 13px; pointer-events: none; }
  body.term-open #livepill, body.term-open #termfab { display: none !important; }
  /* the full-window terminal covers the Atlas: stop painting it (blur, animations) */
  body.term-open > *:not(#term):not(script):not(style) { visibility: hidden; }
  body.term-open .lk-nvim .nv-term { bottom: calc(40vh + 18px); }
  #term .tbar { height: 34px; padding-left: 78px; -webkit-app-region: drag; display: flex; align-items: stretch; background: #141617; border-bottom: 1px solid #0a0b0b; flex: none; }
  #term .toff { display: flex; align-items: center; gap: 7px; padding: 0 14px; color: #bdae93; background: #191b1c; border-right: 1px solid #0a0b0b; font-size: 11.5px; letter-spacing: .04em; }
  #term .toff svg.i { width: 13px; height: 13px; color: #e07a4f; }
  #term .ttab, #term .tbtn { -webkit-app-region: no-drag; }
  #term .ttabs { flex: 1; min-width: 0; display: flex; overflow: hidden; }
  #term .ttab { position: relative; display: flex; align-items: center; gap: 7px; padding: 0 8px 0 13px; max-width: 280px; min-width: 0; color: #928374; border-right: 1px solid #0a0b0b; font-size: 12px; }
  #term .ttab:hover { background: #1b1d1e; color: #bdae93; }
  #term .ttab.on { background: var(--tb); color: #ebdbb2; }
  #term .ttab.on::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #e07a4f; box-shadow: none; }
  #term .ttab .ico { color: #e07a4f; font-size: 11px; }
  #term .ttab .nm { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #term .ttab .tx { width: 18px; height: 18px; border-radius: 4px; display: grid; place-items: center; flex: none; color: #928374; font-size: 13px; }
  #term .ttab .tx:hover { background: #2a2d2f; color: #fb4934; }
  #term .tbtn { display: flex; align-items: center; padding: 0 10px; color: #928374; font-size: 11.5px; white-space: nowrap; }
  #term .tbtn:hover { color: #ebdbb2; background: #1b1d1e; }
  #term .tbtn kbd { font: 700 10px var(--mono); color: #a89984; background: rgba(235,219,178,.07); border: 1px solid rgba(235,219,178,.16); border-bottom-width: 2px; border-radius: 4px; padding: 0 4px; margin-left: 6px; }
  #term .tmid { flex: 1; display: flex; min-height: 0; }
  #term .tbody { flex: 1; position: relative; min-height: 0; min-width: 0; }
  /* left: all terminals with live state (Cmd B), the tab strip on top is only used when the rail is hidden */
  #term .trail { width: 236px; flex: none; background: #141617; border-right: 1px solid #0a0b0b; display: flex; flex-direction: column; gap: 3px; padding: 10px 8px; overflow: auto; }
  #term.norail .trail { display: none; }
  #term:not(.norail) .ttabs { visibility: hidden; }
  #term .trail .rl { display: flex; justify-content: space-between; align-items: center; color: #8a8278; font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; padding: 2px 6px 6px; }
  #term .ri { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 6px 7px; border-radius: 7px; color: #a89984; text-align: left; width: 100%; }
  #term .ri:hover { background: #1b1d1e; }
  #term .ri.on { background: var(--tb); box-shadow: inset 3px 0 0 #e07a4f; }
  #term .ri .av { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; font: 800 10px var(--mono); color: #141617; background: #a89984; }
  #term .ri.on .av { background: #e07a4f; }
  #term .ri .nm { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #bdae93; font-size: 12px; }
  #term .ri.on .nm { color: #ebdbb2; }
  #term .ri small { display: block; color: #8a8278; font-size: 10.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #term .rh { padding: 0 6px 4px 37px; color: #d3869b; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #term .rdot { width: 8px; height: 8px; border-radius: 50%; background: var(--c, #4f5458); }
  #term .rdot.run { --c: #a9b665; } #term .rdot.wait { --c: #e0a84f; } #term .rdot.err { --c: #ea6962; }
  #term .rnew { color: #8a8278; display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; border-radius: 7px; font-size: 11.5px; }
  #term .rnew:hover { background: #1b1d1e; color: #ebdbb2; }
  #term .trail .rfoot { margin-top: auto; color: #8a8278; font-size: 10.5px; padding: 8px 6px 2px; border-top: 1px solid #1f2223; line-height: 1.7; }
  /* right: what the active session is doing right now, only on demand (Cmd Shift B) */
  #term .tside { width: 300px; flex: none; background: #141617; border-left: 1px solid #0a0b0b; padding: 12px 14px; display: none; flex-direction: column; gap: 12px; overflow: auto; }
  #term.side .tside { display: flex; }
  #term .tside h4 { font: 700 10.5px var(--mono); color: #8a8278; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 5px; }
  #term .tside .card { border: 1px solid #2a2d2f; border-radius: 8px; padding: 9px 10px; background: #1b1d1e; color: #d5c4a1; }
  #term .tside .card b { color: #ebdbb2; }
  #term .tside .ln { display: flex; gap: 6px; font-size: 11.5px; color: #a89984; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #term .tside .ln em { font-style: normal; color: #7daea3; flex: none; }
  #term .tside .ln.err em { color: #ea6962; }
  #term .tside .hp { color: #d3869b; font-size: 11.5px; }
  #term .tside .bar { height: 6px; border-radius: 3px; background: #26292a; overflow: hidden; margin-top: 3px; } #term .tside .bar i { display: block; height: 100%; background: #a9b665; }
  #term .tside .none { color: #8a8278; font-size: 11.5px; }
  #term .xt { position: absolute; inset: 6px 4px 4px 12px; display: none; } #term .xt.on { display: block; }
  #term .tsl { height: 22px; display: flex; align-items: stretch; background: #1b1d1e; flex: none; font-size: 11px; white-space: nowrap; }
  #term .tsl > span { display: flex; align-items: center; gap: 6px; }
  #term .tsl .m { background: #e07a4f; color: #1a0f0a; font-weight: 800; letter-spacing: .06em; padding: 0 18px 0 12px; clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%); z-index: 2; transition: background .3s; }
  #term.nrm .tsl .m { background: #83a598; }
  #term.nrm .xt.on { box-shadow: inset 0 0 0 1px rgba(131,165,152,.35); border-radius: 4px; }
  #term .tsl .c kbd { font: 700 10px var(--mono); color: #d5c4a1; background: rgba(235,219,178,.08); border: 1px solid rgba(235,219,178,.18); border-radius: 3px; padding: 0 4px; margin: 0 2px; }
  #term:not(.focus) .tsl .m { background: #4f5458; color: #d5c4a1; }
  #term .tsl .b { background: #3a3e41; color: #d5c4a1; margin-left: -9px; padding: 0 18px 0 19px; clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%); z-index: 1; }
  #term .tsl .c { background: #2a2d2f; margin-left: -9px; padding: 0 14px 0 19px; flex: 1; min-width: 0; color: #bdae93; overflow: hidden; }
  #term .tsl .c b { color: #ebdbb2; font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
  #term .tsl .y { background: #3a3e41; color: #d5c4a1; padding: 0 12px 0 20px; clip-path: polygon(9px 0, 100% 0, 100% 100%, 9px 100%, 0 50%); margin-left: -9px; }
  #term .xterm-viewport { scrollbar-width: thin; scrollbar-color: #3a3e41 transparent; }
  #termfab { position: fixed; z-index: 69; right: 22px; bottom: 82px; display: none; align-items: center; gap: 8px; padding: 5px 10px; border-radius: 6px; font: 700 11.5px var(--mono);
    background: rgba(20,22,23,.92); color: #e07a4f; border: 1px solid rgba(224,122,79,.45); box-shadow: 0 10px 30px rgba(0,0,0,.4); }
  #termfab:hover { background: #1b1d1e; }
  #livepill { position: fixed; z-index: 90; left: 18px; bottom: 20px; transform: translateY(40px); opacity: 0; pointer-events: none; transition: .5s var(--spring);
    padding: 6px 12px; border-radius: 6px; background: rgba(20,22,23,.94); color: #e07a4f; border: 1px solid rgba(224,122,79,.45); font: 700 12px var(--mono); box-shadow: 0 8px 24px rgba(0,0,0,.4); }
  #livepill.show { transform: none; opacity: 1; pointer-events: auto; }`;
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
  document.body.insertAdjacentHTML("beforeend", `
    <section id="term" aria-label="Terminal"><div class="tbar"><span class="toff">${Atlas.ic("term")} Terminal</span><div class="ttabs" id="ttabs"></div>
      <button class="tbtn" data-tnew>+ neu</button><button class="tbtn" data-thide>Atlas<kbd>⌘ Esc</kbd></button></div>
      <div class="tmid"><aside class="trail" id="trail" aria-label="Terminals"></aside><div class="tbody" id="tbody"></div><aside class="tside" id="tside" aria-label="Gerade"></aside></div><div class="tsl" id="tsl"></div></section>
    <button id="termfab">${Atlas.ic("term")} Terminal <kbd style="opacity:.7">⌘ Esc</kbd></button><button id="livepill">Neue Aktivität · aktualisieren</button>`);

  const panel = document.getElementById("term"), tabsEl = document.getElementById("ttabs"), body = document.getElementById("tbody"), slEl = document.getElementById("tsl");
  const fab = document.getElementById("termfab");
  const tabs = []; let active = null;
  // Catppuccin Macchiato, the same theme as the user's Ghostty
  const theme = { background: "#24273a", foreground: "#cad3f5", cursor: "#f4dbd6", cursorAccent: "#24273a", selectionBackground: "#5b6078",
    black: "#494d64", red: "#ed8796", green: "#a6da95", yellow: "#eed49f", blue: "#8aadf4", magenta: "#f5bde6", cyan: "#8bd5ca", white: "#b8c0e0",
    brightBlack: "#5b6078", brightRed: "#ed8796", brightGreen: "#a6da95", brightYellow: "#eed49f", brightBlue: "#8aadf4", brightMagenta: "#f5bde6", brightCyan: "#8bd5ca", brightWhite: "#a5adcb" };
  const FONT = '"JetBrainsMono Nerd Font Mono", "JetBrainsMono Nerd Font", "JetBrains Mono", Menlo, monospace';
  const FONT_DEFAULT = 13; let fontSize = FONT_DEFAULT; try { fontSize = +localStorage.getItem("atlas.termFontSize") || FONT_DEFAULT; } catch {}
  function setFont(n) {
    fontSize = Math.max(10, Math.min(28, n));
    try { localStorage.setItem("atlas.termFontSize", String(fontSize)); } catch {}
    for (const t of tabs) t.xt.options.fontSize = fontSize;
    if (active) { active.fit.fit(); api.resize(active.id, active.xt.cols, active.xt.rows); }
  }
  const short = (p) => Atlas.short(p || "~");

  // Cmd+Option + / - / 0: terminal font only (Cmd + / - alone zooms the whole app)
  panel.addEventListener("keydown", (e) => {
    // Scrolling without the mouse and without leaving TERMINAL mode (iTerm style); typing jumps back down
    if (e.metaKey && !e.altKey && active && ["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
      e.preventDefault(); e.stopPropagation(); const xt = active.xt, up = e.key === "ArrowUp" || e.key === "Home";
      if (e.key === "Home") xt.scrollToTop(); else if (e.key === "End") xt.scrollToBottom();
      else xt.scrollLines((up ? -1 : 1) * (e.shiftKey ? Math.max(1, xt.rows - 2) : 3));
      return;
    }
    if (e.metaKey && !e.altKey && (e.key === "b" || e.key === "B")) { e.preventDefault(); e.stopPropagation(); return e.shiftKey ? toggleSide() : toggleRail(); }
    if (e.metaKey && !e.altKey && !e.shiftKey && (e.key === "]" || e.key === "[")) { e.preventDefault(); e.stopPropagation(); return go(e.key === "]" ? 1 : -1); }
    if (e.metaKey && !e.altKey && /^[1-9]$/.test(e.key)) { e.preventDefault(); e.stopPropagation(); return goTo(+e.key); }
    if (e.metaKey && e.altKey && ["+", "=", "-", "0"].includes(e.key)) { e.preventDefault(); e.stopPropagation(); setFont(e.key === "0" ? FONT_DEFAULT : fontSize + (e.key === "-" ? -1 : 1)); }
  }, true);
  // Keys typed into the terminal must not reach the editor's vim bindings. This has to run in the
  // bubble phase: stopping it while capturing would also keep Tab, Esc and arrows from xterm itself.
  panel.addEventListener("keydown", (e) => e.stopPropagation());
  // Drag and drop like a normal terminal: files from Finder become shell-quoted paths (claude picks
  // up image paths as attachments), dragged text is typed in. Nothing is sent before the drop.
  const shq = (p) => /^[\w@%+=:,./-]+$/.test(p) ? p : "'" + p.replace(/'/g, "'\\''") + "'";
  const hasDrag = (e) => [...(e.dataTransfer?.types || [])].some((t) => t === "Files" || t === "text/plain");
  window.addEventListener("dragover", (e) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = isOpen() && active && hasDrag(e) ? "copy" : "none"; panel.classList.toggle("drop", isOpen() && !!active && hasDrag(e)); });
  window.addEventListener("dragleave", (e) => { if (!e.relatedTarget) panel.classList.remove("drop"); });
  window.addEventListener("drop", (e) => {
    e.preventDefault(); panel.classList.remove("drop");
    if (!isOpen() || !active || active.exited) return;
    const files = [...(e.dataTransfer?.files || [])].map((f) => api.pathForFile?.(f)).filter(Boolean);
    const text = files.length ? files.map(shq).join(" ") + " " : e.dataTransfer?.getData("text/plain") || "";
    if (!text) return;
    api.write(active.id, text); active.xt.focus();
  });
  body.addEventListener("mousedown", () => { if (normal) setNormal(false); });
  panel.addEventListener("focusin", () => { panel.classList.add("focus"); renderSl(); });
  panel.addEventListener("focusout", () => { panel.classList.remove("focus"); renderSl(); });

  const isOpen = () => panel.classList.contains("open");
  function show(open = true) {
    panel.classList.toggle("open", open); document.body.classList.toggle("term-open", open);
    if (!open) window.dispatchEvent(new Event("resize")); // let the Atlas redraw its wires once it is visible again
    fab.style.display = !open && tabs.length ? "flex" : "none";
    if (open) setTimeout(() => { active?.fit.fit(); if (active) api.resize(active.id, active.xt.cols, active.xt.rows); active?.xt.focus(); }, 380);
    else document.activeElement?.closest?.("#term") && document.activeElement.blur();
  }
  // ---- left rail and right "Gerade" column
  let rail = true, side = false;
  try { rail = localStorage.getItem("atlas.term.rail") !== "0"; } catch {}
  const railEl = document.getElementById("trail"), sideEl = document.getElementById("tside");
  const sessOf = (t) => t?.sid ? Atlas.DATA.sessions.find((x) => x.id === t.sid) : null;
  const stOf = (t) => { if (t.exited) return { st: "done", why: "beendet" }; const s = sessOf(t); return s ? Atlas.agentState(s) : { st: "run", why: "läuft" }; };
  function renderRail() {
    panel.classList.toggle("norail", !rail); panel.classList.toggle("side", side);
    if (rail) {
      const counts = { run: 0, wait: 0, err: 0 }; tabs.forEach((t) => { const x = stOf(t).st; if (x in counts) counts[x]++; });
      railEl.innerHTML = `<div class="rl"><span>Terminals</span><span>⌘B</span></div>${tabs.map((t, i) => {
        const s = sessOf(t), x = stOf(t), helpers = (s?.agents || []).filter((a) => !a.finished).slice(0, 2);
        return `<button class="ri ${t === active ? "on" : ""}" data-tt="${t.id}"><span class="av">${i + 1}</span><span style="min-width:0"><span class="nm">${Atlas.esc(t.label)}</span><small>${Atlas.esc(short(t.cwd).split("/").pop() || "~")} · ${Atlas.esc(x.why)}</small></span><span class="rdot ${x.st}"></span></button>
          ${helpers.map((a) => `<div class="rh">↳ ${Atlas.esc(Atlas.aName(a.type))}${a.description ? ": " + Atlas.esc(a.description) : ""}</div>`).join("")}`; }).join("")}
        <button class="rnew" data-tnew><span>+ neues Terminal</span></button>
        <div class="rfoot"><span class="rdot run" style="display:inline-block"></span> ${counts.run} arbeiten · <span class="rdot wait" style="display:inline-block"></span> ${counts.wait} warten${counts.err ? ` · <span class="rdot err" style="display:inline-block"></span> ${counts.err} Fehler` : ""}<br>⌘⇧B zeigt, was gerade passiert</div>`;
    }
    if (side) renderSide();
  }
  let lim = null;
  function renderSide() {
    const s = sessOf(active), a = s?.activity, rec = (a?.recent || []).slice(-8).reverse(), last = rec[0], helpers = (s?.agents || []).filter((x) => !x.finished);
    const pct = (w) => w && typeof w.pct === "number" ? `<div style="display:flex;justify-content:space-between"><span>${w === lim?.five ? "5-Stunden-Fenster" : "Woche"}</span><b>${w.pct} % genutzt</b></div><div class="bar"><i style="width:${Math.min(100, w.pct)}%;${w.pct >= 80 ? "background:#ea6962" : ""}"></i></div>` : "";
    sideEl.innerHTML = !s ? `<div><h4>Gerade</h4><div class="none">Neue Session: sobald Claude die erste Antwort geschrieben hat, steht hier, was passiert.</div></div>`
      : `<div><h4>Gerade</h4><div class="card"><span class="rdot ${stOf(active).st}" style="display:inline-block"></span> <b>${Atlas.esc(stOf(active).why)}</b>${last ? `<div class="ln" style="margin-top:5px"><em>${Atlas.esc(last.tool)}</em>${Atlas.esc(last.target || "")}</div>` : ""}<div class="ln" style="margin-top:3px">${a?.lastTs ? Atlas.rel(a.lastTs) : ""} · ${s.nodes.length} Schritte · ${Atlas.usd(s.cost?.usd)}</div></div></div>
        ${helpers.length ? `<div><h4>Helfer</h4>${helpers.map((x) => `<div class="hp">● ${Atlas.esc(Atlas.aName(x.type))}${x.description ? ": " + Atlas.esc(x.description) : ""}</div>`).join("")}</div>` : ""}
        <div><h4>Zuletzt</h4>${rec.length ? rec.map((r) => `<div class="ln ${r.err ? "err" : ""}"><em>${Atlas.esc(r.tool)}</em>${Atlas.esc(r.target || "")}</div>`).join("") : `<div class="none">Noch keine Werkzeug-Aufrufe.</div>`}</div>
        ${s.files.length ? `<div><h4>Geänderte Dateien</h4>${s.files.slice(-6).map((f) => `<div class="ln">${Atlas.esc(f.split("/").slice(-2).join("/"))}</div>`).join("")}</div>` : ""}
        ${lim?.five || lim?.week ? `<div><h4>Limits</h4>${pct(lim.five)}${pct(lim.week)}</div>` : ""}`;
  }
  api.limits?.get?.().then((l) => { lim = l && "ok" in l ? l.value : l; if (side) renderSide(); }).catch(() => {});
  api.limits?.onUpdate?.((l) => { lim = l; if (side) renderSide(); });
  setInterval(() => { if (isOpen()) renderRail(); }, 10e3);
  function toggleRail() { rail = !rail; try { localStorage.setItem("atlas.term.rail", rail ? "1" : "0"); } catch {} renderRail(); }
  function toggleSide() { side = !side; renderRail(); }

  function renderTabs() {
    renderRail();
    tabsEl.innerHTML = tabs.map((t) => `<button class="ttab ${t === active ? "on" : ""}" data-tt="${t.id}" title="${Atlas.esc(t.cwd)}"><span class="ico">${t.exited ? "○" : "●"}</span><span class="nm">${Atlas.esc(t.label)}</span><span class="tx" data-tclose="${t.id}">×</span></button>`).join("");
    renderSl();
  }
  function renderSl() {
    const i = tabs.indexOf(active);
    const help = normal ? `<kbd>gt</kbd><kbd>gT</kbd> Tab · <kbd>j</kbd><kbd>k</kbd> <kbd>⌘↑</kbd><kbd>⌘↓</kbd> scrollen · <kbd>n</kbd> neu · <kbd>q</kbd> Atlas · <kbd>i</kbd> tippen`
      : active ? `term://<b>${Atlas.esc(active.cmd)}</b>` : "kein Terminal";
    slEl.innerHTML = `<span class="m">${normal ? "NORMAL" : "TERMINAL"}</span><span class="b">${Atlas.esc(active ? short(active.cwd) : "~")}</span>
      <span class="c">${help}</span><span class="y">${normal && (count || pend) ? Atlas.esc(count + pend) + " · " : ""}${active ? `${i + 1}/${tabs.length}` : "0"} · ${active?.exited ? "beendet" : "läuft"}${normal ? "" : " · Ctrl+Esc normal"}</span>`;
  }
  function activate(t) { active = t; tabs.forEach((x) => x.el.classList.toggle("on", x === t)); renderTabs(); setTimeout(() => { t.fit.fit(); api.resize(t.id, t.xt.cols, t.xt.rows); t.xt.focus(); }, 30); }

  // NORMAL mode, like :terminal in Neovim: Ctrl+Esc (or Ctrl+\) stops typing into claude so gt / gT / 3gt switch tabs,
  // j/k scroll, i (or Enter, Esc) types again. Keys never reach the shell while it is on.
  let normal = false, pend = "", count = "";
  function setNormal(on) { normal = on; pend = ""; count = ""; panel.classList.toggle("nrm", on); renderSl(); }
  function go(d) { if (!active || tabs.length < 2) return; const i = tabs.indexOf(active); activate(tabs[(((i + d) % tabs.length) + tabs.length) % tabs.length]); }
  function goTo(n) { if (tabs[n - 1]) activate(tabs[n - 1]); }
  function normalKey(e) {
    const k = e.key, xt = active?.xt, half = Math.max(1, Math.floor((xt?.rows || 20) / 2));
    if (pend === "g") {
      const n = +count || 0; pend = ""; count = "";
      if (k === "t") n ? goTo(n) : go(1); else if (k === "T") go(-(n || 1)); else if (k === "g") xt?.scrollToTop();
      return renderSl();
    }
    if (/^[0-9]$/.test(k) && (count || k !== "0")) { count += k; return renderSl(); }
    if (k === "g") { pend = "g"; return renderSl(); } // keeps the count for 3gt
    const n = +count || 1; count = "";
    if (k === "i" || k === "a" || k === "Enter" || k === "Escape") { xt?.scrollToBottom(); return setNormal(false); }
    else if (k === "j" || k === "ArrowDown") xt?.scrollLines(n);
    else if (k === "k" || k === "ArrowUp") xt?.scrollLines(-n);
    else if (e.ctrlKey && k === "d") xt?.scrollLines(half);
    else if (e.ctrlKey && k === "u") xt?.scrollLines(-half);
    else if (k === "G") xt?.scrollToBottom();
    else if (k === "n") { setNormal(false); return open(null); }
    else if (k === "q") return show(false);
    renderSl();
  }
  function termKey(e) {
    if (e.metaKey) return !normal; // ⌘ shortcuts stay with the app
    if (!normal) {
      if (e.type === "keydown" && e.ctrlKey && (e.key === "Escape" || e.key === "\\" || e.code === "Backslash")) { e.preventDefault(); setNormal(true); return false; }
      return true;
    }
    if (e.type === "keydown" && !["Shift", "Control", "Alt"].includes(e.key) && !(e.ctrlKey && (e.key === "\\" || e.key === "n" || e.key === "Escape"))) { e.preventDefault(); normalKey(e); }
    return false;
  }

  // opts: { cwd, prompt, label } for a fresh claude with an initial prompt (notes -> agent);
  // opts.after: a prompt pasted into a resumed session once it has started
  async function open(session, fork, opts = {}) {
    show(true);
    const el = document.createElement("div"); el.className = "xt"; body.appendChild(el);
    const xt = new Terminal({ fontFamily: FONT, fontSize, lineHeight: 1.15, cursorBlink: true, theme });
    const fit = new FitAddon.FitAddon(); xt.loadAddon(fit); xt.open(el); fit.fit();
    const { id, cwd } = await api.spawn({ sessionId: session?.id, cwd: opts.cwd || session?.cwd || session?.project, fork, prompt: opts.prompt, cols: xt.cols, rows: xt.rows });
    const label = opts.label || (fork ? "⑂ " : "") + (session ? session.label : "Neue Session");
    const t = { id, xt, fit, el, cwd, label, sid: fork ? null : session?.id || null, after: opts.after || null,
      cmd: session ? `claude --resume ${session.id.slice(0, 8)}${fork ? " --fork" : ""}` : opts.prompt ? "claude \"…\"" : "claude" };
    xt.onData((d) => api.write(id, d));
    xt.attachCustomKeyEventHandler(termKey);
    tabs.push(t); activate(t);
    if (fork) Atlas.toast("Neuer Zweig gestartet", "Mit /rewind springst du zum gewählten Schritt");
    return t;
  }
  // Types text into the active terminal without Enter (used to hand a note to a running session)
  function typeInto(text) {
    if (!active || active.exited) return false;
    show(true); api.write(active.id, text);
    setTimeout(() => active?.xt.focus(), 400);
    return true;
  }
  // A prompt queued for a resumed session is pasted once claude has drawn its screen and gone quiet
  const paste = (t, text) => api.write(t.id, "\x1b[200~" + text + "\x1b[201~\r");
  api.onPty((id, d) => {
    const t = tabs.find((x) => x.id === id); if (!t) return;
    t.xt.write(d);
    if (t.after) { clearTimeout(t.afterT); t.afterT = setTimeout(() => { if (t.after && !t.exited) { paste(t, t.after); t.after = null; } }, 1600); }
  });
  // Sends a prompt (with Enter) to the open terminal tab of a session, without switching to it
  function sendTo(sid, text) {
    const t = tabs.find((x) => x.sid === sid && !x.exited); if (!t) return false;
    if (t.after) t.after += "\n\n" + text; else paste(t, text);
    return true;
  }
  const hasSession = (sid) => tabs.some((x) => x.sid === sid && !x.exited);
  api.onExit((id) => { const t = tabs.find((x) => x.id === id); if (t) { t.exited = true; t.xt.write("\r\n\x1b[2m[beendet]\x1b[0m\r\n"); renderTabs(); } });
  function close(id) {
    const i = tabs.findIndex((t) => t.id === id); if (i < 0) return;
    api.kill(id); tabs[i].xt.dispose(); tabs[i].el.remove(); tabs.splice(i, 1);
    if (tabs.length) activate(tabs[Math.max(0, i - 1)]); else { active = null; renderTabs(); show(false); }
  }
  new ResizeObserver(() => { if (active && isOpen()) { active.fit.fit(); api.resize(active.id, active.xt.cols, active.xt.rows); } }).observe(body);

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-tt],[data-tclose],[data-tnew],[data-thide],#termfab"); if (!el) return;
    e.stopPropagation();
    if (el.dataset.tclose) return close(+el.dataset.tclose);
    if (el.dataset.tt) return activate(tabs.find((t) => t.id === +el.dataset.tt));
    if (el.dataset.tnew !== undefined) return open(null);
    if (el.dataset.thide !== undefined) return show(false);
    if (el.id === "termfab") return show(true);
  }, true);
  const toggle = () => { if (!isOpen() && !tabs.length) return open(null); show(!isOpen()); };
  // Cmd+Esc (or Ctrl+`) switches between the full-window terminal and the Atlas
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey && e.key === "Escape") || (e.ctrlKey && e.key === "`")) { e.preventDefault(); e.stopPropagation(); toggle(); }
  }, true);

  // Live data: a look that refreshes itself in place gets the data quietly; otherwise ask before re-rendering
  const pill = document.getElementById("livepill"); let pending = null;
  api.onData((d) => { Atlas.applyData?.(d, { quiet: true }); if (isOpen()) renderRail(); if (Atlas.handlesLiveData?.()) return; pending = d; pill.classList.add("show"); });
  pill.addEventListener("click", () => { if (pending) Atlas.applyData?.(pending, { quiet: false }); pending = null; pill.classList.remove("show"); });

  renderSl();
  window.AtlasTerminal = { open, show, toggle, typeInto, sendTo, hasSession, isOpen, hasActive: () => !!active && !active.exited };
})();
