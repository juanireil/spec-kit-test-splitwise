from decimal import Decimal
from typing import Dict, List
from backend.src.models.member import Member, MemberBalance, BalanceSheetResponse
from backend.src.models.expense import Expense


class BalanceService:
    @staticmethod
    def split_amount_equally(amount: Decimal, participant_ids: List[str]) -> Dict[str, Decimal]:
        """
        Splits a monetary amount equally among participants with exact penny precision.
        Remainder cents are assigned to the first R participants in order, guaranteeing
        that sum(shares) == amount down to the exact cent.
        """
        if not participant_ids:
            raise ValueError("Participant list cannot be empty")

        total_cents = int(amount * 100)
        n = len(participant_ids)
        base_share_cents = total_cents // n
        remainder_cents = total_cents % n

        shares: Dict[str, Decimal] = {}
        for index, participant_id in enumerate(participant_ids):
            extra_cent = 1 if index < remainder_cents else 0
            participant_cents = base_share_cents + extra_cent
            shares[participant_id] = Decimal(participant_cents) / Decimal(100)

        return shares

    @classmethod
    def calculate_balances(cls, members: List[Member], expenses: List[Expense]) -> BalanceSheetResponse:
        """
        Calculates each member's net balance: Total Paid - Total Owed.
        Status is determined as 'owed' (>0), 'owes' (<0), or 'settled' (==0).
        Guarantees zero-sum invariant across the entire group.
        """
        paid_map: Dict[str, Decimal] = {m.id: Decimal("0.00") for m in members}
        owed_map: Dict[str, Decimal] = {m.id: Decimal("0.00") for m in members}
        total_expenses = Decimal("0.00")

        for expense in expenses:
            total_expenses += expense.amount
            if expense.payer_id in paid_map:
                paid_map[expense.payer_id] += expense.amount

            split_shares = cls.split_amount_equally(expense.amount, expense.participant_ids)
            for participant_id, share in split_shares.items():
                if participant_id in owed_map:
                    owed_map[participant_id] += share

        member_balances: List[MemberBalance] = []
        for m in members:
            net = paid_map.get(m.id, Decimal("0.00")) - owed_map.get(m.id, Decimal("0.00"))
            if net > Decimal("0.00"):
                status = "owed"
            elif net < Decimal("0.00"):
                status = "owes"
            else:
                status = "settled"

            member_balances.append(
                MemberBalance(
                    member_id=m.id,
                    member_name=m.name,
                    balance=net,
                    status=status,
                )
            )

        return BalanceSheetResponse(
            balances=member_balances,
            total_group_expenses=total_expenses,
        )
