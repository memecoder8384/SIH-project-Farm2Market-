import React from 'react';
import { UserRole, UserProfile } from '../../types';
import { authService } from '../../services/authService';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  currentRole?: UserRole;
  currentUser?: UserProfile | null;
  onOpenSignInModal?: (role?: 'farmer' | 'buyer') => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  currentRole,
  currentUser,
  onOpenSignInModal,
}) => {
  const isBuyer = currentRole === 'buyer';

  return (
    <footer className="bg-[#3c2415] text-amber-100/80 pt-16 pb-10 border-t-4 border-[#29170c] transition-colors duration-300" data-purpose="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-amber-950">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                <svg className="w-5 h-5 text-stone-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 20V10"></path>
                  <path d="M12 10a4 4 0 0 1 4-4h2v2a4 4 0 0 1-4 4h-2"></path>
                </svg>
              </div>
              <span className="font-serif-heading text-2xl font-bold text-amber-100 tracking-tight">FARM2MARKET</span>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              A direct platform connecting local farmers with families and wholesale buyers, ensuring fresh crops, fair prices, and safe delivery.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-2.5 py-1 rounded-full font-bold">
                ✓ Verified Direct Farm Platform
              </span>
              <span className="text-[10px] bg-amber-900/50 text-amber-300 border border-amber-700/50 px-2.5 py-1 rounded-full font-bold">
                ✓ 85% Paid Directly to Farmers
              </span>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div className="text-xs space-y-2.5">
            <h5 className="font-bold uppercase tracking-wider text-amber-100 mb-3 text-[11px]">Quick Links</h5>
            <div><button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors cursor-pointer">Crops Marketplace</button></div>
            {!isBuyer && (
              <div>
                <button
                  onClick={() => {
                    const activeUser = currentUser || authService.getCurrentUser();
                    if (!activeUser) {
                      if (onOpenSignInModal) onOpenSignInModal('farmer');
                      else setActiveTab('signin');
                    } else {
                      setActiveTab('farmer-dashboard');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Farmer Dashboard
                </button>
              </div>
            )}
            <div><button onClick={() => setActiveTab('buyer-dashboard')} className="hover:text-white transition-colors cursor-pointer">Buyer Dashboard</button></div>
            <div><button onClick={() => setActiveTab('orders')} className="hover:text-white transition-colors cursor-pointer">Track Deliveries</button></div>
            <div><button onClick={() => setActiveTab('logistics')} className="hover:text-white transition-colors cursor-pointer">Delivery System</button></div>
          </div>

          {/* Col 3: AI & Technology */}
          <div className="text-xs space-y-2.5">
            <h5 className="font-bold uppercase tracking-wider text-amber-100 mb-3 text-[11px]">Smart Tools</h5>
            <div><button onClick={() => setActiveTab('ai-forecasting')} className="hover:text-white transition-colors cursor-pointer">Crop Demand Trends</button></div>
            <div><button onClick={() => setActiveTab('price-recommendation')} className="hover:text-white transition-colors cursor-pointer">Fair Price Calculator</button></div>
            <div><span className="text-stone-400">Fair Market Rates</span></div>
            <div><span className="text-stone-400">Live Order Updates</span></div>
            <div><span className="text-stone-400">100% Quality Checked</span></div>
          </div>

          {/* Col 4: Regional Hubs */}
          <div className="text-xs space-y-2.5">
            <h5 className="font-bold uppercase tracking-wider text-amber-100 mb-3 text-[11px]">Farming Regions</h5>
            <p className="text-stone-400">Western Farms: Nashik, Maharashtra</p>
            <p className="text-stone-400">Central Farms: Khargone, Madhya Pradesh</p>
            <p className="text-stone-400">Southern Farms: Chikkaballapur, Karnataka</p>
            <p className="text-stone-300 font-mono pt-1 text-[11px]">Help Line: 1800-FARM-2-MKT</p>
            <p className="text-stone-300 font-mono text-[11px]">support@farm2market.com</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400">
          <p>© 2026 FARM2MARKET. Connecting Local Farmers &amp; Happy Buyers.</p>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <span className="border border-stone-700 px-2 py-0.5 rounded text-stone-300">English (India)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
