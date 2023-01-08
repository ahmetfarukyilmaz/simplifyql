from sql.schema import EdgeSchema, TableSchema


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
