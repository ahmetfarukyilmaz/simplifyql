from ninja import Schema

from .enums import AttributeType, NodeType


class AttributeConstraintsSchema(Schema):
    nullable: bool = False
    unique: bool = False
    primary_key: bool = False
    autoincrement: bool = False


class NodeDataSchema(Schema):
    name: str
    constraints: AttributeConstraintsSchema = None


class NodeSchema(Schema):
    id: str
    type: NodeType
    parentNode: str = None
    data: NodeDataSchema


class AttributeSchema(NodeSchema):
    type: AttributeType  # such as varchar, integer, etc.
    constraints: AttributeConstraintsSchema = None  # such as nullable, unique, etc.
