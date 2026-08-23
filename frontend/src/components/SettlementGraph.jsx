import React from 'react';
import { Network, CheckCircle2 } from 'lucide-react';

export function SettlementGraph({ members = [], settlements = [], balances = [] }) {
  const transactions = settlements?.transactions || [];
  const isSettled = settlements?.is_settled || transactions.length === 0;

  // Build lookup maps
  const balanceMap = (balances || []).reduce((acc, b) => {
    acc[b.member_id] = b;
    return acc;
  }, {});

  // Circular coordinate calculations for responsive SVG
  const size = 360;
  const center = size / 2;
  const radius = 120;
  const nodeRadius = 26;

  const nodePositions = members.map((member, index) => {
    const angle = (index / members.length) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return {
      ...member,
      x,
      y,
      balanceInfo: balanceMap[member.id] || { balance: 0, status: 'settled' },
    };
  });

  const positionMap = nodePositions.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Network className="h-5 w-5 text-indigo-600" />
            Visual Debt Settlement Graph
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Directed flows from Debtors (Red) to Creditors (Green)
          </p>
        </div>
      </div>

      <div className="relative w-full flex items-center justify-center py-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[380px] h-auto overflow-visible select-none"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="8"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
            </marker>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Directed Edges / Arrows */}
          {transactions.map((tx, idx) => {
            const source = positionMap[tx.from_member_id];
            const target = positionMap[tx.to_member_id];
            if (!source || !target) return null;

            // Compute angle between source and target
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const angle = Math.atan2(dy, dx);

            // Trim line so arrowhead does not overlap node circle
            const startX = source.x + nodeRadius * Math.cos(angle);
            const startY = source.y + nodeRadius * Math.sin(angle);
            const endX = target.x - (nodeRadius + 4) * Math.cos(angle);
            const endY = target.y - (nodeRadius + 4) * Math.sin(angle);

            // Midpoint for amount badge
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            const formattedAmount = Number(tx.amount).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });

            return (
              <g key={`edge-${idx}`}>
                {/* Connecting Line */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-300"
                />

                {/* Amount Label Badge */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-24"
                    y="-10"
                    width="48"
                    height="20"
                    rx="6"
                    fill="#4338ca"
                    filter="url(#shadow)"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="700"
                  >
                    {formattedAmount}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Nodes */}
          {nodePositions.map((node) => {
            const status = node.balanceInfo.status;
            let nodeBg = '#f8fafc';
            let strokeColor = '#cbd5e1';
            let textColor = '#0f172a';
            let badgeBg = '#f1f5f9';
            let badgeText = '#475569';

            if (status === 'owed') {
              nodeBg = '#ecfdf5';
              strokeColor = '#10b981';
              textColor = '#065f46';
              badgeBg = '#d1fae5';
              badgeText = '#047857';
            } else if (status === 'owes') {
              nodeBg = '#fff1f2';
              strokeColor = '#f43f5e';
              textColor = '#9f1239';
              badgeBg = '#ffe4e6';
              badgeText = '#be123c';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                {/* Outer Ring */}
                <circle
                  r={nodeRadius}
                  fill={nodeBg}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  filter="url(#shadow)"
                />

                {/* Initial */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textColor}
                  fontSize="13"
                  fontWeight="800"
                >
                  {node.name.charAt(0)}
                </text>

                {/* Name Label */}
                <text
                  y={nodeRadius + 14}
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="11"
                  fontWeight="700"
                >
                  {node.name}
                </text>

                {/* Balance Status Sub-label */}
                <g transform={`translate(0, ${nodeRadius + 26})`}>
                  <rect
                    x="-20"
                    y="-7"
                    width="40"
                    height="14"
                    rx="4"
                    fill={badgeBg}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={badgeText}
                    fontSize="8.5"
                    fontWeight="700"
                  >
                    {status === 'owed'
                      ? `+$${Number(node.balanceInfo.balance).toFixed(0)}`
                      : status === 'owes'
                      ? `-$${Math.abs(Number(node.balanceInfo.balance)).toFixed(0)}`
                      : '$0'}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {isSettled && (
        <div className="mt-2 text-center text-xs text-emerald-700 font-medium flex items-center justify-center gap-1.5 bg-emerald-50 py-2 rounded-xl border border-emerald-100">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>All nodes in equilibrium — 0 active debt links</span>
        </div>
      )}
    </div>
  );
}
