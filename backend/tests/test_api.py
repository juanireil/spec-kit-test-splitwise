from decimal import Decimal

import pytest
from fastapi.testclient import TestClient

from backend.src.main import app
from backend.src.repositories.expense_repository import repository


@pytest.fixture(autouse=True)
def reset_store():
    repository.reset_expenses()


@pytest.fixture
def client():
    return TestClient(app)


def test_get_members(client):
    res = client.get("/api/members")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 4
    names = [m["name"] for m in data]
    assert "Alice" in names
    assert "Bob" in names


def test_create_expense_success_and_list(client):
    payload = {
        "amount": 90.00,
        "payer_id": "alice",
        "participant_ids": ["alice", "bob", "charlie"],
    }
    res = client.post("/api/expenses", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert Decimal(str(data["amount"])) == Decimal("90.00")
    assert data["payer_id"] == "alice"
    assert len(data["participant_ids"]) == 3

    # Check listing expenses
    list_res = client.get("/api/expenses")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1


def test_create_expense_invalid_payer(client):
    payload = {
        "amount": 90.00,
        "payer_id": "nonexistent_member",
        "participant_ids": ["alice", "bob"],
    }
    res = client.post("/api/expenses", json=payload)
    assert res.status_code == 400
    assert "Payer 'nonexistent_member' does not exist" in res.json()["detail"]


def test_create_expense_invalid_participant(client):
    payload = {
        "amount": 90.00,
        "payer_id": "alice",
        "participant_ids": ["alice", "ghost_user"],
    }
    res = client.post("/api/expenses", json=payload)
    assert res.status_code == 400
    assert "Participant 'ghost_user' does not exist" in res.json()["detail"]


def test_create_expense_zero_or_negative_amount(client):
    payload = {
        "amount": 0.00,
        "payer_id": "alice",
        "participant_ids": ["alice", "bob"],
    }
    res = client.post("/api/expenses", json=payload)
    assert res.status_code in [400, 422]


def test_create_expense_empty_participants(client):
    payload = {
        "amount": 50.00,
        "payer_id": "alice",
        "participant_ids": [],
    }
    res = client.post("/api/expenses", json=payload)
    assert res.status_code in [400, 422]


def test_get_balances_flow(client):
    # Initial state
    res = client.get("/api/balances")
    assert res.status_code == 200
    data = res.json()
    assert Decimal(str(data["total_group_expenses"])) == Decimal("0.00")
    for b in data["balances"]:
        assert b["status"] == "settled"

    # Add expense
    client.post(
        "/api/expenses",
        json={
            "amount": 90.00,
            "payer_id": "alice",
            "participant_ids": ["alice", "bob", "charlie"],
        },
    )

    # Updated balances
    res2 = client.get("/api/balances")
    assert res2.status_code == 200
    data2 = res2.json()
    b_map = {b["member_id"]: b for b in data2["balances"]}
    assert Decimal(str(b_map["alice"]["balance"])) == Decimal("60.00")
    assert b_map["alice"]["status"] == "owed"
    assert Decimal(str(b_map["bob"]["balance"])) == Decimal("-30.00")
    assert b_map["bob"]["status"] == "owes"
