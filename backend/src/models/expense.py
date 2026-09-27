from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field, field_validator


class SplitMode(str, Enum):
    EQUAL = "EQUAL"
    EXACT = "EXACT"
    PERCENTAGE = "PERCENTAGE"


class SplitShareInput(BaseModel):
    member_id: str = Field(..., min_length=1, description="Participant member ID")
    amount: Decimal | None = Field(None, ge=Decimal("0.00"), decimal_places=2, description="Exact monetary amount owed")
    percentage: Decimal | None = Field(None, ge=Decimal("0.00"), decimal_places=2, description="Percentage share owed")


class ExpenseCreate(BaseModel):
    amount: Decimal = Field(..., gt=Decimal("0.00"), decimal_places=2, description="Total amount paid")
    payer_id: str = Field(..., min_length=1, description="ID of member who paid")
    participant_ids: list[str] = Field(..., min_length=1, description="List of member IDs sharing the expense")
    split_mode: SplitMode = Field(default=SplitMode.EQUAL, description="Selected split division mode")
    custom_splits: list[SplitShareInput] | None = Field(default=None, description="Custom split shares for EXACT or PERCENTAGE modes")

    @field_validator("participant_ids")
    @classmethod
    def validate_participants(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("Participant list cannot be empty")
        cleaned = [p.strip() for p in v if p.strip()]
        if not cleaned:
            raise ValueError("Must have at least one valid participant ID")
        if len(cleaned) != len(set(cleaned)):
            raise ValueError("Duplicate participants are not allowed")
        return cleaned

    @field_validator("amount")
    @classmethod
    def validate_positive_amount(cls, v: Decimal) -> Decimal:
        if v <= Decimal("0.00"):
            raise ValueError("Amount must be strictly positive (greater than 0.00)")
        return v


class Expense(BaseModel):
    id: str
    amount: Decimal = Field(..., gt=Decimal("0.00"), decimal_places=2)
    payer_id: str = Field(..., min_length=1)
    participant_ids: list[str] = Field(..., min_length=1)
    split_mode: SplitMode = Field(default=SplitMode.EQUAL)
    shares: dict[str, Decimal] = Field(default_factory=dict, description="Calculated exact monetary share owed by each participant")
    created_at: datetime
