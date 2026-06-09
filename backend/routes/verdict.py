from typing import Annotated, List

from fastapi import APIRouter, Depends
import pandas as pd
from dependencies.perform_verdict import get_both_files

router = APIRouter(
    prefix="/verdict",
    tags=["verdict"],
)


@router.post("/get_verdict")
async def get_verdict(
    verdict_data: Annotated[List[pd.DataFrame | None], Depends(get_both_files)],
):
    [bank_df, trading_df] = verdict_data
    final_response = {"outcome": []}
    negative_inflow_trading = 0
    if trading_df is not None:
        trading_df_negative = trading_df[
            (trading_df["Gross Total"] < 0) | (trading_df["Action"] == "Market buy")
        ].copy()

        # Cast dates to strings right before converting to dictionaries to avoid key errors

        trading_df_negative["Gross Total"] = trading_df_negative["Gross Total"].abs()
        negative_inflow_trading = trading_df_negative["Gross Total"].sum()
        final_response["outcome"].append(
            {"type": "Outflow", "trading_outflow": negative_inflow_trading},
        )
    negative_outflow_bank = 0
    if bank_df is not None:
        negative_outflow_bank = bank_df[bank_df["Betrag"] < 0]

        negative_outflow_bank["Betrag"] = negative_outflow_bank["Betrag"].abs()
        negative_outflow_bank = negative_outflow_bank["Betrag"].sum().item()
        final_response["outcome"].append(
            {"type": "Outflow", "bank_outflow": negative_outflow_bank},
        )

        positive_inflow_bank = bank_df[bank_df["Betrag"] > 0]
        positive_inflow_bank = positive_inflow_bank["Betrag"].sum()

        final_response["outcome"].append(
            {"type": "Inflow", "bank_inflow": positive_inflow_bank},
        )

    return final_response
