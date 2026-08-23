# Implementation Plan: Iteration 01 (MVP) - Expense Entry & Live Balance Sheet

**Branch**: `001-expense-entry-live-balances` | **Date**: 2026-08-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-expense-entry-live-balances/spec.md`

## Summary

Build the MVP of SplitWise Lite enabling users to record shared expenses (Amount, Payer, Participants) split equally, with immediate calculation and live rendering of each group member's net financial balance. The architecture is a clean monorepo with a FastAPI backend (`/backend`) using an in-memory repository for zero-setup demo friction, and a React + Vite + Tailwind CSS frontend (`/frontend`).

## Technical Context

**Language/Version**: Python 3.10+ (Backend), JavaScript/TypeScript with React 18+ (Frontend)

**Primary Dependencies**:
- Backend: `fastapi`, `uvicorn`, `pydantic`, `pytest`, `pytest-cov`, `httpx` (for TestClient)
- Frontend: `react`, `react-dom`, `vite`, `tailwindcss`, `lucide-react` (icons)

**Storage**: Thread-safe in-memory store (`InMemoryExpenseRepository`) initialized with default demo members (Alice, Bob, Charlie, David).

**Testing**: `pytest` for backend unit/integration tests with 100% path coverage on balance math. Vitest / React Testing Library or verification walkthrough for frontend.

**Target Platform**: Web (Modern desktop & mobile browsers), local development environment.

**Project Type**: Monorepo Web Application (FastAPI backend + React SPA frontend).

**Performance Goals**: Live balance updates rendered within <200ms of expense submission; zero lag on balance calculations.

**Constraints**: Zero-setup demo friction (no database configuration required). Strict decimal math to eliminate floating-point rounding errors and preserve zero-sum group balance invariant.

**Scale/Scope**: Iteration 01 MVP focused solely on Expense Creation + Live Balance Sheet. (No auth, no settlements, no unequal splits, no persistent DB).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Monorepo & Separation)**: Project is cleanly structured into `/backend` and `/frontend`.
- [x] **Principle II (Modular Architecture & Strict Typing)**: Backend uses Pydantic schemas for data validation and clear service/repository layers. Frontend follows modular component architecture.
- [x] **Principle III (Zero-Setup Friction via In-Memory Persistence)**: Uses in-memory state repository, zero DB setup required.
- [x] **Principle IV (Comprehensive Testing & 100% Coverage on Core Math)**: Balance calculation service (`balance_service.py`) designed with exhaustive `pytest` suite testing all split scenarios and fractional cents.
- [x] **Principle V (Spec-Driven Development & Git Lifecycle)**: Implementation plan directly mirrors `spec.md` requirements and prepares structured tasks for `tasks.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-entry-live-balances/
├── plan.md              # This implementation plan
├── research.md          # Technical research & decisions
├── data-model.md        # Pydantic schemas & entity definitions
├── quickstart.md        # Validation guide and test walkthrough
├── contracts/
│   └── openapi.json     # OpenAPI 3.1 REST API specification
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Source Code (repository root)

```text
backend/
├── pyproject.toml
├── requirements.txt
├── src/
│   ├── __init__.py
│   ├── main.py                    # FastAPI entrypoint, CORS & route registration
│   ├── models/
│   │   ├── __init__.py
│   │   ├── member.py              # Member & MemberBalance Pydantic models
│   │   └── expense.py             # Expense & ExpenseCreate Pydantic models
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── expense_repository.py  # Thread-safe in-memory store
│   ├── services/
│   │   ├── __init__.py
│   │   └── balance_service.py     # Pure business logic for equal splits & balances
│   └── api/
│       ├── __init__.py
│       └── routes.py              # Endpoints: GET /members, POST /expenses, GET /balances
└── tests/
    ├── __init__.py
    ├── test_balance_service.py    # 100% coverage unit tests for balance & split math
    └── test_api.py                # Integration tests for FastAPI endpoints

frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── services/
    │   └── api.js                 # API fetch client (getMembers, createExpense, getBalances)
    └── components/
        ├── Header.jsx             # App branding & summary stats
        ├── ExpenseForm.jsx        # Payer selection, amount input, participant toggles
        ├── BalanceGrid.jsx        # Grid displaying MemberBalance cards
        ├── BalanceCard.jsx        # Individual member balance card (status badge, amount)
        └── ExpenseList.jsx        # List of recently recorded transactions
```

**Structure Decision**: Clean Monorepo Web Application. Backend and frontend reside in dedicated top-level directories with independent runtimes, dependency specifications, and test setups.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None*    | N/A        | Architecture is strictly minimal and fully complies with Constitution |
