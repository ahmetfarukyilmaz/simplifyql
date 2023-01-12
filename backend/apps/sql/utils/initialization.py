from ninja.errors import HttpError
from sql.enums import NodeType
from sql.schema import AttributeSchema, AttributeTypeSchema, EdgeSchema, NodeSchema, TableSchema
from sql.utils.check_constraints import check_primary_key, check_table_names


def initialize_tables(data: list[NodeSchema]):

    tables, attributes, attribute_types = identify_nodes(data)
    attributes = add_attribute_types_to_attributes(attributes, attribute_types)
    tables = add_attributes_to_tables(tables, attributes)
    primary_key_check, table_name, error_message = check_primary_key(tables)
    table_name_check, table_name, error_message = check_table_names(tables)

    if not primary_key_check:
        raise HttpError(400, f"Table {table_name} has {error_message}")

    if not table_name_check:
        raise HttpError(400, f"{table_name} has {error_message}")

    return tables


def initialize_edges(data: list[EdgeSchema]):
    for edge in data:
        edge.relationship = edge.data.get("relationship")

    return data


def identify_nodes(nodes: list[NodeSchema]) -> tuple[list[TableSchema], list[AttributeSchema]]:
    """Identify nodes and return them as a tuple of tables and attributes"""
    tables = []
    attributes = []
    attribute_types = []

    for node in nodes:
        if node.type == NodeType.TABLE:
            tables.append(
                TableSchema(
                    id=node.id,
                    name=node.data.get("name"),
                )
            )
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
                AttributeTypeSchema(
                    id=node.id,
                    parentNode=node.parentNode,
                    data=node.data,
                )
            )

    return tables, attributes, attribute_types


def add_attributes_to_tables(tables: list[TableSchema], attributes: list[AttributeSchema]) -> list[TableSchema]:
    """Add attributes to tables"""

    # if attribute.parent_node == table.id then add attribute to table.attributes
    for attribute in attributes:
        for table in tables:
            if attribute.parent_node == table.id:
                table.attributes.append(attribute)
                break

    return tables


def add_attribute_types_to_attributes(
    attributes: list[AttributeSchema],
    attribute_types: list[AttributeTypeSchema],
) -> list[AttributeSchema]:
    """Add attribute types to attributes"""

    # if attribute_type.parentNode == attribute.id then add attribute_type to attribute.type
    for attribute in attributes:
        for attribute_type in attribute_types:
            if attribute_type.parentNode == attribute.id:
                attribute.length = attribute_type.data.get("length", "")
                break

    return attributes
