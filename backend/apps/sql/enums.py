from enum import Enum


class NodeType(str, Enum):
    """Enum for node types"""

    TABLE = "TableNode"
    ATTRIBUTE = "AttributeNode"
    ATTRIBUTE_CONSTRAINT = "AttributeConstraintNode"
    ATTRIBUTE_TYPE = "AttributeTypeNode"


class AttributeType(str, Enum):
    """Enum for postgres attribute types (aka column types)"""

    TEXT = "text"
    INTEGER = "integer"
    VARCHAR = "varchar"
    BOOLEAN = "boolean"


class RelationshipType(str, Enum):
    ONE_TO_ONE = "one-one"
    ONE_TO_MANY = "one-many"
    MANY_TO_MANY = "many-many"
