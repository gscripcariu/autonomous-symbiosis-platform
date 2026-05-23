const agents = [
  { name: "HEL Honcho Model", role: "Theory of Mind intent state", load: 91, color: "gold" },
  { name: "HEL DAG Router", role: "Ephemeral sub-agent graph", load: 86, color: "gold" },
  { name: "CIB Skill Bridge", role: "Python to SKILL.md translation", load: 88, color: "cyan" },
  { name: "OAL Local Gateway", role: "Sandboxed OS and browser actuation", load: 94, color: "violet" },
];

const skills = [
  { name: "honcho_intent_filter.py", status: "validated", confidence: 99 },
  { name: "dag_subagent_router.py", status: "active", confidence: 97 },
  { name: "skill_md_translator.yaml", status: "locked", confidence: 100 },
  { name: "heartbeat_gateway_tick.md", status: "scheduled", confidence: 94 },
];

const ledger = [
  { name: "Identity tier", note: "Ephemeral pairing code and Admin policy applied", score: 99 },
  { name: "Atomic scope", note: "OAL receives sanitized tool-call bundle only", score: 98 },
  { name: "Container isolation", note: "WSL2/Docker write allowlist attached", score: 97 },
  { name: "Memory sync", note: "SQLite/Redis session deltas queued for vector bridge", score: 96 },
];

const timeline = [
  { name: "Intent filtered", time: "T-04m", state: "HEL sealed" },
  { name: "DAG compiled", time: "T-03m", state: "graph indexed" },
  { name: "SKILL.md emitted", time: "T-01m", state: "CIB translated" },
  { name: "Gateway package", time: "now", state: "OAL armed" },
];

const stageText = {
  intent:
    "Hermes Executive Layer parses intent against Honcho Theory of Mind memory and produces a constrained task graph.",
  reasoning:
    "HEL decomposes the task into a DAG and spawns short-lived sub-agents with restricted context windows.",
  constraints:
    "The Cognitive Intermediary Bus wraps typed Hermes functions into OpenClaw SKILL.md assets and validated tool-call tokens.",
  verified:
    "OpenClaw Actuation Layer executes local OS, browser, filesystem, and HEARTBEAT.md tasks inside the sandbox.",
};

const agentList = document.querySelector("#agentList");
const skillTable = document.querySelector("#skillTable");
const ledgerList = document.querySelector("#ledgerList");
const timelineEl = document.querySelector("#timeline");
const toast = document.querySelector("#toast");
const coreScore = document.querySelector("#coreScore");
const loopHealth = document.querySelector("#loopHealth");
const verifierLock = document.querySelector("#verifierLock");
const driftMetric = document.querySelector("#driftMetric");
const missionState = document.querySelector("#missionState");
const cycleCounter = document.querySelector("#cycleCounter");
const evidenceScore = document.querySelector("#evidenceScore");
const stageReadout = document.querySelector("#stageReadout");
const missionInput = document.querySelector("#missionInput");
const autonomyRange = document.querySelector("#autonomyRange");
const rigorRange = document.querySelector("#rigorRange");

let cycle = 1248;
let generatedSkillCount = 0;

function meter(width) {
  return `<div class="meter" aria-hidden="true"><i style="width:${width}%"></i></div>`;
}

function renderAgents() {
  agentList.innerHTML = agents
    .map(
      (agent) => `
        <article class="agent-row">
          <div class="agent-top">
            <strong>${agent.name}</strong>
            <span>${agent.load}%</span>
          </div>
          <span>${agent.role}</span>
          ${meter(agent.load)}
        </article>
      `,
    )
    .join("");
}

function renderSkills() {
  skillTable.innerHTML = skills
    .map(
      (skill) => `
        <article class="skill-row">
          <div class="skill-top">
            <strong>${skill.name}</strong>
            <span>${skill.status}</span>
          </div>
          ${meter(skill.confidence)}
        </article>
      `,
    )
    .join("");
}

function renderLedger() {
  ledgerList.innerHTML = ledger
    .map(
      (item) => `
        <article class="ledger-row">
          <div class="ledger-top">
            <strong>${item.name}</strong>
            <span>${item.score}%</span>
          </div>
          <span>${item.note}</span>
          ${meter(item.score)}
        </article>
      `,
    )
    .join("");
}

function renderTimeline() {
  timelineEl.innerHTML = timeline
    .map(
      (item) => `
        <article class="time-row">
          <div class="time-top">
            <strong>${item.name}</strong>
            <span>${item.time}</span>
          </div>
          <span>${item.state}</span>
        </article>
      `,
    )
    .join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function computeScores() {
  const autonomy = Number(autonomyRange.value);
  const rigor = Number(rigorRange.value);
  const missionComplexity = Math.min(12, missionInput.value.trim().split(/\s+/).length / 12);
  const synthesis = Math.min(99.9, 82 + autonomy * 0.08 + rigor * 0.08 - missionComplexity * 0.22);
  const drift = Math.max(0, (100 - rigor) * 0.012 + missionComplexity * 0.01).toFixed(2);
  coreScore.textContent = `${synthesis.toFixed(1)}%`;
  driftMetric.textContent = `${drift}%`;
  evidenceScore.textContent = `${Math.min(99.8, 88 + rigor * 0.12).toFixed(1)}%`;
  loopHealth.textContent = synthesis > 96 ? "Optimal" : "Tuning";
  verifierLock.textContent = rigor > 82 ? "Locked" : "Reviewing";
}

function runSynthesis() {
  missionState.textContent = "synthesizing";
  cycle += 1;
  cycleCounter.textContent = `Cycle ${cycle}`;
  agents.forEach((agent, index) => {
    const delta = index % 2 === 0 ? 3 : -2;
    agent.load = Math.max(72, Math.min(99, agent.load + delta));
  });
  skills[1].confidence = Math.min(100, skills[1].confidence + 1);
  timeline.unshift({
    name: "Synthesis run",
    time: "now",
    state: "verified",
  });
  if (timeline.length > 5) timeline.pop();
  computeScores();
  renderAgents();
  renderSkills();
  renderTimeline();
  window.setTimeout(() => {
    missionState.textContent = "verified";
    showToast("Synthesis complete. Verifier packaged the action with rollback state.");
  }, 360);
}

function generateSkill() {
  generatedSkillCount += 1;
  const suffix = String(generatedSkillCount).padStart(2, "0");
  skills.unshift({
    name: `generated_openclaw_skill_${suffix}.md`,
    status: "candidate",
    confidence: 92 + (generatedSkillCount % 5),
  });
  if (skills.length > 6) skills.pop();
  renderSkills();
  showToast("Hermes function wrapped into SKILL.md and queued on the Cognitive Intermediary Bus.");
}

function rollback() {
  timeline.unshift({
    name: "Container rollback",
    time: "now",
    state: "sandbox restored",
  });
  if (timeline.length > 5) timeline.pop();
  renderTimeline();
  showToast("Rollback complete. OAL sandbox restored to the last verified checkpoint.");
}

document.querySelectorAll("[data-run-synthesis]").forEach((button) => {
  button.addEventListener("click", runSynthesis);
});

document.querySelector("[data-generate-skill]").addEventListener("click", generateSkill);
document.querySelector("[data-rollback]").addEventListener("click", rollback);

document.querySelector("[data-focus-verifier]").addEventListener("click", () => {
  document.querySelector("#verifier").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".pipeline-node").forEach((node) => {
  node.addEventListener("click", () => {
    document.querySelectorAll(".pipeline-node").forEach((item) => item.classList.remove("is-live"));
    node.classList.add("is-live");
    stageReadout.textContent = stageText[node.dataset.stage];
  });
});

document.querySelectorAll(".source-thumb").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    document.querySelectorAll(".source-thumb").forEach((item) => item.classList.remove("is-selected"));
    thumb.classList.add("is-selected");
    document.querySelector("#sourcePreview").src = thumb.dataset.source;
  });
});

document.querySelectorAll(".rail-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".rail-nav a").forEach((item) => item.classList.remove("is-active"));
    link.classList.add("is-active");
  });
});

[autonomyRange, rigorRange, missionInput].forEach((control) => {
  control.addEventListener("input", computeScores);
});

renderAgents();
renderSkills();
renderLedger();
renderTimeline();
computeScores();
