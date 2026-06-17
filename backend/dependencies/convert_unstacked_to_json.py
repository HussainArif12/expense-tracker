import pandas as pd


def convert_unstacked_to_json(dataframe: pd.DataFrame):
    wide_df = dataframe.unstack(fill_value=0)

    # 2. Reset index turns "Month & Year" back into a standard column
    flat_df = wide_df.reset_index()

    # 3. Convert to a list of dictionaries (Standard JSON format for Recharts)
    # Use this if returning directly from a FastAPI endpoint:
    recharts_data = flat_df.to_dict(orient="records")

    # Or if you need an actual JSON string:
    json_string = flat_df.to_json(orient="records")
    return recharts_data
