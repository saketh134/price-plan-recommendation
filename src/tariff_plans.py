import os
import pandas as pd


INPUT_FILE = "data/processed/cluster_summary.csv"
OUTPUT_FILE = "data/plans/tariff_plans.csv"


# Five levels for every customer segment
PLAN_LEVELS = [
    ("Basic", 0.80),
    ("Standard", 1.00),
    ("Plus", 1.25),
    ("Premium", 1.50),
    ("Ultra", 2.00)
]


def create_tariff_plans():

    print("=" * 60)
    print("TARIFF PLAN GENERATION")
    print("=" * 60)

    # Load cluster behavior
    df = pd.read_csv(INPUT_FILE)

    print("\nClusters found:", len(df))

    # We need exactly 5 clusters
    if len(df) != 5:
        raise ValueError(
            f"Expected 5 clusters, but found {len(df)}. "
            "Run K-Means with K=5 first."
        )

    required_columns = [
        "Cluster",
        "total_mins",
        "total_calls",
        "day_mins_share",
        "eve_mins_share",
        "night_mins_share",
        "intl_mins_share"
    ]

    missing = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing:
        raise ValueError(
            f"Missing columns: {missing}"
        )

    plans = []

    plan_number = 1

    # ========================================================
    # CREATE 5 PLANS FOR EACH OF 5 CLUSTERS
    # ========================================================

    for _, cluster in df.iterrows():

        cluster_id = int(cluster["Cluster"])

        total_mins = cluster["total_mins"]

        total_calls = cluster["total_calls"]

        day_share = cluster["day_mins_share"]

        eve_share = cluster["eve_mins_share"]

        night_share = cluster["night_mins_share"]

        intl_share = cluster["intl_mins_share"]

        # Average usage of this customer segment
        base_day = total_mins * day_share
        base_evening = total_mins * eve_share
        base_night = total_mins * night_share
        base_intl = total_mins * intl_share

        # Create Basic, Standard, Plus, Premium, Ultra
        for level, multiplier in PLAN_LEVELS:

            # 15% safety buffer
            day_allowance = base_day * multiplier * 1.15
            evening_allowance = base_evening * multiplier * 1.15
            night_allowance = base_night * multiplier * 1.15
            intl_allowance = base_intl * multiplier * 1.20

            # Minimum international allowance
            intl_allowance = max(intl_allowance, 5)

            # Round allowances
            day_allowance = round(day_allowance / 10) * 10
            evening_allowance = round(evening_allowance / 10) * 10
            night_allowance = round(night_allowance / 10) * 10
            intl_allowance = round(intl_allowance)

            # Calculate monthly price
            price = (
                99
                + day_allowance * 0.20
                + evening_allowance * 0.12
                + night_allowance * 0.10
                + intl_allowance * 2.5
            )

            # Round price to nearest ₹50
            price = round(price / 50) * 50

            # Minimum price
            price = max(price, 199)

            plans.append({
                "Plan_ID": f"P{plan_number:02d}",
                "Cluster": cluster_id,
                "Plan_Level": level,
                "Monthly_Price": int(price),
                "Day_Allowance_Mins": int(day_allowance),
                "Evening_Allowance_Mins": int(evening_allowance),
                "Night_Allowance_Mins": int(night_allowance),
                "International_Allowance_Mins": int(intl_allowance),
                "Target_Total_Calls": int(
                    total_calls * multiplier
                )
            })

            plan_number += 1

    # ========================================================
    # CREATE DATAFRAME
    # ========================================================

    plans_df = pd.DataFrame(plans)

    # ========================================================
    # CHECK EXACTLY 25 PLANS
    # ========================================================

    if len(plans_df) != 25:
        raise ValueError(
            f"Expected 25 plans, "
            f"but generated {len(plans_df)}"
        )

    # ========================================================
    # SAVE
    # ========================================================

    os.makedirs(
        "data/plans",
        exist_ok=True
    )

    plans_df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    # ========================================================
    # DISPLAY
    # ========================================================

    print("\nSUCCESS!")

    print(
        "Total plans:",
        len(plans_df)
    )

    print("\nPlans per cluster:")

    print(
        plans_df
        .groupby("Cluster")
        .size()
    )

    print("\nGenerated Plans:")

    print(
        plans_df.to_string(index=False)
    )

    print(
        "\nSaved to:",
        OUTPUT_FILE
    )


if __name__ == "__main__":
    create_tariff_plans()