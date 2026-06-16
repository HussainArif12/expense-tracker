from typing import Annotated

from fastapi import APIRouter, Depends
import pandas as pd
from dependencies.open_bank_file import get_bank_file

router = APIRouter(prefix="/bank_one_month")


@router.post("/total_overview")
async def get_bank_analysis(
    bank_df: Annotated[pd.DataFrame, Depends(get_bank_file)],
):

    costs = bank_df[bank_df["Betrag"] < 0]
    inflow = bank_df[bank_df["Betrag"] > 0]
    costs["Betrag"] = costs["Betrag"].abs()

    outflow_total = costs["Betrag"].sum().item()
    inflow_total = inflow["Betrag"].sum().item()

    inflow_grouped = inflow.groupby(["Beguenstigter/Zahlungspflichtiger"])[
        "Betrag"
    ].sum()
    inflow_grouped = inflow_grouped.to_dict()

    costs_grouped = costs.groupby(["Beguenstigter/Zahlungspflichtiger"])["Betrag"].sum()
    costs_grouped = costs_grouped.to_dict()

    costs_grouped_by_time = costs.copy()
    costs_grouped_by_time["Buchungstag"] = pd.to_datetime(
        costs_grouped_by_time["Buchungstag"]
    ).dt.day
    costs_grouped_by_time = costs_grouped_by_time.groupby(["Buchungstag"])[
        "Betrag"
    ].sum()

    costs_grouped_by_time = costs_grouped_by_time.to_dict()

    return {
        "outflow": outflow_total,
        "inflow": inflow_total,
        "costs_grouped": costs_grouped,
        "inflow_grouped": inflow_grouped,
        "costs_grouped_by_time": costs_grouped_by_time,
    }
