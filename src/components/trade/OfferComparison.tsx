import React from 'react';
import { NegotiationOffer } from '../../types/tradeFlow';
import { ArrowRight, CheckCircle2, DollarSign, Scale, Truck, Award } from 'lucide-react';

interface OfferComparisonProps {
  originalOffer: NegotiationOffer;
  counterOffer: NegotiationOffer;
}

export const OfferComparison: React.FC<OfferComparisonProps> = ({
  originalOffer,
  counterOffer,
}) => {
  const priceDiff = counterOffer.pricePerUnit - originalOffer.pricePerUnit;
  const pricePercent = Math.round((priceDiff / originalOffer.pricePerUnit) * 100);
  const totalDiff = counterOffer.totalAmount - originalOffer.totalAmount;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-farm-orange">
            Offer Comparison
          </span>
          <h4 className="font-serif-heading text-lg font-bold text-stone-900 leading-snug">
            Current Offer vs Proposed Counter-Offer
          </h4>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
              priceDiff < 0
                ? 'bg-blue-50 text-blue-800'
                : priceDiff > 0
                ? 'bg-amber-50 text-amber-800'
                : 'bg-stone-100 text-stone-700'
            }`}
          >
            {priceDiff < 0 ? `${pricePercent}% Discount` : priceDiff > 0 ? `+${pricePercent}% Premium` : 'Same Rate'}
          </span>
        </div>
      </div>

      {/* Side by Side Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Offer Card */}
        <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {originalOffer.offeredBy === 'farmer' ? "Farmer's Offer" : "Buyer's Offer"}
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {originalOffer.timestamp.split(' ')[1]} {originalOffer.timestamp.split(' ')[2]}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-500">Price / Unit:</span>
              <span className="font-mono font-bold text-stone-900 text-lg">
                ₹{originalOffer.pricePerUnit} <span className="text-xs font-normal text-stone-500">/ {originalOffer.unit}</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-stone-500">Volume:</span>
              <span className="font-mono font-semibold text-stone-800">
                {originalOffer.quantity.toLocaleString('en-IN')} {originalOffer.unit}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-stone-500">Incoterm:</span>
              <span className="font-mono font-bold text-stone-800 bg-white px-2 py-0.5 rounded border border-stone-200">
                {originalOffer.incoterm}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-stone-500">Quality Grade:</span>
              <span className="font-semibold text-stone-800">{originalOffer.qualityGrade}</span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-baseline justify-between">
              <span className="text-xs font-bold text-stone-700">Total Contract:</span>
              <span className="font-mono font-bold text-stone-900 text-base">
                ₹{originalOffer.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {originalOffer.termsAndNotes && (
            <p className="text-[11px] text-stone-500 italic bg-white p-2.5 rounded-xl border border-stone-100 leading-relaxed">
              "{originalOffer.termsAndNotes}"
            </p>
          )}
        </div>

        {/* Counter Offer Card */}
        <div className="p-4 rounded-2xl border-2 border-farm-orange/40 bg-orange-50/20 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-farm-orange uppercase tracking-wider flex items-center gap-1">
              <span>{counterOffer.offeredBy === 'buyer' ? "Buyer's Counter-offer" : "Farmer's Counter-offer"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-farm-orange animate-ping"></span>
            </span>
            <span className="text-[10px] text-farm-orange font-mono font-bold">
              PROPOSED
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600">Price / Unit:</span>
              <div className="text-right">
                <span className="font-mono font-bold text-stone-900 text-xl text-farm-orange">
                  ₹{counterOffer.pricePerUnit} <span className="text-xs font-normal text-stone-500">/ {counterOffer.unit}</span>
                </span>
                {priceDiff !== 0 && (
                  <span className={`block text-[10px] font-mono font-bold ${priceDiff < 0 ? 'text-blue-700' : 'text-emerald-700'}`}>
                    {priceDiff < 0 ? `₹${Math.abs(priceDiff)} lower` : `+₹${priceDiff} higher`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-stone-600">Volume:</span>
              <span className="font-mono font-semibold text-stone-800">
                {counterOffer.quantity.toLocaleString('en-IN')} {counterOffer.unit}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-stone-600">Incoterm:</span>
              <span className="font-mono font-bold text-farm-orange bg-white px-2 py-0.5 rounded border border-orange-200">
                {counterOffer.incoterm}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-stone-600">Quality Grade:</span>
              <span className="font-semibold text-stone-800">{counterOffer.qualityGrade}</span>
            </div>

            <div className="pt-2 border-t border-orange-200 flex items-baseline justify-between">
              <span className="text-xs font-bold text-stone-800">Total Contract:</span>
              <div className="text-right">
                <span className="font-mono font-bold text-stone-900 text-base">
                  ₹{counterOffer.totalAmount.toLocaleString('en-IN')}
                </span>
                {totalDiff !== 0 && (
                  <span className={`block text-[10px] font-mono font-bold ${totalDiff < 0 ? 'text-blue-700' : 'text-emerald-700'}`}>
                    {totalDiff < 0 ? `-₹${Math.abs(totalDiff).toLocaleString('en-IN')}` : `+₹${totalDiff.toLocaleString('en-IN')}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {counterOffer.termsAndNotes && (
            <p className="text-[11px] text-stone-600 italic bg-white p-2.5 rounded-xl border border-orange-100 leading-relaxed">
              "{counterOffer.termsAndNotes}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
