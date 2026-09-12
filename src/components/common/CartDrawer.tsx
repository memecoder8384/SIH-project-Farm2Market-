import React, { useState } from 'react';
import { ProduceItem } from '../../types';
import { X, Trash2, ShieldCheck, Thermometer, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';

export interface CartItem {
  product: ProduceItem;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigate: (tab: string, param?: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  const [deliveryType, setDeliveryType] = useState<'express' | 'pooled'>('express');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [generatedContractId, setGeneratedContractId] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.retailPrice * item.quantity,
    0
  );

  const farmerShare = Math.round(totalAmount * 0.85);
  const logisticsShare = Math.round(totalAmount * 0.10);
  const soilShare = Math.round(totalAmount * 0.05);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    const contractId = `F2M-ORDER-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedContractId(contractId);

    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
    }, 1200);
  };

  const handleFinish = () => {
    setCheckoutSuccess(false);
    onClearCart();
    onClose();
    onNavigate('orders');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250 transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧺</span>
            <div>
              <h2 className="font-serif-heading text-xl font-bold text-stone-900 leading-tight">
                Your Shopping Basket
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">
                Direct From Farm • {cartItems.length} item(s)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200/80 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {checkoutSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Safe &amp; Held in Escrow
                </span>
                <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mt-2">
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto mt-1">
                  Your payment is safely protected until your fresh produce is delivered and inspected.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-400">Order ID:</span>
                  <span className="font-bold text-stone-900">{generatedContractId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Farmer Share (85%):</span>
                  <span className="font-bold text-emerald-600">₹{farmerShare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Delivery Van:</span>
                  <span className="text-stone-700">Active (4-6°C Cold Storage)</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full mt-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Track Delivery →
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <span className="text-4xl block">🌾</span>
              <h4 className="font-serif-heading text-xl font-bold text-stone-800">
                Your basket is empty
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore farm-fresh vegetables directly from verified local growers.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigate('marketplace');
                }}
                className="mt-2 px-5 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-sm"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <>
              {/* Item Cards */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-3 hover:border-stone-300 transition-colors"
                  >
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 shadow-xs"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-900 text-xs truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate">
                        {item.product.farmName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-emerald-700 font-bold">
                        <span>₹{item.product.retailPrice}</span>
                        <span className="text-stone-400 font-normal">/ {item.product.retailUnit.split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs font-mono">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Speed Selector */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  Delivery Option
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryType('express')}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                      deliveryType === 'express'
                        ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold shadow-2xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] text-sky-800">
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>Express Cool Delivery</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">Within 6 hours (Fresh &amp; Cool)</span>
                  </button>

                  <button
                    onClick={() => setDeliveryType('pooled')}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                      deliveryType === 'pooled'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] text-emerald-800">
                      <span>🚜</span>
                      <span>Standard Delivery</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">Within 12 hours (Eco-Friendly)</span>
                  </button>
                </div>
              </div>

              {/* Transparency Breakdown Card */}
              <div className="p-4 rounded-2xl bg-[#3c2415] text-amber-100 space-y-2 text-xs border border-amber-900/60 shadow-inner">
                <div className="flex items-center justify-between text-amber-200/90 font-semibold border-b border-amber-900/60 pb-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-farm-gold" />
                    <span>Fair Price &amp; Safe Payment Guarantee</span>
                  </span>
                  <span className="text-[10px] font-mono text-farm-gold bg-amber-950 px-2 py-0.5 rounded">
                    100% Guaranteed
                  </span>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-stone-300">Direct Farmer Payout (85%):</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    ₹{farmerShare.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>Delivery &amp; Packaging (10%):</span>
                  <span className="font-mono text-sky-300">
                    ₹{logisticsShare.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>Platform &amp; Quality Support (5%):</span>
                  <span className="font-mono text-amber-300">
                    ₹{soilShare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Bar */}
        {!checkoutSuccess && cartItems.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3 transition-colors">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-stone-600">Total Order Amount:</span>
              <div className="text-right">
                <span className="font-mono text-2xl font-bold text-stone-900">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-700 block font-bold">
                  ✓ ₹{farmerShare.toLocaleString('en-IN')} goes directly to farmer
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order &amp; Pay Safely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
