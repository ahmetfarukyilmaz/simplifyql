from ninja import Schema

from .enums import AttributeType, NodeType


class AttributeConstraintsSchema(Schema):
    nullable: bool = False
    unique: bool = False
    primary_key: bool = False
    auto_increment: bool = False


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


class NodeSchema(Schema):
    """
    Schema that comes from the frontend
    """

    id: str
    type: NodeType
    parentNode: str = None
    data: dict = None
