from typing import Annotated

from fastapi import Depends, Form, UploadFile

from dependencies.file_parsers import get_filter_path, parse_bank_csv


async def get_bank_file(
    bank_file: Annotated[UploadFile, Form()],
    filter_file_path: str | None = Depends(get_filter_path),
):
    contents = await bank_file.read()
    return parse_bank_csv(contents, filter_file_path)
