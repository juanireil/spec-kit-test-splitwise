# Tasks: Iteration 01 (MVP) - Expense Entry & Live Balance Sheet

**Input**: Design artifacts from `specs/001-expense-entry-live-balances/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/openapi.json`, `research.md`, `quickstart.md`)
**Constitution Compliance**: Enforces Monorepo layout (`/backend`, `/frontend`), strict typing (Pydantic), in-memory state, and 100% path coverage for core balance math.

---

## Phase 1: Setup (Monorepo & Environment Initialization)

**Purpose**: Initialize the repository layout, backend Python project, and frontend Vite React application.

- [ ] T001 Create monorepo directory skeleton (`backend/`, `frontend/`, `backend/src/`, `backend/tests/`, `frontend/src/`)
- [ ] T002 Initialize backend project configuration with dependencies in `backend/pyproject.toml` and `backend/requirements.txt` (`fastapi`, `uvicorn`, `pydantic`, `pytest`, `pytest-cov`, `httpx`)
- [ ] T003 Initialize frontend project with Vite, React, and Tailwind CSS in `frontend/package.json`, `frontend/vite.config.js`, `frontend/tailwind.config.js`, `frontend/postcss.config.js`, and `frontend/index.html`

---

## Phase 2: Foundational (Core In-Memory Store & Schemas)

**Purpose**: Core domain schemas and in-memory persistence repository required by all user stories.

- [ ] T004 [P] Implement `Member` and `MemberBalance` Pydantic models in `backend/src/models/member.py`
- [ ] T005 [P] Implement `ExpenseCreate` and `Expense` Pydantic models with validation in `backend/src/models/expense.py`
- [ ] T006 Implement thread-safe `InMemoryExpenseRepository` seeded with default demo members (Alice, Bob, Charlie, David) in `backend/src/repositories/expense_repository.py`
- [ ] T007 Setup FastAPI application entrypoint with CORS middleware and API router inclusion in `backend/src/main.py`
- [ ] T008 [P] Setup frontend styling, global styles, and base CSS variables in `frontend/src/index.css`
- [ ] T009 [P] Implement API client service helper for HTTP requests in `frontend/src/services/api.js`

---

## Phase 3: User Story 1 - Record a Shared Equal Expense and View Updated Live Balances (Priority: P1) 🎯 MVP

**Goal**: Users can enter and submit a shared equal expense (Amount, Payer, Participants) and backend computes exact balances (including fractional cent remainders) while enforcing the zero-sum invariant.

**Independent Test**: Record an expense of $90 paid by Alice for Alice, Bob, and Charlie. Verify backend and frontend reflect Alice: +$60.00, Bob: -$30.00, Charlie: -$30.00, David: $0.00.

### Tests for User Story 1 (Constitution Principle IV: 100% Path Coverage)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Write unit tests with 100% path coverage for equal splits, fractional cent distribution, and zero-sum invariant in `backend/tests/test_balance_service.py`
- [ ] T011 [P] [US1] Write API integration tests for `POST /api/expenses` and `GET /api/members` in `backend/tests/test_api.py`

### Implementation for User Story 1

- [ ] T012 [US1] Implement `BalanceService` with pure fractional cent splitting and balance computation logic in `backend/src/services/balance_service.py` (satisfies T010)
- [ ] T013 [US1] Implement REST API endpoints `GET /api/members`, `POST /api/expenses`, and `GET /api/expenses` in `backend/src/api/routes.py`
- [ ] T014 [US1] Build `ExpenseForm` React component with amount input, payer dropdown, participant checkboxes, and validation in `frontend/src/components/ExpenseForm.jsx`
- [ ] T015 [US1] Build `ExpenseList` React component displaying recently recorded transactions in `frontend/src/components/ExpenseList.jsx`

**Checkpoint**: At this point, expenses can be submitted via API and UI, validated, persisted in-memory, and calculated with 100% test coverage.

---

## Phase 4: User Story 2 - Real-Time Dashboard Balance Sheet & Status Visualization (Priority: P2)

**Goal**: Display a live visual balance sheet showing all group members with color-coded status badges ("Owed", "Owes", "Settled") updating immediately after new expenses are recorded.

**Independent Test**: Load the dashboard, verify all initial members show $0.00 "Settled", record an expense, and verify the balance cards immediately update to reflect positive/negative amounts with proper visual hierarchy.

### Tests for User Story 2

- [ ] T016 [P] [US2] Write API integration tests for `GET /api/balances` and balance sheet response formatting in `backend/tests/test_api.py`

### Implementation for User Story 2

- [ ] T017 [US2] Implement `GET /api/balances` endpoint returning `BalanceSheetResponse` in `backend/src/api/routes.py`
- [ ] T018 [P] [US2] Build `BalanceCard` React component with color-coded status badges (green for owed, rose for owes, slate for settled) in `frontend/src/components/BalanceCard.jsx`
- [ ] T019 [US2] Build `BalanceGrid` React component to render grid of member balances and total group expenses in `frontend/src/components/BalanceGrid.jsx`
- [ ] T020 [P] [US2] Build `Header` React component with app branding and summary stats in `frontend/src/components/Header.jsx`
- [ ] T021 [US2] Assemble main application layout and live state refresh flow in `frontend/src/App.jsx` and `frontend/src/main.jsx`

**Checkpoint**: Full end-to-end MVP complete. Adding an expense immediately updates live balance cards and transaction history.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verification, end-to-end walkthroughs, test coverage validation, and documentation.

- [ ] T022 [P] Verify 100% path coverage on backend balance calculations using `pytest --cov=src --cov-report=term-missing`
- [ ] T023 Run end-to-end verification walkthrough following `specs/001-expense-entry-live-balances/quickstart.md`
- [ ] T024 [P] Update root `README.md` with project setup instructions, architecture overview, and run commands

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: T001 → T002, T003 (Can run in parallel after T001)
2. **Foundational (Phase 2)**: Depends on Phase 1 (T004, T005, T008, T009 can run in parallel; T006 and T007 complete backend foundation)
3. **User Story 1 (Phase 3)**: Depends on Phase 2 (T010, T011 test writing first → T012 service → T013 routes → T014, T015 UI)
4. **User Story 2 (Phase 4)**: Depends on Phase 3 (T016 tests → T017 endpoint → T018, T019, T020 components → T021 integration)
5. **Polish (Phase 5)**: Depends on Phase 4 completion (T022, T023, T024)

### Parallel Opportunities

- **Phase 1**: `T002` (Backend init) and `T003` (Frontend init) can run in parallel.
- **Phase 2**: `T004` (Member models), `T005` (Expense models), `T008` (CSS), and `T009` (API client) can run in parallel.
- **Phase 3**: `T010` (Unit tests) and `T011` (Integration tests) can be drafted in parallel before `T012`.
- **Phase 4**: `T018` (`BalanceCard`) and `T020` (`Header`) can be developed in parallel.

---

## Implementation Strategy

### MVP Delivery (User Story 1 + User Story 2)
1. Complete **Phase 1** & **Phase 2** (Repository foundation and in-memory store).
2. Implement **User Story 1** (TDD tests in `test_balance_service.py` first with 100% coverage, then business service, API routes, and Expense form).
3. Implement **User Story 2** (Balance sheet endpoint, balance cards, and live state update orchestration in `App.jsx`).
4. Validate with **Phase 5** quickstart scenario walkthrough and automated coverage report.
