# Research & Technical Decisions: Iteration 02 - Debt Minimization Engine & Visual Graphs

## 1. Debt Minimization Algorithm Selection

- **Decision**: Use a greedy maximum debtor-to-creditor matching algorithm operating on integer cents / `Decimal`.
  - **Algorithm details**:
    1. Separate members into `debtors` (balance < 0) and `creditors` (balance > 0).
    2. Sort debtors in ascending order of debt (largest debt first by absolute value) and creditors in descending order of credit (largest credit first).
    3. Iteratively take the largest remaining debtor $D$ and largest remaining creditor $C$.
    4. Compute payment amount $P = \min(|D_{\text{balance}}|, C_{\text{balance}})$.
    5. Record transaction $D \xrightarrow{P} C$.
    6. Update $D_{\text{balance}} \mathrel{+}= P$ and $C_{\text{balance}} \mathrel{-}= P$.
    7. If $D$ is settled ($0.00$), advance to next debtor; if $C$ is settled ($0.00$), advance to next creditor.
    8. Repeat until all debtors and creditors reach exactly $0.00$.
- **Rationale**:
  - Provably guarantees total balance conservation and zero drift.
  - Generates at most $N - 1$ transactions for $N$ non-zero members.
  - Deterministic and fast ($O(N \log N)$ complexity).
  - Cleanly handles fractional cent cases and multi-party distributions.
- **Alternatives considered**:
  - Subset-sum / NP-hard exact minimum transaction matching: Unnecessary computational overhead and unpredictable matching for small/medium group sizes. Greedy approach satisfies all MVP requirements with clear, intuitive pairings.

## 2. Graph Visualization Technology

- **Decision**: Use a lightweight SVG / HTML Canvas interactive layout powered by SVG coordinate math or a minimal React graph renderer (`lucide-react` + SVG curved path rendering) without bloated heavy dependencies.
- **Rationale**:
  - Keeps zero-setup friction and fast page loads without multi-megabyte bundle sizes.
  - Allows clean styling with Tailwind CSS, custom animated arrows, hover tooltips, and badges.
  - Native SVG nodes and directed Bezier curves scale cleanly across mobile and desktop.
- **Alternatives considered**:
  - D3-force / Cytoscape: Heavy dependencies that introduce DOM-manipulation conflicts with React's virtual DOM and increase build times.
  - Mermaids.js / Graphviz: Static, difficult to dynamically style with Tailwind themes.

## 3. Backend Architecture & Service Separation

- **Decision**: Implement `DebtSimplificationService` under `backend/src/services/debt_service.py` consuming `MemberBalance` models from `BalanceService`. Expose via `GET /api/settlements`.
- **Rationale**:
  - Pure separation of concerns: `balance_service.py` computes raw balances from expenses; `debt_service.py` minimizes those balances into settlement transactions.
  - 100% path coverage via `pytest` for all settlement permutations.
