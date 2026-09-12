"""
Farm2Market AI Service - Phase 2 Helper Functions
Provides modular dataset loading, validation, filtering, and statistical demand calculation.
"""

from __future__ import annotations

import os
import datetime
from typing import Tuple, List, Dict, Any, Optional
import pandas as pd
from fastapi import HTTPException

# Required columns per specification
REQUIRED_COLUMNS = [
    "date",
    "district",
    "city",
    "crop",
    "quantity_listed_kg",
    "quantity_sold_kg",
    "available_quantity_kg",
    "number_of_orders",
    "average_price_per_kg"
]

ALLOWED_PERIODS = {1, 7, 30}


def get_default_csv_path() -> str:
    """Resolves the absolute path to crop_sales.csv reliably."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "data", "crop_sales.csv")


def load_dataset(csv_path: Optional[str] = None) -> pd.DataFrame:
    """
    Loads and validates the crop sales dataset from CSV.
    Parses dates and validates that all required columns are present.
    """
    path = csv_path or get_default_csv_path()
    if not os.path.exists(path):
        raise RuntimeError(f"Crop sales dataset not found at: {path}")

    df = pd.read_csv(path)

    # Validate required columns
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Dataset missing required column(s): {', '.join(missing_cols)}")

    if df.empty:
        raise ValueError("Crop sales dataset is empty.")

    # Parse date
    df["date"] = pd.to_datetime(df["date"])

    # Ensure numeric columns have appropriate types
    numeric_cols = [
        "quantity_listed_kg",
        "quantity_sold_kg",
        "available_quantity_kg",
        "number_of_orders",
        "average_price_per_kg"
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Drop or warn on invalid rows
    if df[numeric_cols].isnull().any().any():
        raise ValueError("Dataset contains null or invalid numeric entries in required columns.")

    return df


def get_reference_date(df: pd.DataFrame) -> datetime.date:
    """Returns the most recent date available in the dataset as a datetime.date."""
    return df["date"].max().date()


def get_all_locations(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Extracts all unique districts and their corresponding cities.
    Districts and cities are returned sorted alphabetically without duplicates.
    """
    grouped = (
        df.groupby("district")["city"]
        .unique()
        .reset_index()
    )
    locations = []
    for _, row in grouped.sort_values("district").iterrows():
        locations.append({
            "district": row["district"],
            "cities": sorted(list(row["city"]))
        })
    return locations


def get_all_crops(df: pd.DataFrame) -> List[str]:
    """Returns a sorted list of unique crops present in the dataset."""
    return sorted(list(df["crop"].unique()))


def validate_period(period: int) -> int:
    """Validates the period parameter. Must be 1, 7, or 30 days."""
    if period not in ALLOWED_PERIODS:
        raise HTTPException(
            status_code=400,
            detail="Period must be 1, 7, or 30 days"
        )
    return period


def validate_location(df: pd.DataFrame, district: str, city: str) -> Tuple[str, str]:
    """
    Validates district and city against the dataset.
    Supports case-insensitive matching and returns canonical casing from dataset.
    Raises HTTPException(404) if district or city is not found.
    """
    # District lookup
    district_map = {d.lower(): d for d in df["district"].unique()}
    district_clean = district.strip().lower()

    if district_clean not in district_map:
        raise HTTPException(status_code=404, detail="District not found")
    canonical_district = district_map[district_clean]

    # City lookup within the validated district
    district_df = df[df["district"] == canonical_district]
    city_map = {c.lower(): c for c in district_df["city"].unique()}
    city_clean = city.strip().lower()

    if city_clean not in city_map:
        raise HTTPException(status_code=404, detail="City not found in selected district")
    canonical_city = city_map[city_clean]

    return canonical_district, canonical_city


def validate_crop(df: pd.DataFrame, crop: str) -> str:
    """
    Validates crop against the dataset.
    Supports case-insensitive matching and returns canonical casing.
    Raises HTTPException(404) if crop is not found.
    """
    crop_map = {c.lower(): c for c in df["crop"].unique()}
    crop_clean = crop.strip().lower()

    if crop_clean not in crop_map:
        raise HTTPException(status_code=404, detail="Crop not found")

    return crop_map[crop_clean]


def filter_period_data(
    df: pd.DataFrame,
    district: str,
    city: str,
    period_days: int,
    reference_date: datetime.date
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Filters dataframe for the given location and splits into:
    1. current_df: [reference_date - (period_days - 1), reference_date]
    2. previous_df: [reference_date - (2 * period_days - 1), reference_date - period_days]
    """
    loc_mask = (df["district"] == district) & (df["city"] == city)
    loc_df = df[loc_mask]

    current_start = reference_date - datetime.timedelta(days=period_days - 1)
    current_end = reference_date

    prev_start = reference_date - datetime.timedelta(days=2 * period_days - 1)
    prev_end = reference_date - datetime.timedelta(days=period_days)

    date_series = loc_df["date"].dt.date

    current_df = loc_df[(date_series >= current_start) & (date_series <= current_end)]
    previous_df = loc_df[(date_series >= prev_start) & (date_series <= prev_end)]

    return current_df, previous_df


def calculate_demand_score(selling_percentage: float) -> int:
    """Calculates demand score (integer rounded from selling percentage)."""
    return max(0, min(100, int(round(selling_percentage))))


def calculate_demand_level(demand_score: int) -> str:
    """
    Maps demand score to demand level:
    0–30   → Low
    31–60  → Medium
    61–80  → High
    81–100 → Very High
    """
    if demand_score <= 30:
        return "Low"
    elif demand_score <= 60:
        return "Medium"
    elif demand_score <= 80:
        return "High"
    else:
        return "Very High"


def calculate_trend(current_percentage: float, previous_percentage: Optional[float]) -> str:
    """
    Calculates demand trend by comparing current selling percentage with previous period.
    difference > 5   → "increasing"
    difference < -5  → "decreasing"
    otherwise        → "stable"
    """
    if previous_percentage is None:
        return "stable"

    diff = current_percentage - previous_percentage
    if diff > 5.0:
        return "increasing"
    elif diff < -5.0:
        return "decreasing"
    else:
        return "stable"


def calculate_crop_metrics(
    crop_name: str,
    crop_df: pd.DataFrame,
    prev_crop_df: Optional[pd.DataFrame] = None
) -> Dict[str, Any]:
    """
    Computes all required demand metrics for a single crop.
    """
    total_listed = int(crop_df["quantity_listed_kg"].sum()) if not crop_df.empty else 0
    total_sold = int(crop_df["quantity_sold_kg"].sum()) if not crop_df.empty else 0
    available_qty = max(0, total_listed - total_sold)
    total_orders = int(crop_df["number_of_orders"].sum()) if not crop_df.empty else 0

    # Quantity-weighted average price per kg
    if not crop_df.empty and total_sold > 0:
        weighted_price = (crop_df["average_price_per_kg"] * crop_df["quantity_sold_kg"]).sum() / total_sold
    elif not crop_df.empty and total_listed > 0:
        weighted_price = crop_df["average_price_per_kg"].mean()
    else:
        weighted_price = 0.0

    avg_price = round(float(weighted_price), 2)

    # Selling percentage
    if total_listed > 0:
        selling_pct = round((total_sold / total_listed) * 100.0, 2)
    else:
        selling_pct = 0.0

    demand_score = calculate_demand_score(selling_pct)
    demand_level = calculate_demand_level(demand_score)

    # Calculate previous period selling percentage for trend
    prev_pct: Optional[float] = None
    if prev_crop_df is not None and not prev_crop_df.empty:
        prev_listed = prev_crop_df["quantity_listed_kg"].sum()
        prev_sold = prev_crop_df["quantity_sold_kg"].sum()
        if prev_listed > 0:
            prev_pct = (prev_sold / prev_listed) * 100.0

    trend = calculate_trend(selling_pct, prev_pct)

    return {
        "crop": crop_name,
        "total_listed_kg": total_listed,
        "total_sold_kg": total_sold,
        "available_quantity_kg": available_qty,
        "number_of_orders": total_orders,
        "average_price_per_kg": avg_price,
        "selling_percentage": selling_pct,
        "demand_score": demand_score,
        "demand_level": demand_level,
        "trend": trend
    }
