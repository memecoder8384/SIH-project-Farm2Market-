import React from 'react';
import { RouteOptimization } from '../../types/tradeFlow';
import { Sparkles, ArrowRight, TrendingDown, Clock, ShieldCheck, Check } from 'lucide-react';

interface RouteOptimizationCardProps {
  optimization: RouteOptimization;
  onToggleRoute?: () => void;
  isApplied?: boolean;
}

export const RouteOptimizationCard: React.FC<RouteOptimizationCardProps> = ({
  optimization,
  onToggleRoute,
  isApplied = true,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-farm-orange/10 text-farm-orange rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="eyebrow-badge text-farm-orange">AI COLD-CHAIN DISPATCH ENGINE</span>
          </div>
          <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            AI Route Optimization &amp; Savings
          </h3>
        </div>

        {onToggleRoute && (
          <button
            type="button"
            onClick={onToggleRoute}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isApplied
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Optimized Route Applied</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Optimized Route</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Side-by-Side Route Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Route Card */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
              Original Standard Route
            </span>
            <span className="text-[10px] font-mono text-stone-400 bg-stone-200/60 px-2 py-0.5 rounded">
              Highway Toll Route
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/60 font-mono">
            <div>
              <span className="text-stone-400 text-[10px] block font-sans">Distance</span>
              <span className="text-base font-bold text-stone-800">{optimization?.originalDistanceKm ?? 145} km</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] block font-sans">Estimated Time</span>
              <span className="text-base font-bold text-stone-800">{optimization?.originalEta || '4h 30m'}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] block font-sans">Transport Cost</span>
              <span className="text-base font-bold text-stone-800">
                ₹{(optimization?.originalCost ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* AI Optimized Route Card */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-xs space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg">
            Recommended
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-farm-orange" />
              <span>AI Optimized Route</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200/70 font-mono">
            <div>
              <span className="text-emerald-800 text-[10px] block font-sans">Distance</span>
              <span className="text-base font-bold text-emerald-950">
                {optimization?.optimizedDistanceKm ?? 122} km
              </span>
            </div>
            <div>
              <span className="text-emerald-800 text-[10px] block font-sans">Estimated Time</span>
              <span className="text-base font-bold text-emerald-950">
                {optimization?.optimizedEta || '3h 45m'}
              </span>
            </div>
            <div>
              <span className="text-emerald-800 text-[10px] block font-sans">Transport Cost</span>
              <span className="text-base font-bold text-emerald-950">
                ₹{(optimization?.optimizedCost ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Result Highlights */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-emerald-50 to-stone-50 border border-orange-200/80 flex flex-wrap items-center justify-around gap-4 text-center">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Distance Saved
          </span>
          <span className="text-xl font-bold font-mono text-stone-900">
            {optimization?.distanceSavedKm ?? 23} km saved
          </span>
        </div>

        <div className="w-px h-8 bg-stone-200 hidden sm:block" />

        <div>
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Transit Time Saved
          </span>
          <span className="text-xl font-bold font-mono text-emerald-700">
            {optimization?.timeSavedMin ?? 45} min saved
          </span>
        </div>

        <div className="w-px h-8 bg-stone-200 hidden sm:block" />

        <div>
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Est. Cost Saved
          </span>
          <span className="text-xl font-bold font-mono text-farm-orange">
            ₹{(optimization?.costSavedInr ?? 0).toLocaleString('en-IN')} saved
          </span>
        </div>
      </div>

      {/* AI Rationale Footnote */}
      <div className="text-xs text-stone-600 bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/70 flex items-start gap-2.5">
        <span className="text-farm-orange font-bold text-sm leading-none mt-0.5">ℹ</span>
        <p className="leading-relaxed">
          <strong className="text-stone-800">AI Routing Strategy:</strong>{' '}
          {optimization.rationale ||
            'Route optimized based on distance, estimated traffic, delivery priority and logistics cost.'}
        </p>
      </div>
    </div>
  );
};
