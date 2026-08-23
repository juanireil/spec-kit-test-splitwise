# Tasks: Iteration 01 (MVP) - Expense Entry & Live Balance Sheet

**Input**: Design artifacts from `specs/001-expense-entry-live-balances/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/openapi.json`, `research.md`, `quickstart.md`)
**Constitution Compliance**: Enforces Monorepo layout (`/backend`, `/frontend`), strict typing (Pydantic), in-memory state, and 100% path coverage for core balance math.

---

## Phase 1: Setup (Monorepo & Environment Initialization)

**Purpose**: Initialize the repository layout, backend Python project, and frontend Vite React application.

- [x] T001 Create monorepo directory skeleton (`backend/`, `frontend/`, `backend/src/`, `backend/tests/`, `frontend/src/`)
- [x] T002 Initialize backend project configuration with dependencies in `backend/pyproject.toml` and `backend/requirements.txt` (`fastapi`, `uvicorn`, `pydantic`, `pytest`, `pytest-cov`, `httpx`)
- [x] T003 Initialize frontend project with Vite, React, and Tailwind CSS in `frontend/package.json`, `frontend/vite.config.js`, `frontend/tailwind.config.js`, `frontend/postcss.config.js`, and `frontend/index.html`

---

## Phase 2: Foundational (Core In-Memory Store & Schemas)

**Purpose**: Core domain schemas and in-memory persistence repository required by all user stories.

- [x] T004 [P] Implement `Member` and `MemberBalance` Pydantic models in `backend/src/models/member.py`
- [x] T005 [P] Implement `ExpenseCreate` and `Expense` Pydantic models with validation in `backend/src/models/expense.py`
- [x] T006 Implement thread-safe `InMemoryExpenseRepository` seeded with default demo members (Alice, Bob, Charlie, David) in `backend/src/repositories/expense_repository.py`
- [x] T007 Setup FastAPI application entrypoint with CORS middleware and API router inclusion in `backend/src/main.py`
- [x] T008 [P] Setup frontend styling, global styles, and base CSS variables in `frontend/src/index.css`
- [x] T009 [P] Implement API client service helper for HTTP requests in `frontend/src/services/api.js`

---

## Phase 3: User Story 1 - Record a Shared Equal Expense and View Updated Live Balances (Priority: P1) 🎯 MVP

**Goal**: Users can enter and submit a shared equal expense (Amount, Payer, Participants) and backend computes exact balances (including fractional cent remainders) while enforcing the zero-sum invariant.

**Independent Test**: Record an expense of $90 paid by Alice for Alice, Bob, and Charlie. Verify backend and frontend reflect Alice: +$60.00, Bob: -$30.00, Charlie: -$30.00, David: $0.00.

### Tests for User Story 1 (Constitution Principle IV: 100% Path Coverage)

- [x] T010 [P] [US1] Write unit tests with 100% path coverage for equal splits, fractional cent distribution, and zero-sum invariant in `backend/tests/test_balance_service.py`
- [x] T011 [P] [US1] Write API integration tests for `POST /api/expenses` and `GET /api/members` in `backend/tests/test_api.py`

### Implementation for User Story 1

- [x] T012 [US1] Implement `BalanceService` with pure fractional cent splitting and balance computation logic in `backend/src/services/balance_service.py` (satisfies T010)
- [x] T013 [US1] Implement REST API endpoints `GET /api/members`, `POST /api/expenses`, and `GET /api/expenses` in `backend/src/api/routes.py`
- [x] T014 [US1] Build `ExpenseForm` React component with amount input, payer dropdown, participant checkboxes, and validation in `frontend/src/components/ExpenseForm.jsx`
- [x] T015 [US1] Build `ExpenseList` React component displaying recently recorded transactions in `frontend/src/components/ExpenseList.jsx`

**Checkpoint**: At this point, expenses can be submitted via API and UI, validated, persisted in-memory, and calculated with 100% test coverage.

---

## Phase 4: User Story 2 - Real-Time Dashboard Balance Sheet & Status Visualization (Priority: P2)

**Goal**: Display a live visual balance sheet showing all group members with color-coded status badges ("Owed", "Owes", "Settled") updating immediately after new expenses are recorded.

**Independent Test**: Load the dashboard, verify all initial members show $0.00 "Settled", record an expense, and verify the balance cards immediately update to reflect positive/negative amounts with proper visual hierarchy.

### Tests for User Story 2

- [x] T016 [P] [US2] Write API integration tests for `GET /api/balances` and balance sheet response formatting in `backend/tests/test_api.py`

### Implementation for User Story 2

- [x] T017 [US2] Implement `GET /api/balances` endpoint returning `BalanceSheetResponse` in `backend/src/api/routes.py`
- [x] T018 [P] [US2] Build `BalanceCard` React component with color-coded status badges (green for owed, rose for owes, slate for settled) in `frontend/src/components/BalanceCard.jsx`
- [x] T019 [US2] Build `BalanceGrid` React component to render grid of member balances and total group expenses in `frontend/src/components/BalanceGrid.jsx`
- [x] T020 [P] [US2] Build `Header` React component with app branding and summary stats in `frontend/src/components/Header.jsx`
- [x] T021 [US2] Assemble main application layout and live state refresh flow in `frontend/src/App.jsx` and `frontend/src/main.jsx`

**Checkpoint**: Full end-to-end MVP complete. Adding an expense immediately updates live balance cards and transaction history.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verification, end-to-end walkthroughs, test coverage validation, and documentation.

- [x] T022 [P] Verify 100% path coverage on backend balance calculations using `pytest --cov=src --cov-report=term-missing`
- [x] T023 Run end-to-end verification walkthrough following `specs/001-expense-entry-live-balances/quickstart.md`
- [x] T024 [P] Update root `README.md` with project setup instructions, architecture overview, and run commands
