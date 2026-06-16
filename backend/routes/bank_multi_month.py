from typing import Annotated
from fastapi import APIRouter, Depends
import pandas as pd

from dependencies.open_bank_file import get_bank_file

router = APIRouter(prefix="/bank_multi_month")


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


@router.post("/total_overview")
async def get_data(
    bank_df: Annotated[pd.DataFrame, Depends(get_bank_file)],
):

    outflow = bank_df[bank_df["Betrag"] < 0]
    inflow = bank_df[bank_df["Betrag"] > 0]
    outflow["Betrag"] = outflow["Betrag"].abs()

    inflow_grouped = inflow.groupby(["Month & Year"])["Betrag"].sum()
    outflow_grouped = outflow.groupby(["Month & Year"])["Betrag"].sum()
    outflow_total = outflow["Betrag"].sum().item()
    inflow_total = inflow["Betrag"].sum().item()

    return {
        "inflow_total": inflow_total,
        "outflow_total": outflow_total,
        "inflow_grouped": inflow_grouped,
        "outflow_grouped": outflow_grouped,
    }


@router.post("/merchant_overview")
async def get_overview(bank_df: Annotated[pd.DataFrame, Depends(get_bank_file)]):

    outflow = bank_df[bank_df["Betrag"] < 0]
    inflow = bank_df[bank_df["Betrag"] > 0]
    outflow["Betrag"] = outflow["Betrag"].abs()

    inflow_grouped = inflow.groupby(
        [
            "Month & Year",
            "Beguenstigter/Zahlungspflichtiger",
        ]
    )["Betrag"].sum()

    outflow_grouped = outflow.groupby(
        [
            "Month & Year",
            "Beguenstigter/Zahlungspflichtiger",
        ]
    )["Betrag"].sum()

    outflow_grouped = convert_unstacked_to_json(outflow_grouped)
    inflow_grouped = convert_unstacked_to_json(inflow_grouped)
    return {"outflow_grouped": outflow_grouped, "inflow_grouped": inflow_grouped}
