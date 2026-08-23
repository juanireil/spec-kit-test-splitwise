from typing import List
from fastapi import APIRouter, HTTPException, status
from backend.src.models.member import Member, BalanceSheetResponse
from backend.src.models.expense import Expense, ExpenseCreate
from backend.src.repositories.expense_repository import repository
from backend.src.services.balance_service import BalanceService

router = APIRouter()


@router.get("/members", response_model=List[Member], summary="List group members")
def get_members():
    return repository.get_members()


@router.post("/expenses", response_model=Expense, status_code=status.HTTP_201_CREATED, summary="Record a shared expense")
def create_expense(expense_in: ExpenseCreate):
    # Validate payer exists
    payer = repository.get_member_by_id(expense_in.payer_id)
    if not payer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payer '{expense_in.payer_id}' does not exist in registered group members",
        )

    # Validate all participants exist
    for participant_id in expense_in.participant_ids:
        participant = repository.get_member_by_id(participant_id)
        if not participant:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Participant '{participant_id}' does not exist in registered group members",
            )

    return repository.add_expense(expense_in)


@router.get("/expenses", response_model=List[Expense], summary="List all recorded expenses")
def get_expenses():
    return repository.get_expenses()


@router.get("/balances", response_model=BalanceSheetResponse, summary="Get live member balances")
def get_balances():
    members = repository.get_members()
    expenses = repository.get_expenses()
    return BalanceService.calculate_balances(members, expenses)
