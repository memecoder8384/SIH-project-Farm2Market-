import React from 'react';
import { NegotiationOffer } from '../../types/tradeFlow';
import { Tractor, ShoppingBag, CheckCircle2, ArrowDown, Clock, ShieldCheck } from 'lucide-react';

interface NegotiationTimelineProps {
  history: NegotiationOffer[];
  isConfirmed?: boolean;
}

export const NegotiationTimeline: React.FC<NegotiationTimelineProps> = ({
  history,
  isConfirmed = false,
}) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 text-center bg-stone-50 rounded-3xl border border-stone-200">
        <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
        <h5 className="font-bold text-xs text-stone-700">Awaiting Initial Quotation</h5>
        <p className="text-[11px] text-stone-500 mt-0.5">
          No offers have been exchanged yet. Once the farmer submits a quotation, the timeline will begin here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-farm-orange">
            Negotiation History &amp; Audit Trail
          </span>
          <h4 className="font-serif-heading text-xl font-bold text-stone-900 leading-snug">
            Counter-Offer &amp; Terms Timeline
          </h4>
        </div>
        <span className="text-xs font-mono font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
          {history.length} {history.length === 1 ? 'Exchange' : 'Exchanges'}
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
        {history.map((offer, idx) => {
          const isCurrent = idx === history.length - 1;
          const isFarmer = offer.offeredBy === 'farmer';

          return (
            <div key={offer.id} className="relative group">
              {/* Timeline Bullet Icon */}
              <div
                className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  offer.status === 'accepted'
                    ? 'bg-emerald-500 border-white text-white shadow-md'
                    : isCurrent
                    ? 'bg-farm-orange border-white text-white shadow-md ring-4 ring-orange-100'
                    : isFarmer
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-blue-100 border-blue-300 text-blue-900'
                }`}
              >
                {offer.status === 'accepted' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isFarmer ? (
                  <Tractor className="w-3 h-3" />
                ) : (
                  <ShoppingBag className="w-3 h-3" />
                )}
              </div>

              {/* Offer Card Container */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  offer.status === 'accepted'
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : isCurrent
                    ? 'bg-white border-farm-orange shadow-md ring-1 ring-farm-orange/20'
                    : 'bg-stone-50/70 border-stone-200'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        isFarmer ? 'text-amber-950' : 'text-blue-950'
                      }`}
                    >
                      {isFarmer ? 'Farmer/FPO' : 'Buyer Counter-offer'}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      • {offer.senderName} ({offer.senderEntity})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400 font-mono">
                      {offer.timestamp}
                    </span>
                    {isCurrent && offer.status !== 'accepted' && (
                      <span className="text-[9px] bg-orange-100 text-farm-orange font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Current Offer
                      </span>
                    )}
                    {offer.status === 'accepted' && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Accepted</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Offer Metric Strip */}
                <div className="flex flex-wrap items-center gap-3 text-xs py-2 border-y border-stone-100 font-mono">
                  <div>
                    <span className="text-stone-400 text-[10px] block font-sans">Rate</span>
                    <strong className="text-stone-900 text-sm">
                      ₹{offer.pricePerUnit}/{offer.unit}
                    </strong>
                  </div>
                  <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
                  <div>
                    <span className="text-stone-400 text-[10px] block font-sans">Quantity</span>
                    <strong className="text-stone-800">
                      {offer.quantity.toLocaleString('en-IN')} {offer.unit}
                    </strong>
                  </div>
                  <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
                  <div>
                    <span className="text-stone-400 text-[10px] block font-sans">Incoterm</span>
                    <strong className="text-stone-800 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {offer.incoterm}
                    </strong>
                  </div>
                  <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
                  <div>
                    <span className="text-stone-400 text-[10px] block font-sans">Grade</span>
                    <span className="text-stone-700 font-sans font-semibold">{offer.qualityGrade}</span>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-stone-400 text-[10px] block font-sans">Total</span>
                    <strong className="text-emerald-800 font-bold text-sm">
                      ₹{offer.totalAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* Terms notes */}
                {offer.termsAndNotes && (
                  <p className="text-[11px] text-stone-600 mt-2 italic leading-relaxed">
                    "{offer.termsAndNotes}"
                  </p>
                )}
              </div>

              {/* Connecting Down Arrow between steps */}
              {idx < history.length - 1 && (
                <div className="flex items-center justify-center my-1.5 -ml-6 text-stone-300">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Final Accepted Seal if Confirmed */}
        {isConfirmed && (
          <div className="relative group pt-1">
            <div className="absolute -left-6 top-3 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-100/90 border border-emerald-300 text-emerald-950 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span>Agreement Finalized • Confirmed Order Locked</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-800">
                🔒 Ready for Delivery
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
