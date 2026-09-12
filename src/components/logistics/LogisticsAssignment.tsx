import React from 'react';
import { LogisticsPartner, Shipment } from '../../types/tradeFlow';
import { LogisticsPartnerCard } from './LogisticsPartnerCard';
import { Truck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface LogisticsAssignmentProps {
  shipment: Shipment;
  partners: LogisticsPartner[];
  onAssignPartner: (partnerId: string) => void;
  onProceedToPickup?: () => void;
}

export const LogisticsAssignment: React.FC<LogisticsAssignmentProps> = ({
  shipment,
  partners,
  onAssignPartner,
  onProceedToPickup,
}) => {
  const isAssigned = !!shipment.logisticsPartner;

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="eyebrow-badge text-farm-orange">STEP 2 OF 2: FLEET SELECTION</span>
          <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mt-1">
            Assign Logistics Partner
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Select a verified refrigerated or insulated freight partner with verified cold-chain telemetry.
          </p>
        </div>

        {isAssigned && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Partner Assigned: {shipment.logisticsPartner?.name}</span>
          </div>
        )}
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {partners.map((partner) => (
          <LogisticsPartnerCard
            key={partner.id}
            partner={partner}
            isAssigned={shipment.logisticsPartner?.id === partner.id}
            onAssign={onAssignPartner}
          />
        ))}
      </div>

      {/* Proceed button once assigned */}
      {isAssigned && onProceedToPickup && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-emerald-950 block">
                {shipment.logisticsPartner?.name} is confirmed for this shipment.
              </span>
              <span className="text-[11px] text-emerald-800">
                Vehicle registration: {shipment.dispatchDetails?.vehicleNumber || 'Reefer Unit'} • Estimated Transit: {shipment.logisticsPartner?.estimatedDeliveryTime}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceedToPickup}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <span>Proceed to Pickup &amp; Transit →</span>
          </button>
        </div>
      )}
    </div>
  );
};
