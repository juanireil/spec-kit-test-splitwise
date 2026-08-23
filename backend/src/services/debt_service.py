from decimal import Decimal
from typing import List
from backend.src.models.member import MemberBalance
from backend.src.models.settlement import SettlementTransaction, SettlementPlanResponse


class DebtSimplificationService:
    @classmethod
    def simplify_debts(cls, balances: List[MemberBalance]) -> SettlementPlanResponse:
        """
        Transforms member balances into a minimal set of direct settlement transactions
        using a greedy matching algorithm between largest remaining debtors and creditors.
        Guarantees exact penny conservation and at most N-1 transactions.
        """
        # Separate debtors (negative balance) and creditors (positive balance)
        # Store as mutable lists of [member_id, member_name, remaining_amount]
        debtors = []
        creditors = []

        for b in balances:
            if b.balance < Decimal("0.00"):
                debtors.append({
                    "id": b.member_id,
                    "name": b.member_name,
                    "amount": abs(b.balance)
                })
            elif b.balance > Decimal("0.00"):
                creditors.append({
                    "id": b.member_id,
                    "name": b.member_name,
                    "amount": b.balance
                })

        # Sort debtors and creditors descending by amount for greedy matching
        debtors.sort(key=lambda d: d["amount"], reverse=True)
        creditors.sort(key=lambda c: c["amount"], reverse=True)

        transactions: List[SettlementTransaction] = []
        total_settled = Decimal("0.00")

        d_idx = 0
        c_idx = 0

        while d_idx < len(debtors) and c_idx < len(creditors):
            debtor = debtors[d_idx]
            creditor = creditors[c_idx]

            payment = min(debtor["amount"], creditor["amount"])

            if payment > Decimal("0.00"):
                transactions.append(
                    SettlementTransaction(
                        from_member_id=debtor["id"],
                        from_member_name=debtor["name"],
                        to_member_id=creditor["id"],
                        to_member_name=creditor["name"],
                        amount=payment,
                    )
                )
                total_settled += payment

                debtor["amount"] -= payment
                creditor["amount"] -= payment

            if debtor["amount"] == Decimal("0.00"):
                d_idx += 1
            if creditor["amount"] == Decimal("0.00"):
                c_idx += 1

        is_settled = len(transactions) == 0

        return SettlementPlanResponse(
            transactions=transactions,
            total_settled_amount=total_settled,
            transaction_count=len(transactions),
            is_settled=is_settled,
        )
