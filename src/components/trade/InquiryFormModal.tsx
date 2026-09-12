import React, { useState } from 'react';
import { ProduceItem } from '../../types';
import { useTradeFlow } from '../../context/TradeFlowContext';
import { X, Send, CheckCircle2, Sparkles, MapPin, Package, ShieldCheck } from 'lucide-react';

interface InquiryFormModalProps {
  product: ProduceItem;
  isOpen: boolean;
  onClose: () => void;
  onInquiryCreated?: (inquiryId: string) => void;
}

export const InquiryFormModal: React.FC<InquiryFormModalProps> = ({
  product,
  isOpen,
  onClose,
  onInquiryCreated,
}) => {
  const { createInquiry } = useTradeFlow();

  const [quantity, setQuantity] = useState<number>(2000);
  const [unit, setUnit] = useState<string>('kg');
  const [qualityGrade, setQualityGrade] = useState<string>('Grade A');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Delhi NCR Central Depot, Kundli');
  const [additionalRequirements, setAdditionalRequirements] = useState<string>(
    'Fresh morning harvest, uniform sizing, cold-chain reefer transport.'
  );

  const [buyerName, setBuyerName] = useState<string>('Vikram Mehta');
  const [buyerEntity, setBuyerEntity] = useState<string>('Delhi NCR Fresh Wholesale Ltd.');

  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = () => {
    setQuantity(2000);
    setUnit('kg');
    setQualityGrade('Grade A');
    setDeliveryLocation('Delhi NCR Central Depot, Kundli');
    setAdditionalRequirements('Fresh morning harvest, uniform sizing, cold-chain reefer transport.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = createInquiry({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        category: product.category,
        farmId: product.farmId,
        farmerName: product.farmName,
        fpoName: product.farmName,
        farmerLocation: product.location,
        buyerName,
        buyerEntity,
        buyerLocation: deliveryLocation,
        requestedQuantity: quantity,
        unit,
        qualityRequirement: qualityGrade,
        deliveryLocation,
        additionalRequirements,
      });

      setIsSubmitting(false);
      setSubmittedInquiryId(created.id);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-farm-sky-pale to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-xl border border-sky-100 shadow-2xs text-farm-orange">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-farm-orange">
                B2B Direct Sourcing
              </span>
              <h2 className="font-serif-heading text-xl font-bold text-stone-900 leading-tight">
                Send Bulk Crop Inquiry
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {submittedInquiryId ? (
            /* Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto animate-in zoom-in">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Inquiry Status → Pending
                </span>
                <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mt-2">
                  Inquiry Sent Successfully!
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-1">
                  Your bulk inquiry <strong className="font-mono text-stone-800">{submittedInquiryId}</strong> has been transmitted to <strong>{product.farmName}</strong>. You will receive an official quotation with price &amp; Incoterm shortly.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-stone-500">Product:</span>
                  <span className="font-bold text-stone-800">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Requested Volume:</span>
                  <span className="font-bold text-stone-800 font-mono">{quantity.toLocaleString('en-IN')} {unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Quality Requirement:</span>
                  <span className="font-bold text-stone-800">{qualityGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivery Destination:</span>
                  <span className="font-bold text-stone-800">{deliveryLocation}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    if (onInquiryCreated) onInquiryCreated(submittedInquiryId);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  View Inquiry Details →
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Back to Product
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Preview Card */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 leading-snug">
                      {product.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {product.farmName} • {product.location}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyPreset}
                  className="text-[10px] font-bold text-farm-orange hover:underline bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                  title="Quick fill 2,000 kg Grade A Delhi NCR example"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Fill Example</span>
                </button>
              </div>

              {/* Quantity & Unit Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Required Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="e.g. 2000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Unit <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange bg-white cursor-pointer"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">Quintal (100kg)</option>
                    <option value="metric tons">Metric Tons (MT)</option>
                    <option value="crates">Crates (10-15kg)</option>
                  </select>
                </div>
              </div>

              {/* Quality Grade Requirement */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Quality / Grade Requirement <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Grade A', 'Grade B', 'Export Grade AA+'].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setQualityGrade(grade)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        qualityGrade === grade
                          ? 'bg-amber-50 border-farm-orange text-farm-orange shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Destination */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Delivery Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Delhi NCR Central Depot, Kundli"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange bg-white"
                  />
                </div>
              </div>

              {/* Buyer / Company Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Company / Entity Name
                  </label>
                  <input
                    type="text"
                    value={buyerEntity}
                    onChange={(e) => setBuyerEntity(e.target.value)}
                    placeholder="Company or Restaurant"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Additional Requirements &amp; Notes
                </label>
                <textarea
                  rows={2}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="Specify packaging, lab test certificates, preferred harvest time, etc."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  After sending, the inquiry is placed in <strong>Pending</strong> status. The farmer/FPO will respond with an official quotation and Incoterm.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
