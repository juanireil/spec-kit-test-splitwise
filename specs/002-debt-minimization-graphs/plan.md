# Implementation Plan: Iteration 02 - Debt Minimization Engine & Visual Graphs

**Branch**: `feature/002-debt-minimization-graphs` | **Date**: 2026-08-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-debt-minimization-graphs/spec.md`

## Summary

Implement a debt minimization engine in the FastAPI backend that reduces net group balances to the absolute minimal set of settlement transactions (max $N-1$ payments) with exact penny conservation, and build an interactive visual directed graph in React + Tailwind CSS that renders the payment flows and node statuses.

## Technical Context

**Language/Version**: Python 3.10+ (Backend), React 18+ (Frontend)

**Primary Dependencies**:
- Backend: `fastapi`, `pydantic`, `pytest`, `pytest-cov`, `httpx`
- Frontend: `react`, `lucide-react`, `tailwindcss`, `vite`

**Storage**: Consumes in-memory `MemberBalance` models from `InMemoryExpenseRepository` and `BalanceService`.

**Testing**: `pytest` unit tests with 100% path coverage for greedy debtor-creditor simplification algorithms, partial settlements, multi-party cycles, and zero-debt states.

**Constraints**: Exact money conservation ($\sum \text{Payments} = \sum \text{Credits}$). Deterministic settlement output. Lightweight native SVG graph rendering with zero heavy external library bloat.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Monorepo & Separation)**: Backend logic in `/backend/src/services/debt_service.py`, frontend graph in `/frontend/src/components/SettlementGraph.jsx`.
- [x] **Principle II (Modular & Strict Typing)**: Pydantic schemas for `SettlementTransaction` and `SettlementPlanResponse`.
- [x] **Principle III (Zero-Setup In-Memory Persistence)**: Uses existing in-memory balance models.
- [x] **Principle IV (100% Path Coverage on Core Math)**: Exhaustive pytest suite for debt simplification algorithms covering edge cases and fractional cents.
- [x] **Principle V (Incremental Delivery & Git Lifecycle)**: Implementation organized into strictly bounded user story phases with 1 commit per task and PR per story.

## Project Structure

### Documentation (this feature)

```text
specs/002-debt-minimization-graphs/
├── plan.md              # This implementation plan
├── research.md          # Technical research & algorithm choices
├── data-model.md        # Settlement models and graph schemas
├── quickstart.md        # Test scenarios and walkthrough
├── contracts/
│   └── openapi.json     # OpenAPI 3.1 contract for GET /api/settlements
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Source Code

```text
backend/
├── src/
│   ├── models/
│   │   └── settlement.py          # SettlementTransaction, SettlementPlanResponse
│   ├── services/
│   │   └── debt_service.py        # Greedy debt minimization algorithm (100% coverage)
│   └── api/
│       └── routes.py              # Endpoint: GET /api/settlements
└── tests/
    ├── test_debt_service.py       # Unit tests for debt minimization engine (100% coverage)
    └── test_settlement_api.py     # Integration tests for /api/settlements

frontend/
├── src/
│   ├── services/
│   │   └── api.js                 # Added fetchSettlements API client method
│   ├── components/
│   │   ├── SettlementList.jsx     # Recommended minimal transactions list & badges
│   │   └── SettlementGraph.jsx    # SVG-based interactive directed node-link graph
│   └── App.jsx                    # Added Settlements & Visual Graph section
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None*    | N/A        | Clean service-level addition reusing existing balance infrastructure |
