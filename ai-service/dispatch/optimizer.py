from supabase_client import supabase
from .scoring import calculate_vehicle_score
from route_service import get_route


def get_available_vehicles():
    """Get all currently available vehicles from Supabase."""

    response = (
        supabase
        .table("vehicles")
        .select("*")
        .eq("status", "AVAILABLE")
        .execute()
    )

    return response.data


def select_best_vehicle(
    order_weight_kg: float,
    pickup_lat: float,
    pickup_lng: float,
    delivery_lat: float,
    delivery_lng: float,
    priority: int = 1
):
    """
    Compare all available vehicles.

    Route:
    Vehicle Location → Pickup → Delivery

    Returns candidates sorted from best to worst.
    """

    vehicles = get_available_vehicles()

    if not vehicles:
        return None

    candidates = []

    for vehicle in vehicles:

        vehicle_id = vehicle["id"]
        capacity = float(vehicle["capacity_kg"])

        # Skip vehicles that cannot carry the order
        if capacity < order_weight_kg:
            continue

        vehicle_lat = vehicle.get("current_lat")
        vehicle_lng = vehicle.get("current_lng")

        # Skip vehicles without a current location
        if vehicle_lat is None or vehicle_lng is None:
            continue

        # Vehicle → Pickup
        to_pickup = get_route(
            vehicle_lat,
            vehicle_lng,
            pickup_lat,
            pickup_lng
        )

        # Pickup → Delivery
        to_delivery = get_route(
            pickup_lat,
            pickup_lng,
            delivery_lat,
            delivery_lng
        )

        # Total route distance
        distance = (
            to_pickup["distance_km"]
            + to_delivery["distance_km"]
        )

        # Total estimated time
        eta = (
            to_pickup["eta_minutes"]
            + to_delivery["eta_minutes"]
        )

        # Calculate vehicle score
        score = calculate_vehicle_score(
            distance_km=distance,
            eta_minutes=eta,
            capacity_kg=capacity,
            order_weight_kg=order_weight_kg,
            priority=priority
        )

        candidates.append({
            "vehicle_id": vehicle_id,
            "vehicle_number": vehicle["vehicle_number"],
            "driver_name": vehicle["driver_name"],
            "capacity_kg": capacity,
            "distance_km": round(distance, 2),
            "eta_minutes": round(eta, 2),
            "route_score": score
        })

    if not candidates:
        return None

    # Sort from best score to worst score
    candidates.sort(
        key=lambda x: x["route_score"]
    )

    return candidates


def assign_vehicle_to_order(
    dispatch_order_id: int,
    vehicle_result: dict
):
    """
    Assign the selected vehicle to a dispatch order.

    Updates:
    - dispatch_orders
    - vehicles
    """

    vehicle_id = vehicle_result["vehicle_id"]

    # Update dispatch order
    order_response = (
        supabase
        .table("dispatch_orders")
        .update({
            "vehicle_id": vehicle_id,
            "route_distance_km": vehicle_result["distance_km"],
            "estimated_duration_min": round(
                vehicle_result["eta_minutes"]
            ),
            "route_score": vehicle_result["route_score"],
            "status": "ASSIGNED"
        })
        .eq("id", dispatch_order_id)
        .execute()
    )

    # Update vehicle status
    vehicle_response = (
        supabase
        .table("vehicles")
        .update({
            "status": "ASSIGNED"
        })
        .eq("id", vehicle_id)
        .execute()
    )

    return {
        "order": order_response.data,
        "vehicle": vehicle_response.data
    }