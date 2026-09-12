import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Inquiry,
  B2BOrder,
  CreateInquiryDTO,
  CreateQuotationDTO,
  CounterOfferDTO,
  Shipment,
  LogisticsPartner,
  CreateDispatchDTO,
} from '../types/tradeFlow';
import { tradeFlowService } from '../services/tradeFlowService';
import { shipmentService } from '../services/shipmentService';

interface TradeFlowContextType {
  inquiries: Inquiry[];
  orders: B2BOrder[];
  shipments: Shipment[];
  logisticsPartners: LogisticsPartner[];
  createInquiry: (dto: CreateInquiryDTO) => Inquiry;
  submitQuotation: (inquiryId: string, quote: CreateQuotationDTO) => Inquiry;
  submitCounterOffer: (inquiryId: string, offer: CounterOfferDTO) => Inquiry;
  acceptOffer: (inquiryId: string, role: 'buyer' | 'farmer', name: string) => { inquiry: Inquiry; order: B2BOrder };
  rejectInquiry: (inquiryId: string, reason: string, role: 'buyer' | 'farmer') => Inquiry;
  getInquiry: (id: string) => Inquiry | undefined;
  getOrder: (id: string) => B2BOrder | undefined;
  // Flow 2 Methods
  getShipment: (id: string) => Shipment | undefined;
  getShipmentByOrderId: (orderId: string) => Shipment | undefined;
  createDispatch: (orderId: string, dto: CreateDispatchDTO) => Shipment;
  assignLogisticsPartner: (shipmentId: string, partnerId: string) => Shipment;
  schedulePickup: (shipmentId: string) => Shipment;
  confirmPickup: (shipmentId: string) => Shipment;
  startTransit: (shipmentId: string) => Shipment;
  updateSimulationProgress: (shipmentId: string, progress: number) => Shipment;
  toggleOptimizedRoute: (shipmentId: string) => Shipment;
  markDelivered: (shipmentId: string) => Shipment;
  confirmReceipt: (shipmentId: string, confirmedBy: string, remarks?: string) => Shipment;
  reportReceiptIssue: (shipmentId: string, issue: string) => Shipment;
  resetMockData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

const TradeFlowContext = createContext<TradeFlowContextType | undefined>(undefined);

export const TradeFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => tradeFlowService.getInquiries());
  const [orders, setOrders] = useState<B2BOrder[]>(() => tradeFlowService.getOrders());
  const [shipments, setShipments] = useState<Shipment[]>(() => shipmentService.getShipments());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubTrade = tradeFlowService.subscribe(() => {
      setInquiries(tradeFlowService.getInquiries());
      setOrders(tradeFlowService.getOrders());
    });
    const unsubShip = shipmentService.subscribe(() => {
      setShipments(shipmentService.getShipments());
      setOrders(tradeFlowService.getOrders());
    });
    return () => {
      unsubTrade();
      unsubShip();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  const clearToast = () => setToastMessage(null);

  const createInquiry = (dto: CreateInquiryDTO): Inquiry => {
    const created = tradeFlowService.createInquiry(dto);
    showToast(`Inquiry created! Status: Pending (ID: ${created.id})`);
    return created;
  };

  const submitQuotation = (inquiryId: string, quote: CreateQuotationDTO): Inquiry => {
    const updated = tradeFlowService.submitQuotation(inquiryId, quote);
    showToast(`Quotation sent! Total: ₹${(quote.pricePerUnit * quote.availableQuantity).toLocaleString('en-IN')}`);
    return updated;
  };

  const submitCounterOffer = (inquiryId: string, offer: CounterOfferDTO): Inquiry => {
    const updated = tradeFlowService.submitCounterOffer(inquiryId, offer);
    showToast(`Counter-offer submitted (₹${offer.pricePerUnit}/${offer.unit})`);
    return updated;
  };

  const acceptOffer = (
    inquiryId: string,
    role: 'buyer' | 'farmer',
    name: string
  ): { inquiry: Inquiry; order: B2BOrder } => {
    const result = tradeFlowService.acceptOffer(inquiryId, role, name);
    showToast(`Quotation Accepted! Confirmed Order #${result.order.orderNumber} created.`);
    return result;
  };

  const rejectInquiry = (inquiryId: string, reason: string, role: 'buyer' | 'farmer'): Inquiry => {
    const updated = tradeFlowService.rejectInquiry(inquiryId, reason, role);
    showToast(`Inquiry updated to Rejected.`);
    return updated;
  };

  const getInquiry = (id: string) => tradeFlowService.getInquiryById(id);
  const getOrder = (id: string) => tradeFlowService.getOrderById(id);

  // Flow 2 Shipment Wrappers
  const getShipment = (id: string) => shipmentService.getShipmentById(id);
  const getShipmentByOrderId = (orderId: string) => shipmentService.getShipmentByOrderId(orderId);

  const createDispatch = (orderId: string, dto: CreateDispatchDTO): Shipment => {
    const s = shipmentService.createDispatch(orderId, dto);
    showToast(`Dispatch prepared! Status: Dispatch Ready (Truck: ${dto.vehicleNumber})`);
    return s;
  };

  const assignLogisticsPartner = (shipmentId: string, partnerId: string): Shipment => {
    const s = shipmentService.assignLogisticsPartner(shipmentId, partnerId);
    showToast(`Logistics partner assigned: ${s.logisticsPartner?.name}`);
    return s;
  };

  const schedulePickup = (shipmentId: string): Shipment => {
    const s = shipmentService.schedulePickup(shipmentId);
    showToast('Pickup scheduled with packhouse');
    return s;
  };

  const confirmPickup = (shipmentId: string): Shipment => {
    const s = shipmentService.confirmPickup(shipmentId);
    showToast('Pickup confirmed! Produce loaded and sealed in reefer');
    return s;
  };

  const startTransit = (shipmentId: string): Shipment => {
    const s = shipmentService.startTransit(shipmentId);
    showToast('Shipment In Transit! Live GPS telemetry active');
    return s;
  };

  const updateSimulationProgress = (shipmentId: string, progress: number): Shipment => {
    return shipmentService.updateSimulationProgress(shipmentId, progress);
  };

  const toggleOptimizedRoute = (shipmentId: string): Shipment => {
    const s = shipmentService.toggleOptimizedRoute(shipmentId);
    showToast(
      s.aiOptimization.isOptimizedRouteApplied
        ? 'AI Optimized Route active (Saved 35 km, 45 min)'
        : 'Standard highway route selected'
    );
    return s;
  };

  const markDelivered = (shipmentId: string): Shipment => {
    const s = shipmentService.markDelivered(shipmentId);
    showToast('Shipment marked Delivered! Buyer confirmation requested');
    return s;
  };

  const confirmReceipt = (shipmentId: string, confirmedBy: string, remarks?: string): Shipment => {
    const s = shipmentService.confirmReceipt(shipmentId, confirmedBy, remarks);
    showToast('Receipt confirmed! Order completed & escrow payment released.');
    return s;
  };

  const reportReceiptIssue = (shipmentId: string, issue: string): Shipment => {
    const s = shipmentService.reportReceiptIssue(shipmentId, issue);
    showToast('Issue recorded with delivery inspection. Support alerted.');
    return s;
  };

  const resetMockData = () => {
    tradeFlowService.resetToMockData();
    shipmentService.resetToMockData();
    showToast('Reset trade flow & shipment data to initial seed demo.');
  };

  return (
    <TradeFlowContext.Provider
      value={{
        inquiries,
        orders,
        shipments,
        logisticsPartners: shipmentService.getLogisticsPartners(),
        createInquiry,
        submitQuotation,
        submitCounterOffer,
        acceptOffer,
        rejectInquiry,
        getInquiry,
        getOrder,
        getShipment,
        getShipmentByOrderId,
        createDispatch,
        assignLogisticsPartner,
        schedulePickup,
        confirmPickup,
        startTransit,
        updateSimulationProgress,
        toggleOptimizedRoute,
        markDelivered,
        confirmReceipt,
        reportReceiptIssue,
        resetMockData,
        toastMessage,
        showToast,
        clearToast,
      }}
    >
      {children}

      {/* Global B2B Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700 text-xs font-semibold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{toastMessage}</span>
            <button
              onClick={clearToast}
              className="ml-2 text-stone-400 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </TradeFlowContext.Provider>
  );
};

export const useTradeFlow = () => {
  const context = useContext(TradeFlowContext);
  if (!context) {
    throw new Error('useTradeFlow must be used within a TradeFlowProvider');
  }
  return context;
};
