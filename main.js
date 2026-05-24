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

const taskTemplates = [
  ["HEL", "Filter intent through Honcho memory"],
  ["HEL", "Compile restricted DAG for ephemeral workers"],
  ["CIB", "Translate Python capability into SKILL.md"],
  ["CIB", "Sync episodic deltas into vector bridge"],
  ["OAL", "Execute browser/file task in sandbox"],
  ["OAL", "Run HEARTBEAT.md workspace drift poll"],
  ["Verifier", "Cross-check evidence and rollback state"],
];

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
  heartbeatTick: $("#heartbeatTick"),
  queueDepth: $("#queueDepth"),
  memorySync: $("#memorySync"),
  sandboxRisk: $("#sandboxRisk"),
  queueState: $("#queueState"),
  queueList: $("#queueList"),
  eventCount: $("#eventCount"),
  eventList: $("#eventList"),
  skillPreview: $("#skillPreview"),
  skillPreviewState: $("#skillPreviewState"),
  historyList: $("#historyList"),
};

const defaultState = {
  cycle: 1248,
  tick: 0,
  heartbeatRunning: false,
  generatedSkillCount: 0,
  latestPlan: null,
  events: [
    { kind: "info", source: "Runtime", message: "Runtime initialized. Awaiting mission route.", at: "boot" },
  ],
  queue: [],
  history: [],
  agents: [
    { name: "HEL Honcho Model", role: "Theory of Mind intent state", load: 91 },
    { name: "HEL DAG Router", role: "Ephemeral sub-agent graph", load: 86 },
    { name: "CIB Skill Bridge", role: "Python to SKILL.md translation", load: 88 },
    { name: "OAL Local Gateway", role: "Sandboxed OS and browser actuation", load: 94 },
  ],
  skills: [
    { name: "honcho_intent_filter.py", status: "validated", confidence: 99 },
    { name: "dag_subagent_router.py", status: "active", confidence: 97 },
    { name: "skill_md_translator.yaml", status: "locked", confidence: 100 },
    { name: "heartbeat_gateway_tick.md", status: "scheduled", confidence: 94 },
  ],
  ledger: [
    { name: "Identity tier", note: "Ephemeral pairing code and Admin policy applied", score: 99 },
    { name: "Atomic scope", note: "OAL receives sanitized tool-call bundle only", score: 98 },
    { name: "Container isolation", note: "WSL2/Docker write allowlist attached", score: 97 },
    { name: "Memory sync", note: "SQLite/Redis session deltas queued for vector bridge", score: 96 },
  ],
  timeline: [
    { name: "Intent filtered", time: "T-04m", state: "HEL sealed" },
    { name: "DAG compiled", time: "T-03m", state: "graph indexed" },
    { name: "SKILL.md emitted", time: "T-01m", state: "CIB translated" },
    { name: "Gateway package", time: "now", state: "OAL armed" },
  ],
};

const storageKey = "hermes-openclaw-runtime-state-v2";
const missionStorageKey = "hermes-openclaw-mission";
let heartbeatTimer = null;
let state = loadState();

function safeReadStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    addEvent("error", "Storage", "Browser storage is unavailable; runtime persistence is disabled.");
  }
}

function safeRemoveStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to reset when browser storage is unavailable.
  }
}

function loadState() {
  try {
    const saved = JSON.parse(safeReadStorage(storageKey));
    if (!saved || typeof saved !== "object") return structuredClone(defaultState);
    return {
      ...structuredClone(defaultState),
      ...saved,
      heartbeatRunning: false,
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  safeWriteStorage(storageKey, JSON.stringify({ ...state, heartbeatRunning: false }));
}

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

function stamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function meter(width) {
  return `<div class="meter" aria-hidden="true"><i style="width:${clamp(width, 0, 100)}%"></i></div>`;
}

function addEvent(kind, source, message) {
  state.events.unshift({ kind, source, message, at: stamp() });
  state.events = state.events.slice(0, 12);
}

function addHistory(status, label) {
  const mission = getMissionState();
  state.history.unshift({
    label,
    status,
    score: Number(mission.synthesis.toFixed(1)),
    drift: Number(mission.drift.toFixed(2)),
    at: stamp(),
  });
  state.history = state.history.slice(0, 8);
}

function getMissionState() {
  const mission = elements.missionInput?.value.trim() || "";
  const autonomy = Number(elements.autonomyRange?.value || 0);
  const rigor = Number(elements.rigorRange?.value || 0);
  const complexity = Math.min(12, wordCount(mission) / 12);
  const policyRisk = getPolicyScore().risk;
  const synthesis = clamp(82 + autonomy * 0.08 + rigor * 0.08 - complexity * 0.22 - policyRisk * 0.03, 42, 99.9);
  const drift = Math.max(0, (100 - rigor) * 0.012 + complexity * 0.01 + policyRisk * 0.006);
  return { mission, autonomy, rigor, complexity, policyRisk, synthesis, drift };
}

function renderAgents() {
  if (!elements.agentList) return;
  elements.agentList.innerHTML = state.agents
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
  elements.skillTable.innerHTML = state.skills
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
  elements.ledgerList.innerHTML = state.ledger
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
  elements.timeline.innerHTML = state.timeline
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

function renderQueue() {
  if (!elements.queueList) return;
  if (elements.queueDepth) elements.queueDepth.textContent = String(state.queue.length);
  if (elements.queueState) elements.queueState.textContent = state.queue.length ? "active" : "idle";
  elements.queueList.innerHTML =
    state.queue.length === 0
      ? `<article class="queue-row"><strong>No pending tool calls</strong><span>Run synthesis or heartbeat to enqueue OAL work.</span></article>`
      : state.queue
          .map(
            (task) => `
              <article class="queue-row" data-status="${escapeHtml(task.status)}">
                <div class="queue-top">
                  <strong>${escapeHtml(task.layer)} / ${escapeHtml(task.name)}</strong>
                  <span>${escapeHtml(task.status)}</span>
                </div>
                <span>${escapeHtml(task.scope)}</span>
                ${meter(task.progress)}
              </article>
            `,
          )
          .join("");
}

function renderEvents() {
  if (!elements.eventList) return;
  if (elements.eventCount) elements.eventCount.textContent = `${state.events.length} events`;
  elements.eventList.innerHTML = state.events
    .map(
      (event) => `
        <article class="event-row" data-kind="${escapeHtml(event.kind)}">
          <div class="event-top">
            <strong>${escapeHtml(event.source)}</strong>
            <span>${escapeHtml(event.at)}</span>
          </div>
          <span>${escapeHtml(event.message)}</span>
        </article>
      `,
    )
    .join("");
}

function renderHistory() {
  if (!elements.historyList) return;
  elements.historyList.innerHTML =
    state.history.length === 0
      ? `<article class="history-row"><strong>No runs yet</strong><span>Validated or routed runs appear here.</span></article>`
      : state.history
          .map(
            (run) => `
              <article class="history-row">
                <div class="history-top">
                  <strong>${escapeHtml(run.label)}</strong>
                  <span>${escapeHtml(run.at)}</span>
                </div>
                <span>${escapeHtml(run.status)} / score ${run.score}% / drift ${run.drift}%</span>
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

function getPolicyScore() {
  const enabled = $$("[data-policy]").filter((input) => input.checked).length;
  const total = $$("[data-policy]").length || 1;
  const risk = Math.round((1 - enabled / total) * 100);
  return { enabled, total, risk };
}

function computeScores() {
  const mission = getMissionState();
  const memoryScore = clamp(94 + state.tick * 0.2 - mission.policyRisk * 0.25, 40, 99);
  if (elements.coreScore) elements.coreScore.textContent = `${mission.synthesis.toFixed(1)}%`;
  if (elements.driftMetric) elements.driftMetric.textContent = `${mission.drift.toFixed(2)}%`;
  if (elements.evidenceScore) {
    elements.evidenceScore.textContent = `${Math.min(99.8, 88 + mission.rigor * 0.12 - mission.policyRisk * 0.05).toFixed(1)}%`;
  }
  if (elements.loopHealth) elements.loopHealth.textContent = mission.synthesis > 96 ? "Optimal" : mission.synthesis > 86 ? "Tuning" : "Constrained";
  if (elements.verifierLock) elements.verifierLock.textContent = mission.rigor > 82 && mission.policyRisk <= 35 ? "Locked" : "Reviewing";
  if (elements.heartbeatTick) elements.heartbeatTick.textContent = String(state.tick);
  if (elements.memorySync) elements.memorySync.textContent = `${Math.round(memoryScore)}%`;
  if (elements.sandboxRisk) elements.sandboxRisk.textContent = `${mission.policyRisk}%`;
  safeWriteStorage(missionStorageKey, mission.mission);
}

function buildPlan(status = "draft", checks = []) {
  const mission = getMissionState();
  return {
    runtime: "Hermes-OpenClaw Synergistic Agentic Runtime",
    cycle: state.cycle,
    heartbeatTick: state.tick,
    status,
    mission: mission.mission,
    hel: {
      memory: "Honcho Theory of Mind",
      routing: "DAG with restricted ephemeral sub-agents",
      autonomy: mission.autonomy,
      activeAgents: state.agents.map((agent) => ({ name: agent.name, load: agent.load })),
    },
    cib: {
      translation: "typed Python -> SKILL.md + YAML frontmatter",
      memoryBridge: "SQLite/Redis deltas -> vector sync",
      latestSkill: state.skills[0]?.name,
    },
    oal: {
      actuator: "local workspace gateway",
      sandbox: "WSL2/Docker allowlisted execution",
      heartbeat: "15 minute proactivity tick",
      queue: state.queue,
    },
    verifier: {
      rigor: mission.rigor,
      synthesisScore: Number(mission.synthesis.toFixed(1)),
      drift: Number(mission.drift.toFixed(2)),
      policyRisk: mission.policyRisk,
      checks,
    },
  };
}

function updatePlanOutput(plan) {
  if (!elements.runOutput) return;
  elements.runOutput.textContent = JSON.stringify(plan, null, 2);
}

function updateSkillPreview(skillName = state.skills[0]?.name || "generated_openclaw_skill.md") {
  if (!elements.skillPreview) return;
  const mission = getMissionState();
  const slug = skillName.replace(/\.(py|yaml|md)$/i, "").replaceAll("_", "-");
  elements.skillPreview.textContent = `---\nname: ${slug}\ndescription: Generated bridge skill for ${mission.mission.slice(0, 84) || "sandboxed OpenClaw execution"}.\ninputs:\n  - mission\n  - sandbox_scope\n  - verifier_threshold\n---\n\n# ${skillName}\n\n## Purpose\nTranslate a Hermes executive plan into an OpenClaw-safe atomic action.\n\n## Execution Contract\n- Receive sanitized tool-call JSON only.\n- Run inside WSL2/Docker allowlists.\n- Return structured deltas, evidence, and rollback handle.\n\n## Verifier Threshold\nRigor: ${mission.rigor}%\nDrift budget: ${mission.drift.toFixed(2)}%\n`;
  if (elements.skillPreviewState) elements.skillPreviewState.textContent = "generated";
}

function enqueueTasks(source = "manual") {
  const additions = taskTemplates.slice(0, 4).map(([layer, name], index) => ({
    id: `${Date.now()}-${index}`,
    layer,
    name,
    scope: source === "heartbeat" ? "autonomous heartbeat scan" : "current mission envelope",
    status: index === 0 ? "running" : "queued",
    progress: index === 0 ? 28 : 0,
  }));
  state.queue = [...state.queue, ...additions].slice(0, 8);
  addEvent("info", "CIB", `${additions.length} atomic tool calls queued from ${source}.`);
}

function advanceQueue() {
  if (state.queue.length === 0) {
    enqueueTasks("heartbeat");
    return;
  }

  const task = state.queue[0];
  task.status = "running";
  task.progress = clamp(task.progress + 34, 0, 100);
  if (task.progress >= 100) {
    const completed = state.queue.shift();
    addEvent("success", completed.layer, `${completed.name} completed and returned structured delta.`);
    state.ledger = state.ledger.map((item, index) => ({
      ...item,
      score: clamp(item.score + (index % 2 === 0 ? 1 : 0), 90, 100),
    }));
    if (state.queue[0]) state.queue[0].status = "running";
  }
}

function mutateAgentLoads() {
  const risk = getPolicyScore().risk;
  state.agents = state.agents.map((agent, index) => {
    const wave = ((state.tick + index) % 4) - 1;
    return { ...agent, load: clamp(agent.load + wave - Math.round(risk / 60), 62, 99) };
  });
}

function heartbeatTick(source = "manual") {
  state.tick += 1;
  state.cycle += 1;
  mutateAgentLoads();
  advanceQueue();
  if (source === "manual") addEvent("info", "HEARTBEAT", "Manual heartbeat tick advanced runtime state.");
  if (state.tick % 3 === 0) generateSkill({ quiet: true });
  state.timeline.unshift({ name: "Heartbeat tick", time: stamp(), state: "workspace scanned" });
  state.timeline = state.timeline.slice(0, 5);
  state.latestPlan = buildPlan("heartbeat");
  renderAll();
  saveState();
}

function setHeartbeatRunning(running) {
  state.heartbeatRunning = running;
  const button = $("[data-heartbeat-toggle]");
  if (button) button.textContent = running ? "Pause heartbeat" : "Start heartbeat";
  window.clearInterval(heartbeatTimer);
  heartbeatTimer = running ? window.setInterval(() => heartbeatTick("auto"), 2400) : null;
  addEvent(running ? "success" : "info", "HEARTBEAT", running ? "Autonomous loop started." : "Autonomous loop paused.");
  renderAll();
}

function validatePlan() {
  const mission = getMissionState();
  const checks = [
    {
      name: "Intent specificity",
      passed: wordCount(mission.mission) >= 12,
      fix: "Add clear task objective, target artifact, and success criteria.",
    },
    {
      name: "Sandbox posture",
      passed: mission.policyRisk <= 35,
      fix: "Re-enable isolation, allowlists, pairing codes, and goal shielding.",
    },
    {
      name: "Rigor threshold",
      passed: mission.rigor >= 80,
      fix: "Raise rigor before sending local execution to OpenClaw.",
    },
    {
      name: "Autonomy balance",
      passed: mission.autonomy <= 94 || mission.rigor >= 94,
      fix: "High autonomy should be paired with high verifier rigor.",
    },
  ];
  const passed = checks.filter((check) => check.passed).length;
  const status = passed === checks.length ? "validated" : `${passed}/${checks.length} checks`;
  state.latestPlan = buildPlan(status, checks);
  addEvent(passed === checks.length ? "success" : "error", "Verifier", passed === checks.length ? "Execution envelope validated." : "Validation found items to tighten.");
  addHistory(status, "Execution envelope");
  renderAll();
  showToast(passed === checks.length ? "Execution envelope validated." : "Validation found items to tighten.");
  return state.latestPlan;
}

function runSynthesis() {
  if (elements.missionState) elements.missionState.textContent = "synthesizing";
  state.cycle += 1;
  enqueueTasks("synthesis");
  state.skills[1].confidence = Math.min(100, state.skills[1].confidence + 1);
  state.timeline.unshift({ name: "Synthesis run", time: stamp(), state: "verified" });
  state.timeline = state.timeline.slice(0, 5);
  state.latestPlan = buildPlan("routed");
  addHistory("routed", "Synthesis run");
  addEvent("success", "HEL", "Mission routed through HEL -> CIB -> OAL.");
  renderAll();
  window.setTimeout(() => {
    if (elements.missionState) elements.missionState.textContent = "verified";
    showToast("Synthesis complete. OAL queue is now live.");
  }, 360);
}

function generateSkill(options = {}) {
  state.generatedSkillCount += 1;
  const suffix = String(state.generatedSkillCount).padStart(2, "0");
  const skill = {
    name: `generated_openclaw_skill_${suffix}.md`,
    status: options.quiet ? "auto-generated" : "candidate",
    confidence: 92 + (state.generatedSkillCount % 5),
  };
  state.skills.unshift(skill);
  state.skills = state.skills.slice(0, 6);
  updateSkillPreview(skill.name);
  addEvent("success", "CIB", `${skill.name} emitted from Hermes function wrapper.`);
  if (!options.quiet) showToast("Hermes function wrapped into SKILL.md and queued on the bus.");
  renderAll();
}

function rollback() {
  state.queue = state.queue.slice(0, 1).map((task) => ({ ...task, status: "queued", progress: 0 }));
  state.timeline.unshift({ name: "Container rollback", time: stamp(), state: "sandbox restored" });
  state.timeline = state.timeline.slice(0, 5);
  addEvent("info", "OAL", "Sandbox restored to the last verified checkpoint.");
  addHistory("rollback", "Sandbox checkpoint");
  renderAll();
  showToast("Rollback complete. OAL sandbox restored.");
}

function updatePolicyRisk() {
  const { risk } = getPolicyScore();
  if (elements.riskMeter) elements.riskMeter.style.width = `${Math.max(12, risk)}%`;
  if (elements.riskState) {
    if (risk <= 25) elements.riskState.textContent = "low risk";
    else if (risk <= 60) elements.riskState.textContent = "review required";
    else elements.riskState.textContent = "high risk";
  }
  addEvent(risk > 35 ? "error" : "info", "Policy", `Sandbox policy risk recalculated at ${risk}%.`);
  computeScores();
  renderEvents();
  saveState();
}

function exportRun() {
  const plan = state.latestPlan || validatePlan();
  navigator.clipboard
    ?.writeText(JSON.stringify(plan, null, 2))
    .then(() => showToast("Execution JSON copied to clipboard."))
    .catch(() => showToast("Execution JSON is visible in the console panel."));
}

function downloadRun() {
  const plan = validatePlan();
  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hermes-openclaw-run-${state.cycle}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  addEvent("success", "Runtime", "Execution JSON downloaded.");
  renderEvents();
  saveState();
}

function clearHistory() {
  state.history = [];
  addEvent("info", "Runtime", "Run history cleared.");
  renderHistory();
  renderEvents();
  saveState();
}

function resetRuntime() {
  window.clearInterval(heartbeatTimer);
  heartbeatTimer = null;
  state = structuredClone(defaultState);
  safeRemoveStorage(storageKey);
  safeRemoveStorage(missionStorageKey);
  if (elements.missionInput) {
    elements.missionInput.value =
      "Design a self-learning market-intelligence workflow that extracts signal, verifies claims, generates reusable skills, and schedules deterministic follow-up tasks.";
  }
  state.latestPlan = buildPlan("ready");
  const heartbeatButton = $("[data-heartbeat-toggle]");
  if (heartbeatButton) heartbeatButton.textContent = "Start heartbeat";
  updateSkillPreview();
  renderAll();
  showToast("Runtime reset to a clean baseline.");
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

function renderAll() {
  computeScores();
  if (elements.cycleCounter) elements.cycleCounter.textContent = `Cycle ${state.cycle}`;
  if (elements.planStatus) elements.planStatus.textContent = state.latestPlan?.status || "ready";
  updatePlanOutput(state.latestPlan || buildPlan("ready"));
  renderAgents();
  renderSkills();
  renderLedger();
  renderTimeline();
  renderQueue();
  renderEvents();
  renderHistory();
  saveState();
}

function bindEvents() {
  $$("[data-run-synthesis]").forEach((button) => button.addEventListener("click", runSynthesis));
  $("[data-generate-skill]")?.addEventListener("click", () => generateSkill());
  $("[data-rollback]")?.addEventListener("click", rollback);
  $("[data-validate-plan]")?.addEventListener("click", validatePlan);
  $("[data-clear-history]")?.addEventListener("click", clearHistory);
  $$("[data-export-run]").forEach((button) => button.addEventListener("click", exportRun));
  $("[data-download-run]")?.addEventListener("click", downloadRun);
  $("[data-reset-runtime]")?.addEventListener("click", resetRuntime);
  $("[data-heartbeat-step]")?.addEventListener("click", () => heartbeatTick("manual"));
  $("[data-heartbeat-toggle]")?.addEventListener("click", () => setHeartbeatRunning(!state.heartbeatRunning));

  $("[data-focus-verifier]")?.addEventListener("click", () => {
    $("#verifier")?.scrollIntoView({ behavior: "smooth" });
  });

  $$(".pipeline-node").forEach((node) => {
    node.addEventListener("click", () => {
      $$(".pipeline-node").forEach((item) => item.classList.remove("is-live"));
      node.classList.add("is-live");
      if (elements.stageReadout) elements.stageReadout.textContent = stageText[node.dataset.stage];
      addEvent("info", "Pipeline", `${node.dataset.stage} stage inspected.`);
      renderEvents();
      saveState();
    });
  });

  $$(".source-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      $$(".source-thumb").forEach((item) => item.classList.remove("is-selected"));
      thumb.classList.add("is-selected");
      const preview = $("#sourcePreview");
      if (preview) preview.src = thumb.dataset.source;
      addEvent("info", "Source board", "Architecture source preview changed.");
      renderEvents();
      saveState();
    });
  });

  $$("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!elements.missionInput) return;
      elements.missionInput.value = missionPresets[button.dataset.preset] || elements.missionInput.value;
      state.latestPlan = buildPlan("preset loaded");
      addEvent("info", "HEL", `${button.textContent.trim()} preset loaded.`);
      renderAll();
      showToast("Mission preset loaded.");
    });
  });

  $$("[data-policy]").forEach((input) => input.addEventListener("change", updatePolicyRisk));

  [elements.autonomyRange, elements.rigorRange, elements.missionInput].forEach((control) => {
    control?.addEventListener("input", () => {
      state.latestPlan = buildPlan("draft");
      renderAll();
    });
  });
}

function init() {
  const savedMission = safeReadStorage(missionStorageKey);
  if (savedMission && elements.missionInput) elements.missionInput.value = savedMission;
  bindEvents();
  state.latestPlan = state.latestPlan || buildPlan("ready");
  updateSkillPreview();
  renderAll();
  initNavObserver();
}

init();
