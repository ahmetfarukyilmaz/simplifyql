from django.contrib.auth import get_user_model
from ninja import Router
from sql.utils.generate_sql import generate_sql_code
from sql.utils.get_er_diagrams import get_er_diagrams_helper
from sql.utils.initialization import initialize_edges, initialize_tables
from sql.utils.relationships import get_relationships
from users.schema import ErrorSchema

from .models import ErDiagram
from .schema import SqlSchema, UpdateDiagramSchema

router = Router()
UserModel = get_user_model()


@router.post("/create-tables", response={200: str, 400: ErrorSchema})
def create_tables(request, data: SqlSchema):
    auth_token = request.headers.get("Authorization")
    user = UserModel.objects.filter(auth_token=auth_token).first()
    if user is None:
        return 400, ErrorSchema(detail="Invalid credentials")

    nodes = data.nodes
    if not nodes:
        return 400, ErrorSchema(detail="No table found")
    edges = data.edges
    name = data.name
    raw_data = data.raw_data

    edges = initialize_edges(edges)
    tables = initialize_tables(nodes)
    tables = get_relationships(edges, tables)
    sql_code = generate_sql_code(tables)

    ErDiagram.save_er_diagram(raw_data=raw_data, name=name, user=user)

    return sql_code


@router.get("/get-er-diagrams", response={200: list, 400: ErrorSchema})
def get_er_diagrams(request):
    auth_token = request.headers.get("Authorization")
    user = UserModel.objects.filter(auth_token=auth_token).first()
    if user is None:
        return 400, ErrorSchema(detail="Invalid credentials")

    er_diagrams = get_er_diagrams_helper(user=user)
    return er_diagrams


@router.get("restore-er-diagram/{id}", response={200: dict, 400: ErrorSchema})
def restore_er_diagram(request, id: int):
    auth_token = request.headers.get("Authorization")
    user = UserModel.objects.filter(auth_token=auth_token).first()
    if user is None:
        return 400, ErrorSchema(detail="Invalid credentials")

    er_diagram = ErDiagram.objects.filter(id=id, user=user).first()
    if er_diagram is None:
        return 400, ErrorSchema(detail="ER Diagram not found")

    return er_diagram.data


@router.post("update-er-diagram/{id}", response={200: dict, 400: ErrorSchema})
def update_er_diagram(
    request,
    data: UpdateDiagramSchema,
    id,
):
    auth_token = request.headers.get("Authorization")
    user = UserModel.objects.filter(auth_token=auth_token).first()
    if user is None:
        return 400, ErrorSchema(detail="Invalid credentials")

    er_diagram = ErDiagram.objects.filter(id=id, user=user).first()
    if er_diagram is None:
        return 400, ErrorSchema(detail="ER Diagram not found")

    er_diagram.data = data.raw_data
    er_diagram.save()
    return er_diagram.data
