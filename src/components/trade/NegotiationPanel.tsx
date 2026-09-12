import React, { useState } from 'react';
import { Inquiry, Incoterm } from '../../types/tradeFlow';
import { useTradeFlow } from '../../context/TradeFlowContext';
import { Check, Edit3, X, Send, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface NegotiationPanelProps {
  inquiry: Inquiry;
  activeRole: 'buyer' | 'farmer';
  userName?: string;
  onOrderConfirmed?: (orderId: string) => void;
}

export const NegotiationPanel: React.FC<NegotiationPanelProps> = ({
  inquiry,
  activeRole,
  userName = 'Authorized User',
  onOrderConfirmed,
}) => {
  const { acceptOffer, submitCounterOffer, rejectInquiry } = useTradeFlow();

  const [isCounterFormOpen, setIsCounterFormOpen] = useState(false);
  const [rejectReasonOpen, setRejectReasonOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const currentOffer = inquiry.currentQuotation;

  // Counter offer form state
  const [counterPrice, setCounterPrice] = useState<number>(
    currentOffer ? currentOffer.pricePerUnit : 30
  );
  const [counterQty, setCounterQty] = useState<number>(
    currentOffer ? currentOffer.quantity : inquiry.requestedQuantity
  );
  const [counterIncoterm, setCounterIncoterm] = useState<Incoterm>(
    currentOffer ? currentOffer.incoterm : 'DAP'
  );
  const [counterQuality, setCounterQuality] = useState<string>(
    currentOffer ? currentOffer.qualityGrade : inquiry.qualityRequirement
  );
  const [counterTerms, setCounterTerms] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (inquiry.status === 'Order Confirmed' || inquiry.status === 'Accepted') {
    return (
      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-2xl text-emerald-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-sm block">Agreement Confirmed!</span>
            <span className="text-xs text-emerald-800">
              Terms are locked. Official confirmed B2B order has been generated.
            </span>
          </div>
        </div>

        {inquiry.confirmedOrderId && onOrderConfirmed && (
          <button
            onClick={() => onOrderConfirmed(inquiry.confirmedOrderId!)}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>View Confirmed Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  if (inquiry.status === 'Rejected') {
    return (
      <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 flex items-center gap-3 text-xs">
        <X className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <strong className="block text-sm">Negotiation Closed (Rejected)</strong>
          <span className="text-rose-800">
            This trade inquiry has been marked as rejected by one of the parties.
          </span>
        </div>
      </div>
    );
  }

  if (!currentOffer) {
    return (
      <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <strong className="block text-sm">Waiting for Initial Quotation</strong>
          <span className="text-amber-800">
            {activeRole === 'farmer'
              ? 'You have not sent a quotation yet. Use the "Send Quotation" button above to propose rate and terms.'
              : 'The farmer/FPO has received your inquiry and is preparing the formal quotation.'}
          </span>
        </div>
      </div>
    );
  }

  // Determine if it's this user's turn to respond
  const isMyOffer = currentOffer.offeredBy === activeRole;

  const handleAccept = () => {
    if (!window.confirm(`Are you sure you want to accept this offer at ₹${currentOffer.pricePerUnit}/${currentOffer.unit} (${currentOffer.incoterm})? This will generate a locked confirmed order.`)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = acceptOffer(inquiry.id, activeRole, userName);
      setIsSubmitting(false);
      if (onOrderConfirmed) {
        onOrderConfirmed(result.order.id);
      }
    }, 400);
  };

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterPrice || !counterQty) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitCounterOffer(inquiry.id, {
        offeredBy: activeRole,
        senderName: userName,
        senderEntity: activeRole === 'buyer' ? inquiry.buyerEntity : inquiry.fpoName,
        pricePerUnit: counterPrice,
        quantity: counterQty,
        unit: inquiry.unit,
        incoterm: counterIncoterm,
        qualityGrade: counterQuality,
        deliveryLocation: inquiry.deliveryLocation,
        termsAndNotes: counterTerms || `Counter-offer proposed by ${activeRole}`,
      });
      setIsSubmitting(false);
      setIsCounterFormOpen(false);
    }, 400);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a brief reason for rejecting this inquiry.');
      return;
    }
    rejectInquiry(inquiry.id, rejectReason, activeRole);
    setRejectReasonOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
      {/* Role Switcher & Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-farm-orange">
            Interactive Transaction Controls
          </span>
          <h4 className="font-serif-heading text-lg font-bold text-stone-900">
            Actions for {activeRole === 'buyer' ? 'Buyer' : 'Farmer / FPO Producer'}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {isMyOffer ? (
            <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-semibold">
              Waiting for other party to respond
            </span>
          ) : (
            <span className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full font-bold animate-pulse">
              Your Turn to Act
            </span>
          )}
        </div>
      </div>

      {/* Primary Action Buttons */}
      {!isCounterFormOpen && !rejectReasonOpen && (
        <div className="flex flex-wrap items-center gap-3">
          {/* Accept Button */}
          <button
            onClick={handleAccept}
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>
              {activeRole === 'buyer' ? 'Accept Quotation' : 'Accept Counter-offer'}
            </span>
          </button>

          {/* Negotiate / Counter-offer Button */}
          <button
            onClick={() => setIsCounterFormOpen(true)}
            className="flex-1 sm:flex-initial px-6 py-3.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>
              {activeRole === 'buyer' ? 'Negotiate Price / Terms' : 'Make Counter-offer'}
            </span>
          </button>

          {/* Farmer Reject Option */}
          <button
            onClick={() => setRejectReasonOpen(true)}
            className="px-4 py-3.5 border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-rose-600 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Reject
          </button>
        </div>
      )}

      {/* Reject Reason Form */}
      {rejectReasonOpen && (
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex justify-between items-center text-xs font-bold text-rose-950">
            <span>Reason for Rejection</span>
            <button onClick={() => setRejectReasonOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
          </div>
          <input
            type="text"
            placeholder="e.g. Price too low, stock committed elsewhere, delivery terms unacceptable"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 bg-white"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setRejectReasonOpen(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}

      {/* Inline Counter-offer Form */}
      {isCounterFormOpen && (
        <form onSubmit={handleCounterSubmit} className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-orange-200/80 pb-2">
            <div>
              <h5 className="font-bold text-xs text-stone-900">
                Propose Counter-Offer as {activeRole === 'buyer' ? 'Buyer' : 'Farmer'}
              </h5>
              <span className="text-[10px] text-stone-500">
                Previous rate: ₹{currentOffer.pricePerUnit}/{currentOffer.unit} • {currentOffer.incoterm}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCounterFormOpen(false)}
              className="text-stone-400 hover:text-stone-700 text-xs font-bold p-1 cursor-pointer"
            >
              ✕ Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Counter Price (₹/{inquiry.unit})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-xs text-stone-400">₹</span>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 text-xs font-mono font-bold rounded-xl border border-stone-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Volume ({inquiry.unit})
              </label>
              <input
                type="number"
                required
                value={counterQty}
                onChange={(e) => setCounterQty(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Incoterm
              </label>
              <select
                value={counterIncoterm}
                onChange={(e) => setCounterIncoterm(e.target.value as Incoterm)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono font-bold cursor-pointer"
              >
                <option value="DAP">DAP (Delivered at Place)</option>
                <option value="CIF">CIF (Cost, Insured, Freight)</option>
                <option value="FOB">FOB (Free on Board Hub)</option>
                <option value="EXW">EXW (Ex Works Farm Gate)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Quality Grade
              </label>
              <select
                value={counterQuality}
                onChange={(e) => setCounterQuality(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
              >
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Export Grade AA+">Export Grade AA+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Negotiation Note / Reason
              </label>
              <input
                type="text"
                placeholder="e.g. Can commit to recurring orders; please adjust freight."
                value={counterTerms}
                onChange={(e) => setCounterTerms(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
              />
            </div>
          </div>

          {/* Real-time total for counter-offer */}
          <div className="p-3 bg-white rounded-xl border border-orange-200 flex items-center justify-between text-xs">
            <span className="text-stone-600">
              New Calculated Value: <strong>₹{counterPrice} × {counterQty.toLocaleString('en-IN')} {inquiry.unit}</strong>
            </span>
            <span className="font-mono font-bold text-base text-stone-900">
              ₹{(counterPrice * counterQty).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCounterFormOpen(false)}
              className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{isSubmitting ? 'Submitting...' : 'Send Counter-Offer'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
