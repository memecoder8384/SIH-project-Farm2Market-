import React from 'react';
import { useTradeFlow } from '../context/TradeFlowContext';
import { UserRole } from '../types';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Calendar,
  MapPin,
  Building2,
  User,
  Truck,
  Printer,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  Package,
  ArrowRight
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
  currentRole: UserRole;
  onNavigate: (tab: string, param?: any) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  currentRole,
  onNavigate,
}) => {
  const { getOrder } = useTradeFlow();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif-heading text-2xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">
          The requested B2B order <strong className="font-mono">{orderId}</strong> could not be located.
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <button
          onClick={() => onNavigate('marketplace')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Contract</span>
          </button>

          {/* Farmer: Prepare Dispatch */}
          {order.status === 'Confirmed' && (
            <button
              onClick={() => onNavigate('dispatch-order', order.id)}
              className="px-4 py-2 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Prepare Dispatch →</span>
            </button>
          )}

          {/* Shared Shipment Details */}
          {order.shipmentId && (
            <button
              onClick={() => onNavigate('shipment-detail', order.shipmentId)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Shipment Details</span>
            </button>
          )}

          {/* Live Tracking */}
          <button
            onClick={() => onNavigate('orders', order.id)}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5 text-farm-gold" />
            <span>Track Live Delivery →</span>
          </button>
        </div>
      </div>

      {/* Contract Voucher Sheet */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-lg relative overflow-hidden space-y-8">
        {/* Top Watermark Background Badge */}
        <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-emerald-900" />
        </div>

        {/* Official Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow-badge text-emerald-800 bg-emerald-50 border border-emerald-200">
                OFFICIAL B2B HARVEST CONTRACT • /order/{order.id}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>Locked</span>
              </span>
            </div>

            <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
              Confirmed Agricultural Trade Order
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-2 font-mono">
              <span>Order Number: <strong className="text-stone-900">{order.orderNumber}</strong></span>
              <span>•</span>
              <span>Internal Ref: {order.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-sans">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {order.orderDate}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Contract Value</span>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-emerald-800 mt-0.5">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 sm:justify-end mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Smart Escrow Protected</span>
            </span>
          </div>
        </div>

        {/* Prominent Locked Terms Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm">🔒 Order terms locked</strong>
              <span className="text-amber-800">
                This contract is legally confirmed by both parties. Quantity, price, quality grade, and Incoterm cannot be modified.
              </span>
            </div>
          </div>

          <span className="font-mono text-[11px] font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-xl shrink-0">
            Finalized Agreement
          </span>
        </div>

        {/* Counterparty Information Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Buyer */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Buyer Entity</span>
            </div>
            <div className="font-bold text-sm text-stone-900">{order.buyerName}</div>
            <div className="text-stone-600 text-xs">{order.buyerEntity}</div>
            <div className="text-stone-500 text-xs flex items-center gap-1 pt-2 border-t border-stone-200">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Destination: {order.deliveryLocation}</span>
            </div>
          </div>

          {/* Farmer / FPO */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Farmer Producer (FPO)</span>
            </div>
            <div className="font-bold text-sm text-stone-900">{order.farmerName}</div>
            <div className="text-stone-600 text-xs">{order.fpoName}</div>
            <div className="text-stone-500 text-xs flex items-center gap-1 pt-2 border-t border-stone-200">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Origin Hub: Sahyadri Cold Aggregation Center</span>
            </div>
          </div>
        </div>

        {/* Locked Order Breakdown Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif-heading text-xl font-bold text-stone-900">
              Contracted Produce &amp; Final Specifications
            </h3>
            <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-bold">
              Non-Editable
            </span>
          </div>

          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Produce Details</th>
                  <th className="p-4">Quality Grade</th>
                  <th className="p-4">Incoterm</th>
                  <th className="p-4 text-right">Agreed Rate</th>
                  <th className="p-4 text-right">Volume</th>
                  <th className="p-4 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                <tr>
                  <td className="p-4 font-sans font-bold text-stone-900">
                    <div className="flex items-center gap-3">
                      {order.productImage && (
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                      )}
                      <div>
                        <div>{order.productName}</div>
                        <span className="text-[10px] text-stone-400 font-normal font-sans">
                          Batch ID: {order.inquiryId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-sans">
                    <span className="bg-emerald-50 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      {order.finalQualityGrade}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-stone-900">
                    <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200">
                      {order.finalIncoterm}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-stone-900">
                    ₹{order.finalPricePerUnit}/{order.unit}
                  </td>
                  <td className="p-4 text-right font-bold text-stone-900">
                    {order.finalQuantity.toLocaleString('en-IN')} {order.unit}
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-800 text-sm">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Agreed Terms & Escrow Notes */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Agreed Contract Terms &amp; Logistics Clauses:
          </span>
          <p className="text-stone-700 leading-relaxed italic">
            "{order.agreedTerms}"
          </p>
          <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Payment Safeguard: 100% Escrow deposit held securely until delivery inspection.</span>
            <span className="font-mono text-emerald-800 font-bold">STATUS: CONFIRMED</span>
          </div>
        </div>

        {/* Bottom Readiness for Next Stage Strip */}
        <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 rounded-xl text-sky-700 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block text-sm">
                Ready for Logistics &amp; Live Cold-Chain Tracking
              </span>
              <span className="text-stone-600">
                Harvest is scheduled with Sahyadri Organic Harvest Co-op. Reefer temperature telemetry and GPS tracking will activate upon vehicle loading.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {order.status === 'Confirmed' && (
              <button
                onClick={() => onNavigate('dispatch-order', order.id)}
                className="px-4 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0 shadow-xs"
              >
                <span>Prepare Dispatch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onNavigate('orders', order.id)}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>Go to Live Tracking</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
