# Quickstart & Verification Guide: Iteration 02 - Debt Minimization Engine & Visual Graphs

This guide outlines end-to-end scenarios to verify debt minimization and visual graph rendering.

## 1. Test Suite Verification

Run backend unit and integration tests with coverage:
```bash
python3 -m pytest backend/tests --cov=backend/src --cov-report=term-missing
```
**Verification Requirement**: 100% path coverage on `backend/src/services/debt_service.py`.

---

## 2. End-to-End Scenarios

### Scenario A: Three-Party Single Creditor Simplification
1. Start with fresh balances or record an expense:
   - Alice pays `$90.00` for Alice, Bob, Charlie ($30 each).
   - Balances: Alice: `+$60.00`, Bob: `-$30.00`, Charlie: `-$30.00`, David: `$0.00`.
2. Open the Settlements & Graph view.
3. Expected Outcome:
   - Exactly 2 transactions recommended:
     1. `Bob -> Alice: $30.00`
     2. `Charlie -> Alice: $30.00`
   - Total Settled Amount: `$60.00`
   - Graph shows direct green/blue arrows pointing from Bob and Charlie to Alice with `$30.00` badges.
   - David node has no connecting lines (settled).

### Scenario B: Multi-Payer Cascading Simplification
1. Bob adds second expense:
   - Bob pays `$30.00` for Bob and Charlie ($15 each).
   - Balances: Alice: `+$60.00`, Bob: `-$15.00`, Charlie: `-$45.00`.
2. Expected Outcome:
   - Exactly 2 transactions recommended:
     1. `Charlie -> Alice: $45.00`
     2. `Bob -> Alice: $15.00`
   - Total Settled: `$60.00` (Alice receives total $60.00).

### Scenario C: All Settled Zero-Debt State
1. When all balances are $0.00:
   - Transactions list shows empty state: "All group members are settled up! No payments needed."
   - Graph displays all member nodes with green settled badges and zero connection edges.
