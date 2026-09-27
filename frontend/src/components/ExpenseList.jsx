import React from 'react';
import { Receipt, Calendar, ArrowRight, Layers } from 'lucide-react';

export function ExpenseList({ expenses = [], members = [] }) {
  const memberMap = members.reduce((acc, m) => {
    acc[m.id] = m.name;
    return acc;
  }, {});

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
        <Receipt className="h-8 w-8 text-slate-300 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">No Expenses Recorded Yet</h3>
        <p className="text-xs text-slate-400 mt-1">Submit an expense on the left to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-600" />
            Recent Activity
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{expenses.length} transaction(s) recorded</p>
        </div>
      </div>

      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {expenses.slice().reverse().map((exp) => {
          const payerName = memberMap[exp.payer_id] || exp.payer_id;
          const formattedAmount = Number(exp.amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          });

          const splitModeLabel =
            exp.split_mode === 'EXACT'
              ? 'Exact ($)'
              : exp.split_mode === 'PERCENTAGE'
              ? 'Percentage (%)'
              : 'Equal (=)';

          const splitModeBadgeColor =
            exp.split_mode === 'EXACT'
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : exp.split_mode === 'PERCENTAGE'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200';

          return (
            <div
              key={exp.id}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{payerName} paid</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${splitModeBadgeColor}`}>
                      {splitModeLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(exp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>• {exp.participant_ids.length} participant(s)</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-900">{formattedAmount}</span>
                </div>
              </div>

              {/* Shares breakdown */}
              {exp.shares && Object.keys(exp.shares).length > 0 && (
                <div className="pt-1.5 border-t border-slate-100/80 flex flex-wrap gap-1.5">
                  {Object.entries(exp.shares).map(([memberId, shareAmount]) => (
                    <span
                      key={memberId}
                      className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-600 font-medium"
                    >
                      {memberMap[memberId] || memberId}: <strong className="text-slate-800">${Number(shareAmount).toFixed(2)}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
