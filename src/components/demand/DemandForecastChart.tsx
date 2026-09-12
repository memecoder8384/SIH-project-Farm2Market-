import React, { useState, useMemo } from 'react';
import { DailyPrediction } from '../../services/aiApi';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';

interface DemandForecastChartProps {
  data: DailyPrediction[];
  cropName: string;
  periodDays: number;
  isLoading?: boolean;
}

export const DemandForecastChart: React.FC<DemandForecastChartProps> = ({
  data,
  cropName,
  periodDays,
  isLoading = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Dimensions & Padding
  const width = 800;
  const height = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 65 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Compute Scales
  const { minVal, maxVal, points, yTicks, xLabels } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minVal: 0, maxVal: 1000, points: [], yTicks: [], xLabels: [] };
    }

    const values = data.map((d) => d.predicted_demand_kg);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);

    // Add padding to Y-axis range
    const range = rawMax - rawMin || 100;
    const minVal = Math.max(0, Math.floor((rawMin - range * 0.15) / 100) * 100);
    const maxVal = Math.ceil((rawMax + range * 0.15) / 100) * 100;
    const ySpan = maxVal - minVal || 1;

    // Map data to SVG coordinates
    const points = data.map((d, i) => {
      const x = padding.left + (i / Math.max(1, data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.predicted_demand_kg - minVal) / ySpan) * chartHeight;
      return { x, y, ...d };
    });

    // 4 Y-axis ticks
    const tickCount = 4;
    const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
      const val = Math.round(minVal + (i / tickCount) * ySpan);
      const y = padding.top + chartHeight - (i / tickCount) * chartHeight;
      return { val, y };
    });

    // X-axis label thinning (don't overlap dates on 30-day views)
    const step = data.length <= 7 ? 1 : Math.ceil(data.length / 6);
    const xLabels = points.filter((_, i) => i % step === 0 || i === data.length - 1);

    return { minVal, maxVal, points, yTicks, xLabels };
  }, [data, chartWidth, chartHeight, padding.left, padding.top]);

  // Generate smooth SVG Path (Catmull-Rom or cubic spline)
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y} L ${points[0].x + 1} ${points[0].y}`;
    }

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      // Tension factor 0.2 for smooth natural curve
      const cp1x = p1.x + (p2.x - p0.x) * 0.15;
      const cp1y = p1.y + (p2.y - p0.y) * 0.15;
      const cp2x = p2.x - (p3.x - p1.x) * 0.15;
      const cp2y = p2.y - (p3.y - p1.y) * 0.15;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  const areaD = useMemo(() => {
    if (!pathD || points.length === 0) return '';
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    const bottomY = padding.top + chartHeight;
    return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [pathD, points, padding.top, chartHeight]);

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  // Helper date formatter
  const formatDateLabel = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTooltipDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-stone-200/80 p-6 shadow-2xs animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-5 bg-stone-200 rounded w-48" />
          <div className="h-5 bg-stone-200 rounded w-28" />
        </div>
        <div className="h-60 bg-stone-100/70 rounded-xl flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
            <BarChart3 className="w-4 h-4 animate-spin text-farm-orange" />
            <span>Calculating expected sales forecast...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-stone-200/80 p-6 text-center text-stone-500 text-sm">
        No daily forecast data available for {cropName}.
      </div>
    );
  }

  const values = data.map((d) => d.predicted_demand_kg);
  const avgDaily = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const maxDaily = Math.max(...values);
  const minDaily = Math.min(...values);

  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-2xs relative">
      {/* Header & Stats Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-2 border-b border-stone-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-stone-900 font-serif-heading tracking-tight">
              {cropName} — Next {periodDays} Days Expected Sales
            </h4>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-orange-50 text-farm-orange px-2 py-0.5 rounded-full border border-orange-200/60">
              AI Forecast
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Day-by-day expected sales based on weekly market trends
          </p>
        </div>

        {/* Quick summary metrics */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-stone-50 border border-stone-200/80 rounded-lg px-2.5 py-1 text-center">
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Daily Average</span>
            <span className="font-bold text-stone-800 font-mono">{avgDaily.toLocaleString()} kg</span>
          </div>
          <div className="bg-stone-50 border border-stone-200/80 rounded-lg px-2.5 py-1 text-center">
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Highest Day</span>
            <span className="font-bold text-emerald-700 font-mono">{maxDaily.toLocaleString()} kg</span>
          </div>
          <div className="bg-stone-50 border border-stone-200/80 rounded-lg px-2.5 py-1 text-center">
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Lowest Day</span>
            <span className="font-bold text-stone-600 font-mono">{minDaily.toLocaleString()} kg</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ minHeight: '220px', maxHeight: '320px' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Soft agricultural sunrise gradient */}
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e65c38" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#e65c38" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#e65c38" stopOpacity="0.0" />
            </linearGradient>

            {/* Subtle glow filter for the active data marker */}
            <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#e65c38" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Horizontal Gridlines & Y-axis labels */}
          {yTicks.map((tick, i) => (
            <g key={`ytick-${i}`}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                stroke="#e7e5e4"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[10px] font-mono fill-stone-400 font-medium select-none"
              >
                {tick.val >= 1000 ? `${(tick.val / 1000).toFixed(1)}k` : tick.val} kg
              </text>
            </g>
          ))}

          {/* Fill Area Under Curve */}
          <path d={areaD} fill="url(#forecastGradient)" />

          {/* Main Forecast Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#e65c38"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-axis date labels */}
          {xLabels.map((p, i) => (
            <g key={`xlabel-${i}`}>
              <line
                x1={p.x}
                y1={padding.top + chartHeight}
                x2={p.x}
                y2={padding.top + chartHeight + 6}
                stroke="#d6d3d1"
                strokeWidth="1"
              />
              <text
                x={p.x}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                className="text-[10px] font-medium fill-stone-500 select-none"
              >
                {formatDateLabel(p.date)}
              </text>
            </g>
          ))}

          {/* Interactive Crosshair and Highlight Marker on Hover */}
          {activePoint && (
            <g>
              {/* Vertical dotted guide line */}
              <line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={padding.top + chartHeight}
                stroke="#e65c38"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.85"
              />

              {/* Glowing Outer Ripple */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="9"
                fill="#e65c38"
                fillOpacity="0.2"
                className="animate-ping"
              />

              {/* Data Marker with glow */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                fill="#ffffff"
                stroke="#e65c38"
                strokeWidth="3.5"
                filter="url(#markerGlow)"
              />
            </g>
          )}

          {/* Transparent Hover Hit Boxes for smooth touch and mouse interaction */}
          {points.map((p, i) => {
            const stepW = chartWidth / Math.max(1, points.length - 1);
            const boxX = Math.max(padding.left, p.x - stepW / 2);
            return (
              <rect
                key={`hit-${i}`}
                x={boxX}
                y={padding.top}
                width={stepW}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onTouchStart={() => setHoveredIndex(i)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip positioned over active point with edge clamping */}
        {activePoint && (() => {
          const xRatio = activePoint.x / width;
          const yRatio = activePoint.y / height;

          // Horizontal alignment: shift inside if near edges so it never cuts off
          let xTransform = '-translate-x-1/2';
          if (xRatio < 0.18) {
            xTransform = 'translate-x-1';
          } else if (xRatio > 0.82) {
            xTransform = '-translate-x-full';
          }

          // Vertical alignment: if close to top edge, show tooltip below point
          const isNearTop = yRatio < 0.28;
          const yTransform = isNearTop ? 'translate-y-3' : '-translate-y-full';
          const topPos = isNearTop
            ? `${(activePoint.y / height) * 100}%`
            : `${(activePoint.y / height) * 100 - 3}%`;

          return (
            <div
              className={`absolute pointer-events-none transition-all duration-150 transform ${xTransform} ${yTransform} z-20`}
              style={{
                left: `${(activePoint.x / width) * 100}%`,
                top: topPos,
              }}
            >
              <div className="bg-stone-900 text-white px-3 py-2 rounded-xl shadow-lg border border-stone-700 text-xs whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-medium">
                  <Calendar className="w-3 h-3 text-farm-orange" />
                  <span>{formatTooltipDate(activePoint.date)}</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-mono font-bold text-sm text-farm-gold">
                    {activePoint.predicted_demand_kg.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-stone-300">kg expected</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Subtle Caption / Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-400 pt-3 border-t border-stone-100 mt-2 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-farm-orange rounded-full inline-block" />
            <span className="text-stone-600 font-medium">Expected Daily Sales (kg)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-orange-100 border border-farm-orange/40 rounded-sm inline-block" />
            <span className="text-stone-500">Expected Range</span>
          </div>
        </div>

        <span className="text-[10px] text-stone-400 italic">
          Hover over points to see daily sales estimates
        </span>
      </div>
    </div>
  );
};
