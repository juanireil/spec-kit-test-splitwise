from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, Field


class Member(BaseModel):
    id: str = Field(..., min_length=1, description="Unique identifier/slug for the member")
    name: str = Field(..., min_length=1, max_length=100, description="Display name")


class MemberBalance(BaseModel):
    member_id: str
    member_name: str
    balance: Decimal
    status: Literal["owed", "owes", "settled"]


class BalanceSheetResponse(BaseModel):
    balances: list[MemberBalance]
    total_group_expenses: Decimal
