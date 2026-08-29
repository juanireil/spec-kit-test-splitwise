from datetime import datetime, timezone
from decimal import Decimal

import pytest

from backend.src.models.expense import Expense
from backend.src.models.member import Member
from backend.src.services.balance_service import BalanceService


@pytest.fixture
def standard_members():
    return [
        Member(id="alice", name="Alice"),
        Member(id="bob", name="Bob"),
        Member(id="charlie", name="Charlie"),
        Member(id="david", name="David"),
    ]


def test_initial_balances_all_zero_and_settled(standard_members):
    balance_sheet = BalanceService.calculate_balances(standard_members, [])
    assert len(balance_sheet.balances) == 4
    assert balance_sheet.total_group_expenses == Decimal("0.00")
    for b in balance_sheet.balances:
        assert b.balance == Decimal("0.00")
        assert b.status == "settled"


def test_equal_split_three_members_story_example(standard_members):
    # Alice pays $90 for Alice, Bob, Charlie ($30 each)
    # Alice: +$60.00, Bob: -$30.00, Charlie: -$30.00, David: $0.00
    expenses = [
        Expense(
            id="exp-1",
            amount=Decimal("90.00"),
            payer_id="alice",
            participant_ids=["alice", "bob", "charlie"],
            created_at=datetime.now(timezone.utc),
        )
    ]
    sheet = BalanceService.calculate_balances(standard_members, expenses)
    balances = {b.member_id: b for b in sheet.balances}

    assert sheet.total_group_expenses == Decimal("90.00")
    assert balances["alice"].balance == Decimal("60.00")
    assert balances["alice"].status == "owed"

    assert balances["bob"].balance == Decimal("-30.00")
    assert balances["bob"].status == "owes"

    assert balances["charlie"].balance == Decimal("-30.00")
    assert balances["charlie"].status == "owes"

    assert balances["david"].balance == Decimal("0.00")
    assert balances["david"].status == "settled"

    # Conservation of balance invariant
    total_net = sum(b.balance for b in sheet.balances)
    assert total_net == Decimal("0.00")


def test_multiple_expenses_cumulative_balances(standard_members):
    # Exp 1: Alice pays $90 for Alice, Bob, Charlie
    # Exp 2: Bob pays $30 for Bob, Charlie ($15 each)
    # Alice: +60
    # Bob: -30 + (30 - 15) = -15
    # Charlie: -30 - 15 = -45
    # David: 0
    expenses = [
        Expense(
            id="exp-1",
            amount=Decimal("90.00"),
            payer_id="alice",
            participant_ids=["alice", "bob", "charlie"],
            created_at=datetime.now(timezone.utc),
        ),
        Expense(
            id="exp-2",
            amount=Decimal("30.00"),
            payer_id="bob",
            participant_ids=["bob", "charlie"],
            created_at=datetime.now(timezone.utc),
        ),
    ]
    sheet = BalanceService.calculate_balances(standard_members, expenses)
    balances = {b.member_id: b for b in sheet.balances}

    assert sheet.total_group_expenses == Decimal("120.00")
    assert balances["alice"].balance == Decimal("60.00")
    assert balances["bob"].balance == Decimal("-15.00")
    assert balances["charlie"].balance == Decimal("-45.00")
    assert balances["david"].balance == Decimal("0.00")

    total_net = sum(b.balance for b in sheet.balances)
    assert total_net == Decimal("0.00")


def test_payer_not_in_participants(standard_members):
    # Alice pays $50 entirely for Bob and Charlie ($25 each)
    # Alice: +50, Bob: -25, Charlie: -25
    expenses = [
        Expense(
            id="exp-1",
            amount=Decimal("50.00"),
            payer_id="alice",
            participant_ids=["bob", "charlie"],
            created_at=datetime.now(timezone.utc),
        )
    ]
    sheet = BalanceService.calculate_balances(standard_members, expenses)
    balances = {b.member_id: b for b in sheet.balances}

    assert balances["alice"].balance == Decimal("50.00")
    assert balances["alice"].status == "owed"
    assert balances["bob"].balance == Decimal("-25.00")
    assert balances["bob"].status == "owes"
    assert balances["charlie"].balance == Decimal("-25.00")
    assert balances["charlie"].status == "owes"

    total_net = sum(b.balance for b in sheet.balances)
    assert total_net == Decimal("0.00")


def test_sole_participant_payer_only(standard_members):
    # Alice pays $40 for only Alice -> balance change is 0
    expenses = [
        Expense(
            id="exp-1",
            amount=Decimal("40.00"),
            payer_id="alice",
            participant_ids=["alice"],
            created_at=datetime.now(timezone.utc),
        )
    ]
    sheet = BalanceService.calculate_balances(standard_members, expenses)
    balances = {b.member_id: b for b in sheet.balances}

    assert balances["alice"].balance == Decimal("0.00")
    assert balances["alice"].status == "settled"
    total_net = sum(b.balance for b in sheet.balances)
    assert total_net == Decimal("0.00")


def test_fractional_cent_distribution_three_ways(standard_members):
    # $100.00 split 3 ways -> 10000 cents / 3 = 3333 cents each, remainder 1 cent
    # First participant gets 33.34, others 33.33 -> sum is 100.00
    expenses = [
        Expense(
            id="exp-1",
            amount=Decimal("100.00"),
            payer_id="alice",
            participant_ids=["alice", "bob", "charlie"],
            created_at=datetime.now(timezone.utc),
        )
    ]
    sheet = BalanceService.calculate_balances(standard_members, expenses)
    balances = {b.member_id: b for b in sheet.balances}

    # Alice paid 100.00, owed 33.34 -> balance +66.66
    # Bob owed 33.33 -> balance -33.33
    # Charlie owed 33.33 -> balance -33.33
    assert balances["alice"].balance == Decimal("66.66")
    assert balances["bob"].balance == Decimal("-33.33")
    assert balances["charlie"].balance == Decimal("-33.33")

    total_net = sum(b.balance for b in sheet.balances)
    assert total_net == Decimal("0.00")


def test_split_shares_calculation_direct():
    shares = BalanceService.split_amount_equally(Decimal("10.00"), ["alice", "bob", "charlie"])
    assert sum(shares.values()) == Decimal("10.00")
    assert shares["alice"] == Decimal("3.34")
    assert shares["bob"] == Decimal("3.33")
    assert shares["charlie"] == Decimal("3.33")


def test_split_empty_participants_raises():
    with pytest.raises(ValueError, match="Participant list cannot be empty"):
        BalanceService.split_amount_equally(Decimal("50.00"), [])
