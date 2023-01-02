from ninja.errors import HttpError

from .enums import NodeType
from .schema import AttributeSchema, AttributeTypeSchema, EdgeSchema, NodeSchema, TableSchema


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


def initialize_tables(data: list[NodeSchema]):

    tables, attributes, attribute_types = identify_nodes(data)
    attributes = add_attribute_types_to_attributes(attributes, attribute_types)
    tables = add_attributes_to_tables(tables, attributes)
    primary_key_check, table_name, error_message = check_primary_key(tables)
    if not primary_key_check:
        raise HttpError(400, f"Table {table_name} has {error_message}")

    return tables


def get_relationships(edges: list[EdgeSchema], tables: list[TableSchema]):
    # EdgeSchema: id, source, target, relationship
    # relationship: one-one, one-many, many-many
    # we need to match the relationship with the tables. We can do this by matching the source and target with the table id

    # if edge.source == table.id then add edge.relationship to table.relationship
    # one table can have multiple relationships
    for edge in edges:
        for table in tables:
            if edge.source == table.id:
                table.relationships.append({"target": edge.target, "relationship": edge.relationship})
                break

    return tables


def initialize_edges(data: list[EdgeSchema]):
    for edge in data:
        edge.relationship = edge.data.get("relationship")

    return data


# one table can not have multiple primary keys
def check_primary_key(tables: list[TableSchema]):
    """Check if a table has multiple primary keys or no primary key"""

    for table in tables:
        primary_key_count = 0
        for attribute in table.attributes:
            if attribute.constraints.primary_key:
                primary_key_count += 1

        if primary_key_count > 1:
            return False, table.name, "multiple primary keys"
        elif primary_key_count == 0:
            return False, table.name, "no primary key"

    return True, None, None


def generate_many_to_many_relationship(source_table, tables):
    # source table has relationships array with target table id and relationship type
    # get the target tables from the tables array
    target_tables = []
    for relationship in source_table.relationships:
        for table in tables:
            if relationship["target"] == table.id and relationship["relationship"] == "many-many":
                target_tables.append(table)
                break

    # for each target table, create a new table with the source table name and target table name
    sql_code = ""
    for target_table in target_tables:
        table_name = f"{source_table.name}_{target_table.name}"
        sql_code += f'CREATE TABLE "{table_name}" (\n'
        # get the source table primary key type
        for attribute in source_table.attributes:
            if attribute.constraints.primary_key:
                sql_code += f'"{source_table.name}_id" {attribute.type} NOT NULL,\n'
                source_primary_key = attribute.name
                break
        # get the target table primary key type
        for attribute in target_table.attributes:
            if attribute.constraints.primary_key:
                sql_code += f'"{target_table.name}_id" {attribute.type} NOT NULL,\n'
                target_primary_key = attribute.name
                break
        sql_code += f'PRIMARY KEY ("{source_table.name}_id", "{target_table.name}_id"),\n'
        # add foreign keys, use source and primary key names
        sql_code += (
            f'FOREIGN KEY ("{source_table.name}_id") REFERENCES "{source_table.name}" ("{source_primary_key}"),\n'
        )
        sql_code += (
            f'FOREIGN KEY ("{target_table.name}_id") REFERENCES "{target_table.name}" ("{target_primary_key}")\n'
        )

        sql_code += ");\n\n"

    return sql_code


def generate_one_to_one_relationship(source_table, tables):
    # source table has relationships array with target table id and relationship type
    # get the target tables from the tables array
    target_tables = []
    for relationship in source_table.relationships:
        for table in tables:
            if relationship["target"] == table.id and relationship["relationship"] == "one-one":
                target_tables.append(table)
                break

    # get the source tables primary key
    for attribute in source_table.attributes:
        if attribute.constraints.primary_key:
            source_primary_key = attribute.name
            break

    # add foreign keys to the source table
    sql_code = ""
    for target_table in target_tables:
        # first create a new column in the target table
        sql_code += f'ALTER TABLE "{target_table.name}" ADD "{source_table.name}_id" {attribute.type} UNIQUE;\n'
        sql_code += f'ALTER TABLE "{target_table.name}" ADD FOREIGN KEY ("{source_table.name}_id") REFERENCES "{source_table.name}" ("{source_primary_key}");\n'

    return sql_code


def generate_one_to_many_relationship(source_table, tables):
    # source table has relationships array with target table id and relationship type
    # get the target tables from the tables array
    target_tables = []
    for relationship in source_table.relationships:
        for table in tables:
            if relationship["target"] == table.id and relationship["relationship"] == "one-many":
                target_tables.append(table)
                break

    # get source table primary key
    for attribute in source_table.attributes:
        if attribute.constraints.primary_key:
            source_primary_key = attribute.name
            break

    # add foreign keys to the target tables
    sql_code = ""
    for target_table in target_tables:
        # first create a new column in the target table
        sql_code += f'ALTER TABLE "{target_table.name}" ADD "{source_table.name}_id" {attribute.type};\n'
        sql_code += f'ALTER TABLE "{target_table.name}" ADD FOREIGN KEY ("{source_table.name}_id") REFERENCES "{source_table.name}" ("{source_primary_key}");\n'

    return sql_code


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

    for table in tables:
        sql_code += generate_many_to_many_relationship(table, tables)
        sql_code += generate_one_to_one_relationship(table, tables)
        sql_code += generate_one_to_many_relationship(table, tables)

    # for table in tables:
    #     sql_code += generate_one_to_one_relationship(table, tables)

    # for table in tables:
    #     sql_code += generate_one_to_many_relationship(table, tables)

    return sql_code
