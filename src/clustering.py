import os
import joblib
import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


# ============================================================
# FILE PATHS
# ============================================================

INPUT_FILE = "data/processed/customer_features.csv"

CLUSTER_OUTPUT = "data/processed/customer_clusters.csv"

SUMMARY_OUTPUT = "data/processed/cluster_summary.csv"

SCALER_FILE = "models/scaler.pkl"

KMEANS_FILE = "models/kmeans.pkl"


# ============================================================
# FEATURES USED FOR CUSTOMER BEHAVIOR
# ============================================================

FEATURES = [
    "total_mins",
    "total_calls",
    "avg_mins_per_call",
    "day_mins_share",
    "eve_mins_share",
    "night_mins_share",
    "intl_mins_share",
    "intl_call_rate",
    "vmail_usage_rate",
    "calls_per_day",
    "usage_time_std"
]


def run_clustering():

    print("=" * 60)
    print("CUSTOMER BEHAVIOR - K MEANS CLUSTERING")
    print("=" * 60)

    # ========================================================
    # LOAD DATA
    # ========================================================

    df = pd.read_csv(INPUT_FILE)

    print("\nDataset shape:")
    print(df.shape)

    # ========================================================
    # CHECK FEATURES
    # ========================================================

    missing_features = [
        feature
        for feature in FEATURES
        if feature not in df.columns
    ]

    if missing_features:

        print("\nMissing features:")
        print(missing_features)

        raise ValueError(
            "Some required features are missing."
        )

    print("\nAll clustering features found.")

    # ========================================================
    # SELECT FEATURES
    # ========================================================

    X = df[FEATURES].copy()

    # ========================================================
    # HANDLE MISSING VALUES
    # ========================================================

    X = X.fillna(X.median())

    # ========================================================
    # STANDARDIZATION
    # ========================================================

    print("\nApplying StandardScaler...")

    scaler = StandardScaler()

    X_scaled = scaler.fit_transform(X)

    print("Scaling completed.")

    # ========================================================
    # FIND BEST K USING SILHOUETTE SCORE
    # ========================================================

    print("\nSilhouette Scores:")
    print("-" * 40)

    scores = {}

    for k in range(2, 9):

        model = KMeans(
            n_clusters=k,
            random_state=42,
            n_init=10
        )

        labels = model.fit_predict(X_scaled)

        score = silhouette_score(
            X_scaled,
            labels
        )

        scores[k] = score

        print(
            f"K = {k}   "
            f"Silhouette Score = {score:.4f}"
        )

    # ========================================================
    # USE 5 CUSTOMER SEGMENTS
    # ========================================================

    K = 5

    print("\n")
    print("=" * 60)
    print(f"FINAL K = {K}")
    print("=" * 60)

    kmeans = KMeans(
        n_clusters=K,
        random_state=42,
        n_init=10
    )

    clusters = kmeans.fit_predict(X_scaled)

    df["Cluster"] = clusters

    # ========================================================
    # CREATE DIRECTORIES
    # ========================================================

    os.makedirs("models", exist_ok=True)

    os.makedirs(
        "data/processed",
        exist_ok=True
    )

    # ========================================================
    # SAVE SCALER
    # ========================================================

    joblib.dump(
        scaler,
        SCALER_FILE
    )

    # ========================================================
    # SAVE KMEANS MODEL
    # ========================================================

    joblib.dump(
        kmeans,
        KMEANS_FILE
    )

    # ========================================================
    # SAVE CUSTOMER CLUSTERS
    # ========================================================

    df.to_csv(
        CLUSTER_OUTPUT,
        index=False
    )

    # ========================================================
    # CLUSTER SUMMARY
    # ========================================================

    summary = (
        df.groupby("Cluster")[FEATURES]
        .mean()
        .round(2)
    )

    # Add number of customers

    customer_count = (
        df["Cluster"]
        .value_counts()
        .sort_index()
    )

    summary["Customer_Count"] = customer_count

    # ========================================================
    # SAVE SUMMARY
    # ========================================================

    summary.to_csv(
        SUMMARY_OUTPUT
    )

    # ========================================================
    # DISPLAY RESULTS
    # ========================================================

    print("\nCustomer distribution:")
    print(
        df["Cluster"]
        .value_counts()
        .sort_index()
    )

    print("\nCluster Summary:")
    print(summary)

    print("\nFiles created:")
    print(
        "1.",
        CLUSTER_OUTPUT
    )

    print(
        "2.",
        SUMMARY_OUTPUT
    )

    print(
        "3.",
        SCALER_FILE
    )

    print(
        "4.",
        KMEANS_FILE
    )

    print("\nK-Means clustering completed successfully!")


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    run_clustering()