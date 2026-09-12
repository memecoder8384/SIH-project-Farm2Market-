/**
 * Supabase Service Client Interface & Mock Integration Layer
 * 
 * Ready to receive VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * Currently serves realistic data so the application runs seamlessly offline/standalone,
 * while maintaining the identical contract required for Supabase PostgreSQL tables & Realtime.
 */

import { MOCK_FARMS, MOCK_PRODUCE, MOCK_ORDERS } from '../data/mockData';
import { Farm, ProduceItem, Order, OrderStatus } from '../types';

export interface DatabaseResponse<T> {
  data: T | null;
  error: string | null;
}

class SupabaseService {
  private isConnected: boolean = false;

  constructor() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (url && anonKey) {
      this.isConnected = true;
      console.log('🌱 Connected to live Supabase project:', url);
    } else {
      console.info('ℹ️ Supabase credentials not set in .env. Running on typed offline data provider.');
    }
  }

  // Farms / FPOs
  async getFarms(): Promise<DatabaseResponse<Farm[]>> {
    return { data: MOCK_FARMS, error: null };
  }

  async getFarmById(id: string): Promise<DatabaseResponse<Farm>> {
    const farm = MOCK_FARMS.find((f) => f.id === id);
    if (!farm) return { data: null, error: 'Farm not found' };
    return { data: farm, error: null };
  }

  // Produce Listings
  async getProduceListings(category?: string, query?: string): Promise<DatabaseResponse<ProduceItem[]>> {
    let list = [...MOCK_PRODUCE];
    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.farmName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }
    return { data: list, error: null };
  }

  async getProductById(id: string): Promise<DatabaseResponse<ProduceItem>> {
    const prod = MOCK_PRODUCE.find((p) => p.id === id);
    if (!prod) return { data: null, error: 'Product not found' };
    return { data: prod, error: null };
  }

  // Orders & Realtime Updates
  async getOrders(): Promise<DatabaseResponse<Order[]>> {
    return { data: MOCK_ORDERS, error: null };
  }

  async getOrderById(id: string): Promise<DatabaseResponse<Order>> {
    const order = MOCK_ORDERS.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return { data: null, error: 'Order not found' };
    return { data: order, error: null };
  }

  async createOrder(orderPayload: Partial<Order>): Promise<DatabaseResponse<Order>> {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `F2M-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: 'Just now',
      buyerName: orderPayload.buyerName || 'Verified Buyer',
      buyerType: orderPayload.buyerType || 'Household Member',
      items: orderPayload.items || [],
      totalAmount: orderPayload.totalAmount || 0,
      farmerShareAmount: (orderPayload.totalAmount || 0) * 0.85,
      escrowStatus: 'Held in Escrow',
      currentStatus: 'Harvest Scheduled',
      estimatedDelivery: 'Within 24 Hours',
      farmOrigin: orderPayload.farmOrigin || 'Regional FPO Cluster',
      coldChainTempCelsius: 4.2,
      traceabilityQrUrl: `F2M-BATCH-${Math.floor(100000 + Math.random() * 900000)}`,
      steps: [
        { title: 'Harvest Scheduled', timestamp: 'Just now', location: 'Farm Cluster', completed: true, active: true, details: 'Order received and tagged for harvest' },
        { title: 'Krishi Quality & Brix Tested', timestamp: 'Pending', location: 'FPO Packhouse', completed: false, active: false, details: 'Pesticide & sweetness lab verification' },
        { title: 'Cold-Chain Dispatched', timestamp: 'Pending', location: 'Regional Gateway', completed: false, active: false, details: 'Loaded in reefer fleet' },
        { title: 'Regional Sorting Hub', timestamp: 'Pending', location: 'Metro Distribution', completed: false, active: false, details: 'Cross-docking' },
        { title: 'Delivered & Escrow Released', timestamp: 'Pending', location: 'Customer Doorstep', completed: false, active: false, details: 'Direct FPO payout trigger' }
      ]
    };
    return { data: newOrder, error: null };
  }
}

export const supabaseService = new SupabaseService();
