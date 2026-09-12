import React from 'react';
import { Shipment } from '../../types/tradeFlow';
import { INITIAL_MOCK_ORDERS } from '../../data/tradeFlowMockData';
import { CheckCircle2, ShieldCheck, Printer, Calendar, MapPin, Truck, ExternalLink, Award } from 'lucide-react';

interface OrderCompletionCardProps {
  shipment: Shipment;
  onTrackView?: () => void;
}

export const OrderCompletionCard: React.FC<OrderCompletionCardProps> = ({
  shipment,
  onTrackView,
}) => {
  const order = shipment.order || INITIAL_MOCK_ORDERS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-9 shadow-lg relative overflow-hidden space-y-6 animate-in fade-in duration-300">
      {/* Background Seal Watermark */}
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
        <Award className="w-64 h-64 text-emerald-900" />
      </div>

      {/* Completion Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="eyebrow-badge text-emerald-800 bg-emerald-50 border border-emerald-200">
              TRADE FULFILLMENT COMPLETED
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              ✓ Order Successfully Closed
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt Voucher</span>
          </button>
        </div>
      </div>

      {/* Order Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium">Order ID / Contract</span>
          <span className="font-mono font-bold text-stone-900 block mt-0.5">{order?.orderNumber || 'N/A'}</span>
          <span className="text-[10px] text-stone-500 font-mono">Ref: {order?.id || shipment.orderId}</span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium">Produce &amp; Grade</span>
          <span className="font-bold text-stone-900 block mt-0.5">{order?.productName || 'Produce'}</span>
          <span className="text-[11px] text-stone-500">{order?.finalQualityGrade || 'Grade A'}</span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium">Delivered Quantity</span>
          <span className="font-bold text-stone-900 font-mono block mt-0.5">
            {(shipment.dispatchDetails?.quantityLoaded || order?.finalQuantity || 0).toLocaleString('en-IN')} {order?.unit || 'kg'}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">100% Fulfilled</span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium">Total Contract Value</span>
          <span className="text-base font-bold text-emerald-950 font-mono block mt-0.5">
            ₹{(order?.totalAmount ?? 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-stone-500">Rate: ₹{order?.finalPricePerUnit || 0}/{order?.unit || 'kg'} ({order?.finalIncoterm || 'DAP'})</span>
        </div>
      </div>

      {/* Counterparty & Logistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Farmer / FPO Producer</span>
          <p className="font-bold text-stone-900 text-sm">{order?.farmerName || 'Farmer Producer'}</p>
          <p className="text-stone-600">{order?.fpoName || 'FPO Collective'}</p>
          <span className="text-[10px] text-emerald-700 font-semibold block pt-1">
            ✓ 85% Farmer Share Direct Payout
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Buyer Entity</span>
          <p className="font-bold text-stone-900 text-sm">{order?.buyerName || 'Buyer'}</p>
          <p className="text-stone-600">{order?.buyerEntity || 'Business Buyer'}</p>
          <span className="text-[10px] text-stone-500 block pt-1 truncate">
            {order?.deliveryLocation || 'Buyer Kitchen Dock'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Logistics Partner</span>
          <p className="font-bold text-stone-900 text-sm">{shipment.logisticsPartner?.name || 'SwiftAgri Logistics'}</p>
          <p className="text-stone-600 font-mono text-[11px]">
            Vehicle: {shipment.dispatchDetails?.vehicleNumber || 'Reefer Unit'}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold block pt-1">
            Cold chain preserved at {shipment.trackingData?.coldChainTempCelsius ?? 4.2}°C
          </span>
        </div>
      </div>

      {/* Dates and Verification Footnote */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-950 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Digital Receipt Confirmed by <strong>{shipment.receiptConfirmation?.confirmedBy || order?.buyerName || 'Buyer'}</strong> on {shipment.receiptConfirmation?.confirmedAt || 'Today'}.
          </span>
        </div>

        <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
          SMART ESCROW SETTLED ✓
        </span>
      </div>
    </div>
  );
};
