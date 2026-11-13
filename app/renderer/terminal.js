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
  #term.drop::after { content: "Hier loslassen: Pfad wird eingefügt"; position: absolute; inset: 40px 8px 8px; display: grid; place-items: center; border: 1.5px dashed #b8bb26; border-radius: 8px; background: rgba(184,187,38,.07); color: #b8bb26; font-size: 13px; pointer-events: none; }
  body.term-open #livepill, body.term-open #termfab { display: none !important; }
  /* the full-window terminal covers the Atlas: stop painting it (blur, animations) */
  body.term-open > *:not(#term):not(script):not(style) { visibility: hidden; }
  body.term-open .lk-nvim .nv-term { bottom: calc(40vh + 18px); }
  #term .tbar { height: 34px; padding-left: 78px; -webkit-app-region: drag; display: flex; align-items: stretch; background: #141617; border-bottom: 1px solid #0a0b0b; flex: none; }
  #term .toff { display: flex; align-items: center; gap: 7px; padding: 0 14px; color: #bdae93; background: #191b1c; border-right: 1px solid #0a0b0b; font-size: 11.5px; letter-spacing: .04em; }
  #term .toff svg.i { width: 13px; height: 13px; color: #b8bb26; }
  #term .ttab, #term .tbtn { -webkit-app-region: no-drag; }
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
  #term.nrm .tsl .m { background: #83a598; }
  #term.nrm .xt.on { box-shadow: inset 0 0 0 1px rgba(131,165,152,.35); border-radius: 4px; }
  #term .tsl .c kbd { font: 700 10px var(--mono); color: #d5c4a1; background: rgba(235,219,178,.08); border: 1px solid rgba(235,219,178,.18); border-radius: 3px; padding: 0 4px; margin: 0 2px; }
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
      <button class="tbtn" data-tnew>+ neu</button><button class="tbtn" data-thide>Atlas<kbd>⌘ Esc</kbd></button></div>
      <div class="tbody" id="tbody"></div><div class="tsl" id="tsl"></div></section>
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
  function renderTabs() {
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
  api.onData((d) => { Atlas.applyData?.(d, { quiet: true }); if (Atlas.handlesLiveData?.()) return; pending = d; pill.classList.add("show"); });
  pill.addEventListener("click", () => { if (pending) Atlas.applyData?.(pending, { quiet: false }); pending = null; pill.classList.remove("show"); });

  renderSl();
  window.AtlasTerminal = { open, show, toggle, typeInto, sendTo, hasSession, isOpen, hasActive: () => !!active && !active.exited };
})();
