// Kleiner lokaler Server fuer die Fragerunde: liefert die Seite aus und speichert die Antworten.
import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";

const dir = new URL(".", import.meta.url);
const port = Number(process.env.PORT || 4321);

const server = createServer((req, res) => {
  if (req.method === "POST" && req.url === "/answer") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        writeFileSync(new URL("answers.json", dir), JSON.stringify({ at: new Date().toISOString(), ...data }, null, 2));
        res.writeHead(200, { "content-type": "application/json" }).end('{"ok":true}');
        console.log("ANSWER " + JSON.stringify(data));
        setTimeout(() => process.exit(0), 300);
      } catch {
        res.writeHead(400).end();
      }
    });
    return;
  }
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(readFileSync(new URL("index.html", dir)));
});
server.listen(port, "127.0.0.1", () => console.log(`Fragerunde: http://127.0.0.1:${port}/`));
