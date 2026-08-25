import pandas as pd


INPUT_FILE = "data/processed/cluster_summary.csv"


def analyze_clusters():

    print("=" * 70)
    print("CUSTOMER CLUSTER ANALYSIS")
    print("=" * 70)

    df = pd.read_csv(INPUT_FILE)

    print("\nCluster Summary:")
    print(df.to_string(index=False))

    print("\n" + "=" * 70)
    print("CUSTOMER BEHAVIOR")
    print("=" * 70)

    for _, row in df.iterrows():

        cluster = int(row["Cluster"])

        total_mins = row["total_mins"]
        total_calls = row["total_calls"]

        day_share = row["day_mins_share"]
        eve_share = row["eve_mins_share"]
        night_share = row["night_mins_share"]
        intl_share = row["intl_mins_share"]

        # Find dominant usage period
        periods = {
            "Day": day_share,
            "Evening": eve_share,
            "Night": night_share,
            "International": intl_share
        }

        dominant_period = max(
            periods,
            key=periods.get
        )

        # Determine usage level
        if total_mins < 300:
            usage_level = "Low Usage"
        elif total_mins < 600:
            usage_level = "Medium Usage"
        else:
            usage_level = "High Usage"

        print(f"\nCluster {cluster}")
        print("-" * 40)

        print(
            f"Customers: "
            f"{int(row['Customer_Count'])}"
        )

        print(
            f"Total Usage: "
            f"{total_mins:.2f} mins"
        )

        print(
            f"Total Calls: "
            f"{total_calls:.2f}"
        )

        print(
            f"Day Usage: "
            f"{day_share * 100:.2f}%"
        )

        print(
            f"Evening Usage: "
            f"{eve_share * 100:.2f}%"
        )

        print(
            f"Night Usage: "
            f"{night_share * 100:.2f}%"
        )

        print(
            f"International Usage: "
            f"{intl_share * 100:.2f}%"
        )

        print(
            f"Usage Level: "
            f"{usage_level}"
        )

        print(
            f"Dominant Usage: "
            f"{dominant_period}"
        )


if __name__ == "__main__":
    analyze_clusters()