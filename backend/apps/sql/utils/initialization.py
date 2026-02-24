from ninja.errors import HttpError
from sql.enums import NodeType
from sql.schema import AttributeSchema, AttributeTypeSchema, EdgeSchema, NodeSchema, TableSchema
from sql.utils.check_constraints import check_primary_key, check_table_names


def initialize_tables(data: list[NodeSchema]):
    tables, attributes, attribute_types = identify_nodes(data)
    attributes = _apply_attribute_types(attributes, attribute_types)
    tables = _assign_attributes_to_tables(tables, attributes)

    ok, table_name, error = check_primary_key(tables)
    if not ok:
        raise HttpError(400, f"Table {table_name} has {error}")

    ok, table_name, error = check_table_names(tables)
    if not ok:
        raise HttpError(400, f"{table_name}, {error}")

    return tables


def initialize_edges(data: list[EdgeSchema]):
    for edge in data:
        edge.relationship = edge.data.get("relationship")
    return data


def identify_nodes(
    nodes: list[NodeSchema],
) -> tuple[list[TableSchema], list[AttributeSchema], list[AttributeTypeSchema]]:
    """Parse frontend nodes into typed schema objects."""
    tables = []
    attributes = []
    attribute_types = []

    for node in nodes:
        if node.type == NodeType.TABLE:
            tables.append(TableSchema(id=node.id, name=node.data.get("name")))
        elif node.type == NodeType.ATTRIBUTE:
            attributes.append(
                AttributeSchema(
                    id=node.id,
                    name=node.data.get("name"),
                    type=node.data.get("type"),
                    length=node.data.get("length", ""),
                    parent_node=node.parentNode,
                    constraints=node.data.get("constraints", []),
                )
            )
        elif node.type == NodeType.ATTRIBUTE_TYPE:
            attribute_types.append(
                AttributeTypeSchema(id=node.id, parentNode=node.parentNode, data=node.data)
            )

    return tables, attributes, attribute_types


def _assign_attributes_to_tables(tables: list[TableSchema], attributes: list[AttributeSchema]) -> list[TableSchema]:
    """Group attributes under their parent table."""
    tables_by_id = {table.id: table for table in tables}
    for attribute in attributes:
        if attribute.parent_node in tables_by_id:
            tables_by_id[attribute.parent_node].attributes.append(attribute)
    return tables


def _apply_attribute_types(
    attributes: list[AttributeSchema],
    attribute_types: list[AttributeTypeSchema],
) -> list[AttributeSchema]:
    """Apply length from AttributeTypeNode to its parent attribute."""
    types_by_parent = {at.parentNode: at for at in attribute_types}
    for attribute in attributes:
        if attribute.id in types_by_parent:
            attribute.length = types_by_parent[attribute.id].data.get("length", "")
    return attributes
