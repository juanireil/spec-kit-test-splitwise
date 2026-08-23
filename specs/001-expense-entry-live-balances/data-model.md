# Data Model: Iteration 01 (MVP) - Expense Entry & Live Balance Sheet

## Domain Entities & Pydantic Schemas

### 1. Member
Represents an individual in the shared expense pool.

- **Attributes**:
  - `id`: `str` (e.g., `"alice"`, unique slug/identifier)
  - `name`: `str` (e.g., `"Alice"`, human-readable display name)
- **Validation**:
  - `id` must be non-empty alphanumeric slug.
  - `name` must be between 1 and 100 characters.

```python
class Member(BaseModel):
    id: str
    name: str
```

### 2. Expense
Represents a recorded transaction where one member paid for a shared expense.

- **Attributes**:
  - `id`: `str` (UUID or unique string identifier)
  - `amount`: `Decimal` (Must be > 0.00, formatted with 2 decimal places)
  - `payer_id`: `str` (Valid member ID who paid)
  - `participant_ids`: `List[str]` (List of valid member IDs sharing the expense; minimum 1 item)
  - `created_at`: `datetime` (Timestamp of transaction creation)
- **Validation Rules**:
  - `amount > 0.00`
  - `payer_id` must exist in the registered members list.
  - `participant_ids` must not be empty, must contain valid member IDs, and must not contain duplicates.

```python
class ExpenseCreate(BaseModel):
    amount: Decimal = Field(..., gt=0, decimal_places=2, description="Total amount paid")
    payer_id: str = Field(..., min_length=1)
    participant_ids: List[str] = Field(..., min_items=1)

class Expense(ExpenseCreate):
    id: str
    created_at: datetime
```

### 3. MemberBalance
Represents a member's net financial position at any point in time.

- **Attributes**:
  - `member_id`: `str` (Unique member identifier)
  - `member_name`: `str` (Display name)
  - `balance`: `Decimal` (Net position: `Total Paid - Total Owed`)
  - `status`: `str` (`"owed"` if balance > 0, `"owes"` if balance < 0, `"settled"` if balance == 0)
- **Mathematical Invariant**:
  - Across all $M \in \text{Members}$, $\sum \text{balance}_M = 0.00$.

```python
class MemberBalance(BaseModel):
    member_id: str
    member_name: str
    balance: Decimal
    status: Literal["owed", "owes", "settled"]

class BalanceSheetResponse(BaseModel):
    balances: List[MemberBalance]
    total_group_expenses: Decimal
```

## State & Persistence Layer

- **Repository**: `InMemoryExpenseRepository`
- **Internal Storage**:
  - `members`: `Dict[str, Member]`
  - `expenses`: `List[Expense]`
- **Thread Safety**: Python `threading.Lock` protecting write operations during concurrent requests.
