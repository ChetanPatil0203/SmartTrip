import React, { useState } from 'react';

export default function BookingTrendChart({ data }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const maxBookings = 20000;
  const chartHeight = 220;
  const chartWidth = 540;
  const paddingX = 40;
  const paddingY = 30;

  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;
  const step = innerWidth / (data.length - 1 || 1);

  // Compute points
  const points = data.map((d, i) => {
    const x = paddingX + i * step;
    const y = paddingY + innerHeight - (d.bookings / maxBookings) * innerHeight;
    return { x, y, ...d };
  });

  // SVG smooth spline path
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${paddingY + innerHeight} L ${points[0].x},${paddingY + innerHeight} Z`;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingY + innerHeight * (1 - ratio);
          const val = Math.round((maxBookings * ratio) / 1000);
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
                {val}k
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Stroke line */}
        <path
          d={linePath}
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Dots */}
        {points.map((pt, i) => {
          const isHovered = hoveredPoint === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 7 : 5}
                fill="#FFFFFF"
                stroke="#2563EB"
                strokeWidth={isHovered ? 3 : 2.5}
                style={{ transition: 'all 150ms ease' }}
              />

              {/* Month label */}
              <text
                x={pt.x}
                y={chartHeight - 8}
                textAnchor="middle"
                fontSize="11"
                fill={isHovered ? '#0F172A' : '#64748B'}
                fontWeight={isHovered ? '700' : '600'}
              >
                {pt.month}
              </text>

              {/* Hover Tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={pt.x - 45}
                    y={pt.y - 32}
                    width="90"
                    height="24"
                    rx="4"
                    fill="#0F172A"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 16}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#FFFFFF"
                  >
                    {pt.bookings.toLocaleString()} trips
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
