from .enums import NodeType
from .schema import AttributeSchema, NodeSchema, TableSchema


def identify_nodes(nodes: list[NodeSchema]) -> tuple[list[TableSchema], list[AttributeSchema]]:
    """Identify nodes and return them as a tuple of tables and attributes"""
    tables = []
    attributes = []

    for node in nodes:
        if node.type == NodeType.TABLE:
            tables.append(
                TableSchema(
                    id=node.id,
                    name=node.data["name"],
                )
            )
        elif node.type == NodeType.ATTRIBUTE:
            attributes.append(
                AttributeSchema(
                    id=node.id,
                    name=node.data["name"],
                    type=node.data["type"],
                    length=node.data["length"],
                    parent_node=node.parentNode,
                    constraints=node.data["constraints"],
                )
            )

    return tables, attributes


def add_attributes_to_tables(tables: list[TableSchema], attributes: list[AttributeSchema]) -> list[TableSchema]:
    """Add attributes to tables"""

    # if attribute.parent_node == table.id then add attribute to table.attributes
    for attribute in attributes:
        for table in tables:
            if attribute.parent_node == table.id:
                table.attributes.append(attribute)
                break

    return tables


def get_sql(data: list[NodeSchema]) -> list[TableSchema]:
    # parse the data
    nodes = []
    for node in data:
        node_test = NodeSchema.parse_obj(node)
        nodes.append(node_test)

    tables, attributes = identify_nodes(nodes)
    tables = add_attributes_to_tables(tables, attributes)

    return tables
