import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "styles.css",
  "main.js",
  "README.md",
  "assets/synergistic_architecture.png",
  "assets/synaptic_bridge.png",
  "assets/hermes_openclaw_synergy.jpeg",
];

const requiredHtml = [
  "Dual-engine runtime architecture",
  "Security and isolation matrix",
  "Structured execution plan",
  "Sandbox policy simulator",
  "OpenClaw actuation queue",
  "Live event stream",
  "Generated SKILL.md preview",
  "Run history",
  "data-run-synthesis",
  "data-validate-plan",
  "data-export-run",
  "data-heartbeat-toggle",
  "data-heartbeat-step",
];

async function assertFile(path) {
  try {
    await access(path);
  } catch {
    throw new Error(`Missing required file: ${path}`);
  }
}

async function assertJavaScriptSyntax(file) {
  const source = await readFile(file, "utf8");
  try {
    new Function(source);
  } catch (error) {
    throw new Error(`JavaScript syntax check failed for ${file}: ${error.message}`);
  }
}

for (const file of requiredFiles) {
  await assertFile(file);
}

const html = await readFile("index.html", "utf8");
for (const marker of requiredHtml) {
  if (!html.includes(marker)) {
    throw new Error(`Missing required HTML marker: ${marker}`);
  }
}

await assertJavaScriptSyntax("main.js");

console.log("Static QA passed: files, assets, HTML markers, and JavaScript syntax are valid.");
