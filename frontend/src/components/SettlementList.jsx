import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function SettlementList({ settlements, loading = false }) {
  const transactions = settlements?.transactions || [];
  const isSettled = settlements?.is_settled || transactions.length === 0;
  const totalAmount = settlements?.total_settled_amount || 0;

  const formattedTotal = Number(totalAmount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Minimized Settlements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSettled
              ? 'Zero outstanding debts'
              : `${transactions.length} direct payment(s) to settle all debts (${formattedTotal})`}
          </p>
        </div>
      </div>

      {loading && !settlements ? (
        <div className="py-8 text-center text-xs text-slate-400">Computing minimal debts...</div>
      ) : isSettled ? (
        <div className="py-8 text-center bg-emerald-50/50 rounded-xl border border-emerald-100 p-6">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-emerald-950">Group is Completely Settled!</h4>
          <p className="text-xs text-emerald-700 mt-1">No debt transfers are currently required.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx, idx) => {
            const formattedAmount = Number(tx.amount).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50/70 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg">
                      {tx.from_member_name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">pays</span>
                    <ArrowRight className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="font-bold text-xs text-slate-900 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                      {tx.to_member_name}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-indigo-900 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg shadow-sm">
                    {formattedAmount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
