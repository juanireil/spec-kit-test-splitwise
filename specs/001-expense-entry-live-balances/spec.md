# Feature Specification: Iteration 01 (MVP) - Expense Entry & Live Balance Sheet

**Feature Branch**: `001-expense-entry-live-balances`

**Created**: 2026-08-23

**Status**: Draft

**Input**: User description: "Define the product specification for Iteration 01 (MVP): Expense Entry & Live Balance Sheet. Build the first usable version of a shared expense-splitting application."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record a Shared Equal Expense and View Updated Live Balances (Priority: P1)

As a member of a shared group, I want to record an expense by specifying the total amount, who paid it, and which members shared in the expense, so that everyone's net financial balance immediately reflects the new transaction.

**Why this priority**: This is the core MVP value proposition. Without the ability to record an expense and immediately see the updated balance sheet, the application serves no purpose.

**Independent Test**: Can be tested by launching a fresh session, entering a new expense ($90 paid by Alice, shared equally among Alice, Bob, and Charlie), and verifying that Alice's balance becomes +$60.00 while Bob and Charlie each show -$30.00.

**Acceptance Scenarios**:

1. **Given** an existing group with members Alice, Bob, and Charlie all starting with $0.00 balance, **When** Alice records an expense of $90.00 with Alice as the payer and Alice, Bob, and Charlie as equal participants, **Then** the expense is recorded, Alice's balance updates to +$60.00, and Bob and Charlie's balances update to -$30.00 each.
2. **Given** the current balances (Alice: +$60.00, Bob: -$30.00, Charlie: -$30.00), **When** Bob records a new expense of $30.00 paid by Bob and shared only between Bob and Charlie ($15.00 each), **Then** the balances immediately update to Alice: +$60.00, Bob: -$15.00 (-$30 + $30 paid - $15 share), and Charlie: -$45.00 (-$30 - $15 share).
3. **Given** a recorded expense where the payer is NOT among the sharing participants (e.g., Alice pays $50.00 entirely for Bob and Charlie), **When** submitted, **Then** Alice's balance increases by the full $50.00 (+50.00), while Bob and Charlie's balances each decrease by $25.00 (-25.00).

---

### User Story 2 - Real-Time Dashboard Balance Sheet & Status Visualization (Priority: P2)

As a user opening the application, I want to see a clear list of all group members and their current net balance at all times, with clear visual indications of whether each member is owed money, owes money, or is fully settled.

**Why this priority**: Users need immediate clarity and confidence in the financial state without performing mental arithmetic.

**Independent Test**: Open the application with existing recorded expenses and verify that positive balances are clearly highlighted as "owed money" (+), negative balances as "owes money" (-), and zero balances as "settled" ($0.00).

**Acceptance Scenarios**:

1. **Given** an initial state with no expenses recorded, **When** a user views the balance sheet, **Then** all members are displayed with a $0.00 balance and a "settled" status.
2. **Given** members with varying balances, **When** the balance sheet renders, **Then** members with positive balances display with a clear "+" prefix (or positive indicator), negative balances display with a "-" prefix (or negative indicator), and the sum of all members' balances in the group equals exactly zero ($0.00).

---

### Edge Cases

- **Uneven / Fractional Division**: When an expense cannot be divided evenly into whole cents among $N$ participants (e.g., $100.00 split equally among 3 people = $33.3333... each), how does the system allocate the remaining cent(s)? The system MUST distribute fractional cents consistently such that the sum of participants' split shares matches the total expense amount down to the exact cent, and the net sum of all member balances remains exactly $0.00.
- **Single Participant (Payer only)**: When a member records an expense where they are the sole participant, their net balance change MUST be $0.00 ($X paid minus $X share).
- **Invalid / Non-Positive Amounts**: When a user attempts to enter an amount of $0.00, negative numbers, or non-numeric text, the system MUST prevent submission with a clear validation message.
- **Empty Participant Selection**: When no sharing participants are selected, the system MUST block submission and prompt the user to select at least one participant.
- **Empty Payer Selection**: When no payer is selected, the system MUST block submission.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to input an expense with a positive numeric monetary amount (minimum $0.01).
- **FR-002**: System MUST allow selecting exactly one group member as the payer for each expense.
- **FR-003**: System MUST allow selecting one or more group members as participants who share the expense.
- **FR-004**: System MUST split the total expense amount equally across all selected participants.
- **FR-005**: System MUST compute and maintain each member's net balance as `Total Amount Paid - Total Share of Expenses Owed across all recorded transactions`.
- **FR-006**: System MUST update and display all member balances immediately upon successful submission of an expense without requiring a page reload.
- **FR-007**: System MUST clearly indicate each member's financial state: positive balance (owed money / creditor), negative balance (owes money / debtor), or zero balance (settled).
- **FR-008**: System MUST guarantee that the mathematical sum of all member balances across the group always equals zero ($0.00) at all times (conservation of balance).
- **FR-009**: System MUST validate input fields and reject submissions with missing amounts, zero/negative amounts, missing payers, or empty participant lists.

### Key Entities

- **Member**: Represents an individual in the expense-sharing group. Key attributes: unique identifier, display name, and computed net balance.
- **Expense**: Represents a single financial transaction. Key attributes: unique identifier, total monetary amount, payer (reference to Member), list of participant members (references to Members), and creation timestamp.
- **Balance Entry**: Represents a member's net financial standing at any given point in time (positive = owed money, negative = owes money, zero = settled).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can enter and submit a standard shared expense in under 15 seconds.
- **SC-002**: 100% of recorded valid expenses reflect immediately in the live balance view within 500ms of submission.
- **SC-003**: The net sum of all member balances across any sequence of recorded expenses strictly sums to $0.00 in 100% of test scenarios (zero-sum invariant).
- **SC-004**: 100% of invalid submission attempts (negative amount, 0 participants, missing payer) are blocked with descriptive feedback before recording.

## Assumptions

- **Pre-populated Demo Group**: For this iteration (MVP zero-setup friction), the system provides a default pre-configured set of group members (e.g., Alice, Bob, Charlie, David) to allow instant testing and demonstration without an onboarding setup flow.
- **Equal Splitting Only**: All expenses in this iteration are split equally among selected participants. Unequal splits, percentage splits, and itemized shares are deferred to future iterations.
- **Single Currency**: All calculations and balance representations assume a single standard currency (e.g., USD / $) without multi-currency exchange.
- **Session / In-Memory Scope**: Authentication, persistent user accounts, expense deletion/editing, and debt settlement flows are intentionally out of scope for Iteration 01 as established in the MVP boundaries.
