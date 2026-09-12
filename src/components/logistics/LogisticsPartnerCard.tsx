import React from 'react';
import { LogisticsPartner } from '../../types/tradeFlow';
import { Truck, Star, CheckCircle, Clock, ShieldCheck, Weight, Phone, Check } from 'lucide-react';

interface LogisticsPartnerCardProps {
  partner: LogisticsPartner;
  isAssigned?: boolean;
  onAssign: (partnerId: string) => void;
  disabled?: boolean;
}

export const LogisticsPartnerCard: React.FC<LogisticsPartnerCardProps> = ({
  partner,
  isAssigned = false,
  onAssign,
  disabled = false,
}) => {
  return (
    <div
      className={`rounded-3xl p-5 border transition-all flex flex-col justify-between ${
        isAssigned
          ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500 shadow-sm'
          : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isAssigned ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 leading-tight">{partner.name}</h4>
              <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                {partner.hubLocation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{partner.rating}</span>
            {partner.reviewsCount && (
              <span className="text-amber-700 font-normal">({partner.reviewsCount})</span>
            )}
          </div>
        </div>

        {/* Vehicle & Specs */}
        <div className="space-y-2 py-3 border-y border-stone-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px]">Vehicle Type:</span>
            <span className="font-semibold text-stone-800 text-right">{partner.vehicleType}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px]">Payload Capacity:</span>
            <span className="font-mono font-bold text-stone-900">
              {partner.capacityKg.toLocaleString('en-IN')} kg
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px]">Est. Transit Time:</span>
            <span className="font-medium text-stone-700 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {partner.estimatedDeliveryTime}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px]">Availability:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {partner.availability}
            </span>
          </div>
        </div>

        {/* Pricing Banner */}
        <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-baseline justify-between font-mono">
          <span className="text-stone-500 font-sans text-xs">Estimated Transport Cost:</span>
          <span className="text-base font-bold text-emerald-800">
            ₹{partner.estimatedCost.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Assignment Button */}
      <div className="mt-5 pt-3 border-t border-stone-100">
        {isAssigned ? (
          <div className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs">
            <Check className="w-4 h-4" />
            <span>Assigned Partner ✓</span>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onAssign(partner.id)}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span>Assign Partner</span>
          </button>
        )}
      </div>
    </div>
  );
};
