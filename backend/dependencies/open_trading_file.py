from fastapi import Depends, UploadFile, Form
from typing import Annotated
import pandas as pd
import io


async def get_csv_file(csvFile: Annotated[UploadFile, Form()]):
    contents = await csvFile.read()
    trading_df = pd.read_csv(io.BytesIO(contents), sep=",")

    # Clean up and type cast standard columns
    trading_df["Time"] = pd.to_datetime(trading_df["Time"])

    # Create the "Month & Year" column explicitly before filtering out extra columns
    trading_df["Month & Year"] = trading_df["Time"].dt.strftime("%Y-%m")
    trading_df["Time"] = trading_df["Time"].dt.date

    trading_df = trading_df.filter(
        items=[
            "Action",
            "Time",
            "Name",
            "Merchant name",
            "Merchant category",
            "Gross Total",
            "Month & Year",
            "Notes",
        ]
    )
    return trading_df


async def get_df_merchant(
    filtered_df: Annotated[pd.DataFrame, Depends(get_csv_file)],
):
    df_with_merchants = filtered_df[filtered_df["Merchant name"].notna()].copy()
    df_with_merchants["Gross Total"] = df_with_merchants["Gross Total"].map(
        lambda x: abs(x)
    )
    return df_with_merchants
