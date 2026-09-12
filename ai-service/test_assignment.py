from dispatch.optimizer import (
    get_available_vehicles,
    select_best_vehicle,
    assign_vehicle_to_order
)
from supabase_client import supabase


ORDER_ID = "TEST-FM-001"


# Get the test order
response = (
    supabase
    .table("dispatch_orders")
    .select("*")
    .eq("order_id", ORDER_ID)
    .single()
    .execute()
)

order = response.data

print("\nOrder found:")
print("-------------------")
print("Order:", order["order_id"])
print("Quantity:", order["quantity_kg"], "kg")
print("Priority:", order["priority"])


# Find the best vehicle
results = select_best_vehicle(
    order_weight_kg=float(order["quantity_kg"]),
    pickup_lat=float(order["pickup_lat"]),
    pickup_lng=float(order["pickup_lng"]),
    delivery_lat=float(order["delivery_lat"]),
    delivery_lng=float(order["delivery_lng"]),
    priority=int(order["priority"])
)


if not results:
    print("\nNo suitable vehicle found.")
    exit()


# Best vehicle is first after sorting
best_vehicle = results[0]

print("\nBest vehicle:")
print("-------------------")
print("Vehicle:", best_vehicle["vehicle_number"])
print("Driver:", best_vehicle["driver_name"])
print("Distance:", best_vehicle["distance_km"], "km")
print("ETA:", best_vehicle["eta_minutes"], "minutes")
print("Score:", best_vehicle["route_score"])


# Assign vehicle to order
assignment = assign_vehicle_to_order(
    dispatch_order_id=order["id"],
    vehicle_result=best_vehicle
)


print("\nVehicle assigned successfully!")
print("-------------------")
print("Order:", ORDER_ID)
print("Vehicle:", best_vehicle["vehicle_number"])
print("Status: ASSIGNED")