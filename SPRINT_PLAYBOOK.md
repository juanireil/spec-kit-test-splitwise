# 🏃 Multi-Team Sprint Playbook: From Lean Inception to Spec-Driven Development

This playbook guides student teams of 6 developers across 6 sprints on how to translate **Lean Inception User Story Maps** into parallel, conflict-free **Spec-Driven Development (SDD)** cycles using GitHub Spec Kit.

---

## 1. Bridging Lean Inception to Spec-Driven Development

In modern agile software engineering, projects do not start from blank prompts. They begin with **Lean Inception**, where the team collaboratively builds a **User Story Map** organized into delivery waves (MVP, Growth, Scale).

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                    MACRO LEVEL: PRODUCT BACKLOG                        │
 │           Lean Inception User Story Map (All 6 Sprints)                │
 └───────┬──────────────────┬──────────────────┬──────────────────┬───────┘
         │                  │                  │                  │
         ▼                  ▼                  ▼                  ▼
    Sprint 1/2         Sprint 3           Sprint 4           Sprint 5/6
   Wave 1 (MVP)      Wave 2 (Growth)    Wave 3 (Scale)     Wave 4 (Polish)
         │
         ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                  MICRO LEVEL: SPEC KIT SPRINT LIFECYCLE                │
 │         /speckit-specify ──► /speckit-plan ──► /speckit-tasks         │
 │                        (1 Feature per Iteration)                       │
 └────────────────────────────────────────────────────────────────────────┘
```

---

### Practical Example: Converting a User Story Map into a Feature Spec

Suppose your team finishes a Lean Inception for **SplitWise Lite**. In the **Sprint 1 MVP Wave**, your board contains 3 user story cards under the *Expenses Activity*:

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             LEAN INCEPTION USER STORY CARDS                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Card 1: "As a group member, I want to record a paid expense with multiple        │
│          participants so everyone knows who paid."                               │
│                                                                                  │
│ Card 2: "As a member, I want the system to divide the expense equally among     │
│          participants with zero fractional-cent drift."                          │
│                                                                                  │
│ Card 3: "As a member, I want to see a live balance sheet showing who owes whom." │
└──────────────────────────────────────────────────────────────────────────────────┘
```

#### How to Feed this into `/speckit-specify`:
Instead of writing a vague prompt, the team takes these 3 Lean Inception cards and passes them directly to `/speckit-specify`:

```text
/speckit-specify
Feature: Shared Expense Entry & Live Balance Calculation
Source: Lean Inception MVP Wave 1 (Cards 1, 2, 3)

Scope:
- US1 (P1): Record an expense with a payer, total amount, and participant list.
- US2 (P1): Calculate equal split shares with exact penny conservation (sum of shares == total).
- US3 (P1): Compute live net balances for all group members (total paid - total owed).

Non-Goals / Out of Scope for this Sprint:
- No percentage splits, no receipt scanning, no persistent database (in-memory only).
```

Spec Kit automatically expands these cards into structured functional requirements (`FR-###`), acceptance criteria, and domain invariants inside `specs/001-expense-entry/spec.md`!

---

## 2. Multi-Pair Sprint Execution Routine (Teams of 6)

With a team of 6 developers, you cannot plan or build a semester's worth of scope in a single monolithic pass. Work is divided across **3 pairs**:

```text
  Team of 6 Developers (3 Pairs)
  ├── Pair 1 (Dev A & B) ──► Feature Spec 003 (e.g. Category Tagging & Filter)
  ├── Pair 2 (Dev C & D) ──► Feature Spec 004 (e.g. Activity Search & Export)
  └── Pair 3 (Dev E & F) ──► Feature Spec 005 (e.g. Custom Currency Support)
```

### The Sprint Planning Routine:
1. **Synchronous Alignment (First 30–45 min of Sprint)**:
   - Team reviews the current Lean Inception wave.
   - Slices the sprint goal into 2–3 distinct vertical feature specifications.
   - Assigns pairs to features and pre-allocates spec directory numbers (`003`, `004`, `005`).
2. **Asynchronous Parallel Execution**:
   - Each pair executes their own Spec Kit lifecycle (`specify` $\rightarrow$ `plan` $\rightarrow$ `tasks` $\rightarrow$ `implement`) on dedicated branches.
3. **Cross-Pair Peer Review (Four-Eyes Principle)**:
   - Pairs review each other's PRs against Constitution quality gates before merging to `main`.

---

## 3. Concurrency & Collision Prevention in Multi-Pair Teams

When multiple pairs begin work simultaneously, teams must manage **Domain Slicing** and **Spec Directory Collision**:

### 1. Vertical Slicing & Contract-First Dependencies
- **Vertical Domain Slices**: Slices should touch distinct subdomains (e.g. Member Management vs Expense Splitting vs PDF Export) to allow truly parallel work.
- **Contract-First Mocking**: If Pair 2 depends on an API being built by Pair 1, both pairs agree on the OpenAPI contract (`contracts/openapi.json`) during Sprint Planning. Pair 2 codes against the mock schema while Pair 1 implements the backend service, eliminating blocking bottlenecks.

### 2. Preventing Spec Directory Collisions
If two pairs invoke `/speckit-specify` at the exact same moment from `main`, they might both attempt to create `specs/003-...`. Teams can prevent collisions using two options:

- **Option A: Pre-Allocated Feature Directory (Recommended for PM)**:
  During Sprint Planning, assign the feature number upfront. Students pass the explicit directory parameter when specifying:
  ```markdown
  /speckit-specify SPECIFY_FEATURE_DIRECTORY=specs/003-custom-splits Define the spec for...
  ```
- **Option B: Timestamp-Based Numbering**:
  Configure `.specify/init-options.json` with `"feature_numbering": "timestamp"`. Spec Kit will generate collision-proof directories like `specs/20260824-101500-custom-splits` using unique second-level timestamps.

---

## 4. Governance Checklist for Student Pull Requests

Before asking a peer to review your PR, ensure:
- [ ] **Single-Story Scope**: PR only implements the targeted User Story.
- [ ] **100% Path Coverage**: Pytest coverage on financial math is 100%.
- [ ] **Green CI/CD Pipeline**: GitHub Actions reports green on all test and build checks.
- [ ] **Traceability**: PR description includes `closes #<IssueID>`.
- [ ] **Precedent Merged**: Any preceding dependent story is already merged into `main`.
