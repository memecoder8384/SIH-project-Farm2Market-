export type Incoterm = 'EXW' | 'FOB' | 'CIF' | 'DAP';

export type InquiryStatus =
  | 'Pending'
  | 'Quotation Received'
  | 'Negotiating'
  | 'Accepted'
  | 'Rejected'
  | 'Order Confirmed';

export interface NegotiationOffer {
  id: string;
  offeredBy: 'buyer' | 'farmer';
  senderName: string;
  senderEntity: string;
  pricePerUnit: number;
  quantity: number;
  unit: string;
  totalAmount: number;
  incoterm: Incoterm;
  qualityGrade: string;
  deliveryLocation: string;
  termsAndNotes?: string;
  timestamp: string;
  status: 'active' | 'countered' | 'accepted' | 'rejected';
}

export interface Inquiry {
  id: string; // e.g. INQ-2026-TOM-01
  productId: string;
  productName: string;
  productImage?: string;
  category: string;
  buyerId: string;
  buyerName: string;
  buyerEntity: string;
  buyerLocation: string;
  farmId: string;
  farmerName: string;
  fpoName: string;
  farmerLocation: string;
  requestedQuantity: number;
  unit: string; // "kg", "quintal", "crates", etc.
  qualityRequirement: string; // "Grade A", "Grade B", "Export Grade"
  deliveryLocation: string;
  additionalRequirements: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  currentQuotation?: NegotiationOffer;
  negotiationHistory: NegotiationOffer[];
  confirmedOrderId?: string;
}

export type OrderStatus =
  | 'Confirmed'
  | 'Dispatch Ready'
  | 'In Transit'
  | 'Delivered'
  | 'Completed';

export type LogisticsStatus =
  | 'Unassigned'
  | 'Assigned'
  | 'Pickup Scheduled'
  | 'Picked Up'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered';

export type ReceiptStatus = 'Pending' | 'Confirmed' | 'Disputed';

export interface B2BOrder {
  id: string; // e.g. ORD-2026-TOM-01
  inquiryId: string;
  orderNumber: string;
  orderDate: string;
  buyerId: string;
  buyerName: string;
  buyerEntity: string;
  deliveryLocation: string;
  farmId: string;
  farmerName: string;
  fpoName: string;
  farmerLocation?: string;
  productId: string;
  productName: string;
  productImage?: string;
  category: string;
  finalQuantity: number;
  unit: string;
  finalPricePerUnit: number;
  totalAmount: number;
  finalQualityGrade: string;
  finalIncoterm: Incoterm;
  agreedTerms: string;
  status: OrderStatus;
  isLocked: boolean; // Always true for confirmed orders
  shipmentId?: string;
}

export interface CreateInquiryDTO {
  productId: string;
  productName: string;
  productImage?: string;
  category: string;
  farmId: string;
  farmerName: string;
  fpoName: string;
  farmerLocation: string;
  buyerId?: string;
  buyerName?: string;
  buyerEntity?: string;
  buyerLocation?: string;
  requestedQuantity: number;
  unit: string;
  qualityRequirement: string;
  deliveryLocation: string;
  additionalRequirements: string;
}

export interface CreateQuotationDTO {
  pricePerUnit: number;
  availableQuantity: number;
  unit: string;
  qualityGrade: string;
  incoterm: Incoterm;
  termsAndNotes?: string;
  senderName?: string;
  senderEntity?: string;
}

export interface CounterOfferDTO {
  offeredBy: 'buyer' | 'farmer';
  senderName: string;
  senderEntity: string;
  pricePerUnit: number;
  quantity: number;
  unit: string;
  incoterm: Incoterm;
  qualityGrade: string;
  deliveryLocation: string;
  termsAndNotes?: string;
}

// ----------------------------------------------------
// FLOW 2: DISPATCH, LOGISTICS, TRACKING & CLOSURE TYPES
// ----------------------------------------------------

export interface DispatchDetails {
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  dispatchDate: string;
  quantityLoaded: number;
  unit: string;
  invoiceNumber: string;
  invoiceFileName?: string;
  invoiceFileUrl?: string;
  pickupLocation: string;
  deliveryLocation: string;
  notes?: string;
  createdAt: string;
}

export interface LogisticsPartner {
  id: string;
  name: string;
  vehicleType: string;
  capacityKg: number;
  estimatedCost: number;
  rating: number;
  reviewsCount?: number;
  estimatedDeliveryTime: string;
  availability: string;
  contactPhone: string;
  isColdChainReefer: boolean;
  hubLocation: string;
}

export interface TrackingPoint {
  lat: number;
  lng: number;
  label: string;
  timestamp?: string;
  completed?: boolean;
}

export interface TrackingData {
  currentLat: number;
  currentLng: number;
  currentLocationName: string;
  distanceRemainingKm: number;
  estimatedArrivalFormatted: string;
  speedKmH: number;
  coldChainTempCelsius: number;
  routeCoordinates: TrackingPoint[];
  progressPercent: number; // 0 to 100
  isSimulating: boolean;
  lastUpdated: string;
}

export interface RouteOptimization {
  originalDistanceKm: number;
  originalEta: string;
  originalCost: number;
  optimizedDistanceKm: number;
  optimizedEta: string;
  optimizedCost: number;
  distanceSavedKm: number;
  timeSavedMin: number;
  costSavedInr: number;
  rationale: string;
  isOptimizedRouteApplied: boolean;
}

export interface DeliveryDetails {
  deliveredAt?: string;
  deliveredQuantity?: number;
  deliveryLocation?: string;
  receivedBy?: string;
  logisticsPartnerName?: string;
}

export interface ReceiptConfirmation {
  status: ReceiptStatus;
  confirmedAt?: string;
  confirmedBy?: string;
  remarks?: string;
  issueReported?: string;
  qualityVerified?: boolean;
}

export type TimelineStepKey =
  | 'Order Confirmed'
  | 'Dispatch Ready'
  | 'Logistics Assigned'
  | 'Picked Up'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Receipt Confirmed'
  | 'Order Completed';

export interface ShipmentTimelineStep {
  step: TimelineStepKey;
  title: string;
  timestamp: string;
  location?: string;
  completed: boolean;
  active: boolean;
  details?: string;
}

export interface Shipment {
  id: string; // e.g. SHP-2026-TOM-01
  orderId: string;
  trackingNumber: string;
  order: B2BOrder;
  dispatchDetails?: DispatchDetails;
  logisticsPartner?: LogisticsPartner;
  logisticsStatus: LogisticsStatus;
  trackingData: TrackingData;
  aiOptimization: RouteOptimization;
  deliveryDetails?: DeliveryDetails;
  receiptConfirmation: ReceiptConfirmation;
  timeline: ShipmentTimelineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDispatchDTO {
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  dispatchDate: string;
  quantityLoaded: number;
  invoiceNumber: string;
  invoiceFileName?: string;
  pickupLocation: string;
  deliveryLocation: string;
  notes?: string;
}
