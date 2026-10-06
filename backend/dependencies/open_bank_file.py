from typing import Annotated
from fastapi import Form, UploadFile
from dependencies.file_parsers import parse_bank_csv


async def get_bank_file(
    bank_file: Annotated[UploadFile, Form()],
    filter_file: Annotated[UploadFile, Form()] | None = None,
):
    contents = await bank_file.read()
    filter_contents = await filter_file.read() if filter_file else None
    return parse_bank_csv(contents, filter_contents)
