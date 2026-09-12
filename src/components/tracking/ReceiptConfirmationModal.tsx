import React, { useState } from 'react';
import { Shipment } from '../../types/tradeFlow';
import { CheckCircle2, AlertTriangle, X, ShieldCheck, Package } from 'lucide-react';

interface ReceiptConfirmationModalProps {
  shipment: Shipment;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks?: string) => void;
  onReportIssue: (issue: string) => void;
}

export const ReceiptConfirmationModal: React.FC<ReceiptConfirmationModalProps> = ({
  shipment,
  isOpen,
  onClose,
  onConfirm,
  onReportIssue,
}) => {
  const [isReportingIssue, setIsReportingIssue] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [remarks, setRemarks] = useState('Produce weight verified. Cold-chain seal intact and quality approved.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading text-xl font-bold text-stone-900">
                Confirm Shipment Receipt
              </h3>
              <span className="text-[11px] text-stone-500 font-mono">
                Order #{shipment.order.orderNumber}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Details Confirmation Box */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-stone-400 font-medium">Product:</span>
            <strong className="text-stone-900 text-sm">{shipment.order?.productName || 'Produce'}</strong>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-400 font-medium">Delivered Quantity:</span>
            <strong className="font-mono text-stone-900">
              {(shipment.dispatchDetails?.quantityLoaded || shipment.order?.finalQuantity || 0).toLocaleString('en-IN')}{' '}
              {shipment.order?.unit || 'kg'}
            </strong>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-400 font-medium">Logistics Partner:</span>
            <span className="text-stone-700 font-semibold">
              {shipment.logisticsPartner?.name || 'SwiftAgri Logistics'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-400 font-medium">Delivery Location:</span>
            <span className="text-stone-600 truncate max-w-[200px] text-right">
              {shipment.dispatchDetails?.deliveryLocation || shipment.order?.deliveryLocation || 'Delivery Location'}
            </span>
          </div>
        </div>

        {!isReportingIssue ? (
          <>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Have you received this shipment in fresh condition? Confirming receipt will release the locked escrow payment to the farmer.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Inspection Verification Remarks:
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => onConfirm(remarks)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Receipt &amp; Release Escrow</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReportingIssue(true)}
                className="w-full py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                Report Issue with Produce
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Please describe the issue (e.g., transit damage, weight discrepancy, or temperature variance). The escrow payment will be temporarily held.
              </p>
            </div>

            <textarea
              rows={3}
              required
              placeholder="Describe the discrepancy..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-500"
            />

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsReportingIssue(false)}
                className="flex-1 py-2.5 border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!issueText.trim()}
                onClick={() => onReportIssue(issueText)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                Submit Issue Flag
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
