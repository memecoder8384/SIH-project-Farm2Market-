import requests


def get_route(pickup_lat, pickup_lng, delivery_lat, delivery_lng):
    """
    Get road distance and estimated travel time using OSRM.
    """

    url = (
        f"https://router.project-osrm.org/route/v1/driving/"
        f"{pickup_lng},{pickup_lat};"
        f"{delivery_lng},{delivery_lat}"
    )

    params = {
        "overview": "false"
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()

    if data["code"] != "Ok":
        raise Exception("Route could not be calculated")

    route = data["routes"][0]

    distance_km = route["distance"] / 1000
    duration_minutes = route["duration"] / 60

    return {
        "distance_km": round(distance_km, 2),
        "eta_minutes": round(duration_minutes, 2)
    }