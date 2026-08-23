import React from 'react';
import { Wallet, Users, Activity } from 'lucide-react';

export function Header({ totalExpenses = 0, memberCount = 0 }) {
  const formattedTotal = Number(totalExpenses || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                SplitWise <span className="text-xs uppercase bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">Lite MVP</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Expense Entry & Live Balance Sheet</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-600">
              <Users className="h-4 w-4 text-slate-400" />
              <span>{memberCount} Members</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-900">
              <Activity className="h-4 w-4 text-emerald-600" />
              <span>Total Pool: {formattedTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
