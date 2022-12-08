from enum import Enum


class NodeType(Enum):
    """Enum for node types"""

    TABLE = "table"
    ATTRIBUTE = "attribute"


class AttributeType(Enum):
    # postgres types
    INTEGER = "integer"
    BIGINT = "bigint"
    SMALLINT = "smallint"
    NUMERIC = "numeric"
    DECIMAL = "decimal"
    REAL = "real"
    DOUBLE_PRECISION = "double_precision"
    SMALLSERIAL = "smallserial"
    SERIAL = "serial"
    BIGSERIAL = "bigserial"
    MONEY = "money"
    CHARACTER_VARYING = "character_varying"
    VARCHAR = "varchar"
    CHARACTER = "character"
    CHAR = "char"
    TEXT = "text"
    TIMESTAMP = "timestamp"
