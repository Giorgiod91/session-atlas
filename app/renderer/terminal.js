// Built-in terminal dock for the desktop app. Loaded by the shell only when window.atlasApp exists.
// Each tab is a real shell running `claude --resume <id>` in the session's project folder.
(function () {
  const api = window.atlasApp;
  const css = `
  #term { position: fixed; z-index: 70; left: 12px; right: 12px; bottom: 12px; height: 46vh; display: flex; flex-direction: column;
    background: rgba(10,12,18,.82); border: 1px solid var(--line); border-radius: 18px; overflow: hidden;
    backdrop-filter: blur(28px) saturate(170%); -webkit-backdrop-filter: blur(28px) saturate(170%);
    box-shadow: 0 30px 80px rgba(0,0,0,.55); transform: translateY(calc(100% + 30px)); transition: transform .6s var(--spring), right .45s var(--spring); }
  #term.open { transform: none; }
  body:has(#drawer.open) #term { right: 524px; }
  #term .tbar { display: flex; align-items: center; gap: 4px; padding: 6px 8px; border-bottom: 1px solid var(--line); font: 600 12px var(--mono); }
  #term .ttab { display: flex; align-items: center; gap: 8px; padding: 5px 10px; border-radius: 9px; color: var(--ink-2); max-width: 260px; }
  #term .ttab span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #term .ttab.on { background: rgba(139,108,255,.22); color: var(--ink); }
  #term .ttab .tx { opacity: .6; } #term .ttab .tx:hover { opacity: 1; }
  #term .tsp { flex: 1; }
  #term .tbtn { padding: 5px 9px; border-radius: 8px; color: var(--ink-2); } #term .tbtn:hover { background: var(--glass-2); color: var(--ink); }
  #term .tbody { flex: 1; position: relative; }
  #term .xt { position: absolute; inset: 8px 10px; display: none; } #term .xt.on { display: block; }
  #term .hint { position: absolute; right: 14px; bottom: 8px; font: 11px var(--mono); color: var(--ink-3); pointer-events: none; }
  #termfab { position: fixed; z-index: 69; right: 18px; bottom: 76px; padding: 9px 14px; border-radius: 12px; font: 700 12.5px var(--mono);
    background: rgba(139,108,255,.9); color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.4); display: none; }
  #livepill { position: fixed; z-index: 90; left: 18px; bottom: 20px; transform: translateY(40px); opacity: 0; pointer-events: none; transition: .5s var(--spring);
    padding: 8px 14px; border-radius: 999px; background: rgba(74,222,128,.92); color: #06240f; font: 700 12.5px var(--sans); box-shadow: 0 8px 24px rgba(0,0,0,.4); }
  #livepill.show { transform: none; opacity: 1; pointer-events: auto; }`;
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
  document.body.insertAdjacentHTML("beforeend", `
    <section id="term" aria-label="Terminal"><div class="tbar" id="ttabs"></div><div class="tbody" id="tbody"><span class="hint">Ctrl+\` ein/aus</span></div></section>
    <button id="termfab">Terminal</button><button id="livepill">Neue Aktivität · aktualisieren</button>`);

  const panel = document.getElementById("term"), tabsEl = document.getElementById("ttabs"), body = document.getElementById("tbody");
  const fab = document.getElementById("termfab");
  const tabs = []; let active = null;
  const theme = { background: "#00000000", foreground: "#ece9f5", cursor: "#fabd2f", selectionBackground: "#8b6cff55",
    black: "#1d2021", red: "#fb4934", green: "#b8bb26", yellow: "#fabd2f", blue: "#83a598", magenta: "#d3869b", cyan: "#8ec07c", white: "#ebdbb2" };

  // Keys typed into the terminal must not reach the look's vim bindings or the shell switcher
  panel.addEventListener("keydown", (e) => e.stopPropagation());

  function show(open = true) { panel.classList.toggle("open", open); fab.style.display = !open && tabs.length ? "block" : "none"; if (open) setTimeout(() => { active?.fit.fit(); active?.xt.focus(); }, 350); }
  function renderTabs() {
    tabsEl.innerHTML = tabs.map((t) => `<button class="ttab ${t === active ? "on" : ""}" data-tt="${t.id}"><span>${Atlas.esc(t.label)}</span><span class="tx" data-tclose="${t.id}">✕</span></button>`).join("")
      + `<span class="tsp"></span><button class="tbtn" data-tnew>+ neu</button><button class="tbtn" data-thide>Minimieren</button>`;
  }
  function activate(t) { active = t; tabs.forEach((x) => x.el.classList.toggle("on", x === t)); renderTabs(); setTimeout(() => { t.fit.fit(); api.resize(t.id, t.xt.cols, t.xt.rows); t.xt.focus(); }, 30); }

  async function open(session, fork) {
    show(true);
    const el = document.createElement("div"); el.className = "xt"; body.appendChild(el);
    const xt = new Terminal({ fontFamily: '"JetBrains Mono", Menlo, monospace', fontSize: 13, lineHeight: 1.15, allowTransparency: true, cursorBlink: true, theme });
    const fit = new FitAddon.FitAddon(); xt.loadAddon(fit); xt.open(el); fit.fit();
    const { id } = await api.spawn({ sessionId: session?.id, cwd: session?.cwd || session?.project, fork, cols: xt.cols, rows: xt.rows });
    const t = { id, xt, fit, el, label: (fork ? "⑂ " : "") + (session ? session.label : "Neue Session") };
    xt.onData((d) => api.write(id, d));
    tabs.push(t); activate(t);
    if (fork) Atlas.toast("Neuer Zweig gestartet", "Mit /rewind springst du zum gewählten Schritt");
  }
  api.onPty((id, d) => tabs.find((t) => t.id === id)?.xt.write(d));
  api.onExit((id) => { const t = tabs.find((x) => x.id === id); if (t) t.xt.write("\r\n\x1b[2m[beendet]\x1b[0m\r\n"); });
  function close(id) {
    const i = tabs.findIndex((t) => t.id === id); if (i < 0) return;
    api.kill(id); tabs[i].xt.dispose(); tabs[i].el.remove(); tabs.splice(i, 1);
    if (tabs.length) activate(tabs[Math.max(0, i - 1)]); else { active = null; renderTabs(); show(false); }
  }
  new ResizeObserver(() => { if (active && panel.classList.contains("open")) { active.fit.fit(); api.resize(active.id, active.xt.cols, active.xt.rows); } }).observe(body);

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-tt],[data-tclose],[data-tnew],[data-thide],#termfab"); if (!el) return;
    e.stopPropagation();
    if (el.dataset.tclose) return close(+el.dataset.tclose);
    if (el.dataset.tt) return activate(tabs.find((t) => t.id === +el.dataset.tt));
    if (el.dataset.tnew !== undefined) return open(null);
    if (el.dataset.thide !== undefined) return show(false);
    if (el.id === "termfab") return show(true);
  }, true);
  window.addEventListener("keydown", (e) => { if (e.ctrlKey && e.key === "`") { e.preventDefault(); e.stopPropagation(); show(!panel.classList.contains("open")); } }, true);

  // Live data: drawer refreshes quietly, the overview asks before re-rendering so it never jumps under the cursor
  const pill = document.getElementById("livepill"); let pending = null;
  api.onData((d) => { pending = d; Atlas.applyData?.(d, { quiet: true }); pill.classList.add("show"); });
  pill.addEventListener("click", () => { if (pending) Atlas.applyData?.(pending, { quiet: false }); pending = null; pill.classList.remove("show"); });

  window.AtlasTerminal = { open, show };
})();
