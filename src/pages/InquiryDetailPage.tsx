import React, { useState, useMemo } from 'react';
import { useTradeFlow } from '../context/TradeFlowContext';
import { StatusBadge } from '../components/trade/StatusBadge';
import { OfferComparison } from '../components/trade/OfferComparison';
import { NegotiationTimeline } from '../components/trade/NegotiationTimeline';
import { NegotiationPanel } from '../components/trade/NegotiationPanel';
import { QuotationFormModal } from '../components/trade/QuotationFormModal';
import { UserRole } from '../types';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  User,
  Package,
  Send,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface InquiryDetailPageProps {
  inquiryId: string;
  currentRole: UserRole;
  onNavigate: (tab: string, param?: any) => void;
}

export const InquiryDetailPage: React.FC<InquiryDetailPageProps> = ({
  inquiryId,
  currentRole,
  onNavigate,
}) => {
  const { getInquiry, getOrder } = useTradeFlow();
  const inquiry = getInquiry(inquiryId);

  // Allow switching view perspective for testing both sides
  const [activePerspective, setActivePerspective] = useState<'buyer' | 'farmer'>(
    currentRole === 'farmer' ? 'farmer' : 'buyer'
  );

  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  if (!inquiry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif-heading text-2xl font-bold text-stone-900">Inquiry Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">
          The requested trade inquiry <strong className="font-mono">{inquiryId}</strong> could not be located.
        </p>
        <button
          onClick={() => onNavigate('marketplace')}
          className="mt-6 px-5 py-2.5 bg-farm-orange text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          ← Return to Marketplace
        </button>
      </div>
    );
  }

  const currentQuote = inquiry.currentQuotation;
  const isConfirmed = inquiry.status === 'Order Confirmed';

  // For side-by-side comparison:
  // If there are at least 2 offers in negotiationHistory, compare the second to last and the last!
  const hasMultipleOffers = inquiry.negotiationHistory.length >= 2;
  const previousOffer = hasMultipleOffers
    ? inquiry.negotiationHistory[inquiry.negotiationHistory.length - 2]
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Dual-Perspective Switcher Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <button
          onClick={() => onNavigate(activePerspective === 'farmer' ? 'farmer-dashboard' : 'marketplace')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {activePerspective === 'farmer' ? 'Farmer FPO' : 'Marketplace'}</span>
        </button>

        {/* Perspective Switcher for Testing */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200 self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-stone-400 pl-2">Testing View:</span>
          <button
            onClick={() => setActivePerspective('buyer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePerspective === 'buyer'
                ? 'bg-white text-blue-900 shadow-2xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Buyer Perspective
          </button>
          <button
            onClick={() => setActivePerspective('farmer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePerspective === 'farmer'
                ? 'bg-white text-amber-900 shadow-2xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Farmer FPO Perspective
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="eyebrow-badge text-farm-orange">
                B2B TRADE WORKSPACE • /inquiry/{inquiry.id}
              </span>
              <StatusBadge status={inquiry.status} size="sm" />
            </div>

            <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              {inquiry.productName}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-2 font-mono">
              <span>Inquiry ID: <strong className="text-stone-800">{inquiry.id}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 font-sans">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Created {inquiry.createdAt}
              </span>
              <span>•</span>
              <span>Last Activity: {inquiry.updatedAt}</span>
            </div>
          </div>

          {/* Quick Action: If farmer and pending, big Send Quotation button */}
          {activePerspective === 'farmer' && inquiry.status === 'Pending' && (
            <button
              onClick={() => setIsQuotationModalOpen(true)}
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer self-start md:self-center"
            >
              <Send className="w-4 h-4" />
              <span>Send Official Quotation</span>
            </button>
          )}

          {/* If already confirmed, link to order */}
          {isConfirmed && inquiry.confirmedOrderId && (
            <button
              onClick={() => onNavigate('order-detail', { id: inquiry.confirmedOrderId })}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer self-start md:self-center"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>View Confirmed Order #{inquiry.confirmedOrderId}</span>
            </button>
          )}
        </div>

        {/* Counterparty 2-column info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-xs">
          {/* Buyer Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Buyer Details</span>
            </div>
            <div className="font-bold text-sm text-stone-900">{inquiry.buyerName}</div>
            <div className="text-stone-600">{inquiry.buyerEntity}</div>
            <div className="text-stone-500 flex items-center gap-1 pt-1 border-t border-stone-200/60">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>Delivery Destination: {inquiry.deliveryLocation}</span>
            </div>
          </div>

          {/* Farmer FPO Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Farmer Producer (Seller)</span>
            </div>
            <div className="font-bold text-sm text-stone-900">{inquiry.farmerName}</div>
            <div className="text-stone-600">{inquiry.fpoName}</div>
            <div className="text-stone-500 flex items-center gap-1 pt-1 border-t border-stone-200/60">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>Farm Origin: {inquiry.farmerLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Summary & Specs, Right = Quotation, Comparison & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Col: Inquiry Specifications */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-farm-orange">
                01. INQUIRY SPECIFICATIONS
              </span>
              <h3 className="font-serif-heading text-xl font-bold text-stone-900">
                Requested Harvest Batch
              </h3>
            </div>

            {inquiry.productImage && (
              <img
                src={inquiry.productImage}
                alt={inquiry.productName}
                className="w-full h-40 rounded-2xl object-cover border border-stone-200 shadow-2xs"
              />
            )}

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Requested Volume:</span>
                <span className="font-mono font-bold text-stone-900">
                  {inquiry.requestedQuantity.toLocaleString('en-IN')} {inquiry.unit}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Quality Requirement:</span>
                <span className="font-semibold text-stone-800">{inquiry.qualityRequirement}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Delivery Destination:</span>
                <span className="font-semibold text-stone-800 text-right max-w-[180px]">
                  {inquiry.deliveryLocation}
                </span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Produce Category:</span>
                <span className="font-semibold text-stone-800">{inquiry.category}</span>
              </div>
            </div>

            {inquiry.additionalRequirements && (
              <div className="pt-3 border-t border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Additional Buyer Requirements:
                </span>
                <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/80 leading-relaxed">
                  "{inquiry.additionalRequirements}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Current Quotation, Side-by-side comparison, and Action Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Quotation Card */}
          {currentQuote ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-farm-orange">
                    02. ACTIVE QUOTATION
                  </span>
                  <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
                    Current Formal Terms ({currentQuote.incoterm})
                  </h3>
                </div>

                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full self-start sm:self-auto">
                  Status: {currentQuote.status.toUpperCase()}
                </span>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Price / Unit</span>
                  <div className="font-mono font-bold text-lg text-stone-900 mt-1">
                    ₹{currentQuote.pricePerUnit}
                    <span className="text-xs font-normal text-stone-500"> /{currentQuote.unit}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Quantity</span>
                  <div className="font-mono font-bold text-lg text-stone-900 mt-1">
                    {currentQuote.quantity.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-stone-500"> {currentQuote.unit}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Incoterm</span>
                  <div className="font-mono font-bold text-lg text-emerald-800 mt-1">
                    {currentQuote.incoterm}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Total Contract</span>
                  <div className="font-mono font-bold text-lg text-stone-900 mt-1">
                    ₹{currentQuote.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Quality & Terms Strip */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-600">Offered Quality Grade:</span>
                  <strong className="text-stone-800">{currentQuote.qualityGrade}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Offered By:</span>
                  <strong className="text-stone-800">
                    {currentQuote.senderName} ({currentQuote.senderEntity})
                  </strong>
                </div>
                {currentQuote.termsAndNotes && (
                  <div className="pt-2 border-t border-emerald-200/60 text-stone-700 italic">
                    "{currentQuote.termsAndNotes}"
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty Quotation Notice */
            <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-3">
              <Clock className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-serif-heading text-xl font-bold text-stone-900">
                Awaiting Official Quotation
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                The farmer producer group ({inquiry.fpoName}) is reviewing harvest scheduling, logistics rates, and available inventory.
              </p>
              {activePerspective === 'farmer' && (
                <button
                  onClick={() => setIsQuotationModalOpen(true)}
                  className="mt-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Send Quotation Now
                </button>
              )}
            </div>
          )}

          {/* Side-by-Side Comparison if there was a previous offer */}
          {hasMultipleOffers && previousOffer && currentQuote && (
            <OfferComparison originalOffer={previousOffer} counterOffer={currentQuote} />
          )}

          {/* Interactive Decision / Negotiation Action Panel */}
          <NegotiationPanel
            inquiry={inquiry}
            activeRole={activePerspective}
            userName={activePerspective === 'buyer' ? inquiry.buyerName : inquiry.farmerName}
            onOrderConfirmed={(orderId) => {
              onNavigate('order-detail', { id: orderId });
            }}
          />
        </div>
      </div>

      {/* Bottom Full-Width Section: Negotiation Timeline & Audit Trail */}
      <div className="mt-8">
        <NegotiationTimeline history={inquiry.negotiationHistory} isConfirmed={isConfirmed} />
      </div>

      {/* Farmer Quotation Modal */}
      <QuotationFormModal
        inquiry={inquiry}
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
      />
    </div>
  );
};
