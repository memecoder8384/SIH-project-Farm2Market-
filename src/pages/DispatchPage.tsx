import React, { useState } from 'react';
import { useTradeFlow } from '../context/TradeFlowContext';
import { UserRole } from '../types';
import { DispatchForm } from '../components/logistics/DispatchForm';
import { LogisticsAssignment } from '../components/logistics/LogisticsAssignment';
import { ArrowLeft, CheckCircle2, Truck, ShieldCheck, Lock } from 'lucide-react';

interface DispatchPageProps {
  orderId: string;
  currentRole: UserRole;
  onNavigate: (tab: string, param?: any) => void;
}

export const DispatchPage: React.FC<DispatchPageProps> = ({
  orderId,
  currentRole,
  onNavigate,
}) => {
  const {
    getOrder,
    getShipmentByOrderId,
    createDispatch,
    assignLogisticsPartner,
    logisticsPartners,
  } = useTradeFlow();

  const order = getOrder(orderId);
  const shipment = getShipmentByOrderId(orderId);

  // Step 1 = Manifest form, Step 2 = Logistics assignment
  const [currentStep, setCurrentStep] = useState<1 | 2>(shipment?.dispatchDetails ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif-heading text-2xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">
          Unable to find order reference <strong className="font-mono">{orderId}</strong>.
        </p>
        <button
          onClick={() => onNavigate('farmer-dashboard')}
          className="mt-6 px-5 py-2.5 bg-farm-orange text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          ← Return to Farmer FPO Dashboard
        </button>
      </div>
    );
  }

  const handleDispatchSubmit = (dto: any) => {
    setIsSubmitting(true);
    try {
      createDispatch(orderId, dto);
      setCurrentStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignPartner = (partnerId: string) => {
    if (!shipment) return;
    assignLogisticsPartner(shipment.id, partnerId);
  };

  const handleProceedToPickup = () => {
    if (!shipment) return;
    onNavigate('orders', { shipmentId: shipment.id });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => onNavigate('farmer-dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Farmer Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-stone-500">
          <span>Contract: <strong className="text-stone-900">{order.orderNumber}</strong></span>
          <span>•</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {order.status}
          </span>
        </div>
      </div>

      {/* Step Indicator Tabs */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 1
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
              currentStep === 1 ? 'bg-farm-orange text-white' : 'bg-stone-100 text-stone-800'
            }`}
          >
            1
          </div>
          <div>
            <span className="block text-xs font-bold">1. Dispatch Manifest</span>
            <span
              className={`text-[11px] block ${
                currentStep === 1 ? 'text-stone-300' : 'text-stone-400'
              }`}
            >
              Vehicle, Loading Qty &amp; Invoice
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            if (shipment?.dispatchDetails) setCurrentStep(2);
          }}
          disabled={!shipment?.dispatchDetails}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            !shipment?.dispatchDetails
              ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400'
              : currentStep === 2
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm cursor-pointer'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 cursor-pointer'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
              currentStep === 2 ? 'bg-farm-orange text-white' : 'bg-stone-100 text-stone-800'
            }`}
          >
            2
          </div>
          <div>
            <span className="block text-xs font-bold">2. Assign Logistics</span>
            <span
              className={`text-[11px] block ${
                currentStep === 2 ? 'text-stone-300' : 'text-stone-400'
              }`}
            >
              Fleet Provider &amp; Reefer Selection
            </span>
          </div>
        </button>
      </div>

      {/* Form or Assignment View */}
      {currentStep === 1 && (
        <DispatchForm
          order={order}
          onSubmit={handleDispatchSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onNavigate('farmer-dashboard')}
        />
      )}

      {currentStep === 2 && shipment && (
        <LogisticsAssignment
          shipment={shipment}
          partners={logisticsPartners}
          onAssignPartner={handleAssignPartner}
          onProceedToPickup={handleProceedToPickup}
        />
      )}
    </div>
  );
};
