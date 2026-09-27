import React, { useState, useMemo } from 'react';
import { PlusCircle, DollarSign, UserCheck, Users, AlertCircle, Percent, SlidersHorizontal } from 'lucide-react';

export function ExpenseForm({ members = [], onExpenseCreated, isSubmitting = false }) {
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState(members[0]?.id || 'alice');
  const [participantIds, setParticipantIds] = useState(members.map((m) => m.id));
  const [splitMode, setSplitMode] = useState('EQUAL'); // EQUAL, EXACT, PERCENTAGE
  const [customShares, setCustomShares] = useState({}); // { memberId: value_string }
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Keep participant list synced if members load asynchronously
  React.useEffect(() => {
    if (members.length > 0 && participantIds.length === 0) {
      setPayerId(members[0].id);
      setParticipantIds(members.map((m) => m.id));
    }
  }, [members]);

  const toggleParticipant = (id) => {
    setParticipantIds((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      return next;
    });
  };

  const selectAllParticipants = () => {
    setParticipantIds(members.map((m) => m.id));
  };

  const handleShareChange = (memberId, val) => {
    setCustomShares((prev) => ({
      ...prev,
      [memberId]: val,
    }));
  };

  const parsedTotalAmount = useMemo(() => {
    const num = parseFloat(amount);
    return isNaN(num) || num < 0 ? 0 : num;
  }, [amount]);

  // Validation calculations
  const splitAnalysis = useMemo(() => {
    if (splitMode === 'EQUAL') {
      return { isValid: participantIds.length > 0, remaining: 0, totalAllocated: parsedTotalAmount };
    }

    if (splitMode === 'EXACT') {
      let allocated = 0;
      let allFilled = true;
      let hasNegative = false;

      participantIds.forEach((id) => {
        const valStr = customShares[id];
        if (valStr === undefined || valStr === '') {
          allFilled = false;
        } else {
          const num = parseFloat(valStr);
          if (isNaN(num) || num < 0) {
            hasNegative = true;
          } else {
            allocated += num;
          }
        }
      });

      const remaining = Math.round((parsedTotalAmount - allocated) * 100) / 100;
      const isValid = allFilled && !hasNegative && Math.abs(remaining) === 0 && parsedTotalAmount > 0;
      return { isValid, remaining, totalAllocated: Math.round(allocated * 100) / 100, hasNegative, allFilled };
    }

    if (splitMode === 'PERCENTAGE') {
      let allocatedPct = 0;
      let allFilled = true;
      let hasNegative = false;

      participantIds.forEach((id) => {
        const valStr = customShares[id];
        if (valStr === undefined || valStr === '') {
          allFilled = false;
        } else {
          const num = parseFloat(valStr);
          if (isNaN(num) || num < 0) {
            hasNegative = true;
          } else {
            allocatedPct += num;
          }
        }
      });

      const remainingPct = Math.round((100.0 - allocatedPct) * 100) / 100;
      const isValid = allFilled && !hasNegative && Math.abs(remainingPct) === 0 && parsedTotalAmount > 0;
      return { isValid, remaining: remainingPct, totalAllocated: Math.round(allocatedPct * 100) / 100, hasNegative, allFilled };
    }

    return { isValid: false, remaining: 0, totalAllocated: 0 };
  }, [splitMode, participantIds, customShares, parsedTotalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (parsedTotalAmount <= 0) {
      setError('Please enter a valid positive expense amount.');
      return;
    }

    if (!payerId) {
      setError('Please select who paid for this expense.');
      return;
    }

    if (participantIds.length === 0) {
      setError('Please select at least one member to share the expense.');
      return;
    }

    let customSplitsPayload = null;

    if (splitMode === 'EXACT') {
      if (!splitAnalysis.isValid) {
        setError(`Exact splits must sum to exactly $${parsedTotalAmount.toFixed(2)} (Remaining: $${splitAnalysis.remaining.toFixed(2)})`);
        return;
      }
      customSplitsPayload = participantIds.map((id) => ({
        member_id: id,
        amount: parseFloat(customShares[id] || '0'),
      }));
    } else if (splitMode === 'PERCENTAGE') {
      if (!splitAnalysis.isValid) {
        setError(`Percentage splits must sum to exactly 100% (Remaining: ${splitAnalysis.remaining}%)`);
        return;
      }
      customSplitsPayload = participantIds.map((id) => ({
        member_id: id,
        percentage: parseFloat(customShares[id] || '0'),
      }));
    }

    try {
      await onExpenseCreated({
        amount: parsedTotalAmount,
        payer_id: payerId,
        participant_ids: participantIds,
        split_mode: splitMode,
        custom_splits: customSplitsPayload,
      });

      setAmount('');
      setCustomShares({});
      setSuccessMessage('Expense successfully recorded!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to submit expense.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-emerald-600" />
            Add Shared Expense
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Record expenses with equal or custom splits</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-medium">
          <span>✓ {successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expense Amount</label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Payer Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-slate-400" />
            Paid by
          </label>
          <select
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Split Mode Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            Split Mode
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSplitMode('EQUAL')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                splitMode === 'EQUAL'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Equal (=)
            </button>
            <button
              type="button"
              onClick={() => setSplitMode('EXACT')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                splitMode === 'EXACT'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exact ($)
            </button>
            <button
              type="button"
              onClick={() => setSplitMode('PERCENTAGE')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                splitMode === 'PERCENTAGE'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Percentage (%)
            </button>
          </div>
        </div>

        {/* Participants Selection & Custom Split Inputs */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              Participants ({participantIds.length})
            </label>
            <button
              type="button"
              onClick={selectAllParticipants}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Select All
            </button>
          </div>

          <div className="space-y-2">
            {members.map((m) => {
              const isChecked = participantIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                      : 'bg-slate-50/60 border-slate-200 text-slate-500'
                  }`}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleParticipant(m.id)}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-xs font-semibold">{m.name}</span>
                  </label>

                  {/* Custom Input when checked */}
                  {isChecked && splitMode === 'EXACT' && (
                    <div className="relative w-28">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                        $
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.00"
                        placeholder="0.00"
                        value={customShares[m.id] || ''}
                        onChange={(e) => handleShareChange(m.id, e.target.value)}
                        className="w-full pl-6 pr-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-right text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  )}

                  {isChecked && splitMode === 'PERCENTAGE' && (
                    <div className="relative w-28">
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                        %
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.00"
                        max="100.00"
                        placeholder="0.00"
                        value={customShares[m.id] || ''}
                        onChange={(e) => handleShareChange(m.id, e.target.value)}
                        className="w-full pl-2 pr-6 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-right text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Allocation Indicator for Custom Split Modes */}
        {splitMode === 'EXACT' && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between font-medium ${
              splitAnalysis.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <span>
              Allocated: ${splitAnalysis.totalAllocated.toFixed(2)} / ${parsedTotalAmount.toFixed(2)}
            </span>
            <span className="font-bold">
              {splitAnalysis.remaining === 0
                ? '✓ 100% Balanced'
                : splitAnalysis.remaining > 0
                ? `$${splitAnalysis.remaining.toFixed(2)} remaining`
                : `$${Math.abs(splitAnalysis.remaining).toFixed(2)} over-allocated`}
            </span>
          </div>
        )}

        {splitMode === 'PERCENTAGE' && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between font-medium ${
              splitAnalysis.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <span>Allocated: {splitAnalysis.totalAllocated}% / 100%</span>
            <span className="font-bold">
              {splitAnalysis.remaining === 0
                ? '✓ 100% Balanced'
                : splitAnalysis.remaining > 0
                ? `${splitAnalysis.remaining}% remaining`
                : `${Math.abs(splitAnalysis.remaining)}% over-allocated`}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || (splitMode !== 'EQUAL' && !splitAnalysis.isValid)}
          className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Recording Expense...' : 'Record & Split Expense'}
        </button>
      </form>
    </div>
  );
}
