import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExpenseForm } from './components/ExpenseForm';
import { BalanceGrid } from './components/BalanceGrid';
import { ExpenseList } from './components/ExpenseList';
import { SettlementList } from './components/SettlementList';
import { SettlementGraph } from './components/SettlementGraph';
import { fetchMembers, fetchBalances, fetchExpenses, fetchSettlements, createExpense } from './services/api';

export function App() {
  const [members, setMembers] = useState([]);
  const [balanceSheet, setBalanceSheet] = useState({ balances: [], total_group_expenses: 0 });
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const loadData = async () => {
    try {
      setGlobalError('');
      const [membersData, balancesData, expensesData, settlementsData] = await Promise.all([
        fetchMembers(),
        fetchBalances(),
        fetchExpenses(),
        fetchSettlements(),
      ]);

      setMembers(membersData);
      setBalanceSheet(balancesData);
      setExpenses(expensesData);
      setSettlements(settlementsData);
    } catch (err) {
      setGlobalError('Could not connect to the SplitWise backend. Ensure the server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExpenseCreated = async (expenseData) => {
    setSubmitting(true);
    try {
      await createExpense(expenseData);
      // Refresh balances, expenses, and settlements simultaneously
      const [newBalances, newExpenses, newSettlements] = await Promise.all([
        fetchBalances(),
        fetchExpenses(),
        fetchSettlements(),
      ]);
      setBalanceSheet(newBalances);
      setExpenses(newExpenses);
      setSettlements(newSettlements);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        totalExpenses={balanceSheet.total_group_expenses}
        memberCount={members.length}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {globalError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm shadow-sm flex items-center justify-between">
            <span>{globalError}</span>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 font-semibold rounded-lg text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* Top Grid: Expense Entry & Live Balances */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form and Activity */}
          <div className="lg:col-span-5 space-y-6">
            <ExpenseForm
              members={members}
              onExpenseCreated={handleExpenseCreated}
              isSubmitting={submitting}
            />

            <ExpenseList
              expenses={expenses}
              members={members}
            />
          </div>

          {/* Right Column: Live Balance Sheet */}
          <div className="lg:col-span-7">
            <BalanceGrid
              balances={balanceSheet.balances}
              loading={loading}
              onRefresh={loadData}
            />
          </div>
        </div>

        {/* Bottom Section: Debt Minimization Engine & Visual Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left: Minimized Payment Transactions List */}
          <div className="lg:col-span-5">
            <SettlementList
              settlements={settlements}
              loading={loading}
            />
          </div>

          {/* Right: Directed Node-Link Visual Graph */}
          <div className="lg:col-span-7">
            <SettlementGraph
              members={members}
              settlements={settlements}
              balances={balanceSheet.balances}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
