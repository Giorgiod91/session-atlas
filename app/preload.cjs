// Bridge between the UI and the main process. Only these calls are exposed.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("SESSION_DATA", ipcRenderer.sendSync("atlas:data-sync"));
contextBridge.exposeInMainWorld("atlasApp", {
  info: ipcRenderer.sendSync("atlas:info-sync"),
  onData: (cb) => ipcRenderer.on("atlas:data-updated", (_e, d) => cb(d)),
  spawn: (opts) => ipcRenderer.invoke("pty:spawn", opts),
  write: (id, d) => ipcRenderer.send("pty:write", id, d),
  resize: (id, cols, rows) => ipcRenderer.send("pty:resize", id, cols, rows),
  kill: (id) => ipcRenderer.send("pty:kill", id),
  onPty: (cb) => ipcRenderer.on("pty:data", (_e, id, d) => cb(id, d)),
  onExit: (cb) => ipcRenderer.on("pty:exit", (_e, id, code) => cb(id, code)),
  notes: {
    list: () => ipcRenderer.invoke("notes:list"),
    read: (path) => ipcRenderer.invoke("notes:read", path),
    write: (path, text) => ipcRenderer.invoke("notes:write", { path, text }),
    create: (opts) => ipcRenderer.invoke("notes:create", opts),
  },
  projects: { create: (name) => ipcRenderer.invoke("project:create", { name }) },
  mcp: {
    list: () => ipcRenderer.invoke("mcp:list"),
    check: (opts) => ipcRenderer.invoke("mcp:check", opts),
    add: (opts) => ipcRenderer.invoke("mcp:add", opts),
    remove: (opts) => ipcRenderer.invoke("mcp:remove", opts),
  },
});
