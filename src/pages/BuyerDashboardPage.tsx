import React, { useState } from 'react';
import { MOCK_ORDERS, MOCK_FARMS, MOCK_PRODUCE } from '../data/mockData';
import { UserRole, UserProfile } from '../types';
import { DashboardStatSkeleton, TableRowSkeleton } from '../components/common/ShadowLoader';
import { ShoppingBag, Truck, Heart, FileText, ArrowRight, ShieldCheck, Clock, CheckCircle2, RotateCcw, Tractor } from 'lucide-react';

interface BuyerDashboardProps {
  onNavigate: (tab: string, param?: any) => void;
  currentRole?: UserRole;
  currentUser?: UserProfile | null;
}

export const BuyerDashboardPage: React.FC<BuyerDashboardProps> = ({
  onNavigate,
  currentRole = 'buyer',
  currentUser,
}) => {
  const [buyerMode, setBuyerMode] = useState<'household' | 'commercial'>('household');
  const [isModeLoading, setIsModeLoading] = useState(false);

  const handleModeChange = (mode: 'household' | 'commercial') => {
    if (mode === buyerMode) return;
    setIsModeLoading(true);
    setBuyerMode(mode);
    setTimeout(() => setIsModeLoading(false), 260);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Farmer Account Notice */}
      {currentRole === 'farmer' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Tractor className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold block">Farmer Account Active</span>
              <span className="text-amber-800">
                You are viewing the Buyer Dashboard. As a farmer, please go to the Farmer Dashboard to list your crops and view buyer offers.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('farmer-dashboard')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Go to Farmer Dashboard →
          </button>
        </div>
      )}
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-stone-200 gap-4">
        <div>
          <span className="eyebrow-badge text-farm-orange">BUYER DASHBOARD</span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            {buyerMode === 'household' ? 'Family & Home Orders' : 'Wholesale & Bulk Orders'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {buyerMode === 'household'
              ? 'Fresh, clean vegetables delivered directly from local farms.'
              : 'Bulk purchasing directly from farms for restaurants, shops, and businesses.'}
          </p>
        </div>

        {/* Mode Toggle Button */}
        <div className="flex items-center bg-stone-100 p-1 rounded-full border border-stone-300 self-start md:self-auto">
          <button
            onClick={() => handleModeChange('household')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              buyerMode === 'household'
                ? 'bg-farm-orange text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            🏡 Home &amp; Family
          </button>
          <button
            onClick={() => handleModeChange('commercial')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              buyerMode === 'commercial'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            🏢 Wholesale &amp; Bulk
          </button>
        </div>
      </div>

      {/* Household View Metrics */}
      {isModeLoading ? (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <DashboardStatSkeleton />
            <DashboardStatSkeleton />
            <DashboardStatSkeleton />
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="h-6 w-56 rounded shadow-skeleton" />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        </div>
      ) : buyerMode === 'household' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Active Orders</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-stone-900">2 Orders</span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">Weekly</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Next delivery scheduled for Thursday 8:00 AM</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Paid Directly to Farmers</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-emerald-700">₹4,230</span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">85% Paid</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Transferred straight to farmer bank accounts</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Distance Saved</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-stone-900">420 km</span>
                <span className="text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold border border-sky-100">Nearby Farms</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">100% grown within 180 km of your city</p>
            </div>
          </div>

          {/* Active Deliveries Stepper Preview */}
          <div className="mt-10 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
                  Your Current Deliveries
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Track your orders on their way from the farm to your doorstep
                </p>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs font-bold text-farm-orange hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Track All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {MOCK_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-stone-200/90 bg-stone-50/40 hover:bg-white transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200/70 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm font-mono">Order #{order.orderNumber}</span>
                        <span className="text-[10px] bg-sky-100 text-sky-900 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                          {order.currentStatus}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 mt-0.5 block">
                        Origin: {order.farmOrigin} • Placed {order.orderDate}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-sm font-bold text-stone-900 font-mono">₹{order.totalAmount}</span>
                      <span className="text-[11px] block text-emerald-700 font-medium">
                        (₹{order.farmerShareAmount} goes to farmer)
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-600 gap-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-farm-orange" />
                      <span>Estimated Arrival: <strong className="text-stone-900">{order.estimatedDelivery}</strong></span>
                      <span className="text-stone-400">•</span>
                      <span className="text-sky-700 font-mono">Van Temp: {order.coldChainTempCelsius}°C</span>
                    </div>

                    <button
                      onClick={() => onNavigate('orders')}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Track Delivery →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Commercial Bulk Procurement View */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Monthly Volume</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-stone-900">4.8 Tons</span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">Monthly Lot</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Fresh Tomatoes, Onions &amp; Potatoes</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Money Saved on Bulk</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-emerald-700">₹64,200</span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">-22% vs Mandi Market</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Zero middleman markups</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Quality Test Pass Rate</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold font-mono text-stone-900">100%</span>
                <span className="text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold border border-sky-100">100% Quality Pass</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Quality certificate provided with every delivery</p>
            </div>
          </div>

          {/* Bulk Procurement Table */}
          <div className="mt-10 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs overflow-x-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
                  Bulk Invoices &amp; Delivery Bills
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verified farm orders with GST bills and safe temperature-controlled delivery.
                </p>
              </div>
              <button
                onClick={() => onNavigate('marketplace')}
                className="px-4 py-2 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                + Place Bulk Order
              </button>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-2 font-bold">Order ID</th>
                  <th className="py-3 px-2 font-bold">Farm / Producer</th>
                  <th className="py-3 px-2 font-bold">Crop</th>
                  <th className="py-3 px-2 font-bold">Quantity</th>
                  <th className="py-3 px-2 font-bold">Agreed Price</th>
                  <th className="py-3 px-2 font-bold">Status</th>
                  <th className="py-3 px-2 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="py-4 px-2 font-bold text-stone-900">BLK-2026-901</td>
                  <td className="py-4 px-2 font-sans font-medium text-stone-800">Sahyadri Organic Cluster</td>
                  <td className="py-4 px-2 font-sans text-stone-600">Fresh Vine Tomatoes</td>
                  <td className="py-4 px-2 text-stone-900">1,200 kg</td>
                  <td className="py-4 px-2 text-emerald-700 font-bold">₹28.00 / kg</td>
                  <td className="py-4 px-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-sans font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      In Transit (Cool Van)
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right font-sans">
                    <button
                      onClick={() => alert('Downloading GST bill and lab report for BLK-2026-901.')}
                      className="text-farm-orange hover:underline font-bold cursor-pointer"
                    >
                      Download Invoice
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="py-4 px-2 font-bold text-stone-900">BLK-2026-884</td>
                  <td className="py-4 px-2 font-sans font-medium text-stone-800">Malwa Farmers FPO</td>
                  <td className="py-4 px-2 font-sans text-stone-600">Organic Table Potatoes</td>
                  <td className="py-4 px-2 text-stone-900">2,500 kg</td>
                  <td className="py-4 px-2 text-emerald-700 font-bold">₹52.00 / kg</td>
                  <td className="py-4 px-2">
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-sans font-bold px-2 py-0.5 rounded-full border border-sky-200">
                      Delivered &amp; Verified
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right font-sans">
                    <button
                      onClick={() => alert('Downloading GST bill for BLK-2026-884.')}
                      className="text-farm-orange hover:underline font-bold cursor-pointer"
                    >
                      Download Invoice
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Saved Favorite Farms */}
      <div className="mt-12">
        <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mb-4">
          Your Saved Farms &amp; Producers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_FARMS.slice(0, 3).map((farm) => (
            <div key={farm.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">{farm.name}</h4>
                <p className="text-xs text-stone-500 mt-0.5">{farm.region}, {farm.state}</p>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-semibold px-2 py-0.5 rounded mt-2 inline-block">
                  ★ {farm.rating} • {farm.specialty}
                </span>
              </div>
              <button
                onClick={() => onNavigate('marketplace')}
                className="p-2 text-farm-orange hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                title="View Produce"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
