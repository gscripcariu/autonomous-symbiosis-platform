const agents = [
  { name: "HEL Honcho Model", role: "Theory of Mind intent state", load: 91 },
  { name: "HEL DAG Router", role: "Ephemeral sub-agent graph", load: 86 },
  { name: "CIB Skill Bridge", role: "Python to SKILL.md translation", load: 88 },
  { name: "OAL Local Gateway", role: "Sandboxed OS and browser actuation", load: 94 },
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

const missionPresets = {
  research:
    "Run a research operations loop that gathers market signals, strips prompt-injection content, scores evidence quality, creates reusable synthesis skills, and returns a verified executive brief.",
  security:
    "Audit a local automation workspace for risky plugins, broad filesystem access, stale gateway tokens, missing sandbox boundaries, and unverified browser outputs.",
  automation:
    "Create a HEARTBEAT.md automation plan that checks workspace drift every 15 minutes, routes simple I/O locally, and escalates ambiguous decisions back to Hermes.",
};

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

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  agentList: $("#agentList"),
  skillTable: $("#skillTable"),
  ledgerList: $("#ledgerList"),
  timeline: $("#timeline"),
  toast: $("#toast"),
  coreScore: $("#coreScore"),
  loopHealth: $("#loopHealth"),
  verifierLock: $("#verifierLock"),
  driftMetric: $("#driftMetric"),
  missionState: $("#missionState"),
  cycleCounter: $("#cycleCounter"),
  evidenceScore: $("#evidenceScore"),
  stageReadout: $("#stageReadout"),
  missionInput: $("#missionInput"),
  autonomyRange: $("#autonomyRange"),
  rigorRange: $("#rigorRange"),
  runOutput: $("#runOutput"),
  planStatus: $("#planStatus"),
  riskState: $("#riskState"),
  riskMeter: $("#riskMeter"),
};

let cycle = 1248;
let generatedSkillCount = 0;
let latestPlan = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function meter(width) {
  return `<div class="meter" aria-hidden="true"><i style="width:${clamp(width, 0, 100)}%"></i></div>`;
}

function renderAgents() {
  if (!elements.agentList) return;
  elements.agentList.innerHTML = agents
    .map(
      (agent) => `
        <article class="agent-row">
          <div class="agent-top">
            <strong>${escapeHtml(agent.name)}</strong>
            <span>${agent.load}%</span>
          </div>
          <span>${escapeHtml(agent.role)}</span>
          ${meter(agent.load)}
        </article>
      `,
    )
    .join("");
}

function renderSkills() {
  if (!elements.skillTable) return;
  elements.skillTable.innerHTML = skills
    .map(
      (skill) => `
        <article class="skill-row">
          <div class="skill-top">
            <strong>${escapeHtml(skill.name)}</strong>
            <span>${escapeHtml(skill.status)}</span>
          </div>
          ${meter(skill.confidence)}
        </article>
      `,
    )
    .join("");
}

function renderLedger() {
  if (!elements.ledgerList) return;
  elements.ledgerList.innerHTML = ledger
    .map(
      (item) => `
        <article class="ledger-row">
          <div class="ledger-top">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${item.score}%</span>
          </div>
          <span>${escapeHtml(item.note)}</span>
          ${meter(item.score)}
        </article>
      `,
    )
    .join("");
}

function renderTimeline() {
  if (!elements.timeline) return;
  elements.timeline.innerHTML = timeline
    .map(
      (item) => `
        <article class="time-row">
          <div class="time-top">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.time)}</span>
          </div>
          <span>${escapeHtml(item.state)}</span>
        </article>
      `,
    )
    .join("");
}

function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2800);
}

function getMissionState() {
  const mission = elements.missionInput?.value.trim() || "";
  const autonomy = Number(elements.autonomyRange?.value || 0);
  const rigor = Number(elements.rigorRange?.value || 0);
  const complexity = Math.min(12, wordCount(mission) / 12);
  const synthesis = Math.min(99.9, 82 + autonomy * 0.08 + rigor * 0.08 - complexity * 0.22);
  const drift = Math.max(0, (100 - rigor) * 0.012 + complexity * 0.01);
  return { mission, autonomy, rigor, complexity, synthesis, drift };
}

function computeScores() {
  const state = getMissionState();
  if (elements.coreScore) elements.coreScore.textContent = `${state.synthesis.toFixed(1)}%`;
  if (elements.driftMetric) elements.driftMetric.textContent = `${state.drift.toFixed(2)}%`;
  if (elements.evidenceScore) {
    elements.evidenceScore.textContent = `${Math.min(99.8, 88 + state.rigor * 0.12).toFixed(1)}%`;
  }
  if (elements.loopHealth) elements.loopHealth.textContent = state.synthesis > 96 ? "Optimal" : "Tuning";
  if (elements.verifierLock) elements.verifierLock.textContent = state.rigor > 82 ? "Locked" : "Reviewing";
  localStorage.setItem("hermes-openclaw-mission", state.mission);
}

function validatePlan() {
  const state = getMissionState();
  const checks = [
    {
      name: "Intent specificity",
      passed: wordCount(state.mission) >= 12,
      fix: "Add clear task objective, target artifact, and success criteria.",
    },
    {
      name: "Sandbox posture",
      passed: getPolicyScore().risk <= 35,
      fix: "Re-enable isolation, allowlists, pairing codes, and goal shielding.",
    },
    {
      name: "Rigor threshold",
      passed: state.rigor >= 80,
      fix: "Raise rigor before sending local execution to OpenClaw.",
    },
    {
      name: "Autonomy balance",
      passed: state.autonomy <= 94 || state.rigor >= 94,
      fix: "High autonomy should be paired with high verifier rigor.",
    },
  ];
  const passed = checks.filter((check) => check.passed).length;
  const status = passed === checks.length ? "validated" : `${passed}/${checks.length} checks`;
  latestPlan = buildPlan(status, checks);
  updatePlanOutput(latestPlan);
  if (elements.planStatus) elements.planStatus.textContent = status;
  showToast(passed === checks.length ? "Execution envelope validated." : "Validation found items to tighten.");
  return latestPlan;
}

function buildPlan(status = "draft", checks = []) {
  const state = getMissionState();
  return {
    runtime: "Hermes-OpenClaw Synergistic Agentic Runtime",
    cycle,
    status,
    mission: state.mission,
    hel: {
      memory: "Honcho Theory of Mind",
      routing: "DAG with restricted ephemeral sub-agents",
      autonomy: state.autonomy,
    },
    cib: {
      translation: "typed Python -> SKILL.md + YAML frontmatter",
      memoryBridge: "SQLite/Redis deltas -> vector sync",
    },
    oal: {
      actuator: "local workspace gateway",
      sandbox: "WSL2/Docker allowlisted execution",
      heartbeat: "15 minute proactivity tick",
    },
    verifier: {
      rigor: state.rigor,
      synthesisScore: Number(state.synthesis.toFixed(1)),
      drift: Number(state.drift.toFixed(2)),
      checks,
    },
  };
}

function updatePlanOutput(plan) {
  if (!elements.runOutput) return;
  elements.runOutput.textContent = JSON.stringify(plan, null, 2);
}

function runSynthesis() {
  if (elements.missionState) elements.missionState.textContent = "synthesizing";
  cycle += 1;
  if (elements.cycleCounter) elements.cycleCounter.textContent = `Cycle ${cycle}`;
  agents.forEach((agent, index) => {
    const delta = index % 2 === 0 ? 3 : -2;
    agent.load = clamp(agent.load + delta, 72, 99);
  });
  skills[1].confidence = Math.min(100, skills[1].confidence + 1);
  timeline.unshift({ name: "Synthesis run", time: "now", state: "verified" });
  if (timeline.length > 5) timeline.pop();
  computeScores();
  latestPlan = buildPlan("routed");
  updatePlanOutput(latestPlan);
  if (elements.planStatus) elements.planStatus.textContent = "routed";
  renderAgents();
  renderSkills();
  renderTimeline();
  window.setTimeout(() => {
    if (elements.missionState) elements.missionState.textContent = "verified";
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
  timeline.unshift({ name: "Container rollback", time: "now", state: "sandbox restored" });
  if (timeline.length > 5) timeline.pop();
  renderTimeline();
  showToast("Rollback complete. OAL sandbox restored to the last verified checkpoint.");
}

function getPolicyScore() {
  const enabled = $$("[data-policy]").filter((input) => input.checked).length;
  const total = $$("[data-policy]").length || 1;
  const risk = Math.round((1 - enabled / total) * 100);
  return { enabled, total, risk };
}

function updatePolicyRisk() {
  const { risk } = getPolicyScore();
  if (elements.riskMeter) elements.riskMeter.style.width = `${Math.max(12, risk)}%`;
  if (!elements.riskState) return;
  if (risk <= 25) elements.riskState.textContent = "low risk";
  else if (risk <= 60) elements.riskState.textContent = "review required";
  else elements.riskState.textContent = "high risk";
}

function exportRun() {
  const plan = latestPlan || validatePlan();
  navigator.clipboard
    ?.writeText(JSON.stringify(plan, null, 2))
    .then(() => showToast("Execution JSON copied to clipboard."))
    .catch(() => showToast("Execution JSON is visible in the console panel."));
}

function activateNavForSection(id) {
  $$("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
}

function initNavObserver() {
  const sections = $$("main section[id]");
  if (!("IntersectionObserver" in window) || sections.length === 0) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) activateNavForSection(visible.target.id);
    },
    { threshold: [0.28, 0.45, 0.62] },
  );
  sections.forEach((section) => observer.observe(section));
}

function bindEvents() {
  $$("[data-run-synthesis]").forEach((button) => button.addEventListener("click", runSynthesis));
  $("[data-generate-skill]")?.addEventListener("click", generateSkill);
  $("[data-rollback]")?.addEventListener("click", rollback);
  $("[data-validate-plan]")?.addEventListener("click", validatePlan);
  $$("[data-export-run]").forEach((button) => button.addEventListener("click", exportRun));

  $("[data-focus-verifier]")?.addEventListener("click", () => {
    $("#verifier")?.scrollIntoView({ behavior: "smooth" });
  });

  $$(".pipeline-node").forEach((node) => {
    node.addEventListener("click", () => {
      $$(".pipeline-node").forEach((item) => item.classList.remove("is-live"));
      node.classList.add("is-live");
      if (elements.stageReadout) elements.stageReadout.textContent = stageText[node.dataset.stage];
    });
  });

  $$(".source-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      $$(".source-thumb").forEach((item) => item.classList.remove("is-selected"));
      thumb.classList.add("is-selected");
      const preview = $("#sourcePreview");
      if (preview) preview.src = thumb.dataset.source;
    });
  });

  $$("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!elements.missionInput) return;
      elements.missionInput.value = missionPresets[button.dataset.preset] || elements.missionInput.value;
      computeScores();
      latestPlan = buildPlan("preset loaded");
      updatePlanOutput(latestPlan);
      showToast("Mission preset loaded.");
    });
  });

  $$("[data-policy]").forEach((input) => input.addEventListener("change", updatePolicyRisk));

  [elements.autonomyRange, elements.rigorRange, elements.missionInput].forEach((control) => {
    control?.addEventListener("input", computeScores);
  });
}

function init() {
  const savedMission = localStorage.getItem("hermes-openclaw-mission");
  if (savedMission && elements.missionInput) elements.missionInput.value = savedMission;
  bindEvents();
  renderAgents();
  renderSkills();
  renderLedger();
  renderTimeline();
  computeScores();
  updatePolicyRisk();
  latestPlan = buildPlan("ready");
  updatePlanOutput(latestPlan);
  initNavObserver();
}

init();
