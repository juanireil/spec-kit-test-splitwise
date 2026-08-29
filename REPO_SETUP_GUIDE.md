# Repository Setup, GitHub Governance & Spec Kit Quickstart

This guide contains step-by-step instructions for instructors, teaching assistants, and students to configure the complete development environment: **System Prerequisites**, **Antigravity CLI**, **GitHub MCP Server**, **GitHub Projects Board**, **Spec Kit installation**, **Automated CI/CD Pipelines**, **Branch Protection Rules**, and **Copilot Code Reviews**.

---

## 1. System Prerequisites & Package Managers

Before installing Antigravity and Spec Kit, ensure your machine has the following baseline runtimes and package managers:

### A. Python & `uv` (Fast Python Package Manager)
- **Python 3.10+**: Ensure Python is installed (`python3 --version`).
- **`uv`**: The recommended modern toolchain for Python tools and virtual environments.
  ```bash
  # Linux/macOS
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```

### B. Node.js & `npx` (Required for GitHub MCP Server)
- **Node.js (v18+) & npm/npx**: Required to run `@modelcontextprotocol/server-github`.
  ```bash
  node --version
  npx --version
  ```
  *(If missing, install via [NodeJS.org](https://nodejs.org) or `nvm`)*.

### C. Git & GitHub CLI (Optional but Recommended)
- **Git**: Ensure Git is configured with your name and email (`git config --global user.name "..."`).

---

## 2. Google Antigravity CLI Installation & GitHub MCP Server

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

1. Generate a **GitHub Personal Access Token (Classic or Fine-grained)** with `repo` and `project` permissions:
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

## 3. Creating a GitHub Project & Board for Issue Tracking

To visually track sprint backlog items and tasks synchronized by `/speckit-taskstoissues`:

1. Navigate to **Projects** tab in your GitHub repository:
   - `https://github.com/<owner>/<repo>/projects`
2. Click **"New Project"** and select the **"Board"** template (or **"Team backlog"**).
3. Name the project (e.g. `SplitWise Lite - Sprint Backlog`).
4. Configure columns: `Todo`, `In Progress`, `In Review`, `Done`.
5. *(Optional automation)*: In Project settings, enable auto-add workflows so newly created issues in the repository automatically land in the `Todo` column.

---

## 4. Spec Kit Installation & Project Initialization

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

## 5. Git Hooks & Extension Configuration (`.specify/extensions.yml`)

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

## 6. Automated CI/CD Pipeline Setup (`.github/workflows/ci.yml`)

To satisfy **Constitution Principle XII** (Automated CI/CD & Green Build Gating), create a `.github/workflows/ci.yml` file in your repository:

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend-checks:
    name: Backend Lint & Tests
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt
          pip install ruff

      - name: Run Ruff Linter
        run: |
          ruff check backend

      - name: Run Pytest Suite with Coverage
        env:
          PYTHONPATH: .
        run: |
          python -m pytest backend/tests --cov=backend/src --cov-report=term-missing --cov-fail-under=90

  frontend-checks:
    name: Frontend Build & Type Check
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm install

      - name: Verify Production Build
        working-directory: frontend
        run: npm run build
```

> **CI Best Practice**: Use `npm install` (instead of `npm ci`) in workflows if student teams use different minor versions of Node/npm across their personal laptops to avoid lockfile version mismatch failures.

---

## 7. Hard-Blocking Direct Pushes to `main` (Branch Protection)

To enforce **Constitution Principle V & XII** (all code must flow through dedicated story branches and PRs):

1. Navigate to **Settings** $\rightarrow$ **Branches** in your GitHub repository:
   - `https://github.com/<owner>/<repo>/settings/branches`
2. Under **Branch protection rules**, click **"Add rule"** (or **"Add branch ruleset"**).
3. Set **Branch name pattern** to `main`.
4. Configure the following mandatory protections:
   - ✅ **Require a pull request before merging**:
     - Check **Require approvals** and set count to `1` (enforces Principle VIII: Four-Eyes Review).
     - Check **Dismiss stale pull request approvals when new commits are pushed**.
   - ✅ **Require status checks to pass before merging**:
     - Check **Require branches to be up to date before merging**.
     - Search and add status checks: `Backend Lint & Tests` and `Frontend Build & Type Check`.
   - ✅ **Do not allow bypassing the above settings** *(CRITICAL: Prevents repository admins and owners from accidentally bypassing the rule via direct git push)*.
   - ✅ **Block force pushes** & **Block branch deletions**.
5. Click **"Save changes"** / **"Create"**.

> **Note on Admin Bypass**: If you are able to push directly to `main` despite having protection enabled, ensure **"Include administrators"** / **"Do not allow bypassing"** is checked, and verify that the **Bypass list** in Rulesets is set to **None**.

---

## 8. Configuring GitHub Copilot Code Reviews on PRs

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

## 9. Complete End-to-End Student Workflow

```text
 1. Prerequisites:    Python 3.10+ + uv + Node.js (v18+) + npx + git
 2. Tooling Setup:    Install agy CLI + Add GitHub MCP server + Create GitHub Project Board
 3. Project Init:     specify init .
 4. Ratify Rules:     /speckit-constitution
 5. Specify & Plan:   /speckit-specify -> /speckit-clarify -> /speckit-plan -> /speckit-tasks
 6. Issue Sync:       /speckit-taskstoissues (via GitHub MCP onto Project Board)
 7. Implement:        /speckit-implement (1 story branch at a time, atomic commits)
 8. Review & Merge:   Copilot & Peer Review -> Green CI/CD Status Checks -> Merge to main
 9. QA Audit:         /speckit-converge
```
