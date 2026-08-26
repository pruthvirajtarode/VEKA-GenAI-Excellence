const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => {
  console.error("PAGE ERROR:", err);
});
virtualConsole.on("warn", (warn) => {
  console.warn("PAGE WARN:", warn);
});
virtualConsole.on("log", (log) => {
  console.log("PAGE LOG:", log);
});

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "file:///" + __dirname.replace(/\\/g, '/') + "/index.html",
  virtualConsole
});

setTimeout(() => {
  console.log("App display:", dom.window.document.getElementById('app').style.display);
  console.log("Overlay display:", dom.window.document.getElementById('loading-overlay').style.display);
  console.log("Overlay opacity:", dom.window.document.getElementById('loading-overlay').style.opacity);
  process.exit(0);
}, 2000);
