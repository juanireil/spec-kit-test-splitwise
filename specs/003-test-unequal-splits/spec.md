# Feature Specification: Iteration 03 - Unequal / Custom Expense Splits

**Feature Branch**: `003-test-unequal-splits`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "Define the product specification for a new iteration: Unequal / Custom Expense Splits. Extend existing expense entry functionality to allow equal, exact amounts, and percentage split modes with strict invariant validation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create an Expense with Exact Monetary Amount Splits (Priority: P1)

As a user recording a shared expense with unequal contributions, I want to specify the exact monetary dollar amount owed by each participant so that everyone's share reflects their actual consumption or agreed contribution.

**Why this priority**: Core capability enabling custom non-equal splits by dollar value, covering the most common real-world use case (e.g., specific dinner items, variable utility usage).

**Independent Test**: Can be tested independently by creating an expense of $100.00 paid by Alice, assigning $50.00 to Alice, $30.00 to Bob, and $20.00 to Charlie in Exact Amounts mode, and verifying that the live balances update to Alice: +$50.00, Bob: -$30.00, and Charlie: -$20.00.

**Acceptance Scenarios**:

1. **Given** an expense of $100.00 paid by Alice and members Alice, Bob, and Charlie, **When** the user selects "Exact Amounts" mode and inputs Alice: $50.00, Bob: $30.00, Charlie: $20.00, **Then** the split is valid (sum = $100.00), the expense is recorded, and the balance sheet reflects these exact shares.
2. **Given** an expense of $100.00, **When** the user enters exact amounts that sum to $95.00 (under-allocated) or $105.00 (over-allocated), **Then** the interface clearly displays the remaining unallocated / over-allocated amount, disables submission, and prevents recording until exactly $100.00 is allocated.
3. **Given** an exact split where a participant's share is set to $0.00, **When** submitted with valid total allocation, **Then** the participant is included with a $0.00 owed share without generating error.

---

### User Story 2 - Create an Expense with Percentage-Based Splits (Priority: P2)

As a user dividing an expense proportionally, I want to assign percentage shares to participants so that the system calculates the exact monetary amount owed by each person while ensuring no fractional cents are lost.

**Why this priority**: Essential for percentage-based cost allocations (e.g. rent split by room size 60%/40%, or 3-way equal percentage 33.33%/33.33%/33.34%).

**Independent Test**: Can be tested independently by creating an expense of $100.00 with percentages Alice: 50%, Bob: 30%, Charlie: 20%, verifying that total percentages equal 100%, and validating that monetary shares calculated are $50.00, $30.00, and $20.00.

**Acceptance Scenarios**:

1. **Given** an expense of $100.00 paid by Alice, **When** the user selects "Percentages" mode and inputs Alice: 50%, Bob: 30%, Charlie: 20%, **Then** the system validates that the sum of percentages is 100%, computes monetary shares ($50.00, $30.00, $20.00), and records the expense.
2. **Given** an expense of $100.00 and 3 participants assigned percentages 33.33%, 33.33%, and 33.34% (sum = 100%), **When** submitted, **Then** the system deterministically calculates monetary shares totaling exactly $100.00 ($33.33, $33.33, and $33.34) preserving the penny conservation invariant ($\sum \text{Shares} \equiv \text{Total}$).
3. **Given** percentages that sum to 99% or 101%, **When** the user attempts submission, **Then** the system blocks submission and displays the percentage remaining (e.g., "1% remaining to allocate").

---

### User Story 3 - Interactive Real-Time Split Validation & Mode Switching (Priority: P3)

As a user composing an expense, I want real-time visual feedback indicating remaining unallocated amounts or percentages, and smooth switching between split modes (Equal, Exact Amounts, Percentages), so that I can easily configure complex splits without errors.

**Why this priority**: Enhances usability, prevents user frustration, and provides defensive guardrails before form submission.

**Independent Test**: Can be tested by typing in the split input fields and verifying that the remaining balance indicator updates on every keystroke, and switching between modes resets or appropriately initializes participant inputs.

**Acceptance Scenarios**:

1. **Given** an expense total of $50.00 and 2 participants in "Exact Amounts" mode, **When** the user types $20.00 for the first participant, **Then** the UI immediately displays "$30.00 remaining to allocate" and marks the form as invalid for submission.
2. **Given** any split mode, **When** the user switches back to "Equal", **Then** individual input fields hide and the expense divides equally across all selected participants as in default behavior.
3. **Given** an existing equal-split expense, **When** submitted, **Then** it continues to record seamlessly without requiring manual entry of custom shares.

---

### Edge Cases

- **Rounding in Proportional Percentage Splits**: When percentages result in fractional cents (e.g. 33.33% of $10.00 = $3.333), the system MUST deterministically distribute fractional remainder cents so that the sum of calculated monetary shares equals the total expense down to the exact cent.
- **Zero and 100% Allocations**: A participant may owe 0% / $0.00, or a single participant may owe 100% / full expense total.
- **Negative and Non-Numeric Values**: Entering negative amounts or negative percentages MUST be blocked immediately with validation errors.
- **Decimal Percentages**: Percentages with decimals (e.g., 12.5%, 37.5%, 50%) MUST be supported as long as the sum equals 100.0%.
- **Changing Total Expense After Split Entry**: If the total expense amount is edited after entering exact amounts or percentages, the system MUST immediately recalculate the remaining allocation and re-validate against the new total.
- **Changing Participant List After Split Entry**: Adding or removing a participant while in a custom split mode MUST re-evaluate the split validity and unallocated balance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support three distinct split modes for any expense: `Equal`, `Exact Amounts`, and `Percentages`.
- **FR-002**: System MUST default to `Equal` split mode for backward compatibility with existing expense entry flows.
- **FR-003**: System MUST require each selected participant to have an explicit assigned share input when `Exact Amounts` or `Percentages` mode is active.
- **FR-004**: System MUST enforce that the sum of all participant shares in `Exact Amounts` mode equals the total expense amount ($\sum \text{Shares} \equiv \text{Total}$).
- **FR-005**: System MUST enforce that the sum of all participant percentages in `Percentages` mode equals exactly 100% ($\sum \text{Percentages} \equiv 100\%$).
- **FR-006**: System MUST convert percentage shares into monetary amounts using deterministic fractional-cent remainder handling such that the sum of calculated monetary shares strictly equals the total expense amount.
- **FR-007**: System MUST validate split invariants independently on the server, rejecting invalid splits with descriptive 4xx errors regardless of client-side validation.
- **FR-008**: System MUST update live member balances based on the exact calculated shares owed by each participant across all split modes.
- **FR-009**: System MUST preserve the group conservation invariant ($\sum \text{Balances} = \$0.00$) across all split modes.
- **FR-010**: System MUST provide real-time UI feedback showing the total allocated amount/percentage and the remaining unallocated balance.
- **FR-011**: System MUST disable submission whenever the split is invalid, incomplete, or contains negative/non-numeric values.
- **FR-012**: System MUST allow zero shares ($0.00 or 0%) for participants who are selected in the group but do not owe anything for that specific transaction.

### Key Entities

- **Expense**: Represents a financial transaction, extended to include `split_mode` (`EQUAL`, `EXACT`, `PERCENTAGE`) and optional list of `custom_splits`.
- **Participant Split Share**: Represents a specific participant's assigned share in a transaction, containing participant identifier and either an exact monetary amount or an assigned percentage.
- **Balance Sheet Entry**: Represents a member's net financial balance, computed accurately from all equal and custom split shares.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can configure and submit an unequal exact amount or percentage split in under 20 seconds.
- **SC-002**: 100% of custom-split expenses preserve penny conservation ($\sum \text{Shares} = \text{Expense Total}$) with $0.00 deviation across all test scenarios.
- **SC-003**: 100% of invalid split attempts (sums not matching total, negative inputs, invalid percentages) are blocked both on the client UI and validated on the backend.
- **SC-004**: Real-time feedback for unallocated amounts/percentages updates within 50ms of user input changes.
- **SC-005**: Existing equal-split expenses continue to function with 0% regression on legacy workflows.

## Assumptions

- **Currency Unit**: Calculations operate in standard 2-decimal currency units (cents).
- **Group Membership**: Expenses are split among members belonging to the current active group.
- **Precedence**: Legacy equal expenses without custom shares are treated as `EQUAL` split mode by default.
- **Out of Scope**: Itemized receipt OCR, currency conversion, tips/tax automatic disaggregation, and saved custom split presets are out of scope for this iteration.
