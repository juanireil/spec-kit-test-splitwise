# Technical Research & Decision Log: Unequal / Custom Expense Splits

**Feature Branch**: `003-test-unequal-splits` | **Date**: 2026-09-27

---

## 1. Domain Model & Split Storage Representation

### Decision
Extend `Expense` and `ExpenseCreate` models with an explicit `SplitMode` enum (`EQUAL`, `EXACT`, `PERCENTAGES`) and a persisted dictionary of calculated exact monetary shares: `shares: dict[str, Decimal]`.

### Rationale
- **Penny Conservation & Determinism**: Storing the resolved monetary `shares: dict[str, Decimal]` (in dollars/cents, e.g., `{"alice": Decimal("50.00"), "bob": Decimal("30.00"), "charlie": Decimal("20.00")}`) guarantees that future balance recalculations never drift due to float or percentage re-rounding.
- **Backward Compatibility**: Existing equal-split expenses can seamlessly populate `shares` via `BalanceService.split_amount_equally(amount, participant_ids)`.
- **Zero-Sum Balance Calculation**: `BalanceService.calculate_balances` can directly iterate over `expense.shares` for all expense types uniformly without branching on split mode during balance calculation.

### Alternatives Considered
- *Store raw percentages and dynamically calculate shares on every balance read*: Rejected because slight changes in rounding logic or floating-point interpretations over time could cause historical balance discrepancies.
- *Create separate database models/endpoints for each split type (`EqualExpense`, `ExactExpense`, `PercentageExpense`)*: Rejected as over-engineered. A unified schema cleanly supports all three modes.

---

## 2. Monetary Precision & Arithmetic Invariants

### Decision
Use Python's standard library `decimal.Decimal` with 2 decimal places (`Decimal("0.01")`) for all internal calculations, validation checks, and repository storage. Convert amounts to integer cents for all remainder distributions.

### Rationale
- Python `float` suffers from binary floating-point representation errors (e.g. `0.1 + 0.2 != 0.3`).
- Integer cent arithmetic (`total_cents = int(round(amount * 100))`) ensures 100% exact math with zero loss of cents.

---

## 3. Deterministic Percentage-to-Penny Remainder Strategy

### Decision
Implement the **Largest Remainder Method (Hamilton Method)** with deterministic tie-breaking:
1. Validate $\sum \text{percentages} == 100.00\%$.
2. For each participant $i$, calculate raw cents $c_i = \frac{\text{total\_cents} \times \text{percentage}_i}{100}$.
3. Assign floor integer cents: $\text{base\_cents}_i = \lfloor c_i \rfloor$.
4. Calculate remainder cents: $R = \text{total\_cents} - \sum \text{base\_cents}_i$.
5. Sort participants descending by fractional remainder $(c_i - \text{base\_cents}_i)$, breaking ties by original participant index order.
6. Allocate $+1$ cent to the top $R$ participants.
7. Verify $\sum \text{final\_cents}_i \equiv \text{total\_cents}$.

### Example
Expense = $100.00 (10,000 cents), split 33.33%, 33.33%, 33.34%:
- Alice: $10000 \times 0.3333 = 3333.00$ cents $\rightarrow$ 3333 cents (frac: .00)
- Bob: $10000 \times 0.3333 = 3333.00$ cents $\rightarrow$ 3333 cents (frac: .00)
- Charlie: $10000 \times 0.3334 = 3334.00$ cents $\rightarrow$ 3334 cents (frac: .00)
- Sum = 10,000 cents ($100.00) $\rightarrow$ Exact match!

---

## 4. Frontend Split State Management & UX

### Decision
Maintain a local split mode state (`'EQUAL' | 'EXACT' | 'PERCENTAGE'`) in `ExpenseForm.jsx` with an object map of participant input values (`{ [memberId]: string }`). Provide real-time live validation summaries:
- Exact Amounts: Display total allocated ($) and remaining to allocate ($).
- Percentages: Display total allocated (%) and remaining to allocate (%).
- Disable the "Add Expense" button unless the remaining unallocated balance is exactly $0.00 / 0%.

### Rationale
Provides instant visual feedback to users without lag or unnecessary network roundtrips, while the backend maintains strict independent validation.
