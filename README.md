# SplitWise Lite

A minimal, zero-setup shared expense-splitting and debt minimization application built with **FastAPI** and **React + Vite + Tailwind CSS**.

## Architecture & Features

- **Iteration 01 (MVP) - Expense Tracking & Live Balances**:
  - Record shared expenses with equal splitting and exact fractional cent distribution.
  - Live balance sheet computing net financial positions (`Total Paid - Total Owed`).
  - Strict preservation of the zero-sum group conservation invariant ($\sum \text{Balances} = \$0.00$).

- **Iteration 02 - Debt Minimization Engine & Visual Graphs**:
  - Greedy settlement minimization algorithm reducing debts to at most $N - 1$ direct transactions.
  - Interactive SVG-based directed graph rendering nodes (debtors in red, creditors in green) and payment arrows with exact dollar badges.
  - Real-time automatic recalculation and graph re-rendering upon expense creation.

---

## Quickstart

### 1. Run Backend
```bash
# In repository root
pip install -r backend/requirements.txt
python3 -m uvicorn backend.src.main:app --reload --port 8000
```
Interactive API documentation: `http://localhost:8000/docs`.

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Running Tests

Run the full pytest suite with test coverage:
```bash
python3 -m pytest backend/tests --cov=backend/src --cov-report=term-missing
```
**Test Status**: 23/23 tests passing with 100% path coverage on core math (`balance_service.py` and `debt_service.py`).
