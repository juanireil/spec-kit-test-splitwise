import threading
import uuid
from datetime import datetime, timezone

from backend.src.models.expense import Expense, ExpenseCreate
from backend.src.models.member import Member


class InMemoryExpenseRepository:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._members: dict[str, Member] = {}
        self._expenses: list[Expense] = []
        self._seed_default_members()

    def _seed_default_members(self) -> None:
        default_members = [
            Member(id="alice", name="Alice"),
            Member(id="bob", name="Bob"),
            Member(id="charlie", name="Charlie"),
            Member(id="david", name="David"),
        ]
        for m in default_members:
            self._members[m.id] = m

    def get_members(self) -> list[Member]:
        with self._lock:
            return list(self._members.values())

    def get_member_by_id(self, member_id: str) -> Member | None:
        with self._lock:
            return self._members.get(member_id)

    def add_expense(self, expense_create: ExpenseCreate) -> Expense:
        with self._lock:
            expense = Expense(
                id=f"exp-{uuid.uuid4().hex[:8]}",
                amount=expense_create.amount,
                payer_id=expense_create.payer_id,
                participant_ids=expense_create.participant_ids,
                created_at=datetime.now(timezone.utc),
            )
            self._expenses.append(expense)
            return expense

    def get_expenses(self) -> list[Expense]:
        with self._lock:
            return list(self._expenses)

    def reset_expenses(self) -> None:
        """Helper for testing isolated scenarios."""
        with self._lock:
            self._expenses.clear()


# Global singleton instance
repository = InMemoryExpenseRepository()
