# Quickstart & Verification Guide: Iteration 01 (MVP)

This guide documents runnable validation scenarios that demonstrate the feature works end-to-end.

## 1. Prerequisites & Environment Setup

- Python 3.10+
- Node.js 18+ & npm

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be accessible at `http://localhost:5173`.

---

## 2. Automated Test Verification

Run backend unit and integration test suite with coverage:

```bash
cd backend
pytest --cov=src --cov-report=term-missing tests/
```
**Verification Requirement**: 100% path coverage on balance calculation (`src/services/balance_service.py`).

---

## 3. End-to-End Walkthrough Scenarios

### Scenario A: Equal Split with Single Payer
1. Open the UI at `http://localhost:5173`.
2. Initial State: Alice ($0.00), Bob ($0.00), Charlie ($0.00), David ($0.00). All marked as "Settled".
3. Record Expense:
   - Amount: `90.00`
   - Payer: `Alice`
   - Participants: `Alice`, `Bob`, `Charlie`
4. Click **Submit Expense**.
5. Expected Outcome:
   - Alice: `+$60.00` (Status: "Owed")
   - Bob: `-$30.00` (Status: "Owes")
   - Charlie: `-$30.00` (Status: "Owes")
   - David: `$0.00` (Status: "Settled")
   - Total Group Expenses: `$90.00`
   - Sum of all balances: `$0.00`

### Scenario B: Fractional Cent Allocation
1. Record second expense:
   - Amount: `100.00`
   - Payer: `Bob`
   - Participants: `Alice`, `Bob`, `Charlie` (3 participants -> $33.34, $33.33, $33.33)
2. Click **Submit Expense**.
3. Expected Outcome:
   - Balances update dynamically without reload.
   - Sum of all balances remains strictly `$0.00`.
