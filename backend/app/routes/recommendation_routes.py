from fastapi import APIRouter, HTTPException
import pandas as pd
from pathlib import Path


router = APIRouter()


# ============================================================
# FILE PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

CUSTOMER_FILE = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "customer_clusters.csv"
)

PLAN_FILE = (
    PROJECT_ROOT
    / "data"
    / "plans"
    / "tariff_plans.csv"
)


# ============================================================
# HELPERS
# ============================================================

def safe_float(value, default=0.0):

    try:

        if pd.isna(value):
            return default

        return float(value)

    except (
        ValueError,
        TypeError
    ):

        return default


def safe_int(value, default=0):

    try:

        if pd.isna(value):
            return default

        return int(float(value))

    except (
        ValueError,
        TypeError
    ):

        return default


def get_value(
    row,
    *columns,
    default=0
):

    for column in columns:

        if column in row.index:

            value = row[column]

            if not pd.isna(value):

                return value

    return default


# ============================================================
# CUSTOMER NORMALIZATION
# ============================================================

def build_customer(row):

    phone_number = str(
        get_value(
            row,
            "Phone Number",
            "phone_number",
            "phone",
            default=""
        )
    )

    customer_id = get_value(
        row,
        "Customer ID",
        "Customer_ID",
        "customer_id",
        "id",
        default=""
    )

    account_length = safe_int(
        get_value(
            row,
            "Account Length",
            "account_length",
            default=0
        )
    )

    day_minutes = safe_float(
        get_value(
            row,
            "Day Mins",
            "day_minutes",
            default=0
        )
    )

    evening_minutes = safe_float(
        get_value(
            row,
            "Eve Mins",
            "Evening Mins",
            "evening_minutes",
            default=0
        )
    )

    night_minutes = safe_float(
        get_value(
            row,
            "Night Mins",
            "night_minutes",
            default=0
        )
    )

    international_minutes = safe_float(
        get_value(
            row,
            "Intl Mins",
            "International Mins",
            "international_minutes",
            default=0
        )
    )

    day_calls = safe_int(
        get_value(
            row,
            "Day Calls",
            "day_calls",
            default=0
        )
    )

    evening_calls = safe_int(
        get_value(
            row,
            "Eve Calls",
            "Evening Calls",
            "evening_calls",
            default=0
        )
    )

    night_calls = safe_int(
        get_value(
            row,
            "Night Calls",
            "night_calls",
            default=0
        )
    )

    international_calls = safe_int(
        get_value(
            row,
            "Intl Calls",
            "International Calls",
            "international_calls",
            default=0
        )
    )

    voicemail_messages = safe_int(
        get_value(
            row,
            "VMail Message",
            "Voicemail",
            "Voicemail Messages",
            "voicemail",
            default=0
        )
    )

    day_charge = safe_float(
        get_value(
            row,
            "Day Charge",
            "day_charge",
            default=0
        )
    )

    evening_charge = safe_float(
        get_value(
            row,
            "Eve Charge",
            "Evening Charge",
            "evening_charge",
            default=0
        )
    )

    night_charge = safe_float(
        get_value(
            row,
            "Night Charge",
            "night_charge",
            default=0
        )
    )

    international_charge = safe_float(
        get_value(
            row,
            "Intl Charge",
            "International Charge",
            "international_charge",
            default=0
        )
    )

    customer_service_calls = safe_int(
        get_value(
            row,
            "CustServ Calls",
            "Customer Service Calls",
            "customer_service_calls",
            default=0
        )
    )

    cluster = safe_int(
        get_value(
            row,
            "Cluster",
            "cluster",
            default=0
        )
    )

    churn = get_value(
        row,
        "Churn",
        "churn",
        default="0"
    )

    current_plan = get_value(
        row,
        "Plan",
        "Current Plan",
        "current_plan",
        default=""
    )


    # ========================================================
    # USAGE
    # ========================================================

    usage = {

        "day_minutes":
            day_minutes,

        "evening_minutes":
            evening_minutes,

        "night_minutes":
            night_minutes,

        "international_minutes":
            international_minutes,

        "total_minutes":
            round(
                day_minutes
                + evening_minutes
                + night_minutes
                + international_minutes,
                2
            ),

    }


    # ========================================================
    # CALLS
    # ========================================================

    calls = {

        "day_calls":
            day_calls,

        "evening_calls":
            evening_calls,

        "night_calls":
            night_calls,

        "international_calls":
            international_calls,

        "voicemail_messages":
            voicemail_messages,

        "total_calls":
            (
                day_calls
                + evening_calls
                + night_calls
                + international_calls
            ),

    }


    # ========================================================
    # CHARGES
    # ========================================================

    charges = {

        "day_charge":
            day_charge,

        "evening_charge":
            evening_charge,

        "night_charge":
            night_charge,

        "international_charge":
            international_charge,

        "total_charge":
            round(
                day_charge
                + evening_charge
                + night_charge
                + international_charge,
                2
            ),

    }


    # ========================================================
    # SERVICES
    # ========================================================

    services = {

        "customer_service_calls":
            customer_service_calls,

    }


    # ========================================================
    # COMPLETE CUSTOMER
    # ========================================================

    return {

        "customer_id":
            customer_id,

        "phone_number":
            phone_number,

        "account_length":
            account_length,

        "cluster":
            cluster,

        "churn":
            str(churn),

        "current_plan":
            current_plan,

        # Flattened values
        "day_minutes":
            day_minutes,

        "evening_minutes":
            evening_minutes,

        "night_minutes":
            night_minutes,

        "international_minutes":
            international_minutes,

        "day_calls":
            day_calls,

        "evening_calls":
            evening_calls,

        "night_calls":
            night_calls,

        "international_calls":
            international_calls,

        "voicemail_messages":
            voicemail_messages,

        "day_charge":
            day_charge,

        "evening_charge":
            evening_charge,

        "night_charge":
            night_charge,

        "international_charge":
            international_charge,

        "customer_service_calls":
            customer_service_calls,

        # Nested values
        "usage":
            usage,

        "calls":
            calls,

        "charges":
            charges,

        "services":
            services,

    }


# ============================================================
# PLAN SCORE
# ============================================================

def calculate_score(
    customer,
    plan
):

    day_usage = safe_float(
        customer.get(
            "day_minutes",
            0
        )
    )

    evening_usage = safe_float(
        customer.get(
            "evening_minutes",
            0
        )
    )

    night_usage = safe_float(
        customer.get(
            "night_minutes",
            0
        )
    )

    international_usage = safe_float(
        customer.get(
            "international_minutes",
            0
        )
    )


    day_limit = max(
        safe_float(
            plan.get(
                "Day_Allowance_Mins",
                0
            )
        ),
        1
    )

    evening_limit = max(
        safe_float(
            plan.get(
                "Evening_Allowance_Mins",
                0
            )
        ),
        1
    )

    night_limit = max(
        safe_float(
            plan.get(
                "Night_Allowance_Mins",
                0
            )
        ),
        1
    )

    international_limit = max(
        safe_float(
            plan.get(
                "International_Allowance_Mins",
                0
            )
        ),
        1
    )


    # ========================================================
    # COVERAGE
    # ========================================================

    day_coverage = min(
        day_usage / day_limit,
        1
    )

    evening_coverage = min(
        evening_usage / evening_limit,
        1
    )

    night_coverage = min(
        night_usage / night_limit,
        1
    )

    international_coverage = min(
        international_usage
        / international_limit,
        1
    )


    # ========================================================
    # WEIGHTED USAGE SCORE
    # ========================================================

    usage_score = (

        day_coverage * 0.30

        + evening_coverage * 0.20

        + night_coverage * 0.30

        + international_coverage * 0.20

    ) * 100


    # ========================================================
    # EXCESS USAGE PENALTY
    # ========================================================

    excess = 0

    if day_usage > day_limit:

        excess += (
            day_usage
            - day_limit
        )

    if evening_usage > evening_limit:

        excess += (
            evening_usage
            - evening_limit
        )

    if night_usage > night_limit:

        excess += (
            night_usage
            - night_limit
        )

    if international_usage > international_limit:

        excess += (
            international_usage
            - international_limit
        )


    excess_penalty = min(
        excess * 0.10,
        40
    )


    # ========================================================
    # PRICE SCORE
    # ========================================================

    monthly_price = safe_float(
        plan.get(
            "Monthly_Price",
            0
        )
    )

    price_score = max(
        0,
        100 - (
            monthly_price / 10
        )
    )


    # ========================================================
    # FINAL SCORE
    # ========================================================

    final_score = (

        usage_score * 0.70

        + price_score * 0.30

        - excess_penalty

    )


    return round(
        max(
            0,
            min(
                100,
                final_score
            )
        ),
        2
    )


# ============================================================
# PLAN REASON
# ============================================================

def get_reason(
    customer,
    plan
):

    reasons = []


    if (
        customer["day_minutes"]
        <= safe_float(
            plan.get(
                "Day_Allowance_Mins",
                0
            )
        )
    ):

        reasons.append(
            "Day usage covered"
        )


    if (
        customer["evening_minutes"]
        <= safe_float(
            plan.get(
                "Evening_Allowance_Mins",
                0
            )
        )
    ):

        reasons.append(
            "Evening usage covered"
        )


    if (
        customer["night_minutes"]
        <= safe_float(
            plan.get(
                "Night_Allowance_Mins",
                0
            )
        )
    ):

        reasons.append(
            "Night usage covered"
        )


    if (
        customer["international_minutes"]
        <= safe_float(
            plan.get(
                "International_Allowance_Mins",
                0
            )
        )
    ):

        reasons.append(
            "International usage covered"
        )


    if not reasons:

        reasons.append(
            "Higher allowance may be required"
        )


    return ", ".join(
        reasons
    )


# ============================================================
# PLAN NORMALIZATION
# ============================================================

def build_plan(plan):

    return {

        "plan_id":
            str(
                plan.get(
                    "Plan_ID",
                    ""
                )
            ),

        "plan_level":
            str(
                plan.get(
                    "Plan_Level",
                    ""
                )
            ),

        "monthly_price":
            safe_float(
                plan.get(
                    "Monthly_Price",
                    0
                )
            ),

        "day_allowance":
            safe_float(
                plan.get(
                    "Day_Allowance_Mins",
                    0
                )
            ),

        "evening_allowance":
            safe_float(
                plan.get(
                    "Evening_Allowance_Mins",
                    0
                )
            ),

        "night_allowance":
            safe_float(
                plan.get(
                    "Night_Allowance_Mins",
                    0
                )
            ),

        "international_allowance":
            safe_float(
                plan.get(
                    "International_Allowance_Mins",
                    0
                )
            ),

    }


# ============================================================
# MAIN RECOMMENDATION API
# ============================================================

@router.get("/{phone_number}")
def recommend(
    phone_number: str
):

    # ========================================================
    # LOAD CUSTOMER DATA
    # ========================================================

    if not CUSTOMER_FILE.exists():

        raise HTTPException(
            status_code=500,
            detail=(
                "Customer dataset not found: "
                f"{CUSTOMER_FILE}"
            )
        )


    if not PLAN_FILE.exists():

        raise HTTPException(
            status_code=500,
            detail=(
                "Tariff plan dataset not found: "
                f"{PLAN_FILE}"
            )
        )


    try:

        customers = pd.read_csv(
            CUSTOMER_FILE
        )

        plans = pd.read_csv(
            PLAN_FILE
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load datasets: "
                f"{error}"
            )
        )


    # ========================================================
    # FIND CUSTOMER
    # ========================================================

    phone_column = None

    for column in [
        "Phone Number",
        "phone_number",
        "phone"
    ]:

        if column in customers.columns:

            phone_column = column
            break


    if phone_column is None:

        raise HTTPException(
            status_code=500,
            detail=(
                "Phone Number column is missing "
                "from customer dataset."
            )
        )


    customer_rows = customers[
        customers[
            phone_column
        ].astype(str).str.strip()
        == str(phone_number).strip()
    ]


    if customer_rows.empty:

        raise HTTPException(
            status_code=404,
            detail=(
                f"Customer {phone_number} "
                "not found in dataset."
            )
        )


    customer_row = (
        customer_rows.iloc[0]
    )


    customer = build_customer(
        customer_row
    )


    # ========================================================
    # GENERATE ALL PLAN RESULTS
    # ========================================================

    results = []


    for _, plan_row in plans.iterrows():

        score = calculate_score(
            customer,
            plan_row
        )

        normalized_plan = build_plan(
            plan_row
        )

        normalized_plan[
            "suitability_score"
        ] = score

        normalized_plan[
            "reason"
        ] = get_reason(
            customer,
            plan_row
        )

        results.append(
            normalized_plan
        )


    # ========================================================
    # SORT BY SCORE
    # ========================================================

    results.sort(
        key=lambda item:
            item.get(
                "suitability_score",
                0
            ),
        reverse=True
    )


    # ========================================================
    # TOP 3
    # ========================================================

    recommendations = (
        results[:3]
    )


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "success":
            True,

        "phone_number":
            phone_number,

        "customer":
            customer,

        "usage":
            customer["usage"],

        "calls":
            customer["calls"],

        "services":
            customer["services"],

        "charges":
            customer["charges"],

        "cluster":
            customer["cluster"],

        "recommendations":
            recommendations,

        "all_plans":
            results,

        "total_plans":
            len(results),

    }