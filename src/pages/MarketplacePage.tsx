import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_PRODUCE, MOCK_FARMS } from '../data/mockData';
import { ProduceItem, UserRole } from '../types';
import { FarmCardSvg } from '../components/common/FarmCardSvg';
import { ShadowImage, ProduceCardSkeleton } from '../components/common/ShadowLoader';
import { MarketplaceLoader } from '../components/common/MarketplaceLoader';
import { Search, SlidersHorizontal, Star, MapPin, Check, ArrowUpDown, Clock, PlusCircle, ShieldAlert, Tractor, FileText, Lock, Inbox, AlertCircle, Send, X } from 'lucide-react';
import { useTradeFlow } from '../context/TradeFlowContext';
import { InquiryCard } from '../components/trade/InquiryCard';
import { OrderCard } from '../components/trade/OrderCard';
import { InquiryFormModal } from '../components/trade/InquiryFormModal';

interface MarketplacePageProps {
  onSelectProduct: (product: ProduceItem) => void;
  onNavigate: (tab: string, param?: any) => void;
  initialSearch?: string;
  initialCategory?: string;
  onAddToCart?: (product: ProduceItem, quantity: number) => void;
  produceList?: ProduceItem[];
  currentRole?: UserRole;
  onOpenListModal?: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  onSelectProduct,
  onNavigate,
  initialSearch = '',
  initialCategory = 'All',
  onAddToCart,
  produceList = MOCK_PRODUCE,
  currentRole = 'visitor',
  onOpenListModal,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState(200);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'brix'>('recommended');
  const { inquiries, orders } = useTradeFlow();
  const [marketplaceView, setMarketplaceView] = useState<'browse' | 'inquiries' | 'orders'>('browse');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('All');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState<ProduceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Synchronize when parent navigation passes search or category filters
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Initial page entrance loading animation with hourglass
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  // Trigger shadow skeleton loaders when filter/search/sort changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 140);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, organicOnly, sortBy, maxDistanceKm]);

  const categories = [
    'All',
    'Daily Essentials',
    'Leafy Greens',
    'Root Vegetables',
    'Gourds & Peppers',
    'Fresh Seasonal',
  ];

  const filteredProduce = useMemo(() => {
    return produceList.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.farmName.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.variety.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Organic filter
      if (organicOnly && !item.certifications.some((c) => c.toLowerCase().includes('organic') || c.toLowerCase().includes('jaivik') || c.toLowerCase().includes('npop'))) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.retailPrice - b.retailPrice;
      if (sortBy === 'price-desc') return b.retailPrice - a.retailPrice;
      if (sortBy === 'brix') return (b.brixSweetnessIndex || '').localeCompare(a.brixSweetnessIndex || '');
      return b.rating - a.rating;
    });
  }, [produceList, selectedCategory, searchQuery, organicOnly, sortBy]);

  const filteredInquiries = useMemo(() => {
    if (inquiryStatusFilter === 'All') return inquiries;
    if (inquiryStatusFilter === 'Confirmed') return inquiries.filter((i) => i.status === 'Order Confirmed');
    return inquiries.filter((i) => i.status === inquiryStatusFilter);
  }, [inquiries, inquiryStatusFilter]);

  if (isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <MarketplaceLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
      {/* Role Notice Banner (Only for Farmers) */}
      {currentRole === 'farmer' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold block text-sm">🌾 Farmer Mode (Listing Only)</span>
              <span className="text-amber-800">
                You are signed in as a farmer. You can list your vegetables here. To buy vegetables, please sign in with a buyer account.
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenListModal && onOpenListModal()}
            className="px-4 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Vegetable</span>
          </button>
        </div>
      )}

      {/* Buyer Marketplace Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          <button
            onClick={() => setMarketplaceView('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              marketplaceView === 'browse'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🥦 Browse Vegetables</span>
          </button>

          <button
            onClick={() => setMarketplaceView('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              marketplaceView === 'inquiries'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-farm-orange" />
            <span>My Inquiries</span>
            {inquiries.length > 0 && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  marketplaceView === 'inquiries'
                    ? 'bg-white/20 text-white'
                    : 'bg-orange-100 text-farm-orange'
                }`}
              >
                {inquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setMarketplaceView('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              marketplaceView === 'orders'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>My Orders</span>
            {orders.length > 0 && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  marketplaceView === 'orders'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {orders.length}
              </span>
            )}
          </button>
        </div>

        {marketplaceView !== 'browse' && (
          <button
            onClick={() => setMarketplaceView('browse')}
            className="text-xs font-bold text-farm-orange hover:underline cursor-pointer"
          >
            ← Back to All Vegetables
          </button>
        )}
      </div>

      {marketplaceView === 'browse' && (
        <>
          {/* Marketplace Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-stone-200 gap-4 transition-colors">
        <div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Fresh Vegetables Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Buy farm-fresh vegetables directly from verified local growers at transparent wholesale & retail rates.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vegetables like tomatoes, potatoes, onions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-xs rounded-full border border-stone-300 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-farm-orange transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded-full hover:bg-stone-100 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
        {[
          { key: 'All', label: 'All Vegetables' },
          { key: 'Daily Essentials', label: 'Daily Essentials' },
          { key: 'Leafy Greens', label: 'Leafy Greens' },
          { key: 'Root Vegetables', label: 'Root Vegetables' },
          { key: 'Gourds & Peppers', label: 'Gourds & Peppers' },
          { key: 'Fresh Seasonal', label: 'Seasonal Vegetables' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setSelectedCategory(cat.key);
              // When clicking All Vegetables or switching categories, clear search so user isn't trapped
              if (cat.key === 'All') {
                setSearchQuery('');
                setOrganicOnly(false);
              } else if (searchQuery) {
                setSearchQuery('');
              }
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-farm-orange text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter and Sort Control Bar */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-700">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="rounded text-farm-orange focus:ring-0 w-4 h-4 accent-farm-orange"
            />
            <span>✓ Certified Organic Produce Only</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Distance:</span>
            <input
              type="range"
              min={20}
              max={250}
              step={10}
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-24 accent-farm-orange"
            />
            <span className="font-mono text-stone-800">{maxDistanceKm} km</span>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border-none bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="recommended">Best Rating</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="brix">Sweetness Level</option>
          </select>
        </div>
      </div>

      {/* Active Filter / Search Notification Bar */}
      {(searchQuery.trim() !== '' || selectedCategory !== 'All' || organicOnly) && (
        <div className="mb-6 p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-stone-700">
            <span className="font-bold">
              Showing {filteredProduce.length} of {produceList.length} vegetables
            </span>
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-amber-300 font-semibold text-stone-800 shadow-2xs">
                <span>Search: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-farm-orange cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-amber-300 font-semibold text-stone-800 shadow-2xs">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="hover:text-farm-orange cursor-pointer"
                  title="Show all categories"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {organicOnly && (
              <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-amber-300 font-semibold text-stone-800 shadow-2xs">
                <span>Organic Only</span>
                <button
                  onClick={() => setOrganicOnly(false)}
                  className="hover:text-farm-orange cursor-pointer"
                  title="Remove organic filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOrganicOnly(false);
            }}
            className="text-farm-orange hover:text-farm-orange-hover font-bold text-xs hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Reset All Filters (Show All {produceList.length})</span>
          </button>
        </div>
      )}

      {/* Produce Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ProduceCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProduce.map((prod) => (
            <article
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Product Photography Header */}
                <div className="w-full h-48 rounded-2xl bg-stone-100 overflow-hidden relative border border-stone-200/80 shadow-xs">
                  {prod.imageUrl ? (
                    <ShadowImage
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <FarmCardSvg type={prod.imageTheme} />
                  )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[10px] font-bold px-2.5 py-1 rounded-full text-emerald-800 border border-emerald-100 flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {prod.certifications[0] || 'Verified Farm'}
                </div>

                <div className="absolute top-3 right-3 bg-stone-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{prod.rating} (Verified)</span>
                </div>
              </div>

              {/* Produce Meta */}
              <div className="mt-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif-heading text-xl font-bold text-stone-900 leading-tight">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">{prod.farmName}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono shrink-0">
                    ₹{prod.retailPrice} / {prod.retailUnit.split(' ')[0]}
                  </span>
                </div>

                <p className="text-xs text-stone-500 flex items-center gap-1 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{prod.location}</span>
                </p>
              </div>

              {/* Quality & Sweetness Info */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] block uppercase font-medium">Quality & Taste</span>
                  <span className="font-bold text-stone-800 truncate block">
                    {prod.brixSweetnessIndex || 'Grade AA+ Fresh'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block uppercase font-medium">Next Harvest</span>
                  <span className="font-bold text-stone-800">{prod.harvestDate.split(',')[0]}</span>
                </div>
              </div>

              {/* Stock Available Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-500">Stock Booked</span>
                  <span className="text-farm-green-dark font-bold">{prod.allotmentReservedPercent}% Booked</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-farm-green h-full rounded-full"
                    style={{ width: `${prod.allotmentReservedPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100">
              {currentRole === 'farmer' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectProduct(prod);
                      onNavigate('product-detail');
                    }}
                    className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenListModal) onOpenListModal();
                    }}
                    className="px-3.5 py-2.5 border border-amber-300 bg-amber-50 hover:bg-amber-100 rounded-xl text-amber-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="List crops in this category"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-farm-orange" />
                    <span>List Crop</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (onAddToCart) {
                        onAddToCart(prod, 1);
                        setRecentlyAddedId(prod.id);
                        setTimeout(() => setRecentlyAddedId((cur) => (cur === prod.id ? null : cur)), 1800);
                      } else {
                        onSelectProduct(prod);
                        onNavigate('product-detail');
                      }
                    }}
                    className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center ${
                      recentlyAddedId === prod.id
                        ? 'bg-emerald-600 text-white scale-[1.01]'
                        : 'bg-farm-orange hover:bg-farm-orange-hover text-white'
                    }`}
                  >
                    {recentlyAddedId === prod.id ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Basket!
                      </>
                    ) : (
                      <span>Add to Basket</span>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProductForInquiry(prod);
                      }}
                      className="flex-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs hover:scale-[1.01] active:scale-95"
                      title="Raise B2B Bulk Quotation Enquiry"
                    >
                      <FileText className="w-3.5 h-3.5 text-farm-orange shrink-0" />
                      <span>Raise Enquiry</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectProduct(prod);
                        onNavigate('product-detail');
                      }}
                      className="py-2 px-4 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 text-xs font-semibold transition-colors cursor-pointer text-center shrink-0"
                    >
                      Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
          ))}
        </div>
      )}

      {!isLoading && filteredProduce.length === 0 && (
        <div className="text-center py-16 bg-stone-50 rounded-3xl border border-stone-200 mt-6 transition-colors">
          <p className="text-stone-600 text-sm font-semibold">No vegetables found matching your search or filters.</p>
          <p className="text-stone-400 text-xs mt-1">Try clearing your search query or selecting "All Vegetables".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOrganicOnly(false);
            }}
            className="mt-4 px-5 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Show All {produceList.length} Vegetables
          </button>
        </div>
      )}
        </>
      )}

      {/* Buyer: My Inquiries View */}
      {marketplaceView === 'inquiries' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <span className="eyebrow-badge text-farm-orange">BUYER INQUIRY DASHBOARD</span>
              <h2 className="font-serif-heading text-3xl font-bold text-stone-900 mt-1">
                My Sourcing Inquiries
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Track your bulk inquiry requests, negotiate quotations, and confirm orders directly with farmers.
              </p>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Pending', 'Quotation Received', 'Negotiating', 'Confirmed', 'Rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setInquiryStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    inquiryStatusFilter === st
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredInquiries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInquiries.map((inq) => (
                <InquiryCard
                  key={inq.id}
                  inquiry={inq}
                  viewMode="buyer"
                  onViewDetails={(id) => onNavigate('inquiry-detail', { id })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <Inbox className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="font-serif-heading text-xl font-bold text-stone-800">
                No Inquiries in "{inquiryStatusFilter}"
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You haven't submitted any inquiries matching this status yet. Browse fresh crops to request a direct farmer quotation.
              </p>
              <button
                onClick={() => {
                  setInquiryStatusFilter('All');
                  setMarketplaceView('browse');
                }}
                className="mt-2 px-5 py-2.5 bg-farm-orange text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs"
              >
                Browse Produce →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Buyer: My Orders View */}
      {marketplaceView === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="pb-4 border-b border-stone-200">
            <span className="eyebrow-badge text-emerald-800 bg-emerald-50 border border-emerald-200">
              CONFIRMED B2B CONTRACTS
            </span>
            <h2 className="font-serif-heading text-3xl font-bold text-stone-900 mt-1">
              My Confirmed Orders
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Locked harvest contracts awaiting logistics dispatch, delivery verification, and escrow release.
            </p>
          </div>

          {orders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((ord) => (
                <OrderCard
                  key={ord.id}
                  order={ord}
                  viewMode="buyer"
                  onViewOrder={(id) => onNavigate('order-detail', { id })}
                  onTrackShipment={(id) => onNavigate('orders', id)}
                  onConfirmReceipt={(id) => onNavigate('orders', id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <Lock className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="font-serif-heading text-xl font-bold text-stone-800">
                No Confirmed B2B Orders Yet
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Once a farmer quotation or counter-offer is accepted, the confirmed order with locked terms will appear here.
              </p>
              <button
                onClick={() => setMarketplaceView('inquiries')}
                className="mt-2 px-5 py-2.5 bg-farm-orange text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs"
              >
                Check Active Inquiries →
              </button>
            </div>
          )}
        </div>
      )}

      {/* B2B Direct Inquiry Form Modal */}
      {selectedProductForInquiry && (
        <InquiryFormModal
          product={selectedProductForInquiry}
          isOpen={!!selectedProductForInquiry}
          onClose={() => setSelectedProductForInquiry(null)}
          onInquiryCreated={(_inquiryId) => {
            setSelectedProductForInquiry(null);
            setMarketplaceView('inquiries');
          }}
        />
      )}

    </div>
  );
};
