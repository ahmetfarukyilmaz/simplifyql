from ninja.errors import HttpError

from .enums import NodeType
from .schema import AttributeSchema, AttributeTypeSchema, NodeSchema, TableSchema


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


def get_sql(data: list[NodeSchema]):

    tables, attributes, attribute_types = identify_nodes(data)
    attributes = add_attribute_types_to_attributes(attributes, attribute_types)
    tables = add_attributes_to_tables(tables, attributes)
    primary_key_check, table_name = check_primary_key(tables)
    if not primary_key_check:
        raise HttpError(400, f"Table {table_name} has multiple primary keys")

    return tables


# one table can not have multiple primary keys
def check_primary_key(tables: list[TableSchema]):
    """Check if a table has multiple primary keys"""

    for table in tables:
        primary_key_count = 0
        for attribute in table.attributes:
            if attribute.constraints.primary_key:
                primary_key_count += 1

        if primary_key_count > 1:
            return False, table.name

    return True, None


def generate_sql_code(tables):
    # Generate the SQL code for the tables
    sql_code = ""
    for table in tables:
        # Start the CREATE TABLE statement, but use double quotes for the table name
        sql_code += 'CREATE TABLE "{}" (\n'.format(table.name)

        # Generate the column definitions for the table
        columns = []
        indexes = []
        for attribute in table.attributes:
            # Get the column name and data type
            column_name = attribute.name
            column_type = attribute.type

            # Add the column definition to the list of columns, use quotes for the column name
            column = '"{}" {}'.format(column_name, column_type)

            # Check if the column has a length specified
            if attribute.length:
                column += "({})".format(attribute.length)

            # Check if the column has constraints specified
            if attribute.constraints is not None:
                # Check if the column is not nullable
                if attribute.constraints.nullable:
                    column += " NULL"
                else:
                    column += " NOT NULL"

                # Check if the column is a primary key
                if attribute.constraints.primary_key:
                    column += " PRIMARY KEY"

                # Check if the column is unique
                if attribute.constraints.unique:
                    column += " UNIQUE"

            # Add the column to the list of columns
            columns.append(column)

            # Check if the column is indexed
            if attribute.constraints.index:
                index_name = "{}_{}_index".format(table.name, column_name)
                # use double quotes for the table name
                index = 'CREATE INDEX "{}" ON "{}" ("{}");\n\n'.format(index_name, table.name, column_name)
                indexes.append(index)

        # Concatenate the list of columns with a comma and a newline
        column_defs = ",\n".join(columns)

        # Add the column definitions to the CREATE TABLE statement
        sql_code += "{}\n".format(column_defs)

        # End the CREATE TABLE statement
        sql_code += ");\n\n"

        # Add the indexes to the SQL code
        sql_code += "".join(indexes)

    return sql_code
