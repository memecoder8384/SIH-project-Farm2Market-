from dispatch.optimizer import (
    get_available_vehicles,
    select_best_vehicle
)


# Test order
ORDER_WEIGHT = 500
PRIORITY = 2


# Test pickup location
PICKUP_LAT = 28.6139
PICKUP_LNG = 77.2090


# Test delivery location
DELIVERY_LAT = 28.7041
DELIVERY_LNG = 77.1025


# Get available vehicles
vehicles = get_available_vehicles()

print("\nAvailable vehicles:")
print("-------------------")

for vehicle in vehicles:
    print(
        vehicle["vehicle_number"],
        "| Capacity:",
        vehicle["capacity_kg"],
        "kg",
        "| Location:",
        vehicle["current_lat"],
        vehicle["current_lng"]
    )


# Compare all vehicles
results = select_best_vehicle(
    order_weight_kg=ORDER_WEIGHT,
    pickup_lat=PICKUP_LAT,
    pickup_lng=PICKUP_LNG,
    delivery_lat=DELIVERY_LAT,
    delivery_lng=DELIVERY_LNG,
    priority=PRIORITY
)


print("\nVehicle comparison:")
print("-------------------")

if results:

    for vehicle in results:
        print(
            vehicle["vehicle_number"],
            "| Distance:",
            vehicle["distance_km"],
            "km",
            "| ETA:",
            vehicle["eta_minutes"],
            "min",
            "| Score:",
            vehicle["route_score"]
        )

    print("\nBest vehicle:")
    print("-------------")
    print(results[0]["vehicle_number"])

else:
    print("No suitable vehicle available.")