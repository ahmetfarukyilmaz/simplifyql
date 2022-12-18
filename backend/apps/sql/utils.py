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
                    length=node.data.get("length", ""),
                    parent_node=node.parentNode,
                    constraints=node.data.get("constraints", []),
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

    tables, attributes = identify_nodes(data)
    tables = add_attributes_to_tables(tables, attributes)

    return tables


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

            # Add the column definition to the list of columns
            column = "{} {}".format(column_name, column_type)

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
