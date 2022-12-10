import json

from ninja import Router
from ninja.files import UploadedFile

from .schema import TableSchema
from .utils import generate_sql_code_v2, get_sql

router = Router()


@router.post("/create-tables")
def create_tables(request, file: UploadedFile):
    data = json.load(file.file)
    tables = get_sql(data)
    sql_code = generate_sql_code_v2(tables)
    print(sql_code)
    # write this to a file
    with open("sql_code.sql", "w") as f:
        f.write(sql_code)

    return sql_code
