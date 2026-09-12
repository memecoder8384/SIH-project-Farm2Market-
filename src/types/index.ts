export type UserRole = 'visitor' | 'farmer' | 'buyer' | 'logistics';

export interface Farm {
  id: string;
  name: string;
  fpoName?: string;
  farmerName: string;
  region: string;
  state: string;
  rating: number;
  reviewsCount: number;
  certifications: string[];
  yieldReturn: string;
  allotmentQuotaPercent: number;
  specialty: string;
  soilType: string;
  distanceKm: number;
  bgSvgType: 'orchard' | 'grain' | 'pasture' | 'roots' | 'hydro' | 'apiary';
  isOrganicCertified: boolean;
  avatarUrl?: string;
  imageUrl?: string;
}

export interface ProduceItem {
  id: string;
  name: string;
  variety: string;
  category: 'Daily Essentials' | 'Leafy Greens' | 'Root Vegetables' | 'Gourds & Peppers' | 'Fresh Seasonal' | string;
  farmId: string;
  farmName: string;
  location: string;
  retailPrice: number; // in ₹ or $ per unit
  retailUnit: string;  // e.g. "kg", "crate (12kg)", "25kg sack"
  bulkPrice: number;   // discount tier for 100kg+
  bulkMinUnit: number;
  stockAvailableKg: number;
  allotmentReservedPercent: number;
  brixSweetnessIndex?: string;
  soilMoistureLevel?: string;
  harvestDate: string;
  dispatchDate: string;
  originBadge: string;
  description: string;
  nutritionalNotes: string[];
  certifications: string[];
  mandiMspPrice?: number; // Minimum Support Price benchmark
  rating: number;
  imageTheme: 'orchard' | 'grain' | 'pasture' | 'roots' | 'hydro' | 'apiary';
  imageUrl?: string;
}

export type OrderStatus = 
  | 'Harvest Scheduled'
  | 'Quality Inspected'
  | 'Cold Chain Dispatched'
  | 'On the Way (Cool Van)'
  | 'In Transit'
  | 'On the Way'
  | 'Regional Hub Arrived'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderTimelineStep {
  title: string;
  timestamp: string;
  location: string;
  completed: boolean;
  active: boolean;
  details: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  buyerName: string;
  buyerType: 'Household Member' | 'Commercial Bulk Buyer' | 'Restaurant & Bulk Buyer';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    unit: string;
  }[];
  totalAmount: number;
  farmerShareAmount: number;
  escrowStatus: 'Held in Escrow' | 'Released to FPO' | 'Pending Verification' | 'Payment Held Safely';
  currentStatus: OrderStatus;
  estimatedDelivery: string;
  farmOrigin: string;
  coldChainTempCelsius: number;
  traceabilityQrUrl: string;
  steps: OrderTimelineStep[];
}

export interface LogisticsVehicle {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  currentTempCelsius: number;
  targetTempCelsius: number;
  humidityPercent: number;
  status: 'In Transit' | 'Loading at Hub' | 'Idle' | 'Delivering';
  capacityLoadPercent: number;
  assignedOrders: string[];
  nextWaypoint: string;
  eta: string;
  fuelEfficiencyKmPl: number;
}

export interface DemandForecastItem {
  id: string;
  cropName: string;
  category: string;
  historicalDemandMonthlyTons: number;
  forecastDemandMonthlyTons: number;
  predictedPriceTrendPercent: number; // e.g. +14% or -5%
  confidenceScore: number; // e.g. 92%
  shortageRisk: 'High Shortage Risk' | 'Balanced Supply' | 'Surplus Expected';
  recommendedAction: string;
  peakDemandPeriod: string;
}

export interface PriceRecommendation {
  cropId: string;
  cropName: string;
  currentMandiMsp: number; // ₹ per kg
  localWholesalePrice: number;
  aiOptimalRetailPrice: number;
  aiOptimalBulkPrice: number;
  projectedGrossMarginPercent: number;
  farmerProfitIncreasePercent: number;
  pricingFactors: {
    seasonality: string;
    transportCostImpact: string;
    qualityGradePremium: string;
    competitorWholesaleRate: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  emailOrPhone: string;
  entityName?: string;
  location?: string;
  avatar?: string;
}

export * from './tradeFlow';
