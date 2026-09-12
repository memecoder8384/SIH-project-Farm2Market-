import React from 'react';
import { B2BOrder } from '../../types/tradeFlow';
import {
  ShieldCheck,
  Lock,
  Calendar,
  ArrowRight,
  Truck,
  PackageCheck,
  MapPin,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

interface OrderCardProps {
  order: B2BOrder;
  viewMode: 'buyer' | 'farmer';
  onViewOrder: (orderId: string) => void;
  onPrepareDispatch?: (orderId: string) => void;
  onTrackShipment?: (orderId: string) => void;
  onConfirmReceipt?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  viewMode,
  onViewOrder,
  onPrepareDispatch,
  onTrackShipment,
  onConfirmReceipt,
}) => {
  const isFarmer = viewMode === 'farmer';
  const isBuyer = viewMode === 'buyer';

  // Render status badge based on Flow 2 lifecycle
  const renderStatusBadge = () => {
    switch (order.status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full">
            <Lock className="w-3 h-3 text-emerald-700" />
            <span>Confirmed 🔒</span>
          </span>
        );
      case 'Dispatch Ready':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full">
            <Truck className="w-3 h-3 text-amber-700" />
            <span>Dispatch Ready 📦</span>
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping inline-block" />
            <span>In Transit 🚚</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-purple-700" />
            <span>Delivered 📍</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-400 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>✓ Completed</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
            {order.status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top: Order number & dynamic status badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-stone-900">
                {order.orderNumber}
              </span>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono font-semibold">
                {order.id}
              </span>
            </div>
            <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5 font-mono">
              <Calendar className="w-3 h-3 text-stone-300" />
              {order.orderDate}
            </span>
          </div>

          {renderStatusBadge()}
        </div>

        {/* Product details */}
        <div className="flex items-center gap-3 py-2 border-y border-stone-100 mb-3">
          {order.productImage ? (
            <img
              src={order.productImage}
              alt={order.productName}
              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 font-bold text-xs shrink-0">
              CROP
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="font-bold text-xs text-stone-900 truncate">
              {order.productName}
            </h4>
            <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
              <span className="font-mono font-bold text-stone-800">
                {order.finalQuantity.toLocaleString('en-IN')} {order.unit}
              </span>
              <span>• {order.finalQualityGrade}</span>
            </div>
          </div>
        </div>

        {/* Counterparty & Destination */}
        <div className="text-xs space-y-1 text-stone-600 mb-3 bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 uppercase font-medium">
              {isFarmer ? 'Buyer:' : 'Seller / FPO:'}
            </span>
            <span className="font-semibold text-stone-800 truncate max-w-[200px]">
              {isFarmer ? order.buyerName : order.farmerName}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[10px] text-stone-400 uppercase font-medium">Destination:</span>
            <span className="text-stone-600 truncate max-w-[200px]">{order.deliveryLocation}</span>
          </div>
        </div>

        {/* Price and contract value */}
        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 mb-4 text-xs font-mono">
          <div className="flex justify-between items-baseline">
            <span className="text-stone-500 font-sans">Final Agreed Rate:</span>
            <strong className="text-stone-900 text-sm">
              ₹{order.finalPricePerUnit} / {order.unit}
            </strong>
          </div>
          <div className="flex justify-between items-baseline pt-1.5 border-t border-emerald-200/60 mt-1.5">
            <span className="text-emerald-800 font-bold font-sans">Total Amount:</span>
            <span className="text-emerald-950 font-bold text-base">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[10px] text-emerald-800 pt-1 flex items-center justify-between font-sans">
            <span>Incoterm: <strong>{order.finalIncoterm}</strong></span>
            <span className="text-emerald-700 font-semibold">Smart Escrow Protected</span>
          </div>
        </div>
      </div>

      {/* Action buttons area */}
      <div className="space-y-2">
        {/* Farmer: Prepare Dispatch action when order is Confirmed */}
        {isFarmer && order.status === 'Confirmed' && (
          <button
            onClick={() => {
              if (onPrepareDispatch) onPrepareDispatch(order.id);
              else onViewOrder(order.id);
            }}
            className="w-full py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-98 shadow-sm cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Prepare Dispatch</span>
          </button>
        )}

        {/* Buyer: Confirm Receipt action when order is Delivered */}
        {isBuyer && order.status === 'Delivered' && (
          <button
            onClick={() => {
              if (onConfirmReceipt) onConfirmReceipt(order.id);
              else if (onTrackShipment) onTrackShipment(order.id);
              else onViewOrder(order.id);
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-98 shadow-sm cursor-pointer"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Confirm Receipt</span>
          </button>
        )}

        {/* Track Shipment action when in progress */}
        {(order.status === 'Dispatch Ready' ||
          order.status === 'In Transit' ||
          order.status === 'Delivered' ||
          order.status === 'Completed') && (
          <button
            onClick={() => {
              if (onTrackShipment) onTrackShipment(order.id);
              else onViewOrder(order.id);
            }}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-farm-gold" />
            <span>{order.status === 'Completed' ? 'View Completed Order' : 'Track Shipment'}</span>
          </button>
        )}

        {/* General View Order Details link */}
        <button
          onClick={() => onViewOrder(order.id)}
          className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            isFarmer && order.status === 'Confirmed'
              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              : order.status === 'Confirmed'
              ? 'bg-stone-900 hover:bg-stone-800 text-white font-bold'
              : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <span>View Contract Details</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

