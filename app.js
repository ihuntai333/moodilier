/**
 * cPanel Node.js Selector — Application startup file: app.js
 * Run `npm run build` before starting. Passenger sets PORT.
 */
"use strict";

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const isPassenger = typeof PhusionPassenger !== "undefined";
if (isPassenger) {
  PhusionPassenger.configure({ autoInstall: false });
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

const dir = __dirname;
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "127.0.0.1";
const dev = process.env.NODE_ENV === "development";

const app = next({
  dev,
  dir,
  hostname,
  port: Number.isFinite(port) ? port : 3000,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    if (isPassenger) {
      server.listen("passenger");
      return;
    }

    server.listen(port, hostname, () => {
      console.log(`Ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start Next.js", err);
    process.exit(1);
  });
