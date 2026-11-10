// Markdown editor for the Notes view: CodeMirror 6 + real vim keys (@replit/codemirror-vim),
// gruvbox colors and relative line numbers. Bundled by esbuild into editor.bundle.js
// (`bun run build`), exposed as window.AtlasEditor.
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, gutter, GutterMarker, highlightActiveLine, drawSelection, highlightSpecialChars, ViewPlugin, Decoration } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching } from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { tags as t } from "@lezer/highlight";
import { vim, Vim, getCM } from "@replit/codemirror-vim";

const G = { bg: "#1d2021", bg1: "#3c3836", bg2: "#504945", bg3: "#665c54", fg: "#ebdbb2", fg2: "#d5c4a1", fg3: "#bdae93", fg4: "#a89984", gr: "#928374",
  rd: "#fb4934", gn: "#b8bb26", ye: "#fabd2f", bl: "#83a598", pu: "#d3869b", aq: "#8ec07c", or: "#fe8019" };

const gruvbox = HighlightStyle.define([
  { tag: t.heading1, color: G.or, fontWeight: "800" },
  { tag: t.heading2, color: G.ye, fontWeight: "700" },
  { tag: [t.heading3, t.heading4, t.heading5, t.heading6], color: G.aq, fontWeight: "700" },
  { tag: t.strong, color: G.fg, fontWeight: "800" },
  { tag: t.emphasis, color: G.fg2, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through", color: G.gr },
  { tag: [t.link, t.url], color: G.bl, textDecoration: "underline" },
  { tag: t.list, color: G.fg2 },
  { tag: t.quote, color: G.gr, fontStyle: "italic" },
  { tag: t.monospace, color: G.gn },
  { tag: [t.processingInstruction, t.meta, t.contentSeparator], color: "#7c6f64" },
  { tag: t.comment, color: G.gr, fontStyle: "italic" },
  { tag: [t.keyword, t.atom], color: G.pu },
  { tag: t.string, color: G.gn },
]);

const theme = EditorView.theme({
  "&": { height: "100%", color: G.fg2, backgroundColor: "transparent", fontSize: "13px" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { fontFamily: '"JetBrains Mono", ui-monospace, monospace', lineHeight: "1.65", scrollbarWidth: "thin", scrollbarColor: `${G.bg2} transparent` },
  ".cm-content": { caretColor: G.ye, padding: "8px 0 40vh" },
  ".cm-line": { padding: "0 18px 0 10px" },
  ".cm-gutters": { backgroundColor: "transparent", border: "none", color: "#5a524c" },
  ".cm-gutterElement": { padding: "0 10px 0 14px", minWidth: "48px", textAlign: "right", fontSize: "11.5px", fontVariantNumeric: "tabular-nums" },
  ".cm-gutterElement.atlas-cur": { color: G.ye, fontWeight: "800" },
  ".cm-activeLine": { backgroundColor: "rgba(250,189,47,.06)", boxShadow: `inset 2px 0 0 ${G.ye}` },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection": { backgroundColor: "rgba(211,134,155,.28) !important" },
  ".cm-cursor": { borderLeftColor: G.ye, borderLeftWidth: "2px" },
  ".cm-fat-cursor": { background: `${G.ye} !important`, color: `${G.bg} !important` },
  "&:not(.cm-focused) .cm-fat-cursor": { background: "none !important", outline: `1px solid ${G.ye}` },
  ".cm-frontmatter, .cm-frontmatter span": { color: `${G.gr} !important`, fontWeight: "400 !important", fontStyle: "italic" },
  ".cm-matchingBracket": { backgroundColor: "rgba(142,192,124,.25)", outline: "none" },
  ".cm-panels": { backgroundColor: G.bg, color: G.fg, borderTop: `1px solid ${G.bg1}` },
  ".cm-panels-bottom": { borderTop: `1px solid ${G.bg1}` },
  ".cm-vim-panel": { fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: "12px", padding: "3px 10px", minHeight: "22px" },
  ".cm-vim-panel input": { color: G.fg, fontFamily: "inherit", fontSize: "12px", caretColor: G.or },
}, { dark: true });

// Relative line numbers like `set number relativenumber`: absolute on the cursor line
class Num extends GutterMarker {
  constructor(text, cur) { super(); this.text = text; this.cur = cur; }
  eq(o) { return o.text === this.text && o.cur === this.cur; }
  toDOM() { return document.createTextNode(this.text); }
  get elementClass() { return this.cur ? "atlas-cur" : ""; }
}
const relNumbers = gutter({
  class: "cm-lineNumbers",
  lineMarker(view, line) {
    const n = view.state.doc.lineAt(line.from).number, cur = view.state.doc.lineAt(view.state.selection.main.head).number;
    return new Num(n === cur ? String(n) : String(Math.abs(n - cur)), n === cur);
  },
  lineMarkerChange: (u) => u.selectionSet || u.docChanged,
  initialSpacer: () => new Num("000", false),
});

// YAML frontmatter (--- project: ... ---) would otherwise render as a setext heading
const fmLine = Decoration.line({ class: "cm-frontmatter" });
const frontmatter = ViewPlugin.fromClass(class {
  constructor(v) { this.decorations = this.build(v); }
  update(u) { if (u.docChanged) this.decorations = this.build(u.view); }
  build(v) {
    const doc = v.state.doc, out = [];
    if (doc.lines > 1 && doc.line(1).text.trim() === "---") {
      for (let n = 2; n <= Math.min(doc.lines, 60); n++) if (doc.line(n).text.trim() === "---") { for (let k = 1; k <= n; k++) out.push(fmLine.range(doc.line(k).from)); break; }
    }
    return Decoration.set(out);
  }
}, { decorations: (p) => p.decorations });

// Ex commands are global in codemirror-vim; route them to the editor instance that ran them
const handlers = new WeakMap();
const call = (name) => (cm, params) => {
  const h = handlers.get(cm); if (!h) return;
  h.onEx?.(name, { bang: (params.argString || "").trim().startsWith("!"), args: params.args || [], argString: (params.argString || "").trim() });
};
let defined = false;
function defineOnce() {
  if (defined) return; defined = true;
  Vim.defineEx("write", "w", call("w"));
  Vim.defineEx("quit", "q", call("q"));
  Vim.defineEx("wq", "wq", call("wq"));
  Vim.defineEx("xit", "x", call("wq"));
  for (const n of ["Agent", "Notes", "Mcp", "McpCheck", "Dashboard", "Anforderungen", "Find", "Projects", "Agents", "Recent", "Terminal"]) Vim.defineEx(n, n, call(n));
  Vim.defineEx("new", "new", call("new"));
  // Space is the leader key in normal mode, Ctrl-w h jumps back to the notes tree
  Vim.defineAction("atlasLeader", (cm) => handlers.get(cm)?.onLeader?.());
  Vim.mapCommand("<Space>", "action", "atlasLeader", {}, { context: "normal" });
  Vim.defineAction("atlasLeft", (cm) => handlers.get(cm)?.onLeave?.());
  Vim.mapCommand("<C-w>h", "action", "atlasLeft", {}, { context: "normal" });
}

function create(parent, opts = {}) {
  defineOnce();
  let silent = false;
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: opts.doc || "",
      extensions: [
        vim({ status: false }),
        relNumbers, highlightActiveLine(), highlightSpecialChars(), drawSelection(), history(), indentOnInput(), bracketMatching(),
        markdown({ base: markdownLanguage }), frontmatter, syntaxHighlighting(gruvbox), theme, EditorView.lineWrapping,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((u) => { if (u.docChanged && !silent) opts.onChange?.(); if (u.docChanged || u.selectionSet) opts.onCursor?.(); }),
      ],
    }),
  });
  const cm = getCM(view);
  handlers.set(cm, opts);
  cm.on("vim-mode-change", (e) => {
    const m = e.mode === "insert" ? "INSERT" : e.mode === "replace" ? "REPLACE" : e.mode === "visual" ? (e.subMode === "linewise" ? "V-LINE" : e.subMode === "blockwise" ? "V-BLOCK" : "VISUAL") : "NORMAL";
    opts.onMode?.(m);
  });
  return {
    view,
    getDoc: () => view.state.doc.toString(),
    setDoc(text) { silent = true; view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }); silent = false; },
    focus: () => view.focus(),
    lines: () => view.state.doc.lines,
    cursor() { const h = view.state.selection.main.head, l = view.state.doc.lineAt(h); return { line: l.number, col: h - l.from + 1 }; },
    destroy: () => view.destroy(),
  };
}

window.AtlasEditor = { create };
