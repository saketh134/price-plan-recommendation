import os
import pandas as pd

INPUT_FILE = "data/raw/final_use_data.csv"

OUTPUT_FILE = "data/processed/customer_features.csv"


def feature_engineering():

    print("=" * 60)
    print("FEATURE ENGINEERING")
    print("=" * 60)

    # ---------------------------------------------------------
    # Load dataset
    # ---------------------------------------------------------

    df = pd.read_csv(INPUT_FILE)

    print("\nOriginal shape:")
    print(df.shape)

    print("\nOriginal columns:")
    print(df.columns.tolist())

    # ---------------------------------------------------------
    # Required engineered features
    # ---------------------------------------------------------

    required_features = [
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
        "peak_period_share",
        "usage_time_std",
        "total_charge",
        "charge_per_min"
    ]

    # ---------------------------------------------------------
    # Check features
    # ---------------------------------------------------------

    missing_features = [
        feature
        for feature in required_features
        if feature not in df.columns
    ]

    if missing_features:

        print("\nMissing engineered features:")

        print(missing_features)

        raise ValueError(
            "Feature engineering cannot continue."
        )

    print("\nAll engineered features are available.")

    # ---------------------------------------------------------
    # Convert engineered features to numeric
    # ---------------------------------------------------------

    for feature in required_features:

        df[feature] = pd.to_numeric(
            df[feature],
            errors="coerce"
        )

    # ---------------------------------------------------------
    # Check missing values
    # ---------------------------------------------------------

    print("\nMissing values:")

    print(
        df[required_features]
        .isnull()
        .sum()
    )

    # ---------------------------------------------------------
    # Fill missing values with median
    # ---------------------------------------------------------

    for feature in required_features:

        median_value = df[feature].median()

        df[feature] = df[feature].fillna(
            median_value
        )

    # ---------------------------------------------------------
    # Remove invalid infinite values
    # ---------------------------------------------------------

    df[required_features] = (
        df[required_features]
        .replace(
            [float("inf"), float("-inf")],
            pd.NA
        )
    )

    # Fill again after replacing infinity

    for feature in required_features:

        median_value = df[feature].median()

        df[feature] = df[feature].fillna(
            median_value
        )

    # ---------------------------------------------------------
    # Create processed directory
    # ---------------------------------------------------------

    os.makedirs(
        "ml/data/processed",
        exist_ok=True
    )

    # ---------------------------------------------------------
    # Save
    # ---------------------------------------------------------

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print("\nProcessed dataset saved:")
    print(OUTPUT_FILE)

    print("\nFinal shape:")
    print(df.shape)


if __name__ == "__main__":

    feature_engineering()