# SplitWise Lite

A minimal, zero-setup shared expense-splitting and debt minimization application built with **FastAPI** and **React + Vite + Tailwind CSS**, designed as an educational reference implementation for **Spec-Driven Development (SDD)** with GitHub Spec Kit and AI coding agents.

---

## 📚 Course & Development Guides

For instructors, teaching assistants, and students, refer to these dedicated documentation guides:

1. **🛠️ [Repository & Environment Setup Guide](REPO_SETUP_GUIDE.md)**:
   - System prerequisites (`Python 3.10+`, `uv`, `Node.js 18+`, `npx`).
   - Installing **Google Antigravity CLI (`agy`)** and configuring the **GitHub MCP Server**.
   - **Spec Kit** installation and project initialization.
   - Setting up **Automated CI/CD Pipelines** (`.github/workflows/ci.yml`), **Branch Protection Rules**, and **Copilot Code Reviews**.

2. **🎓 [60-Minute Class & Live Demo Guide](CLASS_LESSON_PLAN.md)**:
   - Complete 60-minute practical lesson roadmap with timing breakdowns.
   - **10 Core Spec Kit Commands Reference** with copy-pasteable prompt examples and DO/DON'T rules.
   - **3 Golden Rules** & **4 Anti-Patterns** of Agentic Pair Programming.
   - Step-by-step live demo script (Specifying, Planning, TDD Implementation, PR Review, and Green CI/CD Gating).
   - In-depth appendix on **Spec Kit Presets** and **Extensions** (`assess` & `bug`).

3. **🏃 [Multi-Team Sprint Playbook](SPRINT_PLAYBOOK.md)**:
   - How to bridge **Lean Inception User Story Maps** into actionable feature specifications (`/speckit-specify`).
   - Sprint routine for **teams of 6 developers** running 3 parallel pairs.
   - Vertical domain slicing, OpenAPI contract mocking, and directory collision prevention.
   - Student Pull Request governance checklist.

4. **📜 [Project Constitution](.specify/memory/constitution.md)**:
   - Non-negotiable engineering principles, mathematical conservation invariants, and formal Definition of Ready (DoR) and Definition of Done (DoD) quality gates.

---

## Architecture & Features Built

- **Iteration 01 (MVP) - Expense Tracking & Live Balances**:
  - Record shared expenses with equal splitting and exact fractional cent distribution.
  - Live balance sheet computing net financial positions (`Total Paid - Total Owed`).
  - Strict preservation of the zero-sum group conservation invariant ($\sum \text{Balances} = \$0.00$).

- **Iteration 02 - Debt Minimization Engine & Visual Graphs**:
  - Greedy settlement minimization algorithm reducing debts to at most $N - 1$ direct transactions.
  - Interactive SVG-based directed graph rendering nodes (debtors in red, creditors in green) and payment arrows with exact dollar badges.
  - Real-time automatic recalculation and graph re-rendering upon expense creation.

---

## Quickstart

### 1. Run Backend
```bash
# In repository root
pip install -r backend/requirements.txt
python3 -m uvicorn backend.src.main:app --reload --port 8000
```
Interactive API documentation: `http://localhost:8000/docs`.

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Running Tests & Linters

Run the full backend test suite with coverage enforcement:
```bash
python3 -m pytest backend/tests --cov=backend/src --cov-report=term-missing
```
**Test Status**: 23/23 tests passing with 100% path coverage on core math (`balance_service.py` and `debt_service.py`).

Run the Ruff linter:
```bash
ruff check backend
```
