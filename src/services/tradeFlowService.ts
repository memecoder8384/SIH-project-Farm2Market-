import { Inquiry, B2BOrder, OrderStatus, CreateInquiryDTO, CreateQuotationDTO, CounterOfferDTO, NegotiationOffer } from '../types/tradeFlow';
import { INITIAL_MOCK_INQUIRIES, INITIAL_MOCK_ORDERS } from '../data/tradeFlowMockData';

const INQUIRIES_STORAGE_KEY = 'farm2market_inquiries_v2';
const ORDERS_STORAGE_KEY = 'farm2market_b2b_orders_v2';

class TradeFlowService {
  private inquiries: Inquiry[] = [];
  private orders: B2BOrder[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedInquiries = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (savedInquiries) {
        const parsed = JSON.parse(savedInquiries);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(i => i && i.id && i.productName)) {
          this.inquiries = parsed;
        } else {
          this.inquiries = [...INITIAL_MOCK_INQUIRIES];
          this.saveInquiries();
        }
      } else {
        this.inquiries = [...INITIAL_MOCK_INQUIRIES];
        this.saveInquiries();
      }

      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(o => o && o.id && o.orderNumber && o.productName)) {
          this.orders = parsed;
        } else {
          this.orders = [...INITIAL_MOCK_ORDERS];
          this.saveOrders();
        }
      } else {
        this.orders = [...INITIAL_MOCK_ORDERS];
        this.saveOrders();
      }
    } catch {
      this.inquiries = [...INITIAL_MOCK_INQUIRIES];
      this.orders = [...INITIAL_MOCK_ORDERS];
    }
  }

  private saveInquiries() {
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(this.inquiries));
    } catch {
      // Storage unavailable
    }
    this.notify();
  }

  private saveOrders() {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
    } catch {
      // Storage unavailable
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getInquiries(): Inquiry[] {
    return [...this.inquiries];
  }

  public getInquiryById(id: string): Inquiry | undefined {
    if (!id) return undefined;
    const normalized = id.trim().toLowerCase();
    return this.inquiries.find(
      (inq) =>
        inq.id.toLowerCase() === normalized ||
        inq.id.toLowerCase().includes(normalized) ||
        (normalized === 'inq-1' && inq.id === 'INQ-2026-TOM-01') ||
        (normalized === 'inq-2' && (inq.id === 'INQ-2026-ONN-02' || inq.id === 'INQ-2026-GRP-02')) ||
        (normalized === 'inq-3' && (inq.id === 'INQ-2026-POT-03' || inq.id === 'INQ-2026-WHT-03')) ||
        (normalized === 'inq-4' && (inq.id === 'INQ-2026-CAR-04' || inq.id === 'INQ-2026-BEE-04'))
    );
  }

  public getOrders(): B2BOrder[] {
    return [...this.orders];
  }

  public getOrderById(id: string): B2BOrder | undefined {
    if (!id) return undefined;
    const normalized = id.trim().toLowerCase();
    return this.orders.find(
      (ord) =>
        ord.id.toLowerCase() === normalized ||
        ord.orderNumber.toLowerCase() === normalized ||
        ord.id.toLowerCase().includes(normalized) ||
        (normalized === 'ord-1' && ord.id === 'ORD-2026-TOM-01')
    );
  }

  public createInquiry(dto: CreateInquiryDTO): Inquiry {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = dto.productName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'AGR');
    const newId = `INQ-2026-${code}-${randomSuffix}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newInquiry: Inquiry = {
      id: newId,
      productId: dto.productId,
      productName: dto.productName,
      productImage: dto.productImage,
      category: dto.category,
      buyerId: dto.buyerId || 'buyer-demo-01',
      buyerName: dto.buyerName || 'Demo Commercial Buyer',
      buyerEntity: dto.buyerEntity || 'Farm2Market Bulk Procurement Hub',
      buyerLocation: dto.buyerLocation || dto.deliveryLocation,
      farmId: dto.farmId,
      farmerName: dto.farmerName,
      fpoName: dto.fpoName,
      farmerLocation: dto.farmerLocation,
      requestedQuantity: dto.requestedQuantity,
      unit: dto.unit || 'kg',
      qualityRequirement: dto.qualityRequirement || 'Grade A',
      deliveryLocation: dto.deliveryLocation,
      additionalRequirements: dto.additionalRequirements || 'Fresh standard harvest',
      status: 'Pending',
      createdAt: formattedDate,
      updatedAt: formattedDate,
      negotiationHistory: [],
    };

    this.inquiries = [newInquiry, ...this.inquiries];
    this.saveInquiries();
    return newInquiry;
  }

  public submitQuotation(inquiryId: string, quote: CreateQuotationDTO): Inquiry {
    const inquiry = this.getInquiryById(inquiryId);
    if (!inquiry) throw new Error(`Inquiry ${inquiryId} not found`);

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const offerId = `offer-${Date.now()}`;
    const totalAmount = quote.pricePerUnit * quote.availableQuantity;

    const newOffer: NegotiationOffer = {
      id: offerId,
      offeredBy: 'farmer',
      senderName: quote.senderName || inquiry.farmerName,
      senderEntity: quote.senderEntity || inquiry.fpoName,
      pricePerUnit: quote.pricePerUnit,
      quantity: quote.availableQuantity,
      unit: quote.unit || inquiry.unit,
      totalAmount,
      incoterm: quote.incoterm,
      qualityGrade: quote.qualityGrade,
      deliveryLocation: inquiry.deliveryLocation,
      termsAndNotes: quote.termsAndNotes,
      timestamp: formattedDate,
      status: 'active',
    };

    const updatedHistory = inquiry.negotiationHistory.map((h) => ({
      ...h,
      status: h.status === 'active' ? ('countered' as const) : h.status,
    }));

    inquiry.currentQuotation = newOffer;
    inquiry.negotiationHistory = [...updatedHistory, newOffer];
    inquiry.status = 'Quotation Received';
    inquiry.updatedAt = formattedDate;

    this.saveInquiries();
    return inquiry;
  }

  public submitCounterOffer(inquiryId: string, offerDTO: CounterOfferDTO): Inquiry {
    const inquiry = this.getInquiryById(inquiryId);
    if (!inquiry) throw new Error(`Inquiry ${inquiryId} not found`);

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const offerId = `offer-${Date.now()}`;
    const totalAmount = offerDTO.pricePerUnit * offerDTO.quantity;

    const newOffer: NegotiationOffer = {
      id: offerId,
      offeredBy: offerDTO.offeredBy,
      senderName: offerDTO.senderName,
      senderEntity: offerDTO.senderEntity,
      pricePerUnit: offerDTO.pricePerUnit,
      quantity: offerDTO.quantity,
      unit: offerDTO.unit || inquiry.unit,
      totalAmount,
      incoterm: offerDTO.incoterm,
      qualityGrade: offerDTO.qualityGrade,
      deliveryLocation: offerDTO.deliveryLocation,
      termsAndNotes: offerDTO.termsAndNotes,
      timestamp: formattedDate,
      status: 'active',
    };

    const updatedHistory = inquiry.negotiationHistory.map((h) => ({
      ...h,
      status: h.status === 'active' ? ('countered' as const) : h.status,
    }));

    inquiry.currentQuotation = newOffer;
    inquiry.negotiationHistory = [...updatedHistory, newOffer];
    inquiry.status = 'Negotiating';
    inquiry.updatedAt = formattedDate;

    this.saveInquiries();
    return inquiry;
  }

  public acceptOffer(
    inquiryId: string,
    acceptedByRole: 'buyer' | 'farmer',
    acceptedByName: string
  ): { inquiry: Inquiry; order: B2BOrder } {
    const inquiry = this.getInquiryById(inquiryId);
    if (!inquiry) throw new Error(`Inquiry ${inquiryId} not found`);
    if (!inquiry.currentQuotation) throw new Error(`No active quotation to accept`);

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Mark current offer as accepted
    inquiry.currentQuotation = {
      ...inquiry.currentQuotation,
      status: 'accepted',
    };

    inquiry.negotiationHistory = inquiry.negotiationHistory.map((h) =>
      h.id === inquiry.currentQuotation?.id ? { ...h, status: 'accepted' as const } : h
    );

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-2026-${inquiry.id.split('-')[2] || 'B2B'}-${randomSuffix}`;
    const orderNumber = `F2M-B2B-${randomSuffix}`;

    const newOrder: B2BOrder = {
      id: orderId,
      inquiryId: inquiry.id,
      orderNumber,
      orderDate: formattedDate,
      buyerId: inquiry.buyerId,
      buyerName: inquiry.buyerName,
      buyerEntity: inquiry.buyerEntity,
      deliveryLocation: inquiry.deliveryLocation,
      farmId: inquiry.farmId,
      farmerName: inquiry.farmerName,
      fpoName: inquiry.fpoName,
      productId: inquiry.productId,
      productName: inquiry.productName,
      productImage: inquiry.productImage,
      category: inquiry.category,
      finalQuantity: inquiry.currentQuotation.quantity,
      unit: inquiry.currentQuotation.unit,
      finalPricePerUnit: inquiry.currentQuotation.pricePerUnit,
      totalAmount: inquiry.currentQuotation.totalAmount,
      finalQualityGrade: inquiry.currentQuotation.qualityGrade,
      finalIncoterm: inquiry.currentQuotation.incoterm,
      agreedTerms:
        inquiry.currentQuotation.termsAndNotes ||
        `Agreed terms accepted by ${acceptedByName} (${acceptedByRole}). Verified cold-chain delivery. Funds held safely in Escrow.`,
      status: 'Confirmed',
      isLocked: true,
    };

    inquiry.status = 'Order Confirmed';
    inquiry.confirmedOrderId = orderId;
    inquiry.updatedAt = formattedDate;

    this.orders = [newOrder, ...this.orders];
    this.saveOrders();
    this.saveInquiries();

    return { inquiry, order: newOrder };
  }

  public rejectInquiry(
    inquiryId: string,
    reason: string,
    rejectedByRole: 'buyer' | 'farmer'
  ): Inquiry {
    const inquiry = this.getInquiryById(inquiryId);
    if (!inquiry) throw new Error(`Inquiry ${inquiryId} not found`);

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (inquiry.currentQuotation) {
      inquiry.currentQuotation = {
        ...inquiry.currentQuotation,
        status: 'rejected',
      };
    }

    inquiry.negotiationHistory = inquiry.negotiationHistory.map((h) =>
      h.status === 'active' ? { ...h, status: 'rejected' as const } : h
    );

    inquiry.status = 'Rejected';
    inquiry.updatedAt = formattedDate;

    this.saveInquiries();
    return inquiry;
  }


  public updateOrderStatus(orderId: string, status: OrderStatus, shipmentId?: string): B2BOrder | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.status = status;
    if (shipmentId) {
      order.shipmentId = shipmentId;
    }
    this.saveOrders();
    return order;
  }

  public resetToMockData(): void {
    this.inquiries = [...INITIAL_MOCK_INQUIRIES];
    this.orders = [...INITIAL_MOCK_ORDERS];
    this.saveInquiries();
    this.saveOrders();
  }
}

export const tradeFlowService = new TradeFlowService();
