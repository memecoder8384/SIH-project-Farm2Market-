import React from 'react';
import { UserRole, UserProfile } from '../../types';
import { ShoppingBag } from 'lucide-react';
import { AnimatedTopDock, MODERN_ITEMS } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import { authService } from '../../services/authService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onOpenListModal?: () => void;
  cartCount: number;
  onOpenCart?: () => void;
  onOpenSignInModal?: (role?: 'farmer' | 'buyer') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  currentUser,
  onLogout,
  onOpenListModal,
  cartCount,
  onOpenCart,
  onOpenSignInModal,
}) => {

  // Show the farmer option in navbar without logging in.
  // When clicked while not logged in, popup the sign in page.
  // For logged-in buyers, remove farmer area.
  // For farmers and visitors, keep farmer area in navbar!
  const isBuyer = currentRole === 'buyer';

  const activeDockItems = MODERN_ITEMS.filter((item) => {
    // Only remove farmer area if user is logged in as a buyer
    if (isBuyer && item.id === 'farmer') {
      return false;
    }
    return true;
  });

  const tabToDockId: Record<string, string> = {
    landing: 'home',
    marketplace: 'marketplace',
    'product-detail': 'marketplace',
    'farmer-dashboard': isBuyer ? 'marketplace' : 'farmer',
    'buyer-dashboard': 'marketplace',
    orders: 'orders',
    logistics: 'orders',
    'price-recommendation': 'pricing',
    'ai-forecasting': 'ai-demand',
    'inquiry-detail': isBuyer ? 'marketplace' : 'farmer',
    'order-detail': isBuyer ? 'marketplace' : 'farmer',
    signin: '',
  };

  const handleItemSelect = (id: string) => {
    if (id === 'home') setActiveTab('landing');
    else if (id === 'marketplace') setActiveTab('marketplace');
    else if (id === 'farmer') {
      const activeUser = currentUser || authService.getCurrentUser();
      if (!activeUser) {
        if (onOpenSignInModal) onOpenSignInModal('farmer');
        else setActiveTab('signin');
      } else {
        setActiveTab('farmer-dashboard');
      }
    }
    else if (id === 'orders') setActiveTab('orders');
    else if (id === 'pricing') setActiveTab('price-recommendation');
    else if (id === 'ai-demand') setActiveTab('ai-forecasting');
  };

  const activeUser = currentUser || authService.getCurrentUser();
  const displayName = activeUser?.name ? activeUser.name.split(' ')[0] : null;

  const ghostButtonLabel = activeUser
    ? `${displayName} (Sign out)`
    : 'Sign in';

  return (
    <div className="w-full sticky top-0 z-50">
      {/* Modern Inset Command Bar Navbar (AnimatedTopDock modern variant) */}
      <div className="w-full bg-farm-sky-pale border-b border-sky-200/80 relative overflow-visible shadow-xs transition-colors duration-300">
        <div className="navbar-top-dock-wrapper">
          <AnimatedTopDock
            variant="modern"
            proximity={122}
            spring={0.19}
            damping={0.7}
            widthGrowth={17}
            heightGrowth={16}
            drop={3.5}
            brandName="Farm2Market"
            items={activeDockItems}
            activeId={tabToDockId[activeTab]}
            ghostText={ghostButtonLabel}
            className="navbar-top-dock"
            onItemSelect={handleItemSelect}
            onBrandClick={() => setActiveTab('landing')}
            onGhostClick={() => {
              const user = currentUser || authService.getCurrentUser();
              if (user) {
                if (onLogout) onLogout();
                setActiveTab('landing');
              } else {
                if (onOpenSignInModal) {
                  onOpenSignInModal('farmer');
                } else {
                  setActiveTab('signin');
                }
              }
            }}
          />

          {/* Right Controls Container: Quick Cart Drawer Trigger */}
          {currentRole !== 'farmer' && (
            <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex items-center gap-2 sm:gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenCart) onOpenCart();
                  else setActiveTab('orders');
                }}
                className="relative p-2 text-stone-700 hover:text-stone-900 bg-white/90 hover:bg-white rounded-full border border-stone-200/90 shadow-xs transition-colors cursor-pointer shrink-0"
                title="Your Basket & Orders"
              >
                <ShoppingBag className="w-4 h-4 text-stone-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-farm-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
