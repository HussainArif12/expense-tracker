from typing import Annotated

from fastapi import APIRouter, Depends
import pandas as pd
import json
from dependencies.open_bank_file import get_bank_file

router = APIRouter(prefix="/bank_one_month")


@router.post("/total_overview")
async def get_bank_analysis(
    bank_df: Annotated[pd.DataFrame, Depends(get_bank_file)],
):

    costs = bank_df[bank_df["Betrag"] < 0]
    inflow = bank_df[bank_df["Betrag"] > 0]
    costs["Betrag"] = costs["Betrag"].abs()

    outflow = costs["Betrag"].sum().item()
    inflow = bank_df[bank_df["Betrag"] > 0]
    inflow_total = inflow["Betrag"].sum().item()

    costs_grouped = costs.groupby(["Beguenstigter/Zahlungspflichtiger"])["Betrag"].sum()
    costs_grouped = costs_grouped.to_dict()
    INCOME_KEYS = ["LOHN", "GEHALT"]

    income = bank_df[
        bank_df["Buchungstext"].str.contains("|".join(INCOME_KEYS))
    ]  # ["Betrag"].sum()
    income = income.to_json(orient="records")
    income = json.loads(
        income,
    )
    return {
        "outflow": outflow,
        "inflow": inflow_total,
        "costs_grouped": costs_grouped,
        "detected_income": income,
    }



