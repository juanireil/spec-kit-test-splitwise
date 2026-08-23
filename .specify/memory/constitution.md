<!--
Sync Impact Report:
- Version change: 1.0.0 -> 1.1.0 (Minor Bump: Incremental Story/Phase Implementation Rules)
- List of modified principles:
  - PRINCIPLE_5: "V. Spec-Driven Development, Incremental Delivery & Git Lifecycle" (Expanded with single-story limit, atomic per-task commits, and branch-per-story/phase PR delivery rules)
- Added sections:
  - None
- Removed sections:
  - None
- Follow-up TODOs:
  - None
-->

# SplitWise Lite Constitution

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

### V. Spec-Driven Development, Incremental Delivery & Git Lifecycle
- **Single-Story Scope Constraint**: Agents MUST NOT implement an entire multi-story feature in a single pass. Implementation MUST proceed incrementally, delivering exactly **one User Story (or phase)** at a time.
- **Dedicated Story Branching**: Each User Story / phase MUST be implemented on its own dedicated branch adhering to the convention `feature/issue-<ID>-<name>` or `feature/<phase-or-story-name>`.
- **Atomic Commits per Task**: Implementation MUST maintain a 1:1 ratio of commit to task (`- [ ] T###`), creating an atomic commit for each task as it is completed.
- **PR Gate per Increment**: Once all tasks for the current User Story or phase are complete and locally verified, the branch MUST be pushed to the remote and a Pull Request opened with issue tracking links (`closes #<ID>`) before any subsequent User Story or phase may begin.
- **Verification Gate**: All local unit and integration tests MUST pass cleanly before each task commit and branch push.

## Technology Stack & Architectural Constraints
- **Backend**: Python 3.10+, FastAPI, Pydantic, pytest.
- **Frontend**: React (TypeScript/JavaScript), Vite, Tailwind CSS.
- **Data Persistence**: In-memory data store for zero-setup execution.
- **Interface Protocol**: REST API communicating via JSON payloads.

## Development Workflow & Quality Gates
1. **Spec Alignment**: Features start from structured specification and tasks defined under `.specify/`.
2. **Incremental Scope Gate**: Never implement beyond the active User Story / Phase.
3. **Atomic Task Commits**: Commit each completed task individually with descriptive messages and issue references.
4. **Implementation Gate**: No implementation code without corresponding verification tests.
5. **Verification Gate**: 100% path coverage on balance/debt logic verified via `pytest`.
6. **PR & Review Gate**: Push branch and create a Pull Request for the completed User Story before moving to the next.

## Governance
- This constitution supersedes all ad-hoc conventions and undocumented practices.
- Any amendment or relaxation of these principles requires documentation, a version bump according to semantic versioning rules, and unanimous stakeholder approval.
- All PRs, automated agent implementations, and code reviews MUST verify compliance against this document before merging.

**Version**: 1.1.0 | **Ratified**: 2026-08-23 | **Last Amended**: 2026-08-23
