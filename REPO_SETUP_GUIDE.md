# Repository Setup, GitHub Governance & Spec Kit Quickstart

This guide contains step-by-step instructions for instructors, teaching assistants, and students to configure the complete development environment: **Antigravity CLI**, **GitHub MCP Server**, **Spec Kit installation**, **branch protection rules**, and **Copilot automated code reviews**.

---

## 1. Google Antigravity CLI Installation & GitHub MCP Server

[Google Antigravity CLI (`agy`)](https://antigravity.google) is an AI-first pair programming CLI.

### Installation
Install the Antigravity CLI globally using the official installer:
```bash
curl -fsSL https://antigravity.google/install.sh | bash
```
Verify the installation:
```bash
agy --help
```

### Adding the GitHub MCP Server
To allow Antigravity to create issues, query pull requests, search commits, and manage the repository using GitHub's Model Context Protocol (MCP):

1. Generate a **GitHub Personal Access Token (Classic or Fine-grained)** with `repo` permissions:
   - GitHub $\rightarrow$ **Settings** $\rightarrow$ **Developer Settings** $\rightarrow$ **Personal Access Tokens**.
2. Run the `agy mcp add` command:
   ```bash
   agy mcp add --env GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here" github-mcp-server npx -y @modelcontextprotocol/server-github
   ```
   *(Alternatively, using Docker)*:
   ```bash
   agy mcp add --env GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here" github-mcp-server -- docker run -i -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/mcp-server-github:latest
   ```
3. Verify the MCP server is configured:
   ```bash
   agy mcp list
   ```

---

## 2. Spec Kit Installation & Project Initialization

[Spec Kit](https://github.com/github/spec-kit) is an open-source framework by GitHub for Spec-Driven Development (SDD).

- **Official GitHub Repository**: [https://github.com/github/spec-kit](https://github.com/github/spec-kit)
- **Official Quickstart Documentation**: [https://github.github.io/spec-kit/quickstart.html](https://github.github.io/spec-kit/quickstart.html)

### Installation (via `uv` or `pip`)
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

## 3. Git Hooks & Extension Configuration (`.specify/extensions.yml`)

Ensure that the Git lifecycle hook extension is enabled so that feature branches and commits are created automatically by Spec Kit:

Check or create `.specify/extensions.yml`:
```yaml
hooks:
  before_specify:
    - extension: git
      command: speckit.git.branch
      description: "Auto-create and checkout feature branch"
      optional: false
  after_tasks:
    - extension: git
      command: speckit.git.commit
      description: "Commit task breakdown"
      optional: true
  after_implement:
    - extension: git
      command: speckit.git.commit
      description: "Commit implemented increment"
      optional: true
```

---

## 4. Hard-Blocking Direct Pushes to `main` (Branch Protection)

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

## 5. Configuring GitHub Copilot Code Reviews on PRs

Configure automated code reviews focused strictly on code correctness, safety, and efficiency:

### Option A: Repository Copilot Settings (Web UI)
1. Go to repository **Settings** $\rightarrow$ **Copilot** $\rightarrow$ **Code Review** (or **Settings** $\rightarrow$ **Rules** $\rightarrow$ **Rulesets**).
2. Enable **"Automatic review of pull requests"**.
3. Under reviewers, ensure GitHub Copilot is permitted to submit review summaries and line-by-line comments.

### Option B: Copilot Instruction Rules File (`.github/instructions/code-review.instructions.md`)
Create or verify `.github/instructions/code-review.instructions.md` with targeted code-level standards:

```markdown
---
applyTo: "**/*.{ts,js,py,go,cs,java,rs}"
---

# Code Review Standards (Correctness, Safety & Performance)

When reviewing pull requests, focus strictly on code-level safety, correctness, efficiency, and maintainability:

1. **Correctness & Precision**: Exact numerical representations (Decimal/integer cents vs float drift), null-safety, and edge cases.
2. **Security & Defensive Code**: Zero hardcoded secrets, input sanitization, parameterized queries, and log hygiene.
3. **Reliability & Exception Handling**: Specific exception handling (no silent error swallowing) and safe resource cleanup.
4. **Algorithmic Efficiency**: Avoid unnecessary $O(N^2)$ loops and eliminate N+1 database query patterns.
5. **Code Maintainability**: Single-responsibility functions, zero debug artifacts (`console.log`, `print()`), and no dead code.
```

---

## 6. Complete End-to-End Student Workflow

```text
 1. Tooling Setup:    Install agy CLI + Add GitHub MCP server + Install specify-cli
 2. Project Init:     specify init .
 3. Ratify Rules:     /speckit-constitution
 4. Specify & Plan:   /speckit-specify -> /speckit-clarify -> /speckit-plan -> /speckit-tasks
 5. Issue Sync:       /speckit-taskstoissues (via GitHub MCP)
 6. Implement:        /speckit-implement (1 story branch at a time, atomic commits)
 7. Review & Merge:   Copilot & Peer Review -> Green CI/CD -> Merge to main
 8. QA Audit:         /speckit-converge
```
