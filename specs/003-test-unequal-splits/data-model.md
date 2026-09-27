# Data Model: Unequal / Custom Expense Splits

**Feature Branch**: `003-test-unequal-splits` | **Date**: 2026-09-27

---

## 1. Enums

### `SplitMode`
```python
from enum import Enum

class SplitMode(str, Enum):
    EQUAL = "EQUAL"
    EXACT = "EXACT"
    PERCENTAGE = "PERCENTAGE"
```

---

## 2. Models & Schemas

### `SplitShareInput` (Pydantic Schema)
Represents a participant's share input from the client:
```python
class SplitShareInput(BaseModel):
    member_id: str = Field(..., min_length=1, description="Participant member ID")
    amount: Decimal | None = Field(None, ge=Decimal("0.00"), decimal_places=2, description="Exact monetary amount owed (for EXACT mode)")
    percentage: Decimal | None = Field(None, ge=Decimal("0.0"), decimal_places=2, description="Percentage share owed (for PERCENTAGE mode)")
```

### `ExpenseCreate` (Pydantic Request Schema)
Extended request payload for recording an expense:
```python
class ExpenseCreate(BaseModel):
    amount: Decimal = Field(..., gt=Decimal("0.00"), decimal_places=2, description="Total amount paid")
    payer_id: str = Field(..., min_length=1, description="ID of member who paid")
    participant_ids: list[str] = Field(..., min_length=1, description="List of member IDs sharing the expense")
    split_mode: SplitMode = Field(default=SplitMode.EQUAL, description="Selected split division mode")
    custom_splits: list[SplitShareInput] | None = Field(default=None, description="Custom split shares for EXACT or PERCENTAGE modes")
```

### `Expense` (Pydantic Response / Domain Model)
Persisted expense object:
```python
class Expense(BaseModel):
    id: str = Field(..., description="Unique expense identifier, e.g., 'exp-1234abcd'")
    amount: Decimal = Field(..., gt=Decimal("0.00"), decimal_places=2)
    payer_id: str = Field(..., min_length=1)
    participant_ids: list[str] = Field(..., min_length=1)
    split_mode: SplitMode = Field(default=SplitMode.EQUAL)
    shares: dict[str, Decimal] = Field(..., description="Calculated exact monetary share owed by each participant (member_id -> amount)")
    created_at: datetime
```

---

## 3. Validation Invariants

1. **Exact Amounts Validation**:
   - `len(custom_splits) == len(participant_ids)`
   - Every `share.amount >= 0.00`
   - $\sum \text{share.amount} \equiv \text{expense.amount}$
2. **Percentages Validation**:
   - `len(custom_splits) == len(participant_ids)`
   - Every `0.0 <= share.percentage <= 100.0`
   - $\sum \text{share.percentage} \equiv 100.00$
   - Converted monetary shares sum strictly to `expense.amount`.
3. **Equal Splits Validation**:
   - `BalanceService.split_amount_equally(amount, participant_ids)` guarantees penny conservation.
