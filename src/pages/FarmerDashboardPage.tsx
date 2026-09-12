import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCE, MOCK_FARMS } from '../data/mockData';
import { ProduceItem, UserRole, UserProfile } from '../types';
import { ShadowImage, DashboardStatSkeleton, TableRowSkeleton } from '../components/common/ShadowLoader';
import { FarmerFpoLoader } from '../components/common/FarmerFpoLoader';
import { Plus, TrendingUp, DollarSign, Calendar, Truck, CheckCircle2, Clock, AlertTriangle, ArrowRight, RotateCw, ShoppingBag, FileText, Lock, Inbox, Send } from 'lucide-react';
import { useTradeFlow } from '../context/TradeFlowContext';
import { InquiryCard } from '../components/trade/InquiryCard';
import { OrderCard } from '../components/trade/OrderCard';
import { QuotationFormModal } from '../components/trade/QuotationFormModal';
import { Inquiry } from '../types/tradeFlow';

interface FarmerDashboardProps {
  onNavigate: (tab: string, param?: any) => void;
  produceList?: ProduceItem[];
  onOpenListModal?: () => void;
  currentRole?: UserRole;
  currentUser?: UserProfile | null;
}

export const FarmerDashboardPage: React.FC<FarmerDashboardProps> = ({
  onNavigate,
  produceList = MOCK_PRODUCE,
  onOpenListModal,
  currentRole = 'farmer',
  currentUser,
}) => {
  const { inquiries, orders } = useTradeFlow();
  const [selectedInquiryForQuote, setSelectedInquiryForQuote] = useState<Inquiry | null>(null);
  const [activeFarmerTab, setActiveFarmerTab] = useState<'overview' | 'inquiries' | 'orders'>('overview');
  const [farmerInquiryFilter, setFarmerInquiryFilter] = useState<string>('All');

  const [showListingModal, setShowListingModal] = useState(false);
  const [activeFpo, setActiveFpo] = useState(MOCK_FARMS[0]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Initial page entrance loading animation with Earth FPO loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsSyncing(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 150);
  };

  // Form state
  const [newCropName, setNewCropName] = useState('');
  const [newCategory, setNewCategory] = useState('Daily Essentials');
  const [newVolumeKg, setNewVolumeKg] = useState('1500');
  const [newTargetPrice, setNewTargetPrice] = useState('38');
  const [newHarvestDate, setNewHarvestDate] = useState('2026-09-18');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowListingModal(false);
      alert(`Crop listed: "${newCropName}" has been successfully posted to the marketplace.`);
    }, 900);
  };

  const incomingBids = [
    {
      id: 'bid-1',
      buyer: 'Bombay Food Collective (Hotel Chain)',
      produce: 'Fresh Red Onions',
      quantity: '800 kg',
      bidPricePerKg: 32,
      mandiRate: 24,
      status: 'Awaiting Your Approval',
      timeAgo: '22 mins ago',
    },
    {
      id: 'bid-2',
      buyer: 'Zomato Hyperpure Procurement',
      produce: 'Vine-Ripe Tomatoes',
      quantity: '1,200 kg',
      bidPricePerKg: 28,
      mandiRate: 22,
      status: 'Contract Draft Ready',
      timeAgo: '2 hours ago',
    },
  ];

  if (isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FarmerFpoLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
      {/* Buyer Account Guard Banner */}
      {currentRole === 'buyer' && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛒</span>
            <div>
              <span className="font-bold block">Buyer Account Active</span>
              <span className="text-blue-700">
                You are previewing the Farmer Dashboard. Farmers use this page to list crops and check buyer offers.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Go to Marketplace →
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-stone-200 gap-4 transition-colors">
        <div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900">
            {currentUser?.entityName || activeFpo.fpoName || activeFpo.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Farmer: <span className="font-bold text-stone-800">{currentUser?.name || activeFpo.farmerName}</span> • Location: {currentUser?.location || `${activeFpo.region}, ${activeFpo.state}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            title="Refresh data"
          >
            <RotateCw className={`w-3.5 h-3.5 text-farm-orange ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={() => onNavigate('price-recommendation')}
            className="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-800 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-farm-orange" />
            <span>Check Crop Prices</span>
          </button>

          <button
            onClick={() => {
              if (onOpenListModal) onOpenListModal();
              else setShowListingModal(true);
            }}
            className="px-5 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List New Crop</span>
          </button>
        </div>
      </div>

      {/* Farmer FPO Sub-Tabs: Harvest Overview | Incoming Inquiries | Confirmed Orders */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          <button
            onClick={() => setActiveFarmerTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeFarmerTab === 'overview'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🌾 Harvest Overview</span>
          </button>

          <button
            onClick={() => setActiveFarmerTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeFarmerTab === 'inquiries'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-farm-orange" />
            <span>Incoming Inquiries</span>
            {inquiries.length > 0 && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeFarmerTab === 'inquiries'
                    ? 'bg-white/20 text-white'
                    : 'bg-orange-100 text-farm-orange'
                }`}
              >
                {inquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFarmerTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeFarmerTab === 'orders'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confirmed Orders</span>
            {orders.length > 0 && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeFarmerTab === 'orders'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {orders.length}
              </span>
            )}
          </button>
        </div>

        {activeFarmerTab !== 'overview' && (
          <button
            onClick={() => setActiveFarmerTab('overview')}
            className="text-xs font-bold text-farm-orange hover:underline cursor-pointer"
          >
            ← Back to Harvest Overview
          </button>
        )}
      </div>

      {/* View 1: Harvest Overview */}
      {activeFarmerTab === 'overview' && (
        <>
          {/* 4 Stats Cards with Shadow Skeletons */}
          {isSyncing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              <DashboardStatSkeleton />
              <DashboardStatSkeleton />
              <DashboardStatSkeleton />
              <DashboardStatSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Total Farmland</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-bold font-mono text-stone-900">1,240</span>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">+18% YoY</span>
                </div>
                <p className="text-xs text-stone-500 mt-2">Across 380 local family farms</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Crops on Sale</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-bold font-mono text-stone-900">14 Crops</span>
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">84% Sold</span>
                </div>
                <p className="text-xs text-stone-500 mt-2">3 deliveries sending today</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Total Earnings This Month</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-bold font-mono text-emerald-700">₹8,42,500</span>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">85% Share</span>
                </div>
                <p className="text-xs text-stone-500 mt-2">Zero broker fees or commission cuts</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Safe Cold Delivery</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-bold font-mono text-stone-900">99.4%</span>
                  <span className="text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold">Fresh &amp; Cool</span>
                </div>
                <p className="text-xs text-stone-500 mt-2">Crop damage kept under 1.2%</p>
              </div>
            </div>
          )}

          {/* Main Grid: Active Lots & Incoming B2B Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Left 2 Cols: Active Lots */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
                      Your Listed Crops &amp; Harvest Schedule
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Orders placed by families and wholesale buyers
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('marketplace')}
                    className="text-xs font-bold text-farm-orange hover:underline cursor-pointer"
                  >
                    View in Marketplace →
                  </button>
                </div>

                <div className="space-y-4">
                  {isSyncing ? (
                    <>
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                    </>
                  ) : (
                    produceList.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-emerald-500 hover:shadow-xs transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {item.imageUrl && (
                              <ShadowImage
                                src={item.imageUrl}
                                alt={item.name}
                                wrapperClassName="w-12 h-12 rounded-xl shrink-0 shadow-2xs overflow-hidden"
                                className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                                <span className="text-[10px] font-mono bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                                  Crop #{item.id.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-stone-500 mt-1">
                                <span>Harvest: <strong className="text-stone-700">{item.harvestDate}</strong></span>
                                <span>•</span>
                                <span>Quality: <strong className="text-emerald-700">{item.brixSweetnessIndex || 'Grade A Fresh'}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right sm:text-right">
                            <span className="text-sm font-bold text-stone-900 font-mono">
                              ₹{item.retailPrice} / {item.retailUnit}
                            </span>
                            <span className="text-[11px] block text-stone-500">
                              Available: {item.stockAvailableKg} kg
                            </span>
                          </div>
                        </div>

                        {/* Quota Progress */}
                        <div className="mt-3 pt-3 border-t border-stone-200/60">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-stone-500">Stock Booked:</span>
                            <span className="font-bold text-emerald-800">{item.allotmentReservedPercent}% Booked</span>
                          </div>
                          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-farm-green h-full rounded-full"
                              style={{ width: `${item.allotmentReservedPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* AI Recommendations Card */}
              <div className="bg-gradient-to-r from-[#e7f7fd] to-[#d6f0fb] rounded-3xl border border-sky-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                    Crop Demand Alert
                  </span>
                  <h4 className="font-serif-heading text-xl font-bold text-stone-900">
                    High Demand Expected for Fresh Red Onions (+24%)
                  </h4>
                  <p className="text-xs text-stone-600 max-w-xl">
                    Buyers in Mumbai &amp; Pune need more onions over the next 20 days. Recommended selling price: ₹34/kg (mandi is only ₹24).
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('ai-forecasting')}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shrink-0 transition-colors cursor-pointer"
                >
                  Check Crop Demand →
                </button>
              </div>
            </div>

            {/* Right Col: Incoming Commercial Buyer Bids */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
                    Buyer Purchase Offers
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <p className="text-xs text-stone-500 mb-4">
                  Direct purchase offers from verified restaurants, stores, and buyers.
                </p>

                <div className="space-y-4">
                  {isSyncing ? (
                    <>
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                    </>
                  ) : (
                    incomingBids.map((bid) => (
                      <div key={bid.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-xs text-stone-900">{bid.buyer}</h5>
                            <span className="text-[11px] text-stone-500">{bid.produce}</span>
                          </div>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                            {bid.timeAgo}
                          </span>
                        </div>

                        <div className="flex justify-between text-xs py-2 border-y border-amber-200/60 font-mono">
                          <div>
                            <span className="text-stone-400 block text-[10px]">Quantity</span>
                            <strong className="text-stone-800">{bid.quantity}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">Offered Price</span>
                            <strong className="text-emerald-700">₹{bid.bidPricePerKg} / kg</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">Mandi Price</span>
                            <span className="text-stone-500">₹{bid.mandiRate} / kg</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => alert(`Offer from ${bid.buyer} accepted! Safe payment of ₹${bid.bidPricePerKg * 800} will be held for your delivery.`)}
                            className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Accept Offer
                          </button>
                          <button
                            onClick={() => onNavigate('price-recommendation')}
                            className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Counter
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Direct Payout Card */}
              <div className="bg-[#3c2415] text-amber-50 rounded-3xl p-6 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-farm-gold">
                    Safe Payment Payout
                  </span>
                  <h4 className="font-serif-heading text-2xl font-bold text-amber-100">
                    ₹1,84,000 Ready for Payout
                  </h4>
                  <p className="text-xs text-stone-300">
                    Completed deliveries verified today. Money is ready to transfer to your Bank A/C: •••• 4492.
                  </p>
                  <button
                    onClick={() => alert('Instant UPI / NEFT settlement initiated! Payout will reflect within 15 minutes.')}
                    className="mt-3 w-full py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    Transfer to Bank Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View 2: Farmer Incoming Inquiries */}
      {activeFarmerTab === 'inquiries' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900">
                Incoming Buyer Inquiries (B2B Bulk Direct)
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Direct wholesale inquiries submitted by verified commercial buyers, food processors, and supermarket chains.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Pending', 'Quotation Received', 'Negotiating', 'Accepted', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFarmerInquiryFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    farmerInquiryFilter === status
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {inquiries.filter((inquiry) => {
            if (farmerInquiryFilter === 'All') return true;
            return inquiry.status.toLowerCase() === farmerInquiryFilter.toLowerCase();
          }).length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-7 h-7 text-farm-orange" />
              </div>
              <h3 className="font-serif-heading text-xl font-bold text-stone-900">
                No Inquiries Found
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                No buyer inquiries match the "{farmerInquiryFilter}" filter. When buyers request bulk quotations for your crops, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {inquiries
                .filter((inquiry) => {
                  if (farmerInquiryFilter === 'All') return true;
                  return inquiry.status.toLowerCase() === farmerInquiryFilter.toLowerCase();
                })
                .map((inquiry) => (
                  <InquiryCard
                    key={inquiry.id}
                    inquiry={inquiry}
                    viewMode="farmer"
                    onViewDetails={(id) => onNavigate('inquiry-detail', id)}
                    onSendQuotation={(inq) => setSelectedInquiryForQuote(inq)}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* View 3: Confirmed B2B Orders */}
      {activeFarmerTab === 'orders' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900">
              Confirmed B2B Trade Contracts
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Official legally binding supply agreements established through accepted quotes and negotiations. All commercial terms are locked.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-serif-heading text-xl font-bold text-stone-900">
                No Confirmed Orders Yet
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                When buyers accept your quotations or counter-offers, confirmed contracts with locked terms will appear here ready for dispatch.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  viewMode="farmer"
                  onViewOrder={(orderId) => onNavigate('order-detail', orderId)}
                  onPrepareDispatch={(orderId) => onNavigate('dispatch-order', orderId)}
                  onTrackShipment={(orderId) => onNavigate('orders', orderId)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Farmer Quotation Form Modal */}
      {selectedInquiryForQuote && (
        <QuotationFormModal
          inquiry={selectedInquiryForQuote}
          isOpen={!!selectedInquiryForQuote}
          onClose={() => setSelectedInquiryForQuote(null)}
          onQuotationSent={() => {
            setSelectedInquiryForQuote(null);
            setActiveFarmerTab('inquiries');
          }}
        />
      )}

      {/* Modal: List New Harvest Batch */}
      {showListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div>
                <span className="eyebrow-badge text-farm-orange">LIST A CROP</span>
                <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
                  List Your Crop on Marketplace
                </h3>
              </div>
              <button
                onClick={() => setShowListingModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Red Onions or Vine Tomatoes"
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5 focus:ring-1 focus:ring-farm-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5 focus:outline-none"
                  >
                    <option>Daily Essentials</option>
                    <option>Leafy Greens</option>
                    <option>Root Vegetables</option>
                    <option>Gourds &amp; Peppers</option>
                    <option>Fresh Seasonal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Available Quantity (Kg / Units)</label>
                  <input
                    type="number"
                    required
                    value={newVolumeKg}
                    onChange={(e) => setNewVolumeKg(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Selling Price (₹ / unit)</label>
                  <input
                    type="number"
                    required
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5 focus:outline-none"
                  />
                  <span className="text-[10px] text-emerald-700 mt-0.5 block font-semibold">
                    ✓ Normal Mandi price: ₹24 (You earn +58% more)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    required
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <span className="font-bold text-stone-800 block">✓ Quality &amp; Freshness Guarantee</span>
                <span>Our local team verifies quality before crops are delivered to buyers.</span>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="flex-1 py-2.5 border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  {formSuccess ? 'Listing...' : 'List Crop Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
