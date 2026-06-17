from typing import Annotated
from fastapi import APIRouter, Depends
import pandas as pd

from dependencies.convert_unstacked_to_json import convert_unstacked_to_json
from dependencies.open_bank_file import get_bank_file

router = APIRouter(prefix="/bank_multi_month")


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
