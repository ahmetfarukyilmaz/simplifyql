from ninja import Router
from ninja.errors import HttpError
from sql.utils.generate_sql import generate_sql_code
from sql.utils.get_er_diagrams import get_er_diagrams_helper
from sql.utils.initialization import initialize_edges, initialize_tables
from sql.utils.relationships import get_relationships
from users.authentication import AuthBearer

from .models import ErDiagram
from .schema import SqlSchema, UpdateDiagramSchema

router = Router(auth=AuthBearer())


@router.post("/create-tables", response={200: str})
def create_tables(request, data: SqlSchema):
    if not data.nodes:
        raise HttpError(400, "No table found")

    edges = initialize_edges(data.edges)
    tables = initialize_tables(data.nodes)
    tables = get_relationships(edges, tables)
    sql_code = generate_sql_code(tables)

    ErDiagram.save_er_diagram(raw_data=data.raw_data, name=data.name, user=request.auth)

    return sql_code


@router.get("/get-er-diagrams", response={200: list})
def get_er_diagrams(request):
    return get_er_diagrams_helper(user=request.auth)


@router.get("restore-er-diagram/{id}", response={200: dict})
def restore_er_diagram(request, id: int):
    er_diagram = ErDiagram.objects.filter(id=id, user=request.auth).first()
    if er_diagram is None:
        raise HttpError(404, "ER Diagram not found")
    return er_diagram.data


@router.post("update-er-diagram/{id}", response={200: dict})
def update_er_diagram(request, data: UpdateDiagramSchema, id: int):
    er_diagram = ErDiagram.objects.filter(id=id, user=request.auth).first()
    if er_diagram is None:
        raise HttpError(404, "ER Diagram not found")

    er_diagram.data = data.raw_data
    er_diagram.save()
    return er_diagram.data
