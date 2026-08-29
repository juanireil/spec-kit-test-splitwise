from decimal import Decimal

from backend.src.models.member import MemberBalance
from backend.src.services.debt_service import DebtSimplificationService


def test_empty_balances_all_settled():
    balances = []
    plan = DebtSimplificationService.simplify_debts(balances)
    assert plan.is_settled is True
    assert plan.transaction_count == 0
    assert len(plan.transactions) == 0
    assert plan.total_settled_amount == Decimal("0.00")


def test_all_zero_balances_settled():
    balances = [
        MemberBalance(member_id="alice", member_name="Alice", balance=Decimal("0.00"), status="settled"),
        MemberBalance(member_id="bob", member_name="Bob", balance=Decimal("0.00"), status="settled"),
        MemberBalance(member_id="charlie", member_name="Charlie", balance=Decimal("0.00"), status="settled"),
    ]
    plan = DebtSimplificationService.simplify_debts(balances)
    assert plan.is_settled is True
    assert plan.transaction_count == 0
    assert len(plan.transactions) == 0
    assert plan.total_settled_amount == Decimal("0.00")


def test_story_example_two_debtors_one_creditor():
    # Alice: +10.00, Bob: -5.00, Charlie: -5.00
    balances = [
        MemberBalance(member_id="alice", member_name="Alice", balance=Decimal("10.00"), status="owed"),
        MemberBalance(member_id="bob", member_name="Bob", balance=Decimal("-5.00"), status="owes"),
        MemberBalance(member_id="charlie", member_name="Charlie", balance=Decimal("-5.00"), status="owes"),
        MemberBalance(member_id="david", member_name="David", balance=Decimal("0.00"), status="settled"),
    ]
    plan = DebtSimplificationService.simplify_debts(balances)
    assert plan.is_settled is False
    assert plan.transaction_count == 2
    assert plan.total_settled_amount == Decimal("10.00")

    txs = plan.transactions
    assert all(tx.to_member_id == "alice" for tx in txs)
    payers = {tx.from_member_id: tx.amount for tx in txs}
    assert payers["bob"] == Decimal("5.00")
    assert payers["charlie"] == Decimal("5.00")


def test_cascading_multi_creditor_multi_debtor():
    # Alice: +60.00, Bob: -15.00, Charlie: -45.00
    balances = [
        MemberBalance(member_id="alice", member_name="Alice", balance=Decimal("60.00"), status="owed"),
        MemberBalance(member_id="bob", member_name="Bob", balance=Decimal("-15.00"), status="owes"),
        MemberBalance(member_id="charlie", member_name="Charlie", balance=Decimal("-45.00"), status="owes"),
    ]
    plan = DebtSimplificationService.simplify_debts(balances)
    assert plan.transaction_count == 2
    assert plan.total_settled_amount == Decimal("60.00")

    # Charlie owes 45 -> pays 45 to Alice
    # Bob owes 15 -> pays 15 to Alice
    payers = {tx.from_member_id: tx.amount for tx in plan.transactions}
    assert payers["charlie"] == Decimal("45.00")
    assert payers["bob"] == Decimal("15.00")


def test_complex_circular_simplification():
    # A: +30, B: +20, C: -40, D: -10
    balances = [
        MemberBalance(member_id="a", member_name="A", balance=Decimal("30.00"), status="owed"),
        MemberBalance(member_id="b", member_name="B", balance=Decimal("20.00"), status="owed"),
        MemberBalance(member_id="c", member_name="C", balance=Decimal("-40.00"), status="owes"),
        MemberBalance(member_id="d", member_name="D", balance=Decimal("-10.00"), status="owes"),
    ]
    plan = DebtSimplificationService.simplify_debts(balances)
    # Total settled: 50.00
    assert plan.total_settled_amount == Decimal("50.00")
    # Number of transactions must be <= N - 1 (<= 3)
    assert plan.transaction_count <= 3

    # Invariant: Each debtor pays their exact debt
    paid = {}
    received = {}
    for tx in plan.transactions:
        paid[tx.from_member_id] = paid.get(tx.from_member_id, Decimal("0.00")) + tx.amount
        received[tx.to_member_id] = received.get(tx.to_member_id, Decimal("0.00")) + tx.amount

    assert paid["c"] == Decimal("40.00")
    assert paid["d"] == Decimal("10.00")
    assert received["a"] == Decimal("30.00")
    assert received["b"] == Decimal("20.00")


def test_fractional_cent_debts_minimization():
    # Alice: +66.66, Bob: -33.33, Charlie: -33.33
    balances = [
        MemberBalance(member_id="alice", member_name="Alice", balance=Decimal("66.66"), status="owed"),
        MemberBalance(member_id="bob", member_name="Bob", balance=Decimal("-33.33"), status="owes"),
        MemberBalance(member_id="charlie", member_name="Charlie", balance=Decimal("-33.33"), status="owes"),
    ]
    plan = DebtSimplificationService.simplify_debts(balances)
    assert plan.total_settled_amount == Decimal("66.66")
    assert plan.transaction_count == 2
    payers = {tx.from_member_id: tx.amount for tx in plan.transactions}
    assert payers["bob"] == Decimal("33.33")
    assert payers["charlie"] == Decimal("33.33")
