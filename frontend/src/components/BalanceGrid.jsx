import React from 'react';
import { BalanceCard } from './BalanceCard';
import { Scale, RefreshCw } from 'lucide-react';

export function BalanceGrid({ balances = [], loading = false, onRefresh }) {
  const zeroSumCheck = balances.reduce((acc, curr) => acc + Number(curr.balance), 0);
  const isZeroSum = Math.abs(zeroSumCheck) < 0.001;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-600" />
            Live Balance Sheet
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time net financial position for each member</p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Refresh balances"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {loading && balances.length === 0 ? (
        <div className="py-10 text-center text-xs text-slate-400">Loading balances...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {balances.map((b) => (
            <BalanceCard key={b.member_id} balanceInfo={b} />
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Conservation Invariant:</span>
        <span className={`font-mono font-semibold ${isZeroSum ? 'text-emerald-600' : 'text-rose-600'}`}>
          Net Sum: ${zeroSumCheck.toFixed(2)} {isZeroSum ? '(Balanced ✓)' : '(Drift ✗)'}
        </span>
      </div>
    </div>
  );
}
