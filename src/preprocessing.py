import pandas as pd

INPUT_FILE = "data/processed/cleaned_customers.csv"


def load_data():

    df = pd.read_csv(INPUT_FILE)

    return df


def clean_data(df):

    features = [
        "Day Mins",
        "Eve Mins",
        "Night Mins",
        "Intl Mins"
    ]

    # Convert features to numeric
    for column in features:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # Remove missing values
    df = df.dropna(
        subset=features
    )

    # Remove negative values
    for column in features:

        df = df[
            df[column] >= 0
        ]

    return df


def get_features(df):

    features = [
        "Day Mins",
        "Eve Mins",
        "Night Mins",
        "Intl Mins"
    ]

    return df[features]


if __name__ == "__main__":

    df = load_data()

    print("Before cleaning:", df.shape)

    df = clean_data(df)

    print("After cleaning:", df.shape)

    print("\nFeatures:")
    print(get_features(df).head())