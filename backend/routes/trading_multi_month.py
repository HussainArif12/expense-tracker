from typing import Annotated

from fastapi import APIRouter, Depends
import pandas as pd
from dependencies.convert_unstacked_to_json import convert_unstacked_to_json
from dependencies.open_trading_file import get_csv_file

router = APIRouter(
    prefix="/trading_multi_month",
    tags=["trading_multi_month"],
)


@router.post("/total_expenses")
async def get_trading_analysis(
    trading_df: Annotated[pd.DataFrame, Depends(get_csv_file)],
):
    trading_df_negative = trading_df[
        (trading_df["Gross Total"] < 0) | (trading_df["Action"] == "Market buy")
    ].copy()
    trading_df_negative["Gross Total"] = trading_df_negative["Gross Total"].abs()

    trading_df_stocks_only = trading_df_negative[
        trading_df_negative["Action"] == "Market buy"
    ]

    total_spent_by_merchant_name = trading_df_negative.groupby(["Merchant name"])[
        "Gross Total"
    ].sum()
    total_spent_by_merchant_name = total_spent_by_merchant_name.to_dict()

    total_spent_by_merchant_category = trading_df_negative.groupby(
        ["Merchant category"]
    )["Gross Total"].sum()
    total_spent_by_merchant_category = total_spent_by_merchant_category.to_dict()

    stocks_only = trading_df_stocks_only.groupby(["Month & Year"])["Gross Total"].sum()
    stocks_only_by_name = trading_df_negative.groupby(["Name"])["Gross Total"].sum()
    stocks_only_by_name = stocks_only_by_name.to_dict()
    stocks_only = stocks_only.to_dict()
    total_stocks_only = trading_df_stocks_only["Gross Total"].sum()

    cashback = trading_df[trading_df["Action"] == "Spending cashback"]
    total_cashback = cashback["Gross Total"].sum()
    cashback = cashback.groupby(["Month & Year"])["Gross Total"].sum()
    cashback = cashback.to_dict()

    dividends = trading_df[trading_df["Action"] == "Dividend (Dividend)"]
    total_dividends = dividends["Gross Total"].sum()
    dividends = dividends.groupby(["Month & Year"])["Gross Total"].sum()
    dividends = dividends.to_dict()

    expenses = trading_df_negative.groupby(["Month & Year"])["Gross Total"].sum()
    expenses = expenses.to_dict()
    total_expenses = trading_df_negative["Gross Total"].sum()

    interest = trading_df[trading_df["Action"] == "Interest on cash"]
    total_interest = interest["Gross Total"].sum()
    interest = interest.groupby(["Month & Year"])["Gross Total"].sum()
    interest = interest.to_dict()

    return {
        "totals": {
            "total_cashback": total_cashback,
            "total_expenses": total_expenses,
            "total_dividends": total_dividends,
            "total_interest": total_interest,
            "total_stocks": total_stocks_only,
        },
        "charting_data": {
            "cashback": cashback,
            "dividends": dividends,
            "interest": interest,
            "expenses": expenses,
            "stocks": stocks_only,
            "stocks_by_name": stocks_only_by_name,
            "merchant_name": total_spent_by_merchant_name,
            "merchant_category": total_spent_by_merchant_category,
        },
    }


@router.post("/grouped_data")
async def get_grouped_data(
    trading_df: Annotated[pd.DataFrame, Depends(get_csv_file)],
):
    trading_df_negative = trading_df[
        (trading_df["Gross Total"] < 0) | (trading_df["Action"] == "Market buy")
    ].copy()
    trading_df_negative["Gross Total"] = trading_df_negative["Gross Total"].abs()

    stocks_only = trading_df_negative[trading_df_negative["Action"] == "Market buy"]

    stocks_by_time = stocks_only.groupby(["Month & Year", "Name"])["Gross Total"].sum()
    stocks_by_time = convert_unstacked_to_json(stocks_by_time)

    merchant_name_grouped = trading_df_negative.groupby(
        ["Month & Year", "Merchant name"]
    )["Gross Total"].sum()
    merchant_name_grouped = convert_unstacked_to_json(merchant_name_grouped)

    return {
        "merchant_name_grouped": merchant_name_grouped,
        "stocks_by_time": stocks_by_time,
    }
