import React, { useState, useEffect } from 'react';
import { CrateButton } from './components/common/CrateButton';
import { ShadowRouteLoader } from './components/common/ShadowLoader';
import { ListProductModal } from './components/common/ListProductModal';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { OrdersTrackingPage } from './pages/OrdersTrackingPage';
import { LogisticsDashboardPage } from './pages/LogisticsDashboardPage';
import { AiDemandForecastingPage } from './pages/AiDemandForecastingPage';
import { PriceRecommendationPage } from './pages/PriceRecommendationPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { SignInPage } from './pages/SignInPage';
import { InquiryDetailPage } from './pages/InquiryDetailPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { DispatchPage } from './pages/DispatchPage';
import { ShipmentDetailPage } from './pages/ShipmentDetailPage';
import { CartDrawer, CartItem } from './components/common/CartDrawer';
import { FarmAiAssistant } from './components/common/FarmAiAssistant';
import { UserRole, ProduceItem, UserProfile } from './types';
import { MOCK_PRODUCE } from './data/mockData';
import { authService } from './services/authService';
import { TradeFlowProvider } from './context/TradeFlowContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function AppContent() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    try {
      localStorage.removeItem('farm2market-theme');
      localStorage.removeItem('farm2market-theme-v2');
    } catch {
      // ignore storage error
    }
  }, []);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => authService.getCurrentUser()?.role || 'visitor');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [activeInquiryId, setActiveInquiryId] = useState<string>('inq-1');
  const [activeOrderId, setActiveOrderId] = useState<string>('ord-1');
  const [activeDispatchOrderId, setActiveDispatchOrderId] = useState<string>('ord-1');
  const [activeShipmentId, setActiveShipmentId] = useState<string>('SHP-2026-TOM-01');
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | undefined>(undefined);
  const [produceList, setProduceList] = useState<ProduceItem[]>(MOCK_PRODUCE);
  const [selectedProduct, setSelectedProduct] = useState<ProduceItem>(MOCK_PRODUCE[0]);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);

  // Synchronize route paths like /inquiry/:id, /order/:id/dispatch, /order/:id, /shipment/:id, /tracking/:orderId
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (
        path === '/orders' ||
        path === '/orders/' ||
        path === '/tracking' ||
        path === '/tracking/' ||
        path === '/order' ||
        path === '/order/'
      ) {
        setActiveTab('orders');
        return;
      }
      if (path === '/marketplace' || path === '/marketplace/') {
        setActiveTab('marketplace');
        return;
      }
      if (path.startsWith('/inquiry/')) {
        const id = path.replace('/inquiry/', '').trim();
        if (id) {
          setActiveInquiryId(id);
          setActiveTab('inquiry-detail');
        }
      } else if (path.includes('/dispatch')) {
        const matches = path.match(/^\/order\/([^/]+)\/dispatch/);
        if (matches && matches[1]) {
          setActiveDispatchOrderId(matches[1]);
          setActiveTab('dispatch-order');
        }
      } else if (path.startsWith('/order/')) {
        const id = path.replace('/order/', '').trim();
        if (id) {
          setActiveOrderId(id);
          setActiveTab('order-detail');
        } else {
          setActiveTab('orders');
        }
      } else if (path.startsWith('/shipment/')) {
        const id = path.replace('/shipment/', '').trim();
        if (id) {
          setActiveShipmentId(id);
          setActiveTab('shipment-detail');
        } else {
          setActiveTab('orders');
        }
      } else if (path.startsWith('/tracking/')) {
        const id = path.replace('/tracking/', '').trim();
        if (id) {
          setActiveTrackingOrderId(id);
          setActiveTab('orders');
        } else {
          setActiveTab('orders');
        }
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: MOCK_PRODUCE[0], quantity: 2 },
    { product: MOCK_PRODUCE[3], quantity: 1 },
  ]);

  const [pricingNavKey, setPricingNavKey] = useState<number>(0);
  const [ordersNavKey, setOrdersNavKey] = useState<number>(0);
  const [marketplaceNavKey, setMarketplaceNavKey] = useState<number>(0);
  const [farmerNavKey, setFarmerNavKey] = useState<number>(0);
  const [aiDemandNavKey, setAiDemandNavKey] = useState<number>(0);

  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [signInModalInitialRole, setSignInModalInitialRole] = useState<'farmer' | 'buyer'>('farmer');

  const handleOpenSignInModal = (role: 'farmer' | 'buyer' = 'farmer') => {
    setSignInModalInitialRole(role);
    setIsSignInModalOpen(true);
  };

  const handleNavigate = (tab: string, param?: any) => {
    const activeUser = currentUser || authService.getCurrentUser();
    const activeRole = activeUser?.role || currentRole;

    // Farmer area is only accessible if logged in as a farmer
    if (tab === 'farmer-dashboard') {
      if (!activeUser) {
        handleOpenSignInModal('farmer');
        return;
      }
      if (activeRole === 'buyer') {
        setActiveTab('marketplace');
        setMarketplaceNavKey((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (tab === 'price-recommendation') {
      setPricingNavKey((prev) => prev + 1);
    }
    if (tab === 'orders') {
      setOrdersNavKey((prev) => prev + 1);
    }
    if (tab === 'marketplace') {
      setMarketplaceNavKey((prev) => prev + 1);
      setSearchFilter(param?.search !== undefined ? param.search : '');
      setCategoryFilter(param?.category !== undefined ? param.category : 'All');
    }
    if (tab === 'farmer-dashboard') {
      setFarmerNavKey((prev) => prev + 1);
    }
    if (tab === 'ai-forecasting') {
      setAiDemandNavKey((prev) => prev + 1);
    }
    if (param?.search && tab !== 'marketplace') {
      setSearchFilter(param.search);
    }
    if (param?.category && tab !== 'marketplace') {
      setCategoryFilter(param.category);
    }
    if (tab === 'inquiry-detail') {
      const id = typeof param === 'string' ? param : param?.inquiryId || param?.id || activeInquiryId;
      if (id) {
        setActiveInquiryId(id);
        try {
          window.history.pushState({}, '', `/inquiry/${id}`);
        } catch (e) {}
      }
    } else if (tab === 'order-detail') {
      const id = typeof param === 'string' ? param : param?.orderId || param?.id || activeOrderId;
      if (id) {
        setActiveOrderId(id);
        try {
          window.history.pushState({}, '', `/order/${id}`);
        } catch (e) {}
      }
    } else if (tab === 'dispatch-order') {
      const id = typeof param === 'string' ? param : param?.orderId || param?.id || activeDispatchOrderId;
      if (id) {
        setActiveDispatchOrderId(id);
        try {
          window.history.pushState({}, '', `/order/${id}/dispatch`);
        } catch (e) {}
      }
    } else if (tab === 'shipment-detail') {
      const id = typeof param === 'string' ? param : param?.shipmentId || param?.id || activeShipmentId;
      if (id) {
        setActiveShipmentId(id);
        try {
          window.history.pushState({}, '', `/shipment/${id}`);
        } catch (e) {}
      }
    } else if (tab === 'orders') {
      const id = typeof param === 'string' ? param : param?.orderId || param?.shipmentId || param?.id;
      if (id) {
        setActiveTrackingOrderId(id);
        try {
          window.history.pushState({}, '', `/tracking/${id}`);
        } catch (e) {}
      } else {
        try {
          if (
            window.location.pathname.startsWith('/inquiry/') ||
            window.location.pathname.startsWith('/order/') ||
            window.location.pathname.startsWith('/shipment/') ||
            window.location.pathname.startsWith('/tracking/')
          ) {
            window.history.pushState({}, '', '/');
          }
        } catch (e) {}
      }
    } else {
      try {
        if (
          window.location.pathname.startsWith('/inquiry/') ||
          window.location.pathname.startsWith('/order/') ||
          window.location.pathname.startsWith('/shipment/') ||
          window.location.pathname.startsWith('/tracking/')
        ) {
          window.history.pushState({}, '', '/');
        }
      } catch (e) {}
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: ProduceItem) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: ProduceItem, quantity: number = 1) => {
    // Role guard: farmers cannot buy!
    if (currentRole === 'farmer') {
      alert('Farmers can list crops for sale. To buy crops, please sign in as a Buyer.');
      return;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAddProduce = (newProduce: ProduceItem) => {
    setProduceList((prev) => [newProduce, ...prev]);
    setSelectedProduct(newProduce);
    setMarketplaceNavKey((prev) => prev + 1);
    setFarmerNavKey((prev) => prev + 1);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    authService.setCurrentUser(user);
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsSignInModalOpen(false);
    if (user.role === 'buyer' && activeTab === 'farmer-dashboard') {
      setActiveTab('marketplace');
    }
  };

  const handleLogout = () => {
    authService.clearCurrentUser();
    setCurrentUser(null);
    setCurrentRole('visitor');
    handleNavigate('landing');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'visitor') {
      authService.clearCurrentUser();
      setCurrentUser(null);
    } else {
      const demo = authService.getDemoUser(role);
      setCurrentUser(demo);
      authService.setCurrentUser(demo);
    }
    if (role === 'buyer' && activeTab === 'farmer-dashboard') {
      setActiveTab('marketplace');
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-farm-sky-pale text-stone-800 transition-colors duration-300 relative">
      {/* Global Glowing Shadow Route Loader */}
      <ShadowRouteLoader activeKey={activeTab} />

      {/* Top Header with Role Switcher & Dynamic Dock */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenListModal={() => setIsListModalOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSignInModal={handleOpenSignInModal}
      />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        <ErrorBoundary onReset={() => setActiveTab('marketplace')}>
          {activeTab === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplacePage
            key={`marketplace-${marketplaceNavKey}`}
            produceList={produceList}
            currentRole={currentRole}
            onOpenListModal={() => setIsListModalOpen(true)}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
            initialSearch={searchFilter}
            initialCategory={categoryFilter}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'product-detail' && (
          <ProductDetailPage
            product={selectedProduct}
            currentRole={currentRole}
            onOpenListModal={() => setIsListModalOpen(true)}
            onBack={() => handleNavigate('marketplace')}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'farmer-dashboard' && (
          !currentUser ? (
            <SignInPage
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
              initialRole="farmer"
            />
          ) : currentRole === 'buyer' ? (
            <MarketplacePage
              key={`marketplace-${marketplaceNavKey}`}
              produceList={produceList}
              currentRole={currentRole}
              onOpenListModal={() => setIsListModalOpen(true)}
              onSelectProduct={handleSelectProduct}
              onNavigate={handleNavigate}
              initialSearch={searchFilter}
              initialCategory={categoryFilter}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <FarmerDashboardPage
              key={`farmer-${farmerNavKey}`}
              produceList={produceList}
              currentRole={currentRole}
              currentUser={currentUser}
              onOpenListModal={() => setIsListModalOpen(true)}
              onNavigate={handleNavigate}
            />
          )
        )}

        {activeTab === 'buyer-dashboard' && (
          <BuyerDashboardPage
            currentRole={currentRole}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersTrackingPage
            key={`orders-${ordersNavKey}`}
            initialTrackingId={activeTrackingOrderId}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'logistics' && (
          <LogisticsDashboardPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'ai-forecasting' && (
          <AiDemandForecastingPage key={`ai-demand-${aiDemandNavKey}`} onNavigate={handleNavigate} />
        )}

        {activeTab === 'price-recommendation' && (
          <PriceRecommendationPage key={`pricing-${pricingNavKey}`} onNavigate={handleNavigate} />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsPage
            currentRole={currentRole}
            setCurrentRole={handleRoleChange}
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'signin' && (
          <SignInPage
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
            initialRole={currentRole}
          />
        )}

        {activeTab === 'inquiry-detail' && (
          <InquiryDetailPage
            inquiryId={activeInquiryId}
            currentRole={currentRole}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'order-detail' && (
          <OrderConfirmationPage
            orderId={activeOrderId}
            currentRole={currentRole}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'dispatch-order' && (
          <DispatchPage
            orderId={activeDispatchOrderId}
            currentRole={currentRole}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'shipment-detail' && (
          <ShipmentDetailPage
            shipmentId={activeShipmentId}
            currentRole={currentRole}
            onNavigate={handleNavigate}
          />
        )}
        </ErrorBoundary>
      </main>

      {/* Storybook Earth Loam Footer */}
      <Footer
        setActiveTab={handleNavigate}
        currentRole={currentRole}
        currentUser={currentUser}
        onOpenSignInModal={handleOpenSignInModal}
      />

      {/* Pop up Sign In Modal */}
      {isSignInModalOpen && (
        <SignInPage
          isModal={true}
          onClose={() => setIsSignInModalOpen(false)}
          onNavigate={(tab, param) => {
            setIsSignInModalOpen(false);
            handleNavigate(tab, param);
          }}
          onLoginSuccess={(user) => {
            setIsSignInModalOpen(false);
            handleLoginSuccess(user);
          }}
          initialRole={signInModalInitialRole}
        />
      )}

      {/* Farmer Product Listing Modal */}
      <ListProductModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onAddProduce={handleAddProduce}
        currentUser={currentUser}
      />

      {/* Slide-over Cart Drawer with 85% Farmer Return Escrow Breakdown */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onNavigate={handleNavigate}
      />

      {/* Floating Krishi AI Assistant with Streaming Telemetry Q&A (bottom-left) */}
      <FarmAiAssistant onNavigate={handleNavigate} />

      {/* Floating Harvest Crate Trigger Button (bottom-right) - ONLY for Buyers & Visitors */}
      {currentRole !== 'farmer' && (
        <div className="fixed bottom-6 right-6 z-40">
          <CrateButton
            onClick={() => setIsCartOpen(true)}
            cartCount={totalCartCount}
            label="MY BASKET"
          />
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary fallbackTitle="Application Error Encountered">
      <TradeFlowProvider>
        <AppContent />
      </TradeFlowProvider>
    </ErrorBoundary>
  );
}

export default App;
