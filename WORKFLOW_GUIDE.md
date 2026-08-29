# Spec-Driven Development (SDD) & Agentic Engineering Guide

This guide describes the complete end-to-end lifecycle for building software with AI coding agents using **Spec-Driven Development (SDD)** in collaborative, multi-developer teams.

---

## The Core Philosophy: "Spec Before Code"

In traditional AI-assisted coding, developers ask models to generate code directly from loose prompts, leading to hallucinated architectures, unverified edge cases, and scope drift.

In **Spec-Driven Development**, the process is inverted:
1. **Constitution First**: Non-negotiable architectural invariants and quality gates are codified before work begins.
2. **Requirements Quality**: Specifications are written in technology-agnostic English and unit-tested for completeness, clarity, and edge cases.
3. **Formal Contracts & Planning**: Architecture, data schemas, and API contracts are derived before implementation.
4. **Incremental Delivery**: Agents work strictly task-by-task, delivering exactly one User Story per branch/PR with 100% test coverage.
5. **Continuous Verification & Convergence**: Automated audits bridge the gap between intent and code to prevent regressions.

---

## The 10-Step Lifecycle Diagram

```text
  💡 Feature Idea / Business Need
                 │
                 ▼
  [1] /speckit-constitution ──► Establish non-negotiable rules & quality gates
                 │
                 ▼
  [2] /speckit-specify      ──► Write tech-agnostic user stories & invariants
                 │
                 ▼
  [3] /speckit-clarify      ──► Resolve ambiguities & ask targeted design questions
                 │
                 ▼
  [4] /speckit-plan         ──► Select tech stack, define data models & contracts
                 │
                 ▼
  [5] /speckit-checklist    ──► "Unit Tests for English" (requirements quality check)
                 │
                 ▼
  [6] /speckit-tasks        ──► Decompose into dependency-ordered atomic tasks
                 │
                 ▼
  [7] /speckit-taskstoissues──► Synchronize tasks into GitHub Issues
                 │
                 ▼
  [8] /speckit-analyze      ──► Validate 100% coverage across all artifacts
                 │
                 ▼
  [9] /speckit-implement    ──► Incremental TDD execution (Atomic commits & PR per story)
                 │
                 ▼
 [10] /speckit-converge     ──► Audit codebase vs spec & append any missing delta tasks
```

---

## Command Reference & Classroom Steps

### 1. `/speckit-constitution`
- **Purpose**: Defines project-wide engineering laws, architectural constraints, and test gates.
- **Key Outcome**: Produces `.specify/memory/constitution.md`.
- **Teaching Point**: AI agents must adhere to strict governance (e.g. 100% path coverage on financial math, single-story branches, merge gating) rather than making ad-hoc decisions.

### 2. `/speckit-specify`
- **Purpose**: Transforms a product idea into an unambiguous, testable functional specification.
- **Key Outcome**: Produces `specs/NNN-<feature-name>/spec.md` with prioritized User Stories (P1, P2, P3...), mathematical invariants, and explicit MVP boundaries.
- **Teaching Point**: Keep specs 100% technology-agnostic. Focus on *what* users see and *why*, not *how* to code it.

### 3. `/speckit-clarify`
- **Purpose**: Detects underspecified areas, conflicting requirements, and hidden assumptions in the specification *before* technical design starts.
- **Key Outcome**: Asks up to 5 targeted, high-impact multiple-choice clarification questions and encodes the answers directly back into `spec.md` under a `## Clarifications` section.
- **Teaching Point**: **Preventing Downstream Rework**. Clarifying business rules in English costs seconds, whereas discovering a flawed assumption during coding wastes hours of implementation and test refactoring.

### 4. `/speckit-plan`
- **Purpose**: The technical design phase. Selects the appropriate tech stack, architectures, and interface contracts.
- **Key Outcome**: Produces `plan.md`, `research.md`, `data-model.md`, and OpenAPI/Interface contracts under `contracts/`.
- **Teaching Point**: Architecture and contract definitions must precede any application code generation.

### 5. `/speckit-checklist`
- **Purpose**: "Unit Tests for English Requirements."
- **Key Outcome**: Generates reviewer-owned checklists in `checklists/requirements-quality.md`.
- **Teaching Point**: Validates the requirements document itself for completeness, clarity, precision, and edge-case coverage.

### 6. `/speckit-tasks`
- **Purpose**: Breaks down the design plan into atomic, dependency-ordered tasks.
- **Key Outcome**: Produces `tasks.md` with strict task formatting (`- [ ] T001 [P] [US1] Description with file path`).
- **Teaching Point**: Tasks are structured by User Story so each slice can be independently developed, tested, and demonstrated.

### 7. `/speckit-taskstoissues`
- **Purpose**: Bridges the local specification with project management by publishing each task as a tracked GitHub Issue.
- **Key Outcome**: Issues created on the remote repository with links back to the task ID.

### 8. `/speckit-analyze`
- **Purpose**: A read-only verification pass before any code is written.
- **Key Outcome**: Audits `spec.md`, `plan.md`, `tasks.md`, and `constitution.md` to guarantee 100% requirement coverage, no unmapped tasks, and zero constitutional violations.

### 9. `/speckit-implement`
- **Purpose**: Executes implementation tasks incrementally.
- **Key Outcome**:
  1. Checks out a dedicated branch per User Story (`feature/issue-<ID>-<name>`).
  2. Writes tests first (TDD).
  3. Implements the solution with atomic 1:1 commits per task (`T###`).
  4. Verifies 100% test coverage.
  5. Pushes the branch and creates a GitHub Pull Request with `closes #<ID>` references.

### 10. `/speckit-converge`
- **Purpose**: Closes the gap between stated intent (`spec.md`, `plan.md`, `tasks.md`) and what the codebase actually delivers.
- **Key Outcome**: Evaluates the present code against all Functional Requirements (`FR-###`), Success Criteria (`SC-###`), User Story Acceptance Criteria, and Constitutional Principles.
  - If gaps exist (`missing`, `partial`, `contradicts`, or `unrequested`), it safely **appends** new delta tasks under `## Phase N: Convergence` in `tasks.md` for `/speckit-implement` to complete.
  - If everything is satisfied, it reports **`✅ Converged`** without altering files.
- **Teaching Point**: **Closing the Feedback Loop & Quality Assurance**. In agentic workflows, partial implementations or subtle requirement omissions can occur. `/speckit-converge` acts as an automated QA audit ensuring zero delta before declaring a release done.

---

## Multi-Team Sprint Execution Playbook (Teams of 6)

In college capstone projects and industry teams, 6 developers working across 6 sprints cannot plan or build a semester's worth of scope in a single monolithic pass. They must use a **Two-Tier Planning Model**:

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                    MACRO LEVEL: PRODUCT BACKLOG                        │
 │           Lean Inception User Story Map (All 6 Sprints)                │
 └───────┬──────────────────┬──────────────────┬──────────────────┬───────┘
         │                  │                  │                  │
         ▼                  ▼                  ▼                  ▼
    Sprint 1/2         Sprint 3           Sprint 4           Sprint 5/6
   Wave 1 (MVP)      Wave 2 (Growth)    Wave 3 (Scale)     Wave 4 (Polish)
         │
         ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                  MICRO LEVEL: SPEC KIT SPRINT LIFECYCLE                │
 │         /speckit-specify ──► /speckit-plan ──► /speckit-tasks         │
 │                        (1 Feature per Iteration)                       │
 └────────────────────────────────────────────────────────────────────────┘
```

### Sprint Planning Routine:
1. **Synchronous Alignment (First 30–45 min)**:
   - Team reviews the Lean Inception Story Map wave.
   - Slices the sprint goal into 2–3 distinct feature specifications.
   - Assigns pairs to features:
     - **Pair 1**: Feature A (`specs/003-...`)
     - **Pair 2**: Feature B (`specs/004-...`)
     - **Pair 3**: Feature C (`specs/005-...`)
2. **Asynchronous Parallel Execution**:
   - Each pair executes the full Spec Kit cycle on their own dedicated branch.
3. **Cross-Pair Peer Review (Four-Eyes Principle)**:
   - Pairs review each other's PRs against Constitution gates before merging to `main`.

---

## Concurrency & Collision Prevention in Multi-Pair Teams

When multiple pairs begin work simultaneously, teams must manage **Story Independence** and **Spec Directory Collision**:

### 1. Vertical Slicing & Contract-First Dependencies
- **Vertical Domain Slices**: Slices should touch distinct subdomains (e.g. Member Management vs Expense Splitting vs PDF Export) to allow truly parallel work.
- **Contract-First Mocking**: If Pair B depends on Pair A's backend endpoint, both pairs agree on the OpenAPI contract (`contracts/openapi.json`) during Sprint Planning. Pair B codes against the mock schema while Pair A implements the service, eliminating blocking bottlenecks.

### 2. Preventing Spec Directory Collisions
If two pairs invoke `/speckit-specify` at the exact same moment from `main`, they might both attempt to create `specs/003-...`. Teams can prevent collisions using two options:

- **Option A: Pre-Allocated Feature Directory (Recommended for PM)**:
  During Sprint Planning, assign the feature number upfront. Students pass the explicit directory parameter when specifying:
  ```markdown
  /speckit-specify SPECIFY_FEATURE_DIRECTORY=specs/003-custom-splits Define the spec for...
  ```
- **Option B: Timestamp-Based Numbering**:
  Configure `.specify/init-options.json` with `"feature_numbering": "timestamp"`. Spec Kit will generate collision-proof directories like `specs/20260824-101500-custom-splits` using unique second-level timestamps.

---

## Spec Kit Extensions: Idea Assessment & Bug Triage

Spec Kit can be extended with specialized modular workflows using the CLI extension system (`specify extension add <name>`).

Two powerful extensions for product discovery and maintenance are **Idea Assessment** and **Bug Triage**:

```text
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                      IDEA ASSESSMENT PIPELINE (assess)                          │
 │  /speckit-assess-intake ─► /speckit-assess-research ─► /speckit-assess-define  │
 │                                                              │                  │
 │  /speckit-specify (GO) ◄─── /speckit-assess-decide ◄─────────┴── /assess-shape  │
 └─────────────────────────────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                         BUG TRIAGE WORKFLOW (bug)                               │
 │   Bug Report ─► /speckit-bug-assess ─► /speckit-bug-fix ─► /speckit-bug-test   │
 └─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 1. Idea Assessment Pipeline (`assess`)

The `assess` extension structures upstream product discovery **before** committing time to write full specifications. It stores evidence and decision artifacts under `.specify/assessments/<slug>/`.

#### Installation
```bash
specify extension add assess
```

#### Step-by-Step Discovery Commands:
1. **`/speckit-assess-intake`**:
   - Captures raw ideas from user interviews, feedback tickets, competitor observations, or URLs into a normalized intake note.
2. **`/speckit-assess-research`**:
   - Gathers evidence, market data, user feedback, and technical feasibility pointers to support or challenge the premise.
3. **`/speckit-assess-define`**:
   - Formally establishes who is affected, what hurts (the core problem), goals, non-goals, and quantifiable success metrics.
4. **`/speckit-assess-shape`**:
   - Shapes solution options, architectural boundaries, appetite (e.g. 2 days vs 2 weeks), and trade-offs without writing code.
5. **`/speckit-assess-decide`**:
   - Evaluates the shaped concept against a strict decision gate:
     - **Go**: Automatically triggers and hands off the structured context to `/speckit-specify`.
     - **Needs Clarification**: Flags missing data for further research.
     - **Kill / Archive**: Closes the idea without wasting engineering capacity.

---

### 2. Bug Triage & Fix Workflow (`bug`)

The `bug` extension provides a surgical, spec-aware workflow to assess, remediate, and verify bug reports without causing regressions or scope creep. It stores investigation logs under `.specify/bugs/<slug>/`.

#### Installation
```bash
specify extension add bug
```

#### Step-by-Step Bug Lifecycle Commands:
1. **`/speckit-bug-assess`**:
   - Takes a bug description, error log, or GitHub Issue URL and investigates the codebase.
   - Identifies the root cause, affected files, edge-case failure mechanisms, and outlines a minimal, targeted remediation plan.
2. **`/speckit-bug-fix`**:
   - Implements the exact remediation proposed in the assessment.
   - Records every modified file, function, and behavioral change in a transparent audit log.
3. **`/speckit-bug-test`**:
   - Runs automated regression test suites and manual reproduction checks.
   - Formally certifies that the bug is resolved, zero regressions were introduced, and generates a verification report.
