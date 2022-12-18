from ninja import Router
from .utils import generate_sql_code, get_sql
from .schema import SqlSchema

router = Router()


@router.post("/create-tables")
def create_tables(request, data: SqlSchema):
    nodes = data.nodes
    edges = data.edges
    tables = get_sql(nodes)
    sql_code = generate_sql_code(tables)
    return sql_code
