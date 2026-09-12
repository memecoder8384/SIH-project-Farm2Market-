import React from 'react';
import { Inquiry } from '../../types/tradeFlow';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, ArrowRight, FileText, Send, User, Building2 } from 'lucide-react';

interface InquiryCardProps {
  inquiry: Inquiry;
  viewMode: 'buyer' | 'farmer';
  onViewDetails: (inquiryId: string) => void;
  onSendQuotation?: (inquiry: Inquiry) => void;
}

export const InquiryCard: React.FC<InquiryCardProps> = ({
  inquiry,
  viewMode,
  onViewDetails,
  onSendQuotation,
}) => {
  const currentQuote = inquiry.currentQuotation;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top bar: ID, Date, Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="font-mono font-bold text-xs text-stone-900 block">
              {inquiry.id}
            </span>
            <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5 font-mono">
              <Calendar className="w-3 h-3 text-stone-300" />
              {inquiry.createdAt}
            </span>
          </div>

          <StatusBadge status={inquiry.status} size="sm" />
        </div>

        {/* Product preview */}
        <div className="flex items-center gap-3 py-2 border-y border-stone-100 mb-3">
          {inquiry.productImage ? (
            <img
              src={inquiry.productImage}
              alt={inquiry.productName}
              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 font-bold text-xs shrink-0">
              CROP
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="font-bold text-xs text-stone-900 truncate">
              {inquiry.productName}
            </h4>
            <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
              <span className="font-mono font-bold text-stone-700">
                {inquiry.requestedQuantity.toLocaleString('en-IN')} {inquiry.unit}
              </span>
              <span>• {inquiry.qualityRequirement}</span>
            </div>
          </div>
        </div>

        {/* Counterparty info */}
        <div className="text-xs space-y-1 text-stone-600 mb-3 bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 uppercase font-medium">
              {viewMode === 'farmer' ? 'Buyer:' : 'Seller / FPO:'}
            </span>
            <span className="font-semibold text-stone-800 truncate max-w-[200px]">
              {viewMode === 'farmer' ? inquiry.buyerName : inquiry.farmerName}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[10px] text-stone-400 uppercase font-medium">Destination:</span>
            <span className="text-stone-600 truncate max-w-[200px]">{inquiry.deliveryLocation}</span>
          </div>
        </div>

        {/* Current Quotation Strip if exists */}
        {currentQuote ? (
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs mb-4">
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-[10px] text-emerald-800 font-sans font-bold uppercase tracking-wider">
                Current Quote ({currentQuote.incoterm}):
              </span>
              <strong className="text-emerald-900 text-sm">
                ₹{currentQuote.pricePerUnit}/{currentQuote.unit}
              </strong>
            </div>
            <div className="flex justify-between items-center text-[11px] text-emerald-800 mt-1 pt-1 border-t border-emerald-200/60 font-mono">
              <span>Total Contract:</span>
              <span className="font-bold">₹{currentQuote.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-[11px] text-amber-900 mb-4 flex items-center justify-between">
            <span>Awaiting farmer quotation...</span>
            <span className="font-mono text-[10px] bg-amber-100 px-1.5 py-0.5 rounded font-bold">
              Pending
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
        {/* If Farmer and Pending: prominent "Send Quotation" */}
        {viewMode === 'farmer' && inquiry.status === 'Pending' && onSendQuotation && (
          <button
            onClick={() => onSendQuotation(inquiry)}
            className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Send className="w-3 h-3" />
            <span>Send Quotation</span>
          </button>
        )}

        <button
          onClick={() => onViewDetails(inquiry.id)}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            viewMode === 'farmer' && inquiry.status === 'Pending'
              ? 'px-3 border border-stone-200 hover:bg-stone-50 text-stone-700'
              : 'flex-1 bg-stone-900 hover:bg-stone-800 text-white'
          }`}
        >
          <span>View Inquiry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
