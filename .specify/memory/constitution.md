<!--
Sync Impact Report:
- Version change: 1.1.0 -> 1.2.0 (Minor Bump: Project Management Governance, DoR/DoD, Scope Guardrails & Bidirectional Traceability)
- List of modified principles:
  - PRINCIPLE_5: "V. Spec-Driven Development, Incremental Delivery & Git Lifecycle" (Expanded with DoR/DoD and Traceability Matrix rules)
- Added principles:
  - PRINCIPLE_6: "VI. Scope Boundary Control & Anti-Gold-Plating"
  - PRINCIPLE_7: "VII. Non-Functional Requirements (NFR) & Domain Conservation Invariants"
- Added sections:
  - Definition of Ready (DoR) and Definition of Done (DoD) under Quality Gates
- Removed sections:
  - None
- Follow-up TODOs:
  - None
-->

# SplitWise Lite Constitution (Project Management Edition)

## Core Principles

### I. Monorepo & Clear Separation of Concerns
The repository MUST be organized as a clean monorepo containing a FastAPI backend under `/backend` and a React + Vite + Tailwind CSS frontend under `/frontend`. Each subsystem MUST maintain a distinct boundary, clear build tooling, and isolated dependencies.

### II. Modular Architecture & Strict Typing
- Backend code MUST be modular, clean, and strictly type-hinted using Pydantic models for validation, request/response serialization, and internal business logic transfer.
- Frontend code MUST follow component-driven development practices in React, emphasizing single-responsibility components and clear presentation/container separation.

### III. Zero-Setup Friction via In-Memory Persistence
State management across the application MUST utilize in-memory stores to eliminate external database setup requirements and ensure seamless demo, testing, and evaluation friction. Data structures and service interfaces MUST remain decoupled to allow straightforward persistence swapping if needed in future iterations.

### IV. Comprehensive Testing & 100% Path Coverage on Core Math (NON-NEGOTIABLE)
Every business logic endpoint—specifically calculations involving balances, settlements, splits, and debt math—MUST have exhaustive unit tests written with `pytest`. Tests MUST achieve 100% path coverage for edge cases, fractional rounding, empty groups, and complex circular debts.

### V. Spec-Driven Development, Incremental Delivery & Traceability
- **Single-Story Scope Constraint**: Agents MUST NOT implement an entire multi-story feature in a single pass. Implementation MUST proceed incrementally, delivering exactly **one User Story (or phase)** at a time.
- **Dedicated Story Branching**: Each User Story / phase MUST be implemented on its own dedicated branch adhering to the convention `feature/issue-<ID>-<name>` or `feature/<phase-or-story-name>`.
- **Atomic Commits per Task**: Implementation MUST maintain a 1:1 ratio of commit to task (`- [ ] T###`), creating an atomic commit for each task as it is completed.
- **Bidirectional Requirements Traceability Matrix (RTM)**: Every commit and PR MUST explicitly reference its corresponding Task ID (`T###`) and GitHub Issue ID (`closes #<ID>`). Unmapped or untracked changes are strictly forbidden.
- **PR Gate per Increment**: Once all tasks for the current User Story or phase are complete and locally verified, the branch MUST be pushed to the remote and a Pull Request opened before any subsequent User Story or phase may begin.

### VI. Scope Boundary Control & Anti-Gold-Plating
- **Strict MVP Boundaries**: Developers and AI agents MUST strictly adhere to the `MVP Boundaries` defined in `spec.md`.
- **No Hallucinated Scope**: Unapproved additions (e.g. unsolicited authentication, persistent databases, caching layers, themes, or unrequested optimizations) are considered Project Management Violations and MUST NOT be introduced without formal specification approval.

### VII. Non-Functional Requirements (NFR) & Domain Conservation Invariants
- **Conservation of Money**: The sum of all member balances MUST ALWAYS equal `$0.00` ($\sum \text{Balances} = 0$).
- **Penny Conservation**: The sum of split shares MUST exactly equal the original expense amount ($\sum \text{Shares} = \text{Amount}$).
- **Settlement Invariant**: The total value of recommended settlements MUST exactly equal total outstanding group debts ($\sum \text{Payments} = \sum \text{Debts}$) with zero self-payments (`Payer != Recipient`).

---

## Project Management Gates: DoR & DoD

### Definition of Ready (DoR)
A User Story / Phase is **READY** for implementation ONLY when:
1. `spec.md` is complete with prioritized user stories, acceptance scenarios, and edge cases.
2. `plan.md`, `data-model.md`, and OpenAPI contracts are defined and verified.
3. Spec quality checklist (`checklists/requirements.md`) passes with 0 unchecked items.
4. `tasks.md` contains atomic, dependency-ordered tasks with clear file paths.
5. GitHub Issues are created and linked to each task.
6. `/speckit-analyze` confirms 100% requirements-to-tasks coverage with 0 orphan requirements.

### Definition of Done (DoD)
A User Story / Phase is **DONE** ONLY when:
1. 100% of tasks in the story phase are implemented and checked `[x]` in `tasks.md`.
2. Automated test suite passes with **100% path coverage** on all business logic.
3. Production build (`npm run build`) compiles cleanly without warnings or errors.
4. All tasks have atomic commits pushed to the dedicated story branch.
5. A Pull Request is opened with clear summary descriptions and `closes #<ID>` issue links.
6. Local application runs cleanly and passes manual scenario walkthrough.

---

## Technology Stack & Architectural Constraints
- **Backend**: Python 3.10+, FastAPI, Pydantic, pytest.
- **Frontend**: React (TypeScript/JavaScript), Vite, Tailwind CSS.
- **Data Persistence**: In-memory data store for zero-setup execution.
- **Interface Protocol**: REST API communicating via JSON payloads.

---

## Governance
- This constitution supersedes all ad-hoc conventions and undocumented practices.
- Any amendment or relaxation of these principles requires documentation, a version bump according to semantic versioning rules, and unanimous stakeholder approval.
- All PRs, automated agent implementations, and code reviews MUST verify compliance against this document before merging.

**Version**: 1.2.0 | **Ratified**: 2026-08-23 | **Last Amended**: 2026-08-23
