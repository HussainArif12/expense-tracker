import io
import json
from enum import Enum

import pandas as pd


class BankFilter(Enum):
    REMOVE_BANK_ROWS = "remove_bank_rows"
    INCLUDE_BANK_ROWS = "include_bank_rows"


def get_filter(contents: bytes) -> dict:
    filters = json.loads(contents)
    return filters if isinstance(filters, dict) else {}


def parse_bank_csv(
    contents: bytes, filter_contents: bytes | None = None
) -> pd.DataFrame:
    df = pd.read_csv(
        io.BytesIO(contents), encoding="unicode_escape", sep=";", decimal=","
    )
    df["Buchungstag"] = pd.to_datetime(df["Buchungstag"], format="%d.%m.%y")
    df["Valutadatum"] = pd.to_datetime(df["Valutadatum"], format="%d.%m.%y")
    # 2. Extract Month & Year as a string (e.g., "2026-05")
    df["Month & Year"] = df["Valutadatum"].dt.strftime("%Y-%m-%d")
    df = df.filter(
        items=[
            "Buchungstag",
            "Valutadatum",
            "Buchungstext",
            "Verwendungszweck",
            "Beguenstigter/Zahlungspflichtiger",
            "Betrag",
            "Month & Year",
        ]
    )

    if filter_contents:
        filters = get_filter(filter_contents)

        for column, values in filters.items():
            for value in values:
                df_column = value.get("column")
                df_values = value.get("equals", [])

                if df_column not in df.columns:
                    continue

                # keep rows where column value is in the provided list
                if column == BankFilter.INCLUDE_BANK_ROWS.value:
                    df = df.loc[df[df_column].isin(df_values)]

                # remove rows where column value is in the provided list
                if column == BankFilter.REMOVE_BANK_ROWS.value:
                    df = df.loc[~df[df_column].isin(df_values)]

    return df


def parse_trading_csv(contents: bytes) -> pd.DataFrame:
    TIME_COLUMN = "Time (UTC)"
    TIME_ORIGINAL = "Time"
    trading_df = pd.read_csv(io.BytesIO(contents), sep=",")

    trading_df[TIME_COLUMN] = pd.to_datetime(trading_df[TIME_COLUMN])
    trading_df["Month & Year"] = trading_df[TIME_COLUMN].dt.strftime("%Y-%m")
    trading_df[TIME_ORIGINAL] = trading_df[TIME_COLUMN].dt.date

    columns = [
        "Action",
        TIME_ORIGINAL,
        "Merchant name",
        "Merchant category",
        "Gross Total",
        "Month & Year",
        "Notes",
    ]

    if "Name" in trading_df.columns:
        columns.append("Name")

    trading_df = trading_df.filter(items=columns)

    return trading_df
