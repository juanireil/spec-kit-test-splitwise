# 📋 Live Demo Prompts: Unequal & Custom Expense Splits

This document contains the exact, vetted prompt sequence for the **Phase 3 Live Demonstration** (Unequal / Custom Expense Splits with Exact Amounts & Percentages).

---

## 1️⃣ `/speckit-specify` Prompt

```text
Define the product specification for a new iteration: Unequal / Custom Expense Splits.

This feature extends the existing expense entry functionality. Currently, expenses can only be split equally among the selected members. This iteration allows users to choose how an expense is divided between members.

### Goal

Allow users to create expenses where the amount owed by each participant can be customized either by exact monetary amounts or by percentages, while guaranteeing that the complete expense amount is allocated exactly.

The system must enforce the fundamental invariant:

Sum of all participant shares = Expense total

No money may be created, lost, or left unallocated because of rounding or calculation errors.

### Split modes

When creating an expense, the user should be able to select one of three split modes:

1. Equal
   - The expense is divided equally among all selected participants.
   - This is the existing behavior and should continue to work.

2. Exact Amounts
   - The user specifies the exact amount owed by each participant.
   - The sum of all entered amounts must equal the total expense amount.

3. Percentages
   - The user specifies the percentage owed by each participant.
   - The sum of all participant percentages must equal 100%.
   - The corresponding monetary shares should be calculated from the expense total.

### User experience

The expense form should allow the user to select the split mode.

For custom split modes, the interface should display a row for each selected participant containing the appropriate input:

- Exact Amounts → amount input.
- Percentages → percentage input.

The interface should provide immediate feedback as the user changes the values.

The user should be able to clearly understand:

- How much each participant owes.
- Whether the split is currently valid.
- How much remains to be allocated when using exact amounts.
- How much of the percentage allocation remains when using percentages.

The expense should only be submitted when the split is valid.

### Validation and invariants

The system must enforce the split invariants on both the client and server.

For exact amounts:

Sum(shares) = expense amount

For percentages:

Sum(percentages) = 100%

The backend must independently validate these rules. Client-side validation must never be considered sufficient to guarantee correctness.

Monetary values must be handled with exact monetary precision rather than binary floating-point comparisons.

Percentage-based splits must define deterministic rounding behavior so that the resulting monetary shares still satisfy:

Sum(calculated shares) = expense amount

For example, splitting an amount into three equal percentage shares of 33.33%, 33.33%, and 33.34% must result in monetary shares whose total is exactly the original expense amount.

### Error behavior

Users should receive clear validation feedback when:

- The exact amounts do not add up to the expense total.
- The percentages do not add up to 100%.
- A share is negative.
- A percentage is negative.
- A participant is missing a required share.
- The split contains invalid numeric values.
- Rounding would otherwise cause the calculated shares not to equal the expense total.

Invalid expenses must not be persisted.

### Existing behavior

Existing equal-split expenses must continue to work without requiring users to manually enter individual shares.

Existing expense and balance functionality should continue to work with custom splits. The balances produced by the application should use the actual calculated share owed by each participant rather than assuming that every expense is equally divided.

### Example

For an expense of $100 involving Alice, Bob, and Charlie:

Exact Amounts:
- Alice: $50
- Bob: $30
- Charlie: $20
Total = $100 → valid.

Percentages:
- Alice: 50%
- Bob: 30%
- Charlie: 20%
Total = 100% → valid.

An example of an invalid split:
- Alice: $50
- Bob: $30
- Charlie: $15
Total = $95 → invalid.

### Edge cases

The specification should explicitly account for mathematical and monetary edge cases, including:
- Three or more participants with percentages that require rounding.
- Very small monetary amounts.
- Percentages with decimal values.
- Exact amounts with cents.
- A participant receiving a zero share.
- A single participant receiving 100% of an expense.
- Invalid negative values.
- Totals that differ from the required amount by one cent.
- Floating-point precision issues.
- Changes to the total expense after split values have already been entered.
- Changes to the participant list after split values have been entered.

### Scope

This iteration does not introduce:
- Settlement functionality.
- Payment processing.
- New currencies or currency conversion.
- Split templates.
- Saved/custom split presets.
- Advanced expense editing beyond what already exists.
- Authentication or authorization.

Focus the specification on user-visible behavior, business rules, mathematical invariants, and acceptance criteria.

Do not prescribe API endpoints, database schemas, React components, libraries, implementation architecture, or specific algorithms. Those decisions belong in the planning phase.
```

---

## 2️⃣ `/speckit-plan` Prompt

```text
Create the technical implementation plan for the Unequal / Custom Expense Splits feature based on the approved specification.

This is an incremental change to the existing application.

Treat the current repository and the existing implementation as the source of truth for technology choices, architecture, project structure, dependencies, persistence, API conventions, frontend patterns, and testing setup.

Reuse the existing approaches wherever possible. Do not redesign existing functionality unless required to support custom splits.

The existing application already supports expense creation, equal splitting, member balances, and the debt minimization functionality from previous iterations.

## Core technical requirement

Extend the expense model and expense creation flow to support three split modes:
- Equal
- Exact Amounts
- Percentages

The implementation must preserve the following invariant for every persisted expense:

Sum(all participant shares in the smallest supported monetary unit) = expense amount

This invariant must be enforced by the backend regardless of what the frontend sends.

## Domain model

Determine how the existing expense and participant/share models should be extended to represent custom splits.

The design should:
- Preserve compatibility with existing equal-split expenses.
- Represent the actual monetary share owed by each participant.
- Store enough information to correctly reproduce and calculate balances.
- Avoid relying on recalculating historical monetary shares from percentages after an expense has been persisted if doing so could produce different results due to rounding.

Evaluate whether the split mode itself needs to be persisted and explain the decision.

Do not introduce unnecessary abstractions if the existing data model can be extended cleanly.

## Backend validation

Design backend validation for each split mode.

### Equal
Continue using the existing equal-split behavior while ensuring the resulting shares conserve the total amount exactly.

### Exact Amounts
Validate that:
Sum(participant amounts) = expense amount

Validation should use exact monetary arithmetic rather than floating-point equality.

Reject:
- Negative shares.
- Missing shares.
- Invalid numeric values.
- Totals that do not exactly equal the expense amount.

### Percentages
Validate that:
Sum(participant percentages) = 100%

Define the accepted precision for percentages.
Design deterministic conversion from percentages to monetary shares.
The resulting monetary shares must satisfy:
Sum(calculated shares) = expense amount

Document how rounding is performed and how any rounding remainder is allocated.
The approach must be deterministic and reproducible.

## Money and precision

Inspect the existing monetary representation and follow the established project convention where possible.

Explicitly determine:
- The monetary precision used by the application.
- How amounts are represented in Python.
- How percentage calculations are performed.
- How rounding is performed.
- How equality comparisons are performed.
- How values are serialized through the API.
- How values are persisted.

Avoid binary floating-point arithmetic for monetary invariants.

The plan should explicitly address examples such as splitting $100 across three participants using approximately equal percentages and explain how the final cents are allocated.

## API design

Extend the existing expense creation API to support the new split modes.

Determine the appropriate request and response schema based on the existing API conventions.

The API design should allow the frontend to communicate:
- Split mode.
- Participants.
- Exact shares when using exact amounts.
- Percentages when using percentage splits.

Define how validation errors are returned and how the frontend can associate errors with the relevant fields.
Maintain backward compatibility with the existing equal-split behavior where practical.
Do not duplicate balance calculations in the frontend.

## Frontend

Extend the existing expense form/modal to support split mode selection.

Design the React implementation for:
- Split mode selection.
- Dynamic participant split rows.
- Exact amount inputs.
- Percentage inputs.
- Real-time validation.
- Remaining amount display for exact splits.
- Remaining percentage display for percentage splits.
- Per-participant validation feedback.
- Overall split validity state.
- Preventing submission of invalid splits.
- Handling backend validation errors.

The UI should update dynamically when:
- The expense amount changes.
- Participants are added or removed.
- The split mode changes.
- A participant's share changes.

Determine how values should be initialized when switching between split modes.
Prefer predictable behavior over attempting to automatically preserve every value when the representation changes.

## Percentage rounding

Design the percentage-to-money conversion explicitly.

The implementation should:
1. Calculate each participant's theoretical share.
2. Convert shares to the application's smallest monetary unit.
3. Account for rounding differences.
4. Allocate any remaining monetary units deterministically.
5. Verify the final shares sum exactly to the original expense amount.

The plan should specify a deterministic remainder allocation strategy and explain why it is appropriate.

Include examples such as:
- $100 split 33.33% / 33.33% / 33.34%.
- $10 split approximately equally between three participants.
- $0.01 split between multiple participants.
- Percentages containing decimal places.

The implementation must never silently lose or create money because of rounding.

## Balance integration

Update the existing balance calculation so that it uses the persisted participant shares.

For every expense:
member balance impact = amount paid by the member - member's actual share of the expense

Ensure that custom splits work correctly with the existing balance calculation and the debt minimization engine.
Do not modify the debt minimization algorithm unless the new share representation requires it.

## Testing strategy

Create an exhaustive testing strategy centered around the mathematical invariant.

### Unit tests
Test:
- Equal splitting.
- Exact amount splitting.
- Percentage splitting.
- Exact amount conservation.
- Percentage conservation.
- Rounding behavior.
- One-cent differences.
- Zero shares.
- Single participant / 100% share.
- Negative values.
- Missing participant values.
- Invalid percentages.
- Percentages above 100%.
- Percentages below 100%.
- Decimal percentages.
- Very small amounts.
- Multiple participants.
- Large monetary amounts where supported.

Include adversarial cases specifically designed to expose floating-point precision problems.
For every valid split, test:
sum(shares) == expense amount
using the application's exact monetary representation.

### API tests
Test:
- Valid equal expense.
- Valid exact split.
- Valid percentage split.
- Invalid exact split whose sum differs from the total.
- Invalid percentage split whose sum differs from 100%.
- Invalid negative values.
- Invalid/missing participant shares.
- Correct validation responses.
- Invalid requests are not persisted.
- Persisted shares are returned correctly.

### Integration tests
Verify that:
Expense creation → persisted shares → balances
produces the expected member balances.

Also verify:
Expense creation → balances → debt minimization
continues to work correctly with custom splits.

### Frontend tests
Test observable behavior including:
- Switching split modes.
- Rendering the appropriate inputs.
- Real-time validation.
- Remaining amount/percentage calculation.
- Invalid split preventing submission.
- Valid split enabling submission.
- Participant additions/removals.
- Expense amount changes.
- Displaying backend validation errors.
- Successful creation and balance refresh.

Prefer behavior-focused tests rather than testing internal React implementation details.

## Backward compatibility

Ensure existing expenses created using equal splits continue to behave correctly.
Do not require migration of historical data unless the existing data model makes it unavoidable.

## Architecture

Keep monetary/split calculation logic independent from FastAPI request handling where practical so it can be exhaustively unit tested.

The conceptual flow should remain:
Expense Input → Split Validation → Monetary Share Calculation → Persisted Expense Shares → Member Balances → Debt Minimization

The frontend may perform validation for immediate user feedback, but the backend remains the authoritative source of truth for all financial invariants.

## Scope control

Do not introduce:
- Payment processing.
- Settlement execution.
- New currencies.
- Split presets.
- Authentication.
- Notifications.
- Unrelated expense-management features.

The output should be a concrete technical implementation plan that can be converted into implementation tasks in the subsequent tasks phase.
Do not generate the individual implementation tasks yet.
```

---

## 3️⃣ `/speckit-tasks` Prompt

```text
/speckit-tasks
Generate atomic, dependency-ordered tasks for the Unequal / Custom Expense Splits feature grouped by User Story.
Ensure strict TDD ordering:
1. Backend schema validation & unit tests for exact and percentage penny conservation.
2. Backend balance calculation service updates with full edge-case tests (100% path coverage).
3. API route integration tests.
4. Frontend split selector and real-time remainder allocation validation UI.
```

---

## 4️⃣ `/speckit-implement` Prompt

```text
/speckit-implement
Implement the Unequal / Custom Expense Splits feature on a dedicated branch adhering to Constitution v1.5.0:
- Checkout branch feature/issue-custom-splits.
- Follow TDD, ensuring 100% path coverage on backend/src/services/balance_service.py.
- Create 1:1 atomic commits per task (T###).
- Push the branch and open a GitHub Pull Request referencing the issue.
```
