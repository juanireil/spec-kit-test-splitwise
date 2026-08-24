# Repository Setup, GitHub Governance & Spec Kit Quickstart

This guide contains step-by-step instructions for instructors, teaching assistants, and students to configure repository governance, branch protections, Copilot automatic code reviews, and Spec Kit installation.

---

## 1. Spec Kit Installation & Initialization

[Spec Kit](https://github.com/github/spec-kit) is an open-source framework by GitHub for Spec-Driven Development (SDD).

- **Official GitHub Repository**: [https://github.com/github/spec-kit](https://github.com/github/spec-kit)
- **Official Quickstart Documentation**: [https://github.github.io/spec-kit/quickstart.html](https://github.github.io/spec-kit/quickstart.html)

### Installation (via `uv`)
Install the Spec Kit CLI globally using `uv` (recommended):
```bash
uv tool install specify-cli
```
*(Alternatively, via pip)*:
```bash
pip install specify-cli
```

### Initializing a Project
To initialize Spec Kit in a new directory:
```bash
specify init taskify
```
To initialize Spec Kit in your **current working directory**:
```bash
specify init .
```

---

## 2. Hard-Blocking Direct Pushes to `main` (Branch Protection)

To enforce **Constitution Principle V & XII** (all code must flow through dedicated story branches and PRs):

1. Navigate to **Settings** $\rightarrow$ **Branches** in your GitHub repository:
   - `https://github.com/<owner>/<repo>/settings/branches`
2. Under **Branch protection rules**, click **"Add rule"** (or **"Add branch ruleset"**).
3. Set **Branch name pattern** to `main`.
4. Configure the following mandatory protections:
   - ✅ **Require a pull request before merging**:
     - Check **Require approvals** and set count to `1` (enforces Principle VIII: Four-Eyes Review).
     - Check **Dismiss stale pull request approvals when new commits are pushed**.
   - ✅ **Require status checks to pass before merging** (enforces CI/CD Green Build).
   - ✅ **Do not allow bypassing the above settings** *(CRITICAL: This prevents repository admins and owners from accidentally bypassing the rule via git push)*.
   - ✅ **Block force pushes** & **Block branch deletions**.
5. Click **"Save changes"** / **"Create"**.

> **Note on Admin Bypass**: If you are able to push directly to `main` despite having protection enabled, ensure **"Include administrators"** / **"Do not allow bypassing"** is checked, and verify that the **Bypass list** in Rulesets is set to **None**.

---

## 3. Configuring GitHub Copilot Automatic Code Reviews on PRs

You can configure GitHub Copilot to automatically review every opened Pull Request against project guidelines:

### Option A: Repository Copilot Settings (Web UI)
1. Go to repository **Settings** $\rightarrow$ **Copilot** $\rightarrow$ **Code Review** (or **Settings** $\rightarrow$ **Rules** $\rightarrow$ **Rulesets**).
2. Enable **"Automatic review of pull requests"**.
3. Under reviewers, ensure GitHub Copilot is permitted to submit review summaries and line-by-line comments.

### Option B: Copilot Instruction Rules File (`.github/copilot-instructions.md`)
Create a `.github/copilot-instructions.md` file in the root of your repository so Copilot automatically evaluates PRs against the project constitution:

```markdown
# GitHub Copilot Code Review Instructions

When reviewing Pull Requests in this repository, strictly enforce the following rules from `.specify/memory/constitution.md`:
1. **Single User Story Scope**: Ensure the PR only implements a single User Story and does not include unrequested features or premature optimizations (Anti-Gold-Plating).
2. **Test Coverage**: Verify that all financial calculations, balances, splits, and debt math include 100% path coverage unit tests.
3. **Traceability**: Ensure the PR description references a Task ID (`T###`) and an issue (`closes #<ID>`).
4. **Clean Code**: Ensure zero console logs, temporary print statements, or dead code.
```

---

## 4. Student Workflow Summary

```text
 1. Initialize:       uv tool install specify-cli && specify init .
 2. Ratify Rules:     /speckit-constitution
 3. Specify & Plan:   /speckit-specify -> /speckit-clarify -> /speckit-plan -> /speckit-tasks
 4. Issue Sync:       /speckit-taskstoissues
 5. Implement:        /speckit-implement (1 story branch at a time)
 6. Review & Merge:   Copilot & Peer Review -> Green CI/CD -> Merge to main
 7. QA Audit:         /speckit-converge
```
