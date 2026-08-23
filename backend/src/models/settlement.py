from decimal import Decimal
from typing import List
from pydantic import BaseModel, Field


class SettlementTransaction(BaseModel):
    from_member_id: str = Field(..., min_length=1, description="ID of debtor paying")
    from_member_name: str = Field(..., min_length=1, description="Name of debtor paying")
    to_member_id: str = Field(..., min_length=1, description="ID of creditor receiving")
    to_member_name: str = Field(..., min_length=1, description="Name of creditor receiving")
    amount: Decimal = Field(..., gt=Decimal("0.00"), decimal_places=2, description="Settlement amount")


class SettlementPlanResponse(BaseModel):
    transactions: List[SettlementTransaction]
    total_settled_amount: Decimal
    transaction_count: int
    is_settled: bool
