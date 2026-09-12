import React, { useState, useEffect } from 'react';
import { useTradeFlow } from '../context/TradeFlowContext';
import { Shipment, Order } from '../types';
import { MOCK_ORDERS } from '../data/mockData';
import { INITIAL_MOCK_ORDERS } from '../data/tradeFlowMockData';
import { LiveTrackingLoader } from '../components/common/LiveTrackingLoader';
import { TrackingMap } from '../components/tracking/TrackingMap';
import { RouteOptimizationCard } from '../components/tracking/RouteOptimizationCard';
import { ShipmentTimeline } from '../components/tracking/ShipmentTimeline';
import { ReceiptConfirmationModal } from '../components/tracking/ReceiptConfirmationModal';
import { OrderCompletionCard } from '../components/tracking/OrderCompletionCard';
import {
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ShieldCheck,
  QrCode,
  Phone,
  Thermometer,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Sparkles,
  ExternalLink,
  Package,
  Layers,
  ArrowRight,
  User,
} from 'lucide-react';

interface OrdersTrackingProps {
  onNavigate: (tab: string, param?: any) => void;
  initialTrackingId?: string;
}

export const OrdersTrackingPage: React.FC<OrdersTrackingProps> = ({
  onNavigate,
  initialTrackingId,
}) => {
  const {
    shipments,
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

  // Find initial shipment or default to first B2B shipment
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(() => {
    if (initialTrackingId) {
      const match = shipments.find(
        (s) => s.id === initialTrackingId || s.orderId === initialTrackingId || s.trackingNumber === initialTrackingId
      );
      if (match) return match.id;
    }
    return shipments[0]?.id || 'SHP-2026-TOM-01';
  });

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Sync if initialTrackingId changes
  useEffect(() => {
    if (initialTrackingId) {
      const match = shipments.find(
        (s) => s.id === initialTrackingId || s.orderId === initialTrackingId || s.trackingNumber === initialTrackingId
      );
      if (match) setSelectedShipmentId(match.id);
    }
  }, [initialTrackingId, shipments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const activeShipment = getShipment(selectedShipmentId) || shipments[0];

  if (isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LiveTrackingLoader />
      </div>
    );
  }

  if (!activeShipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif-heading text-2xl font-bold text-stone-900">No Active Shipments</h2>
        <p className="text-xs text-stone-500 mt-2">
          There are currently no active consignments in transit.
        </p>
        <button
          onClick={() => onNavigate('marketplace')}
          className="mt-6 px-5 py-2.5 bg-farm-orange text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Explore Fresh Produce Marketplace
        </button>
      </div>
    );
  }

  const order = activeShipment.order || INITIAL_MOCK_ORDERS[0];
  const isDelivered = activeShipment.logisticsStatus === 'Delivered';
  const isCompleted = order?.status === 'Completed';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500 space-y-8">
      {/* Header Banner & Shipment Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow-badge text-farm-orange">FLOW 2: LIVE DISPATCH &amp; TRANSIT</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Tracking</span>
            </span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Real-Time Reefer &amp; GPS Shipment Tracking
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Cold-chain vehicle location, AI routing, telemetry readings, and fulfillment progress.
          </p>
        </div>

        {/* Consignment Selector Dropdown */}
        <div className="w-full md:w-88 flex items-center gap-2">
          <div className="flex-1 relative">
            <select
              value={activeShipment.id}
              onChange={(e) => setSelectedShipmentId(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 text-xs font-semibold rounded-2xl border border-stone-300 bg-white text-stone-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-farm-orange cursor-pointer truncate"
            >
              {shipments.map((shp) => (
                <option key={shp.id} value={shp.id}>
                  {shp.order?.productName || 'Produce'} ({shp.id}) • {shp.logisticsStatus}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('shipment-detail', activeShipment.id)}
            className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
            title="Open Dedicated Full Shipment Page"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* If order is completed, display completion banner */}
      {isCompleted && (
        <OrderCompletionCard shipment={activeShipment} />
      )}

      {/* Shipment Info Hero Strip (Section 5 Spec) */}
      <div className="bg-stone-50 rounded-3xl p-5 sm:p-6 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-xs font-mono">
        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium font-sans block">Order ID</span>
          <span className="font-bold text-stone-900 truncate block mt-0.5">{order?.orderNumber || 'N/A'}</span>
          <span className="text-[10px] text-stone-500 truncate block">{order?.id || activeShipment.orderId}</span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium font-sans block">Product</span>
          <span className="font-bold text-stone-900 truncate block mt-0.5">{order?.productName || 'Fresh Vegetables'}</span>
          <span className="text-[10px] text-stone-500 font-sans">{order?.category || 'Vegetables'}</span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium font-sans block">Quantity</span>
          <span className="font-bold text-stone-900 truncate block mt-0.5">
            {(activeShipment.dispatchDetails?.quantityLoaded || order?.finalQuantity || 1000).toLocaleString('en-IN')}{' '}
            {order?.unit || 'kg'}
          </span>
          <span className="text-[10px] text-emerald-700 font-sans font-semibold">100% Loaded</span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium font-sans block">Vehicle</span>
          <span className="font-bold text-stone-900 truncate block mt-0.5">
            {activeShipment.dispatchDetails?.vehicleNumber || 'Unassigned'}
          </span>
          <span className="text-[10px] text-stone-500 font-sans truncate block">
            {activeShipment.dispatchDetails?.vehicleType || 'Cold Reefer'}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium font-sans block">Logistics Partner</span>
          <span className="font-bold text-stone-900 truncate block mt-0.5 font-sans">
            {activeShipment.logisticsPartner?.name || 'Pending'}
          </span>
          <span className="text-[10px] text-stone-500 font-sans">★ {activeShipment.logisticsPartner?.rating || '4.8'}</span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium font-sans block">Driver Contact</span>
          <span className="font-bold text-stone-900 truncate block mt-0.5 font-sans">
            {activeShipment.dispatchDetails?.driverName || 'Ganesh P.'}
          </span>
          <span className="text-[10px] text-stone-500 truncate block">
            {activeShipment.dispatchDetails?.driverPhone || '+91 98231 44021'}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium font-sans block">Current Status</span>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-900'
                : isDelivered
                ? 'bg-sky-100 text-sky-900'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {activeShipment.logisticsStatus}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium font-sans block">Est. Arrival (ETA)</span>
          <span className="font-bold text-stone-900 block mt-0.5 text-xs font-sans">
            {(activeShipment.trackingData?.distanceRemainingKm ?? 0) <= 0 ? 'Delivered' : (activeShipment.trackingData?.estimatedArrivalFormatted || 'In Transit')}
          </span>
          <span className="text-[10px] text-farm-orange font-sans font-semibold">
            {activeShipment.trackingData?.distanceRemainingKm ?? 0} km remaining
          </span>
        </div>
      </div>

      {/* Main Interactive Map & AI Optimization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Vector Live Map & AI Route Section */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="font-serif-heading text-xl font-bold text-stone-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-farm-orange" />
                <span>Live Route Simulation</span>
              </h3>

              {/* Stage Progress Fast-Action Controls for Prototype Demonstration */}
              <div className="flex flex-wrap items-center gap-2">
                {activeShipment.logisticsStatus === 'Assigned' && (
                  <button
                    type="button"
                    onClick={() => schedulePickup(activeShipment.id)}
                    className="px-3 py-1.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    Start Pickup
                  </button>
                )}

                {activeShipment.logisticsStatus === 'Pickup Scheduled' && (
                  <button
                    type="button"
                    onClick={() => confirmPickup(activeShipment.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    Confirm Pickup
                  </button>
                )}

                {activeShipment.logisticsStatus === 'Picked Up' && (
                  <button
                    type="button"
                    onClick={() => startTransit(activeShipment.id)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    Start Transit
                  </button>
                )}

                {(activeShipment.logisticsStatus === 'In Transit' || activeShipment.logisticsStatus === 'Out for Delivery') && (
                  <button
                    type="button"
                    onClick={() => markDelivered(activeShipment.id)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    Mark as Delivered
                  </button>
                )}

                {activeShipment.logisticsStatus === 'Delivered' && activeShipment.receiptConfirmation?.status !== 'Confirmed' && (
                  <button
                    type="button"
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider animate-pulse cursor-pointer shadow-md"
                  >
                    Buyer: Confirm Receipt
                  </button>
                )}
              </div>
            </div>

            <TrackingMap
              shipment={activeShipment}
              onUpdateProgress={(progress) => updateSimulationProgress(activeShipment.id, progress)}
              onToggleRoute={() => toggleOptimizedRoute(activeShipment.id)}
            />
          </div>

          {/* Section 7: AI Route Optimization Section */}
          {activeShipment.aiOptimization && (
            <RouteOptimizationCard
              optimization={activeShipment.aiOptimization}
              isApplied={activeShipment.aiOptimization?.isOptimizedRouteApplied ?? false}
              onToggleRoute={() => toggleOptimizedRoute(activeShipment.id)}
            />
          )}
        </div>

        {/* Right 1 Col: Dispatch Details & Timeline */}
        <div className="space-y-8">
          {/* Dispatch Summary Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="eyebrow-badge text-farm-orange">DISPATCH MANIFEST</span>
              <span className="font-mono text-stone-400">{activeShipment.dispatchDetails?.invoiceNumber || 'No Invoice'}</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-medium">Origin Packhouse:</span>
                <p className="font-bold text-stone-800 text-xs mt-0.5">
                  {activeShipment.dispatchDetails?.pickupLocation || order?.fpoName || 'Origin Packhouse'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 uppercase font-medium">Destination Dock:</span>
                <p className="font-bold text-stone-800 text-xs mt-0.5">
                  {activeShipment.dispatchDetails?.deliveryLocation || order?.deliveryLocation || 'Destination Dock'}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-mono">
                <span className="text-stone-500 font-sans">Cold Reefer Telemetry:</span>
                <span className="font-bold text-emerald-800">
                  {activeShipment.trackingData?.coldChainTempCelsius ?? 4.2}°C (Target: 4.0°C)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('shipment-detail', activeShipment.id)}
              className="w-full mt-2 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View Comprehensive Shipment Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 9-Step Timeline */}
          <ShipmentTimeline timeline={activeShipment.timeline || []} />
        </div>
      </div>

      {/* Buyer Receipt Confirmation Modal */}
      <ReceiptConfirmationModal
        shipment={activeShipment}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onConfirm={(remarks) => {
          confirmReceipt(activeShipment.id, order?.buyerName || 'Buyer Partner', remarks);
          setIsReceiptModalOpen(false);
        }}
        onReportIssue={(issue) => {
          reportReceiptIssue(activeShipment.id, issue);
          setIsReceiptModalOpen(false);
        }}
      />
    </div>
  );
};
