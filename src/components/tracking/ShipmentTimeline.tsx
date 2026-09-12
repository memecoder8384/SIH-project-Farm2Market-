import React from 'react';
import { ShipmentTimelineStep } from '../../types/tradeFlow';
import { Check, Clock, CircleDot, MapPin } from 'lucide-react';

interface ShipmentTimelineProps {
  timeline: ShipmentTimelineStep[];
  className?: string;
}

export const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ timeline, className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-6 ${className}`}>
      <div>
        <span className="eyebrow-badge text-farm-orange">LIFECYCLE TRACKER</span>
        <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mt-1">
          Full 9-Stage Fulfillment Progress
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          From farm contract lock through reefer dispatch, live transit, buyer inspection, and escrow payout.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6">
        {/* Continuous background vertical bar */}
        <div className="absolute left-[19px] sm:left-[27px] top-3 bottom-4 w-0.5 bg-stone-200" />

        {timeline.map((step, idx) => {
          const isDone = step.completed;
          const isActive = step.active && !isDone;

          return (
            <div key={idx} className="relative flex items-start gap-4 text-xs group">
              {/* Step Circle Token */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all z-10 ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isActive
                    ? 'bg-farm-orange text-white ring-4 ring-orange-100 animate-pulse'
                    : 'bg-white border-2 border-stone-300 text-stone-400'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : isActive ? <CircleDot className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span
                    className={`font-bold text-sm ${
                      isDone
                        ? 'text-stone-900'
                        : isActive
                        ? 'text-farm-orange font-extrabold'
                        : 'text-stone-400'
                    }`}
                  >
                    {step.title}
                  </span>

                  <span
                    className={`text-[11px] font-mono shrink-0 ${
                      isDone
                        ? 'text-stone-500'
                        : isActive
                        ? 'text-farm-orange font-semibold'
                        : 'text-stone-300'
                    }`}
                  >
                    {step.timestamp || 'Pending'}
                  </span>
                </div>

                {step.location && (
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{step.location}</span>
                  </p>
                )}

                {step.details && (
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed bg-stone-50/70 p-2 rounded-xl border border-stone-100">
                    {step.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
