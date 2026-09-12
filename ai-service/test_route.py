from route_service import get_route


pickup_lat = 28.6139
pickup_lng = 77.2090

delivery_lat = 28.7041
delivery_lng = 77.1025


route = get_route(
    pickup_lat,
    pickup_lng,
    delivery_lat,
    delivery_lng
)

print("Route calculated successfully!")
print("Distance:", route["distance_km"], "km")
print("ETA:", route["eta_minutes"], "minutes")