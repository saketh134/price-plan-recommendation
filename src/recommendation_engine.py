import os
import pandas as pd


CUSTOMER_FILE = "data/processed/customer_clusters.csv"
PLAN_FILE = "data/plans/tariff_plans.csv"
OUTPUT_FILE = "outputs/recommendations.csv"


def calculate_score(customer, plan):

    # Customer actual usage
    day_usage = customer["Day Mins"]
    eve_usage = customer["Eve Mins"]
    night_usage = customer["Night Mins"]
    intl_usage = customer["Intl Mins"]

    # Plan allowances
    day_limit = plan["Day_Allowance_Mins"]
    eve_limit = plan["Evening_Allowance_Mins"]
    night_limit = plan["Night_Allowance_Mins"]
    intl_limit = plan["International_Allowance_Mins"]

    # Avoid division by zero
    day_limit = max(day_limit, 1)
    eve_limit = max(eve_limit, 1)
    night_limit = max(night_limit, 1)
    intl_limit = max(intl_limit, 1)

    # Coverage
    day_coverage = min(day_usage / day_limit, 1)
    eve_coverage = min(eve_usage / eve_limit, 1)
    night_coverage = min(night_usage / night_limit, 1)
    intl_coverage = min(intl_usage / intl_limit, 1)

    # Weighted usage score
    coverage_score = (
        day_coverage * 0.30
        + eve_coverage * 0.20
        + night_coverage * 0.30
        + intl_coverage * 0.20
    ) * 100

    # Calculate excess usage
    excess = 0

    if day_usage > day_limit:
        excess += day_usage - day_limit

    if eve_usage > eve_limit:
        excess += eve_usage - eve_limit

    if night_usage > night_limit:
        excess += night_usage - night_limit

    if intl_usage > intl_limit:
        excess += intl_usage - intl_limit

    # Penalty for insufficient allowance
    excess_penalty = min(
        excess * 0.10,
        40
    )

    # Price score
    price = plan["Monthly_Price"]

    price_score = max(
        0,
        100 - (price / 10)
    )

    # Final score
    final_score = (
        coverage_score * 0.70
        + price_score * 0.30
        - excess_penalty
    )

    final_score = max(
        0,
        min(100, final_score)
    )

    return round(final_score, 2)


def get_reason(customer, plan):

    reasons = []

    if customer["Day Mins"] <= plan["Day_Allowance_Mins"]:
        reasons.append("Day usage covered")

    if customer["Eve Mins"] <= plan["Evening_Allowance_Mins"]:
        reasons.append("Evening usage covered")

    if customer["Night Mins"] <= plan["Night_Allowance_Mins"]:
        reasons.append("Night usage covered")

    if customer["Intl Mins"] <= plan["International_Allowance_Mins"]:
        reasons.append("International usage covered")

    if not reasons:
        reasons.append("Plan requires higher allowance")

    return ", ".join(reasons)


def recommend_customer(customer_id):

    print("\nLoading customer data...")

    customers = pd.read_csv(
        CUSTOMER_FILE
    )

    print("Loading tariff plans...")

    plans = pd.read_csv(
        PLAN_FILE
    )

    # Find customer
    customer_rows = customers[
        customers["Phone Number"].astype(str)
        == str(customer_id)
    ]

    if customer_rows.empty:

        print(
            f"\nCustomer '{customer_id}' was not found."
        )

        print(
            "\nPlease enter a Phone Number that exists in:"
        )

        print(
            CUSTOMER_FILE
        )

        return

    customer = customer_rows.iloc[0]

    recommendations = []

    # Compare against all plans
    for _, plan in plans.iterrows():

        score = calculate_score(
            customer,
            plan
        )

        reason = get_reason(
            customer,
            plan
        )

        recommendations.append({

            "Phone_Number":
                customer_id,

            "Customer_Cluster":
                int(customer["Cluster"]),

            "Plan_ID":
                plan["Plan_ID"],

            "Plan_Level":
                plan["Plan_Level"],

            "Monthly_Price":
                plan["Monthly_Price"],

            "Suitability_Score":
                score,

            "Reason":
                reason
        })

    result = pd.DataFrame(
        recommendations
    )

    # Rank plans
    result = result.sort_values(
        by="Suitability_Score",
        ascending=False
    )

    # Select Top 3
    top_3 = result.head(3).copy()

    top_3["Rank"] = [1, 2, 3]

    # Create output directory
    os.makedirs(
        "outputs",
        exist_ok=True
    )

    # Save recommendations
    top_3.to_csv(
        OUTPUT_FILE,
        index=False
    )

    # Display result
    print("\n")
    print("=" * 70)
    print("PERSONALIZED PRICE PLAN RECOMMENDATION")
    print("=" * 70)

    print(
        "\nCustomer:",
        customer_id
    )

    print(
        "Customer Cluster:",
        int(customer["Cluster"])
    )

    print("\nCUSTOMER USAGE")
    print("-" * 70)

    print(
        "Day Minutes:",
        round(customer["Day Mins"], 2)
    )

    print(
        "Evening Minutes:",
        round(customer["Eve Mins"], 2)
    )

    print(
        "Night Minutes:",
        round(customer["Night Mins"], 2)
    )

    print(
        "International Minutes:",
        round(customer["Intl Mins"], 2)
    )

    print("\nTOP 3 RECOMMENDED PLANS")
    print("-" * 70)

    for _, row in top_3.iterrows():

        print(
            f"\nRank {int(row['Rank'])}"
        )

        print(
            "Plan ID:",
            row["Plan_ID"]
        )

        print(
            "Plan Level:",
            row["Plan_Level"]
        )

        print(
            "Monthly Price: ₹",
            int(row["Monthly_Price"])
        )

        print(
            "Suitability Score:",
            row["Suitability_Score"],
            "%"
        )

        print(
            "Reason:",
            row["Reason"]
        )

    print("\n")
    print("=" * 70)

    print(
        "Recommendations saved to:"
    )

    print(
        OUTPUT_FILE
    )

    print("=" * 70)


if __name__ == "__main__":

    customer_id = input(
        "Enter customer phone number: "
    ).strip()

    recommend_customer(
        customer_id
    )