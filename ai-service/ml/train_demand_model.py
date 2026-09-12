#!/usr/bin/env python3
"""
Farm2Market SIH 2026 - Phase 3: Demand Prediction Model Training
Trains a RandomForestRegressor pipeline on historical agricultural sales data
to predict future crop demand in kilograms.
"""

from __future__ import annotations

import os
import sys
import math
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Ensure clean UTF-8 console output on Windows platforms
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "crop_sales.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_OUTPUT_PATH = os.path.join(MODELS_DIR, "demand_model.joblib")

REQUIRED_COLUMNS = [
    "date",
    "district",
    "city",
    "crop",
    "quantity_listed_kg",
    "quantity_sold_kg",
    "available_quantity_kg",
    "number_of_orders",
    "average_price_per_kg",
]

CATEGORICAL_FEATURES = ["district", "city", "crop"]
NUMERIC_FEATURES = [
    "day_of_week",
    "month",
    "quantity_listed_kg",
    "quantity_sold_kg",
    "available_quantity_kg",
    "number_of_orders",
    "average_price_per_kg",
    "selling_percentage",
    "previous_7_day_demand",
    "previous_30_day_demand",
]


def load_and_validate_data(csv_path: str) -> pd.DataFrame:
    """Loads CSV and asserts all required columns are present."""
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    df = pd.read_csv(csv_path)
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"Dataset missing required columns: {missing}")

    df["date"] = pd.to_datetime(df["date"])
    return df


def engineer_features_and_target(df: pd.DataFrame) -> pd.DataFrame:
    """
    Sorts data chronologically and engineers:
    - Temporal features (day_of_week, month)
    - Contemporary selling_percentage
    - Historical rolling demand (previous_7_day_demand, previous_30_day_demand)
    - Supervised learning target: future_demand_kg (next day's quantity_sold_kg)
    """
    # 1. Sort chronologically by series grouping
    df = df.sort_values(by=["district", "city", "crop", "date"]).reset_index(drop=True)

    # 2. Temporal features
    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month

    # 3. Selling percentage (safe division)
    listed_safe = df["quantity_listed_kg"].replace(0, np.nan)
    df["selling_percentage"] = ((df["quantity_sold_kg"] / listed_safe) * 100.0).fillna(0.0).round(2)

    # 4. Historical rolling demand features (strictly historical within series)
    # Using rolling mean of sales up to today (day T) to forecast future demand (day T+1)
    grouped = df.groupby(["district", "city", "crop"])["quantity_sold_kg"]

    df["previous_7_day_demand"] = (
        grouped.transform(lambda s: s.rolling(window=7, min_periods=1).mean())
        .round(2)
    )
    df["previous_30_day_demand"] = (
        grouped.transform(lambda s: s.rolling(window=30, min_periods=1).mean())
        .round(2)
    )

    # 5. Create supervised target: future_demand_kg = next day's quantity_sold_kg
    df["future_demand_kg"] = grouped.shift(-1)

    # 6. Drop rows where future target is NaN (the final date for each group)
    initial_rows = len(df)
    df = df.dropna(subset=["future_demand_kg"]).reset_index(drop=True)
    dropped_rows = initial_rows - len(df)
    print(f"Engineered features. Retained {len(df):,} rows (dropped {dropped_rows:,} trailing boundary rows).")

    return df


def build_and_train_pipeline(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series
) -> Tuple[Pipeline, Dict[str, float]]:
    """
    Builds a Scikit-learn ColumnTransformer pipeline with OneHotEncoder and RandomForestRegressor,
    fits the pipeline on training data, and evaluates test metrics.
    """
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_FEATURES
            ),
            (
                "num",
                "passthrough",
                NUMERIC_FEATURES
            ),
        ]
    )

    rf_regressor = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        min_samples_leaf=2,
        n_jobs=-1
    )

    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", rf_regressor)
    ])

    print("Training RandomForestRegressor on historical data...")
    pipeline.fit(X_train, y_train)

    # Predictions and Evaluation
    print("Evaluating on chronologically separated test set...")
    y_pred = pipeline.predict(X_test)

    # Sanity checks on predictions
    if np.isnan(y_pred).any():
        raise ValueError("Model produced NaN predictions.")
    if (y_pred < 0).any():
        print("[WARNING] Negative predictions detected. Clamping to 0.")
        y_pred = np.maximum(0.0, y_pred)

    mae = float(mean_absolute_error(y_test, y_pred))
    mse = float(mean_squared_error(y_test, y_pred))
    rmse = float(math.sqrt(mse))
    r2 = float(r2_score(y_test, y_pred))

    metrics = {
        "MAE": round(mae, 2),
        "RMSE": round(rmse, 2),
        "R2": round(r2, 4),
    }

    return pipeline, metrics


def compute_feature_importances(pipeline: Pipeline) -> pd.DataFrame:
    """Extracts and aggregates feature importances back to high-level feature groups."""
    regressor: RandomForestRegressor = pipeline.named_steps["regressor"]
    preprocessor: ColumnTransformer = pipeline.named_steps["preprocessor"]

    # Extract transformed column names
    cat_encoder: OneHotEncoder = preprocessor.named_transformers_["cat"]
    cat_feature_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES))
    all_feature_names = cat_feature_names + NUMERIC_FEATURES

    raw_importances = regressor.feature_importances_

    # Map individual one-hot columns back to original feature names
    group_importances = {}
    for name, imp in zip(all_feature_names, raw_importances):
        # Determine parent group
        if name.startswith("district_"):
            group = "district"
        elif name.startswith("city_"):
            group = "city"
        elif name.startswith("crop_"):
            group = "crop"
        else:
            group = name
        group_importances[group] = group_importances.get(group, 0.0) + imp

    imp_df = (
        pd.DataFrame(list(group_importances.items()), columns=["Feature", "Importance"])
        .sort_values(by="Importance", ascending=False)
        .reset_index(drop=True)
    )
    imp_df["Importance"] = imp_df["Importance"].round(4)
    return imp_df


def main():
    print("=" * 70)
    print("Farm2Market SIH 2026 - Phase 3: Demand Model Training")
    print("=" * 70)

    # 1. Load data
    df = load_and_validate_data(DATA_PATH)
    print(f"Loaded {len(df):,} records from {DATA_PATH}")

    # 2. Engineer features and target
    data = engineer_features_and_target(df)

    # 3. Chronological Train / Test Split (First 80% train, Last 20% test)
    unique_dates = sorted(data["date"].unique())
    split_index = int(len(unique_dates) * 0.8)
    split_date = unique_dates[split_index]

    train_mask = data["date"] < split_date
    test_mask = data["date"] >= split_date

    train_data = data[train_mask].copy()
    test_data = data[test_mask].copy()

    feature_cols = CATEGORICAL_FEATURES + NUMERIC_FEATURES
    X_train = train_data[feature_cols]
    y_train = train_data["future_demand_kg"]

    X_test = test_data[feature_cols]
    y_test = test_data["future_demand_kg"]

    train_date_min = train_data['date'].min().strftime('%Y-%m-%d')
    train_date_max = train_data['date'].max().strftime('%Y-%m-%d')
    test_date_min = test_data['date'].min().strftime('%Y-%m-%d')
    test_date_max = test_data['date'].max().strftime('%Y-%m-%d')

    print(f"\nChronological Split Configuration:")
    print(f"  Training Dates : {train_date_min} to {train_date_max} ({len(train_data):,} rows, {split_index} days)")
    print(f"  Testing Dates  : {test_date_min} to {test_date_max} ({len(test_data):,} rows, {len(unique_dates)-split_index} days)")

    # 4. Train pipeline and evaluate
    pipeline, metrics = build_and_train_pipeline(X_train, y_train, X_test, y_test)

    print("\n" + "=" * 70)
    print("MODEL EVALUATION RESULTS (Test Set)")
    print("=" * 70)
    print(f"Training rows : {len(X_train):,}")
    print(f"Testing rows  : {len(X_test):,}")
    print(f"MAE           : {metrics['MAE']} kg")
    print(f"RMSE          : {metrics['RMSE']} kg")
    print(f"R²            : {metrics['R2']}")

    # 5. Explainability: Feature Importance
    print("\n" + "=" * 70)
    print("FEATURE IMPORTANCE BREAKDOWN")
    print("=" * 70)
    importance_df = compute_feature_importances(pipeline)
    for _, row in importance_df.iterrows():
        bar = "█" * int(row["Importance"] * 40)
        print(f"{row['Feature']:<25} : {row['Importance']:<6.4f} {bar}")

    # 6. Save model artifact
    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_OUTPUT_PATH)
    file_size_mb = os.path.getsize(MODEL_OUTPUT_PATH) / (1024 * 1024)
    print(f"\n[OK] Model successfully saved to: {MODEL_OUTPUT_PATH} ({file_size_mb:.2f} MB)")
    print("=" * 70)


if __name__ == "__main__":
    main()
