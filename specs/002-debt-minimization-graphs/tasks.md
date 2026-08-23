# Tasks: Iteration 02 - Debt Minimization Engine & Visual Graphs

**Input**: Design artifacts from `specs/002-debt-minimization-graphs/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/openapi.json`, `research.md`, `quickstart.md`)
**Constitution Compliance**: Enforces Monorepo layout, Pydantic typing, in-memory models, 100% path coverage on debt minimization math, single-story branch/PR delivery, and atomic 1:1 commits per task.

---

## Phase 1: Setup & Foundational Schemas

**Purpose**: Core settlement domain models and client API integration for settlement data.

- [x] T001 [P] Implement `SettlementTransaction` and `SettlementPlanResponse` Pydantic models in `backend/src/models/settlement.py`
- [x] T002 [P] Add `fetchSettlements` API helper method in `frontend/src/services/api.js`

---

## Phase 2: User Story 1 - Compute and View Recommended Minimized Payments (Priority: P1) 🎯 MVP

**Goal**: Transform current member balances into the minimal set of direct payment recommendations with exact balance conservation and zero drift.

**Independent Test**: Load a balance state with Alice (+$60.00), Bob (-$15.00), Charlie (-$45.00). Verify the endpoint and UI recommend exactly `Bob -> Alice: $15.00` and `Charlie -> Alice: $45.00`.

### Tests for User Story 1 (Constitution Principle IV: 100% Path Coverage)

- [x] T003 [P] [US1] Write unit tests with 100% path coverage for greedy debt minimization in `backend/tests/test_debt_service.py`
- [x] T004 [P] [US1] Write API integration tests for `GET /api/settlements` in `backend/tests/test_settlement_api.py`

### Implementation for User Story 1

- [x] T005 [US1] Implement `DebtSimplificationService` with greedy debtor-creditor matching algorithm in `backend/src/services/debt_service.py` (satisfies T003)
- [x] T006 [US1] Implement REST API endpoint `GET /api/settlements` in `backend/src/api/routes.py`
- [x] T007 [US1] Build `SettlementList` React component displaying recommended payment cards with badges and settled empty states in `frontend/src/components/SettlementList.jsx`

**Checkpoint**: At this point, minimal debt settlements are computed with 100% test coverage and rendered as recommended transactions.

---

## Phase 3: User Story 2 - Interactive Visual Transaction Graph (Priority: P2)

**Goal**: Render an interactive directed node-link graph showing members as nodes and minimized settlement payments as directed arrows with amount labels.

**Independent Test**: Render graph with active debts, verify directed arrows point from Payer to Recipient with exact dollar badges, and verify 0 edges when group is settled.

### Implementation for User Story 2

- [ ] T008 [P] [US2] Build `SettlementGraph` SVG-based component with circular node layout, directed arrows, and amount badges in `frontend/src/components/SettlementGraph.jsx`
- [ ] T009 [US2] Integrate `SettlementList` and `SettlementGraph` into main dashboard layout with automatic refresh on expense addition in `frontend/src/App.jsx`

**Checkpoint**: All user stories complete. Debt minimization recommendations and visual directed graphs update live with expenses.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: 100% test coverage verification and documentation updates.

- [ ] T010 [P] Verify 100% path coverage across all backend services using `pytest --cov=backend/src --cov-report=term-missing`
- [ ] T011 Run end-to-end verification walkthrough following `specs/002-debt-minimization-graphs/quickstart.md`
- [ ] T012 [P] Update `README.md` with Iteration 02 debt minimization and visual graph capabilities
