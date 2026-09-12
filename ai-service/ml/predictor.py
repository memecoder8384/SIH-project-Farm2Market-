"""
Farm2Market AI Service - Phase 3: Demand Predictor Module
Loads the trained demand model pipeline and generates multi-day demand predictions,
daily forecasts, demand gaps, and ML demand scores.
"""

from __future__ import annotations

import os
import datetime
from typing import Dict, Any, List, Optional
import joblib
import numpy as np
import pandas as pd

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "demand_model.joblib")

_CACHED_MODEL = None


class ModelNotTrainedError(Exception):
    """Raised when the demand prediction model artifact cannot be found."""
    pass


def is_model_available() -> bool:
    """Checks if the trained model artifact exists on disk."""
    return os.path.exists(MODEL_PATH)


def load_model():
    """
    Loads and caches the trained RandomForest model pipeline.
    Raises ModelNotTrainedError if not found.
    """
    global _CACHED_MODEL
    if _CACHED_MODEL is not None:
        return _CACHED_MODEL

    if not is_model_available():
        raise ModelNotTrainedError(
            "Demand prediction model is not trained yet. Run the training script first."
        )

    _CACHED_MODEL = joblib.load(MODEL_PATH)
    return _CACHED_MODEL


def calculate_ml_demand_score(
    predicted_demand_kg: int,
    period_days: int,
    current_supply_kg: int,
    historical_selling_percentage: float
) -> int:
    """
    Calculates a bounded 0-100 ML demand score:
    - 60% weight on predicted daily demand relative to currently available market supply
    - 40% weight on historical market absorption / clearance velocity
    """
    avg_daily_demand = predicted_demand_kg / float(period_days)
    supply_safe = max(current_supply_kg, 1)

    # Ratio of daily demand to current standing unsold supply
    demand_ratio = avg_daily_demand / supply_safe
    # Scaled signal: 1.0 ratio ~ 65 points, 1.5 ratio ~ 97 points
    demand_signal = min(100.0, demand_ratio * 65.0)

    combined_score = 0.60 * demand_signal + 0.40 * historical_selling_percentage
    return max(0, min(100, int(round(combined_score))))


def calculate_demand_level(score: int) -> str:
    """Maps demand score (0-100) to demand level."""
    if score <= 30:
        return "Low"
    elif score <= 60:
        return "Medium"
    elif score <= 80:
        return "High"
    else:
        return "Very High"


def predict_demand(
    df: pd.DataFrame,
    district: str,
    city: str,
    crop: str,
    period_days: int
) -> Dict[str, Any]:
    """
    Generates multi-day recursive daily forecasts using the trained RandomForest model.
    Returns predicted demand in kg, current supply, demand gap, ML score, level,
    and daily breakdown.
    """
    model = load_model()

    # 1. Filter historical records for this exact location and crop
    mask = (
        (df["district"] == district) &
        (df["city"] == city) &
        (df["crop"] == crop)
    )
    series_df = df[mask].sort_values("date").reset_index(drop=True)

    if series_df.empty:
        raise ValueError(f"No historical records found for {district} / {city} / {crop}")

    latest_record = series_df.iloc[-1]
    reference_date: datetime.date = latest_record["date"].date()
    current_supply_kg = int(latest_record["available_quantity_kg"])

    # Extract historical sales history for rolling demand computation
    history_sales: List[float] = list(series_df["quantity_sold_kg"].astype(float))

    # Calculate historical selling percentage for blending (last 30 days)
    recent_window = series_df.tail(min(30, len(series_df)))
    total_listed_recent = recent_window["quantity_listed_kg"].sum()
    total_sold_recent = recent_window["quantity_sold_kg"].sum()
    hist_sell_pct = (
        float((total_sold_recent / total_listed_recent) * 100.0)
        if total_listed_recent > 0
        else 50.0
    )

    # Running state for recursive daily predictions
    current_listed = float(latest_record["quantity_listed_kg"])
    current_sold = float(latest_record["quantity_sold_kg"])
    current_avail = float(latest_record["available_quantity_kg"])
    current_orders = float(latest_record["number_of_orders"])
    current_price = float(latest_record["average_price_per_kg"])
    current_sell_pct = (current_sold / max(current_listed, 1.0)) * 100.0

    daily_predictions: List[Dict[str, Any]] = []

    for day_step in range(1, period_days + 1):
        target_date = reference_date + datetime.timedelta(days=day_step)
        target_dow = target_date.weekday()
        target_month = target_date.month

        # Rolling demand features from past sales buffer
        prev_7 = float(np.mean(history_sales[-7:])) if len(history_sales) >= 1 else current_sold
        prev_30 = float(np.mean(history_sales[-30:])) if len(history_sales) >= 1 else current_sold

        # Assemble feature row matching training columns exactly
        feature_row = pd.DataFrame([{
            "district": district,
            "city": city,
            "crop": crop,
            "day_of_week": target_dow,
            "month": target_month,
            "quantity_listed_kg": current_listed,
            "quantity_sold_kg": current_sold,
            "available_quantity_kg": current_avail,
            "number_of_orders": current_orders,
            "average_price_per_kg": current_price,
            "selling_percentage": round(current_sell_pct, 2),
            "previous_7_day_demand": round(prev_7, 2),
            "previous_30_day_demand": round(prev_30, 2),
        }])

        raw_pred = float(model.predict(feature_row)[0])
        daily_demand = max(1, int(round(raw_pred)))

        daily_predictions.append({
            "date": target_date.strftime("%Y-%m-%d"),
            "predicted_demand_kg": daily_demand
        })

        # Advance recursive state: append prediction to history buffer
        history_sales.append(float(daily_demand))
        current_sold = float(daily_demand)
        current_orders = max(1.0, round(current_sold / 30.0))  # approx average lot size
        current_avail = max(0.0, current_listed - current_sold)
        current_sell_pct = (current_sold / max(current_listed, 1.0)) * 100.0

    # Total predicted demand over the requested window
    total_predicted_demand = int(sum(d["predicted_demand_kg"] for d in daily_predictions))

    # Demand Gap
    demand_gap_kg = total_predicted_demand - current_supply_kg

    # Demand Score & Level
    demand_score = calculate_ml_demand_score(
        total_predicted_demand,
        period_days,
        current_supply_kg,
        hist_sell_pct
    )
    demand_level = calculate_demand_level(demand_score)

    return {
        "location": {
            "district": district,
            "city": city
        },
        "crop": crop,
        "prediction_period_days": period_days,
        "reference_date": reference_date.strftime("%Y-%m-%d"),
        "predicted_demand_kg": total_predicted_demand,
        "current_supply_kg": current_supply_kg,
        "demand_gap_kg": demand_gap_kg,
        "demand_score": demand_score,
        "demand_level": demand_level,
        "model": "Random Forest Regressor",
        "daily_predictions": daily_predictions
    }
