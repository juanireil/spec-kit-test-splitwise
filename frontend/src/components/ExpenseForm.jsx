import React, { useState } from 'react';
import { PlusCircle, DollarSign, UserCheck, Users, AlertCircle } from 'lucide-react';

export function ExpenseForm({ members = [], onExpenseCreated, isSubmitting = false }) {
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState(members[0]?.id || 'alice');
  const [participantIds, setParticipantIds] = useState(members.map((m) => m.id));
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
    if (participantIds.includes(id)) {
      setParticipantIds(participantIds.filter((p) => p !== id));
    } else {
      setParticipantIds([...participantIds, id]);
    }
  };

  const selectAllParticipants = () => {
    setParticipantIds(members.map((m) => m.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
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

    try {
      await onExpenseCreated({
        amount: parsedAmount,
        payer_id: payerId,
        participant_ids: participantIds,
      });

      setAmount('');
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
          <p className="text-xs text-slate-500 mt-0.5">Split equally among chosen participants</p>
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

        {/* Participants Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              Split Equally Between ({participantIds.length})
            </label>
            <button
              type="button"
              onClick={selectAllParticipants}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Select All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {members.map((m) => {
              const isChecked = participantIds.includes(m.id);
              return (
                <label
                  key={m.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold'
                      : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleParticipant(m.id)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded-md"
                  />
                  <span className="text-xs">{m.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Recording Expense...' : 'Record & Split Expense'}
        </button>
      </form>
    </div>
  );
}
