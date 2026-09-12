# Farm2Market AI Service — Phase 3: ML Demand Prediction & Data API

## 1. Overview
The **Farm2Market AI Service** delivers agricultural demand intelligence, market clearance analytics, and machine learning forward-demand forecasting for the Farm2Market platform (Smart India Hackathon 2026).

> [!NOTE]
> **Synthetic Prototype Notice:**
> This prototype is trained on synthetic historical marketplace data. The model demonstrates the technical prediction pipeline, but its accuracy should not be interpreted as real-world agricultural forecasting accuracy. In production, the model should be retrained continuously using verified marketplace transactions and additional agricultural, weather, seasonal, and market data.

---

## 2. Architecture & Project Structure

```text
ai-service/
│
├── data/
│   └── crop_sales.csv            # Historical mandi sales dataset (30,600 records)
│
├── models/
│   └── demand_model.joblib       # Trained RandomForest regression pipeline (182 MB)
│
├── ml/
│   ├── __init__.py               # ML package marker
│   ├── train_demand_model.py     # End-to-end training and evaluation pipeline
│   └── predictor.py              # Recursive multi-day demand inference engine
│
├── helpers.py                    # Modular loading, validation, filtering, and metrics calculation
├── main.py                       # FastAPI application with CORS, OpenAPI docs, and routes
├── requirements.txt              # Production dependencies
└── README.md                     # Complete service documentation & API usage guide
```

The service maintains a clean modular separation of concerns:
- **`helpers.py`**: Isolates dataset parsing, date range slicing, data validation, and historical baseline statistics.
- **`ml/train_demand_model.py`**: Independent training script creating features, target labels, chronological train/test splits, fitting the `RandomForestRegressor` pipeline, evaluating metrics, and serializing the model artifact.
- **`ml/predictor.py`**: High-performance inference engine that loads `models/demand_model.joblib`, runs recursive multi-step daily forecasts, and computes demand gap and ML demand scores.
- **`main.py`**: Exposes FastAPI endpoints, validates query/path parameters, handles CORS for frontend clients, and serves interactive OpenAPI `/docs`.

---

## 3. Dataset Description
The service reads the validated dataset from `data/crop_sales.csv`:
- **Time Window**: 90 historical days (`2026-08-01` to `2026-10-29`).
- **Geographic Scope**: 10 Uttar Pradesh districts (34 mandi cities total).
- **Crops**: 10 staple agricultural commodities (Tomato, Potato, Onion, Carrot, Cauliflower, Cabbage, Spinach, Peas, Brinjal, Okra).
- **Granularity**: Exactly 1 record per `(date, city, crop)` combination (30,600 records total).
- **Reference Date**: The latest available date in the dataset (`2026-10-29`) is dynamically used as the anchor for historical lookbacks and forward-looking forecasts.

---

## 4. Installation

Ensure Python 3.10+ is installed. Install the dependencies:

```bash
cd ai-service
pip install -r requirements.txt
```

### Dependencies (`requirements.txt`)
- `fastapi` — Modern, high-performance web framework for APIs.
- `uvicorn` — Lightning-fast ASGI web server.
- `pandas` — High-performance data structures and in-memory analytical querying.
- `numpy` — Array computation and mathematical operations.
- `scikit-learn` — Machine learning preprocessing (`ColumnTransformer`, `OneHotEncoder`) and `RandomForestRegressor`.
- `joblib` — Efficient model serialization and artifact persistence.

---

## 5. Machine Learning Demand Prediction (Phase 3)

### 5.1 End-to-End Prediction Flow
```text
Historical marketplace data (30,600 records)
        ↓
Feature engineering (calendar, price, supply, clearance)
        ↓
Historical demand features (rolling 7-day & 30-day sales)
        ↓
Supervised target creation (future_demand_kg = next-day quantity sold)
        ↓
Chronological 80/20 train/test split
        ↓
ColumnTransformer (OneHotEncoder + Passthrough)
        ↓
RandomForestRegressor (n_estimators=200, min_samples_leaf=2)
        ↓
Recursive multi-day daily forecasting (1, 7, or 30 days)
        ↓
Total predicted demand, demand gap & ML demand score
        ↓
Demand level classification (Low, Medium, High, Very High)
```

### 5.2 What the Model Predicts
The model predicts **`future_demand_kg`**: the expected volume in kilograms of a selected crop that buyers and consumers are projected to purchase in a specific mandi. For multi-day periods ($N=7$ or $N=30$), the predictor runs an autoregressive daily roll-forward loop, forecasting each day in sequence and summing the total expected demand.

### 5.3 Feature Engineering & Data Leakage Prevention
To ensure robust generalization without data leakage:
1. **Categorical Features**: `district`, `city`, `crop` — encoded via `OneHotEncoder(handle_unknown="ignore")`.
2. **Calendar / Temporal Features**:
   - `day_of_week`: Captures weekly mandi cycles (weekend and mid-week surges).
   - `month`: Captures seasonal progression from monsoon to winter harvest.
3. **Contemporary Market Signals**:
   - `quantity_listed_kg`, `quantity_sold_kg`, `available_quantity_kg`, `number_of_orders`, `average_price_per_kg`.
   - `selling_percentage`: $( \text{quantity\_sold\_kg} / \text{quantity\_listed\_kg} ) \times 100$.
4. **Historical Rolling Demand**:
   - `previous_7_day_demand`: Rolling 7-day moving average of sales within the same `(district, city, crop)`.
   - `previous_30_day_demand`: Rolling 30-day moving average of sales within the same `(district, city, crop)`.
   - **Zero Leakage**: All rolling features at day $T$ strictly use historical observations $\le T$. The target is day $T+1$, ensuring the model never observes future labels during feature creation.

### 5.4 Supervised Target Definition
- For each `(district, city, crop)` series sorted chronologically, the target is defined as:
  $$\text{future\_demand\_kg}_T = \text{quantity\_sold\_kg}_{T+1}$$
- Trailing boundary rows ($T=90$, Oct 29) without a subsequent day's sales are dropped (340 rows), leaving **30,260 high-quality training rows**.

### 5.5 Chronological Train / Test Split
To respect temporal dependencies, the dataset is split chronologically rather than randomly shuffled:
- **Training Set (First ~80% of dates)**: August 1, 2026 to October 10, 2026 (71 days, 24,140 rows).
- **Testing Set (Last ~20% of dates)**: October 11, 2026 to October 28, 2026 (18 days, 6,120 rows).

### 5.6 Model Evaluation Results
The model was trained and evaluated strictly on the unseen chronological test set:

| Metric | Test Set Value | Description |
| :--- | :--- | :--- |
| **MAE** | **128.89 kg** | Mean Absolute Error across all crops and cities |
| **RMSE** | **183.02 kg** | Root Mean Squared Error penalizing large deviations |
| **$R^2$ Score** | **0.9484** | Explains 94.8% of test set variance |

### 5.7 Feature Importance Breakdown
Aggregated feature importances derived directly from the trained Random Forest ensemble:

| Feature Group | Relative Importance | Key Insight |
| :--- | :--- | :--- |
| `previous_7_day_demand` | **51.68%** | Short-term momentum is the single strongest demand driver |
| `previous_30_day_demand` | **41.10%** | Medium-term baseline seasonal level accounts for 41% |
| `day_of_week` | **3.97%** | Weekly cycle patterns (Friday–Sunday peaks) |
| `quantity_listed_kg` | **0.67%** | Supply arrival pressure |
| `average_price_per_kg` | **0.48%** | Price elasticity signal |
| `quantity_sold_kg` | **0.46%** | Prior-day clearing volume |
| `number_of_orders` | **0.38%** | Transaction volume density |
| `available_quantity_kg` | **0.36%** | Leftover stock resistance |
| `selling_percentage` | **0.33%** | Rate of market absorption |
| `city` / `district` / `crop` | **0.46%** | Regional baseline fixed effects |
| `month` | **0.11%** | Broad seasonal shift |

### 5.8 How to Train the Model
From inside the `ai-service` directory:

```bash
python ml/train_demand_model.py
```

The script prints the chronological split parameters, trains the ensemble, evaluates the test set, displays the feature importance breakdown, and saves the artifact to `models/demand_model.joblib`.

---

## 6. How to Run the Server

From inside the `ai-service` directory:

```bash
uvicorn main:app --reload --port 8000
```

- **Interactive Swagger Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Service Info / Root**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

### CORS Support
Configured strictly for local frontend development:
- `http://localhost:3000`
- `http://localhost:5173`

---

## 7. Complete API Reference

| Method | Endpoint | Query / Path Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | *None* | Service health, model availability, and metadata |
| `GET` | `/api/locations` | *None* | Sorted list of all 10 UP districts and 34 cities |
| `GET` | `/api/crops` | *None* | Sorted list of all 10 available vegetable crops |
| `GET` | `/api/demand` | `district`, `city`, `period` (`1`, `7`, `30`) | Historical demand overview ranked by demand score |
| `GET` | `/api/demand/{crop}` | `crop` (path), `district`, `city`, `period` | Historical detailed metrics for a single crop |
| `GET` | `/api/market-summary` | `district`, `city`, `period` (`1`, `7`, `30`) | Aggregated market volume, clearance %, and top/bottom crops |
| `GET` | `/api/predict-demand` | `district`, `city`, `crop`, `period` (`1`, `7`, `30`) | **[NEW Phase 3]** Machine Learning future demand prediction |

---

## 8. ML Demand Prediction API (`/api/predict-demand`)

### Example Request
```bash
curl -X GET "http://127.0.0.1:8000/api/predict-demand?district=Meerut&city=Meerut&crop=Tomato&period=7"
```

### Example Response (200 OK)
```json
{
  "location": {
    "district": "Meerut",
    "city": "Meerut"
  },
  "crop": "Tomato",
  "prediction_period_days": 7,
  "reference_date": "2026-10-29",
  "predicted_demand_kg": 17544,
  "current_supply_kg": 321,
  "demand_gap_kg": 17223,
  "demand_score": 94,
  "demand_level": "Very High",
  "model": "Random Forest Regressor",
  "daily_predictions": [
    {
      "date": "2026-10-30",
      "predicted_demand_kg": 2845
    },
    {
      "date": "2026-10-31",
      "predicted_demand_kg": 2959
    },
    {
      "date": "2026-11-01",
      "predicted_demand_kg": 1928
    },
    {
      "date": "2026-11-02",
      "predicted_demand_kg": 2369
    },
    {
      "date": "2026-11-03",
      "predicted_demand_kg": 2629
    },
    {
      "date": "2026-11-04",
      "predicted_demand_kg": 2333
    },
    {
      "date": "2026-11-05",
      "predicted_demand_kg": 2481
    }
  ]
}
```

### Response Field Descriptions
- **`predicted_demand_kg`**: Total forecasted demand volume over the prediction period.
- **`current_supply_kg`**: Standing unsold inventory (`available_quantity_kg`) on the reference date.
- **`demand_gap_kg`**: $\text{predicted\_demand\_kg} - \text{current\_supply\_kg}$.
  - Positive $\implies$ Market demand exceeds existing supply (opportunity for farmers to supply more).
  - Negative $\implies$ Existing supply exceeds projected demand (oversupply risk).
- **`demand_score`**: Bounded 0–100 integer score combining demand-to-supply pressure (60%) and recent historical selling velocity (40%).
- **`demand_level`**: Qualitative category:
  - `0 – 30`: Low
  - `31 – 60`: Medium
  - `61 – 80`: High
  - `81 – 100`: Very High
- **`daily_predictions`**: Day-by-day forecast breakdown enabling frontend visualization charts.

---

## 9. Error Handling & Edge Cases

| Condition | HTTP Status | Response Payload Example |
| :--- | :--- | :--- |
| Model not trained on startup | `503 Service Unavailable` | `{"detail": "Demand prediction model is not trained yet. Run the training script first."}` |
| Unknown District | `404 Not Found` | `{"detail": "District not found"}` |
| Unknown City in District | `404 Not Found` | `{"detail": "City not found in selected district"}` |
| Unknown Crop | `404 Not Found` | `{"detail": "Crop not found"}` |
| Unsupported Period (e.g. `15`, `0`) | `400 Bad Request` | `{"detail": "Period must be 1, 7, or 30 days"}` |
| Missing Required Parameter | `422 Unprocessable Entity` | Standard FastAPI validation payload |
