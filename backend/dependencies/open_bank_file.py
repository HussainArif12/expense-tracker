import io
import json
from enum import Enum
from pathlib import Path
from typing import Annotated

import pandas as pd
from fastapi import Depends, Form, UploadFile


class BankFilter(Enum):
    REMOVE_BANK_ROWS = "remove_bank_rows"
    INCLUDE_BANK_ROWS = "include_bank_rows"


def get_filter_path() -> str | None:
    """Return the on-disk filter file path or None if not present.

    Adjust this to point to your actual filters file location. Example:
    Path(__file__).resolve().parent.parent / "filters" / "bank_filters.json"
    """
    candidate = Path(__file__).resolve().parent.parent / "filters" / "filter.json"
    return str(candidate) if candidate.exists() else None


async def get_bank_file(
    bank_file: Annotated[UploadFile, Form()],
    filter_file_path: str | None = Depends(get_filter_path),
):
    """Load the uploaded bank CSV and apply optional on-disk filters."""

    contents = await bank_file.read()
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
