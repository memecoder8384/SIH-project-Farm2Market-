def calculate_vehicle_score(
    distance_km: float,
    eta_minutes: float,
    capacity_kg: float,
    order_weight_kg: float,
    priority: int = 1
) -> float:
    """
    Lower score = better vehicle.

    Factors:
    - ETA: 40%
    - Distance: 20%
    - Capacity usage: 20%
    - Priority: 20%
    """

    if capacity_kg <= 0:
        return float("inf")

    if order_weight_kg > capacity_kg:
        return float("inf")

    capacity_usage = order_weight_kg / capacity_kg

    score = (
        eta_minutes * 0.40
        + distance_km * 0.20
        + capacity_usage * 20
        - priority * 10
    )

    return round(score, 2)