from django.contrib.auth import get_user_model
from ninja import Router
from users.schema import ErrorSchema

from .models import ErDiagram
from .schema import SqlSchema
from .utils import generate_sql_code, get_relationships, initialize_edges, initialize_tables

router = Router()
UserModel = get_user_model()


@router.post("/create-tables", response={200: str, 400: ErrorSchema})
def create_tables(request, data: SqlSchema):
    auth_token = request.headers.get("Authorization")
    user = UserModel.objects.filter(auth_token=auth_token).first()
    if user is None:
        return 400, ErrorSchema(detail="Invalid credentials")

    nodes = data.nodes
    edges = data.edges
    name = data.name
    # raw_data = data.raw_data
    # ErDiagram.save_er_diagram(raw_data=raw_data, name=name, user=user)
    edges = initialize_edges(edges)
    tables = initialize_tables(nodes)

    tables = get_relationships(edges, tables)
    sql_code = generate_sql_code(tables)
    return sql_code


@router.get("/get-er-diagrams", response={200: list, 400: ErrorSchema})
def get_er_diagrams(request):
    auth_token = request.headers.get("Authorization")
    user = UserModel.objects.filter(auth_token=auth_token).first()
    if user is None:
        return 400, ErrorSchema(detail="Invalid credentials")

    er_diagrams = ErDiagram.objects.filter(user=user).values("id", "name")
    return list(er_diagrams)


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
