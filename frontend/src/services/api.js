const API_BASE = '/api';

export async function fetchMembers() {
  const res = await fetch(`${API_BASE}/members`);
  if (!res.ok) {
    throw new Error('Failed to fetch members');
  }
  return res.json();
}

export async function fetchBalances() {
  const res = await fetch(`${API_BASE}/balances`);
  if (!res.ok) {
    throw new Error('Failed to fetch balance sheet');
  }
  return res.json();
}

export async function fetchExpenses() {
  const res = await fetch(`${API_BASE}/expenses`);
  if (!res.ok) {
    throw new Error('Failed to fetch expenses');
  }
  return res.json();
}

export async function createExpense(expenseData) {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to create expense');
  }

  return res.json();
}
