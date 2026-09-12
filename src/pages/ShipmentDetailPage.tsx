import React, { useState } from 'react';
import { useTradeFlow } from '../context/TradeFlowContext';
import { UserRole } from '../types';
import { INITIAL_MOCK_ORDERS } from '../data/tradeFlowMockData';
import { TrackingMap } from '../components/tracking/TrackingMap';
import { RouteOptimizationCard } from '../components/tracking/RouteOptimizationCard';
import { ShipmentTimeline } from '../components/tracking/ShipmentTimeline';
import { OrderCompletionCard } from '../components/tracking/OrderCompletionCard';
import { ReceiptConfirmationModal } from '../components/tracking/ReceiptConfirmationModal';
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  FileText,
  MapPin,
  Calendar,
  Lock,
  CheckCircle2,
  Navigation,
  ExternalLink,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';

interface ShipmentDetailPageProps {
  shipmentId: string;
  currentRole: UserRole;
  onNavigate: (tab: string, param?: any) => void;
}

export const ShipmentDetailPage: React.FC<ShipmentDetailPageProps> = ({
  shipmentId,
  currentRole,
  onNavigate,
}) => {
  const {
    getShipment,
    updateSimulationProgress,
    toggleOptimizedRoute,
    markDelivered,
    confirmReceipt,
    reportReceiptIssue,
    schedulePickup,
    confirmPickup,
    startTransit,
  } = useTradeFlow();

  const shipment = getShipment(shipmentId);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  if (!shipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif-heading text-2xl font-bold text-stone-900">Shipment Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">
          Unable to locate shipment tracking ID <strong className="font-mono">{shipmentId}</strong>.
        </p>
        <button
          onClick={() => onNavigate('orders')}
          className="mt-6 px-5 py-2.5 bg-farm-orange text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          ← Go to Live Tracking
        </button>
      </div>
    );
  }

  const order = shipment.order || INITIAL_MOCK_ORDERS[0];
  const isCompleted = order?.status === 'Completed';
  const isDelivered = order?.status === 'Delivered';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <button
          onClick={() => onNavigate(currentRole === 'farmer' ? 'farmer-dashboard' : 'orders')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {currentRole === 'farmer' ? 'Farmer FPO Dashboard' : 'Live Tracking'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-stone-500">
            Shipment #{shipment.id} • Order #{order?.orderNumber || shipment.orderId}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : isDelivered
                ? 'bg-sky-100 text-sky-900 border border-sky-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {shipment.logisticsStatus}
          </span>
        </div>
      </div>

      {/* If order is completed, show Completion Voucher at top */}
      {isCompleted && (
        <OrderCompletionCard shipment={shipment} />
      )}

      {/* Main Grid: 2 Cols Left (Map & Cards), 1 Col Right (Timeline & Meta) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Interactive Live Tracking Map */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-heading text-xl font-bold text-stone-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-farm-orange" />
                <span>Live Route &amp; GPS Telemetry</span>
              </h3>

              <div className="flex items-center gap-2">
                {/* Contextual Flow Action Buttons */}
                {shipment.logisticsStatus === 'Assigned' && (
                  <button
                    type="button"
                    onClick={() => schedulePickup(shipment.id)}
                    className="px-3 py-1.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Start Pickup
                  </button>
                )}

                {shipment.logisticsStatus === 'Pickup Scheduled' && (
                  <button
                    type="button"
                    onClick={() => confirmPickup(shipment.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Confirm Pickup
                  </button>
                )}

                {shipment.logisticsStatus === 'Picked Up' && (
                  <button
                    type="button"
                    onClick={() => startTransit(shipment.id)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Start Transit
                  </button>
                )}

                {(shipment.logisticsStatus === 'In Transit' || shipment.logisticsStatus === 'Out for Delivery') && (
                  <button
                    type="button"
                    onClick={() => markDelivered(shipment.id)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Mark as Delivered
                  </button>
                )}

                {shipment.logisticsStatus === 'Delivered' && shipment.receiptConfirmation?.status !== 'Confirmed' && (
                  <button
                    type="button"
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider animate-pulse cursor-pointer shadow-md"
                  >
                    Confirm Receipt
                  </button>
                )}
              </div>
            </div>

            <TrackingMap
              shipment={shipment}
              onUpdateProgress={(p) => updateSimulationProgress(shipment.id, p)}
              onToggleRoute={() => toggleOptimizedRoute(shipment.id)}
            />
          </div>

          {/* AI Route Optimization Module */}
          {shipment.aiOptimization && (
            <RouteOptimizationCard
              optimization={shipment.aiOptimization}
              isApplied={shipment.aiOptimization?.isOptimizedRouteApplied ?? false}
              onToggleRoute={() => toggleOptimizedRoute(shipment.id)}
            />
          )}

          {/* Dispatch & Order Summary Section */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="font-serif-heading text-xl font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-500" />
              <span>Dispatch Manifest &amp; Order Specs</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-sans text-stone-400 block uppercase font-medium">Loaded Vehicle</span>
                <span className="font-bold text-stone-900 block mt-0.5">{shipment.dispatchDetails?.vehicleNumber || 'Unassigned'}</span>
                <span className="text-[10px] text-stone-500 font-sans">{shipment.dispatchDetails?.vehicleType || 'Reefer'}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-sans text-stone-400 block uppercase font-medium">Assigned Driver</span>
                <span className="font-bold text-stone-900 block mt-0.5">{shipment.dispatchDetails?.driverName || 'Dispatch Driver'}</span>
                <span className="text-[10px] text-stone-500">{shipment.dispatchDetails?.driverPhone || '+91 98231 44021'}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-sans text-stone-400 block uppercase font-medium">Invoice Number</span>
                <span className="font-bold text-stone-900 block mt-0.5">{shipment.dispatchDetails?.invoiceNumber || 'Pending'}</span>
                <span className="text-[10px] text-emerald-700 font-sans font-semibold">✓ Verified eWay Bill</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-sans text-stone-400 block uppercase font-medium">Loaded Weight</span>
                <span className="font-bold text-stone-900 block mt-0.5">
                  {(shipment.dispatchDetails?.quantityLoaded || order?.finalQuantity || 1000).toLocaleString('en-IN')} {order?.unit || 'kg'}
                </span>
                <span className="text-[10px] text-stone-500 font-sans">Rate: ₹{order?.finalPricePerUnit || 0}/{order?.unit || 'kg'}</span>
              </div>
            </div>

            {shipment.dispatchDetails?.notes && (
              <div className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-200 text-xs text-stone-600">
                <strong className="text-stone-800">Dispatch Notes:</strong> {shipment.dispatchDetails.notes}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Logistics Partner & 9-Step Timeline */}
        <div className="space-y-8">
          {/* Logistics Partner Info Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <span className="eyebrow-badge text-farm-orange">CARRIER INFORMATION</span>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-farm-orange" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">
                  {shipment.logisticsPartner?.name || 'Partner Assignment Pending'}
                </h4>
                <p className="text-xs text-stone-500">{shipment.logisticsPartner?.hubLocation || 'Hub Terminal'}</p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400">Carrier Rating:</span>
                <span className="font-bold text-stone-800">★ {shipment.logisticsPartner?.rating || '4.8'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Payload Capacity:</span>
                <span className="font-mono text-stone-800">{(shipment.logisticsPartner?.capacityKg || 10000).toLocaleString('en-IN')} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Reefer Specs:</span>
                <span className="text-emerald-700 font-semibold">Active Cold Unit (4.0°C)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Estimated Transit:</span>
                <span className="font-mono text-stone-800">{shipment.logisticsPartner?.estimatedDeliveryTime || '8h 20m'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('orders', { shipmentId: shipment.id })}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View on Live Tracking Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Full 9-Step Timeline */}
          <ShipmentTimeline timeline={shipment.timeline || []} />
        </div>
      </div>

      {/* Buyer Receipt Confirmation Modal */}
      <ReceiptConfirmationModal
        shipment={shipment}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onConfirm={(remarks) => {
          confirmReceipt(shipment.id, order?.buyerName || 'Buyer Partner', remarks);
          setIsReceiptModalOpen(false);
        }}
        onReportIssue={(issue) => {
          reportReceiptIssue(shipment.id, issue);
          setIsReceiptModalOpen(false);
        }}
      />
    </div>
  );
};
