from enum import Enum


class NodeType(str, Enum):
    """Enum for node types"""

    TABLE = "table"
    ATTRIBUTE = "attribute"


class AttributeType(str, Enum):
    """Enum for postgres attribute types (aka column types)"""

    TEXT = "text"
    INTEGER = "integer"
    VARCHAR = "varchar"
    BOOLEAN = "boolean"
