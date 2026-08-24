# Spec-Driven Development (SDD) & Agentic Engineering Guide

This guide describes the complete end-to-end lifecycle for building software with AI coding agents using **Spec-Driven Development (SDD)**.

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
- **Teaching Point**: AI agents must adhere to strict governance (e.g. 100% path coverage on financial math, single-story branches) rather than making ad-hoc decisions.

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
