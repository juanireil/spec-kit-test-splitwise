import React from 'react';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';

export function BalanceCard({ balanceInfo }) {
  const { member_name, balance, status } = balanceInfo;
  const numBalance = Number(balance);

  const formattedAmount = Math.abs(numBalance).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const getStatusConfig = () => {
    switch (status) {
      case 'owed':
        return {
          containerClass: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          amountClass: 'text-emerald-700 font-bold',
          prefix: '+',
          label: 'is owed',
          Icon: ArrowUpRight,
          iconBg: 'bg-emerald-100 text-emerald-700',
        };
      case 'owes':
        return {
          containerClass: 'border-rose-200 bg-rose-50/40 hover:border-rose-300',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          amountClass: 'text-rose-700 font-bold',
          prefix: '-',
          label: 'owes',
          Icon: ArrowDownLeft,
          iconBg: 'bg-rose-100 text-rose-700',
        };
      default:
        return {
          containerClass: 'border-slate-200 bg-white hover:border-slate-300',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          amountClass: 'text-slate-700 font-semibold',
          prefix: '',
          label: 'settled',
          Icon: CheckCircle2,
          iconBg: 'bg-slate-100 text-slate-500',
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.Icon;

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 shadow-sm flex flex-col justify-between ${config.containerClass}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${config.iconBg}`}>
            {member_name.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{member_name}</h4>
            <span className="text-[11px] text-slate-500 font-medium capitalize">{config.label}</span>
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize flex items-center gap-1 ${config.badgeClass}`}>
          <IconComponent className="h-3 w-3" />
          {status}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
        <span className="text-xs text-slate-500 font-medium">Net Balance</span>
        <span className={`text-lg tracking-tight ${config.amountClass}`}>
          {config.prefix}{formattedAmount}
        </span>
      </div>
    </div>
  );
}
