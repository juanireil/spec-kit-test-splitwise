# Research & Technical Decisions: Iteration 01 (MVP) - Expense Entry & Live Balance Sheet

## 1. Monorepo Structure & Package Management

- **Decision**: Initialize `/backend` as a standard Python package using `pyproject.toml` (managed with `pip` / `venv` / `pytest`) and `/frontend` using `Vite` + React + Tailwind CSS.
- **Rationale**: Direct compliance with Constitution Principle I (`/backend` and `/frontend`). Keeps backend and frontend dependency lifecycles completely independent and self-contained.
- **Alternatives considered**:
  - Combined `package.json` at root: Rejected to keep Python and Node.js boundaries clean and modular.
  - Poetry/Pipenv: Standard `pip`/`pyproject.toml` with `requirements.txt` was preferred for minimal setup friction across environments.

## 2. In-Memory Persistence & Concurrency Strategy

- **Decision**: Use a singleton thread-safe in-memory repository (`InMemoryExpenseRepository`) in the FastAPI backend storing members and expenses in Python data structures (lists/dicts).
- **Rationale**: Complies with Constitution Principle III (Zero-Setup Friction via In-Memory Persistence). Allows instant execution with `uvicorn` without spinning up SQLite/PostgreSQL, while keeping domain logic clean and decoupled via a repository interface for future persistent backend swaps.
- **Pre-populated Demo State**: Seed the in-memory store on startup with default demo members:
  - `alice` ("Alice")
  - `bob` ("Bob")
  - `charlie` ("Charlie")
  - `david` ("David")
- **Alternatives considered**:
  - SQLite database: Adds file I/O and migration overhead not needed for zero-setup demo MVP.
  - Frontend-only localStorage: Violates server-side validation and multi-client capability; backend must remain source of truth.

## 3. Balance Calculation & Fractional Cent Splitting Algorithm

- **Decision**:
  - Store monetary values using `Decimal` / integer cents in backend math to eliminate IEEE 754 floating-point inaccuracies.
  - Compute each member's balance dynamically from all persisted expenses using the formula:
    $$\text{Balance}(M) = \sum \text{PaidBy}(M) - \sum \text{OwedShare}(M)$$
  - For equal splitting with $N$ participants on amount $A$ cents:
    - Base share $S = \lfloor A / N \rfloor$
    - Remainder $R = A \pmod N$
    - First $R$ participants are assigned $S + 1$ cents; remaining $N - R$ are assigned $S$ cents.
  - This ensures $\sum \text{Shares} = A$ exactly, preserving the zero-sum invariant across the group ($\sum \text{Balances} = 0.00$).
- **Rationale**: Complies with Constitution Principle IV (100% path coverage for edge cases, fractional rounding, zero-sum invariant).
- **Alternatives considered**:
  - Floating-point division: Rejected due to precision errors like `$0.00000000000001` or `$33.333333333333336`.
  - Incremental balance accumulator: Computing derived state dynamically from the list of expenses ensures idempotent, corruption-proof balances.

## 4. Frontend State & API Integration

- **Decision**: Standard React `useState` / `useEffect` + native `fetch` client wrapped in a lightweight `api.js` client service.
- **Rationale**: The MVP has two views/sections (Expense Form and Balance Grid). Adding Redux/Zustand adds unnecessary boilerplate. When an expense is successfully created via `POST /api/expenses`, the frontend triggers a fresh balance fetch via `GET /api/balances`.
- **Alternatives considered**:
  - TanStack Query (React Query): Great tool, but standard `useEffect` + async helper is zero-overhead for an MVP.
  - WebSocket / SSE: Overkill for MVP request/response flow.

## 5. Testing & Quality Strategy

- **Decision**:
  - Backend: `pytest` with unit tests for balance service (covering standard splits, fractional cents, single payer/participant, multi-payer series, circular debts) and `TestClient` for API integration tests.
  - Target: 100% path coverage on calculation logic.
- **Rationale**: Mandated by Constitution Principle IV.
