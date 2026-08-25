import os
import pandas as pd

INPUT_FILE = "data/raw/CDR-Call-Details.csv"
OUTPUT_FILE = "data/processed/cleaned_customers.csv"


def aggregate_customers():

    print("Loading dataset...")

    df = pd.read_csv(INPUT_FILE)

    print("Original shape:", df.shape)

    print("\nColumns:")
    print(df.columns.tolist())

    # Find customer identifier
    possible_customer_columns = [
        "Phone",
        "Phone Number",
        "Customer_ID",
        "Customer ID"
    ]

    customer_column = None

    for column in possible_customer_columns:
        if column in df.columns:
            customer_column = column
            break

    if customer_column is None:
        raise ValueError(
            "Customer/Phone column was not found. "
            "Check the column names printed above."
        )

    print("\nCustomer column:", customer_column)

    # Usage columns
    usage_columns = [
        "Day Mins",
        "Eve Mins",
        "Night Mins",
        "Intl Mins"
    ]

    # Check required columns
    missing_columns = [
        column for column in usage_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing usage columns: {missing_columns}"
        )

    # Convert usage columns to numeric
    for column in usage_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # Remove rows with missing customer or usage values
    df = df.dropna(
        subset=[customer_column] + usage_columns
    )

    # Aggregate repeated records for each customer
    customer_df = (
        df.groupby(customer_column)[usage_columns]
        .sum()
        .reset_index()
    )

    # Rename customer column
    customer_df = customer_df.rename(
        columns={
            customer_column: "Customer_ID"
        }
    )

    # Create output directory
    os.makedirs(
        "data/processed",
        exist_ok=True
    )

    # Save processed customer data
    customer_df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print("\nAggregation completed!")

    print(
        "Unique customers:",
        customer_df["Customer_ID"].nunique()
    )

    print(
        "Processed shape:",
        customer_df.shape
    )

    print("\nFirst 5 customers:")
    print(customer_df.head())


if __name__ == "__main__":
    aggregate_customers()