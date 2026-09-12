# Farm2Market 🌱🌾

> **Smart India Hackathon (SIH 2026)** — Direct Farmer-to-Consumer/Buyer Agricultural Marketplace, Demand Intelligence & Smart Logistics Optimization Platform.

---

## 📌 Overview

**Farm2Market** bridges the gap between rural agricultural producers and urban buyers/mandis. The platform eliminates unnecessary middlemen, provides real-time demand forecasting using machine learning, and optimizes last-mile vehicle fleet dispatching for fresh farm produce.

---

## 🚀 Key Features

1. **🌾 Direct Farmer Marketplace**:
   - Seamless listing of crops with real-time pricing and stock management.
   - Transparent buyer discovery and direct order placement.
   - Interactive 3D visual experiences powered by Three.js.

2. **🧠 AI Demand Intelligence & Forecasting (`ai-service`)**:
   - Machine learning demand prediction powered by `RandomForestRegressor`.
   - Multi-day (1, 7, 30 days) forward demand projection across mandi regions.
   - Market clearance metrics, selling percentage, and price elasticity signals.
   - Integrated with Google Gemini for intelligent agricultural insights.

3. **🚚 Smart Dispatch & Logistics Optimizer**:
   - Real-time fleet vehicle selection based on distance, capacity, priority, and ETAs.
   - Integrated with **OpenRouteService** for live road routing and geocoordinate calculations.
   - Automated status tracking (`AVAILABLE` → `ASSIGNED`) synced with **Supabase**.

---

## 🏗️ Project Architecture

```text
SIH-project-Farm2Market-/
│
├── src/                          # Frontend Application (React + TypeScript + Tailwind CSS)
│   ├── components/               # Modular UI components & navigation
│   ├── pages/                    # Marketplace, Dashboard, Dispatch & Analytics pages
│   ├── services/                 # API client services (Gemini, AI service)
│   ├── shaders/                  # Custom Three.js graphical shaders
│   └── App.tsx                   # Main application layout & view management
│
├── ai-service/                   # AI & Dispatch Backend Service (FastAPI + ML)
│   ├── data/                     # Historical sales and mandi datasets (crop_sales.csv)
│   ├── dispatch/                 # Fleet assignment and route optimization engine
│   ├── ml/                       # ML model training and demand predictor pipelines
│   ├── models/                   # Serialized ML models (.gitkeep, demand_model.joblib)
│   ├── main.py                   # FastAPI REST API endpoints & CORS configuration
│   ├── requirements.txt          # Python dependencies
│   └── README.md                 # Detailed AI service & API documentation
│
├── public/                       # Static public assets
├── .env.example                  # Environment variable reference template
├── package.json                  # Node.js dependencies and build scripts
└── vite.config.ts                # Vite frontend bundler configuration
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Three.js
- **Backend / AI**: FastAPI, Python 3.10+, Uvicorn, Scikit-Learn, Pandas, NumPy, Joblib
- **Database & Services**: Supabase (PostgreSQL), OpenRouteService API, Google Gemini API

---

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/memecoder8384/SIH-project-Farm2Market-.git
cd SIH-project-Farm2Market-
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Fill in your API keys in `.env`:
```env
# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# AI Service endpoint
VITE_AI_API_URL=http://localhost:8000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_key
```

---

### 3. Frontend Setup

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

### 4. AI & Dispatch Service Setup

Open a new terminal and navigate to the `ai-service` directory:

```bash
cd ai-service

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Train the Demand Forecasting Model

To generate the serialized model (`models/demand_model.joblib`):

```bash
python ml/train_demand_model.py
```

#### Run the FastAPI Server

```bash
uvicorn main:app --reload --port 8000
```

Interactive API documentation will be accessible at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 📜 License

This project is developed for the Smart India Hackathon (SIH 2026). All rights reserved.
