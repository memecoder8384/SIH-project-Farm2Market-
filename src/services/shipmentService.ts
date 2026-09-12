import {
  Shipment,
  LogisticsPartner,
  CreateDispatchDTO,
  ShipmentTimelineStep,
  B2BOrder,
} from '../types/tradeFlow';
import { INITIAL_MOCK_SHIPMENTS, MOCK_LOGISTICS_PARTNERS } from '../data/shipmentMockData';
import { tradeFlowService } from './tradeFlowService';
import { mapsService } from './maps/mapsService';

const SHIPMENTS_STORAGE_KEY = 'farm2market_shipments_v2';

class ShipmentService {
  private shipments: Shipment[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(SHIPMENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Validate that each parsed shipment has essential properties (id, order, trackingData)
          const isValid = parsed.every(
            (s) =>
              s &&
              typeof s.id === 'string' &&
              s.order &&
              typeof s.order.productName === 'string' &&
              s.trackingData &&
              s.aiOptimization
          );
          if (isValid) {
            this.shipments = parsed;
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load shipments from localStorage, falling back to mock data', e);
    }
    this.shipments = [...INITIAL_MOCK_SHIPMENTS];
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(this.shipments));
    } catch (e) {
      console.warn('Failed to save shipments to localStorage', e);
    }
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => fn());
  }

  public getShipments(): Shipment[] {
    return [...this.shipments];
  }

  public getLogisticsPartners(): LogisticsPartner[] {
    return [...MOCK_LOGISTICS_PARTNERS];
  }

  public getShipmentById(id: string): Shipment | undefined {
    return this.shipments.find(
      (s) => s.id === id || s.orderId === id || s.trackingNumber === id
    );
  }

  public getShipmentByOrderId(orderId: string): Shipment | undefined {
    return this.shipments.find(
      (s) => s.orderId === orderId || s.id === orderId
    );
  }

  /**
   * Helper to format current readable timestamp
   */
  private getFormattedTimestamp(): string {
    const now = new Date();
    return `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  /**
   * Stage 2: Create Dispatch Details for a Confirmed Order
   */
  public createDispatch(orderId: string, dto: CreateDispatchDTO): Shipment {
    const order = tradeFlowService.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (dto.quantityLoaded > order.finalQuantity) {
      throw new Error(
        `Quantity loaded (${dto.quantityLoaded} ${order.unit}) cannot exceed confirmed order quantity (${order.finalQuantity} ${order.unit})`
      );
    }

    const timestamp = this.getFormattedTimestamp();
    const existing = this.getShipmentByOrderId(orderId);
    const shipmentId = existing ? existing.id : `SHP-2026-${order.productId.replace('prod-', 'CROP')}-${Math.floor(100 + Math.random() * 900)}`;
    const trackingNumber = existing ? existing.trackingNumber : `F2M-TRK-${order.orderNumber.replace('F2M-', '')}-${Math.floor(10 + Math.random() * 90)}`;

    const dispatchDetails = {
      vehicleNumber: dto.vehicleNumber,
      vehicleType: dto.vehicleType,
      driverName: dto.driverName,
      driverPhone: dto.driverPhone,
      dispatchDate: dto.dispatchDate,
      quantityLoaded: dto.quantityLoaded,
      unit: order.unit,
      invoiceNumber: dto.invoiceNumber,
      invoiceFileName: dto.invoiceFileName || `Invoice_${dto.invoiceNumber}.pdf`,
      pickupLocation: dto.pickupLocation,
      deliveryLocation: dto.deliveryLocation,
      notes: dto.notes,
      createdAt: new Date().toISOString(),
    };

    // Update order status to Dispatch Ready
    tradeFlowService.updateOrderStatus(orderId, 'Dispatch Ready', shipmentId);
    order.status = 'Dispatch Ready';
    order.shipmentId = shipmentId;

    const baseTimeline: ShipmentTimelineStep[] = [
      { step: 'Order Confirmed', title: 'Order Confirmed & Locked', timestamp: order.orderDate, location: 'Farm2Market Contract System', completed: true, active: false, details: 'Mutual price and quality grade locked' },
      { step: 'Dispatch Ready', title: 'Dispatch Details Recorded', timestamp, location: dto.pickupLocation, completed: true, active: false, details: `Invoice ${dto.invoiceNumber} generated, ${dto.quantityLoaded} ${order.unit} loaded` },
      { step: 'Logistics Assigned', title: 'Assign Logistics Partner', timestamp: 'Pending', location: 'Fleet Hub', completed: false, active: true, details: 'Select verified cold-chain logistics partner' },
      { step: 'Picked Up', title: 'Pickup Produce from Farm', timestamp: 'Pending', location: dto.pickupLocation, completed: false, active: false },
      { step: 'In Transit', title: 'In Transit to Destination', timestamp: 'Pending', location: 'Highway Corridor', completed: false, active: false },
      { step: 'Out for Delivery', title: 'Out for Local Dock Delivery', timestamp: 'Pending', location: dto.deliveryLocation, completed: false, active: false },
      { step: 'Delivered', title: 'Delivered to Buyer Premises', timestamp: 'Pending', location: dto.deliveryLocation, completed: false, active: false },
      { step: 'Receipt Confirmed', title: 'Buyer Confirms Goods Receipt', timestamp: 'Pending', location: order.buyerName, completed: false, active: false },
      { step: 'Order Completed', title: 'Order Completed & Escrow Released', timestamp: 'Pending', location: 'Escrow Vault', completed: false, active: false },
    ];

    const updatedShipment: Shipment = {
      id: shipmentId,
      orderId,
      trackingNumber,
      order,
      dispatchDetails,
      logisticsPartner: existing?.logisticsPartner,
      logisticsStatus: existing?.logisticsStatus || 'Unassigned',
      trackingData: existing?.trackingData || {
        currentLat: 19.9975,
        currentLng: 73.7898,
        currentLocationName: `${dto.pickupLocation} (Dispatch Bay)`,
        distanceRemainingKm: 385,
        estimatedArrivalFormatted: 'Estimated 7h 35m',
        speedKmH: 0,
        coldChainTempCelsius: 4.2,
        progressPercent: 0,
        isSimulating: false,
        lastUpdated: 'Just now',
        routeCoordinates: [
          { lat: 19.9975, lng: 73.7898, label: dto.pickupLocation, timestamp, completed: true },
          { lat: 19.6521, lng: 73.5102, label: 'Midway Highway Agro Checkpoint', completed: false },
          { lat: 19.076, lng: 72.8777, label: dto.deliveryLocation, completed: false },
        ],
      },
      aiOptimization: existing?.aiOptimization || {
        originalDistanceKm: 420,
        originalEta: '8h 20m',
        originalCost: 9200,
        optimizedDistanceKm: 385,
        optimizedEta: '7h 35m',
        optimizedCost: 8450,
        costSavedInr: 750,
        distanceSavedKm: 35,
        timeSavedMin: 45,
        rationale: 'Route optimized based on distance, estimated traffic, delivery priority and logistics cost.',
        isOptimizedRouteApplied: true,
      },
      deliveryDetails: existing?.deliveryDetails,
      receiptConfirmation: existing?.receiptConfirmation || {
        status: 'Pending',
        qualityVerified: false,
      },
      timeline: existing ? existing.timeline : baseTimeline,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existing) {
      this.shipments = this.shipments.map((s) => (s.id === shipmentId ? updatedShipment : s));
    } else {
      this.shipments = [updatedShipment, ...this.shipments];
    }

    this.saveToStorage();
    return updatedShipment;
  }

  /**
   * Stage 3: Assign Logistics Partner
   */
  public assignLogisticsPartner(shipmentId: string, partnerId: string): Shipment {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) throw new Error(`Shipment ${shipmentId} not found`);

    const partner = MOCK_LOGISTICS_PARTNERS.find((p) => p.id === partnerId);
    if (!partner) throw new Error(`Logistics partner ${partnerId} not found`);

    const timestamp = this.getFormattedTimestamp();
    shipment.logisticsPartner = partner;
    shipment.logisticsStatus = 'Assigned';
    shipment.updatedAt = new Date().toISOString();

    // Update timeline
    shipment.timeline = shipment.timeline.map((step) => {
      if (step.step === 'Logistics Assigned') {
        return {
          ...step,
          completed: true,
          active: false,
          timestamp,
          details: `${partner.name} (${partner.vehicleType}) assigned. Estimated rate: ₹${(partner?.estimatedCost ?? 0).toLocaleString('en-IN')}`,
        };
      }
      if (step.step === 'Picked Up') {
        return {
          ...step,
          active: true,
          details: 'Ready for loading & driver departure',
        };
      }
      return step;
    });

    this.saveToStorage();
    return shipment;
  }

  /**
   * Stage 4A: Schedule / Start Pickup
   */
  public schedulePickup(shipmentId: string): Shipment {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) throw new Error(`Shipment ${shipmentId} not found`);

    const timestamp = this.getFormattedTimestamp();
    shipment.logisticsStatus = 'Pickup Scheduled';
    shipment.updatedAt = new Date().toISOString();

    shipment.timeline = shipment.timeline.map((step) => {
      if (step.step === 'Picked Up') {
        return {
          ...step,
          timestamp,
          details: `Vehicle ${shipment.dispatchDetails?.vehicleNumber || 'en route'} scheduled for packhouse pickup`,
          active: true,
        };
      }
      return step;
    });

    this.saveToStorage();
    return shipment;
  }

  /**
   * Stage 4B: Confirm Pickup
   */
  public confirmPickup(shipmentId: string): Shipment {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) throw new Error(`Shipment ${shipmentId} not found`);

    const timestamp = this.getFormattedTimestamp();
    shipment.logisticsStatus = 'Picked Up';
    shipment.updatedAt = new Date().toISOString();

    shipment.timeline = shipment.timeline.map((step) => {
      if (step.step === 'Picked Up') {
        return {
          ...step,
          completed: true,
          active: false,
          timestamp,
          details: `All ${shipment.dispatchDetails?.quantityLoaded || shipment.order.finalQuantity} ${shipment.order.unit} verified & loaded into reefer compartment`,
        };
      }
      if (step.step === 'In Transit') {
        return {
          ...step,
          active: true,
          details: 'Ready to depart on designated corridor',
        };
      }
      return step;
    });

    this.saveToStorage();
    return shipment;
  }

  /**
   * Stage 4C: Start Transit
   */
  public startTransit(shipmentId: string): Shipment {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) throw new Error(`Shipment ${shipmentId} not found`);

    const timestamp = this.getFormattedTimestamp();
    shipment.logisticsStatus = 'In Transit';
    shipment.order.status = 'In Transit';
    tradeFlowService.updateOrderStatus(shipment.orderId, 'In Transit', shipmentId);

    shipment.trackingData.isSimulating = true;
    shipment.trackingData.speedKmH = 54;
    shipment.trackingData.lastUpdated = 'Active (Live GPS telemetry)';
    shipment.updatedAt = new Date().toISOString();

    shipment.timeline = shipment.timeline.map((step) => {
      if (step.step === 'Picked Up') {
        return { ...step, completed: true, active: false };
      }
      if (step.step === 'In Transit') {
        return {
          ...step,
          completed: false,
          active: true,
          timestamp,
          details: `Departed origin; running on AI-optimized cold corridor at 54 km/h`,
        };
      }
      return step;
    });

    this.saveToStorage();
    return shipment;
  }

  /**
   * Live Simulation Progress Update (0 to 100%)
   */
  public updateSimulationProgress(shipmentId: string, progressPercent: number): Shipment {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) throw new Error(`Shipment ${shipmentId} not found`);

    const clamped = Math.max(0, Math.min(100, progressPercent));
    shipment.trackingData.progressPercent = clamped;

    const totalKm = shipment.aiOptimization.isOptimizedRouteApplied
      ? shipment.aiOptimization.optimizedDistanceKm
      : shipment.aiOptimization.originalDistanceKm;

    shipment.trackingData.distanceRemainingKm = Math.max(0, Math.round(totalKm * (1 - clamped / 100)));
    const etaObj = mapsService.calculateEta(shipment.trackingData.distanceRemainingKm, shipment.trackingData.speedKmH || 50);
    shipment.trackingData.estimatedArrivalFormatted = etaObj.formatted;

    if (clamped >= 85 && clamped < 100) {
      shipment.logisticsStatus = 'Out for Delivery';
      shipment.timeline = shipment.timeline.map((step) => {
        if (step.step === 'In Transit') return { ...step, completed: true, active: false };
        if (step.step === 'Out for Delivery') return { ...step, active: true, completed: false };
        return step;
      });
    } else if (clamped >= 100) {
      shipment.logisticsStatus = 'Delivered';
      shipment.order.status = 'Delivered';
      tradeFlowService.updateOrderStatus(shipment.orderId, 'Delivered', shipmentId);
      shipment.trackingData.speedKmH = 0;
      shipment.trackingData.isSimulating = false;

      shipment.deliveryDetails = {
        deliveredAt: this.getFormattedTimestamp(),
        deliveredQuantity: shipment.dispatchDetails?.quantityLoaded || shipment.order.finalQuantity,
        deliveryLocation: shipment.dispatchDetails?.deliveryLocation || shipment.order.deliveryLocation,
        logisticsPartnerName: shipment.logisticsPartner?.name || 'SwiftAgri Logistics',
      };

      shipment.timeline = shipment.timeline.map((step) => {
        if (step.step === 'In Transit' || step.step === 'Out for Delivery') {
          return { ...step, completed: true, active: false };
        }
        if (step.step === 'Delivered') {
          return {
            ...step,
            completed: true,
            active: false,
            timestamp: this.getFormattedTimestamp(),
            details: `Delivered at receiving dock; cold chain integrity preserved at ${shipment.trackingData.coldChainTempCelsius}°C`,
          };
        }
        if (step.step === 'Receipt Confirmed') {
          return { ...step, active: true, completed: false, details: 'Awaiting buyer confirmation of quality & count' };
        }
        return step;
      });
    }

    this.saveToStorage();
    return shipment;
  }

  /**
   * Stage 7: Toggle AI Route Optimization
   */
  public toggleOptimizedRoute(shipmentId: string): Shipment {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) throw new Error(`Shipment ${shipmentId} not found`);

    shipment.aiOptimization.isOptimizedRouteApplied = !shipment.aiOptimization.isOptimizedRouteApplied;
    const isApplied = shipment.aiOptimization.isOptimizedRouteApplied;

    const totalKm = isApplied
      ? shipment.aiOptimization.optimizedDistanceKm
      : shipment.aiOptimization.originalDistanceKm;

    const progress = shipment.trackingData.progressPercent / 100;
    shipment.trackingData.distanceRemainingKm = Math.max(0, Math.round(totalKm * (1 - progress)));
    shipment.updatedAt = new Date().toISOString();

    this.saveToStorage();
    return shipment;
  }

  /**
   * Stage 9: Logistics Marks as Delivered
   */
  public markDelivered(shipmentId: string): Shipment {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) throw new Error(`Shipment ${shipmentId} not found`);

    const timestamp = this.getFormattedTimestamp();
    shipment.logisticsStatus = 'Delivered';
    shipment.order.status = 'Delivered';
    tradeFlowService.updateOrderStatus(shipment.orderId, 'Delivered', shipmentId);

    shipment.trackingData.progressPercent = 100;
    shipment.trackingData.distanceRemainingKm = 0;
    shipment.trackingData.speedKmH = 0;
    shipment.trackingData.isSimulating = false;
    shipment.trackingData.estimatedArrivalFormatted = 'Delivered';

    shipment.deliveryDetails = {
      deliveredAt: timestamp,
      deliveredQuantity: shipment.dispatchDetails?.quantityLoaded || shipment.order.finalQuantity,
      deliveryLocation: shipment.dispatchDetails?.deliveryLocation || shipment.order.deliveryLocation,
      logisticsPartnerName: shipment.logisticsPartner?.name || 'SwiftAgri Logistics',
    };

    shipment.timeline = shipment.timeline.map((step) => {
      if (['Order Confirmed', 'Dispatch Ready', 'Logistics Assigned', 'Picked Up', 'In Transit', 'Out for Delivery'].includes(step.step)) {
        return { ...step, completed: true, active: false };
      }
      if (step.step === 'Delivered') {
        return {
          ...step,
          completed: true,
          active: false,
          timestamp,
          details: `Unloaded safely at receiving dock. Temperature: ${shipment.trackingData.coldChainTempCelsius}°C`,
        };
      }
      if (step.step === 'Receipt Confirmed') {
        return {
          ...step,
          completed: false,
          active: true,
          details: 'Buyer inspection & digital sign-off pending',
        };
      }
      return step;
    });

    this.saveToStorage();
    return shipment;
  }

  /**
   * Stage 10 & 11: Buyer Confirms Receipt & Order Closure
   */
  public confirmReceipt(shipmentId: string, confirmedBy: string, remarks?: string): Shipment {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) throw new Error(`Shipment ${shipmentId} not found`);

    const timestamp = this.getFormattedTimestamp();
    shipment.receiptConfirmation = {
      status: 'Confirmed',
      confirmedAt: timestamp,
      confirmedBy,
      remarks: remarks || 'Produce inspected: weight, temperature, and visual freshness approved.',
      qualityVerified: true,
    };

    // Close order
    shipment.order.status = 'Completed';
    tradeFlowService.updateOrderStatus(shipment.orderId, 'Completed', shipmentId);
    shipment.updatedAt = new Date().toISOString();

    shipment.timeline = shipment.timeline.map((step) => {
      if (step.step === 'Receipt Confirmed') {
        return {
          ...step,
          completed: true,
          active: false,
          timestamp,
          details: `Confirmed by ${confirmedBy}. Produce weight and Brix quality verified.`,
        };
      }
      if (step.step === 'Order Completed') {
        return {
          ...step,
          completed: true,
          active: false,
          timestamp,
          details: `Smart escrow payment released to farmer (${shipment.order.farmerName}). Trade agreement successfully fulfilled.`,
        };
      }
      return { ...step, completed: true, active: false };
    });

    this.saveToStorage();
    return shipment;
  }

  /**
   * Buyer reports an issue with shipment
   */
  public reportReceiptIssue(shipmentId: string, issueDetails: string): Shipment {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) throw new Error(`Shipment ${shipmentId} not found`);

    const timestamp = this.getFormattedTimestamp();
    shipment.receiptConfirmation = {
      status: 'Disputed',
      issueReported: issueDetails,
      qualityVerified: false,
    };

    shipment.timeline = shipment.timeline.map((step) => {
      if (step.step === 'Receipt Confirmed') {
        return {
          ...step,
          completed: false,
          active: true,
          timestamp,
          details: `Issue flagged: "${issueDetails}". Farm2Market escrow mediator notified.`,
        };
      }
      return step;
    });

    this.saveToStorage();
    return shipment;
  }

  public resetToMockData(): void {
    this.shipments = [...INITIAL_MOCK_SHIPMENTS];
    this.saveToStorage();
  }
}

export const shipmentService = new ShipmentService();
