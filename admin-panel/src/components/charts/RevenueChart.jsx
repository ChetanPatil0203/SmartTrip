import React, { useState } from 'react';

export default function RevenueChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 200);
  const chartHeight = 220;
  const chartWidth = 540;
  const paddingX = 40;
  const paddingY = 30;

  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const barWidth = 36;
  const step = innerWidth / (data.length - 1 || 1);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D13239" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D13239" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8282F" stopOpacity="1" />
            <stop offset="100%" stopColor="#D13239" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = paddingY + innerHeight * (1 - ratio);
          const val = Math.round(maxRevenue * ratio);
          return (
            <g key={i}>
              <line
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="#F1F5F9"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94A3B8"
                fontWeight="500"
              >
                ₹{val}L
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, idx) => {
          const x = paddingX + idx * step - barWidth / 2;
          const barH = (item.revenue / maxRevenue) * innerHeight;
          const y = paddingY + innerHeight - barH;
          const isHovered = hoveredIdx === idx;

          return (
            <g
              key={item.month}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="6"
                fill={isHovered ? 'url(#barHoverGradient)' : 'url(#revenueGradient)'}
                style={{ transition: 'all 200ms ease' }}
              />
              {/* Highlight top cap */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height="4"
                rx="2"
                fill="#D13239"
              />

              {/* Month label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - 8}
                textAnchor="middle"
                fontSize="11"
                fill={isHovered ? '#0F172A' : '#64748B'}
                fontWeight={isHovered ? '700' : '600'}
              >
                {item.month}
              </text>

              {/* Value on top when hovered or active */}
              {isHovered && (
                <g>
                  <rect
                    x={x + barWidth / 2 - 32}
                    y={y - 28}
                    width="64"
                    height="22"
                    rx="4"
                    fill="#0F172A"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 14}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#FFFFFF"
                  >
                    ₹{item.revenue}L
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
