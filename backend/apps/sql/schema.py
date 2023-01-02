from ninja import Schema

from .enums import AttributeType, NodeType, RelationshipType


class AttributeConstraintsSchema(Schema):
    nullable: bool = False
    unique: bool = False
    primary_key: bool = False
    index: bool = False


class AttributeTypeSchema(Schema):
    id: str
    parentNode: str
    type: NodeType = NodeType.ATTRIBUTE_TYPE
    data: dict = None


class AttributeSchema(Schema):
    id: str
    name: str
    type: AttributeType  # varchar, integer, etc.
    length: str = ""  # varchar(255), integer(11), etc.
    parent_node: str
    constraints: AttributeConstraintsSchema = None  # nullable, unique, etc.


class TableSchema(Schema):
    id: str
    name: str
    attributes: list[AttributeSchema] = []
    relationships: list[dict] = []


class NodeSchema(Schema):
    """
    Schema that comes from the frontend
    """

    id: str
    type: NodeType
    parentNode: str = None
    data: dict = None


class EdgeSchema(Schema):
    """
    Schema that comes from the frontend
    """

    id: str
    source: str
    target: str
    markerStart: str = None
    markerEnd: str = None
    data: dict = None
    relationship: RelationshipType = None


class SqlSchema(Schema):
    """
    Schema that comes from the frontend
    """

    nodes: list[NodeSchema] = None
    edges: list[EdgeSchema] = None
    name: str
    raw_data: dict = {}
