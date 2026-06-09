import io
import json
from pathlib import Path
from enum import Enum
from typing import Optional

import pandas as pd


class BankFilter(Enum):
    REMOVE_BANK_ROWS = "remove_bank_rows"
    INCLUDE_BANK_ROWS = "include_bank_rows"


def get_filter_path() -> Optional[str]:
    candidate = Path(__file__).resolve().parent.parent / "filters" / "filter.json"
    return str(candidate) if candidate.exists() else None


def parse_bank_csv(
    contents: bytes, filter_file_path: Optional[str] = None
) -> pd.DataFrame:
    df = pd.read_csv(
        io.BytesIO(contents), encoding="unicode_escape", sep=";", decimal=","
    )

    df = df.filter(
        items=[
            "Buchungstag",
            "Buchungstext",
            "Verwendungszweck",
            "Beguenstigter/Zahlungspflichtiger",
            "Betrag",
        ]
    )

    if filter_file_path:
        filters = json.loads(Path(filter_file_path).read_text())

        for column, values in filters.items():
            for value in values:
                df_column = value["column"]
                df_value = value["equals"]

                if column == BankFilter.INCLUDE_BANK_ROWS.value:
                    df = (
                        df.loc[df[df_column] == df_value]
                        if df_column in df.columns
                        else df
                    )

                if column == BankFilter.REMOVE_BANK_ROWS.value:
                    df = (
                        df.loc[df[df_column] != df_value]
                        if df_column in df.columns
                        else df
                    )

    return df


def parse_trading_csv(contents: bytes) -> pd.DataFrame:
    trading_df = pd.read_csv(io.BytesIO(contents), sep=",")

    trading_df["Time"] = pd.to_datetime(trading_df["Time"])
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
