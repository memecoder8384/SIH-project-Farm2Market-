import React, { useState } from 'react';
import { B2BOrder, CreateDispatchDTO } from '../../types/tradeFlow';
import {
  Truck,
  Lock,
  Calendar,
  MapPin,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';

interface DispatchFormProps {
  order: B2BOrder;
  onSubmit: (dto: CreateDispatchDTO) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const DispatchForm: React.FC<DispatchFormProps> = ({
  order,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState('MH 15 AB 8941');
  const [vehicleType, setVehicleType] = useState('Refrigerated Truck (Reefer)');
  const [driverName, setDriverName] = useState('Ganesh Patil');
  const [driverPhone, setDriverPhone] = useState('+91 98231 44021');
  const [dispatchDate, setDispatchDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [quantityLoaded, setQuantityLoaded] = useState<number>(order.finalQuantity);
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${order.orderNumber.replace('F2M-', '')}`
  );
  const [invoiceFileName, setInvoiceFileName] = useState('TaxInvoice_eWayBill_signed.pdf');
  const [pickupLocation, setPickupLocation] = useState(
    order.farmerLocation || `${order.fpoName} Packhouse, Farm Gate #2`
  );
  const [deliveryLocation, setDeliveryLocation] = useState(order.deliveryLocation);
  const [notes, setNotes] = useState(
    'Temperature-controlled fresh produce. Keep reefer unit running at 4.0°C. Verified clean crates.'
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (quantityLoaded <= 0) {
      setValidationError('Quantity loaded must be greater than 0.');
      return;
    }

    if (quantityLoaded > order.finalQuantity) {
      setValidationError(
        `Quantity loaded (${quantityLoaded} ${order.unit}) cannot exceed confirmed contract quantity (${order.finalQuantity} ${order.unit}).`
      );
      return;
    }

    if (!vehicleNumber.trim()) {
      setValidationError('Vehicle registration number is required.');
      return;
    }

    if (!driverName.trim()) {
      setValidationError('Driver name is required.');
      return;
    }

    if (!invoiceNumber.trim()) {
      setValidationError('Invoice / e-Way bill number is required.');
      return;
    }

    onSubmit({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      vehicleType,
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      dispatchDate,
      quantityLoaded: Number(quantityLoaded),
      invoiceNumber: invoiceNumber.trim(),
      invoiceFileName,
      pickupLocation: pickupLocation.trim(),
      deliveryLocation: deliveryLocation.trim(),
      notes: notes.trim(),
    });
  };

  const handleFakeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInvoiceFileName(e.target.files[0].name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Locked Contract Summary Banner */}
      <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Lock className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Locked Confirmed Order Terms (Non-Editable)
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {order.orderNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Order ID</span>
            <span className="font-mono font-bold text-stone-900 truncate block">{order.id}</span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Produce</span>
            <span className="font-bold text-stone-900 truncate block">{order.productName}</span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Confirmed Qty</span>
            <span className="font-bold text-stone-900 font-mono">
              {order.finalQuantity.toLocaleString('en-IN')} {order.unit}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Locked Rate</span>
            <span className="font-bold text-stone-900 font-mono">
              ₹{order.finalPricePerUnit}/{order.unit}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Buyer Entity</span>
            <span className="font-bold text-stone-900 truncate block">{order.buyerEntity}</span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-medium">Incoterm</span>
            <span className="font-bold text-emerald-800 font-mono">{order.finalIncoterm}</span>
          </div>
        </div>
      </div>

      {/* Error alert if validation fails */}
      {validationError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* 2. Dispatch Details Input Fields */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="eyebrow-badge text-farm-orange">STEP 1 OF 2: DISPATCH MANIFEST</span>
          <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mt-1">
            Enter Harvest Dispatch &amp; Vehicle Loading Info
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Record the actual vehicle, loaded quantity, driver contact, and invoice before handing over to logistics.
          </p>
        </div>

        {/* Vehicle Information Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Vehicle Registration Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Truck className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. MH 15 AB 8941"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold uppercase rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange bg-white font-medium text-stone-800"
            >
              <option value="Refrigerated Truck (Reefer)">Refrigerated Truck (Cold Reefer 2-4°C)</option>
              <option value="Multi-Axle Chilled Container">Multi-Axle Chilled Container (8+ Ton)</option>
              <option value="Insulated Cargo Van">Insulated Cargo Van (Temperature Shielded)</option>
              <option value="Tarpaulin Ventilated Truck">Tarpaulin Covered Ventilated Truck</option>
            </select>
          </div>
        </div>

        {/* Driver & Contact Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Driver Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Ganesh Patil"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Driver Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="e.g. +91 98231 44021"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-mono rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>
          </div>
        </div>

        {/* Quantity Loaded & Dispatch Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700">
                Quantity Loaded ({order.unit}) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-stone-500 font-mono">
                Max Allowed: {order.finalQuantity} {order.unit}
              </span>
            </div>
            <div className="relative">
              <PackageCheck className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                required
                min={1}
                max={order.finalQuantity}
                value={quantityLoaded}
                onChange={(e) => setQuantityLoaded(Number(e.target.value))}
                className={`w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold rounded-xl border focus:outline-none focus:ring-1 ${
                  quantityLoaded > order.finalQuantity
                    ? 'border-red-400 bg-red-50/50 focus:ring-red-500 text-red-900'
                    : 'border-stone-300 focus:ring-farm-orange text-stone-900'
                }`}
              />
            </div>
            {quantityLoaded < order.finalQuantity && (
              <span className="text-[10px] text-amber-700 mt-1 block font-semibold">
                ℹ Partial batch dispatch ({quantityLoaded} of {order.finalQuantity} {order.unit}). Remaining will be fulfilled separately.
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Scheduled Dispatch Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={dispatchDate}
                onChange={(e) => setDispatchDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange text-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Invoice and Document Upload Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Invoice / e-Way Bill Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-F2M-2026-891"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Invoice Document / e-Way Bill PDF
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 px-3 py-2.5 border border-dashed border-stone-300 hover:border-farm-orange bg-stone-50 rounded-xl flex items-center justify-between text-xs cursor-pointer group transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Upload className="w-3.5 h-3.5 text-stone-400 group-hover:text-farm-orange shrink-0" />
                  <span className="truncate text-stone-700 font-medium text-[11px]">
                    {invoiceFileName || 'Upload Tax Invoice (PDF/Image)'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-farm-orange uppercase shrink-0">Browse</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFakeFileUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Pickup Location (Farm Gate / Packhouse) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
              <textarea
                rows={2}
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Delivery Location (Destination Receiving Dock) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-farm-orange absolute left-3 top-3" />
              <textarea
                rows={2}
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Additional Dispatch &amp; Cold-Chain Handling Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Keep temperature between 3-5°C; do not stack crates higher than 5 tiers"
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-farm-orange"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-100 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Manifest...' : 'Confirm Dispatch & Proceed to Logistics →'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
