import json

from ninja import Router
from ninja.files import UploadedFile

from .utils import generate_sql_code, get_sql

router = Router()


@router.post("/create-tables")
def create_tables(request, file: UploadedFile):
    data = json.load(file.file)
    tables = get_sql(data)
    sql_code = generate_sql_code(tables)
    print(sql_code)
    # write this to a file
    with open("sql_code.sql", "w") as f:
        f.write(sql_code)

    return sql_code
