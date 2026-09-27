# Quickstart & Verification Guide: Unequal / Custom Expense Splits

**Feature Branch**: `003-test-unequal-splits` | **Date**: 2026-09-27

---

## 1. Prerequisites & Services
Ensure the backend and frontend are running:
```bash
# Backend (FastAPI on port 8000)
python3 -m uvicorn backend.src.main:app --reload --port 8000

# Frontend (Vite on port 5173)
cd frontend && npm run dev
```

---

## 2. Automated Test Verification
Run pytest to verify 100% test passing on split math, validation, and API routes:
```bash
pytest backend/tests -v --cov=backend.src --cov-report=term-missing
```

---

## 3. Manual Scenario Walkthrough

### Scenario A: Exact Amounts Split ($100.00)
1. In the UI, set Expense Amount: `$100.00`, Payer: `Alice`.
2. Select split mode: **Exact Amounts**.
3. Set Alice: `$50.00`, Bob: `$30.00`, Charlie: `$20.00` (Sum: $100.00). Notice the remaining indicator displays `$0.00 remaining`.
4. Click **Add Expense**.
5. Verify Live Balances:
   - Alice: `+$50.00` (Paid $100 - $50 share)
   - Bob: `-$30.00` (Paid $0 - $30 share)
   - Charlie: `-$20.00` (Paid $0 - $20 share)
   - David: `$0.00` (Settled)

### Scenario B: Percentage Split with Odd Cents ($100.00)
1. Set Expense Amount: `$100.00`, Payer: `Bob`.
2. Select split mode: **Percentages**.
3. Set Alice: `33.33%`, Bob: `33.33%`, Charlie: `33.34%` (Sum: 100%).
4. Click **Add Expense**.
5. Verify that shares are allocated down to the exact penny ($33.33, $33.33, $33.34) and sum of all balances strictly equals `$0.00`.
