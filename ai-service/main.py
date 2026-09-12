"""
Farm2Market AI Service - Phase 3: FastAPI Data & ML Demand Prediction API
Exposes historical mandi sales, demand metrics, location registries, market summaries,
and Machine Learning future demand forecasting via trained RandomForest models.
"""

from __future__ import annotations

from typing import Any, Dict, List
import pandas as pd
from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware

from helpers import (
    load_dataset,
    get_reference_date,
    get_all_locations,
    get_all_crops,
    validate_location,
    validate_period,
    validate_crop,
    filter_period_data,
    calculate_crop_metrics,
)
from ml.predictor import (
    predict_demand,
    is_model_available,
    ModelNotTrainedError,
)

# ---------------------------------------------------------------------------
# FastAPI Application & Metadata
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Farm2Market Demand Intelligence API",
    description=(
        "Agricultural Demand Analytics & Machine Learning Prediction API for the "
        "Farm2Market SIH 2026 platform. Provides historical market arrival volumes, "
        "clearance rates, market summaries, and forward-looking ML demand forecasts "
        "powered by trained Random Forest regression pipelines."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ---------------------------------------------------------------------------
# CORS Configuration (Strict local frontend development origins)
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Dataset Initialization
# ---------------------------------------------------------------------------
try:
    df: pd.DataFrame = load_dataset()
    REFERENCE_DATE = get_reference_date(df)
    REFERENCE_DATE_STR = REFERENCE_DATE.strftime("%Y-%m-%d")
except Exception as exc:
    raise RuntimeError(f"Fatal error initializing crop sales dataset: {exc}") from exc


# ---------------------------------------------------------------------------
# Root & Health Endpoints
# ---------------------------------------------------------------------------
@app.get("/", summary="Service Health & Info", tags=["System"])
def root() -> Dict[str, Any]:
    return {
        "service": "Farm2Market AI Service",
        "phase": "Phase 3 - ML Demand Prediction",
        "status": "online",
        "model_available": is_model_available(),
        "reference_date": REFERENCE_DATE_STR,
        "total_records": len(df),
        "docs": "/docs",
        "redoc": "/redoc"
    }


# ---------------------------------------------------------------------------
# API 1: Locations Registry
# ---------------------------------------------------------------------------
@app.get("/api/locations", summary="List All Districts and Cities", tags=["Metadata"])
def get_locations() -> Dict[str, List[Dict[str, Any]]]:
    """
    Returns all districts and their corresponding cities available in the dataset.
    Districts and cities are sorted alphabetically with zero duplicates.
    """
    locations = get_all_locations(df)
    return {"locations": locations}


# ---------------------------------------------------------------------------
# API 2: Crops Registry
# ---------------------------------------------------------------------------
@app.get("/api/crops", summary="List All Crops", tags=["Metadata"])
def get_crops() -> Dict[str, List[str]]:
    """
    Returns all agricultural crops available in the dataset, sorted alphabetically.
    """
    crops = get_all_crops(df)
    return {"crops": crops}


# ---------------------------------------------------------------------------
# API 3: Demand Overview Across All Crops
# ---------------------------------------------------------------------------
@app.get("/api/demand", summary="Demand Overview for Location and Period", tags=["Demand Analytics"])
def get_demand(
    district: str = Query(..., description="District name (e.g. Meerut, Agra, Ghaziabad)"),
    city: str = Query(..., description="City or Mandi center (e.g. Meerut, Modinagar)"),
    period: int = Query(..., description="Analysis window in days (must be 1, 7, or 30)")
) -> Dict[str, Any]:
    """
    Calculates demand metrics for all crops in the specified district and city
    over the chosen period (1, 7, or 30 days) relative to the latest available reference date.
    Crops are returned sorted by demand_score in descending order.
    """
    # 1. Validation
    valid_period = validate_period(period)
    canonical_district, canonical_city = validate_location(df, district, city)

    # 2. Filter dataset for period and preceding comparison window
    current_df, prev_df = filter_period_data(
        df,
        canonical_district,
        canonical_city,
        valid_period,
        REFERENCE_DATE
    )

    # 3. Calculate demand metrics per crop
    all_crops = get_all_crops(df)
    crops_metrics: List[Dict[str, Any]] = []

    for crop_name in all_crops:
        crop_current_df = current_df[current_df["crop"] == crop_name]
        crop_prev_df = prev_df[prev_df["crop"] == crop_name]

        metrics = calculate_crop_metrics(crop_name, crop_current_df, crop_prev_df)
        crops_metrics.append(metrics)

    # 4. Sort crops by demand_score DESC
    crops_metrics.sort(key=lambda x: x["demand_score"], reverse=True)

    return {
        "location": {
            "district": canonical_district,
            "city": canonical_city
        },
        "period_days": valid_period,
        "reference_date": REFERENCE_DATE_STR,
        "crops": crops_metrics
    }


# ---------------------------------------------------------------------------
# API 4: Detailed Crop Demand
# ---------------------------------------------------------------------------
@app.get("/api/demand/{crop}", summary="Detailed Crop Demand Analytics", tags=["Demand Analytics"])
def get_crop_demand(
    crop: str = Path(..., description="Crop name (e.g. Tomato, Potato, Onion)"),
    district: str = Query(..., description="District name (e.g. Meerut)"),
    city: str = Query(..., description="City name (e.g. Meerut)"),
    period: int = Query(..., description="Analysis window in days (must be 1, 7, or 30)")
) -> Dict[str, Any]:
    """
    Returns detailed demand metrics for a specific single crop in a given location and period.
    """
    # 1. Validation
    valid_period = validate_period(period)
    canonical_crop = validate_crop(df, crop)
    canonical_district, canonical_city = validate_location(df, district, city)

    # 2. Filter period data
    current_df, prev_df = filter_period_data(
        df,
        canonical_district,
        canonical_city,
        valid_period,
        REFERENCE_DATE
    )

    crop_current_df = current_df[current_df["crop"] == canonical_crop]
    crop_prev_df = prev_df[prev_df["crop"] == canonical_crop]

    metrics = calculate_crop_metrics(canonical_crop, crop_current_df, crop_prev_df)

    return {
        "location": {
            "district": canonical_district,
            "city": canonical_city
        },
        "crop": canonical_crop,
        "period_days": valid_period,
        "reference_date": REFERENCE_DATE_STR,
        "total_listed_kg": metrics["total_listed_kg"],
        "total_sold_kg": metrics["total_sold_kg"],
        "available_quantity_kg": metrics["available_quantity_kg"],
        "number_of_orders": metrics["number_of_orders"],
        "average_price_per_kg": metrics["average_price_per_kg"],
        "selling_percentage": metrics["selling_percentage"],
        "demand_score": metrics["demand_score"],
        "demand_level": metrics["demand_level"],
        "trend": metrics["trend"]
    }


# ---------------------------------------------------------------------------
# API 5: Market Summary
# ---------------------------------------------------------------------------
@app.get("/api/market-summary", summary="Aggregate Market Summary", tags=["Market Summary"])
def get_market_summary(
    district: str = Query(..., description="District name (e.g. Meerut)"),
    city: str = Query(..., description="City name (e.g. Meerut)"),
    period: int = Query(..., description="Analysis window in days (must be 1, 7, or 30)")
) -> Dict[str, Any]:
    """
    Returns an aggregated high-level market summary for the selected location and period,
    including total produce volumes, overall clearance rate, market weighted price,
    and highest/lowest demand crops.
    """
    # 1. Validation
    valid_period = validate_period(period)
    canonical_district, canonical_city = validate_location(df, district, city)

    # 2. Filter period data
    current_df, prev_df = filter_period_data(
        df,
        canonical_district,
        canonical_city,
        valid_period,
        REFERENCE_DATE
    )

    all_crops = get_all_crops(df)
    crops_metrics: List[Dict[str, Any]] = []

    for crop_name in all_crops:
        crop_current_df = current_df[current_df["crop"] == crop_name]
        crop_prev_df = prev_df[prev_df["crop"] == crop_name]
        m = calculate_crop_metrics(crop_name, crop_current_df, crop_prev_df)
        crops_metrics.append(m)

    total_listed = int(current_df["quantity_listed_kg"].sum()) if not current_df.empty else 0
    total_sold = int(current_df["quantity_sold_kg"].sum()) if not current_df.empty else 0

    if total_listed > 0:
        overall_selling_pct = round((total_sold / total_listed) * 100.0, 2)
    else:
        overall_selling_pct = 0.0

    if not current_df.empty and total_sold > 0:
        avg_market_price = (current_df["average_price_per_kg"] * current_df["quantity_sold_kg"]).sum() / total_sold
    elif not current_df.empty and total_listed > 0:
        avg_market_price = current_df["average_price_per_kg"].mean()
    else:
        avg_market_price = 0.0

    avg_market_price = round(float(avg_market_price), 2)

    crops_metrics.sort(key=lambda x: x["demand_score"], reverse=True)
    highest_crop = crops_metrics[0]["crop"] if crops_metrics else "N/A"
    lowest_crop = crops_metrics[-1]["crop"] if crops_metrics else "N/A"

    return {
        "location": {
            "district": canonical_district,
            "city": canonical_city
        },
        "period_days": valid_period,
        "reference_date": REFERENCE_DATE_STR,
        "total_crops": len(crops_metrics),
        "total_listed_kg": total_listed,
        "total_sold_kg": total_sold,
        "overall_selling_percentage": overall_selling_pct,
        "average_market_price": avg_market_price,
        "highest_demand_crop": highest_crop,
        "lowest_demand_crop": lowest_crop
    }


# ---------------------------------------------------------------------------
# API 6: Machine Learning Demand Prediction
# ---------------------------------------------------------------------------
@app.get("/api/predict-demand", summary="Predict Future Crop Demand (ML)", tags=["ML Prediction"])
def get_predicted_demand(
    district: str = Query(..., description="District name (e.g. Meerut, Agra)"),
    city: str = Query(..., description="City name (e.g. Meerut, Fatehabad)"),
    crop: str = Query(..., description="Crop name (e.g. Tomato, Potato, Onion)"),
    period: int = Query(..., description="Forecast horizon in days (must be 1, 7, or 30)")
) -> Dict[str, Any]:
    """
    Predicts future agricultural demand in kilograms for a selected crop and location
    over 1, 7, or 30 days using the trained RandomForestRegressor machine learning pipeline.
    Returns predicted demand, current supply, demand gap, ML demand score, and daily forecasts.
    """
    # 1. Validation
    valid_period = validate_period(period)
    canonical_crop = validate_crop(df, crop)
    canonical_district, canonical_city = validate_location(df, district, city)

    # 2. Check model availability and execute prediction
    try:
        prediction_result = predict_demand(
            df,
            canonical_district,
            canonical_city,
            canonical_crop,
            valid_period
        )
    except ModelNotTrainedError as err:
        raise HTTPException(
            status_code=503,
            detail="Demand prediction model is not trained yet. Run the training script first."
        ) from err
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating demand prediction: {str(exc)}"
        ) from exc

    return prediction_result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
