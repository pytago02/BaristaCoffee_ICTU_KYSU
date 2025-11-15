# ml/train_model.py
"""
Train regression models for revenue, net_profit, total_order.
Reads DB, prepares features, trains RandomForest models, saves them to disk (joblib).
Usage: python train_model.py
"""

import os
from pathlib import Path
from dotenv import load_dotenv
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import mysql.connector
from datetime import datetime

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# ===== Lấy thông tin DB từ biến môi trường =====
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "doankysu_01")


MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

def get_db_connection():
    return mysql.connector.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME
    )

def load_business_table(conn):
    q = "SELECT * FROM business ORDER BY year, month"
    return pd.read_sql(q, conn)

def aggregate_order_features(conn):
    # Aggregate monthly order features
    q = """
    SELECT 
      YEAR(o.created_at) AS year,
      MONTH(o.created_at) AS month,
      COUNT(DISTINCT o.order_id) AS total_orders,
      SUM(o.total_price) AS total_revenue_from_orders,
      SUM(oi.quantity) AS total_items_sold,
      AVG(o.total_price) AS avg_order_value
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    GROUP BY YEAR(o.created_at), MONTH(o.created_at)
    ORDER BY year, month
    """
    return pd.read_sql(q, conn)

def prepare_feature_df(conn):
    df_bus = load_business_table(conn)
    df_orders = aggregate_order_features(conn)

    if df_bus.empty:
        raise ValueError("No data in business table to train from.")

    # merge by year/month
    df = pd.merge(df_bus, df_orders, how='left', on=['year', 'month'])
    # Fill missing with zeros
    df = df.fillna(0)

    # create cyclical month features (optional)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)

    # Features list — you can adjust
    features = [
        'month', 'year', 'staff_salary', 'eletricity_bill', 'water_bill', 'rent', 'other',
        'total_revenue_from_orders', 'total_items_sold', 'avg_order_value', 'month_sin', 'month_cos'
    ]

    # Targets
    target_revenue = 'revenue'
    target_profit = 'net_profit'
    target_orders = 'total_order'

    X = df[features]
    y_revenue = df[target_revenue]
    y_profit = df[target_profit]
    y_orders = df[target_orders]

    return X, y_revenue, y_profit, y_orders

def train_and_save(model_name, X, y):
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1))
    ])

    pipeline.fit(X_train, y_train)
    score = pipeline.score(X_test, y_test)
    print(f"{model_name} R2 score on test: {score:.4f}")

    model_path = os.path.join(MODEL_DIR, f"{model_name}.joblib")
    joblib.dump(pipeline, model_path)
    print(f"Saved {model_name} -> {model_path}")
    return model_path, score

def main():
    conn = get_db_connection()
    try:
        X, y_revenue, y_profit, y_orders = prepare_feature_df(conn)
        print("Training revenue model...")
        train_and_save("revenue_model", X, y_revenue)

        print("Training profit model...")
        train_and_save("profit_model", X, y_profit)

        print("Training orders model...")
        train_and_save("orders_model", X, y_orders)

    finally:
        conn.close()

if __name__ == "__main__":
    main()
