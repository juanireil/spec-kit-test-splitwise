from fastapi import APIRouter, HTTPException, status

from backend.src.models.expense import Expense, ExpenseCreate, SplitMode
from backend.src.models.member import BalanceSheetResponse, Member
from backend.src.models.settlement import SettlementPlanResponse
from backend.src.repositories.expense_repository import repository
from backend.src.services.balance_service import BalanceService
from backend.src.services.debt_service import DebtSimplificationService

router = APIRouter()


@router.get("/members", response_model=list[Member], summary="List group members")
def get_members():
    return repository.get_members()


@router.post(
    "/expenses",
    response_model=Expense,
    status_code=status.HTTP_201_CREATED,
    summary="Record a shared expense",
)
def create_expense(expense_in: ExpenseCreate):
    payer = repository.get_member_by_id(expense_in.payer_id)
    if not payer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payer '{expense_in.payer_id}' does not exist in registered group members",
        )

    for participant_id in expense_in.participant_ids:
        participant = repository.get_member_by_id(participant_id)
        if not participant:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Participant '{participant_id}' does not exist in registered group members",
            )

    try:
        if expense_in.split_mode == SplitMode.EXACT:
            if not expense_in.custom_splits:
                raise ValueError("Custom splits must be provided for EXACT split mode")
            custom_shares = {
                s.member_id: s.amount
                for s in expense_in.custom_splits
                if s.amount is not None
            }
            shares = BalanceService.split_amount_exact(
                amount=expense_in.amount,
                participant_ids=expense_in.participant_ids,
                custom_shares=custom_shares,
            )
        elif expense_in.split_mode == SplitMode.PERCENTAGE:
            if not expense_in.custom_splits:
                raise ValueError("Custom splits must be provided for PERCENTAGE split mode")
            custom_percentages = {
                s.member_id: s.percentage
                for s in expense_in.custom_splits
                if s.percentage is not None
            }
            # split_amount_percentages will be called once implemented in US2
            shares = BalanceService.split_amount_percentages(
                amount=expense_in.amount,
                participant_ids=expense_in.participant_ids,
                custom_percentages=custom_percentages,
            )
        else:
            shares = BalanceService.split_amount_equally(
                amount=expense_in.amount,
                participant_ids=expense_in.participant_ids,
            )

        return repository.add_expense(expense_in, shares=shares)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/expenses", response_model=list[Expense], summary="List all recorded expenses")
def get_expenses():
    return repository.get_expenses()


@router.get("/balances", response_model=BalanceSheetResponse, summary="Get live member balances")
def get_balances():
    members = repository.get_members()
    expenses = repository.get_expenses()
    return BalanceService.calculate_balances(members, expenses)


@router.get(
    "/settlements",
    response_model=SettlementPlanResponse,
    summary="Get minimized debt settlement plan",
)
def get_settlements():
    members = repository.get_members()
    expenses = repository.get_expenses()
    balance_sheet = BalanceService.calculate_balances(members, expenses)
    return DebtSimplificationService.simplify_debts(balance_sheet.balances)
