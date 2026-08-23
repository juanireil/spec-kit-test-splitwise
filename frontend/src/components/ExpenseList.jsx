import React from 'react';
import { Receipt, Calendar, ArrowRight } from 'lucide-react';

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
          const participantNames = exp.participant_ids.map((id) => memberMap[id] || id).join(', ');
          const formattedAmount = Number(exp.amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          });

          return (
            <div
              key={exp.id}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{payerName} paid</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-600 font-medium truncate max-w-[200px]" title={participantNames}>
                    {participantNames}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(exp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>• {exp.participant_ids.length} equal share(s)</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-slate-900">{formattedAmount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
