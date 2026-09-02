# 🎙️ GitHub Spec Kit & Agentic SDD — 60-Minute Class & Live Demo Guide

This document is your complete **instructor roadmap, timing breakdown, talking points, command guide, and live demonstration script** for a 60-minute practical session.

---

## ⏱️ Class Timing Breakdown (60 Minutes)

```text
┌───────────────────────────┬───────────────────────────────────────────────┬─────────┐
│ Section                   │ Topic & Focus                                 │ Time    │
├───────────────────────────┼───────────────────────────────────────────────┼─────────┤
│ 1. Framework Fundamentals │ What is Spec Kit, 10 Commands & Prompts, Repo │ 20 min  │
│ 2. Governance & Baseline  │ Constitution v1.5.0 & App State Before Demo   │ 5 min   │
│ 3. Live Demo Part 1       │ /speckit-specify, clarify, plan, tasks & PR   │ 15 min  │
│ 4. Live Demo Part 2       │ Implement, CI/CD Green Gate, Code Review & App│ 15 min  │
│ 5. Wrap-Up & Student Lab  │ Extensions (Bug & Assess), Q&A & Lab Kickoff │ 5 min   │
└───────────────────────────┴───────────────────────────────────────────────┴─────────┘
```

---

## Part 1: Spec Kit Framework, Directory Layout & 10 Core Commands (20 Minutes)

### 1.1 What is GitHub Spec Kit? (3 min)
- **Concept**: Spec Kit is an open-source framework developed by GitHub to standardize **Spec-Driven Development (SDD)** with AI coding agents.
- **Why it matters**: It replaces "vague prompt guessing" with structured artifacts, machine-readable contracts, and automated validation gates.
- **Core Principle**: **Spec Before Code**. Architecture, invariants, and acceptance tests are agreed upon before generating implementation code.

---

### 1.2 Directory Structure & What Lives Where (5 min)
Walk students through the repo filesystem so they understand that **Spec Kit stores artifacts directly inside git-tracked markdown**:

```text
my-project/
├── .specify/                         <-- Core Spec Kit Configuration & State
│   ├── memory/
│   │   └── constitution.md           <-- Project-wide laws, DoR/DoD, testing gates
│   ├── extensions.yml                <-- Git lifecycle hooks & installed extensions
│   ├── extensions/                   <-- Extension definitions (bug, assess, etc.)
│   ├── init-options.json             <-- Project configuration (e.g. timestamp numbering)
│   └── templates/                    <-- Customizable scaffolds for spec, plan, tasks
│
├── .agents/skills/                   <-- Agent Tooling & Slash Commands
│   ├── speckit-specify/SKILL.md      <-- Generates requirements & user stories
│   ├── speckit-clarify/SKILL.md      <-- Detects gaps & conducts design interviews
│   ├── speckit-plan/SKILL.md         <-- Produces architecture & API contracts
│   ├── speckit-tasks/SKILL.md        <-- Decomposes plan into dependency-ordered tasks
│   ├── speckit-implement/SKILL.md    <-- Executes tasks in TDD branches with atomic commits
│   └── speckit-converge/SKILL.md     <-- Automated QA audit (codebase vs spec)
│
└── specs/                            <-- Feature Specifications & Implementation Blueprints
    ├── 001-expense-entry/            <-- Iteration 01 Artifacts
    │   ├── spec.md                   <-- Functional specs, acceptance criteria, invariants
    │   ├── plan.md                   <-- Tech stack design & architecture decisions
    │   ├── tasks.md                  <-- Atomic task checklist (- [ ] T001...)
    │   └── contracts/openapi.json    <-- Interface schemas
    └── 002-debt-minimization/        <-- Iteration 02 Artifacts
```

---

### 1.3 The 10 Core Lifecycle Commands, Sample Prompts & Rules of Engagement (12 min)

Here is the complete command reference. Share this on-screen to guide students on **how to prompt**, **what to include**, and **what to strictly avoid**:

---

#### 1. `/speckit-constitution`
- **Purpose**: Establishes or amends project-wide engineering laws, architectural constraints, and quality gates.
- **Good Prompt Example**:
  ```text
  /speckit-constitution
  Add a non-negotiable rule: 100% path coverage on all core financial calculations.
  Also mandate that every User Story must be delivered on a dedicated branch with peer review and green CI/CD before merging.
  ```
- ⚠️ **What to Mention**: Non-negotiable quality rules, architectural boundaries, testing criteria, DoR/DoD definitions.
- 🚫 **What NOT to Mention**: Specific feature logic, UI button colors, temporary debugging commands, or daily tasks.

---

#### 2. `/speckit-specify`
- **Purpose**: Transforms a product idea into an unambiguous, testable functional specification (`spec.md`).
- **Good Prompt Example**:
  ```text
  /speckit-specify
  Feature: Unequal / Custom Expense Splits (Exact Amounts and Percentages)
  Description:
  Allow users to create expenses where the amount owed by each participant can be customized either by exact monetary amounts or by percentages, while guaranteeing that the complete expense amount is allocated exactly.
  Enforce the fundamental invariant: Sum(participant shares) == Expense total with zero fractional-cent drift.
  ```
- ⚠️ **What to Mention**: User personas, user stories (P1, P2), functional requirements, acceptance scenarios, mathematical invariants, and explicit out-of-scope boundaries.
- 🚫 **What NOT to Mention**: **NO TECHNICAL IMPLEMENTATION DETAILS**. Do not mention React hooks, FastAPI routes, SQL queries, database tables, or CSS classes. Keep the spec 100% technology-agnostic English.

---

#### 3. `/speckit-clarify`
- **Purpose**: Identifies underspecified areas, ambiguities, or hidden edge cases in `spec.md` before technical planning.
- **Good Prompt Example**:
  ```text
  /speckit-clarify
  ```
  *(Or provide focus areas: `/speckit-clarify Focus on fractional cent remainder allocation order for percentage splits and boundary validation when a custom share is $0.00`)*.
- ⚠️ **What to Mention**: Point out specific business ambiguities you want to clarify.
- 🚫 **What NOT to Mention**: Do not answer with code snippets. Choose or specify business policy rules.

---

#### 4. `/speckit-plan`
- **Purpose**: The technical design phase. Selects technologies, data structures, and interface contracts (`plan.md`, `contracts/`).
- **Good Prompt Example**:
  ```text
  /speckit-plan
  Extend the expense model and creation flow to support Equal, Exact Amounts, and Percentages.
  Backend: Use FastAPI with Pydantic validators enforcing exact penny conservation using Decimal arithmetic.
  Frontend: Add split mode selector in ExpenseForm with dynamic rows and real-time remainder allocation feedback.
  Ensure backward compatibility with existing balance calculation and debt minimization graph.
  ```
- ⚠️ **What to Mention**: Technology stack choices, component architecture, data models, OpenAPI contracts, and file locations.
- 🚫 **What NOT to Mention**: Do not generate full application source code yet; focus on architectural strategy and interface schemas.

---

#### 5. `/speckit-checklist`
- **Purpose**: "Unit Tests for English." Generates a requirements quality checklist to ensure the spec is complete and testable.
- **Good Prompt Example**:
  ```text
  /speckit-checklist
  ```
- ⚠️ **What to Mention**: Request review against clarity, completeness, edge cases, and testability.
- 🚫 **What NOT to Mention**: Do not ask for code linting here; this checklist evaluates the specification itself.

---

#### 6. `/speckit-tasks`
- **Purpose**: Decomposes the architectural plan into atomic, dependency-ordered tasks structured by User Story (`tasks.md`).
- **Good Prompt Example**:
  ```text
  /speckit-tasks
  Generate atomic, dependency-ordered tasks for Unequal / Custom Expense Splits grouped by User Story.
  Ensure tests are written first (TDD) for backend validation, balance math, and frontend components.
  ```
- ⚠️ **What to Mention**: Task grouping by User Story (`[US1]`, `[US2]`), exact file paths, and test-first sequence.
- 🚫 **What NOT to Mention**: Vague, sprawling multi-file tasks (e.g. "Build the entire frontend").

---

#### 7. `/speckit-taskstoissues`
- **Purpose**: Synchronizes tasks from `tasks.md` into tracked GitHub Issues using GitHub MCP.
- **Good Prompt Example**:
  ```text
  /speckit-taskstoissues
  ```
- ⚠️ **What to Mention**: Sync tasks to remote repository issues for project management traceability.
- 🚫 **What NOT to Mention**: Do not create duplicate manual issues on GitHub.

---

#### 8. `/speckit-analyze`
- **Purpose**: Pre-implementation audit. Verifies 100% bidirectional coverage across `spec.md`, `plan.md`, `tasks.md`, and `constitution.md`.
- **Good Prompt Example**:
  ```text
  /speckit-analyze
  ```
- ⚠️ **What to Mention**: Check for orphaned requirements, missing tasks, or constitutional violations.
- 🚫 **What NOT to Mention**: Do not modify files; this is a read-only validation gate.

---

#### 9. `/speckit-implement`
- **Purpose**: Executes the tasks incrementally using TDD on dedicated story branches with atomic commits.
- **Good Prompt Example**:
  ```text
  /speckit-implement
  Implement User Story 1 & 2 (Backend Custom Split Engine & Exact/Percentage Validation) on a dedicated branch.
  Follow TDD, ensure 100% path coverage on balance calculations, create 1:1 atomic commits per task, and open a Pull Request.
  ```
- ⚠️ **What to Mention**: Target a single User Story or phase at a time; enforce atomic commits (`T###`) and PR creation.
- 🚫 **What NOT to Mention**: Do not instruct the agent to implement the entire multi-week project in one massive pass.

---

#### 10. `/speckit-converge`
- **Purpose**: Post-implementation audit. Verifies that the running codebase actually delivers everything promised in the spec.
- **Good Prompt Example**:
  ```text
  /speckit-converge
  Audit the codebase against specs/003-custom-splits/spec.md and report any missing requirements or regressions.
  ```
- ⚠️ **What to Mention**: Request audit against functional requirements (`FR-###`), acceptance criteria, and constitutional invariants.
- 🚫 **What NOT to Mention**: Do not manually delete tasks; `/speckit-converge` will append any missing delta tasks automatically if gaps exist.

---

### 1.4 The 3 Golden Rules & 4 Anti-Patterns of Agentic SDD

Before starting any feature with AI coding agents, keep these principles visible on-screen:

#### 🌟 The 3 Golden Rules of Agentic Pair Programming:
1. **Be the Architect, Not the Typist**: Spend 80% of your cognitive energy clarifying business logic, API schemas, and invariants in `spec.md` and `plan.md`. Let the AI do the mechanical typing in `implement`.
2. **Never Accept Unverified Code**: AI-generated code without automated test verification is a liability. Every increment must achieve 100% path coverage on financial calculations.
3. **Small Branches & Vertical Slicing**: Implement exactly **one User Story at a time** (~3 to 6 tasks). Never let an agent attempt a sprawling multi-week refactor in a single prompt.

#### ⚠️ The Top 4 Student Anti-Patterns to Avoid:
1. ❌ **The "Vague Spec" Mistake**: Writing *"Build an expense page"* instead of explicit functional requirements (`FR-001`), edge cases, and zero-sum invariants.
2. ❌ **The "Mega-Prompt" Mistake**: Asking the agent to build the whole semester in one turn instead of following the step-by-step lifecycle.
3. ❌ **The "Direct Push to Main" Mistake**: Trying to code on `main` without opening dedicated feature branches, peer reviews, or passing automated CI/CD checks.
4. ❌ **The "Gold-Plating / Scope Creep" Mistake**: Letting the agent add unrequested databases, auth systems, or complex UI libraries when the spec called for a simple in-memory MVP.

---

## Part 2: Governance & Current Baseline (5 Minutes)

### 2.1 The Constitution as an Engineering Contract (2 min)
Open [`.specify/memory/constitution.md`](.specify/memory/constitution.md) and highlight:
1. **Principle IV (100% Path Coverage on Core Math)**: Non-negotiable quality gate for business logic.
2. **Principle V (Precedent Merge Gating & 1 Story per Branch)**: Students cannot build story 2 while story 1 is floating on an unreviewed branch.
3. **Principle VIII (Four-Eyes Peer Review)**: PRs cannot be merged by authors.
4. **Principle XII (Automated CI/CD & Green Build Gating)**: Merging is blocked if tests or builds fail.

### 2.2 Show the App Running (Current State) (3 min)
Show the students what is already built in SplitWise Lite:
1. **Backend**: Running on `http://localhost:8000/docs` (Swagger UI showing `/expenses`, `/balances`, `/settlements`).
2. **Frontend**: Running on `http://localhost:5173` (Showing live group members, expense recording, balances, and transaction graph).
3. **The Goal for Today's Demo**: Build **Feature 003: Unequal / Custom Expense Splits (Exact Amounts & Percentages)**.

---

## Part 3: Live Demo — Specifying, Planning & Tasking (15 Minutes)

> [!TIP]
> For the complete copy-pasteable prompt texts, refer to [`CLASS_PROMPTS.md`](CLASS_PROMPTS.md).

### Step 1: `/speckit-specify` (4 min)
Run the slash command (from `CLASS_PROMPTS.md`):
```text
/speckit-specify
Define the product specification for a new iteration: Unequal / Custom Expense Splits.
(Full prompt in CLASS_PROMPTS.md)
```
**Key Teaching Point**: Open `specs/003-custom-splits/spec.md` (or newly generated spec) and show how user stories, invariants ($\sum \text{Shares} \equiv \text{Expense Total}$), and boundaries are documented in plain English without technical code leakage.

---

### Step 2: *(Optional / Fast)* `/speckit-clarify` (3 min)
Run:
```text
/speckit-clarify
Focus on fractional cent remainder allocation order for percentage splits and boundary validation when a custom share is $0.00.
```
**Key Teaching Point**: Show how the agent conducts a design interview to resolve edge-case ambiguities before any technical design begins.

---

### Step 3: `/speckit-plan` (4 min)
Run the slash command (from `CLASS_PROMPTS.md`):
```text
/speckit-plan
Create the technical implementation plan for the Unequal / Custom Expense Splits feature based on the approved specification.
(Full prompt in CLASS_PROMPTS.md)
```
**Key Teaching Point**: Open `plan.md` and `contracts/openapi.json`. Highlight that architectural planning, Decimal penny math, and contract definitions occur before writing code.

---

### Step 4: `/speckit-tasks` (3 min)
Run:
```text
/speckit-tasks
```
**Key Teaching Point**: Show `tasks.md` with structured, atomic tasks mapped 1:1 to User Stories (`- [ ] T001 [P] [US1]...`).

---

### Step 5: `/speckit-taskstoissues` & `/speckit-analyze` (3 min)
Run:
```text
/speckit-taskstoissues
/speckit-analyze
```
**Key Teaching Point**: 
- **Automated Issue Sync**: Show how `/speckit-taskstoissues` interacts with the **GitHub MCP Server** to automatically create real, tracked GitHub Issues for each task in `tasks.md` without any manual typing.
- **Definition of Ready (DoR)**: Show `/speckit-analyze` verifying 100% bidirectional requirements-to-tasks coverage before code generation begins.

---

## Part 4: Live Demo — Implementation & CI/CD Gating (15 Minutes)

### Step 6: `/speckit-implement` (8 min)
Run:
```text
/speckit-implement
```
**What to highlight during execution**:
1. Dedicated story branch checkout (`feature/issue-XX-us1-custom-splits`).
2. Writing tests first (TDD).
3. Atomic 1:1 commits per task referencing the issue (`T001: closes #XX`).
4. Automatic push and Pull Request creation.

### Step 7: The GitHub PR, CI/CD Green Gate & Live App (7 min)
Switch to the GitHub browser tab:
1. Open the newly created **Pull Request**.
2. Point out:
   - **Traceability**: Description references `closes #<IssueID>`.
   - **Copilot Automated Code Review**: Show Copilot evaluating code safety, efficiency, and cleanliness.
   - **GitHub Actions CI/CD Pipeline**: Show `Backend Lint & Tests` and `Frontend Build` running and turning **Green 🟢**.
3. Merge the PR to `main`, pull `main` locally, and refresh `http://localhost:5173` to see the new custom splits live in the application!

---

## Part 5: Extensions Showcase, Wrap-Up & Student Lab (5 Minutes)

### 5.1 Mention Spec Kit Extensions (2 min)
- Show `.specify/extensions/` in the codebase.
- Briefly explain:
  - **Idea Assessment (`assess`)**: Installed via `specify extension add assess` for pre-spec discovery (`intake` $\rightarrow$ `research` $\rightarrow$ `define` $\rightarrow$ `shape` $\rightarrow$ `decide`).
  - **Bug Triage (`bug`)**: Installed via `specify extension add bug` for surgical debugging (`assess` $\rightarrow$ `fix` $\rightarrow$ `test`).

### 5.2 Lab Instructions for Students (3 min)
1. Point students to [`REPO_SETUP_GUIDE.md`](REPO_SETUP_GUIDE.md), [`SPRINT_PLAYBOOK.md`](SPRINT_PLAYBOOK.md), and [`CLASS_PROMPTS.md`](CLASS_PROMPTS.md).
2. Form student pairs.
3. Choose a user story from Sprint 1 wave.
4. Execute the SDD lifecycle on dedicated branches with peer reviews!

---

## 💡 Instructor Pro-Tips & Contingency Plan

1. **Time Management**: If running behind schedule, skip `/speckit-clarify` and `/speckit-analyze` and move directly from `/speckit-specify` $\rightarrow$ `/speckit-plan` $\rightarrow$ `/speckit-tasks` $\rightarrow$ `/speckit-implement`.
2. **Dead Air Filling**: While `/speckit-implement` runs, walk through `.github/workflows/ci.yml` or explain Constitution Principle V (Traceability & Precedent Merge Gating).
3. **Backup Reference**: If network or token issues arise, use **Iteration 02 (`specs/002-debt-minimization/`)** on `main` as a live completed reference!

---

## Appendix: In-Depth Guide to Spec Kit Presets & Extensions (Self-Paced / Optional)

> [!NOTE]
> This section is optional for the live 60-minute lecture. Keep it as an appendix so students can explore advanced customization, preset authoring, and extension pipelines independently.

---

### A. Spec Kit Presets (Standardized Team Templates)

#### 1. What is a Preset?
In large engineering organizations and university courses, different teams might use different tech stacks (FastAPI + React, Spring Boot + Angular, Go + Next.js, or Rust). 

A **Preset** is a packaged bundle that customizes Spec Kit's underlying scaffolds, templates, rules, and prompts for a specific technology or domain standard.

#### 2. Where Presets Live & How They Work
Spec Kit searches for templates and rules using a layered resolution stack:
1. **Project Override**: `.specify/templates/` (highest priority — customized for this repo).
2. **Installed Presets**: Configured in `.specify/init-options.json` or `.specify/preset.json`.
3. **Core Scaffolds**: Default Spec Kit built-in templates (fallback).

#### 3. How to Use Presets in a Project
When initializing a project, teams can specify a preset:
```bash
specify init --preset python-fastapi my-project
```
Or switch presets in existing repositories by updating `.specify/init-options.json`:
```json
{
  "preset": "enterprise-security",
  "feature_numbering": "sequential"
}
```

#### 4. Practical Value for Teams:
- **Architectural Uniformity**: Ensures every team generates `plan.md` documents tailored to their stack.
- **Compliance & Security**: Enforces enterprise security gates (e.g. OWASP validation) directly into every generated `spec.md` and `tasks.md`.

---

### B. Spec Kit Extensions (Modular Capability Add-ons)

#### 1. What is an Extension?
While core Spec Kit focuses on the feature lifecycle (`specify` $\rightarrow$ `plan` $\rightarrow$ `tasks` $\rightarrow$ `implement`), **Extensions** provide modular capabilities that extend the CLI with new slash commands, lifecycle hooks, and project management pipelines.

#### 2. Managing Extensions via CLI
The `specify` CLI includes a complete extension manager:
```bash
# Search available extensions in the official catalog
specify extension search

# Install an extension
specify extension add <name>

# List all currently installed and active extensions
specify extension list

# Update extensions to the latest version
specify extension update

# Remove an extension
specify extension remove <name>
```

---

### C. Deep-Dive: The 2 Core Extensions Installed in this Repo

```text
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                      1. IDEA ASSESSMENT PIPELINE (assess)                       │
 │  /speckit-assess-intake ─► /speckit-assess-research ─► /speckit-assess-define  │
 │                                                              │                  │
 │  /speckit-specify (GO) ◄─── /speckit-assess-decide ◄─────────┴── /assess-shape  │
 └─────────────────────────────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                         2. BUG TRIAGE WORKFLOW (bug)                            │
 │   Bug Report ─► /speckit-bug-assess ─► /speckit-bug-fix ─► /speckit-bug-test   │
 └─────────────────────────────────────────────────────────────────────────────────┘
```

#### 1. Idea Assessment Pipeline (`assess`)
- **Installation**: `specify extension add assess`
- **Storage Location**: `.specify/assessments/<idea-slug>/`
- **Purpose**: Bridge product discovery and engineering. Before spending hours writing technical specifications, product managers or students run raw ideas through a 5-step validation gate:
  - **`/speckit-assess-intake`**: Normalizes loose ideas, customer quotes, or competitive notes into a standardized intake artifact.
  - **`/speckit-assess-research`**: Collects market evidence, codebase feasibility notes, and user data to challenge or validate assumptions.
  - **`/speckit-assess-define`**: Formulates the core problem statement, affected personas, business goals, and quantifiable success metrics.
  - **`/speckit-assess-shape`**: Outlines solution concepts, boundaries, appetite (time budget), and architectural trade-offs.
  - **`/speckit-assess-decide`**: Evaluates the idea against a structured decision matrix:
    - **GO**: Automatically triggers and feeds structured context directly into `/speckit-specify`.
    - **NEEDS CLARIFICATION**: Prompts for additional data/research.
    - **KILL**: Archives the idea without wasting developer cycles.

---

#### 2. Bug Triage & Fix Workflow (`bug`)
- **Installation**: `specify extension add bug`
- **Storage Location**: `.specify/bugs/<bug-slug>/`
- **Purpose**: Provides a surgical, spec-aware debugging loop that prevents regressions and maintains architectural integrity:
  - **`/speckit-bug-assess`**: Ingests bug reports, stack traces, or issue links, investigates the codebase, identifies the root cause, and designs a minimal, targeted remediation plan.
  - **`/speckit-bug-fix`**: Executes the approved remediation step-by-step and logs every modified file and behavioral change.
  - **`/speckit-bug-test`**: Runs regression test suites and reproduction scenarios, producing a formal verification report confirming the bug is dead with zero side-effects.
