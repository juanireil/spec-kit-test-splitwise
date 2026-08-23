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


def test_get_settlements_initial_state_empty(client):
    res = client.get("/api/settlements")
    assert res.status_code == 200
    data = res.json()
    assert data["is_settled"] is True
    assert data["transaction_count"] == 0
    assert len(data["transactions"]) == 0
    assert Decimal(str(data["total_settled_amount"])) == Decimal("0.00")


def test_get_settlements_after_recording_expense(client):
    # Alice pays $90 for Alice, Bob, Charlie ($30 each)
    client.post(
        "/api/expenses",
        json={
            "amount": 90.00,
            "payer_id": "alice",
            "participant_ids": ["alice", "bob", "charlie"],
        },
    )

    res = client.get("/api/settlements")
    assert res.status_code == 200
    data = res.json()
    assert data["is_settled"] is False
    assert data["transaction_count"] == 2
    assert Decimal(str(data["total_settled_amount"])) == Decimal("60.00")

    txs = data["transactions"]
    assert len(txs) == 2
    for tx in txs:
        assert tx["to_member_id"] == "alice"
        assert Decimal(str(tx["amount"])) == Decimal("30.00")
