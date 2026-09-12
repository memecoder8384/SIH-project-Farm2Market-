import React from 'react';
import { DemandTrend } from '../../services/aiApi';
import { ArrowUpRight, ArrowRight, ArrowDownRight } from 'lucide-react';

interface TrendIndicatorProps {
  trend: DemandTrend;
  showLabel?: boolean;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend, showLabel = true }) => {
  const getTrendConfig = () => {
    switch (trend) {
      case 'increasing':
        return {
          icon: ArrowUpRight,
          label: 'Increasing',
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
        };
      case 'decreasing':
        return {
          icon: ArrowDownRight,
          label: 'Decreasing',
          textColor: 'text-rose-700',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
        };
      case 'stable':
      default:
        return {
          icon: ArrowRight,
          label: 'Stable',
          textColor: 'text-stone-600',
          bgColor: 'bg-stone-100',
          borderColor: 'border-stone-200',
        };
    }
  };

  const config = getTrendConfig();
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      title={`Demand trend: ${config.label}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
};
