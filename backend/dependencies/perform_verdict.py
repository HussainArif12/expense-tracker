from typing import Annotated
from fastapi import Form, UploadFile

from dependencies.open_bank_file import get_bank_file
from dependencies.open_trading_file import get_csv_file
from dependencies.file_parsers import get_filter_path


async def get_both_files(
    bank_file: Annotated[UploadFile | None, Form()] = None,
    trading_file: Annotated[UploadFile | None, Form()] = None,
    filter_file_path: str | None = None,
):
    banking_df = None
    trading_df = None

    if bank_file and bank_file.filename:
        # reuse the centralized bank parser
        banking_df = await get_bank_file(
            bank_file, filter_file_path or get_filter_path()
        )

    if trading_file and trading_file.filename:
        # reuse the centralized trading parser
        trading_df = await get_csv_file(trading_file)

    return [banking_df, trading_df]
