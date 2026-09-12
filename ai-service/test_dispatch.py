from dispatch.optimizer import get_available_vehicles

vehicles = get_available_vehicles()

print("Available vehicles:")

for vehicle in vehicles:
    print(
        vehicle["vehicle_number"],
        "| Capacity:",
        vehicle["capacity_kg"],
        "kg",
        "| Status:",
        vehicle["status"]
    )