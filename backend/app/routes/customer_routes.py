from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path
import pandas as pd
import numpy as np

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

# ============================================================
# REQUEST MODEL
# ============================================================


class NewCustomer(BaseModel):
    phone_number: str = Field(..., min_length=3)

    day_minutes: float = Field(
        0,
        ge=0
    )

    evening_minutes: float = Field(
        0,
        ge=0
    )

    night_minutes: float = Field(
        0,
        ge=0
    )

    international_minutes: float = Field(
        0,
        ge=0
    )


# ============================================================
# SAFE FLOAT
# ============================================================


def safe_float(value, default=0.0):

    try:

        if value is None:
            return default

        if pd.isna(value):
            return default

        return float(value)

    except (
        TypeError,
        ValueError
    ):

        return default


# ============================================================
# LOAD DATASET
# ============================================================


def load_customers():

    if not CUSTOMER_FILE.exists():

        raise HTTPException(
            status_code=500,
            detail=(
                f"Customer dataset not found: "
                f"{CUSTOMER_FILE}"
            )
        )

    try:

        return pd.read_csv(
            CUSTOMER_FILE
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to read customer dataset: "
                f"{error}"
            )
        )


# ============================================================
# SAVE DATASET
# ============================================================


def save_customers(customers):

    try:

        CUSTOMER_FILE.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        customers.to_csv(
            CUSTOMER_FILE,
            index=False
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to save customer dataset: "
                f"{error}"
            )
        )


# ============================================================
# NORMALIZE PHONE
# ============================================================


def normalize_phone(phone):

    return (
        str(phone)
        .strip()
        .replace(" ", "")
    )


# ============================================================
# FIND CLUSTER
#
# We calculate the average usage of every existing cluster
# and assign the new customer to the closest cluster.
# ============================================================


def calculate_cluster(
    customers,
    day,
    evening,
    night,
    international
):

    required_columns = [
        "Day Mins",
        "Eve Mins",
        "Night Mins",
        "Intl Mins",
        "Cluster"
    ]

    missing = [
        column
        for column in required_columns
        if column not in customers.columns
    ]

    if missing:

        # If cluster information is unavailable,
        # use a safe default.
        return 0

    working = customers.copy()

    for column in [
        "Day Mins",
        "Eve Mins",
        "Night Mins",
        "Intl Mins",
        "Cluster"
    ]:

        working[column] = pd.to_numeric(
            working[column],
            errors="coerce"
        )

    working = working.dropna(
        subset=[
            "Day Mins",
            "Eve Mins",
            "Night Mins",
            "Intl Mins",
            "Cluster"
        ]
    )

    if working.empty:

        return 0

    usage_columns = [
        "Day Mins",
        "Eve Mins",
        "Night Mins",
        "Intl Mins"
    ]

    # --------------------------------------------------------
    # Calculate mean and standard deviation.
    # Standardization prevents one usage feature from
    # dominating the distance.
    # --------------------------------------------------------

    means = working[
        usage_columns
    ].mean()

    stds = working[
        usage_columns
    ].std()

    stds = stds.replace(
        0,
        1
    )

    working_scaled = (
        working[usage_columns] - means
    ) / stds

    new_customer = pd.Series(
        {
            "Day Mins": day,
            "Eve Mins": evening,
            "Night Mins": night,
            "Intl Mins": international
        }
    )

    new_scaled = (
        new_customer - means
    ) / stds

    working_scaled = working_scaled.copy()

    working_scaled["Cluster"] = (
        working["Cluster"].values
    )

    # --------------------------------------------------------
    # Cluster centroid
    # --------------------------------------------------------

    centroids = (
        working_scaled
        .groupby("Cluster")[usage_columns]
        .mean()
    )

    if centroids.empty:

        return 0

    distances = (
        (centroids - new_scaled)
        .pow(2)
        .sum(axis=1)
        .pow(0.5)
    )

    nearest_cluster = distances.idxmin()

    return int(nearest_cluster)


# ============================================================
# CREATE CUSTOMER ROW
# ============================================================


def build_customer_row(
    customers,
    phone,
    day,
    evening,
    night,
    international,
    cluster
):

    # --------------------------------------------------------
    # Create an empty row using all existing dataset columns.
    # --------------------------------------------------------

    row = {
        column: 0
        for column in customers.columns
    }

    # --------------------------------------------------------
    # PHONE
    # --------------------------------------------------------

    if "Phone Number" in customers.columns:

        row["Phone Number"] = phone

    elif "phone_number" in customers.columns:

        row["phone_number"] = phone

    else:

        row["Phone Number"] = phone

    # --------------------------------------------------------
    # BASIC USAGE
    # --------------------------------------------------------

    if "Day Mins" in customers.columns:
        row["Day Mins"] = day

    if "Eve Mins" in customers.columns:
        row["Eve Mins"] = evening

    if "Night Mins" in customers.columns:
        row["Night Mins"] = night

    if "Intl Mins" in customers.columns:
        row["Intl Mins"] = international

    # --------------------------------------------------------
    # CALL COUNTS
    # --------------------------------------------------------

    if "Day Calls" in customers.columns:
        row["Day Calls"] = 0

    if "Eve Calls" in customers.columns:
        row["Eve Calls"] = 0

    if "Night Calls" in customers.columns:
        row["Night Calls"] = 0

    if "Intl Calls" in customers.columns:
        row["Intl Calls"] = 0

    if "VMail Message" in customers.columns:
        row["VMail Message"] = 0

    if "CustServ Calls" in customers.columns:
        row["CustServ Calls"] = 0

    # --------------------------------------------------------
    # ACCOUNT
    # --------------------------------------------------------

    if "Account Length" in customers.columns:
        row["Account Length"] = 0

    # --------------------------------------------------------
    # TOTAL MINUTES
    # --------------------------------------------------------

    total_minutes = (
        day
        + evening
        + night
        + international
    )

    if "total_mins" in customers.columns:
        row["total_mins"] = total_minutes

    if "total_minutes" in customers.columns:
        row["total_minutes"] = total_minutes

    # --------------------------------------------------------
    # TOTAL CALLS
    # --------------------------------------------------------

    total_calls = 0

    if "total_calls" in customers.columns:
        row["total_calls"] = total_calls

    # --------------------------------------------------------
    # AVERAGE MINUTES PER CALL
    # --------------------------------------------------------

    if "avg_mins_per_call" in customers.columns:

        if total_calls > 0:

            row["avg_mins_per_call"] = (
                total_minutes / total_calls
            )

        else:

            row["avg_mins_per_call"] = 0

    # --------------------------------------------------------
    # USAGE SHARES
    # --------------------------------------------------------

    if total_minutes > 0:

        day_share = (
            day / total_minutes
        )

        evening_share = (
            evening / total_minutes
        )

        night_share = (
            night / total_minutes
        )

        intl_share = (
            international / total_minutes
        )

    else:

        day_share = 0
        evening_share = 0
        night_share = 0
        intl_share = 0

    if "day_mins_share" in customers.columns:
        row["day_mins_share"] = day_share

    if "eve_mins_share" in customers.columns:
        row["eve_mins_share"] = evening_share

    if "night_mins_share" in customers.columns:
        row["night_mins_share"] = night_share

    if "intl_mins_share" in customers.columns:
        row["intl_mins_share"] = intl_share

    # --------------------------------------------------------
    # INTERNATIONAL CALL RATE
    # --------------------------------------------------------

    if "intl_call_rate" in customers.columns:

        row["intl_call_rate"] = 0

    # --------------------------------------------------------
    # VOICEMAIL RATE
    # --------------------------------------------------------

    if "vmail_usage_rate" in customers.columns:

        row["vmail_usage_rate"] = 0

    # --------------------------------------------------------
    # CALLS PER DAY
    # --------------------------------------------------------

    if "calls_per_day" in customers.columns:

        row["calls_per_day"] = 0

    # --------------------------------------------------------
    # PEAK PERIOD
    # --------------------------------------------------------

    if "peak_period_share" in customers.columns:

        row["peak_period_share"] = max(
            day_share,
            evening_share,
            night_share
        )

    # --------------------------------------------------------
    # USAGE TIME STD
    # --------------------------------------------------------

    if "usage_time_std" in customers.columns:

        row["usage_time_std"] = np.std(
            [
                day,
                evening,
                night
            ]
        )

    # --------------------------------------------------------
    # DOMINANT PERIOD
    # --------------------------------------------------------

    periods = {
        "Day": day,
        "Evening": evening,
        "Night": night,
        "International": international
    }

    dominant_period = max(
        periods,
        key=periods.get
    )

    if "dominant_usage_period" in customers.columns:

        row[
            "dominant_usage_period"
        ] = dominant_period

    # --------------------------------------------------------
    # CHARGES
    # --------------------------------------------------------

    if "Day Charge" in customers.columns:
        row["Day Charge"] = 0

    if "Eve Charge" in customers.columns:
        row["Eve Charge"] = 0

    if "Night Charge" in customers.columns:
        row["Night Charge"] = 0

    if "Intl Charge" in customers.columns:
        row["Intl Charge"] = 0

    if "Total Charge" in customers.columns:
        row["Total Charge"] = 0

    if "total_charge" in customers.columns:
        row["total_charge"] = 0

    if "charge_per_min" in customers.columns:
        row["charge_per_min"] = 0

    # --------------------------------------------------------
    # CLUSTER
    # --------------------------------------------------------

    if "Cluster" in customers.columns:

        row["Cluster"] = cluster

    # --------------------------------------------------------
    # CHURN
    # --------------------------------------------------------

    if "Churn" in customers.columns:

        row["Churn"] = "0"

    return row


# ============================================================
# GET CUSTOMER LIST
# ============================================================


@router.get("/")
def get_customer_numbers():

    customers = load_customers()

    if "Phone Number" in customers.columns:

        phones = (
            customers["Phone Number"]
            .astype(str)
            .str.strip()
            .tolist()
        )

    elif "phone_number" in customers.columns:

        phones = (
            customers["phone_number"]
            .astype(str)
            .str.strip()
            .tolist()
        )

    else:

        phones = []

    return {
        "customers": phones,
        "count": len(phones)
    }


# ============================================================
# REGISTER NEW CUSTOMER
# ============================================================


@router.post("/register")
def register_customer(
    data: NewCustomer
):

    phone = normalize_phone(
        data.phone_number
    )

    if not phone:

        raise HTTPException(
            status_code=400,
            detail="Phone number is required."
        )

    # --------------------------------------------------------
    # LOAD EXISTING CUSTOMERS
    # --------------------------------------------------------

    customers = load_customers()

    phone_column = (
        "Phone Number"
        if "Phone Number" in customers.columns
        else "phone_number"
    )

    if phone_column not in customers.columns:

        raise HTTPException(
            status_code=500,
            detail=(
                "Customer dataset does not contain "
                "a phone number column."
            )
        )

    # --------------------------------------------------------
    # DUPLICATE CHECK
    # --------------------------------------------------------

    existing_phones = (
        customers[phone_column]
        .astype(str)
        .str.strip()
        .str.replace(" ", "", regex=False)
    )

    if phone in existing_phones.values:

        raise HTTPException(
            status_code=409,
            detail=(
                "This phone number already exists. "
                "Please use Customer Login."
            )
        )

    # --------------------------------------------------------
    # USAGE
    # --------------------------------------------------------

    day = float(
        data.day_minutes
    )

    evening = float(
        data.evening_minutes
    )

    night = float(
        data.night_minutes
    )

    international = float(
        data.international_minutes
    )

    # --------------------------------------------------------
    # CLUSTER
    # --------------------------------------------------------

    cluster = calculate_cluster(
        customers,
        day,
        evening,
        night,
        international
    )

    # --------------------------------------------------------
    # BUILD ROW
    # --------------------------------------------------------

    new_row = build_customer_row(
        customers,
        phone,
        day,
        evening,
        night,
        international,
        cluster
    )

    # --------------------------------------------------------
    # APPEND
    # --------------------------------------------------------

    new_customer_dataframe = pd.DataFrame(
        [new_row]
    )

    # Keep exactly the same column order.
    new_customer_dataframe = (
        new_customer_dataframe[
            customers.columns
        ]
    )

    updated_customers = pd.concat(
        [
            customers,
            new_customer_dataframe
        ],
        ignore_index=True
    )

    # --------------------------------------------------------
    # SAVE
    # --------------------------------------------------------

    save_customers(
        updated_customers
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "New customer created successfully.",
        "customer": {
            "phone_number": phone,
            "cluster": cluster,
            "account_length": 0,
            "churn": "0"
        },
        "usage": {
            "day_minutes": day,
            "evening_minutes": evening,
            "night_minutes": night,
            "international_minutes": international,
            "total_minutes": (
                day
                + evening
                + night
                + international
            )
        }
    }


# ============================================================
# GET SINGLE CUSTOMER
# ============================================================


@router.get("/{phone_number}")
def get_customer(
    phone_number: str
):

    customers = load_customers()

    phone = normalize_phone(
        phone_number
    )

    phone_column = (
        "Phone Number"
        if "Phone Number" in customers.columns
        else "phone_number"
    )

    rows = customers[
        customers[phone_column]
        .astype(str)
        .str.strip()
        .str.replace(
            " ",
            "",
            regex=False
        )
        == phone
    ]

    if rows.empty:

        raise HTTPException(
            status_code=404,
            detail="Customer not found in dataset."
        )

    customer = rows.iloc[0]

    result = {}

    for column, value in customer.items():

        if pd.isna(value):

            result[column] = None

        elif isinstance(
            value,
            (np.integer,)
        ):

            result[column] = int(value)

        elif isinstance(
            value,
            (np.floating,)
        ):

            result[column] = float(value)

        else:

            result[column] = value

    return {
        "customer": result
    }