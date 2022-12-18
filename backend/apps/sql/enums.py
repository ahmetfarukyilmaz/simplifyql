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
