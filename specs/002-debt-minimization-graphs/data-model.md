# Data Model: Iteration 02 - Debt Minimization Engine & Visual Graphs

## Domain Entities & Pydantic Schemas

### 1. SettlementTransaction
Represents a single direct payment recommendation between two group members.

- **Attributes**:
  - `from_member_id`: `str` (Debtor ID who pays)
  - `from_member_name`: `str` (Debtor display name)
  - `to_member_id`: `str` (Creditor ID who receives payment)
  - `to_member_name`: `str` (Creditor display name)
  - `amount`: `Decimal` (Positive amount, strictly > 0.00)

```python
class SettlementTransaction(BaseModel):
    from_member_id: str
    from_member_name: str
    to_member_id: str
    to_member_name: str
    amount: Decimal = Field(..., gt=Decimal("0.00"), decimal_places=2)
```

### 2. SettlementPlanResponse
Represents the complete minimized settlement plan for the group.

- **Attributes**:
  - `transactions`: `List[SettlementTransaction]`
  - `total_settled_amount`: `Decimal`
  - `transaction_count`: `int`
  - `is_settled`: `bool` (True if no debts exist, transactions list is empty)

```python
class SettlementPlanResponse(BaseModel):
    transactions: List[SettlementTransaction]
    total_settled_amount: Decimal
    transaction_count: int
    is_settled: bool
```

### 3. Graph Visual State (Frontend Model)
- **Node**: `{ id: string, name: string, balance: number, status: 'owed' | 'owes' | 'settled', x: number, y: number }`
- **Edge**: `{ from: string, to: string, amount: number, label: string }`
