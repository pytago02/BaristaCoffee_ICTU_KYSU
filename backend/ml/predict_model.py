# ml/predict_model.py
"""
Dùng model đã train để dự đoán revenue, profit, total_order cho một input.
Usage (as script):
  python predict_model.py --month 10 --year 2025 --staff_salary 5000000 --eletricity_bill 800000 ...
Outputs JSON to stdout.
"""

import os
import joblib
import json
import argparse
import numpy as np
import pandas as pd

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

def load_model(name):
    path = os.path.join(MODEL_DIR, f"{name}.joblib")
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    return joblib.load(path)

def build_feature_row(args):
    month = int(args.month)
    year = int(args.year)
    staff_salary = float(args.staff_salary)
    eletricity_bill = float(args.eletricity_bill)
    water_bill = float(args.water_bill)
    rent = float(args.rent)
    other = float(args.other)
    # if optional order-related features provided
    total_revenue_from_orders = float(getattr(args, 'total_revenue_from_orders', 0) or 0)
    total_items_sold = float(getattr(args, 'total_items_sold', 0) or 0)
    avg_order_value = float(getattr(args, 'avg_order_value', 0) or 0)

    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)

    row = {
        'month': month,
        'year': year,
        'staff_salary': staff_salary,
        'eletricity_bill': eletricity_bill,
        'water_bill': water_bill,
        'rent': rent,
        'other': other,
        'total_revenue_from_orders': total_revenue_from_orders,
        'total_items_sold': total_items_sold,
        'avg_order_value': avg_order_value,
        'month_sin': month_sin,
        'month_cos': month_cos
    }
    return pd.DataFrame([row])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--month", required=True)
    parser.add_argument("--year", required=True)
    parser.add_argument("--staff_salary", default=0)
    parser.add_argument("--eletricity_bill", default=0)
    parser.add_argument("--water_bill", default=0)
    parser.add_argument("--rent", default=0)
    parser.add_argument("--other", default=0)
    parser.add_argument("--total_revenue_from_orders", default=0)
    parser.add_argument("--total_items_sold", default=0)
    parser.add_argument("--avg_order_value", default=0)
    args = parser.parse_args()

    X = build_feature_row(args)

    revenue_model = load_model("revenue_model")
    profit_model = load_model("profit_model")
    orders_model = load_model("orders_model")

    pred_revenue = revenue_model.predict(X)[0]
    pred_profit = profit_model.predict(X)[0]
    pred_orders = orders_model.predict(X)[0]

    out = {
        "predicted_revenue": float(pred_revenue),
        "predicted_net_profit": float(pred_profit),
        "predicted_total_order": float(pred_orders)
    }
    print(json.dumps(out))

if __name__ == "__main__":
    main()
