import React, { useState } from 'react';
import { ProduceItem, Farm, UserRole } from '../types';
import { FarmCardSvg } from '../components/common/FarmCardSvg';
import { ShadowImage } from '../components/common/ShadowLoader';
import { MOCK_FARMS } from '../data/mockData';
import { ArrowLeft, Star, MapPin, ShieldCheck, CheckCircle2, Truck, Award, Sparkles, Scale, Tractor, PlusCircle, Send } from 'lucide-react';
import { InquiryFormModal } from '../components/trade/InquiryFormModal';

interface ProductDetailProps {
  product: ProduceItem;
  onBack: () => void;
  onNavigate: (tab: string, param?: any) => void;
  onAddToCart: (product: ProduceItem, quantity: number) => void;
  currentRole?: UserRole;
  onOpenListModal?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onNavigate,
  onAddToCart,
  currentRole = 'visitor',
  onOpenListModal,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [pricingMode, setPricingMode] = useState<'retail' | 'bulk'>('retail');
  const [reservedSuccess, setReservedSuccess] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const matchedFarm = MOCK_FARMS.find((f) => f.id === product.farmId) || MOCK_FARMS[0];

  const unitPrice = pricingMode === 'retail' ? product.retailPrice : product.bulkPrice;
  const totalPrice = unitPrice * quantity;
  const farmerEarnings = Math.round(totalPrice * 0.85);

  const handleReserve = () => {
    onAddToCart(product, quantity);
    setReservedSuccess(true);
    setTimeout(() => {
      onNavigate('orders');
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Back Button & Breadcrumbs */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 mb-6 group cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Produce Marketplace</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 7 Cols: Imagery, Specs, Quality Bento */}
        <div className="lg:col-span-7 space-y-8">
          {/* Large Product Photography Header */}
          <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden relative border border-stone-200 shadow-md bg-stone-900">
            {product.imageUrl ? (
              <ShadowImage
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FarmCardSvg type={product.imageTheme} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-transparent"></div>

            <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-xs text-xs font-bold px-3 py-1.5 rounded-full text-emerald-800 border border-emerald-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{product.originBadge}</span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-300">
                {product.category}
              </span>
              <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold mt-1 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-stone-200 mt-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{product.farmName} • {product.location}</span>
              </p>
            </div>
          </div>

          {/* Quality Bento Grid */}
          <div>
            <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mb-3">
              Crop Quality &amp; Farm Health
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Taste &amp; Sweetness</span>
                <span className="text-base font-bold text-emerald-700 font-mono mt-1 block">
                  {product.brixSweetnessIndex || 'Grade AA+'}
                </span>
                <span className="text-[10px] text-stone-500 mt-1 block">Naturally sweet &amp; ripe</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Purity &amp; Safety</span>
                <span className="text-base font-bold text-sky-700 font-mono mt-1 block">
                  100% Clean
                </span>
                <span className="text-[10px] text-stone-500 mt-1 block">Zero harmful pesticides</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Soil Quality</span>
                <span className="text-base font-bold text-amber-800 font-mono mt-1 block">
                  Rich Organic
                </span>
                <span className="text-[10px] text-stone-500 mt-1 block">Natural compost grown</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Fresh Delivery</span>
                <span className="text-base font-bold text-stone-900 font-mono mt-1 block">
                  Cool Van
                </span>
                <span className="text-[10px] text-stone-500 mt-1 block">Kept fresh in transit</span>
              </div>
            </div>
          </div>

          {/* Description & Agronomy Notes */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
              About This Crop &amp; Harvest
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {product.description}
            </p>

            <div className="pt-3 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
                Nutrition &amp; Benefits:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.nutritionalNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold rounded-full flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-farm-green" />
                    <span>{note}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Farmer & FPO Profile Card */}
          <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-farm-orange">
                Farming Group &amp; Producer
              </span>
              <h4 className="font-serif-heading text-2xl font-bold text-stone-900 mt-0.5">
                {matchedFarm.fpoName || matchedFarm.name}
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Managed by <strong className="text-stone-800">{matchedFarm.farmerName}</strong> • {matchedFarm.soilType}
              </p>
            </div>
            <button
              onClick={() => onNavigate('farmer-dashboard')}
              className="px-4 py-2 border border-stone-300 hover:bg-white text-stone-800 text-xs font-bold rounded-xl shrink-0 transition-colors cursor-pointer"
            >
              View Farm Details →
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Pricing & Action Drawer */}
        <div className="lg:col-span-5 space-y-6">
          {currentRole === 'farmer' ? (
            /* Farmer View: Benchmarks & Option to List Crop (NO BUY) */
            <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-7 shadow-lg sticky top-24 space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-700 border border-amber-200">
                  <Tractor className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block">
                    Farmer Account • Listing Mode
                  </span>
                  <h3 className="font-serif-heading text-xl font-bold text-stone-900">
                    Fair Price Check
                  </h3>
                </div>
              </div>

              {/* Price comparison */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Regular Mandi Price:</span>
                  <span className="font-mono font-bold text-stone-700 line-through">
                    ₹{product.mandiMspPrice || Math.round(product.retailPrice * 0.7)} / {product.retailUnit.split(' ')[0]}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Direct Farm2Market Price:</span>
                  <span className="font-mono font-bold text-emerald-800 text-base">
                    ₹{product.retailPrice} / {product.retailUnit.split(' ')[0]}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-200 text-emerald-700 font-bold">
                  <span>Your Extra Profit:</span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-900">
                    +{Math.round(((product.retailPrice - (product.mandiMspPrice || product.retailPrice * 0.7)) / (product.mandiMspPrice || product.retailPrice * 0.7)) * 100)}% more than mandi
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Farmer Account:</strong> You can list your fresh crops for buyers to purchase. Direct purchasing is only available on buyer accounts.
                </span>
              </div>

              {/* Farmer Action Button: List harvest lot */}
              <button
                onClick={() => {
                  if (onOpenListModal) onOpenListModal();
                  else onNavigate('farmer-dashboard');
                }}
                className="w-full py-4 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Crop in {product.category}</span>
              </button>

              <button
                onClick={() => onNavigate('farmer-dashboard')}
                className="w-full py-3 border border-stone-200 hover:bg-stone-50 rounded-2xl text-stone-700 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Go to Farmer Dashboard
              </button>
            </div>
          ) : (
            /* Buyer / Visitor View: Purchase and Reserve */
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-lg sticky top-24">
              {/* Pricing Mode Toggle */}
              <div className="flex bg-stone-100 p-1 rounded-xl mb-6 border border-stone-200">
                <button
                  onClick={() => {
                    setPricingMode('retail');
                    setQuantity(1);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    pricingMode === 'retail'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Small Pack (Retail)
                </button>
                <button
                  onClick={() => {
                    setPricingMode('bulk');
                    setQuantity(product.bulkMinUnit);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    pricingMode === 'bulk'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Bulk Order (100kg+)
                </button>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Direct Farm Price</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-bold font-mono text-stone-900">₹{unitPrice}</span>
                    <span className="text-xs text-stone-500">
                      / {pricingMode === 'retail' ? product.retailUnit : 'kg'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  85% Goes to Farmer
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="my-6">
                <label className="block text-xs font-bold text-stone-700 mb-2">Select Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center font-bold text-stone-800 cursor-pointer"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-mono font-bold text-lg text-stone-900">
                    {quantity} {pricingMode === 'retail' ? 'Units' : 'Kg'}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center font-bold text-stone-800 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({quantity} units):</span>
                  <span className="font-mono font-bold text-stone-900">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Direct Farmer Payout (85%):</span>
                  <span className="font-mono">₹{farmerEarnings}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>Delivery &amp; Packaging (10%):</span>
                  <span className="font-mono">₹{Math.round(totalPrice * 0.10)}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>Platform &amp; Quality Check (5%):</span>
                  <span className="font-mono">₹{Math.round(totalPrice * 0.05)}</span>
                </div>
              </div>

              {/* Quota Progress */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-500">Stock Booked:</span>
                  <span className="text-farm-green-dark font-bold">{product.allotmentReservedPercent}%</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-farm-green h-full rounded-full"
                    style={{ width: `${product.allotmentReservedPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleReserve}
                className="mt-6 w-full py-4 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                {reservedSuccess ? '✓ Order Placed! Loading...' : 'Buy Now / Add to Basket'}
              </button>

              {/* B2B Send Inquiry Button */}
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="mt-3 w-full py-3.5 bg-white hover:bg-amber-50/60 border-2 border-farm-orange text-farm-orange rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry (B2B Bulk Quotation)</span>
              </button>

              <span className="text-[11px] text-stone-500 text-center block mt-3">
                Safe payments: Your money is protected until delivery is completed and verified.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Form Modal */}
      <InquiryFormModal
        product={product}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        onInquiryCreated={(id) => onNavigate('inquiry-detail', { id })}
      />
    </div>
  );
};
