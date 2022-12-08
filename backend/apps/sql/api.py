import json

from ninja import Router
from ninja.files import UploadedFile

from .schema import TableSchema
from .utils import get_sql

router = Router()


@router.post("/create-tables", response=list[TableSchema])
def create_tables(request, file: UploadedFile):
    data = json.load(file.file)
    tables = get_sql(data)
    return tables
