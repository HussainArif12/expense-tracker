from typing import Annotated

from fastapi import APIRouter, Depends
import pandas as pd
from dependencies.open_trading_file import get_csv_file, get_df_merchant

router = APIRouter(
    prefix="/trading_month",
    tags=["trading_month"],
)


# 1. Base dependency to load the CSV file


# 3. Downstream merchant dependency using our new filter node

# =====================================================================
# ENDPOINTS (Now all natively inherit your dynamic filter query logic!)
# =====================================================================


@router.post("/total_expenses")
async def get_trading_analysis(
    trading_df: Annotated[pd.DataFrame, Depends(get_csv_file)],
):
    # This now operates on the pre-filtered dataset
    trading_df_negative = trading_df[
        (trading_df["Gross Total"] < 0) | (trading_df["Action"] == "Market buy")
    ].copy()

    # Cast dates to strings right before converting to dictionaries to avoid key errors
    trading_df_negative["Time"] = trading_df_negative["Time"].astype(str)

    trading_df_negative["Gross Total"] = trading_df_negative["Gross Total"].map(
        lambda x: round(abs(x), 2)
    )

    total_expenses_sum = trading_df_negative["Gross Total"].sum()
    total_expenses_grouped = trading_df_negative.groupby(["Time"])["Gross Total"].sum()
    total_expenses_grouped = total_expenses_grouped.to_dict()

    stocks_only = trading_df_negative[
        trading_df_negative["Action"] == "Market buy"
    ].copy()
    stocks_only = stocks_only.groupby(["Name"])["Gross Total"].sum()
    stocks_only = stocks_only.to_dict()

    interest_earned = trading_df[trading_df["Action"] == "Interest on cash"]
    interest_earned = interest_earned["Gross Total"].sum()
    cashback = trading_df[trading_df["Action"] == "Spending cashback"]
    cashback = cashback["Gross Total"].sum()

    dividends = trading_df[trading_df["Action"] == "Dividend (Dividend)"]
    dividends = dividends.groupby(["Name"])["Gross Total"].sum()
    dividends = dividends.to_dict()
    return {
        "total_expenses": total_expenses_grouped,
        "total_expenses_sum": total_expenses_sum,
        "stocks_only": stocks_only,
        "interest_earned": interest_earned,
        "cashback": cashback,
        "dividends": dividends,
    }


@router.post("/merchant")
async def get_trading_analysis_merchant(
    df_with_merchants: Annotated[pd.DataFrame, Depends(get_df_merchant)],
):
    merchants_grouped = df_with_merchants.groupby(["Merchant name"])[
        "Gross Total"
    ].sum()
    merchants_grouped = merchants_grouped.to_dict()

    merchant_category_grouped = df_with_merchants.groupby(["Merchant category"])[
        "Gross Total"
    ].sum()
    merchant_category_grouped = merchant_category_grouped.to_dict()

    return {
        "merchant_data": {
            "merchants_grouped": merchants_grouped,
            "merchant_category_grouped": merchant_category_grouped,
        }
    }


@router.post("/merchant_sunburst")
async def get_trading_analysis_merchant_sunburst(
    df_with_merchants: Annotated[pd.DataFrame, Depends(get_df_merchant)],
):
    if df_with_merchants.empty:
        return {"sunburst_chart": "{}"}

    hierarchical_data = (
        df_with_merchants.groupby(["Merchant category", "Merchant name"])["Gross Total"]
        .sum()
        .abs()
        .reset_index()
    )
    root = {"name": "Expenses", "children": []}

    # Track categories to easily attach children
    categories_dict = {}

    for _, row in hierarchical_data.iterrows():
        cat = row["Merchant category"]
        name = row["Merchant name"]
        val = float(row["Gross Total"])

        # If category doesn't exist in our tracker yet, initialize it
        if cat not in categories_dict:
            categories_dict[cat] = {"name": cat, "children": []}
            root["children"].append(categories_dict[cat])

        # Add the merchant as a leaf node (leaf nodes have 'value', not children)
        categories_dict[cat]["children"].append(
            {
                "name": name,
                "value": val,
            }
        )
    # Use fig.to_dict() if you plan to feed it straight into react-plotly.js!
    return {"sunburst_chart": root}
