#!/usr/bin/env python3
"""
Farm2Market SIH 2026 - Synthetic Agricultural Market Dataset Generator
Phase 1: Generates 90 days (August - October 2026) of realistic daily crop sales
data across 10 districts in Uttar Pradesh for demand and price prediction.
"""

import os
import sys
import csv
import math
import random
import datetime

# Ensure clean UTF-8 console output on Windows platforms
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# ---------------------------------------------------------------------------
# Configuration & Constants
# ---------------------------------------------------------------------------
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

START_DATE = datetime.date(2026, 8, 1)
NUM_DAYS = 90
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "crop_sales.csv")

# 10 Districts in Uttar Pradesh with 2-4 realistic cities per district (34 cities total)
DISTRICT_CITIES = {
    "Meerut": ["Meerut", "Mawana", "Sardhana"],
    "Ghaziabad": ["Ghaziabad", "Modinagar", "Loni", "Muradnagar"],
    "Muzaffarnagar": ["Muzaffarnagar", "Khatauli", "Budhana"],
    "Hapur": ["Hapur", "Pilkhuwa", "Garhmukteshwar"],
    "Bulandshahr": ["Bulandshahr", "Khurja", "Sikandrabad", "Siana"],
    "Saharanpur": ["Saharanpur", "Deoband", "Nakur"],
    "Moradabad": ["Moradabad", "Bilari", "Thakurdwara"],
    "Bareilly": ["Bareilly", "Aonla", "Baheri", "Faridpur"],
    "Aligarh": ["Aligarh", "Atrauli", "Khair"],
    "Agra": ["Agra", "Fatehabad", "Shamsabad", "Kheragarh"],
}

# Major district headquarters have higher market turnover scale
MAJOR_CITIES = {
    "Meerut", "Ghaziabad", "Muzaffarnagar", "Hapur",
    "Bulandshahr", "Saharanpur", "Moradabad", "Bareilly",
    "Aligarh", "Agra", "Modinagar", "Khurja"
}

# 10 Crops with realistic base price ranges (min_price, max_price, base_center)
# and baseline listed quantity in kg (tier1_base, tier2_base)
CROP_SPECS = {
    "Tomato": {
        "price_min": 20.0, "price_max": 60.0, "price_base": 36.0,
        "base_vol_major": 2800, "base_vol_minor": 1200,
        "default_demand": "high"
    },
    "Potato": {
        "price_min": 18.0, "price_max": 40.0, "price_base": 24.0,
        "base_vol_major": 4200, "base_vol_minor": 1800,
        "default_demand": "high"
    },
    "Onion": {
        "price_min": 20.0, "price_max": 60.0, "price_base": 34.0,
        "base_vol_major": 3600, "base_vol_minor": 1500,
        "default_demand": "high"
    },
    "Carrot": {
        "price_min": 25.0, "price_max": 70.0, "price_base": 42.0,
        "base_vol_major": 1600, "base_vol_minor": 750,
        "default_demand": "medium"
    },
    "Cauliflower": {
        "price_min": 20.0, "price_max": 60.0, "price_base": 32.0,
        "base_vol_major": 1800, "base_vol_minor": 800,
        "default_demand": "medium"
    },
    "Cabbage": {
        "price_min": 15.0, "price_max": 40.0, "price_base": 22.0,
        "base_vol_major": 2000, "base_vol_minor": 900,
        "default_demand": "medium"
    },
    "Spinach": {
        "price_min": 15.0, "price_max": 50.0, "price_base": 26.0,
        "base_vol_major": 1200, "base_vol_minor": 550,
        "default_demand": "medium"
    },
    "Peas": {
        "price_min": 40.0, "price_max": 100.0, "price_base": 72.0,
        "base_vol_major": 1100, "base_vol_minor": 500,
        "default_demand": "low"
    },
    "Brinjal": {
        "price_min": 20.0, "price_max": 50.0, "price_base": 28.0,
        "base_vol_major": 1500, "base_vol_minor": 650,
        "default_demand": "medium"
    },
    "Okra": {
        "price_min": 25.0, "price_max": 70.0, "price_base": 40.0,
        "base_vol_major": 1400, "base_vol_minor": 600,
        "default_demand": "medium"
    },
}

# District-specific demand level overrides reflecting localized consumption
DISTRICT_CROP_DEMAND = {
    "Meerut": {"Tomato": "high", "Potato": "high", "Onion": "high", "Okra": "medium", "Peas": "medium"},
    "Ghaziabad": {"Tomato": "high", "Potato": "medium", "Onion": "high", "Spinach": "high", "Carrot": "medium"},
    "Muzaffarnagar": {"Potato": "high", "Tomato": "medium", "Onion": "medium", "Cabbage": "high", "Cauliflower": "medium"},
    "Hapur": {"Potato": "high", "Tomato": "medium", "Onion": "high", "Brinjal": "medium", "Okra": "medium"},
    "Bulandshahr": {"Potato": "high", "Carrot": "high", "Onion": "medium", "Cauliflower": "medium", "Tomato": "medium"},
    "Saharanpur": {"Cabbage": "high", "Cauliflower": "high", "Tomato": "high", "Spinach": "medium", "Peas": "medium"},
    "Moradabad": {"Onion": "high", "Peas": "high", "Tomato": "medium", "Potato": "high", "Brinjal": "medium"},
    "Bareilly": {"Tomato": "high", "Okra": "high", "Potato": "medium", "Onion": "high", "Spinach": "medium"},
    "Aligarh": {"Potato": "high", "Brinjal": "high", "Onion": "medium", "Tomato": "medium", "Carrot": "medium"},
    "Agra": {"Potato": "high", "Onion": "high", "Tomato": "medium", "Cauliflower": "medium", "Peas": "medium"},
}

# Target clearance / sell ratio profiles
DEMAND_RATIO_RANGES = {
    "high": (0.72, 0.94),
    "medium": (0.42, 0.74),
    "low": (0.18, 0.48),
}

# Dates with localized demand spikes (festive periods, religious fasts, weekend mandi peaks)
DEMAND_SPIKE_DATES = {
    datetime.date(2026, 8, 15): 1.15,   # Independence Day weekend market rush
    datetime.date(2026, 8, 28): 1.18,   # Raksha Bandhan / local holiday
    datetime.date(2026, 9, 4): 1.22,    # Janmashtami (high potato/fruit/fasting demand)
    datetime.date(2026, 9, 17): 1.12,   # Vishwakarma Puja
    datetime.date(2026, 10, 2): 1.14,   # Gandhi Jayanti / Gandhi Ashram holiday
    datetime.date(2026, 10, 11): 1.25,  # Navratri commencement (high potato & tomato demand)
    datetime.date(2026, 10, 18): 1.20,  # Navratri Ashtami
    datetime.date(2026, 10, 20): 1.24,  # Dussehra / Vijayadashami
}

# Monsoon disruption dates in August causing transport delays (reduced listed supply, firmer prices)
SUPPLY_SHOCK_DATES = {
    datetime.date(2026, 8, 8): 0.76,    # Heavy rainfall transit disruption
    datetime.date(2026, 8, 21): 0.80,   # Localized waterlogging
    datetime.date(2026, 9, 12): 0.84,   # Post-monsoon flash rains
}


def get_seasonal_factor(crop: str, day_index: int, total_days: int = 90) -> tuple[float, float]:
    """
    Returns (supply_multiplier, price_multiplier) based on the crop's seasonal
    progression through August (monsoon end) -> October (early winter arrival).
    """
    t = day_index / float(total_days - 1)  # 0.0 (Aug 1) to 1.0 (Oct 29)

    if crop == "Peas":
        # August: Off-season scarce supply, high price (up to ₹90-100).
        # October: Early winter arrivals, supply jumps, price gradually softens.
        supply_mult = 0.65 + 0.65 * (t ** 1.5)
        price_mult = 1.35 - 0.50 * t
    elif crop == "Okra":
        # August: Peak monsoon harvest (plentiful supply, lower prices).
        # October: Season begins winding down, supply drops, price climbs.
        supply_mult = 1.25 - 0.45 * t
        price_mult = 0.85 + 0.40 * (t ** 1.2)
    elif crop == "Cauliflower" or crop == "Cabbage":
        # August: Late monsoon curd/head rot risk, moderate supply.
        # October: Weather cools, festive consumption rises, supply and demand both grow.
        supply_mult = 0.85 + 0.35 * t
        price_mult = 1.10 - 0.18 * (t ** 0.8) + 0.10 * math.sin(t * math.pi)
    elif crop == "Spinach":
        # August: Monsoon humidity makes greens perish quickly, lower supply.
        # October: Classic UP winter leafy vegetable season begins, demand surges.
        supply_mult = 0.80 + 0.45 * t
        price_mult = 1.15 - 0.25 * t
    elif crop == "Carrot":
        # August: Early off-season roots.
        # October: New desi winter red carrots start arriving.
        supply_mult = 0.85 + 0.40 * t
        price_mult = 1.12 - 0.22 * t
    elif crop == "Tomato":
        # Late August / Early September: Monsoon transport bottlenecks cause brief price spikes.
        # Mid-to-late October: Stabilizes.
        bump = 0.22 * math.exp(-((day_index - 32) ** 2) / 120.0)  # Spike around late Aug / early Sep
        supply_mult = 1.0 - 0.18 * bump
        price_mult = 1.0 + 0.35 * bump - 0.08 * t
    elif crop == "Onion":
        # Steady supply with gradual festive replenishment in October before Kharif harvest.
        supply_mult = 0.95 + 0.10 * math.sin(t * math.pi)
        price_mult = 0.96 + 0.18 * t
    elif crop == "Potato":
        # Highly stable cold-storage releases, slight rise during Navratri fasting.
        navratri_bump = 0.10 if (65 <= day_index <= 80) else 0.0
        supply_mult = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
        price_mult = 0.98 + navratri_bump
    else:  # Brinjal
        supply_mult = 1.0 + 0.10 * math.sin(t * math.pi)
        price_mult = 1.0 - 0.05 * t

    return supply_mult, price_mult


def generate_market_record(current_date: datetime.date, day_index: int,
                           district: str, city: str, crop: str) -> dict:
    """
    Generates a single consistent, realistic record for one crop in one city on one date.
    """
    spec = CROP_SPECS[crop]
    is_major = city in MAJOR_CITIES

    # 1. Base Listed Quantity
    base_qty = spec["base_vol_major"] if is_major else spec["base_vol_minor"]

    # City-specific minor scale variation (reproducible seed hash)
    city_hash = hash(city) % 100
    city_scale = 0.88 + (city_hash / 100.0) * 0.24  # 0.88 to 1.12

    # Seasonal factors
    season_supply, season_price = get_seasonal_factor(crop, day_index, NUM_DAYS)

    # Weekly cycle: Mandi supply & consumption peaks around weekends (Fri/Sat/Sun) and Wednesday
    weekday = current_date.weekday()  # 0=Mon, 6=Sun
    if weekday in (5, 6):  # Weekend
        weekly_supply = 1.12
        weekly_demand = 1.15
    elif weekday == 2:     # Wednesday mid-week mandi
        weekly_supply = 1.08
        weekly_demand = 1.06
    elif weekday == 0:     # Monday quiet restart
        weekly_supply = 0.92
        weekly_demand = 0.90
    else:
        weekly_supply = 1.0
        weekly_demand = 1.0

    # External shocks
    supply_shock = SUPPLY_SHOCK_DATES.get(current_date, 1.0)
    demand_spike = DEMAND_SPIKE_DATES.get(current_date, 1.0)

    # Random noise (mild, realistic fluctuation)
    supply_noise = random.uniform(0.92, 1.08)
    demand_noise = random.uniform(0.94, 1.06)

    # Calculate quantity_listed_kg
    quantity_listed = int(round(base_qty * city_scale * season_supply * weekly_supply * supply_shock * supply_noise))
    # Ensure realistic minimum volume
    quantity_listed = max(350, quantity_listed)

    # 2. Demand Level & Selling Ratio
    demand_level = DISTRICT_CROP_DEMAND.get(district, {}).get(crop, spec["default_demand"])
    ratio_min, ratio_max = DEMAND_RATIO_RANGES[demand_level]

    # Effective sell ratio
    base_ratio = random.uniform(ratio_min, ratio_max)
    effective_ratio = base_ratio * weekly_demand * demand_spike * demand_noise

    # Adjust for supply pressure: if supply is severely restricted, clearance ratio increases
    if supply_shock < 1.0:
        effective_ratio += (1.0 - supply_shock) * 0.20

    # Strict clamping: 15% to 96% sold, ensuring both sold and available quantities are strictly positive
    effective_ratio = max(0.15, min(0.96, effective_ratio))

    quantity_sold = int(round(quantity_listed * effective_ratio))
    # Safety boundary guarantees
    quantity_sold = max(1, min(quantity_listed - 1, quantity_sold))
    available_quantity = quantity_listed - quantity_sold

    # 3. Average Price Calculation (Coupled to supply, demand, and season)
    base_price = spec["price_base"]

    # Micro location adjustment: large cities have slightly higher logistics costs & purchasing power
    loc_factor = 1.05 if is_major else 0.97

    # Supply/Demand elasticities
    # Oversupply depresses price; supply scarcity raises price
    supply_dev = (quantity_listed / (base_qty * city_scale)) - 1.0
    demand_dev = effective_ratio - 0.60

    price_calc = base_price * season_price * loc_factor * (1.0 - 0.22 * supply_dev + 0.28 * demand_dev)
    # Add day-to-day mild market noise
    price_calc *= random.uniform(0.95, 1.05)

    # Clamp price strictly within specified realistic bounds
    price_min = spec["price_min"]
    price_max = spec["price_max"]
    final_price = round(max(price_min, min(price_max, price_calc)), 2)

    # 4. Number of Orders
    # Typical agricultural transaction lot sizes in UP mandis: 20kg to 45kg per order
    # (institutional buyers, bulk grocers, retail crates)
    avg_order_size = random.uniform(22.0, 42.0)
    number_of_orders = max(1, int(round(quantity_sold / avg_order_size)))

    return {
        "date": current_date.strftime("%Y-%m-%d"),
        "district": district,
        "city": city,
        "crop": crop,
        "quantity_listed_kg": quantity_listed,
        "quantity_sold_kg": quantity_sold,
        "available_quantity_kg": available_quantity,
        "number_of_orders": number_of_orders,
        "average_price_per_kg": final_price,
    }


def validate_dataset(records: list[dict]) -> tuple[bool, list[str]]:
    """
    Performs comprehensive data quality checks on the generated records.
    Returns (is_valid, validation_errors).
    """
    errors = []
    seen_keys = set()

    for idx, row in enumerate(records, start=1):
        # 1. Null / Empty values check
        for col, val in row.items():
            if val is None or str(val).strip() == "":
                errors.append(f"Row {idx}: Column '{col}' is null or empty.")

        # 2. Uniqueness check (date + city + crop)
        key = (row["date"], row["city"], row["crop"])
        if key in seen_keys:
            errors.append(f"Row {idx}: Duplicate record for date={key[0]}, city={key[1]}, crop={key[2]}.")
        seen_keys.add(key)

        # 3. Numeric logic checks
        q_listed = row["quantity_listed_kg"]
        q_sold = row["quantity_sold_kg"]
        q_avail = row["available_quantity_kg"]
        price = row["average_price_per_kg"]
        orders = row["number_of_orders"]

        if q_listed <= 0:
            errors.append(f"Row {idx}: quantity_listed_kg ({q_listed}) must be > 0.")
        if q_sold <= 0:
            errors.append(f"Row {idx}: quantity_sold_kg ({q_sold}) must be > 0.")
        if q_sold > q_listed:
            errors.append(f"Row {idx}: quantity_sold_kg ({q_sold}) > quantity_listed_kg ({q_listed}).")
        if q_avail != (q_listed - q_sold):
            errors.append(f"Row {idx}: available_quantity_kg ({q_avail}) != listed ({q_listed}) - sold ({q_sold}).")
        if price <= 0:
            errors.append(f"Row {idx}: average_price_per_kg ({price}) must be > 0.")
        if orders <= 0:
            errors.append(f"Row {idx}: number_of_orders ({orders}) must be > 0.")

        # Short-circuit error reporting if too many issues
        if len(errors) > 20:
            errors.append("... Validation stopped early due to excessive errors.")
            break

    return len(errors) == 0, errors


def generate_and_save():
    print("=" * 70)
    print("Farm2Market SIH 2026 - Synthetic Dataset Generator")
    print("=" * 70)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    records = []
    crops = list(CROP_SPECS.keys())

    # Build chronological records: Date -> District -> City -> Crop
    for day in range(NUM_DAYS):
        current_date = START_DATE + datetime.timedelta(days=day)
        for district, cities in DISTRICT_CITIES.items():
            for city in cities:
                for crop in crops:
                    rec = generate_market_record(current_date, day, district, city, crop)
                    records.append(rec)

    total_rows = len(records)
    print(f"Generated {total_rows:,} candidate records.")

    # Run Validation
    print("\nRunning comprehensive validation checks...")
    is_valid, validation_errors = validate_dataset(records)

    if not is_valid:
        print("[FAILED] VALIDATION FAILED:")
        for err in validation_errors:
            print(f"  - {err}")
        raise ValueError(f"Dataset validation failed with {len(validation_errors)} error(s).")
    else:
        print("[PASS] Validation passed: 0 errors found.")
        print("  - quantity_sold_kg <= quantity_listed_kg")
        print("  - available_quantity_kg == quantity_listed_kg - quantity_sold_kg")
        print("  - No null or missing values")
        print("  - Zero duplicate (date + city + crop) records")
        print("  - All prices and quantities strictly > 0")

    # Save to CSV
    fieldnames = [
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

    with open(OUTPUT_FILE, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    file_size_kb = os.path.getsize(OUTPUT_FILE) / 1024.0
    print(f"\n[OK] Saved successfully to: {OUTPUT_FILE} ({file_size_kb:.1f} KB)")

    # Compute Summary Statistics
    districts = set(r["district"] for r in records)
    cities = set(r["city"] for r in records)
    crops_set = set(r["crop"] for r in records)
    dates = [r["date"] for r in records]
    prices = [r["average_price_per_kg"] for r in records]
    total_listed = sum(r["quantity_listed_kg"] for r in records)
    total_sold = sum(r["quantity_sold_kg"] for r in records)
    avg_sold_pct = (total_sold / total_listed) * 100.0 if total_listed else 0

    print("\n" + "=" * 70)
    print("DATASET SUMMARY STATISTICS")
    print("=" * 70)
    print(f"Total Rows Generated  : {total_rows:,}")
    print(f"Date Range            : {min(dates)} to {max(dates)} ({NUM_DAYS} days)")
    print(f"Number of Districts   : {len(districts)}")
    print(f"Number of Cities      : {len(cities)}")
    print(f"Number of Crops       : {len(crops_set)}")
    print(f"Price Range (Rs./kg)  : Rs.{min(prices):.2f} to Rs.{max(prices):.2f} (Avg: Rs.{sum(prices)/len(prices):.2f})")
    print(f"Total Quantity Listed : {total_listed:,.0f} kg ({total_listed/1000:,.1f} tonnes)")
    print(f"Total Quantity Sold   : {total_sold:,.0f} kg ({total_sold/1000:,.1f} tonnes)")
    print(f"Overall Clearance Rate: {avg_sold_pct:.1f}%")

    print("\n" + "=" * 70)
    print("SAMPLE RECORDS (First 10 rows)")
    print("=" * 70)
    header_fmt = "{:<11} {:<14} {:<16} {:<12} {:>10} {:>10} {:>10} {:>8} {:>10}"
    row_fmt = "{:<11} {:<14} {:<16} {:<12} {:>10} {:>10} {:>10} {:>8} {:>10.2f}"

    print(header_fmt.format("Date", "District", "City", "Crop", "Listed(kg)", "Sold(kg)", "Avail(kg)", "Orders", "Price(Rs)"))
    print("-" * 105)
    for row in records[:10]:
        print(row_fmt.format(
            row["date"],
            row["district"],
            row["city"],
            row["crop"],
            row["quantity_listed_kg"],
            row["quantity_sold_kg"],
            row["available_quantity_kg"],
            row["number_of_orders"],
            row["average_price_per_kg"]
        ))
    print("-" * 105)


if __name__ == "__main__":
    generate_and_save()
