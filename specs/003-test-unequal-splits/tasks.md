# Tasks: Iteration 03 - Unequal / Custom Expense Splits

**Input**: Design artifacts from `specs/003-test-unequal-splits/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/openapi.json`, `research.md`, `quickstart.md`)
**Constitution Compliance**: Enforces Monorepo layout (`/backend`, `/frontend`), strict typing (Pydantic), in-memory persistence, and 100% path coverage for core balance math.

---

## Phase 1: Setup (Environment & Baseline Verification)

**Purpose**: Verify the active monorepo environment, dependencies, and test baseline before implementing custom splits.

- [x] T001 Verify backend and frontend development environments and test suite baseline in `backend/tests/`

---

## Phase 2: Foundational (Core In-Memory Store & Schemas)

**Purpose**: Core domain schemas and repository extensions required by all user stories.

- [ ] T002 [P] Extend `SplitMode` enum, `SplitShareInput`, `ExpenseCreate`, and `Expense` models with `shares: dict[str, Decimal]` in `backend/src/models/expense.py`
- [ ] T003 Update `InMemoryExpenseRepository.add_expense` to persist `split_mode` and calculated `shares` in `backend/src/repositories/expense_repository.py`
- [ ] T004 [P] Update API client in `frontend/src/services/api.js` to support `split_mode` and `custom_splits` payloads

---

## Phase 3: User Story 1 - Exact Monetary Amount Splits (Priority: P1) 🎯 MVP

**Goal**: Users can specify exact dollar amounts owed by each participant, with backend validation enforcing $\sum \text{Shares} \equiv \text{Expense Total}$ and live balances updating accordingly.

**Independent Test**: Record an expense of $100.00 paid by Alice with exact shares (Alice: $50.00, Bob: $30.00, Charlie: $20.00). Verify live balances reflect Alice: +$50.00, Bob: -$30.00, Charlie: -$20.00.

### Tests for User Story 1 (Constitution Principle IV: 100% Path Coverage)

- [ ] T005 [P] [US1] Write unit tests for `split_amount_exact` and penny conservation with exact dollar shares in `backend/tests/test_balance_service.py`
- [ ] T006 [P] [US1] Write API integration tests for `POST /api/expenses` with valid and invalid EXACT split modes in `backend/tests/test_api.py`

### Implementation for User Story 1

- [ ] T007 [US1] Implement `split_amount_exact` validation and calculation in `backend/src/services/balance_service.py`
- [ ] T008 [US1] Update `POST /api/expenses` endpoint in `backend/src/api/routes.py` to route and validate EXACT split requests
- [ ] T009 [US1] Update `BalanceService.calculate_balances` in `backend/src/services/balance_service.py` to calculate net balances using stored expense `shares`
- [ ] T010 [US1] Implement Exact Amounts split UI input rows and submission handling in `frontend/src/components/ExpenseForm.jsx`

**Checkpoint**: Exact amount splits can be submitted via API and UI, validated, persisted in-memory, and calculated with 100% test coverage.

---

## Phase 4: User Story 2 - Percentage-Based Splits with Deterministic Remainder (Priority: P2)

**Goal**: Users can specify percentage shares (summing to 100%) and the backend converts them into exact monetary shares using deterministic remainder distribution (Largest Remainder Method).

**Independent Test**: Record an expense of $100.00 with percentages 33.33%, 33.33%, 33.34%. Verify shares are allocated down to the exact cent ($33.33, $33.33, $33.34) preserving the penny conservation invariant.

### Tests for User Story 2

- [ ] T011 [P] [US2] Write unit tests for `split_amount_percentages` with Hamilton largest remainder distribution and odd cents in `backend/tests/test_balance_service.py`
- [ ] T012 [P] [US2] Write API integration tests for `POST /api/expenses` with valid (100%) and invalid percentages in `backend/tests/test_api.py`

### Implementation for User Story 2

- [ ] T013 [US2] Implement `split_amount_percentages` with deterministic Largest Remainder Method in `backend/src/services/balance_service.py`
- [ ] T014 [US2] Connect `POST /api/expenses` in `backend/src/api/routes.py` to handle and validate PERCENTAGE split requests
- [ ] T015 [US2] Implement Percentage split UI inputs and dynamic monetary share calculation in `frontend/src/components/ExpenseForm.jsx`

**Checkpoint**: Percentage splits are fully supported and independently testable.

---

## Phase 5: User Story 3 - Interactive Real-Time Split Validation & Mode Switching (Priority: P3)

**Goal**: Provide split mode selection tabs (Equal, Exact Amounts, Percentages) with live remaining unallocated amount/percentage feedback, invalid submission prevention, and detailed expense list breakdown.

**Independent Test**: Switch between modes in the UI, enter partial values, verify remaining indicator updates in real-time, and verify submission is disabled until split matches 100% / total amount.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Add split mode selector tabs (Equal, Exact Amounts, Percentages) in `frontend/src/components/ExpenseForm.jsx`
- [ ] T017 [US3] Implement real-time live balance remaining / over-allocated indicators and submission disable guardrails in `frontend/src/components/ExpenseForm.jsx`
- [ ] T018 [US3] Add split mode badge and individual participant share amounts breakdown in `frontend/src/components/ExpenseList.jsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification, linter compliance, build checks, and quickstart validation walkthrough.

- [ ] T019 Run full test suite with 100% path coverage check across all split algorithms via `backend/tests`
- [ ] T020 [P] Run frontend production build validation (`npm run build` in `frontend/`)
- [ ] T021 Execute end-to-end quickstart walkthrough scenarios from `specs/003-test-unequal-splits/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase - delivers working MVP
- **User Story 2 (Phase 4)**: Depends on Foundational phase & US1 service foundations
- **User Story 3 (Phase 5)**: Depends on US1/US2 UI components
- **Polish (Phase 6)**: Runs after all user stories are complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup & Baseline
2. Complete Phase 2: Foundational Schemas & Repository
3. Complete Phase 3: User Story 1 (Exact Amount Splits)
4. Validate User Story 1 independently against acceptance scenarios.

### Incremental Delivery
1. Add User Story 2 (Percentage Splits with Largest Remainder Method)
2. Add User Story 3 (Interactive UX tabs, live indicators, and breakdown display)
3. Execute Phase 6 Polish & Quickstart validation.
