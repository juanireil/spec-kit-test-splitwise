from decimal import Decimal

from backend.src.models.expense import Expense
from backend.src.models.member import BalanceSheetResponse, Member, MemberBalance


class BalanceService:
    @staticmethod
    def split_amount_equally(amount: Decimal, participant_ids: list[str]) -> dict[str, Decimal]:
        """
        Splits a monetary amount equally among participants with exact penny precision.
        Remainder cents are assigned to the first R participants in order, guaranteeing
        that sum(shares) == amount down to the exact cent.
        """
        if not participant_ids:
            raise ValueError("Participant list cannot be empty")

        total_cents = int(round(amount * 100))
        n = len(participant_ids)
        base_share_cents = total_cents // n
        remainder_cents = total_cents % n

        shares: dict[str, Decimal] = {}
        for index, participant_id in enumerate(participant_ids):
            extra_cent = 1 if index < remainder_cents else 0
            participant_cents = base_share_cents + extra_cent
            shares[participant_id] = Decimal(participant_cents) / Decimal(100)

        return shares

    @staticmethod
    def split_amount_exact(
        amount: Decimal, participant_ids: list[str], custom_shares: dict[str, Decimal]
    ) -> dict[str, Decimal]:
        """
        Validates and assigns exact monetary amounts per participant.
        Enforces non-negativity, participant completeness, and sum(shares) == amount.
        """
        if not participant_ids:
            raise ValueError("Participant list cannot be empty")

        shares: dict[str, Decimal] = {}
        for p_id in participant_ids:
            if p_id not in custom_shares:
                raise ValueError(f"Missing exact split share for participant: {p_id}")
            share_val = custom_shares[p_id]
            if share_val < Decimal("0.00"):
                raise ValueError(f"Share for member '{p_id}' cannot be negative")
            shares[p_id] = share_val

        total_shares = sum(shares.values())
        if total_shares != amount:
            raise ValueError(
                f"Sum of exact split shares (${total_shares:.2f}) does not equal expense amount (${amount:.2f})"
            )

        return shares

    @staticmethod
    def split_amount_percentages(
        amount: Decimal, participant_ids: list[str], custom_percentages: dict[str, Decimal]
    ) -> dict[str, Decimal]:
        """
        Converts percentages to exact monetary shares using the Largest Remainder Method (Hamilton Method).
        Enforces sum(percentages) == 100%, non-negativity, and exact penny conservation: sum(shares) == amount.
        """
        if not participant_ids:
            raise ValueError("Participant list cannot be empty")

        for p_id in participant_ids:
            if p_id not in custom_percentages:
                raise ValueError(f"Missing percentage split share for participant: {p_id}")
            pct = custom_percentages[p_id]
            if pct < Decimal("0.00"):
                raise ValueError(f"Percentage for member '{p_id}' cannot be negative")

        total_pct = sum(custom_percentages[p_id] for p_id in participant_ids)
        if total_pct != Decimal("100.00") and total_pct != Decimal("100"):
            raise ValueError(f"Sum of percentages ({total_pct}%) must equal exactly 100%")

        total_cents = int(round(amount * 100))

        base_cents_map: dict[str, int] = {}
        remainders: list[tuple[Decimal, int, str]] = []

        for index, p_id in enumerate(participant_ids):
            pct = custom_percentages[p_id]
            raw_cents = (Decimal(total_cents) * pct) / Decimal("100")
            base_cents = int(raw_cents)
            base_cents_map[p_id] = base_cents
            fractional = raw_cents - Decimal(base_cents)
            remainders.append((fractional, index, p_id))

        allocated_cents = sum(base_cents_map.values())
        leftover_cents = total_cents - allocated_cents

        # Largest remainder first, ties broken by original index order
        remainders.sort(key=lambda item: (-item[0], item[1]))

        for i in range(leftover_cents):
            p_id = remainders[i][2]
            base_cents_map[p_id] += 1

        shares: dict[str, Decimal] = {
            p_id: Decimal(base_cents_map[p_id]) / Decimal(100)
            for p_id in participant_ids
        }
        return shares

    @classmethod
    def calculate_balances(cls, members: list[Member], expenses: list[Expense]) -> BalanceSheetResponse:
        """
        Calculates each member's net balance: Total Paid - Total Owed.
        Status is determined as 'owed' (>0), 'owes' (<0), or 'settled' (==0).
        Guarantees zero-sum invariant across the entire group.
        """
        paid_map: dict[str, Decimal] = {m.id: Decimal("0.00") for m in members}
        owed_map: dict[str, Decimal] = {m.id: Decimal("0.00") for m in members}
        total_expenses = Decimal("0.00")

        for expense in expenses:
            total_expenses += expense.amount
            if expense.payer_id in paid_map:
                paid_map[expense.payer_id] += expense.amount

            split_shares = (
                expense.shares
                if expense.shares
                else cls.split_amount_equally(expense.amount, expense.participant_ids)
            )
            for participant_id, share in split_shares.items():
                if participant_id in owed_map:
                    owed_map[participant_id] += share

        member_balances: list[MemberBalance] = []
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
