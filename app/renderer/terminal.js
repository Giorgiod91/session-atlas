// Built-in terminal for the desktop app, styled as a Neovim :terminal split under the editor.
// Each tab is a real shell running `claude --resume <id>` (or a fresh claude) in the project folder.
(function () {
  const api = window.atlasApp;
  const css = `
  #term { --tb:#1d2021; position: fixed; z-index: 30; left: 12px; right: 12px; bottom: 10px; height: 40vh; display: flex; flex-direction: column;
    background: var(--tb); border: 1px solid rgba(235,219,178,.1); border-radius: 12px; overflow: hidden; font: 500 12px var(--mono); color: #d5c4a1;
    box-shadow: 0 30px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(0,0,0,.6); transform: translateY(calc(100% + 30px)); opacity: 0;
    transition: transform .5s cubic-bezier(.2,.9,.25,1), opacity .3s, right .45s var(--spring); }
  #term.open { transform: none; opacity: 1; }
  body:has(#drawer.open) #term { right: 524px; }
  body.term-open .lk-nvim .nv-term { bottom: calc(40vh + 18px); }
  #term .tbar { height: 28px; display: flex; align-items: stretch; background: #141617; border-bottom: 1px solid #0a0b0b; flex: none; }
  #term .toff { display: flex; align-items: center; gap: 7px; padding: 0 14px; color: #bdae93; background: #191b1c; border-right: 1px solid #0a0b0b; font-size: 11.5px; letter-spacing: .04em; }
  #term .toff svg.i { width: 13px; height: 13px; color: #b8bb26; }
  #term .ttabs { flex: 1; min-width: 0; display: flex; overflow: hidden; }
  #term .ttab { position: relative; display: flex; align-items: center; gap: 7px; padding: 0 8px 0 13px; max-width: 280px; min-width: 0; color: #928374; border-right: 1px solid #0a0b0b; font-size: 12px; }
  #term .ttab:hover { background: #1b1d1e; color: #bdae93; }
  #term .ttab.on { background: var(--tb); color: #ebdbb2; }
  #term .ttab.on::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #b8bb26; box-shadow: 0 0 12px #b8bb26; }
  #term .ttab .ico { color: #b8bb26; font-size: 11px; }
  #term .ttab .nm { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #term .ttab .tx { width: 18px; height: 18px; border-radius: 4px; display: grid; place-items: center; flex: none; color: #928374; font-size: 13px; }
  #term .ttab .tx:hover { background: #3c3836; color: #fb4934; }
  #term .tbtn { display: flex; align-items: center; padding: 0 10px; color: #928374; font-size: 11.5px; white-space: nowrap; }
  #term .tbtn:hover { color: #ebdbb2; background: #1b1d1e; }
  #term .tbtn kbd { font: 700 10px var(--mono); color: #a89984; background: rgba(235,219,178,.07); border: 1px solid rgba(235,219,178,.16); border-bottom-width: 2px; border-radius: 4px; padding: 0 4px; margin-left: 6px; }
  #term .tbody { flex: 1; position: relative; min-height: 0; }
  #term .xt { position: absolute; inset: 6px 4px 4px 12px; display: none; } #term .xt.on { display: block; }
  #term .tsl { height: 22px; display: flex; align-items: stretch; background: #282828; flex: none; font-size: 11px; white-space: nowrap; }
  #term .tsl > span { display: flex; align-items: center; gap: 6px; }
  #term .tsl .m { background: #b8bb26; color: #1d2021; font-weight: 800; letter-spacing: .06em; padding: 0 18px 0 12px; clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%); z-index: 2; transition: background .3s; }
  #term:not(.focus) .tsl .m { background: #665c54; color: #d5c4a1; }
  #term .tsl .b { background: #504945; color: #d5c4a1; margin-left: -9px; padding: 0 18px 0 19px; clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%); z-index: 1; }
  #term .tsl .c { background: #3c3836; margin-left: -9px; padding: 0 14px 0 19px; flex: 1; min-width: 0; color: #bdae93; overflow: hidden; }
  #term .tsl .c b { color: #ebdbb2; font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
  #term .tsl .y { background: #504945; color: #d5c4a1; padding: 0 12px 0 20px; clip-path: polygon(9px 0, 100% 0, 100% 100%, 9px 100%, 0 50%); margin-left: -9px; }
  #term .xterm-viewport { scrollbar-width: thin; scrollbar-color: #504945 transparent; }
  #termfab { position: fixed; z-index: 69; right: 22px; bottom: 82px; display: none; align-items: center; gap: 8px; padding: 5px 10px; border-radius: 6px; font: 700 11.5px var(--mono);
    background: rgba(29,32,33,.92); color: #b8bb26; border: 1px solid rgba(184,187,38,.45); box-shadow: 0 10px 30px rgba(0,0,0,.4); }
  #termfab:hover { background: #282828; }
  #livepill { position: fixed; z-index: 90; left: 18px; bottom: 20px; transform: translateY(40px); opacity: 0; pointer-events: none; transition: .5s var(--spring);
    padding: 6px 12px; border-radius: 6px; background: rgba(29,32,33,.94); color: #b8bb26; border: 1px solid rgba(184,187,38,.45); font: 700 12px var(--mono); box-shadow: 0 8px 24px rgba(0,0,0,.4); }
  #livepill.show { transform: none; opacity: 1; pointer-events: auto; }`;
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
  document.body.insertAdjacentHTML("beforeend", `
    <section id="term" aria-label="Terminal"><div class="tbar"><span class="toff">${Atlas.ic("term")} Terminal</span><div class="ttabs" id="ttabs"></div>
      <button class="tbtn" data-tnew>+ neu</button><button class="tbtn" data-thide>ausblenden<kbd>Ctrl \`</kbd></button></div>
      <div class="tbody" id="tbody"></div><div class="tsl" id="tsl"></div></section>
    <button id="termfab">${Atlas.ic("term")} Terminal</button><button id="livepill">Neue Aktivität · aktualisieren</button>`);

  const panel = document.getElementById("term"), tabsEl = document.getElementById("ttabs"), body = document.getElementById("tbody"), slEl = document.getElementById("tsl");
  const fab = document.getElementById("termfab");
  const tabs = []; let active = null;
  const theme = { background: "#1d2021", foreground: "#ebdbb2", cursor: "#fabd2f", cursorAccent: "#1d2021", selectionBackground: "#d3869b55",
    black: "#282828", red: "#fb4934", green: "#b8bb26", yellow: "#fabd2f", blue: "#83a598", magenta: "#d3869b", cyan: "#8ec07c", white: "#d5c4a1",
    brightBlack: "#665c54", brightRed: "#fb4934", brightGreen: "#b8bb26", brightYellow: "#fabd2f", brightBlue: "#83a598", brightMagenta: "#d3869b", brightCyan: "#8ec07c", brightWhite: "#ebdbb2" };
  const short = (p) => Atlas.short(p || "~");

  // Keys typed into the terminal must not reach the editor's vim bindings
  panel.addEventListener("keydown", (e) => e.stopPropagation());
  panel.addEventListener("focusin", () => { panel.classList.add("focus"); renderSl(); });
  panel.addEventListener("focusout", () => { panel.classList.remove("focus"); renderSl(); });

  const isOpen = () => panel.classList.contains("open");
  function show(open = true) {
    panel.classList.toggle("open", open); document.body.classList.toggle("term-open", open);
    fab.style.display = !open && tabs.length ? "flex" : "none";
    if (open) setTimeout(() => { active?.fit.fit(); if (active) api.resize(active.id, active.xt.cols, active.xt.rows); active?.xt.focus(); }, 380);
    else document.activeElement?.closest?.("#term") && document.activeElement.blur();
  }
  function renderTabs() {
    tabsEl.innerHTML = tabs.map((t) => `<button class="ttab ${t === active ? "on" : ""}" data-tt="${t.id}" title="${Atlas.esc(t.cwd)}"><span class="ico">${t.exited ? "○" : "●"}</span><span class="nm">${Atlas.esc(t.label)}</span><span class="tx" data-tclose="${t.id}">×</span></button>`).join("");
    renderSl();
  }
  function renderSl() {
    const i = tabs.indexOf(active);
    slEl.innerHTML = `<span class="m">TERMINAL</span><span class="b">${Atlas.esc(active ? short(active.cwd) : "~")}</span>
      <span class="c">${active ? `term://<b>${Atlas.esc(active.cmd)}</b>` : "kein Terminal"}</span><span class="y">${active ? `${i + 1}/${tabs.length}` : "0"} · ${active?.exited ? "beendet" : "läuft"}</span>`;
  }
  function activate(t) { active = t; tabs.forEach((x) => x.el.classList.toggle("on", x === t)); renderTabs(); setTimeout(() => { t.fit.fit(); api.resize(t.id, t.xt.cols, t.xt.rows); t.xt.focus(); }, 30); }

  // opts: { cwd, prompt, label } for a fresh claude with an initial prompt (notes -> agent)
  async function open(session, fork, opts = {}) {
    show(true);
    const el = document.createElement("div"); el.className = "xt"; body.appendChild(el);
    const xt = new Terminal({ fontFamily: '"JetBrains Mono", Menlo, monospace', fontSize: 12.5, lineHeight: 1.15, cursorBlink: true, theme });
    const fit = new FitAddon.FitAddon(); xt.loadAddon(fit); xt.open(el); fit.fit();
    const { id, cwd } = await api.spawn({ sessionId: session?.id, cwd: opts.cwd || session?.cwd || session?.project, fork, prompt: opts.prompt, cols: xt.cols, rows: xt.rows });
    const label = opts.label || (fork ? "⑂ " : "") + (session ? session.label : "Neue Session");
    const t = { id, xt, fit, el, cwd, label, cmd: session ? `claude --resume ${session.id.slice(0, 8)}${fork ? " --fork" : ""}` : opts.prompt ? "claude \"…\"" : "claude" };
    xt.onData((d) => api.write(id, d));
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
  api.onPty((id, d) => tabs.find((t) => t.id === id)?.xt.write(d));
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
  window.addEventListener("keydown", (e) => { if (e.ctrlKey && e.key === "`") { e.preventDefault(); e.stopPropagation(); toggle(); } }, true);

  // Live data: a look that refreshes itself in place gets the data quietly; otherwise ask before re-rendering
  const pill = document.getElementById("livepill"); let pending = null;
  api.onData((d) => { Atlas.applyData?.(d, { quiet: true }); if (Atlas.handlesLiveData?.()) return; pending = d; pill.classList.add("show"); });
  pill.addEventListener("click", () => { if (pending) Atlas.applyData?.(pending, { quiet: false }); pending = null; pill.classList.remove("show"); });

  renderSl();
  window.AtlasTerminal = { open, show, toggle, typeInto, isOpen, hasActive: () => !!active && !active.exited };
})();
