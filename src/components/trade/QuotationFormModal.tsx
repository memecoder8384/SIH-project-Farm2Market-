import React, { useState, useMemo } from 'react';
import { Inquiry, Incoterm } from '../../types/tradeFlow';
import { useTradeFlow } from '../../context/TradeFlowContext';
import { X, Send, FileText, CheckCircle2, Info, Sparkles, Building2 } from 'lucide-react';

interface QuotationFormModalProps {
  inquiry: Inquiry;
  isOpen: boolean;
  onClose: () => void;
  onQuotationSent?: () => void;
}

export const QuotationFormModal: React.FC<QuotationFormModalProps> = ({
  inquiry,
  isOpen,
  onClose,
  onQuotationSent,
}) => {
  const { submitQuotation } = useTradeFlow();

  const [pricePerUnit, setPricePerUnit] = useState<number>(32);
  const [availableQuantity, setAvailableQuantity] = useState<number>(inquiry.requestedQuantity);
  const [qualityGrade, setQualityGrade] = useState<string>(inquiry.qualityRequirement || 'Grade A');
  const [incoterm, setIncoterm] = useState<Incoterm>('DAP');
  const [termsAndNotes, setTermsAndNotes] = useState<string>(
    'Reefer cold-van freight included to buyer warehouse. 100% payout released upon receipt inspection.'
  );

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = useMemo(() => {
    return (pricePerUnit || 0) * (availableQuantity || 0);
  }, [pricePerUnit, availableQuantity]);

  if (!isOpen) return null;

  const incotermDescriptions: Record<Incoterm, { title: string; desc: string }> = {
    EXW: {
      title: 'Ex Works (Farm Gate)',
      desc: 'Buyer arranges and pays for pickup directly from farm/warehouse.',
    },
    FOB: {
      title: 'Free On Board (Hub/Port)',
      desc: 'Farmer delivers to nearest regional aggregator hub or logistics terminal.',
    },
    CIF: {
      title: 'Cost, Insurance & Freight',
      desc: 'Farmer covers freight and cargo transit insurance to designated regional hub.',
    },
    DAP: {
      title: 'Delivered at Place (Buyer Door)',
      desc: 'Farmer delivers directly to buyer designated address or warehouse dock.',
    },
  };

  const handleApplyExample = () => {
    setPricePerUnit(32);
    setAvailableQuantity(2000);
    setQualityGrade('Grade A');
    setIncoterm('DAP');
    setTermsAndNotes('Dispatch via 14ft reefer vehicle at 12°C. Payment released on gate weighment.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricePerUnit || !availableQuantity) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitQuotation(inquiry.id, {
        pricePerUnit,
        availableQuantity,
        unit: inquiry.unit,
        qualityGrade,
        incoterm,
        termsAndNotes,
        senderName: inquiry.farmerName,
        senderEntity: inquiry.fpoName,
      });

      setIsSubmitting(false);
      onClose();
      if (onQuotationSent) onQuotationSent();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-xl border border-emerald-100 shadow-2xs text-emerald-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Farmer FPO Quotation
              </span>
              <h2 className="font-serif-heading text-xl font-bold text-stone-900 leading-tight">
                Prepare &amp; Send Quotation
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Inquiry Context Strip */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">
                Responding To Inquiry #{inquiry.id}
              </span>
              <div className="font-bold text-stone-900 mt-0.5">
                {inquiry.productName} • {inquiry.requestedQuantity.toLocaleString('en-IN')} {inquiry.unit}
              </div>
              <span className="text-[11px] text-stone-500">
                Buyer: {inquiry.buyerName} ({inquiry.buyerEntity}) • Destination: {inquiry.deliveryLocation}
              </span>
            </div>
            <button
              type="button"
              onClick={handleApplyExample}
              className="text-[10px] font-bold text-emerald-800 hover:underline bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 self-start sm:self-center cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Fill Example ₹32/DAP</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Price & Quantity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Price Per Unit (₹/{inquiry.unit}) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-stone-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full pl-7 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-white font-mono font-bold text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Available Quantity ({inquiry.unit}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={availableQuantity}
                  onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-white font-mono font-bold text-stone-900"
                />
              </div>
            </div>

            {/* Quality Grade */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Offered Quality Grade <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Grade A', 'Grade B', 'Export Grade AA+'].map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setQualityGrade(grade)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      qualityGrade === grade
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-2xs font-bold'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Incoterm Selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  Select Incoterm <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-stone-400">Trade Delivery Terms</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['EXW', 'FOB', 'CIF', 'DAP'] as Incoterm[]).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setIncoterm(term)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      incoterm === term
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-500/40'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-mono font-bold text-xs">{term}</div>
                    <div className="text-[9px] text-stone-500 leading-tight mt-0.5">
                      {term === 'EXW' && 'Farm Gate'}
                      {term === 'FOB' && 'Hub / Port'}
                      {term === 'CIF' && 'Cargo Insured'}
                      {term === 'DAP' && 'Delivered Door'}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>{incoterm}</strong>: {incotermDescriptions[incoterm].desc}
                </span>
              </p>
            </div>

            {/* Additional Terms / Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Additional Terms &amp; Conditions
              </label>
              <textarea
                rows={2}
                value={termsAndNotes}
                onChange={(e) => setTermsAndNotes(e.target.value)}
                placeholder="e.g. Reefer temperature set at 12°C, dispatch within 4 hours of harvest, payment upon dock weighing."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 bg-white"
              />
            </div>

            {/* Automatically Calculated Total Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-farm-green text-white shadow-md space-y-1">
              <div className="flex items-center justify-between text-xs opacity-90">
                <span>Calculated Total Contract Value:</span>
                <span className="font-mono">
                  ₹{pricePerUnit} × {availableQuantity.toLocaleString('en-IN')} {inquiry.unit}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1 border-t border-white/20">
                <span className="font-bold text-sm">Total Quotation Amount:</span>
                <span className="font-mono text-2xl font-bold">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] opacity-80 pt-0.5">
                Terms: {incoterm} ({incotermDescriptions[incoterm].title}) • Quality: {qualityGrade}
              </div>
            </div>

            {/* Quotation Preview Toggle */}
            <div className="border-t border-stone-100 pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showPreview ? 'Hide Quotation Preview' : 'Show Quotation Preview'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Quotation'}</span>
                </button>
              </div>
            </div>

            {/* Live Quotation Preview Sheet */}
            {showPreview && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2 animate-in fade-in duration-150">
                <div className="font-bold text-stone-800 border-b border-stone-200 pb-1 flex items-center justify-between">
                  <span>Official Quotation Preview</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono font-bold">
                    DRAFT
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block">Seller (Farmer/FPO):</span>
                    <strong className="text-stone-800">{inquiry.farmerName}</strong>
                    <span className="text-stone-500 block text-[10px]">{inquiry.fpoName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Buyer:</span>
                    <strong className="text-stone-800">{inquiry.buyerName}</strong>
                    <span className="text-stone-500 block text-[10px]">{inquiry.buyerEntity}</span>
                  </div>
                </div>
                <div className="pt-1 border-t border-stone-200 flex justify-between">
                  <span className="text-stone-500">Agreed Incoterm:</span>
                  <strong className="text-stone-800 font-mono">{incoterm}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Rate &amp; Quantity:</span>
                  <strong className="text-stone-800 font-mono">₹{pricePerUnit}/{inquiry.unit} ({availableQuantity} {inquiry.unit})</strong>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-stone-200">
                  <span>Gross Payout:</span>
                  <span className="font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
