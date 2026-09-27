# Implementation Plan: Iteration 03 - Unequal / Custom Expense Splits

**Branch**: `003-test-unequal-splits` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-test-unequal-splits/spec.md`

## Summary

Extend SplitWise Lite to support three expense split modes: **Equal**, **Exact Amounts** ($), and **Percentages** (%). The design strictly enforces penny conservation ($\sum \text{Shares} \equiv \text{Total Amount}$) using deterministic fractional-cent remainder distribution (Largest Remainder Method) on the backend and provides instant real-time validation and balance remaining indicators in the React frontend.

## Technical Context

**Language/Version**: Python 3.10+ (Backend), React 18+ (Frontend)

**Primary Dependencies**:
- Backend: `fastapi`, `uvicorn`, `pydantic`, `pytest`, `pytest-cov`, `httpx`
- Frontend: `react`, `react-dom`, `vite`, `tailwindcss`, `lucide-react`

**Storage**: Thread-safe in-memory store (`InMemoryExpenseRepository`), extended with `shares: dict[str, Decimal]` on persisted `Expense` entities.

**Testing**: `pytest` for backend unit/integration tests with 100% path coverage on split algorithms, rounding invariants, and validation errors.

**Target Platform**: Web (Desktop & Mobile responsive browsers).

**Performance Goals**: Live split recalculations in UI < 16ms (60 FPS feedback); API response < 50ms.

**Constraints**:
- Exact monetary precision via `decimal.Decimal` and integer cent arithmetic.
- Zero floating-point drift.
- Backward compatibility with legacy equal-split expenses.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Monorepo & Separation)**: Backend logic in `/backend`, UI in `/frontend`.
- [x] **Principle II (Modular Architecture & Strict Typing)**: Pydantic schemas enforce type safety and invariant validation (`ExpenseCreate`, `SplitShareInput`).
- [x] **Principle III (Zero-Setup Friction via In-Memory Persistence)**: In-memory store updated cleanly without database requirements.
- [x] **Principle IV (Comprehensive Testing & 100% Coverage on Core Math)**: Exhaustive unit test plan testing equal, exact, percentage, fractional cent edge cases, and negative value rejections.
- [x] **Principle V (Spec-Driven Development & Git Lifecycle)**: Spec, research, data model, contracts, quickstart, and tasks systematically maintained.
- [x] **Principle VII (Domain Conservation Invariants)**: Penny conservation invariant ($\sum \text{Shares} \equiv \text{Total}$) and zero-sum balance invariant ($\sum \text{Balances} = \$0.00$) formally guaranteed.

## Project Structure

### Documentation (this feature)

```text
specs/003-test-unequal-splits/
├── plan.md              # This implementation plan
├── research.md          # Technical research & decision log
├── data-model.md        # Pydantic schemas & entity definitions
├── quickstart.md        # Validation guide and test walkthrough
├── contracts/
│   └── openapi.json     # OpenAPI 3.1 REST API specification
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Planned Source Changes

```text
backend/
├── src/
│   ├── models/
│   │   └── expense.py             # Add SplitMode enum, SplitShareInput, update Expense & ExpenseCreate
│   ├── services/
│   │   └── balance_service.py     # Add split_amount_exact, split_amount_percentages with deterministic remainder
│   ├── repositories/
│   │   └── expense_repository.py  # Persist calculated shares and split_mode
│   └── api/
│       └── routes.py              # Validate split logic on POST /expenses
└── tests/
    ├── test_balance_service.py    # Unit tests for equal, exact, percentage splits & invariant checks
    └── test_api.py                # API validation tests for custom split payloads

frontend/
└── src/
    ├── services/
    │   └── api.js                 # Support split_mode and custom_splits payload
    └── components/
        └── ExpenseForm.jsx        # Split mode tabs, custom share rows, real-time unallocated feedback
```

## Architecture & Calculation Flow

```text
User Input (Amount, Mode, Shares)
          │
          ▼
Frontend Instant Validation (Remaining Balance Indicator)
          │
          ▼  POST /expenses (ExpenseCreate)
Backend Pydantic & Route Validation
          │
          ├── Mode == EQUAL       ──► split_amount_equally()
          ├── Mode == EXACT       ──► split_amount_exact() (Validates Sum == Amount)
          └── Mode == PERCENTAGE  ──► split_amount_percentages() (Hamilton Largest Remainder)
          │
          ▼
Persist Expense with Calculated `shares: dict[str, Decimal]`
          │
          ▼
`BalanceService.calculate_balances` (Iterates over `expense.shares`)
          │
          ▼
Zero-Sum Balance Sheet ($\sum \text{Balances} = \$0.00$) & Minimized Debt Graph
```
