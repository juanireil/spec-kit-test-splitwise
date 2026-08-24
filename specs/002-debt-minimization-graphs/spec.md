# Feature Specification: Iteration 02 - Debt Minimization Engine & Visual Graphs

**Feature Branch**: `feature/002-debt-minimization-graphs`

**Created**: 2026-08-23

**Status**: Draft

**Input**: User description: "Define the product specification for Iteration 02: Debt Minimization Engine & Visual Graphs. Transform member balances into a minimal set of payments settling all debts with visual graph representation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compute and View Recommended Minimized Payments (Priority: P1) 🎯 MVP

As a group member viewing the shared group finances, I want the application to automatically compute the minimal set of direct settlement payments needed to resolve all group debts, so that we can settle our accounts with the fewest possible transactions rather than making messy cross-payments.

**Why this priority**: The primary mathematical and practical purpose of group expense splitting is eliminating unnecessary intermediate payments and giving members a clear list of who needs to pay whom.

**Independent Test**: Record expenses that yield Alice (+$10.00), Bob (-$5.00), and Charlie (-$5.00). Verify that the system recommends exactly 2 transactions: Bob pays Alice $5.00, and Charlie pays Alice $5.00 (and 0 intermediate payments between Bob and Charlie).

**Acceptance Scenarios**:

1. **Given** member net balances where Alice is owed $10.00, Bob owes $5.00, and Charlie owes $5.00, **When** the debt minimization engine processes the balances, **Then** it produces exactly two recommended payments: `Bob -> Alice: $5.00` and `Charlie -> Alice: $5.00`, completely settling all members.
2. **Given** a group where all members have a $0.00 net balance (all settled), **When** debt minimization is requested, **Then** it returns an empty payment list (0 payments needed) with a clear "All debts are settled" message.
3. **Given** a multi-party circular or complex balance sheet (e.g., Alice: +$60.00, Bob: -$15.00, Charlie: -$45.00), **When** processed, **Then** the recommended payments strictly settle each debtor for their exact negative amount (Bob pays $15.00, Charlie pays $45.00) directly to creditor(s) (Alice receives $60.00 total) without creating circular or excess obligations.
4. **Given** an updated expense recorded by any user, **When** the expense is submitted, **Then** the recommended settlements update dynamically to reflect the new state.

---

### User Story 2 - Interactive Visual Transaction Graph (Priority: P2)

As a group member, I want to see an intuitive visual graph showing group members as nodes and recommended settlement payments as directed arrows with amounts, so that the entire group can visually understand the payment flows at a single glance.

**Why this priority**: A visual directed graph provides immediate comprehension of payment directions and dependencies compared to reading text tables alone.

**Independent Test**: Load the application with active debts and verify that the graph displays member nodes, directed links indicating the exact payment flow direction (`Payer ---> Recipient`), and explicit dollar amounts on each connection.

**Acceptance Scenarios**:

1. **Given** recommended settlement payments (e.g., `Bob -> Alice: $5.00`), **When** the graph renders, **Then** a directed edge points from Bob's node to Alice's node labeled clearly with `$5.00`.
2. **Given** a group with zero debts, **When** the graph renders, **Then** nodes are displayed with settled status and zero connecting payment edges.
3. **Given** multiple incoming/outgoing payments for a single node, **When** rendered, **Then** distinct arrows and labels clearly distinguish each separate payment obligation.

---

### Edge Cases

- **Exact Balance Preservation**: The sum of all recommended payment transactions MUST equal the total positive balances of all creditors (which also equals the absolute sum of all debtors). Money MUST NOT be created, lost, or rounded away.
- **No Self-Payments**: A member MUST NEVER be recommended to pay themselves (`Payer != Recipient`).
- **No Over-Payment / Over-Receipt**: A debtor must never pay more than their absolute balance; a creditor must never receive more than they are owed.
- **Determinism**: Given the identical set of member balances, the simplification engine MUST produce the same deterministic payment recommendations.
- **Partial Multi-Settlements**: When one creditor is owed an amount larger than any individual debtor owes, the engine must split payments across multiple debtors (or multiple creditors) to completely zero out all balances.
- **Zero-Balance Members**: Members who have a $0.00 balance must not appear as payers or receivers in any recommended transaction.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST take the current net balance of all registered members as the input for debt simplification.
- **FR-002**: System MUST identify creditors (members with net balance > $0.00) and debtors (members with net balance < $0.00).
- **FR-003**: System MUST compute a minimal set of direct payments between debtors and creditors that completely settles all non-zero balances.
- **FR-004**: Each recommended settlement transaction MUST specify: Payer (debtor member ID & name), Recipient (creditor member ID & name), and Payment Amount.
- **FR-005**: System MUST guarantee that the sum of payments sent by each debtor equals their total debt, and the sum of payments received by each creditor equals their total credit.
- **FR-006**: System MUST update recommended payments immediately whenever underlying balances change (e.g. after adding a new expense).
- **FR-007**: System MUST render an interactive visual directed graph where members are represented as nodes and recommended transactions are represented as directed edges pointing from Payer to Recipient.
- **FR-008**: System MUST display the payment amount prominently on each graph connection edge.
- **FR-009**: System MUST display an empty/settled state visual and message when all balances are $0.00.

### Key Entities

- **SettlementTransaction**: Represents a single recommended transfer to settle debt.
  - Attributes: `from_member` (debtor reference), `to_member` (creditor reference), `amount` (positive monetary value).
- **SettlementPlan**: Represents the complete minimal payment schedule.
  - Attributes: `transactions` (list of `SettlementTransaction`), `total_settled_amount`, `transaction_count`.
- **GraphVisualModel**: Represents the visual node-link structure.
  - Attributes: `nodes` (list of members with balance state), `links` (list of directed edges with amount labels).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Debt minimization produces a settlement plan with at most $N - 1$ transactions for any group of $N$ members with active balances.
- **SC-002**: 100% of generated settlement plans achieve exact conservation of money: $\sum \text{Payments} = \sum \text{Creditor Balances}$ with $0.00 balance drift.
- **SC-003**: The visual graph and settlement recommendations render within 300ms of any balance state change.
- **SC-004**: 100% of zero-balance members have 0 incoming or outgoing edges in the settlement graph.

## Assumptions

- **Read-Only Recommendations**: In this iteration, the debt minimization engine provides recommendations and visual graph layouts. Actually recording/executing debt payments or tracking payment completions is out of scope.
- **Single Currency**: All calculations remain in a unified standard currency ($ USD).
- **Existing Balances Integration**: Debt simplification consumes the exact net balances computed by Iteration 01's balance calculation engine.
