from fastapi import Depends, UploadFile, Form
from typing import Annotated
import pandas as pd
from dependencies.file_parsers import parse_trading_csv


async def get_csv_file(csvFile: Annotated[UploadFile, Form()]):
    contents = await csvFile.read()
    return parse_trading_csv(contents)


async def get_df_merchant(
    filtered_df: Annotated[pd.DataFrame, Depends(get_csv_file)],
):
    df_with_merchants = filtered_df[filtered_df["Merchant name"].notna()].copy()
    df_with_merchants["Gross Total"] = df_with_merchants["Gross Total"].map(
        lambda x: abs(x)
    )
    return df_with_merchants
