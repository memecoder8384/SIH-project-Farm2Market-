import React from 'react';
import { DemandLevel } from '../../services/aiApi';
import { Flame, TrendingUp, Minus, AlertCircle } from 'lucide-react';

interface DemandLevelBadgeProps {
  level: DemandLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const DemandLevelBadge: React.FC<DemandLevelBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
}) => {
  const getBadgeConfig = () => {
    switch (level) {
      case 'Very High':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          dot: 'bg-emerald-600',
          icon: Flame,
          label: 'Very High Demand',
        };
      case 'High':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200/80',
          dot: 'bg-teal-600',
          icon: TrendingUp,
          label: 'High Demand',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-600',
          icon: Minus,
          label: 'Medium Demand',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-500',
          icon: AlertCircle,
          label: 'Low Demand',
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-2xs transition-colors ${config.bg} ${sizeClasses}`}
      aria-label={`Demand level: ${level}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      {showIcon && <IconComponent className="w-3 h-3 shrink-0 opacity-80" aria-hidden="true" />}
      <span>{level}</span>
    </span>
  );
};
