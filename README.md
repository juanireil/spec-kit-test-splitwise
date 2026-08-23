# SplitWise Lite

A minimal, zero-setup shared expense-splitting application built with **FastAPI** and **React + Vite + Tailwind CSS**.

## Architecture Overview

- **Backend** (`/backend`): Python 3.10+, FastAPI, Pydantic, pytest. Uses an in-memory thread-safe repository initialized with demo members (Alice, Bob, Charlie, David) for instant testing.
- **Frontend** (`/frontend`): React 18, Vite, Tailwind CSS, Lucide icons. Real-time balance calculations with instant UI updates.
- **Balance Math**: Exact decimal precision and fractional cent splitting algorithm that guarantees the group zero-sum conservation invariant ($\sum \text{Balances} = \$0.00$).

---

## Quickstart

### 1. Run Backend
```bash
# In repository root
pip install -r backend/requirements.txt
uvicorn backend.src.main:app --reload --port 8000
```
API Documentation will be available at `http://localhost:8000/docs`.

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
