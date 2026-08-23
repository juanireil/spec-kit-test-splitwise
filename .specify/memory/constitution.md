<!--
Sync Impact Report:
- Version change: 0.0.0 (Unratified Template) -> 1.0.0 (Initial Ratification)
- List of modified principles:
  - PRINCIPLE_1: "I. Monorepo & Clear Separation of Concerns" (Added)
  - PRINCIPLE_2: "II. Modular Architecture & Strict Typing" (Added)
  - PRINCIPLE_3: "III. Zero-Setup Friction via In-Memory Persistence" (Added)
  - PRINCIPLE_4: "IV. Comprehensive Testing & 100% Path Coverage on Core Math (NON-NEGOTIABLE)" (Added)
  - PRINCIPLE_5: "V. Spec-Driven Development & Git Lifecycle" (Added)
- Added sections:
  - Technology Stack & Architectural Constraints
  - Development Workflow & Quality Gates
  - Governance
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

### V. Spec-Driven Development & Git Lifecycle
- Agents and contributors MUST implement features strictly against the specifications and tasks defined in `tasks.md`.
- All local tests MUST pass cleanly before code is committed or pushed.
- Git branch naming MUST strictly follow the convention `feature/issue-<ID>-<name>`.
- Commit messages and pull requests MUST explicitly reference their tracking issue using GitHub keywords (e.g., `closes #<ID>`).

## Technology Stack & Architectural Constraints
- **Backend**: Python 3.10+, FastAPI, Pydantic, pytest.
- **Frontend**: React (TypeScript/JavaScript), Vite, Tailwind CSS.
- **Data Persistence**: In-memory data store for zero-setup execution.
- **Interface Protocol**: REST API communicating via JSON payloads.

## Development Workflow & Quality Gates
1. **Spec Alignment**: Features start from structured specification and tasks defined under `.specify/`.
2. **Implementation Gate**: No implementation code without corresponding verification tests.
3. **Verification Gate**: 100% path coverage on balance/debt logic verified via `pytest`.
4. **Git Delivery**: Branch naming (`feature/issue-<ID>-<name>`) and automated issue closing commits (`closes #<ID>`).

## Governance
- This constitution supersedes all ad-hoc conventions and undocumented practices.
- Any amendment or relaxation of these principles requires documentation, a version bump according to semantic versioning rules, and unanimous stakeholder approval.
- All PRs, automated agent implementations, and code reviews MUST verify compliance against this document before merging.

**Version**: 1.0.0 | **Ratified**: 2026-08-23 | **Last Amended**: 2026-08-23
