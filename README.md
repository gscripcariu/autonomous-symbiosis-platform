# Hermes-OpenClaw Synergistic Agentic Runtime

An interactive framework app for the **Hermes-OpenClaw Synergistic Agentic Runtime**: a dual-engine agent architecture where **Hermes** acts as the metacognitive executive layer and **OpenClaw** acts as the bare-metal actuator layer.

The app is a static, browser-ready cockpit that turns the supplied architecture visuals and technical specification into a usable product surface: runtime overview, mission routing, skill translation, security isolation, verifier feedback, rollback checkpoints, and source architecture previews.

## What This App Shows

The platform models an asymmetric agent runtime:

- **Hermes Executive Layer (HEL)** decides what should happen.
- **Cognitive Intermediary Bus (CIB)** translates strategic intent into executable artifacts.
- **OpenClaw Actuation Layer (OAL)** performs local OS, browser, file, terminal, webhook, and automation work.
- **Verifier and rollback controls** keep execution accountable, constrained, and reversible.
- **Sandbox policy simulator** shows how identity, isolation, filesystem allowlists, and goal shielding affect risk.
- **Structured execution console** emits a readable HEL -> CIB -> OAL execution envelope.
- **Heartbeat loop** continuously mutates runtime telemetry, queue state, events, skills, and verifier history.
- **OpenClaw actuation queue** turns mission routing into visible atomic work.
- **Live event stream** records pipeline inspection, validation, queue completion, policy changes, rollback, and heartbeat activity.

The guiding principle is:

> Hermes decides. OpenClaw drives.

## Live App Entry Point

Open this file in a browser:

```text
index.html
```

No build step, package install, local server, or environment variable is required.

## Folder Structure

```text
autonomous-symbiosis-platform/
  index.html
  styles.css
  main.js
  README.md
  assets/
    synergistic_architecture.png
    synaptic_bridge.png
    hermes_openclaw_synergy.jpeg
```

## Quick Start

1. Clone or download the repository.

2. Open the platform folder:

   ```text
   autonomous-symbiosis-platform
   ```

3. Double-click:

   ```text
   index.html
   ```

4. The app opens directly in your default browser.

5. Use the left navigation to move through:

   - Overview
   - Routing
   - Runtime
   - Skills
   - Security
   - Verifier

## Quality Check

Run the bundled static QA check from the repository root:

```bash
node qa-static-check.mjs
```

The check verifies:

- Required files exist.
- Required visual assets exist.
- Core HTML sections and controls are present.
- `main.js` passes JavaScript syntax validation.

Expected output:

```text
Static QA passed: files, assets, HTML markers, and JavaScript syntax are valid.
```

## How To Use The Interface

### 1. Overview

The opening cockpit presents the runtime as a synthesis core:

- Hermes on one side as the executive cognition layer.
- OpenClaw on the other side as the local actuator.
- A live synthesis score in the center.
- Health indicators for loop status, verifier lock, and drift.

Use:

- **Run synthesis** to simulate a runtime pass.
- **Inspect verifier** to jump to the verifier and rollback command center.
- **Export run** to copy or expose the latest structured execution JSON.
- **Start heartbeat** in the workbench to run the autonomous loop.

### 2. Routing Workbench

The routing section contains the mission composer and execution pipeline.

You can:

1. Edit the mission payload.
2. Load a preset mission for research operations, security auditing, or automation loops.
3. Adjust autonomy.
4. Adjust rigor.
5. Route the mission through the synthesis core.
6. Validate the execution envelope.
7. Click pipeline stages to inspect what each stage does.
8. Watch the OpenClaw actuation queue process atomic work.
9. Read the live event stream as the runtime changes.

The four modeled stages are:

- **Intent recognition** through HEL.
- **DAG compilation** through HEL.
- **Skill translation** through CIB.
- **Atomic actuation** through OAL.

The structured execution console produces JSON containing:

- Runtime name.
- Cycle number.
- Mission text.
- HEL routing and memory settings.
- CIB translation and memory bridge details.
- OAL gateway, sandbox, and heartbeat settings.
- Verifier scores, drift, and validation checks.
- Current OAL queue state.
- Active HEL agent loads.
- Latest CIB-generated skill.

### Dynamic Heartbeat Loop

The heartbeat loop is the main dynamic behavior in the app.

Use:

- **Start heartbeat** to begin an autonomous tick every few seconds.
- **Pause heartbeat** to stop the loop.
- **Single tick** to advance the runtime once.

Each tick can:

- Increment heartbeat and cycle counters.
- Enqueue or advance OAL tasks.
- Complete queued work and emit structured events.
- Change HEL/CIB/OAL load levels.
- Update memory sync, sandbox risk, drift, and synthesis score.
- Generate a new SKILL.md preview every few ticks.
- Add verifier timeline entries.

### 3. Runtime Architecture

The runtime section formalizes the system into three layers.

#### Hermes Executive Layer

Responsible for:

- Honcho Theory of Mind memory.
- Intent validation.
- User preference and constraint tracking.
- DAG routing.
- Ephemeral sub-agent spawning.
- Self-evolving typed Python skill generation.

#### Cognitive Intermediary Bus

Responsible for:

- Translating Hermes-generated typed Python into OpenClaw-compatible `SKILL.md` assets.
- Adding YAML frontmatter.
- Converting strategic plans into atomic tool-call bundles.
- Syncing episodic logs from SQLite or Redis into vector memory systems such as Milvus or Chroma.

#### OpenClaw Actuation Layer

Responsible for:

- Local workspace gateway execution.
- Browser automation.
- Filesystem interaction.
- Terminal commands.
- Cron and webhook listening.
- `HEARTBEAT.md` background proactivity.
- WSL2 or Docker sandbox execution.

### 4. Skills Layer

The skills section demonstrates how capabilities move across the runtime.

The modeled flow:

1. HEL identifies a missing capability.
2. HEL generates a typed Python function.
3. CIB wraps it into a `SKILL.md` asset.
4. OAL executes it locally.
5. Verifier records confidence and rollback readiness.

Use **Generate skill** to simulate creating a new OpenClaw-compatible skill from a Hermes-generated function.

The **Generated SKILL.md preview** updates dynamically when skills are generated. It includes YAML frontmatter, execution contract notes, sandbox requirements, and verifier thresholds based on the current mission.

### 5. Security Matrix

The security section maps risks to mitigations.

It covers:

- Ingress gateway risk.
- Tool execution risk.
- Prompt injection risk.

The key security idea is that OpenClaw receives only sanitized atomic execution instructions. It does not receive the full strategic user goal. Hermes keeps the goal state, identity model, and high-level policy authority.

The **Sandbox policy simulator** lets you toggle:

- Ephemeral pairing codes.
- WSL2/Docker isolation.
- Filesystem allowlists.
- Strategic goal shielding.

The risk state updates immediately as controls change.

### 6. Verifier Command Center

The verifier section contains:

- Ground-truth ledger.
- Checkpoint timeline.
- Rollback control.
- Source architecture preview board.
- Run history.

Use **Rollback** to simulate restoring the OAL sandbox to the last verified checkpoint.

The run history updates when you route, validate, or roll back a run. It records score, drift, status, and timestamp.

## Architecture Summary

```text
User Interface / Chat Gateway
        |
        v
Hermes Executive Layer
  - Theory of Mind memory
  - DAG orchestration
  - Self-evolving skills
        |
        v
Cognitive Intermediary Bus
  - Skill translation
  - Memory bridge
  - Validated tool-call tokens
        |
        v
OpenClaw Actuation Layer
  - Local gateway
  - Browser / OS / filesystem
  - HEARTBEAT automation
  - WSL2 / Docker sandbox
        |
        v
Validation and feedback loop
```

## Design Direction

The visual system is based on the supplied Hermes/OpenClaw architecture references:

- Dark technical cockpit.
- Gold Hermes flow.
- Violet OpenClaw execution layer.
- Cyan verifier and bus signals.
- Dense but readable platform UI.
- No landing page wrapper: the app opens directly into the usable runtime cockpit.

## Technical Notes

This app is intentionally simple to run:

- Plain HTML.
- Plain CSS.
- Plain JavaScript.
- No bundler.
- No package manager.
- No backend.
- No network dependency.

That makes it easy to publish with:

- GitHub Pages.
- Netlify Drop.
- Vercel static hosting.
- Any static file server.

## Main Files

### `index.html`

Defines the app structure:

- Navigation rail.
- Runtime cockpit.
- Routing workbench.
- HEL/CIB/OAL architecture section.
- Skill registry.
- Security matrix.
- Verifier and source board.

### `styles.css`

Defines the visual system:

- Dark background grid.
- Hermes/OpenClaw accent colors.
- Responsive layout.
- Runtime layer bands.
- Matrix tables.
- Cards, metrics, buttons, source previews, and mobile behavior.

### `main.js`

Provides local interactivity:

- Synthesis run simulation.
- Dynamic score computation.
- Pipeline stage switching.
- Skill generation simulation.
- Live heartbeat simulation.
- OAL queue processing.
- Live event stream.
- Run history.
- Rollback simulation.
- Source visual switching.
- Navigation active states.
- Mission presets.
- Execution-envelope validation.
- Structured JSON export.
- Sandbox policy risk scoring.
- Local mission persistence.
- Runtime state persistence.
- HTML escaping for rendered dynamic data.

### `qa-static-check.mjs`

Provides dependency-free static quality checks:

- Confirms files and assets are present.
- Confirms core UI markers exist.
- Runs JavaScript syntax validation.

## UX and Interaction Inventory

The current prototype includes these user-facing workflows:

1. **Mission drafting:** edit or preset the mission payload.
2. **Runtime tuning:** adjust autonomy and rigor sliders.
3. **Synthesis routing:** simulate HEL -> CIB -> OAL execution.
4. **Stage inspection:** click each pipeline stage to inspect runtime responsibilities.
5. **Envelope validation:** check intent specificity, sandbox posture, rigor threshold, and autonomy balance.
6. **Structured export:** produce and copy execution JSON.
7. **Heartbeat automation:** run the autonomous tick loop or step it manually.
8. **Actuation queue:** observe atomic local work move from queued to running to complete.
9. **Live telemetry:** watch scores, memory sync, queue depth, and sandbox risk shift.
10. **Skill evolution:** generate SKILL.md candidates and preview their content.
11. **Sandbox policy simulation:** toggle defensive controls and observe risk.
12. **Verifier rollback:** restore the last sandbox checkpoint.
13. **Source review:** inspect the attached architecture visuals.

## Error Handling and Safety Behavior

The app avoids executing real local commands. Safety behavior is simulated but structured as if it were driving a production runtime:

- Dynamic HTML rows are escaped before rendering.
- Missing DOM elements are guarded with safe lookups.
- Mission text persists in `localStorage`.
- Runtime queue, events, skills, history, and counters persist in `localStorage`.
- Clipboard export falls back to the visible console if browser permissions block copying.
- Validation highlights weak execution envelopes before actuation.
- Sandbox risk increases if defensive toggles are disabled.

## Publishing With GitHub Pages

After this folder is pushed to GitHub:

1. Open the repository on GitHub.
2. Go to **Settings**.
3. Open **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the branch that contains this folder.
6. Select the root folder if publishing the whole repository, or configure a static deployment path if using a separate deployment workflow.
7. Save.
8. Open:

   ```text
   https://<your-github-username>.github.io/<repository-name>/autonomous-symbiosis-platform/
   ```

For this repository, the likely GitHub Pages URL will be:

```text
https://gscripcariu.github.io/hunter-ma-platform/autonomous-symbiosis-platform/
```

That URL will work after GitHub Pages is enabled for the repository and branch.

## Future Implementation Roadmap

This app is currently a polished framework prototype. A production runtime could extend it with:

1. Real Hermes API integration for executive planning.
2. Real OpenClaw local gateway calls.
3. A persisted skill registry.
4. A real `SKILL.md` generator.
5. SQLite or Redis session logs.
6. Milvus or Chroma vector sync.
7. WSL2 or Docker execution policy controls.
8. Identity tiers and pairing codes.
9. Audit logs for every tool call.
10. Live HEARTBEAT tick monitoring.

## Security Disclaimer

The current app is a static prototype and does not execute local commands. Any production implementation that gives an agent filesystem, shell, browser, or OS access should use strict sandboxing, least-privilege permissions, allowlisted paths, auditable logs, and explicit user approval for dangerous operations.
