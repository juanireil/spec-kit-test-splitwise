# Classroom Demo & Hands-on Prompts

Use these tested prompts during live lectures, workshops, or student lab exercises.

---

## 1. Establishing the Constitution
**Command**: `/speckit-constitution`

**Sample Prompt**:
> "Create a constitution for our collaborative project with the following core principles:
> 1. Clean separation of concerns between core domain logic and presentation layers.
> 2. Strict typing across all domain models.
> 3. Zero-setup in-memory persistence for demo environments.
> 4. Non-negotiable 100% path coverage for all mathematical calculations (splitting, debt simplification).
> 5. Incremental delivery: Implement strictly one User Story per branch, commit atomically per task, and open a PR before starting the next story."

---

## 2. Iteration 01 Demo: Expense Tracking & Live Balances
**Command**: `/speckit-specify`

**Sample Prompt**:
> "Define the product specification for **Iteration 01 (MVP): Expense Entry & Live Balance Sheet**.
>
> ### Goal
> Enable a group of members to record shared expenses and view live individual net balances.
>
> ### Core Functionality
> - Pre-seed a default group of members (e.g. Alice, Bob, Charlie, David).
> - Record an expense with: positive dollar amount, a payer member, and one or more participant members.
> - Split the expense equally among all participants.
> - For fractional cent divisions (e.g. $100 / 3 = $33.333...), distribute remainder pennies deterministically so that the sum of split shares equals the original total expense.
> - Compute live net balances for every member: `Total Amount Paid - Total Share Owed`.
> - Display balance badges: positive balances (is owed money), negative balances (owes money), and $0.00 (settled).
>
> ### Mathematical Invariants
> - Sum of split shares must exactly equal the total expense amount.
> - Sum of all group member balances must always equal $0.00 (Conservation of Money).
>
> ### MVP Boundaries
> No authentication, no custom non-equal splits, no currency conversions, in-memory storage only."

---

## 3. Iteration 02 Demo: Debt Minimization Engine & Visual Graphs
**Command**: `/speckit-specify`

**Sample Prompt**:
> "Define the product specification for **Iteration 02: Debt Minimization Engine & Visual Graphs**.
>
> ### Goal
> Transform individual member balances into the absolute minimal set of direct payment transactions needed to settle all debts, and provide an intuitive visual graph representation.
>
> ### Core Functionality
> - Consume current net balances of all members.
> - Simplify outstanding debts into a minimal set of transactions (at most N - 1 payments for N members).
> - Recommend who pays whom and the exact payment amount.
> - Render an interactive visual graph:
>   - Members as nodes (color-coded by balance status).
>   - Directed payment arrows from debtor to creditor.
>   - Prominent amount badges on each edge.
>   - Zero edges when all members are settled.
> - Update recommendations and visual graph immediately when expenses change.
>
> ### Invariants
> - Exact penny balance preservation: sum of payments must equal sum of credit balances.
> - Zero self-payments (Payer != Recipient).
> - Deterministic output for identical balance sheets."

---

## 4. Student Challenge / Assignment: Iteration 03 (Custom Split Engine)
**Command**: `/speckit-specify`

**Assignment Prompt for Students**:
> "Define the product specification for **Iteration 03: Custom Expense Splits & Settlement Receipts**.
>
> ### Goal
> Expand the expense recording engine to support custom split types:
> 1. Exact amount splits (e.g. Alice pays $50, Bob owes $30, Charlie owes $20).
> 2. Percentage splits (e.g. 50% / 25% / 25%).
> 3. Share/Ratio splits (e.g. 2 shares / 1 share / 1 share).
>
> ### Invariants
> - Total custom shares must validate and exactly sum to 100% or total expense amount.
> - Live balance sheets and debt minimization engine must consume all split types seamlessly."
